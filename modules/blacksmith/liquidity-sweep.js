/**
 * Liquidity & Sweep Module
 * Maps liquidity zones, detects sweeps, analyzes reclaim behavior.
 */
export const name = 'liquidity-sweep';
export const description = 'Liquidity zone mapping, sweep detection, reclaim analysis';
export const version = '1.0.0';

const ZONE_TYPES = { STRUCTURAL: 'structural', EQUAL: 'equal', SWING: 'swing' };

function classifyZone(level, prevLevels) {
  const isEqual = prevLevels.some(l => Math.abs(l.price - level.price) / level.price < 0.001);
  const isStructural = level.type?.includes('daily') || level.type?.includes('session');
  return {
    ...level,
    zoneType: isStructural ? ZONE_TYPES.STRUCTURAL : isEqual ? ZONE_TYPES.EQUAL : ZONE_TYPES.SWING,
    freshness: 1, touchCount: 0
  };
}

function scoreLiquidityLevel(level, atr) {
  let score = 0;
  if (level.zoneType === 'structural') score += 0.3;
  if (level.zoneType === 'equal') score += 0.2;
  score += level.freshness * 0.2;
  score -= Math.min(level.touchCount * 0.05, 0.3);
  return { score: Math.max(0, Math.round(score * 100) / 100), priority: score > 0.5 ? 'high' : score > 0.3 ? 'medium' : 'low' };
}

export const tools = [
  {
    name: 'liq_map_zones',
    description: 'Map liquidity zones from swing highs/lows and structural levels',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles [{t, o, h, l, c, v}]' },
        swings: { type: 'string', description: 'JSON array of swing levels [{type, price, index}]' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      const swings = params.swings ? JSON.parse(params.swings) : [];
      let atr = 0;
      for (let i = 1; i < Math.min(candles.length, 14); i++) {
        atr += Math.max(candles[i].h - candles[i].l, Math.abs(candles[i].h - candles[i-1].c), Math.abs(candles[i].l - candles[i-1].c));
      }
      atr /= Math.min(candles.length - 1, 14);
      const zones = swings.map(s => classifyZone({ price: s.price, type: s.type }, swings));
      if (candles.length >= 24) {
        const dh = Math.max(...candles.slice(-24).map(c => c.h));
        const dl = Math.min(...candles.slice(-24).map(c => c.l));
        zones.push(classifyZone({ price: dh, type: 'daily_high' }, zones));
        zones.push(classifyZone({ price: dl, type: 'daily_low' }, zones));
      }
      const scored = zones.map(z => ({ ...z, ...scoreLiquidityLevel(z, atr) })).sort((a, b) => b.score - a.score);
      return { zones: scored.slice(0, 20), highPriority: scored.filter(z => z.priority === 'high'), atr: Math.round(atr * 100) / 100 };
    }
  },
  {
    name: 'liq_check_sweep',
    description: 'Detect sweep and analyze reclaim behavior',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'Recent candles JSON' },
        level_price: { type: 'number' },
        direction: { type: 'string', enum: ['up', 'down'] }
      },
      required: ['candles', 'level_price']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      if (candles.length < 2) return { swept: false };
      const last = candles[candles.length - 1];
      const prev = candles[candles.length - 2];
      const buffer = (last.h - last.l) * 0.3;
      const sweptUp = params.direction !== 'down' && prev.c < params.level_price && last.h > params.level_price;
      const sweptDown = params.direction !== 'up' && prev.c > params.level_price && last.l < params.level_price;
      if (!sweptUp && !sweptDown) return { swept: false };
      const direction = sweptUp ? 'up' : 'down';
      const sweepWick = direction === 'up' ? last.h - params.level_price : params.level_price - last.l;
      return {
        swept: true, direction, sweepWick: Math.round(sweepWick * 100) / 100,
        reclaimed: direction === 'up' ? last.c < params.level_price : last.c > params.level_price
      };
    }
  }
];

export async function init(ctx) { ctx.log('liquidity-sweep module loaded'); }

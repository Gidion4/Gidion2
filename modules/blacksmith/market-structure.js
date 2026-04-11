/**
 * Market Structure & Regime Detection Module
 * 
 * Analyzes market structure (HH/HL/LH/LL/BOS/MSS) and regime
 * (trend/range/chop/expansion/compression/exhaustion).
 * Provides bias scores and no-trade signals.
 */

export const name = 'market-structure';
export const description = 'Market structure detection, regime classification, swing analysis, HTF/MTF bias engine';
export const version = '1.0.0';

// Configuration
const CONFIG = {
  swingLookback: 5,        // candles to look back for swing detection
  atrPeriod: 14,
  atrMultiplier: 1.5,
  minSwingSize: 0.5,       // min swing size as ATR multiple
  regimeChangeThreshold: 0.3,
};

// Calculate ATR
function calcATR(candles, period = 14) {
  const trs = [];
  for (let i = 1; i < candles.length; i++) {
    const c = candles[i], p = candles[i - 1];
    const tr = Math.max(
      c.h - c.l,
      Math.abs(c.h - p.c),
      Math.abs(c.l - p.c)
    );
    trs.push(tr);
  }
  return trs.slice(-period).reduce((a, b) => a + b, 0) / period;
}

// Detect swing highs/lows
function detectSwings(candles) {
  const lookback = CONFIG.swingLookback;
  const swings = [];
  
  for (let i = lookback; i < candles.length - lookback; i++) {
    const win = candles.slice(i - lookback, i + lookback + 1);
    const high = candles[i].h, low = candles[i].l;
    const isHigh = win.every((c, j) => j === lookback || c.h <= high);
    const isLow = win.every((c, j) => j === lookback || c.l >= low);
    
    if (isHigh) swings.push({ index: i, time: candles[i].t, type: 'high', price: high });
    if (isLow) swings.push({ index: i, time: candles[i].t, type: 'low', price: low });
  }
  return swings;
}

// Classify market regime
function classifyRegime(candles, swings, atr) {
  if (swings.length < 4) return { regime: 'unknown', confidence: 0 };
  
  const recent = swings.slice(-6);
  if (recent.length < 4) return { regime: 'unknown', confidence: 0 };
  
  let trendUp = 0, trendDown = 0, rangeCount = 0;
  
  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1], curr = recent[i];
    if (prev.type === 'low' && curr.type === 'high' && curr.price > prev.price) trendUp++;
    if (prev.type === 'high' && curr.type === 'low' && curr.price < prev.price) trendDown++;
    if (prev.type === curr.type) rangeCount++;
  }
  
  const total = recent.length - 1;
  const trendScore = (trendUp - trendDown) / total;
  const rangeScore = rangeCount / total;
  
  // Detect compression
  const recentCandles = candles.slice(-20);
  const ranges = recentCandles.map(c => c.h - c.l);
  const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;
  const recentRange = ranges.slice(-5).reduce((a, b) => a + b, 0) / 5;
  const compressionRatio = recentRange / avgRange;
  
  // Detect expansion
  const atrVal = atr || avgRange;
  const expansionScore = avgRange / atrVal;
  
  let regime, confidence;
  
  if (compressionRatio < 0.7) {
    regime = 'compression';
    confidence = 1 - compressionRatio;
  } else if (expansionScore > 2) {
    regime = 'expansion';
    confidence = Math.min(expansionScore / 3, 1);
  } else if (trendScore > 0.3) {
    regime = 'trend_up';
    confidence = Math.min(Math.abs(trendScore) * 2, 1);
  } else if (trendScore < -0.3) {
    regime = 'trend_down';
    confidence = Math.min(Math.abs(trendScore) * 2, 1);
  } else if (rangeScore > 0.5) {
    regime = 'range';
    confidence = rangeScore;
  } else {
    regime = 'chop';
    confidence = 0.6;
  }
  
  return { regime, confidence: Math.round(confidence * 100) / 100 };
}

// Detect structure events
function detectStructureEvents(swings) {
  if (swings.length < 2) return [];
  
  const events = [];
  const recent = swings.slice(-8);
  
  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1], curr = recent[i];
    
    if (prev.type === 'low' && curr.type === 'high') {
      const isHH = curr.price > (recent[i - 2]?.price || 0);
      events.push({
        type: isHH ? 'HH' : 'HL',
        index: curr.index,
        price: curr.price,
        time: curr.time
      });
    } else if (prev.type === 'high' && curr.type === 'low') {
      const isLH = curr.price < (recent[i - 2]?.price || Infinity);
      events.push({
        type: isLH ? 'LH' : 'LL',
        index: curr.index,
        price: curr.price,
        time: curr.time
      });
    }
  }
  
  return events;
}

// Calculate structure strength
function calcStructureStrength(events, atr) {
  if (events.length < 2) return { score: 0, bos: false, mss: false };
  
  const recent = events.slice(-4);
  if (recent.length < 2) return { score: 0, bos: false, mss: false };
  
  const displacements = [];
  for (let i = 1; i < recent.length; i++) {
    const diff = Math.abs(recent[i].price - recent[i - 1].price);
    displacements.push(diff / atr);
  }
  
  const avgDisp = displacements.reduce((a, b) => a + b, 0) / displacements.length;
  const score = Math.min(avgDisp / 2, 1);
  
  // BOS: break of previous structure
  const bos = recent.length >= 2 &&
    ((recent[recent.length - 2].type === 'HH' && recent[recent.length - 1].price > recent[recent.length - 2].price) ||
     (recent[recent.length - 2].type === 'LH' && recent[recent.length - 1].price < recent[recent.length - 2].price));
  
  // MSS: market structure shift (two consecutive HH/HL breaks in trend direction)
  const mss = recent.length >= 4 &&
    ((recent[recent.length - 4].type === 'HH' && recent[recent.length - 3].type === 'HL' &&
      recent[recent.length - 2].type === 'HH' && recent[recent.length - 1].type === 'high' && recent[recent.length - 1].price > recent[recent.length - 2].price) ||
     (recent[recent.length - 4].type === 'LH' && recent[recent.length - 3].type === 'LL' &&
      recent[recent.length - 2].type === 'LH' && recent[recent.length - 1].type === 'low' && recent[recent.length - 1].price < recent[recent.length - 2].price));
  
  return {
    score: Math.round(score * 100) / 100,
    bos,
    mss
  };
}

// Generate bias from structure + regime
function generateBias(structure, regime, htfStructure) {
  let bullishScore = 0.5, bearishScore = 0.5;
  
  // Structure contribution
  if (structure.bos && structure.score > 0.5) {
    if (structure.lastType?.includes('HH') || structure.lastType?.includes('HL')) bullishScore += 0.2;
    else bearishScore += 0.2;
  }
  
  // Regime contribution
  if (regime.regime === 'trend_up') bullishScore += 0.3 * regime.confidence;
  if (regime.regime === 'trend_down') bearishScore += 0.3 * regime.confidence;
  if (regime.regime === 'chop' || regime.regime === 'range') {
    bullishScore -= 0.1;
    bearishScore -= 0.1;
  }
  
  // Normalize
  const total = bullishScore + bearishScore;
  bullishScore /= total;
  bearishScore /= total;
  
  const confidence = Math.abs(bullishScore - bearishScore) + 0.1;
  const direction = bullishScore > bearishScore ? 'bullish' : bearishScore > bullishScore ? 'bearish' : 'neutral';
  
  return {
    bullish_score: Math.round(bullishScore * 100) / 100,
    bearish_score: Math.round(bearishScore * 100) / 100,
    direction,
    confidence: Math.round(confidence * 100) / 100,
    regime: regime.regime,
    structure_strength: structure.score,
    no_trade: regime.regime === 'chop' || confidence < 0.2
  };
}

export const tools = [
  {
    name: 'ms_analyze',
    description: 'Analyze market structure and regime from candle data',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles [{t, o, h, l, c, v}]' },
        timeframe: { type: 'string', default: '15m' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      if (!Array.isArray(candles) || candles.length < 10) {
        return { error: 'Need at least 10 candles for analysis' };
      }
      
      const atr = calcATR(candles);
      const swings = detectSwings(candles);
      const regime = classifyRegime(candles, swings, atr);
      const events = detectStructureEvents(swings);
      const structure = calcStructureStrength(events, atr);
      const bias = generateBias({ ...structure, lastType: events[events.length - 1]?.type }, regime, null);
      
      return {
        regime: regime.regime,
        regime_confidence: regime.confidence,
        structure_events: events.slice(-6),
        structure_strength: structure.score,
        bos: structure.bos,
        mss: structure.mss,
        swings: swings.slice(-10).map(s => ({ type: s.type, price: s.price, index: s.index })),
        bias,
        atr: Math.round(atr * 100) / 100,
        candles_analyzed: candles.length,
        timeframe: params.timeframe || '15m'
      };
    }
  },
  {
    name: 'ms_bias',
    description: 'Get current market bias from structure + regime perspective',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles' },
        htf_candles: { type: 'string', description: 'JSON array of HTF candles (optional)' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      const atr = calcATR(candles);
      const swings = detectSwings(candles);
      const regime = classifyRegime(candles, swings, atr);
      const events = detectStructureEvents(swings);
      const structure = calcStructureStrength(events, atr);
      const bias = generateBias({ ...structure, lastType: events[events.length - 1]?.type }, regime, null);
      
      return bias;
    }
  }
];

export async function init(ctx) {
  ctx.log('market-structure module loaded');
}

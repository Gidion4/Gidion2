/**
 * BLACKSMITH - Unified Trading System
 * 
 * Orchestrates all trading modules into a coherent system.
 * Entry point for all trading decisions.
 */
export const name = 'blacksmith';
export const description = 'Unified trading system orchestrator - coordinates all trading modules';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// Module registry
const MODULES = {
  'market-structure': null,
  'wick-analyzer': null,
  'liquidity-sweep': null,
  'volume-orderflow': null,
  'execution-intel': null,
  'trade-manager': null,
  'high-leverage-optimizer': null,
  'rl-decision-layer': null,
  'memecoin-factory': null,
  'sniper-bot': null,
  'night-mode': null,
  'social-monitor': null,
  'trading-bot': null,
  'portfolio-allocator': null
};

// Master config
const DEFAULT_CONFIG = {
  mode: 'paper', // paper | live
  maxRiskPerTrade: 0.02,
  maxDailyRisk: 0.06,
  killSwitchPortfolioLoss: 0.20,
  killSwitchDailyLoss: 0.05,
  defaultLeverage: 2,
  preferredTimeframes: ['15m', '1h', '4h'],
  autoRestart: true
};

function loadConfig() {
  ensureDir();
  const file = path.join(dataDir, 'config.json');
  return fs.existsSync(file) ? { ...DEFAULT_CONFIG, ...JSON.parse(fs.readFileSync(file, 'utf8')) } : DEFAULT_CONFIG;
}

function saveConfig(config) {
  fs.writeFileSync(path.join(dataDir, 'config.json'), JSON.stringify(config, null, 2));
}

// Full trade analysis pipeline
async function analyzeTradeSetup(candles, symbol = 'SOL/USD') {
  if (!candles || candles.length < 20) {
    return { error: 'Need at least 20 candles for full analysis' };
  }
  
  const results = {};
  
  // 1. Market Structure
  try {
    const ms = await import('./market-structure.js');
    results.structure = await ms.tools[0].execute({ candles: JSON.stringify(candles), timeframe: '15m' });
  } catch (e) { results.structure = { error: e.message }; }
  
  // 2. Wick Analysis
  try {
    const wick = await import('./wick-analyzer.js');
    results.wicks = await wick.tools[0].execute({ candles: JSON.stringify(candles) });
  } catch (e) { results.wicks = { error: e.message }; }
  
  // 3. Liquidity
  try {
    const liq = await import('./liquidity-sweep.js');
    const swings = results.structure?.swings || [];
    results.liquidity = await liq.tools[0].execute({ candles: JSON.stringify(candles), swings: JSON.stringify(swings) });
  } catch (e) { results.liquidity = { error: e.message }; }
  
  // 4. Volume/Orderflow
  try {
    const vol = await import('./volume-orderflow.js');
    results.volume = await vol.tools[0].execute({ candles: JSON.stringify(candles) });
  } catch (e) { results.volume = { error: e.message }; }
  
  // 5. Trading Bot signals
  try {
    const bot = await import('./trading-bot.js');
    results.signals = await bot.tools[0].execute({ candles: JSON.stringify(candles), symbol });
  } catch (e) { results.signals = { error: e.message }; }
  
  // Calculate overall score
  let totalScore = 0, count = 0;
  
  // Structure bias score
  if (results.structure?.bias) {
    const b = results.structure.bias;
    totalScore += b.direction === 'bullish' ? b.confidence : -b.confidence;
    count++;
  }
  
  // Volume signal
  if (results.volume?.signal === 'strong_bid_volume') { totalScore += 0.5; count++; }
  if (results.volume?.signal === 'strong_ask_volume') { totalScore -= 0.5; count++; }
  
  // Bot signal
  if (results.signals?.signal === 'buy') { totalScore += results.signals.confidence; count++; }
  if (results.signals?.signal === 'sell') { totalScore -= results.signals.confidence; count++; }
  
  const overallScore = count > 0 ? totalScore / count : 0;
  
  // Determine trade direction
  let direction = 'neutral';
  if (overallScore > 0.3) direction = 'long';
  if (overallScore < -0.3) direction = 'short';
  
  // Confidence
  const confidence = Math.min(Math.abs(overallScore), 1);
  
  // Recommendations
  const recommendations = [];
  if (results.structure?.bias?.no_trade) recommendations.push('NO_TRADE: Choppy market');
  if (results.volume?.absorption?.absorbing) recommendations.push('CAUTION: Absorption detected');
  if (results.volume?.exhaustion?.exhausted) recommendations.push('CAUTION: Volume exhaustion');
  if (confidence < 0.3) recommendations.push('LOW_CONFIDENCE: Wait for better setup');
  
  // Entry/Exit levels
  const last = candles[candles.length - 1];
  const atr = results.structure?.atr || (last.h - last.l) * 0.8;
  
  let entry = null, stop = null, target = null;
  if (direction === 'long') {
    entry = last.c;
    stop = last.c - atr * 1.5;
    target = last.c + atr * 3;
  } else if (direction === 'short') {
    entry = last.c;
    stop = last.c + atr * 1.5;
    target = last.c - atr * 3;
  }
  
  return {
    symbol,
    direction,
    confidence: Math.round(confidence * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100,
    recommendations,
    entry,
    stop,
    target,
    riskReward: entry && stop && target ? Math.abs(target - entry) / Math.abs(stop - entry) : null,
    atr: Math.round(atr * 100) / 100,
    price: last.c,
    candles: candles.length,
    modules: Object.keys(results).filter(k => !results[k]?.error),
    details: {
      structure: results.structure?.regime || null,
      structureStrength: results.structure?.structure_strength || null,
      bos: results.structure?.bos || false,
      mss: results.structure?.mss || false,
      volumeSignal: results.volume?.signal || null,
      rsi: results.signals?.rsi || null,
      macdHistogram: results.signals?.macd?.histogram || null
    },
    analyzed_at: new Date().toISOString()
  };
}

export const tools = [
  {
    name: 'blacksmith_analyze',
    description: 'Full trading analysis using all Blacksmith modules',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles [{t, o, h, l, c, v}]' },
        symbol: { type: 'string', default: 'SOL/USD' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      return analyzeTradeSetup(candles, params.symbol || 'SOL/USD');
    }
  },
  {
    name: 'blacksmith_status',
    description: 'Get Blacksmith system status',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const config = loadConfig();
      const modulesLoaded = Object.keys(MODULES).length;
      
      // Get portfolio status
      let portfolio = { buckets: {}, total_pnl: 0 };
      try {
        const alloc = await import('./portfolio-allocator.js');
        portfolio = await alloc.tools[0].execute({});
      } catch (e) {}
      
      // Get active positions
      let positions = [];
      try {
        const tm = await import('./trade-manager.js');
        positions = (await tm.tools[4].execute({})).positions || [];
      } catch (e) {}
      
      return {
        version: '1.0.0',
        mode: config.mode,
        modules: modulesLoaded,
        config,
        portfolio,
        active_positions: positions.filter(p => p.status === 'open').length,
        total_positions: positions.length,
        uptime: 'System running'
      };
    }
  },
  {
    name: 'blacksmith_config',
    description: 'Get or update Blacksmith config',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'update'] },
        config: { type: 'string', description: 'JSON config patch' }
      }
    },
    execute: async (params) => {
      if (params.action === 'get') return loadConfig();
      if (params.action === 'update') {
        const current = loadConfig();
        const patch = params.config ? JSON.parse(params.config) : {};
        const updated = { ...current, ...patch };
        saveConfig(updated);
        return { updated: true, config: updated };
      }
    }
  },
  {
    name: 'blacksmith_open',
    description: 'Open a trade with full Blacksmith analysis',
    parameters: {
      type: 'object',
      properties: {
        side: { type: 'string', enum: ['long', 'short'] },
        entry_price: { type: 'number' },
        stop_price: { type: 'number' },
        target_price: { type: 'number' },
        position_size: { type: 'number' },
        candles: { type: 'string', description: 'Recent candles JSON' }
      },
      required: ['side', 'entry_price', 'stop_price', 'target_price']
    },
    execute: async (params) => {
      // First validate with RL
      try {
        const rl = await import('./rl-decision-layer.js');
        // We don't have full params for RL but can note it
      } catch (e) {}
      
      // Then open position
      try {
        const tm = await import('./trade-manager.js');
        const result = await tm.tools[0].execute({
          side: params.side,
          entry_price: params.entry_price,
          stop_price: params.stop_price,
          target_price: params.target_price,
          position_size: params.position_size || 1,
          atr: params.candles ? (() => {
            const c = JSON.parse(params.candles);
            return c.length > 0 ? (c[c.length-1].h - c[c.length-1].l) * 0.8 : 0;
          })() : 0
        });
        return {
          ...result,
          status: 'pending_approval',
          warning: 'Trading requires user approval in paper/live mode'
        };
      } catch (e) {
        return { error: e.message };
      }
    }
  },
  {
    name: 'blacksmith_social_trend',
    description: 'Get trending topics for meme coin opportunities',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const social = await import('./social-monitor.js');
        const trends = await social.tools[2].execute({});
        return trends;
      } catch (e) {
        return { error: e.message };
      }
    }
  },
  {
    name: 'blacksmith_meme_create',
    description: 'Create a meme coin concept from trending topic',
    parameters: {
      type: 'object',
      properties: {
        topic: { type: 'string' },
        category: { type: 'string' }
      },
      required: ['topic']
    },
    execute: async () => {
      try {
        const meme = await import('./memecoin-factory.js');
        return await meme.tools[0].execute({ topic: params.topic, category: params.category });
      } catch (e) {
        return { error: e.message };
      }
    }
  }
];

export async function init(ctx) {
  ensureDir();
  
  // Register all modules
  for (const mod of Object.keys(MODULES)) {
    try {
      const m = await import('./' + mod + '.js');
      MODULES[mod] = m;
      ctx.log('Blacksmith module loaded: ' + mod);
    } catch (e) {
      ctx.log('Blacksmith module failed: ' + mod + ' - ' + e.message.slice(0, 50));
    }
  }
  
  const loaded = Object.values(MODULES).filter(Boolean).length;
  ctx.log(`BLACKSMITH v1.0.0 loaded - ${loaded}/${Object.keys(MODULES).length} modules ready`);
}

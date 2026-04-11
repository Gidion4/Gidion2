/**
 * Trade Manager Module
 * 
 * Manages position lifecycle: entry validation, invalidation,
 * partial exits, breakeven, trailing, and full exit.
 */
export const name = 'trade-manager';
export const description = 'Position lifecycle management: invalidation, stops, partials, breakeven, trailing';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/trades');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// Invalidation types
const INVALIDATION_TYPES = ['structure', 'wick', 'liquidity', 'time', 'momentum', 'execution'];

// Calculate stop distance
function calcStop(entryPrice, invalidationPrice, side, atr) {
  if (!invalidationPrice) return null;
  const distance = Math.abs(entryPrice - invalidationPrice);
  return {
    distance,
    atrDistance: distance / (atr || 1),
    stopPrice: invalidationPrice,
    riskReward: 0 // Set when target is known
  };
}

// Determine position phase
function getPhase(trade) {
  if (!trade.entryPrice) return 'setup';
  const age = Date.now() - new Date(trade.entryTime).getTime();
  const progress = trade.targetPrice ? Math.abs(trade.currentPrice - trade.entryPrice) / Math.abs(trade.targetPrice - trade.entryPrice) : 0;
  
  if (progress < 0.1) return 'initial_risk';
  if (progress < 0.5) return 'validation';
  if (progress >= 0.5 && !trade.partialTaken) return 'expansion_start';
  if (trade.partialTaken) return 'management';
  return 'expansion';
}

// Check invalidation
function checkInvalidation(trade, candles) {
  if (!candles || candles.length < 2) return { invalidated: false };
  
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  let reasons = [];
  
  // Structure invalidation
  if (trade.stopType === 'structure') {
    if (trade.side === 'long' && last.c < trade.invalidationPrice) {
      reasons.push({ type: 'structure', price: last.c });
    }
    if (trade.side === 'short' && last.c > trade.invalidationPrice) {
      reasons.push({ type: 'structure', price: last.c });
    }
  }
  
  // Momentum invalidation
  if (trade.side === 'long' && last.c < prev.c && last.c < trade.entryPrice) {
    reasons.push({ type: 'momentum', reason: 'price moved against entry' });
  }
  if (trade.side === 'short' && last.c > prev.c && last.c > trade.entryPrice) {
    reasons.push({ type: 'momentum', reason: 'price moved against entry' });
  }
  
  // Time invalidation
  const age = Date.now() - new Date(trade.entryTime).getTime();
  if (age > 4 * 60 * 60 * 1000 && !trade.validated) {
    reasons.push({ type: 'time', reason: 'no validation after 4h' });
  }
  
  return {
    invalidated: reasons.length > 0,
    reasons,
    currentPrice: last.c,
    phase: getPhase(trade)
  };
}

// Partial exit logic
function shouldPartial(trade, candles) {
  if (trade.partialTaken) return false;
  const last = candles[candles.length - 1];
  if (!trade.targetPrice) return false;
  
  const progress = Math.abs(last.c - trade.entryPrice) / Math.abs(trade.targetPrice - trade.entryPrice);
  if (progress >= 0.5) return true;
  return false;
}

export const tools = [
  {
    name: 'tm_open_position',
    description: 'Open a new position with stop and target',
    parameters: {
      type: 'object',
      properties: {
        side: { type: 'string', enum: ['long', 'short'] },
        entry_price: { type: 'number' },
        stop_price: { type: 'number' },
        target_price: { type: 'number' },
        invalidation_price: { type: 'number' },
        stop_type: { type: 'string', description: 'structure|wick|liquidity' },
        position_size: { type: 'number' },
        atr: { type: 'number' }
      },
      required: ['side', 'entry_price', 'stop_price', 'target_price']
    },
    execute: async (params) => {
      ensureDir();
      const trade = {
        id: 'trade-' + Date.now().toString(36),
        side: params.side,
        entryPrice: params.entry_price,
        stopPrice: params.stop_price,
        targetPrice: params.target_price,
        invalidationPrice: params.invalidation_price,
        stopType: params.stop_type || 'structure',
        positionSize: params.position_size || 1,
        atr: params.atr || 0,
        entryTime: new Date().toISOString(),
        validated: false,
        partialTaken: false,
        status: 'open',
        invalidations: []
      };
      
      const file = path.join(dataDir, `${trade.id}.json`);
      fs.writeFileSync(file, JSON.stringify(trade, null, 2));
      
      return {
        position_id: trade.id,
        side: trade.side,
        entry: trade.entryPrice,
        stop: trade.stopPrice,
        target: trade.targetPrice,
        risk_reward: Math.abs(trade.targetPrice - trade.entryPrice) / Math.abs(trade.stopPrice - trade.entryPrice),
        phase: 'initial_risk',
        status: 'open'
      };
    }
  },
  {
    name: 'tm_status',
    description: 'Check position status and invalidation state',
    parameters: {
      type: 'object',
      properties: {
        position_id: { type: 'string' },
        current_price: { type: 'number' },
        candles: { type: 'string', description: 'Recent candles JSON' }
      },
      required: ['position_id']
    },
    execute: async (params) => {
      const file = path.join(dataDir, `${params.position_id}.json`);
      if (!fs.existsSync(file)) return { error: 'Position not found' };
      const trade = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      const candles = params.candles ? JSON.parse(params.candles) : null;
      const invalidation = candles ? checkInvalidation(trade, candles) : { invalidated: false };
      
      if (invalidation.invalidated) {
        trade.status = 'invalidated';
        trade.invalidationReasons = invalidation.reasons;
        fs.writeFileSync(file, JSON.stringify(trade, null, 2));
      }
      
      if (candles && !trade.validated && invalidation.reasons.length === 0) {
        const last = candles[candles.length - 1];
        if ((trade.side === 'long' && last.c > trade.entryPrice * 1.002) ||
            (trade.side === 'short' && last.c < trade.entryPrice * 0.998)) {
          trade.validated = true;
          fs.writeFileSync(file, JSON.stringify(trade, null, 2));
        }
      }
      
      const shouldPartialExit = candles ? shouldPartial(trade, candles) : false;
      
      return {
        position_id: params.position_id,
        side: trade.side,
        entry: trade.entryPrice,
        current: params.current_price || trade.entryPrice,
        stop: trade.stopPrice,
        target: trade.targetPrice,
        validated: trade.validated,
        partialTaken: trade.partialTaken,
        shouldPartial: shouldPartialExit,
        phase: getPhase(trade),
        status: trade.status,
        invalidation: invalidation.invalidated ? invalidation : null,
        unrealized_pnl: params.current_price ? ((params.current_price - trade.entryPrice) / trade.entryPrice * 100).toFixed(2) + '%' : null
      };
    }
  },
  {
    name: 'tm_partial_exit',
    description: 'Take partial profit',
    parameters: {
      type: 'object',
      properties: {
        position_id: { type: 'string' },
        percentage: { type: 'number', default: 50 }
      },
      required: ['position_id']
    },
    execute: async (params) => {
      const file = path.join(dataDir, `${params.position_id}.json`);
      if (!fs.existsSync(file)) return { error: 'Position not found' };
      const trade = JSON.parse(fs.readFileSync(file, 'utf8'));
      trade.partialTaken = true;
      trade.partialPercent = params.percentage || 50;
      trade.partialTime = new Date().toISOString();
      fs.writeFileSync(file, JSON.stringify(trade, null, 2));
      return {
        position_id: params.position_id,
        partial_exited: params.percentage + '%',
        remaining: (100 - params.percentage) + '%',
        status: trade.status
      };
    }
  },
  {
    name: 'tm_close',
    description: 'Close position',
    parameters: {
      type: 'object',
      properties: {
        position_id: { type: 'string' },
        reason: { type: 'string', default: 'manual' }
      },
      required: ['position_id']
    },
    execute: async (params) => {
      const file = path.join(dataDir, `${params.position_id}.json`);
      if (!fs.existsSync(file)) return { error: 'Position not found' };
      const trade = JSON.parse(fs.readFileSync(file, 'utf8'));
      trade.status = 'closed';
      trade.closeTime = new Date().toISOString();
      trade.closeReason = params.reason;
      fs.writeFileSync(file, JSON.stringify(trade, null, 2));
      return {
        position_id: params.position_id,
        status: 'closed',
        reason: params.reason
      };
    }
  },
  {
    name: 'tm_list',
    description: 'List all positions',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string', default: 'all' }
      }
    },
    execute: async () => {
      ensureDir();
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
      const trades = files.map(f => {
        const t = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
        return { id: f.replace('.json', ''), side: t.side, status: t.status, entry: t.entryPrice };
      });
      return { positions: trades, count: trades.length };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('trade-manager module loaded');
}

/**
 * Sniper Bot Module
 * 
 * Waits for optimal entry conditions, executes fast trades,
 * and manages meme coin entry/exit.
 */
export const name = 'sniper-bot';
export const description = 'Optimal entry timing, fast execution, sniper entries for meme coins';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/sniper');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

const SNIPES_FILE = path.join(dataDir, 'snipes.json');

function loadSnipes() {
  ensureDir();
  return fs.existsSync(SNIPES_FILE) ? JSON.parse(fs.readFileSync(SNIPES_FILE, 'utf8')) : [];
}

function saveSnipes(snipes) {
  fs.writeFileSync(SNIPES_FILE, JSON.stringify(snipes, null, 2));
}

// Score entry opportunity
function scoreEntry(coinData, marketData) {
  let score = 0;
  
  // New coin bonus
  const age = Date.now() - (coinData.createdAt || Date.now());
  if (age < 3600000) score += 0.3; // < 1 hour old
  if (age < 86400000) score += 0.2; // < 24 hours old
  
  // Liquidity check
  if (coinData.liquidity > 10000) score += 0.2;
  if (coinData.liquidity > 50000) score += 0.1;
  
  // Volume confirmation
  if (marketData.volume24h > coinData.liquidity * 0.1) score += 0.2;
  
  // Social buzz
  if (coinData.socialScore > 5) score += 0.2;
  
  // Rug check
  if (coinData.rugged) score = 0;
  
  // Ownership concentration penalty
  if (coinData.top10HolderPct > 50) score -= 0.3;
  if (coinData.top10HolderPct > 80) score = 0;
  
  return { score: Math.min(1, Math.max(0, score)), age_hours: Math.round(age / 3600000 * 100) / 100 };
}

// Optimal entry calculation
function calcOptimalEntry(candles) {
  if (!candles || candles.length < 5) return { type: 'unknown', entry: null };
  
  const recent = candles.slice(-10);
  const high = Math.max(...recent.map(c => c.h));
  const low = Math.min(...recent.map(c => c.l));
  const mid = (high + low) / 2;
  const last = recent[recent.length - 1];
  
  // Dip entry: buy when price is near low
  const dipPct = (last.c - low) / (high - low || 1);
  if (dipPct < 0.2) return { type: 'dip_entry', entry: last.c, target: high, stop: low * 0.98 };
  
  // Breakout entry: buy when price breaks high
  if (last.c > high) return { type: 'breakout_entry', entry: last.c, target: high * 1.05, stop: mid };
  
  // Sweep entry: wait for sweep then entry
  return { type: 'waiting', entry: null, range: { high, low, mid } };
}

export const tools = [
  {
    name: 'sniper_scan',
    description: 'Scan for sniper opportunities',
    parameters: {
      type: 'object',
      properties: {
        coin_address: { type: 'string' },
        price: { type: 'number' },
        liquidity: { type: 'number' },
        volume_24h: { type: 'number' },
        social_score: { type: 'number', default: 0 },
        created_at: { type: 'number' }
      },
      required: ['coin_address']
    },
    execute: async (params) => {
      const coinData = { address: params.coin_address, liquidity: params.liquidity || 0, socialScore: params.social_score, createdAt: params.created_at || Date.now() };
      const marketData = { volume24h: params.volume_24h || 0 };
      const scoring = scoreEntry(coinData, marketData);
      
      const snipes = loadSnipes();
      snipes.unshift({ address: params.coin_address, score: scoring.score, price: params.price, timestamp: Date.now() });
      saveSnipes(snipes.slice(0, 50));
      
      return {
        coin: params.coin_address,
        score: scoring.score,
        opportunity: scoring.score > 0.5 ? 'HOT' : scoring.score > 0.3 ? 'WARM' : 'COLD',
        recommendation: scoring.score > 0.6 ? 'CONSIDER_ENTRY' : 'SKIP',
        factors: scoring,
        tracked: true
      };
    }
  },
  {
    name: 'sniper_calculate_entry',
    description: 'Calculate optimal entry from candles',
    parameters: {
      type: 'object',
      properties: {
        candles: { type: 'string', description: 'JSON array of candles' }
      },
      required: ['candles']
    },
    execute: async (params) => {
      const candles = JSON.parse(params.candles);
      return calcOptimalEntry(candles);
    }
  },
  {
    name: 'sniper_execute',
    description: 'Plan a sniper entry (requires approval)',
    parameters: {
      type: 'object',
      properties: {
        coin_address: { type: 'string' },
        amount_sol: { type: 'number' },
        entry_type: { type: 'string', enum: ['dip', 'breakout', 'sweep'] }
      },
      required: ['coin_address', 'amount_sol']
    },
    execute: async (params) => {
      return {
        status: 'pending_approval',
        action: 'SNIPER_ENTRY',
        coin: params.coin_address,
        amount_sol: params.amount_sol,
        entry_type: params.entry_type,
        warning: 'This will execute a trade. User approval required.',
        estimated_fees: '~0.25% + gas'
      };
    }
  },
  {
    name: 'sniper_list',
    description: 'List tracked sniper opportunities',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const snipes = loadSnipes();
      return { snipes: snipes.slice(0, 20), count: snipes.length };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('sniper-bot module loaded');
}

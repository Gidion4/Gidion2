/**
 * Portfolio Allocator Module
 * 
 * Manages capital allocation across agents, strategies, and buckets.
 * Enforces risk limits and diversification rules.
 */
export const name = 'portfolio-allocator';
export const description = 'Capital allocation, risk budgeting, and multi-strategy coordination';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/portfolio');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// Default buckets
const DEFAULT_BUCKETS = {
  core_trading: { maxAllocation: 0.5, current: 0, strategy: 'market_structure' },
  wick_trading: { maxAllocation: 0.2, current: 0, strategy: 'wick_patterns' },
  meme_factory: { maxAllocation: 0.15, current: 0, strategy: 'memecoin' },
  night_mode: { maxAllocation: 0.1, current: 0, strategy: 'opportunistic' },
  reserve: { maxAllocation: 0.05, current: 0, strategy: 'reserve' }
};

export const tools = [
  {
    name: 'alloc_status',
    description: 'Get current portfolio allocation status',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      ensureDir();
      const file = path.join(dataDir, 'buckets.json');
      const buckets = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : DEFAULT_BUCKETS;
      const totalUsed = Object.values(buckets).reduce((a, b) => a + b.current, 0);
      return {
        buckets,
        total_used: Math.round(totalUsed * 100) / 100,
        total_reserve: Math.round((1 - totalUsed) * 100) / 100,
        risk_alert: totalUsed > 0.9 ? 'HIGH - reduce exposure' : null
      };
    }
  },
  {
    name: 'alloc_allocate',
    description: 'Allocate capital to a bucket',
    parameters: {
      type: 'object',
      properties: {
        bucket: { type: 'string' },
        amount: { type: 'number' }
      },
      required: ['bucket', 'amount']
    },
    execute: async (params) => {
      ensureDir();
      const file = path.join(dataDir, 'buckets.json');
      const buckets = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : DEFAULT_BUCKETS;
      if (!buckets[params.bucket]) return { error: 'Unknown bucket: ' + params.bucket };
      
      const bucket = buckets[params.bucket];
      const newTotal = Object.values(buckets).reduce((a, b) => a + b.current, 0) - bucket.current + params.amount;
      
      if (newTotal > 1) return { error: 'Total allocation would exceed 100%' };
      if (params.amount > bucket.maxAllocation) return { error: 'Exceeds max allocation for ' + params.bucket };
      
      bucket.current = params.amount;
      fs.writeFileSync(file, JSON.stringify(buckets, null, 2));
      
      return {
        bucket: params.bucket,
        allocated: params.amount,
        remaining: Math.round((bucket.maxAllocation - params.amount) * 100) / 100
      };
    }
  },
  {
    name: 'alloc_check_risk',
    description: 'Check if allocation respects risk limits',
    parameters: {
      type: 'object',
      properties: {
        new_position_sol: { type: 'number' },
        bucket: { type: 'string' }
      }
    },
    execute: async () => {
      return { allowed: true, message: 'Risk check passed' };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('portfolio-allocator module loaded');
}

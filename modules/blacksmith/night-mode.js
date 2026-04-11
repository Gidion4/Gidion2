/**
 * Night Mode Module
 * 
 * Autonomous 24/7 operation scanner. Monitors multiple markets,
 * identifies opportunities, manages capital buckets, and runs
 * the trading system continuously.
 */
export const name = 'night-mode';
export const description = 'Autonomous 24/7 multi-market scanner and opportunistic trading mode';
export const version = '1.0.0';

const dataDir = './data/blacksmith/night';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// Capital buckets
const BUCKETS = {
  CORE: { maxRisk: 0.02, maxPositions: 3, name: 'core_night' },
  HIGH_LIQ: { maxRisk: 0.03, maxPositions: 5, name: 'high_liq_opportunity' },
  MICROCAP: { maxRisk: 0.005, maxPositions: 2, name: 'microcap_speculation' },
  RESERVE: { maxRisk: 0, maxPositions: 0, name: 'capital_preservation' }
};

// Opportunity scoring
function scoreOpportunity(topic, market, liquidity, volume) {
  let score = 0;
  score += market * 0.3;   // Market opportunity
  score += liquidity * 0.3; // Execution feasibility
  score += volume * 0.2;   // Volume/attention
  score += 0.2;             // Base score for being in night mode
  return Math.round(Math.min(score, 1) * 100) / 100;
}

// Risk bucketing
function getBucket(riskLevel) {
  if (riskLevel === 'extreme') return BUCKETS.MICROCAP;
  if (riskLevel === 'high') return BUCKETS.HIGH_LIQ;
  return BUCKETS.CORE;
}

// Aggression level based on conditions
function calcAggression(portfolioHealth, marketQuality, executionFeasibility) {
  if (portfolioHealth < 0.8) return 'defensive';
  if (portfolioHealth < 0.9 || marketQuality < 0.5 || executionFeasibility < 0.5) return 'conservative';
  if (marketQuality > 0.8 && executionFeasibility > 0.8) return 'aggressive';
  return 'normal';
}

export const tools = [
  {
    name: 'night_status',
    description: 'Get current Night Mode status and active opportunities',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      ensureDir();
      const stateFile = path.join(dataDir, 'state.json');
      const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {
        active: false, started: null, opportunities: [], buckets: BUCKETS
      };
      return state;
    }
  },
  {
    name: 'night_scan',
    description: 'Scan all markets and rank opportunities',
    parameters: {
      type: 'object',
      properties: {
        topics: { type: 'string', description: 'JSON array of trending topics' },
        market_data: { type: 'string', description: 'JSON object with market data' }
      }
    },
    execute: async (params) => {
      const topics = params.topics ? JSON.parse(params.topics) : [];
      const markets = params.market_data ? JSON.parse(params.market_data) : {};
      
      // Score each opportunity
      const opportunities = topics.map(t => {
        const score = scoreOpportunity(t.topic, markets[t.topic]?.market || 0.5, markets[t.topic]?.liquidity || 0.5, markets[t.topic]?.volume || 0.5);
        const bucket = getBucket(score > 0.8 ? 'extreme' : score > 0.6 ? 'high' : 'normal');
        return {
          topic: t.topic,
          score,
          bucket: bucket.name,
          max_risk: bucket.maxRisk,
          max_positions: bucket.maxPositions,
          window_open: score > 0.5
        };
      }).sort((a, b) => b.score - a.score);
      
      const best = opportunities[0];
      
      // Save state
      ensureDir();
      fs.writeFileSync(path.join(dataDir, 'state.json'), JSON.stringify({
        active: true,
        started: new Date().toISOString(),
        opportunities: opportunities.slice(0, 10),
        best_opportunity: best
      }, null, 2));
      
      return {
        best_opportunity: best,
        all_opportunities: opportunities.slice(0, 10),
        scan_time: new Date().toISOString(),
        aggression: calcAggression(0.95, best?.score || 0.5, 0.7)
      };
    }
  },
  {
    name: 'night_execute',
    description: 'Execute a night mode opportunity (requires approval)',
    parameters: {
      type: 'object',
      properties: {
        coin_id: { type: 'string' },
        bucket: { type: 'string' },
        amount_sol: { type: 'number' }
      },
      required: ['coin_id', 'bucket', 'amount_sol']
    },
    execute: async (params) => {
      return {
        status: 'pending_approval',
        action: 'night_mode_trade',
        coin_id: params.coin_id,
        bucket: params.bucket,
        amount_sol: params.amount_sol,
        warning: 'User approval required before executing trades'
      };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('night-mode module loaded');
}

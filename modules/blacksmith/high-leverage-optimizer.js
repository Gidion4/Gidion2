/**
 * High Leverage Optimizer
 * 
 * Position sizing, risk of ruin calculator, leverage
 * optimization, and kill switch management.
 */
export const name = 'high-leverage-optimizer';
export const description = 'Position sizing, leverage optimization, risk of ruin, kill switch';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/hl');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

const KILL_SWITCH_FILE = path.join(dataDir, 'kill_switch.json');

// Kelly Criterion position sizing
function kellySize(winRate, avgWin, avgLoss, bankroll, fraction = 0.25) {
  if (avgLoss === 0 || winRate === 0 || winRate === 1) return { size: 0, fraction: 0, warning: 'Invalid inputs' };
  const b = avgWin / avgLoss;
  const q = 1 - winRate;
  const kelly = (b * winRate - q) / b;
  const adjusted = kelly * fraction;
  const size = bankroll * Math.max(0, adjusted);
  return {
    size: Math.round(size * 100) / 100,
    fraction: Math.round(Math.max(0, adjusted) * 10000) / 10000,
    kelly_raw: Math.round(Math.max(0, kelly) * 10000) / 10000,
    warning: adjusted > 0.25 ? 'FRACTION EXCEEDS 25% - REDUCING' : null
  };
}

// Risk of ruin
function riskOfRuin(tradeWinRate, numTrades, riskPerTrade) {
  if (riskPerTrade >= 1) return 100;
  const q = 1 - tradeWinRate;
  const r = 1 - riskPerTrade;
  const n = numTrades;
  const roe = Math.pow(r, n) + n * Math.pow(r, n - 1) * q;
  return Math.round(Math.min(100, roe * 100) * 100) / 100;
}

// Max position size
function maxPosition(entry, stop, riskSol) {
  if (entry === stop || riskSol <= 0) return { maxSize: 0 };
  const distance = Math.abs(entry - stop);
  const size = riskSol / distance;
  return {
    maxSize: Math.round(size * 100) / 100,
    distance,
    riskSol
  };
}

export const tools = [
  {
    name: 'hl_size_position',
    description: 'Calculate optimal position size using Kelly Criterion',
    parameters: {
      type: 'object',
      properties: {
        win_rate: { type: 'number', description: 'Historical win rate (0-1)' },
        avg_win: { type: 'number', description: 'Average win amount in SOL' },
        avg_loss: { type: 'number', description: 'Average loss amount in SOL' },
        bankroll: { type: 'number', description: 'Available capital in SOL' },
        fraction: { type: 'number', default: 0.25, description: 'Kelly fraction (0.25 = quarter-Kelly)' }
      },
      required: ['win_rate', 'avg_win', 'avg_loss', 'bankroll']
    },
    execute: async (params) => {
      const result = kellySize(params.win_rate, params.avg_win, params.avg_loss, params.bankroll, params.fraction || 0.25);
      return {
        recommended_size_sol: result.size,
        kelly_fraction: result.fraction,
        kelly_raw: result.kelly_raw,
        warning: result.warning,
        note: 'Using ' + (params.fraction || 0.25) * 100 + '% Kelly (quarter-Kelly for safety)'
      };
    }
  },
  {
    name: 'hl_risk_of_ruin',
    description: 'Calculate risk of ruin',
    parameters: {
      type: 'object',
      properties: {
        win_rate: { type: 'number' },
        num_trades: { type: 'number' },
        risk_per_trade: { type: 'number', description: 'Risk per trade as fraction (0.01 = 1%)' }
      },
      required: ['win_rate', 'num_trades', 'risk_per_trade']
    },
    execute: async (params) => {
      const roe = riskOfRuin(params.win_rate, params.num_trades, params.risk_per_trade);
      return {
        risk_of_ruin_pct: roe + '%',
        safe: roe < 5 ? true : false,
        recommendation: roe > 10 ? 'REDUCE RISK PER TRADE' : roe > 5 ? 'Consider reducing risk' : 'Risk is acceptable'
      };
    }
  },
  {
    name: 'hl_max_size',
    description: 'Calculate max position size from stop loss',
    parameters: {
      type: 'object',
      properties: {
        entry_price: { type: 'number' },
        stop_price: { type: 'number' },
        risk_sol: { type: 'number' }
      },
      required: ['entry_price', 'stop_price', 'risk_sol']
    },
    execute: async (params) => {
      return maxPosition(params.entry_price, params.stop_price, params.risk_sol);
    }
  },
  {
    name: 'hl_kill_switch',
    description: 'Check or set kill switch',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'set', 'reset'] },
        portfolio_loss_pct: { type: 'number' },
        daily_loss_pct: { type: 'number' }
      }
    },
    execute: async (params) => {
      ensureDir();
      if (params.action === 'get') {
        const state = fs.existsSync(KILL_SWITCH_FILE) ? JSON.parse(fs.readFileSync(KILL_SWITCH_FILE, 'utf8')) : {
          active: false, portfolioLossPct: 20, dailyLossPct: 5
        };
        return state;
      }
      if (params.action === 'set') {
        const state = {
          active: true,
          portfolioLossPct: params.portfolio_loss_pct || 20,
          dailyLossPct: params.daily_loss_pct || 5,
          setAt: new Date().toISOString()
        };
        fs.writeFileSync(KILL_SWITCH_FILE, JSON.stringify(state, null, 2));
        return state;
      }
      if (params.action === 'reset') {
        if (fs.existsSync(KILL_SWITCH_FILE)) fs.unlinkSync(KILL_SWITCH_FILE);
        return { active: false };
      }
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('high-leverage-optimizer module loaded');
}

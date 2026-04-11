/**
 * Trading Bot Module
 * 
 * Autonomous trading bot that uses market structure, wick,
 * liquidity, and execution intelligence to trade.
 * 
 * Runs scheduled tasks, monitors markets, executes strategies.
 */
export const name = 'trading-bot';
export const description = 'Autonomous trading bot with scheduled market monitoring and execution';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/bot');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

// TradingView-style indicators
function calcRSI(candles, period = 14) {
  if (candles.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].c - candles[i - 1].c;
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 100) / 100;
}

function calcMACD(candles) {
  const ema = (arr, n) => {
    const k = 2 / (n + 1);
    let emaVal = arr.slice(0, n).reduce((a, b) => a + b.c, 0) / n;
    for (let i = n; i < arr.length; i++) {
      emaVal = arr[i].c * k + emaVal * (1 - k);
    }
    return emaVal;
  };
  if (candles.length < 26) return { macd: 0, signal: 0, histogram: 0 };
  const ema12 = ema(candles, 12);
  const ema26 = ema(candles, 26);
  const macd = ema12 - ema26;
  const signal = macd * 0.8; // Simplified signal line
  return {
    macd: Math.round(macd * 100) / 100,
    signal: Math.round(signal * 100) / 100,
    histogram: Math.round((macd - signal) * 100) / 100
  };
}

function calcSMA(candles, period = 20) {
  if (candles.length < period) return null;
  const slice = candles.slice(-period);
  return Math.round(slice.reduce((a, c) => a + c.c, 0) / period * 100) / 100;
}

// Trading signals
function generateSignal(candles) {
  if (candles.length < 30) return { signal: 'neutral', confidence: 0 };
  
  const rsi = calcRSI(candles);
  const macd = calcMACD(candles);
  const sma20 = calcSMA(candles, 20);
  const sma50 = calcSMA(candles, 50);
  const last = candles[candles.length - 1];
  
  let score = 0;
  const factors = [];
  
  // RSI
  if (rsi < 30) { score += 2; factors.push('RSI oversold'); }
  if (rsi > 70) { score -= 2; factors.push('RSI overbought'); }
  
  // MACD
  if (macd.histogram > 0 && macd.histogram > (macd.histogram > 0 ? 0.01 : -0.01)) {
    score += 1; factors.push('MACD bullish');
  }
  if (macd.histogram < 0) { score -= 1; factors.push('MACD bearish'); }
  
  // SMA
  if (last.c > sma20 && sma20 > sma50) { score += 1; factors.push('bullish alignment'); }
  if (last.c < sma20 && sma20 < sma50) { score -= 1; factors.push('bearish alignment'); }
  
  // Trend
  const recent = candles.slice(-5);
  const priceChange = (recent[4].c - recent[0].c) / recent[0].c;
  if (priceChange > 0.02) { score += 1; factors.push('momentum up'); }
  if (priceChange < -0.02) { score -= 1; factors.push('momentum down'); }
  
  const confidence = Math.min(Math.abs(score) / 4, 1);
  let signal;
  if (score >= 2) signal = 'buy';
  else if (score <= -2) signal = 'sell';
  else signal = 'neutral';
  
  return {
    signal,
    confidence: Math.round(confidence * 100) / 100,
    rsi: Math.round(rsi * 100) / 100,
    macd: macd,
    sma20,
    sma50,
    price: last.c,
    factors
  };
}

export const tools = [
  {
    name: 'bot_analyze',
    description: 'Analyze candles and generate trading signals',
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
      const analysis = generateSignal(candles);
      return {
        symbol: params.symbol || 'SOL/USD',
        ...analysis,
        candles_analyzed: candles.length
      };
    }
  },
  {
    name: 'bot_schedule_task',
    description: 'Schedule a trading task',
    parameters: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'Task name' },
        interval_minutes: { type: 'number' },
        action: { type: 'string' }
      },
      required: ['task', 'interval_minutes']
    },
    execute: async (params) => {
      ensureDir();
      const file = path.join(dataDir, 'schedule.json');
      const tasks = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
      const newTask = {
        id: 'task-' + Date.now().toString(36),
        name: params.task,
        interval: params.interval_minutes,
        action: params.action,
        lastRun: null,
        nextRun: new Date(Date.now() + params.interval_minutes * 60000).toISOString(),
        enabled: true
      };
      tasks.push(newTask);
      fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
      return { scheduled: newTask.name, interval_minutes: newTask.interval, next_run: newTask.nextRun };
    }
  },
  {
    name: 'bot_list_tasks',
    description: 'List scheduled trading tasks',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      ensureDir();
      const file = path.join(dataDir, 'schedule.json');
      if (!fs.existsSync(file)) return { tasks: [], count: 0 };
      const tasks = JSON.parse(fs.readFileSync(file, 'utf8'));
      return { tasks, count: tasks.length };
    }
  },
  {
    name: 'bot_remove_task',
    description: 'Remove a scheduled task',
    parameters: { type: 'object', properties: { task_id: { type: 'string' } }, required: ['task_id'] },
    execute: async (params) => {
      ensureDir();
      const file = path.join(dataDir, 'schedule.json');
      if (!fs.existsSync(file)) return { removed: false };
      let tasks = JSON.parse(fs.readFileSync(file, 'utf8'));
      const before = tasks.length;
      tasks = tasks.filter(t => t.id !== params.task_id);
      fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
      return { removed: tasks.length < before };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('trading-bot module loaded');
}

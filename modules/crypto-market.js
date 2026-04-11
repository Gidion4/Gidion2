import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'crypto-market';
export const description = 'Crypto market data, analysis, and trading signals';
export const version = '1.0.0';

const dataDir = path.resolve(__dirname, '../../data/crypto');

export const tools = [
  {
    name: 'crypto_prices',
    description: 'Get current prices for multiple cryptocurrencies',
    parameters: {
      type: 'object',
      properties: {
        coins: { type: 'string', description: 'Comma-separated CoinGecko IDs (e.g. solana,bitcoin,bonk)' },
        currency: { type: 'string', default: 'usd' }
      },
      required: ['coins']
    },
    execute: async (params) => {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${params.coins}&vs_currencies=${params.currency || 'usd'}&include_24hr_change=true&include_market_cap=true`;
        const res = await fetch(url);
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'crypto_trending',
    description: 'Get trending coins on CoinGecko',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
        const data = await res.json();
        return {
          trending: (data.coins || []).map(c => ({
            name: c.item.name,
            symbol: c.item.symbol,
            rank: c.item.market_cap_rank,
            score: c.item.score
          }))
        };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'crypto_chart',
    description: 'Get price history for a coin (for technical analysis)',
    parameters: {
      type: 'object',
      properties: {
        coinId: { type: 'string', description: 'CoinGecko coin ID' },
        days: { type: 'number', default: 7 }
      },
      required: ['coinId']
    },
    execute: async (params) => {
      try {
        const url = `https://api.coingecko.com/api/v3/coins/${params.coinId}/market_chart?vs_currency=usd&days=${params.days || 7}`;
        const res = await fetch(url);
        const data = await res.json();
        const prices = (data.prices || []).map(([ts, price]) => ({
          time: new Date(ts).toISOString(),
          price: price.toFixed(6)
        }));
        // Basic stats
        const values = prices.map(p => parseFloat(p.price));
        const high = Math.max(...values);
        const low = Math.min(...values);
        const current = values[values.length - 1];
        const change = ((current - values[0]) / values[0] * 100).toFixed(2);
        return { prices: prices.slice(-50), stats: { high, low, current, changePct: change } };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'crypto_log_trade',
    description: 'Log a trade or strategy result for tracking',
    parameters: {
      type: 'object',
      properties: {
        coin: { type: 'string' },
        action: { type: 'string', description: 'buy/sell/hold/signal' },
        price: { type: 'number' },
        amount: { type: 'number' },
        strategy: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['coin', 'action']
    },
    execute: async (params) => {
      fs.mkdirSync(dataDir, { recursive: true });
      const logFile = path.join(dataDir, 'trade-log.json');
      let log = [];
      if (fs.existsSync(logFile)) {
        log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      }
      const entry = { ...params, timestamp: new Date().toISOString() };
      log.push(entry);
      fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
      return { logged: entry };
    }
  },
  {
    name: 'crypto_trade_history',
    description: 'View logged trades and strategy results',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 20 },
        coin: { type: 'string', description: 'Filter by coin (optional)' }
      }
    },
    execute: async (params) => {
      const logFile = path.join(dataDir, 'trade-log.json');
      if (!fs.existsSync(logFile)) return { trades: [] };
      let log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      if (params.coin) log = log.filter(t => t.coin === params.coin);
      return { trades: log.slice(-(params.limit || 20)) };
    }
  }
];

export async function init(ctx) {
  fs.mkdirSync(dataDir, { recursive: true });
  ctx.log('crypto-market module loaded');
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'trading-sim';
export const description = 'Paper trading simulator: test strategies without real money, track performance, backtest';
export const version = '1.0.0';

const dataDir = path.resolve(__dirname, '../../data/trading');

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

function loadPortfolio() {
  ensureDir();
  const file = path.join(dataDir, 'portfolio.json');
  if (!fs.existsSync(file)) {
    const init = { balanceUSD: 10000, holdings: {}, created: new Date().toISOString() };
    fs.writeFileSync(file, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function savePortfolio(p) {
  fs.writeFileSync(path.join(dataDir, 'portfolio.json'), JSON.stringify(p, null, 2));
}

function loadTradeLog() {
  const file = path.join(dataDir, 'trades.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function appendTrade(trade) {
  const log = loadTradeLog();
  log.push({ ...trade, timestamp: new Date().toISOString() });
  fs.writeFileSync(path.join(dataDir, 'trades.json'), JSON.stringify(log, null, 2));
}

async function getPrice(coinId) {
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
  const data = await res.json();
  return data[coinId]?.usd || null;
}

export const tools = [
  {
    name: 'sim_portfolio',
    description: 'View current simulated portfolio (balance + holdings + P&L)',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const p = loadPortfolio();
      // Calculate current value of holdings
      let totalValue = p.balanceUSD;
      const holdingDetails = [];
      for (const [coin, amount] of Object.entries(p.holdings)) {
        if (amount <= 0) continue;
        const price = await getPrice(coin);
        const value = price ? amount * price : 0;
        totalValue += value;
        holdingDetails.push({ coin, amount, priceUSD: price, valueUSD: value.toFixed(2) });
      }
      return {
        cashUSD: p.balanceUSD.toFixed(2),
        holdings: holdingDetails,
        totalValueUSD: totalValue.toFixed(2),
        created: p.created
      };
    }
  },
  {
    name: 'sim_buy',
    description: 'Simulate buying a coin with USD balance',
    parameters: {
      type: 'object',
      properties: {
        coin: { type: 'string', description: 'CoinGecko ID (e.g. solana, bitcoin, bonk)' },
        amountUSD: { type: 'number', description: 'USD amount to spend' }
      },
      required: ['coin', 'amountUSD']
    },
    execute: async (params) => {
      const p = loadPortfolio();
      if (params.amountUSD > p.balanceUSD) return { error: `Insufficient balance. Have $${p.balanceUSD.toFixed(2)}` };
      const price = await getPrice(params.coin);
      if (!price) return { error: `Cannot get price for ${params.coin}` };
      const qty = params.amountUSD / price;
      p.balanceUSD -= params.amountUSD;
      p.holdings[params.coin] = (p.holdings[params.coin] || 0) + qty;
      savePortfolio(p);
      const trade = { action: 'BUY', coin: params.coin, qty, priceUSD: price, totalUSD: params.amountUSD };
      appendTrade(trade);
      return { executed: trade, remainingCash: p.balanceUSD.toFixed(2) };
    }
  },
  {
    name: 'sim_sell',
    description: 'Simulate selling a coin for USD',
    parameters: {
      type: 'object',
      properties: {
        coin: { type: 'string' },
        qty: { type: 'number', description: 'Amount of coin to sell (0 = sell all)' }
      },
      required: ['coin']
    },
    execute: async (params) => {
      const p = loadPortfolio();
      const held = p.holdings[params.coin] || 0;
      if (held <= 0) return { error: `No ${params.coin} in portfolio` };
      const sellQty = (params.qty && params.qty > 0) ? Math.min(params.qty, held) : held;
      const price = await getPrice(params.coin);
      if (!price) return { error: `Cannot get price for ${params.coin}` };
      const valueUSD = sellQty * price;
      p.holdings[params.coin] = held - sellQty;
      p.balanceUSD += valueUSD;
      savePortfolio(p);
      const trade = { action: 'SELL', coin: params.coin, qty: sellQty, priceUSD: price, totalUSD: valueUSD };
      appendTrade(trade);
      return { executed: trade, remainingCash: p.balanceUSD.toFixed(2) };
    }
  },
  {
    name: 'sim_trades',
    description: 'View trade history',
    parameters: {
      type: 'object',
      properties: { limit: { type: 'number', default: 20 } }
    },
    execute: async (params) => {
      const log = loadTradeLog();
      return { trades: log.slice(-(params.limit || 20)) };
    }
  },
  {
    name: 'sim_reset',
    description: 'Reset simulated portfolio to starting balance',
    parameters: {
      type: 'object',
      properties: { startingUSD: { type: 'number', default: 10000 } }
    },
    execute: async (params) => {
      const init = { balanceUSD: params.startingUSD || 10000, holdings: {}, created: new Date().toISOString() };
      savePortfolio(init);
      fs.writeFileSync(path.join(dataDir, 'trades.json'), '[]');
      return { reset: true, balanceUSD: init.balanceUSD };
    }
  },
  {
    name: 'sim_performance',
    description: 'Calculate overall trading performance and statistics',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const p = loadPortfolio();
      const trades = loadTradeLog();
      let totalValue = p.balanceUSD;
      for (const [coin, amount] of Object.entries(p.holdings)) {
        if (amount <= 0) continue;
        const price = await getPrice(coin);
        if (price) totalValue += amount * price;
      }
      const startingBalance = 10000;
      const pnl = totalValue - startingBalance;
      const pnlPct = ((pnl / startingBalance) * 100).toFixed(2);
      const buys = trades.filter(t => t.action === 'BUY').length;
      const sells = trades.filter(t => t.action === 'SELL').length;
      return {
        startingUSD: startingBalance,
        currentValueUSD: totalValue.toFixed(2),
        pnlUSD: pnl.toFixed(2),
        pnlPercent: pnlPct + '%',
        totalTrades: trades.length,
        buys,
        sells,
        activeSince: p.created
      };
    }
  },
  {
    name: 'sim_watchlist',
    description: 'Get prices for a watchlist of coins',
    parameters: {
      type: 'object',
      properties: {
        coins: { type: 'string', description: 'Comma-separated CoinGecko IDs' }
      },
      required: ['coins']
    },
    execute: async (params) => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${params.coins}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`);
        return await res.json();
      } catch (err) {
        return { error: err.message };
      }
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('trading-sim module loaded (paper trading)');
}

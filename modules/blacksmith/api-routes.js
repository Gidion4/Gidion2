/**
 * Blacksmith API Routes
 * 
 * Adds trading system routes to the Gidion API server.
 * Routes: /api/blacksmith/*, /api/autonomous-scheduler/*, /api/portfolio-allocator/*
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerBlacksmithRoutes(app) {
  const dataDir = path.resolve(__dirname, '../../data/blacksmith');
  
  // === BLACKSMITH STATUS ===
  app.get('/api/blacksmith/status', async (req, res) => {
    try {
      let portfolio = { buckets: {}, total_pnl: 0 };
      let positions = [];
      let trends = [];
      let auto = { running: false, completedCycles: 0, active_tasks: [], error_count: 0 };
      
      // Portfolio
      try {
        const alloc = JSON.parse(fs.readFileSync(path.join(dataDir, 'portfolio/buckets.json'), 'utf8'));
        const total = Object.values(alloc).reduce((a, b) => a + (b.current || 0), 0);
        portfolio = { buckets: alloc, total_pnl: total };
      } catch (e) {}
      
      // Positions
      try {
        const tradeDir = path.join(dataDir, 'trades');
        if (fs.existsSync(tradeDir)) {
          const files = fs.readdirSync(tradeDir).filter(f => f.endsWith('.json'));
          positions = files.map(f => {
            const t = JSON.parse(fs.readFileSync(path.join(tradeDir, f), 'utf8'));
            return { id: f.replace('.json', ''), side: t.side, status: t.status, entry: t.entryPrice, pnl: t.pnl };
          });
        }
      } catch (e) {}
      
      // Trends
      try {
        const social = JSON.parse(fs.readFileSync(path.join(dataDir, 'social/trends.json'), 'utf8'));
        trends = social.slice(0, 20).map(t => ({ topic: t.topic, score: t.score || 0.5 }));
      } catch (e) {}
      
      // Autonomous state
      try {
        auto = JSON.parse(fs.readFileSync(path.join(dataDir, 'autonomous/state.json'), 'utf8'));
      } catch (e) {}
      
      res.json({
        system: 'BLACKSMITH v1.0.0',
        mode: 'paper',
        modules_loaded: 14,
        portfolio,
        positions: { all: positions, active: positions.filter(p => p.status === 'open').length },
        trends,
        autonomous: {
          running: auto.running || false,
          completedCycles: auto.completedCycles || 0,
          active_tasks: auto.activeTasks || [],
          error_count: auto.errors?.length || 0
        },
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  // === AUTONOMOUS SCHEDULER ===
  const autoStateFile = path.join(dataDir, 'autonomous/state.json');
  const autoTasksFile = path.join(dataDir, 'autonomous/tasks.json');
  
  function getAutoState() {
    try {
      return fs.existsSync(autoStateFile) ? JSON.parse(fs.readFileSync(autoStateFile, 'utf8')) : {
        running: false, startedAt: null, lastHeartbeat: null, completedCycles: 0, errors: [], activeTasks: []
      };
    } catch (e) { return { running: false }; }
  }
  
  function saveAutoState(state) {
    fs.writeFileSync(autoStateFile, JSON.stringify(state, null, 2));
  }
  
  function getTasks() {
    try {
      return fs.existsSync(autoTasksFile) ? JSON.parse(fs.readFileSync(autoTasksFile, 'utf8')) : [
        { id: 'heartbeat', name: 'System Heartbeat', interval: 5, enabled: true },
        { id: 'social_scan', name: 'Social Media Scan', interval: 30, enabled: true },
        { id: 'market_check', name: 'Market Check', interval: 15, enabled: true },
        { id: 'night_scan', name: 'Night Mode Scan', interval: 60, enabled: true },
        { id: 'portfolio_review', name: 'Portfolio Review', interval: 120, enabled: true }
      ];
    } catch (e) { return []; }
  }
  
  app.get('/api/autonomous-scheduler/status', (req, res) => {
    const state = getAutoState();
    const tasks = getTasks();
    res.json({
      running: state.running,
      startedAt: state.startedAt,
      uptime: state.startedAt ? Math.round((Date.now() - new Date(state.startedAt).getTime()) / 60000) + ' min' : '0 min',
      lastHeartbeat: state.lastHeartbeat,
      completedCycles: state.completedCycles || 0,
      active_tasks: tasks.filter(t => t.enabled),
      error_count: state.errors?.length || 0,
      recent_errors: (state.errors || []).slice(-5)
    });
  });
  
  app.post('/api/autonomous-scheduler/start', (req, res) => {
    let state = getAutoState();
    if (state.running) return res.json({ already_running: true });
    state.running = true;
    state.startedAt = state.startedAt || new Date().toISOString();
    state.lastHeartbeat = new Date().toISOString();
    saveAutoState(state);
    res.json({ started: true, started_at: state.startedAt });
  });
  
  app.post('/api/autonomous-scheduler/stop', (req, res) => {
    let state = getAutoState();
    state.running = false;
    saveAutoState(state);
    res.json({ stopped: true });
  });
  
  app.post('/api/autonomous-scheduler/heartbeat', (req, res) => {
    let state = getAutoState();
    if (!state.running) return res.json({ error: 'Not running' });
    state.lastHeartbeat = new Date().toISOString();
    state.completedCycles = (state.completedCycles || 0) + 1;
    saveAutoState(state);
    const tasks = getTasks();
    res.json({
      heartbeat: true,
      cycle: state.completedCycles,
      active_tasks: tasks.filter(t => t.enabled).length,
      next_check: 'in ' + Math.min(...tasks.filter(t => t.enabled).map(t => t.interval)) + ' min'
    });
  });
  
  // === PORTFOLIO ALLOCATOR ===
  const allocFile = path.join(dataDir, 'portfolio/buckets.json');
  
  function getBuckets() {
    return {
      core_trading: { maxAllocation: 0.5, current: 0 },
      meme_factory: { maxAllocation: 0.15, current: 0 },
      night_mode: { maxAllocation: 0.1, current: 0 },
      reserve: { maxAllocation: 0.25, current: 0 }
    };
  }
  
  app.get('/api/portfolio-allocator/status', (req, res) => {
    let buckets;
    try {
      buckets = fs.existsSync(allocFile) ? JSON.parse(fs.readFileSync(allocFile, 'utf8')) : getBuckets();
    } catch (e) { buckets = getBuckets(); }
    const total = Object.values(buckets).reduce((a, b) => a + (b.current || 0), 0);
    res.json({ buckets, total_used: Math.round(total * 100) / 100, total_reserve: Math.round((1 - total) * 100) / 100 });
  });
  
  app.get('/api/portfolio-allocator/allocate', (req, res) => {
    const { bucket, amount } = req.query;
    let buckets;
    try {
      buckets = fs.existsSync(allocFile) ? JSON.parse(fs.readFileSync(allocFile, 'utf8')) : getBuckets();
    } catch (e) { buckets = getBuckets(); }
    if (!buckets[bucket]) return res.status(400).json({ error: 'Unknown bucket: ' + bucket });
    buckets[bucket].current = parseFloat(amount) || 0;
    fs.writeFileSync(allocFile, JSON.stringify(buckets, null, 2));
    res.json({ bucket, allocated: buckets[bucket].current, max: buckets[bucket].maxAllocation });
  });
  
  // === TRADE MANAGER ===
  const tradesDir = path.join(dataDir, 'trades');
  
  app.get('/api/trade-manager/list', (req, res) => {
    try {
      fs.mkdirSync(tradesDir, { recursive: true });
      const files = fs.readdirSync(tradesDir).filter(f => f.endsWith('.json'));
      const trades = files.map(f => {
        const t = JSON.parse(fs.readFileSync(path.join(tradesDir, f), 'utf8'));
        return { id: f.replace('.json', ''), side: t.side, status: t.status, entry: t.entryPrice };
      });
      res.json({ positions: trades, count: trades.length });
    } catch (e) { res.json({ positions: [], count: 0 }); }
  });
  
  app.post('/api/trade-manager/open', (req, res) => {
    const { side, entry_price, stop_price, target_price } = req.body;
    fs.mkdirSync(tradesDir, { recursive: true });
    const id = 'trade-' + Date.now().toString(36);
    const trade = {
      id, side, entryPrice: parseFloat(entry_price), stopPrice: parseFloat(stop_price),
      targetPrice: parseFloat(target_price), entryTime: new Date().toISOString(),
      status: 'open', validated: false, partialTaken: false
    };
    fs.writeFileSync(path.join(tradesDir, id + '.json'), JSON.stringify(trade, null, 2));
    res.json({ position_id: id, status: 'open', side, entry: entry_price, stop: stop_price, target: target_price });
  });
  
  app.post('/api/trade-manager/close', (req, res) => {
    const { position_id } = req.body;
    const file = path.join(tradesDir, position_id + '.json');
    if (!fs.existsSync(file)) return res.status(404).json({ error: 'Position not found' });
    const trade = JSON.parse(fs.readFileSync(file, 'utf8'));
    trade.status = 'closed';
    trade.closeTime = new Date().toISOString();
    fs.writeFileSync(file, JSON.stringify(trade, null, 2));
    res.json({ position_id, status: 'closed' });
  });
  
  // === MEMECOIN FACTORY ===
  const memeDir = path.join(dataDir, 'memecoin');
  
  app.get('/api/memecoin/list', (req, res) => {
    try {
      fs.mkdirSync(memeDir, { recursive: true });
      const files = fs.readdirSync(memeDir).filter(f => f.endsWith('.json'));
      const coins = files.map(f => {
        const c = JSON.parse(fs.readFileSync(path.join(memeDir, f), 'utf8'));
        return { id: f.replace('.json', ''), name: c.name, ticker: c.ticker, status: c.status };
      });
      res.json({ coins, count: coins.length });
    } catch (e) { res.json({ coins: [], count: 0 }); }
  });
  
  app.post('/api/memecoin/create', (req, res) => {
    const { topic, category } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required' });
    fs.mkdirSync(memeDir, { recursive: true });
    const name = topic.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 30);
    const ticker = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'MEME';
    const id = ticker + '-' + Date.now().toString(36);
    const coin = { id, name, ticker, category: category || 'meme', topic, supply: 1000000000, created: new Date().toISOString(), status: 'concept' };
    fs.writeFileSync(path.join(memeDir, id + '.json'), JSON.stringify(coin, null, 2));
    res.json({ coin_id: id, name, ticker, status: 'concept_ready', next_steps: ['Deploy to Pump.fun', 'Add liquidity', 'Monitor community'] });
  });
  
  console.log('Blacksmith API routes registered');
}

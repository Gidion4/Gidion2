/**
 * RL Self-Improving Decision Layer
 * 
 * Validates trades against historical patterns, maintains
 * a trade journal, scores decisions, and improves over time.
 */
export const name = 'rl-decision-layer';
export const description = 'Trade validation, pattern matching, decision scoring, self-improvement';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/rl');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

const JOURNAL_FILE = path.join(dataDir, 'journal.json');
const PATTERNS_FILE = path.join(dataDir, 'patterns.json');
const SCORES_FILE = path.join(dataDir, 'scores.json');

function loadJournal() {
  ensureDir();
  return fs.existsSync(JOURNAL_FILE) ? JSON.parse(fs.readFileSync(JOURNAL_FILE, 'utf8')) : [];
}

function saveJournal(journal) {
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify(journal.slice(-500), null, 2));
}

function loadPatterns() {
  ensureDir();
  return fs.existsSync(PATTERNS_FILE) ? JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf8')) : [];
}

function detectPattern(trade, patterns) {
  const matchScore = { pattern: null, score: 0, matchedRules: [] };
  
  for (const p of patterns) {
    let matches = 0;
    const rules = [];
    
    if (p.side === trade.side) { matches++; rules.push('side'); }
    if (p.regime === trade.regime) { matches++; rules.push('regime'); }
    if (Math.abs(p.riskReward - trade.riskReward) < 0.5) { matches++; rules.push('risk_reward'); }
    if (p.structure === trade.structure) { matches++; rules.push('structure'); }
    
    const score = matches / (Object.keys(p).length - 2);
    if (score > matchScore.score) {
      matchScore = { pattern: p.name, score: Math.round(score * 100) / 100, matchedRules: rules };
    }
  }
  
  return matchScore;
}

function calcWinRate(journal) {
  if (journal.length === 0) return { winRate: 0.5, trades: 0 };
  const wins = journal.filter(t => t.pnl > 0).length;
  return { winRate: Math.round(wins / journal.length * 100) / 100, trades: journal.length };
}

export const tools = [
  {
    name: 'rl_validate_trade',
    description: 'Validate a trade setup against historical patterns',
    parameters: {
      type: 'object',
      properties: {
        side: { type: 'string', enum: ['long', 'short'] },
        regime: { type: 'string' },
        structure: { type: 'string' },
        risk_reward: { type: 'number' },
        wick_score: { type: 'number' },
        liq_score: { type: 'number' }
      },
      required: ['side', 'regime', 'risk_reward']
    },
    execute: async (params) => {
      const patterns = loadPatterns();
      const journal = loadJournal();
      const stats = calcWinRate(journal);
      const patternMatch = detectPattern(params, patterns);
      
      // Score the setup
      let score = 0.5;
      if (params.risk_reward >= 2) score += 0.1;
      if (params.risk_reward >= 3) score += 0.1;
      if (params.wick_score > 0.7) score += 0.1;
      if (params.liq_score > 0.5) score += 0.1;
      if (patternMatch.score > 0.5) score += 0.1 * patternMatch.score;
      if (stats.winRate > 0.5) score += 0.05 * (stats.winRate - 0.5);
      
      score = Math.min(1, score);
      
      const recommendation = score >= 0.75 ? 'EXECUTE' : score >= 0.6 ? 'CONSIDER' : 'SKIP';
      
      return {
        score: Math.round(score * 100) / 100,
        recommendation,
        pattern_match: patternMatch,
        historical_win_rate: stats.winRate,
        total_journal_trades: stats.trades
      };
    }
  },
  {
    name: 'rl_journal_entry',
    description: 'Log a trade to the journal for learning',
    parameters: {
      type: 'object',
      properties: {
        trade_id: { type: 'string' },
        side: { type: 'string' },
        entry: { type: 'number' },
        exit: { type: 'number' },
        pnl: { type: 'number' },
        regime: { type: 'string' },
        structure: { type: 'string' },
        wick_score: { type: 'number' },
        liq_score: { type: 'number' },
        notes: { type: 'string' }
      },
      required: ['trade_id', 'side', 'pnl']
    },
    execute: async (params) => {
      const journal = loadJournal();
      const entry = {
        id: params.trade_id,
        side: params.side,
        entry: params.entry,
        exit: params.exit,
        pnl: params.pnl,
        regime: params.regime || 'unknown',
        structure: params.structure || 'unknown',
        wickScore: params.wick_score || 0,
        liqScore: params.liq_score || 0,
        notes: params.notes || '',
        timestamp: new Date().toISOString(),
        outcome: params.pnl > 0 ? 'win' : params.pnl < 0 ? 'loss' : 'breakeven'
      };
      journal.push(entry);
      saveJournal(journal);
      return { logged: entry.id, outcome: entry.outcome, journal_trades: journal.length };
    }
  },
  {
    name: 'rl_stats',
    description: 'Get RL statistics and performance',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const journal = loadJournal();
      const patterns = loadPatterns();
      const stats = calcWinRate(journal);
      const wins = journal.filter(t => t.pnl > 0);
      const losses = journal.filter(t => t.pnl < 0);
      const avgWin = wins.length > 0 ? wins.reduce((a, t) => a + t.pnl, 0) / wins.length : 0;
      const avgLoss = losses.length > 0 ? losses.reduce((a, t) => a + t.pnl, 0) / losses.length : 0;
      const totalPnl = journal.reduce((a, t) => a + t.pnl, 0);
      return {
        total_trades: journal.length,
        win_rate: stats.winRate,
        avg_win_sol: Math.round(avgWin * 100) / 100,
        avg_loss_sol: Math.round(avgLoss * 100) / 100,
        total_pnl_sol: Math.round(totalPnl * 100) / 100,
        win_loss_ratio: avgLoss !== 0 ? Math.round(Math.abs(avgWin / avgLoss) * 100) / 100 : 0,
        patterns_tracked: patterns.length
      };
    }
  },
  {
    name: 'rl_add_pattern',
    description: 'Add a successful pattern to track',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        side: { type: 'string' },
        regime: { type: 'string' },
        structure: { type: 'string' },
        risk_reward: { type: 'number' }
      },
      required: ['name', 'side']
    },
    execute: async (params) => {
      const patterns = loadPatterns();
      patterns.push({ name: params.name, side: params.side, regime: params.regime, structure: params.structure, riskReward: params.risk_reward, timesTriggered: 0, successRate: 0 });
      fs.writeFileSync(PATTERNS_FILE, JSON.stringify(patterns, null, 2));
      return { added: params.name, total_patterns: patterns.length };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('rl-decision-layer module loaded');
}

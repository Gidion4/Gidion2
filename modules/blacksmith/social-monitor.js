/**
 * Social Media & News Monitor Module
 * Monitors Twitter/X, Reddit, Telegram, news for trending topics,
 * memes, and opportunities. Creates actionable intelligence.
 */
export const name = 'social-monitor';
export const description = 'Monitor social media and news for trending topics, memes, and opportunities';
export const version = '1.0.0';

const dataDir = './data/blacksmith/social';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

function saveTrend(topic) {
  ensureDir();
  const file = path.join(dataDir, 'trends.json');
  const trends = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  trends.unshift({ topic, timestamp: Date.now(), score: 1 });
  fs.writeFileSync(file, JSON.stringify(trends.slice(0, 100), null, 2));
}

function loadTrends() {
  ensureDir();
  const file = path.join(dataDir, 'trends.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
}

// Keywords that signal meme/coin opportunities
const OPPORTUNITY_KEYWORDS = [
  'launch', 'new coin', 'airdrop', 'presale', 'mint', 'create',
  'trending', 'viral', 'exploding', 'pumping', 'moon', '100x', 'sol'
];

const TOPIC_KEYWORDS = {
  'ai': ['ai', 'artificial intelligence', 'gpt', 'claude', 'openai', 'neural', 'agent'],
  'meme': ['meme', 'doge', 'pepe', 'wif', 'bonk', 'dog', 'cat'],
  'gaming': ['gaming', 'gamefi', 'play to earn', 'nft game', 'virtual world'],
  'defi': ['defi', 'yield', 'liquidity', 'staking', 'farming', 'dex'],
  'politiikka': ['trump', 'biden', 'elon', 'putin', 'government', 'fed', 'ecb'],
  'urheilu': ['football', 'nba', 'messi', 'ronaldo', 'f1', 'mma', 'ufc'],
  'viihde': ['netflix', 'movie', 'series', 'actor', 'singer', 'star'],
};

export const tools = [
  {
    name: 'social_scan',
    description: 'Scan and score trending topics from monitored sources',
    parameters: {
      type: 'object',
      properties: {
        source: { type: 'string', default: 'all', description: 'twitter|reddit|news|all' },
        limit: { type: 'number', default: 20 }
      }
    },
    execute: async (params) => {
      const trends = loadTrends();
      const now = Date.now();
      const recent = trends.filter(t => now - t.timestamp < 24 * 60 * 60 * 1000);
      const scored = recent.map(t => {
        let score = t.score || 1;
        for (const [cat, keywords] of Object.entries(TOPIC_KEYWORDS)) {
          if (keywords.some(k => t.topic.toLowerCase().includes(k))) score += 2;
        }
        return { ...t, score: Math.round(score * 10) / 10, category: detectCategory(t.topic) };
      }).sort((a, b) => b.score - a.score);
      return { topics: scored.slice(0, params.limit || 20), total: scored.length, scanned_at: new Date().toISOString() };
    }
  },
  {
    name: 'social_add_topic',
    description: 'Add a topic/trend to monitoring',
    parameters: {
      type: 'object',
      properties: {
        topic: { type: 'string' },
        source: { type: 'string', default: 'manual' },
        score: { type: 'number', default: 1 }
      },
      required: ['topic']
    },
    execute: async (params) => {
      saveTrend(params.topic);
      return { added: params.topic, source: params.source, score: params.score || 1 };
    }
  },
  {
    name: 'social_opportunity_scan',
    description: 'Scan for actionable meme/coin opportunities',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const trends = loadTrends();
      const now = Date.now();
      const recent = trends.filter(t => now - t.timestamp < 6 * 60 * 60 * 1000);
      const opportunities = recent
        .filter(t => OPPORTUNITY_KEYWORDS.some(k => t.topic.toLowerCase().includes(k)))
        .map(t => ({ topic: t.topic, timestamp: t.timestamp, urgency: 'high' }))
        .slice(0, 10);
      return { opportunities, count: opportunities.length, scan_time: new Date().toISOString() };
    }
  }
];

function detectCategory(topic) {
  const lower = topic.toLowerCase();
  for (const [cat, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'general';
}

export async function init(ctx) {
  ensureDir();
  ctx.log('social-monitor module loaded');
}

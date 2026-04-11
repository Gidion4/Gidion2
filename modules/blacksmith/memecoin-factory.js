/**
 * Memecoin Factory Module
 * 
 * Creates original meme coins on Solana (Pump.fun / Raydium style).
 * Generates coins about real-world events, people, trends.
 * 
 * SECURITY: Creates coins ONLY about public figures/events.
 * No impersonation. No fake personas. No rugpulling.
 * Coins are creative commentary, not financial advice.
 */
export const name = 'memecoin-factory';
export const description = 'Create meme coins about trending topics and real-world events on Solana';
export const version = '1.0.0';

const dataDir = './data/blacksmith/memecoin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

const MINT_TEMPLATE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TOKEN_NAME {
    string public name = "COIN_NAME";
    string public symbol = "SYMBOL";
    uint public totalSupply = 1000000000 * 10**9;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint amount) public returns(bool) {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
`;

// Categories for coin creation
const COIN_CATEGORIES = {
  event: ['olympics', 'election', 'world cup', 'breaking news', 'viral moment'],
  person: ['celebrity', 'influencer', 'athlete', 'artist', 'musician'],
  meme: ['viral meme', 'classic meme', 'new meme format', 'internet culture'],
  political: ['government', 'regulation', 'crypto policy', 'election'],
  tech: ['ai breakthrough', 'new gadget', 'startup launch', 'app viral'],
  entertainment: ['movie release', 'album drop', 'concert', 'scandal', 'viral video']
};

function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 30);
}

function generateTicker(name) {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  if (clean.length >= 3) return clean;
  return name.toUpperCase().slice(0, 5) + 'MEM';
}

export const tools = [
  {
    name: 'meme_create_spec',
    description: 'Generate a meme coin concept from a topic',
    parameters: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Topic for the coin (event, person, meme, trend)' },
        category: { type: 'string', description: 'Category: event|person|meme|political|tech|entertainment' }
      },
      required: ['topic']
    },
    execute: async (params) => {
      const name = sanitize(params.topic);
      const ticker = generateTicker(name);
      const category = params.category || detectCategory(params.topic);
      const timestamp = Date.now();
      const coinId = ticker + '-' + timestamp.toString(36);
      
      const spec = {
        id: coinId,
        name: name,
        ticker: ticker,
        category: category,
        description: `A creative meme coin inspired by: ${params.topic}`,
        supply: 1000000000,
        decimals: 9,
        created: new Date().toISOString(),
        status: 'concept',
        topic: params.topic
      };
      
      ensureDir();
      const file = path.join(dataDir, `${coinId}.json`);
      fs.writeFileSync(file, JSON.stringify(spec, null, 2));
      
      return {
        coin_id: coinId,
        name: spec.name,
        ticker: spec.ticker,
        category: spec.category,
        supply: spec.supply,
        description: spec.description,
        status: 'concept_ready',
        contract_template: 'solana-spl-token (see docs)',
        next_steps: [
          '1. Review coin spec',
          '2. Deploy to Pump.fun or create SPL token',
          '3. Add initial liquidity (your SOL)',
          '4. Monitor and engage community'
        ]
      };
    }
  },
  {
    name: 'meme_list',
    description: 'List all created meme coins',
    parameters: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'Filter by status: concept|deployed|active' }
      }
    },
    execute: async () => {
      ensureDir();
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
      const coins = files.map(f => {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8'));
        return { id: f.replace('.json', ''), name: data.name, ticker: data.ticker, status: data.status, category: data.category };
      });
      return { coins, count: coins.length };
    }
  },
  {
    name: 'meme_deploy',
    description: 'Mark a meme coin as deployed and add deployment info',
    parameters: {
      type: 'object',
      properties: {
        coin_id: { type: 'string' },
        mint_address: { type: 'string', description: 'Solana mint address' },
        liquidity_pool: { type: 'string', description: 'LP token address' },
        initial_price: { type: 'number' }
      },
      required: ['coin_id']
    },
    execute: async (params) => {
      ensureDir();
      const file = path.join(dataDir, params.coin_id + '.json');
      if (!fs.existsSync(file)) return { error: 'Coin not found' };
      const coin = JSON.parse(fs.readFileSync(file, 'utf8'));
      coin.status = 'deployed';
      coin.mint_address = params.mint_address;
      coin.liquidity_pool = params.liquidity_pool;
      coin.initial_price = params.initial_price;
      coin.deployed_at = new Date().toISOString();
      fs.writeFileSync(file, JSON.stringify(coin, null, 2));
      return { coin_id: params.coin_id, status: 'deployed', ...coin };
    }
  }
];

function detectCategory(topic) {
  const lower = topic.toLowerCase();
  for (const [cat, keywords] of Object.entries(COIN_CATEGORIES)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'meme';
}

export async function init(ctx) {
  ensureDir();
  ctx.log('memecoin-factory module loaded');
}

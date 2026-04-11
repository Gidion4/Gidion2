import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'solana';
export const description = 'Solana blockchain interactions: wallet, balance, transfers, token info';
export const version = '1.0.0';

const configDir = path.resolve(__dirname, '../../data/solana');

function loadWalletConfig() {
  const file = path.join(configDir, 'wallet.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const RPC = 'https://api.mainnet-beta.solana.com';

async function rpcCall(method, params = []) {
  const res = await fetch(RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  });
  return await res.json();
}

export const tools = [
  {
    name: 'solana_setup_wallet',
    description: 'Configure a Solana wallet address for monitoring (read-only, no private keys stored)',
    parameters: {
      type: 'object',
      properties: {
        publicKey: { type: 'string', description: 'Solana wallet public key (e.g. Phantom address)' },
        label: { type: 'string', description: 'Label for this wallet', default: 'main' }
      },
      required: ['publicKey']
    },
    execute: async (params) => {
      fs.mkdirSync(configDir, { recursive: true });
      const config = {
        publicKey: params.publicKey,
        label: params.label || 'main',
        configured: true,
        note: 'Read-only. No private keys stored.'
      };
      fs.writeFileSync(path.join(configDir, 'wallet.json'), JSON.stringify(config, null, 2));
      return { configured: true, publicKey: params.publicKey };
    }
  },
  {
    name: 'solana_balance',
    description: 'Check SOL balance of configured wallet',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const cfg = loadWalletConfig();
      if (!cfg) return { error: 'Wallet not configured. Run solana_setup_wallet first.' };
      const result = await rpcCall('getBalance', [cfg.publicKey]);
      if (result.error) return { error: result.error.message };
      const sol = (result.result?.value || 0) / 1e9;
      return { publicKey: cfg.publicKey, balanceSOL: sol };
    }
  },
  {
    name: 'solana_tokens',
    description: 'List SPL token accounts for configured wallet',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const cfg = loadWalletConfig();
      if (!cfg) return { error: 'Wallet not configured.' };
      const result = await rpcCall('getTokenAccountsByOwner', [
        cfg.publicKey,
        { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
        { encoding: 'jsonParsed' }
      ]);
      if (result.error) return { error: result.error.message };
      const accounts = (result.result?.value || []).map(a => {
        const info = a.account.data.parsed.info;
        return {
          mint: info.mint,
          amount: info.tokenAmount.uiAmountString,
          decimals: info.tokenAmount.decimals
        };
      }).filter(a => parseFloat(a.amount) > 0);
      return { tokens: accounts };
    }
  },
  {
    name: 'solana_price',
    description: 'Get current SOL price in USD',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const data = await res.json();
        return { solUSD: data.solana.usd };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'solana_token_price',
    description: 'Get price of a Solana token by CoinGecko ID',
    parameters: {
      type: 'object',
      properties: {
        tokenId: { type: 'string', description: 'CoinGecko token ID (e.g. "bonk", "raydium")' }
      },
      required: ['tokenId']
    },
    execute: async (params) => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${params.tokenId}&vs_currencies=usd,btc&include_24hr_change=true`);
        const data = await res.json();
        return data[params.tokenId] || { error: 'Token not found' };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'solana_recent_txns',
    description: 'Get recent transactions for configured wallet',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 10 }
      }
    },
    execute: async (params) => {
      const cfg = loadWalletConfig();
      if (!cfg) return { error: 'Wallet not configured.' };
      const result = await rpcCall('getSignaturesForAddress', [
        cfg.publicKey,
        { limit: params.limit || 10 }
      ]);
      if (result.error) return { error: result.error.message };
      return {
        transactions: (result.result || []).map(tx => ({
          signature: tx.signature,
          slot: tx.slot,
          blockTime: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
          err: tx.err
        }))
      };
    }
  }
];

export async function init(ctx) {
  fs.mkdirSync(configDir, { recursive: true });
  ctx.log('solana module loaded');
}

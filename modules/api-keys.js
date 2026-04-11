import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'api-keys';
export const description = 'Manage API keys and credentials for external services';
export const version = '1.0.0';

const vaultPath = path.resolve(__dirname, '../../data/vault/keys.json');

function ensureVault() {
  const dir = path.dirname(vaultPath);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(vaultPath)) {
    fs.writeFileSync(vaultPath, JSON.stringify({ keys: {} }, null, 2));
  }
}

function loadVault() {
  ensureVault();
  return JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
}

function saveVault(vault) {
  ensureVault();
  fs.writeFileSync(vaultPath, JSON.stringify(vault, null, 2));
}

export const tools = [
  {
    name: 'api_key_set',
    description: 'Store an API key for a service',
    parameters: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service name (e.g. openai, anthropic, coingecko, twitter, github)' },
        key: { type: 'string', description: 'API key value' },
        label: { type: 'string', description: 'Optional label' }
      },
      required: ['service', 'key']
    },
    execute: async (params) => {
      const vault = loadVault();
      vault.keys[params.service] = {
        key: params.key,
        label: params.label || params.service,
        added: new Date().toISOString()
      };
      saveVault(vault);
      return { stored: params.service };
    }
  },
  {
    name: 'api_key_get',
    description: 'Retrieve an API key for a service',
    parameters: {
      type: 'object',
      properties: {
        service: { type: 'string' }
      },
      required: ['service']
    },
    execute: async (params) => {
      const vault = loadVault();
      const entry = vault.keys[params.service];
      if (!entry) return { error: `No key for ${params.service}` };
      return { service: params.service, key: entry.key, label: entry.label };
    }
  },
  {
    name: 'api_key_list',
    description: 'List all stored API key services (keys hidden)',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const vault = loadVault();
      return {
        services: Object.entries(vault.keys).map(([name, v]) => ({
          service: name,
          label: v.label,
          added: v.added,
          keyPreview: v.key.slice(0, 6) + '...'
        }))
      };
    }
  },
  {
    name: 'api_key_delete',
    description: 'Remove an API key',
    parameters: {
      type: 'object',
      properties: { service: { type: 'string' } },
      required: ['service']
    },
    execute: async (params) => {
      const vault = loadVault();
      delete vault.keys[params.service];
      saveVault(vault);
      return { deleted: params.service };
    }
  }
];

export async function init(ctx) {
  ensureVault();
  ctx.log('api-keys vault module loaded');
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'http-client';
export const description = 'Make authenticated HTTP requests to any API';
export const version = '1.0.0';

const vaultPath = path.resolve(__dirname, '../../data/vault/keys.json');

function getApiKey(service) {
  try {
    if (!fs.existsSync(vaultPath)) return null;
    const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
    return vault.keys?.[service]?.key || null;
  } catch { return null; }
}

export const tools = [
  {
    name: 'http_request',
    description: 'Make an HTTP request to any URL with optional auth from vault',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        method: { type: 'string', default: 'GET' },
        headers: { type: 'string', description: 'JSON object of headers' },
        body: { type: 'string', description: 'Request body (JSON string)' },
        authService: { type: 'string', description: 'Service name from vault for Bearer auth' },
        maxChars: { type: 'number', default: 10000 }
      },
      required: ['url']
    },
    execute: async (params) => {
      const headers = params.headers ? JSON.parse(params.headers) : {};
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';

      if (params.authService) {
        const key = getApiKey(params.authService);
        if (key) headers['Authorization'] = `Bearer ${key}`;
        else return { error: `No API key for ${params.authService}` };
      }

      try {
        const opts = { method: params.method || 'GET', headers };
        if (params.body && opts.method !== 'GET') opts.body = params.body;

        const res = await fetch(params.url, opts);
        const text = await res.text();
        return {
          status: res.status,
          body: text.slice(0, params.maxChars || 10000)
        };
      } catch (err) {
        return { error: err.message };
      }
    }
  }
];

export async function init(ctx) {
  ctx.log('http-client module loaded');
}

/**
 * Multi-provider LLM adapter for Gidion.
 * Supports: ollama (local), openai, anthropic (via API keys)
 * Falls back gracefully when providers are unavailable.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vaultPath = path.resolve(__dirname, '..', 'data', 'vault', 'keys.json');

function getApiKey(service) {
  try {
    if (!fs.existsSync(vaultPath)) return null;
    const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));
    return vault.keys?.[service]?.key || null;
  } catch { return null; }
}

export async function chatWithProvider(config, messages) {
  const providerName = config.providers.default;
  const providerConfig = config.providers[providerName];

  // Try primary provider
  if (providerName === 'ollama') {
    const result = await chatOllama(providerConfig, messages);
    return result;
  }

  if (providerName === 'openai') {
    const key = getApiKey('openai') || providerConfig?.apiKey;
    if (!key) return '[error] OpenAI API key not configured. Use api_key_set to add it.';
    return await chatOpenAI(key, messages, providerConfig?.model || 'gpt-4o-mini');
  }

  if (providerName === 'anthropic') {
    const key = getApiKey('anthropic') || providerConfig?.apiKey;
    if (!key) return '[error] Anthropic API key not configured.';
    return await chatAnthropic(key, messages);
  }

  return `[error] Unknown provider: ${providerName}`;
}

async function chatOllama(cfg, messages) {
  // Try both localhost and 127.0.0.1
  const endpoints = [
    `${cfg.endpoint}/api/chat`,
    `http://localhost:11434/api/chat`,
    `http://127.0.0.1:11434/api/chat`
  ];
  const unique = [...new Set(endpoints)];
  
  for (const endpoint of unique) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: cfg.chatModel, messages, stream: false }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json?.message?.content || '[empty response]';
    } catch (err) {
      console.error(`[provider] Ollama ${endpoint}: ${err.message}`);
      continue;
    }
  }
  return '[offline] Ollama not available. Running in fallback mode.';
}

async function chatOpenAI(apiKey, messages, model) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, max_tokens: 4096 })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content || '[empty response]';
  } catch (err) {
    return `[error] OpenAI: ${err.message}`;
  }
}

async function chatAnthropic(apiKey, messages) {
  try {
    // Convert messages format for Anthropic
    const system = messages.filter(m => m.role === 'system').map(m => m.content).join('\n\n');
    const turns = messages.filter(m => m.role !== 'system');

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system,
        messages: turns
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.content?.[0]?.text || '[empty response]';
  } catch (err) {
    return `[error] Anthropic: ${err.message}`;
  }
}

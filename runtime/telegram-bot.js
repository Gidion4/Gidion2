#!/usr/bin/env node
/**
 * Gidion Telegram Bot — long-polling listener
 * Connects Gidion's orchestrator to Telegram via Bot API.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Orchestrator } from '../core/orchestrator.js';
import defaultConfig from '../config/default.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(__dirname, '../../data/telegram/config.json');

function loadTgConfig() {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const tgConfig = loadTgConfig();
const TOKEN = tgConfig.botToken;
const API = `https://api.telegram.org/bot${TOKEN}`;

let orch;

async function initOrch() {
  if (!orch) {
    orch = new Orchestrator(defaultConfig);
    await orch.init();
    orch.log('Telegram bot orchestrator ready');
  }
  return orch;
}

async function tgRequest(method, body = {}) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function sendMessage(chatId, text) {
  // Telegram max message length is 4096
  const chunks = [];
  for (let i = 0; i < text.length; i += 4000) {
    chunks.push(text.slice(i, i + 4000));
  }
  for (const chunk of chunks) {
    await tgRequest('sendMessage', { chat_id: chatId, text: chunk });
  }
}

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg || !msg.text) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const text = msg.text;

  // If allowedUsers is set and non-empty, check access
  if (tgConfig.allowedUsers.length > 0 && !tgConfig.allowedUsers.includes(userId)) {
    await sendMessage(chatId, 'Access denied.');
    return;
  }

  console.log(`[TG] ${msg.from.first_name || userId}: ${text}`);

  const o = await initOrch();

  try {
    const response = await o.respond(text);
    await sendMessage(chatId, response);
  } catch (err) {
    console.error(`[TG] Error: ${err.message}`);
    await sendMessage(chatId, `Error: ${err.message}`);
  }
}

async function poll() {
  let offset = 0;
  console.log('Gidion Telegram bot started. Listening...');

  while (true) {
    try {
      const data = await tgRequest('getUpdates', {
        offset,
        timeout: 30,
        allowed_updates: ['message']
      });

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      console.error(`[TG] Poll error: ${err.message}`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

// Start
poll();

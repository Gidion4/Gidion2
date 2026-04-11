export const name = 'telegram';
export const description = 'Telegram bot connector for Gidion';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.resolve(__dirname, '../../data/telegram');

function loadTelegramConfig() {
  const file = path.join(configDir, 'config.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export const tools = [
  {
    name: 'telegram_setup',
    description: 'Configure Telegram bot token',
    parameters: {
      type: 'object',
      properties: {
        botToken: { type: 'string', description: 'Bot token from @BotFather' },
        allowedUsers: {
          type: 'string',
          description: 'Comma-separated Telegram user IDs allowed to use the bot'
        }
      },
      required: ['botToken']
    },
    execute: async (params) => {
      fs.mkdirSync(configDir, { recursive: true });
      const config = {
        botToken: params.botToken,
        allowedUsers: params.allowedUsers
          ? params.allowedUsers.split(',').map(s => s.trim())
          : [],
        configured: true
      };
      fs.writeFileSync(path.join(configDir, 'config.json'), JSON.stringify(config, null, 2));
      return { configured: true, message: 'Telegram bot configured. Start with telegram_start.' };
    }
  },
  {
    name: 'telegram_send',
    description: 'Send a message to a Telegram chat',
    parameters: {
      type: 'object',
      properties: {
        chatId: { type: 'string' },
        text: { type: 'string' }
      },
      required: ['chatId', 'text']
    },
    execute: async (params) => {
      const cfg = loadTelegramConfig();
      if (!cfg) return { error: 'Telegram not configured' };
      const url = `https://api.telegram.org/bot${cfg.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: params.chatId, text: params.text })
      });
      return await res.json();
    }
  }
];

export async function init(ctx) {
  fs.mkdirSync(configDir, { recursive: true });
  ctx.log('telegram module loaded');
}

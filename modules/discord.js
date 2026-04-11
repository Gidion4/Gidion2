export const name = 'discord';
export const description = 'Discord bot connector for Gidion';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configDir = path.resolve(__dirname, '../../data/discord');

function loadDiscordConfig() {
  const file = path.join(configDir, 'config.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export const tools = [
  {
    name: 'discord_setup',
    description: 'Configure Discord bot token',
    parameters: {
      type: 'object',
      properties: {
        botToken: { type: 'string', description: 'Discord bot token' },
        guildId: { type: 'string', description: 'Server/guild ID (optional)' }
      },
      required: ['botToken']
    },
    execute: async (params) => {
      fs.mkdirSync(configDir, { recursive: true });
      const config = {
        botToken: params.botToken,
        guildId: params.guildId || null,
        configured: true
      };
      fs.writeFileSync(path.join(configDir, 'config.json'), JSON.stringify(config, null, 2));
      return { configured: true };
    }
  },
  {
    name: 'discord_send',
    description: 'Send a message to a Discord channel via webhook or bot API',
    parameters: {
      type: 'object',
      properties: {
        channelId: { type: 'string' },
        content: { type: 'string' }
      },
      required: ['channelId', 'content']
    },
    execute: async (params) => {
      const cfg = loadDiscordConfig();
      if (!cfg) return { error: 'Discord not configured' };
      const url = `https://discord.com/api/v10/channels/${params.channelId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${cfg.botToken}`
        },
        body: JSON.stringify({ content: params.content })
      });
      return await res.json();
    }
  }
];

export async function init(ctx) {
  fs.mkdirSync(configDir, { recursive: true });
  ctx.log('discord module loaded');
}

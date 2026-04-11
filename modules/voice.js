import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'voice';
export const description = 'Voice I/O: speak to Gidion and hear responses via Web Speech API';
export const version = '1.0.0';

export const tools = [
  {
    name: 'voice_speak',
    description: 'Make Gidion speak text aloud (TTS)',
    parameters: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to speak' },
        lang: { type: 'string', default: 'fi-FI' },
        rate: { type: 'number', default: 1.0 },
        pitch: { type: 'number', default: 1.0 }
      },
      required: ['text']
    },
    execute: async (params) => {
      return { action: 'speak', text: params.text, lang: params.lang || 'fi-FI', rate: params.rate || 1.0, pitch: params.pitch || 1.0 };
    }
  },
  {
    name: 'voice_status',
    description: 'Check voice system status',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      return { status: 'ready', mode: 'Web Speech API (browser)', stt: 'available', tts: 'available' };
    }
  }
];

export async function init(ctx) {
  ctx.log('voice module loaded (Web Speech API)');
}

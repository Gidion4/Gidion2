import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'calendar';
export const description = 'Manage calendar events via local ICS files or CalDAV';
export const version = '1.0.0';

const dataDir = path.resolve(__dirname, '../../data/calendar');

export const tools = [
  {
    name: 'calendar_add',
    description: 'Add a calendar event',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        start: { type: 'string', description: 'ISO datetime' },
        end: { type: 'string', description: 'ISO datetime (optional)' },
        description: { type: 'string' },
        location: { type: 'string' }
      },
      required: ['title', 'start']
    },
    execute: async (params) => {
      fs.mkdirSync(dataDir, { recursive: true });
      const id = Date.now().toString(36);
      const event = {
        id,
        title: params.title,
        start: params.start,
        end: params.end || null,
        description: params.description || '',
        location: params.location || '',
        created: new Date().toISOString()
      };
      const file = path.join(dataDir, `${id}.json`);
      fs.writeFileSync(file, JSON.stringify(event, null, 2));
      return { created: event };
    }
  },
  {
    name: 'calendar_list',
    description: 'List upcoming calendar events',
    parameters: {
      type: 'object',
      properties: {
        days: { type: 'number', default: 7, description: 'How many days ahead' }
      }
    },
    execute: async (params) => {
      fs.mkdirSync(dataDir, { recursive: true });
      const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
      const now = new Date();
      const horizon = new Date(now.getTime() + (params.days || 7) * 86400000);
      const events = files
        .map(f => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')))
        .filter(e => new Date(e.start) >= now && new Date(e.start) <= horizon)
        .sort((a, b) => new Date(a.start) - new Date(b.start));
      return { events };
    }
  },
  {
    name: 'calendar_delete',
    description: 'Delete a calendar event by id',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id']
    },
    execute: async (params) => {
      const file = path.join(dataDir, `${params.id}.json`);
      if (!fs.existsSync(file)) return { error: 'event not found' };
      fs.unlinkSync(file);
      return { deleted: params.id };
    }
  }
];

export async function init(ctx) {
  fs.mkdirSync(dataDir, { recursive: true });
  ctx.log('calendar module loaded');
}

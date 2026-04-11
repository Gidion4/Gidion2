import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'search';
export const description = 'Search local files by content or name';
export const version = '1.0.0';

export const tools = [
  {
    name: 'search_files',
    description: 'Search for files by name pattern',
    parameters: {
      type: 'object',
      properties: {
        dir: { type: 'string', description: 'Directory to search' },
        pattern: { type: 'string', description: 'Filename pattern (substring match)' },
        maxResults: { type: 'number', default: 20 }
      },
      required: ['dir', 'pattern']
    },
    execute: async (params) => {
      const results = [];
      function walk(dir, depth = 0) {
        if (depth > 5 || results.length >= (params.maxResults || 20)) return;
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (results.length >= (params.maxResults || 20)) break;
            const full = path.join(dir, entry.name);
            if (entry.name.includes(params.pattern)) {
              results.push({ path: full, type: entry.isDirectory() ? 'dir' : 'file' });
            }
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
              walk(full, depth + 1);
            }
          }
        } catch {}
      }
      walk(params.dir);
      return { results };
    }
  },
  {
    name: 'search_content',
    description: 'Search file contents for a string (grep-like)',
    parameters: {
      type: 'object',
      properties: {
        dir: { type: 'string' },
        query: { type: 'string' },
        extensions: { type: 'string', description: 'Comma-separated file extensions, e.g. js,md,json' },
        maxResults: { type: 'number', default: 20 }
      },
      required: ['dir', 'query']
    },
    execute: async (params) => {
      const results = [];
      const exts = params.extensions ? params.extensions.split(',').map(e => '.' + e.trim()) : null;

      function walk(dir, depth = 0) {
        if (depth > 5 || results.length >= (params.maxResults || 20)) return;
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (results.length >= (params.maxResults || 20)) break;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
              walk(full, depth + 1);
            } else if (entry.isFile()) {
              if (exts && !exts.some(e => entry.name.endsWith(e))) continue;
              try {
                const content = fs.readFileSync(full, 'utf8');
                const lines = content.split('\n');
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].toLowerCase().includes(params.query.toLowerCase())) {
                    results.push({ file: full, line: i + 1, text: lines[i].trim().slice(0, 200) });
                    if (results.length >= (params.maxResults || 20)) return;
                  }
                }
              } catch {}
            }
          }
        } catch {}
      }
      walk(params.dir);
      return { results };
    }
  }
];

export async function init(ctx) {
  ctx.log('search module loaded');
}

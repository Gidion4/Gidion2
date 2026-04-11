import fs from 'fs';
import path from 'path';

export const name = 'files';
export const description = 'Read, write, list, and search files';
export const version = '1.0.0';

export const tools = [
  {
    name: 'read_file',
    description: 'Read a file and return its contents',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File path' },
        maxBytes: { type: 'number', default: 50000 }
      },
      required: ['path']
    },
    execute: async (params) => {
      const content = fs.readFileSync(params.path, 'utf8');
      return { content: content.slice(0, params.maxBytes || 50000) };
    }
  },
  {
    name: 'write_file',
    description: 'Write content to a file',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        content: { type: 'string' }
      },
      required: ['path', 'content']
    },
    execute: async (params) => {
      fs.mkdirSync(path.dirname(params.path), { recursive: true });
      fs.writeFileSync(params.path, params.content);
      return { written: params.path };
    }
  },
  {
    name: 'list_dir',
    description: 'List directory contents',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        recursive: { type: 'boolean', default: false }
      },
      required: ['path']
    },
    execute: async (params) => {
      const entries = fs.readdirSync(params.path, { withFileTypes: true });
      return {
        entries: entries.map(e => ({
          name: e.name,
          type: e.isDirectory() ? 'dir' : 'file'
        }))
      };
    }
  }
];

export async function init(ctx) {
  ctx.log('files module loaded');
}

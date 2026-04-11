import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'code-tools';
export const description = 'Advanced coding tools: create projects, run tests, lint, build, deploy';
export const version = '1.0.0';

export const tools = [
  {
    name: 'code_create_project',
    description: 'Scaffold a new project (node, python, html, express)',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string', description: 'node|python|html|express' },
        dir: { type: 'string' }
      },
      required: ['name', 'type']
    },
    execute: async (params) => {
      const projectDir = params.dir || path.resolve(process.cwd(), params.name);
      fs.mkdirSync(projectDir, { recursive: true });
      if (params.type === 'node') {
        fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify({
          name: params.name, version: '1.0.0', type: 'module', private: true,
          scripts: { start: 'node index.js' }
        }, null, 2));
        fs.writeFileSync(path.join(projectDir, 'index.js'), `console.log("Hello from ${params.name}");\n`);
      } else if (params.type === 'python') {
        fs.writeFileSync(path.join(projectDir, 'main.py'), `print("Hello from ${params.name}")\n`);
        fs.writeFileSync(path.join(projectDir, 'requirements.txt'), '');
      } else if (params.type === 'html') {
        fs.writeFileSync(path.join(projectDir, 'index.html'), `<!DOCTYPE html>\n<html><head><title>${params.name}</title></head>\n<body><h1>${params.name}</h1></body></html>\n`);
      }
      return { created: projectDir, type: params.type };
    }
  },
  {
    name: 'code_run',
    description: 'Run a command in a project directory',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        cwd: { type: 'string' },
        timeout: { type: 'number', default: 60000 }
      },
      required: ['command']
    },
    execute: async (params) => {
      try {
        const output = execSync(params.command, {
          cwd: params.cwd || process.cwd(), encoding: 'utf8',
          timeout: params.timeout || 60000, stdio: ['pipe', 'pipe', 'pipe']
        });
        return { output: output.trim().slice(-3000) };
      } catch (err) {
        return { error: err.message, stderr: err.stderr?.trim()?.slice(-1000) };
      }
    }
  },
  {
    name: 'code_read',
    description: 'Read a source file with line numbers',
    parameters: {
      type: 'object',
      properties: { filePath: { type: 'string' }, from: { type: 'number' }, to: { type: 'number' } },
      required: ['filePath']
    },
    execute: async (params) => {
      const content = fs.readFileSync(params.filePath, 'utf8');
      const lines = content.split('\n');
      const from = (params.from || 1) - 1;
      const to = params.to || lines.length;
      return { content: lines.slice(from, to).map((l, i) => `${from + i + 1}: ${l}`).join('\n') };
    }
  },
  {
    name: 'code_edit',
    description: 'Edit a file: find/replace or insert at line',
    parameters: {
      type: 'object',
      properties: {
        filePath: { type: 'string' },
        find: { type: 'string' }, replace: { type: 'string' },
        insertAt: { type: 'number' }, insertText: { type: 'string' }
      },
      required: ['filePath']
    },
    execute: async (params) => {
      let content = fs.readFileSync(params.filePath, 'utf8');
      if (params.find && params.replace !== undefined) {
        content = content.replace(params.find, params.replace);
      } else if (params.insertAt && params.insertText) {
        const lines = content.split('\n');
        lines.splice(params.insertAt - 1, 0, params.insertText);
        content = lines.join('\n');
      } else {
        return { error: 'Specify find/replace or insertAt/insertText' };
      }
      fs.writeFileSync(params.filePath, content);
      return { edited: params.filePath };
    }
  },
  {
    name: 'code_tree',
    description: 'Show project directory tree',
    parameters: {
      type: 'object',
      properties: { dir: { type: 'string' }, depth: { type: 'number', default: 3 } },
      required: ['dir']
    },
    execute: async (params) => {
      try {
        const output = execSync(
          `find ${params.dir} -maxdepth ${params.depth || 3} -not -path '*/node_modules/*' -not -path '*/.git/*' | sort | head -100`,
          { encoding: 'utf8', timeout: 10000 }
        );
        return { tree: output.trim() };
      } catch (err) { return { error: err.message }; }
    }
  }
];

export async function init(ctx) {
  ctx.log('code-tools module loaded');
}

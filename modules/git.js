import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'git';
export const description = 'Git version control operations';
export const version = '1.0.0';

function gitCmd(cmd, cwd) {
  return execSync(`git ${cmd}`, {
    cwd: cwd || process.cwd(),
    encoding: 'utf8',
    timeout: 30000,
    stdio: ['pipe', 'pipe', 'pipe']
  }).trim();
}

export const tools = [
  {
    name: 'git_status',
    description: 'Show git status',
    parameters: {
      type: 'object',
      properties: { cwd: { type: 'string' } }
    },
    execute: async (params) => {
      try { return { output: gitCmd('status --short', params.cwd) }; }
      catch (err) { return { error: err.message }; }
    }
  },
  {
    name: 'git_commit',
    description: 'Stage all changes and commit',
    parameters: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        cwd: { type: 'string' }
      },
      required: ['message']
    },
    execute: async (params) => {
      try {
        gitCmd('add -A', params.cwd);
        return { output: gitCmd(`commit -m "${params.message}"`, params.cwd) };
      } catch (err) { return { error: err.message }; }
    }
  },
  {
    name: 'git_log',
    description: 'Show recent git log',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', default: 10 },
        cwd: { type: 'string' }
      }
    },
    execute: async (params) => {
      try {
        return { output: gitCmd(`log --oneline -${params.limit || 10}`, params.cwd) };
      } catch (err) { return { error: err.message }; }
    }
  },
  {
    name: 'git_diff',
    description: 'Show current diff',
    parameters: {
      type: 'object',
      properties: {
        file: { type: 'string' },
        cwd: { type: 'string' }
      }
    },
    execute: async (params) => {
      try {
        const cmd = params.file ? `diff -- ${params.file}` : 'diff';
        return { output: gitCmd(cmd, params.cwd).slice(0, 5000) };
      } catch (err) { return { error: err.message }; }
    }
  },
  {
    name: 'git_branch',
    description: 'List, create, or switch branches',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'list|create|switch' },
        name: { type: 'string' },
        cwd: { type: 'string' }
      },
      required: ['action']
    },
    execute: async (params) => {
      try {
        const cmds = {
          list: 'branch -a',
          create: `checkout -b ${params.name}`,
          switch: `checkout ${params.name}`
        };
        return { output: gitCmd(cmds[params.action], params.cwd) };
      } catch (err) { return { error: err.message }; }
    }
  }
];

export async function init(ctx) {
  ctx.log('git module loaded');
}

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export const name = 'shell';
export const description = 'Execute shell commands safely';
export const version = '1.0.0';

export const tools = [
  {
    name: 'run_shell',
    description: 'Run a shell command and return output',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Shell command to execute' },
        cwd: { type: 'string', description: 'Working directory (optional)' },
        timeout: { type: 'number', description: 'Timeout in ms', default: 30000 }
      },
      required: ['command']
    },
    execute: async (params, ctx) => {
      if (ctx.config.security.confirmDestructive) {
        const dangerous = ['rm -rf', 'mkfs', 'dd if=', 'format', '> /dev/'];
        if (dangerous.some(d => params.command.includes(d))) {
          return { error: 'Blocked: destructive command requires confirmation' };
        }
      }
      try {
        const output = execSync(params.command, {
          cwd: params.cwd || process.cwd(),
          encoding: 'utf8',
          timeout: params.timeout || 30000,
          stdio: ['pipe', 'pipe', 'pipe']
        });
        return { output: output.trim() };
      } catch (err) {
        return { error: err.message, stderr: err.stderr?.trim() };
      }
    }
  }
];

export async function init(ctx) {
  ctx.log('shell module loaded');
}

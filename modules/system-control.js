import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'system-control';
export const description = 'Full system control: processes, packages, services, network, clipboard, screenshots';
export const version = '1.0.0';

export const tools = [
  {
    name: 'sys_exec',
    description: 'Execute any shell command with full system access',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string' },
        cwd: { type: 'string' },
        timeout: { type: 'number', default: 60000 }
      },
      required: ['command']
    },
    execute: async (params, ctx) => {
      try {
        const output = execSync(params.command, {
          cwd: params.cwd || process.cwd(),
          encoding: 'utf8',
          timeout: params.timeout || 60000,
          stdio: ['pipe', 'pipe', 'pipe'],
          maxBuffer: 10 * 1024 * 1024
        });
        return { output: output.trim() };
      } catch (err) {
        return { error: err.message, stderr: err.stderr?.trim(), code: err.status };
      }
    }
  },
  {
    name: 'sys_install_package',
    description: 'Install a system package via apt',
    parameters: {
      type: 'object',
      properties: {
        packages: { type: 'string', description: 'Space-separated package names' }
      },
      required: ['packages']
    },
    execute: async (params) => {
      try {
        const output = execSync(`sudo apt-get install -y ${params.packages}`, {
          encoding: 'utf8', timeout: 300000, stdio: ['pipe', 'pipe', 'pipe']
        });
        return { installed: params.packages, output: output.slice(-500) };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'sys_npm_install',
    description: 'Install npm packages globally or locally',
    parameters: {
      type: 'object',
      properties: {
        packages: { type: 'string' },
        global: { type: 'boolean', default: false },
        cwd: { type: 'string' }
      },
      required: ['packages']
    },
    execute: async (params) => {
      const flag = params.global ? '-g' : '';
      try {
        const output = execSync(`npm install ${flag} ${params.packages}`, {
          cwd: params.cwd || process.cwd(),
          encoding: 'utf8', timeout: 120000, stdio: ['pipe', 'pipe', 'pipe']
        });
        return { installed: params.packages, output: output.slice(-500) };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'sys_processes',
    description: 'List running processes',
    parameters: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Filter by name (optional)' }
      }
    },
    execute: async (params) => {
      try {
        let cmd = 'ps aux --sort=-%mem | head -30';
        if (params.filter) cmd = `ps aux | grep -i ${params.filter} | grep -v grep`;
        const output = execSync(cmd, { encoding: 'utf8', timeout: 10000 });
        return { processes: output.trim() };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'sys_services',
    description: 'Manage systemd services (start/stop/restart/status)',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'start|stop|restart|status|enable|disable' },
        service: { type: 'string' }
      },
      required: ['action', 'service']
    },
    execute: async (params) => {
      try {
        const output = execSync(`sudo systemctl ${params.action} ${params.service}`, {
          encoding: 'utf8', timeout: 30000, stdio: ['pipe', 'pipe', 'pipe']
        });
        return { action: params.action, service: params.service, output: output.trim() };
      } catch (err) {
        return { output: err.stdout?.trim(), stderr: err.stderr?.trim() };
      }
    }
  },
  {
    name: 'sys_network',
    description: 'Network diagnostics (ping, curl, ports, ip)',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'ping|curl|ports|ip|dns' },
        target: { type: 'string' }
      },
      required: ['action']
    },
    execute: async (params) => {
      const cmds = {
        ping: `ping -c 3 ${params.target || '8.8.8.8'}`,
        curl: `curl -sI ${params.target || 'https://google.com'} | head -20`,
        ports: 'ss -tlnp | head -20',
        ip: 'ip addr show | grep inet',
        dns: `dig +short ${params.target || 'google.com'}`
      };
      try {
        const output = execSync(cmds[params.action] || 'echo "unknown action"', {
          encoding: 'utf8', timeout: 15000
        });
        return { output: output.trim() };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'sys_disk',
    description: 'Check disk usage',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      try {
        const output = execSync('df -h | head -10 && echo "---" && du -sh /home/ubuntu/.openclaw/workspace/assistant/ 2>/dev/null', {
          encoding: 'utf8', timeout: 10000
        });
        return { output: output.trim() };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'sys_env',
    description: 'Get or set environment variables',
    parameters: {
      type: 'object',
      properties: {
        get: { type: 'string', description: 'Variable name to read' },
        set: { type: 'string', description: 'VAR=value to set' }
      }
    },
    execute: async (params) => {
      if (params.set) {
        const [key, ...val] = params.set.split('=');
        process.env[key] = val.join('=');
        return { set: key };
      }
      if (params.get) {
        return { [params.get]: process.env[params.get] || null };
      }
      return { error: 'Specify get or set' };
    }
  }
];

export async function init(ctx) {
  ctx.log('system-control module loaded (full access)');
}

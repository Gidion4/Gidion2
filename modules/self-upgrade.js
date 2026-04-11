import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gidionRoot = path.resolve(__dirname, '..');
const pendingDir = path.resolve(__dirname, '../../data/upgrades/pending');
const appliedDir = path.resolve(__dirname, '../../data/upgrades/applied');
const logFile = path.resolve(__dirname, '../../data/upgrades/upgrade-log.json');

export const name = 'self-upgrade';
export const description = 'Self-modification system: plan, create, test, and apply upgrades to Gidion';
export const version = '2.0.0';

function ensureDirs() {
  [pendingDir, appliedDir, path.dirname(logFile)].forEach(d => fs.mkdirSync(d, { recursive: true }));
  if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '[]');
}

function loadLog() {
  ensureDirs();
  return JSON.parse(fs.readFileSync(logFile, 'utf8'));
}

function appendLog(entry) {
  const log = loadLog();
  log.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(logFile, JSON.stringify(log, null, 2));
}

export const tools = [
  {
    name: 'upgrade_plan',
    description: 'Create an upgrade plan: what to change, why, and which files',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Upgrade name' },
        description: { type: 'string', description: 'What this upgrade does' },
        files: { type: 'string', description: 'JSON array of {path, action, description}' },
        reason: { type: 'string' }
      },
      required: ['name', 'description']
    },
    execute: async (params) => {
      ensureDirs();
      const id = Date.now().toString(36);
      const plan = {
        id,
        name: params.name,
        description: params.description,
        files: params.files ? JSON.parse(params.files) : [],
        reason: params.reason || '',
        status: 'pending',
        created: new Date().toISOString()
      };
      fs.writeFileSync(path.join(pendingDir, `${id}.json`), JSON.stringify(plan, null, 2));
      appendLog({ action: 'planned', id, name: params.name });
      return { planned: plan };
    }
  },
  {
    name: 'upgrade_write_file',
    description: 'Write a file as part of an upgrade (creates or overwrites)',
    parameters: {
      type: 'object',
      properties: {
        upgradeId: { type: 'string' },
        filePath: { type: 'string', description: 'Path relative to gidion root' },
        content: { type: 'string' }
      },
      required: ['upgradeId', 'filePath', 'content']
    },
    execute: async (params) => {
      const fullPath = path.resolve(gidionRoot, params.filePath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, params.content);
      appendLog({ action: 'file_written', upgradeId: params.upgradeId, file: params.filePath });
      return { written: params.filePath };
    }
  },
  {
    name: 'upgrade_test',
    description: 'Run a test command to verify an upgrade works',
    parameters: {
      type: 'object',
      properties: {
        upgradeId: { type: 'string' },
        command: { type: 'string' }
      },
      required: ['upgradeId', 'command']
    },
    execute: async (params) => {
      try {
        const output = execSync(params.command, {
          cwd: gidionRoot,
          encoding: 'utf8',
          timeout: 30000,
          stdio: ['pipe', 'pipe', 'pipe']
        });
        appendLog({ action: 'test_passed', upgradeId: params.upgradeId, command: params.command });
        return { passed: true, output: output.trim().slice(-1000) };
      } catch (err) {
        appendLog({ action: 'test_failed', upgradeId: params.upgradeId, command: params.command, error: err.message });
        return { passed: false, error: err.message, stderr: err.stderr?.trim() };
      }
    }
  },
  {
    name: 'upgrade_apply',
    description: 'Mark an upgrade as applied (move from pending to applied)',
    parameters: {
      type: 'object',
      properties: {
        upgradeId: { type: 'string' }
      },
      required: ['upgradeId']
    },
    execute: async (params) => {
      const src = path.join(pendingDir, `${params.upgradeId}.json`);
      if (!fs.existsSync(src)) return { error: 'Upgrade not found' };
      const plan = JSON.parse(fs.readFileSync(src, 'utf8'));
      plan.status = 'applied';
      plan.appliedAt = new Date().toISOString();
      fs.writeFileSync(path.join(appliedDir, `${params.upgradeId}.json`), JSON.stringify(plan, null, 2));
      fs.unlinkSync(src);
      appendLog({ action: 'applied', upgradeId: params.upgradeId, name: plan.name });
      return { applied: plan };
    }
  },
  {
    name: 'upgrade_rollback',
    description: 'Rollback an upgrade using git',
    parameters: {
      type: 'object',
      properties: {
        upgradeId: { type: 'string' },
        files: { type: 'string', description: 'Space-separated file paths to restore' }
      },
      required: ['upgradeId']
    },
    execute: async (params) => {
      try {
        const cmd = params.files
          ? `git checkout HEAD -- ${params.files}`
          : 'git checkout HEAD -- .';
        const output = execSync(cmd, { cwd: gidionRoot, encoding: 'utf8', timeout: 15000 });
        appendLog({ action: 'rollback', upgradeId: params.upgradeId });
        return { rolledBack: true, output: output.trim() };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'upgrade_list',
    description: 'List pending and applied upgrades',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      ensureDirs();
      const pending = fs.readdirSync(pendingDir).filter(f => f.endsWith('.json'))
        .map(f => JSON.parse(fs.readFileSync(path.join(pendingDir, f), 'utf8')));
      const applied = fs.readdirSync(appliedDir).filter(f => f.endsWith('.json'))
        .map(f => JSON.parse(fs.readFileSync(path.join(appliedDir, f), 'utf8')));
      return { pending, applied: applied.slice(-20) };
    }
  },
  {
    name: 'upgrade_log',
    description: 'View upgrade history log',
    parameters: {
      type: 'object',
      properties: { limit: { type: 'number', default: 20 } }
    },
    execute: async (params) => {
      const log = loadLog();
      return { log: log.slice(-(params.limit || 20)) };
    }
  }
];

export async function init(ctx) {
  ensureDirs();
  ctx.log('self-upgrade module loaded');
}

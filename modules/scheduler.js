import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'scheduler';
export const description = 'Schedule and manage recurring tasks, cron jobs, and background automations';
export const version = '1.0.0';

const dataDir = path.resolve(__dirname, '../../data/scheduler');

function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

function loadTasks() {
  const file = path.join(dataDir, 'tasks.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveTasks(tasks) {
  fs.writeFileSync(path.join(dataDir, 'tasks.json'), JSON.stringify(tasks, null, 2));
}

export const tools = [
  {
    name: 'task_create',
    description: 'Create a scheduled/recurring task',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        command: { type: 'string', description: 'Shell command or agent call to execute' },
        intervalMinutes: { type: 'number', description: 'Run every N minutes (0 = one-shot)' },
        enabled: { type: 'boolean', default: true }
      },
      required: ['name', 'command']
    },
    execute: async (params) => {
      ensureDir();
      const tasks = loadTasks();
      const task = {
        id: Date.now().toString(36),
        name: params.name,
        description: params.description || '',
        command: params.command,
        intervalMinutes: params.intervalMinutes || 0,
        enabled: params.enabled !== false,
        created: new Date().toISOString(),
        lastRun: null,
        runCount: 0
      };
      tasks.push(task);
      saveTasks(tasks);
      return { created: task };
    }
  },
  {
    name: 'task_list',
    description: 'List all scheduled tasks',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      return { tasks: loadTasks() };
    }
  },
  {
    name: 'task_run',
    description: 'Run a task immediately by ID',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id']
    },
    execute: async (params) => {
      const tasks = loadTasks();
      const task = tasks.find(t => t.id === params.id);
      if (!task) return { error: 'Task not found' };
      try {
        const output = execSync(task.command, {
          encoding: 'utf8', timeout: 120000,
          cwd: path.resolve(__dirname, '../..'),
          stdio: ['pipe', 'pipe', 'pipe']
        });
        task.lastRun = new Date().toISOString();
        task.runCount++;
        saveTasks(tasks);
        return { ran: task.name, output: output.trim().slice(-2000) };
      } catch (err) {
        return { error: err.message };
      }
    }
  },
  {
    name: 'task_toggle',
    description: 'Enable or disable a task',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        enabled: { type: 'boolean' }
      },
      required: ['id', 'enabled']
    },
    execute: async (params) => {
      const tasks = loadTasks();
      const task = tasks.find(t => t.id === params.id);
      if (!task) return { error: 'Task not found' };
      task.enabled = params.enabled;
      saveTasks(tasks);
      return { toggled: task.name, enabled: task.enabled };
    }
  },
  {
    name: 'task_delete',
    description: 'Delete a task',
    parameters: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id']
    },
    execute: async (params) => {
      let tasks = loadTasks();
      tasks = tasks.filter(t => t.id !== params.id);
      saveTasks(tasks);
      return { deleted: params.id };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('scheduler module loaded');
}

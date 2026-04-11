/**
 * Autonomous Scheduler - The 24/7 Brain
 * 
 * Keeps Gidion alive and working around the clock.
 * Manages cron jobs, checks, autonomous tasks.
 */
export const name = 'autonomous-scheduler';
export const description = '24/7 autonomous operation, continuous monitoring, scheduled tasks';
export const version = '1.0.0';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data/blacksmith/autonomous');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }

const STATE_FILE = path.join(dataDir, 'state.json');
const TASKS_FILE = path.join(dataDir, 'tasks.json');

function loadState() {
  ensureDir();
  return fs.existsSync(STATE_FILE) ? JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')) : {
    running: false, startedAt: null, lastHeartbeat: null,
    activeTasks: [], completedCycles: 0, errors: []
  };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadTasks() {
  ensureDir();
  return fs.existsSync(TASKS_FILE) ? JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')) : [];
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Default autonomous tasks
const DEFAULT_TASKS = [
  {
    id: 'heartbeat',
    name: 'System Heartbeat',
    interval: 5, // minutes
    action: 'heartbeat',
    enabled: true,
    description: 'Keep system alive, check health'
  },
  {
    id: 'social_scan',
    name: 'Social Media Scan',
    interval: 30,
    action: 'social_scan',
    enabled: true,
    description: 'Scan for trending topics'
  },
  {
    id: 'market_check',
    name: 'Market Check',
    interval: 15,
    action: 'market_check',
    enabled: true,
    description: 'Check market conditions'
  },
  {
    id: 'night_scan',
    name: 'Night Mode Scan',
    interval: 60,
    action: 'night_scan',
    enabled: true,
    description: 'Opportunistic scanning (night mode)'
  },
  {
    id: 'portfolio_review',
    name: 'Portfolio Review',
    interval: 120,
    action: 'portfolio_review',
    enabled: true,
    description: 'Review positions and performance'
  }
];

export const tools = [
  {
    name: 'auto_status',
    description: 'Get autonomous operation status',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const state = loadState();
      const tasks = loadTasks().length > 0 ? loadTasks() : DEFAULT_TASKS;
      const active = tasks.filter(t => t.enabled);
      return {
        running: state.running,
        uptime: state.startedAt ? Math.round((Date.now() - new Date(state.startedAt).getTime()) / 60000) + ' min' : '0 min',
        last_heartbeat: state.lastHeartbeat,
        completed_cycles: state.completedCycles,
        active_tasks: active.map(t => ({ id: t.id, name: t.name, interval_min: t.interval })),
        error_count: state.errors.length,
        recent_errors: state.errors.slice(-5)
      };
    }
  },
  {
    name: 'auto_start',
    description: 'Start autonomous operation',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      let state = loadState();
      if (state.running) return { already_running: true, uptime: state.startedAt };
      
      state.running = true;
      state.startedAt = new Date().toISOString();
      state.lastHeartbeat = new Date().toISOString();
      saveState(state);
      
      // Initialize tasks
      let tasks = loadTasks();
      if (tasks.length === 0) {
        tasks = DEFAULT_TASKS;
        saveTasks(tasks);
      }
      
      return { started: true, started_at: state.startedAt, tasks: tasks.filter(t => t.enabled).length };
    }
  },
  {
    name: 'auto_stop',
    description: 'Stop autonomous operation',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      let state = loadState();
      state.running = false;
      saveState(state);
      return { stopped: true };
    }
  },
  {
    name: 'auto_heartbeat',
    description: 'Send heartbeat to keep autonomous mode alive',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      let state = loadState();
      if (!state.running) return { error: 'Autonomous mode not running' };
      
      state.lastHeartbeat = new Date().toISOString();
      state.completedCycles++;
      saveState(state);
      
      const tasks = loadTasks().length > 0 ? loadTasks() : DEFAULT_TASKS;
      const active = tasks.filter(t => t.enabled);
      
      return {
        heartbeat: true,
        cycle: state.completedCycles,
        active_tasks: active.length,
        next_check: 'in ' + Math.min(...active.map(t => t.interval)) + ' min'
      };
    }
  },
  {
    name: 'auto_add_task',
    description: 'Add an autonomous task',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        action: { type: 'string' },
        interval_minutes: { type: 'number' },
        enabled: { type: 'boolean', default: true }
      },
      required: ['name', 'action', 'interval_minutes']
    },
    execute: async (params) => {
      const tasks = loadTasks();
      const newTask = {
        id: 'task-' + Date.now().toString(36),
        name: params.name,
        action: params.action,
        interval: params.interval_minutes,
        enabled: params.enabled !== false,
        lastRun: null,
        nextRun: new Date(Date.now() + params.interval_minutes * 60000).toISOString(),
        created: new Date().toISOString()
      };
      tasks.push(newTask);
      saveTasks(tasks);
      return { added: newTask.name, id: newTask.id, interval_min: newTask.interval };
    }
  },
  {
    name: 'auto_list_tasks',
    description: 'List all autonomous tasks',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const tasks = loadTasks().length > 0 ? loadTasks() : DEFAULT_TASKS;
      return { tasks, count: tasks.length, enabled: tasks.filter(t => t.enabled).length };
    }
  },
  {
    name: 'auto_remove_task',
    description: 'Remove an autonomous task',
    parameters: { type: 'object', properties: { task_id: { type: 'string' } }, required: ['task_id'] },
    execute: async (params) => {
      let tasks = loadTasks();
      const before = tasks.length;
      tasks = tasks.filter(t => t.id !== params.task_id);
      saveTasks(tasks);
      return { removed: tasks.length < before, remaining: tasks.length };
    }
  },
  {
    name: 'auto_trigger_task',
    description: 'Trigger a task manually',
    parameters: { type: 'object', properties: { task_id: { type: 'string' } }, required: ['task_id'] },
    execute: async (params) => {
      const tasks = loadTasks().length > 0 ? loadTasks() : DEFAULT_TASKS;
      const task = tasks.find(t => t.id === params.task_id);
      if (!task) return { error: 'Task not found' };
      
      return {
        triggered: task.name,
        action: task.action,
        status: 'Would execute ' + task.action,
        note: 'Actual execution requires full system context'
      };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  // Auto-start if not already running
  const state = loadState();
  if (!state.running) {
    state.running = true;
    state.startedAt = state.startedAt || new Date().toISOString();
    state.lastHeartbeat = new Date().toISOString();
    saveState(state);
    ctx.log('Autonomous scheduler auto-started');
  }
  ctx.log('autonomous-scheduler module loaded');
}

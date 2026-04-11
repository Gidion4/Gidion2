import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const name = 'tasks';
export const description = 'Task board: manage goals, projects, and to-do items with progress tracking';
export const version = '1.0.0';

const dataDir = path.resolve(__dirname, '../../data/tasks');
function ensureDir() { fs.mkdirSync(dataDir, { recursive: true }); }
function loadTasks() {
  ensureDir();
  const file = path.join(dataDir, 'board.json');
  if (!fs.existsSync(file)) return { columns: { backlog: [], active: [], done: [] }, lastUpdated: null };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function saveTasks(data) { fs.writeFileSync(path.join(dataDir, 'board.json'), JSON.stringify(data, null, 2)); }

export const tools = [
  {
    name: 'task_add',
    description: 'Add a task to the board',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'string', default: 'medium', enum: ['low', 'medium', 'high', 'critical'] },
        column: { type: 'string', default: 'backlog', enum: ['backlog', 'active', 'done'] },
        tags: { type: 'string', description: 'Comma-separated tags' }
      },
      required: ['title']
    },
    execute: async (params) => {
      const board = loadTasks();
      const task = {
        id: Date.now().toString(36),
        title: params.title,
        description: params.description || '',
        priority: params.priority || 'medium',
        tags: params.tags ? params.tags.split(',').map(t => t.trim()) : [],
        column: params.column || 'backlog',
        created: new Date().toISOString(),
        completed: null
      };
      board.columns[params.column || 'backlog'].push(task);
      board.lastUpdated = new Date().toISOString();
      saveTasks(board);
      return { added: task };
    }
  },
  {
    name: 'task_list',
    description: 'Get full task board with all columns',
    parameters: { type: 'object', properties: {} },
    execute: async () => {
      const board = loadTasks();
      const summary = {};
      for (const [col, tasks] of Object.entries(board.columns)) {
        summary[col] = { count: tasks.length, tasks: tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, tags: t.tags })) };
      }
      return summary;
    }
  },
  {
    name: 'task_move',
    description: 'Move a task to another column or reorder',
    parameters: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        to: { type: 'string', enum: ['backlog', 'active', 'done'] }
      },
      required: ['id', 'to']
    },
    execute: async (params) => {
      const board = loadTasks();
      let task = null;
      for (const col of Object.keys(board.columns)) {
        const idx = board.columns[col].findIndex(t => t.id === params.id);
        if (idx !== -1) { task = board.columns[col].splice(idx, 1)[0]; break; }
      }
      if (!task) return { error: 'Task not found' };
      task.column = params.to;
      if (params.to === 'done') task.completed = new Date().toISOString();
      board.columns[params.to].push(task);
      board.lastUpdated = new Date().toISOString();
      saveTasks(board);
      return { moved: task.title, to: params.to };
    }
  },
  {
    name: 'task_delete',
    description: 'Delete a task',
    parameters: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] },
    execute: async (params) => {
      const board = loadTasks();
      for (const col of Object.keys(board.columns)) {
        const idx = board.columns[col].findIndex(t => t.id === params.id);
        if (idx !== -1) { board.columns[col].splice(idx, 1); saveTasks(board); return { deleted: params.id }; }
      }
      return { error: 'Not found' };
    }
  }
];

export async function init(ctx) {
  ensureDir();
  ctx.log('tasks module loaded (task board)');
}

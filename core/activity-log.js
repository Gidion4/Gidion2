import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.resolve(__dirname, '../../data/activity/live.json');

class ActivityLog extends EventEmitter {
  constructor() {
    super();
    this.tasks = new Map();
    this.history = [];
    this.maxHistory = 200;
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
  }

  startTask(id, info) {
    const task = { id, ...info, status: 'running', startedAt: Date.now(), steps: [], progress: 0 };
    this.tasks.set(id, task);
    this.emit('update', this.getState());
    this.persist();
    return id;
  }

  updateTask(id, update) {
    const task = this.tasks.get(id);
    if (!task) return;
    Object.assign(task, update);
    if (update.step) task.steps.push({ text: update.step, at: Date.now() });
    this.emit('update', this.getState());
    this.persist();
  }

  completeTask(id, result) {
    const task = this.tasks.get(id);
    if (!task) return;
    task.status = 'done';
    task.completedAt = Date.now();
    task.result = result;
    task.duration = task.completedAt - task.startedAt;
    this.history.unshift(task);
    if (this.history.length > this.maxHistory) this.history.pop();
    this.tasks.delete(id);
    this.emit('update', this.getState());
    this.persist();
  }

  failTask(id, error) {
    const task = this.tasks.get(id);
    if (!task) return;
    task.status = 'failed';
    task.error = error;
    task.completedAt = Date.now();
    this.history.unshift(task);
    this.tasks.delete(id);
    this.emit('update', this.getState());
    this.persist();
  }

  getState() {
    return {
      active: [...this.tasks.values()],
      recent: this.history.slice(0, 20),
      timestamp: Date.now()
    };
  }

  persist() {
    try { fs.writeFileSync(logFile, JSON.stringify(this.getState(), null, 2)); } catch {}
  }
}

export const activityLog = new ActivityLog();

import http from 'http';
import url from 'url';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { activityLog } from './activity-log.js';
import config from '../config/default.js';
import { Orchestrator } from './orchestrator.js';

const PORT = 3210;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const PROJECT_ROOT = resolve(__dirname, '..');

const orch = new Orchestrator(config);

async function handler(req, res) {
  const { pathname, query } = url.parse(req.url, true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  try {
    if (pathname === '/api/chat' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { message } = JSON.parse(body);
      const response = await orch.respond(message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response }));
      return;
    }
    if (pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        version: config.version || '0.2.0',
        mode: 'local',
        modules: [...orch.modules.keys()],
        tools: [...orch.tools.keys()],
        agents: [...orch.agents.keys()],
      }));
      return;
    }
    if (pathname === '/api/activity') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(activityLog.getState()));
      return;
    }
    if (pathname === '/api/portfolio') {
      const pfPath = resolve(PROJECT_ROOT, 'data', 'trading', 'portfolio.json');
      if (existsSync(pfPath)) {
        const pf = JSON.parse(readFileSync(pfPath, 'utf8'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(pf));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ balanceUSD: 10000, holdings: {} }));
      }
      return;
    }

    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = resolve(PROJECT_ROOT, 'ui', '.' + filePath);
    if (existsSync(filePath)) {
      const ext = '.' + filePath.split('.').pop();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(readFileSync(filePath));
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function main() {
  await orch.init();
  activityLog.startTask('init', { type: 'system', title: 'Gidion Core Initialized', info: `Loaded ${orch.modules.size} modules, ${orch.tools.size} tools` });
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    activityLog.updateTask('init', { step: `API listening on :${PORT}` });
    activityLog.completeTask('init', `Server running on :${PORT}`);
    console.error(`Gidion API listening on http://localhost:${PORT}`);
  });
}

main().catch(console.error);

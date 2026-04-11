import http from 'http';
import url from 'url';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { activityLog } from './activity-log.js';
import config from '../config/default.js';
import { Orchestrator } from './orchestrator.js';

const PORT = 3210;
const MIME = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.ico':'image/x-icon' };
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const PROJECT_ROOT = resolve(__dirname, '..');
const orch = new Orchestrator(config);

async function handler(req, res) {
  const { pathname } = url.parse(req.url, true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  try {
    if (pathname === '/api/chat' && req.method === 'POST') {
      let body = ''; for await (const chunk of req) body += chunk;
      const { message } = JSON.parse(body);
      const response = await orch.respond(message);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response })); return;
    }
    if (pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ version: config.version||'2.0.0', mode: config.mode, modules: [...orch.modules.keys()], tools: [...orch.tools.keys()], agents: [...orch.agents.keys()] })); return;
    }
    if (pathname === '/api/activity') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(activityLog.getState())); return;
    }
    if (pathname === '/api/portfolio') {
      const pfPath = resolve(PROJECT_ROOT, 'data', 'trading', 'portfolio.json');
      const pf = existsSync(pfPath) ? JSON.parse(readFileSync(pfPath, 'utf8')) : { balanceUSD: 10000, holdings: {} };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(pf)); return;
    }
    if (pathname === '/api_key_set' && req.method === 'POST') {
      let body = ''; for await (const chunk of req) body += chunk;
      const { service, key } = JSON.parse(body);
      const result = await orch.callTool('api_key_set', { service, key });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result)); return;
    }
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = resolve(PROJECT_ROOT, 'ui', '.' + filePath);
    if (existsSync(filePath)) {
      const ext = '.' + filePath.split('.').pop();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
      res.end(readFileSync(filePath));
    } else { res.writeHead(404); res.end('Not found'); }
  } catch (err) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: err.message })); }
}

async function main() {
  await orch.init();
  activityLog.startTask('init', { type: 'system', title: 'Gidion Core Initialized', info: 'Loaded ' + orch.modules.size + ' modules' });
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    activityLog.updateTask('init', { step: 'API on :'+PORT });
    activityLog.completeTask('init', 'Running on :'+PORT);
    console.error('Gidion API listening on http://localhost:' + PORT);
  });
}
main().catch(console.error);

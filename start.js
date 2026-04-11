#!/usr/bin/env node
/**
 * GIDION // BLACKSMITH - Entry Point
 * 
 * Usage:
 *   node start.js          # Full mode
 *   node start.js --server # Server only
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const isServerOnly = args.includes('--server');

console.log('╔══════════════════════════════════════╗');
console.log('║   GIDION // BLACKSMITH v1.0.0     ║');
console.log('║   Autonomous AI Trading System    ║');
console.log('╚══════════════════════════════════════╝');
console.log();

const serverFile = path.join(__dirname, 'core', 'server.js');
console.log('Starting server from:', serverFile);
console.log();

const child = spawn(process.execPath, [serverFile], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, PORT: process.env.PORT || '3210' }
});

child.on('error', (err) => {
  console.error('Error starting server:', err.message);
  process.exit(1);
});

['SIGINT', 'SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    child.kill(sig);
    process.exit(0);
  });
});

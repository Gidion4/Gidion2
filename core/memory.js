import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', 'data');

export function appendJournal(entry) {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const journalDir = path.join(dataDir, 'memory', 'journal');
  fs.mkdirSync(journalDir, { recursive: true });
  const file = path.join(journalDir, `${dateStr}.md`);
  const stamp = now.toISOString();
  fs.appendFileSync(file, `\n## ${stamp}\n\n${entry}\n`);
}

export function readTodayJournal() {
  const dateStr = new Date().toISOString().slice(0, 10);
  const file = path.join(dataDir, 'memory', 'journal', `${dateStr}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

export function readFacts() {
  const file = path.join(dataDir, 'memory', 'facts.json');
  if (!fs.existsSync(file)) return { facts: [] };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function addFact(fact) {
  const file = path.join(dataDir, 'memory', 'facts.json');
  const data = readFacts();
  data.facts.push({ fact, ts: new Date().toISOString() });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

export function getRecentContext(maxEntries = 20) {
  const journal = readTodayJournal();
  const lines = journal.split('\n## ').slice(-maxEntries);
  return lines.join('\n## ');
}

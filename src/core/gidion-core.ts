import { askOllama } from '../tools/ollama.js';

export async function callGidionCore(prompt: string) {
  return askOllama(prompt);
}


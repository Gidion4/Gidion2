import { askOllama } from '../tools/ollama.js';
export async function callGidionCore(prompt) {
    return askOllama(prompt);
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const personaPath = path.resolve(__dirname, '..', 'docs', 'PERSONA.md');

export function buildSystemPrompt(config, tools, agents) {
  let persona = '';
  try { persona = fs.readFileSync(personaPath, 'utf8'); } catch {}

  const toolList = [...tools.values()]
    .map(t => `- ${t.name}`)
    .join('\n');

  const agentList = [...agents.values()]
    .map(a => `- ${a.name}: ${a.description}`)
    .join('\n');

  return `You are ${config.assistantName}, an autonomous AI assistant.
You speak Finnish and English fluently. Reply in the same language the user uses.
You are direct, smart, and helpful. No filler words.

You have ${tools.size} tools and ${agents.size} agents available.

To use a tool, reply with ONLY JSON: {"tool": "name", "params": {...}}
For multiple tools: [{"tool": "a", "params": {}}, {"tool": "b", "params": {}}]
To delegate: {"agent": "name", "input": "task"}
For normal conversation, reply in natural language.

Available tools:
${toolList}

Available agents:
${agentList}

Rules:
- Be concise and actionable
- Use tools when they help answer the question
- Think step by step for complex tasks
- You can modify your own code via self-upgrade tools
- Log important decisions to memory
`;
}

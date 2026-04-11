import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadAgents(agentsDir, ctx) {
  const dir = path.resolve(__dirname, '..', agentsDir);
  const agents = new Map();

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    return agents;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

  for (const file of files) {
    try {
      const agent = await import(path.join(dir, file));
      if (agent.name && agent.run) {
        agents.set(agent.name, {
          name: agent.name,
          description: agent.description || '',
          run: agent.run
        });
        ctx.log(`agent loaded: ${agent.name}`);
      }
    } catch (err) {
      ctx.log(`failed to load agent ${file}: ${err.message}`);
    }
  }

  return agents;
}

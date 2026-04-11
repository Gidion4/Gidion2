#!/usr/bin/env node
import readline from 'readline';
import defaultConfig from '../config/default.js';
import { Orchestrator } from './orchestrator.js';

async function main() {
  if (process.argv.includes('--help')) {
    console.log('Gidion AI Assistant\n\nUsage:\n  node core/main.js        Start CLI\n  node core/main.js --help  Show this help\n');
    process.exit(0);
  }

  const config = defaultConfig;
  const orch = new Orchestrator(config);
  await orch.init();

  console.log(`\n  ${config.assistantName} v${config.version}`);
  console.log(`  mode=${config.mode} provider=${config.providers.default}`);
  console.log(`  modules=${orch.modules.size} tools=${orch.tools.size} agents=${orch.agents.size}`);
  console.log(`  Type 'exit' to quit.\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${config.assistantName}> `
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }
    if (input === 'exit' || input === 'quit') { rl.close(); return; }

    if (input === '/tools') {
      for (const [name, tool] of orch.tools) {
        console.log(`  ${name} (${tool.module}): ${tool.description}`);
      }
      rl.prompt();
      return;
    }

    if (input === '/agents') {
      for (const [name, agent] of orch.agents) {
        console.log(`  ${name}: ${agent.description}`);
      }
      rl.prompt();
      return;
    }

    if (input === '/modules') {
      for (const [name, mod] of orch.modules) {
        console.log(`  ${name} v${mod.version}: ${mod.description}`);
      }
      rl.prompt();
      return;
    }

    try {
      const output = await orch.respond(input);
      console.log(`\n${output}\n`);
    } catch (err) {
      console.error(`error: ${err.message}`);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('bye');
    process.exit(0);
  });
}

main().catch(err => {
  console.error(`fatal: ${err.message}`);
  process.exit(1);
});

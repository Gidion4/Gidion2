import { loadModules, getToolRegistry } from './module-loader.js';
import { loadAgents } from './agent-loader.js';
import { chatWithProvider } from './provider.js';
import { appendJournal, getRecentContext, readFacts } from './memory.js';
import { buildSystemPrompt } from './prompt-builder.js';
import { activityLog } from './activity-log.js';

export class Orchestrator {
  constructor(config) {
    this.config = config;
    this.modules = new Map();
    this.agents = new Map();
    this.tools = new Map();
    this.history = [];
    this.maxHistory = 20;
    this.maxToolDepth = 5;
  }

  log(msg) { const ts = new Date().toISOString().slice(11, 19); console.error(`[${ts}] ${msg}`); }

  async init() {
    const ctx = this.makeCtx();
    this.modules = await loadModules(this.config.modules.dir, ctx);
    this.tools = getToolRegistry(this.modules);
    this.agents = await loadAgents(this.config.agents.dir, ctx);
    this.log(`loaded ${this.modules.size} modules, ${this.tools.size} tools, ${this.agents.size} agents`);
  }

  makeCtx() {
    return {
      config: this.config,
      log: this.log.bind(this),
      callTool: this.callTool.bind(this),
      callAgent: this.callAgent.bind(this),
      chat: (messages) => chatWithProvider(this.config, messages),
      activity: activityLog,
    };
  }

  async callTool(toolName, params) {
    const tool = this.tools.get(toolName);
    if (!tool) return { error: `unknown tool: ${toolName}` };
    try {
      this.log(`tool: ${toolName}`);
      return await tool.execute(params, this.makeCtx());
    } catch (err) { return { error: err.message }; }
  }

  async callAgent(agentName, input) {
    const agent = this.agents.get(agentName);
    if (!agent) return { error: `unknown agent: ${agentName}` };
    this.log(`agent: ${agentName}`);
    return await agent.run(input, this.makeCtx());
  }

  buildSystemPrompt() { return buildSystemPrompt(this.config, this.tools, this.agents); }

  async respond(userInput) {
    appendJournal(`User: ${userInput}`);
    const taskId = activityLog.startTask('chat-' + Date.now(), {
      type: 'chat', title: userInput.slice(0, 60), status: 'thinking'
    });

    const recentContext = getRecentContext(10);
    const facts = readFacts();
    const factsSummary = facts.facts.length > 0
      ? 'Known facts:\n' + facts.facts.slice(-10).map(f => `- ${f.fact}`).join('\n') : '';

    const messages = [
      { role: 'system', content: this.buildSystemPrompt() },
    ];
    if (factsSummary) messages.push({ role: 'system', content: factsSummary });
    if (recentContext) messages.push({ role: 'system', content: `Recent conversation:\n${recentContext}` });
    for (const turn of this.history.slice(-this.maxHistory)) messages.push(turn);
    messages.push({ role: 'user', content: userInput });

    let finalResponse = '';
    let depth = 0;

    while (depth < this.maxToolDepth) {
      activityLog.updateTask(taskId, { step: `Thinking... (depth ${depth + 1}/${this.maxToolDepth})` });
      const response = await chatWithProvider(this.config, messages);
      const parsed = this.tryParseAction(response);

      if (Array.isArray(parsed)) {
        const results = [];
        for (const step of parsed) {
          if (step.tool) {
            const result = await this.callTool(step.tool, step.params || {});
            results.push({ tool: step.tool, result });
            activityLog.updateTask(taskId, { step: `Used tool: ${step.tool}`, progress: Math.round((depth / this.maxToolDepth) * 100) });
          } else if (step.agent) {
            const result = await this.callAgent(step.agent, step.input || '');
            results.push({ agent: step.agent, result });
          }
        }
        const resultText = JSON.stringify(results, null, 2);
        messages.push({ role: 'assistant', content: response });
        messages.push({ role: 'system', content: `Tool results:\n${resultText}\n\nNow respond to the user based on these results.` });
        depth++;
        continue;
      } else if (parsed?.tool) {
        activityLog.updateTask(taskId, { step: `Tool: ${parsed.tool}`, progress: Math.round((depth / this.maxToolDepth) * 100) });
        const result = await this.callTool(parsed.tool, parsed.params || {});
        const resultText = JSON.stringify(result, null, 2);
        messages.push({ role: 'assistant', content: response });
        messages.push({ role: 'system', content: `Tool result:\n${resultText}\n\nNow respond to the user based on this result.` });
        depth++;
        continue;
      } else if (parsed?.agent) {
        const result = await this.callAgent(parsed.agent, parsed.input || '');
        const resultText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        messages.push({ role: 'assistant', content: response });
        messages.push({ role: 'system', content: `Agent result:\n${resultText}\n\nNow respond to the user based on this result.` });
        depth++;
        continue;
      } else {
        finalResponse = response;
        break;
      }
    }

    if (!finalResponse) finalResponse = '[Max tool depth reached. Please rephrase or simplify your request.]';

    this.history.push({ role: 'user', content: userInput });
    this.history.push({ role: 'assistant', content: finalResponse });
    activityLog.completeTask(taskId, finalResponse.slice(0, 100));
    appendJournal(`Assistant: ${finalResponse}`);
    return finalResponse;
  }

  tryParseAction(text) {
    try {
      const trimmed = text.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) return JSON.parse(trimmed);
      const match = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) return JSON.parse(match[1]);
    } catch {}
    return null;
  }
}

import { coreAgent } from '../agents/coreAgent.js';
import { codexAgent } from '../agents/codexAgent.js';
import { visionAgent } from '../agents/visionAgent.js';
import { opsAgent } from '../agents/opsAgent.js';
export const AgentRegistry = {
    CORE: coreAgent,
    CODEX: codexAgent,
    VISION: visionAgent,
    OPS: opsAgent
};
export function getAgent(name) {
    return AgentRegistry[name];
}
export function listAgents() {
    return Object.keys(AgentRegistry);
}

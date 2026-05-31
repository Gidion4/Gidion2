// ------------------------------------------------------------
// GIDION ARC CORE — AGENT REGISTRY v1
// ------------------------------------------------------------
// Tämä tiedosto määrittelee agenttien rakenteen, tyypit,
// rekisteröinnin ja validoinnin. Kaikki agentit kulkevat tämän
// kautta. Ei UI-riippuvuuksia, ei mock-koodia.
// ------------------------------------------------------------
// ------------------------------------------------------------
// AGENTTIEN LATAUS
// ------------------------------------------------------------
import { coreAgent } from "../agents/coreAgent";
import { codexAgent } from "../agents/codexAgent";
import { visionAgent } from "../agents/visionAgent";
import { opsAgent } from "../agents/opsAgent";
// Kaikki agentit rekisterissä
const registry = {
    CORE: coreAgent,
    CODEX: codexAgent,
    VISION: visionAgent,
    OPS: opsAgent,
};
// ------------------------------------------------------------
// JULKISET API-FUNKTIOT
// ------------------------------------------------------------
export function getAgent(name) {
    const agent = registry[name];
    if (!agent) {
        throw new Error(`Agent not found: ${name}`);
    }
    return agent;
}
export function listAgents() {
    return Object.values(registry);
}
export function describeAgents() {
    return listAgents().map(a => ({
        name: a.name,
        role: a.role,
        capabilities: a.capabilities,
    }));
}

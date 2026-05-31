// ------------------------------------------------------------
// GIDION ARC CORE — ROUTER v2
// ------------------------------------------------------------
// Parannettu agenttivalinta:
//  - tarkempi intent-matching
//  - semanttinen avainsanapainotus
//  - agenttien pisteytys
// ------------------------------------------------------------
import { getAgent, listAgents, } from "./agentRegistry";
// ------------------------------------------------------------
// ROUTER v2 — AGENTTIEN PISTEYTYS
// ------------------------------------------------------------
const agentKeywords = {
    CORE: [
        "analyze", "plan", "explain", "general", "idea", "concept",
        "architecture", "design", "thinking"
    ],
    CODEX: [
        "code", "refactor", "function", "class", "typescript", "javascript",
        "bug", "fix", "generate", "compile", "program"
    ],
    VISION: [
        "image", "kuva", "picture", "photo", "video", "render", "visual",
        "generate image", "art", "style", "scene"
    ],
    OPS: [
        "system", "shell", "command", "file", "directory", "list files",
        "inspect", "os", "environment", "tools"
    ]
};
// ------------------------------------------------------------
// PISTEYTYSFUNKTIOT
// ------------------------------------------------------------
function scoreAgent(agent, text, intent) {
    const keywords = agentKeywords[agent];
    const lower = (text + " " + intent).toLowerCase();
    let score = 0;
    for (const kw of keywords) {
        if (lower.includes(kw))
            score += 2;
    }
    // CORE fallback
    if (agent === "CORE")
        score += 1;
    return score;
}
function chooseAgent(task) {
    if (task.preferredAgent)
        return task.preferredAgent;
    const agents = ["CORE", "CODEX", "VISION", "OPS"];
    const scores = agents.map(a => ({
        agent: a,
        score: scoreAgent(a, task.text, task.intent)
    }));
    scores.sort((a, b) => b.score - a.score);
    return scores[0].agent;
}
// ------------------------------------------------------------
// BRAIN ENGINE — PÄÄSUORITUS
// ------------------------------------------------------------
export async function runBrainTask(task) {
    try {
        const route = chooseAgent(task);
        const agent = getAgent(route);
        const req = {
            agent: route,
            task: task.intent,
            payload: task.payload ?? { text: task.text },
            context: {
                metadata: {
                    routedBy: "BrainEngine_v2",
                    timestamp: Date.now(),
                },
            },
        };
        const response = await agent.invoke(req);
        return {
            ok: response.ok,
            route,
            response,
            error: response.error,
        };
    }
    catch (err) {
        return {
            ok: false,
            route: "CORE",
            error: err?.message ?? "Unknown brain error",
        };
    }
}
// ------------------------------------------------------------
// DIAGNOSTIIKKA
// ------------------------------------------------------------
export function describeBrain() {
    return {
        version: "2.0.0",
        agents: listAgents().map(a => ({
            name: a.name,
            role: a.role,
            capabilities: a.capabilities,
        })),
    };
}

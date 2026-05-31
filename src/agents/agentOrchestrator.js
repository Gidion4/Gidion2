// ------------------------------------------------------------
// GIDION LEVEL 4 — AGENT ORCHESTRATOR v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli toimii agenttien orkestroijana.
//
// Vastuut:
//   - vastaanottaa tehtäviä kerneliltä
//   - valitsee sopivan agentin (tässä versiossa: yksinkertainen valinta)
//   - lähettää tehtävän agentille
//   - kerää tulokset
//   - raportoi takaisin kernelille
//
// Tämä on pohja tulevalle multi-agent -järjestelmälle.
// ------------------------------------------------------------
import { AgentCore } from "./agentCore.ts";
export class AgentOrchestrator {
    agents = [];
    registerAgent(agent) {
        this.agents.push(agent);
    }
    getAgents() {
        return [...this.agents];
    }
    pickAgent() {
        if (this.agents.length === 0)
            return null;
        // Yksinkertainen valintalogiikka:
        // Palauttaa ensimmäisen agentin.
        // Myöhemmin tähän tulee:
        //   - kuormantasaus
        //   - erikoistuminen
        //   - prioriteetit
        return this.agents[0];
    }
    async dispatchTask(description, payload) {
        const agent = this.pickAgent();
        if (!agent) {
            return {
                taskId: "none",
                success: false,
                output: "No agents registered"
            };
        }
        const task = agent.receiveTask(description, payload);
        return await agent.executeTask(task);
    }
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    const orchestrator = new AgentOrchestrator();
    const agentA = new AgentCore("AlphaAgent");
    orchestrator.registerAgent(agentA);
    orchestrator
        .dispatchTask("Analyze system state", { foo: 123 })
        .then((result) => {
        console.log("Orchestrator result:", result);
    });
}

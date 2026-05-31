// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM HEALTHCHECK v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli tarkistaa järjestelmän tilan:
//
//   - Kernelin olemassaolo ja perustoiminta
//   - AutonomyLoopin käynnistyminen ja pysähtyminen
//   - ProjectEnginen perustoiminta
//   - Agenttien rekisteröinti
//
// Tämä toimii selfHealing-järjestelmän perustana.
// ------------------------------------------------------------
import { OrganizationKernel } from "../kernel/organizationKernel.ts";
import { AgentOrchestrator } from "../agents/agentOrchestrator.ts";
import { AgentCore } from "../agents/agentCore.ts";
export async function runHealthcheck() {
    // Kernel
    const kernel = new OrganizationKernel();
    const kernelOK = kernel !== null;
    // Agent orchestrator
    const orchestrator = new AgentOrchestrator();
    // Rekisteröidään yksi agentti testimielessä
    orchestrator.registerAgent(new AgentCore("HealthcheckAgent"));
    const agentsOK = orchestrator.getAgents().length > 0;
    // Project engine test
    kernel.addProject("Healthcheck Project", 1, ["ping"]);
    const projectEngineOK = kernel.getStatus().pendingProjects === 1;
    // Autonomy loop test
    kernel.startAutonomy();
    const autonomyOK = kernel.getStatus().autonomyRunning === true;
    kernel.stopAutonomy();
    return {
        kernel: kernelOK,
        autonomyLoop: autonomyOK,
        projectEngine: projectEngineOK,
        agents: agentsOK
    };
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runHealthcheck().then((report) => {
        console.log("Gidion UltraHybrid Level 4 — System Healthcheck");
        console.table(report);
    });
}

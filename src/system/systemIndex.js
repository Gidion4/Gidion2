// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM INDEX v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä tiedosto kokoaa yhteen kaikki järjestelmän keskeiset moduulit.
// Se toimii:
//   - keskitettynä import-pisteenä
//   - dokumentaation juurena
//   - introspektion lähtöpisteenä
//   - Level 5 -arkkitehtuurin perustana
// ------------------------------------------------------------
// Core systems
export { OrganizationKernel } from "../kernel/organizationKernel.ts";
export { AutonomyLoop } from "../autonomy/autonomyLoop.ts";
export { ProjectEngine } from "../project/projectEngine.ts";
// Agents
export { AgentCore } from "../agents/agentCore.ts";
export { AgentOrchestrator } from "../agents/agentOrchestrator.ts";
// System utilities
export * from "./selfInspector.ts";
export * from "./selfTestRunner.ts";
// Bootstrap
export * from "../bootstrap/bootstrap.ts";
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log("Gidion UltraHybrid Level 4 — System Index");
    console.log("All core modules are now accessible from this entrypoint.");
}

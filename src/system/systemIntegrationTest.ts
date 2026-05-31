// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 — SYSTEM INTEGRATION TEST (PRO)
// ------------------------------------------------------------
// Tämä testi varmistaa, että Integration Layer toimii ja että
// kaikki järjestelmän osat (agents, pipeline, system health,
// diagnostics, snapshot, self-healing, introspection) toimivat
// yhtenä kokonaisuutena.
// ------------------------------------------------------------

import { GidionSystem } from "./systemIntegration.js";

async function main() {
  console.log("=== GIDION ULTRAHYBRID v4 — SYSTEM INTEGRATION TEST ===\n");

  // ------------------------------------------------------------
  // 1) Ajetaan Multi-Agent Pipeline
  // ------------------------------------------------------------
  console.log("Running Multi-Agent Pipeline...\n");

  const pipelineResult = await GidionSystem.runPipeline([
    {
      description: "Analyze system architecture",
      payload: { target: "core" },
      requiredRole: "analyst"
    },
    {
      description: "Plan improvements",
      payload: { target: "core" },
      requiredRole: "planner"
    },
    {
      description: "Generate code improvements",
      payload: { target: "core" },
      requiredRole: "coder"
    },
    {
      description: "Finalize reasoning",
      payload: { summary: true },
      requiredRole: "core"
    }
  ]);

  console.log("Pipeline Result:");
  console.log(JSON.stringify(pipelineResult, null, 2), "\n");

  // ------------------------------------------------------------
  // 2) System Snapshot
  // ------------------------------------------------------------
  console.log("Fetching System Snapshot...\n");

  const snapshot = GidionSystem.snapshot();
  console.log("Snapshot:");
  console.log(JSON.stringify(snapshot, null, 2), "\n");

  // ------------------------------------------------------------
  // 3) System Diagnostics
  // ------------------------------------------------------------
  console.log("Running Diagnostics...\n");

  const diagnostics = GidionSystem.diagnostics();
  console.log("Diagnostics:");
  console.log(JSON.stringify(diagnostics, null, 2), "\n");

  // ------------------------------------------------------------
  // 4) System Healthcheck
  // ------------------------------------------------------------
  console.log("Running Healthcheck...\n");

  const health = GidionSystem.health();
  console.log("Healthcheck:");
  console.log(JSON.stringify(health, null, 2), "\n");

  // ------------------------------------------------------------
  // 5) System Self-Healing
  // ------------------------------------------------------------
  console.log("Running Self-Healing...\n");

  const healing = GidionSystem.selfHeal();
  console.log("Self-Healing Report:");
  console.log(JSON.stringify(healing, null, 2), "\n");

  // ------------------------------------------------------------
  // 6) System Introspection
  // ------------------------------------------------------------
  console.log("Running Introspection...\n");

  const introspection = GidionSystem.introspect();
  console.log("Introspection:");
  console.log(JSON.stringify(introspection, null, 2), "\n");

  // ------------------------------------------------------------
  // 7) System Info
  // ------------------------------------------------------------
  console.log("Fetching System Info...\n");

  const info = GidionSystem.info();
  console.log("System Info:");
  console.log(JSON.stringify(info, null, 2), "\n");

  console.log("=== SYSTEM INTEGRATION TEST COMPLETE ===");
}

main();

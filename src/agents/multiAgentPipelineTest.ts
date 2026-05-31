// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — MULTI-AGENT PIPELINE TEST
// ------------------------------------------------------------
// Tämä testi:
//   - luo agentteja
//   - rekisteröi ne
//   - rakentaa multi-agent pipeline -tehtäviä
//   - ajaa koko pipeline-prosessin
//   - tulostaa selkeän raportin
//
// Testi ei tee muutoksia tuotantokoodiin.
// Kaikki toiminnot ovat sandboxattuja ja turvallisia.
// ------------------------------------------------------------

import { createAgentIdentity } from "./agentIdentity.js";
import { createAgentMemory } from "./agentMemory.js";
import { registerAgent } from "./agentCommunication.js";
import { MultiAgentPipeline } from "./multiAgentPipeline.js";

async function main() {
  console.log("=== GIDION ULTRAHYBRID v4 — MULTI-AGENT PIPELINE TEST ===\n");

  // ------------------------------------------------------------
  // 1) Luodaan agentit
  // ------------------------------------------------------------
  const agentCore = createAgentIdentity("CORE-1", "core", "general reasoning", 1);
  const agentPlanner = createAgentIdentity("PLANNER-1", "planner", "task planning", 2);
  const agentCoder = createAgentIdentity("CODER-1", "coder", "code generation", 3);
  const agentAnalyst = createAgentIdentity("ANALYST-1", "analyst", "analysis", 4);

  // ------------------------------------------------------------
  // 2) Rekisteröidään agentit kommunikaatiojärjestelmään
  // ------------------------------------------------------------
  registerAgent(agentCore);
  registerAgent(agentPlanner);
  registerAgent(agentCoder);
  registerAgent(agentAnalyst);

  console.log("Registered agents:");
  console.log(" -", agentCore.name);
  console.log(" -", agentPlanner.name);
  console.log(" -", agentCoder.name);
  console.log(" -", agentAnalyst.name);
  console.log("");

  // ------------------------------------------------------------
  // 3) Luodaan pipeline
  // ------------------------------------------------------------
  const pipeline = new MultiAgentPipeline();

  pipeline.addStep(
    "Analyze module structure",
    { module: "evolutionEngine.ts" },
    "analyst"
  );

  pipeline.addStep(
    "Plan improvements",
    { target: "evolutionEngine.ts" },
    "planner"
  );

  pipeline.addStep(
    "Generate code improvements",
    { target: "evolutionEngine.ts" },
    "coder"
  );

  pipeline.addStep(
    "Finalize reasoning",
    { summary: true },
    "core"
  );

  console.log("Pipeline created with 4 steps.\n");

  // ------------------------------------------------------------
  // 4) Ajetaan pipeline
  // ------------------------------------------------------------
  const result = await pipeline.run();

  console.log("=== PIPELINE RESULT ===");
  console.log(JSON.stringify(result, null, 2));

  console.log("\n=== TEST COMPLETE ===");
}

main();

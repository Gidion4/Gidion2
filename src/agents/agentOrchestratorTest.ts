// ------------------------------------------------------------
// AGENT ORCHESTRATOR TEST (FIXED)
// ------------------------------------------------------------

import { orchestrateTask } from "./agentOrchestrator.js";
import { createAgentIdentity } from "./agentIdentity.js";
import { registerAgent } from "./agentCommunication.js";

async function main() {
  console.log("=== AGENT ORCHESTRATOR TEST ===");

  const a1 = createAgentIdentity("CORE-1", "core", "general reasoning", 1);
  const a2 = createAgentIdentity("PLANNER-1", "planner", "planning", 2);

  registerAgent(a1);
  registerAgent(a2);

  const result = orchestrateTask({
    id: "test-task",
    description: "Test orchestrator",
    payload: { x: 1 },
    requiredRole: "planner"
  });

  console.log(JSON.stringify(result, null, 2));
}

main();


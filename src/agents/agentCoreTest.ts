// ------------------------------------------------------------
// GIDION LEVEL 4 â€” AGENT CORE TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa agentCore.ts -moduulin keskeiset toiminnot:
//   - tehtÃ¤vÃ¤n vastaanotto
//   - tehtÃ¤vÃ¤n suoritus
//   - tuloksen palautus
//   - deterministinen toiminta
// ------------------------------------------------------------

import { AgentCore } from "./agentCore.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running AgentCore tests...");

  const agent = new AgentCore("TestAgent");

  // --- Test 1: TehtÃ¤vÃ¤n vastaanotto ---
  const task = agent.receiveTask("Unit test task", { foo: 123 });
  assert(task.description === "Unit test task", "Task description mismatch");
  assert(task.payload.foo === 123, "Task payload mismatch");

  // --- Test 2: TehtÃ¤vÃ¤n suoritus ---
  const result = await agent.executeTask(task);
  assert(result.success === true, "Task execution did not succeed");
  assert(result.taskId === task.id, "Task ID mismatch in result");

  // --- Test 3: Tuloksen sisÃ¤ltÃ¶ ---
  assert(
    typeof result.output === "string" &&
      result.output.includes("completed by TestAgent"),
    "Result output incorrect"
  );

  console.log("âœ” All AgentCore tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


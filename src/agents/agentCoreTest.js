// ------------------------------------------------------------
// GIDION LEVEL 4 — AGENT CORE TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa agentCore.ts -moduulin keskeiset toiminnot:
//   - tehtävän vastaanotto
//   - tehtävän suoritus
//   - tuloksen palautus
//   - deterministinen toiminta
// ------------------------------------------------------------
import { AgentCore } from "./agentCore.ts";
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running AgentCore tests...");
    const agent = new AgentCore("TestAgent");
    // --- Test 1: Tehtävän vastaanotto ---
    const task = agent.receiveTask("Unit test task", { foo: 123 });
    assert(task.description === "Unit test task", "Task description mismatch");
    assert(task.payload.foo === 123, "Task payload mismatch");
    // --- Test 2: Tehtävän suoritus ---
    const result = await agent.executeTask(task);
    assert(result.success === true, "Task execution did not succeed");
    assert(result.taskId === task.id, "Task ID mismatch in result");
    // --- Test 3: Tuloksen sisältö ---
    assert(typeof result.output === "string" &&
        result.output.includes("completed by TestAgent"), "Result output incorrect");
    console.log("✔ All AgentCore tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

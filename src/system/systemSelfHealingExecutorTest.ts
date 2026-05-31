// ------------------------------------------------------------
// GIDION LEVEL 4 â€” SELF HEALING EXECUTOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemSelfHealingExecutor.ts -moduulin keskeiset toiminnot:
//   - executeHealingPlanDryRun palauttaa validin ExecutionReportin
//   - actions on array
//   - action-objektit ovat oikeassa muodossa
//   - step-objektit ovat oikeassa muodossa
//   - allSuccessful toimii
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { executeHealingPlanDryRun } from "./systemSelfHealingExecutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running SelfHealingExecutor tests...");

  // --- Test 1: systemSelfHealingExecutor.ts olemassa ---
  const executorPath = path.join(__dirname, "systemSelfHealingExecutor.ts");
  assert(fs.existsSync(executorPath), "systemSelfHealingExecutor.ts is missing");

  // --- Test 2: executeHealingPlanDryRun toimii ---
  const report = await executeHealingPlanDryRun();
  assert(typeof report === "object", "executeHealingPlanDryRun did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: actions on array ---
  assert(Array.isArray(report.actions), "actions is not an array");

  // --- Test 5: action-objektit ovat oikeassa muodossa ---
  if (report.actions.length > 0) {
    for (const action of report.actions) {
      assert(typeof action.issueKey === "string", "action.issueKey missing or invalid");
      assert(
        ["low", "medium", "high"].includes(action.severity),
        "action.severity invalid"
      );
      assert(Array.isArray(action.results), "action.results is not an array");

      // --- Test 6: step-objektit ovat oikeassa muodossa ---
      for (const step of action.results) {
        assert(typeof step.step === "string", "step.step missing or invalid");
        assert(typeof step.success === "boolean", "step.success missing or invalid");
        assert(typeof step.message === "string", "step.message missing or invalid");
      }
    }
  }

  // --- Test 7: allSuccessful on boolean ---
  assert(typeof report.allSuccessful === "boolean", "allSuccessful is not boolean");

  console.log("âœ” All SelfHealingExecutor tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


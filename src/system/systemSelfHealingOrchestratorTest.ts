// ------------------------------------------------------------
// GIDION LEVEL 4 â€” SELF HEALING ORCHESTRATOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemSelfHealingOrchestrator.ts -moduulin keskeiset toiminnot:
//   - runSelfHealingOrchestration palauttaa validin raportin
//   - raportissa on coreReport, healingPlan ja executionReport
//   - fullyHealthy on boolean
//   - kaikki alaraportit ovat oikeassa muodossa
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runSelfHealingOrchestration } from "./systemSelfHealingOrchestrator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running SelfHealingOrchestrator tests...");

  // --- Test 1: systemSelfHealingOrchestrator.ts olemassa ---
  const orchestratorPath = path.join(__dirname, "systemSelfHealingOrchestrator.ts");
  assert(fs.existsSync(orchestratorPath), "systemSelfHealingOrchestrator.ts is missing");

  // --- Test 2: runSelfHealingOrchestration toimii ---
  const report = await runSelfHealingOrchestration();
  assert(typeof report === "object", "runSelfHealingOrchestration did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: coreReport on validi ---
  assert(typeof report.coreReport === "object", "coreReport missing or invalid");
  assert(Array.isArray(report.coreReport.issues), "coreReport.issues is not an array");
  assert(typeof report.coreReport.healthy === "boolean", "coreReport.healthy invalid");

  // --- Test 5: healingPlan on validi ---
  assert(typeof report.healingPlan === "object", "healingPlan missing or invalid");
  assert(Array.isArray(report.healingPlan.actions), "healingPlan.actions is not an array");
  assert(
    typeof report.healingPlan.requiresManualReview === "boolean",
    "healingPlan.requiresManualReview invalid"
  );

  // --- Test 6: executionReport on validi ---
  assert(typeof report.executionReport === "object", "executionReport missing or invalid");
  assert(Array.isArray(report.executionReport.actions), "executionReport.actions is not an array");
  assert(
    typeof report.executionReport.allSuccessful === "boolean",
    "executionReport.allSuccessful invalid"
  );

  // --- Test 7: fullyHealthy on boolean ---
  assert(typeof report.fullyHealthy === "boolean", "fullyHealthy is not boolean");

  console.log("âœ” All SelfHealingOrchestrator tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


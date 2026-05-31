// ------------------------------------------------------------
// GIDION LEVEL 5 â€” REPAIR ORCHESTRATOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemRepairOrchestrator.ts -moduulin keskeiset toiminnot:
//   - runRepairOrchestration palauttaa validin raportin
//   - healingPlan ja repairExecution ovat mukana
//   - fullyRepaired on boolean
//   - raportin rakenne on oikea
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runRepairOrchestration } from "./systemRepairOrchestrator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running RepairOrchestrator tests...");

  // --- Test 1: systemRepairOrchestrator.ts olemassa ---
  const orchestratorPath = path.join(__dirname, "systemRepairOrchestrator.ts");
  assert(fs.existsSync(orchestratorPath), "systemRepairOrchestrator.ts is missing");

  // --- Test 2: runRepairOrchestration toimii ---
  const report = await runRepairOrchestration();
  assert(typeof report === "object", "runRepairOrchestration did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: healingPlan on validi ---
  assert(typeof report.healingPlan === "object", "healingPlan missing or invalid");
  assert(Array.isArray(report.healingPlan.actions), "healingPlan.actions is not an array");

  // --- Test 5: repairExecution on validi ---
  assert(typeof report.repairExecution === "object", "repairExecution missing or invalid");
  assert(Array.isArray(report.repairExecution.steps), "repairExecution.steps is not an array");
  assert(
    typeof report.repairExecution.allSuccessful === "boolean",
    "repairExecution.allSuccessful invalid"
  );

  // --- Test 6: fullyRepaired on boolean ---
  assert(typeof report.fullyRepaired === "boolean", "fullyRepaired is not boolean");

  console.log("âœ” All RepairOrchestrator tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


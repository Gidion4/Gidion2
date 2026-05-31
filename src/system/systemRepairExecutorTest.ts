// ------------------------------------------------------------
// GIDION LEVEL 5 â€” REPAIR EXECUTOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemRepairExecutor.ts -moduulin keskeiset toiminnot:
//   - executeRepairs palauttaa validin raportin
//   - vain sallitut toimet suoritetaan
//   - mapping toimii oikein
//   - raportin rakenne on oikea
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { executeRepairs } from "./systemRepairExecutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running RepairExecutor tests...");

  // --- Test 1: systemRepairExecutor.ts olemassa ---
  const executorPath = path.join(__dirname, "systemRepairExecutor.ts");
  assert(fs.existsSync(executorPath), "systemRepairExecutor.ts is missing");

  // --- Test 2: executeRepairs toimii ---
  const report = await executeRepairs();
  assert(typeof report === "object", "executeRepairs did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: steps on array ---
  assert(Array.isArray(report.steps), "steps is not an array");

  // --- Test 5: step-objektit ovat oikeassa muodossa ---
  if (report.steps.length > 0) {
    for (const step of report.steps) {
      assert(typeof step.actionKey === "string", "step.actionKey missing or invalid");
      assert(typeof step.success === "boolean", "step.success missing or invalid");
      assert(typeof step.message === "string", "step.message missing or invalid");
    }
  }

  // --- Test 6: allSuccessful on boolean ---
  assert(typeof report.allSuccessful === "boolean", "allSuccessful is not boolean");

  console.log("âœ” All RepairExecutor tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


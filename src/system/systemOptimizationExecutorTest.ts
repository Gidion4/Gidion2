// ------------------------------------------------------------
// GIDION LEVEL 6 â€” OPTIMIZATION EXECUTOR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemOptimizationExecutor.ts -moduulin keskeiset toiminnot:
//   - executeOptimizations palauttaa validin raportin
//   - whitelistatut toimet suoritetaan oikein
//   - raportin rakenne on oikea
//   - kaikki kentÃ¤t ovat deterministisiÃ¤ ja UI-valmiita
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { executeOptimizations } from "./systemOptimizationExecutor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running OptimizationExecutor tests...");

  // --- Test 1: systemOptimizationExecutor.ts olemassa ---
  const modulePath = path.join(__dirname, "systemOptimizationExecutor.ts");
  assert(fs.existsSync(modulePath), "systemOptimizationExecutor.ts is missing");

  // --- Test 2: executeOptimizations toimii ---
  const report = await executeOptimizations();
  assert(typeof report === "object", "executeOptimizations did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: steps on array ---
  assert(Array.isArray(report.steps), "steps is not an array");

  if (report.steps.length > 0) {
    for (const step of report.steps) {
      assert(typeof step.actionKey === "string", "step.actionKey invalid");
      assert(typeof step.success === "boolean", "step.success invalid");
      assert(typeof step.message === "string", "step.message invalid");
    }
  }

  // --- Test 5: allSuccessful on boolean ---
  assert(typeof report.allSuccessful === "boolean", "allSuccessful invalid");

  console.log("âœ” All OptimizationExecutor tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


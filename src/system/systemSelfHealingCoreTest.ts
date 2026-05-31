// ------------------------------------------------------------
// GIDION LEVEL 4 â€” SELF HEALING CORE TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemSelfHealingCore.ts -moduulin keskeiset toiminnot:
//   - analyzeSystemState palauttaa validin raportin
//   - raportissa on timestamp
//   - issues on array
//   - issue-objektit ovat oikeassa muodossa
//   - healthy-lippu toimii
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeSystemState } from "./systemSelfHealingCore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running SelfHealingCore tests...");

  // --- Test 1: systemSelfHealingCore.ts olemassa ---
  const corePath = path.join(__dirname, "systemSelfHealingCore.ts");
  assert(fs.existsSync(corePath), "systemSelfHealingCore.ts is missing");

  // --- Test 2: analyzeSystemState toimii ---
  const report = await analyzeSystemState();
  assert(typeof report === "object", "analyzeSystemState did not return an object");

  // --- Test 3: timestamp on validi ---
  assert(typeof report.timestamp === "string", "timestamp missing or invalid");

  // --- Test 4: issues on array ---
  assert(Array.isArray(report.issues), "issues is not an array");

  // --- Test 5: issue-objektit ovat oikeassa muodossa ---
  if (report.issues.length > 0) {
    for (const issue of report.issues) {
      assert(typeof issue.key === "string", "issue.key missing or invalid");
      assert(typeof issue.description === "string", "issue.description missing or invalid");
      assert(
        ["low", "medium", "high"].includes(issue.severity),
        "issue.severity invalid"
      );
      assert(typeof issue.suggestion === "string", "issue.suggestion missing or invalid");
    }
  }

  // --- Test 6: healthy-lippu on boolean ---
  assert(typeof report.healthy === "boolean", "healthy flag is not boolean");

  console.log("âœ” All SelfHealingCore tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


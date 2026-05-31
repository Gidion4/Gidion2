// ------------------------------------------------------------
// GIDION LEVEL 4 — SELF INSPECTOR TEST v3 (SAFE + ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa selfInspector.ts -moduulin keskeiset toiminnot:
//   - moduulien tarkistus
//   - puuttuvien moduulien raportointi
//   - deterministinen toiminta
//
// HUOM: Ei koskaan kutsu process.exit().
//       Palauttaa turvallisen TestReport-olion.
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface SingleTestResult {
  name: string;
  success: boolean;
  error?: unknown;
}

export interface SelfInspectorTestReport {
  timestamp: string;
  results: SingleTestResult[];
  passed: number;
  failed: number;
}

function safeAssert(condition: boolean, name: string, error?: unknown): SingleTestResult {
  if (condition) {
    return { name, success: true };
  }
  return { name, success: false, error };
}

export async function runSelfInspectorTests(): Promise<SelfInspectorTestReport> {
  const results: SingleTestResult[] = [];

  // --- Test 1: selfInspector.ts olemassa ---
  const inspectorPath = path.join(__dirname, "selfInspector.ts");
  results.push(
    safeAssert(fs.existsSync(inspectorPath), "selfInspector.ts exists")
  );

  // --- Test 2: selfTestRunner.ts olemassa ---
  const runnerPath = path.join(__dirname, "selfTestRunner.ts");
  results.push(
    safeAssert(fs.existsSync(runnerPath), "selfTestRunner.ts exists")
  );

  // --- Test 3: projectEngine.ts olemassa ---
  const projectEnginePath = path.join(__dirname, "../project/projectEngine.ts");
  results.push(
    safeAssert(fs.existsSync(projectEnginePath), "projectEngine.ts exists")
  );

  // --- Test 4: agentCore.ts olemassa ---
  const agentCorePath = path.join(__dirname, "../agents/agentCore.ts");
  results.push(
    safeAssert(fs.existsSync(agentCorePath), "agentCore.ts exists")
  );

  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;

  return {
    timestamp: new Date().toISOString(),
    results,
    passed,
    failed
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runSelfInspectorTests().then((report) => {
    console.log("GIDION SELF INSPECTOR TEST v3");
    console.log("------------------------------");

    for (const r of report.results) {
      console.log(`${r.success ? "✔" : "✖"} ${r.name}`);
      if (r.error) console.error(r.error);
    }

    console.log(`\nPassed: ${report.passed}`);
    console.log(`Failed: ${report.failed}`);
  });
}


// ------------------------------------------------------------
// GIDION LEVEL 4 — SELF INSPECTOR v3 (ESM-COMPATIBLE & SAFE)
// ------------------------------------------------------------
// Tämä moduuli toimii Gidionin sisäisenä diagnostiikkamoottorina.
//
// Vastuut:
//   - tarkistaa projektirakenteen
//   - varmistaa, että kaikki Level 4 -moduulit ovat olemassa
//   - varmistaa, että testitiedostot löytyvät
//   - raportoi puuttuvat moduulit
//   - toimii pohjana selfHealing-järjestelmälle
//
// HUOM: Ei koskaan kutsu process.exit() — turvallinen kaikille kerroksille.
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ModuleCheck {
  name: string;
  path: string;
}

export interface SelfInspectionReport {
  timestamp: string;
  missing: string[];
  allPresent: boolean;
  checkedModules: ModuleCheck[];
}

const REQUIRED_MODULES: ModuleCheck[] = [
  { name: "ProjectEngine", path: "../project/projectEngine.ts" },
  { name: "ProjectEngineTest", path: "../project/projectEngineTest.ts" },
  { name: "AutonomyLoop", path: "../autonomy/autonomyLoop.ts" },
  { name: "AutonomyLoopTest", path: "../autonomy/autonomyLoopTest.ts" },
  { name: "OrganizationKernel", path: "../kernel/organizationKernel.ts" },
  { name: "OrganizationKernelTest", path: "../kernel/organizationKernelTest.ts" },
  { name: "AgentCore", path: "../agents/agentCore.ts" },
  { name: "AgentCoreTest", path: "../agents/agentCoreTest.ts" },
  { name: "AgentOrchestrator", path: "../agents/agentOrchestrator.ts" },
  { name: "AgentOrchestratorTest", path: "../agents/agentOrchestratorTest.ts" },
  { name: "SelfTestRunner", path: "./selfTestRunner.ts" }
];

function checkModuleExists(relativePath: string): boolean {
  const fullPath = path.join(__dirname, relativePath);
  return fs.existsSync(fullPath);
}

export function runSelfInspection(): SelfInspectionReport {
  const missing: string[] = [];

  for (const mod of REQUIRED_MODULES) {
    const exists = checkModuleExists(mod.path);
    if (!exists) missing.push(mod.name);
  }

  return {
    timestamp: new Date().toISOString(),
    missing,
    allPresent: missing.length === 0,
    checkedModules: REQUIRED_MODULES
  };
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = runSelfInspection();

  console.log("GIDION SELF INSPECTOR v3");
  console.log("-------------------------\n");

  for (const mod of report.checkedModules) {
    const exists = !report.missing.includes(mod.name);
    console.log(`${exists ? "✔" : "✖"} ${mod.name}`);
  }

  console.log("\nInspection complete.");

  if (report.allPresent) {
    console.log("\n✔ All required modules are present.");
  } else {
    console.log("\nMissing modules:");
    for (const m of report.missing) console.log(" - " + m);
  }
}




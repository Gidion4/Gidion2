// ------------------------------------------------------------
// GIDION LEVEL 4 — BOOTSTRAPPER TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa bootstrap.ts -moduulin keskeiset toiminnot:
//   - bootstrapperin olemassaolo
//   - moduulien löytyminen
//   - deterministinen rakenne
//
// Huom: Tämä EI käynnistä koko järjestelmää (liian raskas testiin).
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("✖ TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running Bootstrapper tests...");

  // --- Test 1: bootstrap.ts olemassa ---
  const bootstrapPath = path.join(__dirname, "bootstrap.ts");
  assert(fs.existsSync(bootstrapPath), "bootstrap.ts is missing");

  // --- Test 2: Kernel löytyy ---
  const kernelPath = path.join(__dirname, "../kernel/organizationKernel.ts");
  assert(fs.existsSync(kernelPath), "organizationKernel.ts is missing");

  // --- Test 3: AgentOrchestrator löytyy ---
  const orchestratorPath = path.join(__dirname, "../agents/agentOrchestrator.ts");
  assert(fs.existsSync(orchestratorPath), "agentOrchestrator.ts is missing");

  // --- Test 4: AgentCore löytyy ---
  const agentCorePath = path.join(__dirname, "../agents/agentCore.ts");
  assert(fs.existsSync(agentCorePath), "agentCore.ts is missing");

  console.log("✔ All Bootstrapper tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

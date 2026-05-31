// ------------------------------------------------------------
// GIDION LEVEL 4 â€” SYSTEM STATE EXPORTER TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemStateExporter.ts -moduulin keskeiset toiminnot:
//   - snapshotin vienti tiedostoon
//   - tiedoston olemassaolo
//   - ettei ylikirjoitusta tapahdu
//   - deterministinen toiminta
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exportSystemState } from "./systemStateExporter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running SystemStateExporter tests...");

  // --- Test 1: systemStateExporter.ts olemassa ---
  const exporterPath = path.join(__dirname, "systemStateExporter.ts");
  assert(fs.existsSync(exporterPath), "systemStateExporter.ts is missing");

  // --- Test 2: Export voidaan suorittaa ---
  const testDir = path.join(__dirname, "test_exports");
  const fileName = `snapshot_test_${Date.now()}.json`;

  const result = await exportSystemState(testDir, fileName);
  assert(result.success === true, "Export did not succeed");
  assert(typeof result.filePath === "string", "Export did not return a file path");

  // --- Test 3: Tiedosto luotiin ---
  assert(fs.existsSync(result.filePath!), "Exported file does not exist");

  // --- Test 4: Ylikirjoitusta ei sallita ---
  const secondResult = await exportSystemState(testDir, fileName);
  assert(
    secondResult.success === false,
    "Exporter allowed overwriting an existing file"
  );

  console.log("âœ” All SystemStateExporter tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


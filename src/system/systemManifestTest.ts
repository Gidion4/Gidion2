// ------------------------------------------------------------
// GIDION LEVEL 4 â€” SYSTEM MANIFEST TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa systemManifest.ts -moduulin keskeiset toiminnot:
//   - manifestin olemassaolo
//   - kaikkien polkujen olemassaolo
//   - kategorioiden validius
//   - deterministinen rakenne
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { systemManifest } from "./systemManifest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running SystemManifest tests...");

  // --- Test 1: systemManifest.ts olemassa ---
  const manifestPath = path.join(__dirname, "systemManifest.ts");
  assert(fs.existsSync(manifestPath), "systemManifest.ts is missing");

  // --- Test 2: Manifest ei ole tyhjÃ¤ ---
  assert(systemManifest.length > 0, "systemManifest is empty");

  // --- Test 3: Kaikki polut ovat olemassa ---
  for (const entry of systemManifest) {
    const fullPath = path.join(__dirname, entry.path);
    assert(
      fs.existsSync(fullPath),
      `Manifest entry '${entry.name}' missing at path: ${entry.path}`
    );
  }

  // --- Test 4: Kategoriat ovat validit ---
  const validCategories = ["core", "test", "agent", "system", "bootstrap"];
  for (const entry of systemManifest) {
    assert(
      validCategories.includes(entry.category),
      `Invalid category '${entry.category}' for entry '${entry.name}'`
    );
  }

  console.log("âœ” All SystemManifest tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}



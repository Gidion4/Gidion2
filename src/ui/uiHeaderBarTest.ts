// ------------------------------------------------------------
// GIDION UI v1 â€” HEADER BAR TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa uiHeaderBar.ts -moduulin keskeiset toiminnot:
//   - getUIHeaderBar palauttaa validin header-konfiguraation
//   - corePulse, actions ja style ovat oikeassa muodossa
//   - UI-kerros saa deterministisen header-pohjan
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUIHeaderBar } from "./uiHeaderBar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running UIHeaderBar tests...");

  // --- Test 1: uiHeaderBar.ts olemassa ---
  const modulePath = path.join(__dirname, "uiHeaderBar.ts");
  assert(fs.existsSync(modulePath), "uiHeaderBar.ts is missing");

  // --- Test 2: getUIHeaderBar toimii ---
  const header = getUIHeaderBar();
  assert(typeof header === "object", "getUIHeaderBar did not return an object");

  // --- Test 3: title on validi ---
  assert(typeof header.title === "string", "header.title invalid");

  // --- Test 4: corePulse on validi ---
  assert(typeof header.corePulse === "object", "corePulse missing or invalid");
  assert(typeof header.corePulse.enabled === "boolean", "corePulse.enabled invalid");
  assert(typeof header.corePulse.color === "string", "corePulse.color invalid");
  assert(typeof header.corePulse.intensity === "number", "corePulse.intensity invalid");
  assert(typeof header.corePulse.pulseSpeedMs === "number", "corePulse.pulseSpeedMs invalid");

  // --- Test 5: actions on validi ---
  assert(Array.isArray(header.actions), "header.actions is not an array");
  assert(header.actions.length > 0, "header.actions is empty");

  for (const action of header.actions) {
    assert(typeof action.key === "string", "action.key invalid");
    assert(typeof action.label === "string", "action.label invalid");
    assert(typeof action.icon === "string", "action.icon invalid");
    assert(typeof action.glow === "boolean", "action.glow invalid");
  }

  // --- Test 6: style on validi ---
  assert(typeof header.style === "object", "header.style missing or invalid");
  assert(typeof header.style.height === "string", "header.style.height invalid");
  assert(typeof header.style.background === "string", "header.style.background invalid");
  assert(typeof header.style.neonPrimary === "string", "header.style.neonPrimary invalid");
  assert(typeof header.style.neonSecondary === "string", "header.style.neonSecondary invalid");
  assert(typeof header.style.blur === "string", "header.style.blur invalid");

  console.log("âœ” All UIHeaderBar tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


// ------------------------------------------------------------
// GIDION LEVEL 4 â€” AUTONOMY LOOP TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa autonomyLoop.ts -moduulin keskeiset toiminnot:
//   - loopin kÃ¤ynnistys
//   - loopin pysÃ¤ytys
//   - tick-funktion kutsuminen
//   - integraatio ProjectEngineen
//
// Satunnaisuus on poistettu mockaamalla Math.random.
// ------------------------------------------------------------

import { ProjectEngine } from "../project/projectEngine.js";
import { AutonomyLoop } from "./autonomyLoop.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error("âœ– TEST FAILED:", message);
    process.exit(1);
  }
}

async function runTests() {
  console.log("Running AutonomyLoop tests...");

  // Mockataan Math.random â†’ deterministinen
  const originalRandom = Math.random;
  Math.random = () => 0.99; // ei koskaan tÃ¤ytÃ¤ "complete" ehtoa

  const engine = new ProjectEngine();
  engine.addProject("Test Project", 1, ["task1"]);

  const loop = new AutonomyLoop(engine);

  // --- Test 1: Loopin kÃ¤ynnistys ---
  loop.start(200);
  assert(true, "Loop start did not throw"); // kÃ¤ynnistys ei saa kaatua

  // Odotetaan 500ms â†’ tick kutsutaan ainakin kerran
  await new Promise((resolve) => setTimeout(resolve, 500));

  const active = engine.getActiveProjects();
  assert(active.length === 1, "Project was not activated by autonomy loop");

  // --- Test 2: Loopin pysÃ¤ytys ---
  loop.stop();
  assert(true, "Loop stop did not throw");

  // Palautetaan alkuperÃ¤inen random
  Math.random = originalRandom;

  console.log("âœ” All AutonomyLoop tests passed.");
  process.exit(0);
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}


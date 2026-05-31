// ------------------------------------------------------------
// GIDION LEVEL 3 — AUTONOMY LOOP TEST HARNESS v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa:
//   - autonomyLoop.ts
//   - pipelineEngine
//   - agenttien yhtenäinen rajapinta
//   - koko autonomisen suorituksen ketju
// ------------------------------------------------------------

import { runAutonomyLoop } from "./autonomyLoop.js";
import { Goal } from "./goalEngine.js";

function createMockGoal(title, priority, tags) {
  return {
    id: "mock-" + Math.random().toString(36).substring(2),
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: "pending",
    priority,
    tags
  };
}

async function run() {
  console.log("=== GIDION LEVEL 3 — AUTONOMY LOOP TEST ===");

  // ------------------------------------------------------------
  // TestGoal1
  // ------------------------------------------------------------
  const g1 = createMockGoal("tee testi pipeline", 2, ["test", "pipeline"]);
  const r1 = await runAutonomyLoop(g1);

  // ------------------------------------------------------------
  // TestGoal2
  // ------------------------------------------------------------
  const g2 = createMockGoal(
    "tee järjestelmä joka analysoi videoita url linkin kautta",
    1,
    ["video", "analysis", "system"]
  );
  const r2 = await runAutonomyLoop(g2);

  // ------------------------------------------------------------
  // TestGoal3
  // ------------------------------------------------------------
  const g3 = createMockGoal(
    "tee raportti gidionin kehitystehtävistä",
    3,
    ["report", "meta", "gidion"]
  );
  const r3 = await runAutonomyLoop(g3);

  // ------------------------------------------------------------
  // Tulostus
  // ------------------------------------------------------------
  console.log("\n=== AUTONOMY RESULT 1 ===");
  console.log(JSON.stringify(r1, null, 2));

  console.log("\n=== AUTONOMY RESULT 2 ===");
  console.log(JSON.stringify(r2, null, 2));

  console.log("\n=== AUTONOMY RESULT 3 ===");
  console.log(JSON.stringify(r3, null, 2));
}

run();


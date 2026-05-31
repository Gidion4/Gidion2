// ------------------------------------------------------------
// GIDION LEVEL 3 — TASK PLANNER TEST HARNESS v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa:
//   - taskPlanner.ts
//   - pipelineEngine yhteensopivuuden
//   - goal → pipeline -muunnoksen
// ------------------------------------------------------------

import { planGoal } from "./taskPlanner.js";
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
  console.log("=== GIDION LEVEL 3 — TASK PLANNER TEST ===");

  // ------------------------------------------------------------
  // TestGoal1
  // ------------------------------------------------------------
  const g1 = createMockGoal("tee testi pipeline", 2, ["test", "pipeline"]);
  const p1 = planGoal(g1);

  // ------------------------------------------------------------
  // TestGoal2
  // ------------------------------------------------------------
  const g2 = createMockGoal(
    "tee järjestelmä joka analysoi videoita url linkin kautta",
    1,
    ["video", "analysis", "system"]
  );
  const p2 = planGoal(g2);

  // ------------------------------------------------------------
  // TestGoal3
  // ------------------------------------------------------------
  const g3 = createMockGoal(
    "tee raportti gidionin kehitystehtävistä",
    3,
    ["report", "meta", "gidion"]
  );
  const p3 = planGoal(g3);

  // ------------------------------------------------------------
  // Tulostus
  // ------------------------------------------------------------
  console.log("\n=== PIPELINE 1 ===");
  console.log(JSON.stringify(p1, null, 2));

  console.log("\n=== PIPELINE 2 ===");
  console.log(JSON.stringify(p2, null, 2));

  console.log("\n=== PIPELINE 3 ===");
  console.log(JSON.stringify(p3, null, 2));
}

run();

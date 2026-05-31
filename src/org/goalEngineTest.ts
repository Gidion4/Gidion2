// ------------------------------------------------------------
// GIDION LEVEL 3 â€” GOAL ENGINE TEST HARNESS v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ tiedosto testaa:
//   - goalEngine.ts
//   - testGoal1, testGoal2, testGoal3
//   - listauksen ja tilojen toiminnan
// ------------------------------------------------------------

import { createGoal, listGoals } from "./goalEngine.js";

async function run() {
  console.log("=== GIDION LEVEL 3 â€” GOAL ENGINE TEST ===");

  // ------------------------------------------------------------
  // TestGoal1
  // ------------------------------------------------------------
  const g1 = createGoal({
    title: "tee testi pipeline",
    priority: 2,
    tags: ["test", "pipeline"]
  });

  // ------------------------------------------------------------
  // TestGoal2 (pÃ¤ivitetty sinun toiveesi mukaan)
  // ------------------------------------------------------------
  const g2 = createGoal({
    title:
      "tee jÃ¤rjestelmÃ¤ joka analysoi videoita url linkin kautta nÃ¤kemÃ¤llÃ¤ koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla",
    priority: 1,
    tags: ["video", "analysis", "system"]
  });

  // ------------------------------------------------------------
  // TestGoal3 (pÃ¤ivitetty sinun toiveesi mukaan)
  // ------------------------------------------------------------
  const g3 = createGoal({
    title:
      "tee raportti tehtÃ¤vistÃ¤, jotka perustuvat gidionin kehittÃ¤miseen ja pÃ¤ivittÃ¤miseen",
    priority: 3,
    tags: ["report", "meta", "gidion"]
  });

  // ------------------------------------------------------------
  // Tulostetaan kaikki tavoitteet
  // ------------------------------------------------------------
  const all = listGoals();

  console.log("\n=== LUODUT TAVOITTEET (JÃ„RJESTETTY) ===");
  console.log(JSON.stringify(all, null, 2));
}

run();


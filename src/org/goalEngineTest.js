// ------------------------------------------------------------
// GIDION LEVEL 3 — GOAL ENGINE TEST HARNESS v1
// ------------------------------------------------------------
// Tämä tiedosto testaa:
//   - goalEngine.ts
//   - testGoal1, testGoal2, testGoal3
//   - listauksen ja tilojen toiminnan
// ------------------------------------------------------------
import { createGoal, listGoals } from "./goalEngine";
async function run() {
    console.log("=== GIDION LEVEL 3 — GOAL ENGINE TEST ===");
    // ------------------------------------------------------------
    // TestGoal1
    // ------------------------------------------------------------
    const g1 = createGoal({
        title: "tee testi pipeline",
        priority: 2,
        tags: ["test", "pipeline"]
    });
    // ------------------------------------------------------------
    // TestGoal2 (päivitetty sinun toiveesi mukaan)
    // ------------------------------------------------------------
    const g2 = createGoal({
        title: "tee järjestelmä joka analysoi videoita url linkin kautta näkemällä koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla",
        priority: 1,
        tags: ["video", "analysis", "system"]
    });
    // ------------------------------------------------------------
    // TestGoal3 (päivitetty sinun toiveesi mukaan)
    // ------------------------------------------------------------
    const g3 = createGoal({
        title: "tee raportti tehtävistä, jotka perustuvat gidionin kehittämiseen ja päivittämiseen",
        priority: 3,
        tags: ["report", "meta", "gidion"]
    });
    // ------------------------------------------------------------
    // Tulostetaan kaikki tavoitteet
    // ------------------------------------------------------------
    const all = listGoals();
    console.log("\n=== LUODUT TAVOITTEET (JÄRJESTETTY) ===");
    console.log(JSON.stringify(all, null, 2));
}
run();

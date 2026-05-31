// ------------------------------------------------------------
// GIDION LEVEL 3 — AUTONOMY LOOP TEST HARNESS v1
// ------------------------------------------------------------
// Tämä tiedosto testaa:
//   - autonomyLoop.ts
//   - pipelineEngine v2
//   - agenttien yhtenäisen rajapinnan
//   - koko autonomisen suorituksen ketjun
//
// TestGoal1, TestGoal2 ja TestGoal3 suoritetaan mock-tilassa,
// koska autonomyLoop ei vaadi oikeaa Goal Engine -tilaa.
// ------------------------------------------------------------
import { runAutonomyLoop } from "./autonomyLoop";
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
    // TestGoal2 (videon analysointi URL:ista)
    // ------------------------------------------------------------
    const g2 = createMockGoal("tee järjestelmä joka analysoi videoita url linkin kautta näkemällä koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla", 1, ["video", "analysis", "system"]);
    const r2 = await runAutonomyLoop(g2);
    // ------------------------------------------------------------
    // TestGoal3 (raportti Gidionin kehitystehtävistä)
    // ------------------------------------------------------------
    const g3 = createMockGoal("tee raportti tehtävistä, jotka perustuvat gidionin kehittämiseen ja päivittämiseen", 3, ["report", "meta", "gidion"]);
    const r3 = await runAutonomyLoop(g3);
    // ------------------------------------------------------------
    // Tulostetaan tulokset
    // ------------------------------------------------------------
    console.log("\n=== AUTONOMY RESULT 1 (testGoal1) ===");
    console.log(JSON.stringify(r1, null, 2));
    console.log("\n=== AUTONOMY RESULT 2 (testGoal2) ===");
    console.log(JSON.stringify(r2, null, 2));
    console.log("\n=== AUTONOMY RESULT 3 (testGoal3) ===");
    console.log(JSON.stringify(r3, null, 2));
}
run();

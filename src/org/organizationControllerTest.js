// ------------------------------------------------------------
// GIDION LEVEL 3 — ORGANIZATION CONTROLLER TEST HARNESS v1
// ------------------------------------------------------------
// Tämä tiedosto testaa koko Level 3 -organisaatiokerroksen:
//   - create-goal
//   - list-goals
//   - run-goal
//   - status
//   - autonomyLoop
//   - pipelineEngine v2
//   - agenttien yhtenäinen rajapinta
//
// Tämä on koko järjestelmän läpivienti.
// ------------------------------------------------------------
import { handleOrgCommand } from "./organizationController";
async function run() {
    console.log("=== GIDION LEVEL 3 — ORGANIZATION CONTROLLER TEST ===");
    // ------------------------------------------------------------
    // LUODAAN TAVOITTEET
    // ------------------------------------------------------------
    const g1 = await handleOrgCommand({
        type: "create-goal",
        title: "tee testi pipeline"
    });
    const g2 = await handleOrgCommand({
        type: "create-goal",
        title: "tee järjestelmä joka analysoi videoita url linkin kautta näkemällä koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla"
    });
    const g3 = await handleOrgCommand({
        type: "create-goal",
        title: "tee raportti tehtävistä, jotka perustuvat gidionin kehittämiseen ja päivittämiseen"
    });
    console.log("\n=== LUODUT TAVOITTEET ===");
    console.log(JSON.stringify([g1, g2, g3], null, 2));
    // ------------------------------------------------------------
    // LISTATAAN TAVOITTEET
    // ------------------------------------------------------------
    const list = await handleOrgCommand({
        type: "list-goals"
    });
    console.log("\n=== LIST GOALS ===");
    console.log(JSON.stringify(list, null, 2));
    // ------------------------------------------------------------
    // SUORITETAAN TAVOITTEET AUTONOMISESTI
    // ------------------------------------------------------------
    const run1 = await handleOrgCommand({
        type: "run-goal",
        goalId: g1.data.id
    });
    const run2 = await handleOrgCommand({
        type: "run-goal",
        goalId: g2.data.id
    });
    const run3 = await handleOrgCommand({
        type: "run-goal",
        goalId: g3.data.id
    });
    console.log("\n=== AUTONOMY EXECUTION RESULTS ===");
    console.log(JSON.stringify([run1, run2, run3], null, 2));
    // ------------------------------------------------------------
    // HAE TAVOITTEIDEN TILAT
    // ------------------------------------------------------------
    const s1 = await handleOrgCommand({
        type: "status",
        goalId: g1.data.id
    });
    const s2 = await handleOrgCommand({
        type: "status",
        goalId: g2.data.id
    });
    const s3 = await handleOrgCommand({
        type: "status",
        goalId: g3.data.id
    });
    console.log("\n=== GOAL STATUS RESULTS ===");
    console.log(JSON.stringify([s1, s2, s3], null, 2));
}
run();

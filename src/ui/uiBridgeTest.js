// ------------------------------------------------------------
// GIDION LEVEL 3 — UI BRIDGE TEST HARNESS v1
// ------------------------------------------------------------
// Tämä tiedosto testaa:
//   - uiBridge.ts (natural language → org commands)
//   - organizationController.ts
//   - autonomyLoop.ts
//   - pipelineEngine v2
//   - agenttien yhtenäinen rajapinta
//
// Tämä simuloi UI:n toimintaa ilman oikeaa käyttöliittymää.
// ------------------------------------------------------------
import { handleUICommand } from "./uiBridge";
async function run() {
    console.log("=== GIDION LEVEL 3 — UI BRIDGE TEST ===");
    // ------------------------------------------------------------
    // LUODAAN TAVOITTEET LUONNOLLISEN KIELEN KAUTTA
    // ------------------------------------------------------------
    const u1 = await handleUICommand({
        type: "org",
        text: "tee testi pipeline"
    });
    const u2 = await handleUICommand({
        type: "org",
        text: "tee järjestelmä joka analysoi videoita url linkin kautta näkemällä koko videon, ja tekee sen pohjalta toimenpiteet alusta loppuun halutulla tavalla"
    });
    const u3 = await handleUICommand({
        type: "org",
        text: "tee raportti tehtävistä, jotka perustuvat gidionin kehittämiseen ja päivittämiseen"
    });
    console.log("\n=== LUODUT TAVOITTEET (UI) ===");
    console.log(JSON.stringify([u1, u2, u3], null, 2));
    // ------------------------------------------------------------
    // LISTATAAN TAVOITTEET UI:N KAUTTA
    // ------------------------------------------------------------
    const list = await handleUICommand({
        type: "org",
        text: "listaa tavoitteet"
    });
    console.log("\n=== LIST GOALS (UI) ===");
    console.log(JSON.stringify(list, null, 2));
    // ------------------------------------------------------------
    // SUORITETAAN TAVOITTEET AUTONOMISESTI UI:N KAUTTA
    // ------------------------------------------------------------
    const run1 = await handleUICommand({
        type: "org",
        text: `aja ${u1.result.id}`
    });
    const run2 = await handleUICommand({
        type: "org",
        text: `aja ${u2.result.id}`
    });
    const run3 = await handleUICommand({
        type: "org",
        text: `aja ${u3.result.id}`
    });
    console.log("\n=== AUTONOMY EXECUTION RESULTS (UI) ===");
    console.log(JSON.stringify([run1, run2, run3], null, 2));
    // ------------------------------------------------------------
    // HAE TAVOITTEIDEN TILAT UI:N KAUTTA
    // ------------------------------------------------------------
    const s1 = await handleUICommand({
        type: "org",
        text: `status ${u1.result.id}`
    });
    const s2 = await handleUICommand({
        type: "org",
        text: `status ${u2.result.id}`
    });
    const s3 = await handleUICommand({
        type: "org",
        text: `status ${u3.result.id}`
    });
    console.log("\n=== GOAL STATUS RESULTS (UI) ===");
    console.log(JSON.stringify([s1, s2, s3], null, 2));
}
run();

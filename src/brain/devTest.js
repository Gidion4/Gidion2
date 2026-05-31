// ------------------------------------------------------------
// GIDION ARC CORE — DEV TEST v2
// ------------------------------------------------------------
// Testaa Brain Engine v2:n toimintaa:
//  - tulostaa aivotilanteen
//  - ajaa agenttikohtaiset testit
//  - ajaa example-app pipeline -testin
// ------------------------------------------------------------
import { describeBrain, runBrainTask } from "./router";
async function main() {
    console.log("=== GIDION BRAIN DIAGNOSTICS ===");
    console.log(JSON.stringify(describeBrain(), null, 2));
    const tasks = [
        {
            label: "CORE / yleinen ajattelu",
            intent: "analyze",
            text: "Suunnittele korkean tason arkkitehtuuri Gidion-järjestelmälle."
        },
        {
            label: "CODEX / koodi",
            intent: "generate-code",
            text: "Luo esimerkkifunktio, joka tulostaa 'Hello from Gidion'."
        },
        {
            label: "VISION / kuva",
            intent: "prepare-image-generation",
            text: "Luo suunnitelma futuristiselle Arc Reactor -kuvalle."
        },
        {
            label: "OPS / järjestelmä",
            intent: "inspect-system",
            text: "Tarkista järjestelmän tila ja listaa perusrakenne."
        }
    ];
    for (const t of tasks) {
        console.log("\n---");
        console.log(`TASK: ${t.label}`);
        const res = await runBrainTask({
            intent: t.intent,
            text: t.text
        });
        console.log(JSON.stringify(res, null, 2));
    }
    // ------------------------------------------------------------
    // EXAMPLE APP PIPELINE TEST
    // ------------------------------------------------------------
    console.log("\n---");
    console.log("TASK: Example App Pipeline");
    const exampleApp = await (await import("../apps/example-app/handler"))
        .runExampleApp("Luo funktio, joka laskee kahden luvun summan.");
    console.log(JSON.stringify(exampleApp, null, 2));
    console.log("\n=== DONE ===");
}
main().catch(err => {
    console.error("DEV TEST FAILED:", err);
    process.exit(1);
});

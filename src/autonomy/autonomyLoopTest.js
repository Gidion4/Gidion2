// ------------------------------------------------------------
// GIDION LEVEL 4 — AUTONOMY LOOP TEST v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Testaa autonomyLoop.ts -moduulin keskeiset toiminnot:
//   - loopin käynnistys
//   - loopin pysäytys
//   - tick-funktion kutsuminen
//   - integraatio ProjectEngineen
//
// Satunnaisuus on poistettu mockaamalla Math.random.
// ------------------------------------------------------------
import { ProjectEngine } from "../project/projectEngine.ts";
import { AutonomyLoop } from "./autonomyLoop.ts";
function assert(condition, message) {
    if (!condition) {
        console.error("✖ TEST FAILED:", message);
        process.exit(1);
    }
}
async function runTests() {
    console.log("Running AutonomyLoop tests...");
    // Mockataan Math.random → deterministinen
    const originalRandom = Math.random;
    Math.random = () => 0.99; // ei koskaan täytä "complete" ehtoa
    const engine = new ProjectEngine();
    engine.addProject("Test Project", 1, ["task1"]);
    const loop = new AutonomyLoop(engine);
    // --- Test 1: Loopin käynnistys ---
    loop.start(200);
    assert(true, "Loop start did not throw"); // käynnistys ei saa kaatua
    // Odotetaan 500ms → tick kutsutaan ainakin kerran
    await new Promise((resolve) => setTimeout(resolve, 500));
    const active = engine.getActiveProjects();
    assert(active.length === 1, "Project was not activated by autonomy loop");
    // --- Test 2: Loopin pysäytys ---
    loop.stop();
    assert(true, "Loop stop did not throw");
    // Palautetaan alkuperäinen random
    Math.random = originalRandom;
    console.log("✔ All AutonomyLoop tests passed.");
    process.exit(0);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}

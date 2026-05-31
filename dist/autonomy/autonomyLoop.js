// ------------------------------------------------------------
// GIDION LEVEL 4 â€” AUTONOMY LOOP v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli muodostaa Gidionin autonomisen pÃ¤Ã¤tÃ¶ksenteon ytimen.
// Se:
//   - tarkistaa projektitilanteen
//   - aktivoi seuraavan projektin
//   - arvioi prioriteetteja
//   - suorittaa jatkuvan pÃ¤Ã¤tÃ¶ksenteon
//   - toimii pohjana organizationKernel v2:lle
// ------------------------------------------------------------
import { ProjectEngine } from "../project/projectEngine.js";
export class AutonomyLoop {
    engine;
    interval = null;
    constructor(engine) {
        this.engine = engine;
    }
    start(intervalMs = 2000) {
        if (this.interval)
            return;
        console.log("AutonomyLoop started.");
        this.interval = setInterval(() => {
            this.tick();
        }, intervalMs);
    }
    stop() {
        if (!this.interval)
            return;
        clearInterval(this.interval);
        this.interval = null;
        console.log("AutonomyLoop stopped.");
    }
    tick() {
        console.log("\n[AutonomyLoop] Tick");
        const active = this.engine.getActiveProjects();
        const pending = this.engine.getPendingProjects();
        console.log("Active projects:", active.length);
        console.log("Pending projects:", pending.length);
        // Jos ei ole aktiivisia projekteja â†’ aktivoi seuraava
        if (active.length === 0 && pending.length > 0) {
            const next = this.engine.activateNextProject();
            if (next) {
                console.log("Activated project:", next.name);
            }
        }
        // Jos aktiivinen projekti on valmis â†’ merkitse valmiiksi
        for (const p of active) {
            // TÃ¤mÃ¤ on placeholder-logiikka, joka voidaan korvata
            // agenttien todellisella arvioinnilla myÃ¶hemmin.
            const shouldComplete = Math.random() < 0.1;
            if (shouldComplete) {
                this.engine.completeProject(p.id);
                console.log("Completed project:", p.name);
            }
        }
    }
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    const engine = new ProjectEngine();
    engine.addProject("Initialize Level 4", 1, ["selfInspector", "selfTestRunner"]);
    engine.addProject("Build Project Engine", 2, ["design", "implement", "test"]);
    engine.addProject("Upgrade Autonomy Loop", 3, ["analysis", "rewrite"]);
    const loop = new AutonomyLoop(engine);
    loop.start(1500);
    // PysÃ¤ytÃ¤ 10 sekunnin jÃ¤lkeen
    setTimeout(() => loop.stop(), 10000);
}

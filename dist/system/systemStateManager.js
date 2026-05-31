// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SYSTEM STATE MANAGER v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli yhdistÃ¤Ã¤:
//   - systemStateExporter
//   - systemStateImporter
//
// ja tarjoaa yhden yhtenÃ¤isen API:n jÃ¤rjestelmÃ¤n tilan:
//   - tallentamiseen (saveState)
//   - lataamiseen (loadState)
//
// TÃ¤mÃ¤ toimii selfHealing-jÃ¤rjestelmÃ¤n "state I/O layer" -kerroksena
// sekÃ¤ UI-kerroksen "Save / Load System State" -toimintojen taustalla.
// ------------------------------------------------------------
import { exportSystemState } from "./systemStateExporter.js";
import { importSystemState } from "./systemStateImporter.js";
export async function saveState(outputDir = "./exports", fileName) {
    const name = fileName || `system_snapshot_${Date.now()}.json`;
    return await exportSystemState(outputDir, name);
}
export function loadState(filePath) {
    return importSystemState(filePath);
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    const mode = process.argv[2];
    if (mode === "save") {
        saveState().then((res) => {
            console.log("Gidion UltraHybrid Level 4 â€” Save System State");
            console.log(res);
        });
    }
    else if (mode === "load") {
        const file = process.argv[3];
        if (!file) {
            console.log("Usage: node systemStateManager.js load <file.json>");
            process.exit(1);
        }
        const res = loadState(file);
        console.log("Gidion UltraHybrid Level 4 â€” Load System State");
        console.log(res);
    }
    else {
        console.log("Usage:");
        console.log("  node systemStateManager.js save");
        console.log("  node systemStateManager.js load <file.json>");
    }
}

// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 â€” SYSTEM STATE EXPORTER v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// TÃ¤mÃ¤ moduuli:
//   - luo snapshotin
//   - vie sen JSON-tiedostoon
//   - toimii selfHealing-jÃ¤rjestelmÃ¤n "state archive" -kerroksena
//   - toimii UI-kerroksen "Export System State" -toiminnon taustalla
//
// Turvallisuus:
//   - ei koskaan ylikirjoita tiedostoa ilman lupaa
//   - luo kansion jos sitÃ¤ ei ole
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createSystemSnapshot } from "./systemSnapshot.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export async function exportSystemState(outputDir = "./exports", fileName = `system_snapshot_${Date.now()}.json`) {
    try {
        const snapshot = await createSystemSnapshot();
        const fullDir = path.resolve(outputDir);
        const fullPath = path.join(fullDir, fileName);
        // Luo kansio jos sitÃ¤ ei ole
        if (!fs.existsSync(fullDir)) {
            fs.mkdirSync(fullDir, { recursive: true });
        }
        // Ã„lÃ¤ ylikirjoita olemassa olevaa tiedostoa
        if (fs.existsSync(fullPath)) {
            return {
                success: false,
                filePath: null,
                error: `File already exists: ${fullPath}`
            };
        }
        fs.writeFileSync(fullPath, JSON.stringify(snapshot, null, 2), "utf-8");
        return {
            success: true,
            filePath: fullPath
        };
    }
    catch (err) {
        return {
            success: false,
            filePath: null,
            error: err?.message || "Unknown error"
        };
    }
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    exportSystemState().then((result) => {
        console.log("Gidion UltraHybrid Level 4 â€” System State Exporter");
        if (result.success) {
            console.log("âœ” Exported to:", result.filePath);
        }
        else {
            console.log("âœ– Export failed:", result.error);
        }
    });
}

import fs from "fs";
import path from "path";
const MEMORY_DIR = path.resolve("evolution_history");
function ensureDir() {
    if (!fs.existsSync(MEMORY_DIR)) {
        fs.mkdirSync(MEMORY_DIR, { recursive: true });
    }
}
export function saveEvolutionRecord(record) {
    ensureDir();
    const fileName = `evolution_${record.timestamp.replace(/[:.]/g, "-")}.json`;
    const filePath = path.join(MEMORY_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
    console.log(`Evolution record saved: ${filePath}`);
}

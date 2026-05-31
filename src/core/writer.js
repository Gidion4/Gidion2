import fs from "fs";
import path from "path";
import readline from "readline";
function askYesNo(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(`${question} (y/n): `, answer => {
            rl.close();
            const a = answer.trim().toLowerCase();
            resolve(a === "y" || a === "yes" || a === "k" || a === "kyllä");
        });
    });
}
function ensureDirExists(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function backupFileIfExists(filePath) {
    if (!fs.existsSync(filePath))
        return null;
    const dir = path.dirname(filePath);
    const base = path.basename(filePath);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `${base}.bak.${stamp}`;
    const backupPath = path.join(dir, backupName);
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
}
export async function applyPatches(patches) {
    if (patches.length === 0) {
        console.log("Ei patch-listaa – ei muutettavaa.");
        return;
    }
    console.log("=== EHDOTETUT MUUTOKSET ===");
    for (const p of patches) {
        console.log(`- ${p.action.toUpperCase()}: ${p.filePath}`);
    }
    console.log("");
    const ok = await askYesNo("Hyväksytkö, että Gidion kirjoittaa nämä muutokset levyille varmuuskopioiden kanssa?");
    if (!ok) {
        console.log("Muutoksia EI tehty.");
        return;
    }
    for (const patch of patches) {
        const absPath = path.resolve(patch.filePath);
        ensureDirExists(absPath);
        const backup = backupFileIfExists(absPath);
        if (backup) {
            console.log(`Varmuuskopioitu: ${absPath} -> ${backup}`);
        }
        fs.writeFileSync(absPath, patch.newContent, "utf8");
        console.log(`Kirjoitettu: ${absPath} (${patch.action})`);
    }
    console.log("");
    console.log("Kaikki hyväksytyt muutokset on kirjoitettu.");
}

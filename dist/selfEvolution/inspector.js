// ------------------------------------------------------------
// GIDION ARC CORE — SELF EVOLUTION: INSPECTOR v1
// ------------------------------------------------------------
// Tämä kerros analysoi Gidionin koodia ja tunnistaa:
//   - toisteisuuden
//   - arkkitehtuuriset heikkoudet
//   - modulaarisuusongelmat
//   - agenttien rooliristiriidat
//   - pipeline-ongelmat
//
// v1: ei tee muutoksia, vain analysoi
// v2: ehdottaa konkreettisia refaktorointeja
// v3: automaattinen itseparannus (valvottu)
//
// Tämä on Gidionin itsekehityksen perusta.
// ------------------------------------------------------------
import * as fs from "fs";
import * as path from "path";
// ------------------------------------------------------------
// TIEDOSTOJEN SKANNAUS
// ------------------------------------------------------------
function readAllFiles(dir, list = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            readAllFiles(full, list);
        }
        else if (e.isFile() && full.endsWith(".ts")) {
            list.push(full);
        }
    }
    return list;
}
// ------------------------------------------------------------
// ANALYYSI
// ------------------------------------------------------------
export function inspectCodebase(rootDir) {
    const files = readAllFiles(rootDir);
    const issues = [];
    for (const file of files) {
        const content = fs.readFileSync(file, "utf8");
        // 1) Toisteisuus: placeholder-koodi
        if (content.includes("placeholder")) {
            issues.push({
                file,
                type: "placeholder",
                message: "Tiedosto sisältää placeholder-koodia, joka tulisi korvata."
            });
        }
        // 2) Liiallinen kommentointi
        if ((content.match(/\/\//g) || []).length > 40) {
            issues.push({
                file,
                type: "comment-density",
                message: "Tiedostossa on epätavallisen paljon kommentteja."
            });
        }
        // 3) Agenttien rooliristiriidat
        if (content.includes("agent") && content.includes("invoke")) {
            if (content.includes("TODO") || content.includes("fixme")) {
                issues.push({
                    file,
                    type: "agent-incomplete",
                    message: "Agentin logiikka sisältää keskeneräisiä kohtia."
                });
            }
        }
        // 4) Pipeline-ongelmat
        if (content.includes("runPipeline") && content.includes("any")) {
            issues.push({
                file,
                type: "pipeline-weak-typing",
                message: "Pipeline käyttää liian löysiä tyyppejä."
            });
        }
    }
    // ------------------------------------------------------------
    // YHTEENVETO
    // ------------------------------------------------------------
    const summary = [
        `Skannattuja tiedostoja: ${files.length}`,
        `Löydettyjä ongelmia: ${issues.length}`,
        issues.length === 0
            ? "Koodipohja näyttää hyvältä."
            : "Koodipohja sisältää parannettavia kohtia."
    ];
    return {
        ok: true,
        scannedFiles: files.length,
        issues,
        summary
    };
}
// ------------------------------------------------------------
// SUORA KÄYTTÖ (CLI)
// ------------------------------------------------------------
if (require.main === module) {
    const root = path.join(__dirname, "..");
    const result = inspectCodebase(root);
    console.log(JSON.stringify(result, null, 2));
}

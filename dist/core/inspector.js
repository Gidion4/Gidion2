import fs from "fs";
import path from "path";
import { askOllama } from "../tools/ollama.js";
function collectFiles(root, exts = [".ts"]) {
    const result = [];
    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) {
                walk(full);
            }
            else if (exts.includes(path.extname(e.name))) {
                result.push(full);
            }
        }
    }
    if (fs.existsSync(root)) {
        walk(root);
    }
    return result;
}
export async function runInspection(ctx) {
    const files = [];
    for (const scope of ctx.scopePaths) {
        const abs = path.resolve(scope);
        const collected = collectFiles(abs);
        files.push(...collected);
    }
    const sampleContents = [];
    for (const f of files.slice(0, 10)) {
        try {
            const content = fs.readFileSync(f, "utf8");
            sampleContents.push(`FILE: ${f}\n${content}\n\n`);
        }
        catch {
            // ignore
        }
    }
    const prompt = `
Olet arkkitehtuuri-inspektori Gidion-jÃ¤rjestelmÃ¤lle.

Tavoite: ${ctx.goal}

Sinulle annetaan otos Gidionin nykyisestÃ¤ koodista (TypeScript, Node.js, ts-node, CommonJS-moduulit).
Analysoi:
- arkkitehtuurin rakenne
- modulaarisuus
- laajennettavuus
- itsekehityskyvyn mahdollisuudet
- riskit ja heikkoudet

Anna:
1) YtimekÃ¤s yleiskuvaus nykytilasta
2) Lista tÃ¤rkeimmistÃ¤ parannuskohteista (bullet-lista)
3) Konkreettiset ehdotukset, miten Gidion voisi kehittÃ¤Ã¤ itseÃ¤Ã¤n (itse-evoluutio)

Koodi-otos:

${sampleContents.join("\n")}
`;
    const report = await askOllama(prompt);
    return {
        files,
        report
    };
}

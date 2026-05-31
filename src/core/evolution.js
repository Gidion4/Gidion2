import { askOllama } from "../tools/ollama";
export async function proposeEvolutionPlan(ctx, inspection, suggestions) {
    const prompt = `
Olet Gidionin evoluutiomoottori.

TÄRKEÄÄ:
- Tässä evoluutiokierroksessa luodaan VAIN YKSI uusi moduuli.
- Moduulin nimi: src/core/modularity.ts
- Action: "create"
- Sisältö: KOKO TypeScript-tiedosto, joka:
    * analysoi projektin kansiorakennetta
    * laskee yksinkertaisia modulariteettimittareita
    * palauttaa tulokset JSON-muodossa
- EI muita tiedostoja
- EI rename/move/delete
- EI konfiguraatiotiedostoja
- EI .js-tiedostoja
- EI abstrakteja ideoita
- VAIN konkreettinen, toimiva TypeScript-moduuli

Muotoile vastaus TÄSMÄLLEEN näin:

EVOLUTION_PLAN:
<ihmiselle luettava kuvaus>

PATCHES_JSON:
[
  {
    "filePath": "src/core/modularity.ts",
    "action": "create",
    "newContent": "<KOKO TIEDOSTON SISÄLTÖ>"
  }
]

Inspektioraportti:

${inspection.report}

Koodigeneraattorin ehdotukset:

${suggestions.suggestionsText}
`;
    const raw = await askOllama(prompt);
    const splitMarker = "PATCHES_JSON:";
    const idx = raw.indexOf(splitMarker);
    let planText = raw;
    let patches = [];
    if (idx !== -1) {
        planText = raw.substring(0, idx).trim();
        const jsonPart = raw.substring(idx + splitMarker.length).trim();
        try {
            const parsed = JSON.parse(jsonPart);
            if (Array.isArray(parsed)) {
                patches = parsed.filter(p => p.filePath === "src/core/modularity.ts" &&
                    p.action === "create" &&
                    typeof p.newContent === "string");
            }
        }
        catch { }
    }
    return {
        planText,
        patches
    };
}

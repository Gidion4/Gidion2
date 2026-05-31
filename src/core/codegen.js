import { askOllama } from "../tools/ollama";
export async function generateCodeSuggestions(ctx, inspection) {
    const prompt = `
Olet Gidionin koodigeneraattori.

Tavoite: ${ctx.goal}

Sinulle annetaan:
- Inspektioraportti Gidionin nykytilasta
- Tieto siitä, että Gidion käyttää TypeScriptiä, Node.js:ää, ts-nodea ja CommonJS-moduuleja

Tehtäväsi:
1) Ehdota konkreettisia uusia moduuleja, tiedostoja tai luokkia, jotka parantavat Gidionin itsekehityskykyä
2) Ehdota refaktorointeja nykyisiin tiedostoihin (mutta ÄLÄ vielä kirjoita lopullista koodia)
3) Muotoile ehdotukset "patch-luonnoksina" (kuvaile mitä tiedostoja pitäisi muuttaa ja miten)

Inspektioraportti:

${inspection.report}
`;
    const suggestionsText = await askOllama(prompt);
    return {
        suggestionsText
    };
}

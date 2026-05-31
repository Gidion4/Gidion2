import { askOllama } from "../tools/ollama.js"
import { EvolutionContext } from "./agent-engine.js"
import { InspectionResult } from "./inspector.js"

export interface CodeSuggestions {
  suggestionsText: string
}

export async function generateCodeSuggestions(
  ctx: EvolutionContext,
  inspection: InspectionResult
): Promise<CodeSuggestions> {
  const prompt = `
Olet Gidionin koodigeneraattori.

Tavoite: ${ctx.goal}

Sinulle annetaan:
- Inspektioraportti Gidionin nykytilasta
- Tieto siitÃ¤, ettÃ¤ Gidion kÃ¤yttÃ¤Ã¤ TypeScriptiÃ¤, Node.js:Ã¤Ã¤, ts-nodea ja CommonJS-moduuleja

TehtÃ¤vÃ¤si:
1) Ehdota konkreettisia uusia moduuleja, tiedostoja tai luokkia, jotka parantavat Gidionin itsekehityskykyÃ¤
2) Ehdota refaktorointeja nykyisiin tiedostoihin (mutta Ã„LÃ„ vielÃ¤ kirjoita lopullista koodia)
3) Muotoile ehdotukset "patch-luonnoksina" (kuvaile mitÃ¤ tiedostoja pitÃ¤isi muuttaa ja miten)

Inspektioraportti:

${inspection.report}
`

  const suggestionsText = await askOllama(prompt)

  return {
    suggestionsText
  }
}


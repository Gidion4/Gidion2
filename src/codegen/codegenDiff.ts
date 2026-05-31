// ------------------------------------------------------------
// CODEGEN DIFF PRO
// ------------------------------------------------------------
// Luo turvallisen diffin alkuperäisen ja generoidun koodin välille.
// ------------------------------------------------------------

import fs from "fs/promises";

export async function generateDiff(originalPath: string, generated: string): Promise<string> {
  try {
    const original = await fs.readFile(originalPath, "utf8");
    const oLines = original.split("\n");
    const gLines = generated.split("\n");

    const diff: string[] = [];

    const max = Math.max(oLines.length, gLines.length);
    for (let i = 0; i < max; i++) {
      const o = oLines[i] ?? "";
      const g = gLines[i] ?? "";

      if (o !== g) {
        diff.push(`- ${o}`);
        diff.push(`+ ${g}`);
      }
    }

    return diff.join("\n");
  } catch {
    return "// Diff unavailable (file missing)";
  }
}

// ------------------------------------------------------------
// EVOLUTION CONTEXT PRO
// ------------------------------------------------------------
// Lukee moduulin ja rakentaa analyysikontekstin:
//   - raw code
//   - rivit
//   - importit/exportit
//   - perus symbolitaulu (funktiot, interfacet)
// ------------------------------------------------------------
import fs from "fs/promises";
export async function createEvolutionContext(path) {
    const code = await fs.readFile(path, "utf8");
    const lines = code.split("\n");
    const imports = [];
    const exports = [];
    const symbols = [];
    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("import ")) {
            imports.push(trimmed);
        }
        if (trimmed.startsWith("export ")) {
            exports.push(trimmed);
        }
        if (trimmed.startsWith("export function ")) {
            const name = trimmed
                .replace("export function ", "")
                .split("(")[0]
                .trim();
            symbols.push({
                name,
                kind: "function",
                line: idx + 1
            });
        }
        if (trimmed.startsWith("export interface ")) {
            const name = trimmed
                .replace("export interface ", "")
                .split("{")[0]
                .trim();
            symbols.push({
                name,
                kind: "interface",
                line: idx + 1
            });
        }
        if (trimmed.startsWith("export type ")) {
            const name = trimmed
                .replace("export type ", "")
                .split("=")[0]
                .trim();
            symbols.push({
                name,
                kind: "type",
                line: idx + 1
            });
        }
        if (trimmed.startsWith("export class ")) {
            const name = trimmed
                .replace("export class ", "")
                .split("{")[0]
                .trim();
            symbols.push({
                name,
                kind: "class",
                line: idx + 1
            });
        }
        if (trimmed.startsWith("export const ")) {
            const name = trimmed
                .replace("export const ", "")
                .split("=")[0]
                .trim();
            symbols.push({
                name,
                kind: "const",
                line: idx + 1
            });
        }
    });
    return {
        path,
        code,
        lines,
        imports,
        exports,
        symbols
    };
}

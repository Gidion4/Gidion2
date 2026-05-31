// ------------------------------------------------------------
// INSPECTOR MODULE LOADER
// ------------------------------------------------------------
// Lukee moduulin sisällön ja palauttaa:
//   - raw code
//   - rivit
//   - metadata
// ------------------------------------------------------------
import fs from "fs/promises";
export async function loadModuleSource(path) {
    const code = await fs.readFile(path, "utf8");
    return {
        path,
        code,
        lines: code.split("\n")
    };
}

// ------------------------------------------------------------
// GIDION ULTRAHYBRID LEVEL 4 — SYSTEM STATE IMPORTER v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä moduuli:
//   - lukee snapshot-tiedoston
//   - validoi sen rakenteen
//   - palauttaa järjestelmän tilan objektina
//
// Turvallisuus:
//   - ei koskaan ylikirjoita mitään
//   - ei tee muutoksia järjestelmään automaattisesti
//   - toimii selfHealing-järjestelmän "state restore" -kerroksena
// ------------------------------------------------------------

import fs from "fs";
import path from "path";

export interface ImportResult {
  success: boolean;
  data: any | null;
  error?: string;
}

export function importSystemState(filePath: string): ImportResult {
  try {
    const resolved = path.resolve(filePath);

    if (!fs.existsSync(resolved)) {
      return {
        success: false,
        data: null,
        error: `File not found: ${resolved}`
      };
    }

    const raw = fs.readFileSync(resolved, "utf-8");
    const json = JSON.parse(raw);

    // --- Validointi ---
    const requiredKeys = ["timestamp", "manifest", "overview", "health", "diagnostics"];

    for (const key of requiredKeys) {
      if (!Object.prototype.hasOwnProperty.call(json, key)) {
        return {
          success: false,
          data: null,
          error: `Invalid snapshot: missing key '${key}'`
        };
      }
    }

    return {
      success: true,
      data: json
    };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err?.message || "Unknown error"
    };
  }
}

// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2];
  if (!file) {
    console.log("Usage: node systemStateImporter.js <snapshot.json>");
    process.exit(1);
  }

  const result = importSystemState(file);
  console.log("Gidion UltraHybrid Level 4 — System State Importer");
  console.log(result);
}

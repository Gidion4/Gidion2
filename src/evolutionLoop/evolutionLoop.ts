// ------------------------------------------------------------
// GIDION ULTRAHYBRID v3 PRO — EVOLUTION LOOP (FIXED)
// ------------------------------------------------------------

import fs from "fs/promises";
import path from "path";

import { inspectModule } from "../inspector/inspectorEngine.js";
import { evolveModule } from "../evolution/evolutionEngine.js";
import { runCodegen } from "../codegen/codegenEngine.js";
import { runRefactor } from "../refactor/refactorEngine.js";
import { evaluateScaling } from "../scaling/scalingController.js";

export interface EvolutionLoopResult {
  ok: boolean;
  message: string;
  inspect: any;
  evolve: any;
  codegen: any;
  refactor: any;
  scaling: any;
}

export async function runEvolutionLoop(modulePath: string): Promise<EvolutionLoopResult> {
  try {
    // 1) Inspect
    const inspect = await inspectModule(modulePath);

    // 2) Evolution
    const evolve = await evolveModule(modulePath);

    // 3) Lue moduulin koodi Codegenia varten
    const code = await fs.readFile(modulePath, "utf8");

    // 4) Codegen
    const codegen = await runCodegen({
      type: evolve.issues.length > 0 ? "fix" : "refactor",
      modulePath,
      context: { code },
      issues: evolve.issues
    });

    // 5) Refactor
    const refactor = await runRefactor(modulePath);

    // 6) Scaling
    const scaling = await evaluateScaling();

    return {
      ok: true,
      message: "Evolution loop completed.",
      inspect,
      evolve,
      codegen,
      refactor,
      scaling
    };
  } catch (err: any) {
    return {
      ok: false,
      message: "Evolution loop failed: " + (err?.message ?? String(err)),
      inspect: null,
      evolve: null,
      codegen: null,
      refactor: null,
      scaling: null
    };
  }
}


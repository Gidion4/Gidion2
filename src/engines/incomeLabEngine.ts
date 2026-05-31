import { GidionEngine, GidionContext, GidionMode } from "../core/gidionCore.js";
import { spawn } from "child_process";
import * as path from "path";

export class IncomeLabEngine implements GidionEngine {
  name = "IncomeLabEngine";

  supports(mode: GidionMode): boolean {
    return mode === "income_lab";
  }

  run(ctx: GidionContext): Promise<string> {
    return new Promise((resolve, reject) => {
      const root = "C:\\Gidion";
      const script = path.join(root, "core", "income_lab", "income_lab.ps1");

      const ps = spawn("powershell.exe", [
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", script,
        "-Root", root
      ]);

      let output = "";
      let error = "";

      ps.stdout.on("data", d => (output += d.toString()));
      ps.stderr.on("data", d => (error += d.toString()));

      ps.on("close", code => {
        if (code === 0) {
          resolve(output.trim() || "IncomeLab completed.");
        } else {
          reject(new Error(error || `IncomeLab exited with code ${code}`));
        }
      });
    });
  }
}


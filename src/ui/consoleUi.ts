import * as readline from "readline";
import { GidionCore, GidionMode } from "../core/gidionCore.js";

export class ConsoleUi {
  constructor(private core: GidionCore) {}

  start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const ask = () => {
      rl.question("Mode (chat/income_lab/product/marketing/sales/scaling or exit): ", async modeInput => {
        if (modeInput === "exit") {
          rl.close();
          return;
        }

        const mode = (modeInput as GidionMode) || "chat";

        rl.question("Input: ", async text => {
          const res = await this.core.handle({ mode, input: text });
          console.log("\n=== GIDION RESPONSE ===");
          console.log(res);
          console.log("=======================\n");
          ask();
        });
      });
    };

    ask();
  }
}


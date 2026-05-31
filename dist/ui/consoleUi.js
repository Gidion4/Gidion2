import * as readline from "readline";
export class ConsoleUi {
    core;
    constructor(core) {
        this.core = core;
    }
    start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const ask = () => {
            rl.question("Mode (chat/income_lab/product/marketing/sales/scaling or exit): ", async (modeInput) => {
                if (modeInput === "exit") {
                    rl.close();
                    return;
                }
                const mode = modeInput || "chat";
                rl.question("Input: ", async (text) => {
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

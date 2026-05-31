import readline from "readline";
import { runSystemIntegration } from "./system/systemIntegration.js";
import { AutonomousEngine } from "./autonomous/autonomousEngine.js";
import { DialogManager } from "./chat/dialogManager.js";

async function startREPL() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const autonomous = new AutonomousEngine();
  const dialog = new DialogManager();

  const prompt = () => rl.question("Mode (chat/income_lab/product/marketing/sales/scaling or exit): ", async (mode) => {
    if (!mode) return prompt();
    if (mode === "exit") {
      rl.close();
      process.exit(0);
    }
    try {
      if (mode === "income_lab") {
        const res = await autonomous.runAutonomousCycle("demo-project");
        console.log("Autonomous result:", res);
      } else if (mode === "chat") {
        rl.question("You: ", async (userInput) => {
          const sessionId = "session-demo";
          const res = await dialog.handleTurn(sessionId, userInput);
          console.log("Assistant:", res.reply);
          prompt();
        });
        return;
      } else {
        const res = await runSystemIntegration({ mode });
        console.log("Pipeline result:", res);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    prompt();
  });

  prompt();
}

startREPL().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});

import readline from "readline";
import { askOllama } from "../tools/ollama";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function main() {
    console.log("Gidion v1.0 — UltraHybrid Core Loaded");
    const loop = () => {
        rl.question("> ", async (input) => {
            const clean = input.trim().toLowerCase();
            if (clean === "exit") {
                rl.close();
                return;
            }
            try {
                const answer = await askOllama(input);
                console.log(`\n[Gidion]: ${answer}\n`);
            }
            catch (err) {
                console.error("Virhe Ollama-kutsussa:", err);
            }
            loop();
        });
    };
    loop();
}
main();

import readline from "readline";
import axios from "axios";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
async function askOllama(prompt) {
    const res = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt,
        stream: false,
    });
    return res.data.response;
}
async function main() {
    console.log("Gidion-Local v0.1 — yhteys Ollamaan valmis");
    const loop = () => {
        rl.question("> ", async (input) => {
            if (input.trim().toLowerCase() === "exit") {
                rl.close();
                return;
            }
            try {
                const answer = await askOllama(input);
                console.log("\n[Gidion]:", answer, "\n");
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

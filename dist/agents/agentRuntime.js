// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT RUNTIME LAYER
// ------------------------------------------------------------
// Tämä moduuli on agenttien ajomoottori. Se vastaa:
//   - tehtävien suorittamisesta sandboxissa
//   - agentin STM/LTM-muistin käytöstä
//   - agentin viestinnästä muiden agenttien kanssa
//   - turvallisesta, deterministisestä ajosta
//
// TÄRKEÄÄ:
//   - Ei koskaan aja suoraa koodia agentilta
//   - Kaikki tehtävät suoritetaan "simuloituna" sandboxina
//   - Ei riskiä tuotantokoodille
// ------------------------------------------------------------
import { stmSet, stmClear, ltmSet } from "./agentMemory.js";
import { sendMessage } from "./agentCommunication.js";
// Luo agentille runtime-konteksti
export function createAgentRuntime(agent, memory) {
    return {
        agent,
        memory,
        // Suorita tehtävä sandboxissa
        async runTask(task) {
            // Nollataan STM ennen tehtävää
            stmClear(memory);
            // Simuloitu sandbox-ajologiikka
            const output = {
                message: `Agent ${agent.name} processed task '${task.description}'.`,
                payloadEcho: task.payload,
                reasoningStyle: agent.style.reasoning,
                communicationStyle: agent.style.communication
            };
            // Tallennetaan STM:ään
            stmSet(memory, "last-task", task.id);
            stmSet(memory, "last-output", output);
            // Tallennetaan LTM:ään (agentin oppiminen)
            ltmSet(memory, `task-history:${task.id}`, {
                timestamp: Date.now(),
                output
            });
            // Agentti voi lähettää viestin muille agenteille
            sendMessage({
                from: agent.id,
                to: "all",
                type: "task-complete",
                payload: {
                    agent: agent.name,
                    task: task.description
                },
                timestamp: Date.now()
            });
            return {
                ok: true,
                agentId: agent.id,
                taskId: task.id,
                output,
                memoryChanges: {
                    stm: ["last-task", "last-output"],
                    ltm: [`task-history:${task.id}`]
                },
                timestamp: Date.now()
            };
        }
    };
}

// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT COMMUNICATION LAYER
// ------------------------------------------------------------
// Tämä kerros mahdollistaa agenttien välisen viestinnän:
//   - suorat viestit agentilta agentille
//   - broadcast-viestit kaikille agenteille
//   - tiimien muodostus
//   - tehtävien jako
//   - yhteistyö pipeline-tehtävissä
//
// Kaikki viestit ovat:
//   - deterministisiä
//   - turvallisia
//   - rajattuja
//   - eivät koskaan aja koodia ilman hyväksyntää
// ------------------------------------------------------------

import { AgentIdentity } from "./agentIdentity.js";
import { cmSet, cmGet } from "./agentMemory.js";

export interface AgentMessage {
  from: string;        // agent ID
  to: string | "all";  // kohdeagentti tai broadcast
  type: string;        // viestin tyyppi
  payload: any;        // viestin sisältö
  timestamp: number;
}

export interface AgentRegistry {
  [id: string]: AgentIdentity;
}

export const agentRegistry: AgentRegistry = {};

// Rekisteröi agentti kommunikaatiojärjestelmään
export function registerAgent(agent: AgentIdentity) {
  agentRegistry[agent.id] = agent;
}

// Lähetä viesti agentilta toiselle
export function sendMessage(msg: AgentMessage) {
  msg.timestamp = Date.now();

  if (msg.to === "all") {
    // Broadcast kaikille agenteille
    for (const id of Object.keys(agentRegistry)) {
      deliverMessage(id, msg);
    }
  } else {
    // Suora viesti
    deliverMessage(msg.to, msg);
  }
}

// Toimittaa viestin agentille (simuloitu, ei suoraa koodin ajoa)
function deliverMessage(agentId: string, msg: AgentMessage) {
  const agent = agentRegistry[agentId];
  if (!agent) return;

  // Tallennetaan kollektiiviseen muistiin
  const key = `msg:${agentId}:${msg.timestamp}`;
  cmSet(key, msg);
}

// Luo agenttitiimi
export function createAgentTeam(agentIds: string[]) {
  return {
    id: "team-" + crypto.randomUUID(),
    members: agentIds,
    created: Date.now()
  };
}

// Lähetä tehtävä tiimille
export function sendTaskToTeam(team: { id: string; members: string[] }, task: any) {
  for (const member of team.members) {
    sendMessage({
      from: "system",
      to: member,
      type: "team-task",
      payload: task,
      timestamp: Date.now()
    });
  }
}

// Hae agentille saapuneet viestit kollektiivisesta muistista
export function getMessagesForAgent(agentId: string) {
  const all = cmGet("all-messages") || [];
  return all.filter((m: AgentMessage) => m.to === agentId || m.to === "all");
}

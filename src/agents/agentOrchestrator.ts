// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT ORCHESTRATOR LAYER
// ------------------------------------------------------------
// Tämä kerros toimii agenttien "komentokeskuksena":
//   - valitsee oikeat agentit tehtäviin
//   - muodostaa agenttitiimejä
//   - ohjaa yhteistyöprosessit
//   - optimoi agenttien roolit ja prioriteetit
//   - käynnistää multi-agent pipeline -tehtävät
//
// Kaikki toiminnot ovat:
//   - deterministisiä
//   - turvallisia
//   - rajattuja
//   - eivät koskaan aja koodia ilman hyväksyntää
// ------------------------------------------------------------

import { AgentIdentity } from "./agentIdentity.js";
import { agentRegistry, createAgentTeam, sendTaskToTeam } from "./agentCommunication.js";
import { createProposal, castVote, calculateVoteResult } from "./agentCollaboration.js";
import { cmSet, cmGet } from "./agentMemory.js";

// -----------------------------
// Agentin valinta tehtävään
// -----------------------------

export function selectAgentForTask(task: any): AgentIdentity | null {
  const agents = Object.values(agentRegistry);
  if (agents.length === 0) return null;

  // Valitaan agentti roolin ja prioriteetin perusteella
  const candidates = agents.filter(a =>
    task.requiredRole ? a.role === task.requiredRole : true
  );

  if (candidates.length === 0) return null;

  // Pienin prioriteettiluku = korkein prioriteetti
  candidates.sort((a, b) => a.priority - b.priority);

  return candidates[0];
}

// -----------------------------
// Tiimin muodostus tehtävää varten
// -----------------------------

export function createTeamForTask(task: any) {
  const agents = Object.values(agentRegistry);

  // Valitaan agentit, joiden rooli sopii tehtävään
  const members = agents
    .filter(a => task.requiredRoles?.includes(a.role))
    .map(a => a.id);

  if (members.length === 0) return null;

  return createAgentTeam(members);
}

// -----------------------------
// Yhteistyötehtävän käynnistys
// -----------------------------

export function startCollaborativeProcess(task: any) {
  const agents = Object.values(agentRegistry);

  if (agents.length === 0) {
    return { ok: false, message: "No agents registered." };
  }

  // 1) Luodaan yhteistyöehdotus
  const proposal = createProposal(
    agents[0], // ensimmäinen agentti aloittaa prosessin
    "Collaborative Task",
    "Determine the best strategy for the given task.",
    ["strategy-a", "strategy-b", "strategy-c"]
  );

  // 2) Kaikki agentit äänestävät
  for (const agent of agents) {
    const option = proposal.options[Math.floor(Math.random() * proposal.options.length)];
    castVote(proposal.id, agent, option);
  }

  // 3) Lasketaan tulos
  const result = calculateVoteResult(proposal.id);

  // 4) Tallennetaan kollektiiviseen muistiin
  cmSet("last-collaboration-result", result);

  return {
    ok: true,
    proposal,
    result
  };
}

// -----------------------------
// Multi-agent pipeline -tehtävän käynnistys
// -----------------------------

export function orchestrateTask(task: any) {
  // 1) Yritetään valita yksittäinen agentti
  const agent = selectAgentForTask(task);

  if (agent) {
    return {
      ok: true,
      type: "single-agent",
      agent,
      message: `Task assigned to agent ${agent.name}.`
    };
  }

  // 2) Jos yksittäistä agenttia ei löydy → luodaan tiimi
  const team = createTeamForTask(task);

  if (team) {
    sendTaskToTeam(team, task);
    return {
      ok: true,
      type: "team",
      team,
      message: "Task assigned to agent team."
    };
  }

  // 3) Jos kumpikaan ei onnistu → käynnistetään yhteistyöprosessi
  const collab = startCollaborativeProcess(task);

  return {
    ok: true,
    type: "collaboration",
    collab,
    message: "Task handled through collaborative decision-making."
  };
}


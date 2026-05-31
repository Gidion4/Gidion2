// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT COLLABORATION LAYER
// ------------------------------------------------------------
// Tämä kerros mahdollistaa agenttien kollektiivisen älyn:
//   - yhteistyötehtävät
//   - yhteiset päätökset
//   - äänestysmekanismit
//   - ehdotusten arviointi
//   - tiimien muodostus
//   - tehtävien jako agenttien kesken
//
// Kaikki toiminnot ovat:
//   - deterministisiä
//   - turvallisia
//   - rajattuja
//   - eivät koskaan aja koodia ilman hyväksyntää
// ------------------------------------------------------------

import { AgentIdentity } from "./agentIdentity.js";
import { agentRegistry } from "./agentCommunication.js";
import { cmSet, cmGet } from "./agentMemory.js";

// -----------------------------
// Yhteistyöehdotus
// -----------------------------

export interface CollaborationProposal {
  id: string;
  from: string; // agent ID
  title: string;
  description: string;
  options: string[];
  created: number;
}

// -----------------------------
// Äänestys
// -----------------------------

export interface Vote {
  agentId: string;
  option: string;
  weight: number;
}

// Luo uuden yhteistyöehdotuksen
export function createProposal(
  from: AgentIdentity,
  title: string,
  description: string,
  options: string[]
): CollaborationProposal {
  const proposal: CollaborationProposal = {
    id: "proposal-" + crypto.randomUUID(),
    from: from.id,
    title,
    description,
    options,
    created: Date.now()
  };

  // Tallennetaan kollektiiviseen muistiin
  const proposals = cmGet("proposals") || [];
  proposals.push(proposal);
  cmSet("proposals", proposals);

  return proposal;
}

// Agentti äänestää ehdotuksesta
export function castVote(proposalId: string, agent: AgentIdentity, option: string): Vote {
  const vote: Vote = {
    agentId: agent.id,
    option,
    weight: 1 / agent.priority // korkea prioriteetti = suurempi paino
  };

  const key = `votes:${proposalId}`;
  const votes = cmGet(key) || [];
  votes.push(vote);
  cmSet(key, votes);

  return vote;
}

// Laske äänestyksen tulos
export function calculateVoteResult(proposalId: string) {
  const key = `votes:${proposalId}`;
  const votes: Vote[] = cmGet(key) || [];

  const tally: Record<string, number> = {};

  for (const v of votes) {
    tally[v.option] = (tally[v.option] || 0) + v.weight;
  }

  let bestOption = null;
  let bestScore = -Infinity;

  for (const [option, score] of Object.entries(tally)) {
    if (score > bestScore) {
      bestScore = score;
      bestOption = option;
    }
  }

  return {
    proposalId,
    tally,
    bestOption,
    bestScore
  };
}

// -----------------------------
// Yhteistyötehtävä
// -----------------------------

export function assignCollaborativeTask(
  proposalId: string,
  task: any
) {
  const result = calculateVoteResult(proposalId);

  // Tallennetaan kollektiiviseen muistiin
  const tasks = cmGet("collab-tasks") || [];
  tasks.push({
    id: "task-" + crypto.randomUUID(),
    proposalId,
    chosenOption: result.bestOption,
    task,
    assigned: Date.now()
  });
  cmSet("collab-tasks", tasks);

  return result;
}

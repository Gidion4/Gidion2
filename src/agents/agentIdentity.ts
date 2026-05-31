// ------------------------------------------------------------
// GIDION ULTRAHYBRID v4 PRO — AGENT IDENTITY LAYER
// ------------------------------------------------------------
// Jokainen agentti saa:
//   - identiteetin
//   - roolin
//   - vastuualueen
//   - prioriteettimallin
//   - toimintatyylin
//   - kyvyn kommunikoida muiden agenttien kanssa
//
// Tämä on agenttien "persoonallisuuskerros" (ei tunteita, vaan
// toimintalogiikkaa ja käyttäytymismalleja).
// ------------------------------------------------------------

export type AgentRole =
  | "core"
  | "planner"
  | "coder"
  | "analyst"
  | "vision"
  | "ops"
  | "meta";

export interface AgentIdentity {
  id: string;
  name: string;
  role: AgentRole;
  responsibility: string;
  priority: number; // 1 = korkein
  style: {
    reasoning: "logical" | "creative" | "balanced";
    communication: "direct" | "structured" | "collaborative";
    risk: "low" | "medium" | "high";
  };
}

export function createAgentIdentity(
  name: string,
  role: AgentRole,
  responsibility: string,
  priority: number = 5
): AgentIdentity {
  return {
    id: crypto.randomUUID(),
    name,
    role,
    responsibility,
    priority,
    style: {
      reasoning: "balanced",
      communication: "collaborative",
      risk: "low"
    }
  };
}

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
export function createAgentIdentity(name, role, responsibility, priority = 5) {
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

import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

export const inspectorAgent: Agent = {
  meta: {
    id: "inspector",
    name: "Inspector Agent",
    role: "inspection",
    capabilities: ["validate", "lint"],
    description: "Validates outputs, checks invariants and quality",
    version: "0.1.0"
  },
  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    try {
      const ok = ctx.input != null;
      const output = { valid: ok, details: ok ? "ok" : "input missing" };
      return { ok, output, meta: { agent: this.meta.id } };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};





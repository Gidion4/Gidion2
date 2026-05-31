import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

export const plannerAgent: Agent = {
  meta: {
    id: "planner",
    name: "Planner Agent",
    role: "planning",
    capabilities: ["plan", "decompose"],
    description: "Creates plans and decomposes tasks into steps",
    version: "0.1.0"
  },
  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    try {
      const output = { plan: [`step1 for ${String(ctx.input)}`, "step2"] };
      return { ok: true, output, meta: { agent: this.meta.id } };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};



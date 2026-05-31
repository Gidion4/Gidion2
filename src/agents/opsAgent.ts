import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

export const opsAgent: Agent = {
  meta: {
    id: "ops",
    name: "Ops Agent",
    role: "system",
    capabilities: ["system", "state"],
    description: "Performs system operations and state management",
    version: "0.1.0"
  },
  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    try {
      const output = { uptime: process.uptime(), received: ctx.input };
      return { ok: true, output, meta: { agent: this.meta.id } };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};



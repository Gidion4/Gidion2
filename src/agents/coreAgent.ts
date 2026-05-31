import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

export const coreAgent: Agent = {
  meta: {
    id: "core",
    name: "Core Agent",
    role: "utility",
    capabilities: ["basic"],
    description: "Core utilities and small helpers",
    version: "0.1.0"
  },
  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    try {
      const output = { echo: ctx.input };
      return { ok: true, output, meta: { agent: this.meta.id } };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};




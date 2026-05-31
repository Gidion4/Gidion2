import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

export const codexAgent: Agent = {
  meta: {
    id: "codex",
    name: "Codex Agent",
    role: "generation",
    capabilities: ["generation"],
    description: "Generative model wrapper for content and code generation",
    version: "0.1.0"
  },
  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    try {
      const output = { text: `Generated content for input: ${String(ctx.input)}` };
      return { ok: true, output, meta: { agent: this.meta.id } };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err) };
    }
  }
};




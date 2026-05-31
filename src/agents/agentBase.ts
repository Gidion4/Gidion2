import { Agent, AgentInvokeContext, AgentResult } from "./agentTypes.js";

/**
 * Lightweight base class providing common behavior:
 * - standardized invoke wrapper
 * - timeout handling
 * - simple logging hooks
 */
export abstract class AgentBase implements Agent {
  abstract meta: any;

  async init(): Promise<void> {}

  async shutdown(): Promise<void> {}

  protected async handleInvoke(fn: (ctx: AgentInvokeContext) => Promise<AgentResult>, ctx: AgentInvokeContext): Promise<AgentResult> {
    const start = Date.now();
    try {
      const timeoutMs = ctx.timeoutMs ?? 30000;
      const resultPromise = fn(ctx);
      const timeoutPromise = new Promise<AgentResult>((resolve) =>
        setTimeout(() => resolve({ ok: false, error: `timeout after ${timeoutMs}ms` }), timeoutMs)
      );
      const result = await Promise.race([resultPromise, timeoutPromise]);
      result.durationMs = Date.now() - start;
      return result;
    } catch (err: any) {
      return { ok: false, error: err?.message ?? String(err), durationMs: Date.now() - start };
    }
  }

  async invoke(ctx: AgentInvokeContext): Promise<AgentResult> {
    return this.handleInvoke(this._invoke.bind(this), ctx);
  }

  protected abstract _invoke(ctx: AgentInvokeContext): Promise<AgentResult>;
}



/**
 * Lightweight base class providing common behavior:
 * - standardized invoke wrapper
 * - timeout handling
 * - simple logging hooks
 */
export class AgentBase {
    async init() { }
    async shutdown() { }
    async handleInvoke(fn, ctx) {
        const start = Date.now();
        try {
            const timeoutMs = ctx.timeoutMs ?? 30000;
            const resultPromise = fn(ctx);
            const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ ok: false, error: `timeout after ${timeoutMs}ms` }), timeoutMs));
            const result = await Promise.race([resultPromise, timeoutPromise]);
            result.durationMs = Date.now() - start;
            return result;
        }
        catch (err) {
            return { ok: false, error: err?.message ?? String(err), durationMs: Date.now() - start };
        }
    }
    async invoke(ctx) {
        return this.handleInvoke(this._invoke.bind(this), ctx);
    }
}

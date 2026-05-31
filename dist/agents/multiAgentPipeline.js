/* Utility: sanitize objects/strings before logging */
function sanitizeForLogs(input) {
    try {
        let s = typeof input === "string" ? input : JSON.stringify(input);
        s = s.replace(/<WebsiteContent_[^>]*>/g, "[REDACTED]");
        s = s.replace(/edge_all_open_tabs\s*=\s*, [[s, S] *  ?  : ]);
        /g, "[REDACTED_EDGE_TABS]";
        ;
        if (s.length > 1000)
            s = s.slice(0, 1000) + "...[truncated]";
        return s;
    }
    catch {
        return "[log-sanitization-failed]";
    }
}
export class MultiAgentPipeline {
    steps = [];
    hooks = [];
    constructor(initialSteps = []) {
        this.steps = initialSteps;
    }
    addHook(h) {
        this.hooks.push(h);
    }
    emit(event, meta) {
        const safeMeta = {
            stepId: meta?.stepId,
            agentId: meta?.agentId,
            summary: meta?.summary,
            note: meta?.note ? sanitizeForLogs(meta.note) : undefined
        };
        for (const h of this.hooks) {
            try {
                h(event, safeMeta);
            }
            catch { /* swallow errors from hooks */ }
        }
    }
    addStep(step) {
        this.steps.push(step);
    }
    clearSteps() {
        this.steps = [];
    }
    async run(input, sessionId) {
        this.emit("pipeline.start", { summary: `steps=${this.steps.length}` });
        const results = {};
        for (const step of this.steps) {
            this.emit("step.start", { stepId: step.id, agentId: step.agent.meta.id, summary: "starting step" });
            const ctx = {
                input,
                sessionId,
                timeoutMs: step.timeoutMs
            };
            const attempt = async (attemptNo) => {
                const res = await step.agent.invoke(ctx);
                if (!res.ok && attemptNo < (step.retries ?? 0)) {
                    const backoff = 100 * Math.pow(2, attemptNo);
                    await new Promise(r => setTimeout(r, backoff));
                    return attempt(attemptNo + 1);
                }
                return res;
            };
            const res = await attempt(0);
            results[step.id] = res;
            const note = res.output ?? res.error ?? null;
            this.emit("step.end", { stepId: step.id, agentId: step.agent.meta.id, summary: res.ok ? "ok" : "error", note: note ? String(note) : undefined });
            if (!res.ok) {
                this.emit("pipeline.error", { stepId: step.id, agentId: step.agent.meta.id, summary: res.error ?? "unknown", note: res.error ?? undefined });
                return { ok: false, results };
            }
        }
        this.emit("pipeline.end", { summary: "completed" });
        return { ok: true, results };
    }
}

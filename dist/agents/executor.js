export const executorAgent = {
    meta: {
        id: "executor",
        name: "Executor Agent",
        role: "execution",
        capabilities: ["execute"],
        description: "Executes tasks and side-effects (safe sandboxed placeholders)",
        version: "0.1.0"
    },
    async invoke(ctx) {
        try {
            const output = { executed: true, input: ctx.input };
            return { ok: true, output, meta: { agent: this.meta.id } };
        }
        catch (err) {
            return { ok: false, error: err?.message ?? String(err) };
        }
    }
};

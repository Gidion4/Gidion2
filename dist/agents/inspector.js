export const inspectorAgent = {
    meta: {
        id: "inspector",
        name: "Inspector Agent",
        role: "inspection",
        capabilities: ["validate", "lint"],
        description: "Validates outputs, checks invariants and quality",
        version: "0.1.0"
    },
    async invoke(ctx) {
        try {
            const ok = ctx.input != null;
            const output = { valid: ok, details: ok ? "ok" : "input missing" };
            return { ok, output, meta: { agent: this.meta.id } };
        }
        catch (err) {
            return { ok: false, error: err?.message ?? String(err) };
        }
    }
};

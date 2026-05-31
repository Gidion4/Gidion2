// ------------------------------------------------------------
// GIDION LEVEL 3 — STANDARD AGENT BASE v2
// ------------------------------------------------------------
export async function runAgent(handler, req) {
    try {
        return await handler(req);
    }
    catch (err) {
        return {
            ok: false,
            error: err?.message ?? "Agent error"
        };
    }
}

import { runAgent } from "./agentBase";
async function codexHandler(req) {
    return {
        ok: true,
        result: `CODEX-agentti käsittelee koodia: ${req.input}`
    };
}
export async function CODEX(req) {
    return runAgent(codexHandler, req);
}

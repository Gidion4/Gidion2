import { runAgent } from "./agentBase";
async function coreHandler(req) {
    return {
        ok: true,
        result: `CORE-agentti analysoi: ${req.input}`
    };
}
export async function CORE(req) {
    return runAgent(coreHandler, req);
}

import { runAgent } from "./agentBase";
async function opsHandler(req) {
    return {
        ok: true,
        result: `OPS-agentti suorittaa järjestelmäoperaation: ${req.input}`
    };
}
export async function OPS(req) {
    return runAgent(opsHandler, req);
}

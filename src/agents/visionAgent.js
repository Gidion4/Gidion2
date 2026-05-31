import { runAgent } from "./agentBase";
async function visionHandler(req) {
    return {
        ok: true,
        result: `VISION-agentti analysoi visuaalista sisältöä: ${req.input}`
    };
}
export async function VISION(req) {
    return runAgent(visionHandler, req);
}

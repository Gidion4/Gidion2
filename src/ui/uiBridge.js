// ------------------------------------------------------------
// GIDION LEVEL 3 — UI BRIDGE v2
// ------------------------------------------------------------
// Tämä versio yhdistää UI:n suoraan Organization Controlleriin.
// UI antaa vain yhden komennon:
//    "tee X"
// ja Gidion hoitaa loput.
//
// v1: brain/app routing
// v2: organization-first routing
// v3: natural language → goal → autonomous execution
// ------------------------------------------------------------
import { handleOrgCommand } from "../org/organizationController";
// ------------------------------------------------------------
// NATURAL LANGUAGE → ORGANIZATION COMMAND
// ------------------------------------------------------------
function interpretAsOrgCommand(text) {
    const t = text.toLowerCase();
    // Luo uusi tavoite
    if (t.startsWith("tee ") || t.startsWith("luo ") || t.startsWith("rakenna ")) {
        return {
            type: "create-goal",
            title: text
        };
    }
    // Suorita tavoite
    if (t.startsWith("suorita ") || t.startsWith("aja ")) {
        const parts = text.split(" ");
        const goalId = parts[1];
        return {
            type: "run-goal",
            goalId
        };
    }
    // Listaa tavoitteet
    if (t.includes("tavoitteet") || t.includes("goals")) {
        return { type: "list-goals" };
    }
    return null;
}
// ------------------------------------------------------------
// UI BRIDGE v2
// ------------------------------------------------------------
export async function handleUICommand(cmd) {
    // 1) ORGANIZATION MODE (Level 3)
    if (cmd.type === "org" && cmd.text) {
        const orgCmd = interpretAsOrgCommand(cmd.text);
        if (!orgCmd) {
            return {
                ok: false,
                source: "organization",
                error: "En ymmärtänyt komentoa organisaatiotasolla."
            };
        }
        const res = await handleOrgCommand(orgCmd);
        return {
            ok: res.ok,
            source: "organization",
            result: res.data,
            message: res.message,
            error: res.ok ? undefined : res.message
        };
    }
    // 2) BACKWARD COMPATIBILITY (brain/app)
    if (cmd.type === "brain") {
        return {
            ok: false,
            source: "brain",
            error: "Brain-tason komennot on korvattu Organization Layerilla."
        };
    }
    if (cmd.type === "app") {
        return {
            ok: false,
            source: "app",
            error: "App Runner ei ole käytössä Level 3 -tilassa."
        };
    }
    return {
        ok: false,
        source: "organization",
        error: "Tuntematon UI-komento."
    };
}

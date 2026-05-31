// ------------------------------------------------------------
// GIDION LEVEL 3 — ORGANIZATION CONTROLLER v2 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Tämä kerros yhdistää:
//   - Goal Engine
//   - Task Planner
//   - Autonomy Loop
//
// Se tarjoaa yhden sisääntulopisteen koko Level 3 -järjestelmälle.
// ------------------------------------------------------------
import { createGoal, listGoals, getGoal } from "./goalEngine.js";
import { runAutonomyLoop } from "./autonomyLoop.js";
// ------------------------------------------------------------
// ORGANIZATION CONTROLLER
// ------------------------------------------------------------
export async function handleOrgCommand(cmd) {
    try {
        // ------------------------------------------------------------
        // LUO TAVOITE
        // ------------------------------------------------------------
        if (cmd.type === "create-goal") {
            if (!cmd.title) {
                return { ok: false, message: "Goal title puuttuu." };
            }
            const goal = createGoal({
                title: cmd.title,
                description: cmd.description
            });
            return {
                ok: true,
                message: "Tavoite luotu.",
                data: goal
            };
        }
        // ------------------------------------------------------------
        // LISTAA TAVOITTEET
        // ------------------------------------------------------------
        if (cmd.type === "list-goals") {
            const goals = listGoals();
            return {
                ok: true,
                message: "Tavoitteet listattu.",
                data: goals
            };
        }
        // ------------------------------------------------------------
        // SUORITA TAVOITE AUTONOMISESTI
        // ------------------------------------------------------------
        if (cmd.type === "run-goal") {
            if (!cmd.goalId) {
                return { ok: false, message: "goalId puuttuu." };
            }
            const goal = getGoal(cmd.goalId);
            if (!goal) {
                return { ok: false, message: "Tavoitetta ei löytynyt." };
            }
            const result = await runAutonomyLoop(goal);
            return {
                ok: result.ok,
                message: result.message ?? "Autonomy loop completed.",
                data: result
            };
        }
        // ------------------------------------------------------------
        // HAE TAVOITTEEN TILA
        // ------------------------------------------------------------
        if (cmd.type === "status") {
            if (!cmd.goalId) {
                return { ok: false, message: "goalId puuttuu." };
            }
            const goal = getGoal(cmd.goalId);
            if (!goal) {
                return { ok: false, message: "Tavoitetta ei löytynyt." };
            }
            return {
                ok: true,
                message: "Tavoitteen tila haettu.",
                data: goal
            };
        }
        // ------------------------------------------------------------
        // TUNTEMATON KOMENTO
        // ------------------------------------------------------------
        return {
            ok: false,
            message: "Tuntematon Organization-komento."
        };
    }
    catch (err) {
        return {
            ok: false,
            message: "Organization Controller virhe.",
            data: err?.message ?? String(err)
        };
    }
}
// ------------------------------------------------------------
// SUORA KÄYTTÖ (CLI)
// ------------------------------------------------------------
if (typeof require !== "undefined" && require.main === module) {
    (async () => {
        const res = await handleOrgCommand({
            type: "create-goal",
            title: "Testaa Organization Controller"
        });
        console.log(JSON.stringify(res, null, 2));
    })();
}

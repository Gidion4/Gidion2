// ------------------------------------------------------------
// GIDION LEVEL 3 — GOAL ENGINE v3 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Vastaa:
//   - goalien luonnista
//   - goalien tallennuksesta
//   - goalien hakemisesta
//   - goalien listauksesta
// ------------------------------------------------------------
const goalStore = {};
// ------------------------------------------------------------
// LUO TAVOITE
// ------------------------------------------------------------
export function createGoal(data) {
    const id = "goal-" + Math.random().toString(36).substring(2);
    const goal = {
        id,
        title: data.title,
        description: data.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "pending",
        priority: data.priority ?? 1,
        tags: data.tags ?? []
    };
    goalStore[id] = goal;
    return goal;
}
// ------------------------------------------------------------
// HAE TAVOITE
// ------------------------------------------------------------
export function getGoal(id) {
    return goalStore[id];
}
// ------------------------------------------------------------
// LISTAA TAVOITTEET
// ------------------------------------------------------------
export function listGoals() {
    return Object.values(goalStore);
}
// ------------------------------------------------------------
// PÄIVITÄ TAVOITE
// ------------------------------------------------------------
export function updateGoal(id, patch) {
    const g = goalStore[id];
    if (!g)
        return undefined;
    const updated = {
        ...g,
        ...patch,
        updatedAt: Date.now()
    };
    goalStore[id] = updated;
    return updated;
}
// ------------------------------------------------------------
// EI CLI-BLOKKIA (ESM-YHTEENSOPIVA)
// ------------------------------------------------------------

// ------------------------------------------------------------
// GIDION LEVEL 3 — GOAL ENGINE v1
// ------------------------------------------------------------
// Tämän kerroksen tehtävä on:
//   - vastaanottaa tavoitteita (goals)
//   - muodostaa projekteja
//   - ylläpitää tilaa (state) käynnissä olevista tavoitteista
//   - tarjota yksi rajapinta Organization-tasolle
//
// v1: in-memory, yksinkertainen rakenne
// v2: pysyvä muisti (tiedosto / DB)
// v3: semanttinen goal-reasoning CORE-agentilla
// ------------------------------------------------------------
import { v4 as uuidv4 } from "uuid";
// In-memory tila v1
const state = {
    goals: []
};
// ------------------------------------------------------------
// API
// ------------------------------------------------------------
export function createGoal(input) {
    const now = Date.now();
    const goal = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        createdAt: now,
        updatedAt: now,
        status: "pending",
        priority: input.priority ?? 3,
        tags: input.tags ?? []
    };
    state.goals.push(goal);
    return goal;
}
export function listGoals(filter) {
    let goals = [...state.goals];
    if (filter?.status) {
        goals = goals.filter(g => g.status === filter.status);
    }
    if (filter?.tag) {
        goals = goals.filter(g => g.tags.includes(filter.tag));
    }
    // Järjestetään prioriteetin ja ajan mukaan
    goals.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        return a.createdAt - b.createdAt;
    });
    return goals;
}
export function updateGoalStatus(id, status) {
    const goal = state.goals.find(g => g.id === id);
    if (!goal)
        return null;
    goal.status = status;
    goal.updatedAt = Date.now();
    return goal;
}
export function getGoal(id) {
    return state.goals.find(g => g.id === id) ?? null;
}
export function deleteGoal(id) {
    const idx = state.goals.findIndex(g => g.id === id);
    if (idx === -1)
        return false;
    state.goals.splice(idx, 1);
    return true;
}
export function getState() {
    return state;
}
// ------------------------------------------------------------
// SUORA KÄYTTÖ (CLI)
// ------------------------------------------------------------
if (require.main === module) {
    const g1 = createGoal({
        title: "Rakenna Gidion Level 3 Organization Layer",
        priority: 1,
        tags: ["gidion", "level3", "organization"]
    });
    const g2 = createGoal({
        title: "Integroi Goal Engine taskPlanneriin",
        priority: 2,
        tags: ["planner", "integration"]
    });
    console.log("Luodut tavoitteet:");
    console.log(JSON.stringify([g1, g2], null, 2));
    console.log("\nKaikki tavoitteet (järjestettynä):");
    console.log(JSON.stringify(listGoals(), null, 2));
}

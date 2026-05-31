// ------------------------------------------------------------
// GIDION LEVEL 3 — TASK PLANNER v1
// ------------------------------------------------------------
// Tämä kerros:
//   - ottaa vastaan Goal Enginen tavoitteet
//   - pilkkoo ne tehtäviksi
//   - valitsee agentit
//   - rakentaa pipeline-rakenteen
//
// v1: sääntöpohjainen, yksinkertainen
// v2: CORE-agentin ohjaama semanttinen suunnittelu
// v3: autonominen projektisuunnittelu
// ------------------------------------------------------------
// ------------------------------------------------------------
// SÄÄNTÖPOHJAINEN AGENTTIVALINTA v1
// ------------------------------------------------------------
function chooseAgentForTask(task) {
    const t = task.toLowerCase();
    if (t.includes("koodi") || t.includes("funktio") || t.includes("refaktor")) {
        return "CODEX";
    }
    if (t.includes("kuva") || t.includes("visuaali") || t.includes("analysoi kuva")) {
        return "VISION";
    }
    if (t.includes("järjestelmä") || t.includes("tiedosto") || t.includes("komento")) {
        return "OPS";
    }
    return "CORE";
}
// ------------------------------------------------------------
// TEHTÄVÄN PILKKOMINEN v1
// ------------------------------------------------------------
function breakGoalIntoTasks(goal) {
    const base = goal.title.toLowerCase();
    // Yksinkertainen heuristiikka v1
    if (base.includes("rakenna") || base.includes("luo")) {
        return [
            `Analysoi tavoite: ${goal.title}`,
            `Suunnittele toteutus: ${goal.title}`,
            `Tuota konkreettinen ratkaisu: ${goal.title}`,
            `Tee laadunvarmistus: ${goal.title}`
        ];
    }
    return [
        `Analysoi tavoite: ${goal.title}`,
        `Suorita tehtävä: ${goal.title}`
    ];
}
// ------------------------------------------------------------
// PIPELINE GENEROINTI
// ------------------------------------------------------------
export function planGoal(goal) {
    const tasks = breakGoalIntoTasks(goal);
    const steps = tasks.map((task, index) => ({
        name: `step_${index + 1}`,
        agent: chooseAgentForTask(task),
        intent: "analyze",
        input: task
    }));
    return {
        id: `pipeline_${goal.id}`,
        description: `Pipeline for goal: ${goal.title}`,
        steps
    };
}
// ------------------------------------------------------------
// SUORA KÄYTTÖ (CLI)
// ------------------------------------------------------------
if (require.main === module) {
    const exampleGoal = {
        id: "demo",
        title: "Rakenna Gidion Level 3 Task Planner",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: "pending",
        priority: 1,
        tags: []
    };
    const plan = planGoal(exampleGoal);
    console.log(JSON.stringify(plan, null, 2));
}

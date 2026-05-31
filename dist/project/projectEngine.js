// ------------------------------------------------------------
// GIDION LEVEL 4 — PROJECT ENGINE v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Vastaa projektien hallinnasta, priorisoinnista, agenttien
// työnjaosta ja resurssien kohdistamisesta.
//
// Tämä on ensimmäinen versio Gidionin multi-project schedulerista.
// ------------------------------------------------------------
export class ProjectEngine {
    state;
    constructor(initialState) {
        this.state = initialState || { projects: [] };
    }
    addProject(name, priority, tasks) {
        const project = {
            id: crypto.randomUUID(),
            name,
            priority,
            tasks,
            status: "pending"
        };
        this.state.projects.push(project);
        this.sortProjects();
        return project;
    }
    sortProjects() {
        this.state.projects.sort((a, b) => a.priority - b.priority);
    }
    activateNextProject() {
        const next = this.state.projects.find(p => p.status === "pending");
        if (!next)
            return null;
        next.status = "active";
        return next;
    }
    completeProject(id) {
        const project = this.state.projects.find(p => p.id === id);
        if (!project)
            return false;
        project.status = "completed";
        return true;
    }
    getActiveProjects() {
        return this.state.projects.filter(p => p.status === "active");
    }
    getPendingProjects() {
        return this.state.projects.filter(p => p.status === "pending");
    }
    getCompletedProjects() {
        return this.state.projects.filter(p => p.status === "completed");
    }
    getAllProjects() {
        return [...this.state.projects];
    }
}
// ------------------------------------------------------------
// CLI ENTRYPOINT (ESM)
// ------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
    const engine = new ProjectEngine();
    engine.addProject("Initialize Level 4", 1, ["selfInspector", "selfTestRunner"]);
    engine.addProject("Build Project Engine", 2, ["design", "implement", "test"]);
    engine.addProject("Upgrade Autonomy Loop", 3, ["analysis", "rewrite"]);
    console.log("All projects:");
    console.log(engine.getAllProjects());
}

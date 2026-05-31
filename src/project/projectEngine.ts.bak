// ------------------------------------------------------------
// GIDION LEVEL 4 — PROJECT ENGINE v1 (ESM-COMPATIBLE)
// ------------------------------------------------------------
// Vastaa projektien hallinnasta, priorisoinnista, agenttien
// työnjaosta ja resurssien kohdistamisesta.
//
// Tämä on ensimmäinen versio Gidionin multi-project schedulerista.
// ------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  priority: number;        // 1 = korkein
  tasks: string[];
  status: "pending" | "active" | "completed";
}

export interface ProjectEngineState {
  projects: Project[];
}

export class ProjectEngine {
  private state: ProjectEngineState;

  constructor(initialState?: ProjectEngineState) {
    this.state = initialState || { projects: [] };
  }

  addProject(name: string, priority: number, tasks: string[]): Project {
    const project: Project = {
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

  private sortProjects() {
    this.state.projects.sort((a, b) => a.priority - b.priority);
  }

  activateNextProject(): Project | null {
    const next = this.state.projects.find(p => p.status === "pending");
    if (!next) return null;

    next.status = "active";
    return next;
  }

  completeProject(id: string): boolean {
    const project = this.state.projects.find(p => p.id === id);
    if (!project) return false;

    project.status = "completed";
    return true;
  }

  getActiveProjects(): Project[] {
    return this.state.projects.filter(p => p.status === "active");
  }

  getPendingProjects(): Project[] {
    return this.state.projects.filter(p => p.status === "pending");
  }

  getCompletedProjects(): Project[] {
    return this.state.projects.filter(p => p.status === "completed");
  }

  getAllProjects(): Project[] {
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

import { AutonomousEngine } from "./autonomousEngine.js";

console.log("=== AUTONOMOUS ENGINE TEST ===");

const engine = new AutonomousEngine();

const goal = {
  name: "demo-autonomous-task",
  description: "Create a demo project and write files.",
  steps: [
    "create-demo-project",
    "write-log-file",
    "generate-readme"
  ]
};

const plan = engine.createPlan(goal);

console.log("Generated Plan:");
console.log(plan);

// Simuloidaan käyttäjän hyväksyntä
plan.approved = true;

engine.executePlan(plan).then(result => {
  console.log("Execution Results:");
  console.log(result);
});

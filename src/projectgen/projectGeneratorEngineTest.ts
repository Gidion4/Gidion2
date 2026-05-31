import { ProjectGeneratorEngine } from "./projectGeneratorEngine.js";

console.log("=== PROJECT GENERATOR TEST ===");

const gen = new ProjectGeneratorEngine();
const path = gen.createProject("auto-project");

console.log("Project created at:", path);

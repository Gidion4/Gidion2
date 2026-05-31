// ------------------------------------------------------------
// GIDION ARC CORE — APP RUNNER v1
// ------------------------------------------------------------
// Tämä kerros mahdollistaa:
//   - sovellusten rekisteröinnin
//   - dynaamisen latauksen
//   - pipeline-ajon
//   - yhtenäisen rajapinnan UI:lle
//
// v2: hot-reload, app sandboxing
// v3: app permissions, multi-agent orchestration
// ------------------------------------------------------------
import { createPipeline, runPipeline } from "../brain/pipelineEngine";
import * as fs from "fs";
import * as path from "path";
// ------------------------------------------------------------
// APP REGISTRY
// ------------------------------------------------------------
const APPS_DIR = path.join(__dirname);
export function listApps() {
    const dirs = fs.readdirSync(APPS_DIR, { withFileTypes: true });
    const apps = [];
    for (const d of dirs) {
        if (!d.isDirectory())
            continue;
        const manifestPath = path.join(APPS_DIR, d.name, "manifest.json");
        if (!fs.existsSync(manifestPath))
            continue;
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        apps.push(manifest);
    }
    return apps;
}
export function loadApp(appId) {
    const apps = listApps();
    const found = apps.find(a => a.id === appId);
    if (!found) {
        throw new Error(`App '${appId}' not found`);
    }
    return found;
}
// ------------------------------------------------------------
// APP RUNNER
// ------------------------------------------------------------
export async function runApp(appId, userInput) {
    const manifest = loadApp(appId);
    const entryPath = path.join(APPS_DIR, manifest.id, manifest.entry);
    const handlerModule = await import(entryPath);
    if (!handlerModule.runExampleApp && !handlerModule.run) {
        throw new Error(`App '${appId}' entry '${manifest.entry}' does not export run() or runExampleApp()`);
    }
    // Sovellus voi tarjota joko:
    //   - run()
    //   - runExampleApp()
    const fn = handlerModule.run ??
        handlerModule.runExampleApp ??
        (() => {
            throw new Error("App entry missing run() function");
        });
    return await fn(userInput);
}
// ------------------------------------------------------------
// PIPELINE-POHJAINEN APP RUNNER (valinnainen)
// ------------------------------------------------------------
export async function runAppPipeline(appId, steps, userInput) {
    const pipeline = createPipeline(appId, steps, `Pipeline for ${appId}`);
    return await runPipeline(pipeline, userInput);
}

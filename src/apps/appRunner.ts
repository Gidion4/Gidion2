// ------------------------------------------------------------
// GIDION ARC CORE â€” APP RUNNER v1
// ------------------------------------------------------------
// TÃ¤mÃ¤ kerros mahdollistaa:
//   - sovellusten rekisterÃ¶innin
//   - dynaamisen latauksen
//   - pipeline-ajon
//   - yhtenÃ¤isen rajapinnan UI:lle
//
// v2: hot-reload, app sandboxing
// v3: app permissions, multi-agent orchestration
// ------------------------------------------------------------

import { createPipeline, runPipeline } from "../brain/pipelineEngine.js";
import * as fs from "fs";
import * as path from "path";

// ------------------------------------------------------------
// APP MANIFEST
// ------------------------------------------------------------

export interface AppManifest {
  id: string;
  name: string;
  description?: string;
  version: string;
  agents: string[];
  entry: string; // esim. "./handler"
}

// ------------------------------------------------------------
// APP REGISTRY
// ------------------------------------------------------------

const APPS_DIR = path.join(__dirname);

export function listApps(): AppManifest[] {
  const dirs = fs.readdirSync(APPS_DIR, { withFileTypes: true });

  const apps: AppManifest[] = [];

  for (const d of dirs) {
    if (!d.isDirectory()) continue;

    const manifestPath = path.join(APPS_DIR, d.name, "manifest.json");
    if (!fs.existsSync(manifestPath)) continue;

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    apps.push(manifest);
  }

  return apps;
}

export function loadApp(appId: string): AppManifest {
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

export async function runApp(appId: string, userInput: unknown) {
  const manifest = loadApp(appId);

  const entryPath = path.join(APPS_DIR, manifest.id, manifest.entry);
  const handlerModule = await import(entryPath);

  if (!handlerModule.runExampleApp && !handlerModule.run) {
    throw new Error(
      `App '${appId}' entry '${manifest.entry}' does not export run() or runExampleApp()`
    );
  }

  // Sovellus voi tarjota joko:
  //   - run()
  //   - runExampleApp()
  const fn =
    handlerModule.run ??
    handlerModule.runExampleApp ??
    (() => {
      throw new Error("App entry missing run() function");
    });

  return await fn(userInput);
}

// ------------------------------------------------------------
// PIPELINE-POHJAINEN APP RUNNER (valinnainen)
// ------------------------------------------------------------

export async function runAppPipeline(
  appId: string,
  steps: any[],
  userInput: unknown
) {
  const pipeline = createPipeline(appId, steps, `Pipeline for ${appId}`);
  return await runPipeline(pipeline, userInput);
}


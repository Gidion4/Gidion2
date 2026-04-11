import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadModules(modulesDir, ctx) {
  const dir = path.resolve(__dirname, '..', modulesDir);
  const loaded = new Map();

  if (!fs.existsSync(dir)) return loaded;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_'));

  for (const file of files) {
    try {
      const mod = await import(path.join(dir, file));
      if (mod.name && mod.tools && mod.init) {
        await mod.init(ctx);
        loaded.set(mod.name, {
          name: mod.name,
          description: mod.description || '',
          version: mod.version || '0.0.0',
          tools: mod.tools
        });
      }
    } catch (err) {
      ctx.log(`failed to load module ${file}: ${err.message}`);
    }
  }

  return loaded;
}

export function getToolRegistry(modules) {
  const registry = new Map();
  for (const [modName, mod] of modules) {
    for (const tool of mod.tools) {
      registry.set(tool.name, { ...tool, module: modName });
    }
  }
  return registry;
}

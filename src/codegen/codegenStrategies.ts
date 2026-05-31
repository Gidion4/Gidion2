// ------------------------------------------------------------
// CODEGEN STRATEGIES PRO
// ------------------------------------------------------------
// Soveltaa strategioita:
//   - new-module
//   - refactor
//   - fix
// ------------------------------------------------------------

export function applyStrategy(req: any, template: string): string {
  if (req.type === "new-module") {
    return template;
  }

  if (req.type === "refactor") {
    let code = template;

    // Poista duplikaatit
    const lines = code.split("\n");
    const seen = new Set<string>();
    const filtered = lines.filter((l) => {
      const t = l.trim();
      if (seen.has(t)) return false;
      seen.add(t);
      return true;
    });

    return filtered.join("\n");
  }

  if (req.type === "fix") {
    let code = template;

    // Korvaa require() → import
    code = code.replace(/require\((.*?)\)/g, "import $1");

    return code;
  }

  return template;
}

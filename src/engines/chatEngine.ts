import { GidionEngine, GidionContext, GidionMode } from "../core/gidionCore.js";

export class ChatEngine implements GidionEngine {
  name = "ChatEngine";

  supports(mode: GidionMode): boolean {
    return mode === "chat";
  }

  async run(ctx: GidionContext): Promise<string> {
    const input = ctx.input.trim().toLowerCase();

    // Peruskomentojen tulkinta
    if (input === "help") {
      return [
        "GIDION HELP",
        "- chat: keskustelu ja ohjeet",
        "- income_lab: tulovirtaideat ja suunnitelmat",
        "- product: tuoteideat ja tuotegenerointi",
        "- marketing: markkinointimateriaalit",
        "- sales: myyntirakenteet",
        "- scaling: skaalausstrategiat"
      ].join("\n");
    }

    // Fallback: toistaiseksi vain echo
    return `ChatEngine received: ${ctx.input}`;
  }
}


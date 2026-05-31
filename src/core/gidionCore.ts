export type GidionMode = "chat" | "income_lab" | "product" | "marketing" | "sales" | "scaling";

export interface GidionContext {
  mode: GidionMode;
  input: string;
}

export interface GidionEngine {
  name: string;
  supports(mode: GidionMode): boolean;
  run(ctx: GidionContext): Promise<string>;
}

export class GidionCore {
  private engines: GidionEngine[] = [];

  registerEngine(engine: GidionEngine) {
    this.engines.push(engine);
  }

  async handle(ctx: GidionContext): Promise<string> {
    const engine = this.engines.find(e => e.supports(ctx.mode));
    if (!engine) {
      return `No engine for mode: ${ctx.mode}`;
    }
    return engine.run(ctx);
  }
}


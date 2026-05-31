export class GidionCore {
    engines = [];
    registerEngine(engine) {
        this.engines.push(engine);
    }
    async handle(ctx) {
        const engine = this.engines.find(e => e.supports(ctx.mode));
        if (!engine) {
            return `No engine for mode: ${ctx.mode}`;
        }
        return engine.run(ctx);
    }
}

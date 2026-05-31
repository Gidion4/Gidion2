export class ChatEngine {
    name = "ChatEngine";
    supports(mode) {
        return mode === "chat";
    }
    async run(ctx) {
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

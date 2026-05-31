export async function handleUICommand(cmd) {
    return { id: 'cmd-' + Math.random().toString(36).slice(2), result: cmd };
}
export async function handleConsoleInput(text) {
    return { id: 'input-' + Math.random().toString(36).slice(2), result: { text } };
}

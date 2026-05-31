export async function handleOrgCommand(cmd) {
    return { id: 'org-' + Math.random().toString(36).slice(2), result: cmd };
}

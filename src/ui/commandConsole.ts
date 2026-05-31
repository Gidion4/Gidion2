export type UICommand = {
  type: string;
  text: string;
};

export async function handleUICommand(cmd: UICommand): Promise<any> {
  return { id: 'cmd-' + Math.random().toString(36).slice(2), result: cmd };
}

export async function handleConsoleInput(text: string): Promise<any> {
  return { id: 'input-' + Math.random().toString(36).slice(2), result: { text } };
}

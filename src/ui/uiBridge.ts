export type OrgCommand = {
  type: string;
  title?: string;
  goalId?: string;
};

export async function handleOrgCommand(cmd: OrgCommand): Promise<any> {
  return { id: 'org-' + Math.random().toString(36).slice(2), result: cmd };
}

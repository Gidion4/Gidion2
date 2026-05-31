export async function runBrainTask(task: any) {
  return {
    status: "ok",
    received: task,
    message: `Brain router processed task: ${JSON.stringify(task)}`
  };
}





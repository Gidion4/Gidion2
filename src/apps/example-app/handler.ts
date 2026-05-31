export async function runExampleApp(userText: string) {
  return {
    status: "ok",
    echo: userText,
    message: `Example app received: ${userText}`
  };
}



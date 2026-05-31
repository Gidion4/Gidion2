export async function runExampleApp(userText) {
    return {
        status: "ok",
        echo: userText,
        message: `Example app received: ${userText}`
    };
}

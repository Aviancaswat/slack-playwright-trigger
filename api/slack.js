// /api/slack.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { text } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;

    try {

        const response = await fetch(
            "https://api.github.com/repos/Aviancaswat/avianca-test-core-nuxqa6/actions/workflows/slack-trigger.yml/dispatches",
            {
                method: "POST",
                headers: {
                    "Accept": "application/vnd.github+json",
                    "Authorization": `token ${githubToken}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                body: JSON.stringify({
                    ref: "feat/ImplementacionSlack",
                    inputs: `mensaje: ${text || "Sin mensaje"} `,
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json(error);
        }

        res.status(200).json({ message: `Workflow triggered con mensaje: ${text}`});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
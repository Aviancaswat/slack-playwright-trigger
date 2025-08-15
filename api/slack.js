export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mensaje } = req.body;

  try {
    const response = await fetch(
      "https://api.github.com/repos/Aviancaswat/avianca-test-core-nuxqa6/actions/workflows/slack-trigger.yml/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          ref: "feat/ImplementacionSlack",
          inputs: { mensaje },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      message: "Workflow triggered successfully",
      githubResponse: data,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

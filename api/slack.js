export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const slackToken = process.env.SLACK_BOT_TOKEN;
    const githubToken = process.env.GITHUB_TOKEN;

    try {
        if (req.body.payload) {
            const payload = JSON.parse(req.body.payload);

            if (payload.type === "view_submission" && payload.view.callback_id === "flight_form") {
                const values = payload.view.state.values;

                const origen = values.origen.value.value;
                const destino = values.destino.value.value;
                const adultos = values.adultos.value.value;
                const bebes = values.bebes.value.value;

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
                            inputs: {
                                origen,
                                destino,
                                adultos,
                                bebes
                            },
                        }),
                    }
                );

                if (!response.ok) {
                    const error = await response.json();
                    return res.status(response.status).json(error);
                }

                return res.status(200).json({ response_action: "clear" });
            }
        } else {
            const { trigger_id } = req.body;

            await fetch("https://slack.com/api/views.open", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${slackToken}`,
                },
                body: JSON.stringify({
                    trigger_id,
                    view: {
                        type: "modal",
                        callback_id: "flight_form",
                        title: { type: "plain_text", text: "Nueva prueba" },
                        submit: { type: "plain_text", text: "Enviar" },
                        close: { type: "plain_text", text: "Cancelar" },
                        blocks: [
                            {
                                type: "input",
                                block_id: "origen",
                                element: {
                                    type: "plain_text_input",
                                    action_id: "value",
                                    placeholder: { type: "plain_text", text: "Ej: BOG" }
                                },
                                label: { type: "plain_text", text: "Ciudad Origen" }
                            },
                            {
                                type: "input",
                                block_id: "destino",
                                element: {
                                    type: "plain_text_input",
                                    action_id: "value",
                                    placeholder: { type: "plain_text", text: "Ej: MAD" }
                                },
                                label: { type: "plain_text", text: "Ciudad Destino" }
                            },
                            {
                                type: "input",
                                block_id: "adultos",
                                element: {
                                    type: "plain_text_input",
                                    action_id: "value",
                                    placeholder: { type: "plain_text", text: "Ej: 2" }
                                },
                                label: { type: "plain_text", text: "Adultos" }
                            },
                            {
                                type: "input",
                                block_id: "bebes",
                                element: {
                                    type: "plain_text_input",
                                    action_id: "value",
                                    placeholder: { type: "plain_text", text: "Ej: 1" }
                                },
                                label: { type: "plain_text", text: "Bebés" }
                            }
                        ]
                    }
                }),
            });

            return res.status(200).json({ ok: true });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

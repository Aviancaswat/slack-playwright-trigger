export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido');
  }

  const { text, user_name } = req.body;
  
  console.log(`Comando recibido de ${user_name}: ${text}`);

  await fetch(`https://api.github.com/repos/USUARIO/REPO/actions/workflows/playwright.yml/dispatches`, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: 'develop',
      inputs: { parametro: text }
    })
  });

  return res.status(200).send(`✅ Prueba iniciada con parámetro: ${text}`);
}

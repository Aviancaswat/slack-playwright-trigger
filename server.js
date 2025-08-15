import express from "express";

const app = express();
app.use(express.json());

// Definimos la ruta aquí mismo para probar
app.post("/api/slack", (req, res) => {
  console.log("Body recibido:", req.body);
  res.json({ ok: true, recibido: req.body });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

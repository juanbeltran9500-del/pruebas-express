const express = require("express")
const app = express()
require("dotenv/config")
const puerto = process.env.PUERTO || 3000

app.get("/", (_, res) => {
  res.send(`API Rest`, );
});

app.listen(3000, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:${puerto}`);
});
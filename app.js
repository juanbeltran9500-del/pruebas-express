const express = require("express")
const app = express()

app.get("/", (_, res) => {
  res.send(`API Rest`, );
});

app.listen(3000, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:3000`);
});
require("dotenv").config
const miApp = require("../../app")
const PUERTO = process.env.PUERTO || 3030

miApp.listen(PUERTO, ()=>{
    console.log(`Servidor Corriendo: http://localhost:${PUERTO}`)
} )
import express from 'express'; // Método ES Modules
//leer el archivo .envi
import {configDotenv} from "dotenv"
configDotenv()
const app = express();
const port =process.env.PUERTO|| 5050;
app.get('/', (req, res) => {
res.send('Aprendiendo express, ya me quiero ir a la houseee,ADSO EN EL SENA 31 de julio');
});      
//otro endpoint
app.get("/otra ruta", (req,res)=>{
    //uswando template string
    res.send(`<h1>otra ejemplo de ruta</h1>h2>End point con res.send</h2>`)
})

app.get("ruta2",(req,res)=>{
    res.json({"nombre": "juan", "apellido": "beltran","cargo":
        "aprendiz"})

    })
    
    
app.listen(port,function(){
    console.log(`Servidor: http://localhost:${port}`)
})



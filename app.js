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

    app.get("/ruta2/:aprendiz", (req, res) =>{
    const dato_aprendiz = req.params.aprendiz
    const otro_dato = req.params.otro_dato
    res.json ({"nombre": dato_aprendiz, "otro": otro_dato})
})
    
app.get("/ruta4", (req,res)=>{
    const orden =req.query.orden || "sin ordenar"
    res.send(`<h1>Listado Aprendices</h1>
        <p>El listado esta en orden ${orden}</p>
        <p>pagina:${pagina}>/p>
        `)
        })
    
app.listen(port,function(){
    console.log(`Servidor: http://localhost:${port}`)
})



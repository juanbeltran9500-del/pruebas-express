import  express  from "express";

//leer el archivo .env
import {configDotenv} from "dotenv"
configDotenv()

const app = express();
const port = process.env.PUERTO || 5050;

app.use(express.json())

app.get("/", (_, res) => {
    res.send('Aprendiendo Express,ficha 3407181, ADSO EN EL SENA 31 de julio');
});

app.get("/ruta2", (req, res)=>{
    //usando template string
    res.json({"nombre":"Santiago", "apellido":"Martinez", "ficha":"3407181", "cargo":"aprendiz"})
})

app.get("/ruta3/:aprendiz/:otro_dato", (req, res) =>{
    const dato_aprendiz = req.params.aprendiz
    const otro_dato = req.params.aprendiz
    res.json ({"nombre": dato_aprendiz, "otro": otro_dato})
})

app.get("/ruta4", (req, res) =>{
    const orden = req.query.orden || "sin ordenar"
    const pagina = req.query.pagina
    res.send(`<h1>Listado de aprendices</h1>
        <p>el listado en orden ${orden}</p>
        <p>pagina: ${pagina}</p>
        `)
})

app.post("/ruta2", (req, res) =>{
    const todosDatos = req.body
    const name = req.body.nombre
    const lastname = req.body.cargo
    res.status(201).json({Datos: todosDatos,nombre:name,
        cargo: lastname})
    })

    app.post("/login", (req, res) => {

    const usuario = req.body.usuario;
    const contraseña = req.body.contraseña;

    if (!usuario || !contraseña) {
        return res.status(400).json({
            mensaje: "Faltan datos"
        });
    }

    if (usuario === "admin") {
        return res.status(200).json({
            mensaje: "Bienvenido administrador"
        });
    }

    if (usuario === "user") {
        return res.status(200).json({
            mensaje: "Bienvenido usuario"
        });
    }

    return res.status(403).json({
        mensaje: "Usuario no autorizado"
    });

});

app.listen(port, function(){
console.log( `SERVIDOR: http://localhost:${port}`);
});
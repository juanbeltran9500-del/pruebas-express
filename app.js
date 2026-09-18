juan beltran <sm.marinez.ms18@gmail.com>
8:09 a.m. (hace 0 minutos)
para Edwar, mí

const express = require("express");
const app = express();
require("dotenv").config();
const puerto = process.env.PORT || 3000;

const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaArchivoJson = ruta.join(__dirname, "datos.json");
//importacion de libreria
const multer = require("multer");
//importacion de middlewarepersonales
const registroMiddleware = require("./middleware/registroMiddleware")
const manejadorErrores = require("./middleware/manejadorErrores")
const autenticarMiddleware = require("./middleware/autenticarMiddleware")


// Importar las funciones de validación
const {
  validarNombre,
  validarCorreo,
  generarId
} = require("./utilidades/validaciones");
const { userInfo } = require("os")

// Middlewares globales (van antes de las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tu middleware de log/tiempo
app.use((req, res, next) => {
  console.log(`tiempo milisegundos: ${Date.now()}`);
  console.log(`fecha: ${new Date().toLocaleString()}`);
  next();
});
app.use(registroMiddleware);

// Configurar el almacenamiento de imágenes
const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "misImagenes/");
  },
  filename: (req, file, cb) => {
    const extensionArchivo = ruta.extname(file.originalname);
    cb(null, `${Date.now()}${extensionArchivo}`);
  }
});

const subirArchivo = multer({ storage: almacenamiento });

// Endpoint raíz
app.get("/", function (req, res) {
  res.send(`API Rest - Aprendices`);
});

// Endpoint para ver todos los aprendices
app.get("/api/aprendices", (req, res) => {
  sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "No se pueden leer los datos" });
    }
    const ListaAprendices = JSON.parse(datos);
    res.json(ListaAprendices);
  });
});

// Endpoint para crear un aprendiz
app.post("/api/aprendices", subirArchivo.single("imagen"), (req, res) => {
  const { nombre, correo } = req.body;

  // 1. Validar Nombre
  if (!validarNombre(nombre)) {
    return res.status(400).json({ Error: "El nombre debe tener mínimo 3 letras" });
  }

  // 2. Validar Correo
  if (!validarCorreo(correo)) {
    return res.status(400).json({ Error: "El correo electrónico no es válido" });
  }

  // 3. Crear el nuevo objeto con ID automático
  const nuevoAprendiz = {
    id: generarId(),
    nombre: nombre,
    correo: correo,
    imagen: req.file ? `/misImagenes/${req.file.filename}` : "sin imagen"
  };

  // 4. Leer el archivo JSON actual y guardar
  sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos) => {
    if (error) {
      return res.status(500).json({ Error: "No se pueden leer los datos" });
    }

    const ListaAprendices = JSON.parse(datos);
    ListaAprendices.push(nuevoAprendiz);

    sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(ListaAprendices, null, 2), (error) => {
      if (error) {
        return res.status(500).json({ Error: "No se puede registrar el nuevo aprendiz" });
      }
      res.status(201).json({ 
        mensaje: "Aprendiz Creado con éxito", 
        datos: nuevoAprendiz 
      });
    });
  });
});

// Endpoint para modificar
app.put("/api/aprendices/:id", (req, res) => {
  res.status(200).json({ mensaje: "endpoint en proceso de construcción de modificar" });
});

// Endpoint para eliminar
app.delete("/api/aprendices/:id", (req, res) => {
  res.status(200).json({ mensaje: "endpoint en proceso de construcción de eliminar" });
});

//provocar error
app.get("/error", (req, res, next) =>{
  next(new Error("Error intencional para probar."))
})

//ruta protegida
app.get("/rutaprotegida", autenticarMiddleware,(req, res) =>{
  res.json({mensaje: "Acceso concedido a la ruta protegida", usuario: req.usuario});
});

//uso del middleware de errores
app.use(manejadorErrores);

app.post("/api/login", (req, res) =>{
  const { usuario, clave} = req.body
  const usuariodb ={"user": "juan", clave: "1234"}

  if(usuario === usuariodb.user && clave === usuariodb.clave){
   res.json({mensaje:"credenciales incorrectas"})
  }


const token = JsonWebToken.sign({usuario}, process.env.JWT_SECRETO, {expiresIn: "2h"})
)
res.json({mensaje: "Login exitoso", token})
}) 
app.listen(puerto, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:${puerto}`);
});
const express = require("express");
const app = express();
require("dotenv").config();
const puerto = process.env.PORT || 3030;

const sistemaArchivo = require("fs");
const ruta = require("path");
const rutaArchivoJson = ruta.join(__dirname, "datos.json");
//IMPORTACION LIBRERIA PARA SUBIR ARCHIVOS 
const multer = require("multer");
const jwt = require("jsonwebtoken");  
//Importar middleware personalizado
const registroMiddleware = require("./middleware/registroMiddleware");

const manejadorErrores = require("./middleware/ManejadorErrores");
const autenticarMiddleware = require("./middleware/autenticarMiddleware");

// Importar las funciones de validación
const {
  validarNombre,
  validarCorreo,
  generarId
} = require("./utilidades/validaciones");

// Middlewares globales (van antes de las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tu middleware de log/tiempo
app.use((req, res, next) => {
  console.log(`tiempo milisegundos: ${Date.now()}`);
  console.log(`fecha: ${new Date().toISOString()}`);
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

//provoca error urilizo next
app.get("/error", (req, res,next) => {
  next(new Error("Error intecional para probar."))
})

//ruta protegida
app.post("/rutaprotegida", autenticarMiddleware, (req, res) => {
  res.json({ mensaje: "Esta ruta  ruta protegida"})
})

//endpoint iniciar sesion generar token
app.post("/iniciar-sesion", (req, res) => {
  //capturar usuario y clave
  const { usuario, clave } = req.body;
  //simular usuario base de datos 
  const usuarioBD = {"user": "angela","clave": "2222"}
    //verificar credenciales
    if(usuario !== usuarioBD.usuario || clave !== usuarioBD.clave){
      res.json({mensaje: "Credenciales incorrectas"})
    }
  
  //generar token 
  const token = jwt.sign(
    {usuario: usuario},
    process.env.JWT_SECRETO, 
    {expiresIn: "2h"}
  )
  res.json({token: token})
})
  //uso del middleware de manejo de errores
app.use(manejadorErrores);
//el servidor en funcionamiento , la variable de entorno .env
app.listen(puerto, () => {
  console.log(`Servidor en funcionamiento en el puerto: http://localhost:${puerto}`);
});


const express = require("express");
const pool = require("./database/db"); // Importa la conexión que creamos

const miApp = express();

miApp.use(express.json());
miApp.use(express.urlencoded({ extended: true }));

// Ruta de prueba para verificar la base de datos
miApp.get("/test-db", async (req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json({
      mensaje: "Conexión a PostgreSQL exitosa",
      fecha_servidor: resultado.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en la base de datos" });
  }
});

miApp.get("/", (req, res) => {
  res.send("MI API rest ficha 3407181.");
});

module.exports = miApp;
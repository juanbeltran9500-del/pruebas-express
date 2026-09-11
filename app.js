const express = require("express")
const app = express()

require("dotenv/config")

const port = process.env.puerto
const PUERTO = port || 3030

const sistemaArchivo = require("fs")
const ruta = require("path")

const rutaArchivoJson = ruta.join(__dirname, "datos.json")

// Importar las validaciones
const {
    validarNombre,
    validarCorreo,
    generarId
} = require("./utilidades/validaciones")

// Importar librería para subir archivos
const multer = require("multer")

// Configurar almacenamiento de archivos
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "misimagenes/")
    },

    filename: (req, file, cb) => {
        const extensionArchivo = ruta.extname(file.originalname)

        cb(null, `${Date.now()}${extensionArchivo}`)
    }
})

const subirArchivo = multer({
    storage: almacenamiento
})

// Middleware para recibir JSON
app.use(express.json())

// Endpoint raíz
app.get("/", function (req, res) {
    res.send("API - Rest Aprendices")
})

// Endpoint para listar aprendices
app.get("/api/aprendices", function (req, res) {

    sistemaArchivo.readFile(
        rutaArchivoJson,
        "utf8",
        function (error, datos) {

            if (error) {
                return res.json({
                    Error: "No se pudo leer los datos"
                })
            }

            const listaAprendices = JSON.parse(datos)

            res.json(listaAprendices)
        }
    )
})

// Endpoint para crear un aprendiz
app.post("/api/aprendices", (req, res) => {

    const { nombre, correo } = req.body

    // Validar nombre
    if (!validarNombre(nombre)) {
        return res.status(400).json({
            mensaje: "El nombre debe tener mínimo 3 letras"
        })
    }

    // Validar correo
    if (!validarCorreo(correo)) {
        return res.status(400).json({
            mensaje: "El correo electrónico no es válido"
        })
    }

    // Generar ID automático
    const id = generarId()

    console.log("ID generado:", id)
    console.log("Nombre:", nombre)
    console.log("Correo:", correo)

    res.status(201).json({
        mensaje: "Aprendiz creado con éxito",

        usuario: {
            id: id,
            nombre: nombre,
            correo: correo
        }
    })
})

// Iniciar servidor
app.listen(PUERTO, function () {
    console.log(`Servidor http://localhost:${PUERTO}`)
})
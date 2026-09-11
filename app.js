const express = require("express")
const app = express() 
require("dotenv").config()
const port = process.env.puerto
const PUERTO = port || 3030
//configurar para la lectura y escritura de archivos
const sistemaArchivo = require("fs")
const ruta= require("path")
const rutaArchivoJson = ruta.join(__dirname, "datos.json")
//importarr libreria multer para subir archivos
const multer = require("multer")
//importacion de middleware personales
const registroMiddleware = require("./middleware/registroMiddleware")
//importar validaciones
const { validarNombre, validarCorreo, generarId } = require("./utilidades/validaciones")
//configurar almacenamiento de archivos
const almacenamiento = multer.diskStorage({
   destination:(req, file, cb) => {
      cb(null, "misImagenes/")
   },
   filename:(req, file, cb) => {
      const extensionArchivo = ruta.extname(file.originalname)
      cb(null,`${Date.now()}${extensionArchivo}`)
   }
})

const subirArchivo = multer({storage: almacenamiento})
//middleware body-parsem, formatea los datos enviados
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//middleware creados, se ejecutan antes cada vez que hago una peticion (GET, POST, PUT, DELETE)
app.use((req, res, next) =>{
   console.log(`tiempo milisegundos: ${Date.now()}`)
   console.log(`fecha: ${new Date().toISOString()}`)
   next()
})

app.use(registroMiddleware)
//endpoint raiz
app.get("/", function (req, res) {
   res.send("API - Rest Aprendices");
})
app.get("/api/aprendices", function (req, res) {
   //los datos se pueden traer de una base de datos, de un archivo, etc
   sistemaArchivo.readFile(rutaArchivoJson, "utf8", function(error, datos) {
      if (error) {
         return res.json({Error: "No se pudo leer los datos"})
      }
      const listaAprendices = JSON.parse(datos);
      res.json(listaAprendices);
   })
})
//endpoint para crear un aprendiz
app.post("/api/aprendices",subirArchivo.single("imagen"), (req, res) =>{
   //validar que se envien los datos
   const nuevoAprendiz = req.body
   //validaciones
   if (!validarNombre(nuevoAprendiz.nombre)) {
      return res.status(400).json({Error: "El nombre debe tener mínimo 3 letras"})
   }
   if (!validarCorreo(nuevoAprendiz.correo)) {
      return res.status(400).json({Error: "El correo electrónico no es válido"})
   }
   //ID automático
   nuevoAprendiz.id = generarId()
   nuevoAprendiz.imagen = req.file?`/misImagenes/${req.file.filename}`: "sin imagen"
   //utilizamos la lectura del archivo para traer los datos y luego agregar el nuevo aprendiz
   sistemaArchivo.readFile(rutaArchivoJson, "utf8", function(error, datos) {
      if (error) {
         return res.json({Error: "No se pudo leer los datos"})
      }
      const listaAprendices = JSON.parse(datos);
      //agregar el nuevo aprendiz a la lista
      listaAprendices.push(nuevoAprendiz)
      //escribir el archivo con la nueva lista
      sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices, null, 
      2), (error) =>{
         if (error) {
            res.status(500).json({Error: "No se pudo escribir los datos"})
         }
         res.status(201).json({Mensaje: "Aprendiz creado con exito"})
      })
   })
})

app.put("/api/aprendices/:id", (req, res) =>{
   res.status(200).json({Mensaje: "Aprendiz actualizado con exito"})
})

app.delete("/api/aprendices/:id", (req, res) =>{
   res.status(200).json({Mensaje: "Aprendiz eliminado con exito"})
})


app.listen(PUERTO, function () {
   console.log(`Servidor http://localhost:${PUERTO}`)
})
const express = require("express")
const app = express() 
require("dotenv/config")
const port = process.env.puerto
const PUERTO = port || 3030
const sistemaArchivo = require("fs")
const ruta= require("path")
const rutaArchivoJson = ruta.join(__dirname, "datos.json")
//importar libreria para subir archivos 
const multer = require("multer")

//middleware body-parsem, formatea los datos enviados
app.use(express.json())
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
app.post("/api/aprendices", function (req, res) {
   //validar que se envien los datos
   const nuevoAprendiz = req.body
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

app.listen(PUERTO, function () {
   console.log(`Servidor http://localhost:${PUERTO}`)
})
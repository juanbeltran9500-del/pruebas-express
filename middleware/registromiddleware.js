//crear una funcion de flecha con el mismo nombre del archivo, para que se ejecute cada vez que se haga una peticion (GET, POST, PUT, DELETE)
const registroMiddleware = (req, res, next) =>{
    const fecha = new Date().toISOString()
    console.log(`[Historial de peticiones] ${fecha}, ${req.method}, ${req.url}, ${req.ip}`)
    next()
} 

module.exports = registroMiddleware
import express from 'express'; // Método ES Modules
//leer el archivo .envi
import {configDotenv} from "dotenv"
configDotenv()
const app = express();
const port =process.env.PUERTO|| 3000
app.get('/', (req, res) => {
res.send('Aprendiendo express, ya me quiero ir a la houseee,ADSO EN EL SENA 31 de julio');
});      
//ot       
app.listen(port, () => {
console.log('Servidor en funcionamiento en el puerto: ' + port);
});



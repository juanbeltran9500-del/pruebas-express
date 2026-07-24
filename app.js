import express from 'express'; // Método ES Modules

const app = express();
const port =process.env.PUERTO|| 3000

app.get('/', (req, res) => {
res.send('Aprendiendo express, ya me quiero ir a la houseee');
});             

app.listen(port, () => {
console.log('Servidor en funcionamiento en el puerto: ' + port);
});
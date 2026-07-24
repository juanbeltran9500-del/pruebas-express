import express from 'express'; // Método ES Modules

const app = express();
const port = 3000;

app.get('/', (req, res) => {
res.send('Aprendiendo express, kkakakkakakakakkaka');
});             

app.listen(port, () => {
console.log('Servidor en funcionamiento en el puerto: ' + port);
});
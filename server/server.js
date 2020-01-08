require('./config/config')


const express = require('express');
const mongoose = require('mongoose')


const app = express();

const bodyParser = require('body-parser')

//parse applcication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    //parse applicaction/json
app.use(bodyParser.json())

// Configuracion global de rutas
app.use(require('./routes/index'))


mongoose.connect(process.env.NODE_ENV, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online');
})


app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", 3000);
})
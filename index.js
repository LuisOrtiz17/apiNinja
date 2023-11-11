const express = require('express');

const { dbConnection } = require('./db/config');

require('dotenv').config();

const app = express();

//Lamar BD
dbConnection();

//Lectura y parseo del body
app.use( express.json());

/*
app.get('/api', (req, res) => {

    res.json({
        ok: true,
        msg: 'Mi segunda API NodeJS'
    })
});
*/

app.use('/auth', require('./routes/auth.router'));
app.use('/usuario', require('./routes/usuario.router'));
app.use('/tarea', require('./routes/tarea.route'));

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
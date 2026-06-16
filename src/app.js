const express = require('express');
const cors = require('cors');
const resultados = require('./routes/resultados');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/resultados', resultados);

module.exports = app;

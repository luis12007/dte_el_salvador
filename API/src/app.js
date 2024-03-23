const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const plantillasRoutes = require('./routes/plantillaRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const facturaxitems = require('./routes/facturaxitemsRoutes');
const firmarRoutes = require('./routes/firmarRoutes');
const sellarRoutes = require('./routes/sellarRoutes');
const app = express();
const port = 3000;


// Middleware
const corsOptions = {
    origin: ['http://localhost:3001', 'https://adgard.net/code?id=bjyERE3DxNAm&type=1'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/cliente', clienteRoutes);
app.use('/plantillas', plantillasRoutes);
app.use('/firmar', firmarRoutes);
app.use('/sellar', sellarRoutes);
app.use('/facturaxitems', facturaxitems);
app.use('/items', itemsRoutes);
app.use('/emisor', usuarioRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
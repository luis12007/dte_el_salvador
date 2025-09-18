const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const plantillasRoutes = require('./routes/plantillaRoutes');
const plantillasDeleted = require('./routes/plantillaRoutesdeleted');
const plantillasInvalidated = require('./routes/plantillaRoutesinvalidated');
const itemsRoutes = require('./routes/itemsRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const facturaxitems = require('./routes/facturaxitemsRoutes');
const firmarRoutes = require('./routes/firmarRoutes');
const sellarRoutes = require('./routes/sellarRoutes');
const mailRoutes = require('./routes/mailRoutes');
const comprasRoutes = require('./routes/comprasRoutes');
const app = express();
const port = 3000;


// Middleware
const corsOptions = {
    origin: '*', // Permite cualquier origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    credentials: false, // Indica si se permiten credenciales
    optionsSuccessStatus: 204, // Estado para respuestas exitosas de opciones
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
app.use('/mail', mailRoutes);
app.use('/compras', comprasRoutes);
app.use('/deleted', plantillasDeleted);
app.use('/invalidated', plantillasInvalidated);


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
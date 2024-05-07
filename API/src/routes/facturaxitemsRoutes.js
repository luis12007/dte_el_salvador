const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    createitemxfactura,
    getitemxfactura,


} = require('../controllers/itemxfacturaController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, createitemxfactura);
router.get('/list/:idfactura', authenticateToken, getitemxfactura);

module.exports = router;
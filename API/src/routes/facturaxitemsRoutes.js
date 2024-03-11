const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    createitemxfactura,


} = require('../controllers/itemxfacturaController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, createitemxfactura);

module.exports = router;
const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    cratecompra,
    getcompras

} = require('../controllers/comprasController.js');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, cratecompra);
router.get('/getcompras/:id/:startdate/:enddata', authenticateToken, getcompras);

module.exports = router;
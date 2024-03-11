const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    firmar,
} = require('../controllers/firmaController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/firmar', authenticateToken, firmar);

module.exports = router;
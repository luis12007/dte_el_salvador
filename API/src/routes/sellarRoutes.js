const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    sellar,
} = require('../controllers/sellarController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/firmar', authenticateToken, sellar);

module.exports = router;
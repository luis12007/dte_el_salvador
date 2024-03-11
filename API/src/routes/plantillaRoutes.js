const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    plantillacreate,
    getPlantillasByUserId,

} = require('../controllers/plantillaController.js');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, plantillacreate);
router.get('/get', authenticateToken, getPlantillasByUserId);

module.exports = router;
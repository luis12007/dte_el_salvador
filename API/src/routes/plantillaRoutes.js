const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    plantillacreate,
    getPlantillasByUserId,
    updatePlantilla,
    countplantilla,
    updatePlantillasend,
    getplantilla,

} = require('../controllers/plantillaController.js');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, plantillacreate);
router.get('/get/:id', authenticateToken, getPlantillasByUserId);
router.put('/update/:codigo_de_generacion', authenticateToken, updatePlantilla);
router.get('/get/count/:id', authenticateToken, countplantilla);
router.put('/update/send/:codigo_de_generacion', authenticateToken, updatePlantillasend);
router.get('/getplantilla/:codigo_de_generacion', authenticateToken, getplantilla);

module.exports = router;
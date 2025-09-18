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
    DeletePlantillaById,
    updatePlantillaNoItems,
    getPlantillasByUserIdAndName,
    getPlantillasByUserIdAndDateRamge,
    getPlantillasByUserIdAndType,
    getbytypeandid

} = require('../controllers/plantillaControllerDeleted.js');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, plantillacreate);
router.get('/get/:id', authenticateToken, getPlantillasByUserId);
router.put('/update/:codigo_de_generacion', authenticateToken, updatePlantilla);
router.put('/updateNoItems/:codigo_de_generacion', authenticateToken, updatePlantillaNoItems);
router.get('/get/count/:id', authenticateToken, countplantilla);
router.put('/update/send/:codigo_de_generacion', authenticateToken, updatePlantillasend);
router.get('/getplantilla/:codigo_de_generacion', authenticateToken, getplantilla);
router.delete('/delete/:codigo_de_generacion', authenticateToken, DeletePlantillaById);
router.get('/get/name/:id/:name', authenticateToken, getPlantillasByUserIdAndName);
router.get('/get/range/:id/:start/:end', authenticateToken, getPlantillasByUserIdAndDateRamge);
router.get('/get/type/:id/:type', authenticateToken, getPlantillasByUserIdAndType);
router.get('/get/typeandid/:id/:startdate/:enddata', authenticateToken, getbytypeandid);

module.exports = router;
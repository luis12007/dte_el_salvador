// clientRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    createItems,
    putItems,
    deleteItems,
    getItemsByUserId,

} = require('../controllers/itemsController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, createItems);
//------------------------------------------------------------
router.get('/get/:id', authenticateToken, getItemsByUserId);
router.put('/put/:id', authenticateToken, putItems);
router.delete('/delete/:id', authenticateToken, deleteItems);


module.exports = router;
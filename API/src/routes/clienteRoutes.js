// clientRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const {
    createClient,
    putClients,
    deleteClients,
    getClientByUserId,

} = require('../controllers/clientController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta POST
router.post('/create', authenticateToken, createClient);
//------------------------------------------------------------
router.get('/get/:id', authenticateToken, getClientByUserId);
router.put('/put/:id', authenticateToken, putClients);
router.delete('/delete/:id', authenticateToken, deleteClients);


module.exports = router;
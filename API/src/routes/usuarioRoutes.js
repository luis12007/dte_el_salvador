// userRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const { getUserInfo, putUserInfo } = require('../controllers/usuarioController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta GET
router.get('/info/:id', authenticateToken, getUserInfo);
router.put('/update/:id', authenticateToken, putUserInfo);

module.exports = router;
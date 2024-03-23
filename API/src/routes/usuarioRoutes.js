// userRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const { getUserInfo, putUserInfo, createUser } = require('../controllers/usuarioController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta GET
router.get('/info/:id', authenticateToken, getUserInfo);
router.put('/update/:id', authenticateToken, putUserInfo);
router.post('/create', authenticateToken, createUser);

module.exports = router;
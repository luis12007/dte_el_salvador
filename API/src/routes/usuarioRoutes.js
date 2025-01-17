// userRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const { getUserInfo, putUserInfo, createUser, count_factura, count_fiscal, id_envioplus } = require('../controllers/usuarioController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta GET
router.get('/info/:id', authenticateToken, getUserInfo);
router.put('/update/:id', authenticateToken, putUserInfo);
router.post('/create', authenticateToken, createUser);
router.post('/update/count_factura/:id', authenticateToken, count_factura);
router.post('/update/count_fiscal/:id', authenticateToken, count_fiscal);
router.put('/update/enviopus1/:id', authenticateToken, id_envioplus);

module.exports = router;
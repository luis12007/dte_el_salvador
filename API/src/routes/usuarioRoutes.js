// userRoutes.js

const express = require('express');
const router = express.Router();

// Importa tu función de controlador
const { getUserInfo, putUserInfo, createUser, count_factura, count_fiscal, id_envioplus ,
decrease_factura,
    decrease_fiscal,
    count_cl,
    count_nc,
    count_nd,
    decrease_envioplus } = require('../controllers/usuarioController');
const authenticateToken = require('../middleware/verifyToken.js');


// Define la ruta GET
router.get('/info/:id', authenticateToken, getUserInfo);
router.put('/update/:id', authenticateToken, putUserInfo);
router.post('/create', authenticateToken, createUser);
router.post('/update/count_factura/:id', authenticateToken, count_factura);
router.post('/update/decrease_factura/:id', authenticateToken, decrease_factura);
router.post('/update/count_fiscal/:id', authenticateToken, count_fiscal);
router.post('/update/count_cl/:id', authenticateToken, count_cl);
router.post('/update/count_nd/:id', authenticateToken, count_nd);
router.post('/update/count_nc/:id', authenticateToken, count_nc);
router.post('/update/decrease_fiscal/:id', authenticateToken, decrease_fiscal);
router.put('/update/envioplus1/:id', authenticateToken, id_envioplus);
router.put('/update/decrease_envio/:id', authenticateToken, decrease_envioplus);

module.exports = router;
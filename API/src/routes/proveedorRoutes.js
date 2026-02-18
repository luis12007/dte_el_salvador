const express = require('express');
const router = express.Router();

const {
    createProveedor,
    getProveedorByUserId,
    putProveedor,
    deleteProveedor,
} = require('../controllers/proveedorController');
const authenticateToken = require('../middleware/verifyToken.js');

// Rutas de Proveedor
router.post('/create/:id', authenticateToken, createProveedor);
router.get('/get/:id', authenticateToken, getProveedorByUserId);
router.put('/put/:id', authenticateToken, putProveedor);
router.delete('/delete/:id', authenticateToken, deleteProveedor);

module.exports = router;

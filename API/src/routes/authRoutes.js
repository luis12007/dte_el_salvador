const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el inicio de sesión
router.post('/login', authController.login);

// Otras rutas de autenticación (recuperar contraseña, etc.)
// router.post('/recover-password', authController.recoverPassword);

module.exports = router;
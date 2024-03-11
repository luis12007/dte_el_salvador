// middleware/verifyToken.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Obtén el token del encabezado de autorización
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Divide el encabezado para obtener solo el token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no válido.' });
    }

    try {
        // Verifica el token y decodifica la información
        const decoded = jwt.verify(token, "Motroco120072ñs1wa");

        // Adjunta la información decodificada al objeto de solicitud para uso posterior
        req.user = decoded;

        // Continúa con la ejecución del siguiente middleware o ruta
        next();
    } catch (error) {
        // Maneja los errores de verificación del token
        res.status(401).json({ message: 'Token no válido.' });
    }
}

module.exports = verifyToken;
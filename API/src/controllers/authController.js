const db = require('../db/db');
const jwt = require('jsonwebtoken');


const login = async(req, res) => {
    const { usuario, contraseña } = req.body;
    console.log(usuario);
    console.log(contraseña);
    try {
        const user = await db('usuario')
            .where({ usuario, contraseña })
            .first();
        console.log(user);


        if (user) {
            // Generar un token JWT si las credenciales son válidas
            const token = jwt.sign(user, "Motroco120072ñs1wa", { expiresIn: '200h' });

            res.status(200).json({
                user_id: user.id,
                status: 'success',
                message: 'Inicio de sesión exitoso',
                token,
                username: user.usuario,
                ambiente: user.ambiente,
                payment: user.payment,

            });
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Credenciales incorrectas',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error en el servidor',
        });
    }
};


module.exports = {
    login,
};
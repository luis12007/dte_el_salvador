const knex = require('../db/db');

const getUserInfo = async(req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        const user = await knex('emisor').where('id', userId).first();

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Personaliza la respuesta según tu lógica y los campos disponibles en tu tabla de usuarios
        const userInfo = {
            id: user.id,
            name: user.name,
            id_rol: user.id_rol,
        };

        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error al obtener información del usuario', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const putUserInfo = async(req, res) => {
    const userId = req.params.id;
    const user = req.body;
    console.log(userId);
    try {
        const userExists = await knex('emisor').where('id', userId).first();

        if (!userExists) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await knex('emisor').where('id', userId).update(user);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {

    }
};



// delete all of user
module.exports = {
    getUserInfo,
    putUserInfo,
};
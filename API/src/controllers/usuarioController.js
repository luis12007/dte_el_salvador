const knex = require('../db/db');

const getUserInfo = async (req, res) => {
  const userId = req.params.id; // This is the `id` from the `usuarios` table
  try {
    const user = await knex('emisor')
      .join('usuario', 'emisor.id_usuario', '=', 'usuario.id') // Joining `emisor` with `usuarios`
      .where('usuario.id', userId) // Filtering by user ID
      .first(); // Get the first record

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' }); // User not found
    }

    res.status(200).json(user); // Send the response
  } catch (error) {
    console.error('Error al obtener información del usuario', error);
    res.status(500).json({ message: 'Error en el servidor' }); // Handle errors
  }
};

const putUserInfo = async(req, res) => {
    const userId = req.params.id;
    const user = req.body;
    console.log(userId);
    try {
        const userExists = await knex('emisor').where('id', userId).first();

        if (!userExists) {
            return res.status(404).json({status:404, message: 'Usuario no encontrado' });
        }

        await knex('emisor').where('id', userId).update(user);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {

    }
};

const createUser = async(req, res) => {
    const user = req.body;
    try {
        const userId = await knex('emisor').insert(user);

        res.status(201).json({ message: 'Usuario creado correctamente', userId });
    } catch (error) {
        console.error('Error al crear usuario', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


// delete all of user
module.exports = {
    getUserInfo,
    putUserInfo,
    createUser,
};
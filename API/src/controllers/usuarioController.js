const knex = require('../db/db');

const getUserInfo = async(req, res) => {
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
    const userId = req.params.id; // Assuming userId is passed in the route parameters

    const newUserDetails = {
        name: req.body.name,
        nit: req.body.nit,
        nrc: req.body.nrc,
        codactividad: req.body.codactividad,
        direccion: req.body.direccion,
        numero_de_telefono: req.body.numero_de_telefono,
        correo_electronico: req.body.correo_electronico,
        nombre_comercial: req.body.nombre_comercial,
        tipoestablecimiento: req.body.tipoestablecimiento
    };

    try {
        // Fetch existing user data
        const existingUser = await knex('emisor').where('id', userId).first();

        if (!existingUser) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        // Merge new data with existing data
        const updatedUser = {
            ...existingUser,
            ...newUserDetails
        };

        // Remove fields that should not be updated
        delete updatedUser.id; // Assuming 'id' should not be updated
        delete updatedUser.passwordpri; // Assuming 'passwordpri' should not be updated
        delete updatedUser.municipio; // Assuming 'municipio' should not be updated
        delete updatedUser.departamento; // Assuming 'departamento' should not be updated
        delete updatedUser.codactividad; // Assuming 'codactividad' should not be updated
        delete updatedUser.descactividad; // Assuming 'descactividad' should not be updated
        delete updatedUser.tipoestablecimiento; // Assuming 'tipoestablecimiento' should not be updated

        // Update the user in the database
        await knex('emisor').where('id', userId).update(updatedUser);

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el servidor' });
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

const count_factura = async(req, res) => {
    const userid = req.params.id;
    /* sum 1 to the actual count */
    try {
        const user = await knex('emisor')
            .where('id', userid)
            .increment('count_factura', 1);

        res.status(200).json({ message: 'Contador de facturas incrementado correctamente' });
    } catch (error) {
        console.error('Error al incrementar contador de facturas', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const count_fiscal = async(req, res) => {
    const userid = req.params.id;
    /* sum 1 to the actual count */
    try {
        const user = await knex('emisor')
            .where('id', userid)
            .increment('count_fiscal', 1);

        res.status(200).json({ message: 'Contador fiscal incrementado correctamente' });
    } catch (error) {
        console.error('Error al incrementar contador fiscal', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const id_envioplus = async(req, res) => {
    try {
        const userid = req.params.id;

        const response = await knex('emisor')
            .where('id', userid)
            .increment('id_envio', 1);

        res.status(200).json({ message: 'Id envioplus incrementado correctamente' });
    } catch (error) {
        console.error('Error al incrementar id envioplus', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}





// delete all of user
module.exports = {
    getUserInfo,
    putUserInfo,
    createUser,
    count_factura,
    count_fiscal,
    id_envioplus

};
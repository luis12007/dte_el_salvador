const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const createClient = async(req, res) => {
    const client = req.body;
    const clientData = {
        nit: client.nit,
        nrc: client.nrc,
        dui: client.dui,
        actividad_economica: client.actividad_economica,
        direccion: client.address,
        correo_electronico: client.email,
        nombre_comercial: client.nombreComercial,
        id_usuario: client.id_usuario,
        name: client.name,
        numero_telefono: client.phone,
        tipo_establecimiento: client.tipo_establecimiento,
        departament: client.departament,
        municipio: client.municipio
    };
    try {
        console.log(client)
        const newClient = await db('receptor').returning('id').insert(clientData).returning('*');

        res.status(200).json({ message: 'Creado' });
    } catch (error) {
        console.error('Error al crear cliente', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getClientByUserId = async(req, res) => {
    const usuarioid = req.params.id;

    try {
        const client = await db('receptor').where({ id_usuario: usuarioid });

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error('Error al obtener cliente por ID', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//------------------------------------------------------------
const putClients = async(req, res) => {
    const clientId = req.params.id;
    const client = req.body;
    try {
        const client = await db('receptor').where({ id: clientId }).first();

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await db('receptor').where({ id: clientId }).update(client);

        res.status(200).json({ message: 'Cliente actualizado' });
    } catch (error) {
        console.error('Error al actualizar cliente', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//------------------------------------------------------------

const deleteClients = async(req, res) => {
    const clientId = req.params.id;

    try {
        const client = await db('receptor').where({ id: clientId }).first();

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        await db('receptor').where({ id: clientId }).del();

        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error('Error al eliminar cliente', error);
        res.status(500).json({ message: 'Error en el servidor' });
    };
}

module.exports = {
    createClient,
    getClientByUserId,
    putClients,
    deleteClients,

};
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const createItems = async(req, res) => {
    const item = req.body;
    try {
        const newitem = await db('items').returning('id').insert(item).returning('*');

        res.status(201).json(newitem[0]);
    } catch (error) {
        console.error('Error al crear newitem', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};




const getItemsByUserId = async(req, res) => {
    const usuarioid = req.params.id;

    try {
        const item = await db('items').where({ id_usuario: usuarioid }).first();

        if (!item) {
            return res.status(404).json({ message: 'item no encontrado' });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error('Error al obtener item por ID', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//------------------------------------------------------------
const putItems = async(req, res) => {
    const userid = req.params.id;
    const itemupdate = req.body;
    try {
        const existclient = await db('items').where({ id: userid }).first();

        if (!existclient) {
            return res.status(404).json({ message: 'items no encontrado' });
        }

        await db('items').where({ id: userid }).update(itemupdate);

        res.status(200).json({ message: 'item actualizado' });
    } catch (error) {
        console.error('Error al actualizar item', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//------------------------------------------------------------

const deleteItems = async(req, res) => {
    const itemid = req.params.id;

    try {
        const client = await db('items').where({ id: itemid }).first();

        if (!client) {
            return res.status(404).json({ message: 'item no encontrado' });
        }

        await db('items').where({ id: itemid }).del();

        res.status(200).json({ message: 'item eliminado' });
    } catch (error) {
        console.error('Error al eliminar item', error);
        res.status(500).json({ message: 'Error en el servidor' });
    };
}

module.exports = {
    createItems,
    putItems,
    deleteItems,
    getItemsByUserId,
};
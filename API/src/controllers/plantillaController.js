const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const plantillacreate = async(req, res) => {
    const plantilla = req.body;
    try {
        const plantilla = await db('plantilla').returning('id').insert(plantilla).returning('*');

        res.status(201).json(plantilla[0]);
    } catch (error) {
        console.error('Error al crear newitem', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//get all plantillas where by user id
const getPlantillasByUserId = async(req, res) => {
    const usuarioid = req.params.id;
    try {
        //return all plantillas by user id
        const plantilla = await db('plantilla').where({ id_usuario: usuarioid }).first();
        if (!plantilla) {
            return res.status(404).json({ message: 'plantilla no encontrado' });
        }
        res.status(200).json(plantilla);
    } catch (error) {

    }
};

module.exports = {
    plantillacreate,
    getPlantillasByUserId,
};
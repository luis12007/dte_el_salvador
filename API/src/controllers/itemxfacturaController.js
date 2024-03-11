const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const createitemxfactura = async(req, res) => {
    const item = req.body;
    try {
        const newitem = await db('facturasxitems').returning('id').insert(item).returning('*');

        res.status(201).json(newitem[0]);
    } catch (error) {
        console.error('Error al crear newitem', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};


module.exports = {
    createitemxfactura,
};
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

const getitemxfactura = async(req, res) => {

    const idfactura = req.params.idfactura;
    try {    /*tODO INNER JOIN FACTURASXITEMS WITH ITEMS WERE ID_ITEMS IS ID OF ITEMS */
        const item = await db('facturasxitems').join('items', 'facturasxitems.id_items', 'items.id').where('facturasxitems.id_facturas', idfactura);
        res.json(item);
    }
    catch (error) {
        console.error('Error al obtener item', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}



module.exports = {
    createitemxfactura,
    getitemxfactura,
};
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

//TODO: implementar sellado
const sellar = async(req, res) => {
    console.log('sellar');
    res.status(200).json({ message: 'sellado' });
};


module.exports = {
    sellar,
};
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

//TODO: implementar firmar
const firmar = async(req, res) => {
    console.log('firmar');
    res.status(200).json({ message: 'firmado' });
};


module.exports = {
    firmar,
};
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex
const sendMail = require('../utils/mailUtils'); 


const sendMailFactura = async (req, res) => {
  try {
    const id = req.params.id_emisor;
    const plantilla = req.body.codigo_de_generacion;
  /* serching the information of the customer */
  console.log(id);
  console.log(plantilla);

  /* inner join the emisor where emisor.id_usuario is usuario.id and find usuario by id */
  const user = await db("usuario").join("emisor", "usuario.id", "emisor.id_usuario").where("usuario.id", id).first();
  /* Send the email to the customer */
  console.log(user);

  /* Sending all the info */

  const plantillaDB = await db("plantilla").where({ codigo_de_generacion: plantilla }).first();

    /* searching in table x and table items */
    const items = await db("facturasxitems").join("items", "facturasxitems.id_items", "items.id").where("facturasxitems.id_facturas", plantilla);

    console.log("Items");
    console.log(items);
    console.log(plantillaDB);


  const response = sendMail.sendMail(user, plantillaDB, items);
  console.log(response);
  console.log("Email sent");

  res.status(200).json({ message: "Email sent" });
} catch (error) {
  console.log(error);
    res.status(500).json({ message: "Internal server error" });
}

}

const sendMailCCF = async (req, res) => {

}

module.exports = {
    sendMailFactura,
    sendMailCCF,
};
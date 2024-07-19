const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex
const sendMail = require('../utils/mailUtils'); 


const sendMailFactura = async (req, res) => {
    const { id } = req.id_emisor;
    const plantilla = body.req.plantilla;
  /* serching the information of the customer */

  const user = await db("usuario").where({ id: id }).first();
  /* Send the email to the customer */
  console.log(user);
  const response = sendMail.sendMail(user, plantilla);
  console.log(response);
  console.log("Email sent");


}

const sendMailCCF = async (req, res) => {

}

module.exports = {
    sendMailFactura,
    sendMailCCF,
};
const BASE_URL = "http://localhost:3000";


const SendEmail = {
    /* 
app.use('/mail' , mailRoutes);
router.post('/factura:id_emisor', authenticateToken,sendMailFactura);
router.post('/CCF:id_emisor', authenticateToken,sendMailCCF);

const sendMailFactura = async (req, res) => {
    const { id } = req.user;
    const plantilla = info...;
  serching the information of the customer 

  const user = await db("usuario").where({ id: id_emisor }).first();
  Send the email to the customer 
  console.log(user);
  const response = sendMail.sendMail(user, plantilla);
  console.log(response);
  console.log("Email sent");


}

*/
    sendBill: async (id_emisor,plantilla, token) => {
        try {
        const res = await fetch(`${BASE_URL}/mail/factura/${id_emisor}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return error;  
    }
    },

    sendCF: async (id_emisor,plantilla, token) => {
        const res = await fetch(`${BASE_URL}/CCF${id_emisor}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },


}

export default SendEmail;

/* file to create objects */
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');


const sendMail = async (user, plantilla) => {
try {
    


    // Crear el documento PDF-------------------------------------  
    const pdfPath = path.join(__dirname, `Bill Five Diamond Service ${user.name} ${user.lasname}.pdf`);
    const pdfDoc = new PDFDocument();

    // Pipe the PDF content to a file
    pdfDoc.pipe(fs.createWriteStream(pdfPath));





    pdfDoc.end();

    // Configuración del correo electrónico
    const mailOptions = {
        from: 'carolinacastro1148@gmail.com',
        to: user.mail,
        subject: `Five Diamond Service Bill for ${user.name} ${user.lasname}`,
        html: '<h3>¡Five Diamond Service Bill!</h3><p>Invoice Generate for system Five Diamond.</p>',
        attachments: [{
            filename: `Five Diamond Service for ${user.name} ${user.lasname}.pdf`,
            path: pdfPath,
            encoding: 'base64',
        }, ],
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'carolinacastro1148@gmail.com',
            pass: 'biwm vtqq gear lsby'
        }
    });


    // Envío del correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            // Manejo de errores si falla el envío del correo
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
        }
    });
    
    return true;

} catch (error) {
    return false;
}
};

module.exports = { sendMail };
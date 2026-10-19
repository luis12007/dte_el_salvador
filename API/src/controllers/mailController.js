const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex
const sendMail = require('../utils/mailUtils');
const sendMailOsegueda = require('../utils/mailUtilsOsegueda');
const nodemailer = require('nodemailer');
const { buildInvalidationPdf, TIPOS_DTE } = require('../utils/invalidationPdf');

// Cuenta de correo de MySoftware. Credenciales desde variables de entorno
// (MAIL_USER / MAIL_PASS en .env y en Railway); nunca escritas en el código.
const MYSOFTWARE_MAIL_USER = process.env.MAIL_USER || 'mysoftwaresv@gmail.com';
const MYSOFTWARE_MAIL_PASS = process.env.MAIL_PASS;



const sendMailFactura = async(req, res) => {
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

const sendMailFacturaOsegueda = async(req, res) => {
    try {
        const id = req.params.id_emisor;
        const plantilla = req.body.codigo_de_generacion;
        /* serching the information of the customer */
        /* console.log(id);
        console.log(plantilla); */

        /* inner join the emisor where emisor.id_usuario is usuario.id and find usuario by id */
        const user = await db("usuario").join("emisor", "usuario.id", "emisor.id_usuario").where("usuario.id", id).first();
        /* Send the email to the customer */
        /* console.log(user); */

        /* Sending all the info */

        const plantillaDB = await db("plantilla").where({ codigo_de_generacion: plantilla }).first();

        /* searching in table x and table items */
        const items = await db("facturasxitems").join("items", "facturasxitems.id_items", "items.id").where("facturasxitems.id_facturas", plantilla);

        /* console.log("Items");
        console.log(items);
        console.log(plantillaDB); */


        const response = sendMailOsegueda.sendMailOsegueda(user, plantillaDB, items);
        console.log(response);
        console.log("Email sent");

        res.status(200).json({ message: "Email sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const sendMailCCF = async(req, res) => {

}

/*
 * Envía al receptor la representación gráfica (PDF) y el JSON del Evento de Invalidación.
 * body: {
 *   codigo_de_generacion: código del DTE invalidado,
 *   evento: JSON del evento de invalidación firmado,
 *   firmaElectronica: JWS devuelto por el firmador,
 *   selloRecibido, fhProcesamiento: respuesta del MH,
 *   correo: (opcional) correo destino; por defecto el del receptor del DTE
 * }
 */
const sendMailInvalidacion = async(req, res) => {
    try {
        const id = req.params.id_emisor;
        const { codigo_de_generacion, evento, firmaElectronica, selloRecibido, fhProcesamiento, correo } = req.body || {};

        if (!codigo_de_generacion || !evento || !evento.identificacion) {
            return res.status(400).json({ message: "Datos del evento incompletos" });
        }
        if (!MYSOFTWARE_MAIL_PASS) {
            console.error("MAIL_PASS no está configurado; no se puede enviar el correo de invalidación");
            return res.status(500).json({ message: "Correo no configurado en el servidor" });
        }

        const user = await db("usuario").join("emisor", "usuario.id", "emisor.id_usuario").where("usuario.id", id).first();
        if (!user) {
            return res.status(404).json({ message: "Emisor no encontrado" });
        }

        // El DTE puede estar todavía en plantilla o ya movido a la tabla deleted.
        let plantillaDB = await db("plantilla").where({ codigo_de_generacion }).first();
        if (!plantillaDB) {
            plantillaDB = await db("deleted").where({ codigo_de_generacion }).orderBy("deleted_at", "desc").first();
        }
        if (plantillaDB && String(plantillaDB.id_emisor) !== String(id)) {
            return res.status(403).json({ message: "El documento no pertenece al emisor" });
        }

        const documento = evento.documento || {};
        const destinatario = (correo || documento.correo || (plantillaDB && plantillaDB.re_correo_electronico) || "").toString().trim();
        if (!destinatario) {
            return res.status(400).json({ message: "El receptor no tiene correo electronico" });
        }

        const receptor = {
            nombre: documento.nombre || (plantillaDB && plantillaDB.re_name),
            tipoDocumento: documento.tipoDocumento || (plantillaDB && (plantillaDB.re_tipodocumento || (plantillaDB.re_nit ? "36" : null))),
            numDocumento: documento.numDocumento || (plantillaDB && (plantillaDB.re_numdocumento || plantillaDB.re_nit)),
            correo: destinatario,
        };

        const pdfBuffer = await buildInvalidationPdf({
            evento,
            sello: selloRecibido,
            fhProcesamiento,
            emisorNombre: user.name,
            receptor,
        });

        // Archivo JSON del evento con firma y sello (Manual de Integración, punto 6.5).
        const jsonEvento = {
            ...evento,
            firmaElectronica: firmaElectronica || null,
            selloRecibido: selloRecibido || null,
        };

        const codigoEvento = evento.identificacion.codigoGeneracion;
        const tipoDoc = TIPOS_DTE[documento.tipoDte] || "DTE";
        const mailOptions = {
            from: MYSOFTWARE_MAIL_USER,
            to: destinatario,
            subject: `Invalidación de DTE de parte de ${user.name}`,
            html: `<h3>¡DTE facturacion electronica MySoftwareSV!</h3>
                <p>Se le notifica que el siguiente documento ha sido invalidado ante el Ministerio de Hacienda:</p>
                <ul>
                    <li><b>Tipo de documento:</b> ${tipoDoc}</li>
                    <li><b>Número de control:</b> ${documento.numeroControl || ""}</li>
                    <li><b>Código de generación:</b> ${documento.codigoGeneracion || codigo_de_generacion}</li>
                </ul>
                <p>Adjuntamos la representación gráfica y el archivo JSON del evento de invalidación.</p>`,
            attachments: [{
                    filename: `INVALIDACION-${codigoEvento}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
                {
                    filename: `INVALIDACION-${codigoEvento}.json`,
                    content: JSON.stringify(jsonEvento, null, 2),
                    contentType: "application/json",
                },
            ],
        };

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: MYSOFTWARE_MAIL_USER,
                pass: MYSOFTWARE_MAIL_PASS,
            },
        });

        const info = await transporter.sendMail(mailOptions);
        console.log("Invalidation email sent:", info.response);

        res.status(200).json({ message: "Email sent" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    sendMailFactura,
    sendMailCCF,
    sendMailFacturaOsegueda,
    sendMailInvalidacion,
};
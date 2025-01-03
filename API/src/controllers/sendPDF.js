const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const db = require("../db/db"); // Asegúrate de tener correctamente configurado el objeto Knex

const sendPDF = async(req, res) => {
    try {
        console.log(req.body)
        const id = req.params.id_emisor;
        const plantillaCall = req.body.codigo_de_generacion;

        // Fetch user and template data from the database
        const userDB = await db("usuario").join("emisor", "usuario.id", "emisor.id_usuario").where("usuario.id", id).first();
        const plantillaDB = await db("plantilla").where({ codigo_de_generacion: plantillaCall }).first();
        const itemsDB = await db("facturasxitems").join("items", "facturasxitems.id_items", "items.id").where("facturasxitems.id_facturas", plantillaCall);

        const user = { name: userDB.name };
        const plantilla = { re_name: 'Factura Electronica' };

        const pdfDoc = new PDFDocument({
            size: 'A4',
            margins: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        console.log("llegue aqui estoy")
            // Prepare to send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        pdfDoc.pipe(res);

        // Add content to the PDF
        pdfDoc.rect(0, 0, 650, 250).fill('#EAEAEA');

        pdfDoc.fontSize(15).fillColor('#1E3256').text('DOCUMENTO TRIBUTARIO ELECTRONICO', { align: 'center' });
        if (plantillaDB.tipo === "03") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('CREDITO FISCAL', { align: 'center' });

        } else if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('FACTURA', { align: 'center' });

        }
        const yscale = 70;

        pdfDoc.font('src/assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');
        pdfDoc.fontSize(18).fillColor('#1E3256')
            .text('Dr. Luis Alonso Hernández Magaña', 30, yscale, { align: 'left' })

        pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
            .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale + 30, { align: 'left' })
            .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' })
            .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });

        const generateQRCodeImage = async(text, outputPath) => {
            try {
                await QRCode.toFile(outputPath, text, {
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const qrCodePath = path.join(__dirname, '../../qrcode.png');
        await generateQRCodeImage(`https://admin.factura.gob.sv/consultaPublica?ambiente=${userDB.ambiente}&codGen=${plantillaDB.codigo_de_generacion}&fechaEmi=${plantillaDB.fecha_y_hora_de_generacion}`, qrCodePath);
        await delay(3000);

        pdfDoc.rect(280, yscale, 100, 100).stroke('#000');
        pdfDoc.image(qrCodePath, 280, yscale, { width: 100, height: 100 });
        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Código de generación:', 400, yscale)
            .font('Helvetica').text(`${plantillaDB.codigo_de_generacion}`, 400, yscale + 15)
            .font('Helvetica-Bold').text('Numero de control:', 400, yscale + 40)
            .font('Helvetica').text(`${plantillaDB.numero_de_control}`, 400, yscale + 55)
            .font('Helvetica-Bold').text('Sello de recepción:', 400, yscale + 70)
            .font('Helvetica').text(`${plantillaDB.sello_de_recepcion}`, 400, yscale + 85);

        pdfDoc.moveTo(30, yscale + 115).lineTo(550, yscale + 115).stroke('#000');

        pdfDoc.font('Helvetica-Bold').text('Modelo de facturación', 20, yscale + 135)
            .text('Fecha y hora de generacion', 230, yscale + 135)
            .text('Tipo de transmisión', 480, yscale + 135);

        pdfDoc.font('Helvetica').text('Previo', 20, yscale + 150)
            .text(`${plantillaDB.fecha_y_hora_de_generacion} - ${plantillaDB.horemi}`, 250, yscale + 150)
            .text('Normal', 540, yscale + 150);

        const infoX = 40;
        const infoY = 270;
        pdfDoc.roundedRect(infoX, infoY, 250, 150, 10).fill('#EAEAEA').stroke('#000');
        pdfDoc.roundedRect(infoX + 270, infoY, 250, 150, 10).fill('#EAEAEA').stroke('#000');

        pdfDoc.fontSize(10).font('Helvetica-Bold').fillColor('#1E3256')
            .text('EMISOR', infoX + 10, infoY + 8);

        const truncateText = (text, maxLength) => {
            if (text === null) {
                return '';
            }
            if (text.length > maxLength) {
                return text.slice(0, maxLength - 3) + '...';
            }
            return text;
        };

        const truncatedNombreORazonSocial = truncateText(userDB.name, 20);
        const truncatedDireccion = truncateText(userDB.direccion, 37);

        pdfDoc.fontSize(10).fillColor('#1E3256')
            .font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').text(truncatedNombreORazonSocial, infoX + 122, infoY + 25)
            .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
            .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
            .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Servicios médicos', infoX + 115, infoY + 70)
            .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
            .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
            .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
            .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);

        const truncatedNombreORazonSocialReceptor = truncateText(plantillaDB.re_name, 25);
        const truncatedDireccionReceptor = truncateText(plantillaDB.re_direccion, 37);

        pdfDoc.font('Helvetica-Bold').text('RECEPTOR', infoX + 280, infoY + 8);

        if (plantillaDB.tipo === "01") {
            let re_numdocumentostring = 'DOC';
            if (plantillaDB.re_numdocumento.includes('-')) {
                re_numdocumentostring = 'DUI: ';
            } else if (plantillaDB.re_numdocumento.includes('-') === false) {
                re_numdocumentostring = 'NRC: ';
            }

            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 280, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocialReceptor, infoX + 392, infoY + 25)
                .font('Helvetica-Bold').text(re_numdocumentostring, infoX + 280, infoY + 40).font('Helvetica').text(`${plantillaDB.re_numdocumento}`, infoX + 303, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 280, infoY + 55).font('Helvetica').text('', infoX + 307, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 280, infoY + 70).font('Helvetica').text('', infoX + 385, infoY + 70)
                .font('Helvetica-Bold').text('Dirección:', infoX + 280, infoY + 85).font('Helvetica').text(truncatedDireccionReceptor, infoX + 330, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 280, infoY + 100).font('Helvetica').text(`${plantillaDB.re_correo_electronico}`, infoX + 374, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 280, infoY + 115).font('Helvetica').text('', infoX + 372, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 280, infoY + 130).font('Helvetica').text('', infoX + 398, infoY + 130);

        } else if (plantillaDB.tipo === "03") {
            const re_numdocumentostring = 'NIT: ';

            const UserAddress = plantillaDB.re_direccion.split("|");
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 37);

            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 280, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocialReceptor, infoX + 392, infoY + 25)
                .font('Helvetica-Bold').text(re_numdocumentostring, infoX + 280, infoY + 40).font('Helvetica').text(`${plantillaDB.re_nit}`, infoX + 300, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 280, infoY + 55).font('Helvetica').text('', infoX + 307, infoY + 55)
                .font('Helvetica').text(`${plantillaDB.re_nrc}`, infoX + 305, infoY + 55).font('Helvetica').text('', infoX + 307, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 280, infoY + 70).font('Helvetica').text('', infoX + 385, infoY + 70)
                .font('Helvetica').text(`${plantillaDB.re_actividad_economica}`, infoX + 385, infoY + 70).font('Helvetica').text('', infoX + 385, infoY + 70)
                .font('Helvetica-Bold').text('Dirección:', infoX + 280, infoY + 85).font('Helvetica').text(truncatedDireccionReceptor, infoX + 330, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 280, infoY + 100).font('Helvetica').text(`${plantillaDB.re_correo_electronico}`, infoX + 374, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 280, infoY + 115).font('Helvetica').text('', infoX + 372, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 280, infoY + 130).font('Helvetica').text('', infoX + 398, infoY + 130);

        }

        // Add services section
        pdfDoc.fontSize(16).fillColor('#009A9A').text('SERVICIOS', 250, infoY + 160, { underline: true });

        const servicesY = infoY + 190;
        const servicesX = 20;
        /*         pdfDoc.moveTo(30, servicesY - 20).lineTo(550, servicesY - 20).stroke('#000'); */

        pdfDoc.fontSize(10).fillColor('#1E3256')
            .text('#', servicesX, servicesY)
            .text('Cantidad', servicesX + 20, servicesY)
            .text('Código', servicesX + 70, servicesY)
            .text('Descripción', servicesX + 110, servicesY)
            .text('Unitario', servicesX + 240, servicesY)
            .text('Descuento', servicesX + 290, servicesY)
            .text('No sujetas', servicesX + 350, servicesY)
            .text('Agravadas', servicesX + 410, servicesY)
            .text('Ventas extensas', servicesX + 470, servicesY);

        const checkAndAddNewPageItems = (pdfDoc, y, threshold, newY) => {
            if (y > threshold) {
                pdfDoc.addPage();
                return newY;
            }
            return y;
        };
        let y = servicesY + 20;
        let numcounter = 1;
        itemsDB.forEach(itemsDB => {
            const truncatedesc = truncateText(itemsDB.descripcion, 26);

            // Check if a new page is needed and reset y if necessary
            y = checkAndAddNewPageItems(pdfDoc, y, 770, 20);

            pdfDoc.text(numcounter, servicesX, y)
                .text(itemsDB.cantidad, servicesX + 20, y)
                .text(itemsDB.codigo, servicesX + 70, y)
                .text(truncatedesc, servicesX + 110, y)
                .text(itemsDB.preciouni, servicesX + 240, y)
                .text(itemsDB.montodescu, servicesX + 290, y)
                .text(itemsDB.ventanosuj, servicesX + 350, y)
                .text(itemsDB.preciouni * itemsDB.cantidad, servicesX + 410, y)
                .text(itemsDB.ventaexenta, servicesX + 470, y);
            numcounter += 1;
            y += 20;
        });

        pdfDoc.moveTo(30, servicesY - 10).lineTo(550, servicesY - 10).stroke('#000');
        pdfDoc.moveTo(30, y).lineTo(550, y).stroke('#000');


        const checkAndAddNewPage = (pdfDoc, y) => {
            if (y > 540) {
                pdfDoc.addPage();
                return 30;
            }
            return y;
        };
        // Check if a new page is needed and reset y if necessary
        y = checkAndAddNewPage(pdfDoc, y);

        pdfDoc.roundedRect(20, y + 30, 210, 140, 10).fill('#EAEAEA').stroke('#000'); // Background box for sender

        /* Truncate the text */



        pdfDoc.fillColor('#1E3256').fontSize(13).text('Observaciones', 30, y + 40);
        const funcenter = (text, startY, startX, maxCharsPerLine = 40, lineHeight = 15, maxChars = 400) => {
            // Truncate text if it exceeds the maximum number of characters
            const truncatedText = text.length > maxChars ? text.slice(0, maxChars) : text;

            // Set font size
            pdfDoc.fontSize(10).fillColor('#000000');

            // Loop through the truncated text and slice it into lines
            for (let i = 0; i < truncatedText.length; i += maxCharsPerLine) {
                // Extract a line of text
                const line = truncatedText.slice(i, i + maxCharsPerLine);

                // Calculate y position for each line
                const yPosition = startY + (Math.floor(i / maxCharsPerLine) * lineHeight);

                // Add text to PDF
                pdfDoc.text(line, startX, yPosition);
            }
        };

        // Example usage
        funcenter(plantillaDB.observaciones, y + 55, 30);

        if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${plantillaDB.iva_percibido.toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $${plantillaDB.iva_percibido.toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text('Retención de renta: $0.00', 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });

        } else if (plantillaDB.tipo === "03") {
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${Number(plantillaDB.total_agravada) * 0.13}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${plantillaDB.iva_percibido}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text('Retención de renta: $0.00', 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });
        }


        /* pdfDoc.moveTo(500, 770).lineTo(580, 770).stroke('#000'); */
        pdfDoc.moveTo(500, y + 230).lineTo(580, y + 230).stroke('#000');
        pdfDoc.moveTo(500, y + 270).lineTo(580, y + 270).stroke('#000');
        pdfDoc.fontSize(30).fillColor('#009A9A').text(`$${plantillaDB.total_a_pagar}`, 400, y + 238, { align: 'right' });

        const funcenter2 = (text, y, x) => {
            /* for and slice every 26 caracters */
            for (let i = 0; i < text.length; i += 50) {
                pdfDoc.fontSize(12).fillColor('#1E3256').text(text.slice(i, i + 50), x, y + (i / 50 * 15));
            }
        }


        funcenter2(plantillaDB.cantidad_en_letras, y + 235, 20);
        pdfDoc.fontSize(12).fillColor('#1E3256').text(`Responsable emisor: ${plantillaDB.documento_e}`, 20, y + 180, );
        pdfDoc.fontSize(12).fillColor('#1E3256').text(`Responsable receptor: ${plantillaDB.documento_r}`, 20, y + 200, );
        /* text in the bottom right bold */




        pdfDoc.end();



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }

}



module.exports = {
    sendPDF,

};
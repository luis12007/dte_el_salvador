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
            pdfDoc.fontSize(17).fillColor('#1E3256').text('CRÉDITO FISCAL', { align: 'center' });

        } else if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('FACTURA', { align: 'center' });

        } else if (plantillaDB.tipo === "14") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('FACTURA SUJETO EXCLUIDO', { align: 'center' });

        } else if (plantillaDB.tipo === "05") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('NOTA DE CRÉDITO', { align: 'center' });

        } else if (plantillaDB.tipo === "06") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('NOTA DE DEBITO', { align: 'center' });

        }

        const yscale = 70;

        pdfDoc.font('src/assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');
        console.log(userDB)

        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3 || userDB.id === 5 || userDB.id === 8 || userDB.id === 15 || userDB.id === 18) {
            /* giving the userDB.name a format of name right now is LUIS HERNANDEZ  and it will be Luis Hernandez */

            const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`Dr. ${name1} ${name2} ${name3} ${name4}`, 30, yscale, { align: 'left' })
        } else if (userDB.id === 7 || userDB.id === 12) {

        }else if (userDB.id === 16 || userDB.id === 17) {
/* const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`Dr. ${name1} ${name2} ${name3}`, 53, yscale, { align: 'left' }) */
        }else if (userDB.id === 11) {
            const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
            const newname = `${name1} ${name2} ${name3} ${name4}`;

            pdfDoc.fontSize(17).fillColor('#1E3256')

            .text(`Licda. ${newname}`, 25, yscale, { align: 'left' })
        }
        else if (userDB.id === 13 || userDB.id === 14) {
            pdfDoc.fontSize(13).fillColor('#1E3256')
                .text(`${userDB.name}`, 0, yscale + 30, { align: 'center', width: 300, continued: false })
        }
         else {
            /* align in the middle of the left and center */
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`${userDB.name}`, 0, yscale, { align: 'center', width: 300, continued: false })
        }

        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale + 30, { align: 'left' })
                .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' })
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });
        } else if (userDB.id === 6  || userDB.id === 10 ) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(13).text('Servicios de sauna y estéticos', 62, yscale + 30, { align: 'left' })

        }  else if ( userDB.id === 11) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MEDICOS', 77, yscale + 30, { align: 'left' })
                .fontSize(17).text('Licenciada en Anestesiología ', 42, yscale + 50, { align: 'left' })
                .fontSize(15).text('e Inhaloterapia', 100, yscale + 70, { align: 'left' })
                .fontSize(15).text('J.V.P.M 674', 108, yscale + 92, { align: 'left' });
        }else if (userDB.id === 4 || userDB.id === 9) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('CLÍNICAS MÉDICAS', 70, yscale + 30, { align: 'left' })

        }else if (userDB.id === 14 || userDB.id === 13) {
                                /* adding img */
                    const logo = path.join(__dirname, '../assets/imgs/icplogo.png');
                    pdfDoc.image(logo, 20, yscale - 45, { width: 130, height: 50 });

            pdfDoc.fontSize(12).font('Helvetica').fillColor('#1E3256')
                .fontSize(12).text('CLÍNICA MÉDICA', 100, yscale +50, { align: 'left' })

        } 
         else if (userDB.id === 7 || userDB.id === 12) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/osegueda.png');
            pdfDoc.image(logo, 55, yscale - 60, { width: 190, height: 190 });

            /* adding number 2563-9606 // 2207-4940 */
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('2563-9606', 50, yscale + 90, { align: 'left' })
                .fontSize(15).text('2207-4940', 180, yscale + 90, { align: 'left' })

        }else if (userDB.id === 16 || userDB.id === 17) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/rinologo.png');
            pdfDoc.image(logo, 40, yscale - 10, { width: 210, height: 120 });

        } else {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale + 30, { align: 'left' })
                /* .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' }) 
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });*/
        }

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
        await generateQRCodeImage(`
                        https: //admin.factura.gob.sv/consultaPublica?ambiente=${userDB.ambiente}&codGen=${plantillaDB.codigo_de_generacion}&fechaEmi=${plantillaDB.fecha_y_hora_de_generacion}`, qrCodePath);
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

                let newname = ""
        if (userDB.id === 16 || userDB.id === 17 ) {
            const name = userDB.name.split(" ");
        const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
        const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
        const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
        newname = `${name1} ${name2} ${name3} `;
        }
        else{
        const name = userDB.name.split(" ");
        const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
        const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
        const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
        const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
        newname = `${name1} ${name2} ${name3} ${name4}`;
        }

        const truncatedNombreORazonSocial = truncateText(newname, 20);
        const truncatedDireccion = truncateText(userDB.direccion, 34);

        if (userDB.tipoestablecimiento === "20") {
            userDB.tipoestablecimiento = "Otro";
        } else if (userDB.tipoestablecimiento === "01") {
            userDB.tipoestablecimiento = "Sucursal / Agencia";
        } else if (userDB.tipoestablecimiento === "02") {
            userDB.tipoestablecimiento = "Casa matriz";
        } else if (userDB.tipoestablecimiento === "04") {
            userDB.tipoestablecimiento = "Bodega";
        } else if (userDB.tipoestablecimiento === "07") {
            userDB.tipoestablecimiento = "Predio y/o patio";
        }


        if (userDB.id === 4 || userDB.id === 9) {
            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').fontSize(10).text("HM Clinic S.A de C.V", infoX + 122, infoY + 25)
                .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Clínicas médicas', infoX + 115, infoY + 70) /* UQMEMADO SERVICIOS MEDICOS */
                .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);

        }else if (userDB.id === 10 ) {


            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocial, infoX + 122, infoY + 25)
                .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Servicios de sauna/estéticos', infoX + 115, infoY + 70) /* UQMEMADO SERVICIOS MEDICOS */
                .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);

        }else if (userDB.id === 12 || userDB.id === 7) {


            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocial, infoX + 122, infoY + 25)
                .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Servicios de Odontología', infoX + 115, infoY + 70) /* UQMEMADO SERVICIOS MEDICOS */
                .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);

        } else {
            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocial, infoX + 122, infoY + 25)
                .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Servicios médicos', infoX + 115, infoY + 70) /* UQMEMADO SERVICIOS MEDICOS */
                .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);

        }
        const truncatedNombreORazonSocialReceptor = truncateText(plantillaDB.re_name, 23);
        const truncatedDireccionReceptor = truncateText(plantillaDB.re_direccion, 34);

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
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 34);

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

        } else if (plantillaDB.tipo === "14") {
            let re_numdocumentostring = 'DOC';
            /* i have my address like 01  02|08|direccion and i just need direccion*/
            const UserAddress = plantillaDB.re_direccion.split("|");
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 34);


            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 280, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocialReceptor, infoX + 392, infoY + 25)
                .font('Helvetica-Bold').text(re_numdocumentostring, infoX + 280, infoY + 40).font('Helvetica').text(`: ${plantillaDB.re_numdocumento}`, infoX + 303, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 280, infoY + 55).font('Helvetica').text(' ', infoX + 307, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 280, infoY + 70).font('Helvetica').text(' ', infoX + 385, infoY + 70)
                .font('Helvetica-Bold').text('Dirección:', infoX + 280, infoY + 85).font('Helvetica').text(truncatedDireccionReceptor, infoX + 330, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 280, infoY + 100).font('Helvetica').text(`${plantillaDB.re_correo_electronico}`, infoX + 374, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 280, infoY + 115).font('Helvetica').text('', infoX + 372, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 280, infoY + 130).font('Helvetica').text('', infoX + 398, infoY + 130);

        } else if (plantillaDB.tipo === "05") {
            const re_numdocumentostring = 'NIT: ';

            const UserAddress = plantillaDB.re_direccion.split("|");
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 34);

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

        } else if (plantillaDB.tipo === "06") {
            const re_numdocumentostring = 'NIT: ';

            const UserAddress = plantillaDB.re_direccion.split("|");
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 34);

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
            .text('No Sujetas', servicesX + 350, servicesY)
            .text('Gravadas', servicesX + 410, servicesY)
            .text('Ventas Exentas', servicesX + 470, servicesY);

        const checkAndAddNewPageItems = (pdfDoc, y, threshold, newY) => {
            if (y > threshold) {
                pdfDoc.addPage();
                return newY;
            }
            return y;
        };
        let y = servicesY + 20;
        let numcounter = 1;
        const baseRowHeight = 20; // altura mínima de fila
        const descColX = servicesX + 110;
        const descColWidth = 120; // ancho disponible para descripción (ajusta si es necesario)
        itemsDB.forEach(item => {
            // Preparar valores y asegurar tipos
            const desc = (item.descripcion ?? '').toString();
            const cantidad = item.cantidad ?? '';
            const codigo = item.codigo ?? '';
            const unitario = item.preciouni ?? '';
            const descuento = item.montodescu ?? '';
            const noSuj = item.ventanosuj ?? '';
            const exenta = item.ventaexenta ?? '';
            const totalLinea = (() => {
                const p = parseFloat(item.preciouni);
                const c = parseFloat(item.cantidad);
                if (isNaN(p) || isNaN(c)) return '';
                return (p * c).toFixed(2);
            })();

            // Calcular altura requerida para la descripción envuelta
            const descHeight = pdfDoc.heightOfString(desc, {
                width: descColWidth,
            });
            const rowHeight = Math.max(baseRowHeight, Math.ceil(descHeight / baseRowHeight) * baseRowHeight);

            // Si no cabe la fila completa, saltar de página antes de dibujarla
            if (y + rowHeight > 770) {
                pdfDoc.addPage();
                y = 20;
            }

            // Dibujar columnas
            pdfDoc
                .text(numcounter, servicesX, y)
                .text(cantidad, servicesX + 20, y)
                .text(codigo, servicesX + 70, y);

            // Descripción con ajuste de línea dentro del ancho permitido
            pdfDoc.text(desc, descColX, y, { width: descColWidth });

            // Resto de columnas a la misma altura de inicio de la fila
            pdfDoc
                .text(unitario, servicesX + 240, y)
                .text(descuento, servicesX + 290, y)
                .text(noSuj, servicesX + 350, y)
                .text(totalLinea, servicesX + 410, y)
                .text(exenta, servicesX + 470, y);

            numcounter += 1;
            y += rowHeight; // avanzar según la altura real que ocupó la descripción
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
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });

        } else if (plantillaDB.tipo === "03") {

            /* separate the | */
            console.log('plantillaDB.tributocf', plantillaDB);

            const iva = plantillaDB.tributocf.split('|');
            const ivaCodigo = iva[0];
            const ivaDescripcion = iva[1];
            const ivaValor = iva[2];
            
            console.log('IVA Detalles:', { ivaCodigo, ivaDescripcion, ivaValor });

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "14") {
            if (plantillaDB.total_agravada === null) {
                plantillaDB.total_agravada = 0;
            }
            if (plantillaDB.porcentajedescuento === null) {
                plantillaDB.porcentajedescuento = 0;

            }
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada || 0).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento || 0).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "05") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "06") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
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
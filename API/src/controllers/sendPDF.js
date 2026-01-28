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

        }else if (plantillaDB.tipo === "08") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('COMPROBANTE DE LIQUIDACIÓN', { align: 'center' }); 
        }

        const yscale = 70;

        pdfDoc.font('src/assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');
        console.log(userDB)

        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3 || userDB.id === 5 || userDB.id === 8 || userDB.id === 15 || userDB.id === 18 || userDB.id === 19 || userDB.id === 20 || userDB.id === 23 || userDB.id === 24 || userDB.id === 25 || userDB.id === 26  || userDB.id === 29 || userDB.id === 30 || userDB.id === 31 || userDB.id === 32 || userDB.id === 33 || userDB.id === 34 || userDB.id === 35 || userDB.id === 36 ) {
            /* giving the userDB.name a format of name right now is LUIS HERNANDEZ  and it will be Luis Hernandez */

            const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`Dr. ${name1} ${name2} ${name3} ${name4}`, 30, yscale, { align: 'left' })
        } else if (userDB.id === 7 || userDB.id === 12  || userDB.id === 21 || userDB.id === 22 || userDB.id === 28 ||  userDB.id === 27) {

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
                .fontSize(15).text('SERVICIOS MÉDICOS', 70, yscale + 30, { align: 'left' })
                .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' })
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });
        } else if (userDB.id === 6  || userDB.id === 10 ) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(13).text('Servicios de sauna y estéticos', 62, yscale + 30, { align: 'left' })

        }  else if ( userDB.id === 11) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MÉDICOS', 77, yscale + 30, { align: 'left' })
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

        }else if (userDB.id === 27 || userDB.id === 28) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/Calderon.png');
            pdfDoc.image(logo, 75, yscale - 13, { width: 140, height: 120 });

        }else if (userDB.id === 16 || userDB.id === 17) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/rinologo.png');
            pdfDoc.image(logo, 40, yscale - 10, { width: 210, height: 120 });

        }else if (userDB.id === 21 || userDB.id === 22) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/koala.png');
            pdfDoc.image(logo, 40, yscale - 10, { width: 210, height: 120 });

                        pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(9).text('Factura por cuenta de:', 30, yscale + 100, { align: 'left' })

        }else if (userDB.id === 25 || userDB.id === 26) {
            if (userDB.codactividad === "86203") {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('Servicios Médicos', 80, yscale + 30, { align: 'left' })
            } else if (userDB.codactividad === "45100") {
                            pdfDoc.fontSize(8).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('Venta de vehículos automotores', 35, yscale + 30, { align: 'left' })
            } else if (userDB.codactividad === "86901") {
                pdfDoc.fontSize(8).font('Helvetica').fillColor('#1E3256')
                    .fontSize(15).text('Servicios de análisis y estudios de diagnóstico', 20, yscale + 30, { align: 'center', width: 250 })

            }
            
        }  else {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MÉDICOS', 70, yscale + 30, { align: 'left' })
                /* .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' }) 
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });*/
        }

        const generateQRCodeImage = async (text, outputPath) => {
            try {
                // Log the exact text used to generate the QR so we can debug spaces/%20
                console.log('QR content before generating:', text);

                // Ensure outputPath is absolute so later reads use the same file
                const outPath = path.isAbsolute(outputPath) ? outputPath : path.join(__dirname, outputPath);

                await QRCode.toFile(outPath, text, {
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                console.log('QR code image generated and saved to', outPath);
                return outPath;
            } catch (err) {
                console.error('Error generating QR code:', err);
                throw err;
            }
        };

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const qrCodePath = path.join(__dirname, '../../qrcode.png');

        // Build QR URL using encodeURIComponent for parameters (avoid accidental spaces)
        const qrText = `https://admin.factura.gob.sv/consultaPublica?ambiente=${encodeURIComponent(userDB.ambiente)}&codGen=${encodeURIComponent(plantillaDB.codigo_de_generacion)}&fechaEmi=${encodeURIComponent(plantillaDB.fecha_y_hora_de_generacion)}`;
        console.log('Generating QR with text:', qrText);
        try {
            await generateQRCodeImage(qrText, qrCodePath);
        } catch (err) {
            console.error('Failed to generate QR image:', err);
        }

        pdfDoc.rect(280, yscale, 100, 100).stroke('#000');
        // short delay to ensure file is visible (we awaited generation, so usually unnecessary)
        await delay(200);
        try {
            pdfDoc.image(qrCodePath, 280, yscale, { width: 100, height: 100 });
        } catch (err) {
            console.error('Error adding QR image to PDF:', err, 'path:', qrCodePath);
        }
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

        const safeText = (value) => {
            if (value === null || value === undefined) return '';
            return String(value);
        };

        const titleCaseWords = (input) => {
            const text = safeText(input).trim();
            if (!text) return '';
            return text
                .split(/\s+/)
                .filter(Boolean)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');
        };

        const formatEmisorName = (userDB) => {
            const parts = safeText(userDB.name).trim().split(/\s+/).filter(Boolean);
            const take = (userDB.id === 16 || userDB.id === 17) ? 3 : 4;
            return titleCaseWords(parts.slice(0, take).join(' '));
        };

        const mapTipoEstablecimiento = (code) => {
            const t = safeText(code);
            if (t === '20') return 'Otro';
            if (t === '01') return 'Sucursal / Agencia';
            if (t === '02') return 'Casa matriz';
            if (t === '04') return 'Bodega';
            if (t === '07') return 'Predio y/o patio';
            return t;
        };

        const parseDireccionPipe = (direccion) => {
            const raw = safeText(direccion);
            if (!raw) return '';
            if (!raw.includes('|')) return raw;
            const parts = raw.split('|');
            return (parts[2] ?? raw).toString();
        };

        const buildEmisorRows = (userDB) => {
            const tipoEst = mapTipoEstablecimiento(userDB.tipoestablecimiento);

            const nombre = (userDB.id === 4 || userDB.id === 9)
                ? 'HM Clinic S.A de C.V'
                : formatEmisorName(userDB);

            let actividad = 'Servicios médicos';
            if (userDB.id === 4 || userDB.id === 9) actividad = 'Clínicas médicas';
            if (userDB.id === 10) actividad = 'Servicios de sauna/estéticos';
            if (userDB.id === 6) actividad = 'Servicios de sauna/estéticos';
            if (userDB.id === 7 || userDB.id === 12) actividad = 'Servicios de Odontología';

            const rows = [
                { label: 'Nombre o razón social:', value: nombre },
                { label: 'NIT:', value: safeText(userDB.nit) },
                { label: 'NRC:', value: safeText(userDB.nrc) },
                { label: 'Actividad económica:', value: actividad },
                { label: 'Dirección:', value: safeText(userDB.direccion) },
                { label: 'Correo electrónico:', value: safeText(userDB.correo_electronico) },
                { label: 'Nombre comercial:', value: safeText(userDB.nombre_comercial) },
                { label: 'Tipo de establecimiento:', value: tipoEst },
            ];

            return rows.filter(r => safeText(r.value).trim().length > 0);
        };

        const buildReceptorRows = (plantillaDB) => {
            const tipo = safeText(plantillaDB.tipo);
            const nombre = safeText(plantillaDB.re_name);

            if (tipo === '01') {
                let docLabel = 'DOC:';
                const numDoc = safeText(plantillaDB.re_numdocumento);
                if (numDoc.includes('-')) docLabel = 'DUI:';
                else if (numDoc) docLabel = 'NRC:';

                const rows = [
                    { label: 'Nombre o razón social:', value: nombre },
                    { label: docLabel, value: numDoc },
                    { label: 'Dirección:', value: safeText(plantillaDB.re_direccion) },
                    { label: 'Correo electrónico:', value: safeText(plantillaDB.re_correo_electronico) },
                ];
                return rows.filter(r => safeText(r.value).trim().length > 0);
            }

            if (tipo === '14') {
                const rows = [
                    { label: 'Nombre o razón social:', value: nombre },
                    { label: 'DOC:', value: safeText(plantillaDB.re_numdocumento) },
                    { label: 'Dirección:', value: parseDireccionPipe(plantillaDB.re_direccion) },
                    { label: 'Correo electrónico:', value: safeText(plantillaDB.re_correo_electronico) },
                ];
                return rows.filter(r => safeText(r.value).trim().length > 0);
            }

            const direccion = (tipo === '03' || tipo === '08')
                ? safeText(plantillaDB.complemento)
                : parseDireccionPipe(plantillaDB.re_direccion);

            const rows = [
                { label: 'Nombre o razón social:', value: nombre },
                { label: 'NIT:', value: safeText(plantillaDB.re_nit) },
                { label: 'NRC:', value: safeText(plantillaDB.re_nrc) },
                { label: 'Actividad económica:', value: safeText(plantillaDB.re_actividad_economica) },
                { label: 'Dirección:', value: direccion },
                { label: 'Correo electrónico:', value: safeText(plantillaDB.re_correo_electronico) },
            ];

            return rows.filter(r => safeText(r.value).trim().length > 0);
        };

        const measureInfoBlockHeight = (pdfDoc, title, rows, opts) => {
            const {
                width,
                paddingX,
                paddingTop,
                paddingBottom,
                titleFontSize,
                labelFontSize,
                valueFontSize,
                labelWidth,
                rowGap,
                titleGap,
            } = opts;

            const contentWidth = width - (paddingX * 2);
            const valueWidth = Math.max(10, contentWidth - labelWidth);

            pdfDoc.font('Helvetica-Bold').fontSize(titleFontSize);
            const titleHeight = pdfDoc.heightOfString(title, { width: contentWidth });

            let total = paddingTop + titleHeight + titleGap;
            for (const row of rows) {
                pdfDoc.font('Helvetica-Bold').fontSize(labelFontSize);
                const labelH = pdfDoc.heightOfString(safeText(row.label), { width: labelWidth });
                pdfDoc.font('Helvetica').fontSize(valueFontSize);
                const valueH = pdfDoc.heightOfString(safeText(row.value), { width: valueWidth });
                total += Math.max(labelH, valueH) + rowGap;
            }
            total += paddingBottom;
            return Math.ceil(total);
        };

        const drawInfoBlock = (pdfDoc, title, x, y, width, height, rows, opts) => {
            const {
                paddingX,
                paddingTop,
                titleFontSize,
                labelFontSize,
                valueFontSize,
                labelWidth,
                rowGap,
                titleGap,
                bgColor,
                borderColor,
                textColor,
                cornerRadius,
            } = opts;

            pdfDoc.roundedRect(x, y, width, height, cornerRadius).fill(bgColor).stroke(borderColor);

            const contentX = x + paddingX;
            const contentY = y + paddingTop;
            const contentWidth = width - (paddingX * 2);
            const valueX = contentX + labelWidth;
            const valueWidth = Math.max(10, contentWidth - labelWidth);

            pdfDoc.fillColor(textColor);
            pdfDoc.font('Helvetica-Bold').fontSize(titleFontSize).text(title, contentX, contentY);

            let cursorY = contentY + pdfDoc.heightOfString(title, { width: contentWidth }) + titleGap;

            for (const row of rows) {
                const label = safeText(row.label);
                const value = safeText(row.value);

                pdfDoc.font('Helvetica-Bold').fontSize(labelFontSize).text(label, contentX, cursorY, { width: labelWidth });
                pdfDoc.font('Helvetica').fontSize(valueFontSize).text(value, valueX, cursorY, { width: valueWidth });

                const labelH = pdfDoc.heightOfString(label, { width: labelWidth });
                const valueH = pdfDoc.heightOfString(value, { width: valueWidth });
                cursorY += Math.max(labelH, valueH) + rowGap;
            }
        };

        const infoX = 40;
        const infoY = 260;

        const infoBlockOpts = {
            width: 250,
            paddingX: 8,
            paddingTop: 5,
            paddingBottom: 6,
            titleFontSize: 8,
            labelFontSize: 7,
            valueFontSize: 7,
            labelWidth: 90,
            rowGap: 1,
            titleGap: 3,
            bgColor: '#EAEAEA',
            borderColor: '#000',
            textColor: '#1E3256',
            cornerRadius: 10,
        };

        const emisorRows = buildEmisorRows(userDB);
        const receptorRows = buildReceptorRows(plantillaDB);

        const emisorHeight = measureInfoBlockHeight(pdfDoc, 'EMISOR', emisorRows, infoBlockOpts);
        const receptorHeight = measureInfoBlockHeight(pdfDoc, 'RECEPTOR', receptorRows, infoBlockOpts);

        const maxBlockHeight = Math.max(emisorHeight, receptorHeight);
        const blocksBottomNeeded = infoY + maxBlockHeight + 40;

        const blocksY = (blocksBottomNeeded > 770) ? 50 : infoY;
        if (blocksBottomNeeded > 770) {
            pdfDoc.addPage();
        }

        drawInfoBlock(pdfDoc, 'EMISOR', infoX, blocksY, infoBlockOpts.width, emisorHeight, emisorRows, infoBlockOpts);
        drawInfoBlock(pdfDoc, 'RECEPTOR', infoX + 270, blocksY, infoBlockOpts.width, receptorHeight, receptorRows, infoBlockOpts);

        const blocksBottomY = blocksY + maxBlockHeight;

        // Add services section (debajo del bloque más alto)
        pdfDoc.fontSize(10).fillColor('#009A9A').text('SERVICIOS', 265, blocksBottomY + 10, { underline: true });

        const servicesY = blocksBottomY + 35;
        const servicesX = 20;

        pdfDoc.fontSize(7).fillColor('#1E3256')
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
        let y = servicesY + 12;
        let numcounter = 1;
        const baseRowHeight = 12; // altura mínima de fila
        const descColX = servicesX + 110;
        const descColWidth = 120; // ancho disponible para descripción (ajusta si es necesario)
        pdfDoc.fontSize(7); // Establecer fuente pequeña para items
        itemsDB.forEach(item => {
            // Preparar valores y asegurar tipos
            let desc = (item.descripcion ?? '').toString();
            let cantidad = item.cantidad ?? '';
            let codigo = item.codigo ?? '';
            let unitario = item.preciouni ?? '';
            let descuento = item.montodescu ?? '';
            let noSuj = item.ventanosuj ?? '';
            const exenta = item.ventaexenta ?? '';
            const totalLinea = (() => {
                const p = parseFloat(item.preciouni);
                const c = parseFloat(item.cantidad);
                if (isNaN(p) || isNaN(c)) return '';
                return (p * c).toFixed(2);
            })();

            if (plantillaDB.tipo == "08") {
                desc = item.obsItem || '';
                unitario = item.ivaItem || '';
                cantidad = item.numItem || '';
            }

            // Calcular altura requerida para la descripción envuelta
            const descHeight = pdfDoc.heightOfString(desc, {
                width: descColWidth,
            });
            const rowHeight = Math.max(baseRowHeight, Math.ceil(descHeight / baseRowHeight) * baseRowHeight);

            // Si no cabe la fila completa, saltar de página antes de dibujarla
            if (y + rowHeight > 550) {
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

        pdfDoc.moveTo(30, servicesY - 5).lineTo(550, servicesY - 5).stroke('#000');
        pdfDoc.moveTo(30, y).lineTo(550, y).stroke('#000');


        const checkAndAddNewPage = (pdfDoc, y) => {
            if (y > 620) {
                pdfDoc.addPage();
                return 30;
            }
            return y;
        };
        // Check if a new page is needed and reset y if necessary
        y = checkAndAddNewPage(pdfDoc, y);

        // Añadir espacio entre la tabla y el resumen
        y = y + 15;

        pdfDoc.roundedRect(20, y + 8, 200, 100, 8).fill('#EAEAEA').stroke('#000'); // Background box for sender

        /* Truncate the text */



        pdfDoc.fillColor('#1E3256').fontSize(9).text('Observaciones', 28, y + 14);
        const funcenter = (text, startY, startX, maxCharsPerLine = 45, lineHeight = 10, maxChars = 300) => {
            // Handle null or undefined text
            if (!text) {
                text = '';
            }
            // Truncate text if it exceeds the maximum number of characters
            const truncatedText = text.length > maxChars ? text.slice(0, maxChars) : text;

            // Set font size
            pdfDoc.fontSize(7).fillColor('#000000');

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

        // Example usage - handle null/undefined observaciones
        funcenter(plantillaDB.observaciones || '', y + 26, 28);

        if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $0.00`, 300, y + 18, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });

        } else if (plantillaDB.tipo === "03") {

            /* separate the | */
            console.log('plantillaDB.tributocf', plantillaDB);

            const iva = plantillaDB.tributocf.split('|');
            const ivaCodigo = iva[0];
            const ivaDescripcion = iva[1];
            const ivaValor = iva[2];
            
            console.log('IVA Detalles:', { ivaCodigo, ivaDescripcion, ivaValor });

            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 18, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });
        } else if (plantillaDB.tipo === "14") {
            if (plantillaDB.total_agravada === null) {
                plantillaDB.total_agravada = 0;
            }
            if (plantillaDB.porcentajedescuento === null) {
                plantillaDB.porcentajedescuento = 0;

            }
            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 18, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada || 0).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento || 0).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });
        } else if (plantillaDB.tipo === "05") {

            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 18, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });
        } else if (plantillaDB.tipo === "06") {

            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 18, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });
        } else if (plantillaDB.tipo === "08") {

            /* separate the | */
            console.log('plantillaDB.tributocf', plantillaDB);

            const iva = plantillaDB.tributocf.split('|');
            const ivaCodigo = iva[0];
            const ivaDescripcion = iva[1];
            const ivaValor = iva[2];
            
            console.log('IVA Detalles:', { ivaCodigo, ivaDescripcion, ivaValor });

            pdfDoc.fontSize(10).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 5, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 57, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 31, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 44, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 18, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 70, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 83, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 96, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 109, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 122, { align: 'right' });
        }


        /* pdfDoc.moveTo(500, 770).lineTo(580, 770).stroke('#000'); */
        pdfDoc.moveTo(500, y + 135).lineTo(580, y + 135).stroke('#000');
        pdfDoc.moveTo(500, y + 160).lineTo(580, y + 160).stroke('#000');
        pdfDoc.fontSize(20).fillColor('#009A9A').text(`$${plantillaDB.total_a_pagar}`, 400, y + 140, { align: 'right' });

        const funcenter2 = (text, y, x) => {
            /* for and slice every 26 caracters */
            for (let i = 0; i < text.length; i += 55) {
                pdfDoc.fontSize(8).fillColor('#1E3256').text(text.slice(i, i + 55), x, y + (i / 55 * 10));
            }
        }


        funcenter2(plantillaDB.cantidad_en_letras, y + 140, 20);
        pdfDoc.fontSize(8).fillColor('#1E3256').text(`Responsable emisor: ${plantillaDB.documento_e}`, 20, y + 115, );
        pdfDoc.fontSize(8).fillColor('#1E3256').text(`Responsable receptor: ${plantillaDB.documento_r}`, 20, y + 125, );
        /* text in the bottom right bold */




        pdfDoc.end();



    } catch (error) {
        console.log(error);
        // Only send error response if headers haven't been sent yet
        if (!res.headersSent) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

}



module.exports = {
    sendPDF,

};
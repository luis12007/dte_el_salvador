/* Representación gráfica del Evento de Invalidación.
 * Sigue el estilo de los PDFs de DTE (mailUtils.js): franja gris superior,
 * títulos azul #1E3256, bloques redondeados #EAEAEA y títulos de sección #009A9A.
 * Distribución basada en el formato oficial "EVENTO DE INVALIDACIÓN" del MH.
 */
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');

const COLORS = {
    primary: '#1E3256',
    accent: '#009A9A',
    gray: '#EAEAEA',
    border: '#000',
};

const SCRIPT_FONT = path.join(__dirname, '../assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');

// CAT-002 Tipo de Documento
const TIPOS_DTE = {
    '01': 'Factura',
    '03': 'Comprobante de crédito fiscal',
    '04': 'Nota de remisión',
    '05': 'Nota de crédito',
    '06': 'Nota de débito',
    '07': 'Comprobante de retención',
    '08': 'Comprobante de liquidación',
    '09': 'Documento contable de liquidación',
    '11': 'Factura de exportación',
    '14': 'Factura de sujeto excluido',
    '15': 'Comprobante de donación',
};

// CAT-022 Tipo de documento de identificación
const TIPOS_DOC_IDENT = {
    '36': 'NIT',
    '13': 'DUI',
    '37': 'Otro',
    '03': 'Pasaporte',
    '02': 'Carnet de residente',
};

// CAT-024 Motivo del evento (tipo de invalidación)
const TIPOS_INVALIDACION = {
    1: 'Error en la información del DTE a invalidar',
    2: 'Rescindir de la operación realizada',
    3: 'Otro',
};

const safeText = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
};

const orDash = (value) => {
    const t = safeText(value).trim();
    return t.length > 0 ? t : '—';
};

const labelFrom = (catalog, code) => {
    const key = safeText(code);
    if (!key) return '';
    return catalog[key] ? `${key} - ${catalog[key]}` : key;
};

/* Bloque redondeado con título y filas "etiqueta: valor" (mismo estilo que EMISOR/RECEPTOR). */
const blockOpts = {
    paddingX: 8,
    paddingTop: 5,
    paddingBottom: 6,
    titleFontSize: 8,
    labelFontSize: 7,
    valueFontSize: 7,
    rowGap: 2,
    titleGap: 4,
    cornerRadius: 10,
};

const measureRows = (doc, rows, labelWidth, valueWidth) => {
    let total = 0;
    for (const row of rows) {
        doc.font('Helvetica-Bold').fontSize(blockOpts.labelFontSize);
        const labelH = doc.heightOfString(safeText(row.label), { width: labelWidth });
        doc.font('Helvetica').fontSize(blockOpts.valueFontSize);
        const valueH = doc.heightOfString(orDash(row.value), { width: valueWidth });
        total += Math.max(labelH, valueH) + blockOpts.rowGap;
    }
    return total;
};

const drawRows = (doc, rows, x, y, labelWidth, valueWidth) => {
    let cursorY = y;
    for (const row of rows) {
        const label = safeText(row.label);
        const value = orDash(row.value);
        doc.fillColor(COLORS.primary);
        doc.font('Helvetica-Bold').fontSize(blockOpts.labelFontSize).text(label, x, cursorY, { width: labelWidth });
        doc.font('Helvetica').fontSize(blockOpts.valueFontSize).text(value, x + labelWidth, cursorY, { width: valueWidth });
        doc.font('Helvetica-Bold').fontSize(blockOpts.labelFontSize);
        const labelH = doc.heightOfString(label, { width: labelWidth });
        doc.font('Helvetica').fontSize(blockOpts.valueFontSize);
        const valueH = doc.heightOfString(value, { width: valueWidth });
        cursorY += Math.max(labelH, valueH) + blockOpts.rowGap;
    }
    return cursorY;
};

/* columns: [{ rows, labelWidth }] repartidas en el ancho del bloque. */
const measureBlock = (doc, title, width, columns) => {
    const contentWidth = width - blockOpts.paddingX * 2;
    const colWidth = contentWidth / columns.length;
    doc.font('Helvetica-Bold').fontSize(blockOpts.titleFontSize);
    const titleH = doc.heightOfString(title, { width: contentWidth });
    const colHeights = columns.map((col) =>
        measureRows(doc, col.rows, col.labelWidth, Math.max(10, colWidth - col.labelWidth - 6))
    );
    return Math.ceil(blockOpts.paddingTop + titleH + blockOpts.titleGap + Math.max(...colHeights) + blockOpts.paddingBottom);
};

const drawBlock = (doc, title, x, y, width, height, columns) => {
    doc.roundedRect(x, y, width, height, blockOpts.cornerRadius).fillAndStroke(COLORS.gray, COLORS.border);
    const contentX = x + blockOpts.paddingX;
    const contentWidth = width - blockOpts.paddingX * 2;
    const colWidth = contentWidth / columns.length;

    doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(blockOpts.titleFontSize)
        .text(title, contentX, y + blockOpts.paddingTop, { width: contentWidth });
    const rowsY = y + blockOpts.paddingTop + doc.heightOfString(title, { width: contentWidth }) + blockOpts.titleGap;

    columns.forEach((col, i) => {
        const colX = contentX + colWidth * i;
        drawRows(doc, col.rows, colX, rowsY, col.labelWidth, Math.max(10, colWidth - col.labelWidth - 6));
    });
};

/*
 * Genera el PDF y devuelve un Buffer.
 * data = {
 *   evento:   JSON del evento de invalidación tal como se firmó (identificacion, emisor, documento, motivo)
 *   sello:    sello de recepción del evento devuelto por el MH
 *   fhProcesamiento: fecha/hora de procesamiento devuelta por el MH (opcional)
 *   emisorNombre: nombre a mostrar en el encabezado
 *   receptor: { nombre, tipoDocumento, numDocumento, correo } (datos del documento invalidado)
 * }
 */
const buildInvalidationPdf = async (data) => {
    const evento = data.evento || {};
    const ident = evento.identificacion || {};
    const emisor = evento.emisor || {};
    const documento = evento.documento || {};
    const motivo = evento.motivo || {};
    const receptor = data.receptor || {};

    const fechaEvento = ident.fecAnula || ident.fecEmi || '';
    const horaEvento = ident.horAnula || ident.horEmi || '';

    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const done = new Promise((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
    });

    const pageWidth = doc.page.width;

    /* ---------- Encabezado (franja gris) ---------- */
    const headerHeight = 205;
    doc.rect(0, 0, pageWidth, headerHeight).fill(COLORS.gray);

    doc.fillColor(COLORS.primary).font('Helvetica').fontSize(8)
        .text(`Ver. ${safeText(ident.version)}`, pageWidth - 70, 20, { width: 50, align: 'right' });

    doc.font('Helvetica').fontSize(15).fillColor(COLORS.primary)
        .text('DOCUMENTO TRIBUTARIO ELECTRONICO', 20, 20, { align: 'center', width: pageWidth - 40 });
    doc.fontSize(17).text('EVENTO DE INVALIDACIÓN', { align: 'center', width: pageWidth - 40 });

    const yscale = 70;

    // Nombre del emisor (misma tipografía que los DTE)
    try {
        doc.font(SCRIPT_FONT);
    } catch (err) {
        doc.font('Helvetica-Bold');
    }
    doc.fontSize(18).fillColor(COLORS.primary)
        .text(safeText(data.emisorNombre || emisor.nombre), 20, yscale, { width: 250, align: 'left' });

    // QR de consulta pública del documento invalidado
    const qrX = 280;
    try {
        const qrText = `https://admin.factura.gob.sv/consultaPublica?ambiente=${encodeURIComponent(safeText(ident.ambiente))}&codGen=${encodeURIComponent(safeText(documento.codigoGeneracion))}&fechaEmi=${encodeURIComponent(safeText(documento.fecEmi))}`;
        const qrBuffer = await QRCode.toBuffer(qrText, { color: { dark: '#000000', light: '#FFFFFF' } });
        doc.image(qrBuffer, qrX, yscale, { width: 100, height: 100 });
    } catch (err) {
        console.error('Error generando QR de invalidación:', err);
    }
    doc.rect(qrX, yscale, 100, 100).stroke(COLORS.border);
    doc.font('Helvetica').fontSize(6).fillColor(COLORS.primary)
        .text('Consulta del documento invalidado', qrX, yscale + 103, { width: 100, align: 'center' });

    // Identificación del evento
    const idX = 400;
    const idWidth = pageWidth - idX - 20;
    doc.fillColor(COLORS.primary)
        .font('Helvetica-Bold').fontSize(10).text('Código de generación:', idX, yscale, { width: idWidth })
        .font('Helvetica').fontSize(8).text(safeText(ident.codigoGeneracion), idX, yscale + 14, { width: idWidth })
        .font('Helvetica-Bold').fontSize(10).text('Fecha y hora del evento:', idX, yscale + 36, { width: idWidth })
        .font('Helvetica').fontSize(8).text(`${fechaEvento} ${horaEvento}`.trim(), idX, yscale + 50, { width: idWidth })
        .font('Helvetica-Bold').fontSize(10).text('Sello de recepción:', idX, yscale + 72, { width: idWidth })
        .font('Helvetica').fontSize(7).text(orDash(data.sello), idX, yscale + 86, { width: idWidth });

    doc.moveTo(30, yscale + 120).lineTo(pageWidth - 30, yscale + 120).stroke(COLORS.border);

    /* ---------- Emisor / Receptor ---------- */
    const blocksY = headerHeight + 20;
    const blockWidth = 260;
    const leftX = 30;
    const rightX = pageWidth - 30 - blockWidth;

    const emisorCols = [{
        labelWidth: 80,
        rows: [
            { label: 'Nombre:', value: emisor.nombre },
            { label: 'NIT:', value: emisor.nit },
            { label: 'Teléfono:', value: emisor.telefono },
            { label: 'Correo electrónico:', value: emisor.correo },
        ],
    }];
    const receptorCols = [{
        labelWidth: 110,
        rows: [
            { label: 'Nombre:', value: receptor.nombre },
            { label: 'Tipo de doc. de identificación:', value: labelFrom(TIPOS_DOC_IDENT, receptor.tipoDocumento) },
            { label: 'N° de doc. de identificación:', value: receptor.numDocumento },
            { label: 'Correo electrónico:', value: receptor.correo },
        ],
    }];

    const emisorH = measureBlock(doc, 'IDENTIFICACIÓN DEL EMISOR', blockWidth, emisorCols);
    const receptorH = measureBlock(doc, 'IDENTIFICACIÓN DEL RECEPTOR', blockWidth, receptorCols);
    const pairH = Math.max(emisorH, receptorH);
    drawBlock(doc, 'IDENTIFICACIÓN DEL EMISOR', leftX, blocksY, blockWidth, pairH, emisorCols);
    drawBlock(doc, 'IDENTIFICACIÓN DEL RECEPTOR', rightX, blocksY, blockWidth, pairH, receptorCols);

    /* ---------- Motivo de invalidación ---------- */
    const motivoY = blocksY + pairH + 15;
    const fullWidth = pageWidth - 60;
    const motivoCols = [
        {
            labelWidth: 125,
            rows: [
                { label: 'Tipo de invalidación:', value: labelFrom(TIPOS_INVALIDACION, motivo.tipoAnulacion) },
                { label: 'Motivo:', value: motivo.motivoAnulacion },
                { label: 'Nombre de quien realiza el evento:', value: motivo.nombreResponsable },
                { label: 'Tipo de doc. de identificación:', value: labelFrom(TIPOS_DOC_IDENT, motivo.tipDocResponsable) },
                { label: 'N° de doc. de identificación:', value: motivo.numDocResponsable },
            ],
        },
        {
            labelWidth: 125,
            rows: [
                { label: 'Nombre de quien solicita el evento:', value: motivo.nombreSolicita },
                { label: 'Tipo de doc. de identificación:', value: labelFrom(TIPOS_DOC_IDENT, motivo.tipDocSolicita) },
                { label: 'N° de doc. de identificación:', value: motivo.numDocSolicita },
            ],
        },
    ];
    const motivoTitle = 'INFORMACIÓN RELATIVA AL MOTIVO DE INVALIDACIÓN';
    const motivoH = measureBlock(doc, motivoTitle, fullWidth, motivoCols);
    drawBlock(doc, motivoTitle, leftX, motivoY, fullWidth, motivoH, motivoCols);

    /* ---------- Documento invalidado ---------- */
    const sectionY = motivoY + motivoH + 15;
    doc.font('Helvetica').fontSize(10).fillColor(COLORS.accent)
        .text('DOCUMENTO INVALIDADO', leftX, sectionY, { width: fullWidth, align: 'center', underline: true });

    const tableY = sectionY + 22;
    const columns = [
        { title: 'Tipo DTE', width: 85, value: labelFrom(TIPOS_DTE, documento.tipoDte) },
        { title: 'Código de generación', width: 125, value: documento.codigoGeneracion },
        { title: 'Sello de recepción', width: 125, value: documento.selloRecibido },
        { title: 'Número de control', width: 135, value: documento.numeroControl },
        { title: 'Fecha de emisión', width: fullWidth - 470, value: documento.fecEmi },
    ];

    const cellPad = 4;
    doc.font('Helvetica-Bold').fontSize(7);
    const headH = Math.max(...columns.map((c) => doc.heightOfString(c.title, { width: c.width - cellPad * 2 }))) + cellPad * 2;
    doc.font('Helvetica').fontSize(7);
    const bodyH = Math.max(...columns.map((c) => doc.heightOfString(orDash(c.value), { width: c.width - cellPad * 2 }))) + cellPad * 2;

    let colX = leftX;
    columns.forEach((c) => {
        doc.rect(colX, tableY, c.width, headH).fillAndStroke(COLORS.gray, COLORS.border);
        doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(7)
            .text(c.title, colX + cellPad, tableY + cellPad, { width: c.width - cellPad * 2, align: 'center' });
        doc.rect(colX, tableY + headH, c.width, bodyH).stroke(COLORS.border);
        doc.fillColor(COLORS.primary).font('Helvetica').fontSize(7)
            .text(orDash(c.value), colX + cellPad, tableY + headH + cellPad, { width: c.width - cellPad * 2, align: 'center' });
        colX += c.width;
    });

    const reemplazoY = tableY + headH + bodyH + 15;
    doc.fillColor(COLORS.primary).font('Helvetica-Bold').fontSize(8)
        .text('Código de generación que reemplaza al invalidado:', leftX, reemplazoY, { continued: true })
        .font('Helvetica').text(`  ${documento.codigoGeneracionR ? documento.codigoGeneracionR : 'No aplica'}`);

    if (data.fhProcesamiento) {
        doc.font('Helvetica').fontSize(7).fillColor(COLORS.primary)
            .text(`Procesado por el Ministerio de Hacienda: ${data.fhProcesamiento}`, leftX, reemplazoY + 18);
    }

    /* ---------- Pie ---------- */
    const pageHeight = doc.page.height;
    doc.font('Helvetica').fontSize(8).fillColor(COLORS.primary)
        .text('Página 1 de 1', leftX, pageHeight - 40, { width: fullWidth, align: 'right', lineBreak: false });

    doc.end();
    return done;
};

module.exports = { buildInvalidationPdf, TIPOS_DTE };

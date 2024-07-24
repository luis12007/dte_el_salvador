/* file to create objects */
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { info } = require('console');

/* 1
01
COUNT
[ { count: '9' } ]
1
CODE
38E27C6A-F41A-412F-B263-492FCC085A49

User
{
  id: 1,
  usuario: 'Luis',
  'contraseña': '123',
  codigo_hacienda: 'M{Opt4$roCo',
  id_emisor: 1,
  passwordpri: 'Halogenados2024',
  googlekey: 'null',
  ambiente: '00',
  nit: '02101601741065',
  nrc: '1837811',
  direccion: 'Residencial san gabriel 2, calle al volcan casa #3, San Salvador Mejicanos',
  numero_de_telefono: '64319239',
  correo_electronico: 'luishdezmtz12@gmail.com',
  nombre_comercial: 'nombre comercial',
  tipo_de_establecimieto: null,
  id_usuario: 1,
  name: 'LUIS ALONSO HERNANDEZ MAGAÑA',
  municipio: '08',
  departamento: '06',
  codactividad: '86203',
  descactividad: 'Servicios médicos ',
  tipoestablecimiento: '20'
}

Items
[
  {
    id: 30,
    id_items: 30,
    id_facturas: '38E27C6A-F41A-412F-B263-492FCC085A49',
    cantidad: 1,
    codigo: null,
    descripcion: 'ss',
    codtributo: null,
    unimedida: 99,
    numitem: 1,
    tributos: null,
    ivaitem: 1.38,
    nogravado: 0,
    psv: 0,
    montodescu: 0,
    numerodocumento: null,
    preciouni: 12,
    ventagravada: 12,
    ventaexenta: 0,
    ventanosuj: 0,
    tipoitem: 1
  },
  {
    id: 31,
    id_items: 31,
    id_facturas: '38E27C6A-F41A-412F-B263-492FCC085A49',
    cantidad: 1,
    codigo: null,
    descripcion: 'ss',
    codtributo: null,
    unimedida: 99,
    numitem: 2,
    tributos: null,
    ivaitem: 0.12,
    nogravado: 0,
    psv: 0,
    montodescu: 0,
    numerodocumento: null,
    preciouni: 1,
    ventagravada: 1,
    ventaexenta: 0,
    ventanosuj: 0,
    tipoitem: 1
  }
]

Plantilla

{
  id: 93,
  tipo: '01',
  codigo_de_generacion: '38E27C6A-F41A-412F-B263-492FCC085A49',
  sellado: false,
  numero_de_control: 'DTE-01-00000030-000000000000000',
  sello_de_recepcion: null,
  modelo_de_factura: '1',
  tipo_de_transmision: '1',
  fecha_y_hora_de_generacion: '2024-05-13',
  id_emisor: 1,
  id_receptor: null,
  qr: null,
  total_agravada: '13',
  subtotal: '11.5',
  monto_global_de_descuento: '0',
  iva_percibido: '1.5',
  iva_retenido: '0',
  retencion_de_renta: '0',
  total_a_pagar: '13',
  cantidad_en_letras: 'TRECE DÓLARES',
  observaciones: 'asdas',
  responsable_emisor: null,
  documento_e: null,
  documento_r: null,
  documento_receptor: null,
  firm: null,
  re_nit: null,
  re_nrc: null,
  re_actividad_economica: null,
  re_direccion: null,
  re_correo_electronico: null,
  re_nombre_comercial: null,
  re_name: null,
  re_numero_telefono: null,
  re_tipo_establecimiento: null,
  version: '1',
  ambiente: '00',
  tipomoneda: 'USD',
  tipocontingencia: null,
  motivocontin: null,
  documentorelacionado: null,
  codestablemh: null,
  codestable: null,
  codpuntoventamh: null,
  codpuntoventa: null,
  re_codactividad: null,
  re_tipodocumento: null,
  re_numdocumento: null,
  otrosdocumentos: null,
  ventatercero: null,
  condicionoperacion: 1,
  saldofavor: 0,
  numpagoelectronico: null,
  periodo: null,
  montopago: 13,
  codigo: '01',
  referencia: null,
  totalnosuj: 0,
  tributos: null,
  totalexenta: 0,
  subtotalventas: 13,
  montototaloperacion: 13,
  descunosuj: 0,
  descuexenta: 0,
  descugravada: 0,
  porcentajedescuento: 0,
  totalnogravado: 0,
  placavehiculo: null,
  apendice: null,
  horemi: '19:07:54',
  plazo: null
} */

const sendMail = async (user, plantillaDB, items) => {
  try {
    // Example user and plantillaDB data
    const user = { name: 'John Doe' };
    const plantillaDB = { re_name: 'Invoice' };

    // Create the document PDF
    const pdfPath = path.join(__dirname, `${user.name} ${plantillaDB.re_name}.pdf`);
    
    const pdfDoc = new PDFDocument({
        size: 'A4',
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
    });

    pdfDoc.pipe(fs.createWriteStream(pdfPath))
        .on('finish', async () => {
            // Email configuration
            const mailOptions = {
                from: 'mysoftwaresv@gmail.com', // CHANGE MOCK DATA
                to: 'mysoftwaresv@gmail.com', // CHANGE MOCK DATA
                subject: `DTE ${user.name}`, // CHANGE MOCK DATA
                html: '<h3>¡DTE facturacion electronica!</h3><p>lore ipsum lore ipsum lore ipsum lore ipsum lore ipsum.</p>',
                attachments: [{
                    filename: 'DTE.pdf',
                    path: pdfPath,
                    encoding: 'base64'
                }]
            };

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mysoftwaresv@gmail.com', // CHANGE MOCK DATA
                    pass: 'ajbh eozh iltf oinf' // CHANGE MOCK DATA
                }
            });

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        })
        .on('error', (error) => {
            console.error('Error creating PDF:', error);
        });

    // Add background color
    pdfDoc.rect(0, 0, 650, 250).fill('#EAEAEA');

    // Add title
    pdfDoc.fontSize(15).fillColor('#1E3256').text('DOCUMENTO TRIBUTARIO ELECTRONICO', { align: 'center' });
    pdfDoc.fontSize(17).fillColor('#1E3256').text('FACTURA', { align: 'center' });
    const yscale = 70;

    // Add Doctor's information
    pdfDoc.fontSize(15).fillColor('#1E3256')
        .text('Dr. Luis Alonso Hernández Magaña',30,yscale, { align: 'left' })

        pdfDoc.fontSize(10).fillColor('#1E3256')
        .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale+30,{ align: 'left' })
        .fontSize(17).text('Anestesiólogo Internista',55,yscale+50, { align: 'left' })
        .fontSize(15).text('J.V.P.M 8059',100,yscale+70,  { align: 'left' });

    // QR code and codes section (mock content for simplicity)
    /* BORDER BLACK */
    /* pdfDoc.rect(1300, 80, 150, 150).stroke('#000'); */ 
    

     pdfDoc.rect(280, yscale, 100,100).stroke('#000'); // Background box for QR code
    pdfDoc.fontSize(10).font('Helvetica-Bold').text('Código de generación:', 400, yscale)
        .font('Helvetica').text('IEJD-DKFI-DKKE-DKEO-DKS', 400, yscale+15)
        .font('Helvetica-Bold').text('Numero de control:', 400, yscale+30)
        .font('Helvetica').text('DTE-0100-002-00000000010', 400,yscale+45)
        .font('Helvetica-Bold').text('Sello de recepción:', 400, yscale+60)
        .font('Helvetica').text('024E68208639D4549FB9FA06E7CB6D57', 400, yscale+75)

        /* An line to divide */

        pdfDoc.moveTo(30, yscale+115).lineTo(550, yscale+115).stroke('#000');

    // Model and transmission info
    pdfDoc.font('Helvetica-Bold').text('Modelo de facturación', 20, yscale+135)
        .text('Fecha y hora de generacion', 230, yscale+135)
        .text('Tipo de transmisión', 480, yscale+135);

    pdfDoc.font('Helvetica').text('Previo', 20, yscale+150)
        .text('8/01/2024 05:53 PM', 250, yscale+150)
        .text('Normal', 540, yscale+150);

        /* text bold */


    // Add sender and receiver information
    const infoX = 40;
    const infoY = 270;
    /* rectangle with radius rounded */
    pdfDoc.roundedRect(infoX, infoY, 250, 130, 10).fill('#EAEAEA').stroke('#000'); // Background box for sender
    pdfDoc.roundedRect(infoX + 270, infoY, 250, 130, 10).fill('#EAEAEA').stroke('#000'); // Background box for receiver

    pdfDoc.fontSize(10).font('Helvetica-Bold').fillColor('#1E3256')
        .text('EMISOR', infoX + 10, infoY + 8)


        pdfDoc.fontSize(10).fillColor('#1E3256')
        .font('Helvetica').text('Nombre o razón social: Luis Alexander Hernández', infoX + 10, infoY + 25)
        .text('NIT: 871238782173', infoX + 10, infoY + 40)
        .text('NRC: 982839002900', infoX + 10, infoY + 55)
        .text('Actividad económica: Servicios médicos', infoX + 10, infoY + 70)
/*         .text('Dirección: Residencial San Gabriel 2, casa #3, Calle al volcán, Mejicanos, San Salvador', infoX + 10, infoY + 85) */
        .text('Dirección: Residencial San Gabriel 2, casa #3', infoX + 10, infoY + 85)
        .text('Correo electrónico: Luishdezmtz12@gmail.com', infoX + 10, infoY + 100);

    pdfDoc.font('Helvetica-Bold').text('RECEPTOR', infoX + 280, infoY + 8)

        pdfDoc
        .font('Helvetica').text('Nombre o razón social: Luis Alexander Hernández', infoX + 280, infoY + 25)
        .text('NIT: 871238782173', infoX + 280, infoY + 40)
        .text('NRC: 982839002900', infoX + 280, infoY + 55)
        .text('Actividad económica: Servicios médicos', infoX + 280, infoY + 70)
        .text('Dirección: Residencial San Gabriel 2, casa #3', infoX + 280, infoY + 85)
        .text('Correo electrónico: Luishdezmtz12@gmail.com', infoX + 280, infoY + 100);

    // Add services section
    pdfDoc.fontSize(16).fillColor('#009A9A').text('SERVICIOS',250,infoY + 150 ,{underline: true });

    const servicesY = infoY + 180;
    const servicesX = 20;
    pdfDoc.fontSize(10).fillColor('#1E3256')
        .text('#', servicesX, servicesY)
        .text('Cantidad', servicesX+20, servicesY)
        .text('Código', servicesX+50, servicesY)
        .text('Descripción', servicesX+40, servicesY)
        .text('Precio Unitario', servicesX+100, servicesY)
        .text('Descuento', 370, servicesY)
        .text('ventas no sujetas', 440, servicesY)
        .text('Ventas extensas', 510, servicesY)
        .text('Ventas agravadas', 580, servicesY);

    const items = [
        { num: '1', cantidad: '1', codigo: '#', descripcion: 'Servicio médico 1', precio: '$100.00', descuento: '$0.00', ventasNoSujetas: '$0.00', ventasExtensas: '$100.00', ventasAgravadas: '$0.00' },
        { num: '2', cantidad: '1', codigo: '#', descripcion: 'Servicio médico 2', precio: '$25.00', descuento: '$0.00', ventasNoSujetas: '$0.00', ventasExtensas: '$25.00', ventasAgravadas: '$0.00' },
        { num: '3', cantidad: '1', codigo: '#', descripcion: 'Servicio médico 3', precio: '$50.00', descuento: '$0.00', ventasNoSujetas: '$0.00', ventasExtensas: '$50.00', ventasAgravadas: '$0.00' },
    ];

    let y = servicesY + 20;
    items.forEach(item => {
        pdfDoc.text(item.num, servicesX, y)
            .text(item.cantidad, servicesX+20, y)
            .text(item.codigo, servicesX+50, y)
            .text(item.descripcion, servicesX+40, y)
            .text(item.precio, servicesX+100, y)
            .text(item.descuento, 370, y)
            .text(item.ventasNoSujetas, 440, y)
            .text(item.ventasExtensas, 510, y)
            .text(item.ventasAgravadas, 580, y);
        y += 20;
    });

    // Add Observations and totals
    pdfDoc.text('Observaciones', 20, y + 20);
    pdfDoc.text('Observaciones del DTE opcional', 20, y + 35);
    pdfDoc.text('Observaciones del DTE opcionalObservaciones del DTE opcional', 20, y + 50);

    pdfDoc.text('Ventas no sujetas: $0.00', 350, y + 20)
        .text('Total gravado: $0.00', 350, y + 35)
        .text('Monto de descuento: $0.00', 350, y + 50)
        .text('Sumatoria de ventas: $175.00', 350, y + 65)
        .text('Impuesto valor agregado 13%: $0.00', 350, y + 80)
        .text('IVA recibido: $0.00', 350, y + 95)
        .text('IVA retenido: $0.00', 350, y + 110)
        .text('Retención de renta: $0.00', 350, y + 125)
        .text('Monto total de operación: $175.00', 350, y + 140);



      pdfDoc.fontSize(20).fillColor('#009A9A').text('$100',500,650, { align: 'right', underline: true });
        /* text in the bottom right bold */



        
    pdfDoc.end();
    
} catch (error) {
    console.error('Error:', error);
    // Handle error if something goes wrong
}
};

module.exports = { sendMail };
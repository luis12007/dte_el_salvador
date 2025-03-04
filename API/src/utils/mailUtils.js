/* file to create objects */
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { info } = require('console');
const QRCode = require('qrcode');

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

const sendMail = async(userDB, plantillaDB, itemsDB) => {
    try {
        /* CREATING THE JSON TO SEND */
        if (plantillaDB.tipo === "01") {

            /* {
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
} */

            const Listitems = itemsDB.map((item, index) => {
                const newItem = {
                    codTributo: item.codtributo,
                    descripcion: item.descripcion,
                    uniMedida: item.unimedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numItem: index + 1, // Using the index for numbering
                    tributos: item.tributos,
                    ivaItem: item.ivaitem,
                    noGravado: item.nogravado,
                    psv: item.psv,
                    montoDescu: item.montodescu,
                    numeroDocumento: item.numerodocumento,
                    precioUni: item.preciouni,
                    ventaGravada: item.ventagravada,
                    ventaExenta: item.ventaexenta,
                    ventaNoSuj: item.ventanosuj,
                    tipoItem: item.tipoitem,
                };
                return newItem;
            });
            var json = {
                identificacion: {
                    version: parseInt(plantillaDB.version),
                    ambiente: plantillaDB.ambiente,
                    tipoDte: plantillaDB.tipo,
                    numeroControl: plantillaDB.numero_de_control,
                    codigoGeneracion: plantillaDB.codigo_de_generacion,
                    tipoModelo: parseInt(plantillaDB.modelo_de_factura),
                    tipoOperacion: parseInt(plantillaDB.tipo_de_transmision),
                    fecEmi: plantillaDB.fecha_y_hora_de_generacion, // Extracting date
                    horEmi: plantillaDB.horemi,
                    tipoMoneda: plantillaDB.tipomoneda,
                    tipoContingencia: plantillaDB.tipocontingencia,
                    motivoContin: plantillaDB.motivocontin
                },
                documentoRelacionado: plantillaDB.documentorelacionado,
                emisor: {
                    direccion: {
                        municipio: userDB.municipio,
                        departamento: userDB.departamento,
                        complemento: userDB.direccion
                    },
                    nit: userDB.nit,
                    nrc: userDB.nrc,
                    nombre: userDB.name,
                    codActividad: userDB.codactividad,
                    descActividad: userDB.descactividad,
                    telefono: userDB.numero_de_telefono,
                    correo: userDB.correo_electronico,
                    nombreComercial: userDB.nombre_comercial,
                    tipoEstablecimiento: userDB.tipoestablecimiento,
                    codEstableMH: plantillaDB.codestablemh,
                    codEstable: plantillaDB.codestable,
                    codPuntoVentaMH: plantillaDB.codpuntoventamh,
                    codPuntoVenta: plantillaDB.codpuntoventa
                },
                receptor: {
                    codActividad: plantillaDB.re_codactividad,
                    direccion: plantillaDB.re_direccion,
                    nrc: plantillaDB.re_nrc,
                    descActividad: plantillaDB.re_actividad_economica,
                    correo: plantillaDB.re_correo_electronico,
                    tipoDocumento: plantillaDB.re_tipodocumento,
                    nombre: plantillaDB.re_name,
                    telefono: plantillaDB.re_numero_telefono,
                    numDocumento: plantillaDB.re_numdocumento
                },
                otrosDocumentos: plantillaDB.otrosdocumentos,
                ventaTercero: plantillaDB.ventatercero,
                cuerpoDocumento: Listitems,
                resumen: {
                    condicionOperacion: plantillaDB.condicionoperacion,
                    totalIva: parseFloat(plantillaDB.iva_percibido),
                    saldoFavor: plantillaDB.saldofavor,
                    numPagoElectronico: plantillaDB.numpagoelectronico,
                    pagos: [{
                        periodo: plantillaDB.periodo,
                        plazo: plantillaDB.plazo,
                        montoPago: parseFloat(plantillaDB.montopago),
                        codigo: plantillaDB.codigo,
                        referencia: plantillaDB.referencia
                    }],
                    totalNoSuj: plantillaDB.totalnosuj,
                    tributos: plantillaDB.tributos,
                    totalLetras: plantillaDB.cantidad_en_letras,
                    totalExenta: plantillaDB.totalexenta,
                    subTotalVentas: parseFloat(plantillaDB.subtotalventas),
                    totalGravada: parseFloat(plantillaDB.totalagravada),
                    montoTotalOperacion: parseFloat(plantillaDB.montototaloperacion),
                    descuNoSuj: plantillaDB.descunosuj,
                    descuExenta: plantillaDB.descuexenta,
                    descuGravada: plantillaDB.descugravada,
                    porcentajeDescuento: plantillaDB.porcentajedescuento,
                    totalDescu: parseFloat(plantillaDB.totalnogravado),
                    subTotal: parseFloat(plantillaDB.subtotal),
                    ivaRete1: plantillaDB.iva_retenido,
                    reteRenta: plantillaDB.retencion_de_renta,
                    totalNoGravado: plantillaDB.totalnogravado,
                    totalPagar: parseFloat(plantillaDB.total_a_pagar)
                },
                extension: {
                    docuEntrega: plantillaDB.documento_e,
                    nombRecibe: plantillaDB.documento_receptor,
                    observaciones: plantillaDB.observaciones,
                    placaVehiculo: plantillaDB.placavehiculo,
                    nombEntrega: plantillaDB.documento_r,
                    docuRecibe: plantillaDB.documento_receptor
                },
                apendice: plantillaDB.apendice
            };

            console.log('JSON to send:', json);
        } else if (plantillaDB.tipo === "03") {

            const Listitems = itemsDB.map((item, index) => {
                const newItem = {
                    codTributo: item.codtributo,
                    descripcion: item.descripcion,
                    uniMedida: item.unimedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numItem: index + 1, // Using the index for numbering
                    tributos: [item.tributos.toString()],
                    noGravado: item.nogravado,
                    psv: item.psv,
                    montoDescu: item.montodescu,
                    numeroDocumento: item.numerodocumento,
                    precioUni: item.preciouni,
                    ventaGravada: item.ventagravada,
                    ventaExenta: item.ventaexenta,
                    ventaNoSuj: item.ventanosuj,
                    tipoItem: item.tipoitem,
                };
                return newItem;
            });


            const address = plantillaDB.re_direccion.split("|");
            const tributocf = plantillaDB.tributocf.split("|");
            var json = {
                identificacion: {
                    version: parseInt(plantillaDB.version),
                    ambiente: plantillaDB.ambiente,
                    tipoDte: plantillaDB.tipo,
                    numeroControl: plantillaDB.numero_de_control,
                    codigoGeneracion: plantillaDB.codigo_de_generacion,
                    tipoModelo: parseInt(plantillaDB.modelo_de_factura),
                    tipoOperacion: parseInt(plantillaDB.tipo_de_transmision),
                    fecEmi: plantillaDB.fecha_y_hora_de_generacion, // Extracting date
                    horEmi: plantillaDB.horemi,
                    tipoMoneda: plantillaDB.tipomoneda,
                    tipoContingencia: plantillaDB.tipocontingencia,
                    motivoContin: plantillaDB.motivocontin
                },
                documentoRelacionado: plantillaDB.documentorelacionado,
                emisor: {
                    direccion: {
                        municipio: userDB.municipio,
                        departamento: userDB.departamento,
                        complemento: userDB.direccion
                    },
                    nit: userDB.nit,
                    nrc: userDB.nrc,
                    nombre: userDB.name,
                    codActividad: userDB.codactividad,
                    descActividad: userDB.descactividad,
                    telefono: userDB.numero_de_telefono,
                    correo: userDB.correo_electronico,
                    nombreComercial: userDB.nombre_comercial,
                    tipoEstablecimiento: userDB.tipoestablecimiento,
                    codEstableMH: plantillaDB.codestablemh,
                    codEstable: plantillaDB.codestable,
                    codPuntoVentaMH: plantillaDB.codpuntoventamh,
                    codPuntoVenta: plantillaDB.codpuntoventa
                },
                receptor: {
                    codActividad: plantillaDB.re_codactividad,
                    direccion: {
                        municipio: address[1],
                        departamento: address[0],
                        complemento: address[2]
                    },
                    nrc: plantillaDB.re_nrc,
                    descActividad: plantillaDB.re_actividad_economica,
                    correo: plantillaDB.re_correo_electronico,
                    nit: plantillaDB.re_nit,
                    nombre: plantillaDB.re_name,
                    telefono: plantillaDB.re_numero_telefono,
                    nombreComercial: plantillaDB.re_numdocumento
                },
                otrosDocumentos: plantillaDB.otrosdocumentos,
                ventaTercero: plantillaDB.ventatercero,
                cuerpoDocumento: Listitems,
                resumen: {
                    condicionOperacion: plantillaDB.condicionoperacion,
                    saldoFavor: plantillaDB.saldofavor,
                    numPagoElectronico: plantillaDB.numpagoelectronico,
                    pagos: [{
                        periodo: plantillaDB.periodo,
                        plazo: plantillaDB.plazo,
                        montoPago: parseFloat(plantillaDB.montopago),
                        codigo: plantillaDB.codigo,
                        referencia: plantillaDB.referencia
                    }],
                    totalNoSuj: plantillaDB.totalnosuj,
                    tributos: [{
                        codigo: tributocf[0],
                        descripcion: tributocf[1],
                        valor: parseFloat(tributocf[2])
                    }],
                    totalLetras: plantillaDB.cantidad_en_letras,
                    totalExenta: plantillaDB.totalexenta,
                    subTotalVentas: parseFloat(plantillaDB.subtotalventas),
                    totalGravada: parseFloat(plantillaDB.totalagravada),
                    montoTotalOperacion: parseFloat(plantillaDB.montototaloperacion),
                    descuNoSuj: plantillaDB.descunosuj,
                    descuExenta: plantillaDB.descuexenta,
                    descuGravada: plantillaDB.descugravada,
                    porcentajeDescuento: plantillaDB.porcentajedescuento,
                    totalDescu: parseFloat(plantillaDB.totalnogravado),
                    subTotal: parseFloat(plantillaDB.subtotal),
                    ivaRete1: parseFloat(plantillaDB.iva_retenido),
                    reteRenta: parseFloat(plantillaDB.retencion_de_renta),
                    totalNoGravado: plantillaDB.totalnogravado,
                    totalPagar: parseFloat(plantillaDB.total_a_pagar),
                    ivaPerci1: parseFloat(plantillaDB.iva_percibido),

                },
                extension: {
                    docuEntrega: plantillaDB.documento_e,
                    nombRecibe: plantillaDB.documento_receptor,
                    observaciones: plantillaDB.observaciones,
                    placaVehiculo: plantillaDB.placavehiculo,
                    nombEntrega: plantillaDB.documento_r,
                    docuRecibe: plantillaDB.documento_receptor
                },
                apendice: plantillaDB.apendice
            };
        } else if (plantillaDB.tipo === "14") {

            const Listitems = itemsDB.map((item, index) => {
                const newItem = {
                    codTributo: item.codtributo,
                    descripcion: item.descripcion,
                    uniMedida: item.unimedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numItem: index + 1, // Using the index for numbering
                    tributos: null,
                    noGravado: item.nogravado,
                    psv: item.psv,
                    montoDescu: item.montodescu,
                    numeroDocumento: item.numerodocumento,
                    precioUni: item.preciouni,
                    ventaGravada: item.ventagravada,
                    ventaExenta: item.ventaexenta,
                    ventaNoSuj: item.ventanosuj,
                    tipoItem: item.tipoitem,
                };
                return newItem;
            });


            const address = plantillaDB.re_direccion.split("|");
            const tributocf = plantillaDB.tributocf.split("|");
            var json = {
                identificacion: {
                    version: parseInt(plantillaDB.version),
                    ambiente: plantillaDB.ambiente,
                    tipoDte: plantillaDB.tipo,
                    numeroControl: plantillaDB.numero_de_control,
                    codigoGeneracion: plantillaDB.codigo_de_generacion,
                    tipoModelo: parseInt(plantillaDB.modelo_de_factura),
                    tipoOperacion: parseInt(plantillaDB.tipo_de_transmision),
                    fecEmi: plantillaDB.fecha_y_hora_de_generacion, // Extracting date
                    horEmi: plantillaDB.horemi,
                    tipoMoneda: plantillaDB.tipomoneda,
                    tipoContingencia: plantillaDB.tipocontingencia,
                    motivoContin: plantillaDB.motivocontin
                },
                documentoRelacionado: plantillaDB.documentorelacionado,
                emisor: {
                    direccion: {
                        municipio: userDB.municipio,
                        departamento: userDB.departamento,
                        complemento: userDB.direccion
                    },
                    nit: userDB.nit,
                    nrc: userDB.nrc,
                    nombre: userDB.name,
                    codActividad: userDB.codactividad,
                    descActividad: userDB.descactividad,
                    telefono: userDB.numero_de_telefono,
                    correo: userDB.correo_electronico,
                    nombreComercial: userDB.nombre_comercial,
                    tipoEstablecimiento: userDB.tipoestablecimiento,
                    codEstableMH: plantillaDB.codestablemh,
                    codEstable: plantillaDB.codestable,
                    codPuntoVentaMH: plantillaDB.codpuntoventamh,
                    codPuntoVenta: plantillaDB.codpuntoventa
                },
                receptor: {
                    codActividad: plantillaDB.re_codactividad,
                    direccion: {
                        municipio: address[1],
                        departamento: address[0],
                        complemento: address[2]
                    },
                    nrc: plantillaDB.re_nrc,
                    descActividad: plantillaDB.re_actividad_economica,
                    correo: plantillaDB.re_correo_electronico,
                    nit: plantillaDB.re_nit,
                    nombre: plantillaDB.re_name,
                    telefono: plantillaDB.re_numero_telefono,
                    nombreComercial: plantillaDB.re_numdocumento
                },
                otrosDocumentos: plantillaDB.otrosdocumentos,
                ventaTercero: plantillaDB.ventatercero,
                cuerpoDocumento: Listitems,
                resumen: {
                    condicionOperacion: plantillaDB.condicionoperacion,
                    saldoFavor: plantillaDB.saldofavor,
                    numPagoElectronico: plantillaDB.numpagoelectronico,
                    pagos: [{
                        periodo: plantillaDB.periodo,
                        plazo: plantillaDB.plazo,
                        montoPago: parseFloat(plantillaDB.montopago),
                        codigo: plantillaDB.codigo,
                        referencia: plantillaDB.referencia
                    }],
                    totalNoSuj: plantillaDB.totalnosuj,
                    tributos: [{
                        codigo: tributocf[0],
                        descripcion: tributocf[1],
                        valor: parseFloat(tributocf[2])
                    }],
                    totalLetras: plantillaDB.cantidad_en_letras,
                    totalExenta: plantillaDB.totalexenta,
                    subTotalVentas: parseFloat(plantillaDB.subtotalventas),
                    totalGravada: parseFloat(plantillaDB.totalagravada),
                    montoTotalOperacion: parseFloat(plantillaDB.montototaloperacion),
                    descuNoSuj: plantillaDB.descunosuj,
                    descuExenta: plantillaDB.descuexenta,
                    descuGravada: plantillaDB.descugravada,
                    porcentajeDescuento: plantillaDB.porcentajedescuento,
                    totalDescu: parseFloat(plantillaDB.totalnogravado),
                    subTotal: parseFloat(plantillaDB.subtotal),
                    ivaRete1: parseFloat(plantillaDB.iva_retenido),
                    reteRenta: parseFloat(plantillaDB.retencion_de_renta),
                    totalNoGravado: plantillaDB.totalnogravado,
                    totalPagar: parseFloat(plantillaDB.total_a_pagar),
                    ivaPerci1: parseFloat(plantillaDB.iva_percibido),

                },
                extension: {
                    docuEntrega: plantillaDB.documento_e,
                    nombRecibe: plantillaDB.documento_receptor,
                    observaciones: plantillaDB.observaciones,
                    placaVehiculo: plantillaDB.placavehiculo,
                    nombEntrega: plantillaDB.documento_r,
                    docuRecibe: plantillaDB.documento_receptor
                },
                apendice: plantillaDB.apendice
            };
        } else if (plantillaDB.tipo === "05") {

            const Listitems = itemsDB.map((item, index) => {
                const newItem = {
                    codTributo: item.codtributo,
                    descripcion: item.descripcion,
                    uniMedida: item.unimedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numItem: index + 1, // Using the index for numbering
                    tributos: null,
                    noGravado: item.nogravado,
                    psv: item.psv,
                    montoDescu: item.montodescu,
                    numeroDocumento: item.numerodocumento,
                    precioUni: item.preciouni,
                    ventaGravada: item.ventagravada,
                    ventaExenta: item.ventaexenta,
                    ventaNoSuj: item.ventanosuj,
                    tipoItem: item.tipoitem,
                };
                return newItem;
            });


            const address = plantillaDB.re_direccion.split("|");
            const tributocf = plantillaDB.tributocf.split("|");
            const document = plantillaDB.documentorelacionado.split("|");
            var json = {
                identificacion: {
                    version: parseInt(plantillaDB.version),
                    ambiente: plantillaDB.ambiente,
                    tipoDte: plantillaDB.tipo,
                    numeroControl: plantillaDB.numero_de_control,
                    codigoGeneracion: plantillaDB.codigo_de_generacion,
                    tipoModelo: parseInt(plantillaDB.modelo_de_factura),
                    tipoOperacion: parseInt(plantillaDB.tipo_de_transmision),
                    fecEmi: plantillaDB.fecha_y_hora_de_generacion, // Extracting date
                    horEmi: plantillaDB.horemi,
                    tipoMoneda: plantillaDB.tipomoneda,
                    tipoContingencia: plantillaDB.tipocontingencia,
                    motivoContin: plantillaDB.motivocontin
                },
                documentoRelacionado: [{
                    tipoDocumento: document[0],
                    tipoGeneracion: document[1],
                    numeroDocumento: document[2],
                    fechaEmision: document[3]
                }],
                emisor: {
                    direccion: {
                        municipio: userDB.municipio,
                        departamento: userDB.departamento,
                        complemento: userDB.direccion
                    },
                    nit: userDB.nit,
                    nrc: userDB.nrc,
                    nombre: userDB.name,
                    codActividad: userDB.codactividad,
                    descActividad: userDB.descactividad,
                    telefono: userDB.numero_de_telefono,
                    correo: userDB.correo_electronico,
                    nombreComercial: userDB.nombre_comercial,
                    tipoEstablecimiento: userDB.tipoestablecimiento,
                    codEstableMH: plantillaDB.codestablemh,
                    codEstable: plantillaDB.codestable,
                    codPuntoVentaMH: plantillaDB.codpuntoventamh,
                    codPuntoVenta: plantillaDB.codpuntoventa
                },
                receptor: {
                    codActividad: plantillaDB.re_codactividad,
                    direccion: {
                        municipio: address[1],
                        departamento: address[0],
                        complemento: address[2]
                    },
                    nrc: plantillaDB.re_nrc,
                    descActividad: plantillaDB.re_actividad_economica,
                    correo: plantillaDB.re_correo_electronico,
                    nit: plantillaDB.re_nit,
                    nombre: plantillaDB.re_name,
                    telefono: plantillaDB.re_numero_telefono,
                    nombreComercial: plantillaDB.re_numdocumento
                },
                otrosDocumentos: plantillaDB.otrosdocumentos,
                ventaTercero: plantillaDB.ventatercero,
                cuerpoDocumento: Listitems,
                resumen: {
                    condicionOperacion: plantillaDB.condicionoperacion,
                    saldoFavor: plantillaDB.saldofavor,
                    numPagoElectronico: plantillaDB.numpagoelectronico,
                    pagos: [{
                        periodo: plantillaDB.periodo,
                        plazo: plantillaDB.plazo,
                        montoPago: parseFloat(plantillaDB.montopago),
                        codigo: plantillaDB.codigo,
                        referencia: plantillaDB.referencia
                    }],
                    totalNoSuj: plantillaDB.totalnosuj,
                    tributos: [{
                        codigo: tributocf[0],
                        descripcion: tributocf[1],
                        valor: parseFloat(tributocf[2])
                    }],
                    totalLetras: plantillaDB.cantidad_en_letras,
                    totalExenta: plantillaDB.totalexenta,
                    subTotalVentas: parseFloat(plantillaDB.subtotalventas),
                    totalGravada: parseFloat(plantillaDB.totalagravada),
                    montoTotalOperacion: parseFloat(plantillaDB.montototaloperacion),
                    descuNoSuj: plantillaDB.descunosuj,
                    descuExenta: plantillaDB.descuexenta,
                    descuGravada: plantillaDB.descugravada,
                    porcentajeDescuento: plantillaDB.porcentajedescuento,
                    totalDescu: parseFloat(plantillaDB.totalnogravado),
                    subTotal: parseFloat(plantillaDB.subtotal),
                    ivaRete1: parseFloat(plantillaDB.iva_retenido),
                    reteRenta: parseFloat(plantillaDB.retencion_de_renta),
                    totalNoGravado: plantillaDB.totalnogravado,
                    totalPagar: parseFloat(plantillaDB.total_a_pagar),
                    ivaPerci1: parseFloat(plantillaDB.iva_percibido),

                },
                extension: {
                    docuEntrega: plantillaDB.documento_e,
                    nombRecibe: plantillaDB.documento_receptor,
                    observaciones: plantillaDB.observaciones,
                    placaVehiculo: plantillaDB.placavehiculo,
                    nombEntrega: plantillaDB.documento_r,
                    docuRecibe: plantillaDB.documento_receptor
                },
                apendice: plantillaDB.apendice
            };
        } else if (plantillaDB.tipo === "06") {

            const Listitems = itemsDB.map((item, index) => {
                const newItem = {
                    codTributo: item.codtributo,
                    descripcion: item.descripcion,
                    uniMedida: item.unimedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numItem: index + 1, // Using the index for numbering
                    tributos: null,
                    noGravado: item.nogravado,
                    psv: item.psv,
                    montoDescu: item.montodescu,
                    numeroDocumento: item.numerodocumento,
                    precioUni: item.preciouni,
                    ventaGravada: item.ventagravada,
                    ventaExenta: item.ventaexenta,
                    ventaNoSuj: item.ventanosuj,
                    tipoItem: item.tipoitem,
                };
                return newItem;
            });


            const address = plantillaDB.re_direccion.split("|");
            const tributocf = plantillaDB.tributocf.split("|");
            const document = plantillaDB.documentorelacionado.split("|");

            var json = {
                identificacion: {
                    version: parseInt(plantillaDB.version),
                    ambiente: plantillaDB.ambiente,
                    tipoDte: plantillaDB.tipo,
                    numeroControl: plantillaDB.numero_de_control,
                    codigoGeneracion: plantillaDB.codigo_de_generacion,
                    tipoModelo: parseInt(plantillaDB.modelo_de_factura),
                    tipoOperacion: parseInt(plantillaDB.tipo_de_transmision),
                    fecEmi: plantillaDB.fecha_y_hora_de_generacion, // Extracting date
                    horEmi: plantillaDB.horemi,
                    tipoMoneda: plantillaDB.tipomoneda,
                    tipoContingencia: plantillaDB.tipocontingencia,
                    motivoContin: plantillaDB.motivocontin
                },
                documentoRelacionado: [{
                    tipoDocumento: document[0],
                    tipoGeneracion: document[1],
                    numeroDocumento: document[2],
                    fechaEmision: document[3]
                }],
                emisor: {
                    direccion: {
                        municipio: userDB.municipio,
                        departamento: userDB.departamento,
                        complemento: userDB.direccion
                    },
                    nit: userDB.nit,
                    nrc: userDB.nrc,
                    nombre: userDB.name,
                    codActividad: userDB.codactividad,
                    descActividad: userDB.descactividad,
                    telefono: userDB.numero_de_telefono,
                    correo: userDB.correo_electronico,
                    nombreComercial: userDB.nombre_comercial,
                    tipoEstablecimiento: userDB.tipoestablecimiento,
                    codEstableMH: plantillaDB.codestablemh,
                    codEstable: plantillaDB.codestable,
                    codPuntoVentaMH: plantillaDB.codpuntoventamh,
                    codPuntoVenta: plantillaDB.codpuntoventa
                },
                receptor: {
                    codActividad: plantillaDB.re_codactividad,
                    direccion: {
                        municipio: address[1],
                        departamento: address[0],
                        complemento: address[2]
                    },
                    nrc: plantillaDB.re_nrc,
                    descActividad: plantillaDB.re_actividad_economica,
                    correo: plantillaDB.re_correo_electronico,
                    nit: plantillaDB.re_nit,
                    nombre: plantillaDB.re_name,
                    telefono: plantillaDB.re_numero_telefono,
                    nombreComercial: plantillaDB.re_numdocumento
                },
                otrosDocumentos: plantillaDB.otrosdocumentos,
                ventaTercero: plantillaDB.ventatercero,
                cuerpoDocumento: Listitems,
                resumen: {
                    condicionOperacion: plantillaDB.condicionoperacion,
                    saldoFavor: plantillaDB.saldofavor,
                    numPagoElectronico: plantillaDB.numpagoelectronico,
                    pagos: [{
                        periodo: plantillaDB.periodo,
                        plazo: plantillaDB.plazo,
                        montoPago: parseFloat(plantillaDB.montopago),
                        codigo: plantillaDB.codigo,
                        referencia: plantillaDB.referencia
                    }],
                    totalNoSuj: plantillaDB.totalnosuj,
                    tributos: [{
                        codigo: tributocf[0],
                        descripcion: tributocf[1],
                        valor: parseFloat(tributocf[2])
                    }],
                    totalLetras: plantillaDB.cantidad_en_letras,
                    totalExenta: plantillaDB.totalexenta,
                    subTotalVentas: parseFloat(plantillaDB.subtotalventas),
                    totalGravada: parseFloat(plantillaDB.totalagravada),
                    montoTotalOperacion: parseFloat(plantillaDB.montototaloperacion),
                    descuNoSuj: plantillaDB.descunosuj,
                    descuExenta: plantillaDB.descuexenta,
                    descuGravada: plantillaDB.descugravada,
                    porcentajeDescuento: plantillaDB.porcentajedescuento,
                    totalDescu: parseFloat(plantillaDB.totalnogravado),
                    subTotal: parseFloat(plantillaDB.subtotal),
                    ivaRete1: parseFloat(plantillaDB.iva_retenido),
                    reteRenta: parseFloat(plantillaDB.retencion_de_renta),
                    totalNoGravado: plantillaDB.totalnogravado,
                    totalPagar: parseFloat(plantillaDB.total_a_pagar),
                    ivaPerci1: parseFloat(plantillaDB.iva_percibido),

                },
                extension: {
                    docuEntrega: plantillaDB.documento_e,
                    nombRecibe: plantillaDB.documento_receptor,
                    observaciones: plantillaDB.observaciones,
                    placaVehiculo: plantillaDB.placavehiculo,
                    nombEntrega: plantillaDB.documento_r,
                    docuRecibe: plantillaDB.documento_receptor
                },
                apendice: plantillaDB.apendice
            };
        }

        /* CREATING THE JSON TO SEND */
        // Example user and plantillaDB data
        const user = { name: userDB.name };
        const plantilla = { re_name: 'Factura Electronica' };

        /* Vars for the json */
        const jsonContent = JSON.stringify(json, null, 2); // Replace `yourJsonObject` with the actual JSON data you want to send
        const jsonPath = path.join(__dirname, `${user.name} ${plantilla.re_name}.json`);



        // Save the JSON file locally
        fs.writeFileSync(jsonPath, jsonContent);

        // Create the document PDF
        const pdfPath = path.join(__dirname, `${user.name} ${plantilla.re_name}.pdf`);

        const pdfDoc = new PDFDocument({
            size: 'A4',
            margins: { top: 20, bottom: 20, left: 20, right: 20 }
        });
        console.log('mail:', plantillaDB.re_correo_electronico);
        pdfDoc.pipe(fs.createWriteStream(pdfPath))
            .on('finish', async() => {
                // Email configuration
                if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3) {
                    const mailOptions = {
                        from: 'mysoftwaresv@gmail.com',
                        to: plantillaDB.re_correo_electronico,
                        subject: `DTE de parte de ${user.name}`,
                        html: '<h3>¡DTE facturacion electronica MySoftwareSV!</h3>',
                        attachments: [{
                                filename: 'DTE.pdf',
                                path: pdfPath,
                                encoding: 'base64'
                            },
                            {
                                filename: 'DTE.json', // Name of the JSON file
                                path: jsonPath, // Path to the JSON file
                                encoding: 'base64'
                            }
                        ]
                    };
                } else if (userDB.id === 5 || userDB.id === 7) {
                    const mailOptions = {
                        from: 'mysoftwaresv@gmail.com',
                        to: plantillaDB.re_correo_electronico,
                        subject: `DTE de parte de ${user.name}`,
                        html: '<h3>¡DTE facturacion electronica MySoftwareSV!</h3>',
                        attachments: [{
                                filename: 'DTE.pdf',
                                path: pdfPath,
                                encoding: 'base64'
                            },
                            {
                                filename: 'DTE.json', // Name of the JSON file
                                path: jsonPath, // Path to the JSON file
                                encoding: 'base64'
                            }
                        ]
                    };
                } else if (userDB.id === 6) {
                    const mailOptions = {
                        from: 'renovare23sv@gmail.com',
                        to: plantillaDB.re_correo_electronico,
                        subject: `DTE de parte de ${user.name}`,
                        html: '<h3>¡DTE facturacion electronica Renovare!</h3>',
                        attachments: [{
                                filename: 'DTE.pdf',
                                path: pdfPath,
                                encoding: 'base64'
                            },
                            {
                                filename: 'DTE.json', // Name of the JSON file
                                path: jsonPath, // Path to the JSON file
                                encoding: 'base64'
                            }
                        ]
                    };
                } else {
                    const mailOptions = {
                        from: 'mysoftwaresv@gmail.com',
                        to: plantillaDB.re_correo_electronico,
                        subject: `DTE de parte de ${user.name}`,
                        html: '<h3>¡DTE facturacion electronica MySoftwareSV!</h3>',
                        attachments: [{
                                filename: 'DTE.pdf',
                                path: pdfPath,
                                encoding: 'base64'
                            },
                            {
                                filename: 'DTE.json', // Name of the JSON file
                                path: jsonPath, // Path to the JSON file
                                encoding: 'base64'
                            }
                        ]
                    };
                }
                const mailOptions = {
                    from: 'mysoftwaresv@gmail.com',
                    to: plantillaDB.re_correo_electronico,
                    subject: `DTE de parte de ${user.name}`,
                    html: '<h3>¡DTE facturacion electronica MySoftwareSV!</h3>',
                    attachments: [{
                            filename: 'DTE.pdf',
                            path: pdfPath,
                            encoding: 'base64'
                        },
                        {
                            filename: 'DTE.json', // Name of the JSON file
                            path: jsonPath, // Path to the JSON file
                            encoding: 'base64'
                        }
                    ]
                };


                if (userDB.id === 6) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'renovare23sv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });
                } else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });
                }

                // Send email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                        // Delete the files after sending the email
                        fs.unlinkSync(jsonPath);
                        fs.unlinkSync(pdfPath);
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

        // Add Doctor's information
        pdfDoc.font('src/assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');
        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3 || userDB.id === 5 || userDB.id === 7) {
            const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
            const newname = `${name1} ${name2} ${name3} ${name4}`;

            pdfDoc.fontSize(18).fillColor('#1E3256')

            .text(`Dr. ${newname}`, 30, yscale, { align: 'left' })
        } else {
            /* align in the middle of the left and center */
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`${userDB.name}`, 0, yscale, { align: 'center', width: 300, continued: false })
        }

        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale + 30, { align: 'left' })
                .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' })
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });
        } else {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MEDICOS', 70, yscale + 30, { align: 'left' })
                /* .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' }) 
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });*/
        }
        // QR code and codes section (mock content for simplicity)
        /* BORDER BLACK */
        /* pdfDoc.rect(1300, 80, 150, 150).stroke('#000'); */

        const generateQRCodeImage = async(text, outputPath) => {
            try {
                await QRCode.toFile(outputPath, text, {
                    color: {
                        dark: '#000000', // Black dots
                        light: '#FFFFFF' // White background
                    }
                });
                console.log('QR code image generated and saved to', outputPath);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        // Generate and save the QR code image
        generateQRCodeImage(`https://admin.factura.gob.sv/consultaPublica?ambiente=${userDB.ambiente}&codGen=${plantillaDB.codigo_de_generacion}&fechaEmi=${plantillaDB.fecha_y_hora_de_generacion}`, 'qrcode.png');
        pdfDoc.rect(280, yscale, 100, 100).stroke('#000'); // Background box for QR code
        await delay(3000);
        const bgqr = path.join(__dirname, '../../qrcode.png');
        pdfDoc.image(bgqr, 280, yscale, { width: 100, height: 100 });
        pdfDoc.fontSize(10).font('Helvetica-Bold').text('Código de generación:', 400, yscale)
            .font('Helvetica').text(`${plantillaDB.codigo_de_generacion}`, 400, yscale + 15)
            .font('Helvetica-Bold').text('Numero de control:', 400, yscale + 40)
            .font('Helvetica').text(`${plantillaDB.numero_de_control}`, 400, yscale + 55)
            .font('Helvetica-Bold').text('Sello de recepción:', 400, yscale + 70)
            .font('Helvetica').text(`${plantillaDB.sello_de_recepcion}`, 400, yscale + 85)

        /* An line to divide */

        pdfDoc.moveTo(30, yscale + 115).lineTo(550, yscale + 115).stroke('#000');

        // Model and transmission info
        pdfDoc.font('Helvetica-Bold').text('Modelo de facturación', 20, yscale + 135)
            .text('Fecha y hora de generacion', 230, yscale + 135)
            .text('Tipo de transmisión', 480, yscale + 135);

        pdfDoc.font('Helvetica').text('Previo', 20, yscale + 150)
            .text(`${plantillaDB.fecha_y_hora_de_generacion} - ${plantillaDB.horemi}`, 250, yscale + 150)
            .text('Normal', 540, yscale + 150);

        /* text bold */


        // Add sender and receiver information
        const infoX = 40;
        const infoY = 270;
        /* rectangle with radius rounded */
        pdfDoc.roundedRect(infoX, infoY, 250, 150, 10).fill('#EAEAEA').stroke('#000'); // Background box for sender
        pdfDoc.roundedRect(infoX + 270, infoY, 250, 150, 10).fill('#EAEAEA').stroke('#000'); // Background box for receiver

        pdfDoc.fontSize(10).font('Helvetica-Bold').fillColor('#1E3256')
            .text('EMISOR', infoX + 10, infoY + 8)


        const truncateText = (text, maxLength) => {
            if (text === null) {
                return '';

            }
            if (text.length > maxLength) {
                return text.slice(0, maxLength - 3) + '...';
            }
            return text;
        };

        console.log('userDB', userDB.name, userDB.direccion);

        const name = userDB.name.split(" ");
        const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
        const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
        const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
        const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
        const newname = `${name1} ${name2} ${name3} ${name4}`;

        const truncatedNombreORazonSocial = truncateText(newname, 20);
        const truncatedDireccion = truncateText(userDB.direccion, 37);

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


        pdfDoc.fontSize(10).fillColor('#1E3256')
            .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 10, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocial, infoX + 122, infoY + 25)
            .font('Helvetica-Bold').text('NIT:', infoX + 10, infoY + 40).font('Helvetica').text(`${userDB.nit}`, infoX + 30, infoY + 40)
            .font('Helvetica-Bold').text('NRC:', infoX + 10, infoY + 55).font('Helvetica').text(`${userDB.nrc}`, infoX + 37, infoY + 55)
            .font('Helvetica-Bold').text('Actividad económica:', infoX + 10, infoY + 70).font('Helvetica').text('Servicios médicos', infoX + 115, infoY + 70) /* UQMEMADO SERVICIOS MEDICOS */
            .font('Helvetica-Bold').text('Dirección:', infoX + 10, infoY + 85).font('Helvetica').text(truncatedDireccion, infoX + 60, infoY + 85)
            .font('Helvetica-Bold').text('Correo electrónico:', infoX + 10, infoY + 100).font('Helvetica').text(`${userDB.correo_electronico}`, infoX + 104, infoY + 100)
            .font('Helvetica-Bold').text('Nombre comercial:', infoX + 10, infoY + 115).font('Helvetica').text(`${userDB.nombre_comercial}`, infoX + 102, infoY + 115)
            .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 10, infoY + 130).font('Helvetica').text(`${userDB.tipoestablecimiento}`, infoX + 128, infoY + 130);


        console.log('plantillaDB', plantillaDB.re_name, plantillaDB.re_direccion);
        const truncatedNombreORazonSocialReceptor = truncateText(plantillaDB.re_name, 25);
        const truncatedDireccionReceptor = truncateText(plantillaDB.re_direccion, 37);

        pdfDoc.font('Helvetica-Bold').text('RECEPTOR', infoX + 280, infoY + 8)

        if (plantillaDB.tipo === "01") {
            let re_numdocumentostring = 'DOC';
            if (plantillaDB.re_numdocumento.includes('-')) {
                re_numdocumentostring = 'DUI: ';
            } else if (plantillaDB.re_numdocumento.includes('-') === false) {
                re_numdocumentostring = 'NRC: ';
            }

            pdfDoc.fontSize(10).fillColor('#1E3256')
                .fontSize(10).font('Helvetica-Bold').text('Nombre o razón social:', infoX + 280, infoY + 25).font('Helvetica').fontSize(10).text(truncatedNombreORazonSocialReceptor, infoX + 392, infoY + 25)
                .font('Helvetica-Bold').text(re_numdocumentostring, infoX + 280, infoY + 40).font('Helvetica').text(`${plantillaDB.re_numdocumento}`, infoX + 301, infoY + 40)
                .font('Helvetica-Bold').text('NRC:', infoX + 280, infoY + 55).font('Helvetica').text('', infoX + 307, infoY + 55)
                .font('Helvetica-Bold').text('Actividad económica:', infoX + 280, infoY + 70).font('Helvetica').text('', infoX + 385, infoY + 70)
                .font('Helvetica-Bold').text('Dirección:', infoX + 280, infoY + 85).font('Helvetica').text(truncatedDireccionReceptor, infoX + 330, infoY + 85)
                .font('Helvetica-Bold').text('Correo electrónico:', infoX + 280, infoY + 100).font('Helvetica').text(`${plantillaDB.re_correo_electronico}`, infoX + 374, infoY + 100)
                .font('Helvetica-Bold').text('Nombre comercial:', infoX + 280, infoY + 115).font('Helvetica').text('', infoX + 372, infoY + 115)
                .font('Helvetica-Bold').text('Tipo de establecimiento:', infoX + 280, infoY + 130).font('Helvetica').text('', infoX + 398, infoY + 130);

        } else if (plantillaDB.tipo === "03") {
            console.log(plantillaDB.re_numdocumento)
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

        } else if (plantillaDB.tipo === "14") {
            let re_numdocumentostring = 'DOC';
            /* i have my address like 01  02|08|direccion and i just need direccion*/
            const UserAddress = plantillaDB.re_direccion.split("|");
            const truncatedDireccionReceptor = truncateText(UserAddress[2], 37);


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

        } else if (plantillaDB.tipo === "06") {
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
        var ivaC = plantillaDB.subtotalventas * 0.13
        var ivaper = Number(plantillaDB.iva_percibido)

        if (plantillaDB.tipo === "03") {
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: ${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaC.toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${ivaper.toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${plantillaDB.retencion_de_renta}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: ${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${plantillaDB.iva_percibido}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $${plantillaDB.iva_percibido}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${plantillaDB.retencion_de_renta}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "14") {
            if (plantillaDB.total_agravada === null) {
                plantillaDB.total_agravada = 0;
            }
            if (plantillaDB.porcentajedescuento === null) {
                plantillaDB.porcentajedescuento = 0;

            }
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${plantillaDB.subtotal}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaC.toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada }`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotal}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $${ivaC.toFixed(2)}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${plantillaDB.retencion_de_renta}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "05") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaC.toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${plantillaDB.iva_percibido}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${plantillaDB.retencion_de_renta}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${plantillaDB.montototaloperacion}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "06") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${plantillaDB.subtotalventas}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaC.toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${plantillaDB.total_agravada}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${plantillaDB.subtotalventas}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${plantillaDB.porcentajedescuento}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $${plantillaDB.iva_percibido}`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido: $${plantillaDB.iva_retenido}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta: $${plantillaDB.retencion_de_renta}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0', 300, y + 170, { align: 'right' })
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
        console.error('Error:', error);
        // Handle error if something goes wrong
        return false;
    }
};

module.exports = { sendMail };
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
                        municipio: plantillaDB.municipio,
                        departamento: plantillaDB.departamento,
                        complemento: plantillaDB.complemento
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
                    totalGravada: parseFloat(plantillaDB.subtotalventas),
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
        } else if (plantillaDB.tipo === "08") {

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
                        municipio: plantillaDB.municipio,
                        departamento: plantillaDB.departamento,
                        complemento: plantillaDB.complemento
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
                    totalGravada: parseFloat(plantillaDB.subtotalventas),
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
                var mailOptions = {}
                    // Email configuration
                if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3) {
                    mailOptions = {
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
                } else if (userDB.id === 6  || userDB.id === 10 ) {
                    mailOptions = {
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
                } else if (userDB.id === 4 || userDB.id === 5 || userDB.id === 8 || userDB.id === 9) {
                    mailOptions = {
                        from: 'Hmclinicmail@gmail.com',
                        to: plantillaDB.re_correo_electronico,
                        subject: `DTE de parte de ${user.name}`,
                        html: '<h3>¡DTE facturacion electronica!</h3>',
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
                } else if (userDB.id === 7 || userDB.id === 11 || userDB.id === 12) {
                    mailOptions = {
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
                } else if (userDB.id === 4 || userDB.id === 13 || userDB.id === 14) {
                    mailOptions = {
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
                } else if (userDB.id === 19 || userDB.id === 20) {
                    mailOptions = {
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
                } else if (userDB.id === 21 || userDB.id === 22) {
                    mailOptions = {
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
                } else if (userDB.id === 16 || userDB.id === 17) {
                    mailOptions = {
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
                } else if (userDB.id === 15  || userDB.id === 18) {
                    mailOptions = {
                        from: 'luiscerritoscp@gmail.com',
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
                }  else if (userDB.id === 23 || userDB.id === 24 || userDB.id === 25 || userDB.id === 26 || userDB.id === 27|| userDB.id === 28 || userDB.id === 29 || userDB.id === 30  || userDB.id === 31 || userDB.id === 32 || userDB.id === 33 || userDB.id === 34 || userDB.id === 35 || userDB.id === 36) {
                    mailOptions = {
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
                if (userDB.id === 6 || userDB.id === 10) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'renovare23sv@gmail.com',
                            pass: 'xgaw crnq hxyq fgwi'
                        }
                    });

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
                } else if (userDB.id === 4 || userDB.id === 5 || userDB.id === 8 || userDB.id === 9) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'Hmclinicmail@gmail.com',
                            pass: 'nlsf izzt siiy sxnr'
                        }
                    });

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
                } else if (userDB.id === 7) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });

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
                } else if (userDB.id === 13 || userDB.id === 14) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'Icpdr.revelo11@gmail.com',
                            pass: 'fhzh fybu dprt jxob'
                        }
                    });

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
                }
                 else if (userDB.id === 19 || userDB.id === 20) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });

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
                }
                 else if (userDB.id === 21 || userDB.id === 22) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });

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
                }else if (userDB.id === 15 || userDB.id === 18) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'luiscerritoscp@gmail.com',
                            pass: 'ocrk xaps iubo yzee'
                        }
                    });

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
                }else if (userDB.id === 23 || userDB.id === 24 || userDB.id === 25 || userDB.id === 26|| userDB.id === 27 || userDB.id === 28 || userDB.id === 29 || userDB.id === 30  || userDB.id === 31 || userDB.id === 32 || userDB.id === 33 || userDB.id === 34 || userDB.id === 35 || userDB.id === 36) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });

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
                }
                else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mysoftwaresv@gmail.com',
                            pass: 'ajbh eozh iltf oinf'
                        }
                    });

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
                }


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

        }else if (plantillaDB.tipo === "08") {
            pdfDoc.fontSize(17).fillColor('#1E3256').text('COMPROBANTE DE LIQUIDACIÓN', { align: 'center' }); 
        }
        const yscale = 70;

        // Add Doctor's information
        pdfDoc.font('src/assets/fonts/Dancing_Script/static/DancingScript-Regular.ttf');
        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3 || userDB.id === 5 || userDB.id === 8 || userDB.id === 15 || userDB.id === 18 || userDB.id === 19 || userDB.id === 20 || userDB.id === 23 || userDB.id === 24 || userDB.id === 25 || userDB.id === 26 || userDB.id === 29 || userDB.id === 30  || userDB.id === 31 || userDB.id === 32 || userDB.id === 33 || userDB.id === 34 || userDB.id === 35 || userDB.id === 36) {
            const name = userDB.name.split(" ");
            const name1 = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase();
            const name2 = name[1].charAt(0).toUpperCase() + name[1].slice(1).toLowerCase();
            const name3 = name[2].charAt(0).toUpperCase() + name[2].slice(1).toLowerCase();
            const name4 = name[3].charAt(0).toUpperCase() + name[3].slice(1).toLowerCase();
            const newname = `${name1} ${name2} ${name3} ${name4}`;

            pdfDoc.fontSize(18).fillColor('#1E3256')

            .text(`Dr. ${newname}`, 30, yscale, { align: 'left' })
        } else if (userDB.id === 7  || userDB.id === 12 || userDB.id === 21 || userDB.id === 22 || userDB.id === 27 || userDB.id === 28) {

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
        }else if (userDB.id === 13 || userDB.id === 14) {
            pdfDoc.fontSize(13).fillColor('#1E3256')
                .text(`${userDB.name}`, 0, yscale + 30, { align: 'center', width: 300, continued: false })

        } else {
            /* align in the middle of the left and center */
            pdfDoc.fontSize(18).fillColor('#1E3256')
                .text(`${userDB.name}`, 0, yscale, { align: 'center', width: 300, continued: false })
        }

        if (userDB.id === 1 || userDB.id === 2 || userDB.id === 3) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MÉDICOS', 70, yscale + 30, { align: 'left' })
                .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' })
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });
        } else if (userDB.id === 6 || userDB.id === 10) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(13).text('Servicios de sauna y estéticos', 62, yscale + 30, { align: 'left' })

        } else if ( userDB.id === 11) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MÉDICOS', 77, yscale + 30, { align: 'left' })
                .fontSize(17).text('Licenciada en Anestesiología ', 42, yscale + 50, { align: 'left' })
                .fontSize(15).text('e Inhaloterapia', 100, yscale + 70, { align: 'left' })
                .fontSize(15).text('J.V.P.M 674', 108, yscale + 92, { align: 'left' });
        }
         else if (userDB.id === 4 || userDB.id === 9) {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('CLÍNICAS MÉDICAS', 70, yscale + 30, { align: 'left' })

        }else if (userDB.id === 14 || userDB.id === 13) {
                                /* adding img */
                            const logo = path.join(__dirname, '../assets/imgs/icplogo.png');
                            pdfDoc.image(logo, 20, yscale - 45, { width: 130, height: 50 });
        
                    pdfDoc.fontSize(12).font('Helvetica').fillColor('#1E3256')
                        .fontSize(12).text('CLÍNICA MÉDICA', 100, yscale +50, { align: 'left' })
        
        }else if (userDB.id === 27 || userDB.id === 28) {
                    /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/Calderon.png');
            pdfDoc.image(logo, 75, yscale - 13, { width: 140, height: 120 });

                }else if (userDB.id === 16 || userDB.id === 17) {
                    /* adding img */
                    const logo = path.join(__dirname, '../assets/imgs/rinologo.png');
                    pdfDoc.image(logo, 40, yscale - 10, { width: 210, height: 120 });
        
                }
                else if (userDB.id === 7 || userDB.id === 12) {
            /* adding img */
            const logo = path.join(__dirname, '../assets/imgs/osegueda.png');
            pdfDoc.image(logo, 55, yscale - 60, { width: 190, height: 190 });

            /* adding number 2563-9606 // 2207-4940 */
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('2563-9606', 50, yscale + 90, { align: 'left' })
                .fontSize(15).text('2207-4940', 180, yscale + 90, { align: 'left' })

        }else if (userDB.id === 21 || userDB.id === 22) {
                    /* adding img */
                    const logo = path.join(__dirname, '../assets/imgs/koala.png');
                    pdfDoc.image(logo, 40, yscale - 10, { width: 210, height: 120 });
                    /* adding number 2563-9606 // 2207-4940 */
                        pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(9).text('Factura por cuenta de:', 30, yscale + 100, { align: 'left' })

                } else {
            pdfDoc.fontSize(10).font('Helvetica').fillColor('#1E3256')
                .fontSize(15).text('SERVICIOS MÉDICOS', 70, yscale + 30, { align: 'left' })
                /* .fontSize(17).text('Anestesiólogo Internista', 55, yscale + 50, { align: 'left' }) 
                .fontSize(15).text('J.V.P.M 8059', 100, yscale + 70, { align: 'left' });*/
        }
        // QR code and codes section (mock content for simplicity)
        /* BORDER BLACK */
        /* pdfDoc.rect(1300, 80, 150, 150).stroke('#000'); */

        const generateQRCodeImage = async (text, outputPath) => {
            try {
                // Log the exact text used to generate the QR so we can debug spaces/%20
                console.log('QR content before generating:', text);

                // Ensure outputPath is absolute and inside project so later reads use same file
                const outPath = path.isAbsolute(outputPath) ? outputPath : path.join(__dirname, outputPath);

                await QRCode.toFile(outPath, text, {
                    color: {
                        dark: '#000000', // Black dots
                        light: '#FFFFFF' // White background
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
        // Generate and save the QR code image (use encodeURIComponent for URL params,
        // await generation and use same absolute path when reading)
        const qrPath = path.join(__dirname, '../../qrcode.png');
        const qrText = `https://admin.factura.gob.sv/consultaPublica?ambiente=${encodeURIComponent(userDB.ambiente)}&codGen=${encodeURIComponent(plantillaDB.codigo_de_generacion)}&fechaEmi=${encodeURIComponent(plantillaDB.fecha_y_hora_de_generacion)}`;
        console.log('Generating QR with text:', qrText);
        try {
            await generateQRCodeImage(qrText, qrPath);
        } catch (err) {
            console.error('Failed to generate QR image:', err);
        }

        pdfDoc.rect(280, yscale, 100, 100).stroke('#000'); // Background box for QR code
        // small delay to ensure file system visibility (should not be necessary because we awaited)
        await delay(200);
        const bgqr = qrPath;
        try {
            pdfDoc.image(bgqr, 280, yscale, { width: 100, height: 100 });
        } catch (err) {
            console.error('Error adding QR image to PDF:', err, 'path:', bgqr);
        }
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
            if (userDB.id === 10 || userDB.id === 6) actividad = 'Servicios de sauna/estéticos';
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

        /* text bold */


        // Add sender and receiver information
        const infoX = 40;
        const infoY = 270;
        /* rectangle with radius rounded */


        const infoBlockOpts = {
            width: 250,
            paddingX: 10,
            paddingTop: 8,
            paddingBottom: 10,
            titleFontSize: 10,
            labelFontSize: 9,
            valueFontSize: 9,
            labelWidth: 105,
            rowGap: 3,
            titleGap: 6,
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

        // Si no cabe, saltar a nueva página
        const blocksBottomNeeded = infoY + maxBlockHeight + 40;
        const blocksY = (blocksBottomNeeded > 770) ? 50 : infoY;
        if (blocksBottomNeeded > 770) {
            pdfDoc.addPage();
        }

        drawInfoBlock(pdfDoc, 'EMISOR', infoX, blocksY, infoBlockOpts.width, emisorHeight, emisorRows, infoBlockOpts);
        drawInfoBlock(pdfDoc, 'RECEPTOR', infoX + 270, blocksY, infoBlockOpts.width, receptorHeight, receptorRows, infoBlockOpts);

        const blocksBottomY = blocksY + maxBlockHeight;

        // Add services section (debajo del bloque más alto)
        pdfDoc.fontSize(16).fillColor('#009A9A').text('SERVICIOS', 250, blocksBottomY + 10, { underline: true });

        const servicesY = blocksBottomY + 40;
        const servicesX = 20;

        pdfDoc
            .fontSize(10)
            .fillColor('#000000')
            .text('N°', servicesX, servicesY)
            .text('Cant.', servicesX + 20, servicesY)
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

        // Ajuste: envolver descripción y calcular altura dinámica por fila
        const descColX = servicesX + 110;
        const descColWidth = 120; // ancho de la columna de descripción
        const baseRowHeight = 20; // altura base por fila

        itemsDB.forEach(item => {
            const desc = (item.descripcion || '').toString();
            const descHeight = pdfDoc.heightOfString(desc, { width: descColWidth, align: 'left' });
            const rowHeight = Math.max(baseRowHeight, Math.ceil(descHeight / baseRowHeight) * baseRowHeight);

            // Saltar de página si la fila no cabe completa
            if (y + rowHeight > 770) {
                pdfDoc.addPage();
                y = 20;
            }

            // Dibujar columnas
            pdfDoc
                .text(numcounter, servicesX, y)
                .text(item.cantidad, servicesX + 20, y)
                .text(item.codigo, servicesX + 70, y);

            // Descripción envuelta dentro del ancho de columna
            pdfDoc.text(desc, descColX, y, { width: descColWidth, align: 'left' });

            // Resto de columnas (mantener posiciones existentes)
            pdfDoc
                .text(item.preciouni, servicesX + 240, y)
                .text(item.montodescu, servicesX + 290, y)
                .text(item.ventanosuj, servicesX + 350, y)
                .text((parseFloat(item.preciouni) * parseFloat(item.cantidad)).toFixed(2), servicesX + 410, y)
                .text(item.ventaexenta, servicesX + 470, y);

            numcounter += 1;
            y += rowHeight; // avanzar según altura real de la fila
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
            // Handle null or undefined text
            if (!text) {
                text = '';
            }
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

        // Example usage - handle null/undefined observaciones
        funcenter(plantillaDB.observaciones || '', y + 55, 30);
        var ivaper = Number(plantillaDB.iva_percibido)

        if (plantillaDB.tipo === "03") {
                        const iva = plantillaDB.tributocf.split('|');
            const ivaCodigo = iva[0];
            const ivaDescripcion = iva[1];
            const ivaValor = iva[2];


            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: ${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "01") {
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: ${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(plantillaDB.iva_percibido).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "14") {
            if (plantillaDB.total_agravada === null) {
                plantillaDB.total_agravada = 0;
            }
            if (plantillaDB.porcentajedescuento === null) {
                plantillaDB.porcentajedescuento = 0;

            }
            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaper.toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada || 0).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotal).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento || 0).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "05") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaper.toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "06") {

            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${ivaper.toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text('Otros montos no afectados: $0.00', 300, y + 170, { align: 'right' })
                .text(`Monto total de operación: $${parseFloat(plantillaDB.montototaloperacion).toFixed(2)}`, 300, y + 190, { align: 'right' });
        } else if (plantillaDB.tipo === "08") {
                        const iva = plantillaDB.tributocf.split('|');
            const ivaCodigo = iva[0];
            const ivaDescripcion = iva[1];
            const ivaValor = iva[2];


            pdfDoc.fontSize(14).fillColor('#1E3256').text(`Subtotal: ${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 10, { align: 'right' })
                .text(`Impuesto valor agregado 13%: $${parseFloat(ivaValor).toFixed(2)}`, 300, y + 90, { align: 'right' })
                .text(`Total gravado: $${parseFloat(plantillaDB.total_agravada).toFixed(2)}`, 300, y + 50, { align: 'right' })
                .text(`Sumatoria de ventas: $${parseFloat(plantillaDB.subtotalventas).toFixed(2)}`, 300, y + 70, { align: 'right' })
                .text(`Monto de descuento: $${parseFloat(plantillaDB.porcentajedescuento).toFixed(2)}`, 300, y + 30, { align: 'right' })
                .text(`IVA recibido: $0.00`, 300, y + 110, { align: 'right' })
                .text(`IVA retenido 1%: $${parseFloat(plantillaDB.iva_retenido).toFixed(2)}`, 300, y + 130, { align: 'right' })
                .text(`Retención de renta 10%: $${parseFloat(plantillaDB.retencion_de_renta).toFixed(2)}`, 300, y + 150, { align: 'right' })
                .text(`Otros montos no afectados: $0.00`, 300, y + 170, { align: 'right' })
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
        console.error('Error:', error);
        // Handle error if something goes wrong
        return false;
    }
};

module.exports = { sendMail };
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const cratecompra = async(req, res) => {
    console.log('create compras');
    const id_emisor = req.headers.id_emisor;
    const plantilla = req.body;
    var JsontoDB = {};
    if (plantilla.identificacion.tipoDte === "03") {

        JsontoDB = {
            /* identification */
            version: plantilla.identificacion.version,
            ambiente: plantilla.identificacion.ambiente,
            tipo: plantilla.identificacion.tipoDte,
            numero_de_control: plantilla.identificacion.numeroControl,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoOperacion,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi,
            horemi: plantilla.identificacion.horEmi,
            tipomoneda: plantilla.identificacion.tipoMoneda,
            tipocontingencia: plantilla.identificacion.tipoContingencia,
            motivocontin: plantilla.identificacion.motivoContin,
            /* --------------------------------------------------------- */
            /* DOCUMENTO RELACIONADOS */
            documentorelacionado: plantilla.documentoRelacionado,
            /* --------------------------------------------------------- */
            /* EMISOR INFO IN TABLE USERS*/
            codestablemh: plantilla.emisor.codEstableMH,
            codestable: plantilla.emisor.codEstable,
            codpuntoventamh: plantilla.emisor.codPuntoVentaMH,
            codpuntoventa: plantilla.emisor.codPuntoVenta,
            /* --------------------------------------------------------- */
            /* RECEPTOR */

            re_codactividad: plantilla.receptor.codActividad,
            re_direccion: plantilla.receptor.direccion.departamento + "|" + plantilla.receptor.direccion.municipio + "|" + plantilla.receptor.direccion.complemento,
            re_nit: plantilla.receptor.nit,
            re_nrc: plantilla.receptor.nrc,
            re_actividad_economica: plantilla.receptor.descActividad,
            re_correo_electronico: plantilla.receptor.correo,
            re_tipodocumento: plantilla.receptor.tipoDocumento,
            re_name: plantilla.receptor.nombre,
            re_numero_telefono: plantilla.receptor.telefono,
            re_numdocumento: plantilla.receptor.nombreComercial,

            /* --------------------------------------------------------- */
            /* OTROS DOCUMENTOS */
            otrosdocumentos: plantilla.otrosDocumentos,
            /* --------------------------------------------------------- */
            ventatercero: plantilla.ventaTercero,
            /* --------------------------------------------------------- */
            /* ITEMS */
            /* --------------------------------------------------------- */
            /* RESUMEN */
            condicionoperacion: plantilla.resumen.condicionOperacion,
            iva_percibido: Number(plantilla.resumen.ivaPerci1),
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: plantilla.resumen.pagos[0].periodo,
            montopago: plantilla.resumen.pagos[0].montoPago,
            codigo: plantilla.resumen.pagos[0].codigo,
            referencia: plantilla.resumen.pagos[0].referencia,
            plazo: plantilla.resumen.pagos[0].plazo,

            totalnosuj: plantilla.resumen.totalNoSuj,
            tributos: null,
            tributocf: plantilla.resumen.tributos[0].codigo + "|" + plantilla.resumen.tributos[0].descripcion + "|" + plantilla.resumen.tributos[0].valor,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            totalexenta: plantilla.resumen.totalExenta,
            subtotalventas: plantilla.resumen.subTotalVentas,
            total_agravada: plantilla.resumen.totalGravada,
            montototaloperacion: plantilla.resumen.montoTotalOperacion,
            descunosuj: plantilla.resumen.descuNoSuj,
            descuexenta: plantilla.resumen.descuExenta,
            descugravada: plantilla.resumen.descuGravada,
            porcentajedescuento: plantilla.resumen.porcentajeDescuento,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            subtotal: plantilla.resumen.subTotal,
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            totalnogravado: plantilla.resumen.totalNoGravado,
            total_a_pagar: plantilla.resumen.totalPagar,
            /* -------------------------------------------- */
            /* EXTENSION */
            observaciones: plantilla.extension.observaciones || null,

            responsable_emisor: plantilla.extension.docuEntrega,
            documento_e: plantilla.extension.nombEntrega,
            documento_r: plantilla.extension.nombRecibe,
            documento_receptor: plantilla.extension.docuRecibe,
            placavehiculo: plantilla.extension.placaVehiculo,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: null,
            sellado: false,
            sello_de_recepcion: null,
            id_envio: plantilla.id_envio,
        };
    } else if (plantilla.identificacion.tipoDte === "01") {
        JsontoDB = {
            /* identification */
            version: plantilla.identificacion.version,
            ambiente: plantilla.identificacion.ambiente,
            tipo: plantilla.identificacion.tipoDte,
            numero_de_control: plantilla.identificacion.numeroControl,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoOperacion,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi,
            horemi: plantilla.identificacion.horEmi,
            tipomoneda: plantilla.identificacion.tipoMoneda,
            tipocontingencia: plantilla.identificacion.tipoContingencia,
            motivocontin: plantilla.identificacion.motivoContin,
            /* --------------------------------------------------------- */
            /* DOCUMENTO RELACIONADOS */
            documentorelacionado: plantilla.documentoRelacionado,
            /* --------------------------------------------------------- */
            /* EMISOR INFO IN TABLE USERS*/
            codestablemh: plantilla.emisor.codEstableMH,
            codestable: plantilla.emisor.codEstable,
            codpuntoventamh: plantilla.emisor.codPuntoVentaMH,
            codpuntoventa: plantilla.emisor.codPuntoVenta,
            /* --------------------------------------------------------- */
            /* RECEPTOR */

            re_codactividad: plantilla.receptor.codActividad,
            re_direccion: plantilla.receptor.direccion,
            re_nit: plantilla.receptor.nit,
            re_nrc: plantilla.receptor.nrc,
            re_actividad_economica: plantilla.receptor.descActividad,
            re_correo_electronico: plantilla.receptor.correo,
            re_tipodocumento: plantilla.receptor.tipoDocumento,
            re_name: plantilla.receptor.nombre,
            re_numero_telefono: plantilla.receptor.telefono,
            re_numdocumento: plantilla.receptor.numDocumento,

            /* --------------------------------------------------------- */
            /* OTROS DOCUMENTOS */
            otrosdocumentos: plantilla.otrosDocumentos,
            /* --------------------------------------------------------- */
            ventatercero: plantilla.ventaTercero,
            /* --------------------------------------------------------- */
            /* ITEMS */
            /* --------------------------------------------------------- */
            /* RESUMEN */
            condicionoperacion: plantilla.resumen.condicionOperacion,
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: plantilla.resumen.pagos[0].periodo,
            montopago: plantilla.resumen.pagos[0].montoPago,
            codigo: plantilla.resumen.pagos[0].codigo,
            referencia: plantilla.resumen.pagos[0].referencia,
            plazo: plantilla.resumen.pagos[0].plazo,

            totalnosuj: plantilla.resumen.totalNoSuj,
            tributos: plantilla.resumen.tributos,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            totalexenta: plantilla.resumen.totalExenta,
            subtotalventas: plantilla.resumen.subTotalVentas,
            total_agravada: plantilla.resumen.totalGravada,
            montototaloperacion: plantilla.resumen.montoTotalOperacion,
            descunosuj: plantilla.resumen.descuNoSuj,
            descuexenta: plantilla.resumen.descuExenta,
            descugravada: plantilla.resumen.descuGravada,
            porcentajedescuento: plantilla.resumen.porcentajeDescuento,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            subtotal: plantilla.resumen.subTotal,
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            totalnogravado: plantilla.resumen.totalNoGravado,
            total_a_pagar: plantilla.resumen.totalPagar,
            /* -------------------------------------------- */
            /* EXTENSION */
            observaciones: plantilla.extension ? plantilla.extension.observaciones : null,

            responsable_emisor: plantilla.extension ? plantilla.extension.docuEntrega : null,
            documento_e: plantilla.extension ? plantilla.extension.nombEntrega : null,
            documento_r: plantilla.extension ? plantilla.extension.nombRecibe : null,
            documento_receptor: plantilla.extension ? plantilla.extension.docuRecibe : null,
            placavehiculo: plantilla.extension ? plantilla.extension.placaVehiculo : null,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: null,
            sellado: false,
            sello_de_recepcion: null,
            id_envio: plantilla.id_envio,
        };
    } else if (plantilla.identificacion.tipoDte === "14") {


        JsontoDB = {
            /* identification */
            version: plantilla.identificacion.version,
            ambiente: plantilla.identificacion.ambiente,
            tipo: plantilla.identificacion.tipoDte,
            numero_de_control: plantilla.identificacion.numeroControl,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoOperacion,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi,
            horemi: plantilla.identificacion.horEmi,
            tipomoneda: plantilla.identificacion.tipoMoneda,
            tipocontingencia: plantilla.identificacion.tipoContingencia,
            motivocontin: plantilla.identificacion.motivoContin,
            /* --------------------------------------------------------- */
            /* DOCUMENTO RELACIONADOS */
            documentorelacionado: plantilla.documentoRelacionado,
            /* --------------------------------------------------------- */
            /* EMISOR INFO IN TABLE USERS*/
            codestablemh: plantilla.emisor.codEstableMH,
            codestable: plantilla.emisor.codEstable,
            codpuntoventamh: plantilla.emisor.codPuntoVentaMH,
            codpuntoventa: plantilla.emisor.codPuntoVenta,
            /* --------------------------------------------------------- */
            /* RECEPTOR */

            re_codactividad: null,
            re_direccion: plantilla.sujetoExcluido.direccion.departamento + "|" + plantilla.sujetoExcluido.direccion.municipio + "|" + plantilla.sujetoExcluido.direccion.complemento,
            re_nit: plantilla.sujetoExcluido.nit,
            re_nrc: plantilla.sujetoExcluido.nrc,
            re_actividad_economica: null,
            re_correo_electronico: plantilla.sujetoExcluido.correo,
            re_tipodocumento: plantilla.sujetoExcluido.tipoDocumento,
            re_name: plantilla.sujetoExcluido.nombre,
            re_numero_telefono: plantilla.sujetoExcluido.telefono,
            re_numdocumento: plantilla.sujetoExcluido.numeroDocumento,

            /* --------------------------------------------------------- */
            /* OTROS DOCUMENTOS */
            otrosdocumentos: plantilla.otrosDocumentos,
            /* --------------------------------------------------------- */
            ventatercero: plantilla.ventaTercero,
            /* --------------------------------------------------------- */
            /* ITEMS */
            /* --------------------------------------------------------- */
            /* RESUMEN */
            condicionoperacion: plantilla.resumen.condicionOperacion,
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: plantilla.resumen.pagos[0].periodo,
            montopago: plantilla.resumen.pagos[0].montoPago,
            codigo: plantilla.resumen.pagos[0].codigo,
            referencia: plantilla.resumen.pagos[0].referencia,
            plazo: plantilla.resumen.pagos[0].plazo,

            totalnosuj: plantilla.resumen.totalNoSuj,
            tributos: plantilla.resumen.tributos,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            totalexenta: plantilla.resumen.totalExenta,
            subtotalventas: plantilla.resumen.subTotalVentas,
            total_agravada: plantilla.resumen.totalGravada,
            montototaloperacion: plantilla.resumen.montoTotalOperacion,
            descunosuj: plantilla.resumen.descuNoSuj,
            descuexenta: plantilla.resumen.descuExenta,
            descugravada: plantilla.resumen.descuGravada,
            porcentajedescuento: plantilla.resumen.porcentajeDescuento,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            subtotal: plantilla.resumen.subTotal,
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            totalnogravado: plantilla.resumen.totalNoGravado,
            total_a_pagar: plantilla.resumen.totalPagar,
            /* -------------------------------------------- */
            /* EXTENSION now RESUMEN */
            observaciones: plantilla.resumen.observaciones,

            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: null,
            sellado: false,
            sello_de_recepcion: null,
            id_envio: plantilla.id_envio,
        };
    } else if (plantilla.identificacion.tipoDte === "05") {

        JsontoDB = {
            /* identification */
            version: plantilla.identificacion.version,
            ambiente: plantilla.identificacion.ambiente,
            tipo: plantilla.identificacion.tipoDte,
            numero_de_control: plantilla.identificacion.numeroControl,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoOperacion,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi,
            horemi: plantilla.identificacion.horEmi,
            tipomoneda: plantilla.identificacion.tipoMoneda,
            tipocontingencia: plantilla.identificacion.tipoContingencia,
            motivocontin: plantilla.identificacion.motivoContin,
            /* --------------------------------------------------------- */
            /* DOCUMENTO RELACIONADOS */
            documentorelacionado: plantilla.documentoRelacionado,
            /* --------------------------------------------------------- */
            /* EMISOR INFO IN TABLE USERS*/
            codestablemh: plantilla.emisor.codEstableMH,
            codestable: plantilla.emisor.codEstable,
            codpuntoventamh: plantilla.emisor.codPuntoVentaMH,
            codpuntoventa: plantilla.emisor.codPuntoVenta,
            /* --------------------------------------------------------- */
            /* RECEPTOR */

            re_codactividad: plantilla.receptor.codActividad,
            re_direccion: plantilla.receptor.direccion.departamento + "|" + plantilla.receptor.direccion.municipio + "|" + plantilla.receptor.direccion.complemento,
            re_nit: plantilla.receptor.nit,
            re_nrc: plantilla.receptor.nrc,
            re_actividad_economica: plantilla.receptor.descActividad,
            re_correo_electronico: plantilla.receptor.correo,
            re_tipodocumento: plantilla.receptor.tipoDocumento,
            re_name: plantilla.receptor.nombre,
            re_numero_telefono: plantilla.receptor.telefono,
            re_numdocumento: plantilla.receptor.nombreComercial,

            /* --------------------------------------------------------- */
            /* OTROS DOCUMENTOS */
            otrosdocumentos: plantilla.otrosDocumentos,
            /* --------------------------------------------------------- */
            ventatercero: plantilla.ventaTercero,
            /* --------------------------------------------------------- */
            /* ITEMS */
            /* --------------------------------------------------------- */
            /* RESUMEN */
            condicionoperacion: plantilla.resumen.condicionOperacion,
            iva_percibido: Number(plantilla.resumen.ivaPerci1),
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: plantilla.resumen.pagos[0].periodo,
            montopago: plantilla.resumen.pagos[0].montoPago,
            codigo: plantilla.resumen.pagos[0].codigo,
            referencia: plantilla.resumen.pagos[0].referencia,
            plazo: plantilla.resumen.pagos[0].plazo,

            totalnosuj: plantilla.resumen.totalNoSuj,
            tributos: null,
            tributocf: plantilla.resumen.tributos[0].codigo + "|" + plantilla.resumen.tributos[0].descripcion + "|" + plantilla.resumen.tributos[0].valor,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            totalexenta: plantilla.resumen.totalExenta,
            subtotalventas: plantilla.resumen.subTotalVentas,
            total_agravada: plantilla.resumen.totalGravada,
            montototaloperacion: plantilla.resumen.montoTotalOperacion,
            descunosuj: plantilla.resumen.descuNoSuj,
            descuexenta: plantilla.resumen.descuExenta,
            descugravada: plantilla.resumen.descuGravada,
            porcentajedescuento: plantilla.resumen.porcentajeDescuento,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            subtotal: plantilla.resumen.subTotal,
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            totalnogravado: plantilla.resumen.totalNoGravado,
            total_a_pagar: plantilla.resumen.totalPagar,
            /* -------------------------------------------- */
            /* EXTENSION */
            observaciones: plantilla.extension.observaciones,

            responsable_emisor: plantilla.extension.docuEntrega,
            documento_e: plantilla.extension.nombEntrega,
            documento_r: plantilla.extension.nombRecibe,
            documento_receptor: plantilla.extension.docuRecibe,
            placavehiculo: plantilla.extension.placaVehiculo,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: null,
            sellado: false,
            sello_de_recepcion: null,
            id_envio: plantilla.id_envio,
        };

    } else if (plantilla.identificacion.tipoDte === "06") {

        JsontoDB = {
            /* identification */
            version: plantilla.identificacion.version,
            ambiente: plantilla.identificacion.ambiente,
            tipo: plantilla.identificacion.tipoDte,
            numero_de_control: plantilla.identificacion.numeroControl,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoOperacion,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi,
            horemi: plantilla.identificacion.horEmi,
            tipomoneda: plantilla.identificacion.tipoMoneda,
            tipocontingencia: plantilla.identificacion.tipoContingencia,
            motivocontin: plantilla.identificacion.motivoContin,
            /* --------------------------------------------------------- */
            /* DOCUMENTO RELACIONADOS */
            documentorelacionado: plantilla.documentoRelacionado,
            /* --------------------------------------------------------- */
            /* EMISOR INFO IN TABLE USERS*/
            codestablemh: plantilla.emisor.codEstableMH,
            codestable: plantilla.emisor.codEstable,
            codpuntoventamh: plantilla.emisor.codPuntoVentaMH,
            codpuntoventa: plantilla.emisor.codPuntoVenta,
            /* --------------------------------------------------------- */
            /* RECEPTOR */

            re_codactividad: plantilla.receptor.codActividad,
            re_direccion: plantilla.receptor.direccion.departamento + "|" + plantilla.receptor.direccion.municipio + "|" + plantilla.receptor.direccion.complemento,
            re_nit: plantilla.receptor.nit,
            re_nrc: plantilla.receptor.nrc,
            re_actividad_economica: plantilla.receptor.descActividad,
            re_correo_electronico: plantilla.receptor.correo,
            re_tipodocumento: plantilla.receptor.tipoDocumento,
            re_name: plantilla.receptor.nombre,
            re_numero_telefono: plantilla.receptor.telefono,
            re_numdocumento: plantilla.receptor.nombreComercial,

            /* --------------------------------------------------------- */
            /* OTROS DOCUMENTOS */
            otrosdocumentos: plantilla.otrosDocumentos,
            /* --------------------------------------------------------- */
            ventatercero: plantilla.ventaTercero,
            /* --------------------------------------------------------- */
            /* ITEMS */
            /* --------------------------------------------------------- */
            /* RESUMEN */
            condicionoperacion: plantilla.resumen.condicionOperacion,
            iva_percibido: Number(plantilla.resumen.ivaPerci1),
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: plantilla.resumen.pagos[0].periodo,
            montopago: plantilla.resumen.pagos[0].montoPago,
            codigo: plantilla.resumen.pagos[0].codigo,
            referencia: plantilla.resumen.pagos[0].referencia,
            plazo: plantilla.resumen.pagos[0].plazo,

            totalnosuj: plantilla.resumen.totalNoSuj,
            tributos: null,
            tributocf: plantilla.resumen.tributos[0].codigo + "|" + plantilla.resumen.tributos[0].descripcion + "|" + plantilla.resumen.tributos[0].valor,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            totalexenta: plantilla.resumen.totalExenta,
            subtotalventas: plantilla.resumen.subTotalVentas,
            total_agravada: plantilla.resumen.totalGravada,
            montototaloperacion: plantilla.resumen.montoTotalOperacion,
            descunosuj: plantilla.resumen.descuNoSuj,
            descuexenta: plantilla.resumen.descuExenta,
            descugravada: plantilla.resumen.descuGravada,
            porcentajedescuento: plantilla.resumen.porcentajeDescuento,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            subtotal: plantilla.resumen.subTotal,
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            totalnogravado: plantilla.resumen.totalNoGravado,
            total_a_pagar: plantilla.resumen.totalPagar,
            /* -------------------------------------------- */
            /* EXTENSION */
            observaciones: plantilla.extension.observaciones,

            responsable_emisor: plantilla.extension.docuEntrega,
            documento_e: plantilla.extension.nombEntrega,
            documento_r: plantilla.extension.nombRecibe,
            documento_receptor: plantilla.extension.docuRecibe,
            placavehiculo: plantilla.extension.placaVehiculo,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: null,
            sellado: false,
            sello_de_recepcion: null,
            id_envio: plantilla.id_envio,
        };
    }

    try {
        const result = await db('purchases').insert(JsontoDB);
        console.log(result);
        res.status(201).json({ message: 'compra creada' });

    } catch (error) {
        res.status(500).json({ message: error });
        console.log(error);
    }

};

const getcompras = async(req, res) => {
    /* get by id */
    console.log('get compras');
    const id = req.params.id;
    const startdate = req.params.startdate;
    const enddata = req.params.enddata;
    console.log(id);
    console.log(startdate);
    console.log(enddata);

    try {
        const compras = await db('purchases').where("id_emisor", id).whereBetween('fecha_y_hora_de_generacion', [startdate, enddata]);
        res.status(200).json(compras);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};


module.exports = {
    cratecompra,
    getcompras,
};
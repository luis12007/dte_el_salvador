const { version } = require("env");
const db = require("../db/db"); // Asegúrate de tener correctamente configurado el objeto Knex
const sendMail = require("../utils/mailUtils");

const plantillacreate = async(req, res) => {

    const plantilla = req.body;
    /* 
      console.log("plantillacreate");
      console.log(plantilla); */
    /* id_emisor in the headers*/
    const id_emisor = req.headers.id_emisor;
    console.log("plantillacreate");
    console.log(plantilla);
    console.log("idemisor");
    console.log(id_emisor);

    if (plantilla.identificacion.tipoDte === "03") {

        const JsontoDB = {
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


        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log(JsontoDB);
        try {
            const [createdPlantilla] = await db("deleted")
                .returning("id")
                .insert(JsontoDB)
                .returning("*");

            try {
                const plantilla = req.body;
                const items = plantilla.cuerpoDocumento;

                // Crear objetos para insertar en la tabla 'items'
                const itemsDB = items.map((item) => ({
                    codtributo: item.codTributo,
                    descripcion: item.descripcion,
                    unimedida: item.uniMedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numitem: item.numItem,
                    tributos: item.tributos[0],
                    ivaitem: null,
                    nogravado: item.noGravado,
                    psv: item.psv,
                    montodescu: item.montoDescu,
                    numerodocumento: item.numeroDocumento,
                    preciouni: item.precioUni,
                    ventagravada: item.ventaGravada,
                    ventaexenta: item.ventaExenta,
                    ventanosuj: item.ventaNoSuj,
                    tipoitem: item.tipoItem,
                    iva: item.iva,
                }));


                // Insertar en 'items' y obtener IDs
                const insertedItems = await insertarItems(itemsDB);
                // Crear objetos para insertar en 'facturasxitems'
                const facturasxitems = insertedItems.map((item, index) => ({
                    id_facturas: plantilla.identificacion.codigoGeneracion,
                    id_items: item.id, // ID retornado por 'items'
                }));

                // Insertar en 'facturasxitems'
                await insertarFacturasxItems(facturasxitems);

                res.status(200).json({ message: "Inserción exitosa", createdPlantilla });
            } catch (error) {
                console.error("Error al crear objetos:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error al crear plantilla:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }

    } else if (plantilla.identificacion.tipoDte === "01") {
        const JsontoDB = {
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

        try {
            const [createdPlantilla] = await db("deleted")
                .returning("id")
                .insert(JsontoDB)
                .returning("*");

            try {
                const plantilla = req.body;
                const items = plantilla.cuerpoDocumento;

                // Crear objetos para insertar en la tabla 'items'
                const itemsDB = items.map((item) => ({
                    codtributo: item.codTributo,
                    descripcion: item.descripcion,
                    unimedida: item.uniMedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numitem: item.numItem,
                    tributos: item.tributos,
                    ivaitem: item.ivaItem,
                    nogravado: item.noGravado,
                    psv: item.psv,
                    montodescu: item.montoDescu,
                    numerodocumento: item.numeroDocumento,
                    preciouni: item.precioUni,
                    ventagravada: item.ventaGravada,
                    ventaexenta: item.ventaExenta,
                    ventanosuj: item.ventaNoSuj,
                    tipoitem: item.tipoItem,
                    iva: item.iva,
                }));


                // Insertar en 'items' y obtener IDs

                const insertedItems = await insertarItems(itemsDB);
                // Crear objetos para insertar en 'facturasxitems'
                const facturasxitems = insertedItems.map((item, index) => ({
                    id_facturas: plantilla.identificacion.codigoGeneracion,
                    id_items: item.id, // ID retornado por 'items'
                }));

                // Insertar en 'facturasxitems'
                await insertarFacturasxItems(facturasxitems);

                res.status(200).json({ message: "Inserción exitosa", createdPlantilla });
            } catch (error) {
                console.error("Error al crear objetos:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error al crear plantilla:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    } else if (plantilla.identificacion.tipoDte === "14") {


        const JsontoDB = {
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

        try {
            const [createdPlantilla] = await db("deleted")
                .returning("id")
                .insert(JsontoDB)
                .returning("*");

            try {
                const plantilla = req.body;
                const items = plantilla.cuerpoDocumento;

                // Crear objetos para insertar en la tabla 'items'
                const itemsDB = items.map((item) => ({
                    codtributo: item.codTributo,
                    descripcion: item.descripcion,
                    unimedida: item.uniMedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numitem: item.numItem,
                    tributos: item.tributos,
                    ivaitem: item.ivaItem,
                    nogravado: item.noGravado,
                    psv: item.psv,
                    montodescu: item.montoDescu,
                    numerodocumento: item.numeroDocumento,
                    preciouni: item.precioUni,
                    ventagravada: item.ventaGravada,
                    ventaexenta: item.ventaExenta,
                    ventanosuj: item.ventaNoSuj,
                    tipoitem: item.tipoItem,
                    iva: item.iva,
                }));


                // Insertar en 'items' y obtener IDs
                console.log("itemsDB");
                const insertedItems = await insertarItems(itemsDB);
                console.log("itemsDB2");

                // Crear objetos para insertar en 'facturasxitems'
                const facturasxitems = insertedItems.map((item, index) => ({
                    id_facturas: plantilla.identificacion.codigoGeneracion,
                    id_items: item.id, // ID retornado por 'items'
                }));

                // Insertar en 'facturasxitems'
                await insertarFacturasxItems(facturasxitems);

                res.status(200).json({ message: "Inserción exitosa", createdPlantilla });
            } catch (error) {
                console.error("Error al crear objetos:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error al crear plantilla:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    } else if (plantilla.identificacion.tipoDte === "05") {

        const JsontoDB = {
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


        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log(JsontoDB);
        try {
            const [createdPlantilla] = await db("deleted")
                .returning("id")
                .insert(JsontoDB)
                .returning("*");

            try {
                const plantilla = req.body;
                const items = plantilla.cuerpoDocumento;
                var docunum2 = null;
                if (plantilla.documentoRelacionado !== null) {
                    const docunum = plantilla.documentoRelacionado.split("|");
                    docunum2 = docunum[2]
                }


                // Crear objetos para insertar en la tabla 'items'
                const itemsDB = items.map((item) => ({
                    codtributo: item.codTributo,
                    descripcion: item.descripcion,
                    unimedida: item.uniMedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numitem: item.numItem,
                    tributos: item.tributos[0],
                    ivaitem: null,
                    nogravado: item.noGravado,
                    psv: item.psv,
                    montodescu: item.montoDescu,
                    numerodocumento: docunum2,
                    preciouni: item.precioUni,
                    ventagravada: item.ventaGravada,
                    ventaexenta: item.ventaExenta,
                    ventanosuj: item.ventaNoSuj,
                    tipoitem: item.tipoItem,
                    iva: item.iva,
                }));


                // Insertar en 'items' y obtener IDs
                const insertedItems = await insertarItems(itemsDB);
                // Crear objetos para insertar en 'facturasxitems'
                const facturasxitems = insertedItems.map((item, index) => ({
                    id_facturas: plantilla.identificacion.codigoGeneracion,
                    id_items: item.id, // ID retornado por 'items'
                }));

                // Insertar en 'facturasxitems'
                await insertarFacturasxItems(facturasxitems);

                res.status(200).json({ message: "Inserción exitosa", createdPlantilla });
            } catch (error) {
                console.error("Error al crear objetos:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error al crear plantilla:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }

    } else if (plantilla.identificacion.tipoDte === "06") {

        const JsontoDB = {
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


        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log("plantillacreate");
        console.log(JsontoDB);
        try {
            const [createdPlantilla] = await db("deleted")
                .returning("id")
                .insert(JsontoDB)
                .returning("*");

            try {
                const plantilla = req.body;
                const items = plantilla.cuerpoDocumento;
                var docunum2 = null;
                if (plantilla.documentoRelacionado !== null) {
                    const docunum = plantilla.documentoRelacionado.split("|");
                    docunum2 = docunum[2]
                }


                // Crear objetos para insertar en la tabla 'items'
                const itemsDB = items.map((item) => ({
                    codtributo: item.codTributo,
                    descripcion: item.descripcion,
                    unimedida: item.uniMedida,
                    codigo: item.codigo,
                    cantidad: item.cantidad,
                    numitem: item.numItem,
                    tributos: item.tributos[0],
                    ivaitem: null,
                    nogravado: item.noGravado,
                    psv: item.psv,
                    montodescu: item.montoDescu,
                    numerodocumento: docunum2,
                    preciouni: item.precioUni,
                    ventagravada: item.ventaGravada,
                    ventaexenta: item.ventaExenta,
                    ventanosuj: item.ventaNoSuj,
                    tipoitem: item.tipoItem,
                    iva: item.iva,
                }));


                // Insertar en 'items' y obtener IDs
                const insertedItems = await insertarItems(itemsDB);
                // Crear objetos para insertar en 'facturasxitems'
                const facturasxitems = insertedItems.map((item, index) => ({
                    id_facturas: plantilla.identificacion.codigoGeneracion,
                    id_items: item.id, // ID retornado por 'items'
                }));

                // Insertar en 'facturasxitems'
                await insertarFacturasxItems(facturasxitems);

                res.status(200).json({ message: "Inserción exitosa", createdPlantilla });
            } catch (error) {
                console.error("Error al crear objetos:", error);
                res.status(500).json({ message: "Error en el servidor" });
            }

        } catch (error) {
            console.error("Error al crear plantilla:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }

    }
};

const insertarItems = async(items) => {
    // Inserta los items y devuelve el ID para cada uno
    console.log("insertarItems");
    console.log(items);
    const insertedItems = await db("items").returning("id").insert(items);
    return insertedItems; // Devuelve el array de IDs insertados
};

const insertarFacturasxItems = async(facturasxitems) => {
    await db("facturasxitems").insert(facturasxitems); // Inserta las facturasxitems
};

//get all plantillas where by user id
const getPlantillasByUserId = async(req, res) => {
    console.log("getPlantillasByUserId");
    const usuarioid = req.params.id;
    try {
        //return all plantillas by user id
        const plantilla = await db("deleted").where({ id_emisor: usuarioid });
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/* i will get the plantillas by type i will send an array of
types like "03","02" and i will recive all of 3 and all 2 by the id of the usuarioid 
the id will be param and the types body with the json value types and key the types in array*/
const getbytypeandid = async(req, res) => {
    try {
        const usuarioid = req.params.id;
        const types = req.headers.types;
        const stardate = req.params.startdate;
        const enddate = req.params.enddata;
        console.log("getbytypeandid");
        console.log(usuarioid);
        console.log(types);
        console.log(stardate);
        console.log(enddate);
        console.log("getbytypeandid");

        /* with " " instead of '' */
        const typestoarray = types.split(",");
        console.log(typestoarray[0]);


        if (!usuarioid || !types || !Array.isArray(typestoarray)) {
            return res.status(400).json({ error: "Invalid input" });
        }

        /* where usuario id finding in the array of types and between those dates  */
        const plantillas = await db("deleted")
            .where("id_emisor", usuarioid)
            .whereIn("tipo", typestoarray)
            .whereBetween("fecha_y_hora_de_generacion", [stardate, enddate])
            .whereNotNull("sello_de_recepcion");


        res.status(200).json(plantillas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/* update the plantilla with codigo_de_generacion */

const updatePlantilla = async(req, res) => {
    const codigo_de_generacion = req.params.codigo_de_generacion;
    const plantilla = req.body.plantilla;
    const id_emisor = req.headers.id_emisor;
    const itemsdel = req.body.items;
    console.log("updatePlantilla");

    if (plantilla.identificacion.tipoDte === "03") {
        console.log("updatePlantillaCF");
        var JsontoDB = {
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
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };

    } else if (plantilla.identificacion.tipoDte === "01") {
        var JsontoDB = {
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
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,

        };
    } else if (plantilla.identificacion.tipoDte === "14") {
        var JsontoDB = {
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
        console.log("updatePlantillaCF");
        var JsontoDB = {
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
            documentorelacionado: plantilla.documentoRelacionado[0].tipoDocumento + "|" + plantilla.documentoRelacionado[0].tipoGeneracion + "|" + plantilla.documentoRelacionado[0].numeroDocumento + "|" + plantilla.documentoRelacionado[0].fechaEmision,
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
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: null,
            montopago: null,
            codigo: null,
            referencia: null,
            plazo: null,

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
            observaciones: plantilla.resumen.observaciones,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };

    } else if (plantilla.identificacion.tipoDte === "06") {
        console.log("updatePlantillaCF");
        var JsontoDB = {
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
            documentorelacionado: plantilla.documentoRelacionado[0].tipoDocumento + "|" + plantilla.documentoRelacionado[0].tipoGeneracion + "|" + plantilla.documentoRelacionado[0].numeroDocumento + "|" + plantilla.documentoRelacionado[0].fechaEmision,
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
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: null,
            montopago: null,
            codigo: null,
            referencia: null,
            plazo: null,

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
            observaciones: plantilla.resumen.observaciones,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };

    }


    console.log("-------------------------------")
    console.log(JsontoDB);
    console.log("-------------------------------")
        /* delete all itemslist find by iditems in the x table and the table items */
    try {
        /* delete all in facturasxitems where id_factura is codigo_de_generacion */
        await db.transaction(async(trx) => {
            const deleteAll = await trx("facturasxitems").where({ id_facturas: codigo_de_generacion }).del();
            console.log("Deleted rows:", deleteAll);
        });
        itemsdel.forEach(element => {
            db("items").where({ id: element.id }).del();
        });

    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }

    /* insert the new items */
    try {
        const plantilla = req.body.plantilla;
        const items = plantilla.cuerpoDocumento;

        if (plantilla.identificacion.tipoDte === "03") {
            var itemsDB = items.map((item) => ({
                codtributo: item.codTributo,
                descripcion: item.descripcion,
                unimedida: item.uniMedida,
                codigo: item.codigo,
                cantidad: item.cantidad,
                numitem: item.numItem,
                tributos: 20,
                nogravado: item.noGravado,
                psv: item.psv,
                montodescu: item.montoDescu,
                numerodocumento: item.numeroDocumento,
                preciouni: item.precioUni,
                ventagravada: item.ventaGravada,
                ventaexenta: item.ventaExenta,
                ventanosuj: item.ventaNoSuj,
                tipoitem: item.tipoItem,
                iva: item.iva,
            }));
        } else if (plantilla.identificacion.tipoDte === "01") {
            var itemsDB = items.map((item) => ({
                codtributo: item.codTributo,
                descripcion: item.descripcion,
                unimedida: item.uniMedida,
                codigo: item.codigo,
                cantidad: item.cantidad,
                numitem: item.numItem,
                tributos: item.tributos,
                ivaitem: item.ivaItem,
                nogravado: item.noGravado,
                psv: item.psv,
                montodescu: item.montoDescu,
                numerodocumento: item.numeroDocumento,
                preciouni: item.precioUni,
                ventagravada: item.ventaGravada,
                ventaexenta: item.ventaExenta,
                ventanosuj: item.ventaNoSuj,
                tipoitem: item.tipoItem,
                iva: item.iva,
            }));
        } else if (plantilla.identificacion.tipoDte === "14") {
            var itemsDB = items.map((item) => ({
                codtributo: item.codTributo,
                descripcion: item.descripcion,
                unimedida: item.uniMedida,
                codigo: item.codigo,
                cantidad: item.cantidad,
                numitem: item.numItem,
                tributos: item.tributos,
                ivaitem: item.ivaItem,
                nogravado: item.noGravado,
                psv: item.psv,
                montodescu: item.montoDescu,
                numerodocumento: item.numeroDocumento,
                preciouni: item.precioUni,
                ventagravada: item.ventaGravada,
                ventaexenta: item.ventaExenta,
                ventanosuj: item.ventaNoSuj,
                tipoitem: item.tipoItem,
                iva: item.iva,
            }));
        } else if (plantilla.identificacion.tipoDte === "05") {
            var itemsDB = items.map((item) => ({
                codtributo: item.codTributo,
                descripcion: item.descripcion,
                unimedida: item.uniMedida,
                codigo: item.codigo,
                cantidad: item.cantidad,
                numitem: item.numItem,
                tributos: 20,
                nogravado: item.noGravado,
                psv: item.psv,
                montodescu: item.montoDescu,
                numerodocumento: item.numeroDocumento,
                preciouni: item.precioUni,
                ventagravada: item.ventaGravada,
                ventaexenta: item.ventaExenta,
                ventanosuj: item.ventaNoSuj,
                tipoitem: item.tipoItem,
                iva: item.iva,
            }));
        } else if (plantilla.identificacion.tipoDte === "06") {
            var itemsDB = items.map((item) => ({
                codtributo: item.codTributo,
                descripcion: item.descripcion,
                unimedida: item.uniMedida,
                codigo: item.codigo,
                cantidad: item.cantidad,
                numitem: item.numItem,
                tributos: 20,
                nogravado: item.noGravado,
                psv: item.psv,
                montodescu: item.montoDescu,
                numerodocumento: item.numeroDocumento,
                preciouni: item.precioUni,
                ventagravada: item.ventaGravada,
                ventaexenta: item.ventaExenta,
                ventanosuj: item.ventaNoSuj,
                tipoitem: item.tipoItem,
                iva: item.iva,
            }));
        }
        // Crear objetos para insertar en la tabla 'items'


        console.log("-------------------------------")
        console.log(itemsDB);
        console.log("-------------------------------")
        console.log("im here")
            // Insertar en 'items' y obtener IDs
        const insertedItems = await insertarItems(itemsDB);
        console.log("but not here")

        // Crear objetos para insertar en 'facturasxitems'
        const facturasxitems = insertedItems.map((item, index) => ({
            id_facturas: plantilla.identificacion.codigoGeneracion,
            id_items: item.id, // ID retornado por 'items'
        }));

        // Insertar en 'facturasxitems'
        await insertarFacturasxItems(facturasxitems);

    } catch (error) {
        console.error("Error al crear objetos:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }

    try {
        const plantilla = await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .first();
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .update(JsontoDB);
        res.status(200).json({ message: "plantilla actualizado" });
    } catch (error) {
        console.error("Error al actualizar plantilla", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
/* Count plantillas and count by id in params and type in headers  */
const countplantilla = async(req, res) => {
    console.log("countplantilla");
    console.log(req.params.id);
    console.log(req.headers.tipo);
    const usuarioid = req.params.id;
    const tipo = req.headers.tipo;
    try {
        const plantilla = await db("deleted")
            .where({ id_emisor: usuarioid, tipo: tipo })
            .count();
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
/* update the plantilla with codigo_de_generacion updatePlantillasend
    updatesend: async (selladotoggle,selloRecibido,token,codigo_de_generacion) => {
            const res = await fetch(`${BASE_URL}/plantillas/update/send/${codigo_de_generacion}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'id_emisor': `${id_emisor}`,
                },
                body: JSON.stringify({
                    selladotoggle: selladotoggle,
                    selloRecibido: selloRecibido
                })
            });
            const data = await res.json();
            return data;
        },*/

const updatePlantillasend = async(req, res) => {
    const selladotoggle = req.body.selladotoggle;
    const selloRecibido = req.body.selloRecibido;
    const codigo_de_generacion = req.params.codigo_de_generacion;
    const id_emisor = req.headers.id_emisor;
    console.log("updatePlantillasend");
    try {
        const plantilla = await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .first();
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .update({ sellado: selladotoggle, sello_de_recepcion: selloRecibido });
        res.status(200).json({ message: "plantilla actualizado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const getplantilla = async(req, res) => {
    console.log("getPlantillasByUserId");
    const codigo_de_generacion = req.params.codigo_de_generacion;
    try {
        //return all plantillas by user id
        const plantilla = await db("deleted").where({ codigo_de_generacion: codigo_de_generacion });
        /* innerjoin facturasxitems where id_facturas id codigo_de_generacion and id_items is id of table items where codigo_de_generacion */
        const items = await db("facturasxitems").join("items", "facturasxitems.id_items", "=", "items.id").where("facturasxitems.id_facturas", "=", codigo_de_generacion);
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        console.log(items);
        /* send the items and the plantilla */
        res.status(200).json({ plantilla, items });
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const DeletePlantillaById = async(req, res) => {
    const codigo_de_generacion = req.params.codigo_de_generacion;
    console.log("DeletePlantillaById");
    try {
        const plantilla = await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .first();
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        await db("deleted")
            .where({ codigo_de_generacion: codigo_de_generacion })
            .del();
        res.status(200).json({ message: "plantilla eliminado" });
    } catch (error) {
        console.error("Error al eliminar plantilla", error);
        res.status(500).json({ message: "Error en el servidor" });
    }


}

const updatePlantillaNoItems = async(req, res) => {
    const codigo_de_generacion = req.params.codigo_de_generacion;
    const plantilla = req.body.plantilla;
    const id_emisor = req.headers.id_emisor;
    console.log('updatePlantilla');
    console.log(codigo_de_generacion);
    console.log(plantilla);


    if (plantilla.identificacion.tipoDte === "03") {

        console.log("plantillacreate");
        console.log(plantilla.resumen.tributos);
        var JsontoDB = {
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
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };

    } else if (plantilla.identificacion.tipoDte === "01") {
        var JsontoDB = {
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
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };
    } else if (plantilla.identificacion.tipoDte === "14") {
        var JsontoDB = {
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
            re_direccion: plantilla.sujetoExcluido.direccion.departamento + "|" + plantilla.sujetoExcluido.direccion.municipio + "|" + plantilla.sujetoExcluido.direccion.complemento,

            re_codactividad: plantilla.sujetoExcluido.codActividad,
            re_nit: plantilla.sujetoExcluido.nit,
            re_nrc: plantilla.sujetoExcluido.nrc,
            re_actividad_economica: plantilla.sujetoExcluido.descActividad,
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
            /* EXTENSION */
            observaciones: plantilla.resumen.observaciones,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };
    } else if (plantilla.identificacion.tipoDte === "05") {


        var JsontoDB = {
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
            documentorelacionado: plantilla.documentoRelacionado[0].tipoDocumento + "|" + plantilla.documentoRelacionado[0].tipoGeneracion + "|" + plantilla.documentoRelacionado[0].numeroDocumento + "|" + plantilla.documentoRelacionado[0].fechaEmision,
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
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: null,
            montopago: null,
            codigo: null,
            referencia: null,
            plazo: null,

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
            observaciones: plantilla.resumen.observaciones,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };
    } else if (plantilla.identificacion.tipoDte === "06") {
        console.log("updatePlantillaCF");
        var JsontoDB = {
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
            documentorelacionado: plantilla.documentoRelacionado[0].tipoDocumento + "|" + plantilla.documentoRelacionado[0].tipoGeneracion + "|" + plantilla.documentoRelacionado[0].numeroDocumento + "|" + plantilla.documentoRelacionado[0].fechaEmision,
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
            iva_percibido: plantilla.resumen.totalIva,
            saldofavor: plantilla.resumen.saldoFavor,
            numpagoelectronico: plantilla.resumen.numPagoElectronico,
            /* pagos */
            periodo: null,
            montopago: null,
            codigo: null,
            referencia: null,
            plazo: null,

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
            observaciones: plantilla.resumen.observaciones,
            /* -------------------------------------------- */
            /* APENDICE */
            apendice: plantilla.apendice,
            /* -------------------------------------------- */
            /* INFO OF DTE */
            id_emisor: id_emisor,
            qr: null,
            id_receptor: null,
            firm: plantilla.firma,
            sellado: plantilla.sellado,
            sello_de_recepcion: plantilla.sello,
        };

    }

    try {
        const plantilla = await db('plantilla').where({ codigo_de_generacion: codigo_de_generacion }).first();
        if (!plantilla) {
            return res.status(404).json({ message: 'plantilla no encontrado' });
        }
        await db('plantilla').where({ codigo_de_generacion: codigo_de_generacion }).update(JsontoDB);
        res.status(200).json({ message: 'plantilla actualizado' });
    } catch (error) {
        console.error('Error al actualizar plantilla', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}



const getPlantillasByUserIdAndName = async(req, res) => {
    console.log("getPlantillasByUserIdAndName");
    const usuarioid = req.params.id;
    const namesearch = req.params.name;
    console.log(namesearch);
    console.log(usuarioid);
    try {
        //return all plantillas by user id cotains name
        const plantilla = await db("deleted").where({ id_emisor: usuarioid }).where("re_name", "like", `%${namesearch}%`);
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const getPlantillasByUserIdAndDateRamge = async(req, res) => {
    console.log("getPlantillasByUserIdAndDateRamge");
    const usuarioid = req.params.id;
    const start = req.params.start;
    const end = req.params.end;
    try {
        //return all plantillas by user id
        const plantilla = await db("deleted").where({ id_emisor: usuarioid }).whereBetween('fecha_y_hora_de_generacion', [start, end]);
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

const getPlantillasByUserIdAndType = async(req, res) => {
    console.log("getPlantillasByUserIdAndType");
    const usuarioid = req.params.id;
    const type = req.params.type;
    try {
        //return all plantillas by user id
        const plantilla = await db("deleted").where({ id_emisor: usuarioid, tipo: type });
        if (!plantilla) {
            return res.status(404).json({ message: "plantilla no encontrado" });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener plantilla por ID", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};




module.exports = {
    plantillacreate,
    getPlantillasByUserId,
    updatePlantilla,
    countplantilla,
    updatePlantillasend,
    getplantilla,
    DeletePlantillaById,
    updatePlantillaNoItems,
    getPlantillasByUserIdAndName,
    getPlantillasByUserIdAndDateRamge,
    getPlantillasByUserIdAndType,
    getbytypeandid,
};
const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const cratecompra = async(req, res) => {
    console.log('create compras');
    try {
        const id_emisor = req.headers.id_emisor;
        const plantilla = req.body ?? {};

        if (!id_emisor) {
            return res.status(400).json({ message: 'id_emisor header is required' });
        }

        const tipoDte = plantilla?.identificacion?.tipoDte;
        const allowedTypes = new Set(['03', '01', '05', '06']);
        if (!tipoDte || !allowedTypes.has(tipoDte)) {
            return res.status(400).json({ message: 'tipoDte inválido (solo 03, 01, 05 o 06)' });
        }

        const JsontoDB = {};
        const put = (key, value) => {
            if (value !== undefined && value !== null) {
                JsontoDB[key] = value;
            }
        };
        const putNumber = (key, value) => {
            if (value === undefined || value === null) return;
            const n = Number(value);
            if (!Number.isNaN(n)) {
                JsontoDB[key] = n;
            }
        };
        const normalizeDireccion = (direccion) => {
            if (direccion === undefined || direccion === null) return undefined;
            if (typeof direccion === 'string') return direccion;

            const dep = direccion?.departamento;
            const mun = direccion?.municipio;
            const comp = direccion?.complemento;
            if (dep !== undefined && dep !== null && mun !== undefined && mun !== null && comp !== undefined && comp !== null) {
                return `${dep}|${mun}|${comp}`;
            }

            try {
                return JSON.stringify(direccion);
            } catch (e) {
                return String(direccion);
            }
        };

        const firstDefined = (...values) => values.find(v => v !== undefined && v !== null);

        // identification
        put('version', plantilla?.identificacion?.version);
        put('ambiente', plantilla?.identificacion?.ambiente);
        put('tipo', tipoDte);
        put('numero_de_control', plantilla?.identificacion?.numeroControl);
        put('codigo_de_generacion', plantilla?.identificacion?.codigoGeneracion);
        put('modelo_de_factura', plantilla?.identificacion?.tipoModelo);
        put('tipo_de_transmision', plantilla?.identificacion?.tipoOperacion);
        put('fecha_y_hora_de_generacion', plantilla?.identificacion?.fecEmi);
        put('horemi', plantilla?.identificacion?.horEmi);
        put('tipomoneda', plantilla?.identificacion?.tipoMoneda);
        put('tipocontingencia', plantilla?.identificacion?.tipoContingencia);
        put('motivocontin', plantilla?.identificacion?.motivoContin);

        // Documento relacionados / otros
        put('documentorelacionado', plantilla?.documentoRelacionado);
        put('otrosdocumentos', plantilla?.otrosDocumentos);
        put('ventatercero', plantilla?.ventaTercero);
        put('apendice', plantilla?.apendice);

        // Emisor
        put('codestablemh', plantilla?.emisor?.codEstableMH);
        put('codestable', plantilla?.emisor?.codEstable);
        put('codpuntoventamh', plantilla?.emisor?.codPuntoVentaMH);
        put('codpuntoventa', plantilla?.emisor?.codPuntoVenta);

        put('em_codactividad', plantilla?.emisor?.codActividad);
        put('em_direccion', normalizeDireccion(plantilla?.emisor?.direccion));
        put('em_nit', plantilla?.emisor?.nit);
        put('em_nrc', plantilla?.emisor?.nrc);
        put('em_actividad_economica', plantilla?.emisor?.descActividad);
        put('em_correo_electronico', plantilla?.emisor?.correo);
        put('em_tipodocumento', plantilla?.emisor?.tipoDocumento);
        put('em_name', plantilla?.emisor?.nombre);
        put('em_numero_telefono', plantilla?.emisor?.telefono);
        put('em_numdocumento', plantilla?.emisor?.nombreComercial);

        // Receptor
        put('re_codactividad', plantilla?.receptor?.codActividad);
        put('re_direccion', normalizeDireccion(plantilla?.receptor?.direccion));
        put('re_nit', plantilla?.receptor?.nit);
        put('re_nrc', plantilla?.receptor?.nrc);
        put('re_actividad_economica', plantilla?.receptor?.descActividad);
        put('re_correo_electronico', plantilla?.receptor?.correo);
        put('re_tipodocumento', plantilla?.receptor?.tipoDocumento);
        put('re_name', plantilla?.receptor?.nombre);
        put('re_numero_telefono', plantilla?.receptor?.telefono);
        if (tipoDte === '01') {
            put('re_numdocumento', plantilla?.receptor?.numDocumento);
        } else {
            put('re_numdocumento', plantilla?.receptor?.nombreComercial);
        }

        // Resumen
        put('condicionoperacion', plantilla?.resumen?.condicionOperacion);
        put('saldofavor', plantilla?.resumen?.saldoFavor);
        put('numpagoelectronico', plantilla?.resumen?.numPagoElectronico);

        if (tipoDte === '01') {
            putNumber('iva_percibido', plantilla?.resumen?.totalIva);
            put('tributos', plantilla?.resumen?.tributos);
        } else {
            putNumber('iva_percibido', plantilla?.resumen?.ivaPerci1);
            const trib0 = plantilla?.resumen?.tributos?.[0];
            if (trib0?.codigo !== undefined && trib0?.codigo !== null && trib0?.descripcion !== undefined && trib0?.descripcion !== null && trib0?.valor !== undefined && trib0?.valor !== null) {
                put('tributocf', `${trib0.codigo}|${trib0.descripcion}|${trib0.valor}`);
            }
        }

        const pago0 = Array.isArray(plantilla?.resumen?.pagos) ? plantilla.resumen.pagos[0] : undefined;
        if (pago0) {
            put('periodo', pago0?.periodo);
            put('montopago', pago0?.montoPago);
            put('codigo', pago0?.codigo);
            put('referencia', pago0?.referencia);
            put('plazo', pago0?.plazo);
        }

        put('totalnosuj', plantilla?.resumen?.totalNoSuj);
        put('cantidad_en_letras', plantilla?.resumen?.totalLetras);
        put('totalexenta', plantilla?.resumen?.totalExenta);
        put('subtotalventas', plantilla?.resumen?.subTotalVentas);
        put('total_agravada', plantilla?.resumen?.totalGravada);
        put('montototaloperacion', plantilla?.resumen?.montoTotalOperacion);
        put('descunosuj', plantilla?.resumen?.descuNoSuj);
        put('descuexenta', plantilla?.resumen?.descuExenta);
        put('descugravada', plantilla?.resumen?.descuGravada);
        put('porcentajedescuento', plantilla?.resumen?.porcentajeDescuento);
        put('monto_global_de_descuento', plantilla?.resumen?.totalDescu);
        put('subtotal', plantilla?.resumen?.subTotal);
        put('iva_retenido', plantilla?.resumen?.ivaRete1);
        put('retencion_de_renta', plantilla?.resumen?.reteRenta);
        put('totalnogravado', plantilla?.resumen?.totalNoGravado);
        put('total_a_pagar', plantilla?.resumen?.totalPagar);

        // Extension
        put('observaciones', plantilla?.extension?.observaciones);
        put('responsable_emisor', plantilla?.extension?.docuEntrega);
        put('documento_e', plantilla?.extension?.nombEntrega);
        put('documento_r', plantilla?.extension?.nombRecibe);
        put('documento_receptor', plantilla?.extension?.docuRecibe);
        put('placavehiculo', plantilla?.extension?.placaVehiculo);

        // Info de control (interno)
        put('id_emisor', id_emisor);
        put('sellado', false);
        put('id_envio', plantilla?.id_envio);

        // Campos extra (PDF / Anexos compras-renta)
        put('fecha', firstDefined(plantilla?.fecha, plantilla?.identificacion?.fecEmi));

        // Proveedor (normalmente el emisor del DTE)
        put('nit_proveedor', firstDefined(plantilla?.nit_proveedor, plantilla?.nitProveedor, plantilla?.emisor?.nit));
        put('nrc_proveedor', firstDefined(plantilla?.nrc_proveedor, plantilla?.nrcProveedor, plantilla?.emisor?.nrc));
        put('dui_proveedor', firstDefined(plantilla?.dui_proveedor, plantilla?.duiProveedor));

        // Montos (si vienen en el JSON)
        putNumber('compras_internas_exentas', firstDefined(plantilla?.compras_internas_exentas, plantilla?.comprasInternasExentas));
        putNumber('internaciones_exentas_no_sujetas', firstDefined(plantilla?.internaciones_exentas_no_sujetas, plantilla?.internacionesExentasNoSujetas));
        putNumber('ventas_internas_gravadas', firstDefined(plantilla?.ventas_internas_gravadas, plantilla?.ventasInternasGravadas));
        putNumber('internaciones_gravadas_bienes', firstDefined(plantilla?.internaciones_gravadas_bienes, plantilla?.internacionesGravadasBienes));
        putNumber('importaciones_gravadas_bienes', firstDefined(plantilla?.importaciones_gravadas_bienes, plantilla?.importacionesGravadasBienes));
        putNumber('importaciones_gravadas_servicio', firstDefined(plantilla?.importaciones_gravadas_servicio, plantilla?.importacionesGravadasServicio));
        putNumber('credito_fiscal', firstDefined(plantilla?.credito_fiscal, plantilla?.creditoFiscal));
        putNumber('total_compras', firstDefined(plantilla?.total_compras, plantilla?.totalCompras));

        // Renta (dropdowns)
        const renta = plantilla?.renta ?? {};
        putNumber('tipo_operacion_renta', firstDefined(renta?.tipo_operacion, renta?.tipoOperacion, plantilla?.tipo_operacion_renta, plantilla?.tipoOperacionRenta));
        putNumber('clasificacion_renta', firstDefined(renta?.clasificacion, plantilla?.clasificacion_renta, plantilla?.clasificacionRenta));
        putNumber('sector_renta', firstDefined(renta?.sector, plantilla?.sector_renta, plantilla?.sectorRenta));
        putNumber('tipo_costo_gasto_renta', firstDefined(renta?.tipo_costo_gasto, renta?.tipoCostoGasto, plantilla?.tipo_costo_gasto_renta, plantilla?.tipoCostoGastoRenta));
        put('numero_anexo', firstDefined(renta?.numero_anexo, renta?.numeroAnexo, plantilla?.numero_anexo, plantilla?.numeroAnexo));

        const result = await db('purchases').insert(JsontoDB);
        console.log(result);
        return res.status(201).json({ message: 'compra creada' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error?.message ?? error });
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
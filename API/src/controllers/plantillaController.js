const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const plantillacreate = async(req, res) => {
    const plantilla = req.body;
    /* id_emisor in the headers*/
    const id_emisor = req.headers.id_emisor;

    const JsontoDB = {
        tipo: plantilla.identificacion.tipoDte,
        codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
        sellado: 0,
        sello: null,
        numero_de_control: plantilla.identificacion.numeroControl,
        sello_de_recepcion: null,
        modelo_de_factura: plantilla.identificacion.tipoModelo,
        tipo_de_transmision: plantilla.identificacion.tipoTransmision,
        fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi + plantilla.identificacion.horEmi,
        id_emisor: id_emisor,
        id_receptor: null,
        /* TODO */
        qr: null,
        ventas_no_subjetas: "0",
        total_agravada: plantilla.resumen.totalGravada,
        subtotal: plantilla.resumen.subTotal,
        monto_global_de_descuento: plantilla.resumen.totalDescu,
        iva_percibido: plantilla.resumen.totalIva,
        /* Change name to total iva */
        iva_retenido: plantilla.resumen.ivaRete1,
        retencion_de_renta: plantilla.resumen.reteRenta,
        total_a_pagar: plantilla.resumen.totalPagar,
        cantidad_en_letras: plantilla.resumen.totalLetras,
        /* -------------------------------------------- TODO review */
        observaciones: null,
        condicion_operacion: null,
        responsable_emisor: null,
        documento_e: null,
        documento_r: null,
        documento_receptor: null,
        /* -------------------------------------------- TODO review */
        firm: null,
        /* IN THE NEXT STEP  */
        re_nit: null,
        /* TODO */
        re_nrc: plantilla.receptor.nrc,
        re_actividad_economica: plantilla.receptor.descActividad,
        re_direccion: plantilla.receptor.direccion,
        re_correo_electronico: plantilla.receptor.correo,
        re_nombre_comercial: null,
        /* TODO */
        re_name: plantilla.receptor.nombre,
        re_numero_telefono: plantilla.receptor.telefono,
        re_tipo_establecimiento: null /* TODO */
    };

    try {
        const [createdPlantilla] = await db('plantilla').returning('id').insert(JsontoDB).returning('*');

        res.status(201).json(createdPlantilla);
    } catch (error) {
        console.error('Error al crear plantilla:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//get all plantillas where by user id
const getPlantillasByUserId = async(req, res) => {
    console.log('getPlantillasByUserId');
    const usuarioid = req.params.id;
    try {
        //return all plantillas by user id
        const plantilla = await db('plantilla').where({ id_emisor: usuarioid });
        if (!plantilla) {
            return res.status(404).json({ message: 'plantilla no encontrado' });
        }
        console.log(plantilla);
        res.status(200).json(plantilla);
    } catch (error) {
        console.error('Error al obtener plantilla por ID', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

/* update the plantilla with codigo_de_generacion */

const updatePlantilla = async(req, res) => {
        const codigo_de_generacion = req.params.codigo_de_generacion;
        const plantilla = req.body;
        const id_emisor = req.headers.id_emisor;
        console.log('updatePlantilla');
        console.log(codigo_de_generacion);


        const JsontoDB = {
            tipo: plantilla.identificacion.tipoDte,
            codigo_de_generacion: plantilla.identificacion.codigoGeneracion,
            sellado: plantilla.sellado,
            sello: plantilla.sello,
            numero_de_control: plantilla.identificacion.numeroControl,
            sello_de_recepcion: null,
            modelo_de_factura: plantilla.identificacion.tipoModelo,
            tipo_de_transmision: plantilla.identificacion.tipoTransmision,
            fecha_y_hora_de_generacion: plantilla.identificacion.fecEmi + plantilla.identificacion.horEmi,
            id_emisor: id_emisor,
            id_receptor: null,
            /* TODO */
            qr: null,
            ventas_no_subjetas: "0",
            total_agravada: plantilla.resumen.totalGravada,
            subtotal: plantilla.resumen.subTotal,
            monto_global_de_descuento: plantilla.resumen.totalDescu,
            iva_percibido: plantilla.resumen.totalIva,
            /* Change name to total iva */
            iva_retenido: plantilla.resumen.ivaRete1,
            retencion_de_renta: plantilla.resumen.reteRenta,
            total_a_pagar: plantilla.resumen.totalPagar,
            cantidad_en_letras: plantilla.resumen.totalLetras,
            /* -------------------------------------------- TODO review */
            observaciones: null,
            condicion_operacion: null,
            responsable_emisor: null,
            documento_e: null,
            documento_r: null,
            documento_receptor: null,
            /* -------------------------------------------- TODO review */
            firm: plantilla.firma,
            /* IN THE NEXT STEP  */
            re_nit: null,
            /* TODO */
            re_nrc: plantilla.receptor.nrc,
            re_actividad_economica: plantilla.receptor.descActividad,
            re_direccion: plantilla.receptor.direccion,
            re_correo_electronico: plantilla.receptor.correo,
            re_nombre_comercial: null,
            /* TODO */
            re_name: plantilla.receptor.nombre,
            re_numero_telefono: plantilla.receptor.telefono,
            re_tipo_establecimiento: null /* TODO */
        };
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
    /* Count plantillas and count by id in params and type in headers  */
const countplantilla = async(req, res) => {
        console.log('countplantilla');
        console.log(req.params.id);
        console.log(req.headers.tipo);
        const usuarioid = req.params.id;
        const tipo = req.headers.tipo;
        try {
            const plantilla = await db('plantilla').where({ id_emisor: usuarioid, tipo: tipo }).count();
            if (!plantilla) {
                return res.status(404).json({ message: 'plantilla no encontrado' });
            }
            console.log(plantilla);
            res.status(200).json(plantilla);
        } catch (error) {
            console.error('Error al obtener plantilla por ID', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
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
    console.log('updatePlantillasend');
    try {
        const plantilla = await db('plantilla').where({ codigo_de_generacion: codigo_de_generacion }).first();
        if (!plantilla) {
            return res.status(404).json({ message: 'plantilla no encontrado' });
        }
        await db('plantilla').where({ codigo_de_generacion: codigo_de_generacion }).update({ sellado: selladotoggle, sello_de_recepcion: selloRecibido });
        res.status(200).json({ message: 'plantilla actualizado' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }

}

module.exports = {
    plantillacreate,
    getPlantillasByUserId,
    updatePlantilla,
    countplantilla,
    updatePlantillasend,
};
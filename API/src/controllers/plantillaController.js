const db = require('../db/db'); // Asegúrate de tener correctamente configurado el objeto Knex

const plantillacreate = async (req, res) => {
    const plantilla = req.body;
    /* id_emisor in the headers*/
    const id_emisor = req.headers.id_emisor;
 
    const JsontoDB ={
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
        id_receptor: null, /* TODO */
        qr: null,
        ventas_no_subjetas: "0",
        total_agravada: plantilla.resumen.totalGravada,
        subtotal: plantilla.resumen.subTotal,
        monto_global_de_descuento: plantilla.resumen.totalDescu,
        iva_percibido: plantilla.resumen.totalIva, /* Change name to total iva */
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
        firm: null, /* IN THE NEXT STEP  */
        re_nit: null,   /* TODO */
        re_nrc: plantilla.receptor.nrc,
        re_actividad_economica: plantilla.receptor.descActividad,
        re_direccion: plantilla.receptor.direccion,
        re_correo_electronico: plantilla.receptor.correo,
        re_nombre_comercial: null, /* TODO */
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
    const usuarioid = req.params.id;
    try {
        //return all plantillas by user id
        const plantilla = await db('plantilla').where({ id_usuario: usuarioid }).first();
        if (!plantilla) {
            return res.status(404).json({ message: 'plantilla no encontrado' });
        }
        res.status(200).json(plantilla);
    } catch (error) {

    }
};

module.exports = {
    plantillacreate,
    getPlantillasByUserId,
};
const db = require('../db/db');

const createProveedor = async (req, res) => {
    const proveedor = req.body;
    const userId = req.params.id;
    
    const proveedorData = {
        nit: proveedor.nit,
        nrc: proveedor.nrc,
        dui: proveedor.dui,
        actividad_economica: proveedor.actividad_economica,
        direccion: proveedor.direccion,
        correo_electronico: proveedor.correo_electronico,
        nombre_comercial: proveedor.nombre_comercial,
        id_usuario: userId,
        name: proveedor.name,
        numero_telefono: proveedor.numero_telefono,
        tipo_establecimiento: proveedor.tipo_establecimiento,
        departamento: proveedor.departamento,
        municipio: proveedor.municipio,
        otro: proveedor.otro,
    };
    
    try {
        console.log('Creando proveedor:', proveedor);
        const newProveedor = await db('proveedor').insert(proveedorData).returning('*');
        res.status(200).json({ message: 'Proveedor creado', data: newProveedor });
    } catch (error) {
        console.error('Error al crear proveedor', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getProveedorByUserId = async (req, res) => {
    const usuarioId = req.params.id;
    
    try {
        const proveedores = await db('proveedor').where({ id_usuario: usuarioId });
        
        if (!proveedores || proveedores.length === 0) {
            return res.status(404).json({ message: 'No se encontraron proveedores' });
        }
        
        res.status(200).json(proveedores);
    } catch (error) {
        console.error('Error al obtener proveedores por ID de usuario', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const putProveedor = async (req, res) => {
    console.log('Actualizando proveedor:', req.params.id);
    console.log('Request body:', req.body);
    const proveedorId = req.params.id;
    const proveedor = req.body;
    
    try {
        const proveedorOld = await db('proveedor').where({ id: proveedorId }).first();
        
        if (!proveedorOld) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        await db('proveedor').where({ id: proveedorId }).update(proveedor);
        
        res.status(200).json({ message: 'Proveedor actualizado' });
    } catch (error) {
        console.error('Error al actualizar proveedor', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

const deleteProveedor = async (req, res) => {
    const proveedorId = req.params.id;
    
    try {
        const proveedor = await db('proveedor').where({ id: proveedorId }).first();
        
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        
        await db('proveedor').where({ id: proveedorId }).del();
        
        res.status(200).json({ message: 'Proveedor eliminado' });
    } catch (error) {
        console.error('Error al eliminar proveedor', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    createProveedor,
    getProveedorByUserId,
    putProveedor,
    deleteProveedor,
};

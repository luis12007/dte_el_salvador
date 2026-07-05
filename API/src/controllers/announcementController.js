const db = require('../db/db');

const getRequestRole = (user = {}) => user.role ?? user.rol ?? user.id_rol ?? user.tipo_usuario ?? user.tipoUsuario ?? user.user_role ?? null;

const isAdmin = (user = {}) => {
  const role = getRequestRole(user);
  return Number(role) === 1 || Number(user.id) === 1;
};

// Garantiza que la fila de configuración (id = 1) exista y la retorna.
const getConfigRow = async () => {
  let row = await db('announcements').where({ id: 1 }).first();
  if (!row) {
    [row] = await db('announcements')
      .returning('*')
      .insert({ id: 1, message: '', enabled: false, version: 1 });
  }
  return row;
};

// Público (autenticado): lo que ven los clientes en el home principal.
const getCurrentAnnouncement = async (req, res) => {
  try {
    const row = await getConfigRow();
    return res.status(200).json({
      message: row.message || '',
      enabled: Boolean(row.enabled),
      version: Number(row.version) || 1,
    });
  } catch (error) {
    console.error('Error al obtener el anuncio actual', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Admin: obtiene la configuración completa para editarla.
const getAnnouncement = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const row = await getConfigRow();
    return res.status(200).json(row);
  } catch (error) {
    console.error('Error al obtener el anuncio', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Admin: actualiza mensaje y/o toggle. Cada cambio incrementa la versión
// para que los clientes vuelvan a ver el anuncio una sola vez.
const updateAnnouncement = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const { message, enabled } = req.body;

  try {
    const row = await getConfigRow();

    const nextMessage = message !== undefined ? String(message) : row.message;
    const nextEnabled = enabled !== undefined ? Boolean(enabled) : Boolean(row.enabled);

    // Solo se sube la versión si cambia el contenido del mensaje o se
    // (re)activa; así un toggle off/on con el mismo texto vuelve a mostrarlo.
    const contentChanged = nextMessage !== row.message;
    const turnedOn = nextEnabled && !row.enabled;
    const nextVersion = contentChanged || turnedOn ? Number(row.version) + 1 : Number(row.version);

    const [updated] = await db('announcements')
      .where({ id: 1 })
      .update({
        message: nextMessage,
        enabled: nextEnabled,
        version: nextVersion,
        updated_by: req.user?.id || null,
        updated_at: new Date(),
      })
      .returning('*');

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error al actualizar el anuncio', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getCurrentAnnouncement,
  getAnnouncement,
  updateAnnouncement,
};

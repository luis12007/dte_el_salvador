const db = require('../db/db');
const { notifyFirstSupportMessage, notifyEveryCustomerMessage } = require('../utils/supportNotifications');

// Inicio del día (00:00 hora El Salvador, UTC-6) expresado en UTC.
const getSVStartOfDayUTC = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/El_Salvador',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date())
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
  // Medianoche en El Salvador = 06:00 UTC del mismo día.
  return new Date(`${parts.year}-${parts.month}-${parts.day}T06:00:00.000Z`);
};

const getRequestRole = (user = {}) => user.role ?? user.rol ?? user.id_rol ?? user.tipo_usuario ?? user.tipoUsuario ?? user.user_role ?? null;

const isSupportAdmin = (user = {}) => {
  const role = getRequestRole(user);
  return Number(role) === 1 || Number(user.id) === 1;
};

const canAccessThread = (req, userId) => isSupportAdmin(req.user) || String(req.user?.id) === String(userId);

const getSupportMessages = async (req, res) => {
  const userId = req.params.userId;

  if (!canAccessThread(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const messages = await db('support_chat_messages')
      .where({ user_id: userId })
      .orderBy('created_at', 'asc')
      .orderBy('id', 'asc');

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes de soporte', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getSupportThreads = async (req, res) => {
  if (!isSupportAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const messages = await db('support_chat_messages')
      .select('*')
      .orderBy('created_at', 'desc')
      .orderBy('id', 'desc');

    const unreadByUser = await db('support_chat_messages')
      .select('user_id')
      .count('* as unread_count')
      .where({ sender_role: 'user', is_read: false })
      .groupBy('user_id');

    const unreadMap = unreadByUser.reduce((acc, row) => {
      acc[row.user_id] = Number(row.unread_count || 0);
      return acc;
    }, {});

    const threads = [];
    const seenUsers = new Set();

    messages.forEach((message) => {
      if (seenUsers.has(message.user_id)) {
        return;
      }

      seenUsers.add(message.user_id);
      threads.push({
        user_id: message.user_id,
        sender_name: message.sender_name,
        last_message: message.message,
        last_sender_role: message.sender_role,
        last_message_at: message.created_at,
        unread_count: unreadMap[message.user_id] || 0,
      });
    });

    return res.status(200).json(threads);
  } catch (error) {
    console.error('Error al obtener hilos de soporte', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const sendSupportMessage = async (req, res) => {
  const userId = req.params.userId;
  const { message } = req.body;

  if (!canAccessThread(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: 'El mensaje es obligatorio' });
  }

  const senderRole = isSupportAdmin(req.user) ? 'support' : 'user';

  try {
    const payload = {
      user_id: userId,
      sender_id: req.user?.id || 0,
      sender_name: req.user?.usuario || (senderRole === 'support' ? 'Soporte' : 'Usuario'),
      sender_role: senderRole,
      message: String(message).trim(),
      is_read: senderRole === 'support',
      updated_at: new Date(),
    };

    const [createdMessage] = await db('support_chat_messages')
      .returning('*')
      .insert(payload);

    // Si es mensaje de un cliente, notificar por correo (cada mensaje, no solo el primero del día).
    if (senderRole === 'user') {
      try {
        // Fire-and-forget: un fallo de correo no debe romper el guardado.
        notifyEveryCustomerMessage({
          userId,
          senderName: createdMessage.sender_name,
          message: createdMessage.message,
          createdAt: createdMessage.created_at,
        }).catch((mailError) => {
          console.error('Error al notificar mensaje de soporte por correo', mailError);
        });
      } catch (notifyError) {
        console.error('Error al notificar mensaje de soporte', notifyError);
      }
    }

    return res.status(201).json(createdMessage);
  } catch (error) {
    console.error('Error al crear mensaje de soporte', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const markThreadRead = async (req, res) => {
  const userId = req.params.userId;

  if (!canAccessThread(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const readerRole = isSupportAdmin(req.user) ? 'support' : 'user';

  try {
    const query = db('support_chat_messages').where({ user_id: userId });

    if (readerRole === 'support') {
      await query.where({ sender_role: 'user', is_read: false }).update({ is_read: true, updated_at: new Date() });
    } else {
      await query.where({ sender_role: 'support', is_read: false }).update({ is_read: true, updated_at: new Date() });
    }

    return res.status(200).json({ message: 'Hilo marcado como leído' });
  } catch (error) {
    console.error('Error al marcar hilo como leído', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getSupportMessages,
  getSupportThreads,
  sendSupportMessage,
  markThreadRead,
};
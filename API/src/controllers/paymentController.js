const db = require('../db/db');
const PDFDocument = require('pdfkit');

const getRequestRole = (user = {}) => user.role ?? user.rol ?? user.id_rol ?? user.tipo_usuario ?? user.tipoUsuario ?? user.user_role ?? null;

const isAdmin = (user = {}) => {
  const role = getRequestRole(user);
  return Number(role) === 1 || Number(user.id) === 1;
};

const canAccess = (req, userId) => isAdmin(req.user) || String(req.user?.id) === String(userId);

// Reglas del ciclo de pago del servicio.
const DUE_DAY = 15; // Todos pagan el 15 de cada mes.
const GRACE_DAYS = 7; // 7 días de gracia -> bloqueo el día 22.
const NOTIFY_BEFORE = 3; // Se notifica 3 días antes del vencimiento.
const BLOCK_DAY = DUE_DAY + GRACE_DAYS;
const PLACEHOLDER_AMOUNT = 25.0; // Monto placeholder mientras no se define por cliente.

// Partes de fecha en la zona horaria de El Salvador (UTC-6), independientes
// de la zona del servidor (Railway corre en UTC).
const getSVDateParts = () => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/El_Salvador',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date()).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    period: `${parts.year}-${parts.month}`,
  };
};

const currentPeriod = () => getSVDateParts().period;

// Etiqueta legible de un periodo 'YYYY-MM' -> 'julio 2026'.
const periodLabel = (period) => {
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const [year, month] = String(period || '').split('-');
  const idx = Number(month) - 1;
  if (idx < 0 || idx > 11) {
    return period;
  }
  return `${months[idx]} ${year}`;
};

// Deriva el estado de notificación a partir de si pagó y el día del mes.
const deriveState = (paid, dayOfMonth) => {
  if (paid) {
    return { state: 'al_dia', daysUntilDue: null, daysUntilBlock: null, blocked: false };
  }
  if (dayOfMonth < DUE_DAY - NOTIFY_BEFORE) {
    return { state: 'al_dia', daysUntilDue: DUE_DAY - dayOfMonth, daysUntilBlock: null, blocked: false };
  }
  if (dayOfMonth >= DUE_DAY - NOTIFY_BEFORE && dayOfMonth < DUE_DAY) {
    return { state: 'proximo', daysUntilDue: DUE_DAY - dayOfMonth, daysUntilBlock: null, blocked: false };
  }
  if (dayOfMonth === DUE_DAY) {
    return { state: 'dia_de_pago', daysUntilDue: 0, daysUntilBlock: BLOCK_DAY - dayOfMonth, blocked: false };
  }
  if (dayOfMonth > DUE_DAY && dayOfMonth < BLOCK_DAY) {
    return { state: 'pendiente', daysUntilDue: 0, daysUntilBlock: BLOCK_DAY - dayOfMonth, blocked: false };
  }
  return { state: 'vencido', daysUntilDue: 0, daysUntilBlock: 0, blocked: true };
};

const getSubscriptionAmount = async (userId) => {
  const config = await db('subscription_config').where({ user_id: userId }).first();
  if (config) {
    return { amount: Number(config.amount), active: Boolean(config.active), configured: true };
  }
  return { amount: PLACEHOLDER_AMOUNT, active: true, configured: false };
};

// Verifica si hay pagos pendientes en los últimos 2 meses
const hasPendingPreviousPayments = async (userId, currentPeriod) => {
  try {
    const [year, month] = currentPeriod.split('-').map(Number);
    const previousMonths = [];

    // Mes anterior
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    previousMonths.push(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);

    // 2 meses atrás
    prevMonth -= 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    previousMonths.push(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);

    // Busca pagos pendientes en esos períodos
    const pending = await db('service_payments')
      .where({ user_id: userId })
      .whereIn('period', previousMonths)
      .where('status', 'pending')
      .first();

    return Boolean(pending);
  } catch (error) {
    console.error('Error al verificar pagos pendientes anteriores', error);
    return false;
  }
};

// -------------------------------------------------------------------------
// Estado del ciclo de pago (usado por las notificaciones).
// -------------------------------------------------------------------------
const getPaymentStatus = async (req, res) => {
  const userId = req.params.userId;
  if (!canAccess(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const parts = getSVDateParts();
    const confirmed = await db('service_payments')
      .where({ user_id: userId, period: parts.period, status: 'confirmed' })
      .first();

    const paid = Boolean(confirmed);
    const derived = deriveState(paid, parts.day);

    // Bloquea si hay pagos pendientes en los últimos 2 meses
    const hasPendingPrevious = await hasPendingPreviousPayments(userId, parts.period);
    if (hasPendingPrevious) {
      derived.blocked = true;
      derived.state = 'vencido';
    }

    return res.status(200).json({
      period: parts.period,
      dueDay: DUE_DAY,
      graceDays: GRACE_DAYS,
      blockDay: BLOCK_DAY,
      dayOfMonth: parts.day,
      paid,
      hasPendingPreviousPayments: hasPendingPrevious,
      ...derived,
    });
  } catch (error) {
    console.error('Error al obtener el estado de pago', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// -------------------------------------------------------------------------
// Datos de suscripción (monto del mes + estado) para la pantalla de pago.
// -------------------------------------------------------------------------
const getSubscription = async (req, res) => {
  const userId = req.params.userId;
  if (!canAccess(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const period = currentPeriod();
    const { amount, active, configured } = await getSubscriptionAmount(userId);

    const periodPayment = await db('service_payments')
      .where({ user_id: userId, period })
      .orderBy('id', 'desc')
      .first();

    return res.status(200).json({
      period,
      periodLabel: periodLabel(period),
      amount,
      active,
      configured,
      dueDay: DUE_DAY,
      currentPayment: periodPayment
        ? {
            id: periodPayment.id,
            status: periodPayment.status,
            method: periodPayment.method,
            created_at: periodPayment.created_at,
            confirmed_at: periodPayment.confirmed_at,
          }
        : null,
    });
  } catch (error) {
    console.error('Error al obtener la suscripción', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// -------------------------------------------------------------------------
// Cliente: enviar comprobante de transferencia.
// -------------------------------------------------------------------------
const submitTransfer = async (req, res) => {
  const userId = req.params.userId;
  if (!canAccess(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const { proof, proof_mime, proof_name, reference, note } = req.body;

  if (!proof || !String(proof).trim()) {
    return res.status(400).json({ message: 'El comprobante es obligatorio' });
  }

  try {
    const period = currentPeriod();
    const { amount } = await getSubscriptionAmount(userId);

    const existing = await db('service_payments')
      .where({ user_id: userId, period })
      .orderBy('id', 'desc')
      .first();

    if (existing && existing.status === 'confirmed') {
      return res.status(409).json({ message: 'El pago de este mes ya fue confirmado.' });
    }

    const payload = {
      user_id: userId,
      period,
      status: 'pending',
      method: 'transfer',
      amount,
      reference: reference ? String(reference).trim() : null,
      proof: String(proof),
      proof_mime: proof_mime || null,
      proof_name: proof_name || null,
      note: note ? String(note).trim() : null,
      reviewed_by: null,
      confirmed_at: null,
      updated_at: new Date(),
    };

    let result;
    if (existing) {
      [result] = await db('service_payments').where({ id: existing.id }).update(payload).returning('*');
    } else {
      [result] = await db('service_payments').insert(payload).returning('*');
    }

    // No devolver el base64 del comprobante en la respuesta.
    delete result.proof;
    return res.status(201).json(result);
  } catch (error) {
    console.error('Error al enviar el comprobante', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// -------------------------------------------------------------------------
// Historial de pagos del cliente (para descargar tickets).
// -------------------------------------------------------------------------
const getMyPayments = async (req, res) => {
  const userId = req.params.userId;
  if (!canAccess(req, userId)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  try {
    const rows = await db('service_payments')
      .where({ user_id: userId })
      .orderBy('period', 'desc')
      .orderBy('id', 'desc');

    const payments = rows.map((row) => ({
      id: row.id,
      period: row.period,
      periodLabel: periodLabel(row.period),
      status: row.status,
      method: row.method,
      amount: Number(row.amount || 0),
      reference: row.reference,
      has_proof: Boolean(row.proof),
      proof_mime: row.proof_mime,
      created_at: row.created_at,
      confirmed_at: row.confirmed_at,
    }));

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Error al obtener el historial de pagos', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// -------------------------------------------------------------------------
// Comprobante subido (imagen/PDF) - dueño o admin.
// -------------------------------------------------------------------------
const getProof = async (req, res) => {
  const paymentId = req.params.paymentId;

  try {
    const payment = await db('service_payments').where({ id: paymentId }).first();
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    if (!canAccess(req, payment.user_id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (!payment.proof) {
      return res.status(404).json({ message: 'Sin comprobante' });
    }

    return res.status(200).json({
      id: payment.id,
      proof: payment.proof,
      proof_mime: payment.proof_mime,
      proof_name: payment.proof_name,
    });
  } catch (error) {
    console.error('Error al obtener el comprobante', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// -------------------------------------------------------------------------
// Ticket PDF (no válido como documento fiscal) - dueño o admin.
// -------------------------------------------------------------------------
const getTicket = async (req, res) => {
  const paymentId = req.params.paymentId;

  try {
    const payment = await db('service_payments').where({ id: paymentId }).first();
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    if (!canAccess(req, payment.user_id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    if (payment.status !== 'confirmed') {
      return res.status(400).json({ message: 'El ticket solo está disponible para pagos confirmados.' });
    }

    const userDB = await db('usuario')
      .leftJoin('emisor', 'usuario.id', 'emisor.id_usuario')
      .where('usuario.id', payment.user_id)
      .first();
    const clientName = (userDB && (userDB.name || userDB.usuario)) || `Usuario #${payment.user_id}`;

    const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="ticket-${payment.period}.pdf"`);
    doc.pipe(res);

    const brand = '#1E3256';
    const money = (v) => `$${Number(v || 0).toFixed(2)}`;

    // Encabezado
    doc.rect(0, 0, doc.page.width, 110).fill(brand);
    doc.fillColor('#FFFFFF').fontSize(20).text('Comprobante de Pago de Servicio', 50, 40);
    doc.fontSize(10).fillColor('#D6DEEC').text('Documento informativo - no válido como comprobante fiscal (DTE/CFE)', 50, 70);

    doc.fillColor('#000000');
    let y = 150;
    const line = (label, value) => {
      doc.fontSize(11).fillColor('#6B7280').text(label, 50, y);
      doc.fontSize(13).fillColor('#111827').text(String(value), 50, y + 15);
      y += 48;
    };

    line('Ticket N.º', String(payment.id).padStart(6, '0'));
    line('Cliente', clientName);
    line('Periodo', periodLabel(payment.period));
    line('Método', payment.method === 'card' ? 'Tarjeta' : 'Transferencia bancaria');
    if (payment.reference) {
      line('Referencia', payment.reference);
    }
    line('Fecha de confirmación', payment.confirmed_at ? new Date(payment.confirmed_at).toLocaleString('es-ES') : '-');

    // Total destacado
    y += 10;
    doc.rect(50, y, doc.page.width - 100, 60).fill('#F1F5F9');
    doc.fillColor('#6B7280').fontSize(12).text('Monto pagado', 70, y + 12);
    doc.fillColor(brand).fontSize(26).text(money(payment.amount), 70, y + 26);

    doc.fillColor('#9CA3AF').fontSize(9).text('Generado automáticamente por el sistema.', 50, doc.page.height - 70, {
      align: 'center',
      width: doc.page.width - 100,
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar el ticket', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

// -------------------------------------------------------------------------
// ADMIN
// -------------------------------------------------------------------------

// Lista de clientes con su monto y el estado del periodo indicado.
const adminListClients = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const period = req.query.period || currentPeriod();

  try {
    const users = await db('usuario as u')
      .leftJoin('emisor as e', 'e.id_usuario', 'u.id')
      .leftJoin('subscription_config as sc', 'sc.user_id', 'u.id')
      // Solo clientes en producción (ambiente '01'); '00' es pruebas.
      .where('u.ambiente', '01')
      .select(
        'u.id as user_id',
        'u.usuario as username',
        'e.name as name',
        'sc.amount as amount',
        'sc.active as active'
      );

    const payments = await db('service_payments').where({ period }).orderBy('id', 'desc');
    const paymentByUser = {};
    payments.forEach((p) => {
      if (!paymentByUser[p.user_id]) {
        paymentByUser[p.user_id] = p;
      }
    });

    const clients = users.map((u) => {
      const p = paymentByUser[u.user_id];
      return {
        user_id: u.user_id,
        username: u.username,
        name: u.name || u.username,
        amount: u.amount != null ? Number(u.amount) : PLACEHOLDER_AMOUNT,
        configured: u.amount != null,
        active: u.active == null ? true : Boolean(u.active),
        payment: p
          ? {
              id: p.id,
              status: p.status,
              method: p.method,
              has_proof: Boolean(p.proof),
              created_at: p.created_at,
              confirmed_at: p.confirmed_at,
            }
          : null,
        period_status: p ? p.status : 'none',
      };
    });

    return res.status(200).json({ period, periodLabel: periodLabel(period), clients });
  } catch (error) {
    console.error('Error al listar clientes', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Historial de pagos de un cliente (admin).
const adminGetUserPayments = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const userId = req.params.userId;

  try {
    const rows = await db('service_payments')
      .where({ user_id: userId })
      .orderBy('period', 'desc')
      .orderBy('id', 'desc');

    const payments = rows.map((row) => ({
      id: row.id,
      period: row.period,
      periodLabel: periodLabel(row.period),
      status: row.status,
      method: row.method,
      amount: Number(row.amount || 0),
      reference: row.reference,
      note: row.note,
      has_proof: Boolean(row.proof),
      proof_mime: row.proof_mime,
      created_at: row.created_at,
      confirmed_at: row.confirmed_at,
    }));

    return res.status(200).json(payments);
  } catch (error) {
    console.error('Error al obtener pagos del cliente', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Confirmar o rechazar un pago.
const adminReviewPayment = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const paymentId = req.params.paymentId;
  const { action, note } = req.body;

  if (!['confirm', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Acción inválida' });
  }

  try {
    const payment = await db('service_payments').where({ id: paymentId }).first();
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    const update = {
      status: action === 'confirm' ? 'confirmed' : 'rejected',
      reviewed_by: req.user?.id || null,
      confirmed_at: action === 'confirm' ? new Date() : null,
      note: note ? String(note).trim() : payment.note,
      updated_at: new Date(),
    };

    const [updated] = await db('service_payments').where({ id: paymentId }).update(update).returning('*');
    delete updated.proof;
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error al revisar el pago', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Editar el monto de suscripción de un cliente (lista de precios).
const adminSetAmount = async (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'No autorizado' });
  }

  const userId = req.params.userId;
  const { amount, active } = req.body;

  if (amount == null || Number.isNaN(Number(amount)) || Number(amount) < 0) {
    return res.status(400).json({ message: 'Monto inválido' });
  }

  try {
    const existing = await db('subscription_config').where({ user_id: userId }).first();
    const payload = {
      amount: Number(amount),
      active: active == null ? true : Boolean(active),
      updated_at: new Date(),
    };

    let result;
    if (existing) {
      [result] = await db('subscription_config').where({ user_id: userId }).update(payload).returning('*');
    } else {
      [result] = await db('subscription_config')
        .insert({ user_id: userId, ...payload })
        .returning('*');
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error al actualizar el monto', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getPaymentStatus,
  getSubscription,
  submitTransfer,
  getMyPayments,
  getProof,
  getTicket,
  adminListClients,
  adminGetUserPayments,
  adminReviewPayment,
  adminSetAmount,
};

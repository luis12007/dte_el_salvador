const nodemailer = require('nodemailer');

// Correo al que se avisa cuando un cliente escribe
const NOTIFY_TO = 'luishdezmtz12@gmail.com';

// Cuenta mysoftwaresv para enviar notificaciones
const FROM = 'mysoftwaresv@gmail.com';

// URLs del panel (SPA con HashRouter) a las que apuntan los botones de los correos.
const SUPPORT_PANEL_URL = 'https://cliente-production-e629.up.railway.app/#/testadmin/support-chat';
const PAYMENTS_PANEL_URL = 'https://cliente-production-e629.up.railway.app/#/testadmin/pagos';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM,
    pass: 'ajbh eozh iltf oinf',
  },
});

// Los mensajes con adjunto se guardan como JSON { text, attachment }.
const extractText = (raw) => {
  if (!raw) {
    return '';
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && (parsed.text !== undefined || parsed.attachment !== undefined)) {
      let text = parsed.text || '';
      if (parsed.attachment) {
        text += (text ? '\n' : '') + '[Imagen adjunta]';
      }
      return text || '[Imagen adjunta]';
    }
  } catch {
    /* no es JSON, es texto plano */
  }
  return String(raw);
};

// Avisa por correo el primer mensaje del día de un cliente. No bloqueante.
const notifyFirstSupportMessage = async ({ userId, senderName, message, createdAt }) => {
  const text = extractText(message);
  const when = new Date(createdAt || Date.now()).toLocaleString('es-ES', {
    timeZone: 'America/El_Salvador',
  });
  const cliente = senderName || 'Usuario';

  const mailOptions = {
    from: FROM,
    to: NOTIFY_TO,
    subject: `Nuevo mensaje de soporte - ${cliente} (#${userId})`,
    text:
      `Primer mensaje del día en el chat de soporte.\n\n` +
      `Cliente: ${cliente} (ID ${userId})\n` +
      `Fecha: ${when}\n\n` +
      `Mensaje:\n${text}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="background:#395576;color:#fff;padding:16px 20px">
          <h2 style="margin:0;font-size:18px">Nuevo mensaje de soporte</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:.85">Primer mensaje del día de este cliente</p>
        </div>
        <div style="padding:20px;color:#111827">
          <p style="margin:0 0 6px"><strong>Cliente:</strong> ${cliente} (ID ${userId})</p>
          <p style="margin:0 0 14px"><strong>Fecha:</strong> ${when}</p>
          <div style="background:#f1f5f9;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:14px;color:#1f2937">${text.replace(/</g, '&lt;')}</div>
        </div>
        <div style="padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280">
          <a href="${SUPPORT_PANEL_URL}" style="color:#395576;text-decoration:none;font-weight:bold">Responder en el panel de soporte →</a>
        </div>
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};

// Avisa por correo CADA mensaje nuevo de un cliente (no solo el primero del día). No bloqueante.
const notifyEveryCustomerMessage = async ({ userId, senderName, message, createdAt }) => {
  const text = extractText(message);
  const when = new Date(createdAt || Date.now()).toLocaleString('es-ES', {
    timeZone: 'America/El_Salvador',
  });
  const cliente = senderName || 'Usuario';

  const mailOptions = {
    from: FROM,
    to: NOTIFY_TO,
    subject: `📨 Nuevo mensaje de ${cliente} (#${userId})`,
    text:
      `Nuevo mensaje en el chat de soporte.\n\n` +
      `Cliente: ${cliente} (ID ${userId})\n` +
      `Fecha: ${when}\n\n` +
      `Mensaje:\n${text}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="background:#1E3256;color:#fff;padding:16px 20px">
          <h2 style="margin:0;font-size:18px">📨 Nuevo mensaje de soporte</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:.85">Mensaje recibido de un cliente</p>
        </div>
        <div style="padding:20px;color:#111827">
          <p style="margin:0 0 6px"><strong>Cliente:</strong> ${cliente} (ID ${userId})</p>
          <p style="margin:0 0 14px"><strong>Fecha:</strong> ${when}</p>
          <div style="background:#f1f5f9;border-radius:10px;padding:14px;white-space:pre-wrap;font-size:14px;color:#1f2937;border-left:4px solid #1E3256">${text.replace(/</g, '&lt;')}</div>
        </div>
        <div style="padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280">
          <a href="${SUPPORT_PANEL_URL}" style="color:#1E3256;text-decoration:none;font-weight:bold">Responder en el panel de soporte →</a>
        </div>
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};

// Avisa por correo cada vez que un cliente envía un pago (comprobante de transferencia). No bloqueante.
const notifyNewPaymentSubmission = async ({ userId, clienteNombre, amount, period, reference, createdAt }) => {
  const when = new Date(createdAt || Date.now()).toLocaleString('es-ES', {
    timeZone: 'America/El_Salvador',
  });
  const cliente = clienteNombre || `Usuario #${userId}`;
  const montoTexto = `$${Number(amount || 0).toFixed(2)}`;

  const mailOptions = {
    from: FROM,
    to: NOTIFY_TO,
    subject: `💳 Nuevo pago de ${cliente} (#${userId})`,
    text:
      `Un cliente envió un comprobante de pago.\n\n` +
      `Cliente: ${cliente} (ID ${userId})\n` +
      `Periodo: ${period}\n` +
      `Monto: ${montoTexto}\n` +
      `Referencia: ${reference || 'N/A'}\n` +
      `Fecha: ${when}`,
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
        <div style="background:#166534;color:#fff;padding:16px 20px">
          <h2 style="margin:0;font-size:18px">💳 Nuevo pago recibido</h2>
          <p style="margin:4px 0 0;font-size:12px;opacity:.85">Comprobante enviado por un cliente</p>
        </div>
        <div style="padding:20px;color:#111827">
          <p style="margin:0 0 6px"><strong>Cliente:</strong> ${cliente} (ID ${userId})</p>
          <p style="margin:0 0 6px"><strong>Periodo:</strong> ${period}</p>
          <p style="margin:0 0 6px"><strong>Monto:</strong> ${montoTexto}</p>
          <p style="margin:0 0 6px"><strong>Referencia:</strong> ${reference || 'N/A'}</p>
          <p style="margin:0 0 14px"><strong>Fecha:</strong> ${when}</p>
        </div>
        <div style="padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#6b7280">
          <a href="${PAYMENTS_PANEL_URL}" style="color:#166534;text-decoration:none;font-weight:bold">Revisar en el panel de pagos →</a>
        </div>
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { notifyFirstSupportMessage, notifyEveryCustomerMessage, notifyNewPaymentSubmission };

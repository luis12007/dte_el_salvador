const nodemailer = require('nodemailer');

// Correo al que se avisa cuando un cliente escribe por primera vez en el día.
const NOTIFY_TO = 'luishdezmtz12@gmail.com';

// Cuenta por defecto de la API (mysoftware). La contraseña de aplicación
// se toma de variable de entorno; NO debe hardcodearse en el repo.
const FROM = process.env.MAIL_USER || 'mysoftwaresv@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: FROM,
    pass: process.env.MAIL_PASS,
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
      </div>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { notifyFirstSupportMessage };

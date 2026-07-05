const BASE_URL = "https://intuitive-bravery-production.up.railway.app";

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

const parseJson = async (res) => {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {
      /* noop */
    }
    throw new Error(message);
  }
  return res.json();
};

const PaymentService = {
  // Estado del ciclo de pago del usuario (para las notificaciones).
  getStatus: async (userId, token) => {
    const res = await fetch(`${BASE_URL}/payments/status/${userId}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  // Datos de suscripción: monto del mes + estado del periodo.
  getSubscription: async (userId, token) => {
    const res = await fetch(`${BASE_URL}/payments/subscription/${userId}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  // Cliente: enviar comprobante de transferencia (dataURL base64).
  submitTransfer: async (userId, token, payload) => {
    const res = await fetch(`${BASE_URL}/payments/transfer/${userId}`, {
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return parseJson(res);
  },

  // Historial de pagos del cliente.
  getMyPayments: async (userId, token) => {
    const res = await fetch(`${BASE_URL}/payments/mine/${userId}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  // Comprobante subido (imagen/PDF).
  getProof: async (paymentId, token) => {
    const res = await fetch(`${BASE_URL}/payments/proof/${paymentId}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  // Descargar / abrir el ticket PDF (devuelve un objeto URL para blob).
  getTicketBlobUrl: async (paymentId, token) => {
    const res = await fetch(`${BASE_URL}/payments/ticket/${paymentId}`, { headers: authHeaders(token) });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data?.message || message;
      } catch {
        /* noop */
      }
      throw new Error(message);
    }
    const blob = await res.blob();
    return window.URL.createObjectURL(blob);
  },

  // ---- Admin ----
  adminGetClients: async (token, period) => {
    const query = period ? `?period=${encodeURIComponent(period)}` : '';
    const res = await fetch(`${BASE_URL}/payments/admin/clients${query}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  adminGetUserPayments: async (userId, token) => {
    const res = await fetch(`${BASE_URL}/payments/admin/user/${userId}`, { headers: authHeaders(token) });
    return parseJson(res);
  },

  adminReview: async (paymentId, token, action, note) => {
    const res = await fetch(`${BASE_URL}/payments/admin/review/${paymentId}`, {
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, note }),
    });
    return parseJson(res);
  },

  adminSetAmount: async (userId, token, amount, active) => {
    const res = await fetch(`${BASE_URL}/payments/admin/amount/${userId}`, {
      method: 'PUT',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, active }),
    });
    return parseJson(res);
  },
};

export default PaymentService;

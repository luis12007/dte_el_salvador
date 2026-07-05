const BASE_URL = "https://intuitive-bravery-production.up.railway.app";

const AnnouncementService = {
  // Anuncio activo que ven los clientes en el home principal.
  getCurrent: async (token) => {
    const res = await fetch(`${BASE_URL}/announcements/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  },

  // Admin: configuración completa para editar.
  getAdmin: async (token) => {
    const res = await fetch(`${BASE_URL}/announcements`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  },

  // Admin: actualiza mensaje y/o toggle.
  update: async (token, { message, enabled }) => {
    const res = await fetch(`${BASE_URL}/announcements`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, enabled }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  },
};

export default AnnouncementService;

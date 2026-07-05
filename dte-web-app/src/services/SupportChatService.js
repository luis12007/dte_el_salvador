const BASE_URL = "https://intuitive-bravery-production.up.railway.app";

const parseResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const rawBody = await res.text();

  if (!res.ok) {
    const message = rawBody && contentType.includes('application/json')
      ? (() => {
          try {
            return JSON.parse(rawBody)?.message || rawBody;
          } catch {
            return rawBody;
          }
        })()
      : rawBody || `HTTP ${res.status}`;

    throw new Error(message);
  }

  if (!rawBody) {
    return null;
  }

  if (contentType.includes('application/json')) {
    return JSON.parse(rawBody);
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
};

const SupportChatService = {
  getThreads: async (token) => {
    const res = await fetch(`${BASE_URL}/support-chat/threads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return parseResponse(res);
  },

  getMessages: async (token, userId) => {
    const res = await fetch(`${BASE_URL}/support-chat/${userId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return parseResponse(res);
  },

  sendMessage: async (token, userId, message) => {
    const res = await fetch(`${BASE_URL}/support-chat/${userId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    });

    return parseResponse(res);
  },

  markThreadRead: async (token, userId) => {
    const res = await fetch(`${BASE_URL}/support-chat/${userId}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    return parseResponse(res);
  },
};

export default SupportChatService;
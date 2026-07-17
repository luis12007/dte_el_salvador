import { toast } from 'react-toastify';

let isRedirecting = false;
let lastRedirectTime = 0;
const REDIRECT_COOLDOWN = 1000; // Evitar múltiples redirecciones

const shouldRedirect = () => {
  const now = Date.now();
  if (now - lastRedirectTime < REDIRECT_COOLDOWN) {
    return false;
  }
  lastRedirectTime = now;
  return true;
};

/**
 * Limpia sesión completamente y redirige a login
 */
const performLogout = (message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.') => {
  if (!shouldRedirect() || isRedirecting) return;

  isRedirecting = true;

  // Limpiar TODOS los datos de sesión
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('ambiente');
  localStorage.removeItem('user_role');
  localStorage.removeItem('tokenminis');
  localStorage.removeItem('announcement_seen_version');

  // Mostrar mensaje de error
  toast.error(message, {
    autoClose: 5000,
    position: 'top-center',
  });

  console.warn('[Auth Logout]', message);

  // Redirigir a login después de mostrar mensaje
  setTimeout(() => {
    window.location.hash = '#/ingresar';
    isRedirecting = false;
  }, 1500);
};

export const setupAuthInterceptor = () => {
  // Interceptar fetch para detectar 401
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const [url, options = {}] = args;

    try {
      const response = await originalFetch(...args);

      // Detectar 401 Unauthorized - Token inválido/expirado
      if (response.status === 401) {
        console.warn('[Auth Interceptor] 401 Unauthorized:', url);
        performLogout('Tu sesión ha expirado. Credenciales inválidas. Por favor, inicia sesión nuevamente.');
        return response;
      }

      // Detectar 403 Forbidden - Sin permisos
      if (response.status === 403) {
        console.warn('[Auth Interceptor] 403 Forbidden:', url);
      }

      return response;
    } catch (error) {
      console.error('[Fetch Error]', error);
      throw error;
    }
  };

  // Interceptor para unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;

    // Detectar 401 en promise rejections
    if (
      reason?.statusCode === 401 ||
      reason?.response?.status === 401 ||
      (typeof reason?.message === 'string' && reason.message.includes('401'))
    ) {
      console.warn('[Unhandled Rejection] 401 detectado');
      performLogout('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      event.preventDefault();
    }
  });
};

export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  return !!(token && userId);
};

export const logout = (message = 'Sesión cerrada') => {
  performLogout(message);
};

export const isAuthenticated = () => {
  return checkAuthStatus() && !isRedirecting;
};

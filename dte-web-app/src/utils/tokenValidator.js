import { toast } from 'react-toastify';

/**
 * Verifica si el token es válido haciendo una petición simple
 */
export const validateToken = async (token, endpoint = '/plantillas/get/1?page=1&limit=1') => {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      `https://intuitive-bravery-production.up.railway.app${endpoint}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // 401 = Token inválido/expirado
    if (response.status === 401) {
      return false;
    }

    // 200-299 = Token válido
    if (response.ok) {
      return true;
    }

    // Otros errores (404, 500, etc.) no significa que token sea inválido
    return true;
  } catch (error) {
    // Error de conexión, no podemos validar
    return true; // Asumir válido para permitir reintentos
  }
};

/**
 * Limpia la sesión y redirige a login
 */
export const clearSessionAndRedirect = (message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.') => {
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('ambiente');
  localStorage.removeItem('user_role');
  localStorage.removeItem('tokenminis');

  // Mostrar mensaje
  toast.error(message, {
    autoClose: 5000,
    position: 'top-center',
  });

  // Esperar un poco para que vea el mensaje, luego redirigir
  setTimeout(() => {
    window.location.hash = '#/ingresar';
  }, 1500);
};

/**
 * Hook que verifica token antes de operación crítica
 */
export const checkTokenBeforeOperation = async (operation, operationName = 'operación') => {
  const token = localStorage.getItem('token');

  if (!token) {
    clearSessionAndRedirect('Debes iniciar sesión para realizar esta acción.');
    return false;
  }

  // Validar token
  const isValid = await validateToken(token);

  if (!isValid) {
    clearSessionAndRedirect('Tu sesión ha expirado. Credenciales inválidas. Por favor, inicia sesión nuevamente.');
    return false;
  }

  try {
    // Ejecutar operación
    return await operation();
  } catch (error) {
    // Si es 401 durante la operación, también logout
    if (error?.response?.status === 401 || error?.statusCode === 401) {
      clearSessionAndRedirect('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      return false;
    }
    throw error;
  }
};

/**
 * Wrapper para operaciones críticas
 */
export const withTokenValidation = (asyncFunction) => {
  return async (...args) => {
    const token = localStorage.getItem('token');

    if (!token) {
      clearSessionAndRedirect('Debes iniciar sesión para realizar esta acción.');
      throw new Error('NO_TOKEN');
    }

    const isValid = await validateToken(token);
    if (!isValid) {
      clearSessionAndRedirect('Tu sesión ha expirado. Credenciales inválidas. Por favor, inicia sesión nuevamente.');
      throw new Error('INVALID_TOKEN');
    }

    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        clearSessionAndRedirect('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        throw error;
      }
      throw error;
    }
  };
};

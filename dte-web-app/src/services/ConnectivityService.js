// Verifica si hay conexión a internet
const isOnline = () => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

// Verifica conectividad haciendo un ping al servidor
const checkConnectivity = async (timeout = 5000) => {
  if (!isOnline()) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch('/favicon.ico', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 404;
  } catch (error) {
    return false;
  }
};

// Wrapper para peticiones que verifica conectividad primero
const fetchWithConnectivityCheck = async (url, options = {}, showError = true) => {
  if (!isOnline()) {
    const error = new Error('Sin conexión a internet');
    error.code = 'NO_CONNECTION';
    throw error;
  }

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Tiempo de conexión agotado');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    if (!isOnline()) {
      const connectionError = new Error('Se perdió la conexión a internet');
      connectionError.code = 'CONNECTION_LOST';
      throw connectionError;
    }
    throw error;
  }
};

const ConnectivityService = {
  isOnline,
  checkConnectivity,
  fetchWithConnectivityCheck,
};

export default ConnectivityService;

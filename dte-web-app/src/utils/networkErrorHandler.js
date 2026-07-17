import { toast } from 'react-toastify';

const NETWORK_ERROR_MESSAGES = {
  NO_CONNECTION: 'No tienes conexión a internet. Verifica tu conexión de red.',
  CONNECTION_LOST: 'Se perdió la conexión a internet. Verifica tu conexión de red.',
  TIMEOUT: 'La conexión tardó demasiado. Verifica tu conexión de red e intenta nuevamente.',
  FETCH_FAILED: 'Error de conexión. Verifica tu conexión de red.',
};

export const showNetworkError = (error, customMessage = null) => {
  const message = customMessage || NETWORK_ERROR_MESSAGES[error?.code] || NETWORK_ERROR_MESSAGES.FETCH_FAILED;
  toast.error(message, {
    autoClose: 5000,
    position: 'top-center',
  });
  console.error('[Network Error]', error?.code, error?.message);
};

export const isNetworkError = (error) => {
  if (!error) return false;
  return (
    error?.code === 'NO_CONNECTION' ||
    error?.code === 'CONNECTION_LOST' ||
    error?.code === 'TIMEOUT' ||
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('offline')
  );
};

export const getNetworkErrorMessage = (error) => {
  return NETWORK_ERROR_MESSAGES[error?.code] || NETWORK_ERROR_MESSAGES.FETCH_FAILED;
};

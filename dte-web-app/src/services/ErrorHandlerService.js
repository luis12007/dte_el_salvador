import { toast } from 'react-toastify';

export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER: 'SERVER',
  TIMEOUT: 'TIMEOUT',
  PARSE: 'PARSE',
  UNKNOWN: 'UNKNOWN',
};

export const ERROR_CODES = {
  400: 'VALIDATION',
  401: 'AUTHENTICATION',
  403: 'AUTHORIZATION',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  500: 'SERVER',
  503: 'SERVER',
};

const ERROR_MESSAGES = {
  NETWORK: 'Problema de conexión de red. Verifica tu conexión a internet.',
  VALIDATION: 'Los datos ingresados no son válidos.',
  AUTHENTICATION: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  AUTHORIZATION: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  CONFLICT: 'Conflicto en la operación. Intenta nuevamente.',
  SERVER: 'Error del servidor. Por favor, intenta nuevamente más tarde.',
  TIMEOUT: 'La solicitud tardó demasiado tiempo. Intenta nuevamente.',
  PARSE: 'Error al procesar la respuesta del servidor.',
  UNKNOWN: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
};

const classifyError = (error, statusCode = null) => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Errores de red
  if (error.code === 'NO_CONNECTION' || error.code === 'CONNECTION_LOST') {
    return ERROR_TYPES.NETWORK;
  }

  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return ERROR_TYPES.NETWORK;
  }

  if (error.code === 'TIMEOUT') {
    return ERROR_TYPES.TIMEOUT;
  }

  // Errores de status HTTP
  if (statusCode) {
    const errorType = ERROR_CODES[statusCode];
    if (errorType) return errorType;

    if (statusCode >= 500) return ERROR_TYPES.SERVER;
    if (statusCode >= 400) return ERROR_TYPES.VALIDATION;
  }

  // Errores de parsing
  if (error instanceof SyntaxError || error.message?.includes('JSON')) {
    return ERROR_TYPES.PARSE;
  }

  return ERROR_TYPES.UNKNOWN;
};

const getDetailedMessage = (error, errorType) => {
  // Si el error tiene un mensaje personalizado
  if (error?.message && error.message !== 'Unknown error') {
    return error.message;
  }

  // Mensaje del servidor
  if (error?.data?.message) {
    return error.data.message;
  }

  // Mensaje genérico por tipo
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.UNKNOWN;
};

export const handleApiError = (error, customMessage = null) => {
  if (!error) {
    toast.error('Error desconocido');
    return;
  }

  // Determinar tipo de error
  let errorType = ERROR_TYPES.UNKNOWN;
  let statusCode = null;

  if (error.statusCode) {
    statusCode = error.statusCode;
  } else if (error.response?.status) {
    statusCode = error.response.status;
  }

  errorType = classifyError(error, statusCode);

  // Obtener mensaje
  const message = customMessage || getDetailedMessage(error, errorType);

  // Mostrar error específico según tipo
  const config = {
    autoClose: 5000,
    position: 'top-center',
  };

  if (errorType === ERROR_TYPES.AUTHENTICATION) {
    // Limpiar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    toast.error(message, config);
    // Redirigir a login
    setTimeout(() => {
      window.location.hash = '#/ingresar';
    }, 1000);
  } else {
    toast.error(message, config);
  }

  // Log para debugging
  console.error(`[${errorType}]`, message, error);
};

export const handleApiErrorSilent = (error) => {
  console.error('[API Error]', error);
  const statusCode = error?.response?.status || error?.statusCode;
  return classifyError(error, statusCode);
};

export const createErrorResponse = (error, statusCode = null) => {
  const errorType = classifyError(error, statusCode);
  const message = getDetailedMessage(error, errorType);

  return {
    success: false,
    error: true,
    type: errorType,
    message: message,
    statusCode: statusCode || error?.statusCode,
    originalError: error,
  };
};

export const isErrorType = (error, type) => {
  const statusCode = error?.response?.status || error?.statusCode;
  return classifyError(error, statusCode) === type;
};

export const shouldRetry = (error, attempt = 1, maxAttempts = 3) => {
  if (attempt >= maxAttempts) return false;

  const statusCode = error?.statusCode || error?.response?.status;
  const errorType = classifyError(error, statusCode);

  // Reintentar en estos casos
  return [
    ERROR_TYPES.NETWORK,
    ERROR_TYPES.TIMEOUT,
    ERROR_TYPES.SERVER,
  ].includes(errorType);
};

export const retryWithExponentialBackoff = async (
  asyncFn,
  maxAttempts = 3,
  initialDelay = 1000
) => {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, attempt, maxAttempts)) {
        throw error;
      }

      if (attempt < maxAttempts) {
        console.log(`Reintentando en ${delay}ms... (intento ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
};

const ErrorHandlerService = {
  ERROR_TYPES,
  ERROR_CODES,
  classifyError,
  getDetailedMessage,
  handleApiError,
  handleApiErrorSilent,
  createErrorResponse,
  isErrorType,
  shouldRetry,
  retryWithExponentialBackoff,
};

export default ErrorHandlerService;

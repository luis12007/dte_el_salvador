import ErrorHandlerService from '../services/ErrorHandlerService';

const DEFAULT_TIMEOUT = 30000; // 30 segundos

const createTimeoutPromise = (timeout) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error('Timeout de solicitud');
      error.code = 'TIMEOUT';
      reject(error);
    }, timeout);
  });
};

const parseErrorResponse = async (response) => {
  try {
    const data = await response.json();
    return {
      statusCode: response.status,
      statusText: response.statusText,
      data: data,
      message: data?.message || data?.error || response.statusText,
    };
  } catch (e) {
    return {
      statusCode: response.status,
      statusText: response.statusText,
      message: response.statusText,
    };
  }
};

export const safeFetch = async (
  url,
  options = {},
  {
    timeout = DEFAULT_TIMEOUT,
    retries = 0,
    onError = null,
    throwOnError = true,
  } = {}
) => {
  if (!navigator.onLine) {
    const error = new Error('Sin conexión a internet');
    error.code = 'NO_CONNECTION';
    throw error;
  }

  let lastError;
  let attempt = 0;
  const maxAttempts = retries + 1;

  while (attempt < maxAttempts) {
    attempt++;

    try {
      // Crear AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Hacer fetch
      const response = await Promise.race([
        fetch(url, {
          ...options,
          signal: controller.signal,
        }),
        createTimeoutPromise(timeout),
      ]);

      clearTimeout(timeoutId);

      // Verificar si la respuesta es OK
      if (!response.ok) {
        const errorData = await parseErrorResponse(response);

        const error = new Error(errorData.message);
        error.statusCode = errorData.statusCode;
        error.response = errorData;
        error.data = errorData.data;

        lastError = error;

        // Decidir si reintentar
        if (ErrorHandlerService.shouldRetry(error, attempt, maxAttempts)) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }

      // Parsear respuesta exitosa
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = null;
        const error = new Error('Error al parsear respuesta del servidor');
        error.code = 'PARSE_ERROR';
        throw error;
      }

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        data: data,
      };
    } catch (error) {
      lastError = error;

      // Verificar si es error de red o timeout (reintentar)
      if (
        attempt < maxAttempts &&
        (error.code === 'NO_CONNECTION' ||
          error.code === 'TIMEOUT' ||
          error.name === 'AbortError' ||
          error.statusCode >= 500)
      ) {
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Reintentando en ${delay}ms... (intento ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Error que no se debe reintentar
      if (!throwOnError) {
        return ErrorHandlerService.createErrorResponse(error);
      }

      throw error;
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  if (!throwOnError) {
    return ErrorHandlerService.createErrorResponse(lastError);
  }

  throw lastError;
};

export const safeFetchJson = async (url, options = {}, config = {}) => {
  try {
    const result = await safeFetch(url, options, config);
    return result.data;
  } catch (error) {
    if (config.throwOnError !== false) {
      throw error;
    }
    return null;
  }
};

// Wrappers específicos para métodos HTTP
export const safeGet = (url, options = {}, config = {}) => {
  return safeFetch(url, { ...options, method: 'GET' }, config);
};

export const safePost = (url, body, options = {}, config = {}) => {
  return safeFetch(
    url,
    {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    },
    config
  );
};

export const safePut = (url, body, options = {}, config = {}) => {
  return safeFetch(
    url,
    {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(body),
    },
    config
  );
};

export const safeDelete = (url, options = {}, config = {}) => {
  return safeFetch(url, { ...options, method: 'DELETE' }, config);
};

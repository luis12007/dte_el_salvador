import ErrorHandlerService from '../services/ErrorHandlerService';
import { showNetworkError } from './networkErrorHandler';

export const withErrorHandling = (asyncFunction, options = {}) => {
  return async (...args) => {
    const {
      showError = true,
      onError = null,
      retries = 0,
      fallbackValue = null,
    } = options;

    try {
      return await asyncFunction(...args);
    } catch (error) {
      const errorType = ErrorHandlerService.classifyError(error);

      if (showError) {
        ErrorHandlerService.handleApiError(error);
      }

      if (onError) {
        onError(error, errorType);
      }

      if (fallbackValue !== null) {
        return fallbackValue;
      }

      throw error;
    }
  };
};

export const withRetry = async (asyncFunction, options = {}) => {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    onRetry = null,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await asyncFunction();
    } catch (error) {
      lastError = error;
      const errorType = ErrorHandlerService.classifyError(error);

      if (!ErrorHandlerService.shouldRetry(error, attempt, maxAttempts)) {
        throw error;
      }

      if (onRetry) {
        onRetry(attempt, error, errorType);
      }

      if (attempt < maxAttempts) {
        console.log(`Reintentando en ${delay}ms... (intento ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  throw lastError;
};

export const tryCatchWrapper = (asyncFunction) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      console.error('[Try-Catch Wrapper]', error);
      const response = ErrorHandlerService.createErrorResponse(error);
      return response;
    }
  };
};

export const validateResponse = (response, validator) => {
  if (!validator) return true;

  try {
    return validator(response);
  } catch (error) {
    console.error('[Validation Error]', error);
    return false;
  }
};

export const createApiClient = (baseUrl, defaultHeaders = {}) => {
  const makeRequest = async (endpoint, options = {}, config = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const {
      method = 'GET',
      headers = {},
      body = null,
      timeout = 30000,
      retries = 1,
      showError = true,
    } = options;

    const requestOptions = {
      method,
      headers: { ...defaultHeaders, ...headers },
      ...(body && { body: JSON.stringify(body) }),
    };

    let lastError;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.message || response.statusText);
          error.statusCode = response.status;
          error.response = errorData;

          lastError = error;

          if (attempt < retries + 1 && response.status >= 500) {
            const delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        lastError = error;

        if (attempt === retries + 1) {
          if (showError) {
            ErrorHandlerService.handleApiError(error);
          }
          throw error;
        }

        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };

  return {
    get: (endpoint, headers = {}, config = {}) =>
      makeRequest(endpoint, { method: 'GET', headers }, config),
    post: (endpoint, body, headers = {}, config = {}) =>
      makeRequest(endpoint, { method: 'POST', headers, body }, config),
    put: (endpoint, body, headers = {}, config = {}) =>
      makeRequest(endpoint, { method: 'PUT', headers, body }, config),
    delete: (endpoint, headers = {}, config = {}) =>
      makeRequest(endpoint, { method: 'DELETE', headers }, config),
    request: makeRequest,
  };
};

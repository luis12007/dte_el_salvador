// EJEMPLO DE SERVICIO ROBUSTO CON MANEJO DE ERRORES
// Este archivo muestra cómo migrar un servicio existente

import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from './ErrorHandlerService';

const BASE_URL = "https://intuitive-bravery-production.up.railway.app";

// Helper para hacer requests robustos
const makeRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const {
    method = 'GET',
    body = null,
    headers = {},
    retries = 2,
    timeout = 30000,
  } = options;

  try {
    const result = await safeFetch(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      },
      {
        timeout,
        retries,
        throwOnError: true,
      }
    );

    return result.data;
  } catch (error) {
    // Registrar el error
    console.error(`[PlantillaService ${method} ${endpoint}]`, error);

    // Manejar automáticamente
    ErrorHandlerService.handleApiError(error);

    // Lanzar para que el componente pueda capturarlo si es necesario
    throw error;
  }
};

const PlantillaServiceRobust = {
  // Obtener plantilla por ID
  getById: async (id, token) => {
    return makeRequest(`/plantilla/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Crear nueva plantilla
  create: async (data, token) => {
    return makeRequest('/plantilla', {
      method: 'POST',
      body: data,
      headers: { Authorization: `Bearer ${token}` },
      retries: 3, // Más reintentos para operación crítica
    });
  },

  // Actualizar plantilla
  update: async (id, data, token) => {
    return makeRequest(`/plantilla/${id}`, {
      method: 'PUT',
      body: data,
      headers: { Authorization: `Bearer ${token}` },
      retries: 3,
    });
  },

  // Eliminar plantilla
  delete: async (id, token) => {
    return makeRequest(`/plantilla/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Obtener todas las plantillas
  getAll: async (token) => {
    return makeRequest('/plantillas', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      timeout: 60000, // Operación puede tardar más
    });
  },

  // Marcar como enviado
  updatesend: async (userId, sent, seal, token, codigoGeneracion) => {
    return makeRequest(`/plantilla/${userId}/send`, {
      method: 'PUT',
      body: {
        sent,
        seal,
        codigo_de_generacion: codigoGeneracion,
      },
      headers: { Authorization: `Bearer ${token}` },
      retries: 3,
    });
  },

  // Buscar plantillas
  search: async (filters, token) => {
    const queryString = new URLSearchParams(filters).toString();
    return makeRequest(`/plantillas/search?${queryString}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      timeout: 60000,
    });
  },

  // Operación con manejo de errores personalizado
  getSafe: async (id, token) => {
    try {
      return await makeRequest(`/plantilla/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      // Manejo personalizado
      if (ErrorHandlerService.isErrorType(error, ErrorHandlerService.ERROR_TYPES.NOT_FOUND)) {
        console.log('Plantilla no encontrada');
        return null;
      }

      // Para otros errores, relanzar
      throw error;
    }
  },

  // Operación con reintentos personalizados
  createWithRetry: async (data, token, maxRetries = 5) => {
    return ErrorHandlerService.retryWithExponentialBackoff(
      () =>
        makeRequest('/plantilla', {
          method: 'POST',
          body: data,
          headers: { Authorization: `Bearer ${token}` },
        }),
      maxRetries
    );
  },

  // Operación con fallback
  getOrDefault: async (id, token, defaultValue = null) => {
    try {
      return await makeRequest(`/plantilla/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.warn('Usando valor por defecto para plantilla', id);
      return defaultValue;
    }
  },
};

export default PlantillaServiceRobust;

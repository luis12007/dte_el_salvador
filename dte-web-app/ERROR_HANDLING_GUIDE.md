# Guía Completa de Manejo de Errores Robusto

## Resumen General

Se ha implementado un sistema completo y robusto de manejo de errores que cubre:

- ✅ **Errores de red/conectividad**
- ✅ **Errores de validación (400)**
- ✅ **Errores de autenticación (401)**
- ✅ **Errores de autorización (403)**
- ✅ **Errores de recursos no encontrados (404)**
- ✅ **Conflictos (409)**
- ✅ **Errores del servidor (500, 503)**
- ✅ **Timeouts**
- ✅ **Errores de parseo JSON**
- ✅ **Errores inesperados**

## Servicios Implementados

### 1. ErrorHandlerService
**Ubicación:** `src/services/ErrorHandlerService.js`

El servicio principal de manejo de errores. Clasifica, procesa y muestra errores.

```javascript
import ErrorHandlerService from '../services/ErrorHandlerService';

// Clasificar tipo de error
const errorType = ErrorHandlerService.classifyError(error);

// Manejar error automáticamente
ErrorHandlerService.handleApiError(error, 'Mensaje personalizado');

// Crear respuesta de error
const response = ErrorHandlerService.createErrorResponse(error);

// Verificar si es un tipo específico
if (ErrorHandlerService.isErrorType(error, ErrorHandlerService.ERROR_TYPES.AUTHENTICATION)) {
  // Hacer algo
}

// Reintentar con backoff exponencial
await ErrorHandlerService.retryWithExponentialBackoff(async () => {
  return await myAsyncFunction();
}, 3, 1000);
```

### 2. safeFetch
**Ubicación:** `src/utils/safeFetch.js`

Wrapper robusto para fetch que maneja automáticamente errores, timeouts y reintentos.

```javascript
import { safeFetch, safePost, safeGet, safePut, safeDelete } from '../utils/safeFetch';

// Usar safeFetch directamente
const result = await safeFetch('/api/data', {}, {
  timeout: 30000,
  retries: 2,
  throwOnError: true
});

// GET
const data = await safeGet('/api/users', {
  'Authorization': 'Bearer token'
});

// POST con reintentos
const response = await safePost(
  '/api/save',
  { name: 'John', email: 'john@example.com' },
  { 'Authorization': 'Bearer token' },
  { retries: 3, timeout: 60000 }
);

// PUT
const updated = await safePut('/api/users/1', { name: 'Jane' });

// DELETE
await safeDelete('/api/users/1');
```

### 3. apiCallWrapper
**Ubicación:** `src/utils/apiCallWrapper.js`

Helpers para envolver funciones asincrónicas con manejo de errores.

```javascript
import {
  withErrorHandling,
  withRetry,
  tryCatchWrapper,
  createApiClient,
} from '../utils/apiCallWrapper';

// Opción 1: Wrapper de error
const safeFunction = withErrorHandling(myAsyncFunction, {
  showError: true,
  onError: (error, errorType) => console.log(errorType),
  retries: 2,
  fallbackValue: []
});

// Opción 2: Reintentos manual
try {
  const result = await withRetry(
    () => myService.fetchData(),
    {
      maxAttempts: 3,
      initialDelay: 1000,
      onRetry: (attempt, error, type) => {
        console.log(`Intento ${attempt} falló: ${type}`);
      }
    }
  );
} catch (error) {
  // Manejo final de error
}

// Opción 3: Try-catch wrapper
const wrappedFunction = tryCatchWrapper(async () => {
  const data = await myService.getData();
  return { success: true, data };
});

const result = await wrappedFunction();
// Siempre retorna { success: true/false, error: true/false, ... }

// Opción 4: API Client
const client = createApiClient('https://api.example.com', {
  'Authorization': `Bearer ${token}`
});

const { data } = await client.get('/users');
const { data: newUser } = await client.post('/users', { name: 'John' });
const { data: updated } = await client.put('/users/1', { name: 'Jane' });
await client.delete('/users/1');
```

### 4. authInterceptor
**Ubicación:** `src/utils/authInterceptor.js`

Intercepta automáticamente errores 401 y redirige a login.

```javascript
import { checkAuthStatus, logout } from '../utils/authInterceptor';

// Verificar si usuario está autenticado
if (checkAuthStatus()) {
  // Usuario está autenticado
}

// Logout manual
logout(); // Limpia sesión y redirige a login
```

## Tipos de Error

```javascript
import { ERROR_TYPES } from '../services/ErrorHandlerService';

ERROR_TYPES.NETWORK        // Error de red/conexión
ERROR_TYPES.VALIDATION     // 400 - Datos inválidos
ERROR_TYPES.AUTHENTICATION // 401 - Sesión expirada
ERROR_TYPES.AUTHORIZATION  // 403 - Sin permisos
ERROR_TYPES.NOT_FOUND      // 404 - Recurso no encontrado
ERROR_TYPES.CONFLICT       // 409 - Conflicto
ERROR_TYPES.SERVER         // 500+ - Error del servidor
ERROR_TYPES.TIMEOUT        // Timeout de solicitud
ERROR_TYPES.PARSE          // Error al parsear JSON
ERROR_TYPES.UNKNOWN        // Error desconocido
```

## Patrones de Uso

### Patrón 1: Manejo Automático

```javascript
import { handleApiError } from '../services/ErrorHandlerService';

try {
  const data = await myService.fetchData();
} catch (error) {
  handleApiError(error, 'No se pudieron cargar los datos');
  // El usuario ve un toast automáticamente
}
```

### Patrón 2: Manejo Personalizado

```javascript
import ErrorHandlerService from '../services/ErrorHandlerService';

try {
  await myService.delete(id);
} catch (error) {
  if (ErrorHandlerService.isErrorType(error, ErrorHandlerService.ERROR_TYPES.NOT_FOUND)) {
    console.log('El recurso no existe');
  } else if (ErrorHandlerService.isErrorType(error, ErrorHandlerService.ERROR_TYPES.AUTHENTICATION)) {
    // Redirigir a login (automático)
  } else {
    // Otro error
    ErrorHandlerService.handleApiError(error);
  }
}
```

### Patrón 3: Reintentos Automáticos

```javascript
import ErrorHandlerService from '../services/ErrorHandlerService';

const data = await ErrorHandlerService.retryWithExponentialBackoff(
  async () => {
    return await fetch('/api/unstable-endpoint').then(r => r.json());
  },
  3,    // máximo 3 intentos
  1000  // empezar con 1 segundo de delay
);
// Reintentos con delays: 1s, 2s, 4s
```

### Patrón 4: Usar safeFetch Directamente

```javascript
import { safeFetch } from '../utils/safeFetch';

try {
  const result = await safeFetch('/api/data', {
    method: 'POST',
    body: { name: 'John' }
  }, {
    timeout: 10000,
    retries: 2,
    throwOnError: true // lanzar si falla
  });
  
  console.log(result.data);
} catch (error) {
  // Error después de reintentos
  console.error('Falló permanentemente:', error);
}
```

### Patrón 5: Sin Lanzar Error

```javascript
import { safeFetch } from '../utils/safeFetch';

const result = await safeFetch('/api/data', {}, {
  throwOnError: false // No lanzar error
});

if (result.success) {
  console.log('Éxito:', result.data);
} else {
  console.log('Error:', result.message, result.type);
}
```

## Ejemplos en Componentes

### Ejemplo 1: Componente con Carga de Datos

```javascript
import { useEffect, useState } from 'react';
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const result = await safeFetch('/api/users', {}, {
          retries: 2,
          timeout: 10000
        });
        setUsers(result.data);
      } catch (err) {
        setError(err.message);
        ErrorHandlerService.handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
};

export default UserList;
```

### Ejemplo 2: Formulario con Reintentos

```javascript
import { useState } from 'react';
import { withErrorHandling, withRetry } from '../utils/apiCallWrapper';
import { toast } from 'react-toastify';

const MyForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const result = await withRetry(
        () => myService.saveData(formData),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          onRetry: (attempt) => {
            toast.info(`Reintentando... (intento ${attempt}/3)`);
          }
        }
      );
      
      toast.success('Guardado correctamente');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ name: 'John' });
    }}>
      <button disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default MyForm;
```

### Ejemplo 3: Cliente API Reutilizable

```javascript
import { createApiClient } from '../utils/apiCallWrapper';

// Crear cliente una sola vez
const apiClient = createApiClient(
  'https://api.example.com',
  {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
);

// Usar en componentes
const { data: users } = await apiClient.get('/users');
const { data: newUser } = await apiClient.post('/users', {
  name: 'John',
  email: 'john@example.com'
});

// En servicios
export const UserService = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`)
};
```

## Migrar Servicio Existente

### Antes:
```javascript
const MyService = {
  fetchData: async () => {
    const res = await fetch('/api/data');
    return res.json();
  }
};
```

### Después:
```javascript
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';

const MyService = {
  fetchData: async () => {
    try {
      const result = await safeFetch('/api/data', {}, {
        retries: 2,
        timeout: 10000
      });
      return result.data;
    } catch (error) {
      ErrorHandlerService.handleApiError(error);
      throw error;
    }
  }
};
```

## Flujo de Errores Automáticos

```
Usuario intenta acción
        ↓
¿Hay conexión? → No → Mostrar "Sin conexión a internet"
        ↓ Sí
Hacer petición HTTP
        ↓
¿Respuesta OK? → No → Clasificar error
        ↓ Sí          ↓
Retornar datos    ¿Es reintentos? → Sí → Esperar + reintentar
                  ↓ No
                  ¿Es 401? → Sí → Logout automático
                  ↓ No
                  Mostrar mensaje específico
```

## Mensajes Mostrados al Usuario

| Tipo de Error | Mensaje |
|---|---|
| Sin conexión | "No tienes conexión a internet. Verifica tu conexión de red." |
| Validación (400) | "Los datos ingresados no son válidos." |
| Autenticación (401) | "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." |
| Autorización (403) | "No tienes permisos para realizar esta acción." |
| No encontrado (404) | "El recurso solicitado no fue encontrado." |
| Conflicto (409) | "Conflicto en la operación. Intenta nuevamente." |
| Servidor (500) | "Error del servidor. Por favor, intenta nuevamente más tarde." |
| Timeout | "La solicitud tardó demasiado tiempo. Intenta nuevamente." |
| Parse | "Error al procesar la respuesta del servidor." |
| Desconocido | "Ocurrió un error inesperado. Por favor, intenta nuevamente." |

## Configuración Global

### En App.jsx:
- ✅ setupAuthInterceptor() - Inicializado automáticamente
- ✅ OfflineNotification - Muestra estado de conexión
- ✅ Manejo de 401 - Automático globalmente

### Reintentos Automáticos:
- Errores de red: Sí (hasta 3 intentos)
- Errores 5xx: Sí (hasta 3 intentos)
- Otros errores: No

### Timeouts:
- Por defecto: 30 segundos
- Configurable por llamada

## Checklist de Implementación

- ✅ ErrorHandlerService creado
- ✅ safeFetch creado
- ✅ apiCallWrapper creado
- ✅ authInterceptor creado
- ✅ OfflineNotification integrado
- ✅ setupAuthInterceptor en App.jsx
- ✅ Logins.jsx actualizado
- ✅ FacturaSendSelect.jsx actualizado
- ✅ SendService.js actualizado

## Próximos Pasos (Opcional)

Para migrar más servicios, sigue el patrón "Migrar Servicio Existente" arriba.

Servicios que podrían beneficiarse:
- PlantillaService
- ClientService
- ItemsService
- UserServices
- Etc.

# Quick Reference: Manejo de Errores Robusto

## 🚀 Uso Rápido

### En Componentes
```javascript
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';
import useOnlineStatus from '../hooks/useOnlineStatus';

const MyComponent = () => {
  const isOnline = useOnlineStatus();
  
  const handleSave = async (data) => {
    // Verificar conexión
    if (!isOnline) {
      toast.error('Sin conexión a internet');
      return;
    }
    
    try {
      const result = await safeFetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(data)
      }, { retries: 2 });
      
      toast.success('Guardado');
    } catch (error) {
      ErrorHandlerService.handleApiError(error);
    }
  };
};
```

### En Servicios
```javascript
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';

const MyService = {
  save: async (data, token) => {
    try {
      return await safeFetch('/api/save', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      }, { retries: 2 });
    } catch (error) {
      ErrorHandlerService.handleApiError(error);
      throw error;
    }
  }
};
```

---

## 📋 Métodos Principales

| Método | Ubicación | Uso |
|--------|-----------|-----|
| `safeFetch()` | `utils/safeFetch` | Fetch robusto con reintentos |
| `safePost()` | `utils/safeFetch` | POST con manejo de errores |
| `safeGet()` | `utils/safeFetch` | GET con manejo de errores |
| `handleApiError()` | `services/ErrorHandlerService` | Mostrar error automáticamente |
| `useOnlineStatus()` | `hooks/useOnlineStatus` | Verificar si hay conexión |
| `logout()` | `utils/authInterceptor` | Cerrar sesión |

---

## 🎯 Patrones Comunes

### Patrón 1: Cargar datos al montar componente
```javascript
useEffect(() => {
  const load = async () => {
    try {
      const result = await safeFetch('/api/data', {}, { retries: 2 });
      setData(result.data);
    } catch (error) {
      ErrorHandlerService.handleApiError(error);
    }
  };
  load();
}, []);
```

### Patrón 2: Guardar con confirmación
```javascript
const handleSave = async () => {
  if (!isOnline) return toast.error('Sin conexión');
  
  try {
    await safeFetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    }, { retries: 3 });
    
    toast.success('Guardado');
  } catch (error) {
    ErrorHandlerService.handleApiError(error);
  }
};
```

### Patrón 3: Eliminar con reintentos
```javascript
const handleDelete = async (id) => {
  try {
    await ErrorHandlerService.retryWithExponentialBackoff(
      () => safeFetch(`/api/items/${id}`, { method: 'DELETE' }),
      3 // máximo 3 intentos
    );
    toast.success('Eliminado');
  } catch (error) {
    ErrorHandlerService.handleApiError(error);
  }
};
```

---

## 🔧 Configuración de Opciones

### safeFetch
```javascript
await safeFetch(url, fetchOptions, {
  timeout: 30000,      // Timeout en ms
  retries: 2,          // Número de reintentos
  throwOnError: true   // Lanzar error o retornar objeto
});
```

### retryWithExponentialBackoff
```javascript
await ErrorHandlerService.retryWithExponentialBackoff(
  asyncFn,    // Función a ejecutar
  3,          // Máximo de intentos (default 3)
  1000        // Delay inicial en ms (default 1000)
);
```

### createApiClient
```javascript
const client = createApiClient(baseUrl, {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

client.get(endpoint);
client.post(endpoint, data);
client.put(endpoint, data);
client.delete(endpoint);
```

---

## ⚡ Tipos de Errores

```javascript
import ErrorHandlerService from '../services/ErrorHandlerService';

const { ERROR_TYPES } = ErrorHandlerService;

// Usar así:
if (ErrorHandlerService.isErrorType(error, ERROR_TYPES.AUTHENTICATION)) {
  // Manejar 401
}
```

**Tipos disponibles:**
- `ERROR_TYPES.NETWORK` - Sin conexión
- `ERROR_TYPES.VALIDATION` - 400
- `ERROR_TYPES.AUTHENTICATION` - 401 (auto logout)
- `ERROR_TYPES.AUTHORIZATION` - 403
- `ERROR_TYPES.NOT_FOUND` - 404
- `ERROR_TYPES.CONFLICT` - 409
- `ERROR_TYPES.SERVER` - 500+
- `ERROR_TYPES.TIMEOUT` - Timeout
- `ERROR_TYPES.UNKNOWN` - Otro

---

## ✨ Características Automáticas

| Característica | Funcionamiento |
|---|---|
| **Banner offline** | Se muestra automáticamente sin conexión |
| **Logout 401** | Auto-logout cuando sesión expira |
| **Reintentos** | Automático para errores de red y 5xx |
| **Mensajes** | Específicos por tipo de error |
| **Timeouts** | 30s por defecto, configurable |
| **Backoff** | Exponencial 1s → 2s → 4s... |

---

## 🧪 Testing

### Simular sin conexión
1. DevTools → Network tab
2. Throttling → Offline
3. Intenta cualquier acción

### Simular error específico
1. DevTools → Network tab
2. Throttling → Slow 3G
3. O bloquear endpoint en DevTools

### Verificar console
```javascript
// Ver logs de errores
console.error('[API Error]', error);
```

---

## 🔒 Manejo de Tokens

### Auto-renovación (si aplica)
```javascript
const handleTokenExpired = async () => {
  try {
    const newToken = await LoginAPI.refreshToken();
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    logout(); // Ir a login
  }
};
```

### Headers con token
```javascript
const result = await safeFetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

---

## 📦 Resumen de Archivos

```
src/
├── hooks/
│   └── useOnlineStatus.js
├── services/
│   ├── ErrorHandlerService.js
│   ├── ConnectivityService.js
│   └── PlantillaServiceRobust.js (ejemplo)
├── components/
│   └── OfflineNotification.jsx
└── utils/
    ├── networkErrorHandler.js
    ├── withConnectivityCheck.js
    ├── safeFetch.js
    ├── apiCallWrapper.js
    └── authInterceptor.js
```

---

## 🎓 Ejemplos Completos

### Formulario con Carga
```javascript
import { useState, useEffect } from 'react';
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';

const UserForm = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Cargar datos
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await safeFetch(`/api/users/${userId}`, {}, { retries: 2 });
        setData(result.data);
      } catch (error) {
        ErrorHandlerService.handleApiError(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  // Guardar datos
  const handleSave = async () => {
    setSaving(true);
    try {
      await safeFetch(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }, { retries: 3 });
      
      toast.success('Guardado correctamente');
    } catch (error) {
      ErrorHandlerService.handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!data) return <div>Error al cargar</div>;

  return (
    <div>
      <input value={data.name} onChange={(e) => setData({...data, name: e.target.value})} />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
};
```

---

## 🚨 Errores Comunes

### ❌ Olvidar error handling
```javascript
// MAL
const data = await fetch('/api/data').then(r => r.json());

// BIEN
try {
  const result = await safeFetch('/api/data');
  const data = result.data;
} catch (error) {
  ErrorHandlerService.handleApiError(error);
}
```

### ❌ No verificar conexión
```javascript
// MAL
const save = async (data) => {
  await myService.save(data);
};

// BIEN
const save = async (data) => {
  if (!isOnline) {
    toast.error('Sin conexión');
    return;
  }
  await myService.save(data);
};
```

### ❌ No reintentary en operaciones críticas
```javascript
// MAL
await safeFetch('/api/save', options);

// BIEN
await safeFetch('/api/save', options, { retries: 3 });
```

---

## ✅ Checklist Implementación

- [ ] Importar `safeFetch` en componente
- [ ] Importar `ErrorHandlerService`
- [ ] Usar `safeFetch` para peticiones
- [ ] Capturar errores en `try-catch`
- [ ] Llamar `ErrorHandlerService.handleApiError()`
- [ ] Verificar `isOnline` si es crítico
- [ ] Configurar reintentos si es importante
- [ ] Mostrar loader mientras carga
- [ ] Mostrar mensaje en UI si es necesario

---

## 🔗 Enlaces Útiles

- **ERROR_HANDLING_GUIDE.md** - Documentación completa
- **CONNECTIVITY_IMPLEMENTATION.md** - Guía de conectividad
- **PlantillaServiceRobust.js** - Ejemplo de servicio
- **IMPLEMENTATION_SUMMARY.md** - Resumen completo

---

**Última actualización:** 16 Julio 2026  
**Estado:** ✅ Listo para usar

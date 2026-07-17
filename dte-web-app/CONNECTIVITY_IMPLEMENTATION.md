# Implementación de Manejo de Conectividad

## Resumen

Se ha implementado un sistema robusto de detección y manejo de pérdida de conexión a internet en toda la aplicación. El sistema se asegura de que:

1. **Se detecta automáticamente** cuando no hay conexión
2. **Se muestra una notificación** en la parte superior de la pantalla
3. **Se previenen errores** verificando conexión antes de operaciones críticas
4. **Se muestran mensajes claros** cuando falla una operación por falta de conexión

## Componentes Implementados

### 1. Hook: `useOnlineStatus`
**Ubicación:** `src/hooks/useOnlineStatus.js`

Monitorea el estado de la conexión a internet en tiempo real.

```javascript
import useOnlineStatus from '../hooks/useOnlineStatus';

const MyComponent = () => {
  const isOnline = useOnlineStatus();
  
  if (!isOnline) {
    return <div>Sin conexión</div>;
  }
  return <div>Conectado</div>;
};
```

### 2. Servicio: `ConnectivityService`
**Ubicación:** `src/services/ConnectivityService.js`

Proporciona funciones utilitarias para verificar conectividad.

```javascript
import ConnectivityService from '../services/ConnectivityService';

// Verificar si hay conexión
if (ConnectivityService.isOnline()) {
  // Hacer algo
}

// Verificar conectividad con ping
const isConnected = await ConnectivityService.checkConnectivity();

// Hacer fetch con verificación de conectividad
const response = await ConnectivityService.fetchWithConnectivityCheck(url, options);
```

### 3. Componente: `OfflineNotification`
**Ubicación:** `src/components/OfflineNotification.jsx`

Muestra una notificación cuando no hay conexión. Se agrega automáticamente en App.jsx.

```jsx
// Ya está integrado en App.jsx, no requiere instalación manual
<OfflineNotification />
```

### 4. Utilidades: `networkErrorHandler`
**Ubicación:** `src/utils/networkErrorHandler.js`

Proporciona funciones para manejar y mostrar errores de red.

```javascript
import { showNetworkError, isNetworkError } from '../utils/networkErrorHandler';

try {
  await someAsyncOperation();
} catch (error) {
  if (isNetworkError(error)) {
    showNetworkError(error);
  } else {
    // Otro tipo de error
  }
}
```

### 5. Utilidades: `withConnectivityCheck`
**Ubicación:** `src/utils/withConnectivityCheck.js`

Proporciona wrappers para envolver funciones asincrónicas con verificación de conectividad.

```javascript
import { withConnectivityCheck, checkInternetBeforeAction } from '../utils/withConnectivityCheck';

// Opción 1: Wrapper
const safeFunction = withConnectivityCheck(myAsyncFunction);

// Opción 2: Verificar antes de acción
const success = await checkInternetBeforeAction(
  async () => { /* mi lógica */ },
  'envío de factura'
);
```

## Servicios Actualizados

Los siguientes servicios ya incluyen manejo de conectividad:

### 1. **Loginservices.js**
- `login()`
- `loginMinis()`
- `loginMinis_prod()`

Todas las funciones ahora:
- Verifican conexión antes de intentar
- Detectan si se pierde conexión durante la operación
- Lanzan errores con código específico

### 2. **SendService.js**
- `sendBill()`
- `invalidatebill()`
- `sendBillprod()`
- `invalidatebillprod()`
- `get()`

## Componentes Actualizados

### 1. **Logins.jsx**
- Verifica conexión antes de intentar login
- Muestra mensaje específico de falta de conexión
- Maneja errores de red con `showNetworkError()`

### 2. **FacturaSendSelect.jsx**
- Integra `useOnlineStatus` hook
- Maneja errores de red en catch blocks
- Muestra mensajes claros cuando falla envío por red

## Cómo Integrar en Nuevas Páginas/Componentes

### Para una página que hace peticiones HTTP:

```javascript
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { isNetworkError, showNetworkError } from '../utils/networkErrorHandler';

const MyPage = () => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  const handleSaveData = async (data) => {
    // Verificar conexión
    if (!isOnline) {
      toast.error('No tienes conexión a internet. Verifica tu conexión de red.');
      return;
    }

    try {
      // Hacer petición
      const result = await MyService.save(data);
      toast.success('Guardado correctamente');
    } catch (error) {
      // Manejar error
      if (isNetworkError(error)) {
        showNetworkError(error);
      } else {
        toast.error('Error al guardar');
      }
    }
  };

  if (!isOnline) {
    return <div>Sin conexión. Verifica tu red.</div>;
  }

  return (
    <button onClick={() => handleSaveData(data)}>
      Guardar
    </button>
  );
};

export default MyPage;
```

### Para un servicio:

```javascript
// MyService.js
const checkConnection = () => {
  if (!navigator.onLine) {
    const error = new Error('Sin conexión a internet');
    error.code = 'NO_CONNECTION';
    throw error;
  }
};

const handleNetworkError = (error) => {
  if (error.code === 'NO_CONNECTION') {
    throw error;
  }
  if (!navigator.onLine) {
    const connError = new Error('Se perdió la conexión a internet');
    connError.code = 'CONNECTION_LOST';
    throw connError;
  }
  throw error;
};

const MyService = {
  save: async (data) => {
    try {
      checkConnection();
      const res = await fetch(`${BASE_URL}/save`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      return handleNetworkError(error);
    }
  }
};

export default MyService;
```

## Codigos de Error

Los errores de conectividad tienen códigos específicos:

- **NO_CONNECTION**: No hay conexión al momento de intentar la operación
- **CONNECTION_LOST**: Se perdió la conexión durante la operación
- **TIMEOUT**: La conexión tardó demasiado

## Mensajes al Usuario

La aplicación muestra mensajes personalizados:

1. **Banner rojo** en la parte superior cuando no hay conexión
2. **Toast notifications** cuando falla una operación
3. Mensajes claros indicando que debe verificar la conexión de red

## Páginas/Funciones Protegidas

✅ **Login** - Verifica conexión antes de intentar autenticación
✅ **Crear DTE/Factura** - Manejo en SendService
✅ **Crédito Fiscal** - Manejo en SendService
✅ **Home** - Protección en servicios base
✅ **Facturas** - Manejo en FacturaSendSelect

## Testing

Para probar la funcionalidad:

1. **DevTools** → Network → Throttling → Offline
2. Intenta hacer login o crear DTE
3. Deberías ver:
   - Banner de "Sin conexión a internet"
   - Toast error específico
   - Operación no se ejecuta

## Notas Importantes

- El componente `OfflineNotification` ya está integrado en App.jsx
- Todos los servicios principales ya tienen validación
- Se recomienda usar el patrón en nuevos servicios
- Los hooks y utilidades son reutilizables en cualquier componente

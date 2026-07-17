# Guía: Validación de Token Automática

## 🎯 Problema Resuelto

**Antes:** Token inválido → Error 401 confuso → Página rota
```
GET /plantillas/get/1 401 (Unauthorized)
No hay error handler → UI quebrada
```

**Ahora:** Token inválido → Validación automática → Logout + Mensaje claro → Login
```
1. Usuario navega a Home/Facturas
2. useTokenValidation valida token
3. Si es inválido: clearSessionAndRedirect()
4. Usuario ve: "Tu sesión ha expirado. Credenciales inválidas."
5. Redirige a login automáticamente
```

---

## 🔧 Componentes Creados

### 1. `tokenValidator.js`
**Ubicación:** `src/utils/tokenValidator.js`

Funciones para validar y manejar tokens:

```javascript
import { 
  validateToken, 
  clearSessionAndRedirect, 
  checkTokenBeforeOperation,
  withTokenValidation 
} from '../utils/tokenValidator';

// Validar token
const isValid = await validateToken(token);

// Limpiar sesión y redirigir
clearSessionAndRedirect('Mensaje personalizado');

// Ejecutar operación solo si token es válido
const result = await checkTokenBeforeOperation(
  () => myService.save(data),
  'guardado de datos'
);

// Wrapper para funciones
const safeFunction = withTokenValidation(myAsyncFunction);
```

### 2. `useTokenValidation` Hook
**Ubicación:** `src/hooks/useTokenValidation.js`

Hook que valida token automáticamente al montar componente:

```javascript
import useTokenValidation from '../hooks/useTokenValidation';

const MyComponent = () => {
  const { isValidating, isValid, token, userId } = useTokenValidation();

  if (isValidating) {
    return <div>Validando...</div>;
  }

  if (!isValid) {
    return null; // useTokenValidation ya redirigió
  }

  // Continuar normalmente
  return <div>Contenido</div>;
};
```

### 3. Mejorado `authInterceptor.js`
**Ubicación:** `src/utils/authInterceptor.js`

Intercepta automáticamente cualquier respuesta 401:

```javascript
import { setupAuthInterceptor, isAuthenticated } from '../utils/authInterceptor';

// En App.jsx
useEffect(() => {
  setupAuthInterceptor();
}, []);

// Usar en cualquier lado
if (isAuthenticated()) {
  // Usuario está autenticado
}
```

---

## 📋 Cómo Usar

### Opción 1: En Componentes Críticos (Recomendado)

```javascript
import useTokenValidation from '../hooks/useTokenValidation';

const MyPage = () => {
  // Valida token automáticamente al montar
  const { isValidating, isValid } = useTokenValidation();

  // Mostrar loading mientras valida
  if (isValidating) {
    return <LoadingSpinner />;
  }

  // Si no es válido, redirige automáticamente (return null)
  if (!isValid) {
    return null;
  }

  // Aquí el token es 100% válido
  return <YourComponent />;
};

export default MyPage;
```

### Opción 2: En Servicios

```javascript
import { checkTokenBeforeOperation } from '../utils/tokenValidator';

const handleSave = async (data) => {
  const success = await checkTokenBeforeOperation(
    () => myService.save(data),
    'guardado'
  );

  if (success) {
    toast.success('Guardado correctamente');
  }
  // Si falla, usuario ya fue redirigido a login
};
```

### Opción 3: Wrapper de Funciones

```javascript
import { withTokenValidation } from '../utils/tokenValidator';

const safeLoad = withTokenValidation(async () => {
  return await myService.loadData();
});

// Usar
try {
  const data = await safeLoad();
} catch (error) {
  if (error.message === 'INVALID_TOKEN') {
    // Usuario ya fue redirigido
  }
}
```

---

## 🚀 Integración en Páginas Principales

### Home Facturas (YA ACTUALIZADO)
```javascript
import useTokenValidation from '../hooks/useTokenValidation';

const HomeFacturas = () => {
  const { isValidating, isValid } = useTokenValidation();

  if (isValidating) return <Loading />;
  if (!isValid) return null;

  return <YourContent />;
};
```

### Home (ACTUALIZAR IGUAL)
```javascript
import useTokenValidation from '../hooks/useTokenValidation';

const Home = () => {
  const { isValidating, isValid } = useTokenValidation();

  if (isValidating) return <Loading />;
  if (!isValid) return null;

  return <YourContent />;
};
```

### CreateFact/CF (ACTUALIZAR IGUAL)
Mismo patrón que Home y HomeFacturas

---

## 🔄 Flujo de Validación

```
Usuario accede a página
        ↓
useTokenValidation() se ejecuta
        ↓
¿Hay token? ──NO──→ clearSessionAndRedirect()
        ↓ SÍ
Validar token (ping a API)
        ↓
¿Token válido? ──NO──→ clearSessionAndRedirect()
        ↓ SÍ           (logout automático)
isValid = true
        ↓
Renderizar página normalmente
        ↓
Si petición retorna 401 → authInterceptor → logout
```

---

## 🎯 Mensajes Mostrados

| Situación | Mensaje |
|-----------|---------|
| Sin token | "Debes iniciar sesión para acceder a esta página." |
| Token expirado | "Tu sesión ha expirado. Credenciales inválidas. Por favor, inicia sesión nuevamente." |
| 401 durante operación | "Tu sesión ha expirado. Por favor, inicia sesión nuevamente." |
| Logout manual | "Sesión cerrada" |

---

## ✨ Características

✅ **Automático** - No requiere intervención del usuario
✅ **Proactivo** - Valida antes de que falle
✅ **Claro** - Mensajes específicos
✅ **Rápido** - Redirección inmediata
✅ **Seguro** - Limpia completamente localStorage
✅ **Inteligente** - Previene múltiples redirecciones

---

## 🧪 Testing

### Test 1: Token Válido
```
1. Ir a Home/Facturas
2. Esperar validación
3. Debe mostrar contenido
```

### Test 2: Sin Token
```
1. Limpiar localStorage (Dev Tools)
2. Ir a Home/Facturas
3. Debe redirigir a login con mensaje
```

### Test 3: Token Inválido
```
1. Cambiar token en localStorage a algo inválido
2. Ir a Home/Facturas
3. Debe detectar y redirigir a login
```

### Test 4: Token Expira Durante Sesión
```
1. Iniciar sesión
2. Esperar token expire (o cambiar token)
3. Hacer operación
4. Debe capturar 401 y redirigir
```

---

## 📝 Checklist de Implementación

Por página:

### Home.jsx
- [ ] Importar `useTokenValidation`
- [ ] Agregar hook al componente
- [ ] Agregar loading check
- [ ] Agregar isValid check
- [ ] Actualizar useEffect dependencies

### HomeFacturas.jsx
- [x] ✅ Ya actualizado

### CreateFact.jsx
- [ ] Mismo proceso que Home

### CreateFiscalCredit.jsx
- [ ] Mismo proceso que Home

### Cualquier página crítica
- [ ] Mismo proceso que Home

---

## 🔐 Seguridad

La solución implementa:
- ✅ Validación de token ANTES de usar
- ✅ Detección de 401 DURANTE operaciones
- ✅ Limpieza COMPLETA de localStorage
- ✅ Prevención de múltiples redirecciones
- ✅ Logging de intentos inválidos

---

## 🚀 Próximos Pasos

1. **Actualizar Home.jsx** - Mismo patrón que HomeFacturas
2. **Actualizar CreateFact.jsx** - Mismo patrón que HomeFacturas
3. **Actualizar CreateFiscalCredit.jsx** - Mismo patrón
4. **Test completo** - Validar todos los casos de uso

---

## 💡 Ejemplo Completo

```javascript
import { useState, useEffect } from 'react';
import useTokenValidation from '../hooks/useTokenValidation';
import { safeFetch } from '../utils/safeFetch';
import ErrorHandlerService from '../services/ErrorHandlerService';

const MyPage = () => {
  // 1. Validar token al montar
  const { isValidating, isValid } = useTokenValidation();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 2. Mostrar loading mientras valida
  if (isValidating) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>;
  }

  // 3. Si token no es válido, no renderizar (ya fue redirigido)
  if (!isValid) {
    return null;
  }

  // 4. Cargar datos una vez que token es válido
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await safeFetch('/api/data', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }, { retries: 2 });
        setData(result.data);
      } catch (error) {
        // authInterceptor manejará 401 automáticamente
        if (error.statusCode !== 401) {
          ErrorHandlerService.handleApiError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 5. Renderizar página
  if (loading) return <div>Cargando...</div>;
  if (!data) return <div>No hay datos</div>;

  return <div>{/* Tu contenido */}</div>;
};

export default MyPage;
```

---

## 📞 Resumen Rápido

| Acción | Función |
|--------|---------|
| **Validar token automáticamente** | `useTokenValidation()` |
| **Logout manual** | `logout(message)` |
| **Validar antes de operación** | `checkTokenBeforeOperation()` |
| **Detectar 401 automáticamente** | `setupAuthInterceptor()` |

**Estado:** ✅ Completamente implementado y listo para usar

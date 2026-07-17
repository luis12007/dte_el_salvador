# Análisis de Errores Potenciales No Capturados

## 📊 Resumen Ejecutivo

Se han identificado **42 tipos de errores potenciales** que podrían ocurrir en:
- ✅ **Login**
- ✅ **Crear DTE/Factura**
- ✅ **Crear Crédito Fiscal (CF)**
- ✅ **Home / Facturas**

Que **NO están siendo atrapados completamente** por la implementación actual.

---

## 🔐 ERRORS EN LOGIN

### Categoría 1: Validación de Datos de Entrada
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 1.1 | Usuario vacío | Usuario no completa campo | Form no valida |
| 1.2 | Contraseña vacía | Usuario no completa campo | Form no valida |
| 1.3 | Usuario muy largo | >100 caracteres | Rechazado por servidor |
| 1.4 | Caracteres especiales inválidos | Usuario con símbolos | Validación SQL |
| 1.5 | Email inválido (si aplica) | Formato incorrecto | Validación server |

### Categoría 2: Errores de Response
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 2.1 | Response vacía | Servidor retorna null | JSON.parse() falla |
| 2.2 | Response malformada | JSON incompleto | Crash al acceder a propiedades |
| 2.3 | Falta token en response | Servidor olvida token | localStorage.setItem falla |
| 2.4 | Token formato inválido | Token corrupto | Autenticación posterior falla |
| 2.5 | user_id no es número | user_id = "abc" | localStorage guarda string |
| 2.6 | Ambiente no válido | ambiente = "02" | Lógica de negocio falla |

### Categoría 3: Errores de Negocio
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 3.1 | Usuario no confirmado | Email sin verificar | Login rechazado |
| 3.2 | Usuario bloqueado | Cuenta suspendida | Login rechazado |
| 3.3 | Usuario inactivo | Cuenta desactivada | Login rechazado |
| 3.4 | Límite de intentos excedido | Múltiples intentos fallidos | Cuenta bloqueada |
| 3.5 | Pago no procesado | No se completó pago | result.payment === false |
| 3.6 | Suscripción expirada | Pago vencido | Login rechazado |
| 3.7 | Token MH expirado | Sesión MINIS perdida | No puede crear DTEs |

### Categoría 4: Errores de MH (Ministerio de Hacienda)
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 4.1 | Credenciales MH inválidas | Usuario/contraseña MH incorrectos | loginMinis falla |
| 4.2 | Servidor MH no disponible | Servidor caído | TIMEOUT |
| 4.3 | Token MH inválido | loginMinis retorna token corrupto | Operaciones posteriores fallan |
| 4.4 | Rate limit MH | Demasiadas solicitudes | 429 Too Many Requests |

### Categoría 5: Errores de Estado/Lógica
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 5.1 | localStorage vacío | Datos borrados entre pasos | Acceso denegado |
| 5.2 | Token expirado antes de guardar | Race condition | Datos no se guardan |
| 5.3 | Rol indefinido | role/rol/id_rol todos nulos | Permisos incorrectos |
| 5.4 | Usuario no es emisor | No tiene permisos para crear DTEs | Operaciones bloqueadas |

---

## 📝 ERRORES EN CREAR DTE/FACTURA

### Categoría 1: Validación de Datos Obligatorios
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.1 | Emisor incompleto | Falta NIT/nombre | Envío rechazado |
| 6.2 | Receptor incompleto | Falta información receptor | Envío rechazado |
| 6.3 | Items vacío | No hay líneas de detalle | Envío rechazado |
| 6.4 | Monto total inválido | Monto = 0 o negativo | Cálculo incorrecto |
| 6.5 | Fechas inválidas | fecha_generación > fecha_envío | Validación falla |
| 6.6 | Código de generación vacío | No se generó CG | Envío falla |

### Categoría 2: Validación de Formato
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.7 | NIT formato inválido | "12345" en lugar de "12345-6" | Rechazado MH |
| 6.8 | Números de control inválidos | NC duplicado en mismo período | Rechazado MH |
| 6.9 | Tipoode formato incorrecto | "factura" en lugar de "01" | Parse error |
| 6.10 | Moneda inválida | "ES" en lugar de "USD" | Rechazado MH |
| 6.11 | Departamento/Municipio inválido | "99" / "99" | Rechazado MH (known issue) |

### Categoría 3: Límites y Restricciones
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.12 | Límite de items | Más de 1000 líneas | Rechazado por servidor |
| 6.13 | Descripción muy larga | Descripción > 1000 caracteres | Truncado o rechazado |
| 6.14 | Monto muy grande | Monto > 999,999,999 | Overflow |
| 6.15 | Número de control duplicado | Mismo NC en mismo mes | Rechazado MH |

### Categoría 4: Errores de Firma Digital
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.16 | Certificado no disponible | Certificado no cargado | Firma falla |
| 6.17 | Certificado expirado | Fecha de expiración pasada | Firma inválida |
| 6.18 | Contraseña certificado incorrecta | Usuario ingresó mal | Firma falla |
| 6.19 | Firma vacía | FirmService retorna null | JSON malformado |
| 6.20 | Firma formato inválido | Base64 corrupto | Envío rechazado |

### Categoría 5: Errores de Envío a MH
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.21 | Municipio formato incorrecto | Issue conocida | Rechazado + Auto-fix intenta |
| 6.22 | Receptor sin municipio | Falta municipio | Rechazado MH |
| 6.23 | Respuesta MH parseada incorrectamente | JSON malformado | Estado desconocido |
| 6.24 | Sello recibido vacío | MH no retorna sello | Ticket no puede generarse |
| 6.25 | Estado "PROCESADO" pero sin sello | Inconsistencia | Guardar falla |

### Categoría 6: Errores de Base de Datos
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.26 | Inserción en plantilla falla | Database constraint | DTE se envía pero no se guarda |
| 6.27 | Actualización de estado falla | Race condition | Estados inconsistentes |
| 6.28 | Items no se guardan | Foreign key constraint | Pérdida de datos |

### Categoría 7: Errores de Correo
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.29 | Email receptor inválido | "example@" | Envío de correo falla |
| 6.30 | SendMailService no disponible | Servidor SMTP caído | Correo no se envía |
| 6.31 | PDF generación falla | Librería PDFKit error | Adjunto no se envía |

### Categoría 8: Errores de Estado/UI
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 6.32 | Usuario navega away durante envío | Page refresh | Petición huérfana |
| 6.33 | Double-click en botón enviar | Dos peticiones | Duplicación |
| 6.34 | Múltiples DTEs en paralelo | Race condition | Inconsistencia |

---

## 📋 ERRORES EN CREAR CRÉDITO FISCAL (CF)

### Categoría 1-4: (Similar a Crear DTE)
- 7.1 a 7.19: Validación de datos, formato, límites, firma
- Mismos riesgos que DTE

### Categoría 5: Errores CF Específicos
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 7.20 | DTE relacionado no existe | Referencia a factura inexistente | Rechazado MH |
| 7.21 | DTE relacionado no confirmado | CF antes que factura | Orden incorrecta |
| 7.22 | Monto CF > Monto DTE | CF por más que factura | Validación falla |
| 7.23 | Códigos de razón inválidos | Código de crédito erróneo | Rechazado MH |
| 7.24 | Múltiples CFs para mismo DTE | Duplicados | Estado inconsistente |

---

## 🏠 ERRORES EN HOME / FACTURAS

### Categoría 1: Carga de Datos
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.1 | Anuncio corrupto | AnnouncementService retorna null | App no renderiza |
| 8.2 | Anuncio versión inválida | version = null | localStorage falla |
| 8.3 | Bloqueo de pago retorna null | usePaymentBlock falla | Modal no se abre |
| 8.4 | Estado de pago ambiguo | API retorna estado desconocido | UI no sabe qué mostrar |

### Categoría 2: Permisos/Autorización
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.5 | user_id no es número | Guardado como string | Comparaciones fallan |
| 8.6 | Rol no viene en response | currentUserId indefinido | Permisos fallidos |
| 8.7 | Usuario intenta crear DTE pero debe pagar | guardPayment() retorna error | Navegación fallida |

### Categoría 3: Estado de Pago
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.8 | Payment service no responde | API timeout | Modal no se abre |
| 8.9 | Estado de pago ambiguo | "bloqueado" vs "vencido" | UX confusa |
| 8.10 | Cuenta bloqueada pero usuario intenta crear | guardPayment() no bloquea | Envío fallará después |

### Categoría 4: localStorage Corrompido
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.11 | token inválido en localStorage | Guardado corrupto | Peticiones fallan con 401 |
| 8.12 | user_id = NaN | Conversión incorrecta | Permisos fallan |
| 8.13 | announcement_seen_version no numérico | Comparación falla | Anuncio se repite |

### Categoría 5: Lista de Facturas
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.14 | Facturas array vacío pero no está claro | null vs [] | Diferente renderizado |
| 8.15 | Factura sin estado | status = undefined | UI no sabe cómo renderizar |
| 8.16 | Número de control duplicado en lista | Misma factura aparece 2 veces | UX confusa |
| 8.17 | Moneda desconocida en factura | currency = "XYZ" | Formato incorrecto |

### Categoría 6: Paginación/Búsqueda
| # | Error | Escenario | Impacto |
|---|-------|-----------|--------|
| 8.18 | Página no existe | user solicita página 999 | Array vacío |
| 8.19 | Filtro retorna resultados malformados | Datos inconsistentes | UI rompe |
| 8.20 | Sort por campo inexistente | Campo no existe | Sort falla |

---

## 🚀 ACCIONES RECOMENDADAS

### Prioridad 1: CRÍTICO (Implementar Inmediato)
```
✅ Ya implementado en ErrorHandlerService
- [x] Errores de conexión (1.x, 2.x de conectividad)
- [x] Errores 401/403 (autenticación/autorización)
- [x] Errores 500/503 (servidor)

❌ Falta implementar:
- [ ] Validación de datos de entrada (frontend)
- [ ] Validación de JSON response (parsing)
- [ ] Validación de valores nulos/indefinidos
- [ ] Validación de tipos de datos (user_id string vs number)
- [ ] Manejo de double-submit
```

### Prioridad 2: IMPORTANTE (Implementar en Semana)
```
❌ Falta implementar:
- [ ] Validar completitud de response
- [ ] Validar formato de tokens
- [ ] Validar estructura de objetos
- [ ] Manejo de localStorage corrupto
- [ ] Validar campos obligatorios antes de enviar
- [ ] Detectar condiciones de carrera (race conditions)
```

### Prioridad 3: NICE-TO-HAVE (Documentar/Mejorar)
```
❌ Falta implementar:
- [ ] Telemetría de errores
- [ ] Alertas de errores frecuentes
- [ ] Rollback automático en error
- [ ] Recuperación de datos incompletos
- [ ] Caché de respuestas fallidas
- [ ] Offline-first en ciertas operaciones
```

---

## 📋 LISTA DE IMPLEMENTACIONES SUGERIDAS

### 1. Validador de Input (Frontend)
```javascript
// Validar antes de enviar
- Usuario no vacío
- Contraseña mínimo 6 caracteres
- Email formato válido (si aplica)
- Números positivos
- Longitudes máximas
```

### 2. Validador de Response
```javascript
// Validar después de recibir
- Response no nula
- Campos obligatorios presentes
- Tipos de datos correctos
- Rangos de valores válidos
- Formatos esperados
```

### 3. Prevención de Double-Submit
```javascript
// En componentes con botones de envío
- Deshabilitar botón durante petición
- Prevenir múltiples clicks
- Mostrar loader/spinner
- Cancelar si usuario navega away
```

### 4. Validador de localStorage
```javascript
// Validar datos guardados
- Token existe y es string
- user_id es número
- ambiente es "00" o "01"
- role/rol existe
```

### 5. Manejo de Datos Faltantes
```javascript
// Si response no tiene ciertos campos
- Usar valores por defecto
- Marcar como "incompleto"
- Reintentar fetch
- Mostrar notificación al usuario
```

### 6. Validador de Integridad de Datos
```javascript
// Verificar consistencia
- Monto total = suma de items
- Fechas coherentes
- Estados válidos
- Referencias existen
```

### 7. Detector de Race Conditions
```javascript
// Prevenir operaciones paralelas conflictivas
- Guardar timestamp de operación
- Versioning de datos
- Locks optimistas
- Detección de conflictos
```

### 8. Error Grouping/Categorización
```javascript
// Agrupar errores similares
- Input validation errors
- Format errors
- Business logic errors
- System errors
- External service errors
```

---

## 🔍 VERIFICACIÓN RÁPIDA

### Test Case por Error Type

**Validación (400):**
```
POST /login con { usuario: "", password: "" }
→ Debe mostrar "Datos inválidos"
```

**Respuesta Malformada:**
```
Servidor retorna { token: "", user_id: null }
→ Debe detectar y mostrar error
```

**localStorage Corrupto:**
```
localStorage.token = "abc xyz 123" (inválido)
→ Debe limpiar y redirigir a login
```

**Double-Submit:**
```
Click 2x rápido en "Guardar"
→ Debe hacer solo 1 petición
```

**Datos Faltantes:**
```
Respuesta sin user_id
→ Debe detectar y pedir reintento
```

---

## 📊 Resumen por Categoría

| Categoría | Cantidad | Crítico | Ya Cubierto |
|-----------|----------|---------|------------|
| Conectividad | 4 | 4 | ✅ 4 |
| Validación Input | 5 | 3 | ❌ 0 |
| Validación Response | 6 | 4 | ❌ 1 |
| Errores Negocio | 7 | 3 | ❌ 1 |
| Errores MH | 4 | 4 | ❌ 0 |
| Formato/Límites | 10 | 5 | ❌ 0 |
| Firma Digital | 5 | 5 | ❌ 0 |
| Base de Datos | 3 | 3 | ❌ 0 |
| Correo | 3 | 1 | ❌ 0 |
| Double-Submit | 1 | 3 | ❌ 0 |
| localStorage | 4 | 4 | ❌ 0 |
| Estado/Pago | 4 | 2 | ❌ 1 |
| **TOTAL** | **42** | **31** | **✅ 7** |

---

## 📝 Próximos Pasos

1. **Revisar por prioridad** - ¿Cuál implementar primero?
2. **Crear validadores** - Input + Response
3. **Agregar checks** - localStorage, tipos de datos
4. **Prevenir race conditions** - Double-submit, operaciones paralelas
5. **Mejorar logging** - Categorizar errores
6. **Documentar patrones** - Para nuevas features

---

¿Cuál de estos tipos de errores te preocupa más?  
¿Cuál implementamos primero?

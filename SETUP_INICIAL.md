# Setup Inicial - Landing + Sistema de Tickets

## 📋 Archivos Modificados/Creados

### ✅ Creados
- **FormularioDinamico.jsx** - Modal con formulario para solicitar programas

### ✅ Modificados
- **Programas.jsx** - Ahora lee formularios activos del sistema
- **pages/Programas.jsx** - Integra formulario dinámico
- **pages/Home.jsx** - Integra formulario dinámico en home

---

## 🚀 Cómo Probar

### Paso 1: Activar Formularios en el Sistema

Abre la landing en una pestaña y el sistema de tickets en otra pestaña/ventana.

#### Opción A: Usar Panel Admin del Sistema
1. Abre sistema: http://localhost:5173 (sistema)
2. Login: admin@agenciacalidad.gob.ar / admin123
3. Click en "Administración"
4. Ve a pestaña "Formularios"
5. Activa los programas deseados

#### Opción B: Agregar Datos Manualmente (Dev)
Abre la consola del navegador (F12) en cualquier pestaña y copia esto:

```javascript
// Agregar formularios de prueba
localStorage.setItem('sc_formularios', JSON.stringify([
  {
    id: 'form-1',
    programa: 'Microcréditos 2024',
    activo: true,
    descripcion: 'Solicite financiamiento para bienes capitales',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: 'form-2',
    programa: 'Programa Aprender, Trabajar y Producir',
    activo: true,
    descripcion: 'Apoyo para emprendedores',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  },
  {
    id: 'form-3',
    programa: 'Cosecha y Acarreo 2026',
    activo: false,
    descripcion: 'Programa de acarreo',
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
  }
]))

// Confirmar
localStorage.getItem('sc_formularios')
```

### Paso 2: Ver Programas en Landing

1. Abre landing: http://localhost:5173 (o puerto donde esté configurada)
2. Ve a sección "Programas"
3. Verás:
   - Programas activos: con badge verde "Activo" y botón "Solicitar"
   - Programas inactivos: atenuados con texto "Próximamente"

### Paso 3: Completar Solicitud

1. Haz click en "Solicitar" en un programa activo
2. Abre modal con formulario
3. Completa:
   - Nombre Completo (requerido)
   - Email (requerido, validado)
   - Teléfono (opcional)
   - Detalles de la Solicitud (opcional)
4. Click "Enviar Solicitud"
5. Verás número de seguimiento

### Paso 4: Ver Ticket en el Sistema

1. Abre sistema de tickets
2. Ve a sección "Dashboard"
3. En lista de tickets, verás el nuevo ticket:
   - Título: "Solicitud: [Programa]"
   - Estado: "abierto"
   - Ciudadano: nombre que ingresaste
   - Email: email que ingresaste

---

## 🔄 Flujo de Sincronización

### Landing → Sistema

```
Landing abierta en pestaña 1
└── Ciudadano completa formulario
    └── FormularioDinamico.jsx crea ticket en localStorage
        └── localStorage.setItem('sc_tickets', ...)
            └── Ticket disponible en Sistema
```

### Sistema → Landing

```
Sistema abierto en pestaña 2
└── Admin activa programa en "Administración" → "Formularios"
    └── localStorage.setItem('sc_formularios', ...)
        └── Landing detecta cambio (evento 'storage')
            └── Programas.jsx re-renderiza
                └── Programa aparece activo en landing
```

---

## 📱 Respuesta del Formulario

Cuando se envía un formulario, se crea un ticket con estructura:

```javascript
{
  id: "uuid-1234567890",           // ID único
  numero: 5,                         // Número de seguimiento
  titulo: "Solicitud: Microcréditos 2024",
  descripcion: "Detalles del ciudadano...",
  estado: "abierto",
  prioridad: "media",
  formularioId: "form-1",
  ciudadanoNombre: "Juan Pérez",
  ciudadanoEmail: "juan@ejemplo.com",
  ciudadanoTelefono: "264 4123456",
  creadoEn: "2026-05-20T14:30:00.000Z",
  comentarios: []
}
```

---

## 🧪 Casos de Prueba

### ✅ Test 1: Programa Activo
1. Activa "Microcréditos 2024"
2. En landing, debe aparecer con badge verde
3. Botón "Solicitar" debe estar habilitado

### ✅ Test 2: Programa Inactivo
1. Desactiva todos los programas
2. En landing, todos deben verse atenuados
3. Sin botón "Solicitar"

### ✅ Test 3: Completar Formulario
1. Completa todos los campos
2. Envía
3. Debe aparecer número de seguimiento

### ✅ Test 4: Validación Email
1. Intenta enviar con email inválido (ej: "test")
2. Debe mostrar error: "Email inválido"

### ✅ Test 5: Sincronización Real-time
1. Abre landing en pestaña A
2. Abre sistema en pestaña B
3. En sistema, activa/desactiva un programa
4. En landing (pestaña A), debe cambiar automáticamente

### ✅ Test 6: Ticket Creado
1. Completa formulario en landing
2. Abre sistema en otra pestaña
3. Debe aparecer el ticket con los datos completos

---

## 🔧 Troubleshooting

### Los programas no aparecen como activos en landing
**Solución**:
- Verificar que localStorage tenga `sc_formularios`
- En consola: `localStorage.getItem('sc_formularios')`
- Recargar página de landing (F5)

### El formulario no se envía
**Solución**:
- Abrir consola (F12)
- Ver si hay errores
- Verificar que localStorage esté disponible
- Limpiar y reintentar

### Datos no sincronizan entre pestañas
**Solución**:
- localStorage solo sincroniza si estás en MISMO dominio
- Si usas dos puertos locales (5173, 3000), debe ser mismo host (localhost)
- Abrir en MISMO navegador, no incógnito

### El ticket no aparece en el sistema
**Solución**:
- En consola del sistema, verificar: `localStorage.getItem('sc_tickets')`
- Recargar página del sistema
- Verificar que no haya error en consola

---

## 📊 Estado del Proyecto

| Componente | Status |
|-----------|--------|
| Programas.jsx | ✅ Lee formularios activos |
| FormularioDinamico.jsx | ✅ Crea tickets |
| Sincronización localStorage | ✅ Real-time |
| Validación de formulario | ✅ Email, campos requeridos |
| Número de seguimiento | ✅ Automático |
| Modal responsive | ✅ Mobile-friendly |

---

## 🚀 Siguiente Paso

Una vez validado que todo funciona:

1. Cambiar `VITE_API_URL` en sistema a URL real cuando servidor disponible
2. Cambiar `VITE_USE_LOCAL_STORAGE=false` en ambos proyectos
3. Backend manejará persistencia en BD real
4. Mismo código funciona sin cambios

---

## 📝 Notas

- Los datos persisten en localStorage hasta que limpies caché
- Puedes limpiar datos manualmente con: `localStorage.clear()`
- Números de seguimiento se asignan secuencialmente
- Tickets nunca se eliminan (estado puede cambiar a "cerrado")

---

**Estado**: ✅ Listo para testing local
**Última actualización**: Mayo 20, 2026
# Sección de Formularios - Landing Page

## ✅ Lo que se implementó

### Componentes Creados

#### 1. **FormularioDinamico.jsx**
Modal interactivo para solicitar programas:
- ✅ Formulario con validación
- ✅ Campos: Nombre, Email, Teléfono, Detalles
- ✅ Validación de email
- ✅ Mensaje de éxito con número de seguimiento
- ✅ Sincronización automática con localStorage del sistema
- ✅ Responsive y mobile-friendly

### Componentes Actualizados

#### 2. **Programas.jsx**
Lee formularios activos del sistema en tiempo real:
- ✅ Lee de `localStorage.sc_formularios`
- ✅ Muestra badge "Activo" solo en programas habilitados
- ✅ Botón "Solicitar" solo en programas activos
- ✅ Sincronización en tiempo real (evento `storage`)
- ✅ Programas inactivos aparecen atenuados

#### 3. **pages/Programas.jsx**
Página dedicada de programas:
- ✅ Componente Programas integrado
- ✅ Modal FormularioDinamico
- ✅ Sección "¿Cómo solicitar?" con 3 pasos

#### 4. **pages/Home.jsx**
Página principal con programas:
- ✅ Componente Programas integrado
- ✅ Modal FormularioDinamico desde home

---

## 🔄 Flujo de Datos

```
Admin (Sistema)
    ↓
Activa programa → localStorage.sc_formularios
    ↓
Landing.jsx detecta cambio (evento storage)
    ↓
Programas.jsx re-renderiza
    ↓
Ciudadano ve programa activo
    ↓
Ciudadano hace click "Solicitar"
    ↓
FormularioDinamico.jsx abre modal
    ↓
Ciudadano completa y envía
    ↓
Ticket creado → localStorage.sc_tickets
    ↓
Sistema detecta nuevo ticket (evento storage)
    ↓
Admin ve ticket en panel de control
```

---

## 🚀 Cómo Empezar a Probar

### Opción 1: Usando el Panel Admin del Sistema

1. **Abre dos ventanas/pestañas**:
   - Pestaña A: Sistema de tickets (http://localhost:3000)
   - Pestaña B: Landing (http://localhost:5173)

2. **En el Sistema (Pestaña A)**:
   - Login: admin@agenciacalidad.gob.ar / admin123
   - Click "Administración"
   - Pestaña "Formularios"
   - Activa los programas que quieras

3. **En la Landing (Pestaña B)**:
   - Actualiza la página (F5)
   - Ve a "Programas"
   - Deberías ver programas activos con badge verde

4. **Completa una solicitud**:
   - Click "Solicitar" en un programa activo
   - Completa el formulario
   - Click "Enviar Solicitud"
   - Recibe número de seguimiento

5. **Verifica en Sistema**:
   - Vuelve a Pestaña A
   - Ve a "Dashboard"
   - Deberías ver el nuevo ticket

### Opción 2: Usando Comandos en Consola

1. **Abre consola (F12)** en la landing
2. **Copia y pega**:

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
  }
]))

// Recargar
location.reload()
```

3. Ahora los programas aparecerán activos en la landing

### Opción 3: Usando CONSOLE_HELPERS.js

1. **Copia todo el contenido** de `CONSOLE_HELPERS.js`
2. **Pega en consola (F12)** del navegador
3. **Usa los comandos**:

```javascript
ayuda()                                    // Ver todos los comandos
agregarFormulariosDePrueba()               // Agregar datos de prueba
verFormulariosActivos()                    // Ver cuales están activos
activarPrograma('Microcréditos 2024')      // Activar un programa
desactivarPrograma('Cosecha y Acarreo 2026') // Desactivar un programa
verTickets()                               // Ver todos los tickets
status()                                   // Estado general del sistema
```

---

## 📊 Estructura de Datos

### Formulario (sc_formularios)
```javascript
{
  id: "form-1",
  programa: "Microcréditos 2024",
  activo: true,                    // ← Es lo importante
  descripcion: "...",
  creadoEn: "2026-05-20T...",
  actualizadoEn: "2026-05-20T...",
}
```

### Ticket Creado (sc_tickets)
```javascript
{
  id: "uuid-1234567890",
  numero: 5,                        // ← Número de seguimiento
  titulo: "Solicitud: Microcréditos 2024",
  descripcion: "Detalles del ciudadano...",
  estado: "abierto",
  prioridad: "media",
  formularioId: "form-1",           // ← Vinculado al formulario
  ciudadanoNombre: "Juan Pérez",    // ← Datos del formulario
  ciudadanoEmail: "juan@ejemplo.com",
  ciudadanoTelefono: "264 4123456",
  creadoEn: "2026-05-20T14:30:00.000Z",
  comentarios: []
}
```

---

## 🎨 Diseño

### Características Visuales

- **Modal overlay** con fondo oscuro
- **Header naranja** con cierre (X)
- **Campos con validación visual**
- **Mensaje de éxito en verde** con número destacado
- **Mensaje de error en rojo** con detalles
- **Botones animados** al pasar mouse
- **Responsive**: funciona en mobile, tablet y desktop

### Colores Utilizados
- Naranja (#FF9500) - Acciones primarias
- Verde (#22c55e) - Éxito
- Rojo (#ef4444) - Errores

---

## ✨ Características

| Característica | Estado |
|---|---|
| Lectura de formularios activos | ✅ |
| Sincronización en tiempo real | ✅ |
| Modal de formulario | ✅ |
| Validación de email | ✅ |
| Validación de campos requeridos | ✅ |
| Creación de tickets | ✅ |
| Número de seguimiento | ✅ |
| Responsive design | ✅ |
| Badge "Activo" | ✅ |
| Mensaje de éxito | ✅ |
| Manejo de errores | ✅ |

---

## 🧪 Testing Checklist

- [ ] Abre landing y ve sección Programas
- [ ] Activa un programa desde admin del sistema
- [ ] En landing aparece programa activo con badge verde
- [ ] Botón "Solicitar" está visible y funciona
- [ ] Click abre modal de formulario
- [ ] Puedes escribir en todos los campos
- [ ] Validación rechaza email inválido
- [ ] Envío crea ticket con número de seguimiento
- [ ] Número de seguimiento aparece en mensaje de éxito
- [ ] Ticket aparece en sistema después de crear
- [ ] Datos del ciudadano se guardan correctamente
- [ ] Desactivando programa lo oculta en landing
- [ ] Formulario limpia después de enviar exitosamente
- [ ] Modal se cierra con botón X
- [ ] Modal se cierra con botón "Cerrar" después de éxito
- [ ] Funciona en mobile (responsive)

---

## 🐛 Troubleshooting

### Los programas no aparecen activos
- [ ] Verificar que `sc_formularios` existe en localStorage
- [ ] Recargar landing (F5)
- [ ] Ver consola para errores

### El formulario no se envía
- [ ] Verificar que `sc_tickets` existe en localStorage
- [ ] Validar que email esté en formato correcto
- [ ] Ver consola para errores

### Cambios en admin no se ven en landing
- [ ] Asegurar que es MISMO dominio (ambos en localhost)
- [ ] NO usar incógnito/privado en diferentes ventanas
- [ ] Recargar landing manualmente

### El ticket no aparece en sistema
- [ ] Recargar página del sistema (F5)
- [ ] Verificar que `sc_tickets` tenga el nuevo ticket
- [ ] En consola: `JSON.parse(localStorage.getItem('sc_tickets'))`

---

## 📝 Notas Importantes

1. **localStorage** solo funciona en desarrollo
2. **Sincronización** solo funciona en MISMO navegador
3. **Datos persisten** hasta limpiar caché
4. **Números** se asignan secuencialmente
5. **Email** solo valida formato, no existencia

---

## 🚀 Próximo Paso

Una vez que funcione todo localmente:

1. Conectar backend real cuando servidor disponible
2. Cambiar `VITE_API_URL` a servidor real
3. Cambiar `VITE_USE_LOCAL_STORAGE=false`
4. Código sigue funcionando sin cambios

---

**Estado**: ✅ Completado y Listo para Testing
**Última actualización**: Mayo 20, 2026
**Versión**: 1.0 (Local Development Ready)
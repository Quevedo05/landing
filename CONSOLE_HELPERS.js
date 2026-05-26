/**
 * CONSOLE_HELPERS.js
 * ==================
 * Funciones auxiliares para testing en la consola del navegador
 *
 * Copia y pega estas funciones en la consola (F12) del navegador
 * para facilitar el testing del sistema
 */

// ============================================
// 1. AGREGAR FORMULARIOS DE PRUEBA
// ============================================

function agregarFormulariosDePrueba() {
  const formularios = [
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
  ]

  localStorage.setItem('sc_formularios', JSON.stringify(formularios))
  console.log('✅ Formularios de prueba agregados')
  console.log(formularios)
}

// ============================================
// 2. VER FORMULARIOS ACTIVOS
// ============================================

function verFormulariosActivos() {
  const formulariosStr = localStorage.getItem('sc_formularios')
  const formularios = formulariosStr ? JSON.parse(formulariosStr) : []
  const activos = formularios.filter(f => f.activo)

  console.log('📋 Formularios activos:')
  console.table(activos)
  return activos
}

// ============================================
// 3. ACTIVAR UN PROGRAMA
// ============================================

function activarPrograma(nombrePrograma) {
  const formulariosStr = localStorage.getItem('sc_formularios') || '[]'
  const formularios = JSON.parse(formulariosStr)

  const actualizado = formularios.map(f => {
    if (f.programa === nombrePrograma) {
      return {
        ...f,
        activo: true,
        actualizadoEn: new Date().toISOString(),
      }
    }
    return f
  })

  localStorage.setItem('sc_formularios', JSON.stringify(actualizado))
  console.log(`✅ Programa "${nombrePrograma}" activado`)

  // Disparar evento storage para que landing se actualice
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'sc_formularios',
    newValue: JSON.stringify(actualizado),
  }))
}

// ============================================
// 4. DESACTIVAR UN PROGRAMA
// ============================================

function desactivarPrograma(nombrePrograma) {
  const formulariosStr = localStorage.getItem('sc_formularios') || '[]'
  const formularios = JSON.parse(formulariosStr)

  const actualizado = formularios.map(f => {
    if (f.programa === nombrePrograma) {
      return {
        ...f,
        activo: false,
        actualizadoEn: new Date().toISOString(),
      }
    }
    return f
  })

  localStorage.setItem('sc_formularios', JSON.stringify(actualizado))
  console.log(`✅ Programa "${nombrePrograma}" desactivado`)

  // Disparar evento storage
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'sc_formularios',
    newValue: JSON.stringify(actualizado),
  }))
}

// ============================================
// 5. VER TODOS LOS TICKETS
// ============================================

function verTickets() {
  const ticketsStr = localStorage.getItem('sc_tickets')
  const tickets = ticketsStr ? JSON.parse(ticketsStr) : []

  console.log(`📊 Total de tickets: ${tickets.length}`)
  console.table(tickets.map(t => ({
    numero: t.numero,
    titulo: t.titulo,
    estado: t.estado,
    ciudadano: t.ciudadanoNombre,
    email: t.ciudadanoEmail,
    fecha: new Date(t.creadoEn).toLocaleDateString('es-AR'),
  })))
  return tickets
}

// ============================================
// 6. VER TICKETS DE UN PROGRAMA ESPECÍFICO
// ============================================

function verTicketsDelPrograma(programa) {
  const ticketsStr = localStorage.getItem('sc_tickets')
  const tickets = ticketsStr ? JSON.parse(ticketsStr) : []

  const filtrados = tickets.filter(t =>
    t.titulo.toLowerCase().includes(programa.toLowerCase())
  )

  console.log(`📊 Tickets de "${programa}": ${filtrados.length}`)
  console.table(filtrados)
  return filtrados
}

// ============================================
// 7. LIMPIAR TODOS LOS DATOS
// ============================================

function limpiarTodo() {
  if (confirm('⚠️ Esto eliminará TODOS los datos. ¿Está seguro?')) {
    localStorage.removeItem('sc_formularios')
    localStorage.removeItem('sc_tickets')
    localStorage.removeItem('sc_usuarios')
    localStorage.removeItem('sc_sesion')
    localStorage.removeItem('sc_token')
    console.log('✅ Todos los datos fueron eliminados')
    location.reload()
  }
}

// ============================================
// 8. CREAR TICKET MANUALMENTE
// ============================================

function crearTicketManual(datos) {
  const {
    nombreCiudadano,
    emailCiudadano,
    telefonoCiudadano = '',
    programa = 'Microcréditos 2024',
    descripcion = 'Solicitud de prueba',
  } = datos

  const ticketsStr = localStorage.getItem('sc_tickets') || '[]'
  const tickets = JSON.parse(ticketsStr)

  const nuevoTicket = {
    id: 'uuid-' + Date.now(),
    numero: (tickets.length || 0) + 1,
    titulo: `Solicitud: ${programa}`,
    descripcion: descripcion,
    estado: 'abierto',
    prioridad: 'media',
    formularioId: 'form-1',
    ciudadanoNombre: nombreCiudadano,
    ciudadanoEmail: emailCiudadano,
    ciudadanoTelefono: telefonoCiudadano,
    creadoEn: new Date().toISOString(),
    comentarios: [],
  }

  tickets.push(nuevoTicket)
  localStorage.setItem('sc_tickets', JSON.stringify(tickets))

  console.log('✅ Ticket creado manualmente')
  console.log(`Número: ${nuevoTicket.numero}`)
  console.log(`Ciudadano: ${nombreCiudadano}`)
  console.log(`Email: ${emailCiudadano}`)

  return nuevoTicket
}

// ============================================
// 9. STATUS - Ver estado general
// ============================================

function status() {
  const formularios = localStorage.getItem('sc_formularios')
    ? JSON.parse(localStorage.getItem('sc_formularios'))
    : []
  const tickets = localStorage.getItem('sc_tickets')
    ? JSON.parse(localStorage.getItem('sc_tickets'))
    : []
  const usuarios = localStorage.getItem('sc_usuarios')
    ? JSON.parse(localStorage.getItem('sc_usuarios'))
    : []

  const formularioActivos = formularios.filter(f => f.activo).length

  console.log(`
╔════════════════════════════════════════╗
║        STATUS DEL SISTEMA              ║
╠════════════════════════════════════════╣
║ 📋 Formularios: ${formularios.length} (${formularioActivos} activos)
║ 🎫 Tickets: ${tickets.length}
║ 👥 Usuarios: ${usuarios.length}
╚════════════════════════════════════════╝
  `)

  console.log('Programas disponibles:')
  formularios.forEach(f => {
    const icon = f.activo ? '✅' : '⭕'
    console.log(`  ${icon} ${f.programa}`)
  })

  if (tickets.length > 0) {
    console.log('\nÚltimos tickets:')
    tickets.slice(-3).forEach(t => {
      console.log(`  #${t.numero}: ${t.titulo} (${t.estado})`)
    })
  }
}

// ============================================
// 10. AYUDA
// ============================================

function ayuda() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║           COMANDOS DISPONIBLES - TESTING                  ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║ 📋 FORMULARIOS:                                            ║
║   • agregarFormulariosDePrueba()                           ║
║   • verFormulariosActivos()                                ║
║   • activarPrograma('Microcréditos 2024')                  ║
║   • desactivarPrograma('Cosecha y Acarreo 2026')           ║
║                                                            ║
║ 🎫 TICKETS:                                                ║
║   • verTickets()                                           ║
║   • verTicketsDelPrograma('Microcréditos')                 ║
║   • crearTicketManual({                                    ║
║       nombreCiudadano: 'Juan Pérez',                       ║
║       emailCiudadano: 'juan@ejemplo.com',                  ║
║       programa: 'Microcréditos 2024'                       ║
║     })                                                     ║
║                                                            ║
║ 🔧 UTILIDADES:                                             ║
║   • status()              - Ver estado general             ║
║   • limpiarTodo()         - Eliminar todos los datos       ║
║   • ayuda()               - Mostrar esta ayuda             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `)
}

// Mostrar ayuda al cargar
console.log('%c🚀 Sistema de Testing Cargado', 'color: green; font-size: 14px; font-weight: bold;')
console.log('%cEscribe: ayuda()', 'color: blue; font-size: 12px;')
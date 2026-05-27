import { api, USE_LOCAL_STORAGE } from './api.js'

export async function crearTicket(datos) {
  if (USE_LOCAL_STORAGE) {
    const ticketsStr = localStorage.getItem('sc_tickets') || '[]'
    const tickets = JSON.parse(ticketsStr)
    const ticket = {
      id: 'uuid-' + Date.now(),
      numero: (tickets.length || 0) + 1,
      titulo: `Solicitud: ${datos.programa}`,
      descripcion: datos.descripcion || 'Sin detalles adicionales',
      estado: 'abierto',
      prioridad: 'media',
      formularioId: datos.formularioId,
      ciudadanoNombre: datos.ciudadanoNombre,
      ciudadanoEmail: datos.ciudadanoEmail,
      ciudadanoTelefono: datos.ciudadanoTelefono || null,
      creadoEn: new Date().toISOString(),
      comentarios: [],
    }
    tickets.push(ticket)
    localStorage.setItem('sc_tickets', JSON.stringify(tickets))
    return { ticketId: ticket.id, numero: ticket.numero, mensaje: 'Ticket creado' }
  }
  return api.post('/tickets/crear-desde-formulario', datos)
}

import { Calendar, MapPin, Clock } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

/**
 * Para agregar eventos, añadir objetos a este arreglo con el formato:
 * {
 *   fecha: 'DD/MM/YYYY',
 *   hora: 'HH:MM hs',          (opcional)
 *   titulo: 'Nombre del evento',
 *   descripcion: 'Descripción breve',
 *   lugar: 'Lugar del evento',  (opcional)
 *   tipo: 'capacitacion' | 'evento' | 'jornada' | 'reunion',
 * }
 */
export const eventos = [
  // Agregar eventos aquí. Ejemplo:
  // {
  //   fecha: '15/07/2026',
  //   hora: '09:00 hs',
  //   titulo: 'Taller de Innovación PyME',
  //   descripcion: 'Jornada de capacitación para pequeñas y medianas empresas.',
  //   lugar: 'Sede Agencia Calidad San Juan',
  //   tipo: 'capacitacion',
  // },
]

const tipoConfig = {
  capacitacion: { label: 'Capacitación', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  evento: { label: 'Evento', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  jornada: { label: 'Jornada', color: 'bg-green-100 text-green-700 border-green-200' },
  reunion: { label: 'Reunión', color: 'bg-purple-100 text-purple-700 border-purple-200' },
}

function parseFecha(fechaStr) {
  const [d, m, y] = fechaStr.split('/')
  return new Date(`${y}-${m}-${d}`)
}

export default function CalendarioEventos() {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const proximosEventos = eventos
    .filter((e) => parseFecha(e.fecha) >= hoy)
    .sort((a, b) => parseFecha(a.fecha) - parseFecha(b.fecha))

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Agenda de Actividades"
          subtitle="Próximas capacitaciones, jornadas y eventos organizados por la Agencia."
          centered
        />

        <div className="mt-12">
          {proximosEventos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-orange-500" />
              </div>
              <p className="text-gray-500 font-medium">Próximamente se publicarán nuevas actividades.</p>
              <p className="text-gray-400 text-sm mt-1">
                ¡Seguinos en redes sociales para estar al tanto de las novedades!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {proximosEventos.map((evento, i) => {
                const config = tipoConfig[evento.tipo] || tipoConfig.evento
                const fecha = parseFecha(evento.fecha)
                const dia = fecha.toLocaleString('es-AR', { day: '2-digit' })
                const mes = fecha.toLocaleString('es-AR', { month: 'short' }).replace('.', '').toUpperCase()
                const anio = fecha.getFullYear()

                return (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-2xl overflow-hidden bg-white
                               hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Encabezado fecha */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-4 flex items-center gap-4">
                      <div className="text-center text-white">
                        <p className="text-3xl font-extrabold leading-none">{dia}</p>
                        <p className="text-sm font-semibold opacity-80">{mes}</p>
                        <p className="text-xs opacity-70">{anio}</p>
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${config.color}`}>
                          {config.label}
                        </span>
                        <p className="text-white font-bold text-base mt-1 leading-tight">{evento.titulo}</p>
                      </div>
                    </div>

                    {/* Detalle */}
                    <div className="p-5 space-y-2">
                      {evento.descripcion && (
                        <p className="text-gray-600 text-sm leading-relaxed">{evento.descripcion}</p>
                      )}
                      {evento.hora && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Clock size={14} className="text-orange-400" />
                          {evento.hora}
                        </div>
                      )}
                      {evento.lugar && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin size={14} className="text-orange-400" />
                          {evento.lugar}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

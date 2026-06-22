import SectionHeader from './ui/SectionHeader'

const logros = [
  {
    numero: '+500',
    titulo: 'Empresas Asistidas',
    descripcion:
      'PyMEs y emprendedores de San Juan que recibieron orientación técnica, financiera y capacitación para fortalecer su competitividad.',
    color: 'from-orange-400 to-orange-600',
    // Reemplazar con ruta real cuando estén disponibles las imágenes
    imagen: null,
  },
  {
    numero: '+150',
    titulo: 'Capacitaciones Realizadas',
    descripcion:
      'Talleres, jornadas y programas de formación organizados para el sector productivo provincial a lo largo del año.',
    color: 'from-amber-400 to-amber-600',
    imagen: null,
  },
  {
    numero: '+80',
    titulo: 'Proyectos Financiados',
    descripcion:
      'Iniciativas de innovación, calidad y desarrollo productivo que recibieron financiamiento para concretar sus objetivos.',
    color: 'from-red-400 to-orange-500',
    imagen: null,
  },
  {
    numero: '8',
    titulo: 'Puestos de Control SAVEAN',
    descripcion:
      'Barreras fitozoosanitarias activas que protegen las 24 horas la producción agrícola sanjuanina en puntos estratégicos.',
    color: 'from-orange-500 to-red-500',
    imagen: null,
  },
]

export default function LogrosSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Lo que hemos logrado"
          subtitle="Resultados concretos que demuestran nuestro compromiso con el sector productivo sanjuanino."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {logros.map(({ numero, titulo, descripcion, color, imagen }) => (
            <div
              key={titulo}
              className="group rounded-2xl overflow-hidden border border-gray-200 bg-white
                         hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Imagen o degradado de color */}
              {imagen ? (
                <img
                  src={imagen}
                  alt={titulo}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className={`h-44 bg-gradient-to-br ${color} flex flex-col items-center justify-center`}>
                  <span className="text-5xl font-extrabold text-white drop-shadow">{numero}</span>
                  {/* Placeholder para cuando se agreguen imágenes reales */}
                  <span className="text-white/60 text-xs mt-2 font-medium tracking-wider uppercase">
                    Agregar imagen
                  </span>
                </div>
              )}

              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-2">{titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{descripcion}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          * Para actualizar imágenes o cifras, editar el archivo{' '}
          <code className="bg-gray-100 px-1 rounded">src/components/LogrosSection.jsx</code>
        </p>
      </div>
    </section>
  )
}

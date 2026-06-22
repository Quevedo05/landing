const logros = [
  {
    numero: '+500',
    titulo: 'Empresas Asistidas',
    descripcion:
      'PyMEs y emprendedores de San Juan que recibieron orientación técnica, financiera y capacitación.',
    imagen: null,
  },
  {
    numero: '+150',
    titulo: 'Capacitaciones Realizadas',
    descripcion:
      'Talleres, jornadas y programas de formación para el sector productivo provincial.',
    imagen: null,
  },
  {
    numero: '+80',
    titulo: 'Proyectos Financiados',
    descripcion:
      'Iniciativas de innovación, calidad y desarrollo productivo que recibieron financiamiento.',
    imagen: null,
  },
  {
    numero: '8',
    titulo: 'Puestos de Control SAVEAN',
    descripcion:
      'Barreras fitozoosanitarias activas que protegen la producción agrícola sanjuanina.',
    imagen: null,
  },
]

export default function LogrosSection() {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado institucional */}
        <div className="mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Gestión y resultados
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Indicadores de gestión
          </h2>
          <div className="w-12 h-0.5 bg-primary mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {logros.map(({ numero, titulo, descripcion, imagen }) => (
            <div key={titulo} className="bg-white p-8 flex flex-col gap-4">
              {imagen ? (
                <img src={imagen} alt={titulo} className="w-full h-36 object-cover rounded" />
              ) : (
                <div className="h-36 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                  <span className="text-5xl font-bold text-gray-800">{numero}</span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{titulo}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useInView } from '../hooks/useInView'

const logros = [
  {
    numero: '+500',
    titulo: 'Empresas Asistidas',
    descripcion:
      'PyMEs y emprendedores de San Juan que recibieron orientación técnica, financiera y capacitación.',
  },
  {
    numero: '+150',
    titulo: 'Capacitaciones Realizadas',
    descripcion:
      'Talleres, jornadas y programas de formación para el sector productivo provincial.',
  },
  {
    numero: '+80',
    titulo: 'Proyectos Financiados',
    descripcion:
      'Iniciativas de innovación, calidad y desarrollo productivo que recibieron financiamiento.',
  },
  {
    numero: '8',
    titulo: 'Puestos de Control SAVEAN',
    descripcion:
      'Barreras fitozoosanitarias activas que protegen la producción agrícola sanjuanina.',
  },
]

export default function LogrosSection() {
  const ref = useInView()

  return (
    <section className="py-20 bg-white border-t border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-14 reveal">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Gestión y resultados
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            Indicadores de gestión
          </h2>
          <div className="w-12 h-0.5 bg-primary mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
          {logros.map(({ numero, titulo, descripcion }, i) => (
            <div
              key={titulo}
              className={`bg-white p-8 flex flex-col gap-3 hover:bg-orange-50 transition-colors duration-300 reveal delay-${i + 1}`}
            >
              <span className="text-5xl font-extrabold text-primary leading-none">
                {numero}
              </span>
              <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
              <p className="text-sm font-semibold text-gray-900">{titulo}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

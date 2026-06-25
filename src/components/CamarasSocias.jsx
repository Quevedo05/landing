import SectionHeader from './ui/SectionHeader'

/**
 * Para agregar cámaras, añadir objetos a este arreglo:
 * {
 *   nombre: 'Nombre de la Cámara',
 *   logo: '/logos/nombre-camara.png',   (colocar el logo en /public/logos/)
 *   descripcion: 'Breve descripción',    (opcional)
 *   web: 'https://...',                  (opcional)
 * }
 */
const camaras = [
  // Cámaras socias — agregar logos cuando estén disponibles
  { nombre: 'Cámara 1', logo: null, descripcion: 'Próximamente' },
  { nombre: 'Cámara 2', logo: null, descripcion: 'Próximamente' },
  { nombre: 'Cámara 3', logo: null, descripcion: 'Próximamente' },
  { nombre: 'Cámara 4', logo: null, descripcion: 'Próximamente' },
]

function LogoPlaceholder({ nombre }) {
  const iniciales = nombre
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  return (
    <div className="w-full h-28 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
      <span className="text-3xl font-extrabold text-gray-300">{iniciales || '?'}</span>
    </div>
  )
}

export default function CamarasSocias() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestras Cámaras Socias"
          subtitle="La Agencia Calidad San Juan trabaja junto a las principales cámaras del sector productivo provincial."
          centered
        />

        {/* Carta de presentación */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 mb-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-semibold
                            px-4 py-2 rounded-full border border-orange-200 mb-6">
              Alianzas Estratégicas
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Unidos por el desarrollo productivo sanjuanino
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              La Agencia de Calidad San Juan articula su trabajo con las cámaras y asociaciones
              empresariales de la provincia, generando sinergias que potencian el impacto de nuestros
              programas y benefician al conjunto del sector productivo local.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Juntos diseñamos estrategias, compartimos información y ejecutamos acciones concretas
              para mejorar la competitividad, la calidad y la sustentabilidad de las empresas
              sanjuaninas en el mercado regional, nacional e internacional.
            </p>
          </div>
        </div>

        {/* Grid de logos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {camaras.map(({ nombre, logo, web }) => {
            const contenido = (
              <div
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center
                           gap-3 hover:shadow-md transition-shadow duration-200 group"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={nombre}
                    className="h-20 w-full object-contain grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <LogoPlaceholder nombre={nombre} />
                )}
                <p className="text-sm font-semibold text-gray-700 text-center">{nombre}</p>
              </div>
            )

            return web ? (
              <a key={nombre} href={web} target="_blank" rel="noopener noreferrer">
                {contenido}
              </a>
            ) : (
              <div key={nombre}>{contenido}</div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

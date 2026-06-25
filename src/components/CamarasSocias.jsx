import SectionHeader from './ui/SectionHeader'
import { useInView } from '../hooks/useInView'

const camaras = [
  { nombre: 'Unión Industrial de San Juan', logo: '/logos/uisj.png' },
  { nombre: 'CASETIC', logo: '/logos/casetic.png', oscuro: true },
  { nombre: 'FESJ', logo: '/logos/fesj.png' },
  { nombre: 'CASEMI', logo: '/logos/casemi.png', oscuro: true },
]

export default function CamarasSocias() {
  const ref = useInView()

  return (
    <section className="py-20 bg-white border-t border-gray-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <SectionHeader
            title="Nuestras Cámaras Socias"
            subtitle="La Agencia Calidad San Juan trabaja junto a las principales cámaras del sector productivo provincial."
            centered
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
          {camaras.map(({ nombre, logo, oscuro }, i) => (
            <div
              key={nombre}
              className={`rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-3
                          hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal delay-${i + 1}
                          ${oscuro ? 'bg-gray-800' : 'bg-white'}`}
            >
              <img
                src={logo}
                alt={nombre}
                className="h-16 w-full object-contain transition-all duration-300"
              />
              <p className={`text-xs font-medium text-center leading-snug ${oscuro ? 'text-gray-300' : 'text-gray-500'}`}>
                {nombre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import SectionHeader from './ui/SectionHeader'
import { useInView } from '../hooks/useInView'

const camaras = [
  { nombre: 'Unión Industrial de San Juan', logo: '/logos/uisj.png' },
  { nombre: 'CASETIC', logo: '/logos/casetic.png', oscuro: true },
  { nombre: 'FESJ', logo: '/logos/fesj.png' },
  { nombre: 'CASEMI', logo: '/logos/casemi.png', oscuro: true },
  { nombre: 'Cámara Vitivinícola de San Juan', logo: '/logos/camara-vitivinicola.jpeg' },
  { nombre: 'Cámara Minera de San Juan', logo: '/logos/camara-minera.jpeg' },
  { nombre: 'Cámara Olivícola', logo: '/logos/logo-camara-olivicola.png' },
  { nombre: 'Cámara de Transporte', logo: '/logos/logoTranspCh.png' },
  { nombre: 'CAPMIN', logo: '/logos/capmin.png' },
]

function LogoCard({ nombre, logo, oscuro }) {
  return (
    <div className={`flex-shrink-0 w-40 mx-4 rounded-2xl border border-gray-200 p-5
                     flex flex-col items-center justify-center gap-3
                     ${oscuro ? 'bg-gray-800' : 'bg-white'}`}>
      <img src={logo} alt={nombre} className="h-14 w-full object-contain" />
      <p className={`text-xs font-medium text-center leading-snug ${oscuro ? 'text-gray-300' : 'text-gray-500'}`}>
        {nombre}
      </p>
    </div>
  )
}

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
      </div>

      {/* Banner infinito — ancho completo para que el scroll no muestre bordes */}
      <div className="mt-12 overflow-hidden marquee-track">
        <div className="flex animate-marquee">
          {/* Lista duplicada para el loop continuo */}
          {[...camaras, ...camaras].map(({ nombre, logo, oscuro }, i) => (
            <LogoCard key={i} nombre={nombre} logo={logo} oscuro={oscuro} />
          ))}
        </div>
      </div>
    </section>
  )
}

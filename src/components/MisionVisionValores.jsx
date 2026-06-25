import { useInView } from '../hooks/useInView'
import SectionHeader from './ui/SectionHeader'

const items = [
  {
    title: 'Misión',
    text: 'Gestionar, orientar y contribuir con las PyMEs y emprendedores de la provincia, fomentando su desarrollo sustentable y competitividad.',
    image: '/acsjmision.jpg',
  },
  {
    title: 'Visión',
    text: 'Ser una de las agencias guía del sector productivo, fomentando el crecimiento, la calidad y la sustentabilidad de las empresas sanjuaninas.',
    image: '/acsjvision.jpg',
  },
  {
    title: 'Valores',
    text: 'Integridad · Eficiencia · Excelencia · Transparencia · Confianza',
    image: '/acsjvalores.jpg',
  },
]

export default function MisionVisionValores() {
  const ref = useInView()

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <SectionHeader title="Nuestra Identidad" centered />
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          {items.map(({ title, text, image }, i) => (
            <div
              key={title}
              className={`group relative rounded-2xl overflow-hidden shadow-lg min-h-[320px] flex flex-col justify-end
                          hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 reveal delay-${i + 1}`}
            >
              {/* Imagen de fondo */}
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black/90" />
              {/* Contenido — sube levemente al hacer hover */}
              <div className="relative z-10 p-8 text-white text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-white/90 leading-relaxed text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

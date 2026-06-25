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
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestra Identidad"
          centered
        />
        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          {items.map(({ title, text, image }) => (
            <div
              key={title}
              className="relative rounded-2xl overflow-hidden shadow-lg min-h-[320px] flex flex-col justify-end"
            >
              {/* Imagen de fondo */}
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Overlay oscuro degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              {/* Contenido */}
              <div className="relative z-10 p-8 text-white">
                <h3 className="text-2xl font-bold mb-3 drop-shadow">{title}</h3>
                <p className="text-white/90 leading-relaxed text-sm drop-shadow">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

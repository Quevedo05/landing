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
              className="group relative rounded-2xl overflow-hidden shadow-lg min-h-[320px] flex flex-col justify-end"
            >
              {/* Imagen de fondo */}
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay oscuro degradado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              {/* Contenido */}
              <div className="relative z-10 p-8 text-white text-center">
                <h3
                  className="text-2xl font-bold mb-3 transition-all duration-300"
                  style={{
                    textShadow: '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25)',
                  }}
                >
                  {title}
                </h3>
                <p className="text-white/90 leading-relaxed text-sm drop-shadow transition-all duration-300 group-hover:text-white">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

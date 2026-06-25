import SectionHeader from './ui/SectionHeader'

export default function QuienesSomos() {
  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text column */}
          <div>
            <SectionHeader
              title="¿Quiénes Somos?"
              subtitle="La Agencia de Calidad San Juan es el organismo provincial que articula políticas de apoyo al sector productivo local."
            />
            <p className="text-gray-600 leading-relaxed mb-4">
              Orientamos, capacitamos y contribuimos técnica y financieramente
              para impulsar la competitividad de las PyMEs y emprendedores de
              San Juan.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dependemos del Gobierno de la Provincia de San Juan, trabajando
              en conjunto con los actores públicos y privados del ecosistema
              productivo regional.
            </p>
          </div>

          {/* Visual accent column */}
          <div className="flex justify-center">
            <img
              src="/acsj1.jpg"
              alt="Agencia Calidad San Juan"
              className="w-4/5 h-auto rounded-2xl object-cover shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

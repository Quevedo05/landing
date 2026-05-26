import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[72px]"
      style={{
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Government identity line */}
          <p className="text-sm font-medium tracking-widest uppercase opacity-80 mb-4 text-white">
            San Juan Gobierno · Ministerio de Producción, Trabajo e Innovación
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
            Agencia Calidad<br />San Juan
          </h1>

          <p className="text-lg sm:text-xl opacity-90 mb-10 leading-relaxed text-white">
            Orientamos, capacitamos y contribuimos técnica y financieramente
            para fortalecer el tejido productivo sanjuanino.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/nosotros" className="btn-primary bg-white text-primary hover:bg-gray-100">
              Conocé más
            </Link>
            <Link to="/contacto" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
              Contactanos
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}

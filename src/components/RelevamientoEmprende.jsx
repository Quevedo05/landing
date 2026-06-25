export default function RelevamientoEmprende() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Columna izquierda — contenido */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              San Juan Emprende · 2026
            </p>
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              Relevamiento Emprendedor
            </h2>
            <div className="w-12 h-0.5 bg-primary mb-6" />

            <p className="text-gray-600 leading-relaxed mb-6">
              El Relevamiento Emprendedor es el registro oficial de proyectos productivos
              de la Provincia de San Juan. Inscribirse es el primer paso para acceder a la
              red de apoyo institucional y participar de las iniciativas que ofrece el Estado
              provincial al sector emprendedor.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-gray-600">
              {[
                'Ingreso a la red oficial de emprendedores sanjuaninos',
                'Acceso a mentorías con referentes del sector',
                'Cupos prioritarios en capacitaciones provinciales',
                'Registro gratuito — se completa en menos de un minuto',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="https://sanjuanemprende.sanjuan.gob.ar/#registro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white
                         font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
            >
              Completar el Relevamiento
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* Columna derecha — tarjeta con imagen de fondo */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            {/* Imagen de fondo */}
            <img
              src="/sjemprende.jpg"
              alt="San Juan Emprende"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black/80" />

            {/* Contenido */}
            <div className="relative z-10 p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-5">
                ¿Por qué registrarse?
              </p>
              <div className="space-y-5 divide-y divide-white/20">
                {[
                  {
                    titulo: 'Visibilidad institucional',
                    texto: 'Tu proyecto queda registrado en la base oficial del Estado provincial, con acceso a programas de apoyo.',
                  },
                  {
                    titulo: 'Diseño de políticas públicas',
                    texto: 'Los datos relevados permiten al Estado identificar necesidades reales del sector y mejorar la asistencia.',
                  },
                  {
                    titulo: 'Articulación con la Agencia',
                    texto: 'La Agencia de Calidad San Juan utiliza el relevamiento para conectar emprendedores con sus programas.',
                  },
                ].map(({ titulo, texto }) => (
                  <div key={titulo} className="pt-5 first:pt-0">
                    <p className="text-sm font-semibold text-white mb-1">{titulo}</p>
                    <p className="text-sm text-white/75 leading-relaxed">{texto}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 mt-6 pt-5 flex items-center gap-3">
                <img
                  src="/logo-navbar.png"
                  alt="Agencia Calidad San Juan"
                  className="h-7 w-auto brightness-0 invert opacity-80"
                />
                <span className="text-white/60 text-xs">Iniciativa provincial · San Juan Gobierno</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

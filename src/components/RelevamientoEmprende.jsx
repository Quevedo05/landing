export default function RelevamientoEmprende() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)' }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Contenido izquierdo */}
            <div className="p-10 sm:p-14">
              <span className="inline-block bg-white/20 text-white text-xs font-bold tracking-widest
                               uppercase px-4 py-1.5 rounded-full mb-6 border border-white/30">
                San Juan Emprende · 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                Sumá tu proyecto al<br />
                <span className="text-yellow-200">Relevamiento Emprendedor</span>
              </h2>
              <p className="text-white/85 leading-relaxed mb-6">
                Un paso clave para ingresar a la red oficial y participar por mentorías con
                referentes del sector. Cupos asegurados en nuestras próximas capacitaciones.
              </p>

              <ul className="space-y-2 mb-8">
                {[
                  '100% gratuito',
                  'Registrate en 1 minuto',
                  'Accedé a la red de emprendedores sanjuaninos',
                  'Participá en mentorías y capacitaciones',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/90 text-sm">
                    <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://sanjuanemprende.sanjuan.gob.ar/#registro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold
                           px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors text-base shadow-lg"
              >
                Empezar el Relevamiento →
              </a>
            </div>

            {/* Panel derecho */}
            <div className="bg-white/10 backdrop-blur-sm p-10 sm:p-14 flex flex-col justify-center">
              <div className="bg-white/15 border border-white/20 rounded-2xl p-8 text-white">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 shadow">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#ea580c" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">¿Qué es el Relevamiento Emprendedor?</h3>
                <p className="text-white/80 leading-relaxed text-sm mb-5">
                  Es el registro oficial de emprendedores y proyectos productivos de la Provincia de
                  San Juan. Al inscribirte, formás parte de la base de datos que permite al Estado
                  diseñar mejores políticas de apoyo para vos y tu negocio.
                </p>
                <div className="border-t border-white/20 pt-5 flex items-center gap-3">
                  <img
                    src="/logo-navbar.png"
                    alt="Agencia Calidad San Juan"
                    className="h-8 w-auto brightness-0 invert"
                  />
                  <span className="text-white/60 text-xs">Iniciativa provincial · San Juan Gobierno</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

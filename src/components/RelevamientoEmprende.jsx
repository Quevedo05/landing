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

          {/* Columna derecha — imagen San Juan Emprende */}
          <div className="flex items-center justify-center">
            <img
              src="/sjemprende.jpg"
              alt="San Juan Emprende"
              className="w-full max-w-md h-auto rounded-2xl object-cover shadow-xl"
            />
          </div>

        </div>
      </div>
    </section>
  )
}

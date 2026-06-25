export default function RelevamientoEmprende() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-gray-100">
      {/* Imagen de fondo */}
      <img
        src="/sjemprende.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Degradado suave: más oscuro a la izquierda, se aclara hacia la derecha */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-2">
            San Juan Emprende · 2026
          </p>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Relevamiento Emprendedor
          </h2>
          <div className="w-12 h-0.5 bg-orange-400 mb-6" />

          <p className="text-white/85 leading-relaxed mb-6">
            El Relevamiento Emprendedor es el registro oficial de proyectos productivos
            de la Provincia de San Juan. Inscribirse es el primer paso para acceder a la
            red de apoyo institucional y participar de las iniciativas que ofrece el Estado
            provincial al sector emprendedor.
          </p>

          <ul className="space-y-3 mb-8 text-sm text-white/80">
            {[
              'Ingreso a la red oficial de emprendedores sanjuaninos',
              'Acceso a mentorías con referentes del sector',
              'Cupos prioritarios en capacitaciones provinciales',
              'Registro gratuito — se completa en menos de un minuto',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <a
            href="https://sanjuanemprende.sanjuan.gob.ar/#registro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white
                       font-semibold px-7 py-3 rounded-lg transition-colors text-sm shadow-lg"
          >
            Completar el Relevamiento
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

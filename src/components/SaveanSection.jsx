import { Leaf, ArrowRight } from 'lucide-react'

export default function SaveanSection() {
  return (
    <section id="savean" className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center justify-items-center">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf size={24} className="text-white" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                Sistema Provincial
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              SAVEAN
            </h2>
            <p className="text-lg opacity-90 leading-relaxed mb-4">
              Sistema de Apoyo a la Verificación y Emisión de Avales Nacionales.
              Gestión digital de guías de sanidad vegetal y animal para la
              circulación de productos agropecuarios en la provincia de San Juan.
            </p>
            <p className="opacity-80 leading-relaxed mb-8">
              Habilitá guías, consultá el estado de tus trámites y gestioná tu
              actividad productiva desde un solo portal.
            </p>
            <a
              href="/savean"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold
                         px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Acceder al Portal SAVEAN <ArrowRight size={18} />
            </a>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              'Emisión digital de guías',
              'Seguimiento en tiempo real',
              'Firma electrónica',
              'Historial de trámites',
              'Notificaciones automáticas',
              'Acceso para productores',
            ].map((feature) => (
              <div key={feature}
                className="bg-white/10 rounded-xl p-4 text-white text-sm font-medium">
                ✓ {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

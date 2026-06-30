import { programas } from '../data/programas'
import { CreditCard, Star, Sun, DollarSign, Percent, AlertCircle } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'

const iconMap = { CreditCard, Star, Sun }

export default function Programas() {
  return (
    <section id="programas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestros Programas"
          subtitle="Herramientas de apoyo diseñadas para potenciar el desarrollo productivo provincial."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {programas.map((p) => {
            const Icon = iconMap[p.icon] || Star
            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg hover:border-orange-200 transition-all duration-300"
              >
                {/* Header de la card */}
                <div className="bg-orange-50 px-6 py-5 flex items-center gap-4 border-b border-orange-100">
                  <div className="w-11 h-11 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{p.title}</h3>
                </div>

                {/* Cuerpo */}
                <div className="px-6 py-5 flex flex-col flex-1 gap-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>

                  {/* Métricas clave */}
                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <DollarSign size={14} />
                        <span className="text-sm">Hasta</span>
                      </div>
                      <span className="font-bold text-orange-600 text-sm">{p.monto}</span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Percent size={14} />
                        <span className="text-sm">Tasa</span>
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{p.tasa}</span>
                    </div>

                    {p.extra && (
                      <div className="flex items-start gap-2 bg-orange-50 rounded-lg px-4 py-2.5">
                        <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-orange-700 font-medium">{p.extra}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

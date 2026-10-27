import { useState } from 'react'
import { programas } from '../data/programas'
import { CreditCard, Star, Sun, Mountain, DollarSign, Percent, AlertCircle, FileText, Clock, User, Building2 } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import ProgramaDetalleModal from './ProgramaDetalleModal'

const iconMap = { CreditCard, Star, Sun, Mountain }

export default function Programas() {
  const [modalPrograma, setModalPrograma] = useState(null)

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
                <div className="bg-orange-50 px-6 py-5 flex items-start gap-4 border-b border-orange-100">
                  <div className="w-11 h-11 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900 leading-snug">{p.title}</h3>
                      {p.proximamente && (
                        <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                          <Clock size={11} />
                          Próximamente
                        </span>
                      )}
                    </div>
                    {p.tieneVariantesFisicaJuridica && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                          <User size={10} /> Física
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                          <Building2 size={10} /> Jurídica
                        </span>
                      </div>
                    )}
                  </div>
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

                    {p.detalles && (
                      <button
                        onClick={() => setModalPrograma(p)}
                        className="w-full flex items-center justify-center gap-2 mt-1 border border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-700 font-medium text-sm rounded-lg px-4 py-2.5 transition-colors"
                      >
                        <FileText size={14} />
                        Ver requisitos completos
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {modalPrograma && (
        <ProgramaDetalleModal
          programa={modalPrograma}
          onClose={() => setModalPrograma(null)}
        />
      )}
    </section>
  )
}

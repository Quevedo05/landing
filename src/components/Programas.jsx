import { useState } from 'react'
import { Link } from 'react-router-dom'
import { programas } from '../data/programas'
import { CreditCard, Star, Sun, Mountain, Gem, DollarSign, Percent, AlertCircle, FileText, Clock, User, Building2, Search, ClipboardList, Send, CheckCircle2 } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import ProgramaDetalleModal from './ProgramaDetalleModal'
import FormularioPreviewModal from './FormularioPreviewModal'

const iconMap = { CreditCard, Star, Sun, Mountain, Gem }

export default function Programas() {
  const [activeId, setActiveId] = useState(programas[0].id)
  const [modalPrograma, setModalPrograma] = useState(null)
  const [previewPrograma, setPreviewPrograma] = useState(null)

  const programa = programas.find(p => p.id === activeId)
  const Icon = iconMap[programa.icon] || Star

  return (
    <section id="programas" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestros Programas"
          subtitle="Herramientas de apoyo diseñadas para potenciar el desarrollo productivo provincial."
          centered
        />

        {/* Tabs */}
        <div className="mt-12 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex border-b border-gray-200 min-w-max sm:min-w-0">
            {programas.map((p) => {
              const TabIcon = iconMap[p.icon] || Star
              const isActive = p.id === activeId
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors duration-200 whitespace-nowrap
                    ${isActive
                      ? 'text-primary border-b-2 border-primary -mb-px bg-orange-50/50'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  <TabIcon size={15} />
                  {p.title}
                  {p.proximamente && (
                    <span className="ml-1 text-xs font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                      Pronto
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Panel — key fuerza re-render y dispara la animación al cambiar tab */}
        <div
          key={activeId}
          className="mt-10 grid lg:grid-cols-5 gap-10 lg:gap-16"
          style={{ animation: 'fadeInUp 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
        >
          {/* Info: 3/5 */}
          <div className="lg:col-span-3">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon size={26} className="text-white" />
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="text-2xl font-extrabold text-gray-900">{programa.title}</h3>
                  {programa.proximamente && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                      <Clock size={11} /> Próximamente
                    </span>
                  )}
                </div>
                {programa.tieneVariantesFisicaJuridica && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <User size={10} /> Persona Física
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      <Building2 size={10} /> Persona Jurídica
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-base leading-relaxed">{programa.description}</p>

            {programa.extra && (
              <div className="mt-6 flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3.5">
                <AlertCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-orange-800 font-medium">{programa.extra}</span>
              </div>
            )}
          </div>

          {/* Stats + CTAs: 2/5 */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-5">
                <div className="flex items-center gap-1.5 text-orange-500 mb-2">
                  <DollarSign size={13} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Hasta</span>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-tight">{programa.monto}</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5">
                <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                  <Percent size={13} />
                  <span className="text-xs font-semibold uppercase tracking-wide">Tasa</span>
                </div>
                <p className="text-2xl font-black text-gray-900 leading-tight">{programa.tasa}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {programa.detalles && (
                <button
                  onClick={() => setModalPrograma(programa)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm rounded-xl px-5 py-3.5 hover:bg-primary-dark transition-colors shadow-sm"
                >
                  <FileText size={15} />
                  Ver requisitos completos
                </button>
              )}
              {programa.camposPreviewFisica && (
                <button
                  onClick={() => setPreviewPrograma(programa)}
                  className="w-full flex items-center justify-center gap-2 border border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-700 font-semibold text-sm rounded-xl px-5 py-3.5 transition-colors"
                >
                  <FileText size={15} />
                  Ver formulario (vista previa)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cómo acceder */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-14 border-t border-gray-100">
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¿Cómo acceder a un programa?</h2>
          <p className="text-gray-500">El proceso es simple y se inicia de forma online. Estos son los pasos para solicitar financiamiento.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Search,
              n: '01',
              title: 'Elegí el programa',
              desc: 'Revisá los programas disponibles y encontrá el que mejor se adapte a tu proyecto, actividad y necesidades económicas.',
            },
            {
              icon: ClipboardList,
              n: '02',
              title: 'Revisá los requisitos',
              desc: 'Consultá la documentación necesaria haciendo click en "Ver requisitos completos" dentro de cada programa.',
            },
            {
              icon: Send,
              n: '03',
              title: 'Presentá tu solicitud',
              desc: 'Completá el formulario online con tu información personal, los datos del proyecto y los presupuestos de tus proveedores.',
            },
            {
              icon: CheckCircle2,
              n: '04',
              title: 'Recibí el financiamiento',
              desc: 'Una vez aprobada la solicitud, transferimos el monto aprobado directamente a los proveedores que hayas designado.',
            },
          ].map(({ icon: StepIcon, n, title, desc }) => (
            <div key={n} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <StepIcon size={18} className="text-primary" />
                </div>
                <span className="text-4xl font-black text-gray-100 leading-none select-none">{n}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-gray-500">
          <span>¿Tenés dudas antes de aplicar?</span>
          <Link to="/contacto" className="text-primary font-semibold hover:underline">
            Contactanos y te orientamos.
          </Link>
        </div>
      </div>

      {modalPrograma && (
        <ProgramaDetalleModal
          programa={modalPrograma}
          onClose={() => setModalPrograma(null)}
        />
      )}
      {previewPrograma && (
        <FormularioPreviewModal
          programa={previewPrograma}
          onClose={() => setPreviewPrograma(null)}
        />
      )}
    </section>
  )
}

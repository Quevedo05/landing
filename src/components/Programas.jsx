import { useEffect, useState } from 'react'
import { programas } from '../data/programas'
import { CreditCard, Star, Sun, ArrowRight, Check } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Card from './ui/Card'
import { getFormulariosActivos } from '../services/formularios.service.js'
import { USE_LOCAL_STORAGE } from '../services/api.js'

const iconMap = { CreditCard, Star, Sun }

export default function Programas({ onProgramaClick }) {
  const [programasActivos, setProgramasActivos] = useState({})

  useEffect(() => {
    let cancelled = false

    const cargar = async () => {
      try {
        const formularios = await getFormulariosActivos()
        if (cancelled) return
        const activos = {}
        formularios.forEach(f => {
          if (f.activo) {
            activos[f.nombre] = {
              formularioId: f.id || f.formularioId,
              activo: true,
              campos: f.campos || [],
              programa: f.programa,
              personasFisicas: f.personasFisicas ?? true,
              personasJuridicas: f.personasJuridicas ?? false,
            }
          }
        })
        setProgramasActivos(activos)
      } catch {
        // silencioso: los programas quedan inactivos
      }
    }

    cargar()

    if (USE_LOCAL_STORAGE) {
      window.addEventListener('storage', cargar)
      return () => { cancelled = true; window.removeEventListener('storage', cargar) }
    }
    return () => { cancelled = true }
  }, [])

  return (
    <section id="programas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestros Programas"
          subtitle="Herramientas de apoyo diseñadas para potenciar el desarrollo productivo provincial."
          centered
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {programas.map((p) => {
            const Icon = iconMap[p.icon] || Star

            // Bienes de Capital is shown as a unified card matching both subforms
            const bienesData = p.esBienesCapital ? {
              fisica: programasActivos['Bienes de Capital - Persona Física'],
              juridica: programasActivos['Bienes de Capital - Persona Jurídica'],
            } : null

            const programaData = p.esBienesCapital ? null : programasActivos[p.title]

            const estaActivo = p.esBienesCapital
              ? Boolean(bienesData?.fisica?.activo || bienesData?.juridica?.activo)
              : Boolean(programaData?.activo)

            const handleSolicitar = () => {
              if (!onProgramaClick) return
              if (p.esBienesCapital) {
                onProgramaClick({
                  esBienesCapital: true,
                  fisica: bienesData.fisica,
                  juridica: bienesData.juridica,
                })
              } else {
                onProgramaClick({
                  formularioId: programaData.formularioId,
                  programa: programaData.programa,
                  title: p.title,
                  campos: programaData.campos,
                })
              }
            }

            return (
              <Card
                key={p.id}
                className={`flex flex-col p-8 hover:shadow-lg transition-all ${
                  estaActivo
                    ? 'border-2 border-green-500 shadow-lg'
                    : 'opacity-60 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Icon size={24} className="text-orange-600" />
                  </div>
                  {estaActivo && (
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <Check size={16} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-600">Activo</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-1">{p.description}</p>

                {estaActivo && (
                  <button
                    onClick={handleSolicitar}
                    className="mt-6 inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2
                               rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm"
                  >
                    Solicitar <ArrowRight size={16} />
                  </button>
                )}

                {!estaActivo && p.link && (
                  <a
                    href={p.link}
                    className="mt-6 inline-flex items-center gap-2 text-orange-600 font-semibold
                               hover:gap-3 transition-all text-sm"
                  >
                    Ver más <ArrowRight size={16} />
                  </a>
                )}

                {!estaActivo && !p.link && (
                  <p className="mt-6 text-sm text-gray-500 italic">Próximamente</p>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
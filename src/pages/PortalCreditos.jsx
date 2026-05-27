import { useState, useEffect } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import FormularioDinamico from '../components/FormularioDinamico'
import { CreditCard, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { getFormulariosActivos } from '../services/formularios.service.js'
import { USE_LOCAL_STORAGE } from '../services/api.js'

// Mapeo para identificar créditos
const programaMap = {
  'Microcréditos 2024': { icon: 'CreditCard', label: 'Microcréditos' },
  'Programa Aprender, Trabajar y Producir': { icon: 'CreditCard', label: 'Emprendimientos' },
  'Cosecha y Acarreo 2026': { icon: 'CreditCard', label: 'Agricultura' },
}

export default function PortalCreditos() {
  const [formularios, setFormularios] = useState([])
  const [formularioActivo, setFormularioActivo] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let cancelled = false

    const cargarFormularios = async () => {
      try {
        const datos = await getFormulariosActivos()
        if (!cancelled) setFormularios(datos)
      } catch {
        if (!cancelled) setFormularios([])
      } finally {
        if (!cancelled) setCargando(false)
      }
    }

    cargarFormularios()

    if (USE_LOCAL_STORAGE) {
      window.addEventListener('storage', cargarFormularios)
      return () => { cancelled = true; window.removeEventListener('storage', cargarFormularios) }
    }
    return () => { cancelled = true }
  }, [])

  const formulariosActivos = formularios

  return (
    <main className="pt-[72px] min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeader
          title="Portal de Créditos"
          subtitle="Solicita financiamiento para tu negocio o proyecto productivo."
          centered
        />

        {cargando ? (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : formulariosActivos.length === 0 ? (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle size={24} className="text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900">No hay créditos disponibles</h3>
            </div>
            <p className="text-gray-600 text-center">
              Por el momento no hay programas de crédito activos. Te notificaremos cuando haya nuevas oportunidades.
            </p>
          </div>
        ) : (
          <>
            {/* Resumen de créditos disponibles */}
            <div className="mt-8 bg-white rounded-lg shadow p-6 mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ✅ {formulariosActivos.length} {formulariosActivos.length === 1 ? 'crédito disponible' : 'créditos disponibles'}
              </h3>
              <p className="text-gray-600">
                Selecciona el programa que se adapte a tus necesidades y completa el formulario.
              </p>
            </div>

            {/* Grid de créditos disponibles */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              {formulariosActivos.map(formulario => (
                <Card
                  key={formulario.id}
                  className="flex flex-col p-8 hover:shadow-xl transition-all border-2 border-green-500 bg-gradient-to-br from-white to-green-50"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                      <CreditCard size={24} className="text-orange-600" />
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <Check size={16} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-600">Disponible</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {formulario.programa}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {formulario.descripcion}
                  </p>

                  <button
                    onClick={() =>
                      setFormularioActivo({
                        formularioId: formulario.id,
                        programa: formulario.programa,
                        title: formulario.programa,
                      })
                    }
                    className="mt-6 inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3
                               rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm
                               w-full justify-center"
                  >
                    Solicitar Crédito <ArrowRight size={16} />
                  </button>
                </Card>
              ))}
            </div>

            {/* Información adicional */}
            <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h4 className="font-bold text-blue-900 mb-3">💡 ¿Cómo funciona?</h4>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Completa tu solicitud en línea</li>
                <li>✓ Recibirás un número de seguimiento inmediatamente</li>
                <li>✓ Nuestro equipo revisará tu solicitud</li>
                <li>✓ Te contactaremos con el resultado</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Formulario dinámico modal */}
      {formularioActivo && (
        <FormularioDinamico
          formularioId={formularioActivo.formularioId}
          programa={formularioActivo.programa}
          title={formularioActivo.title}
          onClose={() => setFormularioActivo(null)}
        />
      )}
    </main>
  )
}

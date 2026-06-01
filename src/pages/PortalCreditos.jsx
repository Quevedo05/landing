import { useState, useEffect } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
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

            {/* Lista de créditos disponibles */}
            <div className="mt-8 space-y-4">
              {formulariosActivos.map((formulario, index) => (
                <div
                  key={formulario.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200"
                >
                  <div className="flex items-center gap-6 p-6">
                    {/* Número de índice */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                    </div>

                    {/* Ícono */}
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100">
                      <CreditCard size={22} className="text-orange-600" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {formulario.programa}
                        </h3>
                        <span className="flex-shrink-0 inline-flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                          <Check size={12} className="text-green-600" />
                          <span className="text-xs font-semibold text-green-700">Disponible</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {formulario.descripcion}
                      </p>
                    </div>

                    {/* Botón */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() =>
                          setFormularioActivo({
                            formularioId: formulario.id,
                            programa: formulario.programa,
                            title: formulario.programa,
                          })
                        }
                        className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5
                                   rounded-lg font-semibold hover:bg-orange-700 active:bg-orange-800
                                   transition-colors text-sm whitespace-nowrap"
                      >
                        Solicitar <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
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

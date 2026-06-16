import { useState, useEffect, useMemo } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import FormularioDinamico from '../components/FormularioDinamico'
import SelectorTipoPersona from '../components/SelectorTipoPersona'
import { CreditCard, ArrowRight, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { getFormulariosActivos } from '../services/formularios.service.js'
import { USE_LOCAL_STORAGE } from '../services/api.js'

// ─── Descripciones detalladas por programa ────────────────────────────────────
const CONDICIONES = {
  'MICROCRÉDITOS EMPRENDEDORES': [
    {
      titulo: 'BENEFICIARIOS ELEGIBLES',
      lista: [
        'Estadío de iniciación-ejecución: emprendimientos registrados o no ante ARCA que puedan demostrar la existencia del mismo o presenten un proyecto con factibilidad económica.',
        'Estadío de crecimiento: emprendimientos registrados ante ARCA en la actividad relacionada con el proyecto que postula.',
      ],
    },
    {
      titulo: 'MONTO A FINANCIAR',
      texto: 'Hasta $3.000.000,00 (si el beneficiario está registrado ante ARCA; caso contrario, hasta $1.500.000). Crédito depositado a la cuenta de los proveedores que el beneficiario presente (hasta 4).',
    },
    {
      titulo: 'COMPONENTES FINANCIABLES',
      lista: [
        'Adquisición de activos fijos, maquinarias y/o partes de maquinarias y equipamientos.',
        'Adquisición de insumos, equipamiento, dispositivos tecnológicos, materias primas destinados al proyecto.',
        'Contratación de servicios específicos (NO servicios operativos).',
      ],
    },
    { titulo: 'TASA DE INTERÉS APLICABLE', texto: '50% de la tasa BADLAR.' },
    { titulo: 'GARANTÍA', texto: 'Cheque de pago diferido propio o de terceros.' },
    { titulo: 'PLAZO DE DEVOLUCIÓN', texto: '3 meses de gracia + 15 meses de devolución (18 meses en total).' },
    { titulo: 'GASTOS DE OTORGAMIENTO 2,2%', texto: 'NO se le cobra a los beneficiarios.' },
  ],
  'BIENES DE CAPITAL': [
    {
      titulo: 'BENEFICIARIOS ELEGIBLES',
      texto: 'Personas físicas o jurídicas categorizadas como Microempresa para los rubros de Servicios, Comercio, Industria y Agropecuario, radicadas en la provincia de San Juan.',
    },
    {
      titulo: 'MONTO A FINANCIAR',
      texto: 'Hasta $10.000.000,00 por beneficiario, deduciendo en concepto de gastos de otorgamiento y administrativos el 2,2%. Crédito depositado a la cuenta de los proveedores que el beneficiario presente (hasta 4).',
    },
    {
      titulo: 'COMPONENTES FINANCIABLES',
      texto: 'Inversión y compra de bienes de capital; podrá destinarse hasta el 20% a la compra de insumos.',
    },
    { titulo: 'TASA DE INTERÉS APLICABLE', texto: '50% de la tasa BADLAR.' },
    { titulo: 'GARANTÍA', texto: 'Cheque de pago diferido propio o de terceros.' },
    { titulo: 'PLAZO DE DEVOLUCIÓN', texto: '4 meses de gracia + 32 meses de devolución (36 meses en total).' },
    { titulo: 'GASTOS DE OTORGAMIENTO 2,2%', texto: 'SÍ se le cobra a los beneficiarios.' },
  ],
  'POTENCIAR EMPRENDEDORES': [
    {
      titulo: 'BENEFICIARIOS ELEGIBLES',
      texto: 'Nuevos emprendedores y aquellos emprendimientos en ejecución o etapa de crecimiento, inscriptos en ARCA en una actividad vinculada al proyecto presentado. Se priorizarán aquellos emprendimientos que generen triple impacto (económico, social y ambiental).',
    },
    {
      titulo: 'MONTO A FINANCIAR',
      texto: 'Hasta $4.000.000,00. Crédito depositado a la cuenta del beneficiario.',
    },
    {
      titulo: 'COMPONENTES FINANCIABLES',
      lista: [
        'Adquisición de activos fijos, maquinarias y/o partes de maquinarias y equipamientos.',
        'Adquisición de insumos, equipamiento, dispositivos tecnológicos, materias primas destinados al proyecto.',
      ],
    },
    { titulo: 'TASA DE INTERÉS APLICABLE', texto: '40% de la tasa BADLAR.' },
    { titulo: 'GARANTÍA', texto: 'Cheque de pago diferido propio o de terceros.' },
    { titulo: 'PLAZO DE DEVOLUCIÓN', texto: '2 meses de gracia + 10 meses de devolución (12 meses en total).' },
    { titulo: 'GASTOS DE OTORGAMIENTO 2,2%', texto: 'NO se le cobra a los beneficiarios.' },
    {
      titulo: 'MODALIDAD',
      texto: 'Se efectuarán convocatorias para la presentación de solicitudes. Fecha de cierre del primer llamado: 30 de junio de 2026.',
    },
  ],
}

// ─── Componente de descripción detallada ─────────────────────────────────────
function DescripcionCredito({ programa }) {
  const secciones = CONDICIONES[programa]
  if (!secciones) return null

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
      {secciones.map((sec, i) => (
        <div key={i}>
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">{sec.titulo}</p>
          {sec.texto && <p className="text-sm text-gray-600">{sec.texto}</p>}
          {sec.lista && (
            <ul className="space-y-1 mt-1">
              {sec.lista.map((item, j) => (
                <li key={j} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-orange-400 flex-shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

const MANTENIMIENTO = false

export default function PortalCreditos() {
  if (MANTENIMIENTO) return (
    <main className="pt-[72px] min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Portal en mantenimiento</h2>
          <p className="text-gray-600">Estamos trabajando para mejorar el Portal de Créditos. Volvé a intentarlo en unos momentos.</p>
        </div>
      </div>
    </main>
  )

  const [formularios, setFormularios] = useState([])
  const [formularioActivo, setFormularioActivo] = useState(null)
  const [selectorBienes, setSelectorBienes] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [descExpandida, setDescExpandida] = useState({})

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

  // Agrupar los dos formularios de Bienes de Capital en una sola tarjeta
  const formulariosAgrupados = useMemo(() => {
    const grupos = {}
    formularios.forEach(f => {
      const key = f.programa
      if (!grupos[key]) grupos[key] = []
      grupos[key].push(f)
    })

    const result = []
    Object.entries(grupos).forEach(([programa, forms]) => {
      if (forms.length === 1) {
        result.push({ ...forms[0], agrupado: false })
      } else {
        // Múltiples variantes del mismo programa: mostrar como una sola tarjeta
        const fisica = forms.find(f => f.personasFisicas && !f.personasJuridicas)
        const juridica = forms.find(f => f.personasJuridicas && !f.personasFisicas)
        result.push({
          id: `grupo_${programa}`,
          programa,
          nombre: programa === 'BIENES DE CAPITAL' ? 'Bienes de Capital' : programa,
          descripcion: forms[0].descripcion,
          agrupado: true,
          fisica,
          juridica,
          campos: [],
        })
      }
    })
    return result
  }, [formularios])

  const toggleDesc = (programa) =>
    setDescExpandida(prev => ({ ...prev, [programa]: !prev[programa] }))

  const handleSolicitar = (formulario) => {
    if (formulario.agrupado) {
      setSelectorBienes(formulario)
    } else {
      setFormularioActivo({
        formularioId: formulario.id,
        programa: formulario.nombre,
        title: formulario.nombre,
        campos: formulario.campos || [],
      })
    }
  }

  const handleTipoSeleccionado = (form) => {
    setSelectorBienes(null)
    setFormularioActivo({
      formularioId: form.id || form.formularioId,
      programa: form.nombre,
      title: form.nombre,
      campos: form.campos || [],
    })
  }

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
        ) : formulariosAgrupados.length === 0 ? (
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
            {/* Resumen */}
            <div className="mt-8 bg-white rounded-lg shadow p-6 mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                ✅ {formulariosAgrupados.length} {formulariosAgrupados.length === 1 ? 'crédito disponible' : 'créditos disponibles'}
              </h3>
              <p className="text-gray-600">
                Seleccioná el programa que se adapte a tus necesidades y completá el formulario.
              </p>
            </div>

            {/* Lista de créditos */}
            <div className="mt-8 space-y-4">
              {formulariosAgrupados.map((formulario, index) => (
                <div
                  key={formulario.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200"
                >
                  <div className="p-4 sm:p-6">
                    {/* Fila superior */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                        {/* Número */}
                        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">{index + 1}</span>
                        </div>

                        {/* Ícono */}
                        <div className="hidden sm:flex flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg items-center justify-center border border-orange-100">
                          <CreditCard size={22} className="text-orange-600" />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900">
                              {formulario.nombre}
                            </h3>
                            <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                              <Check size={12} className="text-green-600" />
                              <span className="text-xs font-semibold text-green-700">Disponible</span>
                            </span>
                            {formulario.agrupado && (
                              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                                <span className="text-xs font-semibold text-blue-700">Persona Física / Jurídica</span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {formulario.descripcion}
                          </p>
                        </div>
                      </div>

                      {/* Botón solicitar */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleSolicitar(formulario)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2.5
                                     rounded-lg font-semibold hover:bg-orange-700 active:bg-orange-800
                                     transition-colors text-sm"
                        >
                          Solicitar <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Toggle ver condiciones */}
                    <div className="mt-4">
                      <button
                        onClick={() => toggleDesc(formulario.programa)}
                        className="inline-flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
                      >
                        {descExpandida[formulario.programa] ? (
                          <>Ocultar condiciones <ChevronUp size={15} /></>
                        ) : (
                          <>Ver condiciones del crédito <ChevronDown size={15} /></>
                        )}
                      </button>

                      {descExpandida[formulario.programa] && (
                        <DescripcionCredito programa={formulario.programa} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Información adicional */}
            <div className="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8">
              <h4 className="font-bold text-blue-900 mb-3">💡 ¿Cómo funciona?</h4>
              <ul className="space-y-2 text-blue-800">
                <li>✓ Completá tu solicitud en línea</li>
                <li>✓ Recibirás un número de seguimiento inmediatamente</li>
                <li>✓ Nuestro equipo revisará tu solicitud</li>
                <li>✓ Te contactaremos con el resultado</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Selector persona física/jurídica para Bienes de Capital */}
      {selectorBienes && (
        <SelectorTipoPersona
          fisica={selectorBienes.fisica}
          juridica={selectorBienes.juridica}
          onSelect={handleTipoSeleccionado}
          onClose={() => setSelectorBienes(null)}
        />
      )}

      {/* Formulario dinámico modal */}
      {formularioActivo && (
        <FormularioDinamico
          formularioId={formularioActivo.formularioId}
          programa={formularioActivo.programa}
          title={formularioActivo.title}
          campos={formularioActivo.campos || []}
          onClose={() => setFormularioActivo(null)}
        />
      )}
    </main>
  )
}
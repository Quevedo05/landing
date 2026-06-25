import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FormularioDinamico from '../components/FormularioDinamico'
import SelectorTipoPersona from '../components/SelectorTipoPersona'
import { ArrowRight, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
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

// ─── Descripción detallada ────────────────────────────────────────────────────
function DescripcionCredito({ programa }) {
  const secciones = CONDICIONES[programa]
  if (!secciones) return null

  return (
    <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
      {secciones.map((sec, i) => (
        <div key={i}>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1.5">{sec.titulo}</p>
          {sec.texto && <p className="text-sm text-gray-600 leading-relaxed">{sec.texto}</p>}
          {sec.lista && (
            <ul className="space-y-1.5 mt-1">
              {sec.lista.map((item, j) => (
                <li key={j} className="flex gap-2.5 text-sm text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0 mt-2" />
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
    <main className="min-h-screen bg-gray-50">

      {/* Header oscuro */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-3">
            Financiamiento Productivo · Agencia Calidad San Juan
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Portal de Créditos
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Accedé a las líneas de financiamiento disponibles para tu negocio o proyecto productivo.
          </p>
          <div className="mt-6">
            <Link
              to="/consultar"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              ¿Ya tenés un trámite iniciado? Consultá el estado
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {cargando ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-pulse space-y-4 max-w-sm mx-auto">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        ) : formulariosAgrupados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle size={32} className="text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay créditos disponibles</h3>
            <p className="text-gray-500">
              Por el momento no hay programas de crédito activos. Te notificaremos cuando haya nuevas oportunidades.
            </p>
          </div>
        ) : (
          <>
            {/* Indicador disponibles */}
            <div className="flex items-center gap-3 mb-10">
              <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-sm font-semibold text-green-700">
                  {formulariosAgrupados.length} {formulariosAgrupados.length === 1 ? 'línea disponible' : 'líneas disponibles'}
                </span>
              </span>
              <p className="text-gray-400 text-sm hidden sm:block">
                Seleccioná el programa que se adapte a tus necesidades.
              </p>
            </div>

            {/* Lista de créditos */}
            <div className="space-y-5">
              {formulariosAgrupados.map((formulario, index) => (
                <div
                  key={formulario.id}
                  className="bg-white rounded-xl border border-gray-200 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">
                            Programa {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                            <Check size={11} className="text-green-600" />
                            <span className="text-xs font-semibold text-green-700">Disponible</span>
                          </span>
                          {formulario.agrupado && (
                            <span className="text-xs text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full">
                              Persona Física / Jurídica
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{formulario.nombre}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{formulario.descripcion}</p>
                      </div>

                      {/* Botón */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleSolicitar(formulario)}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                                     bg-gray-900 hover:bg-gray-700 text-white
                                     px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
                        >
                          Solicitar <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Toggle condiciones */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => toggleDesc(formulario.programa)}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
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

            {/* Cómo funciona */}
            <div className="mt-16 bg-gray-900 rounded-2xl p-8 sm:p-10">
              <p className="text-xs font-semibold tracking-widest uppercase text-orange-400 mb-2">Proceso</p>
              <h4 className="text-xl font-bold text-white mb-8">¿Cómo funciona?</h4>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  'Completá tu solicitud en línea',
                  'Recibirás un número de seguimiento inmediatamente',
                  'Nuestro equipo revisará tu solicitud',
                  'Te contactaremos con el resultado',
                ].map((paso, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-gray-300 text-sm leading-relaxed pt-1">{paso}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {selectorBienes && (
        <SelectorTipoPersona
          fisica={selectorBienes.fisica}
          juridica={selectorBienes.juridica}
          onSelect={handleTipoSeleccionado}
          onClose={() => setSelectorBienes(null)}
        />
      )}

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

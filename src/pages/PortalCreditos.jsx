import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FormularioDinamico from '../components/FormularioDinamico'
import SelectorTipoPersona from '../components/SelectorTipoPersona'
import { ArrowRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { getFormulariosActivos } from '../services/formularios.service.js'
import { USE_LOCAL_STORAGE } from '../services/api.js'

// ─── Descripciones detalladas por programa ────────────────────────────────────
const CONDICIONES = {
  'MICROCRÉDITOS EMPRENDEDORES': [
    {
      titulo: 'BENEFICIARIOS ELEGIBLES',
      texto: 'Se encuentren en alguno de los siguientes estadíos:',
      lista: [
        'Estadío de iniciación-ejecución: Aquellos emprendimientos que se encuentren o no registrados ante ARCA, puedan demostrar la existencia del mismo o presenten un proyecto con factibilidad económica.',
        'Estadío de Crecimiento: Aquellos emprendimientos que se encuentren registrados ante ARCA, en la actividad relacionada con el proyecto que postula.',
      ],
    },
    {
      titulo: 'MONTO A FINANCIAR',
      texto: 'Hasta $3.000.000,00 (si el beneficiario se encuentra registrado ante ARCA, caso contrario podrá acceder hasta $1.500.000) por beneficiario. Crédito depositado a la cuenta de los proveedores que el beneficiario presente (hasta 4).',
    },
    {
      titulo: 'COMPONENTES FINANCIABLES',
      lista: [
        'Adquisición de activos fijos, maquinarias y/o partes de maquinarias y equipamientos.',
        'Adquisición de insumos, equipamiento, dispositivos tecnológicos, materias primas destinados al proyecto.',
        'Contratación de servicios específicos, NO servicios operativos.',
      ],
    },
    { titulo: 'TASA DE INTERÉS APLICABLE', texto: '50% de la tasa BADLAR.' },
    { titulo: 'GARANTÍA', texto: 'Cheque de pago diferido propio o de terceros.' },
    { titulo: 'PLAZO DE DEVOLUCIÓN', texto: '3 meses de gracia + 15 meses de devolución (18 meses en total).' },
    {
      titulo: 'INFORMACIÓN DEL CHEQUE',
      texto: 'Una vez aprobado el crédito, se comunicará al beneficiario, quien deberá entregar en guarda a la Agencia el cheque de pago diferido (presentado en la solicitud), por un monto equivalente al cincuenta por ciento (50%) del monto aprobado, más los intereses correspondientes, calculados a una tasa equivalente al cincuenta por ciento (50%) de la Tasa BADLAR.',
    },
    {
      titulo: 'TRANSFERENCIA DEL MONTO APROBADO',
      texto: 'Los montos correspondientes a los créditos aprobados serán transferidos a la/s cuenta/s de los proveedores seleccionados por el beneficiario, de conformidad con los presupuestos presentados y aprobados en el marco del crédito otorgado.',
    },
    {
      titulo: 'PLAZO PARA PRESENTAR VERIFICABLES',
      texto: 'El beneficiario tendrá un plazo máximo de DOS (2) meses, contados a partir del desembolso del crédito, para presentar la documentación que permita acreditar la correcta aplicación de los fondos conforme al destino aprobado, bajo apercibimiento de exigirse el reembolso de los fondos otorgados. A tal efecto, deberá presentar los siguientes verificables:',
      lista: [
        'Nota de presentación de verificables, firmada por el emprendedor, conforme al modelo establecido por el programa.',
        'Facturas por la compra de los bienes y/o contratación de los servicios, emitidas por los respectivos proveedores, de conformidad con los presupuestos aprobados.',
        'Registro fotográfico de los bienes adquiridos, que permita acreditar su efectiva incorporación al emprendimiento, cuando corresponda.',
        'Informe firmado por el profesional interviniente, en caso de corresponder, que detalle el servicio llevado a cabo, el impacto que dicho servicio genera en el emprendimiento y el plazo de ejecución, el cual no podrá exceder los DOS (2) meses previstos para el período de ejecución.',
        'Cualquier otro verificable que permita acreditar la ejecución de las actividades aprobadas y la correcta aplicación de los fondos.',
      ],
    },
    {
      titulo: 'DOCUMENTACIÓN NECESARIA A PRESENTAR',
      lista: [
        'Completar la solicitud on line.',
        'Copia del DNI frente y dorso; si es persona física; Persona jurídica: contrato o estatuto social, poder de representación del representante legal y copia del D.N.I del representante.',
        'Inscripción en ARCA - con actividad acorde al proyecto que postula (en caso de corresponder).',
        'Garantía: Cheque de pago diferido.',
        'Fotos: mínimo tres (3) fotografías que permitan identificar y conocer el emprendimiento, acreditando su existencia y/o viabilidad.',
        'Proveedor: Presupuesto + Constancia de ARCA (con actividades acorde al bien/servicio que presupuesta) + Constancia de CBU.',
        'La Agencia realizará la consulta del informe VERAZ del solicitante y del garante, quienes deberán encontrarse en Situación 1 para acceder al financiamiento.',
        'No tener créditos vigentes en ACSJ.',
        'Si el beneficiario no se encuentra inscripto en ARCA, deberá presentar una Declaración Jurada comprometiéndose a realizar la inscripción dentro del plazo de tres (3) meses de aprobada la solicitud del crédito.',
      ],
    },
    { nota: 'Sólo podrá presentarse UN (1) único proyecto por solicitante.' },
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
      texto: 'Nuevos emprendedores y aquellos emprendimientos que ya se encuentren en ejecución o en etapa de crecimiento, debiendo encontrarse inscriptos en ARCA en una actividad vinculada al proyecto presentado, independientemente de su antigüedad. Se priorizarán aquellos emprendimientos que generen un triple impacto, promoviendo valor económico, social y ambiental.',
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
    {
      titulo: 'MODALIDAD',
      texto: 'Se efectuarán convocatorias para la presentación de solicitudes de la línea "Potenciar Emprendedores".',
    },
    {
      titulo: 'INFORMACIÓN DEL CHEQUE',
      texto: 'Una vez aprobado el crédito, se comunicará al beneficiario, quien deberá entregar en guarda a la Agencia el cheque de pago diferido (presentado en la solicitud), por un monto equivalente al cincuenta por ciento (50%) del monto aprobado, más los intereses correspondientes, calculados a una tasa equivalente al cuarenta por ciento (40%) de la Tasa BADLAR.',
    },
    {
      titulo: 'TRANSFERENCIA DEL MONTO APROBADO',
      texto: 'Los montos correspondientes a los créditos aprobados serán transferidos a la cuenta del beneficiario, de conformidad con los presupuestos presentados y aprobados en el marco del crédito otorgado.',
    },
    {
      titulo: 'PLAZO PARA PRESENTAR VERIFICABLES',
      texto: 'El beneficiario tendrá un plazo máximo de DOS (2) meses, contados a partir del desembolso del crédito, para presentar la documentación que permita acreditar la correcta aplicación de los fondos conforme al destino aprobado, bajo apercibimiento de exigirse el reembolso de los fondos otorgados. A tal efecto, deberá presentar los siguientes verificables:',
      lista: [
        'Nota de presentación de verificables, firmada por el emprendedor, conforme al modelo establecido por el programa.',
        'Factura de los bienes adquiridos, correspondiente al destino aprobado del crédito.',
        'Registro fotográfico de los bienes adquiridos, que permita acreditar su incorporación al proyecto y su correspondencia con los componentes financiables.',
        'Cualquier otro verificable que permita acreditar la ejecución de las actividades aprobadas y la correcta aplicación de los fondos.',
      ],
    },
    {
      titulo: 'DOCUMENTACIÓN NECESARIA A PRESENTAR',
      lista: [
        'Completar la solicitud on line.',
        'Copia del D.N.I. frente y dorso si es persona física; Persona jurídica: contrato o estatuto social, poder de representación del representante legal y copia del D.N.I del representante.',
        'Inscripción en ARCA (con actividad acorde al proyecto que postula).',
        'Certificado Mi PYME vigente, categoría permitida micro empresas.',
        'Garantía: Cheque de pago diferido.',
        'Fotos: mínimo tres (3) fotografías que permitan identificar y conocer el emprendimiento, acreditando su existencia.',
        'Constancia de CBU beneficiario.',
        'Proveedor: Presupuesto + Constancia de ARCA (con actividades acorde al bien/servicio que presupuesta).',
        'La Agencia realizará la consulta del informe VERAZ del solicitante y del garante, quienes deberán encontrarse en Situación 1 para acceder al financiamiento.',
        'No tener créditos vigentes en ACSJ.',
      ],
    },
    { nota: 'Sólo podrá presentarse UN (1) único proyecto por solicitante.' },
  ],
}

// ─── Descripción detallada ────────────────────────────────────────────────────
function DescripcionCredito({ programa }) {
  const secciones = CONDICIONES[programa]
  if (!secciones) return null

  return (
    <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
      {secciones.map((sec, i) => {
        if (sec.nota) {
          return (
            <p key={i} className="text-sm font-semibold text-orange-700 border-t border-orange-100 pt-4">
              {sec.nota}
            </p>
          )
        }
        return (
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
        )
      })}
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

      {/* Header claro */}
      <div className="bg-white border-b border-gray-200 pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Financiamiento Productivo · Agencia Calidad San Juan
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Portal de Créditos
          </h1>
          <div className="w-14 h-1 bg-primary rounded-full mb-5" />
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Accedé a las líneas de financiamiento disponibles para tu negocio o proyecto productivo.
          </p>
          <div className="mt-5">
            <Link
              to="/consultar"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-orange-600 transition-colors"
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
            {/* Intro */}
            <p className="text-gray-500 text-sm mb-10">
              Seleccioná el programa que se adapte a tus necesidades.
            </p>

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

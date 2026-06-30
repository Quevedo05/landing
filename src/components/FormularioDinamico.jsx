import { useState } from 'react'
import { AlertCircle, CheckCircle, X, Paperclip, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { crearTicket } from '../services/tickets.service.js'

const EXPLICACION_CHEQUE = `Documentación a adjuntar para la evaluación crediticia del garante:

• En caso de presentar cheque de pago diferido físico, deberá adjuntarse una fotografía clara del cheque en blanco, donde se visualicen correctamente sus datos identificatorios.

• En caso de presentar cheque electrónico (Echeq), deberá adjuntarse una captura de pantalla de la simulación del cheque, en la que consten de manera visible la razón social o nombre y apellido del librador y su CUIT.

La documentación requerida será utilizada exclusivamente para verificar la situación crediticia de la persona física o jurídica que postula como garante del crédito.

En caso de aprobarse el crédito, el cheque de pago diferido presentado como garantía deberá ser completado y entregado en la Agencia Calidad San Juan al momento de la firma del convenio correspondiente.`

const inputBase = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm text-gray-900 bg-white'
const inputErr = 'w-full px-4 py-2.5 border border-red-400 rounded-lg focus:ring-2 focus:ring-red-200 outline-none disabled:bg-gray-100 transition-colors text-sm text-gray-900 bg-red-50'

const STEPS = [
  { label: 'Solicitante', desc: 'Datos personales' },
  { label: 'Solicitud', desc: 'Info del programa' },
  { label: 'Confirmación', desc: 'Revisar y enviar' },
]

function Stepper({ step }) {
  const pct = Math.round((step / STEPS.length) * 100)
  return (
    <div className="px-6 py-5 border-b border-gray-100 bg-white">
      <div className="flex items-start">
        {STEPS.map(({ label, desc }, i) => {
          const n = i + 1
          const done = step > n
          const active = step === n
          return (
            <div key={i} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  done ? 'bg-orange-600 border-orange-600 text-white' :
                  active ? 'bg-orange-600 border-orange-600 text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {done ? <Check size={13} strokeWidth={3} /> : n}
                </div>
                <p className={`text-[11px] mt-1.5 font-semibold whitespace-nowrap ${
                  active ? 'text-orange-600' : done ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {label}
                </p>
                <p className={`text-[9px] hidden sm:block ${active ? 'text-gray-400' : 'text-gray-300'}`}>
                  {desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mt-4 mx-2 transition-all duration-500 ${
                  step > n ? 'bg-orange-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-gray-400">Paso {step} de {STEPS.length}</span>
          <span className="font-semibold text-orange-600">{pct}% completado</span>
        </div>
        <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-600 to-orange-400 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function FieldGroup({ label, error, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
        {hint}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function CampoInput({ campo, value, onChange, disabled }) {
  const { id, label, tipo, placeholder, opciones } = campo
  const [fileName, setFileName] = useState('')

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) { onChange(id, ''); setFileName(''); return }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => onChange(id, ev.target.result)
    reader.readAsDataURL(file)
  }

  if (tipo === 'selector') {
    return (
      <select value={value || ''} onChange={(e) => onChange(id, e.target.value)} disabled={disabled} className={inputBase}>
        <option value="">Seleccionar...</option>
        {(opciones || []).map((op) => <option key={op} value={op}>{op}</option>)}
      </select>
    )
  }
  if (tipo === 'textarea') {
    return (
      <textarea
        value={value || ''} onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled} rows={3} placeholder={placeholder || ''}
        className={inputBase}
      />
    )
  }
  if (tipo === 'archivo') {
    const displayName = fileName || (value && !value.startsWith('data:') ? value : '') || ''
    return (
      <label className={`flex items-center gap-2 px-4 py-2.5 border border-dashed rounded-lg cursor-pointer transition-colors text-sm w-full
        ${disabled ? 'opacity-50 cursor-not-allowed border-gray-300' : 'hover:border-orange-400 hover:bg-orange-50 border-gray-300'}
        ${displayName ? 'border-orange-400 bg-orange-50' : ''}`}>
        <Paperclip size={15} className="text-orange-500 flex-shrink-0" />
        <span className="truncate text-gray-500">{displayName || 'Seleccionar archivo (JPG, PDF, PNG)...'}</span>
        <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" disabled={disabled} onChange={handleFile} />
      </label>
    )
  }
  if (tipo === 'fecha') {
    return <input type="date" value={value || ''} onChange={(e) => onChange(id, e.target.value)} disabled={disabled} className={inputBase} />
  }
  if (tipo === 'numero') {
    return <input type="number" value={value || ''} onChange={(e) => onChange(id, e.target.value)} disabled={disabled} placeholder={placeholder || ''} className={inputBase} />
  }
  return <input type="text" value={value || ''} onChange={(e) => onChange(id, e.target.value)} disabled={disabled} placeholder={placeholder || ''} className={inputBase} />
}

export default function FormularioDinamico({ formularioId, programa, title, campos = [], onClose }) {
  const [step, setStep] = useState(1)
  const [nombreCiudadano, setNombre] = useState('')
  const [emailCiudadano, setEmail] = useState('')
  const [telefonoCiudadano, setTelefono] = useState('')
  const [valoresCampos, setValoresCampos] = useState({})
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [errores, setErrores] = useState({})
  const [tooltipCheque, setTooltipCheque] = useState(false)

  const camposOrdenados = [...campos].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))

  const setCampoValor = (id, valor) => {
    setValoresCampos((prev) => ({ ...prev, [id]: valor }))
    setErrores((prev) => { const e = { ...prev }; delete e[id]; return e })
  }

  const esCampoVisible = (campo) => {
    if (!campo.condicion) return true
    const ctrl = camposOrdenados.find(c => c.campo === campo.condicion.campo)
    if (!ctrl) return false
    return campo.condicion.valor.includes(valoresCampos[ctrl.id] ?? '')
  }

  const validateStep1 = () => {
    const errs = {}
    if (!nombreCiudadano.trim()) errs._nombre = 'El nombre es requerido'
    if (!emailCiudadano.trim()) errs._email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCiudadano)) errs._email = 'Email inválido'
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  const validateStep2 = () => {
    const errs = {}
    camposOrdenados.forEach((campo) => {
      if (!esCampoVisible(campo)) return
      if (campo.requerido && !valoresCampos[campo.id]?.trim?.() && !valoresCampos[campo.id]) {
        errs[campo.id] = `"${campo.label}" es requerido`
      }
    })
    setErrores(errs)
    return Object.keys(errs).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setErrores({})
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setErrores({})
    setStep(s => s - 1)
  }

  const construirDescripcion = () => {
    const lineas = camposOrdenados.filter(esCampoVisible).map((campo) => {
      const valor = valoresCampos[campo.id]
      if (!valor) return null
      const prefix = campo.tipo === 'archivo' ? '[Adjunto] ' : ''
      return `${campo.label}: ${prefix}${valor}`
    }).filter(Boolean)
    return lineas.length > 0 ? lineas.join('\n') : 'Sin información adicional'
  }

  const handleSubmit = async () => {
    setLoading(true)
    setErrores({})
    try {
      const resultado = await crearTicket({
        formularioId,
        programa,
        ciudadanoNombre: nombreCiudadano.trim(),
        ciudadanoEmail: emailCiudadano.trim(),
        ciudadanoTelefono: telefonoCiudadano.trim() || null,
        descripcion: construirDescripcion(),
      })
      setMensaje({ numero: resultado.numero })
    } catch (err) {
      setErrores({ _global: err.message || 'Error al enviar el formulario. Intente nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

      {/* Tooltip cheque */}
      {tooltipCheque && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4" onClick={() => setTooltipCheque(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-base mb-3">Garantía — Copia del Cheque</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{EXPLICACION_CHEQUE}</p>
            <button type="button" onClick={() => setTooltipCheque(false)}
              className="mt-5 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors">
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header fijo */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Solicitud de Crédito</p>
            <h3 className="text-base font-bold text-gray-900 mt-0.5">{programa || title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
        {!mensaje && <Stepper step={step} />}

        {/* Contenido scrollable */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* ── Éxito ── */}
          {mensaje && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">¡Solicitud enviada!</h4>
              <p className="text-gray-500 text-sm mb-5">Tu solicitud fue recibida correctamente.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 py-5 mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Número de seguimiento</p>
                <p className="text-3xl font-mono font-bold text-gray-900">{mensaje.numero}</p>
              </div>
              <p className="text-gray-400 text-xs mb-6">Guardá este número para consultar el estado en cualquier momento.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <a href={`/consultar?numero=${mensaje.numero}`}
                  className="flex-1 px-5 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors text-sm text-center">
                  Ver estado del trámite →
                </a>
                <button onClick={onClose}
                  className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* ── Error global ── */}
          {errores._global && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errores._global}</p>
            </div>
          )}

          {!mensaje && (
            <div className="space-y-5">

              {/* ── PASO 1: Datos del Solicitante ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <p className="text-sm font-bold text-gray-900">Datos del Solicitante</p>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2 ml-3">Completá tus datos de contacto para la solicitud.</p>

                  <FieldGroup label="Nombre Completo" required error={errores._nombre}>
                    <input
                      type="text"
                      value={nombreCiudadano}
                      onChange={(e) => { setNombre(e.target.value); setErrores(p => { const e = { ...p }; delete e._nombre; return e }) }}
                      placeholder="Juan Pérez García"
                      className={errores._nombre ? inputErr : inputBase}
                    />
                  </FieldGroup>

                  <FieldGroup label="Email" required error={errores._email}>
                    <input
                      type="email"
                      value={emailCiudadano}
                      onChange={(e) => { setEmail(e.target.value); setErrores(p => { const e = { ...p }; delete e._email; return e }) }}
                      placeholder="juan@ejemplo.com"
                      className={errores._email ? inputErr : inputBase}
                    />
                  </FieldGroup>

                  <FieldGroup label="Teléfono">
                    <input
                      type="tel"
                      value={telefonoCiudadano}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="264 4123456"
                      className={inputBase}
                    />
                  </FieldGroup>
                </div>
              )}

              {/* ── PASO 2: Datos del Programa ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <p className="text-sm font-bold text-gray-900">Información del Programa</p>
                  </div>
                  <p className="text-xs text-gray-400 -mt-2 ml-3">Completá los datos requeridos para tu solicitud de <strong>{programa}</strong>.</p>

                  {camposOrdenados.length > 0 ? (
                    camposOrdenados.map((campo) => {
                      if (!esCampoVisible(campo)) return null
                      return (
                        <FieldGroup
                          key={campo.id}
                          label={campo.label}
                          required={campo.requerido}
                          error={errores[campo.id]}
                          hint={campo.campo === 'cf_garantia_cheque' && (
                            <button type="button" onClick={() => setTooltipCheque(true)}
                              className="ml-2 text-xs font-normal text-orange-500 hover:text-orange-700 transition-colors">
                              ❔ ¿Por qué pedimos esto?
                            </button>
                          )}
                        >
                          <CampoInput
                            campo={campo}
                            value={valoresCampos[campo.id] ?? ''}
                            onChange={setCampoValor}
                            disabled={false}
                          />
                        </FieldGroup>
                      )
                    })
                  ) : (
                    <FieldGroup label="Detalles de la Solicitud">
                      <textarea
                        value={valoresCampos._descripcion || ''}
                        onChange={(e) => setCampoValor('_descripcion', e.target.value)}
                        rows={5}
                        placeholder="Contanos sobre tu proyecto, empresa o necesidad..."
                        className={inputBase}
                      />
                    </FieldGroup>
                  )}
                </div>
              )}

              {/* ── PASO 3: Confirmación ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <p className="text-sm font-bold text-gray-900">Revisá tu solicitud antes de enviar</p>
                  </div>

                  {/* Resumen solicitante */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-200 bg-white">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Datos del Solicitante</p>
                    </div>
                    <div className="px-4 py-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Nombre</span>
                        <span className="font-medium text-gray-900">{nombreCiudadano}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium text-gray-900">{emailCiudadano}</span>
                      </div>
                      {telefonoCiudadano && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Teléfono</span>
                          <span className="font-medium text-gray-900">{telefonoCiudadano}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumen campos del programa */}
                  {(camposOrdenados.length > 0 || valoresCampos._descripcion) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-gray-200 bg-white">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Información del Programa</p>
                      </div>
                      <div className="px-4 py-4 space-y-2">
                        {camposOrdenados.length > 0
                          ? camposOrdenados.filter(esCampoVisible).map((campo) => {
                              const val = valoresCampos[campo.id]
                              if (!val) return null
                              return (
                                <div key={campo.id} className="flex justify-between text-sm gap-4">
                                  <span className="text-gray-500 flex-shrink-0">{campo.label}</span>
                                  <span className="font-medium text-gray-900 text-right truncate">
                                    {campo.tipo === 'archivo' ? '📎 Archivo adjunto' : val}
                                  </span>
                                </div>
                              )
                            })
                          : (
                            <p className="text-sm text-gray-700 leading-relaxed">{valoresCampos._descripcion || '—'}</p>
                          )
                        }
                      </div>
                    </div>
                  )}

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-800">
                    Al enviar confirmarás esta solicitud. Recibirás un número de seguimiento para consultar el estado de tu trámite.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navegación fija en el fondo */}
        {!mensaje && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-white flex-shrink-0">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} /> Anterior
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors shadow-sm"
              >
                Siguiente <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? 'Enviando...' : <>Enviar Solicitud <Check size={15} /></>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

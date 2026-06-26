import { useState } from 'react'
import { AlertCircle, CheckCircle, X, Paperclip } from 'lucide-react'
import { crearTicket } from '../services/tickets.service.js'

const EXPLICACION_CHEQUE = `Documentación a adjuntar para la evaluación crediticia del garante:

• En caso de presentar cheque de pago diferido físico, deberá adjuntarse una fotografía clara del cheque en blanco, donde se visualicen correctamente sus datos identificatorios.

• En caso de presentar cheque electrónico (Echeq), deberá adjuntarse una captura de pantalla de la simulación del cheque, en la que consten de manera visible la razón social o nombre y apellido del librador y su CUIT.

La documentación requerida será utilizada exclusivamente para verificar la situación crediticia de la persona física o jurídica que postula como garante del crédito.

En caso de aprobarse el crédito, el cheque de pago diferido presentado como garantía deberá ser completado y entregado en la Agencia Calidad San Juan al momento de la firma del convenio correspondiente.`

const inputBase =
  'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm'

function CampoInput({ campo, value, onChange, disabled }) {
  const { id, label, tipo, requerido, placeholder, opciones } = campo
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
      <select
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled}
        className={inputBase}
      >
        <option value="">Seleccionar...</option>
        {(opciones || []).map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    )
  }

  if (tipo === 'textarea') {
    return (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder={placeholder || ''}
        className={inputBase}
      />
    )
  }

  if (tipo === 'archivo') {
    const displayName = fileName || (value && !value.startsWith('data:') ? value : '') || ''
    return (
      <div className="flex items-center gap-3">
        <label className={`
          flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300
          rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50
          transition-colors text-sm text-gray-500 w-full
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${displayName ? 'border-orange-400 bg-orange-50' : ''}
        `}>
          <Paperclip size={16} className="text-orange-500 flex-shrink-0" />
          <span className="truncate">{displayName || 'Seleccionar archivo (JPG, PDF, PNG)...'}</span>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            disabled={disabled}
            onChange={handleFile}
          />
        </label>
      </div>
    )
  }

  if (tipo === 'fecha') {
    return (
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled}
        className={inputBase}
      />
    )
  }

  if (tipo === 'numero') {
    return (
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
        disabled={disabled}
        placeholder={placeholder || ''}
        className={inputBase}
      />
    )
  }

  // default: texto
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(id, e.target.value)}
      disabled={disabled}
      placeholder={placeholder || ''}
      className={inputBase}
    />
  )
}

export default function FormularioDinamico({ formularioId, programa, title, campos = [], onClose }) {
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

  const validar = () => {
    const errs = {}
    if (!nombreCiudadano.trim()) errs._nombre = 'El nombre es requerido'
    if (!emailCiudadano.trim()) errs._email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailCiudadano)) errs._email = 'Email inválido'

    camposOrdenados.forEach((campo) => {
      if (!esCampoVisible(campo)) return
      if (campo.requerido && !valoresCampos[campo.id]?.trim?.() && !valoresCampos[campo.id]) {
        errs[campo.id] = `"${campo.label}" es requerido`
      }
    })
    return errs
  }

  const construirDescripcion = () => {
    const lineas = camposOrdenados.filter(esCampoVisible).map((campo) => {
      const valor = valoresCampos[campo.id]
      if (!valor) return null
      const prefix = campo.tipo === 'archivo' ? '[Adjunto]' : ''
      return `${campo.label}: ${prefix}${valor}`
    }).filter(Boolean)

    return lineas.length > 0
      ? lineas.join('\n')
      : 'Sin información adicional'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length > 0) {
      setErrores(errs)
      return
    }

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

      setMensaje({
        numero: resultado.numero,
      })
    } catch (err) {
      setErrores({ _global: err.message || 'Error al enviar el formulario. Intente nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const formularioDeshabilitado = loading || !!mensaje

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {tooltipCheque && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          onClick={() => setTooltipCheque(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-900 text-base mb-3">
              Garantía — Copia del Cheque
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {EXPLICACION_CHEQUE}
            </p>
            <button
              type="button"
              onClick={() => setTooltipCheque(false)}
              className="mt-5 px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 z-10">
          <h3 className="text-base sm:text-xl font-bold text-white leading-tight">
            Solicitar {programa || title}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 sm:p-8">
          {/* Éxito */}
          {mensaje && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 flex gap-4">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900 text-lg">Solicitud enviada exitosamente</h4>
                <p className="text-green-700 mt-2">
                  Número de seguimiento:{' '}
                  <span className="font-mono font-bold text-lg text-green-900">{mensaje.numero}</span>
                </p>
                <p className="text-green-600 text-sm mt-2">
                  Guardá este número para consultar el estado de tu solicitud en cualquier momento.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <a
                    href={`/consultar?numero=${mensaje.numero}`}
                    className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm text-center"
                  >
                    Ver estado de mi trámite →
                  </a>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 border border-green-400 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors text-sm"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error global */}
          {errores._global && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errores._global}</p>
            </div>
          )}

          {!mensaje && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-5">
                {/* Campos fijos: identidad del solicitante */}
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Datos del Solicitante
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Nombre Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={nombreCiudadano}
                        onChange={(e) => { setNombre(e.target.value); setErrores(p => { const e={...p}; delete e._nombre; return e }) }}
                        disabled={formularioDeshabilitado}
                        placeholder="Juan Pérez García"
                        className={`${inputBase} ${errores._nombre ? 'border-red-400 bg-red-50' : ''}`}
                      />
                      {errores._nombre && <p className="text-red-500 text-xs mt-1">{errores._nombre}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={emailCiudadano}
                        onChange={(e) => { setEmail(e.target.value); setErrores(p => { const e={...p}; delete e._email; return e }) }}
                        disabled={formularioDeshabilitado}
                        placeholder="juan@ejemplo.com"
                        className={`${inputBase} ${errores._email ? 'border-red-400 bg-red-50' : ''}`}
                      />
                      {errores._email && <p className="text-red-500 text-xs mt-1">{errores._email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={telefonoCiudadano}
                        onChange={(e) => setTelefono(e.target.value)}
                        disabled={formularioDeshabilitado}
                        placeholder="264 4123456"
                        className={inputBase}
                      />
                    </div>
                  </div>
                </div>

                {/* Campos dinámicos del programa */}
                {camposOrdenados.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                      Información del Programa
                    </p>
                    <div className="space-y-4">
                      {camposOrdenados.map((campo) => {
                        if (!esCampoVisible(campo)) return null
                        return (
                          <div key={campo.id}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              {campo.label}
                              {campo.requerido && <span className="text-red-500 ml-1">*</span>}
                              {campo.campo === 'cf_garantia_cheque' && (
                                <button
                                  type="button"
                                  onClick={() => setTooltipCheque(true)}
                                  className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-orange-600 hover:text-orange-800 transition-colors"
                                >
                                  ❔ ¿Por qué pedimos esto?
                                </button>
                              )}
                            </label>
                            <CampoInput
                              campo={campo}
                              value={valoresCampos[campo.id] ?? ''}
                              onChange={setCampoValor}
                              disabled={formularioDeshabilitado}
                            />
                            {errores[campo.id] && (
                              <p className="text-red-500 text-xs mt-1">{errores[campo.id]}</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Fallback si no hay campos dinámicos */}
                {camposOrdenados.length === 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Detalles de la Solicitud
                    </label>
                    <textarea
                      value={valoresCampos._descripcion || ''}
                      onChange={(e) => setCampoValor('_descripcion', e.target.value)}
                      disabled={formularioDeshabilitado}
                      rows={5}
                      placeholder="Cuéntenos sobre su proyecto, empresa o necesidad..."
                      className={inputBase}
                    />
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={formularioDeshabilitado}
                  className="w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg
                             hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
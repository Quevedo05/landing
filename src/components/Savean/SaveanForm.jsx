import { useState } from 'react'
import { AlertCircle, Plus, Trash2, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import SaveanQRPDF from './SaveanQRPDF'

const ESPECIES = ['Vid', 'Tomate', 'Pimiento', 'Olivo', 'Pistacho', 'Ajo', 'Cebolla', 'Otro']
const VARIEDADES_VID = ['Cabernet Sauvignon', 'Malbec', 'Syrah', 'Chardonnay', 'Torrontés', 'Otra']
const GRADOS_SELECCION = ['Extra', 'Primera', 'Segunda']
const TIPOS_ENVASE = ['Caja', 'Bolsa', 'Balde', 'Contenedor', 'Otro']
const TIPOS_TRANSPORTE = ['Camión', 'Furgoneta', 'Tractor', 'Otro']

const STEPS = [
  { label: 'Partes', desc: 'Remitente y destinatario' },
  { label: 'Mercadería', desc: 'Detalle de productos' },
  { label: 'Transporte', desc: 'Datos del vehículo' },
]

const fieldCls = 'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors'
const fieldErrCls = 'w-full border border-red-400 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-red-50 outline-none focus:ring-2 focus:ring-red-200 transition-colors'

function Stepper({ step }) {
  const pct = Math.round((step / STEPS.length) * 100)
  return (
    <div className="mb-10">
      <div className="flex items-start">
        {STEPS.map(({ label, desc }, i) => {
          const n = i + 1
          const done = step > n
          const active = step === n
          return (
            <div key={i} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                  done ? 'bg-orange-600 border-orange-600 text-white' :
                  active ? 'bg-orange-600 border-orange-600 text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  {done ? <Check size={15} strokeWidth={3} /> : n}
                </div>
                <p className={`text-xs mt-2 font-semibold whitespace-nowrap ${
                  active ? 'text-orange-600' : done ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {label}
                </p>
                <p className={`text-[10px] hidden sm:block text-center leading-tight max-w-[80px] ${
                  active ? 'text-gray-500' : 'text-gray-300'
                }`}>
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

      <div className="mt-6">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-500">Paso {step} de {STEPS.length}</span>
          <span className="font-semibold text-orange-600">{pct}% completado</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-5 bg-orange-500 rounded-full" />
      <h3 className="text-base font-bold text-gray-900">{children}</h3>
    </div>
  )
}

function FieldGroup({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function SaveanForm({ onGuiaCreated }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    remitente: { nombre: '', renspa: '', tipo: 'Productor' },
    destinatario: { nombre: '', tipoDestino: 'interno', pais: 'Argentina', provincia: '', puntoSalida: '', mercadoInterno: '' },
    contacto: { email: '' },
    mercaderias: [{ id: 1, especie: 'Vid', variedad: '', grado: '', tamaño: '', envase: '', cantidad: '', kilos: '' }],
    transporte: { empresa: '', conductor: '', tipo: 'Camión', camionMarca: '', camionPatente: '', acopladoMarca: '', acopladoPatente: '', precintos: '' },
  })

  const [errors, setErrors] = useState({})
  const [guiaCreated, setGuiaCreated] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
  }

  const handleMercaderiaChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      mercaderias: prev.mercaderias.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }))
  }

  const addMercaderia = () => {
    const newId = Math.max(...formData.mercaderias.map((m) => m.id), 0) + 1
    setFormData((prev) => ({
      ...prev,
      mercaderias: [...prev.mercaderias, { id: newId, especie: 'Vid', variedad: '', grado: '', tamaño: '', envase: '', cantidad: '', kilos: '' }],
    }))
  }

  const removeMercaderia = (id) => {
    if (formData.mercaderias.length > 1) {
      setFormData((prev) => ({ ...prev, mercaderias: prev.mercaderias.filter((m) => m.id !== id) }))
    }
  }

  const validateStep = (stepNum) => {
    const newErrors = {}
    if (stepNum === 1) {
      if (!formData.remitente.nombre) newErrors.nombre = 'Campo requerido'
      if (!formData.remitente.tipo) newErrors.tipo = 'Campo requerido'
      if (!formData.destinatario.nombre) newErrors.destNombre = 'Campo requerido'
      if (!formData.contacto.email || !/\S+@\S+\.\S+/.test(formData.contacto.email)) newErrors.email = 'Email inválido'
    }
    if (stepNum === 2) {
      if (formData.mercaderias.some((m) => !m.especie || !m.cantidad || !m.kilos)) {
        newErrors.mercaderias = 'Todos los campos de mercadería son requeridos'
      }
    }
    if (stepNum === 3) {
      if (!formData.transporte.empresa) newErrors.empresa = 'Campo requerido'
      if (!formData.transporte.conductor) newErrors.conductor = 'Campo requerido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return
    setSubmitting(true)
    setSubmitError(null)

    const body = {
      remitenteNombre: formData.remitente.nombre,
      remitenteTipo: formData.remitente.tipo,
      remitenteRenspa: formData.remitente.renspa || undefined,
      destinatarioNombre: formData.destinatario.nombre,
      destinoTipo: formData.destinatario.tipoDestino,
      destinoPais: formData.destinatario.pais || undefined,
      destinoPuntoSalida: formData.destinatario.puntoSalida || undefined,
      destinoMercadoInterno: formData.destinatario.mercadoInterno || undefined,
      destinoProvincia: formData.destinatario.provincia || undefined,
      emailContacto: formData.contacto.email || undefined,
      items: formData.mercaderias.map((m) => ({
        id: String(m.id),
        especie: m.especie,
        variedad: m.variedad || undefined,
        vidDestino: [],
        tipoEnvase: m.envase || undefined,
        cantidadKg: (parseFloat(m.kilos) || 0) * (parseInt(m.cantidad) || 0),
        cantidadBultos: parseInt(m.cantidad) || 0,
        lugarEmpaque: '',
      })),
      transporteConductor: formData.transporte.conductor,
      transporteEmpresa: formData.transporte.empresa || undefined,
      transporteCamionPatente: formData.transporte.camionPatente || undefined,
      transporteAcopladoPatente: formData.transporte.acopladoPatente || undefined,
      transportePrecintos: formData.transporte.precintos || undefined,
    }

    try {
      const response = await fetch('https://sistema.agenciacalidadsanjuan.com.ar/api/savean/guias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}: No se pudo emitir la guía`)
      }
      const data = await response.json()
      const guia = { ...formData, ...data, fecha_emision: data.fechaEmision }
      onGuiaCreated(guia)
      setGuiaCreated(guia)
      setStep(4)
    } catch (err) {
      setSubmitError(err.message || 'Ocurrió un error al emitir la guía. Intentá nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (guiaCreated) return <SaveanQRPDF guia={guiaCreated} />

  return (
    <div className="max-w-4xl">
      <Stepper step={step} />

      {/* Errores */}
      {(Object.keys(errors).length > 0 || submitError) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 space-y-0.5">
            {Object.values(errors).map((e, i) => <p key={i}>{e}</p>)}
            {submitError && <p>{submitError}</p>}
          </div>
        </div>
      )}

      {/* ── PASO 1: Partes ── */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Paso 1 — Partes</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">Identificación de las partes y contacto</h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Remitente */}
            <div>
              <SectionHeader>Remitente de Mercadería</SectionHeader>
              <div className="space-y-4">
                <FieldGroup label="Nombre / Razón Social" required error={errors.nombre}>
                  <input
                    type="text"
                    value={formData.remitente.nombre}
                    onChange={(e) => handleInputChange('remitente', 'nombre', e.target.value)}
                    className={errors.nombre ? fieldErrCls : fieldCls}
                    placeholder="Ej: Juan Pérez, Empresa ABC"
                  />
                </FieldGroup>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FieldGroup label="RENSPA">
                    <input
                      type="text"
                      value={formData.remitente.renspa}
                      onChange={(e) => handleInputChange('remitente', 'renspa', e.target.value)}
                      className={fieldCls}
                      placeholder="Número RENSPA"
                    />
                  </FieldGroup>
                  <FieldGroup label="Tipo" required error={errors.tipo}>
                    <select
                      value={formData.remitente.tipo}
                      onChange={(e) => handleInputChange('remitente', 'tipo', e.target.value)}
                      className={errors.tipo ? fieldErrCls : fieldCls}
                    >
                      <option>Productor</option>
                      <option>Galpón</option>
                      <option>Cámara Frío</option>
                      <option>Industria</option>
                    </select>
                  </FieldGroup>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Destinatario */}
            <div>
              <SectionHeader>Destinatario</SectionHeader>
              <div className="space-y-4">
                <FieldGroup label="Nombre / Razón Social" required error={errors.destNombre}>
                  <input
                    type="text"
                    value={formData.destinatario.nombre}
                    onChange={(e) => handleInputChange('destinatario', 'nombre', e.target.value)}
                    className={errors.destNombre ? fieldErrCls : fieldCls}
                    placeholder="Ej: Mercado Municipal, Empresa XYZ"
                  />
                </FieldGroup>
                <FieldGroup label="Tipo de Destino" required>
                  <select
                    value={formData.destinatario.tipoDestino}
                    onChange={(e) => handleInputChange('destinatario', 'tipoDestino', e.target.value)}
                    className={fieldCls}
                  >
                    <option value="interno">Mercado Interno</option>
                    <option value="externo">Destino Externo</option>
                  </select>
                </FieldGroup>

                {formData.destinatario.tipoDestino === 'externo' ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldGroup label="País" required>
                      <input
                        type="text"
                        value={formData.destinatario.pais}
                        onChange={(e) => handleInputChange('destinatario', 'pais', e.target.value)}
                        className={fieldCls}
                        placeholder="País destino"
                      />
                    </FieldGroup>
                    <FieldGroup label="Punto de Salida" required>
                      <input
                        type="text"
                        value={formData.destinatario.puntoSalida}
                        onChange={(e) => handleInputChange('destinatario', 'puntoSalida', e.target.value)}
                        className={fieldCls}
                        placeholder="Puerto, paso fronterizo..."
                      />
                    </FieldGroup>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldGroup label="Provincia" required>
                      <input
                        type="text"
                        value={formData.destinatario.provincia}
                        onChange={(e) => handleInputChange('destinatario', 'provincia', e.target.value)}
                        className={fieldCls}
                        placeholder="San Juan, Mendoza..."
                      />
                    </FieldGroup>
                    <FieldGroup label="Tipo de Mercado" required>
                      <select
                        value={formData.destinatario.mercadoInterno}
                        onChange={(e) => handleInputChange('destinatario', 'mercadoInterno', e.target.value)}
                        className={fieldCls}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="mayorista">Mayorista</option>
                        <option value="concentrador">Concentrador</option>
                        <option value="supermercado">Supermercado</option>
                        <option value="industria">Industria</option>
                      </select>
                    </FieldGroup>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Contacto */}
            <div>
              <SectionHeader>Contacto</SectionHeader>
              <FieldGroup label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={formData.contacto.email}
                  onChange={(e) => handleInputChange('contacto', 'email', e.target.value)}
                  className={errors.email ? fieldErrCls : fieldCls}
                  placeholder="correo@ejemplo.com"
                />
              </FieldGroup>
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 2: Mercadería ── */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Paso 2 — Mercadería</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">Detalle de los productos a transportar</h2>
          </div>

          <div className="p-6 space-y-6">
            {formData.mercaderias.map((item, idx) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">Artículo {idx + 1}</p>
                  <button
                    onClick={() => removeMercaderia(item.id)}
                    disabled={formData.mercaderias.length === 1}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldGroup label="Especie" required>
                      <select
                        value={item.especie}
                        onChange={(e) => handleMercaderiaChange(item.id, 'especie', e.target.value)}
                        className={fieldCls}
                      >
                        {ESPECIES.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Variedad">
                      <select
                        value={item.variedad}
                        onChange={(e) => handleMercaderiaChange(item.id, 'variedad', e.target.value)}
                        disabled={item.especie !== 'Vid'}
                        className={`${fieldCls} disabled:bg-gray-100 disabled:text-gray-400`}
                      >
                        <option value="">Seleccionar...</option>
                        {VARIEDADES_VID.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </FieldGroup>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FieldGroup label="Grado de Selección">
                      <select
                        value={item.grado}
                        onChange={(e) => handleMercaderiaChange(item.id, 'grado', e.target.value)}
                        className={fieldCls}
                      >
                        <option value="">Seleccionar...</option>
                        {GRADOS_SELECCION.map((g) => <option key={g}>{g}</option>)}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Tamaño">
                      <input
                        type="text"
                        value={item.tamaño}
                        onChange={(e) => handleMercaderiaChange(item.id, 'tamaño', e.target.value)}
                        className={fieldCls}
                        placeholder="Grande, Mediano..."
                      />
                    </FieldGroup>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <FieldGroup label="Tipo Envase" required>
                      <select
                        value={item.envase}
                        onChange={(e) => handleMercaderiaChange(item.id, 'envase', e.target.value)}
                        className={fieldCls}
                      >
                        <option value="">Seleccionar...</option>
                        {TIPOS_ENVASE.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Cantidad Bultos" required>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleMercaderiaChange(item.id, 'cantidad', e.target.value)}
                        className={fieldCls}
                        placeholder="0"
                        min="0"
                      />
                    </FieldGroup>
                    <FieldGroup label="Kilos / Bulto" required>
                      <input
                        type="number"
                        value={item.kilos}
                        onChange={(e) => handleMercaderiaChange(item.id, 'kilos', e.target.value)}
                        className={fieldCls}
                        placeholder="0"
                        min="0"
                      />
                    </FieldGroup>
                  </div>

                  <div className="bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5 text-sm">
                    Total estimado:{' '}
                    <span className="font-bold text-orange-700">
                      {(parseFloat(item.cantidad) || 0) * (parseFloat(item.kilos) || 0)} kg
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addMercaderia}
              className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-4 py-2.5 rounded-lg border border-dashed border-orange-300 w-full justify-center transition-colors"
            >
              <Plus size={16} /> Agregar artículo
            </button>
          </div>
        </div>
      )}

      {/* ── PASO 3: Transporte ── */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Paso 3 — Transporte</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">Datos del vehículo y conductor</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Empresa y conductor */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldGroup label="Empresa de Transporte" required error={errors.empresa}>
                <input
                  type="text"
                  value={formData.transporte.empresa}
                  onChange={(e) => handleInputChange('transporte', 'empresa', e.target.value)}
                  className={errors.empresa ? fieldErrCls : fieldCls}
                  placeholder="Nombre de la empresa"
                />
              </FieldGroup>
              <FieldGroup label="Conductor" required error={errors.conductor}>
                <input
                  type="text"
                  value={formData.transporte.conductor}
                  onChange={(e) => handleInputChange('transporte', 'conductor', e.target.value)}
                  className={errors.conductor ? fieldErrCls : fieldCls}
                  placeholder="Nombre completo"
                />
              </FieldGroup>
            </div>

            <FieldGroup label="Tipo de Transporte" required>
              <select
                value={formData.transporte.tipo}
                onChange={(e) => handleInputChange('transporte', 'tipo', e.target.value)}
                className={fieldCls}
              >
                {TIPOS_TRANSPORTE.map((t) => <option key={t}>{t}</option>)}
              </select>
            </FieldGroup>

            {/* Camión */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                <p className="text-sm font-semibold text-gray-700">Datos del Camión</p>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <FieldGroup label="Marca">
                  <input
                    type="text"
                    value={formData.transporte.camionMarca}
                    onChange={(e) => handleInputChange('transporte', 'camionMarca', e.target.value)}
                    className={fieldCls}
                    placeholder="Volvo, Mercedes, Scania..."
                  />
                </FieldGroup>
                <FieldGroup label="Patente">
                  <input
                    type="text"
                    value={formData.transporte.camionPatente}
                    onChange={(e) => handleInputChange('transporte', 'camionPatente', e.target.value)}
                    className={fieldCls}
                    placeholder="ABC-1234"
                  />
                </FieldGroup>
              </div>
            </div>

            {/* Acoplado */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3">
                <p className="text-sm font-semibold text-gray-700">Datos del Acoplado <span className="text-gray-400 font-normal">(si aplica)</span></p>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                <FieldGroup label="Marca">
                  <input
                    type="text"
                    value={formData.transporte.acopladoMarca}
                    onChange={(e) => handleInputChange('transporte', 'acopladoMarca', e.target.value)}
                    className={fieldCls}
                    placeholder="Marca del acoplado"
                  />
                </FieldGroup>
                <FieldGroup label="Patente">
                  <input
                    type="text"
                    value={formData.transporte.acopladoPatente}
                    onChange={(e) => handleInputChange('transporte', 'acopladoPatente', e.target.value)}
                    className={fieldCls}
                    placeholder="ABC-1234"
                  />
                </FieldGroup>
              </div>
            </div>

            <FieldGroup label="Precintos">
              <input
                type="text"
                value={formData.transporte.precintos}
                onChange={(e) => handleInputChange('transporte', 'precintos', e.target.value)}
                className={fieldCls}
                placeholder="Números de precintos"
              />
            </FieldGroup>
          </div>
        </div>
      )}

      {/* ── Navegación ── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        {step < 3 ? (
          <button
            onClick={() => validateStep(step) && setStep(step + 1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors shadow-sm"
          >
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {submitting ? 'Emitiendo guía...' : 'Emitir Guía de Origen'}
            {!submitting && <Check size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}

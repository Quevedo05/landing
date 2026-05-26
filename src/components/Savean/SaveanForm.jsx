import { useState } from 'react'
import { AlertCircle, Plus, Trash2, Download } from 'lucide-react'
import SaveanQRPDF from './SaveanQRPDF'

const ESPECIES = ['Vid', 'Tomate', 'Pimiento', 'Olivo', 'Pistacho', 'Ajo', 'Cebolla', 'Otro']
const VARIEDADES_VID = ['Cabernet Sauvignon', 'Malbec', 'Syrah', 'Chardonnay', 'Torrontés', 'Otra']
const GRADOS_SELECCION = ['Extra', 'Primera', 'Segunda']
const TIPOS_ENVASE = ['Caja', 'Bolsa', 'Balde', 'Contenedor', 'Otro']
const TIPOS_TRANSPORTE = ['Camión', 'Furgoneta', 'Tractor', 'Otro']

export default function SaveanForm({ onGuiaCreated }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    remitente: {
      nombre: '',
      renspa: '',
      tipo: 'Productor',
    },
    destinatario: {
      nombre: '',
      tipoDestino: 'interno',
      pais: 'Argentina',
      provincia: '',
      puntoSalida: '',
      mercadoInterno: '',
    },
    contacto: {
      email: '',
    },
    mercaderias: [{ id: 1, especie: 'Vid', variedad: '', grado: '', tamaño: '', envase: '', cantidad: '', kilos: '' }],
    transporte: {
      empresa: '',
      conductor: '',
      tipo: 'Camión',
      camionMarca: '',
      camionPatente: '',
      acopladoMarca: '',
      acopladoPatente: '',
      precintos: '',
    },
    pago: {
      comprobante: '',
      banco: '',
      sucursal: '',
      fecha: '',
    },
  })

  const [errors, setErrors] = useState({})
  const [guiaCreated, setGuiaCreated] = useState(null)

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
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
      setFormData((prev) => ({
        ...prev,
        mercaderias: prev.mercaderias.filter((m) => m.id !== id),
      }))
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

  const handleSubmit = () => {
    if (!validateStep(3)) return

    const guiaNumber = `SAVEAN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`
    const token = Math.random().toString(36).substring(2, 66)

    const guia = {
      numero: guiaNumber,
      token,
      estado: 'pendiente',
      fecha_emision: new Date().toISOString(),
      ...formData,
    }

    onGuiaCreated(guia)
    setGuiaCreated(guia)
    setStep(4)
  }

  if (guiaCreated) {
    return <SaveanQRPDF guia={guiaCreated} />
  }

  return (
    <div className="max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-2 flex-1 mx-1 rounded ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-sm text-gray-600">Paso {step} de 4</p>
      </div>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <div className="text-sm text-red-800">
            {Object.values(errors).map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Remitente, Destinatario, Contacto */}
      {step === 1 && (
        <div className="space-y-8 bg-white rounded-2xl p-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Remitente de Mercadería</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre / Razón Social *</label>
                <input
                  type="text"
                  value={formData.remitente.nombre}
                  onChange={(e) => handleInputChange('remitente', 'nombre', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="Ej: Juan Pérez, Empresa ABC"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RENSPA</label>
                  <input
                    type="text"
                    value={formData.remitente.renspa}
                    onChange={(e) => handleInputChange('remitente', 'renspa', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Número RENSPA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                  <select
                    value={formData.remitente.tipo}
                    onChange={(e) => handleInputChange('remitente', 'tipo', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  >
                    <option>Productor</option>
                    <option>Galpón</option>
                    <option>Cámara Frío</option>
                    <option>Industria</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Destinatario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre / Razón Social *</label>
                <input
                  type="text"
                  value={formData.destinatario.nombre}
                  onChange={(e) => handleInputChange('destinatario', 'nombre', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="Ej: Mercado Municipal, Empresa XYZ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Destino *</label>
                <select
                  value={formData.destinatario.tipoDestino}
                  onChange={(e) => handleInputChange('destinatario', 'tipoDestino', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  <option value="interno">Mercado Interno</option>
                  <option value="externo">Destino Externo</option>
                </select>
              </div>

              {formData.destinatario.tipoDestino === 'externo' ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">País *</label>
                    <input
                      type="text"
                      value={formData.destinatario.pais}
                      onChange={(e) => handleInputChange('destinatario', 'pais', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="País destino"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Punto de Salida *</label>
                    <input
                      type="text"
                      value={formData.destinatario.puntoSalida}
                      onChange={(e) => handleInputChange('destinatario', 'puntoSalida', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="Puerto, Paso fronterizo, etc"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Provincia *</label>
                    <input
                      type="text"
                      value={formData.destinatario.provincia}
                      onChange={(e) => handleInputChange('destinatario', 'provincia', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="San Juan, Mendoza, etc"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Mercado *</label>
                    <select
                      value={formData.destinatario.mercadoInterno}
                      onChange={(e) => handleInputChange('destinatario', 'mercadoInterno', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="mayorista">Mayorista</option>
                      <option value="concentrador">Concentrador</option>
                      <option value="supermercado">Supermercado</option>
                      <option value="industria">Industria</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr />

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contacto</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.contacto.email}
                onChange={(e) => handleInputChange('contacto', 'email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Mercadería */}
      {step === 2 && (
        <div className="space-y-6 bg-white rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900">Mercadería</h3>
          <div className="space-y-6">
            {formData.mercaderias.map((item) => (
              <div key={item.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">Artículo {formData.mercaderias.indexOf(item) + 1}</h4>
                  <button
                    onClick={() => removeMercaderia(item.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                    disabled={formData.mercaderias.length === 1}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Especie *</label>
                    <select
                      value={item.especie}
                      onChange={(e) => handleMercaderiaChange(item.id, 'especie', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      {ESPECIES.map((e) => (
                        <option key={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variedad</label>
                    <select
                      value={item.variedad}
                      onChange={(e) => handleMercaderiaChange(item.id, 'variedad', e.target.value)}
                      disabled={item.especie !== 'Vid'}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar...</option>
                      {VARIEDADES_VID.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grado de Selección</label>
                    <select
                      value={item.grado}
                      onChange={(e) => handleMercaderiaChange(item.id, 'grado', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {GRADOS_SELECCION.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                    <input
                      type="text"
                      value={item.tamaño}
                      onChange={(e) => handleMercaderiaChange(item.id, 'tamaño', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="Ej: Grande, Mediano"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Envase *</label>
                    <select
                      value={item.envase}
                      onChange={(e) => handleMercaderiaChange(item.id, 'envase', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    >
                      <option value="">Seleccionar...</option>
                      {TIPOS_ENVASE.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad Bultos *</label>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleMercaderiaChange(item.id, 'cantidad', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kilos/Bulto *</label>
                    <input
                      type="number"
                      value={item.kilos}
                      onChange={(e) => handleMercaderiaChange(item.id, 'kilos', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p className="text-gray-700">
                    Total: <span className="font-bold">{(parseFloat(item.cantidad) || 0) * (parseFloat(item.kilos) || 0)} kg</span>
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={addMercaderia}
              className="flex items-center gap-2 text-primary font-semibold hover:bg-orange-50 px-4 py-2 rounded-lg"
            >
              <Plus size={20} /> Agregar Artículo
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Transporte y Pago */}
      {step === 3 && (
        <div className="space-y-8 bg-white rounded-2xl p-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Transporte</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Empresa *</label>
                  <input
                    type="text"
                    value={formData.transporte.empresa}
                    onChange={(e) => handleInputChange('transporte', 'empresa', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Empresa de transporte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conductor *</label>
                  <input
                    type="text"
                    value={formData.transporte.conductor}
                    onChange={(e) => handleInputChange('transporte', 'conductor', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Nombre del conductor"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Transporte *</label>
                <select
                  value={formData.transporte.tipo}
                  onChange={(e) => handleInputChange('transporte', 'tipo', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  {TIPOS_TRANSPORTE.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">Datos del Camión</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                    <input
                      type="text"
                      value={formData.transporte.camionMarca}
                      onChange={(e) => handleInputChange('transporte', 'camionMarca', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="Volvo, Mercedes, Scania"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patente</label>
                    <input
                      type="text"
                      value={formData.transporte.camionPatente}
                      onChange={(e) => handleInputChange('transporte', 'camionPatente', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-3">Datos del Acoplado (si aplica)</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                    <input
                      type="text"
                      value={formData.transporte.acopladoMarca}
                      onChange={(e) => handleInputChange('transporte', 'acopladoMarca', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="Marca acoplado"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patente</label>
                    <input
                      type="text"
                      value={formData.transporte.acopladoPatente}
                      onChange={(e) => handleInputChange('transporte', 'acopladoPatente', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precintos</label>
                <input
                  type="text"
                  value={formData.transporte.precintos}
                  onChange={(e) => handleInputChange('transporte', 'precintos', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="Números de precintos"
                />
              </div>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pago</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comprobante</label>
                  <input
                    type="text"
                    value={formData.pago.comprobante}
                    onChange={(e) => handleInputChange('pago', 'comprobante', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Nº de comprobante"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                  <input
                    type="text"
                    value={formData.pago.banco}
                    onChange={(e) => handleInputChange('pago', 'banco', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Banco de origen"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sucursal</label>
                  <input
                    type="text"
                    value={formData.pago.sucursal}
                    onChange={(e) => handleInputChange('pago', 'sucursal', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    placeholder="Sucursal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Pago</label>
                  <input
                    type="date"
                    value={formData.pago.fecha}
                    onChange={(e) => handleInputChange('pago', 'fecha', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex gap-4 justify-between">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        {step < 3 ? (
          <button
            onClick={() => validateStep(step) && setStep(step + 1)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-orange-600"
          >
            Emitir Guía
          </button>
        )}
      </div>
    </div>
  )
}

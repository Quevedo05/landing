import { useState } from 'react'
import { AlertCircle, CheckCircle, X } from 'lucide-react'
import { crearTicket } from '../services/tickets.service.js'

export default function FormularioDinamico({ formularioId, programa, title, onClose }) {
  const [formData, setFormData] = useState({
    nombreCiudadano: '',
    emailCiudadano: '',
    telefonoCiudadano: '',
    descripcion: '',
  })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMensaje(null)

    try {
      // Validación básica
      if (!formData.nombreCiudadano.trim()) {
        throw new Error('El nombre es requerido')
      }
      if (!formData.emailCiudadano.trim()) {
        throw new Error('El email es requerido')
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.emailCiudadano)) {
        throw new Error('Email inválido')
      }

      const resultado = await crearTicket({
        formularioId,
        programa,
        ciudadanoNombre: formData.nombreCiudadano,
        ciudadanoEmail: formData.emailCiudadano,
        ciudadanoTelefono: formData.telefonoCiudadano || null,
        descripcion: formData.descripcion || 'Sin detalles adicionales',
      })

      setMensaje({
        tipo: 'exito',
        titulo: 'Solicitud enviada exitosamente',
        numero: resultado.numero,
        detalle: `Su número de seguimiento es: ${resultado.numero}`,
      })

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          nombreCiudadano: '',
          emailCiudadano: '',
          telefonoCiudadano: '',
          descripcion: '',
        })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al enviar el formulario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Solicitar {programa}</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {mensaje && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-6 flex gap-4">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-green-900 text-lg">{mensaje.titulo}</h4>
                <p className="text-green-700 mt-2">
                  Número de seguimiento:{' '}
                  <span className="font-mono font-bold text-lg text-green-900">{mensaje.numero}</span>
                </p>
                <p className="text-green-600 text-sm mt-3">{mensaje.detalle}</p>
                <p className="text-green-600 text-sm mt-2">
                  Puede usar este número para consultar el estado de su solicitud en el sistema.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-6 flex gap-4">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-red-900">Error al enviar</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className={mensaje ? 'opacity-50 pointer-events-none' : ''}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="nombreCiudadano"
                  value={formData.nombreCiudadano}
                  onChange={handleChange}
                  disabled={loading || !!mensaje}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Juan Pérez García"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="emailCiudadano"
                  value={formData.emailCiudadano}
                  onChange={handleChange}
                  disabled={loading || !!mensaje}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefonoCiudadano"
                  value={formData.telefonoCiudadano}
                  onChange={handleChange}
                  disabled={loading || !!mensaje}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="264 4123456"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detalles de la Solicitud
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={loading || !!mensaje}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  placeholder="Cuéntenos sobre su proyecto, empresa o necesidad..."
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="submit"
                disabled={loading || !!mensaje}
                className="flex-1 bg-orange-600 text-white font-bold py-3 px-6 rounded-lg
                           hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando solicitud...' : 'Enviar Solicitud'}
              </button>
              {mensaje && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg
                             hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
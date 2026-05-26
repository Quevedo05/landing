import { useState } from 'react'
import { Search, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function SaveanVerification({ guias }) {
  const [searchToken, setSearchToken] = useState('')
  const [foundGuia, setFoundGuia] = useState(null)
  const [searched, setSearched] = useState(false)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [isInspector, setIsInspector] = useState(false)

  const handleSearch = () => {
    setSearched(true)
    const guia = guias.find((g) => g.token === searchToken)
    setFoundGuia(guia || null)
  }

  const handleVerify = () => {
    if (!isInspector) {
      alert('Debes iniciar sesión como inspector para verificar guías')
      return
    }

    if (foundGuia && foundGuia.estado === 'pendiente') {
      // Update guia status
      foundGuia.estado = 'verificada'
      foundGuia.fecha_verificacion = new Date().toISOString()
      foundGuia.inspector = 'Inspector SAVEAN'
      foundGuia.notas = verificationNotes

      // Update localStorage
      const updatedGuias = guias.map((g) => (g.token === foundGuia.token ? foundGuia : g))
      localStorage.setItem('savean_guias', JSON.stringify(updatedGuias))

      setFoundGuia(foundGuia)
      setVerificationNotes('')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verificada':
        return 'text-green-600 bg-green-50'
      case 'pendiente':
        return 'text-yellow-600 bg-yellow-50'
      case 'vencida':
        return 'text-red-600 bg-red-50'
      case 'denegada':
        return 'text-red-900 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verificada':
        return <CheckCircle className="text-green-600" />
      case 'pendiente':
        return <Clock className="text-yellow-600" />
      case 'vencida':
      case 'denegada':
        return <AlertCircle className="text-red-600" />
      default:
        return null
    }
  }

  const isExpired = foundGuia && new Date(foundGuia.fecha_emision) < new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verificar Guía SAVEAN</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escanea o ingresa el código QR/Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Código QR o token de verificación"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"
              >
                <Search size={20} /> Buscar
              </button>
            </div>
          </div>

          {searched && !foundGuia && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold">Guía no encontrada</p>
                <p>Verifica que el código QR sea correcto e intenta nuevamente</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {foundGuia && (
        <div className="space-y-6">
          {/* Status Card */}
          <div className={`rounded-xl p-8 ${getStatusColor(isExpired ? 'vencida' : foundGuia.estado)}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold mb-1">Estado de Guía</p>
                <p className="text-2xl font-bold">{isExpired ? 'VENCIDA' : foundGuia.estado?.toUpperCase()}</p>
              </div>
              {getStatusIcon(isExpired ? 'vencida' : foundGuia.estado)}
            </div>

            {isExpired && (
              <p className="text-sm mt-4">Esta guía fue emitida hace más de 20 días y ha vencido automáticamente.</p>
            )}
          </div>

          {/* Guia Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Información de la Guía</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Número</p>
                  <p className="font-bold text-gray-900">{foundGuia.numero}</p>
                </div>
                <div>
                  <p className="text-gray-600">Emitida</p>
                  <p className="font-bold text-gray-900">
                    {new Date(foundGuia.fecha_emision).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Remitente</p>
                  <p className="font-bold text-gray-900">{foundGuia.remitente.nombre}</p>
                  <p className="text-gray-600 text-xs">{foundGuia.remitente.tipo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Destinatario</p>
                  <p className="font-bold text-gray-900">{foundGuia.destinatario.nombre}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Mercadería</h3>
              <div className="space-y-4 text-sm">
                {foundGuia.mercaderias.map((m, i) => (
                  <div key={i} className="border-b pb-3">
                    <p className="font-bold text-gray-900">
                      {m.especie} {m.variedad && `- ${m.variedad}`}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {(parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0)} kg
                    </p>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <p className="text-gray-600">Total</p>
                  <p className="font-bold text-gray-900">
                    {foundGuia.mercaderias.reduce((sum, m) => sum + (parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0), 0)}{' '}
                    kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transporte */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Información de Transporte</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600">Empresa</p>
                <p className="font-bold text-gray-900">{foundGuia.transporte.empresa}</p>
              </div>
              <div>
                <p className="text-gray-600">Conductor</p>
                <p className="font-bold text-gray-900">{foundGuia.transporte.conductor}</p>
              </div>
              <div>
                <p className="text-gray-600">Camión</p>
                <p className="font-bold text-gray-900">
                  {foundGuia.transporte.camionMarca} - {foundGuia.transporte.camionPatente}
                </p>
              </div>
              {foundGuia.transporte.acopladoPatente && (
                <div>
                  <p className="text-gray-600">Acoplado</p>
                  <p className="font-bold text-gray-900">
                    {foundGuia.transporte.acopladoMarca} - {foundGuia.transporte.acopladoPatente}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Section */}
          {!isExpired && foundGuia.estado === 'pendiente' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <h3 className="text-lg font-bold text-yellow-900 mb-4">Verificación en Barrera</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inspector de Turno</label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    disabled
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barrera Fitozoosanitaria</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none">
                    <option>Seleccionar barrera...</option>
                    <option>Barrera Punta Negra</option>
                    <option>Barrera Ruta 9</option>
                    <option>Barrera Palpala</option>
                    <option>Otra barrera</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Observaciones de la verificación (opcional)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inspector"
                    checked={isInspector}
                    onChange={(e) => setIsInspector(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="inspector" className="text-sm text-gray-700">
                    Confirmo que soy inspector autorizado y verifico esta guía
                  </label>
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={!isInspector}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Guía
              </button>
            </div>
          )}

          {/* Verification History */}
          {foundGuia.estado === 'verificada' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
              <h3 className="text-lg font-bold text-green-900 mb-4">Guía Verificada</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>
                  <span className="font-semibold">Verificada en:</span> {new Date(foundGuia.fecha_verificacion).toLocaleString('es-AR')}
                </p>
                {foundGuia.inspector && <p>
                  <span className="font-semibold">Inspector:</span> {foundGuia.inspector}
                </p>}
                {foundGuia.notas && (
                  <p>
                    <span className="font-semibold">Observaciones:</span> {foundGuia.notas}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

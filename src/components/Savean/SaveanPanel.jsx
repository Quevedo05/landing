import { useState } from 'react'
import { CheckCircle, AlertCircle, Trash2, Filter } from 'lucide-react'

export default function SaveanPanel({ guias, setGuias }) {
  const [filterStatus, setFilterStatus] = useState('todas')
  const [filterSearch, setFilterSearch] = useState('')

  const filteredGuias = guias.filter((g) => {
    const matchesStatus = filterStatus === 'todas' || g.estado === filterStatus
    const matchesSearch =
      g.numero.toLowerCase().includes(filterSearch.toLowerCase()) ||
      g.remitente.nombre.toLowerCase().includes(filterSearch.toLowerCase()) ||
      g.destinatario.nombre.toLowerCase().includes(filterSearch.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleDelete = (numero) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar la guía ${numero}?`)) {
      const updatedGuias = guias.filter((g) => g.numero !== numero)
      setGuias(updatedGuias)
      localStorage.setItem('savean_guias', JSON.stringify(updatedGuias))
    }
  }

  const stats = {
    total: guias.length,
    pendientes: guias.filter((g) => g.estado === 'pendiente').length,
    verificadas: guias.filter((g) => g.estado === 'verificada').length,
    vencidas: guias.filter((g) => g.estado === 'vencida').length,
    denegadas: guias.filter((g) => g.estado === 'denegada').length,
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'verificada':
        return 'bg-green-100 text-green-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'vencida':
        return 'bg-red-100 text-red-800'
      case 'denegada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total de Guías</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6">
          <p className="text-yellow-700 text-sm font-medium">Pendientes</p>
          <p className="text-3xl font-bold text-yellow-900">{stats.pendientes}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6">
          <p className="text-green-700 text-sm font-medium">Verificadas</p>
          <p className="text-3xl font-bold text-green-900">{stats.verificadas}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-6">
          <p className="text-orange-700 text-sm font-medium">Vencidas</p>
          <p className="text-3xl font-bold text-orange-900">{stats.vencidas}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6">
          <p className="text-red-700 text-sm font-medium">Denegadas</p>
          <p className="text-3xl font-bold text-red-900">{stats.denegadas}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Número, remitente o destinatario..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter size={16} /> Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              <option value="todas">Todas</option>
              <option value="pendiente">Pendientes</option>
              <option value="verificada">Verificadas</option>
              <option value="vencida">Vencidas</option>
              <option value="denegada">Denegadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guias Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Número</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Remitente</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Destinatario</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Emitida</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredGuias.length > 0 ? (
                filteredGuias.map((guia) => (
                  <tr key={guia.numero} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-900 font-semibold">{guia.numero}</td>
                    <td className="px-6 py-4 text-gray-700">{guia.remitente.nombre}</td>
                    <td className="px-6 py-4 text-gray-700">{guia.destinatario.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(guia.fecha_emision).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeColor(guia.estado)}`}>
                        {guia.estado === 'pendiente' && '⏳ Pendiente'}
                        {guia.estado === 'verificada' && '✓ Verificada'}
                        {guia.estado === 'vencida' && '✗ Vencida'}
                        {guia.estado === 'denegada' && '✗ Denegada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(guia.numero)}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No hay guías que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed View */}
      {filteredGuias.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Detalles de Guías Pendientes</h3>
          <div className="space-y-6">
            {filteredGuias
              .filter((g) => g.estado === 'pendiente')
              .map((guia) => (
                <div key={guia.numero} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono font-bold text-gray-900">{guia.numero}</p>
                      <p className="text-sm text-gray-600">
                        Emitida: {new Date(guia.fecha_emision).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 mb-2">
                        Vence en:{' '}
                        {Math.ceil(
                          (new Date(guia.fecha_emision).getTime() + 20 * 24 * 60 * 60 * 1000 - new Date().getTime()) /
                            (24 * 60 * 60 * 1000)
                        )}{' '}
                        días
                      </p>
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                        ⏳ Pendiente
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Remitente</p>
                      <p className="text-gray-900">{guia.remitente.nombre}</p>
                      <p className="text-xs text-gray-500">{guia.remitente.tipo}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Destinatario</p>
                      <p className="text-gray-900">{guia.destinatario.nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Mercadería</p>
                      <div className="space-y-1">
                        {guia.mercaderias.slice(0, 2).map((m, i) => (
                          <p key={i} className="text-gray-900 text-xs">
                            {m.especie} ({(parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0)} kg)
                          </p>
                        ))}
                        {guia.mercaderias.length > 2 && <p className="text-gray-500 text-xs">+{guia.mercaderias.length - 2} más</p>}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Transporte</p>
                      <p className="text-gray-900 text-xs">{guia.transporte.empresa}</p>
                      <p className="text-gray-500 text-xs">{guia.transporte.camionPatente}</p>
                    </div>
                  </div>
                </div>
              ))}

            {filteredGuias.filter((g) => g.estado === 'pendiente').length === 0 && (
              <p className="text-center text-gray-500 py-8">No hay guías pendientes de verificación</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

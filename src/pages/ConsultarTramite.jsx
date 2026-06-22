import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, CheckCircle, Clock, AlertCircle, FileText, Calendar } from 'lucide-react'
import { consultarTicket } from '../services/tickets.service.js'

const ESTADO_CONFIG = {
  'Solicitud inicial':         { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: Clock },
  'Revisión de documentación': { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: FileText },
  'Veraz':                     { color: 'text-cyan-700',   bg: 'bg-cyan-50 border-cyan-200',     icon: FileText },
  'Comité de análisis':        { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: FileText },
  'Contrato':                  { color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: FileText },
  'Simulador':                 { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',     icon: FileText },
  'Firma de contrato':         { color: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200',     icon: FileText },
  'Certificación de firma':    { color: 'text-fuchsia-700',bg: 'bg-fuchsia-50 border-fuchsia-200',icon: FileText },
  'Transferencia':             { color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: CheckCircle },
  'Cerrado':                   { color: 'text-slate-700',  bg: 'bg-slate-50 border-slate-200',   icon: CheckCircle },
}

function formatFecha(fechaStr) {
  if (!fechaStr) return '—'
  return new Date(fechaStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function ConsultarTramite() {
  const [searchParams] = useSearchParams()
  const [numero, setNumero] = useState(searchParams.get('numero') || '')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  // Si viene con ?numero= en la URL, busca automáticamente
  useEffect(() => {
    const n = searchParams.get('numero')
    if (n) {
      setNumero(n)
      buscar(n)
    }
  }, [])

  async function buscar(n) {
    const num = (n ?? numero).trim()
    if (!num || isNaN(Number(num))) {
      setError('Ingresá un número de trámite válido')
      return
    }
    setCargando(true)
    setError('')
    setResultado(null)
    try {
      const data = await consultarTicket(num)
      setResultado(data)
    } catch {
      setError('No se encontró ningún trámite con ese número. Verificá que sea correcto.')
    } finally {
      setCargando(false)
    }
  }

  const estadoConf = resultado ? (ESTADO_CONFIG[resultado.estado] ?? ESTADO_CONFIG['Solicitud inicial']) : null
  const IconEstado = estadoConf?.icon ?? Clock

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full mb-4">
            <Search size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Consultar estado de trámite</h1>
          <p className="text-red-200 text-base">
            Ingresá el número de seguimiento que recibiste al enviar tu solicitud.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Buscador */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de trámite
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscar()}
              placeholder="Ej: 21"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              min="1"
            />
            <button
              onClick={() => buscar()}
              disabled={cargando}
              className="px-6 py-3 bg-[#FF9500] hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              {cargando ? (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
              Consultar
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Resultado */}
        {resultado && estadoConf && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7F1D1D] rounded-full flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Trámite</p>
                <p className="text-xl font-bold text-gray-900">#{resultado.numero}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Estado */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado actual</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${estadoConf.bg} ${estadoConf.color}`}>
                  <IconEstado size={16} />
                  {resultado.estado}
                </div>
              </div>

              {/* Programa */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Programa</p>
                <p className="text-gray-800 font-medium">{resultado.programa}</p>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-2 text-gray-600 text-sm pt-2 border-t border-gray-100">
                <Calendar size={15} className="flex-shrink-0 text-gray-400" />
                <span>Ingresado el <strong>{formatFecha(resultado.fechaIngreso)}</strong></span>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <p className="text-orange-800 text-sm">
                  Para más información sobre tu trámite, comunicate con la Agencia de Calidad San Juan
                  al <strong>(264) 123-4567</strong> o por email a{' '}
                  <a href="mailto:info@calidadsj.com.ar" className="underline font-medium">info@calidadsj.com.ar</a>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

import { useState } from 'react'
import { X } from 'lucide-react'
import SaveanForm from '../components/Savean/SaveanForm'

export default function SaveanPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const handleNewGuia = (guiaData) => {
    const savedGuias = JSON.parse(localStorage.getItem('savean_guias') || '[]')
    localStorage.setItem('savean_guias', JSON.stringify([...savedGuias, guiaData]))
  }

  return (
    <main className="pt-[72px] min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SaveanLanding onClickEmitir={() => setModalOpen(true)} />
      </div>

      {/* Modal Emitir Guía */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4">
          <div className="bg-gray-50 rounded-2xl w-full max-w-4xl relative">
            <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">Emitir Nueva Guía</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-6">
              <SaveanForm onGuiaCreated={handleNewGuia} />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function SaveanLanding({ onClickEmitir }) {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div
        className="rounded-2xl overflow-hidden text-center py-20 px-8"
        style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fbbf24 100%)' }}
      >
        <span className="inline-block bg-white/20 text-white text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8 border border-white/30">
          Programa Provincial
        </span>
        <h1 className="text-7xl font-extrabold text-white mb-3 tracking-tight">SAVEAN</h1>
        <p className="text-2xl italic text-white/90 mb-8 font-medium">
          Sanidad Vegetal y Animal de San Juan
        </p>
        <p className="text-white/80 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Sistema de control fitozoosanitario que protege la producción agrícola de la provincia
          mediante la fiscalización en puestos de barrera estratégicos.
        </p>
        <button
          onClick={onClickEmitir}
          className="inline-flex items-center gap-3 bg-white text-orange-600 font-bold px-10 py-4 rounded-xl hover:bg-orange-50 transition-colors text-lg shadow-lg"
        >
          Completar Guía de Origen →
        </button>
      </div>

      {/* ¿Qué es SAVEAN? */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-5 border-l-4 border-orange-500 pl-4">
          ¿Qué es SAVEAN?
        </h3>
        <p className="text-gray-700 leading-relaxed text-base">
          El <strong>Servicio de Sanidad Vegetal y Animal</strong> (SAVEAN) es el programa de la Agencia
          Calidad San Juan encargado de la fiscalización fitozoosanitaria en la provincia. Operamos bajo
          la <strong>Ley N° 1887-I</strong>, controlando el tránsito de mercadería vegetal y animal para
          prevenir el ingreso y dispersión de plagas como la <em>Lobesia Botrana</em> (Polilla de la Vid)
          y <em>Ceratitis Capitata</em> (Mosca de los Frutos).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { value: '8', label: 'Puestos de control activos' },
          { value: '24/7', label: 'Fiscalización continua' },
          { value: '20 días', label: 'Validez de cada guía' },
        ].map(({ value, label }) => (
          <div key={label} className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
            <p className="text-3xl font-extrabold text-orange-600 mb-1">{value}</p>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

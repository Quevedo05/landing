import { useState } from 'react'
import { X } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
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
      <SectionHeader
        title="SAVEAN - Sistema Digital de Guías"
        subtitle="Gestión digital de guías de origen y sanidad vegetal y animal para San Juan"
        centered
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Apoyo a la Verificación y Emisión de Avales Nacionales
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            SAVEAN es un sistema integral de control fitozoosanitario que facilita la emisión digital de guías de origen para productos agrícolas, permitiendo trazabilidad completa y verificación en tiempo real mediante códigos QR.
          </p>

          <div className="space-y-4">
            {[
              'Emisión instantánea de guías digitales',
              'Códigos QR verificables',
              'PDF de 4 copias para distribución',
              'Verificación en barreras fitozoosanitarias',
              'Vencimiento automático (20 días)',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClickEmitir}
            className="mt-8 btn-primary bg-primary text-white hover:bg-orange-600"
          >
            Emitir Nueva Guía
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h4 className="text-lg font-bold text-gray-900 mb-6">Destinos Permitidos</h4>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <p className="font-semibold text-gray-900">Productos Cubiertos</p>
              <p className="text-sm text-gray-600">Vid, Tomate, Pimiento, Olivo, Pistacho, Ajo, Cebolla</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="font-semibold text-gray-900">Válidas por</p>
              <p className="text-sm text-gray-600">20 días desde su emisión</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="font-semibold text-gray-900">Documentación</p>
              <p className="text-sm text-gray-600">PDF descargable con 4 copias</p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <p className="font-semibold text-gray-900">Verificación</p>
              <p className="text-sm text-gray-600">Mediante código QR en barreras</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

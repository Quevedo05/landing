import { useState, useEffect } from 'react'
import SectionHeader from '../components/ui/SectionHeader'
import SaveanForm from '../components/Savean/SaveanForm'
import SaveanVerification from '../components/Savean/SaveanVerification'
import SaveanPanel from '../components/Savean/SaveanPanel'

export default function SaveanPage() {
  const [activeTab, setActiveTab] = useState('landing')
  const [guias, setGuias] = useState([])

  useEffect(() => {
    // Cargar guías del localStorage
    const savedGuias = localStorage.getItem('savean_guias')
    if (savedGuias) {
      setGuias(JSON.parse(savedGuias))
    }
  }, [])

  const handleNewGuia = (guiaData) => {
    const newGuias = [...guias, guiaData]
    setGuias(newGuias)
    localStorage.setItem('savean_guias', JSON.stringify(newGuias))
    setActiveTab('confirmation')
  }

  return (
    <main className="pt-[72px] min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'landing'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Inicio SAVEAN
            </button>
            <button
              onClick={() => setActiveTab('emitir')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'emitir'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Emitir Guía
            </button>
            <button
              onClick={() => setActiveTab('verificar')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'verificar'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Verificar Guía
            </button>
            <button
              onClick={() => setActiveTab('panel')}
              className={`px-4 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'panel'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-primary'
              }`}
            >
              Panel Inspectores
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'landing' && <SaveanLanding onClickEmitir={() => setActiveTab('emitir')} />}
        {activeTab === 'emitir' && <SaveanForm onGuiaCreated={handleNewGuia} />}
        {activeTab === 'verificar' && <SaveanVerification guias={guias} />}
        {activeTab === 'panel' && <SaveanPanel guias={guias} setGuias={setGuias} />}
      </div>
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
              'Panel para inspectores y administradores',
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

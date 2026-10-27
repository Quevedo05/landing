import { useState, useEffect } from 'react'
import { X, User, Building2, FileText, Upload } from 'lucide-react'

function CampoPreview({ campo }) {
  const base = 'w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-400 cursor-not-allowed select-none'

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
        {campo.label}
        {campo.requerido && <span className="text-orange-400 ml-1">*</span>}
      </label>

      {campo.tipo === 'textarea' && (
        <textarea
          disabled
          rows={3}
          placeholder={campo.placeholder}
          className={`${base} resize-none`}
        />
      )}

      {campo.tipo === 'selector' && (
        <select disabled className={base}>
          <option value="">Seleccioná una opción...</option>
          {campo.opciones?.map((op) => <option key={op}>{op}</option>)}
        </select>
      )}

      {campo.tipo === 'archivo' && (
        <div className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          <Upload size={14} className="text-gray-300 flex-shrink-0" />
          <span className="text-sm text-gray-400">{campo.placeholder}</span>
        </div>
      )}

      {(campo.tipo === 'texto' || campo.tipo === 'numero') && (
        <input
          disabled
          type={campo.tipo === 'numero' ? 'text' : 'text'}
          placeholder={campo.placeholder}
          className={base}
        />
      )}
    </div>
  )
}

export default function FormularioPreviewModal({ programa, onClose }) {
  const [tab, setTab] = useState('fisica')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const campos = tab === 'fisica' ? programa.camposPreviewFisica : programa.camposPreviewJuridica

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200 bg-amber-50 rounded-t-2xl flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <FileText size={16} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Vista previa del formulario</span>
            </div>
            <h2 className="text-base font-bold text-gray-900">{programa.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Los campos están deshabilitados — el formulario aún no está activo</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-100 transition-colors text-gray-400 hover:text-gray-700 flex-shrink-0"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 flex-shrink-0">
          <button
            onClick={() => setTab('fisica')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px
              ${tab === 'fisica'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <User size={14} /> Persona Física
          </button>
          <button
            onClick={() => setTab('juridica')}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px
              ${tab === 'juridica'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Building2 size={14} /> Persona Jurídica
          </button>
        </div>

        {/* Campos */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {campos?.map((campo, i) => (
            <CampoPreview key={i} campo={campo} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400 text-center">
            Este formulario estará disponible cuando se abra la convocatoria de Desarrollo Minero
          </p>
        </div>
      </div>
    </div>
  )
}
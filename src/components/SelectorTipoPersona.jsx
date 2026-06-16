import { X, User, Building2 } from 'lucide-react'

export default function SelectorTipoPersona({ fisica, juridica, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Bienes de Capital</h3>
            <p className="text-sm text-gray-500 mt-1">Seleccioná el tipo de solicitante para continuar</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4">
          {fisica && (
            <button
              onClick={() => onSelect(fisica)}
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl
                         hover:border-orange-400 hover:bg-orange-50 transition-all group text-left"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0
                              group-hover:bg-orange-200 transition-colors">
                <User size={22} className="text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Persona Física</p>
                <p className="text-sm text-gray-500 mt-0.5">Emprendedor o productor individual</p>
              </div>
            </button>
          )}

          {juridica && (
            <button
              onClick={() => onSelect(juridica)}
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl
                         hover:border-orange-400 hover:bg-orange-50 transition-all group text-left"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0
                              group-hover:bg-orange-200 transition-colors">
                <Building2 size={22} className="text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">Persona Jurídica</p>
                <p className="text-sm text-gray-500 mt-0.5">Empresa, SRL, SA u otra sociedad</p>
              </div>
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
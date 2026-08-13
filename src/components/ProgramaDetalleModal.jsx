import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function ProgramaDetalleModal({ programa, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-orange-50 rounded-t-2xl flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">{programa.title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-orange-100 transition-colors text-gray-500 hover:text-gray-800"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-sm text-gray-700">
          {programa.detalles.map((item, i) => {
            if (item.nota) {
              return (
                <p key={i} className="font-semibold text-orange-700 border-t border-orange-100 pt-4">
                  {item.nota}
                </p>
              )
            }
            return (
              <div key={i}>
                <p className="font-bold text-gray-900 mb-1">
                  <span className="text-orange-600 mr-1">●</span>
                  {item.titulo}
                  {item.texto ? ':' : ''}
                </p>
                {item.texto && (
                  <p className="leading-relaxed ml-4">{item.texto}</p>
                )}
                {item.subitems && (
                  <ul className="mt-1.5 ml-4 space-y-1.5">
                    {item.subitems.map((sub, j) => (
                      <li key={j} className="flex gap-2 leading-relaxed">
                        <span className="text-orange-400 mt-0.5 flex-shrink-0">○</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

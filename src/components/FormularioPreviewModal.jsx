import { useState, useEffect } from 'react'
import { X, User, Building2, Upload, ChevronRight, Clock } from 'lucide-react'

// ─── Campo individual deshabilitado ──────────────────────────────────────────
function CampoPreview({ campo }) {
  const inputBase = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-400 cursor-not-allowed'

  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
        {campo.label}
        {campo.requerido
          ? <span className="text-orange-400 text-xs font-bold">*</span>
          : <span className="text-gray-400 text-xs font-normal">(opcional)</span>
        }
      </label>

      {campo.tipo === 'textarea' && (
        <textarea disabled rows={3} placeholder={campo.placeholder}
          className={`${inputBase} resize-none`} />
      )}

      {campo.tipo === 'selector' && (
        <select disabled className={inputBase}>
          <option>Seleccioná una opción...</option>
          {campo.opciones?.map(op => <option key={op}>{op}</option>)}
        </select>
      )}

      {campo.tipo === 'archivo' && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 border border-dashed border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed">
          <Upload size={15} className="text-gray-300 flex-shrink-0" />
          <span className="text-sm text-gray-400">Adjuntar archivo — JPG, PNG o PDF</span>
        </div>
      )}

      {(campo.tipo === 'texto' || campo.tipo === 'numero') && (
        <input disabled type="text" placeholder={campo.placeholder}
          className={inputBase} />
      )}
    </div>
  )
}

// ─── Agrupa campos por sección ────────────────────────────────────────────────
function agruparPorSeccion(campos) {
  const map = new Map()
  for (const c of campos) {
    const sec = c.seccion || 'General'
    if (!map.has(sec)) map.set(sec, [])
    map.get(sec).push(c)
  }
  return [...map.entries()]
}

// ─── Vista pantalla completa ──────────────────────────────────────────────────
export default function FormularioPreviewModal({ programa, onClose }) {
  const [tab, setTab] = useState('fisica')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // No bloqueamos scroll del body — la pantalla completa tiene su propio scroll
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const campos = tab === 'fisica' ? programa.camposPreviewFisica : programa.camposPreviewJuridica
  const secciones = agruparPorSeccion(campos ?? [])

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden">

      {/* ── Barra superior fija ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">

        {/* Fila título + cerrar */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Clock size={16} className="text-amber-500 flex-shrink-0" />
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest truncate">
              Vista previa · {programa.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors flex-shrink-0 px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <X size={16} /> Cerrar
          </button>
        </div>

        {/* Tabs Física / Jurídica */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-1">
          <button
            onClick={() => setTab('fisica')}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px
              ${tab === 'fisica'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            <User size={14} /> Persona Física
            <span className="ml-1 text-xs text-gray-400 font-normal">
              ({programa.camposPreviewFisica?.length} campos)
            </span>
          </button>
          <button
            onClick={() => setTab('juridica')}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px
              ${tab === 'juridica'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'}`}
          >
            <Building2 size={14} /> Persona Jurídica
            <span className="ml-1 text-xs text-gray-400 font-normal">
              ({programa.camposPreviewJuridica?.length} campos)
            </span>
          </button>
        </div>
      </div>

      {/* ── Contenido scrolleable ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">

          {/* Banner aviso */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Formulario en vista previa</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Los campos están deshabilitados. Este formulario estará disponible cuando se abra la convocatoria de <strong>{programa.title}</strong>.
              </p>
            </div>
          </div>

          {/* Secciones de campos */}
          {secciones.map(([seccion, camposSeccion]) => (
            <div key={seccion}>
              {/* Encabezado de sección */}
              <div className="flex items-center gap-2 mb-4">
                <ChevronRight size={14} className="text-orange-500 flex-shrink-0" />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{seccion}</h3>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Grid de campos */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                {camposSeccion.map((campo, i) => (
                  <CampoPreview key={i} campo={campo} />
                ))}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">
              Este formulario estará disponible cuando se abra la convocatoria · Agencia Calidad San Juan
            </p>
            <button
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={14} /> Cerrar vista previa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { X, Mail, FileText, Shield, MapPin } from 'lucide-react'
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
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-3 tracking-tight">SAVEAN</h1>
        <p className="text-lg sm:text-2xl italic text-white/90 mb-8 font-medium">
          Sanidad Vegetal y Animal de San Juan
        </p>
        <p className="text-white/80 text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Sistema de control fitozoosanitario que protege la producción agrícola de la provincia
          mediante la fiscalización en puestos de barrera estratégicos.
        </p>
        <button
          onClick={onClickEmitir}
          className="inline-flex items-center gap-3 bg-white text-orange-600 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl hover:bg-orange-50 transition-colors text-base sm:text-lg shadow-lg"
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

      {/* Servicios */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 border-l-4 border-orange-500 pl-4">
          Nuestros Servicios
        </h3>
        <p className="text-gray-500 text-sm mb-6 pl-5">
          SAVEAN ofrece dos servicios principales para el registro y control del tránsito de productos.
        </p>

        <div className="space-y-6">

          {/* Guía de Origen */}
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-0.5">Servicio 01</p>
                <h4 className="text-lg font-bold text-gray-900">Guía de Origen</h4>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600 leading-relaxed text-sm">
                La <strong>Guía de Origen</strong> es una declaración jurada mediante la cual se registra la salida de productos
                de origen vegetal desde la provincia de San Juan hacia otros destinos del país. En ella se consignan datos
                relacionados con el producto transportado, su procedencia y la cantidad de kilogramos que se trasladan.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Su finalidad es principalmente <strong>estadística e informativa</strong>, ya que permite al Estado provincial
                contar con información confiable sobre los volúmenes y tipos de productos que egresan de la provincia.
                Estos datos constituyen una herramienta fundamental para la planificación y el diseño de políticas públicas
                vinculadas al sector agropecuario y agroindustrial.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                A partir de la información recopilada, el Gobierno puede analizar tendencias productivas y comerciales,
                evaluar la evolución de las distintas cadenas productivas y generar herramientas de apoyo al sector,
                como programas de financiamiento, asistencia técnica, promoción comercial o políticas de desarrollo productivo.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-5 py-4">
                <p className="text-sm text-orange-800 leading-relaxed">
                  <strong>Importante:</strong> La Guía de Origen no tiene carácter tributario ni fiscal. No se encuentra
                  vinculada a organismos de recaudación ni implica el pago de aranceles o tasas, siendo un trámite
                  completamente gratuito. Su objetivo es exclusivamente brindar información para una mejor planificación
                  estratégica basada en datos reales de la producción provincial.
                </p>
              </div>
            </div>
          </div>

          {/* SVIS */}
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-0.5">Servicio 02</p>
                <h4 className="text-lg font-bold text-gray-900">Servicio de Inspección Veterinaria (SVIS)</h4>
              </div>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-600 leading-relaxed text-sm">
                El <strong>Servicio Veterinario de Inspección Sanitaria</strong> actúa como autoridad de aplicación en
                sanidad animal, alimentos y fiscalización, aplicando normativas nacionales como la Ley Federal de Carnes.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Todo producto y subproducto de origen animal y sus derivados debe ingresar al territorio de la provincia
                con una serie de documentación que avale su origen, con las características de la especie, temperatura
                y acondicionamiento.
              </p>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-3">Habilitaciones y control de:</p>
                <ul className="space-y-2">
                  {[
                    'Plantas de Faenas (Mataderos)',
                    'Cámaras frigoríficas',
                    'Fábricas de productos y subproductos de origen animal dentro de la provincia',
                    'Movilidades térmicas para el transporte de los productos y subproductos',
                    'Trozaderos, despostaderos, graserías, triperías, etc.',
                    'Depósitos de huevos',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Punto de Control */}
              <div className="mt-4 bg-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Punto de Control</p>
                    <p className="text-white font-semibold text-sm">Calle 11 y Punta del Monte — Rawson</p>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    El Punto de Control de carnes de la Provincia de San Juan pertenece al{' '}
                    <span className="text-white font-medium">
                      «Sistema Integrado para el control y fiscalización de la introducción de productos y subproductos
                      derivados de origen animal»
                    </span>
                    . En esta oficina, con equipamiento para controles exhaustivos, se fiscaliza la calidad e inocuidad
                    agroalimentaria con el objetivo de co-garantizar la salud de los consumidores.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Se controla la cantidad y calidad de las carnes y sus derivados contemplados por la{' '}
                    <span className="text-orange-400 font-medium">Ley Federal de Carnes N° 22.375</span> y{' '}
                    <span className="text-orange-400 font-medium">Ley Provincial N° 256-J</span>, cuya competencia
                    recae en el SVIS de la Dirección de Sanidad Vegetal Animal y Alimentos (DSVAyA). El sistema
                    contempla software y conectividad para registrar el ingreso de camiones en los límites de la
                    provincia: Encón, San Carlos, Bermejo y Vallecito.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">Productos controlados</p>
                      <ul className="space-y-1.5">
                        {[
                          'Carnes refrigeradas al gancho (bovinos, porcinos, ovinos, caprinos, aves, conejo, nutria, caza mayor y menor) en cortes refrigerados o congelados',
                          'Tripas, mondongos y menudencias',
                          'Productos avícolas: carne y huevos',
                          'Productos de la pesca: pescados, crustáceos, moluscos, batracios, reptiles y mamíferos de especies comestibles',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">Subproductos de origen animal</p>
                      <ul className="space-y-1.5">
                        {[
                          'Salazones: bondiola, jamón cocido/crudo, panceta, patitas y lomos de cerdo salados, etc.',
                          'Embutidos frescos: chorizo fresco, longaniza parrillera, salchicha fresca, etc.',
                          'Embutidos secos: chorizo a la española, longaniza, salame, salamines, etc.',
                          'Embutidos cocidos: morcilla, mortadela, salchicha tipo Frankfurt o Viena, salchichón, etc.',
                          'Chacinados no embutidos: arrollado criollo, lechón arrollado, matambre, queso de cerdo, hamburguesa, milanesa, etc.',
                          'Harina de carne, grasa, sebo, sangre, cuero, cerda, pluma, etc.',
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                            <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stats + ¿Cómo funciona? + Puestos de control — bloque unificado */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          {[
            { value: '8', label: 'Puestos de control activos' },
            { value: '24/7', label: 'Fiscalización continua' },
            { value: '20 días', label: 'Validez de cada guía' },
          ].map(({ value, label }) => (
            <div key={label} className="px-6 py-7 text-center">
              <p className="text-3xl font-extrabold text-orange-500 mb-1">{value}</p>
              <p className="text-gray-500 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* ¿Cómo funciona? */}
        <div className="px-6 sm:px-8 py-8 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Proceso</p>
          <h3 className="text-xl font-bold text-gray-900 mb-6">¿Cómo funciona?</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '1', color: '#ea580c', title: 'Completá la guía', desc: 'Ingresá los datos de remitente, destinatario, mercadería y transporte en el formulario digital.' },
              { step: '2', color: '#f97316', title: 'Recibí tu QR', desc: 'Se genera un código QR único y un PDF descargable con toda la información de tu guía.' },
              { step: '3', color: '#eab308', title: 'Presentá en barrera', desc: 'Al llegar al puesto de control, mostrá el QR al inspector para la verificación rápida.' },
              { step: '✓', color: '#16a34a', title: 'Guía verificada', desc: 'El inspector registra la verificación y tu mercadería queda habilitada para circular.' },
            ].map(({ step, color, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-5 text-center">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-3"
                  style={{ backgroundColor: color }}
                >
                  {step}
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1.5">{title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Puestos de control */}
        <div className="px-6 sm:px-8 py-8">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Red provincial</p>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Puestos de control</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { nombre: 'Barreal', detalle: 'Ruta N°149, Km 111', zona: 'Calingasta' },
              { nombre: 'Encon', detalle: 'Ruta N°20, Km 470', zona: '25 de mayo' },
              { nombre: 'Encon Sur', detalle: 'Ruta N°142, Km 112', zona: '25 de mayo' },
              { nombre: 'Huaco', detalle: 'Ruta N°40', zona: 'Jachal' },
              { nombre: 'Los Baldecitos', detalle: 'Ruta N°150', zona: 'Valle fértil' },
              { nombre: 'San Carlos', detalle: 'Ruta N°40, Km 3379', zona: 'Sarmiento' },
              { nombre: 'Vallecito', detalle: 'Ruta N°141, Km 180', zona: 'Caucete' },
              { nombre: 'Villa Calingasta', detalle: 'Ruta N°12, Km 151', zona: 'Calingasta' },
            ].map(({ nombre, detalle, zona }) => (
              <div key={nombre} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{nombre}</p>
                  <p className="text-xs text-gray-500">{detalle} — {zona}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CTA final */}
      <div className="bg-gray-800 rounded-2xl p-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">¿Necesitás emitir una Guía de Origen?</h3>
        <p className="text-gray-400 mb-8">Completá el formulario digital y obtené tu código QR al instante.</p>
        <button
          onClick={onClickEmitir}
          className="inline-flex items-center gap-3 bg-orange-500 text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl hover:bg-orange-600 transition-colors text-base"
        >
          Completar Guía de Origen →
        </button>
      </div>

      {/* Formulario de consultas SAVEAN */}
      <ConsultaSavean />
    </div>
  )
}

function ConsultaSavean() {
  const [form, setForm] = useState({ nombre: '', email: '', consulta: '' })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('Consulta SAVEAN desde la web')
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nEmail: ${form.email}\n\nConsulta:\n${form.consulta}`
    )
    window.location.href = `mailto:savean@calidadsj.com.ar?subject=${subject}&body=${body}`
    setEnviado(true)
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 sm:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Mail size={20} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">¿Tenés una consulta sobre SAVEAN?</h3>
        </div>
        <p className="text-gray-600 mb-8 ml-13">
          Completá el formulario y te respondemos a la brevedad.
        </p>

        {enviado ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-gray-700 font-semibold">¡Consulta enviada!</p>
            <p className="text-gray-500 text-sm mt-1">Revisá tu cliente de correo para completar el envío.</p>
            <button
              onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', consulta: '' }) }}
              className="mt-4 text-orange-600 text-sm hover:underline"
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text" name="nombre" required value={form.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                             focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email" name="email" required value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                             focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu consulta *</label>
              <textarea
                name="consulta" required rows={4} value={form.consulta}
                onChange={handleChange}
                placeholder="Escribí tu consulta sobre SAVEAN..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           focus:ring-2 focus:ring-orange-300 focus:border-orange-500 outline-none resize-none bg-white"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white
                           font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                <Mail size={18} />
                Enviar consulta
              </button>
              <p className="text-xs text-gray-400">Se abrirá tu cliente de correo para enviar.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

import { FileText, Shield, Award } from 'lucide-react'
import QuienesSomos from '../components/QuienesSomos'
import MisionVisionValores from '../components/MisionVisionValores'
import SectionHeader from '../components/ui/SectionHeader'

export default function Nosotros() {
  return (
    <main className="pt-[72px]">
      <QuienesSomos />
      <MisionVisionValores />
      <CodigoEtica />
      <PoliticaCalidad />
    </main>
  )
}

function CodigoEtica() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Encabezado e ícono */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield size={28} className="text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
                  Documento Institucional
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">Código de Ética</h2>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              El Código de Ética de la Agencia de Calidad San Juan establece los principios y
              valores que guían la conducta de todos los integrantes de la organización en el
              ejercicio de sus funciones. Su cumplimiento es obligatorio para todo el personal
              y refleja nuestro compromiso con la transparencia, la integridad y el servicio público.
            </p>

            <div className="space-y-4">
              {[
                { titulo: 'Integridad', desc: 'Actuamos con honestidad y coherencia entre nuestros valores y acciones.' },
                { titulo: 'Transparencia', desc: 'Mantenemos una gestión abierta y accesible a la ciudadanía.' },
                { titulo: 'Responsabilidad', desc: 'Asumimos las consecuencias de nuestras decisiones y actuaciones.' },
                { titulo: 'Respeto', desc: 'Valoramos la dignidad de las personas y el bien común.' },
                { titulo: 'Excelencia', desc: 'Buscamos la mejora continua en la calidad de nuestro trabajo.' },
              ].map(({ titulo, desc }) => (
                <div key={titulo} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800">{titulo}: </span>
                    <span className="text-gray-600 text-sm">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documento / PDF */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
              <FileText size={36} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Documento completo</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Descargá el Código de Ética completo de la Agencia de Calidad San Juan en formato PDF.
            </p>

            {/* ── REEMPLAZAR href con la ruta real al PDF una vez subido ── */}
            <a
              href="/documentos/codigo-etica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                         text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <FileText size={18} />
              Descargar PDF
            </a>

            <p className="text-xs text-gray-400 mt-4">
              Colocar el archivo en{' '}
              <code className="bg-gray-200 px-1 rounded">public/documentos/codigo-etica.pdf</code>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PoliticaCalidad() {
  return (
    <section className="py-20 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Documento / PDF */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center order-2 lg:order-1">
            <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
              <Award size={36} className="text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Documento completo</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Descargá la Política de Calidad completa de la Agencia de Calidad San Juan en formato PDF.
            </p>

            {/* ── REEMPLAZAR href con la ruta real al PDF una vez subido ── */}
            <a
              href="/documentos/politica-calidad.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                         text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <FileText size={18} />
              Descargar PDF
            </a>

            <p className="text-xs text-gray-400 mt-4">
              Colocar el archivo en{' '}
              <code className="bg-gray-200 px-1 rounded">public/documentos/politica-calidad.pdf</code>
            </p>
          </div>

          {/* Encabezado e ícono */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Award size={28} className="text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase text-orange-500">
                  Documento Institucional
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900">Política de Calidad</h2>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">
              La Política de Calidad de la Agencia expresa nuestro compromiso con la mejora continua
              de los procesos, la satisfacción de los ciudadanos y el sector productivo, y el
              cumplimiento de los requisitos legales y normativos que nos rigen.
            </p>

            <div className="space-y-4">
              {[
                { titulo: 'Mejora continua', desc: 'Revisamos y optimizamos permanentemente nuestros procesos.' },
                { titulo: 'Orientación al ciudadano', desc: 'Centramos nuestros servicios en las necesidades del sector productivo.' },
                { titulo: 'Cumplimiento normativo', desc: 'Garantizamos el cumplimiento de todos los requisitos legales vigentes.' },
                { titulo: 'Gestión por resultados', desc: 'Medimos el impacto de nuestra gestión con indicadores concretos.' },
              ].map(({ titulo, desc }) => (
                <div key={titulo} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-800">{titulo}: </span>
                    <span className="text-gray-600 text-sm">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

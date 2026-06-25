import { Link } from 'react-router-dom'
import Programas from '../components/Programas'
import SectionHeader from '../components/ui/SectionHeader'
import { ArrowRight } from 'lucide-react'

export default function ProgramasPage() {
  return (
    <main className="pt-[72px]">
      <Programas />

      {/* Cómo solicitar */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="¿Cómo solicitar?"
            subtitle="Proceso simple para acceder a nuestros programas"
            centered
          />

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Elegí un programa</h3>
              <p className="text-gray-600">Revisá los programas disponibles y elegí el que se adapte a tus necesidades</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Ingresá al portal</h3>
              <p className="text-gray-600">Accedé al Portal de Créditos y completá el formulario de solicitud</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Recibí seguimiento</h3>
              <p className="text-gray-600">Te enviaremos actualizaciones sobre el estado de tu solicitud</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/portal-creditos"
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3
                         rounded-lg font-semibold hover:bg-orange-700 transition-colors text-base"
            >
              Ir al Portal de Créditos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

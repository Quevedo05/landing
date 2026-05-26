import { useState } from 'react'
import Programas from '../components/Programas'
import FormularioDinamico from '../components/FormularioDinamico'
import SectionHeader from '../components/ui/SectionHeader'

export default function ProgramasPage() {
  const [formularioActivo, setFormularioActivo] = useState(null)

  return (
    <main className="pt-[72px]">
      <Programas onProgramaClick={setFormularioActivo} />

      {/* Sección de información adicional */}
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
              <h3 className="font-bold text-lg text-gray-900 mb-2">Selecciona un programa</h3>
              <p className="text-gray-600">Elige el programa que se adapte a tus necesidades</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Completa el formulario</h3>
              <p className="text-gray-600">Proporciona tus datos y detalles de tu solicitud</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Recibe seguimiento</h3>
              <p className="text-gray-600">Te enviaremos actualizaciones de tu solicitud</p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario dinámico modal */}
      {formularioActivo && (
        <FormularioDinamico
          formularioId={formularioActivo.formularioId}
          programa={formularioActivo.programa}
          title={formularioActivo.title}
          onClose={() => setFormularioActivo(null)}
        />
      )}
    </main>
  )
}

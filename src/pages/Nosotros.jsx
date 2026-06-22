import { FileText, Shield, Award } from 'lucide-react'
import QuienesSomos from '../components/QuienesSomos'
import MisionVisionValores from '../components/MisionVisionValores'

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
  const principios = [
    {
      titulo: 'Igualdad',
      desc: 'Actuar de manera honesta, transparente y confiable en todo momento.',
    },
    {
      titulo: 'Fraternidad',
      desc: 'Tratar a los demás con cortesía y consideración, sin discriminación.',
    },
    {
      titulo: 'Libertad y Responsabilidad',
      desc: 'Cumplir con diligencia las obligaciones de cada puesto/rol de trabajo y asumir las consecuencias de nuestras acciones.',
    },
    {
      titulo: 'Excelencia',
      desc: 'Desempeñar nuestras funciones con la máxima calidad y profesionalismo.',
    },
  ]

  const pautas = [
    'Tratar a los compañeros, clientes y proveedores con respeto y profesionalismo.',
    'Proteger y usar adecuadamente los bienes y recursos de la organización.',
    'Mantener la confidencialidad de la información a la que se tenga acceso.',
    'Cumplir con las leyes, reglamentos y políticas de la organización.',
    'Evitar conflictos de intereses y manifestar cualquier situación que pueda generar un conflicto.',
    'Manifestar cualquier acto ilegal, antiético o que vaya en contra de este código.',
  ]

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado de sección */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Documento Institucional · PO-02
          </p>
          <h2 className="text-3xl font-bold text-gray-900">Código de Ética</h2>
          <div className="w-12 h-0.5 bg-primary mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Columna izquierda — contenido */}
          <div className="space-y-8">
            {/* Propósito */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Propósito</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Este código de ética tiene como objetivo establecer los principios y estándares
                de conducta que deben guiar el comportamiento de todos los miembros de la Agencia
                en el desempeño de sus funciones.
              </p>
            </div>

            {/* Principios éticos */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Principios Éticos Fundamentales</h3>
              <div className="space-y-3">
                {principios.map(({ titulo, desc }) => (
                  <div key={titulo} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-800">{titulo}: </span>
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pautas de conducta */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Pautas de Conducta</h3>
              <div className="space-y-2">
                {pautas.map((p) => (
                  <div key={p} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compromiso */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h3 className="text-base font-bold text-gray-900 mb-2">Compromiso</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Todos los miembros de la ACSJ deben comprometerse a cumplir con este código de
                ética y a promover una cultura de integridad y excelencia. El incumplimiento de
                este código puede conllevar medidas disciplinarias.
              </p>
            </div>
          </div>

          {/* Columna derecha — descarga */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center lg:sticky lg:top-28">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
              <Shield size={30} className="text-primary" />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              PO-02 · v.1 · 01/06/2024
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Código de Ética</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Agencia Calidad San Juan S.E.M.
            </p>
            <a
              href="/documentos/codigo-etica.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600
                         text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm w-full justify-center"
            >
              <FileText size={16} />
              Descargar PDF
            </a>
            <p className="text-xs text-gray-400 mt-4">
              Cualquier consulta dirigirse a Presidencia.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

function PoliticaCalidad() {
  const objetivos = [
    'Facilitar la articulación del sector privado en la definición e implementación de herramientas promotoras de la competitividad.',
    'Fomentar la cultura emprendedora, el espíritu empresarial y la competencia a través del apoyo a las PyMEs y a los emprendedores.',
    'Facilitar y promover el acceso de las PYMEs radicadas en la Provincia de San Juan, a los diversos programas de desarrollo, fortalecimiento, financiamiento y capacitación que instrumente el Estado Nacional o Provincial.',
    'Coordinar y/o administrar institucionalmente programas de desarrollo, fortalecimiento, financiamiento y capacitación para las empresas y sus trabajadores, mejorando su capacidad y calidad productiva.',
    'Impulsar procesos de innovación tecnológica y mejora continua de las cadenas productivas de San Juan.',
  ]

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado de sección */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Documento Institucional · PO-01 · Rev. 2 · 18/12/2024
          </p>
          <h2 className="text-3xl font-bold text-gray-900">Política de Calidad</h2>
          <div className="w-12 h-0.5 bg-primary mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Columna izquierda — descarga */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center lg:sticky lg:top-28 order-2 lg:order-1">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-5">
              <Award size={30} className="text-primary" />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
              PO-01 · Rev. 2 · ISO 9001
            </p>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Política de Calidad</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Agencia Calidad San Juan S.E.M.
            </p>
            <a
              href="/documentos/politica-calidad.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600
                         text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm w-full justify-center"
            >
              <FileText size={16} />
              Descargar PDF
            </a>
            <p className="text-xs text-gray-400 mt-4">
              Sistema de Gestión de Calidad · Normas ISO 9001
            </p>
          </div>

          {/* Columna derecha — contenido */}
          <div className="space-y-8 order-1 lg:order-2">

            {/* Descripción */}
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                AGENCIA CALIDAD SAN JUAN (ACSJ) es una sociedad de economía mixta fundada en el
                año 2007, conformada por un sector público y cámaras empresarias, cuyo objetivo es
                promover la competitividad de las empresas radicadas en la Provincia de San Juan y
                de los eslabonamientos productivos a los cuales pertenecen, con el propósito de
                asegurar el éxito comercial de San Juan fomentando el desarrollo técnico y económico.
              </p>
            </div>

            {/* Objetivos */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-4">Objetivos de la ACSJ</h3>
              <div className="space-y-3">
                {objetivos.map((o, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">{o}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compromiso ISO */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                La ACSJ se compromete a implementar, mantener y mejorar continuamente un{' '}
                <span className="font-semibold text-gray-800">
                  Sistema de Gestión de Calidad basado en las normas ISO 9001
                </span>
                , con el fin de satisfacer las necesidades de los clientes y partes interesadas,
                asegurando el cumplimiento de los requisitos legales y de gestión.
              </p>
            </div>

            {/* Misión / Visión / Filosofía / Valores */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  titulo: 'Misión',
                  texto:
                    'Coordinar, orientar y contribuir con las PyMEs y emprendedores de la provincia a través de la articulación privada, facilitando el entramado productivo y el desarrollo de sus cadenas de valor.',
                },
                {
                  titulo: 'Visión',
                  texto:
                    'Ser una de las agencias guía del sector, fomentando el crecimiento y sustentabilidad para emprendedores y PyMEs de la provincia, creando valor y desarrollo económico, social y laboral.',
                },
                {
                  titulo: 'Filosofía',
                  texto:
                    'Trabajo sinérgico · Transparencia · Eficiencia · Creatividad e Innovación · Crecimiento sostenido',
                },
                {
                  titulo: 'Valores',
                  texto:
                    'Integridad · Cultura del compromiso · Eficiencia · Excelencia · Transparencia · Cercanía · Confianza',
                },
              ].map(({ titulo, texto }) => (
                <div key={titulo} className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{titulo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{texto}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

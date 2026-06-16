import { useState } from 'react'
import Hero from '../components/Hero'
import QuienesSomos from '../components/QuienesSomos'
import MisionVisionValores from '../components/MisionVisionValores'
import Programas from '../components/Programas'
import FormularioDinamico from '../components/FormularioDinamico'

export default function Home() {
  const [formularioActivo, setFormularioActivo] = useState(null)

  return (
    <main>
      <Hero />
      <QuienesSomos />
      <MisionVisionValores />
      <Programas onProgramaClick={setFormularioActivo} />

      {/* Formulario dinámico modal */}
      {formularioActivo && (
        <FormularioDinamico
          formularioId={formularioActivo.formularioId}
          programa={formularioActivo.programa}
          title={formularioActivo.title}
          campos={formularioActivo.campos || []}
          onClose={() => setFormularioActivo(null)}
        />
      )}
    </main>
  )
}

import { useState } from 'react'
import Hero from '../components/Hero'
import QuienesSomos from '../components/QuienesSomos'
import MisionVisionValores from '../components/MisionVisionValores'
import Programas from '../components/Programas'
import LogrosSection from '../components/LogrosSection'
import CalendarioEventos from '../components/CalendarioEventos'
import CamarasSocias from '../components/CamarasSocias'
import RelevamientoEmprende from '../components/RelevamientoEmprende'
import FormularioDinamico from '../components/FormularioDinamico'
import SelectorTipoPersona from '../components/SelectorTipoPersona'

export default function Home() {
  const [formularioActivo, setFormularioActivo] = useState(null)
  const [selectorBienes, setSelectorBienes] = useState(null)

  const handleProgramaClick = (data) => {
    if (data.esBienesCapital) {
      setSelectorBienes(data)
    } else {
      setFormularioActivo(data)
    }
  }

  const handleTipoSeleccionado = (form) => {
    setSelectorBienes(null)
    setFormularioActivo({
      formularioId: form.formularioId,
      programa: form.programa,
      title: form.programa,
      campos: form.campos || [],
    })
  }

  return (
    <main>
      <Hero />
      <QuienesSomos />
      <MisionVisionValores />
      <Programas onProgramaClick={handleProgramaClick} />

      {/* Logros y cosas hechas */}
      <LogrosSection />

      {/* Relevamiento Emprendedor */}
      <RelevamientoEmprende />

      {/* Calendario de eventos */}
      <CalendarioEventos />

      {/* Carta de presentación - Cámaras Socias */}
      <CamarasSocias />

      {/* Selector persona física/jurídica para Bienes de Capital */}
      {selectorBienes && (
        <SelectorTipoPersona
          fisica={selectorBienes.fisica}
          juridica={selectorBienes.juridica}
          onSelect={handleTipoSeleccionado}
          onClose={() => setSelectorBienes(null)}
        />
      )}

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

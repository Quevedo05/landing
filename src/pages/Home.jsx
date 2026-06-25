import Hero from '../components/Hero'
import QuienesSomos from '../components/QuienesSomos'
import MisionVisionValores from '../components/MisionVisionValores'
import LogrosSection from '../components/LogrosSection'
import CalendarioEventos from '../components/CalendarioEventos'
import RelevamientoEmprende from '../components/RelevamientoEmprende'
import CamarasSocias from '../components/CamarasSocias'

export default function Home() {
  return (
    <main>
      <Hero />
      <QuienesSomos />
      <MisionVisionValores />
      <LogrosSection />
      <RelevamientoEmprende />
      <CalendarioEventos />
      <CamarasSocias />
    </main>
  )
}

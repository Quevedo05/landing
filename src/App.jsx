import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Programas from './pages/Programas'
import Savean from './pages/Savean'
import Contacto from './pages/Contacto'
import PortalCreditos from './pages/PortalCreditos'

export default function App() {
  return (
    <Router>
      <Navbar activeSection={null} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/programas" element={<Programas />} />
        <Route path="/savean" element={<Savean />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/portal-creditos" element={<PortalCreditos />} />
      </Routes>
      <Footer />
    </Router>
  )
}

import { Link } from 'react-router-dom'
import { navLinks } from '../data/navLinks'
import { contactInfo } from '../data/contacto'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              <span className="text-primary">Agencia</span> Calidad San Juan
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Organismo provincial dedicado a orientar, capacitar y contribuir
              técnica y financieramente con las PyMEs y emprendedores de San Juan.
            </p>
            <div className="flex gap-4 mt-6">
              <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center
                           hover:bg-primary transition-colors text-white font-bold text-xs">
                f
              </a>
              <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center
                           hover:bg-primary transition-colors text-white font-bold text-xs">
                ig
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>{contactInfo.address}</li>
              {contactInfo.phones.map((p) => <li key={p}>{p}</li>)}
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </li>
              <li>Horario: {contactInfo.hours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row
                        justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} Agencia de Calidad San Juan. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 text-gray-500">
            <span>San Juan Gobierno</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

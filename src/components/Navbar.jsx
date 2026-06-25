import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { navLinks } from '../data/navLinks'

export default function Navbar({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md'
          : 'bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center flex-shrink-0 md:-ml-28">
            <img
              src="/logo-navbar.png"
              alt="Agencia Calidad San Juan"
              className={`h-16 w-auto transition-all duration-500 ${!scrolled ? 'brightness-0 invert' : ''}`}
            />
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex justify-center">
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={`relative text-sm font-medium transition-colors duration-300
                    after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0
                    after:transition-all after:duration-300 hover:after:w-full
                    ${scrolled
                      ? 'text-gray-600 hover:text-primary after:bg-primary'
                      : 'text-white/90 hover:text-white after:bg-white'
                    }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA + hamburguesa */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <Link
            to="/portal-creditos"
            className={`hidden md:inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-300
              ${scrolled
                ? 'bg-primary text-white hover:bg-orange-600 shadow-sm'
                : 'bg-white/20 text-white border border-white/40 hover:bg-white/30 backdrop-blur-sm'
              }`}
          >
            Portal de Créditos
          </Link>
          <button
            className={`md:hidden p-2 transition-colors ${scrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-white/70'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 px-4 overflow-hidden transition-all duration-300
          ${menuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0'}`}
      >
        <div className="space-y-3">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 font-medium py-2 hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/portal-creditos"
            onClick={() => setMenuOpen(false)}
            className="btn-primary block text-center mt-2"
          >
            Portal de Créditos
          </Link>
        </div>
      </div>
    </header>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ExternalLink } from 'lucide-react'
import { navLinks } from '../data/navLinks'

export default function Navbar({ activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200
      ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center flex-shrink-0 -ml-28">
            <img src="/logo-navbar.png" alt="Agencia Calidad San Juan" className="h-16 w-auto" />
          </Link>
        </div>

        {/* Nav Center */}
        <div className="flex-1 flex justify-center">
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className="text-sm font-medium transition-colors hover:text-primary text-gray-600"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button Right */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <Link
            to="/portal-creditos"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            Portal de Créditos
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 font-medium py-2 hover:text-primary"
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
      )}
    </header>
  )
}

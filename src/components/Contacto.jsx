import { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { contactInfo } from '../data/contacto'
import SectionHeader from './ui/SectionHeader'

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '', telefono: '', email: '', asunto: '', consulta: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(form.asunto || 'Consulta desde la web')
    const body = encodeURIComponent(
      `Nombre: ${form.nombre}\nTeléfono: ${form.telefono}\nEmail: ${form.email}\n\n${form.consulta}`
    )
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Contacto"
          subtitle="Estamos disponibles para orientarte y responder tus consultas."
          centered
        />

        <div className="grid lg:grid-cols-2 gap-12 mt-12">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" name="nombre" required value={form.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                             focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="tel" name="telefono" value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                             focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" required value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
              <input type="text" name="asunto" required value={form.asunto}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consulta *</label>
              <textarea name="consulta" required rows={5} value={form.consulta}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              Enviar Consulta
            </button>
            <p className="text-xs text-gray-400 text-center">
              Al enviar se abrirá tu cliente de correo electrónico.
            </p>
          </form>

          {/* Contact Info */}
          <div className="space-y-8">
            {/* Oficina card */}
            <div className="flex items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#1a3a6b] shadow-md">
                  <img src="/oficina.jpeg" alt="Oficina Agencia Calidad San Juan"
                    className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#1a3a6b] text-white text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap uppercase tracking-wide">
                  San Juan
                </div>
              </div>
              <div>
                <p className="font-bold text-[#1a3a6b] text-base mb-2">Oficina Agencia Calidad San Juan</p>
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Teléfonos</p>
                {contactInfo.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\D/g,'')}`}
                    className="block text-gray-600 hover:text-primary transition-colors">{p}</a>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <a href={`mailto:${contactInfo.email}`}
                  className="text-gray-600 hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Horario de atención</p>
                <p className="text-gray-600">{contactInfo.hours}</p>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="rounded-xl overflow-hidden border border-gray-200 h-48">
              <iframe
                title="Ubicación Agencia Calidad San Juan"
                src="https://maps.google.com/maps?q=25+de+Mayo+Esq+517+San+Juan+Argentina&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

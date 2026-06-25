import { Link } from 'react-router-dom'
import { programas } from '../data/programas'
import { CreditCard, Star, Sun, ArrowRight } from 'lucide-react'
import SectionHeader from './ui/SectionHeader'
import Card from './ui/Card'

const iconMap = { CreditCard, Star, Sun }

export default function Programas() {
  return (
    <section id="programas" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestros Programas"
          subtitle="Herramientas de apoyo diseñadas para potenciar el desarrollo productivo provincial."
          centered
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {programas.map((p) => {
            const Icon = iconMap[p.icon] || Star
            return (
              <Card key={p.id} className="flex flex-col p-8 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon size={24} className="text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-1">{p.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/portal-creditos"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3
                       rounded-lg font-semibold hover:bg-orange-700 transition-colors text-base"
          >
            Solicitar en el Portal de Créditos <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

import { Target, Eye, Shield } from 'lucide-react'
import Card from './ui/Card'
import SectionHeader from './ui/SectionHeader'

const items = [
  {
    icon: Target,
    title: 'Misión',
    text: 'Gestionar, orientar y contribuir con las PyMEs y emprendedores de la provincia, fomentando su desarrollo sustentable y competitividad.',
  },
  {
    icon: Eye,
    title: 'Visión',
    text: 'Ser una de las agencias guía del sector productivo, fomentando el crecimiento, la calidad y la sustentabilidad de las empresas sanjuaninas.',
  },
  {
    icon: Shield,
    title: 'Valores',
    text: 'Integridad · Eficiencia · Excelencia · Transparencia · Confianza',
  },
]

export default function MisionVisionValores() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Nuestra Identidad"
          centered
        />
        <div className="grid sm:grid-cols-3 gap-8 mt-12">
          {items.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="text-center p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center
                              justify-center mx-auto mb-6">
                <Icon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function SectionHeader({ title, subtitle, centered = false }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <div className={`section-divider ${centered ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

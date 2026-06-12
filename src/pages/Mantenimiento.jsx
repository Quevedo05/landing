export default function Mantenimiento() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <img
          src="/unnamed.jpg"
          alt="Agencia Calidad San Juan"
          className="w-40 mx-auto mb-8 rounded-xl shadow"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Sitio en mantenimiento
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          Estamos realizando mejoras para brindarte una mejor experiencia.
          <br />
          <span className="font-semibold text-primary">Pronto volvemos.</span>
        </p>
        <p className="text-sm text-gray-400">
          Agencia Calidad San Juan — Ministerio de Producción, Trabajo e Innovación
        </p>
      </div>
    </div>
  )
}

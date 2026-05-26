import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

export default function SaveanQRPDF({ guia }) {
  const qrRef = useRef()
  const pdfRef = useRef()

  const downloadQR = () => {
    const element = qrRef.current
    const canvas = element.querySelector('canvas')
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `SAVEAN_QR_${guia.numero}.png`
    link.click()
  }

  const downloadPDF = async () => {
    const element = pdfRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('l', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Add 4 copies
    for (let i = 0; i < 4; i++) {
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
    }

    pdf.save(`SAVEAN_${guia.numero}.pdf`)
  }

  const totalKilos = guia.mercaderias.reduce((sum, m) => sum + (parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0), 0)

  return (
    <div className="space-y-8">
      {/* Confirmation Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-2">¡Guía Emitida Exitosamente!</h2>
        <p className="text-green-800 mb-4">Número de Guía: <span className="font-bold text-lg">{guia.numero}</span></p>
        <p className="text-green-700">La guía es válida por <span className="font-bold">20 días</span> desde su emisión</p>
      </div>

      {/* QR Code */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Código QR Verificable</h3>
          <div className="flex justify-center bg-gray-50 p-8 rounded-lg" ref={qrRef}>
            <QRCodeSVG
              value={`https://savean.agenciacalidadsanjuan.com.ar/verificar/${guia.token}`}
              size={256}
              level="H"
              includeMargin
            />
          </div>
          <button
            onClick={downloadQR}
            className="mt-6 w-full btn-primary bg-primary text-white flex items-center justify-center gap-2 py-3"
          >
            <Download size={20} /> Descargar QR
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Resumen de la Guía</h3>
          <div className="space-y-4 text-sm">
            <div className="border-b pb-4">
              <p className="text-gray-600">Número de Guía</p>
              <p className="font-bold text-gray-900">{guia.numero}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Remitente</p>
              <p className="font-bold text-gray-900">{guia.remitente.nombre}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Destinatario</p>
              <p className="font-bold text-gray-900">{guia.destinatario.nombre}</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Total Mercadería</p>
              <p className="font-bold text-gray-900">{totalKilos} kg</p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">Emitida</p>
              <p className="font-bold text-gray-900">{new Date(guia.fecha_emision).toLocaleDateString('es-AR')}</p>
            </div>
            <div>
              <p className="text-gray-600">Estado</p>
              <p className="font-bold text-green-600">Pendiente de Verificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview and Download */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Documento PDF (4 Copias)</h3>

        <div ref={pdfRef} className="bg-gray-50 p-8 rounded-lg overflow-auto max-h-96 mb-6">
          <div className="bg-white p-8 space-y-6 text-xs">
            {/* This is a preview of one copy */}
            <div>
              <div className="text-center border-b-2 pb-4 mb-6">
                <p className="font-bold text-lg">GUÍA DE ORIGEN DIGITAL SAVEAN</p>
                <p className="text-gray-600 text-xs">Sistema de Apoyo a la Verificación y Emisión de Avales Nacionales</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-gray-600 font-bold text-xs">REMITENTE</p>
                  <p className="font-bold">{guia.remitente.nombre}</p>
                  <p className="text-gray-600">Tipo: {guia.remitente.tipo}</p>
                  {guia.remitente.renspa && <p className="text-gray-600">RENSPA: {guia.remitente.renspa}</p>}
                </div>
                <div>
                  <p className="text-gray-600 font-bold text-xs">DESTINATARIO</p>
                  <p className="font-bold">{guia.destinatario.nombre}</p>
                  {guia.destinatario.tipoDestino === 'externo' ? (
                    <>
                      <p className="text-gray-600">País: {guia.destinatario.pais}</p>
                      <p className="text-gray-600">Punto Salida: {guia.destinatario.puntoSalida}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">Provincia: {guia.destinatario.provincia}</p>
                      <p className="text-gray-600">Mercado: {guia.destinatario.mercadoInterno}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="border-b-2 pb-4 mb-6">
                <p className="text-gray-600 font-bold text-xs mb-3">MERCADERÍA</p>
                <div className="space-y-2">
                  {guia.mercaderias.map((m, i) => (
                    <div key={i} className="text-gray-800">
                      <p>
                        <span className="font-bold">{m.especie}</span>
                        {m.variedad && ` - ${m.variedad}`}
                        {m.grado && ` (${m.grado})`}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {m.cantidad} bultos × {m.kilos} kg = {(parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0)} kg
                      </p>
                    </div>
                  ))}
                  <p className="font-bold text-gray-900 pt-2">Total: {totalKilos} kg</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-gray-600 font-bold text-xs mb-2">TRANSPORTE</p>
                  <p className="text-gray-800">{guia.transporte.empresa}</p>
                  <p className="text-gray-600 text-xs">Conductor: {guia.transporte.conductor}</p>
                  <p className="text-gray-600 text-xs">
                    {guia.transporte.camionPatente} {guia.transporte.acopladoPatente && `/ ${guia.transporte.acopladoPatente}`}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-gray-600 font-bold text-xs mb-2">CÓDIGO QR</p>
                  <QRCodeSVG value={`https://savean.agenciacalidadsanjuan.com.ar/verificar/${guia.token}`} size={80} level="H" />
                </div>
              </div>

              <div className="border-t-2 pt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-600 text-xs">Nº Guía:</p>
                    <p className="font-bold">{guia.numero}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Emitida:</p>
                    <p className="font-bold text-xs">{new Date(guia.fecha_emision).toLocaleDateString('es-AR')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Válida por:</p>
                    <p className="font-bold">20 días</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-xs h-12 border border-gray-300 flex items-center justify-center">
                    Firma / Sello Barrera Fitozoosanitaria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="w-full btn-primary bg-primary text-white flex items-center justify-center gap-2 py-3"
        >
          <Download size={20} /> Descargar PDF (4 Copias)
        </button>
      </div>

      {/* Additional Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Información Importante</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ La guía está generada y lista para imprimir</li>
          <li>✓ Imprime todas las 4 copias del PDF</li>
          <li>✓ Distribuye las copias según protocolo SAVEAN</li>
          <li>✓ El código QR puede ser escaneado en cualquier barrera fitozoosanitaria</li>
          <li>✓ La guía se vencerá automáticamente en 20 días</li>
          <li>✓ Se enviará confirmación al email: {guia.contacto.email}</li>
        </ul>
      </div>
    </div>
  )
}

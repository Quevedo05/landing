import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'

const td = {
  border: '1px solid #000',
  padding: '3px 5px',
  fontSize: '9px',
  verticalAlign: 'middle',
}

const th = {
  border: '1px solid #000',
  padding: '4px 5px',
  fontSize: '9px',
  backgroundColor: '#e8e8e8',
  fontWeight: 'bold',
  textAlign: 'center',
}

export default function SaveanQRPDF({ guia }) {
  const pdfRef = useRef()

  const totalBultos = guia.mercaderias.reduce((s, m) => s + (parseInt(m.cantidad) || 0), 0)
  const totalKilos = guia.mercaderias.reduce(
    (s, m) => s + (parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0),
    0
  )
  const verificationUrl = `https://sistema.agenciacalidadsanjuan.com.ar/?verificar=${guia.token}`

  const destinoLabel = guia.destinatario.tipoDestino === 'externo' ? 'Externo' : 'Interno'
  const destinoPais =
    guia.destinatario.tipoDestino === 'externo' ? guia.destinatario.pais : 'Argentina'
  const destinoPunto =
    guia.destinatario.tipoDestino === 'externo'
      ? guia.destinatario.puntoSalida
      : guia.destinatario.provincia

  const downloadPDF = async () => {
    const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('l', 'mm', 'a4')
    const w = pdf.internal.pageSize.getWidth()
    const h = pdf.internal.pageSize.getHeight()
    for (let i = 0; i < 4; i++) {
      if (i > 0) pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
    }
    pdf.save(`SAVEAN_${guia.numero}.pdf`)
  }

  return (
    <div className="space-y-6">
      {/* Confirmación */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold text-green-900 mb-2">¡Guía Emitida Exitosamente!</h2>
        <p className="text-green-800 mb-1">
          Número: <strong>{guia.numero}</strong>
        </p>
        <p className="text-green-700 text-sm">
          {guia.fechaVencimiento
            ? <>Vence el <strong>{new Date(guia.fechaVencimiento).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></>
            : <>Válida por <strong>20 días</strong> desde su emisión</>
          }
        </p>
      </div>

      {/* Documento PDF */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">Vista previa del documento</h3>

        <div className="overflow-auto border border-gray-200 rounded-lg mb-4 max-h-[520px]">
          {/* ───── DOCUMENTO (capturado por html2canvas) ───── */}
          <div
            ref={pdfRef}
            style={{
              background: 'white',
              padding: '20px 24px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#000',
              fontSize: '10px',
              lineHeight: '1.4',
              minWidth: '720px',
            }}
          >
            {/* Título */}
            <div
              style={{
                textAlign: 'center',
                borderBottom: '2px solid #000',
                paddingBottom: '8px',
                marginBottom: '8px',
              }}
            >
              <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 2px 0' }}>
                GUÍA DE ORIGEN - SAVEAN SAN JUAN
              </p>
              <p style={{ fontSize: '9px', margin: 0, color: '#444' }}>
                Programa de Control Fitozoosanitario - Declaración Jurada - Ley N° 1887-I
              </p>
            </div>

            {/* Número / Estado / Validez */}
            <div
              style={{
                border: '1.5px solid #000',
                padding: '5px 12px',
                marginBottom: '10px',
                textAlign: 'center',
              }}
            >
              <strong style={{ fontSize: '11px' }}>
                N° {guia.numero}&nbsp;&nbsp;|&nbsp;&nbsp;Estado: EMITIDA&nbsp;&nbsp;|&nbsp;&nbsp;Válido
                por 20 días
              </strong>
            </div>

            {/* Remitente / Destinatario */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', border: '1px solid #000', padding: '5px 7px', verticalAlign: 'top' }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '10px' }}>
                      REMITENTE DE LA MERCADERÍA
                    </p>
                    <p style={{ margin: '2px 0' }}>Nombre/Razón Social: {guia.remitente.nombre}</p>
                    <p style={{ margin: '2px 0' }}>
                      RENSPA N°: {guia.remitente.renspa || ''}&nbsp;&nbsp;&nbsp;&nbsp;INV N°:
                    </p>
                    <p style={{ margin: '2px 0' }}>Tipo de Remitente: {guia.remitente.tipo}</p>
                  </td>
                  <td style={{ width: '50%', border: '1px solid #000', padding: '5px 7px', verticalAlign: 'top' }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '10px' }}>
                      DESTINATARIO DE LA MERCADERÍA
                    </p>
                    <p style={{ margin: '2px 0' }}>Nombre/Razón Social: {guia.destinatario.nombre}</p>
                    <p style={{ margin: '2px 0' }}>
                      INV N°:&nbsp;&nbsp;&nbsp;&nbsp;Tipo de Destino: {destinoLabel}
                    </p>
                    <p style={{ margin: '2px 0' }}>
                      País: {destinoPais}&nbsp;&nbsp;&nbsp;&nbsp;Punto Salida: {destinoPunto}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tabla mercadería */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
              <thead>
                <tr>
                  {[
                    'Viñedo N°',
                    'Lugar Empaque',
                    'Especie',
                    'Variedad',
                    'Grado',
                    'Tamaño',
                    'Tipo Envase',
                    'Bultos',
                    'Kg/Bulto',
                    'Total Kg',
                  ].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guia.mercaderias.map((m, i) => (
                  <tr key={i}>
                    <td style={td}></td>
                    <td style={td}></td>
                    <td style={td}>{m.especie}</td>
                    <td style={td}>{m.variedad}</td>
                    <td style={td}>{m.grado}</td>
                    <td style={td}>{m.tamaño}</td>
                    <td style={td}>{m.envase}</td>
                    <td style={{ ...td, textAlign: 'center' }}>{m.cantidad}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {parseFloat(m.kilos || 0).toFixed(2)}
                    </td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {((parseFloat(m.cantidad) || 0) * (parseFloat(m.kilos) || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      ...td,
                      textAlign: 'right',
                      fontWeight: 'bold',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    TOTALES:&nbsp;&nbsp;Bultos: {totalBultos}&nbsp;&nbsp;&nbsp;&nbsp;Kg:{' '}
                    {totalKilos.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Transporte */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
              <tbody>
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      border: '1px solid #000',
                      padding: '3px 7px',
                      fontWeight: 'bold',
                      backgroundColor: '#e8e8e8',
                      fontSize: '10px',
                    }}
                  >
                    TRANSPORTE
                  </td>
                </tr>
                <tr>
                  <td style={td}>Empresa: {guia.transporte.empresa}</td>
                  <td style={td}>Transportista: {guia.transporte.conductor}</td>
                  <td style={td}>Tipo: {guia.transporte.tipo}</td>
                  <td style={td}>Precintos N°: {guia.transporte.precintos}</td>
                </tr>
                <tr>
                  <td style={td}>Camión Marca: {guia.transporte.camionMarca}</td>
                  <td style={td}>Patente: {guia.transporte.camionPatente}</td>
                  <td style={td}>Acoplado Marca: {guia.transporte.acopladoMarca}</td>
                  <td style={td}>Patente: {guia.transporte.acopladoPatente}</td>
                </tr>
              </tbody>
            </table>

            {/* QR */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '10px' }}>
                CÓDIGO QR DE VERIFICACIÓN
              </p>
              <QRCodeSVG value={verificationUrl} size={100} level="H" includeMargin />
            </div>

            {/* Firmas */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '18px 10px 10px', width: '50%' }}>
                    Sello Puesto de Barrera: ___________________________
                  </td>
                  <td style={{ border: '1px solid #000', padding: '18px 10px 10px', width: '50%' }}>
                    Firma y Aclaración Barrerista: ______________________
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '18px 10px 10px' }}>
                    San Juan: ____/____/________
                  </td>
                  <td style={{ border: '1px solid #000', padding: '18px 10px 10px' }}>
                    Firma y Aclaración Responsable: _____________________
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '7px', color: '#888' }}>
              Powered by SAVEAN - Agencia Calidad San Juan
            </div>
          </div>
        </div>

        <button
          onClick={downloadPDF}
          className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <Download size={20} /> Descargar PDF (4 Copias)
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-base font-bold text-blue-900 mb-3">Información Importante</h3>
        <ul className="space-y-1.5 text-sm text-blue-800">
          <li>✓ Imprimí las 4 copias del PDF y distribuílas según protocolo SAVEAN</li>
          <li>✓ El código QR puede escanearse en cualquier barrera fitozoosanitaria</li>
          <li>✓ La guía vence automáticamente a los 20 días</li>
          <li>✓ Confirmación enviada a: {guia.contacto.email}</li>
        </ul>
      </div>
    </div>
  )
}

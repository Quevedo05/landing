export const programas = [
  {
    id: 1,
    icon: 'CreditCard',
    title: 'Microcréditos Emprendedores',
    description: 'Para emprendedores en estadío de iniciación, ejecución o crecimiento.',
    monto: '$3.000.000',
    tasa: '50% BADLAR',
    extra: 'Sin gastos de otorgamiento',
    link: null,
    detalles: [
      {
        titulo: 'BENEFICIARIOS ELEGIBLES',
        texto: 'Se encuentren en alguno de los siguientes estadíos:',
        subitems: [
          'Estadío de iniciación-ejecución: Aquellos emprendimientos que se encuentren o no registrados ante ARCA, puedan demostrar la existencia del mismo o presenten un proyecto con factibilidad económica.',
          'Estadío de Crecimiento: Aquellos emprendimientos que se encuentren registrados ante ARCA, en la actividad relacionada con el proyecto que postula.',
        ],
      },
      {
        titulo: 'MONTO A FINANCIAR',
        texto: 'Hasta $3.000.000,00 (si el beneficiario se encuentra registrado ante ARCA, caso contrario podrá acceder hasta $1.500.000) por beneficiario. Crédito depositado a la cuenta de los proveedores que el beneficiario presente (hasta 4).',
      },
      {
        titulo: 'COMPONENTES FINANCIABLES',
        subitems: [
          'Adquisición de activos fijos, maquinarias y/o partes de maquinarias y equipamientos.',
          'Adquisición de insumos, equipamiento, dispositivos tecnológicos, materias primas destinados al proyecto.',
          'Contratación de servicios específicos, NO servicios operativos.',
        ],
      },
      {
        titulo: 'TASA DE INTERÉS APLICABLE',
        texto: '50% de la tasa BADLAR.',
      },
      {
        titulo: 'GARANTÍA',
        texto: 'Cheque de pago diferido propio o de terceros.',
      },
      {
        titulo: 'PLAZO DE DEVOLUCIÓN',
        texto: '3 meses de gracia + 15 meses de devolución (18 meses en total).',
      },
      {
        titulo: 'INFORMACIÓN DEL CHEQUE',
        texto: 'Una vez aprobado el crédito, se comunicará al beneficiario, quien deberá entregar en guarda a la Agencia el cheque de pago diferido (presentado en la solicitud), por un monto equivalente al cincuenta por ciento (50%) del monto aprobado, más los intereses correspondientes, calculados a una tasa equivalente al cincuenta por ciento (50%) de la Tasa BADLAR.',
      },
      {
        titulo: 'TRANSFERENCIA DEL MONTO APROBADO',
        texto: 'Los montos correspondientes a los créditos aprobados serán transferidos a la/s cuenta/s de los proveedores seleccionados por el beneficiario, de conformidad con los presupuestos presentados y aprobados en el marco del crédito otorgado.',
      },
      {
        titulo: 'PLAZO PARA PRESENTAR VERIFICABLES',
        texto: 'El beneficiario tendrá un plazo máximo de DOS (2) meses, contados a partir del desembolso del crédito, para presentar la documentación que permita acreditar la correcta aplicación de los fondos conforme al destino aprobado, bajo apercibimiento de exigirse el reembolso de los fondos otorgados. A tal efecto, deberá presentar los siguientes verificables:',
        subitems: [
          'Nota de presentación de verificables, firmada por el emprendedor, conforme al modelo establecido por el programa.',
          'Facturas por la compra de los bienes y/o contratación de los servicios, emitidas por los respectivos proveedores, de conformidad con los presupuestos aprobados.',
          'Registro fotográfico de los bienes adquiridos, que permita acreditar su efectiva incorporación al emprendimiento, cuando corresponda.',
          'Informe firmado por el profesional interviniente, en caso de corresponder, que detalle el servicio llevado a cabo, el impacto que dicho servicio genera en el emprendimiento y el plazo de ejecución, el cual no podrá exceder los DOS (2) meses previstos para el período de ejecución.',
          'Cualquier otro verificable que permita acreditar la ejecución de las actividades aprobadas y la correcta aplicación de los fondos.',
        ],
      },
      {
        titulo: 'DOCUMENTACIÓN NECESARIA A PRESENTAR',
        subitems: [
          'Completar la solicitud on line.',
          'Copia del DNI frente y dorso; si es persona física; Persona jurídica: contrato o estatuto social, poder de representación del representante legal y copia del D.N.I del representante.',
          'Inscripción en ARCA - con actividad acorde al proyecto que postula (en caso de corresponder).',
          'Garantía: Cheque de pago diferido.',
          'Fotos: mínimo tres (3) fotografías que permitan identificar y conocer el emprendimiento, acreditando su existencia y/o viabilidad.',
          'Proveedor: Presupuesto + Constancia de ARCA (con actividades acorde al bien/servicio que presupuesta) + Constancia de CBU.',
          'La Agencia realizará la consulta del informe VERAZ del solicitante y del garante, quienes deberán encontrarse en Situación 1 para acceder al financiamiento.',
          'No tener créditos vigentes en ACSJ.',
          'Si el beneficiario no se encuentra inscripto en ARCA, deberá presentar una Declaración Jurada comprometiéndose a realizar la inscripción dentro del plazo de tres (3) meses de aprobada la solicitud del crédito.',
        ],
      },
      {
        nota: 'Sólo podrá presentarse UN (1) único proyecto por solicitante.',
      },
    ],
  },
  {
    id: 2,
    icon: 'Star',
    title: 'Bienes de Capital',
    description: 'Para personas físicas o jurídicas (Microempresas) de San Juan que necesiten adquirir bienes de capital.',
    monto: '$10.000.000',
    tasa: '50% BADLAR',
    extra: null,
    link: null,
    esBienesCapital: true,
  },
  {
    id: 3,
    icon: 'Sun',
    title: 'Potenciar Emprendedores',
    description: 'Para nuevos emprendedores y emprendimientos en ejecución o crecimiento.',
    monto: '$4.000.000',
    tasa: '40% BADLAR',
    extra: 'Primer llamado: cierra el 30/06/2026',
    link: null,
    detalles: [
      {
        titulo: 'BENEFICIARIOS ELEGIBLES',
        texto: 'Nuevos emprendedores y aquellos emprendimientos que ya se encuentren en ejecución o en etapa de crecimiento, debiendo encontrarse inscriptos en ARCA en una actividad vinculada al proyecto presentado, independientemente de su antigüedad. Se priorizarán aquellos emprendimientos que generen un triple impacto, promoviendo valor económico, social y ambiental.',
      },
      {
        titulo: 'MONTO A FINANCIAR',
        texto: 'Hasta $4.000.000,00. Crédito depositado a la cuenta del beneficiario.',
      },
      {
        titulo: 'COMPONENTES FINANCIABLES',
        subitems: [
          'Adquisición de activos fijos, maquinarias y/o partes de maquinarias y equipamientos.',
          'Adquisición de insumos, equipamiento, dispositivos tecnológicos, materias primas destinados al proyecto.',
        ],
      },
      {
        titulo: 'TASA DE INTERÉS APLICABLE',
        texto: '40% de la tasa BADLAR.',
      },
      {
        titulo: 'GARANTÍA',
        texto: 'Cheque de pago diferido propio o de terceros.',
      },
      {
        titulo: 'PLAZO DE DEVOLUCIÓN',
        texto: '2 meses de gracia + 10 meses de devolución (12 meses en total).',
      },
      {
        titulo: 'MODALIDAD',
        texto: 'Se efectuarán convocatorias para la presentación de solicitudes de la línea "Potenciar Emprendedores".',
      },
      {
        titulo: 'INFORMACIÓN DEL CHEQUE',
        texto: 'Una vez aprobado el crédito, se comunicará al beneficiario, quien deberá entregar en guarda a la Agencia el cheque de pago diferido (presentado en la solicitud), por un monto equivalente al cincuenta por ciento (50%) del monto aprobado, más los intereses correspondientes, calculados a una tasa equivalente al cuarenta por ciento (40%) de la Tasa BADLAR.',
      },
      {
        titulo: 'TRANSFERENCIA DEL MONTO APROBADO',
        texto: 'Los montos correspondientes a los créditos aprobados serán transferidos a la cuenta del beneficiario, de conformidad con los presupuestos presentados y aprobados en el marco del crédito otorgado.',
      },
      {
        titulo: 'PLAZO PARA PRESENTAR VERIFICABLES',
        texto: 'El beneficiario tendrá un plazo máximo de DOS (2) meses, contados a partir del desembolso del crédito, para presentar la documentación que permita acreditar la correcta aplicación de los fondos conforme al destino aprobado, bajo apercibimiento de exigirse el reembolso de los fondos otorgados. A tal efecto, deberá presentar los siguientes verificables:',
        subitems: [
          'Nota de presentación de verificables, firmada por el emprendedor, conforme al modelo establecido por el programa.',
          'Factura de los bienes adquiridos, correspondiente al destino aprobado del crédito.',
          'Registro fotográfico de los bienes adquiridos, que permita acreditar su incorporación al proyecto y su correspondencia con los componentes financiables.',
          'Cualquier otro verificable que permita acreditar la ejecución de las actividades aprobadas y la correcta aplicación de los fondos.',
        ],
      },
      {
        titulo: 'DOCUMENTACIÓN NECESARIA A PRESENTAR',
        subitems: [
          'Completar la solicitud on line.',
          'Copia del D.N.I. frente y dorso si es persona física; Persona jurídica: contrato o estatuto social, poder de representación del representante legal y copia del D.N.I del representante.',
          'Inscripción en ARCA (con actividad acorde al proyecto que postula).',
          'Certificado Mi PYME vigente, categoría permitida micro empresas.',
          'Garantía: Cheque de pago diferido.',
          'Fotos: mínimo tres (3) fotografías que permitan identificar y conocer el emprendimiento, acreditando su existencia.',
          'Constancia de CBU beneficiario.',
          'Proveedor: Presupuesto + Constancia de ARCA (con actividades acorde al bien/servicio que presupuesta).',
          'La Agencia realizará la consulta del informe VERAZ del solicitante y del garante, quienes deberán encontrarse en Situación 1 para acceder al financiamiento.',
          'No tener créditos vigentes en ACSJ.',
        ],
      },
      {
        nota: 'Sólo podrá presentarse UN (1) único proyecto por solicitante.',
      },
    ],
  },
]

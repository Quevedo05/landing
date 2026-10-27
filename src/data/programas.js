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
    id: 4,
    icon: 'Mountain',
    title: 'Desarrollo Minero',
    description: 'Para pequeños productores, comerciantes e industriales mineros con registro vigente, destinado a adquisición de bienes de capital y capital de trabajo.',
    monto: '$30.000.000',
    tasa: '50% BADLAR',
    extra: 'Registro Minero Vigente requerido',
    link: null,
    proximamente: true,
    tieneVariantesFisicaJuridica: true,
    camposPreviewFisica: [
      // Datos de contacto y ubicación
      { label: 'Teléfono Móvil', tipo: 'texto', placeholder: 'Ej: 2645000000', requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Domicilio Real', tipo: 'texto', placeholder: 'Calle, número, barrio', requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Departamento donde desarrolla la actividad minera', tipo: 'selector', opciones: ['IGLESIA', 'CALINGASTA', 'VALLE FÉRTIL', 'JÁCHAL', 'SARMIENTO', 'ANGACO'], requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Tipo de actividad minera', tipo: 'selector', opciones: ['Productor Minero', 'Comerciante Minero', 'Industrial Minero'], requerido: true, seccion: 'Datos de contacto y ubicación' },
      // Descripción del proyecto
      { label: 'Descripción del proyecto minero', tipo: 'textarea', placeholder: 'Describa la actividad minera, los minerales a extraer o comercializar, y el destino de los fondos solicitados', requerido: true, seccion: 'Descripción del proyecto' },
      { label: 'Destino de fondos', tipo: 'texto', placeholder: 'Ej: Compra de maquinaria de extracción, capital de trabajo para insumos', requerido: true, seccion: 'Descripción del proyecto' },
      // Documentación del solicitante
      { label: 'Foto Frente DNI', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Foto Dorso DNI', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Acreditación de domicilio real (factura de servicios, contrato de alquiler, comodato, etc.)', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Constancia de inscripción en ARCA', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Constancia Dirección General de Rentas San Juan (si corresponde)', tipo: 'archivo', requerido: false, seccion: 'Documentación del solicitante' },
      { label: 'Certificado vigente de inscripción en el Registro de Productores, Comerciantes e Industriales Mineros (Ministerio de Minería de San Juan)', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      // Proveedores — Tramo 70%
      { label: 'Presupuesto Formal Proveedor 1 (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 2 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 3 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 4 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Constancia de inscripción en ARCA del proveedor (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Constancia de CBU del proveedor (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      // Tramo 30%
      { label: 'Presupuesto para Tramo 30% (capital de trabajo / gastos directos)', tipo: 'archivo', requerido: false, seccion: 'Tramo 30% — Desembolso al beneficiario' },
      { label: 'Constancia CBU de la cuenta bancaria del beneficiario (Tramo 30%)', tipo: 'archivo', requerido: true, seccion: 'Tramo 30% — Desembolso al beneficiario' },
      // Garantía
      { label: 'Garantía — Copia del Cheque de Pago Diferido', tipo: 'archivo', requerido: true, seccion: 'Garantía' },
    ],
    camposPreviewJuridica: [
      // Datos de contacto y ubicación
      { label: 'Teléfono Móvil', tipo: 'texto', placeholder: 'Ej: 2645000000', requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Domicilio Real', tipo: 'texto', placeholder: 'Calle, número, barrio', requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Departamento donde desarrolla la actividad minera', tipo: 'selector', opciones: ['IGLESIA', 'CALINGASTA', 'VALLE FÉRTIL', 'JÁCHAL', 'SARMIENTO', 'ANGACO'], requerido: true, seccion: 'Datos de contacto y ubicación' },
      { label: 'Tipo de actividad minera', tipo: 'selector', opciones: ['Productor Minero', 'Comerciante Minero', 'Industrial Minero'], requerido: true, seccion: 'Datos de contacto y ubicación' },
      // Descripción del proyecto
      { label: 'Descripción del proyecto minero', tipo: 'textarea', placeholder: 'Describa la actividad minera, los minerales a extraer o comercializar, y el destino de los fondos solicitados', requerido: true, seccion: 'Descripción del proyecto' },
      { label: 'Destino de fondos', tipo: 'texto', placeholder: 'Ej: Adquisición de maquinaria de extracción, capital de trabajo para insumos', requerido: true, seccion: 'Descripción del proyecto' },
      // Documentación del solicitante (Persona Jurídica)
      { label: 'Foto Frente DNI del representante legal', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Foto Dorso DNI del representante legal', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Acreditación de domicilio real (factura de servicios, contrato de alquiler, comodato, etc.)', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Constancia de inscripción en ARCA', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Constancia Dirección General de Rentas San Juan (si corresponde)', tipo: 'archivo', requerido: false, seccion: 'Documentación del solicitante' },
      { label: 'Certificado vigente de inscripción en el Registro de Productores, Comerciantes e Industriales Mineros (Ministerio de Minería de San Juan)', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Estatuto Social o Contrato Constitutivo con sus modificaciones', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Acta de designación de autoridades vigente (con objeto acorde a la actividad minera)', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      { label: 'Constancia de inscripción en el Registro Público de Comercio', tipo: 'archivo', requerido: true, seccion: 'Documentación del solicitante' },
      // Proveedores — Tramo 70%
      { label: 'Presupuesto Formal Proveedor 1 (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 2 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 3 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Presupuesto Formal Proveedor 4 (Tramo 70%)', tipo: 'archivo', requerido: false, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Constancia de inscripción en ARCA del proveedor (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      { label: 'Constancia de CBU del proveedor (Tramo 70%)', tipo: 'archivo', requerido: true, seccion: 'Documentación de proveedores — Tramo 70%' },
      // Tramo 30%
      { label: 'Presupuesto para Tramo 30% (capital de trabajo / gastos directos)', tipo: 'archivo', requerido: false, seccion: 'Tramo 30% — Desembolso al beneficiario' },
      { label: 'Constancia CBU de la cuenta bancaria del beneficiario (Tramo 30%)', tipo: 'archivo', requerido: true, seccion: 'Tramo 30% — Desembolso al beneficiario' },
      // Garantía
      { label: 'Garantía — Copia del Cheque de Pago Diferido', tipo: 'archivo', requerido: true, seccion: 'Garantía' },
    ],
    detalles: [
      {
        titulo: 'BENEFICIARIOS ELEGIBLES',
        subitems: [
          'Personas humanas o personas jurídicas consideradas pequeños productores, comerciantes e industriales mineros.',
          'Deben contar con Inscripción y Registro Minero Vigente en el Registro de Productores, Comerciantes e Industriales Mineros del Ministerio de Minería de San Juan.',
          'Desarrollar su actividad minera o poseer proyectos en los departamentos de Iglesia, Calingasta, Valle Fértil, Jáchal, Sarmiento y Angaco.',
          'En el caso de Personas Jurídicas: el objeto social debe ajustarse a la actividad minera del proyecto e ingresar inscripto en el Registro Público de Comercio.',
        ],
      },
      {
        titulo: 'MONTO A FINANCIAR',
        texto: 'Hasta $30.000.000,00 por beneficiario.',
      },
      {
        titulo: 'COMPONENTES FINANCIABLES',
        subitems: [
          'Adquisición de maquinaria, herramientas y equipos directamente relacionados con la ejecución del proyecto.',
          'Adquisición de insumos necesarios para la producción y ejecución del proyecto minero.',
          'Capital de trabajo aplicable directamente a gastos vinculados al proyecto minero aprobado.',
        ],
      },
      {
        titulo: 'TASA DE INTERÉS APLICABLE',
        texto: '50% de la Tasa BADLAR.',
      },
      {
        titulo: 'GARANTÍA',
        subitems: [
          'Cheque de pago diferido propio o de terceros.',
          'Cheque físico: fotografía clara del cheque en blanco con sus datos identificatorios.',
          'Echeq: captura de pantalla de la simulación con razón social o nombre/apellido del librador y CUIT.',
          'Requisitos del Librador/Garante: deben figurar en "Situación Normal" (Categoría 1) en la Central de Deudores del BCRA y en el registro de cheques rechazados.',
          'Una vez aprobado el crédito, el cheque deberá entregarse en guarda a la Agencia por el 50% del monto aprobado más intereses (50% Tasa BADLAR).',
        ],
      },
      {
        titulo: 'PLAZO DE DEVOLUCIÓN',
        texto: '3 meses de gracia + 33 meses de devolución (36 meses en total).',
      },
      {
        titulo: 'DESEMBOLSO / TRANSFERENCIA DEL MONTO APROBADO',
        subitems: [
          'Hasta el 70% del crédito: Transferencia directa a la/s cuenta/s bancaria/s del/los proveedor/es designados (hasta 4 proveedores).',
          'Hasta el 30% restante: Transferencia a la cuenta bancaria del beneficiario para atender gastos directos vinculados al proyecto.',
        ],
      },
      {
        titulo: 'PLAZO DE EJECUCIÓN',
        texto: '60 días corridos desde la fecha de efectivización de la transferencia para realizar las inversiones previstas.',
      },
      {
        titulo: 'PLAZO PARA PRESENTAR VERIFICABLES',
        texto: 'Máximo 60 días corridos desde la recepción de la transferencia. Documentación a presentar:',
        subitems: [
          'Factura de venta comercial emitida en debida forma por los proveedores.',
          'Informe detallado del servicio prestado en caso de prestaciones técnicas, consultorías o asistencias profesionales.',
          'El incumplimiento en el plazo o destino de los fondos habilita el reintegro inmediato del total adelantado y la ejecución de garantías.',
        ],
      },
      {
        titulo: 'DOCUMENTACIÓN DEL SOLICITANTE',
        subitems: [
          'Copia de DNI (frente y dorso), teléfono y correo electrónico.',
          'Acreditación de domicilio real (factura de servicios, contrato de alquiler, comodato, etc.).',
          'Constancia de Inscripción en ARCA y Dirección General de Rentas de San Juan (en caso de corresponder).',
          'Certificado vigente de inscripción en el Registro de Productores, Comerciantes e Industriales Mineros del Ministerio de Minería de San Juan.',
          'Personas Jurídicas: Contrato constitutivo / Estatuto social con modificaciones, acta de designación de autoridades vigente con objeto acorde a la actividad minera, e inscripción en el Registro Público de Comercio.',
        ],
      },
      {
        titulo: 'DOCUMENTACIÓN DE LOS PROVEEDORES (hasta 4)',
        subitems: [
          'Presupuesto formal emitido a nombre del beneficiario con detalle de bienes y/o servicios a adquirir.',
          'Constancia de inscripción en ARCA del proveedor con actividad acorde a los bienes/servicios presupuestados.',
          'Constancia de CBU de la cuenta bancaria del proveedor (para el tramo del 70%).',
          'Para el tramo del 30% al beneficiario: presupuesto formal + constancia ARCA del proveedor + CBU del beneficiario.',
        ],
      },
      {
        titulo: 'OTRAS CONDICIONES',
        subitems: [
          'Todos los gastos de sellados, certificaciones, informes, tasaciones, tasas o impuestos quedan a exclusivo cargo del solicitante.',
          'No podrán acceder personas condenadas por delitos dolosos, inhabilitadas, inhibidas, concursadas o fallidas.',
          'No podrán acceder quienes registren incumplimientos vigentes en créditos anteriores con la Agencia Calidad San Juan.',
          'No podrán acceder personas que no se encuentren en "Situación Normal" (Categoría 1) en la Central de Deudores del BCRA.',
        ],
      },
      {
        nota: 'Sólo podrá presentarse UN (1) único proyecto por solicitante.',
      },
    ],
  },
  {
    id: 3,
    icon: 'Sun',
    title: 'Potenciar Emprendedores',
    description: 'Para nuevos emprendedores y emprendimientos en ejecución o crecimiento.',
    monto: '$4.000.000',
    tasa: '40% BADLAR',
    extra: null,
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

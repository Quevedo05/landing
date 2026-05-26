<?php
/**
 * Plugin Name: SAVEAN - Guia de Origen Digital
 * Plugin URI:  https://agenciacalidadsanjuan.com.ar
 * Description: Sistema digital de Guias de Origen para el programa SAVEAN de la Agencia Calidad San Juan.
 * Version:     1.1.0
 * Author:      Desarrollo Web
 * Requires PHP: 5.6
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Genera una URL del sitio forzando HTTPS, para evitar mixed content.
 */
function savean_url( $path = '' ) {
	return set_url_scheme( home_url( $path ), 'https' );
}

// Forzar HTTPS en el favicon/site icon de WordPress para evitar mixed content
add_filter('get_site_icon_url', function($url, $size, $blog_id) {
	return $url ? set_url_scheme($url, 'https') : $url;
}, 10, 3);

// Iniciar sesión temprano para garantizar disponibilidad en shortcodes
add_action('init', function() {
	if (!session_id() && !headers_sent()) {
		session_start();
	}
}, 1);

// Cargar librerías compatibles con PHP 5.6
require_once dirname( __FILE__ ) . '/libs/phpqrcode/qrlib.php';
require_once dirname( __FILE__ ) . '/libs/tcpdf/tcpdf.php';

// Crear tablas al activar el plugin
register_activation_hook( __FILE__, 'savean_crear_tablas' );

// Actualizar BD automáticamente cuando se cambia el código del plugin
add_action( 'plugins_loaded', 'savean_maybe_update_bd' );

function savean_maybe_update_bd() {
    if ( get_option( 'savean_db_version' ) !== '1.1.1' ) {
        savean_crear_tablas();
        update_option( 'savean_db_version', '1.1.1' );
    }
}

function savean_crear_tablas() {
    global $wpdb;
    $charset = $wpdb->get_charset_collate();
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    dbDelta( "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}savean_guias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero VARCHAR(20) NOT NULL,
        token VARCHAR(64) NOT NULL,
        estado ENUM('pendiente','verificada','vencida','denegada') DEFAULT 'pendiente',
        fecha_emision DATETIME NOT NULL,
        fecha_verificacion DATETIME NULL,
        barrera_id INT NULL,
        inspector VARCHAR(100) NULL,
        remitente_nombre VARCHAR(200),
        remitente_renspa VARCHAR(50),
        remitente_inv VARCHAR(50),
        remitente_tipo VARCHAR(50),
        destinatario_nombre VARCHAR(200),
        destino_tipo VARCHAR(20),
        destino_pais VARCHAR(100),
        destino_punto_salida VARCHAR(100),
        destino_mercado_interno VARCHAR(50),
        destino_provincia VARCHAR(100),
        transporte_empresa VARCHAR(200),
        transporte_conductor VARCHAR(200),
        transporte_tipo VARCHAR(50),
        transporte_camion_marca VARCHAR(100),
        transporte_camion_patente VARCHAR(20),
        transporte_acoplado_marca VARCHAR(100),
        transporte_acoplado_patente VARCHAR(20),
        transporte_precintos VARCHAR(200),
        pago_comprobante VARCHAR(100),
        pago_banco VARCHAR(100),
        pago_sucursal VARCHAR(100),
        pago_fecha DATE NULL,
        motivo_denegacion VARCHAR(500) NULL,
        email_contacto VARCHAR(200) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) $charset;" );

    dbDelta( "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}savean_guias_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guia_id INT NOT NULL,
        vinedo_numero VARCHAR(50),
        lugar_empaque VARCHAR(200),
        especie VARCHAR(100),
        variedad VARCHAR(100),
        grado_seleccion VARCHAR(100),
        tamano VARCHAR(100),
        subproducto VARCHAR(100),
        tipo_envase VARCHAR(100),
        cantidad_bultos INT,
        kilos_por_bulto DECIMAL(10,2),
        total_kilos DECIMAL(10,2)
    ) $charset;" );

    dbDelta( "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}savean_catalogos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        codigo VARCHAR(20),
        valor VARCHAR(200) NOT NULL,
        padre_id INT NULL,
        orden INT DEFAULT 0
    ) $charset;" );

    dbDelta( "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}savean_barreras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(200) NOT NULL,
        ruta VARCHAR(50),
        kilometro VARCHAR(20),
        departamento VARCHAR(100),
        latitud DECIMAL(10,7),
        longitud DECIMAL(10,7),
        activa TINYINT(1) DEFAULT 1
    ) $charset;" );
}

// Shortcode de la landing SAVEAN
add_shortcode( 'savean_landing', 'savean_render_landing' );

function savean_render_landing() {
    ob_start();
    $url_guia = savean_url('/guia-de-origen/');
    ?>
    <div id="savean-landing">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">

    <!-- HERO -->
    <div class="savean-hero">
        <div class="savean-hero-circle-1"></div>
        <div class="savean-hero-circle-2"></div>
        <div class="savean-hero-inner">
            <span class="savean-badge-top">Programa Provincial</span>
            <h1 class="savean-hero-title">SAVEAN</h1>
            <p class="savean-hero-subtitle">Sanidad Vegetal y Animal de San Juan</p>
            <p class="savean-hero-desc">Sistema de control fitozoosanitario que protege la producción agrícola de la provincia mediante la fiscalización en puestos de barrera estratégicos.</p>
            <a href="<?php echo esc_url($url_guia); ?>" class="savean-btn-white">Completar Guía de Origen →</a>
        </div>
    </div>

    <!-- ¿QUÉ ES SAVEAN? -->
    <div class="savean-section">
        <div class="savean-section-header">
            <div class="savean-accent-bar"></div>
            <h2>¿Qué es SAVEAN?</h2>
        </div>
        <p class="savean-text">El <strong>Servicio de Sanidad Vegetal y Animal</strong> (SAVEAN) es el programa de la Agencia Calidad San Juan encargado de la fiscalización fitozoosanitaria en la provincia. Operamos bajo la <strong>Ley N° 1887-I</strong>, controlando el tránsito de mercadería vegetal y animal para prevenir el ingreso y dispersión de plagas como la <em>Lobesia Botrana</em> (Polilla de la Vid) y <em>Ceratitis Capitata</em> (Mosca de los Frutos).</p>
        <div class="savean-stats">
            <div class="savean-stat" style="border-left-color: #EC6608;">
                <div class="savean-stat-num" style="color: #EC6608;">8</div>
                <div class="savean-stat-label">Puestos de control activos</div>
            </div>
            <div class="savean-stat" style="border-left-color: #FF9A1D;">
                <div class="savean-stat-num" style="color: #FF9A1D;">24/7</div>
                <div class="savean-stat-label">Fiscalización continua</div>
            </div>
            <div class="savean-stat" style="border-left-color: #FDC21F;">
                <div class="savean-stat-num" style="color: #d4a017;">20 días</div>
                <div class="savean-stat-label">Validez de cada guía</div>
            </div>
        </div>
    </div>

    <!-- ¿CÓMO FUNCIONA? -->
    <div class="savean-section">
        <div class="savean-section-header">
            <div class="savean-accent-bar"></div>
            <h2>¿Cómo funciona?</h2>
        </div>
        <div class="savean-pasos">
            <div class="savean-paso">
                <div class="savean-paso-num" style="background: #EC6608;">1</div>
                <div class="savean-paso-title">Completá la guía</div>
                <div class="savean-paso-desc">Ingresá los datos de remitente, destinatario, mercadería y transporte en el formulario digital.</div>
            </div>
            <div class="savean-paso">
                <div class="savean-paso-num" style="background: #FF9A1D;">2</div>
                <div class="savean-paso-title">Recibí tu QR</div>
                <div class="savean-paso-desc">Se genera un código QR único y un PDF descargable con toda la información de tu guía.</div>
            </div>
            <div class="savean-paso">
                <div class="savean-paso-num" style="background: #FDC21F;">3</div>
                <div class="savean-paso-title">Presentá en barrera</div>
                <div class="savean-paso-desc">Al llegar al puesto de control, mostrá el QR al inspector para la verificación rápida.</div>
            </div>
            <div class="savean-paso">
                <div class="savean-paso-num" style="background: #2e7d32;">✓</div>
                <div class="savean-paso-title">Guía verificada</div>
                <div class="savean-paso-desc">El inspector registra la verificación y tu mercadería queda habilitada para circular.</div>
            </div>
        </div>
    </div>

    <!-- PUESTOS DE CONTROL -->
    <div class="savean-section">
        <div class="savean-section-header">
            <div class="savean-accent-bar"></div>
            <h2>Puestos de control</h2>
        </div>
        <div class="savean-barreras-grid">
            <?php
            global $wpdb;
            $barreras = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}savean_barreras WHERE activa = 1 ORDER BY nombre ASC" );
            if ( $barreras ) :
                foreach ( $barreras as $b ) :
            ?>
            <div class="savean-barrera-card">
                <div class="savean-barrera-icon"><div class="savean-barrera-dot"></div></div>
                <div>
                    <div class="savean-barrera-nombre"><?php echo esc_html($b->nombre); ?></div>
                    <div class="savean-barrera-info"><?php echo esc_html($b->ruta); ?><?php echo $b->kilometro ? ', ' . esc_html($b->kilometro) : ''; ?> — <?php echo esc_html($b->departamento); ?></div>
                </div>
            </div>
            <?php
                endforeach;
            else :
                echo '<p>No hay barreras registradas.</p>';
            endif;
            ?>
        </div>
    </div>

    <!-- CTA FINAL -->
    <div class="savean-cta-final">
        <h3>¿Necesitás emitir una Guía de Origen?</h3>
        <p>Completá el formulario digital y obtené tu código QR al instante.</p>
        <a href="<?php echo esc_url($url_guia); ?>" class="savean-btn-orange">Completar Guía de Origen →</a>
    </div>

    </div>

    <style>
    #savean-landing {
        max-width: 960px;
        margin: 0 auto;
        padding: 0 20px 40px;
        font-family: 'Ubuntu', Arial, sans-serif;
        color: #333;
    }
    #savean-landing * { box-sizing: border-box; }

    /* HERO */
    .savean-hero {
        background: linear-gradient(135deg, #EC6608 0%, #FF9A1D 50%, #FDC21F 100%);
        border-radius: 16px;
        padding: 48px 40px;
        text-align: center;
        margin-bottom: 48px;
        position: relative;
        overflow: hidden;
    }
    .savean-hero-circle-1 {
        position: absolute; top: -40px; right: -40px;
        width: 200px; height: 200px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.15);
    }
    .savean-hero-circle-2 {
        position: absolute; bottom: -60px; left: -30px;
        width: 160px; height: 160px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.1);
    }
    .savean-hero-inner { position: relative; z-index: 1; }
    .savean-badge-top {
        display: inline-block; background: rgba(255,255,255,0.2);
        padding: 6px 20px; border-radius: 20px;
        font-size: 12px; color: white; letter-spacing: 2px;
        text-transform: uppercase; font-weight: 700; margin-bottom: 16px;
    }
    .savean-hero-title {
        font-size: 42px; font-weight: 700; color: white;
        margin: 0 0 4px; letter-spacing: 2px;
    }
    .savean-hero-subtitle {
        font-family: 'Lora', serif; font-size: 18px;
        color: rgba(255,255,255,0.9); margin: 0 0 20px; font-style: italic;
    }
    .savean-hero-desc {
        font-size: 15px; color: rgba(255,255,255,0.85);
        max-width: 560px; margin: 0 auto 28px; line-height: 1.6;
    }
    .savean-btn-white {
        display: inline-block; background: white; color: #EC6608;
        padding: 14px 36px; border-radius: 8px; font-size: 16px;
        font-weight: 700; text-decoration: none; letter-spacing: 0.5px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .savean-btn-white:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        color: #EC6608; text-decoration: none;
    }

    /* SECCIONES */
    .savean-section { margin-bottom: 48px; }
    .savean-section-header {
        display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    }
    .savean-accent-bar {
        width: 4px; height: 28px; background: #EC6608; border-radius: 2px;
    }
    .savean-section-header h2 {
        font-size: 22px; font-weight: 700; color: #EC6608; margin: 0;
        font-family: 'Ubuntu', Arial, sans-serif;
    }
    .savean-text {
        font-size: 15px; line-height: 1.7; color: #555; margin: 0 0 24px;
    }

    /* STATS */
    .savean-stats {
        display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
    }
    .savean-stat {
        background: #FFF8F0; border-left: 3px solid; padding: 20px;
        border-radius: 0 8px 8px 0;
    }
    .savean-stat-num { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .savean-stat-label { font-size: 13px; color: #888; font-weight: 500; }

    /* PASOS */
    .savean-pasos {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }
    .savean-paso {
        text-align: center; padding: 24px 12px;
        background: white; border: 1px solid #f0e8e0; border-radius: 12px;
        transition: transform 0.2s;
    }
    .savean-paso:hover { transform: translateY(-3px); }
    .savean-paso-num {
        width: 48px; height: 48px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 12px; color: white; font-size: 20px; font-weight: 700;
    }
    .savean-paso-title { font-size: 14px; font-weight: 700; color: #333; margin-bottom: 6px; }
    .savean-paso-desc { font-size: 12px; color: #888; line-height: 1.5; }

    /* BARRERAS */
    .savean-barreras-grid {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
    }
    .savean-barrera-card {
        display: flex; align-items: center; gap: 12px; padding: 16px;
        background: white; border: 1px solid #f0e8e0; border-radius: 10px;
        transition: border-color 0.2s;
    }
    .savean-barrera-card:hover { border-color: #EC6608; }
    .savean-barrera-icon {
        min-width: 40px; height: 40px; background: #FFF3E8;
        border-radius: 8px; display: flex; align-items: center; justify-content: center;
    }
    .savean-barrera-dot { width: 8px; height: 8px; background: #EC6608; border-radius: 50%; }
    .savean-barrera-nombre { font-size: 14px; font-weight: 700; color: #333; }
    .savean-barrera-info { font-size: 12px; color: #888; }

    /* CTA FINAL */
    .savean-cta-final {
        background: #333; border-radius: 12px; padding: 36px 40px;
        text-align: center; margin-bottom: 24px;
    }
    .savean-cta-final h3 {
        font-size: 20px; font-weight: 700; color: white; margin: 0 0 8px;
        font-family: 'Ubuntu', Arial, sans-serif;
    }
    .savean-cta-final p {
        font-size: 14px; color: rgba(255,255,255,0.7); margin: 0 0 20px;
    }
    .savean-btn-orange {
        display: inline-block; background: #EC6608; color: white;
        padding: 14px 36px; border-radius: 8px; font-size: 16px;
        font-weight: 700; text-decoration: none;
        transition: transform 0.2s, background 0.2s;
    }
    .savean-btn-orange:hover {
        background: #C45000; transform: translateY(-2px);
        color: white; text-decoration: none;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
        .savean-hero { padding: 32px 20px; }
        .savean-hero-title { font-size: 32px; }
        .savean-stats { grid-template-columns: 1fr; }
        .savean-pasos { grid-template-columns: repeat(2, 1fr); }
        .savean-barreras-grid { grid-template-columns: 1fr; }
        .savean-cta-final { padding: 28px 20px; }
    }
    @media (max-width: 480px) {
        .savean-pasos { grid-template-columns: 1fr; }
        .savean-hero-title { font-size: 28px; }
    }
    </style>
    <?php
    return ob_get_clean();
}

// Shortcode del formulario
add_shortcode( 'savean_formulario', 'savean_render_formulario' );

function savean_render_formulario() {
    ob_start();

    // Mostrar confirmación si ya se envió
    if ( isset( $_GET['guia'] ) ) {
        $numero = sanitize_text_field( $_GET['guia'] );
        ?>
        <div id="savean-root">
        <div id="savean-confirmacion">
            <h2>✅ Guía registrada correctamente</h2>
            <p>Tu número de guía es:</p>
            <h1><?php echo esc_html( $numero ); ?></h1>
            <p>Esta guía es <strong>válida por 20 días</strong> desde su emisión.</p>
            <p>Presentá este código QR en la barrera fitozoosanitaria al momento del control.</p>
            <?php
            global $wpdb;
            $guia = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT token FROM {$wpdb->prefix}savean_guias WHERE numero = %s",
                    $numero
                )
            );
            if ( $guia ) {
                $url_qr = savean_url( '/?savean_qr=' . $guia->token );
                $url_pdf = savean_url( '/?savean_pdf=' . $guia->token );
                $url_verificar = savean_url( '/?savean_verificar=' . $guia->token );
                echo '<div style="margin-top:20px;"><img src="' . esc_url($url_qr) . '" alt="Código QR"></div>';
                echo '<div style="margin-top:15px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">';
                echo '<button onclick="saveanDescargarPDF(\'' . esc_js($url_pdf) . '\')" style="background:#2e7d32;color:white;padding:12px 24px;border:none;border-radius:5px;font-size:14px;font-weight:bold;cursor:pointer;">Descargar PDF</button>';
                echo '<a href="' . esc_url($url_verificar) . '" target="_blank" style="background:#EC6608;color:white;padding:12px 24px;text-decoration:none;border-radius:5px;font-size:14px;font-weight:bold;">Ver estado de la guia</a>';
                echo '</div>';
                echo '<div style="margin-top:20px;"><a href="' . esc_url(get_permalink()) . '" style="color:#EC6608;font-size:14px;">Emitir otra guia</a></div>';
                echo '<script type="text/javascript">
                function saveanDescargarPDF(url) {
                    var iframe = document.createElement("iframe");
                    iframe.style.display = "none";
                    iframe.src = url;
                    document.body.appendChild(iframe);
                    setTimeout(function() { document.body.removeChild(iframe); }, 1000);
                }
                </script>';
            } else {
                echo '<p style="color:#c62828;margin-top:20px;font-weight:bold;padding:15px;background:#fef0f0;border:1px solid #c62828;border-radius:5px;">Error: no se pudo cargar el código QR y los botones de descarga. La guía puede no haberse guardado correctamente. Por favor intentá completar el formulario nuevamente.</p>';
                echo '<div style="margin-top:20px;"><a href="' . esc_url(get_permalink()) . '" style="color:#EC6608;font-size:14px;">Volver al formulario</a></div>';
            }
            ?>
        </div>
        </div>
        <?php
        return ob_get_clean();
    }
    ?>
    <div id="savean-root">
    <div id="savean-formulario">

        <h2>Guía de Origen Digital - SAVEAN</h2>

        <form id="form-guia-origen" method="post">
            <?php wp_nonce_field( 'savean_nueva_guia', 'savean_nonce' ); ?>

            <h3>Remitente de la Mercadería</h3>
            <label>Nombre y Apellido / Razón Social</label>
            <input type="text" name="remitente_nombre" required>

            <label>RENSPA N°</label>
            <input type="text" name="remitente_renspa">

            <label>Tipo de Remitente *</label>
            <select name="remitente_tipo" required>
                <option value="">-- Seleccionar --</option>
                <option value="Galpón de Empaque">Galpón de Empaque</option>
                <option value="Cámara de Frío">Cámara de Frío</option>
                <option value="Productor">Productor</option>
                <option value="Industria">Industria</option>
            </select>

            <h3>Destinatario de la Mercadería</h3>
            <label>Nombre y Apellido / Razón Social</label>
            <input type="text" name="destinatario_nombre" required>

            <label>Tipo de Destino *</label>
            <select name="destino_tipo" id="destino_tipo" required>
                <option value="">-- Seleccionar --</option>
                <option value="externo">Mercado Externo</option>
                <option value="interno">Mercado Interno</option>
            </select>

            <div id="destino_externo" style="display:none;">
                <label>País de Destino</label>
                <input type="text" name="destino_pais">
                <label>Punto de Salida</label>
                <input type="text" name="destino_punto_salida">
            </div>

            <div id="destino_interno" style="display:none;">
                <label>Tipo de Mercado Interno</label>
                <select name="destino_mercado_interno">
                    <option value="">-- Seleccionar --</option>
                    <option value="Depósito Mayorista">Depósito Mayorista</option>
                    <option value="Mercado Concentrador">Mercado Concentrador</option>
                    <option value="Supermercado">Supermercado</option>
                    <option value="Industria">Industria</option>
                </select>

                <label>Provincia de Destino</label>
                <input type="text" name="destino_provincia" id="destino_provincia">
            </div>

            <h3>Contacto</h3>
            <label>Email de Contacto *</label>
            <input type="email" name="email_contacto" placeholder="ejemplo@dominio.com" required>

            <h3>Mercadería</h3>
            <div id="items-mercaderia">
                <div class="item-mercaderia">
                    <label>Lugar de Empaque o Industrialización</label>
                    <input type="text" name="items[0][lugar_empaque]">

                    <label>Especie *</label>
                    <select name="items[0][especie]" class="select-especie" required>
                        <option value="">-- Seleccionar --</option>
                        <option value="Vid">Vid</option>
                        <option value="Tomate">Tomate</option>
                        <option value="Pimiento">Pimiento</option>
                        <option value="Olivo">Olivo</option>
                        <option value="Pistacho">Pistacho</option>
                        <option value="Ajo">Ajo</option>
                        <option value="Cebolla">Cebolla</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <div class="especie-otro-wrap" style="display:none;">
                        <label>Nombre del cultivo *</label>
                        <input type="text" name="items[0][especie_nombre]">
                    </div>

                    <!-- Sección VID -->
                    <div class="vid-section" style="display:none;">
                        <label>Destino *</label>
                        <label><input type="checkbox" name="items[0][vid_destino][]" value="Consumo fresco"> Consumo fresco</label>
                        <label><input type="checkbox" name="items[0][vid_destino][]" value="Pasa"> Pasa</label>
                        <label><input type="checkbox" name="items[0][vid_destino][]" value="Vino"> Vino</label>
                        <label><input type="checkbox" name="items[0][vid_destino][]" value="Mosto"> Mosto</label>

                        <div class="inv-wrap" style="display:none;">
                            <label>Nº INV</label>
                            <input type="text" name="items[0][vid_inv]">
                        </div>

                        <label>Variedad</label>
                        <input type="text" name="items[0][variedad]" list="variedades-vid">
                        <datalist id="variedades-vid">
                            <option value="Malbec">
                            <option value="Cabernet Sauvignon">
                            <option value="Chardonnay">
                            <option value="Torrontés">
                            <option value="Syrah">
                        </datalist>

                        <label>Cantidad (kg) *</label>
                        <input type="number" step="0.01" name="items[0][cantidad_kg]" min="0.01">

                        <label>Bultos / Bins</label>
                        <input type="number" name="items[0][cantidad_bultos]" min="1">
                    </div>

                    <!-- Sección OTRO CULTIVO -->
                    <div class="otro-section" style="display:none;">
                        <label>Cultivo</label>
                        <input type="text" name="items[0][cultivo]">

                        <label>Variedad</label>
                        <input type="text" name="items[0][variedad]">

                        <label>Cantidad (kg) *</label>
                        <input type="number" step="0.01" name="items[0][cantidad_kg]" min="0.01">

                        <label>Tipo de Envase *</label>
                        <select name="items[0][tipo_envase]">
                            <option value="">-- Seleccionar --</option>
                            <option value="Cajón">Cajón</option>
                            <option value="Bolsa">Bolsa</option>
                            <option value="Bins">Bins</option>
                            <option value="Granel">Granel</option>
                            <option value="Bandeja">Bandeja</option>
                            <option value="Otro">Otro</option>
                        </select>

                        <label>Cantidad de Bultos *</label>
                        <input type="number" name="items[0][cantidad_bultos]" min="1">
                    </div>
                </div>
            </div>
            <button type="button" id="agregar-item">+ Agregar producto</button>

            <h3>Transporte</h3>
            <label>Nombre del Transportista *</label>
            <input type="text" name="transporte_conductor" required>
            <label>Empresa de Transporte</label>
            <input type="text" name="transporte_empresa">
            <label>Patente Vehículo *</label>
            <input type="text" name="transporte_camion_patente" required>
            <label>Patente Acoplado</label>
            <input type="text" name="transporte_acoplado_patente">

            <label>Tipo *</label>
            <label><input type="radio" name="transporte_tipo" value="Propio"> Propio</label>
            <label><input type="radio" name="transporte_tipo" value="Tercero"> Tercero</label>

            <br><br>
            <button type="submit" name="savean_submit">Enviar Guía</button>

        </form>
    </div>
    </div>

    <script>
    document.getElementById('destino_tipo').addEventListener('change', function() {
        document.getElementById('destino_externo').style.display = this.value === 'externo' ? 'block' : 'none';
        document.getElementById('destino_interno').style.display = this.value === 'interno' ? 'block' : 'none';
    });

    var itemIndex = 1;
    document.getElementById('agregar-item').addEventListener('click', function() {
        var container = document.getElementById('items-mercaderia');
        var nuevo = container.querySelector('.item-mercaderia').cloneNode(true);
        var inputs = nuevo.querySelectorAll('input');
        var selects = nuevo.querySelectorAll('select');

        // Actualizar nombres de inputs
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].name = inputs[i].name.replace(/\[\d+\]/, '[' + itemIndex + ']');
            inputs[i].value = '';
        }

        // Actualizar nombres de selects
        for (var i = 0; i < selects.length; i++) {
            selects[i].name = selects[i].name.replace(/\[\d+\]/, '[' + itemIndex + ']');
            selects[i].value = '';
        }

        // Resetear secciones condicionales
        nuevo.querySelector('.vid-section').style.display = 'none';
        nuevo.querySelector('.otro-section').style.display = 'none';
        nuevo.querySelector('.especie-otro-wrap').style.display = 'none';
        nuevo.querySelector('.inv-wrap').style.display = 'none';

        // Limpiar checkboxes de vid_destino
        var vidChecks = nuevo.querySelectorAll('[name*="vid_destino"]');
        for (var i = 0; i < vidChecks.length; i++) {
            vidChecks[i].checked = false;
        }

        container.appendChild(nuevo);
        itemIndex++;
        saveanActualizarBotonesEliminar();
        saveanBindEspecieHandlers();
    });

    // Funciones para manejar especie y destino Vid
    function saveanHandleEspecie(item) {
        var especie = item.querySelector('.select-especie').value;
        var vidSection = item.querySelector('.vid-section');
        var otroSection = item.querySelector('.otro-section');
        var especieOtroWrap = item.querySelector('.especie-otro-wrap');
        var cultivo = item.querySelector('[name*="cultivo"]');

        vidSection.style.display = especie === 'Vid' ? 'block' : 'none';
        otroSection.style.display = (especie && especie !== 'Vid') ? 'block' : 'none';
        especieOtroWrap.style.display = especie === 'Otro' ? 'block' : 'none';

        // Pre-llenar "cultivo" con nombre de especie
        if (cultivo) {
            if (especie !== 'Vid' && especie !== 'Otro') {
                cultivo.value = especie;
            } else if (especie === 'Otro') {
                cultivo.value = '';
            }
        }
    }

    function saveanHandleVidDestino(item) {
        var checks = item.querySelectorAll('[name*="vid_destino"]');
        var invWrap = item.querySelector('.inv-wrap');
        var invInput = invWrap.querySelector('input');
        var needsINV = Array.from(checks).some(function(c) {
            return (c.value === 'Vino' || c.value === 'Mosto') && c.checked;
        });
        invWrap.style.display = needsINV ? 'block' : 'none';
        invInput.required = needsINV;
    }

    function saveanBindEspecieHandlers() {
        var items = document.querySelectorAll('.item-mercaderia');
        for (var i = 0; i < items.length; i++) {
            (function(item) {
                var selectEspecie = item.querySelector('.select-especie');
                var checks = item.querySelectorAll('[name*="vid_destino"]');

                // Manejar cambio de especie
                selectEspecie.removeEventListener('change', selectEspecie._saveanEspecieHandler);
                selectEspecie._saveanEspecieHandler = function() { saveanHandleEspecie(item); };
                selectEspecie.addEventListener('change', selectEspecie._saveanEspecieHandler);

                // Manejar cambios en checkboxes de destino Vid
                for (var j = 0; j < checks.length; j++) {
                    checks[j].removeEventListener('change', checks[j]._saveanVidHandler);
                    checks[j]._saveanVidHandler = function() { saveanHandleVidDestino(item); };
                    checks[j].addEventListener('change', checks[j]._saveanVidHandler);
                }
            })(items[i]);
        }
    }

    function saveanEliminarItem(btn) {
        var items = document.querySelectorAll('.item-mercaderia');
        if (items.length > 1) {
            btn.parentNode.remove();
            saveanActualizarBotonesEliminar();
        }
    }

    function saveanActualizarBotonesEliminar() {
        var items = document.querySelectorAll('.item-mercaderia');
        for (var i = 0; i < items.length; i++) {
            var btnExistente = items[i].querySelector('.savean-btn-eliminar-item');
            if (items.length > 1) {
                if (!btnExistente) {
                    var btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'savean-btn-eliminar-item';
                    btn.textContent = 'Eliminar este producto';
                    btn.style.cssText = 'background:#c62828; color:white; border:none; padding:6px 14px; border-radius:4px; font-size:12px; cursor:pointer; margin-top:8px;';
                    btn.onclick = function() { saveanEliminarItem(this); };
                    items[i].appendChild(btn);
                }
            } else {
                if (btnExistente) btnExistente.remove();
            }
        }
    }

    saveanBindEspecieHandlers();

    // Función auxiliar para validar nombres (al menos 2 palabras de 3+ caracteres)
    function saveanValidarNombre(nombre) {
        var palabras = nombre.trim().split(/\s+/).filter(function(p) { return p.length >= 3; });
        return palabras.length >= 2;
    }

    // Validación robusta del formulario
    function saveanValidarFormulario(form) {
        var errores = [];

        // Validar nombre remitente
        var remitente = form.elements['remitente_nombre'];
        if (!remitente.value.trim()) {
            errores.push('El nombre del Remitente es obligatorio.');
        } else if (!/^[a-zA-Z0-9\s\.\-,áéíóúñÁÉÍÓÚÑ]+$/.test(remitente.value)) {
            errores.push('El nombre del Remitente contiene caracteres no permitidos.');
        } else if (!saveanValidarNombre(remitente.value)) {
            errores.push('El nombre del Remitente debe tener al menos 2 palabras de 3+ caracteres (ej: Juan Pérez).');
        }

        // Validar nombre destinatario
        var destinatario = form.elements['destinatario_nombre'];
        if (!destinatario.value.trim()) {
            errores.push('El nombre del Destinatario es obligatorio.');
        } else if (!/^[a-zA-Z0-9\s\.\-,áéíóúñÁÉÍÓÚÑ]+$/.test(destinatario.value)) {
            errores.push('El nombre del Destinatario contiene caracteres no permitidos.');
        } else if (!saveanValidarNombre(destinatario.value)) {
            errores.push('El nombre del Destinatario debe tener al menos 2 palabras de 3+ caracteres (ej: Juan Pérez).');
        }

        // Validar transporte
        var conductor = form.elements['transporte_conductor'];
        if (!conductor.value.trim() || conductor.value.length < 2) {
            errores.push('El nombre del Transportista es obligatorio (mínimo 2 caracteres).');
        } else if (!/^[a-zA-Z0-9\s\.\-áéíóúñÁÉÍÓÚÑ]+$/.test(conductor.value)) {
            errores.push('El nombre del Transportista contiene caracteres no permitidos.');
        }

        // Validar patente del vehículo (formato argentino)
        var patente = form.elements['transporte_camion_patente'];
        if (!patente.value.trim()) {
            errores.push('La Patente del Vehículo es obligatoria.');
        } else if (!/^[A-Z0-9\-]{6,10}$/.test(patente.value.toUpperCase())) {
            errores.push('El formato de la Patente no es válido. Use: ABC-123, AB-123-CD o similar.');
        }

        // Validar tipo de transporte (Propio o Tercero)
        var tipoTransporte = form.querySelector('[name="transporte_tipo"]:checked');
        if (!tipoTransporte) {
            errores.push('Debe seleccionar el Tipo de transporte (Propio o Tercero).');
        }

        // Validar ítems de mercadería
        var items = form.querySelectorAll('.item-mercaderia');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var especie = item.querySelector('select[name*="especie"]');
            if (!especie) continue; // Si no hay select de especie, saltar este item

            var cantidadKg = item.querySelector('input[name*="cantidad_kg"]');
            var vidDestinos = item.querySelectorAll('[name*="vid_destino"]:checked');
            var vidInv = item.querySelector('input[name*="vid_inv"]');
            var cultivo = item.querySelector('input[name*="cultivo"]');
            var especieNombre = item.querySelector('input[name*="especie_nombre"]');
            var tipo_envase_select = item.querySelector('select[name*="tipo_envase"]');
            var bultos = item.querySelector('input[name*="cantidad_bultos"]');

            // Validar que especie esté seleccionada
            if (!especie.value) {
                errores.push('Producto ' + (i+1) + ': Debe seleccionar una Especie.');
            }

            // Validaciones específicas para Vid
            if (especie.value === 'Vid') {
                if (vidDestinos.length === 0) {
                    errores.push('Producto ' + (i+1) + ': Debe seleccionar al menos un Destino para Vid.');
                }

                if (vidDestinos.length > 0) {
                    var tieneVino = Array.from(vidDestinos).some(function(d) {
                        return d.value === 'Vino' || d.value === 'Mosto';
                    });
                    if (tieneVino && vidInv && !vidInv.value.trim()) {
                        errores.push('Producto ' + (i+1) + ': El N° INV es obligatorio cuando el destino es Vino o Mosto.');
                    }
                }
            }

            // Validaciones para Otro cultivo (Tomate, Pimiento, Olivo, Otro)
            if (especie.value && especie.value !== 'Vid') {
                if (especie.value === 'Otro' && especieNombre && !especieNombre.value.trim()) {
                    errores.push('Producto ' + (i+1) + ': Debe ingresar el nombre del cultivo.');
                }

                if (tipo_envase_select && !tipo_envase_select.value) {
                    errores.push('Producto ' + (i+1) + ': Debe seleccionar un Tipo de Envase.');
                }
            }
        }

        return errores;
    }

    document.getElementById('form-guia-origen').addEventListener('submit', function(e) {
        var form = this;

        // Ejecutar validación robusta
        var errores = saveanValidarFormulario(form);
        if (errores.length > 0) {
            e.preventDefault();
            alert('Por favor, corrija los siguientes errores:\n\n' + errores.join('\n'));
            // Scroll al primer campo con error
            form.querySelectorAll('input, select').forEach(function(el) {
                if (el.offsetParent !== null) {
                    el.focus();
                    return;
                }
            });
            return;
        }

        // Validar campos condicionales de destino
        var tipoDestino = document.getElementById('destino_tipo').value;
        if (!tipoDestino) {
            e.preventDefault();
            alert('Seleccioná el Tipo de Destino.');
            document.getElementById('destino_tipo').focus();
            return;
        }
        if (tipoDestino === 'externo') {
            if (!form.elements['destino_pais'].value.trim()) {
                e.preventDefault();
                alert('Ingresá el País de Destino.');
                form.elements['destino_pais'].focus();
                return;
            }
            if (!form.elements['destino_punto_salida'].value.trim()) {
                e.preventDefault();
                alert('Ingresá el Punto de Salida.');
                form.elements['destino_punto_salida'].focus();
                return;
            }
        }
        if (tipoDestino === 'interno') {
            if (!form.elements['destino_mercado_interno'].value) {
                e.preventDefault();
                alert('Seleccioná el Tipo de Mercado Interno.');
                form.elements['destino_mercado_interno'].focus();
                return;
            }
        }
        var ok = confirm('Está a punto de enviar la guía. Verifique que todos los datos sean correctos.\n\n¿Desea continuar?');
        if (!ok) e.preventDefault();
    });
    </script>
    <?php
    return ob_get_clean();
}

// Procesar el formulario cuando se envía
add_action( 'init', 'savean_procesar_formulario' );

function savean_procesar_formulario() {
    if ( ! isset( $_POST['savean_submit'] ) ) return;

    // Verificar nonce
    if ( ! isset( $_POST['savean_nonce'] ) || ! wp_verify_nonce( $_POST['savean_nonce'], 'savean_nueva_guia' ) ) {
        wp_die( 'Error de seguridad. Por favor recargue la pagina e intente nuevamente.' );
    }

    // Asegurar que las columnas necesarias existan en la BD
    global $wpdb;
    $table = $wpdb->prefix . 'savean_guias';
    $columns = $wpdb->get_results( "SHOW COLUMNS FROM `$table`" );
    $col_names = wp_list_pluck( (array) $columns, 'Field' );

    if ( ! in_array( 'email_contacto', $col_names ) ) {
        $wpdb->query( "ALTER TABLE `$table` ADD COLUMN `email_contacto` VARCHAR(200) NULL" );
    }
    if ( ! in_array( 'motivo_denegacion', $col_names ) ) {
        $wpdb->query( "ALTER TABLE `$table` ADD COLUMN `motivo_denegacion` VARCHAR(500) NULL" );
    }

    // Validar campos obligatorios
    $campos_requeridos = array(
        'remitente_nombre'   => 'Nombre del Remitente',
        'remitente_tipo'     => 'Tipo de Remitente',
        'destinatario_nombre'=> 'Nombre del Destinatario',
        'destino_tipo'       => 'Tipo de Destino',
        'email_contacto'     => 'Email de Contacto',
        'transporte_conductor'=> 'Transportista / Conductor',
        'transporte_tipo'    => 'Tipo de Transporte',
        'transporte_camion_patente'=> 'Patente del Camión',
    );
    foreach ( $campos_requeridos as $campo => $etiqueta ) {
        if ( empty( trim( isset($_POST[$campo]) ? $_POST[$campo] : '' ) ) ) {
            wp_die( 'El campo "' . $etiqueta . '" es obligatorio.' );
        }
    }

    global $wpdb;

    // Generar número único SAVEAN-YYYYNNNNN
    $anio = date('Y');
    $ultimo = $wpdb->get_var(
        "SELECT numero FROM {$wpdb->prefix}savean_guias 
         WHERE numero LIKE 'SAVEAN-{$anio}%' 
         ORDER BY id DESC LIMIT 1"
    );
    if ( $ultimo ) {
        $ultimo_num = intval( preg_replace('/[^0-9]/', '', substr( $ultimo, 11 ) ) );
        $nuevo_num  = str_pad( $ultimo_num + 1, 5, '0', STR_PAD_LEFT );
    } else {
        $nuevo_num = '00001';
    }
    $numero = "SAVEAN-{$anio}-{$nuevo_num}";

    // Generar token único
    $token = wp_generate_password( 64, false, false );

    // Insertar la guía
    $wpdb->insert(
        "{$wpdb->prefix}savean_guias",
        array(
            'numero'                  => $numero,
            'token'                   => $token,
            'estado'                  => 'pendiente',
            'fecha_emision'           => current_time('mysql'),
            'remitente_nombre'        => sanitize_text_field( isset($_POST['remitente_nombre']) ? $_POST['remitente_nombre'] : '' ),
            'remitente_renspa'        => sanitize_text_field( isset($_POST['remitente_renspa']) ? $_POST['remitente_renspa'] : '' ),
            'remitente_tipo'          => sanitize_text_field( isset($_POST['remitente_tipo']) ? $_POST['remitente_tipo'] : '' ),
            'destinatario_nombre'     => sanitize_text_field( isset($_POST['destinatario_nombre']) ? $_POST['destinatario_nombre'] : '' ),
            'destino_tipo'            => sanitize_text_field( isset($_POST['destino_tipo']) ? $_POST['destino_tipo'] : '' ),
            'destino_pais'            => sanitize_text_field( isset($_POST['destino_pais']) ? $_POST['destino_pais'] : '' ),
            'destino_punto_salida'    => sanitize_text_field( isset($_POST['destino_punto_salida']) ? $_POST['destino_punto_salida'] : '' ),
            'destino_mercado_interno' => sanitize_text_field( isset($_POST['destino_mercado_interno']) ? $_POST['destino_mercado_interno'] : '' ),
            'destino_provincia'       => sanitize_text_field( isset($_POST['destino_provincia']) ? $_POST['destino_provincia'] : '' ),
            'transporte_tipo'         => sanitize_text_field( isset($_POST['transporte_tipo']) ? $_POST['transporte_tipo'] : '' ),
            'transporte_empresa'      => sanitize_text_field( isset($_POST['transporte_empresa']) ? $_POST['transporte_empresa'] : '' ),
            'transporte_conductor'    => sanitize_text_field( isset($_POST['transporte_conductor']) ? $_POST['transporte_conductor'] : '' ),
            'transporte_camion_patente'  => sanitize_text_field( isset($_POST['transporte_camion_patente']) ? $_POST['transporte_camion_patente'] : '' ),
            'transporte_acoplado_patente'=> sanitize_text_field( isset($_POST['transporte_acoplado_patente']) ? $_POST['transporte_acoplado_patente'] : '' ),
            'email_contacto'             => sanitize_email( isset($_POST['email_contacto']) ? $_POST['email_contacto'] : '' ),
        ),
        array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
    );

    $guia_id = $wpdb->insert_id;

    // DEBUG: Mostrar error si el INSERT falló
    if ( ! $guia_id ) {
        error_log( 'SAVEAN INSERT ERROR: ' . $wpdb->last_error );
        wp_die( 'Error al guardar la guía: ' . $wpdb->last_error . '. Contacte al administrador.' );
    }

    // Insertar items de mercadería
    if ( ! empty( $_POST['items'] ) && is_array( $_POST['items'] ) ) {
        foreach ( $_POST['items'] as $item ) {
            // Manejar cantidad_kg (nueva estructura) o calcularla desde kilos_por_bulto (estructura anterior)
            $cantidad_kg = floatval( isset($item['cantidad_kg']) ? $item['cantidad_kg'] : 0 );
            if ($cantidad_kg == 0 && isset($item['kilos_por_bulto'])) {
                $cantidad = floatval( isset($item['cantidad_bultos']) ? $item['cantidad_bultos'] : 0 );
                $kilos    = floatval( $item['kilos_por_bulto'] );
                $cantidad_kg = $cantidad * $kilos;
            }

            // Preparar datos del item - solo campos que existen en la tabla
            $item_data = array(
                'guia_id'         => $guia_id,
                'vinedo_numero'   => sanitize_text_field( isset($item['vinedo_numero']) ? $item['vinedo_numero'] : '' ),
                'lugar_empaque'   => sanitize_text_field( isset($item['lugar_empaque']) ? $item['lugar_empaque'] : '' ),
                'especie'         => sanitize_text_field( isset($item['especie']) ? $item['especie'] : '' ),
                'variedad'        => sanitize_text_field( isset($item['variedad']) ? $item['variedad'] : '' ),
                'grado_seleccion' => sanitize_text_field( isset($item['grado_seleccion']) ? $item['grado_seleccion'] : '' ),
                'tamano'          => sanitize_text_field( isset($item['tamano']) ? $item['tamano'] : '' ),
                'subproducto'     => sanitize_text_field( isset($item['subproducto']) ? $item['subproducto'] : '' ),
                'tipo_envase'     => sanitize_text_field( isset($item['tipo_envase']) ? $item['tipo_envase'] : '' ),
                'cantidad_bultos' => floatval( isset($item['cantidad_bultos']) ? $item['cantidad_bultos'] : 0 ),
                'kilos_por_bulto' => floatval( isset($item['kilos_por_bulto']) ? $item['kilos_por_bulto'] : 0 ),
                'total_kilos'     => $cantidad_kg,
            );

            $wpdb->insert(
                "{$wpdb->prefix}savean_guias_items",
                $item_data,
                array_fill(0, count($item_data), '%s')
            );
        }
    }

    // Redirigir a página de confirmación con el número de guía
    wp_redirect( add_query_arg( 'guia', $numero, get_permalink() ) );
    exit;
}


// Endpoint para generar el QR
add_action( 'init', 'savean_generar_qr' );

function savean_generar_qr() {
    if ( ! isset( $_GET['savean_qr'] ) ) return;

    $token = sanitize_text_field( $_GET['savean_qr'] );

    global $wpdb;
    $guia = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
            $token
        )
    );

    if ( ! $guia ) {
        http_response_code(404);
        exit('Guía no encontrada');
    }

    $url_verificacion = savean_url( '/?savean_verificar=' . $token );

    header('Content-Type: image/png');
    header('Cache-Control: no-cache');
    QRcode::png( $url_verificacion, false, QR_ECLEVEL_M, 6, 2 );
    exit;
}

// Función auxiliar para agregar una página al PDF con el contenido de la guía
function savean_pdf_add_page_copy( &$pdf, $guia, $items, $qr_temp, $copy_number ) {
    $pdf->AddPage();

    // Indicador de copia en la esquina superior derecha
    $pdf->SetFont('helvetica', '', 7);
    $pdf->SetXY($pdf->GetPageWidth() - 30, 10);
    $pdf->Cell(20, 5, 'Copia ' . $copy_number . '/4', 0, 1, 'R');
    $pdf->SetXY(10, 10);

    $pdf->SetFont('helvetica', 'B', 14);
    $pdf->Cell(0, 8, 'GUÍA DE ORIGEN - SAVEAN SAN JUAN', 0, 1, 'C');
    $pdf->SetFont('helvetica', '', 9);
    $pdf->Cell(0, 5, 'Programa de Control Fitozoosanitario - Declaración Jurada - Ley N° 1887-I', 0, 1, 'C');
    $pdf->Ln(2);

    // Número de guía
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->Cell(0, 7, 'N° ' . $guia->numero . '   |   Estado: ' . strtoupper($guia->estado) . '   |   Válido por 20 días', 1, 1, 'C');
    $pdf->Ln(3);

    // Remitente y Destinatario
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Cell(135, 5, 'REMITENTE DE LA MERCADERÍA', 1, 0, 'L');
    $pdf->Cell(132, 5, 'DESTINATARIO DE LA MERCADERÍA', 1, 1, 'L');
    $pdf->SetFont('helvetica', '', 8);
    $pdf->Cell(135, 5, 'Nombre/Razón Social: ' . $guia->remitente_nombre, 1, 0, 'L');
    $pdf->Cell(132, 5, 'Nombre/Razón Social: ' . $guia->destinatario_nombre, 1, 1, 'L');
    $pdf->Cell(135, 5, 'RENSPA N°: ' . $guia->remitente_renspa, 1, 0, 'L');
    $pdf->Cell(132, 5, 'Tipo de Destino: ' . $guia->destino_tipo, 1, 1, 'L');
    $pdf->Cell(135, 5, 'Tipo de Remitente: ' . $guia->remitente_tipo, 1, 0, 'L');
    if ($guia->destino_tipo === 'interno') {
        $pdf->Cell(132, 5, 'Mercado: ' . $guia->destino_mercado_interno . '   Provincia: ' . $guia->destino_provincia, 1, 1, 'L');
    } else {
        $pdf->Cell(132, 5, 'País: ' . $guia->destino_pais . '   Punto Salida: ' . $guia->destino_punto_salida, 1, 1, 'L');
    }
    $pdf->Ln(3);

    // Tabla de mercadería
    $pdf->SetFont('helvetica', 'B', 8);
    $pdf->Cell(70, 5, 'Lugar Empaque', 1, 0, 'C');
    $pdf->Cell(25, 5, 'Especie', 1, 0, 'C');
    $pdf->Cell(30, 5, 'Variedad/Cultivo', 1, 0, 'C');
    $pdf->Cell(30, 5, 'Tipo Envase', 1, 0, 'C');
    $pdf->Cell(15, 5, 'Bultos', 1, 0, 'C');
    $pdf->Cell(20, 5, 'Cantidad Kg', 1, 1, 'C');

    $pdf->SetFont('helvetica', '', 8);
    $total_bultos = 0;
    $total_kg = 0;
    foreach ( $items as $item ) {
        $especie = isset($item->especie) ? $item->especie : '';
        $variedad = isset($item->variedad) ? $item->variedad : '';
        $cultivo = isset($item->cultivo) ? $item->cultivo : '';
        $variedad_cultivo = !empty($cultivo) ? $cultivo : $variedad;
        $tipo_envase = isset($item->tipo_envase) ? $item->tipo_envase : '';
        $cantidad_kg = isset($item->cantidad_kg) ? $item->cantidad_kg : (isset($item->total_kilos) ? $item->total_kilos : 0);
        $cantidad_bultos = isset($item->cantidad_bultos) ? $item->cantidad_bultos : 0;

        $pdf->Cell(70, 5, isset($item->lugar_empaque) ? $item->lugar_empaque : '', 1, 0, 'L');
        $pdf->Cell(25, 5, $especie, 1, 0, 'L');
        $pdf->Cell(30, 5, $variedad_cultivo, 1, 0, 'L');
        $pdf->Cell(30, 5, $tipo_envase, 1, 0, 'L');
        $pdf->Cell(15, 5, $cantidad_bultos, 1, 0, 'C');
        $pdf->Cell(20, 5, $cantidad_kg, 1, 1, 'C');

        $total_bultos += $cantidad_bultos;
        $total_kg += $cantidad_kg;
    }
    $pdf->SetFont('helvetica', 'B', 8);
    $pdf->Cell(190, 5, 'TOTALES:   Bultos: ' . $total_bultos . '   Kg: ' . $total_kg, 1, 1, 'R');
    $pdf->Ln(3);

    // Transporte
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Cell(0, 5, 'TRANSPORTE', 1, 1, 'L');
    $pdf->SetFont('helvetica', '', 8);
    $pdf->Cell(95, 5, 'Transportista: ' . $guia->transporte_conductor, 1, 0, 'L');
    $pdf->Cell(95, 5, 'Empresa: ' . $guia->transporte_empresa, 1, 1, 'L');
    $pdf->Cell(95, 5, 'Patente Vehículo: ' . $guia->transporte_camion_patente, 1, 0, 'L');
    $pdf->Cell(95, 5, 'Patente Acoplado: ' . $guia->transporte_acoplado_patente . '   Tipo: ' . $guia->transporte_tipo, 1, 1, 'L');
    $pdf->Ln(3);

    // QR
    $pdf->SetFont('helvetica', 'B', 9);
    $pdf->Cell(0, 5, 'CÓDIGO QR DE VERIFICACIÓN', 0, 1, 'C');
    $pdf->Image($qr_temp, 120, $pdf->GetY(), 50, 50);
    $pdf->Ln(55);

    // Firmas
    $pdf->SetFont('helvetica', '', 8);
    $pdf->Cell(90, 15, 'Sello Puesto de Barrera: ___________________________', 1, 0, 'L');
    $pdf->Cell(90, 15, 'Firma y Aclaración Barrerista: ______________________', 1, 1, 'L');
    $pdf->Cell(90, 10, 'San Juan: ____/____/________', 1, 0, 'L');
    $pdf->Cell(90, 10, 'Firma y Aclaración Responsable: _____________________', 1, 1, 'L');
}

// Endpoint para generar el PDF
add_action( 'init', 'savean_generar_pdf' );

function savean_generar_pdf() {
    if ( ! isset( $_GET['savean_pdf'] ) ) return;

    $token = sanitize_text_field( $_GET['savean_pdf'] );

    global $wpdb;
    $guia = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
            $token
        )
    );

    if ( ! $guia ) {
        http_response_code(404);
        exit('Guía no encontrada');
    }

    $items = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}savean_guias_items WHERE guia_id = %d",
            $guia->id
        )
    );

    // Generar QR como imagen temporal
    $url_verificacion = savean_url( '/?savean_verificar=' . $token );
    $qr_temp = tempnam( sys_get_temp_dir(), 'qr' ) . '.png';
    QRcode::png( $url_verificacion, $qr_temp, QR_ECLEVEL_M, 6, 2 );

    $pdf = new TCPDF('L', 'mm', 'A4', true, 'UTF-8');
    $pdf->SetCreator('SAVEAN');
    $pdf->SetTitle('Guía de Origen ' . $guia->numero);
    $pdf->SetMargins(10, 10, 10);
    $pdf->SetAutoPageBreak(true, 10);
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);

    // Agregar 4 copias idénticas
    for ( $copia = 1; $copia <= 4; $copia++ ) {
        savean_pdf_add_page_copy( $pdf, $guia, $items, $qr_temp, $copia );
    }

    // Limpiar archivo temporal
    @unlink($qr_temp);

    $pdf->Output('guia-' . $guia->numero . '.pdf', 'D');
    exit;
}

// Control automático de vencimiento
add_action( 'wp', 'savean_registrar_cron' );

// AJAX endpoint para consultar datos de guía y verificar/denegar
add_action( 'init', 'savean_ajax_handler' );

function savean_ajax_handler() {
    if ( ! isset( $_GET['savean_ajax'] ) ) return;

    header('Content-Type: application/json; charset=utf-8');

    $accion = sanitize_text_field( $_GET['savean_ajax'] );

    global $wpdb;

    // ── Director stats (auth propia, sin token de inspector) ─────────────────
    if ( $accion === 'director_stats' ) {
        $director_auth = '';
        if ( isset( $_GET['auth'] ) ) $director_auth = sanitize_text_field( $_GET['auth'] );

        $creds = get_option( 'savean_director_creds', array() );
        if ( ! $creds || ! isset( $creds['usuario'] ) ) {
            echo json_encode( array( 'error' => 'Director no configurado' ) );
            exit;
        }

        $expected_token = md5( $creds['usuario'] . '-savean-director' );
        if ( $director_auth !== $expected_token ) {
            echo json_encode( array( 'error' => 'No autorizado' ) );
            exit;
        }

        $fecha = isset( $_GET['fecha'] ) ? sanitize_text_field( $_GET['fecha'] ) : date('Y-m-d');
        if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $fecha ) ) {
            $fecha = date('Y-m-d');
        }

        $total           = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias" );
        $emitidas_hoy    = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE DATE(fecha_emision) = CURDATE()" );
        $pendientes      = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE estado = 'pendiente'" );
        $denegadas       = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE estado = 'denegada'" );
        $vencidas        = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE estado = 'vencida'" );
        $verif_fecha     = (int) $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE estado = 'verificada' AND DATE(fecha_verificacion) = %s",
            $fecha
        ) );

        $inspectores_raw = $wpdb->get_results( $wpdb->prepare(
            "SELECT g.inspector, i.nombre, COUNT(*) as verificadas, MAX(g.fecha_verificacion) as ultima, b.nombre as barrera
             FROM {$wpdb->prefix}savean_guias g
             LEFT JOIN {$wpdb->prefix}savean_barreras b ON g.barrera_id = b.id
             LEFT JOIN {$wpdb->prefix}savean_inspectores i ON g.inspector = i.usuario
             WHERE g.estado = 'verificada' AND DATE(g.fecha_verificacion) = %s
             GROUP BY g.inspector
             ORDER BY verificadas DESC",
            $fecha
        ) );

        $inspectores_arr = array();
        foreach ( $inspectores_raw as $row ) {
            $inspectores_arr[] = array(
                'inspector'   => $row->inspector,
                'nombre'      => $row->nombre ?: $row->inspector,
                'verificadas' => (int) $row->verificadas,
                'ultima'      => $row->ultima,
                'barrera'     => $row->barrera,
            );
        }

        $barreras_raw = $wpdb->get_results( $wpdb->prepare(
            "SELECT b.nombre,
                SUM(CASE WHEN g.estado = 'verificada' THEN 1 ELSE 0 END) as verificadas,
                SUM(CASE WHEN g.estado = 'denegada'   THEN 1 ELSE 0 END) as denegadas
             FROM {$wpdb->prefix}savean_barreras b
             LEFT JOIN {$wpdb->prefix}savean_guias g
                ON b.id = g.barrera_id AND DATE(g.fecha_verificacion) = %s
             WHERE b.activa = 1
             GROUP BY b.id
             ORDER BY b.nombre ASC",
            $fecha
        ) );

        $barreras_arr = array();
        foreach ( $barreras_raw as $row ) {
            $barreras_arr[] = array(
                'nombre'      => $row->nombre,
                'verificadas' => (int) $row->verificadas,
                'denegadas'   => (int) $row->denegadas,
            );
        }

        $ultimas_raw = $wpdb->get_results(
            "SELECT g.numero, g.estado, g.remitente_nombre, g.inspector, b.nombre as barrera,
                    g.fecha_verificacion, g.fecha_emision, g.token
             FROM {$wpdb->prefix}savean_guias g
             LEFT JOIN {$wpdb->prefix}savean_barreras b ON g.barrera_id = b.id
             WHERE g.estado IN ('verificada','denegada')
             ORDER BY g.fecha_verificacion DESC
             LIMIT 25"
        );

        $ultimas_arr = array();
        foreach ( $ultimas_raw as $row ) {
            $ultimas_arr[] = array(
                'numero'             => $row->numero,
                'estado'             => $row->estado,
                'remitente'          => $row->remitente_nombre,
                'inspector'          => $row->inspector,
                'barrera'            => $row->barrera,
                'fecha_verificacion' => $row->fecha_verificacion,
                'fecha_emision'      => $row->fecha_emision,
                'token'              => $row->token,
            );
        }

        echo json_encode( array(
            'kpi' => array(
                'total'            => $total,
                'emitidas_hoy'     => $emitidas_hoy,
                'verificadas_fecha' => $verif_fecha,
                'pendientes'       => $pendientes,
                'denegadas'        => $denegadas,
                'vencidas'         => $vencidas,
            ),
            'inspectores' => $inspectores_arr,
            'barreras'    => $barreras_arr,
            'ultimas'     => $ultimas_arr,
        ) );
        exit;
    }

    // ── Director: Ver detalle de una guía ──────────────────────────────────────
    if ( $accion === 'director_guia' ) {
        $director_auth = '';
        if ( isset( $_GET['auth'] ) ) $director_auth = sanitize_text_field( $_GET['auth'] );

        $creds = get_option( 'savean_director_creds', array() );
        if ( ! $creds || ! isset( $creds['usuario'] ) ) {
            echo json_encode( array( 'error' => 'Director no configurado' ) );
            exit;
        }

        $expected_token = md5( $creds['usuario'] . '-savean-director' );
        if ( $director_auth !== $expected_token ) {
            echo json_encode( array( 'error' => 'No autorizado' ) );
            exit;
        }

        if ( ! isset( $_GET['token'] ) ) {
            echo json_encode( array( 'error' => 'Token no proporcionado' ) );
            exit;
        }

        $token = sanitize_text_field( $_GET['token'] );
        $guia = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
                $token
            )
        );

        if ( ! $guia ) {
            echo json_encode( array( 'error' => 'Guía no encontrada' ) );
            exit;
        }

        $items = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias_items WHERE guia_id = %d",
                $guia->id
            )
        );

        echo json_encode( array(
            'guia' => $guia,
            'items' => $items,
        ) );
        exit;
    }

    // ── Director: Listar inspectores (barreristas) ─────────────────────────────
    if ( $accion === 'director_inspectores' ) {
        $director_auth = '';
        if ( isset( $_GET['auth'] ) ) $director_auth = sanitize_text_field( $_GET['auth'] );

        $creds = get_option( 'savean_director_creds', array() );
        if ( ! $creds || ! isset( $creds['usuario'] ) ) {
            echo json_encode( array( 'error' => 'Director no configurado' ) );
            exit;
        }

        $expected_token = md5( $creds['usuario'] . '-savean-director' );
        if ( $director_auth !== $expected_token ) {
            echo json_encode( array( 'error' => 'No autorizado' ) );
            exit;
        }

        $inspectores = $wpdb->get_results(
            "SELECT id, nombre, usuario, activo FROM {$wpdb->prefix}savean_inspectores WHERE activo = 1 ORDER BY nombre ASC"
        );

        echo json_encode( array( 'inspectores' => $inspectores ) );
        exit;
    }

    // ── Director: Agregar inspector (barrerista) ──────────────────────────────
    if ( $accion === 'director_inspector_add' ) {
        $director_auth = '';
        if ( isset( $_POST['auth'] ) ) $director_auth = sanitize_text_field( $_POST['auth'] );

        $creds = get_option( 'savean_director_creds', array() );
        if ( ! $creds || ! isset( $creds['usuario'] ) ) {
            echo json_encode( array( 'error' => 'Director no configurado' ) );
            exit;
        }

        $expected_token = md5( $creds['usuario'] . '-savean-director' );
        if ( $director_auth !== $expected_token ) {
            echo json_encode( array( 'error' => 'No autorizado' ) );
            exit;
        }

        $nombre = sanitize_text_field( isset($_POST['nombre']) ? $_POST['nombre'] : '' );
        $usuario = sanitize_text_field( isset($_POST['usuario']) ? $_POST['usuario'] : '' );
        $clave = isset($_POST['clave']) ? $_POST['clave'] : '';

        if ( ! $nombre || ! $usuario || ! $clave ) {
            echo json_encode( array( 'error' => 'Campos requeridos faltantes' ) );
            exit;
        }

        // Verificar que el usuario no exista
        $existe = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT id FROM {$wpdb->prefix}savean_inspectores WHERE usuario = %s",
                $usuario
            )
        );

        if ( $existe ) {
            echo json_encode( array( 'error' => 'El usuario ya existe' ) );
            exit;
        }

        $clave_hash = password_hash( $clave, PASSWORD_DEFAULT );

        $result = $wpdb->insert(
            "{$wpdb->prefix}savean_inspectores",
            array(
                'nombre' => $nombre,
                'usuario' => $usuario,
                'clave' => $clave_hash,
                'activo' => 1,
            )
        );

        if ( $result ) {
            echo json_encode( array(
                'success' => true,
                'inspector' => array(
                    'id' => $wpdb->insert_id,
                    'nombre' => $nombre,
                    'usuario' => $usuario,
                    'activo' => 1,
                )
            ) );
        } else {
            echo json_encode( array( 'error' => 'No se pudo agregar el inspector' ) );
        }
        exit;
    }

    // ── Director: Eliminar/desactivar inspector (barrerista) ───────────────────
    if ( $accion === 'director_inspector_del' ) {
        $director_auth = '';
        if ( isset( $_POST['auth'] ) ) $director_auth = sanitize_text_field( $_POST['auth'] );

        $creds = get_option( 'savean_director_creds', array() );
        if ( ! $creds || ! isset( $creds['usuario'] ) ) {
            echo json_encode( array( 'error' => 'Director no configurado' ) );
            exit;
        }

        $expected_token = md5( $creds['usuario'] . '-savean-director' );
        if ( $director_auth !== $expected_token ) {
            echo json_encode( array( 'error' => 'No autorizado' ) );
            exit;
        }

        $inspector_id = intval( isset($_POST['id']) ? $_POST['id'] : 0 );
        if ( ! $inspector_id ) {
            echo json_encode( array( 'error' => 'ID de inspector no válido' ) );
            exit;
        }

        $result = $wpdb->update(
            "{$wpdb->prefix}savean_inspectores",
            array( 'activo' => 0 ),
            array( 'id' => $inspector_id )
        );

        if ( $result !== false ) {
            echo json_encode( array( 'success' => true ) );
        } else {
            echo json_encode( array( 'error' => 'No se pudo desactivar el inspector' ) );
        }
        exit;
    }

    // ── Auth inspector (para consultar / verificar / modificar) ───────────────
    $auth_token = '';
    if ( isset( $_GET['auth'] ) ) {
        $auth_token = sanitize_text_field( $_GET['auth'] );
    } elseif ( isset( $_POST['auth'] ) ) {
        $auth_token = sanitize_text_field( $_POST['auth'] );
    }

    if ( ! $auth_token ) {
        echo json_encode( array( 'error' => 'No autorizado' ) );
        exit;
    }

    // Verificar que el token de auth corresponde a un inspector activo
    $inspector = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}savean_inspectores WHERE MD5(CONCAT(usuario, '-savean-inspector')) = %s AND activo = 1",
            $auth_token
        )
    );

    if ( ! $inspector ) {
        echo json_encode( array( 'error' => 'No autorizado' ) );
        exit;
    }

    // Consultar datos de una guía por token
    if ( $accion === 'consultar' && isset( $_GET['token'] ) ) {
        $token = sanitize_text_field( $_GET['token'] );
        $guia = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
                $token
            )
        );

        if ( ! $guia ) {
            echo json_encode( array( 'error' => 'Guia no encontrada' ) );
            exit;
        }

        $items = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias_items WHERE guia_id = %d",
                $guia->id
            )
        );

        $barrera_nombre = '';
        if ( $guia->barrera_id ) {
            $barrera_nombre = $wpdb->get_var( $wpdb->prepare("SELECT nombre FROM {$wpdb->prefix}savean_barreras WHERE id = %d", $guia->barrera_id) );
        }

        $items_arr = array();
        foreach ( $items as $item ) {
            $items_arr[] = array(
                'especie' => $item->especie,
                'variedad' => $item->variedad,
                'cantidad_bultos' => $item->cantidad_bultos,
                'kilos_por_bulto' => $item->kilos_por_bulto,
                'total_kilos' => $item->total_kilos,
                'tipo_envase' => $item->tipo_envase,
                'lugar_empaque' => $item->lugar_empaque,
                'vinedo_numero' => $item->vinedo_numero,
                'grado_seleccion' => $item->grado_seleccion,
                'tamano' => $item->tamano,
                'subproducto' => $item->subproducto,
            );
        }

        $data = array(
            'id' => $guia->id,
            'numero' => $guia->numero,
            'estado' => $guia->estado,
            'fecha_emision' => $guia->fecha_emision,
            'fecha_verificacion' => $guia->fecha_verificacion,
            'inspector' => $guia->inspector,
            'barrera_nombre' => $barrera_nombre,
            'motivo_denegacion' => $guia->motivo_denegacion,
            'remitente_nombre' => $guia->remitente_nombre,
            'remitente_renspa' => $guia->remitente_renspa,
            'remitente_inv' => $guia->remitente_inv,
            'remitente_tipo' => $guia->remitente_tipo,
            'destinatario_nombre' => $guia->destinatario_nombre,
            'destino_tipo' => $guia->destino_tipo,
            'destino_pais' => $guia->destino_pais,
            'destino_punto_salida' => $guia->destino_punto_salida,
            'destino_mercado_interno' => $guia->destino_mercado_interno,
            'transporte_empresa' => $guia->transporte_empresa,
            'transporte_conductor' => $guia->transporte_conductor,
            'transporte_tipo' => $guia->transporte_tipo,
            'transporte_camion_marca' => $guia->transporte_camion_marca,
            'transporte_camion_patente' => $guia->transporte_camion_patente,
            'transporte_acoplado_marca' => $guia->transporte_acoplado_marca,
            'transporte_acoplado_patente' => $guia->transporte_acoplado_patente,
            'transporte_precintos' => $guia->transporte_precintos,
            'email_contacto' => $guia->email_contacto,
            'items' => $items_arr,
        );

        echo json_encode( $data );
        exit;
    }

    // Verificar una guía
    if ( $accion === 'verificar' && isset( $_POST['token'] ) ) {
        $token = sanitize_text_field( $_POST['token'] );
        $barrera_id = intval( $_POST['barrera_id'] );

        $resultado = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}savean_guias SET estado = 'verificada', fecha_verificacion = %s, barrera_id = %d, inspector = %s WHERE token = %s AND estado = 'pendiente'",
                current_time('mysql'),
                $barrera_id,
                $inspector->usuario,
                $token
            )
        );

        if ( $resultado > 0 ) {
            echo json_encode( array( 'ok' => true, 'mensaje' => 'Guia verificada correctamente' ) );
        } else {
            echo json_encode( array( 'error' => 'No se pudo verificar. La guia puede estar ya verificada o vencida.' ) );
        }
        exit;
    }

    // Denegar una guía
    if ( $accion === 'denegar' && isset( $_POST['token'] ) ) {
        $token = sanitize_text_field( $_POST['token'] );
        $barrera_id = intval( $_POST['barrera_id'] );
        $motivo = sanitize_text_field( isset($_POST['motivo']) ? $_POST['motivo'] : '' );

        $resultado = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}savean_guias SET estado = 'denegada', fecha_verificacion = %s, barrera_id = %d, inspector = %s, motivo_denegacion = %s WHERE token = %s AND estado = 'pendiente'",
                current_time('mysql'),
                $barrera_id,
                $inspector->usuario,
                $motivo,
                $token
            )
        );

        if ( $resultado > 0 ) {
            echo json_encode( array( 'ok' => true, 'mensaje' => 'Guia denegada' ) );
        } else {
            echo json_encode( array( 'error' => 'No se pudo denegar.' ) );
        }
        exit;
    }

    // Modificar datos de una guía y verificarla
    if ( $accion === 'modificar' && isset( $_POST['token'] ) ) {
        $token      = sanitize_text_field( $_POST['token'] );
        $barrera_id = intval( $_POST['barrera_id'] );

        if ( ! $barrera_id ) {
            echo json_encode( array( 'error' => 'Seleccioná una barrera antes de verificar.' ) );
            exit;
        }

        $resultado = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}savean_guias SET
                    remitente_nombre        = %s,
                    remitente_renspa        = %s,
                    remitente_inv           = %s,
                    remitente_tipo          = %s,
                    destinatario_nombre     = %s,
                    transporte_empresa      = %s,
                    transporte_conductor    = %s,
                    transporte_tipo         = %s,
                    transporte_camion_marca    = %s,
                    transporte_camion_patente  = %s,
                    transporte_acoplado_marca  = %s,
                    transporte_acoplado_patente= %s,
                    transporte_precintos    = %s,
                    estado                  = 'verificada',
                    fecha_verificacion      = %s,
                    barrera_id              = %d,
                    inspector               = %s
                WHERE token = %s",
                sanitize_text_field( isset($_POST['remitente_nombre'])           ? $_POST['remitente_nombre']           : '' ),
                sanitize_text_field( isset($_POST['remitente_renspa'])           ? $_POST['remitente_renspa']           : '' ),
                sanitize_text_field( isset($_POST['remitente_inv'])              ? $_POST['remitente_inv']              : '' ),
                sanitize_text_field( isset($_POST['remitente_tipo'])             ? $_POST['remitente_tipo']             : '' ),
                sanitize_text_field( isset($_POST['destinatario_nombre'])        ? $_POST['destinatario_nombre']        : '' ),
                sanitize_text_field( isset($_POST['transporte_empresa'])         ? $_POST['transporte_empresa']         : '' ),
                sanitize_text_field( isset($_POST['transporte_conductor'])       ? $_POST['transporte_conductor']       : '' ),
                sanitize_text_field( isset($_POST['transporte_tipo'])            ? $_POST['transporte_tipo']            : '' ),
                sanitize_text_field( isset($_POST['transporte_camion_patente'])  ? $_POST['transporte_camion_patente']  : '' ),
                sanitize_text_field( isset($_POST['transporte_acoplado_patente'])? $_POST['transporte_acoplado_patente']: '' ),
                current_time('mysql'),
                $barrera_id,
                $inspector->usuario,
                $token
            )
        );

        if ( $resultado > 0 ) {
            echo json_encode( array( 'ok' => true, 'mensaje' => 'Guia modificada y verificada' ) );
        } else {
            echo json_encode( array( 'error' => 'No se pudo modificar. La guía puede estar ya verificada o vencida.' ) );
        }
        exit;
    }

    echo json_encode( array( 'error' => 'Accion no valida' ) );
    exit;
}

// Página de verificación pública (cuando se escanea el QR)
add_action( 'init', 'savean_verificar_guia_publica' );

function savean_verificar_guia_publica() {
    if ( ! isset( $_GET['savean_verificar'] ) ) return;

    $token = sanitize_text_field( $_GET['savean_verificar'] );

    global $wpdb;
    $guia = $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
            $token
        )
    );

    // Verificar si el inspector está logueado
    if ( !session_id() && !headers_sent() ) session_start();
    $es_inspector = isset( $_SESSION['savean_inspector'] );

    // Procesar verificación si el inspector la confirma
    $verificacion_exitosa = false;
    if ( $es_inspector && isset( $_POST['savean_verificar_desde_qr'] ) && $guia && $guia->estado === 'pendiente' ) {
        $barrera_id = intval( $_POST['barrera_id'] );
        $resultado = $wpdb->query(
            $wpdb->prepare(
                "UPDATE {$wpdb->prefix}savean_guias SET estado = 'verificada', fecha_verificacion = %s, barrera_id = %d, inspector = %s WHERE id = %d AND estado = 'pendiente'",
                current_time('mysql'),
                $barrera_id,
                $_SESSION['savean_inspector'],
                $guia->id
            )
        );
        if ( $resultado !== false ) {
            $verificacion_exitosa = true;
        }
        // Recargar la guía
        $guia = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
                $token
            )
        );
    }

    $items = array();
    if ( $guia ) {
        $items = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias_items WHERE guia_id = %d",
                $guia->id
            )
        );
    }

    // Obtener barreras para el inspector
    $barreras = array();
    if ( $es_inspector ) {
        $barreras = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}savean_barreras WHERE activa = 1 ORDER BY nombre ASC" );
    }

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificación de Guía - SAVEAN</title>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Ubuntu', Arial, sans-serif; background: #f5f5f5; color: #333; min-height: 100vh; }
            .sv-header { background: linear-gradient(135deg, #EC6608, #FF9A1D); padding: 20px; text-align: center; }
            .sv-header h1 { color: white; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
            .sv-header p { color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 4px; }
            .sv-container { max-width: 600px; margin: 0 auto; padding: 20px; }

            .sv-status-card {
                border-radius: 12px; padding: 24px; text-align: center;
                margin-bottom: 20px; border: 2px solid;
            }
            .sv-status-pendiente { background: #FFF8F0; border-color: #FF9A1D; }
            .sv-status-verificada { background: #f0faf0; border-color: #2e7d32; }
            .sv-status-vencida { background: #fef0f0; border-color: #c62828; }
            .sv-status-error { background: #fef0f0; border-color: #c62828; }

            .sv-status-icon { font-size: 48px; margin-bottom: 8px; }
            .sv-status-text { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
            .sv-status-pendiente .sv-status-text { color: #FF9A1D; }
            .sv-status-verificada .sv-status-text { color: #2e7d32; }
            .sv-status-vencida .sv-status-text { color: #c62828; }
            .sv-status-error .sv-status-text { color: #c62828; }
            .sv-numero { font-size: 28px; font-weight: 700; color: #EC6608; margin-bottom: 4px; }
            .sv-fecha { font-size: 13px; color: #888; }

            .sv-card {
                background: white; border-radius: 10px; padding: 20px;
                margin-bottom: 16px; border: 1px solid #e8e8e8;
            }
            .sv-card h3 {
                font-size: 14px; color: #EC6608; font-weight: 700;
                border-bottom: 2px solid #EC6608; padding-bottom: 6px;
                margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;
            }
            .sv-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f5f5f5; }
            .sv-row:last-child { border-bottom: none; }
            .sv-label { font-size: 13px; color: #888; }
            .sv-value { font-size: 13px; font-weight: 500; color: #333; text-align: right; }

            .sv-item { background: #fafafa; border-radius: 6px; padding: 12px; margin-bottom: 8px; }
            .sv-item-header { font-size: 13px; font-weight: 700; color: #EC6608; margin-bottom: 6px; }

            .sv-inspector-box {
                background: #E8F5E9; border: 2px solid #2e7d32; border-radius: 12px;
                padding: 20px; margin-bottom: 16px; text-align: center;
            }
            .sv-inspector-box h3 { color: #2e7d32; font-size: 16px; margin-bottom: 12px; border: none; padding: 0; text-transform: none; }
            .sv-inspector-box select {
                width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px;
                font-size: 14px; margin-bottom: 12px; font-family: 'Ubuntu', sans-serif;
            }
            .sv-btn-verificar {
                background: #2e7d32; color: white; border: none; padding: 14px 30px;
                border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer;
                width: 100%; font-family: 'Ubuntu', sans-serif;
            }
            .sv-btn-verificar:hover { background: #1b5e20; }

            .sv-verificada-info {
                background: #E8F5E9; border-radius: 8px; padding: 12px; margin-top: 12px;
            }
            .sv-verificada-info .sv-row { border-color: #c8e6c9; }

            .sv-footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
            .sv-footer a { color: #EC6608; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="sv-header">
            <h1>SAVEAN</h1>
            <p>Verificación de Guía de Origen</p>
        </div>
        <div class="sv-container">

        <?php if ( ! $guia ) : ?>
            <div class="sv-status-card sv-status-error">
                <div class="sv-status-icon">❌</div>
                <div class="sv-status-text">Guía no encontrada</div>
                <p style="color:#888; font-size:14px; margin-top:8px;">El código escaneado no corresponde a ninguna guía registrada.</p>
            </div>

        <?php else : ?>

            <!-- Estado -->
            <div class="sv-status-card sv-status-<?php echo esc_attr($guia->estado); ?>">
                <?php if ( $guia->estado === 'pendiente' ) : ?>
                    <div class="sv-status-icon">⏳</div>
                    <div class="sv-status-text">PENDIENTE DE VERIFICACIÓN</div>
                <?php elseif ( $guia->estado === 'verificada' ) : ?>
                    <div class="sv-status-icon">✅</div>
                    <div class="sv-status-text">GUÍA VERIFICADA</div>
                <?php else : ?>
                    <div class="sv-status-icon">⛔</div>
                    <div class="sv-status-text">GUÍA VENCIDA</div>
                <?php endif; ?>
                <div class="sv-numero"><?php echo esc_html($guia->numero); ?></div>
                <div class="sv-fecha">Emitida: <?php echo date('d/m/Y H:i', strtotime($guia->fecha_emision)); ?></div>
                <?php if ( $guia->estado === 'pendiente' ) : ?>
                    <div class="sv-fecha" style="color:#FF9A1D; font-weight:500; margin-top:4px;">Válida hasta: <?php echo date('d/m/Y', strtotime($guia->fecha_emision . ' +20 days')); ?></div>
                <?php endif; ?>
            </div>

            <!-- Botón de verificar para inspectores logueados -->
            <?php if ( $es_inspector && $guia->estado === 'pendiente' ) : ?>
            <div class="sv-inspector-box">
                <h3>Inspector: <?php echo esc_html($_SESSION['savean_inspector']); ?></h3>
                <form method="post">
                    <select name="barrera_id" required>
                        <option value="">-- Seleccionar barrera --</option>
                        <?php foreach ( $barreras as $b ) : ?>
                            <option value="<?php echo $b->id; ?>"><?php echo esc_html($b->nombre); ?></option>
                        <?php endforeach; ?>
                    </select>
                    <button type="submit" name="savean_verificar_desde_qr" class="sv-btn-verificar">✓ Verificar esta Guía</button>
                </form>
            </div>
            <?php endif; ?>

            <!-- Info de verificación si ya fue verificada -->
            <?php if ( $guia->estado === 'verificada' ) : ?>
            <div class="sv-verificada-info">
                <div class="sv-row"><span class="sv-label">Verificada el</span><span class="sv-value"><?php echo date('d/m/Y H:i', strtotime($guia->fecha_verificacion)); ?></span></div>
                <div class="sv-row"><span class="sv-label">Inspector</span><span class="sv-value"><?php echo esc_html($guia->inspector); ?></span></div>
                <?php
                if ( $guia->barrera_id ) {
                    $barrera_nombre = $wpdb->get_var( $wpdb->prepare("SELECT nombre FROM {$wpdb->prefix}savean_barreras WHERE id = %d", $guia->barrera_id) );
                    if ( $barrera_nombre ) {
                        echo '<div class="sv-row"><span class="sv-label">Barrera</span><span class="sv-value">' . esc_html($barrera_nombre) . '</span></div>';
                    }
                }
                ?>
            </div>
            <?php endif; ?>

            <!-- Datos de la guía -->
            <div class="sv-card">
                <h3>Remitente</h3>
                <div class="sv-row"><span class="sv-label">Nombre / Razón Social</span><span class="sv-value"><?php echo esc_html($guia->remitente_nombre); ?></span></div>
                <?php if ($guia->remitente_renspa) : ?>
                <div class="sv-row"><span class="sv-label">RENSPA</span><span class="sv-value"><?php echo esc_html($guia->remitente_renspa); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->remitente_inv) : ?>
                <div class="sv-row"><span class="sv-label">INV N°</span><span class="sv-value"><?php echo esc_html($guia->remitente_inv); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->remitente_tipo) : ?>
                <div class="sv-row"><span class="sv-label">Tipo</span><span class="sv-value"><?php echo esc_html($guia->remitente_tipo); ?></span></div>
                <?php endif; ?>
            </div>

            <div class="sv-card">
                <h3>Destinatario</h3>
                <div class="sv-row"><span class="sv-label">Nombre / Razón Social</span><span class="sv-value"><?php echo esc_html($guia->destinatario_nombre); ?></span></div>
                <div class="sv-row"><span class="sv-label">Destino</span><span class="sv-value"><?php echo esc_html($guia->destino_tipo); ?></span></div>
                <?php if ($guia->destino_pais) : ?>
                <div class="sv-row"><span class="sv-label">País</span><span class="sv-value"><?php echo esc_html($guia->destino_pais); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->destino_punto_salida) : ?>
                <div class="sv-row"><span class="sv-label">Punto de Salida</span><span class="sv-value"><?php echo esc_html($guia->destino_punto_salida); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->destino_mercado_interno) : ?>
                <div class="sv-row"><span class="sv-label">Mercado Interno</span><span class="sv-value"><?php echo esc_html($guia->destino_mercado_interno); ?></span></div>
                <?php endif; ?>
            </div>

            <?php if ( $items ) : ?>
            <div class="sv-card">
                <h3>Mercadería</h3>
                <?php foreach ( $items as $idx => $item ) : ?>
                <div class="sv-item">
                    <div class="sv-item-header">Producto <?php echo ($idx + 1); ?></div>
                    <?php if ($item->especie) : ?>
                    <div class="sv-row"><span class="sv-label">Especie</span><span class="sv-value"><?php echo esc_html($item->especie); ?></span></div>
                    <?php endif; ?>
                    <?php if ($item->variedad) : ?>
                    <div class="sv-row"><span class="sv-label">Variedad</span><span class="sv-value"><?php echo esc_html($item->variedad); ?></span></div>
                    <?php endif; ?>
                    <?php if ($item->cantidad_bultos) : ?>
                    <div class="sv-row"><span class="sv-label">Bultos</span><span class="sv-value"><?php echo esc_html($item->cantidad_bultos); ?></span></div>
                    <?php endif; ?>
                    <?php if ($item->total_kilos) : ?>
                    <div class="sv-row"><span class="sv-label">Total Kg</span><span class="sv-value"><?php echo esc_html($item->total_kilos); ?></span></div>
                    <?php endif; ?>
                    <?php if ($item->tipo_envase) : ?>
                    <div class="sv-row"><span class="sv-label">Envase</span><span class="sv-value"><?php echo esc_html($item->tipo_envase); ?></span></div>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <div class="sv-card">
                <h3>Transporte</h3>
                <?php if ($guia->transporte_empresa) : ?>
                <div class="sv-row"><span class="sv-label">Empresa</span><span class="sv-value"><?php echo esc_html($guia->transporte_empresa); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->transporte_conductor) : ?>
                <div class="sv-row"><span class="sv-label">Transportista</span><span class="sv-value"><?php echo esc_html($guia->transporte_conductor); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->transporte_tipo) : ?>
                <div class="sv-row"><span class="sv-label">Tipo</span><span class="sv-value"><?php echo esc_html($guia->transporte_tipo); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->transporte_camion_patente) : ?>
                <div class="sv-row"><span class="sv-label">Camión</span><span class="sv-value"><?php echo esc_html($guia->transporte_camion_marca . ' - ' . $guia->transporte_camion_patente); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->transporte_acoplado_patente) : ?>
                <div class="sv-row"><span class="sv-label">Acoplado</span><span class="sv-value"><?php echo esc_html($guia->transporte_acoplado_marca . ' - ' . $guia->transporte_acoplado_patente); ?></span></div>
                <?php endif; ?>
                <?php if ($guia->transporte_precintos) : ?>
                <div class="sv-row"><span class="sv-label">Precintos</span><span class="sv-value"><?php echo esc_html($guia->transporte_precintos); ?></span></div>
                <?php endif; ?>
            </div>

        <?php endif; ?>

        </div>
        <div class="sv-footer">
            <p>SAVEAN — Agencia Calidad San Juan</p>
            <p><a href="<?php echo savean_url('/savean/'); ?>">agenciacalidadsanjuan.com.ar/savean</a></p>
        </div>
    </body>
    </html>
    <?php
    exit;
}

function savean_registrar_cron() {
    if ( ! wp_next_scheduled( 'savean_cron_vencimiento' ) ) {
        wp_schedule_event( time(), 'hourly', 'savean_cron_vencimiento' );
    }
}

add_action( 'savean_cron_vencimiento', 'savean_procesar_vencimientos' );

function savean_procesar_vencimientos() {
    global $wpdb;
    $wpdb->query(
        "UPDATE {$wpdb->prefix}savean_guias 
         SET estado = 'vencida' 
         WHERE estado = 'pendiente' 
         AND fecha_emision < DATE_SUB(NOW(), INTERVAL 20 DAY)"
    );
}

// Shortcode del panel de inspectores
add_shortcode( 'savean_panel', 'savean_render_panel' );

function savean_render_panel() {
    ob_start();

    // Iniciar sesión SIEMPRE al principio
    if ( !session_id() && !headers_sent() ) {
        session_start();
    }

    // Manejar login
    if ( isset( $_POST['savean_login'] ) ) {
        $usuario = sanitize_text_field( $_POST['inspector_usuario'] );
        $clave   = $_POST['inspector_clave'];

        global $wpdb;
        $inspector = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_inspectores WHERE usuario = %s AND activo = 1",
                $usuario
            )
        );

        if ( $inspector && password_verify( $clave, $inspector->clave ) ) {
            $_SESSION['savean_inspector'] = $usuario;
            $_SESSION['savean_inspector_nombre'] = $inspector->nombre;
        } else {
            echo '<p style="color:#c62828;font-weight:bold;padding:10px;background:#fef0f0;border-radius:6px;border:1px solid #c62828;">Usuario o contraseña incorrectos.</p>';
        }
    }

    // Manejar logout
    if ( isset( $_GET['savean_logout'] ) ) {
        session_destroy();
        wp_redirect( get_permalink() );
        exit;
    }

    // Verificar sesión
    $logueado = isset( $_SESSION['savean_inspector'] );

    // Manejar verificación de guía (solo si está logueado)
    $msg_verificacion = '';
    if ( $logueado && isset( $_POST['savean_verificar_guia'] ) ) {
        $token = sanitize_text_field( $_POST['token_guia'] );
        $barrera_id = intval( $_POST['barrera_id'] );
        global $wpdb;

        $guia = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}savean_guias WHERE token = %s",
                $token
            )
        );

        if ( ! $guia ) {
            $msg_verificacion = '<div style="background:#fef0f0; border:2px solid #c62828; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center; color:#c62828; font-weight:700;">Guia no encontrada.</div>';
        } elseif ( $guia->estado === 'vencida' ) {
            $msg_verificacion = '<div style="background:#fef0f0; border:2px solid #c62828; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center; color:#c62828; font-weight:700;">Esta guia esta VENCIDA.</div>';
        } elseif ( $guia->estado === 'verificada' ) {
            $msg_verificacion = '<div style="background:#FFF8F0; border:2px solid #FF9A1D; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center; color:#FF9A1D; font-weight:700;">Esta guia ya fue verificada anteriormente.</div>';
        } else {
            $resultado = $wpdb->query(
                $wpdb->prepare(
                    "UPDATE {$wpdb->prefix}savean_guias SET estado = 'verificada', fecha_verificacion = %s, barrera_id = %d, inspector = %s WHERE id = %d AND estado = 'pendiente'",
                    current_time('mysql'),
                    $barrera_id,
                    $_SESSION['savean_inspector'],
                    $guia->id
                )
            );
            if ( $resultado !== false && $resultado > 0 ) {
                $msg_verificacion = '<div style="background:#f0faf0; border:2px solid #2e7d32; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center; color:#2e7d32; font-weight:700; font-size:18px;">Guia ' . esc_html($guia->numero) . ' verificada correctamente.</div>';
            } else {
                $msg_verificacion = '<div style="background:#fef0f0; border:2px solid #c62828; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center; color:#c62828; font-weight:700;">Error al verificar la guia. Intente nuevamente.</div>';
            }
        }
    }

    if ( ! $logueado ) {
        ?>
        <div id="savean-root">
        <div id="savean-login">
            <h2>Panel de Inspectores - SAVEAN</h2>
            <form method="post">
                <label>Usuario</label>
                <input type="text" name="inspector_usuario" required autocomplete="username">
                <label>Contraseña</label>
                <input type="password" name="inspector_clave" required autocomplete="current-password">
                <br><br>
                <button type="submit" name="savean_login">Ingresar</button>
            </form>
        </div>
        </div>
        <?php
    } else {
        global $wpdb;
        $barreras = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}savean_barreras WHERE activa = 1" );
        $nombre_inspector = isset($_SESSION['savean_inspector_nombre']) ? $_SESSION['savean_inspector_nombre'] : $_SESSION['savean_inspector'];
        $verificadas_hoy = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}savean_guias WHERE inspector = %s AND DATE(fecha_verificacion) = CURDATE()",
                $_SESSION['savean_inspector']
            )
        );
        $busqueda = isset($_GET['buscar_guia']) ? sanitize_text_field($_GET['buscar_guia']) : '';
        if ( $busqueda ) {
            $ultimas = $wpdb->get_results( $wpdb->prepare(
                "SELECT g.numero, g.estado, g.fecha_emision, g.fecha_verificacion, g.inspector, b.nombre as barrera
                 FROM {$wpdb->prefix}savean_guias g
                 LEFT JOIN {$wpdb->prefix}savean_barreras b ON g.barrera_id = b.id
                 WHERE g.numero LIKE %s ORDER BY g.fecha_emision DESC LIMIT 10",
                '%' . $busqueda . '%'
            ) );
        } else {
            $ultimas = $wpdb->get_results(
                "SELECT g.numero, g.estado, g.fecha_emision, g.fecha_verificacion, g.inspector, b.nombre as barrera
                 FROM {$wpdb->prefix}savean_guias g
                 LEFT JOIN {$wpdb->prefix}savean_barreras b ON g.barrera_id = b.id
                 ORDER BY g.fecha_emision DESC LIMIT 10"
            );
        }
        ?>
        <div id="savean-root">
        <div id="savean-panel">
            <h2>Panel de Inspectores - SAVEAN</h2>

            <!-- Cabecera del inspector -->
            <div style="background:#1a1a1a; border-radius:8px; padding:12px 16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                    <span style="color:#aaa; font-size:12px; display:block;">Inspector</span>
                    <strong style="color:#ffffff; font-size:16px;"><?php echo esc_html($nombre_inspector); ?></strong>
                </div>
                <div style="text-align:center;">
                    <span style="color:#aaa; font-size:12px; display:block;">Verificadas hoy</span>
                    <strong style="color:#EC6608; font-size:20px;" id="savean-count-hoy"><?php echo intval($verificadas_hoy); ?></strong>
                </div>
                <a href="?savean_logout=1" style="color:#ffffff; background:#c62828; padding:8px 16px; border-radius:6px; text-decoration:none; font-size:13px; font-weight:700;">Salir</a>
            </div>

            <!-- Sección de escaneo -->
            <div id="savean-seccion-escaneo">
                <h3>Escanear QR de la Guia</h3>

                <!-- Contenedor de video -->
                <div id="savean-scanner-container" style="display:none; position:relative; margin-bottom:15px;">
                    <video id="savean-video"
                           style="width:100%; border-radius:8px; border:2px solid #EC6608; background:#000; display:block;"
                           playsinline
                           webkit-playsinline
                           muted
                           autoplay></video>
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:180px; height:180px; border:3px solid #EC6608; border-radius:12px; pointer-events:none; box-shadow:0 0 0 9999px rgba(0,0,0,0.35);"></div>
                    <p style="position:absolute; bottom:8px; left:0; right:0; text-align:center; color:white; font-size:12px; margin:0; text-shadow:0 1px 3px rgba(0,0,0,0.8);">Apuntá la cámara al código QR</p>
                </div>

                <button type="button" id="savean-btn-scan" onclick="saveanToggleScanner()"
                        style="background:#EC6608; color:white; border:none; padding:14px 30px; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer; width:100%; margin-bottom:15px; font-family:'Ubuntu',sans-serif;">
                    Abrir Cámara para Escanear
                </button>

                <h3>O ingresá el token manualmente</h3>
                <div style="display:flex; gap:8px; margin-bottom:15px;">
                    <input type="text" id="savean-token-input" placeholder="Token del QR"
                           style="flex:1; padding:10px 12px; border:1px solid #ccc; border-radius:4px; font-size:14px; color:#1a1a1a;">
                    <button type="button" onclick="saveanConsultarGuia()"
                            style="background:#EC6608; color:white; border:none; padding:10px 20px; border-radius:4px; font-size:14px; cursor:pointer; font-weight:700; white-space:nowrap;">
                        Consultar
                    </button>
                </div>

                <div id="savean-scan-result" style="display:none; border:2px solid; border-radius:8px; padding:14px; margin-bottom:15px;">
                    <p style="font-weight:700; font-size:15px; margin:0;" id="savean-scan-msg"></p>
                </div>
            </div>

            <!-- Datos de la guía -->
            <div id="savean-datos-guia" style="display:none; padding-bottom:120px;">

                <div id="savean-guia-estado" style="border-radius:8px; padding:18px; text-align:center; margin-bottom:15px; border:2px solid;"></div>

                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:15px; margin-bottom:12px;">
                    <h3 style="margin-top:0; color:#EC6608;">Remitente</h3>
                    <div id="savean-datos-remitente"></div>
                </div>

                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:15px; margin-bottom:12px;">
                    <h3 style="margin-top:0; color:#EC6608;">Destinatario</h3>
                    <div id="savean-datos-destinatario"></div>
                </div>

                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:15px; margin-bottom:12px;">
                    <h3 style="margin-top:0; color:#EC6608;">Mercadería</h3>
                    <div id="savean-datos-mercaderia"></div>
                </div>

                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:15px; margin-bottom:12px;">
                    <h3 style="margin-top:0; color:#EC6608;">Transporte</h3>
                    <div id="savean-datos-transporte"></div>
                </div>

                <div id="savean-ya-procesada-info" style="display:none; background:white; border:1px solid #e0e0e0; border-radius:8px; padding:15px; margin-bottom:12px;">
                    <h3 style="margin-top:0; color:#EC6608;">Información de Verificación</h3>
                    <div id="savean-verificacion-detalle"></div>
                </div>
            </div>

            <!-- Barra fija — guías PENDIENTE -->
            <div id="savean-sticky-acciones" style="display:none; position:fixed; bottom:0; left:0; right:0; background:white; border-top:2px solid #e0e0e0; padding:10px 16px; z-index:9999; box-shadow:0 -3px 10px rgba(0,0,0,0.15);">
                <div style="max-width:800px; margin:0 auto;">
                    <div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
                        <label style="font-weight:bold; font-size:13px; white-space:nowrap; margin:0; color:#1a1a1a;">Barrera:</label>
                        <select id="savean-barrera-select" style="flex:1; padding:8px; border:1px solid #ccc; border-radius:6px; font-size:14px; color:#1a1a1a;">
                            <option value="">-- Seleccionar --</option>
                            <?php foreach ( $barreras as $barrera ) : ?>
                                <option value="<?php echo intval($barrera->id); ?>"><?php echo esc_html($barrera->nombre); ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" onclick="saveanVerificar()"
                                style="flex:1; background:#2e7d32; color:white; border:none; padding:14px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer;">
                            VERIFICAR
                        </button>
                        <button type="button" onclick="saveanModificar()"
                                style="flex:1; background:#1565C0; color:white; border:none; padding:14px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer;">
                            MODIFICAR
                        </button>
                        <button type="button" onclick="saveanNuevaConsulta()"
                                style="background:white; color:#EC6608; border:2px solid #EC6608; padding:14px 12px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; white-space:nowrap;">
                            Nueva
                        </button>
                    </div>
                </div>
            </div>

            <!-- Barra fija — guías ya procesadas -->
            <div id="savean-sticky-ya-procesada" style="display:none; position:fixed; bottom:0; left:0; right:0; background:white; border-top:2px solid #e0e0e0; padding:10px 16px; z-index:9999; box-shadow:0 -3px 10px rgba(0,0,0,0.15);">
                <div style="max-width:800px; margin:0 auto;">
                    <button type="button" onclick="saveanNuevaConsulta()"
                            style="width:100%; background:#EC6608; color:white; border:none; padding:14px; border-radius:8px; font-size:16px; font-weight:700; cursor:pointer;">
                        Escanear otra guía
                    </button>
                </div>
            </div>

            <!-- Modal de Modificación -->
            <div id="savean-modal-modificar" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:10000; overflow-y:auto; padding:20px 0;">
                <div style="background:white; max-width:680px; margin:0 auto; border-radius:12px; overflow:hidden;">
                    <div style="background:#1565C0; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; color:white; font-size:17px;">Modificar Datos de la Guía</h3>
                        <button type="button" onclick="saveanCerrarModal()" style="background:transparent; border:none; color:white; font-size:22px; cursor:pointer; line-height:1;">✕</button>
                    </div>
                    <div style="padding:20px;">
                        <p style="margin:0 0 16px; font-size:13px; color:#555; background:#e3f2fd; padding:10px 14px; border-radius:6px; border-left:4px solid #1565C0;">
                            Corregí los datos incorrectos y luego presioná <strong>VERIFICAR</strong> para confirmar el paso del camión.
                        </p>

                        <h4 style="color:#EC6608; margin:0 0 10px; font-size:14px; border-bottom:1px solid #eee; padding-bottom:6px;">Remitente</h4>
                        <div style="display:grid; gap:8px; margin-bottom:16px;">
                            <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Nombre / Razón Social</label>
                            <input type="text" id="mod-remitente-nombre" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">RENSPA N°</label>
                                <input type="text" id="mod-remitente-renspa" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">INV N°</label>
                                <input type="text" id="mod-remitente-inv" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                            </div>
                            <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Tipo de Remitente</label>
                            <select id="mod-remitente-tipo" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;">
                                <option value="">-- Seleccionar --</option>
                                <option value="Galpón de Empaque">Galpón de Empaque</option>
                                <option value="Cámara de Frío">Cámara de Frío</option>
                                <option value="Productor">Productor</option>
                                <option value="Industria">Industria</option>
                            </select></div>
                        </div>

                        <h4 style="color:#EC6608; margin:0 0 10px; font-size:14px; border-bottom:1px solid #eee; padding-bottom:6px;">Destinatario</h4>
                        <div style="display:grid; gap:8px; margin-bottom:16px;">
                            <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Nombre / Razón Social</label>
                            <input type="text" id="mod-destinatario-nombre" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                        </div>

                        <h4 style="color:#EC6608; margin:0 0 10px; font-size:14px; border-bottom:1px solid #eee; padding-bottom:6px;">Transporte</h4>
                        <div style="display:grid; gap:8px; margin-bottom:20px;">
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Empresa</label>
                                <input type="text" id="mod-transporte-empresa" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Conductor</label>
                                <input type="text" id="mod-transporte-conductor" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                            </div>
                            <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Tipo de Transporte</label>
                            <select id="mod-transporte-tipo" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;">
                                <option value="">-- Seleccionar --</option>
                                <option value="Térmico">Térmico</option>
                                <option value="Refrigerado">Refrigerado</option>
                                <option value="Otro">Otro</option>
                            </select></div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Camión Marca</label>
                                <input type="text" id="mod-camion-marca" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Camión Patente</label>
                                <input type="text" id="mod-camion-patente" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Acoplado Marca</label>
                                <input type="text" id="mod-acoplado-marca" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                                <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Acoplado Patente</label>
                                <input type="text" id="mod-acoplado-patente" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                            </div>
                            <div><label style="font-size:12px; font-weight:600; color:#333; display:block; margin-bottom:3px;">Precintos N°</label>
                            <input type="text" id="mod-transporte-precintos" style="width:100%; padding:8px 10px; border:1px solid #ccc; border-radius:6px; font-size:14px; box-sizing:border-box;"></div>
                        </div>

                        <div style="display:flex; gap:10px;">
                            <button type="button" onclick="saveanCerrarModal()"
                                    style="flex:1; background:white; color:#555; border:2px solid #ccc; padding:14px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer;">
                                CANCELAR
                            </button>
                            <button type="button" onclick="saveanGuardarYVerificar()"
                                    style="flex:2; background:#2e7d32; color:white; border:none; padding:14px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer;">
                                VERIFICAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Historial -->
            <div id="savean-historial">
                <h3>Últimas guías</h3>
                <div style="margin-bottom:12px;">
                    <form method="get" style="display:flex; gap:8px;">
                        <input type="text" name="buscar_guia" placeholder="Buscar por N° de guía..."
                               value="<?php echo esc_attr($busqueda); ?>"
                               style="flex:1; padding:8px 12px; border:1px solid #ccc; border-radius:4px; font-size:13px; color:#1a1a1a;">
                        <button type="submit"
                                style="background:#EC6608; color:white; border:none; padding:8px 16px; border-radius:4px; font-size:13px; cursor:pointer;">
                            Buscar
                        </button>
                        <?php if ($busqueda) : ?>
                        <a href="<?php echo esc_url(get_permalink()); ?>"
                           style="padding:8px 12px; font-size:13px; color:#555; text-decoration:none; line-height:2;">
                            Limpiar
                        </a>
                        <?php endif; ?>
                    </form>
                </div>
                <?php if ($ultimas) : ?>
                <table style="width:100%; border-collapse:collapse; font-size:12px;">
                    <tr style="background:#EC6608;">
                        <th style="padding:7px 5px; color:white; text-align:left;">Guía</th>
                        <th style="padding:7px 5px; color:white; text-align:center;">Estado</th>
                        <th style="padding:7px 5px; color:white; text-align:left; display:none;" class="savean-col-barrera">Barrera</th>
                        <th style="padding:7px 5px; color:white; text-align:right;">Fecha</th>
                    </tr>
                    <?php foreach ($ultimas as $g) :
                        $badge_color = '#FF9A1D'; $badge_label = 'Pend.';
                        if ($g->estado === 'verificada') { $badge_color = '#2e7d32'; $badge_label = 'Verif.'; }
                        elseif ($g->estado === 'vencida')  { $badge_color = '#c62828'; $badge_label = 'Venc.'; }
                        elseif ($g->estado === 'denegada') { $badge_color = '#c62828'; $badge_label = 'Deneg.'; }
                        $fecha = $g->fecha_verificacion ? $g->fecha_verificacion : $g->fecha_emision;
                    ?>
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:6px 5px; color:#1a1a1a; font-weight:bold; font-size:11px;"><?php echo esc_html($g->numero); ?></td>
                        <td style="padding:6px 5px; text-align:center;">
                            <span style="background:<?php echo $badge_color; ?>; color:white; padding:2px 7px; border-radius:8px; font-size:10px; font-weight:700;"><?php echo $badge_label; ?></span>
                        </td>
                        <td style="padding:6px 5px; color:#555; font-size:11px; display:none;" class="savean-col-barrera"><?php echo esc_html($g->barrera); ?></td>
                        <td style="padding:6px 5px; color:#555; font-size:10px; text-align:right;"><?php echo esc_html(substr($fecha, 0, 16)); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </table>
                <?php else : ?>
                <p style="color:#666; font-size:13px;">No hay guías aún.</p>
                <?php endif; ?>
            </div>

        </div><!-- #savean-panel -->
        </div><!-- #savean-root -->

        <script type="text/javascript">
        // ─── Estado global ───────────────────────────────────────────────────────
        var savean = {
            scanning:      false,
            stream:        null,
            detector:      null,
            jsQRReady:     false,
            jsQRFailed:    false,
            currentToken:  '',
            currentData:   null,
            siteUrl:       '<?php echo esc_js(savean_url()); ?>',
            authToken:     '<?php echo md5((isset($_SESSION['savean_inspector']) ? $_SESSION['savean_inspector'] : '') . '-savean-inspector'); ?>'
        };

        // ─── Intentar BarcodeDetector nativo ────────────────────────────────────
        try {
            if ('BarcodeDetector' in window) {
                savean.detector = new BarcodeDetector({ formats: ['qr_code'] });
            }
        } catch(e) {
            savean.detector = null;
        }

        // ─── Cargar jsQR como fallback ───────────────────────────────────────────
        if (!savean.detector) {
            (function() {
                function tryLoad(url, fallback) {
                    var s = document.createElement('script');
                    s.src = url;
                    s.onload = function() { savean.jsQRReady = true; };
                    s.onerror = function() {
                        if (fallback) {
                            tryLoad(fallback, null);
                        } else {
                            savean.jsQRFailed = true;
                        }
                    };
                    document.head.appendChild(s);
                }
                tryLoad(
                    'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js',
                    'https://unpkg.com/jsqr@1.4.0/dist/jsQR.min.js'
                );
            })();
        }

        // ─── Liberar cámara al salir ─────────────────────────────────────────────
        window.addEventListener('beforeunload', function() {
            saveanStopScanner();
        });

        // ─── Toggle cámara ───────────────────────────────────────────────────────
        function saveanToggleScanner() {
            var container = document.getElementById('savean-scanner-container');
            var btn       = document.getElementById('savean-btn-scan');

            if (savean.scanning) {
                saveanStopScanner();
                container.style.display = 'none';
                btn.textContent  = 'Abrir Cámara para Escanear';
                btn.style.background = '#EC6608';
                return;
            }

            // Verificar HTTPS (requerido para getUserMedia)
            if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                saveanMsg('La cámara requiere que el sitio use HTTPS. Contactá al administrador.', 'error');
                return;
            }

            // Verificar soporte de getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                saveanMsg('Tu navegador no soporta acceso a la cámara. Usá Chrome o Safari actualizado.', 'error');
                return;
            }

            // Verificar que jsQR esté listo (si BarcodeDetector no está disponible)
            if (!savean.detector) {
                if (savean.jsQRFailed) {
                    saveanMsg('No se pudo cargar el lector de QR. Verificá tu conexión e intentá recargar la página.', 'error');
                    return;
                }
                if (!savean.jsQRReady) {
                    saveanMsg('Cargando lector QR... esperá un momento e intentá de nuevo.', 'error');
                    return;
                }
            }

            container.style.display = 'block';
            btn.textContent  = 'Cerrar Cámara';
            btn.style.background = '#c62828';
            saveanStartScanner();
        }

        // ─── Iniciar cámara ──────────────────────────────────────────────────────
        function saveanStartScanner() {
            var video = document.getElementById('savean-video');

            function onError(err) {
                saveanStopScanner();
                document.getElementById('savean-scanner-container').style.display = 'none';
                var btn = document.getElementById('savean-btn-scan');
                btn.textContent  = 'Abrir Cámara para Escanear';
                btn.style.background = '#EC6608';

                var msg = 'No se pudo acceder a la cámara.';
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    msg = 'Permiso de cámara denegado. Andá a Configuración > Privacidad y habilitá la cámara para este sitio, luego recargá la página.';
                } else if (err.name === 'NotFoundError') {
                    msg = 'No se encontró cámara en el dispositivo.';
                } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                    msg = 'La cámara está en uso por otra app. Cerrá otras apps y volvé a intentar.';
                } else {
                    msg = 'Error al acceder a la cámara: ' + err.message;
                }
                saveanMsg(msg, 'error');
            }

            // Intentar cámara trasera, con fallback a cualquier cámara
            navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
                .catch(function() {
                    return navigator.mediaDevices.getUserMedia({ video: true });
                })
                .then(function(stream) {
                    savean.stream   = stream;
                    video.srcObject = stream;
                    savean.scanning = true;

                    var playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(function() { setTimeout(saveanScanFrame, 800); })
                            .catch(onError);
                    } else {
                        setTimeout(saveanScanFrame, 1000);
                    }
                })
                .catch(onError);
        }

        // ─── Detener cámara ──────────────────────────────────────────────────────
        function saveanStopScanner() {
            savean.scanning = false;
            if (savean.stream) {
                savean.stream.getTracks().forEach(function(track) { track.stop(); });
                savean.stream = null;
            }
        }

        // ─── QR detectado ────────────────────────────────────────────────────────
        function saveanFoundQR(data) {
            saveanStopScanner();
            document.getElementById('savean-scanner-container').style.display = 'none';
            var btn = document.getElementById('savean-btn-scan');
            btn.textContent  = 'Abrir Cámara para Escanear';
            btn.style.background = '#EC6608';

            var token = '';
            if (data.indexOf('savean_verificar=') !== -1) {
                token = data.split('savean_verificar=')[1];
                if (token.indexOf('&') !== -1) token = token.split('&')[0];
            } else if (/^[a-zA-Z0-9]{20,}$/.test(data.trim())) {
                token = data.trim();
            }

            if (!token) {
                saveanMsg('QR no válido para SAVEAN.', 'error');
                return;
            }

            document.getElementById('savean-token-input').value = token;
            savean.currentToken = token;
            saveanConsultarGuia();
        }

        // ─── Loop de escaneo ─────────────────────────────────────────────────────
        function saveanScanFrame() {
            if (!savean.scanning) return;
            var video = document.getElementById('savean-video');

            if (video.readyState < video.HAVE_ENOUGH_DATA) {
                setTimeout(saveanScanFrame, 300);
                return;
            }

            if (savean.detector) {
                savean.detector.detect(video)
                    .then(function(codes) {
                        if (codes && codes.length > 0) {
                            saveanFoundQR(codes[0].rawValue);
                        } else {
                            setTimeout(saveanScanFrame, 200);
                        }
                    })
                    .catch(function() { setTimeout(saveanScanFrame, 200); });
                return;
            }

            if (savean.jsQRReady && typeof jsQR === 'function') {
                var canvas = document.createElement('canvas');
                canvas.width  = video.videoWidth;
                canvas.height = video.videoHeight;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                try {
                    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var code    = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
                    if (code && code.data) {
                        saveanFoundQR(code.data);
                        return;
                    }
                } catch(e) {}
            }

            setTimeout(saveanScanFrame, 250);
        }

        // ─── Mensajes de estado ──────────────────────────────────────────────────
        function saveanMsg(text, tipo) {
            var div = document.getElementById('savean-scan-result');
            var msg = document.getElementById('savean-scan-msg');
            div.style.display = 'block';
            if (tipo === 'error') {
                div.style.background   = '#fef0f0';
                div.style.borderColor  = '#c62828';
                msg.style.color        = '#c62828';
            } else {
                div.style.background   = '#f0faf0';
                div.style.borderColor  = '#2e7d32';
                msg.style.color        = '#2e7d32';
            }
            msg.textContent = text;
        }

        // ─── Fila de datos ───────────────────────────────────────────────────────
        function saveanFila(label, value) {
            if (value === null || value === undefined || value === '') return '';
            return '<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;">' +
                '<span style="color:#555;font-size:13px;flex-shrink:0;margin-right:10px;">' + label + '</span>' +
                '<span style="font-size:13px;font-weight:600;color:#1a1a1a;text-align:right;">' + value + '</span>' +
                '</div>';
        }

        // ─── Consultar guía por token ────────────────────────────────────────────
        function saveanConsultarGuia() {
            var token = document.getElementById('savean-token-input').value.trim();
            if (!token) {
                saveanMsg('Ingresá o escaneá un token.', 'error');
                return;
            }
            savean.currentToken = token;
            saveanMsg('Consultando guía...', 'ok');

            var xhr = new XMLHttpRequest();
            xhr.open('GET',
                savean.siteUrl + '/?savean_ajax=consultar' +
                '&token=' + encodeURIComponent(token) +
                '&auth='  + encodeURIComponent(savean.authToken),
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data.error) { saveanMsg(data.error, 'error'); return; }
                        savean.currentData = data;
                        saveanMostrarDatos(data);
                    } catch(e) {
                        saveanMsg('Error al procesar la respuesta del servidor.', 'error');
                    }
                } else {
                    saveanMsg('Error de conexión (HTTP ' + xhr.status + ').', 'error');
                }
            };
            xhr.onerror = function() {
                saveanMsg('Sin conexión. Verificá tu internet.', 'error');
            };
            xhr.send();
        }

        // ─── Mostrar datos de la guía ────────────────────────────────────────────
        function saveanMostrarDatos(d) {
            document.getElementById('savean-scan-result').style.display      = 'none';
            document.getElementById('savean-seccion-escaneo').style.display  = 'none';
            document.getElementById('savean-historial').style.display        = 'none';
            document.getElementById('savean-datos-guia').style.display       = 'block';

            // Estado
            var estadoEl = document.getElementById('savean-guia-estado');
            var color = '#FF9A1D', estadoLabel = 'PENDIENTE DE VERIFICACIÓN';
            if      (d.estado === 'verificada') { color = '#2e7d32'; estadoLabel = '✓  VERIFICADA'; }
            else if (d.estado === 'vencida')    { color = '#c62828'; estadoLabel = '✕  VENCIDA'; }
            else if (d.estado === 'denegada')   { color = '#c62828'; estadoLabel = '✕  DENEGADA'; }

            estadoEl.style.background  = color + '18';
            estadoEl.style.borderColor = color;
            estadoEl.innerHTML =
                '<div style="font-size:19px;font-weight:700;color:' + color + ';">' + estadoLabel + '</div>' +
                '<div style="font-size:22px;font-weight:700;color:#EC6608;margin-top:6px;">' + d.numero + '</div>' +
                '<div style="font-size:12px;color:#666;margin-top:4px;">Emitida: ' + d.fecha_emision + '</div>';

            // Remitente
            var r = '';
            r += saveanFila('Nombre / Razón Social', d.remitente_nombre);
            r += saveanFila('RENSPA',                d.remitente_renspa);
            r += saveanFila('INV',                   d.remitente_inv);
            r += saveanFila('Tipo',                  d.remitente_tipo);
            document.getElementById('savean-datos-remitente').innerHTML = r || '<p style="color:#888;font-size:13px;">Sin datos.</p>';

            // Destinatario
            var dest = '';
            var tipoDestLabel = d.destino_tipo === 'externo' ? 'Externo' : d.destino_tipo === 'interno' ? 'Interno' : d.destino_tipo;
            dest += saveanFila('Nombre / Razón Social', d.destinatario_nombre);
            dest += saveanFila('Tipo de destino',       tipoDestLabel);
            dest += saveanFila('País',                  d.destino_pais);
            dest += saveanFila('Punto de salida',       d.destino_punto_salida);
            dest += saveanFila('Mercado interno',       d.destino_mercado_interno);
            document.getElementById('savean-datos-destinatario').innerHTML = dest || '<p style="color:#888;font-size:13px;">Sin datos.</p>';

            // Mercadería
            var m = '';
            if (d.items && d.items.length > 0) {
                for (var i = 0; i < d.items.length; i++) {
                    var it = d.items[i];
                    m += '<div style="background:#fafafa;border:1px solid #eee;border-radius:6px;padding:10px;margin-bottom:8px;">';
                    m += '<div style="font-weight:700;color:#EC6608;font-size:13px;margin-bottom:6px;">Producto ' + (i + 1) + '</div>';
                    m += saveanFila('Especie',          it.especie);
                    m += saveanFila('Variedad',         it.variedad);
                    m += saveanFila('Viñedo N°',        it.vinedo_numero);
                    m += saveanFila('Lugar de empaque', it.lugar_empaque);
                    m += saveanFila('Grado selección',  it.grado_seleccion);
                    m += saveanFila('Tamaño',           it.tamano);
                    m += saveanFila('Subproducto',      it.subproducto);
                    m += saveanFila('Tipo de envase',   it.tipo_envase);
                    m += saveanFila('Cantidad (bultos)', it.cantidad_bultos);
                    m += saveanFila('Kg por bulto',     it.kilos_por_bulto);
                    m += saveanFila('Total Kg',         it.total_kilos);
                    m += '</div>';
                }
            } else {
                m = '<p style="color:#888;font-size:13px;">Sin ítems registrados.</p>';
            }
            document.getElementById('savean-datos-mercaderia').innerHTML = m;

            // Transporte
            var tr = '';
            tr += saveanFila('Empresa',    d.transporte_empresa);
            tr += saveanFila('Conductor',  d.transporte_conductor);
            tr += saveanFila('Tipo',       d.transporte_tipo);
            var camion  = (d.transporte_camion_marca  ? d.transporte_camion_marca  + ' — ' : '') + (d.transporte_camion_patente  || '');
            var acopl   = (d.transporte_acoplado_marca ? d.transporte_acoplado_marca + ' — ' : '') + (d.transporte_acoplado_patente || '');
            tr += saveanFila('Camión',     camion);
            tr += saveanFila('Acoplado',   acopl);
            tr += saveanFila('Precintos',  d.transporte_precintos);
            document.getElementById('savean-datos-transporte').innerHTML = tr || '<p style="color:#888;font-size:13px;">Sin datos.</p>';

            // Acciones
            if (d.estado === 'pendiente') {
                document.getElementById('savean-sticky-acciones').style.display    = 'block';
                document.getElementById('savean-sticky-ya-procesada').style.display = 'none';
                document.getElementById('savean-ya-procesada-info').style.display  = 'none';
                document.getElementById('savean-barrera-select').value             = '';
            } else {
                document.getElementById('savean-sticky-acciones').style.display    = 'none';
                document.getElementById('savean-sticky-ya-procesada').style.display = 'block';

                var vd = '';
                if (d.fecha_verificacion)  vd += saveanFila('Fecha',               d.fecha_verificacion);
                if (d.inspector)           vd += saveanFila('Inspector',            d.inspector);
                if (d.barrera_nombre)      vd += saveanFila('Barrera',              d.barrera_nombre);
                if (d.motivo_denegacion)   vd += saveanFila('Motivo de denegación', d.motivo_denegacion);

                document.getElementById('savean-verificacion-detalle').innerHTML =
                    vd || '<p style="color:#888;font-size:13px;">Sin datos de verificación.</p>';
                document.getElementById('savean-ya-procesada-info').style.display = 'block';
            }

            // Scroll suave al contenido
            var guiaDiv   = document.getElementById('savean-datos-guia');
            var topOffset = guiaDiv.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }

        // ─── Verificar guía ──────────────────────────────────────────────────────
        function saveanVerificar() {
            var selectEl  = document.getElementById('savean-barrera-select');
            var barreraId = selectEl.value;
            if (!barreraId) { alert('Seleccioná una barrera antes de verificar.'); return; }
            if (!confirm('¿Confirmar VERIFICACIÓN de la guía ' + savean.currentToken.substring(0, 8) + '…?')) return;

            var barreraTexto = selectEl.options[selectEl.selectedIndex].text;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', savean.siteUrl + '/?savean_ajax=verificar', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                try {
                    var d = JSON.parse(xhr.responseText);
                    if (d.ok) {
                        document.getElementById('savean-sticky-acciones').style.display    = 'none';
                        document.getElementById('savean-sticky-ya-procesada').style.display = 'block';

                        var estadoEl = document.getElementById('savean-guia-estado');
                        estadoEl.style.background  = '#2e7d3218';
                        estadoEl.style.borderColor = '#2e7d32';
                        estadoEl.innerHTML =
                            '<div style="font-size:19px;font-weight:700;color:#2e7d32;">✓  VERIFICADA</div>' +
                            '<div style="font-size:12px;color:#666;margin-top:6px;">Verificada ahora</div>';

                        document.getElementById('savean-verificacion-detalle').innerHTML = saveanFila('Barrera', barreraTexto);
                        document.getElementById('savean-ya-procesada-info').style.display = 'block';

                        var counter = document.getElementById('savean-count-hoy');
                        counter.textContent = parseInt(counter.textContent, 10) + 1;
                    } else {
                        alert(d.error || 'No se pudo verificar.');
                    }
                } catch(e) { alert('Error al procesar la respuesta.'); }
            };
            xhr.onerror = function() { alert('Error de conexión.'); };
            xhr.send(
                'token='    + encodeURIComponent(savean.currentToken) +
                '&barrera_id=' + barreraId +
                '&auth='    + encodeURIComponent(savean.authToken)
            );
        }

        // ─── Abrir modal de modificación ─────────────────────────────────────────
        function saveanModificar() {
            var selectEl  = document.getElementById('savean-barrera-select');
            var barreraId = selectEl.value;
            if (!barreraId) { alert('Seleccioná una barrera antes de modificar.'); return; }

            var d = savean.currentData;
            if (!d) { alert('No hay datos de guía cargados.'); return; }

            // Pre-cargar campos del modal
            document.getElementById('mod-remitente-nombre').value    = d.remitente_nombre    || '';
            document.getElementById('mod-remitente-renspa').value    = d.remitente_renspa    || '';
            document.getElementById('mod-remitente-inv').value       = d.remitente_inv       || '';
            document.getElementById('mod-remitente-tipo').value      = d.remitente_tipo      || '';
            document.getElementById('mod-destinatario-nombre').value = d.destinatario_nombre || '';
            document.getElementById('mod-transporte-empresa').value  = d.transporte_empresa  || '';
            document.getElementById('mod-transporte-conductor').value= d.transporte_conductor|| '';
            document.getElementById('mod-transporte-tipo').value     = d.transporte_tipo     || '';
            document.getElementById('mod-camion-marca').value        = d.transporte_camion_marca    || '';
            document.getElementById('mod-camion-patente').value      = d.transporte_camion_patente  || '';
            document.getElementById('mod-acoplado-marca').value      = d.transporte_acoplado_marca  || '';
            document.getElementById('mod-acoplado-patente').value    = d.transporte_acoplado_patente || '';
            document.getElementById('mod-transporte-precintos').value= d.transporte_precintos || '';

            document.getElementById('savean-modal-modificar').style.display = 'block';
        }

        function saveanCerrarModal() {
            document.getElementById('savean-modal-modificar').style.display = 'none';
        }

        // ─── Guardar modificación y verificar ────────────────────────────────────
        function saveanGuardarYVerificar() {
            var selectEl  = document.getElementById('savean-barrera-select');
            var barreraId = selectEl.value;
            var barreraTexto = selectEl.options[selectEl.selectedIndex].text;

            var params =
                'token='                      + encodeURIComponent(savean.currentToken) +
                '&barrera_id='                + encodeURIComponent(barreraId) +
                '&auth='                      + encodeURIComponent(savean.authToken) +
                '&remitente_nombre='          + encodeURIComponent(document.getElementById('mod-remitente-nombre').value) +
                '&remitente_renspa='          + encodeURIComponent(document.getElementById('mod-remitente-renspa').value) +
                '&remitente_inv='             + encodeURIComponent(document.getElementById('mod-remitente-inv').value) +
                '&remitente_tipo='            + encodeURIComponent(document.getElementById('mod-remitente-tipo').value) +
                '&destinatario_nombre='       + encodeURIComponent(document.getElementById('mod-destinatario-nombre').value) +
                '&transporte_empresa='        + encodeURIComponent(document.getElementById('mod-transporte-empresa').value) +
                '&transporte_conductor='      + encodeURIComponent(document.getElementById('mod-transporte-conductor').value) +
                '&transporte_tipo='           + encodeURIComponent(document.getElementById('mod-transporte-tipo').value) +
                '&transporte_camion_marca='   + encodeURIComponent(document.getElementById('mod-camion-marca').value) +
                '&transporte_camion_patente=' + encodeURIComponent(document.getElementById('mod-camion-patente').value) +
                '&transporte_acoplado_marca=' + encodeURIComponent(document.getElementById('mod-acoplado-marca').value) +
                '&transporte_acoplado_patente='+ encodeURIComponent(document.getElementById('mod-acoplado-patente').value) +
                '&transporte_precintos='      + encodeURIComponent(document.getElementById('mod-transporte-precintos').value);

            var btn = document.querySelector('#savean-modal-modificar button[onclick="saveanGuardarYVerificar()"]');
            if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', savean.siteUrl + '/?savean_ajax=modificar', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
                if (btn) { btn.disabled = false; btn.textContent = 'VERIFICAR'; }
                try {
                    var d = JSON.parse(xhr.responseText);
                    if (d.ok) {
                        saveanCerrarModal();
                        document.getElementById('savean-sticky-acciones').style.display    = 'none';
                        document.getElementById('savean-sticky-ya-procesada').style.display = 'block';

                        var estadoEl = document.getElementById('savean-guia-estado');
                        estadoEl.style.background  = '#2e7d3218';
                        estadoEl.style.borderColor = '#2e7d32';
                        estadoEl.innerHTML =
                            '<div style="font-size:19px;font-weight:700;color:#2e7d32;">✓  VERIFICADA</div>' +
                            '<div style="font-size:12px;color:#666;margin-top:6px;">Modificada y verificada ahora</div>';

                        document.getElementById('savean-verificacion-detalle').innerHTML = saveanFila('Barrera', barreraTexto);
                        document.getElementById('savean-ya-procesada-info').style.display = 'block';

                        var counter = document.getElementById('savean-count-hoy');
                        if (counter) counter.textContent = parseInt(counter.textContent, 10) + 1;
                    } else {
                        alert(d.error || 'No se pudo guardar la modificación.');
                    }
                } catch(e) { alert('Error al procesar la respuesta.'); }
            };
            xhr.onerror = function() {
                if (btn) { btn.disabled = false; btn.textContent = 'VERIFICAR'; }
                alert('Error de conexión.');
            };
            xhr.send(params);
        }

        // ─── Nueva consulta ──────────────────────────────────────────────────────
        function saveanNuevaConsulta() {
            saveanStopScanner();
            document.getElementById('savean-datos-guia').style.display          = 'none';
            document.getElementById('savean-sticky-acciones').style.display     = 'none';
            document.getElementById('savean-sticky-ya-procesada').style.display = 'none';
            document.getElementById('savean-seccion-escaneo').style.display     = 'block';
            document.getElementById('savean-historial').style.display           = 'block';
            document.getElementById('savean-scan-result').style.display         = 'none';
            document.getElementById('savean-scanner-container').style.display   = 'none';
            document.getElementById('savean-token-input').value                 = '';
            var btn = document.getElementById('savean-btn-scan');
            btn.textContent  = 'Abrir Cámara para Escanear';
            btn.style.background = '#EC6608';
            savean.currentToken = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        </script>
        <?php
    }

    return ob_get_clean();
}


// Estilos del plugin
add_action( 'wp_enqueue_scripts', 'savean_estilos' );

function savean_estilos() {
    wp_enqueue_style("savean-ubuntu-font", "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap");
    wp_add_inline_style( 'wp-block-library', '
        #savean-root #savean-formulario,
        #savean-root #savean-login,
        #savean-root #savean-panel,
        #savean-root #savean-confirmacion {
            max-width: 800px;
            margin: 0 auto;
            font-family: Ubuntu, Arial, sans-serif;
        }

        #savean-root #savean-formulario h2,
        #savean-root #savean-panel h2,
        #savean-root #savean-login h2,
        #savean-root #savean-confirmacion h2 {
            background: #ec6608;
            color: white;
            padding: 15px 20px;
            border-radius: 6px;
            margin-bottom: 25px;
            font-size: 20px;
        }

        #savean-root #savean-formulario h3,
        #savean-root #savean-panel h3 {
            color: #EC6608;
            border-bottom: 2px solid #EC6608;
            padding-bottom: 6px;
            margin-top: 25px;
            font-size: 16px;
        }

        #savean-root #savean-formulario label,
        #savean-root #savean-panel label,
        #savean-root #savean-login label {
            display: block;
            font-weight: bold;
            margin-top: 12px;
            margin-bottom: 4px;
            color: #333;
            font-size: 13px;
        }

        #savean-root #savean-formulario input[type="text"],
        #savean-root #savean-formulario input[type="number"],
        #savean-root #savean-formulario input[type="date"],
        #savean-root #savean-formulario select,
        #savean-root #savean-panel input[type="text"],
        #savean-root #savean-panel input[type="password"],
        #savean-root #savean-panel select,
        #savean-root #savean-login input[type="text"],
        #savean-root #savean-login input[type="password"] {
            width: 100%;
            padding: 9px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            background: #fafafa;
        }

        #savean-root #savean-formulario input:focus,
        #savean-root #savean-formulario select:focus,
        #savean-root #savean-panel input:focus,
        #savean-root #savean-panel select:focus,
        #savean-root #savean-login input:focus {
            border-color: #EC6608;
            outline: none;
            background: white;
        }

        #savean-root .item-mercaderia {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 12px;
        }

        #savean-root #agregar-item {
            background: #ffffff;
            color: #EC6608;
            border: 2px solid #EC6608;
            padding: 8px 18px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }

        #savean-root #agregar-item:hover {
            background: #EC6608;
            color: white;
        }

        #savean-root #form-guia-origen button[type="submit"],
        #savean-root #savean-panel button[type="submit"],
        #savean-root #savean-login button[type="submit"] {
            background: #EC6608;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 20px;
            width: 100%;
        }

        #savean-root #form-guia-origen button[type="submit"]:hover,
        #savean-root #savean-panel button[type="submit"]:hover,
        #savean-root #savean-login button[type="submit"]:hover {
            background: #C45000;
        }

        #savean-root #savean-confirmacion {
            text-align: center;
            padding: 40px 20px;
        }

        #savean-root #savean-confirmacion h1 {
            font-size: 42px;
            color: #EC6608;
            margin: 15px 0;
            letter-spacing: 2px;
        }

        #savean-root #savean-confirmacion h2 {
            background: #EC6608;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 6px;
        }

        #savean-root #savean-confirmacion img {
            width: 200px;
            height: 200px;
            border: 3px solid #EC6608;
            border-radius: 8px;
            padding: 8px;
        }

        #savean-root #savean-panel table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
        }

        #savean-root #savean-panel table th {
            background: #EC6608;
            color: white;
            padding: 8px;
            text-align: left;
        }

        #savean-root #savean-panel table td {
            padding: 7px 8px;
            border-bottom: 1px solid #eee;
        }

        #savean-root #savean-panel table tr:hover td {
            background: #f5f5f5;
        }

        @media (max-width: 600px) {
            #savean-root #savean-formulario,
            #savean-root #savean-panel,
            #savean-root #savean-login,
            #savean-root #savean-confirmacion {
                padding: 0 10px;
            }
            #savean-root #savean-formulario h2,
            #savean-root #savean-panel h2,
            #savean-root #savean-login h2,
            #savean-root #savean-confirmacion h2 {
                font-size: 17px;
                padding: 12px 15px;
                border-radius: 6px;
                margin-left: -10px;
                margin-right: -10px;
                border-radius: 0;
            }
            #savean-root #savean-formulario h3,
            #savean-root #savean-panel h3 {
                font-size: 15px;
                margin-top: 20px;
            }
            #savean-root #savean-confirmacion h1 {
                font-size: 24px;
                letter-spacing: 1px;
            }
            #savean-root #savean-confirmacion img {
                width: 160px;
                height: 160px;
            }
            #savean-root .item-mercaderia {
                padding: 10px;
            }
            #savean-root #savean-panel table {
                font-size: 11px;
                display: block;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            #savean-root #savean-panel table th,
            #savean-root #savean-panel table td {
                padding: 6px 5px;
                white-space: nowrap;
            }
            #savean-root #form-guia-origen button[type="submit"],
            #savean-root #savean-panel button[type="submit"],
            #savean-root #savean-login button[type="submit"] {
                padding: 14px 20px;
                font-size: 15px;
            }
        }
    ');
}

// Panel de administración de inspectores
add_action( 'admin_menu', 'savean_admin_menu' );

function savean_admin_menu() {
    add_menu_page(
        'SAVEAN',
        'SAVEAN',
        'manage_options',
        'savean-admin',
        'savean_admin_page',
        'dashicons-shield',
        30
    );
    add_submenu_page(
        'savean-admin',
        'Inspectores',
        'Inspectores',
        'manage_options',
        'savean-inspectores',
        'savean_admin_inspectores'
    );
    add_submenu_page(
        'savean-admin',
        'Barreras',
        'Barreras',
        'manage_options',
        'savean-barreras',
        'savean_admin_barreras'
    );
    add_submenu_page(
        'savean-admin',
        'Guías',
        'Guías',
        'manage_options',
        'savean-guias',
        'savean_admin_guias'
    );
    add_submenu_page(
        'savean-admin',
        'Acceso Director',
        'Acceso Director',
        'manage_options',
        'savean-director',
        'savean_admin_director'
    );
}

function savean_admin_page() {
    echo '<div class="wrap"><h1>SAVEAN — Panel de Administración</h1>';
    echo '<p>Bienvenido al panel de administración del sistema SAVEAN.</p></div>';
}

function savean_admin_inspectores() {
    global $wpdb;
    $tabla = $wpdb->prefix . 'savean_inspectores';

    // Crear tabla si no existe
    $charset = $wpdb->get_charset_collate();
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( "CREATE TABLE IF NOT EXISTS $tabla (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(100) NOT NULL UNIQUE,
        clave VARCHAR(255) NOT NULL,
        nombre VARCHAR(200),
        activo TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) $charset;" );

    // Procesar formulario
    if ( isset( $_POST['savean_guardar_inspector'] ) ) {
        $usuario = sanitize_text_field( $_POST['inspector_usuario'] );
        $clave   = sanitize_text_field( $_POST['inspector_clave'] );
        $nombre  = sanitize_text_field( $_POST['inspector_nombre'] );
        if ( $usuario && $clave ) {
            $wpdb->insert( $tabla, array(
                'usuario' => $usuario,
                'clave'   => password_hash( $clave, PASSWORD_DEFAULT ),
                'nombre'  => $nombre,
                'activo'  => 1,
            ));
            echo '<div class="notice notice-success"><p>Inspector agregado correctamente.</p></div>';
        }
    }

    // Procesar eliminación
    if ( isset( $_GET['eliminar'] ) ) {
        $wpdb->delete( $tabla, array( 'id' => intval( $_GET['eliminar'] ) ) );
        echo '<div class="notice notice-success"><p>Inspector eliminado.</p></div>';
    }

    // Procesar activar/desactivar
    if ( isset( $_GET['toggle'] ) ) {
        $inspector = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $tabla WHERE id = %d", intval( $_GET['toggle'] ) ) );
        if ( $inspector ) {
            $wpdb->update( $tabla, array( 'activo' => $inspector->activo ? 0 : 1 ), array( 'id' => $inspector->id ) );
        }
    }

    $inspectores = $wpdb->get_results( "SELECT * FROM $tabla ORDER BY created_at DESC" );
    ?>
    <div class="wrap">
        <h1>Gestión de Inspectores</h1>

        <h2>Agregar Inspector</h2>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th>Nombre completo</th>
                    <td><input type="text" name="inspector_nombre" class="regular-text" required></td>
                </tr>
                <tr>
                    <th>Usuario</th>
                    <td><input type="text" name="inspector_usuario" class="regular-text" required></td>
                </tr>
                <tr>
                    <th>Contraseña</th>
                    <td><input type="password" name="inspector_clave" class="regular-text" required></td>
                </tr>
            </table>
            <p><button type="submit" name="savean_guardar_inspector" class="button button-primary">Agregar Inspector</button></p>
        </form>

        <h2>Inspectores registrados</h2>
        <table class="widefat fixed striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( $inspectores ) : ?>
                    <?php foreach ( $inspectores as $i ) : ?>
                    <tr>
                        <td><?php echo esc_html( $i->nombre ); ?></td>
                        <td><?php echo esc_html( $i->usuario ); ?></td>
                        <td><?php echo $i->activo ? '<span style="color:green;">Activo</span>' : '<span style="color:red;">Inactivo</span>'; ?></td>
                        <td>
                            <a href="?page=savean-inspectores&toggle=<?php echo $i->id; ?>">
                                <?php echo $i->activo ? 'Desactivar' : 'Activar'; ?>
                            </a> |
                            <a href="?page=savean-inspectores&eliminar=<?php echo $i->id; ?>" onclick="return confirm('¿Eliminar este inspector?')">Eliminar</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr><td colspan="4">No hay inspectores registrados aún.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// -----------------------------------------------
// ADMIN — GESTIÓN DE BARRERAS
// -----------------------------------------------
function savean_admin_barreras() {
    global $wpdb;
    $tabla = $wpdb->prefix . 'savean_barreras';

    // Procesar agregar barrera
    if ( isset( $_POST['savean_guardar_barrera'] ) ) {
        $nombre = sanitize_text_field( $_POST['barrera_nombre'] );
        $ruta = sanitize_text_field( $_POST['barrera_ruta'] );
        $kilometro = sanitize_text_field( $_POST['barrera_kilometro'] );
        $departamento = sanitize_text_field( $_POST['barrera_departamento'] );
        if ( $nombre ) {
            $wpdb->insert( $tabla, array(
                'nombre' => $nombre,
                'ruta' => $ruta,
                'kilometro' => $kilometro,
                'departamento' => $departamento,
                'activa' => 1,
            ));
            echo '<div class="notice notice-success"><p>Barrera agregada correctamente.</p></div>';
        }
    }

    // Procesar eliminación
    if ( isset( $_GET['eliminar_barrera'] ) ) {
        $wpdb->delete( $tabla, array( 'id' => intval( $_GET['eliminar_barrera'] ) ) );
        echo '<div class="notice notice-success"><p>Barrera eliminada.</p></div>';
    }

    // Procesar activar/desactivar
    if ( isset( $_GET['toggle_barrera'] ) ) {
        $barrera = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $tabla WHERE id = %d", intval( $_GET['toggle_barrera'] ) ) );
        if ( $barrera ) {
            $wpdb->update( $tabla, array( 'activa' => $barrera->activa ? 0 : 1 ), array( 'id' => $barrera->id ) );
        }
    }

    $barreras = $wpdb->get_results( "SELECT * FROM $tabla ORDER BY nombre ASC" );
    ?>
    <div class="wrap">
        <h1>Gestión de Barreras Fitozoosanitarias</h1>

        <h2>Agregar Barrera</h2>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th>Nombre</th>
                    <td><input type="text" name="barrera_nombre" class="regular-text" required placeholder="Ej: San Carlos"></td>
                </tr>
                <tr>
                    <th>Ruta</th>
                    <td><input type="text" name="barrera_ruta" class="regular-text" placeholder="Ej: Ruta N° 40"></td>
                </tr>
                <tr>
                    <th>Kilómetro</th>
                    <td><input type="text" name="barrera_kilometro" class="regular-text" placeholder="Ej: km 3379"></td>
                </tr>
                <tr>
                    <th>Departamento</th>
                    <td><input type="text" name="barrera_departamento" class="regular-text" placeholder="Ej: Sarmiento"></td>
                </tr>
            </table>
            <p><button type="submit" name="savean_guardar_barrera" class="button button-primary">Agregar Barrera</button></p>
        </form>

        <h2>Barreras registradas</h2>
        <table class="widefat fixed striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Ruta</th>
                    <th>Kilómetro</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( $barreras ) : ?>
                    <?php foreach ( $barreras as $b ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $b->nombre ); ?></strong></td>
                        <td><?php echo esc_html( $b->ruta ); ?></td>
                        <td><?php echo esc_html( $b->kilometro ); ?></td>
                        <td><?php echo esc_html( $b->departamento ); ?></td>
                        <td><?php echo $b->activa ? '<span style="color:green;">Activa</span>' : '<span style="color:red;">Inactiva</span>'; ?></td>
                        <td>
                            <a href="?page=savean-barreras&toggle_barrera=<?php echo $b->id; ?>">
                                <?php echo $b->activa ? 'Desactivar' : 'Activar'; ?>
                            </a> |
                            <a href="?page=savean-barreras&eliminar_barrera=<?php echo $b->id; ?>" onclick="return confirm('¿Eliminar esta barrera?')">Eliminar</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr><td colspan="6">No hay barreras registradas aún.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}

// -----------------------------------------------
// ADMIN — LISTADO DE GUÍAS
// -----------------------------------------------
function savean_admin_guias() {
    global $wpdb;
    $tabla = $wpdb->prefix . 'savean_guias';
    $tabla_items = $wpdb->prefix . 'savean_guias_items';

    // Filtros
    $estado_filtro = isset( $_GET['estado'] ) ? sanitize_text_field( $_GET['estado'] ) : '';
    $where = '';
    if ( $estado_filtro ) {
        $where = $wpdb->prepare( " WHERE estado = %s", $estado_filtro );
    }

    $guias = $wpdb->get_results( "SELECT * FROM $tabla $where ORDER BY fecha_emision DESC LIMIT 50" );
    $total = $wpdb->get_var( "SELECT COUNT(*) FROM $tabla" );
    $pendientes = $wpdb->get_var( "SELECT COUNT(*) FROM $tabla WHERE estado = 'pendiente'" );
    $verificadas = $wpdb->get_var( "SELECT COUNT(*) FROM $tabla WHERE estado = 'verificada'" );
    $vencidas = $wpdb->get_var( "SELECT COUNT(*) FROM $tabla WHERE estado = 'vencida'" );
    ?>
    <div class="wrap">
        <h1>Guías de Origen Emitidas</h1>

        <div style="margin: 15px 0; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
            <strong>Resumen:</strong>
            Total: <strong><?php echo $total; ?></strong> |
            <span style="color:orange;">Pendientes: <?php echo $pendientes; ?></span> |
            <span style="color:green;">Verificadas: <?php echo $verificadas; ?></span> |
            <span style="color:red;">Vencidas: <?php echo $vencidas; ?></span>
        </div>

        <div style="margin-bottom: 15px;">
            <a href="?page=savean-guias" class="button <?php echo !$estado_filtro ? 'button-primary' : ''; ?>">Todas</a>
            <a href="?page=savean-guias&estado=pendiente" class="button <?php echo $estado_filtro === 'pendiente' ? 'button-primary' : ''; ?>">Pendientes</a>
            <a href="?page=savean-guias&estado=verificada" class="button <?php echo $estado_filtro === 'verificada' ? 'button-primary' : ''; ?>">Verificadas</a>
            <a href="?page=savean-guias&estado=vencida" class="button <?php echo $estado_filtro === 'vencida' ? 'button-primary' : ''; ?>">Vencidas</a>
        </div>

        <table class="widefat fixed striped">
            <thead>
                <tr>
                    <th>N° Guía</th>
                    <th>Remitente</th>
                    <th>Destinatario</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Fecha Emisión</th>
                    <th>Fecha Verificación</th>
                    <th>Inspector</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( $guias ) : ?>
                    <?php foreach ( $guias as $g ) : ?>
                    <tr>
                        <td><strong><?php echo esc_html( $g->numero ); ?></strong></td>
                        <td><?php echo esc_html( $g->remitente_nombre ); ?></td>
                        <td><?php echo esc_html( $g->destinatario_nombre ); ?></td>
                        <td><?php echo esc_html( $g->destino_tipo ); ?></td>
                        <td>
                            <?php
                            if ( $g->estado === 'pendiente' ) echo '<span style="color:orange;font-weight:bold;">Pendiente</span>';
                            elseif ( $g->estado === 'verificada' ) echo '<span style="color:green;font-weight:bold;">Verificada</span>';
                            else echo '<span style="color:red;font-weight:bold;">Vencida</span>';
                            ?>
                        </td>
                        <td><?php echo esc_html( $g->fecha_emision ); ?></td>
                        <td><?php echo $g->fecha_verificacion ? esc_html( $g->fecha_verificacion ) : '-'; ?></td>
                        <td><?php echo $g->inspector ? esc_html( $g->inspector ) : '-'; ?></td>
                    </tr>
                    <?php endforeach; ?>
                <?php else : ?>
                    <tr><td colspan="8">No hay guías registradas aún.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
        <p style="color:#666; margin-top:10px;">Mostrando las últimas 50 guías.</p>
    </div>
    <?php
}

// -----------------------------------------------
// ADMIN — CONFIGURAR ACCESO DEL DIRECTOR
// -----------------------------------------------

function savean_admin_director() {
    if ( isset( $_POST['savean_guardar_director'] ) ) {
        $usuario = sanitize_text_field( $_POST['director_usuario'] );
        $clave   = $_POST['director_clave'];
        if ( $usuario && $clave ) {
            update_option( 'savean_director_creds', array(
                'usuario' => $usuario,
                'clave'   => password_hash( $clave, PASSWORD_DEFAULT ),
            ) );
            echo '<div class="notice notice-success"><p>Credenciales del director guardadas correctamente.</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>Completá usuario y contraseña.</p></div>';
        }
    }

    $creds   = get_option( 'savean_director_creds', array() );
    $usuario = isset( $creds['usuario'] ) ? $creds['usuario'] : '';
    ?>
    <div class="wrap">
        <h1>Acceso Director — SAVEAN</h1>
        <p>Configurá el usuario y contraseña que usará el director para acceder al panel de estadísticas. Luego creá una página de WordPress con el shortcode <code>[savean_director]</code>.</p>

        <form method="post">
            <table class="form-table">
                <tr>
                    <th>Usuario actual</th>
                    <td><strong><?php echo $usuario ? esc_html($usuario) : '<em>No configurado</em>'; ?></strong></td>
                </tr>
                <tr>
                    <th><label for="director_usuario">Nuevo usuario</label></th>
                    <td><input type="text" id="director_usuario" name="director_usuario" class="regular-text" value="<?php echo esc_attr($usuario); ?>" required></td>
                </tr>
                <tr>
                    <th><label for="director_clave">Nueva contraseña</label></th>
                    <td><input type="password" id="director_clave" name="director_clave" class="regular-text" required>
                    <p class="description">Si cambiás la contraseña, el director deberá volver a iniciar sesión.</p></td>
                </tr>
            </table>
            <p><button type="submit" name="savean_guardar_director" class="button button-primary">Guardar credenciales</button></p>
        </form>

        <hr>
        <h2>¿Cómo activar el panel del director?</h2>
        <ol>
            <li>Guardá las credenciales arriba.</li>
            <li>Creá una nueva página en WordPress (Páginas → Añadir nueva).</li>
            <li>Escribí el título que quieras (ej: "Director") y en el contenido poné el shortcode: <code>[savean_director]</code></li>
            <li>Publicá la página.</li>
            <li>Compartile la URL y las credenciales al director.</li>
        </ol>
    </div>
    <?php
}

// -----------------------------------------------
// SHORTCODE [savean_director] — PANEL DEL DIRECTOR
// -----------------------------------------------

add_shortcode( 'savean_director', 'savean_render_director' );

function savean_render_director() {
    ob_start();

    if ( !session_id() && !headers_sent() ) {
        session_start();
    }

    // Login
    $login_error = '';
    if ( isset( $_POST['savean_director_login'] ) ) {
        $usuario = sanitize_text_field( $_POST['director_usuario'] );
        $clave   = $_POST['director_clave'];
        $creds   = get_option( 'savean_director_creds', array() );

        if ( $creds && isset($creds['usuario']) && $creds['usuario'] === $usuario && password_verify( $clave, $creds['clave'] ) ) {
            $_SESSION['savean_director'] = $usuario;
        } else {
            $login_error = 'Usuario o contraseña incorrectos.';
        }
    }

    // Logout
    if ( isset( $_GET['savean_director_logout'] ) ) {
        unset( $_SESSION['savean_director'] );
        wp_redirect( get_permalink() );
        exit;
    }

    $logueado = isset( $_SESSION['savean_director'] );

    if ( !$logueado ) {
        ?>
        <div id="savean-root">
        <div id="savean-login">
            <h2>Panel de Dirección — SAVEAN</h2>
            <?php if ($login_error) : ?>
            <p style="color:#c62828;font-weight:bold;padding:10px;background:#fef0f0;border-radius:6px;border:1px solid #c62828;"><?php echo esc_html($login_error); ?></p>
            <?php endif; ?>
            <form method="post">
                <label>Usuario</label>
                <input type="text" name="director_usuario" required autocomplete="username">
                <label>Contraseña</label>
                <input type="password" name="director_clave" required autocomplete="current-password">
                <br><br>
                <button type="submit" name="savean_director_login">Ingresar</button>
            </form>
        </div>
        </div>
        <?php
    } else {
        $creds = get_option( 'savean_director_creds', array() );
        $auth_token = md5( $creds['usuario'] . '-savean-director' );
        ?>
        <div id="savean-root">
        <div id="savean-panel" style="max-width:1100px;">

            <!-- Cabecera -->
            <h2>Panel de Dirección — SAVEAN</h2>
            <div style="background:#1a1a1a; border-radius:8px; padding:12px 20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                    <span style="color:#aaa; font-size:12px;">Sesión</span>
                    <strong style="color:#fff; font-size:15px; display:block;"><?php echo esc_html($creds['usuario']); ?></strong>
                </div>
                <div style="text-align:center;">
                    <span style="color:#aaa; font-size:11px;" id="dir-ultima-act">Cargando datos...</span>
                </div>
                <a href="?savean_director_logout=1" style="color:#fff; background:#c62828; padding:8px 16px; border-radius:6px; text-decoration:none; font-size:13px; font-weight:700;">Salir</a>
            </div>

            <!-- Filtro de fecha -->
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px; flex-wrap:wrap;">
                <label style="font-weight:700; color:#333; font-size:14px;">Fecha:</label>
                <input type="date" id="dir-fecha" style="padding:8px 12px; border:1px solid #ccc; border-radius:6px; font-size:14px; color:#1a1a1a;">
                <button type="button" onclick="dirCargarDatos()" style="background:#EC6608; color:white; border:none; padding:8px 18px; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer;">Actualizar</button>
                <span id="dir-refresh-badge" style="font-size:12px; color:#888;">Actualización automática cada 60s</span>
            </div>

            <!-- KPI Cards -->
            <div id="dir-kpis" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:28px;">
                <div class="dir-kpi-card" id="kpi-total">
                    <div class="dir-kpi-num">—</div>
                    <div class="dir-kpi-label">Total guías</div>
                </div>
                <div class="dir-kpi-card" id="kpi-hoy">
                    <div class="dir-kpi-num">—</div>
                    <div class="dir-kpi-label">Emitidas hoy</div>
                </div>
                <div class="dir-kpi-card" id="kpi-verificadas-hoy" style="border-top:4px solid #2e7d32;">
                    <div class="dir-kpi-num" style="color:#2e7d32;">—</div>
                    <div class="dir-kpi-label">Verificadas (fecha)</div>
                </div>
                <div class="dir-kpi-card" id="kpi-pendientes" style="border-top:4px solid #FF9A1D;">
                    <div class="dir-kpi-num" style="color:#FF9A1D;">—</div>
                    <div class="dir-kpi-label">Pendientes ahora</div>
                </div>
                <div class="dir-kpi-card" id="kpi-denegadas" style="border-top:4px solid #c62828;">
                    <div class="dir-kpi-num" style="color:#c62828;">—</div>
                    <div class="dir-kpi-label">Denegadas total</div>
                </div>
                <div class="dir-kpi-card" id="kpi-vencidas" style="border-top:4px solid #888;">
                    <div class="dir-kpi-num" style="color:#888;">—</div>
                    <div class="dir-kpi-label">Vencidas total</div>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:24px;">

                <!-- Inspectores activos en la fecha -->
                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:18px;">
                    <h3 style="margin-top:0; color:#EC6608; font-size:15px; border-bottom:2px solid #EC6608; padding-bottom:6px;">Inspectores — fecha seleccionada</h3>
                    <div id="dir-inspectores"><p style="color:#888; font-size:13px;">Cargando...</p></div>
                </div>

                <!-- Actividad por barrera -->
                <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:18px;">
                    <h3 style="margin-top:0; color:#EC6608; font-size:15px; border-bottom:2px solid #EC6608; padding-bottom:6px;">Barreras — fecha seleccionada</h3>
                    <div id="dir-barreras"><p style="color:#888; font-size:13px;">Cargando...</p></div>
                </div>
            </div>

            <!-- Últimas guías procesadas -->
            <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:18px; margin-bottom:24px;">
                <h3 style="margin-top:0; color:#EC6608; font-size:15px; border-bottom:2px solid #EC6608; padding-bottom:6px;">Últimas guías procesadas</h3>
                <div id="dir-ultimas" style="overflow-x:auto;"><p style="color:#888; font-size:13px;">Cargando...</p></div>
            </div>

            <!-- Modal para ver detalle de guía -->
            <div id="dir-modal-guia" style="display:none; background:white; border:2px solid #EC6608; border-radius:8px; padding:24px; margin-bottom:24px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #EC6608; padding-bottom:12px;">
                    <h3 style="margin:0; color:#EC6608;">Detalle de Guía</h3>
                    <button type="button" onclick="dirCerrarModalGuia()" style="background:#c62828; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:700;">Cerrar</button>
                </div>
                <div id="dir-modal-contenido"><p style="color:#888;">Cargando...</p></div>
            </div>

            <!-- Gestión de barreristas (inspectores) -->
            <div style="background:white; border:1px solid #e0e0e0; border-radius:8px; padding:18px; margin-bottom:24px;">
                <h3 style="margin-top:0; color:#EC6608; font-size:15px; border-bottom:2px solid #EC6608; padding-bottom:6px;">Gestión de Barreristas</h3>

                <!-- Agregar nuevo barrerista -->
                <div style="background:#f9f9f9; border:1px solid #e0e0e0; border-radius:6px; padding:16px; margin-bottom:20px;">
                    <h4 style="margin:0 0 12px 0; color:#333; font-size:13px;">Agregar nuevo barrerista</h4>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr 100px; gap:8px; align-items:flex-end;">
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#333; margin-bottom:4px;">Nombre</label>
                            <input type="text" id="dir-insp-nombre" placeholder="Ej: Juan Pérez" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-size:13px; box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#333; margin-bottom:4px;">Usuario</label>
                            <input type="text" id="dir-insp-usuario" placeholder="Ej: jperez" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-size:13px; box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:600; color:#333; margin-bottom:4px;">Contraseña</label>
                            <input type="password" id="dir-insp-clave" placeholder="Contraseña" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px; font-size:13px; box-sizing:border-box;">
                        </div>
                        <button type="button" onclick="dirAgregarInspector()" style="background:#2e7d32; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:700;">Agregar</button>
                    </div>
                </div>

                <!-- Tabla de barreristas activos -->
                <h4 style="margin:16px 0 12px 0; color:#333; font-size:13px;">Barreristas activos</h4>
                <div id="dir-barreristas-lista" style="overflow-x:auto;"><p style="color:#888; font-size:13px;">Cargando...</p></div>
            </div>

        </div><!-- #savean-panel -->
        </div><!-- #savean-root -->

        <style>
        .dir-kpi-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-top: 4px solid #EC6608;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }
        .dir-kpi-num {
            font-size: 32px;
            font-weight: 700;
            color: #EC6608;
            line-height: 1;
            margin-bottom: 6px;
        }
        .dir-kpi-label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            #savean-root #savean-panel > div[style*="grid-template-columns:1fr 1fr"] {
                grid-template-columns: 1fr !important;
            }
        }
        </style>

        <script type="text/javascript">
        var dirSiteUrl   = '<?php echo esc_js(savean_url()); ?>';
        var dirAuthToken = '<?php echo esc_js($auth_token); ?>';
        var dirTimer     = null;

        // Inicializar fecha a hoy
        (function() {
            var hoy = new Date();
            var yyyy = hoy.getFullYear();
            var mm   = String(hoy.getMonth() + 1).padStart(2, '0');
            var dd   = String(hoy.getDate()).padStart(2, '0');
            document.getElementById('dir-fecha').value = yyyy + '-' + mm + '-' + dd;
        })();

        // Cambio de fecha cancela auto-refresh si no es hoy
        document.getElementById('dir-fecha').addEventListener('change', function() {
            dirCargarDatos();
        });

        function dirEsHoy(fechaStr) {
            var hoy = new Date();
            var yyyy = hoy.getFullYear();
            var mm   = String(hoy.getMonth() + 1).padStart(2, '0');
            var dd   = String(hoy.getDate()).padStart(2, '0');
            return fechaStr === (yyyy + '-' + mm + '-' + dd);
        }

        function dirCargarDatos() {
            if (dirTimer) clearTimeout(dirTimer);
            var fecha = document.getElementById('dir-fecha').value;
            if (!fecha) return;

            document.getElementById('dir-ultima-act').textContent = 'Actualizando...';

            var xhr = new XMLHttpRequest();
            xhr.open('GET',
                dirSiteUrl + '/?savean_ajax=director_stats' +
                '&fecha=' + encodeURIComponent(fecha) +
                '&auth='  + encodeURIComponent(dirAuthToken),
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var d = JSON.parse(xhr.responseText);
                        if (d.error) {
                            document.getElementById('dir-ultima-act').textContent = 'Error: ' + d.error;
                            return;
                        }
                        dirRenderDatos(d);

                        var ahora = new Date();
                        var h = String(ahora.getHours()).padStart(2,'0');
                        var m = String(ahora.getMinutes()).padStart(2,'0');
                        var s = String(ahora.getSeconds()).padStart(2,'0');
                        document.getElementById('dir-ultima-act').textContent = 'Última actualización: ' + h + ':' + m + ':' + s;
                    } catch(e) {
                        document.getElementById('dir-ultima-act').textContent = 'Error al procesar datos.';
                    }
                }
                // Programar próximo refresh solo si la fecha es hoy
                if (dirEsHoy(document.getElementById('dir-fecha').value)) {
                    dirTimer = setTimeout(dirCargarDatos, 60000);
                }
            };
            xhr.onerror = function() {
                document.getElementById('dir-ultima-act').textContent = 'Error de conexión.';
                dirTimer = setTimeout(dirCargarDatos, 60000);
            };
            xhr.send();
        }

        function dirRenderDatos(d) {
            // KPIs
            document.querySelector('#kpi-total .dir-kpi-num').textContent          = d.kpi.total;
            document.querySelector('#kpi-hoy .dir-kpi-num').textContent            = d.kpi.emitidas_hoy;
            document.querySelector('#kpi-verificadas-hoy .dir-kpi-num').textContent = d.kpi.verificadas_fecha;
            document.querySelector('#kpi-pendientes .dir-kpi-num').textContent     = d.kpi.pendientes;
            document.querySelector('#kpi-denegadas .dir-kpi-num').textContent      = d.kpi.denegadas;
            document.querySelector('#kpi-vencidas .dir-kpi-num').textContent       = d.kpi.vencidas;

            // Inspectores
            var insp = d.inspectores;
            if (insp && insp.length > 0) {
                var html = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
                html += '<tr style="background:#f5f5f5;"><th style="padding:6px;text-align:left;color:#333;">Inspector</th><th style="padding:6px;text-align:center;color:#333;">Verificadas</th><th style="padding:6px;text-align:left;color:#333;">Barrera</th><th style="padding:6px;text-align:right;color:#333;">Última</th></tr>';
                for (var i = 0; i < insp.length; i++) {
                    var it = insp[i];
                    html += '<tr style="border-bottom:1px solid #eee;">';
                    html += '<td style="padding:6px;color:#1a1a1a;font-weight:600;">' + (it.nombre || it.inspector) + '</td>';
                    html += '<td style="padding:6px;text-align:center;"><span style="background:#2e7d32;color:white;padding:2px 10px;border-radius:10px;font-weight:700;">' + it.verificadas + '</span></td>';
                    html += '<td style="padding:6px;color:#555;">' + (it.barrera || '—') + '</td>';
                    html += '<td style="padding:6px;color:#555;text-align:right;font-size:11px;">' + (it.ultima ? it.ultima.substring(11,16) : '—') + '</td>';
                    html += '</tr>';
                }
                html += '</table>';
                document.getElementById('dir-inspectores').innerHTML = html;
            } else {
                document.getElementById('dir-inspectores').innerHTML = '<p style="color:#888;font-size:13px;">Sin actividad en la fecha seleccionada.</p>';
            }

            // Barreras
            var barr = d.barreras;
            if (barr && barr.length > 0) {
                var htmlB = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
                htmlB += '<tr style="background:#f5f5f5;"><th style="padding:6px;text-align:left;color:#333;">Barrera</th><th style="padding:6px;text-align:center;color:#2e7d32;">Verif.</th><th style="padding:6px;text-align:center;color:#c62828;">Denegadas</th></tr>';
                for (var j = 0; j < barr.length; j++) {
                    var br = barr[j];
                    htmlB += '<tr style="border-bottom:1px solid #eee;">';
                    htmlB += '<td style="padding:6px;color:#1a1a1a;font-weight:600;">' + br.nombre + '</td>';
                    htmlB += '<td style="padding:6px;text-align:center;font-weight:700;color:#2e7d32;">' + (br.verificadas || 0) + '</td>';
                    htmlB += '<td style="padding:6px;text-align:center;font-weight:700;color:#c62828;">' + (br.denegadas || 0) + '</td>';
                    htmlB += '</tr>';
                }
                htmlB += '</table>';
                document.getElementById('dir-barreras').innerHTML = htmlB;
            } else {
                document.getElementById('dir-barreras').innerHTML = '<p style="color:#888;font-size:13px;">Sin datos de barreras.</p>';
            }

            // Últimas guías
            var guias = d.ultimas;
            if (guias && guias.length > 0) {
                var htmlG = '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
                htmlG += '<tr style="background:#EC6608;">';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:left;">N° Guía</th>';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:center;">Estado</th>';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:left;">Remitente</th>';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:left;">Inspector</th>';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:left;">Barrera</th>';
                htmlG += '<th style="padding:7px 6px;color:white;text-align:right;">Hora</th>';
                htmlG += '</tr>';
                var estadoColors = { verificada: '#2e7d32', denegada: '#c62828', pendiente: '#FF9A1D', vencida: '#888' };
                var estadoLabels = { verificada: 'Verif.', denegada: 'Deneg.', pendiente: 'Pend.', vencida: 'Venc.' };
                for (var k = 0; k < guias.length; k++) {
                    var g = guias[k];
                    var col = estadoColors[g.estado] || '#888';
                    var lbl = estadoLabels[g.estado] || g.estado;
                    var hora = g.fecha_verificacion ? g.fecha_verificacion.substring(11,16) : (g.fecha_emision ? g.fecha_emision.substring(11,16) : '—');
                    htmlG += '<tr style="border-bottom:1px solid #eee;">';
                    htmlG += '<td style="padding:5px 6px;font-weight:700;color:#EC6608;white-space:nowrap;"><button type="button" onclick="dirVerGuia(\'' + g.token + '\')" style="background:none;border:none;color:#EC6608;cursor:pointer;font-weight:700;text-decoration:underline;padding:0;font-size:inherit;">' + g.numero + '</button></td>';
                    htmlG += '<td style="padding:5px 6px;text-align:center;"><span style="background:' + col + ';color:white;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;">' + lbl + '</span></td>';
                    htmlG += '<td style="padding:5px 6px;color:#555;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + (g.remitente || '—') + '</td>';
                    htmlG += '<td style="padding:5px 6px;color:#555;white-space:nowrap;">' + (g.inspector || '—') + '</td>';
                    htmlG += '<td style="padding:5px 6px;color:#555;white-space:nowrap;">' + (g.barrera || '—') + '</td>';
                    htmlG += '<td style="padding:5px 6px;color:#555;text-align:right;white-space:nowrap;">' + hora + '</td>';
                    htmlG += '</tr>';
                }
                htmlG += '</table>';
                document.getElementById('dir-ultimas').innerHTML = htmlG;
            } else {
                document.getElementById('dir-ultimas').innerHTML = '<p style="color:#888;font-size:13px;">No hay guías procesadas aún.</p>';
            }
        }

        // Cargar al iniciar
        dirCargarDatos();
        dirCargarBarreristas();

        // ── Funciones para ver detalle de guía ──────────────────────────────
        function dirVerGuia(token) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET',
                dirSiteUrl + '/?savean_ajax=director_guia' +
                '&token=' + encodeURIComponent(token) +
                '&auth='  + encodeURIComponent(dirAuthToken),
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var d = JSON.parse(xhr.responseText);
                        if (d.error) {
                            alert('Error: ' + d.error);
                            return;
                        }
                        dirMostrarDetalleGuia(d.guia, d.items);
                    } catch(e) {
                        alert('Error al procesar datos de la guía.');
                    }
                }
            };
            xhr.onerror = function() {
                alert('Error de conexión.');
            };
            xhr.send();
        }

        function dirMostrarDetalleGuia(guia, items) {
            var html = '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
            html += '<tr style="background:#f5f5f5;"><td style="padding:8px;font-weight:700;color:#1a1a1a;border:1px solid #e0e0e0;">Campo</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">Valor</td></tr>';

            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Número Guía</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.numero + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Estado</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.estado.toUpperCase() + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Remitente</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.remitente_nombre + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Destinatario</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.destinatario_nombre + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Transporte Empresa</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.transporte_empresa + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Patente</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + guia.transporte_camion_patente + '</td></tr>';
            html += '<tr><td style="padding:8px;font-weight:600;color:#1a1a1a;border:1px solid #e0e0e0;">Inspector</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + (guia.inspector || '—') + '</td></tr>';

            if (items && items.length > 0) {
                html += '<tr><td colspan="2" style="padding:12px 8px;font-weight:700;color:#1a1a1a;background:#f5f5f5;border:1px solid #e0e0e0;">Productos (' + items.length + ')</td></tr>';
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    html += '<tr><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;"><strong>' + (i+1) + '.</strong> ' + item.especie + ' - ' + item.variedad + '</td><td style="padding:8px;color:#1a1a1a;border:1px solid #e0e0e0;">' + item.cantidad_bultos + ' bultos × ' + item.kilos_por_bulto + ' kg</td></tr>';
                }
            }

            html += '</table>';
            document.getElementById('dir-modal-contenido').innerHTML = html;
            document.getElementById('dir-modal-guia').style.display = 'block';
        }

        function dirCerrarModalGuia() {
            document.getElementById('dir-modal-guia').style.display = 'none';
        }

        // ── Funciones para gestionar barreristas ────────────────────────────
        function dirCargarBarreristas() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET',
                dirSiteUrl + '/?savean_ajax=director_inspectores' +
                '&auth=' + encodeURIComponent(dirAuthToken),
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var d = JSON.parse(xhr.responseText);
                        if (d.error) {
                            document.getElementById('dir-barreristas-lista').innerHTML = '<p style="color:#c62828;font-size:13px;">Error: ' + d.error + '</p>';
                            return;
                        }
                        dirMostrarBarreristas(d.inspectores);
                    } catch(e) {
                        document.getElementById('dir-barreristas-lista').innerHTML = '<p style="color:#888;font-size:13px;">Error al procesar datos.</p>';
                    }
                }
            };
            xhr.onerror = function() {
                document.getElementById('dir-barreristas-lista').innerHTML = '<p style="color:#888;font-size:13px;">Error de conexión.</p>';
            };
            xhr.send();
        }

        function dirMostrarBarreristas(inspectores) {
            if (!inspectores || inspectores.length === 0) {
                document.getElementById('dir-barreristas-lista').innerHTML = '<p style="color:#888;font-size:13px;">No hay barreristas registrados.</p>';
                return;
            }

            var html = '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
            html += '<tr style="background:#f5f5f5;"><th style="padding:8px;text-align:left;color:#333;border:1px solid #e0e0e0;">Nombre</th><th style="padding:8px;text-align:left;color:#333;border:1px solid #e0e0e0;">Usuario</th><th style="padding:8px;text-align:center;color:#333;border:1px solid #e0e0e0;">Acción</th></tr>';

            for (var i = 0; i < inspectores.length; i++) {
                var insp = inspectores[i];
                html += '<tr style="border-bottom:1px solid #e0e0e0;">';
                html += '<td style="padding:8px;color:#1a1a1a;font-weight:600;border:1px solid #e0e0e0;">' + insp.nombre + '</td>';
                html += '<td style="padding:8px;color:#555;border:1px solid #e0e0e0;">' + insp.usuario + '</td>';
                html += '<td style="padding:8px;text-align:center;border:1px solid #e0e0e0;"><button type="button" onclick="dirEliminarInspector(' + insp.id + ')" style="background:#c62828;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700;">Eliminar</button></td>';
                html += '</tr>';
            }
            html += '</table>';
            document.getElementById('dir-barreristas-lista').innerHTML = html;
        }

        function dirAgregarInspector() {
            var nombre = document.getElementById('dir-insp-nombre').value.trim();
            var usuario = document.getElementById('dir-insp-usuario').value.trim();
            var clave = document.getElementById('dir-insp-clave').value;

            if (!nombre || !usuario || !clave) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            var fd = new FormData();
            fd.append('auth', dirAuthToken);
            fd.append('nombre', nombre);
            fd.append('usuario', usuario);
            fd.append('clave', clave);

            var xhr = new XMLHttpRequest();
            xhr.open('POST',
                dirSiteUrl + '/?savean_ajax=director_inspector_add',
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var d = JSON.parse(xhr.responseText);
                        if (d.error) {
                            alert('Error: ' + d.error);
                        } else if (d.success) {
                            document.getElementById('dir-insp-nombre').value = '';
                            document.getElementById('dir-insp-usuario').value = '';
                            document.getElementById('dir-insp-clave').value = '';
                            dirCargarBarreristas();
                        }
                    } catch(e) {
                        alert('Error al procesar respuesta.');
                    }
                }
            };
            xhr.onerror = function() {
                alert('Error de conexión.');
            };
            xhr.send(fd);
        }

        function dirEliminarInspector(id) {
            if (!confirm('¿Está seguro de que desea eliminar este barrerista?')) return;

            var fd = new FormData();
            fd.append('auth', dirAuthToken);
            fd.append('id', id);

            var xhr = new XMLHttpRequest();
            xhr.open('POST',
                dirSiteUrl + '/?savean_ajax=director_inspector_del',
                true
            );
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var d = JSON.parse(xhr.responseText);
                        if (d.error) {
                            alert('Error: ' + d.error);
                        } else if (d.success) {
                            dirCargarBarreristas();
                        }
                    } catch(e) {
                        alert('Error al procesar respuesta.');
                    }
                }
            };
            xhr.onerror = function() {
                alert('Error de conexión.');
            };
            xhr.send(fd);
        }
        </script>
        <?php
    }

    return ob_get_clean();
}

// -----------------------------------------------
// PÁGINA SAVEAN — MODO EN CONSTRUCCIÓN
// -----------------------------------------------
add_action( 'template_redirect', 'savean_modo_construccion' );

function savean_modo_construccion() {
    if ( ! is_page( 'savean' ) ) return;

    // Cambiá esta línea a false cuando quieras que la página sea visible
    $en_construccion = false;

    if ( ! $en_construccion ) return;

    ?>
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SAVEAN — Agencia Calidad San Juan</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', system-ui, sans-serif;
                background: #fff;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #1a1a1a;
            }
            .wrap {
                text-align: center;
                padding: 40px 24px;
                max-width: 520px;
            }
            .badge {
                display: inline-block;
                background: #fff3e8;
                color: #e07b29;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                padding: 6px 16px;
                border-radius: 20px;
                margin-bottom: 28px;
            }
            h1 {
                font-size: 28px;
                font-weight: 600;
                color: #e07b29;
                margin-bottom: 12px;
                line-height: 1.3;
            }
            p {
                font-size: 15px;
                color: #666;
                line-height: 1.7;
                margin-bottom: 32px;
            }
            .divider {
                width: 48px;
                height: 3px;
                background: #f97316;
                border-radius: 2px;
                margin: 0 auto 32px;
            }
            .logo-agencia {
                margin-bottom: 36px;
                opacity: 0.7;
                font-size: 13px;
                color: #999;
                letter-spacing: 1px;
                text-transform: uppercase;
            }
            a.volver {
                color: #e07b29;
                font-size: 13px;
                text-decoration: none;
                border-bottom: 1px solid #f97316;
                padding-bottom: 2px;
            }
            a.volver:hover { opacity: 0.7; }
        </style>
    </head>
    <body>
        <div class="wrap">
            <div class="logo-agencia">Agencia Calidad San Juan</div>
            <div class="badge">🔧 En construcción</div>
            <h1>Sanidad Vegetal y Animal</h1>
            <div class="divider"></div>
            <p>El portal SAVEAN está siendo desarrollado.<br>Pronto vas a poder completar tu Guía de Origen digital y acceder a todos los servicios del programa.</p>
            <a href="/" class="volver">← Volver al sitio principal</a>
        </div>
    </body>
    </html>
    <?php
    exit;
}

/**
 * ============================================
 * REST API para la interfaz de Secretarias
 * ============================================
 */

// Registrar rol "secretaria" y capacidades
add_action( 'init', 'savean_registrar_rol' );
function savean_registrar_rol() {
    $role_slug = 'savean_secretaria';
    if ( ! get_role( $role_slug ) ) {
        add_role( $role_slug, 'Secretaria SAVEAN', [
            'read'                        => true,
            'savean_manage_guias'         => true,
            'savean_ver_inspectores'      => true,
        ] );
    }

    // Dar capacidades a administrador
    $admin = get_role( 'administrator' );
    if ( $admin ) {
        $admin->add_cap( 'savean_manage_guias' );
        $admin->add_cap( 'savean_manage_inspectores' );
        $admin->add_cap( 'savean_ver_inspectores' );
    }
}

// Registrar endpoints REST
add_action( 'rest_api_init', 'savean_registrar_endpoints' );
function savean_registrar_endpoints() {

    // GET /wp-json/savean/v1/guias - Listar guías
    register_rest_route( 'savean/v1', '/guias', [
        'methods'             => 'GET',
        'callback'            => 'savean_rest_listar_guias',
        'permission_callback' => 'savean_rest_check_permiso_lectura',
    ] );

    // POST /wp-json/savean/v1/guias - Crear guía
    register_rest_route( 'savean/v1', '/guias', [
        'methods'             => 'POST',
        'callback'            => 'savean_rest_crear_guia',
        'permission_callback' => 'savean_rest_check_permiso_escritura',
    ] );

    // GET /wp-json/savean/v1/guias/(?P<id>\d+) - Detalle de guía
    register_rest_route( 'savean/v1', '/guias/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'savean_rest_obtener_guia',
        'permission_callback' => 'savean_rest_check_permiso_lectura',
    ] );

    // PUT /wp-json/savean/v1/guias/(?P<id>\d+) - Editar guía
    register_rest_route( 'savean/v1', '/guias/(?P<id>\d+)', [
        'methods'             => 'PUT',
        'callback'            => 'savean_rest_editar_guia',
        'permission_callback' => 'savean_rest_check_permiso_escritura',
    ] );

    // DELETE /wp-json/savean/v1/guias/(?P<id>\d+) - Eliminar guía
    register_rest_route( 'savean/v1', '/guias/(?P<id>\d+)', [
        'methods'             => 'DELETE',
        'callback'            => 'savean_rest_eliminar_guia',
        'permission_callback' => 'savean_rest_check_permiso_admin',
    ] );

    // GET /wp-json/savean/v1/inspectores - Listar inspectores
    register_rest_route( 'savean/v1', '/inspectores', [
        'methods'             => 'GET',
        'callback'            => 'savean_rest_listar_inspectores',
        'permission_callback' => 'savean_rest_check_permiso_lectura',
    ] );

    // POST /wp-json/savean/v1/inspectores - Crear inspector
    register_rest_route( 'savean/v1', '/inspectores', [
        'methods'             => 'POST',
        'callback'            => 'savean_rest_crear_inspector',
        'permission_callback' => 'savean_rest_check_permiso_admin',
    ] );

    // PUT /wp-json/savean/v1/inspectores/(?P<id>\d+) - Editar inspector
    register_rest_route( 'savean/v1', '/inspectores/(?P<id>\d+)', [
        'methods'             => 'PUT',
        'callback'            => 'savean_rest_editar_inspector',
        'permission_callback' => 'savean_rest_check_permiso_admin',
    ] );

    // DELETE /wp-json/savean/v1/inspectores/(?P<id>\d+) - Eliminar inspector
    register_rest_route( 'savean/v1', '/inspectores/(?P<id>\d+)', [
        'methods'             => 'DELETE',
        'callback'            => 'savean_rest_eliminar_inspector',
        'permission_callback' => 'savean_rest_check_permiso_admin',
    ] );

    // GET /wp-json/savean/v1/barreras - Listar barreras
    register_rest_route( 'savean/v1', '/barreras', [
        'methods'             => 'GET',
        'callback'            => 'savean_rest_listar_barreras',
        'permission_callback' => 'savean_rest_check_permiso_lectura',
    ] );

    // GET /wp-json/savean/v1/stats - Estadísticas
    register_rest_route( 'savean/v1', '/stats', [
        'methods'             => 'GET',
        'callback'            => 'savean_rest_obtener_stats',
        'permission_callback' => 'savean_rest_check_permiso_lectura',
    ] );
}

// Funciones de verificación de permisos
function savean_rest_check_permiso_lectura( $request ) {
    return current_user_can( 'savean_manage_guias' );
}

function savean_rest_check_permiso_escritura( $request ) {
    return current_user_can( 'savean_manage_guias' );
}

function savean_rest_check_permiso_admin( $request ) {
    return current_user_can( 'savean_manage_inspectores' );
}

// ============ ENDPOINTS DE GUÍAS ============

function savean_rest_listar_guias( $request ) {
    global $wpdb;

    $estado   = $request->get_param( 'estado' );
    $pagina   = intval( $request->get_param( 'pagina' ) ) ?: 1;
    $por_pagina = 20;

    $tabla = $wpdb->prefix . 'savean_guias';

    $where = '1=1';
    if ( $estado ) {
        $where .= $wpdb->prepare( ' AND estado = %s', $estado );
    }

    $offset = ( $pagina - 1 ) * $por_pagina;

    $guias = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM {$tabla} WHERE {$where} ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $por_pagina,
            $offset
        )
    );

    $total = $wpdb->get_var( "SELECT COUNT(*) FROM {$tabla} WHERE {$where}" );

    return [
        'data'      => $guias,
        'total'     => intval( $total ),
        'pagina'    => $pagina,
        'por_pagina'=> $por_pagina,
        'total_paginas' => ceil( $total / $por_pagina ),
    ];
}

function savean_rest_obtener_guia( $request ) {
    global $wpdb;

    $id = intval( $request->get_param( 'id' ) );

    $tabla_guias = $wpdb->prefix . 'savean_guias';
    $tabla_items = $wpdb->prefix . 'savean_guias_items';

    $guia = $wpdb->get_row(
        $wpdb->prepare( "SELECT * FROM {$tabla_guias} WHERE id = %d", $id )
    );

    if ( ! $guia ) {
        return new WP_Error( 'no_encontrado', 'Guía no encontrada', [ 'status' => 404 ] );
    }

    $items = $wpdb->get_results(
        $wpdb->prepare( "SELECT * FROM {$tabla_items} WHERE guia_id = %d", $id )
    );

    $guia->items = $items;

    return $guia;
}

function savean_rest_crear_guia( $request ) {
    global $wpdb;

    $params = $request->get_json_params();

    // Validar datos mínimos requeridos
    if ( empty( $params['remitente_nombre'] ) || empty( $params['items'] ) ) {
        return new WP_Error( 'datos_incompletos', 'Faltan datos requeridos' );
    }

    $numero = 'SAVEAN-' . date( 'Y' ) . '-' . str_pad( mt_rand( 1, 99999 ), 5, '0', STR_PAD_LEFT );
    $token  = wp_generate_password( 64, false, false );

    $tabla = $wpdb->prefix . 'savean_guias';

    $datos = [
        'numero'             => $numero,
        'token'              => $token,
        'estado'             => 'pendiente',
        'fecha_emision'      => current_time( 'mysql' ),
        'remitente_nombre'   => sanitize_text_field( $params['remitente_nombre'] ),
        'remitente_renspa'   => sanitize_text_field( $params['remitente_renspa'] ?? '' ),
        'remitente_inv'      => sanitize_text_field( $params['remitente_inv'] ?? '' ),
        'remitente_tipo'     => sanitize_text_field( $params['remitente_tipo'] ?? '' ),
        'destinatario_nombre'=> sanitize_text_field( $params['destinatario_nombre'] ?? '' ),
        'destino_tipo'       => sanitize_text_field( $params['destino_tipo'] ?? '' ),
        'destino_pais'       => sanitize_text_field( $params['destino_pais'] ?? '' ),
        'destino_punto_salida'=> sanitize_text_field( $params['destino_punto_salida'] ?? '' ),
        'destino_mercado_interno' => sanitize_text_field( $params['destino_mercado_interno'] ?? '' ),
        'transporte_empresa' => sanitize_text_field( $params['transporte_empresa'] ?? '' ),
        'transporte_conductor'=> sanitize_text_field( $params['transporte_conductor'] ?? '' ),
        'transporte_tipo'    => sanitize_text_field( $params['transporte_tipo'] ?? '' ),
        'transporte_camion_patente' => sanitize_text_field( $params['transporte_camion_patente'] ?? '' ),
        'transporte_acoplado_patente' => sanitize_text_field( $params['transporte_acoplado_patente'] ?? '' ),
        'email_contacto'     => sanitize_email( $params['email_contacto'] ?? '' ),
    ];

    $wpdb->insert( $tabla, $datos );
    $guia_id = $wpdb->insert_id;

    if ( ! $guia_id ) {
        return new WP_Error( 'db_error', 'Error al crear la guía' );
    }

    // Insertar ítems
    $tabla_items = $wpdb->prefix . 'savean_guias_items';
    foreach ( $params['items'] as $item ) {
        $wpdb->insert( $tabla_items, [
            'guia_id'         => $guia_id,
            'vinedo_numero'   => sanitize_text_field( $item['vinedo_numero'] ?? '' ),
            'lugar_empaque'   => sanitize_text_field( $item['lugar_empaque'] ?? '' ),
            'especie'         => sanitize_text_field( $item['especie'] ?? '' ),
            'variedad'        => sanitize_text_field( $item['variedad'] ?? '' ),
            'grado_seleccion' => sanitize_text_field( $item['grado_seleccion'] ?? '' ),
            'tamano'          => sanitize_text_field( $item['tamano'] ?? '' ),
            'subproducto'     => sanitize_text_field( $item['subproducto'] ?? '' ),
            'tipo_envase'     => sanitize_text_field( $item['tipo_envase'] ?? '' ),
            'cantidad_bultos' => intval( $item['cantidad_bultos'] ?? 0 ),
            'kilos_por_bulto' => floatval( $item['kilos_por_bulto'] ?? 0 ),
            'total_kilos'     => floatval( ( $item['cantidad_bultos'] ?? 0 ) * ( $item['kilos_por_bulto'] ?? 0 ) ),
        ] );
    }

    $guia = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $guia_id ) );

    return [
        'success' => true,
        'guia'    => $guia,
        'id'      => $guia_id,
    ];
}

function savean_rest_editar_guia( $request ) {
    global $wpdb;

    $id = intval( $request->get_param( 'id' ) );
    $params = $request->get_json_params();

    $tabla = $wpdb->prefix . 'savean_guias';

    // Verificar que existe
    $guia = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $id ) );
    if ( ! $guia ) {
        return new WP_Error( 'no_encontrado', 'Guía no encontrada', [ 'status' => 404 ] );
    }

    // Preparar datos para actualizar
    $datos = [];
    $allowed_fields = [
        'remitente_nombre', 'remitente_renspa', 'remitente_inv', 'remitente_tipo',
        'destinatario_nombre', 'destino_tipo', 'destino_pais', 'destino_punto_salida',
        'destino_mercado_interno', 'transporte_empresa', 'transporte_conductor',
        'transporte_tipo', 'transporte_camion_marca', 'transporte_camion_patente',
        'transporte_acoplado_marca', 'transporte_acoplado_patente', 'transporte_precintos',
        'email_contacto',
    ];

    foreach ( $allowed_fields as $field ) {
        if ( isset( $params[ $field ] ) ) {
            $datos[ $field ] = sanitize_text_field( $params[ $field ] );
        }
    }

    if ( ! empty( $datos ) ) {
        $wpdb->update( $tabla, $datos, [ 'id' => $id ] );
    }

    // Actualizar ítems si existen
    if ( isset( $params['items'] ) ) {
        $tabla_items = $wpdb->prefix . 'savean_guias_items';
        // Borrar ítems anteriores
        $wpdb->delete( $tabla_items, [ 'guia_id' => $id ] );
        // Insertar nuevos
        foreach ( $params['items'] as $item ) {
            $wpdb->insert( $tabla_items, [
                'guia_id'         => $id,
                'vinedo_numero'   => sanitize_text_field( $item['vinedo_numero'] ?? '' ),
                'lugar_empaque'   => sanitize_text_field( $item['lugar_empaque'] ?? '' ),
                'especie'         => sanitize_text_field( $item['especie'] ?? '' ),
                'variedad'        => sanitize_text_field( $item['variedad'] ?? '' ),
                'grado_seleccion' => sanitize_text_field( $item['grado_seleccion'] ?? '' ),
                'tamano'          => sanitize_text_field( $item['tamano'] ?? '' ),
                'subproducto'     => sanitize_text_field( $item['subproducto'] ?? '' ),
                'tipo_envase'     => sanitize_text_field( $item['tipo_envase'] ?? '' ),
                'cantidad_bultos' => intval( $item['cantidad_bultos'] ?? 0 ),
                'kilos_por_bulto' => floatval( $item['kilos_por_bulto'] ?? 0 ),
                'total_kilos'     => floatval( ( $item['cantidad_bultos'] ?? 0 ) * ( $item['kilos_por_bulto'] ?? 0 ) ),
            ] );
        }
    }

    $guia_actualizada = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $id ) );

    return [
        'success' => true,
        'guia'    => $guia_actualizada,
    ];
}

function savean_rest_eliminar_guia( $request ) {
    global $wpdb;

    $id = intval( $request->get_param( 'id' ) );

    $tabla = $wpdb->prefix . 'savean_guias';

    $guia = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $id ) );
    if ( ! $guia ) {
        return new WP_Error( 'no_encontrado', 'Guía no encontrada', [ 'status' => 404 ] );
    }

    // Eliminar ítems relacionados
    $tabla_items = $wpdb->prefix . 'savean_guias_items';
    $wpdb->delete( $tabla_items, [ 'guia_id' => $id ] );

    // Eliminar guía
    $wpdb->delete( $tabla, [ 'id' => $id ] );

    return [ 'success' => true, 'mensaje' => 'Guía eliminada correctamente' ];
}

// ============ ENDPOINTS DE INSPECTORES ============

function savean_rest_listar_inspectores( $request ) {
    global $wpdb;

    $tabla = $wpdb->prefix . 'savean_inspectores';

    $inspectores = $wpdb->get_results( "SELECT id, usuario, nombre, activo, created_at FROM {$tabla} ORDER BY created_at DESC" );

    return [ 'data' => $inspectores ];
}

function savean_rest_crear_inspector( $request ) {
    global $wpdb;

    $params = $request->get_json_params();

    if ( empty( $params['usuario'] ) || empty( $params['clave'] ) || empty( $params['nombre'] ) ) {
        return new WP_Error( 'datos_incompletos', 'Faltan datos requeridos: usuario, clave, nombre' );
    }

    $tabla = $wpdb->prefix . 'savean_inspectores';

    // Verificar que el usuario no exista
    $existe = $wpdb->get_row( $wpdb->prepare( "SELECT id FROM {$tabla} WHERE usuario = %s", $params['usuario'] ) );
    if ( $existe ) {
        return new WP_Error( 'usuario_existe', 'El usuario ya existe' );
    }

    $clave_hash = password_hash( $params['clave'], PASSWORD_DEFAULT );

    $wpdb->insert( $tabla, [
        'usuario' => sanitize_text_field( $params['usuario'] ),
        'clave'   => $clave_hash,
        'nombre'  => sanitize_text_field( $params['nombre'] ),
        'activo'  => intval( $params['activo'] ?? 1 ),
    ] );

    $id = $wpdb->insert_id;
    $inspector = $wpdb->get_row( $wpdb->prepare( "SELECT id, usuario, nombre, activo, created_at FROM {$tabla} WHERE id = %d", $id ) );

    return [
        'success'   => true,
        'inspector' => $inspector,
        'id'        => $id,
    ];
}

function savean_rest_editar_inspector( $request ) {
    global $wpdb;

    $id = intval( $request->get_param( 'id' ) );
    $params = $request->get_json_params();

    $tabla = $wpdb->prefix . 'savean_inspectores';

    $inspector = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $id ) );
    if ( ! $inspector ) {
        return new WP_Error( 'no_encontrado', 'Inspector no encontrado', [ 'status' => 404 ] );
    }

    $datos = [];

    if ( isset( $params['nombre'] ) ) {
        $datos['nombre'] = sanitize_text_field( $params['nombre'] );
    }

    if ( isset( $params['activo'] ) ) {
        $datos['activo'] = intval( $params['activo'] );
    }

    if ( ! empty( $params['clave'] ) ) {
        $datos['clave'] = password_hash( $params['clave'], PASSWORD_DEFAULT );
    }

    if ( ! empty( $datos ) ) {
        $wpdb->update( $tabla, $datos, [ 'id' => $id ] );
    }

    $inspector_actualizado = $wpdb->get_row( $wpdb->prepare( "SELECT id, usuario, nombre, activo, created_at FROM {$tabla} WHERE id = %d", $id ) );

    return [
        'success'   => true,
        'inspector' => $inspector_actualizado,
    ];
}

function savean_rest_eliminar_inspector( $request ) {
    global $wpdb;

    $id = intval( $request->get_param( 'id' ) );

    $tabla = $wpdb->prefix . 'savean_inspectores';

    $inspector = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$tabla} WHERE id = %d", $id ) );
    if ( ! $inspector ) {
        return new WP_Error( 'no_encontrado', 'Inspector no encontrado', [ 'status' => 404 ] );
    }

    $wpdb->delete( $tabla, [ 'id' => $id ] );

    return [ 'success' => true, 'mensaje' => 'Inspector eliminado correctamente' ];
}

// ============ ENDPOINTS DE DATOS COMPLEMENTARIOS ============

function savean_rest_listar_barreras( $request ) {
    global $wpdb;

    $tabla = $wpdb->prefix . 'savean_barreras';

    $barreras = $wpdb->get_results( "SELECT * FROM {$tabla} WHERE activa = 1 ORDER BY nombre ASC" );

    return [ 'data' => $barreras ];
}

function savean_rest_obtener_stats( $request ) {
    global $wpdb;

    $tabla_guias = $wpdb->prefix . 'savean_guias';

    // Contar por estado
    $pendientes = intval( $wpdb->get_var( "SELECT COUNT(*) FROM {$tabla_guias} WHERE estado = 'pendiente'" ) );
    $verificadas = intval( $wpdb->get_var( "SELECT COUNT(*) FROM {$tabla_guias} WHERE estado = 'verificada'" ) );
    $vencidas = intval( $wpdb->get_var( "SELECT COUNT(*) FROM {$tabla_guias} WHERE estado = 'vencida'" ) );
    $denegadas = intval( $wpdb->get_var( "SELECT COUNT(*) FROM {$tabla_guias} WHERE estado = 'denegada'" ) );

    return [
        'pendientes'  => $pendientes,
        'verificadas' => $verificadas,
        'vencidas'    => $vencidas,
        'denegadas'   => $denegadas,
        'total'       => $pendientes + $verificadas + $vencidas + $denegadas,
    ];
}

// Habilitar CORS para la SPA
add_action( 'rest_api_init', 'savean_agregar_cors_headers', 15 );
function savean_agregar_cors_headers() {
    // Obtener el origen desde la solicitud
    $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? sanitize_text_field( $_SERVER['HTTP_ORIGIN'] ) : '';

    // Permitir localhost en desarrollo y el sitio en producción
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:3000',
        set_url_scheme( get_option( 'siteurl' ), 'https' ),
    ];

    if ( in_array( $origin, $allowed_origins, true ) ) {
        header( 'Access-Control-Allow-Origin: ' . $origin );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
    }
}

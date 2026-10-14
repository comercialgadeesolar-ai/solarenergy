<?php
// Browser fixture simulating a theme page without the solar shortcode.
require __DIR__ . '/wordpress-stubs.php';
$wp_test_current_post = (object) array('ID' => 20, 'post_content' => 'Sobre a empresa');
$wp_test_asset_prefix = '../';
$wp_test_landing_url = '../index.php';
require dirname(__DIR__) . '/orbita-solar.php';
orbita_solar_register_assets();
orbita_solar_detect_shortcode();
?><!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Outra página — teste de navegação</title><link rel="stylesheet" href="../public/floating-menu.css"></head>
<body style="margin:0;background:#fafafa;font:16px system-ui">
<main style="min-height:2400px;padding:32px"><h1>Sobre a empresa</h1><p>Página de teste sem o shortcode solar.</p></main>
<?php orbita_solar_global_menu(); ?>
<script src="../public/floating-menu.js"></script>
</body></html>

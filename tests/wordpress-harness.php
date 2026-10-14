<?php
// Tests the plugin contract using isolated WordPress API stubs, without production credentials.
require __DIR__ . '/wordpress-stubs.php';
function check($condition, $message) { if (!$condition) { fwrite(STDERR, 'FAIL: ' . $message . PHP_EOL); exit(1); } echo 'PASS: ' . $message . PHP_EOL; }
require dirname(__DIR__) . '/orbita-solar.php';
check(isset($shortcodes['orbita_solar']), 'shortcode registered');
orbita_solar_register_assets();
check(strpos($registered['script']['orbita-solar'], 'dist/orbita-solar.js') !== false, 'bundled JS registered');
check(strpos($registered['style']['orbita-solar'], 'dist/orbita-solar.css') !== false, 'bundled CSS registered');
check(isset($enqueued['style']['orbita-solar-menu'], $enqueued['script']['orbita-solar-menu']), 'global menu assets loaded on all pages');
orbita_solar_detect_shortcode();
check(isset($enqueued['style']['orbita-solar'], $enqueued['script']['orbita-solar']), 'assets enqueued before rendering');
$html = orbita_solar_render();
check(strpos($html, 'O futuro é solar.') !== false, 'HTML server-rendered');
check(substr_count($html, 'class="planet-pill') === 9, 'nine astro selectors rendered');
check(strpos($html, 'id="orbita-solar"') !== false, 'scoped application wrapper rendered');
check(orbita_solar_render() === '', 'duplicate instance prevented');
check(orbita_solar_module_script('<script>original</script>', 'other', '') === '<script>original</script>', 'other plugin scripts preserved');
check(strpos(orbita_solar_module_script('', 'orbita-solar', 'https://example.test/solar.js'), 'type="module"') !== false, 'module attribute applied');
check(is_file(dirname(__DIR__) . '/dist/orbita-solar.js') && is_file(dirname(__DIR__) . '/dist/orbita-solar.css'), 'production assets present');
check(in_array('orbita_solar_global_menu', $actions['wp_footer'], true), 'global menu hooked into every frontend footer');
$wp_test_current_post = (object) array('ID' => 20, 'post_content' => 'Outra página');
check(orbita_solar_landing_url() === 'https://example.test/energia-solar/', 'other pages link to published solar page');
$enqueued = array();
orbita_solar_register_assets();
orbita_solar_detect_shortcode();
check(isset($enqueued['script']['orbita-solar-menu']) && !isset($enqueued['script']['orbita-solar']), 'other pages load navigation without the 3D application');
ob_start();
orbita_solar_global_menu();
$menu = ob_get_clean();
check(substr_count($menu, 'data-section=') === 5, 'five global navigation destinations rendered');
check(strpos($menu, 'href="https://example.test/energia-solar/#simulador"') !== false, 'global links include the landing page URL');
ob_start();
orbita_solar_global_menu();
check(ob_get_clean() === '', 'global menu renders once');
$wp_test_landing_post = null;
check(orbita_solar_landing_url() === 'https://example.test/', 'home fallback before landing page publication');

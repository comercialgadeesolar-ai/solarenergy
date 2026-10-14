<?php
// Isolated API stubs used by the contract harness and the other-page browser fixture.
define('ABSPATH', __DIR__);
$actions = array();
$filters = array();
$shortcodes = array();
$enqueued = array();
$registered = array();
$wp_test_current_post = (object) array('ID' => 10, 'post_content' => '[orbita_solar]');
$wp_test_landing_post = (object) array('ID' => 10, 'post_content' => '[orbita_solar]');
$wp_test_asset_prefix = 'https://example.test/wp-content/plugins/orbita-solar/';
$wp_test_landing_url = 'https://example.test/energia-solar/';
function add_action($name, $callback, $priority = 10) { global $actions; $actions[$name][] = $callback; }
function add_filter($name, $callback, $priority = 10, $args = 1) { global $filters; $filters[$name] = $callback; }
function add_shortcode($name, $callback) { global $shortcodes; $shortcodes[$name] = $callback; }
function plugins_url($path, $file) { global $wp_test_asset_prefix; return $wp_test_asset_prefix . $path; }
function wp_register_style($handle, $src, $deps, $version) { global $registered; $registered['style'][$handle] = $src; }
function wp_register_script($handle, $src, $deps, $version, $footer) { global $registered; $registered['script'][$handle] = $src; }
function wp_enqueue_style($handle) { global $enqueued; $enqueued['style'][$handle] = true; }
function wp_enqueue_script($handle) { global $enqueued; $enqueued['script'][$handle] = true; }
function esc_url($url) { return htmlspecialchars($url, ENT_QUOTES, 'UTF-8'); }
function is_singular() { return true; }
function get_post() { global $wp_test_current_post; return $wp_test_current_post; }
function get_posts($args) { global $wp_test_landing_post; return $wp_test_landing_post ? array($wp_test_landing_post) : array(); }
function get_permalink($post) { global $wp_test_landing_url; return $wp_test_landing_url; }
function home_url($path) { return 'https://example.test' . $path; }
function has_shortcode($content, $tag) { return strpos($content, '[' . $tag . ']') !== false; }

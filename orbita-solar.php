<?php
/**
 * Plugin Name: Órbita Solar — Universo 3D
 * Description: Site responsivo sobre energia solar fotovoltaica, sistema solar 3D e simulador. Use o shortcode [orbita_solar].
 * Version: 1.3.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Órbita Solar
 * License: GPL-2.0-or-later
 * Text Domain: orbita-solar
 */

if (!defined('ABSPATH')) {
    exit;
}

function orbita_solar_register_assets() {
    wp_register_style('orbita-solar', plugins_url('dist/orbita-solar.css', __FILE__), array(), '1.3.0');
    wp_register_script('orbita-solar', plugins_url('dist/orbita-solar.js', __FILE__), array(), '1.3.0', true);
    wp_register_style('orbita-solar-menu', plugins_url('public/floating-menu.css', __FILE__), array(), '1.3.0');
    wp_register_script('orbita-solar-menu', plugins_url('public/floating-menu.js', __FILE__), array(), '1.3.0', true);
    wp_enqueue_style('orbita-solar-menu');
    wp_enqueue_script('orbita-solar-menu');
}
add_action('wp_enqueue_scripts', 'orbita_solar_register_assets');

function orbita_solar_module_script($tag, $handle, $src) {
    if ($handle !== 'orbita-solar') {
        return $tag;
    }
    return '<script type="module" src="' . esc_url($src) . '" id="orbita-solar-js"></script>';
}
add_filter('script_loader_tag', 'orbita_solar_module_script', 10, 3);

function orbita_solar_render() {
    static $rendered = false;
    if ($rendered) {
        return ''; // One interactive experience per page, preserving unique DOM IDs.
    }
    $rendered = true;
    wp_enqueue_style('orbita-solar');
    wp_enqueue_script('orbita-solar');
    ob_start();
    ?>
    <div class="orbita-solar" id="orbita-solar" lang="pt-BR">
        <div id="app"><?php include __DIR__ . '/templates/landing.html'; ?></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('orbita_solar', 'orbita_solar_render');

// Enqueue CSS before wp_head on ordinary shortcode pages to avoid an unstyled flash.
function orbita_solar_detect_shortcode() {
    if (is_singular()) {
        $post = get_post();
        if ($post && has_shortcode($post->post_content, 'orbita_solar')) {
            wp_enqueue_style('orbita-solar');
            wp_enqueue_script('orbita-solar');
        }
    }
}
add_action('wp_enqueue_scripts', 'orbita_solar_detect_shortcode', 20);

function orbita_solar_landing_url() {
    $current = is_singular() ? get_post() : null;
    if ($current && has_shortcode($current->post_content, 'orbita_solar')) {
        return get_permalink($current);
    }
    $pages = get_posts(array(
        'post_type' => 'page',
        'post_status' => 'publish',
        's' => 'orbita_solar',
        'numberposts' => 100,
        'orderby' => 'date',
        'order' => 'ASC',
    ));
    foreach ($pages as $page) {
        if (has_shortcode($page->post_content, 'orbita_solar')) {
            return get_permalink($page);
        }
    }
    return home_url('/');
}

function orbita_solar_global_menu() {
    static $rendered = false;
    if ($rendered) {
        return;
    }
    $rendered = true;
    $url = orbita_solar_landing_url();
    $menu = file_get_contents(__DIR__ . '/templates/floating-menu.html');
    echo str_replace('href="#', 'href="' . esc_url($url) . '#', $menu);
}
add_action('wp_footer', 'orbita_solar_global_menu', 5);

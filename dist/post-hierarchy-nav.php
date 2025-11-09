<?php
/**
 * Plugin Name: Post Hierarchy Nav
 * Plugin URI: https://yalogica.com/post-hierarchy-nav
 * Description: Dynamic hierarchical navigation for posts, pages & custom post types in Gutenberg.
 * Tags: gutenberg, navigation, post hierarchy, sidebar, menu
 * Version: 1.0.0
 * Requires at least: 6.3
 * Requires PHP: 8.2
 * Author: Yalogica
 * Author URI: https://yalogica.com
 * License: GPLv3
 * Text Domain: post-hierarchy-nav
 * Domain Path: /languages
 */
namespace Yalogica\PostHierarchyNav;

defined( 'ABSPATH' ) || exit;

define( 'YALOGICA_POST_HIERARCHY_NAV_PLUGIN_NAME', 'post-hierarchy-nav' );
define( 'YALOGICA_POST_HIERARCHY_NAV_PLUGIN_VERSION', '1.0.0' );
define( 'YALOGICA_POST_HIERARCHY_NAV_PLUGIN_BASE_NAME', plugin_basename( __FILE__ ) );
define( 'YALOGICA_POST_HIERARCHY_NAV_PLUGIN_PATH', __DIR__ );
define( 'YALOGICA_POST_HIERARCHY_NAV_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once( __DIR__ . '/includes/autoload.php' );

new Plugin();
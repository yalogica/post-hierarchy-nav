<?php
namespace Yalogica\PostHierarchyNav;

defined( 'ABSPATH' ) || exit;

class Plugin {
    public const OPTION_VERSION = '_post_hierarchy_nav';
    public const OPTION_DATE = '_post_hierarchy_nav_date';

    public function __construct() {
        $this->updateVersion();
        $this->updateDate();

        new Blocks\NavigationBlock();
    }

    private function updateVersion() {
        if ( version_compare( get_option( self::OPTION_VERSION ), POST_HIERARCHY_NAV_PLUGIN_VERSION, '<' ) ) {
            update_option( self::OPTION_VERSION, POST_HIERARCHY_NAV_PLUGIN_VERSION );
        }
    }

    private function updateDate() {
        if ( !get_option( self::OPTION_DATE ) ) {
            update_option( self::OPTION_DATE, time() );
        }
    }
}
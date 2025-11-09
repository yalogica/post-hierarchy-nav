<?php
namespace Yalogica\PostHierarchyNav\Blocks;

defined( 'ABSPATH' ) || exit;

class NavigationBlock {
    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }
    
    public function init() {
        register_block_type( POST_HIERARCHY_NAV_PLUGIN_PATH . '/assets/blocks/navigation-block', [ 'render_callback' => [ $this, 'renderBlock' ] ]);
    }

    public function renderBlock( $attributes = [] ) {
        if ( !is_array( $attributes ) ) {
            $attributes = [];
        }

        $rootClasses = [];
        if ( !empty( $attributes['className'] ) ) {
            $customClasses = explode( ' ', $attributes['className'] );
            $sanitized = array_map( 'sanitize_html_class', $customClasses );
            $rootClasses = array_merge( $rootClasses, $sanitized );
        }
        $activeClass = !empty( $attributes['activePostClassName'] ) ? sanitize_html_class( $attributes['activePostClassName'] ) : '';
        
        $postType = isset( $attributes['postType'] ) && post_type_exists( $attributes['postType'] ) ? sanitize_key( $attributes['postType'] ) : 'post';
        $mode = isset( $attributes['mode'] ) && in_array( $attributes['mode'], [ 'all', 'custom', 'auto' ], true ) ? $attributes['mode'] : 'all';
        $showCount = !empty( $attributes['showCount'] ) && $attributes['showCount'] === true;
        
        $rootId = 0;
        if ( $mode === 'auto' ) {
            $currentId = get_the_ID();
            if ( $currentId ) {
                $rootId = $this->getRootAncestorId( $currentId, $postType );
            }
        } elseif ( $mode === 'custom' ) {
            $customPostId = isset( $attributes['customPostId'] ) ? (int) $attributes['customPostId'] : 0;
            if ( $customPostId && get_post_status( $customPostId ) && get_post_type( $customPostId ) === $postType ) {
                $rootId = $customPostId;
            }
        }

        $output = $this->renderTreeLevel( $rootId, $postType, $showCount, $activeClass );

        if ( empty( $output ) ) {
            return '<p>No items found.</p>';
        }

        $classAttr = count($rootClasses) > 0 ? ' class="' . esc_attr( implode( ' ', array_filter( $rootClasses ) ) ) . '"' : '';
        return '<ul' . $classAttr . '>' . $output . '</ul>';
    }

    private function getRootAncestorId( $postId, $postType ) {
        $post = get_post( $postId );
        if ( ! $post || $post->post_type !== $postType ) {
            return 0;
        }

        while ( $post->post_parent != 0 ) {
            $post = get_post( $post->post_parent );
            if ( ! $post || $post->post_type !== $postType ) {
                break;
            }
        }

        return $post ? $post->ID : 0;
    }

    private function renderTreeLevel( $parentId, $postType, $showCount, $activeClass ) {
        $children = get_pages( [
            'post_type' => $postType,
            'parent'    => $parentId,
            'sort_column' => 'menu_order, post_title',
            'hierarchical' => false,
        ] );

        if ( empty( $children ) ) {
            return '';
        }

        $output = '';
        $currentId = get_the_ID();

        foreach ( $children as $post ) {
            $isActive = ( $post->ID === $currentId );
            $itemClasses = [];
            if ( $isActive && !empty( $activeClass ) ) {
                $itemClasses[] = $activeClass;
            }

            $linkContent = esc_html( $post->post_title );

            if ( $showCount ) {
                $hasChildren = get_pages( [
                    'post_type' => $postType,
                    'parent'    => $post->ID
                ]);

                if ( !empty( $hasChildren ) ) {
                    $linkContent .= ' <span>' . count( $hasChildren ) . '</span>';
                }
            }

            $classAttr = count($itemClasses) > 0 ? ' class="' . esc_attr( implode( ' ', array_filter( $itemClasses ) ) ) . '"' : '';

            $output .= '<li ' .  $classAttr . '>';
            $output .= '<a href="' . esc_url( get_permalink( $post->ID ) ) . '">' . $linkContent . '</a>';
            
            $childTree = $this->renderTreeLevel( $post->ID, $postType, $showCount, $activeClass );
            if ( $childTree ) {
                $output .= '<ul class="has-posts">' . $childTree . '</ul>';
            }

            $output .= '</li>';
        }

        return $output;
    }
}
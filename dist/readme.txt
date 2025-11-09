=== Post Hierarchy Nav ===
Contributors: yalogica
Tags: gutenberg, navigation, post hierarchy, sidebar, menu
Requires at least: 6.3
Tested up to: 6.8
Stable tag: 1.0.0
Requires PHP: 8.2
License: GPLv3

Display dynamic, hierarchical navigation trees for posts, pages, and custom post types - directly in the Gutenberg editor.

== Description ==

**Post Hierarchy Nav** is a lightweight Gutenberg block that renders clean, semantic navigation trees based on your existing post hierarchy. Perfect for documentation sites, knowledge bases, or any site using hierarchical content.

### ✨ Features
✅ Works with **posts, pages, and any hierarchical custom post type**  
✅ Three display modes: **All**, **Auto (current context)**, or **Custom root**  
✅ Live preview via **ServerSideRender** — see changes instantly in the editor  
✅ Optional **child count** badge (e.g., "Integrations <span>2</span>")  
✅ Fully customizable CSS classes for root and active items  
✅ Respects WordPress permissions and core data APIs  

### 🎯 Use Cases
- Create **auto-expanding documentation menus**
- Build **context-aware sidebars** that highlight the current page's branch
- Replace hardcoded menus with **dynamic, maintainable trees**

### 🔐 Privacy & Performance
- **Zero tracking** — no data collected, no external requests
- **Lightweight** — only loads when the block is used
- **GDPR compliant** by design

== Installation ==

1. Upload the `post-hierarchy-nav` folder to your `/wp-content/plugins/` directory.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Add the **Post Hierarchy Nav** block to any post or page.
4. Configure post type, mode, and styling in the block inspector.

== Frequently Asked Questions ==

= Does it work with custom post types? =
Yes! As long as your CPT is registered with `'hierarchical' => true` and `'show_in_rest' => true`.

= How is the "Auto" mode determined? =
It finds the top-level ancestor of the current page/post and renders its subtree.

= Can I style the active item? =
Yes! Use the **"Active item CSS class"** field in the Advanced panel (defaults to `active`).

= Why require WordPress 6.3+? =
The block uses modern Gutenberg APIs (`core-data`, `EntityPicker`, `ServerSideRender`) that are stable from WP 6.3 onward.

== Changelog ==

= 1.0.0 =
* Initial release
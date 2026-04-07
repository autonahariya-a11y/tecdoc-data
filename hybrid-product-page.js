(function() {
  'use strict';

  /* ===================================================
     CSS INJECTION — v3.1 with an- prefix + TecDoc styles
     =================================================== */
  if (!document.getElementById('an-style-v3')) {
    var styleEl = document.createElement('style');
    styleEl.id = 'an-style-v3';
    styleEl.textContent = [
      /* Konimbo hiding rules */
      'body.an-redesigned #item_show, body.an-redesigned #item_content, body.an-redesigned .specifications, body.an-redesigned #item_show_facebook, body.an-redesigned #item_show_carousel, body.an-redesigned .item_show_carousel, body.an-redesigned .item_container, body.an-redesigned #item_info, body.an-redesigned .item_main_top, body.an-redesigned #bread_crumbs, body.an-redesigned .product-container, body.an-redesigned #item_current_title, body.an-redesigned .code_item, body.an-redesigned #page_notice, body.an-redesigned #storiesWidget, body.an-redesigned .stories-wrapper { display: none !important; }',
      'body.an-redesigned #item_details, body.an-redesigned .item_main_bottom { display: block !important; height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; border: none !important; opacity: 0 !important; pointer-events: none !important; }',
      'body.an-redesigned .tw-strengths, body.an-redesigned #tw-brand-info { display: none !important; }',

      /* CSS Variables */
      ':root {',
      '  --an-primary: #1B4E91;',
      '  --an-primary-dark: #153d73;',
      '  --an-brand-blue: #1a4690;',
      '  --an-brand-red: #c8102e;',
      '  --an-bg: #f7f8fa;',
      '  --an-white: #ffffff;',
      '  --an-text: #1a1a2e;',
      '  --an-text-secondary: #5a5a6e;',
      '  --an-text-muted: #8a8a9a;',
      '  --an-border: #e4e6eb;',
      '  --an-border-light: #f0f1f4;',
      '  --an-green: #00a651;',
      '  --an-green-bg: #e8f8ef;',
      '  --an-radius: 12px;',
      '  --an-radius-sm: 8px;',
      '  --an-shadow: 0 2px 8px rgba(0,0,0,0.06);',
      '  --an-shadow-lg: 0 4px 20px rgba(0,0,0,0.08);',
      '}',

      /* Reset inside wrapper */
      '#an-product-redesign *, #an-product-redesign *::before, #an-product-redesign *::after { box-sizing: border-box !important; margin: 0; padding: 0; }',
      '#an-sticky-bar *, #an-sticky-bar *::before, #an-sticky-bar *::after { box-sizing: border-box !important; }',

      /* Font */
      '#an-product-redesign, #an-sticky-bar { font-family: \'Heebo\', sans-serif !important; -webkit-font-smoothing: antialiased; }',

      /* Page BG */
      '.an-page-bg { background: var(--an-bg) !important; padding-top: 8px !important; }',

      /* Breadcrumb Bar */
      '.an-breadcrumb-bar { background: var(--an-white) !important; border-bottom: 1px solid var(--an-border-light) !important; }',
      '.an-breadcrumb { max-width: 1200px !important; margin: 0 auto !important; padding: 12px 24px !important; font-size: 13px !important; color: var(--an-text-muted) !important; display: flex !important; align-items: center !important; gap: 6px !important; flex-wrap: wrap !important; }',
      '.an-breadcrumb a { color: var(--an-text-secondary) !important; text-decoration: none !important; transition: color 0.2s; }',
      '.an-breadcrumb a:hover { color: var(--an-primary) !important; }',
      '.an-breadcrumb .an-sep { color: var(--an-border) !important; }',
      '.an-breadcrumb .an-current { color: var(--an-text) !important; font-weight: 500 !important; }',

      /* Main Container */
      '.an-container { max-width: 1200px !important; margin: 0 auto !important; padding: 24px !important; }',

      /* Product Top: 2-col grid — info LEFT, image RIGHT (RTL: info is on right side visually, image on left) */
      '.an-product-top { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 32px !important; margin-bottom: 24px !important; }',

      /* Product Image Area (right column in RTL) */
      '.an-product-image-area { background: var(--an-white) !important; border-radius: var(--an-radius) !important; box-shadow: var(--an-shadow) !important; padding: 24px !important; display: flex !important; flex-direction: column !important; align-items: center !important; }',
      '.an-main-image { width: 100% !important; max-width: 400px !important; aspect-ratio: 1; display: flex !important; align-items: center !important; justify-content: center !important; margin-bottom: 16px !important; overflow: hidden !important; }',
      '.an-main-image img { width: 100% !important; height: 100% !important; object-fit: contain !important; }',
      '.an-main-image svg { width: 100% !important; height: 100% !important; }',
      '.an-img-ph { width: 100% !important; max-width: 400px !important; aspect-ratio: 1; background: linear-gradient(135deg,#f5f6f8,#e8eaee) !important; border-radius: 12px !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; gap: 12px !important; }',
      '.an-img-ph-brand { font-size: 28px !important; font-weight: 800 !important; color: #c8102e !important; letter-spacing: 2px !important; }',
      '.an-img-ph-sku { font-size: 20px !important; font-weight: 700 !important; color: #1a1a2e !important; letter-spacing: 1px !important; }',
      '.an-thumb-row { display: flex !important; gap: 10px !important; justify-content: center !important; }',
      '.an-thumb { width: 64px !important; height: 64px !important; border-radius: 8px !important; border: 2px solid var(--an-border) !important; background: var(--an-bg) !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; transition: border-color 0.2s; overflow: hidden !important; }',
      '.an-thumb.an-thumb-active { border-color: var(--an-brand-red) !important; }',
      '.an-thumb:hover { border-color: var(--an-brand-red) !important; }',
      '.an-thumb img { width: 100% !important; height: 100% !important; object-fit: cover !important; }',
      '.an-thumb-ph { font-size: 8px !important; color: var(--an-text-muted) !important; font-weight: 600 !important; text-align: center !important; line-height: 1.2 !important; }',

      /* Info Section */
      '.an-info-section { display: flex !important; flex-direction: column !important; gap: 16px !important; }',
      '.an-badge-row { display: flex !important; align-items: center !important; gap: 10px !important; flex-wrap: wrap !important; }',
      '.an-sku-badge { display: inline-flex !important; align-items: center !important; gap: 6px !important; background: var(--an-bg) !important; border: 1px solid var(--an-border) !important; border-radius: 6px !important; padding: 5px 12px !important; font-size: 13px !important; color: var(--an-text-secondary) !important; font-weight: 500 !important; }',
      '.an-brand-badge { display: inline-flex !important; align-items: center !important; gap: 6px !important; border-radius: 6px !important; padding: 5px 14px !important; font-size: 13px !important; color: white !important; font-weight: 700 !important; letter-spacing: 0.5px !important; }',
      '.an-product-title { font-size: 26px !important; font-weight: 700 !important; color: var(--an-text) !important; line-height: 1.3 !important; }',
      '.an-product-subtitle { font-size: 15px !important; color: var(--an-text-muted) !important; margin-top: -8px !important; }',
      '.an-stock-status { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 14px !important; font-weight: 500 !important; color: var(--an-green) !important; }',
      '.an-stock-dot { width: 10px !important; height: 10px !important; border-radius: 50% !important; background: var(--an-green) !important; display: inline-block !important; animation: an-pulse-dot 2s infinite; }',
      '@keyframes an-pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }',
      '.an-price-section { display: flex !important; align-items: baseline !important; gap: 10px !important; }',
      '.an-price { font-size: 34px !important; font-weight: 800 !important; color: var(--an-text) !important; }',
      '.an-price-vat { font-size: 13px !important; color: var(--an-text-muted) !important; font-weight: 400 !important; }',

      /* Cart Row */
      '.an-cart-row { display: flex !important; flex-direction: column !important; gap: 10px !important; }',
      '.an-qty-selector { display: flex !important; align-items: center !important; border: 1px solid var(--an-border) !important; border-radius: var(--an-radius-sm) !important; overflow: hidden !important; background: var(--an-white) !important; align-self: flex-start !important; }',
      '.an-qty-btn { width: 40px !important; height: 44px !important; display: flex !important; align-items: center !important; justify-content: center !important; background: var(--an-bg) !important; border: none !important; cursor: pointer !important; font-size: 18px !important; color: var(--an-text-secondary) !important; font-weight: 600 !important; transition: background 0.2s; }',
      '.an-qty-btn:hover { background: var(--an-border) !important; }',
      '.an-qty-value { width: 44px !important; height: 44px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 16px !important; font-weight: 600 !important; border-left: 1px solid var(--an-border) !important; border-right: 1px solid var(--an-border) !important; color: var(--an-text) !important; font-family: \'Heebo\', sans-serif !important; user-select: none !important; }',
      '.an-add-to-cart { width: 100% !important; height: 54px !important; background: var(--an-primary) !important; color: white !important; border: none !important; border-radius: var(--an-radius-sm) !important; font-family: \'Heebo\', sans-serif !important; font-size: 18px !important; font-weight: 700 !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 10px !important; transition: background 0.2s, transform 0.1s; letter-spacing: 0.3px !important; box-shadow: 0 4px 14px rgba(27, 78, 145, 0.35) !important; }',
      '.an-add-to-cart:hover { background: var(--an-primary-dark) !important; }',
      '.an-add-to-cart:active { transform: scale(0.98); }',
      '.an-sold-by { font-size: 13px !important; color: var(--an-text-muted) !important; }',
      '.an-sold-by strong { color: var(--an-text-secondary) !important; font-weight: 600 !important; }',

      /* Trust Box */
      '.an-trust-box { background: #f9fafb !important; border: 1px solid var(--an-border-light) !important; border-radius: var(--an-radius-sm) !important; padding: 16px 20px !important; display: flex !important; flex-direction: column !important; gap: 10px !important; }',
      '.an-trust-item { display: flex !important; align-items: center !important; gap: 10px !important; font-size: 13.5px !important; color: var(--an-text-secondary) !important; line-height: 1.4 !important; }',
      '.an-trust-item .an-icon { font-size: 17px !important; width: 24px !important; text-align: center !important; flex-shrink: 0 !important; }',

      /* Section Cards */
      '.an-section-card { background: var(--an-white) !important; border-radius: var(--an-radius) !important; box-shadow: var(--an-shadow) !important; margin-bottom: 20px !important; overflow: hidden !important; }',
      '.an-section-header { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 18px 24px !important; cursor: pointer !important; user-select: none !important; transition: background 0.2s; }',
      '.an-section-header:hover { background: #fafbfc !important; }',
      '.an-section-header h2 { font-size: 18px !important; font-weight: 700 !important; display: flex !important; align-items: center !important; gap: 8px !important; color: var(--an-text) !important; }',
      '.an-chevron { width: 24px !important; height: 24px !important; transition: transform 0.3s ease; color: var(--an-text-muted) !important; flex-shrink: 0 !important; }',
      '.an-section-header.an-collapsed .an-chevron { transform: rotate(180deg); }',
      '.an-section-body { padding: 0 24px 24px !important; }',
      '.an-section-body.an-collapsed { display: none !important; }',

      /* Highlights list */
      '.an-highlights-list { list-style: none !important; display: flex !important; flex-direction: column !important; gap: 12px !important; }',
      '.an-highlights-list li { display: flex !important; align-items: flex-start !important; gap: 10px !important; font-size: 15px !important; color: var(--an-text-secondary) !important; line-height: 1.5 !important; }',
      '.an-highlights-list li::before { content: "\u2713"; color: var(--an-green) !important; font-weight: 700 !important; font-size: 14px !important; margin-top: 2px !important; flex-shrink: 0 !important; }',

      /* Description */
      '.an-description-text { font-size: 15px !important; color: var(--an-text-secondary) !important; line-height: 1.8 !important; }',
      '.an-description-section { font-size: 15px !important; color: var(--an-text-secondary) !important; line-height: 1.8 !important; }',
      '.an-description-section p { margin-bottom: 10px !important; }',
      '.an-description-section * { font-family: \'Heebo\', sans-serif !important; color: var(--an-text-secondary) !important; }',

      /* TecDoc Attribution */
      '.an-tecdoc-attribution { display: flex !important; align-items: center !important; gap: 8px !important; padding: 14px 24px 0 !important; font-size: 12px !important; color: var(--an-text-muted) !important; }',
      '.an-tecdoc-dot { width: 6px !important; height: 6px !important; border-radius: 50% !important; background: var(--an-primary) !important; opacity: 0.5 !important; flex-shrink: 0 !important; }',

      /* Tabs */
      '.an-tabs { display: flex !important; border-bottom: 2px solid var(--an-border-light) !important; padding: 0 24px !important; margin-top: 12px !important; gap: 0 !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }',
      '.an-tab { padding: 12px 20px !important; font-size: 14px !important; font-weight: 500 !important; color: var(--an-text-muted) !important; border-bottom: 3px solid transparent !important; margin-bottom: -2px !important; cursor: pointer !important; transition: all 0.2s; white-space: nowrap !important; user-select: none !important; font-family: \'Heebo\', sans-serif !important; background: none !important; }',
      '.an-tab:hover { color: var(--an-text) !important; }',
      '.an-tab.an-active { color: var(--an-primary) !important; border-bottom-color: var(--an-primary) !important; font-weight: 600 !important; }',
      '.an-tab .an-count { display: inline-flex !important; align-items: center !important; justify-content: center !important; min-width: 22px !important; height: 20px !important; border-radius: 10px !important; background: var(--an-bg) !important; font-size: 11px !important; font-weight: 600 !important; color: var(--an-text-muted) !important; padding: 0 6px !important; margin-right: 4px !important; }',
      '.an-tab.an-active .an-count { background: #e8eef6 !important; color: var(--an-primary) !important; }',

      /* Tab Panels */
      '.an-tab-panel { display: none !important; padding: 20px 24px 24px !important; }',
      '.an-tab-panel.an-active { display: block !important; }',

      /* Specs Table */
      '.an-specs-table { width: 100% !important; border-collapse: collapse !important; }',
      '.an-specs-table tr:nth-child(even) { background: #fafbfc !important; }',
      '.an-specs-table td { padding: 12px 16px !important; font-size: 14px !important; border-bottom: 1px solid var(--an-border-light) !important; }',
      '.an-specs-table td:first-child { font-weight: 600 !important; color: var(--an-text) !important; width: 40% !important; }',
      '.an-specs-table td:last-child { color: var(--an-text-secondary) !important; }',

      /* Vehicle Groups Accordion */
      '.an-veh-groups { display: flex !important; flex-direction: column !important; gap: 2px !important; }',
      '.an-veh-group { border: 1px solid #e4e6eb !important; border-radius: 10px !important; overflow: hidden !important; }',
      '.an-veh-group-header { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 14px 18px !important; cursor: pointer !important; background: #fff !important; transition: background 0.15s; }',
      '.an-veh-group-header:hover { background: #f7f8fa !important; }',
      '.an-veh-make-info { display: flex !important; align-items: center !important; gap: 12px !important; }',
      '.an-veh-make-logo { width: 36px !important; height: 36px !important; border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 800 !important; font-size: 12px !important; letter-spacing: 0.5px !important; flex-shrink: 0 !important; }',
      '.an-veh-make-name { font-size: 16px !important; font-weight: 700 !important; color: #1a1a2e !important; }',
      '.an-veh-make-count { font-size: 13px !important; color: #8a8a9a !important; font-weight: 400 !important; }',
      '.an-veh-chevron { transition: transform 0.3s; flex-shrink: 0 !important; color: #8a8a9a !important; }',
      '.an-veh-group.an-open .an-veh-chevron { transform: rotate(180deg); }',
      '.an-veh-group-models { background: #fafbfc !important; border-top: 1px solid #e4e6eb !important; display: none; }',
      '.an-veh-model-item { border-bottom: 1px solid #f0f1f4 !important; }',
      '.an-veh-model-item:last-child { border-bottom: none !important; }',
      '.an-veh-model-row { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 11px 20px 11px 18px !important; cursor: pointer !important; transition: background 0.12s; gap: 8px !important; }',
      '.an-veh-model-row:hover { background: #f0f4ff !important; }',
      '.an-veh-model-name { font-size: 14px !important; font-weight: 600 !important; color: #1a1a2e !important; flex: 1 !important; }',
      '.an-veh-model-years { font-size: 13px !important; color: #8a8a9a !important; direction: ltr !important; margin-left: 12px !important; flex-shrink: 0 !important; }',
      '.an-veh-model-chev { transition: transform 0.25s; flex-shrink: 0 !important; color: #b0b0b0 !important; }',
      '.an-veh-model-item.an-open .an-veh-model-chev { transform: rotate(180deg); }',
      '.an-veh-engines { background: #f5f7fa !important; padding: 0 20px 0 18px !important; display: none; }',
      '.an-veh-engine-row { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 8px 0 8px 28px !important; font-size: 13px !important; color: #5a5a6e !important; border-top: 1px solid #ebedf2 !important; }',
      '.an-veh-engine-row:first-child { border-top: none !important; }',
      '.an-veh-eng-years { font-size: 12px !important; color: #a0a0a0 !important; direction: ltr !important; }',

      /* OE Grid */
      '.an-oe-grid { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; }',
      '.an-oe-chip { display: inline-flex !important; align-items: center !important; background: #eef3fb !important; border: 1px solid #c8d8f0 !important; border-radius: 6px !important; padding: 6px 14px !important; font-size: 13px !important; font-weight: 600 !important; color: var(--an-primary) !important; font-family: \'Courier New\', monospace !important; letter-spacing: 0.3px !important; transition: background 0.15s; }',
      '.an-oe-chip:hover { background: #ddeafa !important; }',

      /* Brand Card */
      '.an-brand-card { display: flex !important; align-items: stretch !important; overflow: hidden !important; }',
      '.an-brand-sidebar { width: 100px !important; min-height: 120px !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-shrink: 0 !important; }',
      '.an-brand-sidebar span { color: white !important; font-size: 18px !important; font-weight: 800 !important; letter-spacing: 1px !important; writing-mode: horizontal-tb !important; }',
      '.an-brand-info { padding: 20px 24px !important; display: flex !important; flex-direction: column !important; gap: 6px !important; }',
      '.an-brand-info h3 { font-size: 18px !important; font-weight: 700 !important; color: var(--an-text) !important; }',
      '.an-brand-origin { font-size: 13px !important; color: var(--an-text-muted) !important; display: flex !important; align-items: center !important; gap: 6px !important; }',
      '.an-brand-info p { font-size: 14px !important; color: var(--an-text-secondary) !important; line-height: 1.7 !important; margin-top: 4px !important; }',
      '.an-brand-highlights { list-style: none !important; display: flex !important; flex-direction: column !important; gap: 6px !important; margin-top: 8px !important; }',
      '.an-brand-highlights li { font-size: 13px !important; color: var(--an-text-secondary) !important; display: flex !important; align-items: flex-start !important; gap: 6px !important; }',
      '.an-brand-highlights li::before { content: "\u2713"; color: var(--an-green) !important; font-weight: 700 !important; flex-shrink: 0 !important; }',

      /* ===== TECDOC WIDGET STYLES ===== */
      /* Container */
      '#an-tecdoc-wrap { padding: 0 !important; }',
      '#an-tecdoc-wrap #tecdoc-widget { background: transparent !important; box-shadow: none !important; margin: 0 !important; border: none !important; }',
      '#an-tecdoc-wrap .tw-strengths, #an-tecdoc-wrap #tw-brand-info { display: none !important; }',
      '#an-tecdoc-wrap .tw-purchase-row { display: none !important; }',

      /* TecDoc tabs bar */
      '#tecdoc-widget .tw-tabs, #tecdoc-widget [class*="tabs-bar"], #tecdoc-widget [class*="tab-bar"] { display: flex !important; border-bottom: 2px solid var(--an-border-light) !important; padding: 0 24px !important; gap: 0 !important; overflow-x: auto !important; }',
      '#tecdoc-widget .tw-tab, #tecdoc-widget [class*="tab-item"], #tecdoc-widget [class*="tw-tab"] { padding: 12px 20px !important; font-size: 14px !important; font-weight: 500 !important; color: var(--an-text-muted) !important; border-bottom: 3px solid transparent !important; margin-bottom: -2px !important; cursor: pointer !important; white-space: nowrap !important; font-family: \'Heebo\', sans-serif !important; background: none !important; }',
      '#tecdoc-widget .tw-tab.active, #tecdoc-widget .tw-tab[class*="active"], #tecdoc-widget [class*="tab-item"].active { color: var(--an-primary) !important; border-bottom-color: var(--an-primary) !important; font-weight: 600 !important; }',
      /* Count badges inside tabs */
      '#tecdoc-widget .tw-tab .tw-count, #tecdoc-widget [class*="tab-count"], #tecdoc-widget [class*="badge"] { display: inline-flex !important; align-items: center !important; justify-content: center !important; min-width: 22px !important; height: 20px !important; border-radius: 10px !important; background: var(--an-bg) !important; font-size: 11px !important; font-weight: 600 !important; color: var(--an-text-muted) !important; padding: 0 6px !important; margin-right: 4px !important; }',
      '#tecdoc-widget .tw-tab.active .tw-count, #tecdoc-widget .tw-tab.active [class*="badge"] { background: #e8eef6 !important; color: var(--an-primary) !important; }',

      /* TecDoc specs table */
      '#tecdoc-widget table, #tecdoc-widget .tw-specs-table { width: 100% !important; border-collapse: collapse !important; }',
      '#tecdoc-widget table tr:nth-child(even), #tecdoc-widget .tw-specs-table tr:nth-child(even) { background: #fafbfc !important; }',
      '#tecdoc-widget table td, #tecdoc-widget .tw-specs-table td { padding: 12px 16px !important; font-size: 14px !important; border-bottom: 1px solid var(--an-border-light) !important; }',
      '#tecdoc-widget table td:first-child, #tecdoc-widget .tw-specs-table td:first-child { font-weight: 600 !important; color: var(--an-text) !important; width: 40% !important; }',
      '#tecdoc-widget table td:last-child, #tecdoc-widget .tw-specs-table td:last-child { color: var(--an-text-secondary) !important; }',

      /* TecDoc vehicle groups */
      '#tecdoc-widget [class*="make-group"], #tecdoc-widget [class*="vehicle-group"], #tecdoc-widget .tw-make-group { border: 1px solid #e4e6eb !important; border-radius: 10px !important; overflow: hidden !important; margin-bottom: 4px !important; }',
      '#tecdoc-widget [class*="make-header"], #tecdoc-widget [class*="group-header"], #tecdoc-widget .tw-make-header { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 14px 18px !important; cursor: pointer !important; background: #fff !important; }',
      '#tecdoc-widget [class*="make-header"]:hover, #tecdoc-widget .tw-make-header:hover { background: #f7f8fa !important; }',
      '#tecdoc-widget [class*="make-badge"], #tecdoc-widget .tw-make-badge { width: 36px !important; height: 36px !important; border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 800 !important; font-size: 12px !important; flex-shrink: 0 !important; }',
      '#tecdoc-widget [class*="make-name"], #tecdoc-widget .tw-make-name { font-size: 16px !important; font-weight: 700 !important; color: #1a1a2e !important; }',
      '#tecdoc-widget [class*="model-count"], #tecdoc-widget .tw-model-count { font-size: 13px !important; color: #8a8a9a !important; }',
      '#tecdoc-widget [class*="model-row"], #tecdoc-widget .tw-model-row { display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 11px 20px !important; cursor: pointer !important; border-bottom: 1px solid #f0f1f4 !important; }',
      '#tecdoc-widget [class*="model-row"]:hover, #tecdoc-widget .tw-model-row:hover { background: #f0f4ff !important; }',
      '#tecdoc-widget [class*="model-name"], #tecdoc-widget .tw-model-name { font-size: 14px !important; font-weight: 600 !important; color: #1a1a2e !important; }',
      '#tecdoc-widget [class*="model-years"], #tecdoc-widget .tw-model-years { font-size: 13px !important; color: #8a8a9a !important; direction: ltr !important; }',
      '#tecdoc-widget [class*="engine-row"], #tecdoc-widget .tw-engine-row { padding: 8px 0 8px 28px !important; font-size: 13px !important; color: #5a5a6e !important; border-top: 1px solid #ebedf2 !important; background: #f5f7fa !important; }',

      /* TecDoc OE chips */
      '#tecdoc-widget [class*="oe-number"], #tecdoc-widget [class*="oe-chip"], #tecdoc-widget .tw-oe-chip, #tecdoc-widget [class*="cross-ref"] { display: inline-flex !important; align-items: center !important; background: #eef3fb !important; border: 1px solid #c8d8f0 !important; border-radius: 6px !important; padding: 6px 14px !important; font-size: 13px !important; font-weight: 600 !important; color: var(--an-primary) !important; font-family: \'Courier New\', monospace !important; margin: 4px !important; }',
      '#tecdoc-widget [class*="oe-list"], #tecdoc-widget [class*="oe-grid"], #tecdoc-widget .tw-oe-list { display: flex !important; flex-wrap: wrap !important; gap: 8px !important; padding: 20px 24px !important; }',

      /* TecDoc tab panels */
      '#tecdoc-widget [class*="tab-panel"], #tecdoc-widget [class*="tab-content"] { padding: 20px 24px !important; }',

      /* Sticky Bar */
      '#an-sticky-bar { position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; background: var(--an-white) !important; border-top: 1px solid var(--an-border) !important; box-shadow: 0 -4px 20px rgba(0,0,0,0.08) !important; z-index: 9999 !important; transform: translateY(100%) !important; transition: transform 0.3s ease; padding: 12px 20px !important; }',
      '#an-sticky-bar.an-sticky-visible { transform: translateY(0) !important; }',
      '.an-sticky-inner { max-width: 1200px !important; margin: 0 auto !important; display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 16px !important; }',
      '.an-sticky-info { display: flex !important; flex-direction: column !important; gap: 2px !important; min-width: 0 !important; }',
      '.an-sticky-title { font-size: 14px !important; font-weight: 600 !important; color: var(--an-text) !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }',
      '.an-sticky-price { font-size: 18px !important; font-weight: 800 !important; color: var(--an-text) !important; }',
      '.an-sticky-buy { height: 46px !important; padding: 0 24px !important; background: var(--an-primary) !important; color: white !important; border: none !important; border-radius: var(--an-radius-sm) !important; font-family: \'Heebo\', sans-serif !important; font-size: 16px !important; font-weight: 700 !important; cursor: pointer !important; display: flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important; flex-shrink: 0 !important; box-shadow: 0 4px 14px rgba(27,78,145,0.3) !important; }',
      '.an-sticky-buy:hover { background: var(--an-primary-dark) !important; }',

      /* Responsive */
      '@media (max-width: 768px) {',
      '  .an-product-top { grid-template-columns: 1fr !important; gap: 20px !important; }',
      '  .an-product-title { font-size: 22px !important; }',
      '  .an-price { font-size: 28px !important; }',
      '  .an-qty-selector { align-self: stretch !important; justify-content: center !important; width: 100% !important; }',
      '  .an-qty-btn { flex: 1 !important; }',
      '  .an-qty-value { flex: 1 !important; }',
      '  .an-brand-card { flex-direction: column !important; }',
      '  .an-brand-sidebar { width: 100% !important; min-height: 60px !important; }',
      '  .an-tabs { padding: 0 16px !important; }',
      '  .an-tab { padding: 12px 14px !important; font-size: 13px !important; }',
      '  .an-container { padding: 16px !important; }',
      '  .an-section-body { padding: 0 16px 16px !important; }',
      '  .an-tab-panel { padding: 16px 16px 20px !important; }',
      '  .an-section-header { padding: 16px !important; }',
      '  .an-veh-group-header { padding: 12px 14px !important; }',
      '  .an-veh-make-logo { width: 32px !important; height: 32px !important; font-size: 11px !important; }',
      '  .an-veh-make-name { font-size: 14px !important; }',
      '  .an-veh-model-row { padding: 10px 14px !important; }',
      '  .an-veh-model-name { font-size: 13px !important; }',
      '  .an-veh-engine-row { padding: 7px 0 7px 20px !important; font-size: 12px !important; }',
      '  .an-tecdoc-attribution { padding: 14px 16px 0 !important; }',
      '  .an-oe-chip { font-size: 12px !important; padding: 5px 10px !important; }',
      '}'
    ].join('\n');
    document.head.appendChild(styleEl);
  }


  /* ===================================================
     STEP 1: Category detection
     =================================================== */
  function isAutoPartsPage() {
    if (window.location.pathname.indexOf('/items/') === -1) return false;
    var bcEls = document.querySelectorAll('[class*="breadcrumb"] a,[id*="breadcrumb"] a,.bread_crumbs a,#bread_crumbs a');
    var bcText = '';
    for (var b = 0; b < bcEls.length; b++) bcText += ' ' + (bcEls[b].textContent || '').trim().toLowerCase();
    var bcAll = document.querySelectorAll('[class*="breadcrumb"],[id*="breadcrumb"],.bread_crumbs,#bread_crumbs');
    for (var ba = 0; ba < bcAll.length; ba++) bcText += ' ' + (bcAll[ba].textContent || '').trim().toLowerCase();
    var S = ['\u05d7\u05dc\u05e7\u05d9 \u05d1\u05dc\u05de\u05d9\u05dd','\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd','\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05ea\u05dc\u05d9\u05d9\u05d4','\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05d9\u05d2\u05d5\u05d9','\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e0\u05e2\u05d4','\u05de\u05e2\u05e8\u05db\u05ea \u05e7\u05d9\u05e8\u05d5\u05e8','\u05de\u05e2\u05e8\u05db\u05ea \u05d1\u05dc\u05d9\u05de\u05d4','\u05de\u05e6\u05ea\u05d9\u05dd','\u05d1\u05d5\u05dc\u05de\u05d9 \u05d6\u05e2\u05d6\u05d5\u05e2\u05d9\u05dd','\u05de\u05e6\u05de\u05d3\u05d9\u05dd','\u05e8\u05e6\u05d5\u05e2\u05d5\u05ea','\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05dc\u05e8\u05db\u05d1','\u05d7\u05dc\u05e7\u05d9 \u05d7\u05e9\u05de\u05dc','\u05d7\u05dc\u05e7\u05d9 \u05de\u05e0\u05d5\u05e2','\u05d7\u05dc\u05e7\u05d9 \u05e4\u05e8\u05d5\u05e0\u05d8','\u05ea\u05d0\u05d5\u05e8\u05d4','\u05e1\u05d8\u05e8\u05d8\u05e8\u05d9\u05dd','\u05d0\u05dc\u05d8\u05e8\u05e0\u05d8\u05d5\u05e8\u05d9\u05dd','\u05e4\u05d9\u05dc\u05d8\u05e8 \u05d0\u05d5\u05d5\u05d9\u05e8','\u05e4\u05d9\u05dc\u05d8\u05e8 \u05e9\u05de\u05df','\u05e4\u05d9\u05dc\u05d8\u05e8 \u05de\u05d6\u05d2\u05df','\u05e4\u05d9\u05dc\u05d8\u05e8 \u05e1\u05d5\u05dc\u05e8','\u05d3\u05d9\u05e1\u05e7\u05d9 \u05d1\u05dc\u05dd','\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd','\u05e7\u05e6\u05d5\u05d5\u05ea \u05d4\u05d2\u05d4','\u05de\u05d5\u05d8\u05d5\u05ea \u05de\u05d9\u05d9\u05e6\u05d1','\u05de\u05e9\u05d5\u05dc\u05e9\u05d9\u05dd','\u05db\u05d3\u05d5\u05e8\u05d9\u05d5\u05ea','\u05d1\u05d5\u05db\u05e1\u05d5\u05ea'];
    var found = false;
    for (var sp = 0; sp < S.length; sp++) { if (bcText.indexOf(S[sp]) !== -1) { found = true; break; } }
    if (!found) return false;
    var B = ['\u05d8\u05d9\u05e4\u05d5\u05d7','\u05e4\u05d3\u05d9\u05dd \u05dc\u05de\u05db\u05d5\u05e0\u05d4','\u05e9\u05e2\u05d5\u05d5\u05d4','\u05e4\u05d5\u05dc\u05d9\u05e9','\u05de\u05d9\u05e7\u05e8\u05d5\u05e4\u05d9\u05d9\u05d1\u05e8','microfiber','polish','meguiar','\u05de\u05d5\u05e6\u05e8\u05d9 \u05d8\u05d9\u05e4\u05d5\u05d7','\u05db\u05dc\u05d9 \u05e2\u05d1\u05d5\u05d3\u05d4','\u05d0\u05d1\u05d9\u05d6\u05e8\u05d9\u05dd','\u05e9\u05de\u05e0\u05d9\u05dd','\u05de\u05d2\u05d1\u05d5\u05ea'];
    for (var bl = 0; bl < B.length; bl++) { if (bcText.indexOf(B[bl]) !== -1) return false; }
    return true;
  }
  if (!isAutoPartsPage()) return;


  /* ===================================================
     STEP 2: BRAND_INFO — all brands with complete Hebrew descriptions
     =================================================== */
  var H = ['\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05d4\u05d5\u05ea\u05e7\u05df \u05d1\u05e8\u05db\u05d1 \u05d1\u05de\u05e4\u05e2\u05dc','\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da','\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d0\u05d9\u05db\u05d5\u05ea \u05d1\u05d9\u05e0\u05dc\u05d0\u05d5\u05de\u05d9\u05d9\u05dd','\u05dc\u05dc\u05d0 \u05e4\u05e9\u05e8\u05d5\u05ea \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05d5\u05d1\u05d4\u05ea\u05d0\u05de\u05d4'];

  var BRAND_INFO = {
    "BREMBO":{
      name:"Brembo",
      nameHe:"\u05d1\u05e8\u05de\u05d1\u05d5",
      country:"\u05d0\u05d9\u05d8\u05dc\u05d9\u05d4",
      flag:"\uD83C\uDDEE\uD83C\uDDF9",
      year:"1961",
      color:"#c8102e",
      description:"\u05d1\u05e8\u05de\u05d1\u05d5 \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05d0\u05d9\u05d8\u05dc\u05e7\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd, \u05d9\u05d3\u05d5\u05e2\u05d4 \u05d1\u05d6\u05db\u05d5\u05ea \u05d0\u05e1\u05e4\u05e7\u05ea \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05dc\u05de\u05d9\u05e8\u05d5\u05e6\u05d9 F1, MotoGP \u05d5\u05dc\u05e8\u05db\u05d1\u05d9 \u05e4\u05e8\u05e1\u05d8\u05d9\u05d6'\u05d4 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd. \u05d4\u05d7\u05d1\u05e8\u05d4 \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05e8\u05d1\u05d9\u05dd \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90 \u05d4\u05d0\u05d9\u05e8\u05d5\u05e4\u05d9\u05d9\u05dd \u05d4\u05e7\u05e4\u05d3\u05d9\u05d9\u05dd \u05d1\u05d9\u05d5\u05ea\u05e8.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90 \u05d4\u05d0\u05d9\u05e8\u05d5\u05e4\u05d9","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05d4\u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05e0\u05d1\u05d3\u05e7 \u05d1\u05ea\u05e0\u05d0\u05d9 \u05de\u05d9\u05e8\u05d5\u05e6\u05d9\u05dd \u2014 F1, MotoGP","\u05d1\u05dc\u05d9\u05de\u05d4 \u05d7\u05d6\u05e7\u05d4 \u05d2\u05dd \u05d1\u05d8\u05de\u05e4\u05e8\u05d8\u05d5\u05e8\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d5\u05ea"]
    },
    "BOSCH":{
      name:"Bosch",
      nameHe:"\u05d1\u05d5\u05e9",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1886",
      color:"#e2000f",
      description:"\u05d1\u05d5\u05e9 \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05e8\u05db\u05d1 \u05d2\u05d3\u05d5\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd, \u05e2\u05dd \u05de\u05e2\u05dc \u05de\u05d0\u05d4 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d1\u05d9\u05e6\u05d5\u05e8 \u05d7\u05dc\u05e7\u05d9\u05dd \u05d0\u05d9\u05db\u05d5\u05ea\u05d9\u05d9\u05dd \u05dc\u05e8\u05db\u05d1. \u05ea\u05d5\u05e6\u05e8\u05ea\u05d9\u05d4 \u05de\u05db\u05e1\u05d4 \u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1 \u05e9\u05dc \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd, \u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd, \u05d6\u05e0\u05e7\u05d9 \u05d4\u05e6\u05ea\u05d4, \u05e1\u05d8\u05e8\u05d8\u05e8\u05d9\u05dd \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d7\u05e9\u05de\u05dc\u05d9\u05d5\u05ea \u05dc\u05e8\u05db\u05d1.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1 \u05de\u05d4\u05de\u05e4\u05e2\u05dc","\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 ISO/TS 16949","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05de\u05ea\u05e7\u05d3\u05de\u05d9\u05dd","\u05de\u05d5\u05ea\u05d0\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd"]
    },
    "MANN-FILTER":{
      name:"MANN-FILTER",
      nameHe:"\u05de\u05d0\u05df \u05e4\u05d9\u05dc\u05d8\u05e8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1941",
      color:"#1a4690",
      description:"MANN-FILTER \u05d4\u05d9\u05d0 \u05de\u05d5\u05ea\u05d2 \u05d4\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d4\u05de\u05d5\u05d1\u05d9\u05dc \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4, \u05e2\u05dd \u05de\u05e2\u05dc \u05e9\u05de\u05d5\u05e0\u05d9\u05dd \u05e2\u05e9\u05e8 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d1\u05e4\u05d9\u05ea\u05d5\u05d7 \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05db\u05dc \u05d4\u05e2\u05d5\u05dc\u05dd \u05d5\u05de\u05e1\u05d9\u05d9\u05e2\u05ea \u05d1\u05d4\u05d2\u05e0\u05ea \u05d4\u05de\u05e0\u05d5\u05e2 \u05d5\u05d4\u05d0\u05e8\u05db\u05ea \u05d7\u05d9\u05d9\u05d5.",
      highlights:["\u05e1\u05d9\u05e0\u05d5\u05df \u05d9\u05e2\u05d9\u05dc \u05e9\u05dc 99.98%","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d4\u05d2\u05e0\u05d4 \u05de\u05e4\u05e0\u05d9 \u05dc\u05db\u05dc\u05d5\u05da \u05d5\u05d0\u05d1\u05e7","\u05de\u05d0\u05e8\u05d9\u05da \u05d7\u05d9\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2"]
    },
    "MAHLE":{
      name:"Mahle",
      nameHe:"\u05de\u05d0\u05dc\u05d4",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1920",
      color:"#005b8e",
      description:"Mahle \u05d4\u05d9\u05d0 \u05e7\u05d1\u05d5\u05e6\u05ea \u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05d1\u05d9\u05e0\u05dc\u05d0\u05d5\u05de\u05d9\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea, \u05de\u05de\u05d5\u05d1\u05d9\u05dc\u05d9 \u05d1\u05e4\u05d9\u05ea\u05d5\u05d7 \u05d5\u05d9\u05e6\u05d5\u05e8 \u05e8\u05db\u05d9\u05d1\u05d9 \u05de\u05e0\u05d5\u05e2 \u05d5\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05e2\u05d1\u05d5\u05e8 \u05e8\u05db\u05d1. \u05de\u05d5\u05e6\u05e8\u05d9\u05d4 \u05d1\u05d3\u05d9\u05e7\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d4 \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 \u05e1\u05d1\u05d9\u05d1\u05d4 \u05de\u05d7\u05de\u05d9\u05e8\u05d9\u05dd.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d1\u05d3\u05d9\u05e7\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d4","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d4\u05e1\u05d1\u05d9\u05d1\u05d4","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05e1\u05d5\u05d2\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2\u05d9\u05dd"]
    },
    "VALEO":{
      name:"Valeo",
      nameHe:"\u05d5\u05d0\u05dc\u05d0\u05d5",
      country:"\u05e6\u05e8\u05e4\u05ea",
      flag:"\uD83C\uDDEB\uD83C\uDDF7",
      year:"1923",
      color:"#003087",
      description:"Valeo \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea OEM \u05e6\u05e8\u05e4\u05ea\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d5\u05ea \u05d7\u05d3\u05e9\u05e0\u05d5\u05ea \u05dc\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d4\u05d1\u05dc\u05d9\u05de\u05d4, \u05d4\u05ea\u05d0\u05d5\u05e8\u05d4, \u05de\u05d6\u05d2\u05df \u05d0\u05d5\u05d5\u05d9\u05e8 \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d9\u05d9\u05e6\u05d5\u05e8 \u05d7\u05e9\u05de\u05dc\u05d9\u05d5\u05ea. \u05d7\u05dc\u05e7\u05d9\u05d4 \u05de\u05d5\u05ea\u05e7\u05e0\u05d9\u05dd \u05d1\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05e7\u05d5\u05e8\u05d9\u05d5\u05ea \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d5\u05ea.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u05d2\u05d1\u05d5\u05d4\u05d4","\u05e1\u05e4\u05e7 \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05d4\u05e8\u05db\u05d1 \u05de\u05d4\u05de\u05e4\u05e2\u05dc","\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05d7\u05d3\u05e9\u05e0\u05d9\u05ea","\u05d4\u05ea\u05d0\u05de\u05d4 \u05de\u05d5\u05e9\u05dc\u05de\u05ea \u05dc\u05d3\u05d2\u05dd"]
    },
    "TRW":{
      name:"TRW",
      nameHe:"\u05d8\u05d9.\u05d0\u05e8.\u05d3\u05d1\u05dc\u05d9\u05d5",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1901",
      color:"#003399",
      description:"TRW (ZF Aftermarket) \u05d4\u05d9\u05d0 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d1\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05dc\u05e8\u05db\u05d1, \u05d1\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd, \u05d3\u05d9\u05e1\u05e7\u05d9\u05dd \u05d5\u05d0\u05dc\u05de\u05e0\u05d8\u05d9 \u05d4\u05d9\u05d2\u05d5\u05d9. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05db\u05dc \u05d4\u05e2\u05d5\u05dc\u05dd \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d1\u05d9\u05d8\u05d7\u05d5\u05df ECE R90.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "FEBI BILSTEIN":{
      name:"Febi Bilstein",
      nameHe:"\u05e4\u05d1\u05d9 \u05d1\u05d9\u05dc\u05e9\u05d8\u05d9\u05d9\u05df",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1844",
      color:"#e8001c",
      description:"Febi Bilstein \u05d4\u05d9\u05d0 \u05d7\u05d1\u05e8\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05e2\u05dd \u05de\u05e2\u05dc 175 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05d1\u05d9\u05e6\u05d5\u05e8 \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05dc\u05e8\u05db\u05d1. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05e1\u05e4\u05e7 \u05d4\u05d9\u05e7\u05e3 \u05d5\u05e8\u05d7\u05d1 \u05e9\u05dc \u05e8\u05db\u05d9\u05d1\u05d9\u05dd, \u05db\u05d5\u05dc\u05dc \u05e8\u05db\u05d9\u05d1\u05d9 \u05ea\u05dc\u05d9\u05d9\u05d4, \u05d4\u05d9\u05d2\u05d5\u05d9, \u05de\u05e2\u05e8\u05db\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05d5\u05e2\u05d5\u05d3.",
      highlights:["\u05de\u05e2\u05dc 175 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05e1\u05e4\u05e7 \u05e8\u05d7\u05d1 \u05e9\u05dc \u05e8\u05db\u05d9\u05d1\u05d9\u05dd","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea"]
    },
    "MEYLE":{
      name:"Meyle",
      nameHe:"\u05de\u05d9\u05d9\u05dc\u05d4",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1958",
      color:"#0057a8",
      description:"Meyle \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05d4\u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05e7\u05d5 MEYLE-HD, \u05d4\u05de\u05e1\u05e4\u05e7 \u05d0\u05d9\u05db\u05d5\u05ea \u05e9\u05d5\u05d5\u05d4 \u05d0\u05d5 \u05e2\u05d5\u05dc\u05d4 \u05e2\u05dc OEM \u05d1\u05d3\u05e8\u05da \u05db\u05dc\u05dc. \u05d7\u05dc\u05e7\u05d9 MEYLE-HD \u05e2\u05d5\u05d1\u05e8\u05d9\u05dd \u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea \u05e9\u05e0\u05ea\u05d9\u05d9\u05dd.",
      highlights:["\u05e7\u05d5 MEYLE-HD","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u05d5\u05de\u05e2\u05dc\u05d4","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9 \u05d3\u05e8\u05d9\u05e9\u05d4 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d9\u05d9\u05dd"]
    },
    "SKF":{
      name:"SKF",
      nameHe:"\u05d0\u05e1.\u05e7\u05d9.\u05d0\u05e3",
      country:"\u05e9\u05d5\u05d5\u05d3\u05d9\u05d4",
      flag:"\uD83C\uDDF8\uD83C\uDDEA",
      year:"1907",
      color:"#003087",
      description:"SKF \u05d4\u05d9\u05d0 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05e9\u05d5\u05d5\u05d3\u05d9\u05ea \u05d1\u05d9\u05e6\u05d5\u05e8 \u05de\u05d9\u05e1\u05d1\u05d9\u05dd, \u05d7\u05d5\u05ea\u05de\u05d5\u05ea \u05d5\u05d0\u05dc\u05de\u05e0\u05d8\u05d9 \u05de\u05d7\u05d6\u05d5\u05e8 \u05dc\u05e8\u05db\u05d1. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05d1\u05d3\u05e8\u05d2 OEM \u05de\u05d5\u05db\u05e8\u05ea \u05e2\u05dc\u05d9\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd, \u05e2\u05dd \u05d3\u05d2\u05e9 \u05e2\u05dc\u05d9\u05d5\u05df \u05d1\u05ea\u05d1\u05d5\u05d0\u05ea \u05d4\u05de\u05e0\u05d5\u05e2 \u05d5\u05d1\u05d8\u05d9\u05d7\u05d5\u05ea.",
      highlights:["\u05de\u05d5\u05d1\u05d9\u05dc \u05e2\u05d5\u05dc\u05de\u05d9 \u05d1\u05de\u05d9\u05e1\u05d1\u05d9\u05dd","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea","\u05de\u05d7\u05d6\u05d5\u05e8 \u05d0\u05e8\u05d5\u05da \u05dc\u05e8\u05db\u05d1"]
    },
    "NGK":{
      name:"NGK",
      nameHe:"\u05d0\u05e0.\u05d2'\u05d9.\u05e7\u05d9\u05d9",
      country:"\u05d9\u05e4\u05df",
      flag:"\uD83C\uDDEF\uD83C\uDDF5",
      year:"1936",
      color:"#cc0000",
      description:"NGK \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d4\u05de\u05e6\u05ea\u05d9\u05dd \u05d4\u05d2\u05d3\u05d5\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd, \u05d9\u05e4\u05e0\u05d9\u05ea, \u05d4\u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d4\u05e6\u05ea\u05d4 \u05d9\u05e6\u05d9\u05d1\u05d4, \u05d7\u05d9\u05e9\u05d5\u05dc \u05d3\u05dc\u05e7 \u05d9\u05e2\u05d9\u05dc \u05d5\u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05de\u05d5\u05d0\u05e8\u05da. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d9\u05e4\u05e0\u05d9\u05d9\u05dd, \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd \u05d5\u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05d9\u05dd.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05d8\u05de\u05e4\u05e8\u05d8\u05d5\u05e8\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d5\u05ea","\u05d4\u05e6\u05ea\u05d4 \u05d9\u05e6\u05d9\u05d1\u05d4 \u05d5\u05d7\u05d9\u05e1\u05db\u05d5\u05df \u05d1\u05d3\u05dc\u05e7","\u05de\u05ea\u05d0\u05d9\u05de\u05d9\u05dd \u05dc\u05db\u05dc \u05e1\u05d5\u05d2\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2\u05d9\u05dd"]
    },
    "DENSO":{
      name:"Denso",
      nameHe:"\u05d3\u05e0\u05e1\u05d5",
      country:"\u05d9\u05e4\u05df",
      flag:"\uD83C\uDDEF\uD83C\uDDF5",
      year:"1949",
      color:"#003087",
      description:"Denso \u05d4\u05d9\u05d0 \u05e1\u05e4\u05e7\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05d9\u05e4\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05d0\u05d7\u05ea \u05d4\u05d2\u05d3\u05d5\u05dc\u05d5\u05ea \u05d1\u05e2\u05d5\u05dc\u05dd, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05d9\u05d5\u05d9\u05d5\u05d8\u05d4, \u05d4\u05d5\u05e0\u05d3\u05d4, \u05dc\u05e7\u05e1\u05d5\u05e1, \u05e1\u05d5\u05d1\u05d0\u05e8\u05d5 \u05d5\u05e2\u05d5\u05d3. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d9\u05e6\u05d5\u05e8 \u05de\u05e6\u05ea\u05d9\u05dd, \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd, \u05de\u05e7\u05e8\u05e8\u05d9 \u05d4\u05ea\u05e0\u05e2\u05d4 \u05d5\u05de\u05d6\u05d2\u05e0\u05d9\u05dd.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u05d9\u05e4\u05e0\u05d9\u05ea","\u05e1\u05e4\u05e7 \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05d4\u05e8\u05db\u05d1","\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05de\u05ea\u05e7\u05d3\u05de\u05ea","\u05de\u05d5\u05ea\u05d0\u05dd \u05dc\u05d1\u05e7\u05e8\u05d4 \u05d0\u05e8\u05d5\u05db\u05d4"]
    },
    "SACHS":{
      name:"Sachs",
      nameHe:"\u05d6\u05d0\u05e7\u05e1",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1894",
      color:"#cc0000",
      description:"Sachs (ZF Aftermarket) \u05d4\u05d9\u05d0 \u05de\u05d5\u05ea\u05d2 \u05d1\u05d5\u05dc\u05de\u05d9 \u05d6\u05e2\u05d6\u05d5\u05e2\u05d9\u05dd, \u05d3\u05d9\u05e1\u05e7\u05d9 \u05de\u05e6\u05de\u05d3 \u05d5\u05d0\u05dc\u05de\u05e0\u05d8\u05d9 \u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e0\u05e2\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea. \u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 OEM \u05e2\u05dc\u05d9\u05d5\u05e0\u05d9\u05d9\u05dd \u05d5\u05de\u05e1\u05e4\u05e7\u05ea \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d3\u05d9\u05e1\u05e7\u05d9 \u05de\u05e6\u05de\u05d3 \u05e2\u05dc\u05d9\u05d5\u05e0\u05d9\u05d9\u05dd","\u05d1\u05d5\u05dc\u05de\u05d9 \u05d6\u05e2\u05d6\u05d5\u05e2\u05d9\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05d9\u05dd","\u05e2\u05d1\u05d5\u05e8 \u05db\u05dc \u05e1\u05d5\u05d2\u05d9 \u05e8\u05db\u05d1"]
    },
    "LUK":{
      name:"LuK",
      nameHe:"\u05dc\u05d5\u05e7",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1965",
      color:"#e2000f",
      description:"LuK (Schaeffler Group) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05de\u05e6\u05de\u05d3 \u05d5\u05d4\u05e0\u05e2\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea, \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05db\u05dc \u05d4\u05e2\u05d5\u05dc\u05dd \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 OEM \u05e2\u05dc\u05d9\u05d5\u05e0\u05d9\u05d9\u05dd.",
      highlights:["\u05e1\u05e4\u05e7 OEM \u05de\u05d5\u05d1\u05d9\u05dc","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05dd"]
    },
    "INA":{
      name:"INA",
      nameHe:"\u05d0\u05d9.\u05e0\u05d0.",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1946",
      color:"#e2000f",
      description:"INA (Schaeffler Group) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05de\u05d9\u05e1\u05d1\u05d9\u05dd, \u05e2\u05e8\u05db\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2 \u05d5\u05e8\u05db\u05d9\u05d1\u05d9 \u05e9\u05e8\u05e9\u05e8\u05ea \u05d4\u05de\u05e0\u05d5\u05e2 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 OEM \u05e2\u05dc\u05d9\u05d5\u05e0\u05d9\u05d9\u05dd.",
      highlights:["\u05de\u05d9\u05e1\u05d1\u05d9\u05dd \u05d1\u05d3\u05e8\u05d2 OEM","\u05e2\u05e8\u05db\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2 \u05d0\u05d9\u05db\u05d5\u05ea\u05d9\u05d9\u05dd","\u05e9\u05e8\u05e9\u05e8\u05ea \u05de\u05e0\u05d5\u05e2 \u05de\u05d5\u05d1\u05d9\u05dc","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea"]
    },
    "CONTINENTAL":{
      name:"Continental",
      nameHe:"\u05e7\u05d5\u05e0\u05d8\u05d9\u05e0\u05e0\u05d8\u05dc",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1871",
      color:"#ffa500",
      description:"Continental \u05d4\u05d9\u05d0 \u05e7\u05d1\u05d5\u05e6\u05ea \u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e4\u05ea\u05d7\u05ea \u05e8\u05e6\u05d5\u05e2\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2, \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05d5\u05e8\u05db\u05d9\u05d1\u05d9 \u05e8\u05db\u05d1. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05db\u05dc \u05d4\u05e2\u05d5\u05dc\u05dd.",
      highlights:["\u05de\u05e2\u05dc 150 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df","\u05e1\u05e4\u05e7 OEM \u05de\u05d5\u05d1\u05d9\u05dc","\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05d7\u05d3\u05e9\u05e0\u05d9\u05ea","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea"]
    },
    "GATES":{
      name:"Gates",
      nameHe:"\u05d2\u05d9\u05d9\u05d8\u05e1",
      country:"\u05d0\u05e8\u05d4\"\u05d1",
      flag:"\uD83C\uDDFA\uD83C\uDDF8",
      year:"1911",
      color:"#003087",
      description:"Gates \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05e6\u05d5\u05e2\u05d5\u05ea \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d4\u05e0\u05e2\u05d4 \u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05db\u05dc \u05d4\u05e2\u05d5\u05dc\u05dd. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05e2\u05e1\u05e7\u05d9\u05ea \u05d5\u05e2\u05de\u05d9\u05d3\u05d5\u05ea\u05d4 \u05d1\u05ea\u05e7\u05e0\u05d9 OEM \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd.",
      highlights:["\u05e1\u05e4\u05e7 OEM \u05de\u05d5\u05d1\u05d9\u05dc","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 OEM","\u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05dd"]
    },
    "HENGST":{
      name:"Hengst",
      nameHe:"\u05d4\u05e0\u05d2\u05e1\u05d8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1958",
      color:"#003087",
      description:"Hengst \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05e1\u05d9\u05e0\u05d5\u05df \u05d2\u05d1\u05d5\u05d4\u05d4 \u05d5\u05de\u05d0\u05e8\u05d9\u05db\u05ea \u05d7\u05d9\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2.",
      highlights:["\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd OEM","\u05e1\u05d9\u05e0\u05d5\u05df \u05d2\u05d1\u05d5\u05d4","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05dd"]
    },
    "DAYCO":{
      name:"Dayco",
      nameHe:"\u05d3\u05d9\u05d9\u05e7\u05d5",
      country:"\u05d0\u05e8\u05d4\"\u05d1",
      flag:"\uD83C\uDDFA\uD83C\uDDF8",
      year:"1905",
      color:"#cc0000",
      description:"Dayco \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05e6\u05d5\u05e2\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2 \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d4\u05e0\u05e2\u05d4 \u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05ea, \u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05de\u05e2\u05d1\u05e8\u05ea \u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05e7\u05e4\u05d3\u05e0\u05d9\u05d5\u05ea.",
      highlights:["\u05e1\u05e4\u05e7 OEM \u05de\u05d5\u05d1\u05d9\u05dc","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea OEM","\u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05dd"]
    },
    "LEMFORDER":{
      name:"Lemf\u00f6rder",
      nameHe:"\u05dc\u05de\u05e4\u05e8\u05d3\u05e8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1947",
      color:"#003087",
      description:"Lemf\u00f6rder (ZF Group) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9 \u05d4\u05ea\u05dc\u05d9\u05d9\u05d4 \u05d5\u05d4\u05d9\u05d2\u05d5\u05d9 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05d9\u05d3\u05d5\u05e2\u05d4 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4\u05d4 \u05d5\u05d1\u05e7\u05e4\u05d3\u05e0\u05d5\u05ea \u05d1\u05e9\u05d9\u05d1\u05d5\u05e9 \u05e8\u05db\u05d9\u05d1\u05d9\u05dd.",
      highlights:["\u05e1\u05e4\u05e7 OEM \u05de\u05d5\u05d1\u05d9\u05dc","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea","\u05e8\u05db\u05d9\u05d1\u05d9 \u05ea\u05dc\u05d9\u05d9\u05d4 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05dd"]
    },
    "TEXTAR":{
      name:"Textar",
      nameHe:"\u05d8\u05e7\u05e1\u05d8\u05e8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1913",
      color:"#cc0000",
      description:"Textar \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05d4\u05de\u05d5\u05e6\u05e8\u05d9\u05dd \u05e0\u05e7\u05d9\u05d9\u05dd \u05de\u05d0\u05e1\u05d1\u05e1\u05d8 \u05d5\u05e2\u05d5\u05de\u05d3\u05d9\u05dd \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05dc\u05dc\u05d0 \u05d0\u05e1\u05d1\u05e1\u05d8","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "ATE":{
      name:"ATE",
      nameHe:"\u05d0\u05d9.\u05d8\u05d9.\u05d0\u05d9",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1906",
      color:"#ffa500",
      description:"ATE (Continental) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d3\u05d9\u05e1\u05e7\u05d9 \u05d1\u05dc\u05dd \u05d5\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90 \u05d5\u05de\u05ea\u05d0\u05d9\u05de\u05d4 \u05dc\u05e1\u05e4\u05e7\u05d9 \u05d4\u05de\u05e7\u05d5\u05e8.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d3\u05d9\u05e1\u05e7\u05d9\u05dd \u05d5\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "KNECHT":{
      name:"Knecht",
      nameHe:"\u05e7\u05e0\u05db\u05d8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1927",
      color:"#005b8e",
      description:"Knecht (Mahle) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea Mahle. \u05de\u05e1\u05e4\u05e7\u05ea \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9 \u05e9\u05de\u05df, \u05d0\u05d5\u05d5\u05d9\u05e8, \u05d3\u05dc\u05e7 \u05d5\u05de\u05d6\u05d2\u05df \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1.",
      highlights:["\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd OEM","\u05d0\u05d9\u05db\u05d5\u05ea Mahle","\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1 \u05e9\u05dc \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd","\u05e1\u05d9\u05e0\u05d5\u05df \u05d2\u05d1\u05d5\u05d4"]
    },
    "NIPPARTS":{
      name:"Nipparts",
      nameHe:"\u05e0\u05d9\u05e4\u05e4\u05e8\u05d8\u05e1",
      country:"\u05d4\u05d5\u05dc\u05e0\u05d3",
      flag:"\uD83C\uDDF3\uD83C\uDDF1",
      year:"1975",
      color:"#cc0000",
      description:"Nipparts \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d4\u05d5\u05dc\u05e0\u05d3\u05d9\u05ea \u05d4\u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd \u05db\u05d2\u05d5\u05df \u05d9\u05d5\u05d9\u05d5\u05d8\u05d4, \u05d4\u05d5\u05e0\u05d3\u05d4, \u05e0\u05d9\u05e1\u05d0\u05df \u05d5\u05de\u05d6\u05d5\u05d1\u05d9\u05e9\u05d9. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05e2\u05e1\u05e7\u05d9\u05ea \u05d5\u05ea\u05d0\u05d9\u05de\u05d5\u05ea\u05d4 \u05de\u05d5\u05e9\u05dc\u05de\u05ea.",
      highlights:["\u05e8\u05db\u05d9\u05d1\u05d9 \u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea","\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9"]
    },
    "BLUE PRINT":{
      name:"Blue Print",
      nameHe:"\u05d1\u05dc\u05d5 \u05e4\u05e8\u05d9\u05e0\u05d8",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1997",
      color:"#003087",
      description:"Blue Print \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d4\u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd, \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea ADL (Alliance Automotive Group). \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05de\u05d5\u05e9\u05dc\u05de\u05ea \u05d5\u05ea\u05d0\u05d9\u05de\u05d5\u05ea\u05d4 \u05de\u05d3\u05d5\u05d9\u05e7\u05ea.",
      highlights:["\u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d3\u05d5\u05d9\u05e7\u05ea","\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9"]
    },
    "MOTUL":{
      name:"Motul",
      nameHe:"\u05de\u05d5\u05d8\u05d5\u05dc",
      country:"\u05e6\u05e8\u05e4\u05ea",
      flag:"\uD83C\uDDEB\uD83C\uDDF7",
      year:"1853",
      color:"#cc0000",
      description:"Motul \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05d9\u05dd \u05e6\u05e8\u05e4\u05ea\u05d9\u05ea, \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05e4\u05d9\u05ea\u05d5\u05d7 \u05e9\u05de\u05e0\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9 \u05e4\u05e8\u05e1\u05d8\u05d9\u05d6'\u05d4 \u05d5\u05dc\u05e9\u05d9\u05de\u05d5\u05e9 \u05d9\u05d5\u05de\u05d9\u05d5\u05de\u05d9. \u05de\u05d5\u05e6\u05e8\u05d9\u05d4 \u05e0\u05d1\u05d3\u05e7\u05d9\u05dd \u05d1\u05ea\u05e0\u05d0\u05d9 \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d4\u05de\u05d9\u05e8\u05d5\u05e5.",
      highlights:["\u05e9\u05de\u05e0\u05d9 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05d9\u05dd","\u05e0\u05d9\u05e1\u05d5\u05df \u05d1\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d0\u05d9\u05e8\u05d5\u05e2\u05d9\u05dd","\u05de\u05d5\u05e8\u05e9\u05d4 \u05dc\u05e0\u05d9\u05e1\u05d5\u05df","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05e4\u05e8\u05e1\u05d8\u05d9\u05d6'\u05d4"]
    },
    "CASTROL":{
      name:"Castrol",
      nameHe:"\u05e7\u05e1\u05d8\u05e8\u05d5\u05dc",
      country:"\u05d1\u05e8\u05d9\u05d8\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDEC\uD83C\uDDE7",
      year:"1899",
      color:"#009900",
      description:"Castrol (BP) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05e8\u05d9\u05d8\u05d9\u05ea, \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05ea EDGE \u05d5\u05d1\u05e9\u05d9\u05ea\u05d5\u05e3 \u05e4\u05e2\u05d9\u05dc \u05e2\u05dd \u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd. \u05de\u05de\u05d5\u05e9 \u05e2\u05dc \u05d9\u05e2\u05d9\u05dc\u05d5\u05ea \u05d3\u05dc\u05e7 \u05d5\u05d4\u05d2\u05e0\u05ea \u05d4\u05de\u05e0\u05d5\u05e2.",
      highlights:["\u05e9\u05de\u05e0\u05d9 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05d9\u05dd","\u05d1\u05e9\u05d9\u05ea\u05d5\u05e3 \u05e2\u05dd \u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1","\u05d7\u05e1\u05db\u05d5\u05df \u05d1\u05d3\u05dc\u05e7","\u05d4\u05d2\u05e0\u05ea \u05de\u05e0\u05d5\u05e2"]
    },
    "LIQUI MOLY":{
      name:"Liqui Moly",
      nameHe:"\u05dc\u05d9\u05e7\u05d5\u05d9 \u05de\u05d5\u05dc\u05d9",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1957",
      color:"#cc0000",
      description:"Liqui Moly \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05d5\u05ea\u05d5\u05e1\u05e4\u05d9\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05d4\u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4\u05d4 \u05dc\u05de\u05e0\u05d5\u05e2. \u05d6\u05db\u05ea\u05d4 \u05d1\u05de\u05e2\u05dc 80 \u05e4\u05e8\u05e1\u05d9\u05dd \u05d1\u05de\u05d1\u05d7\u05e0\u05d9 \u05e9\u05de\u05e0\u05d9 \u05d2\u05e8\u05de\u05e0\u05d9\u05d9\u05dd.",
      highlights:["\u05e2\u05dc 80 \u05e4\u05e8\u05e1\u05d9\u05dd","\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4\u05d4","\u05e9\u05de\u05e0\u05d9 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05d9\u05dd","\u05ea\u05d5\u05e1\u05e4\u05d9\u05dd \u05dc\u05de\u05e0\u05d5\u05e2"]
    },
    "MOBIL":{
      name:"Mobil",
      nameHe:"\u05de\u05d5\u05d1\u05d9\u05dc",
      country:"\u05d0\u05e8\u05d4\"\u05d1",
      flag:"\uD83C\uDDFA\uD83C\uDDF8",
      year:"1911",
      color:"#cc0000",
      description:"Mobil (ExxonMobil) \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05d9\u05d3\u05d5\u05e2\u05d4 \u05d1\u05e9\u05de\u05df Mobil 1 \u05d4\u05e1\u05d9\u05e0\u05ea\u05d8\u05d9. \u05de\u05e9\u05d5\u05de\u05e9\u05ea \u05d1\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05de\u05d9\u05e8\u05d5\u05e5 F1 \u05d5\u05de\u05d0\u05d5\u05e9\u05e8\u05ea \u05dc\u05e9\u05d9\u05de\u05d5\u05e9 \u05e2\u05dc \u05d9\u05d3\u05d9 \u05d9\u05e6\u05e8\u05e0\u05d9\u05dd \u05e8\u05d1\u05d9\u05dd.",
      highlights:["\u05e9\u05de\u05df Mobil 1 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9","\u05e0\u05d9\u05e1\u05d5\u05df F1","\u05d0\u05d9\u05e9\u05d5\u05e8\u05d9 OEM","\u05d7\u05e1\u05db\u05d5\u05df \u05d1\u05d3\u05dc\u05e7"]
    },
    "OSRAM":{
      name:"Osram",
      nameHe:"\u05d0\u05d5\u05e1\u05e8\u05d0\u05dd",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1919",
      color:"#ffa500",
      description:"Osram \u05d4\u05d9\u05d0 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05d1\u05ea\u05d0\u05d5\u05e8\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd, \u05d1\u05e7\u05e8 \u05d0\u05d5\u05e8 \u05d5\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd.",
      highlights:["\u05e1\u05e4\u05e7 OEM","\u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4","\u05d1\u05e7\u05e8 \u05d0\u05d5\u05e8 \u05de\u05d5\u05e9\u05dc\u05dd","\u05d7\u05d9\u05e1\u05db\u05d5\u05df \u05d1\u05d0\u05e0\u05e8\u05d2\u05d9\u05d4"]
    },
    "PHILIPS":{
      name:"Philips",
      nameHe:"\u05e4\u05d9\u05dc\u05d9\u05e4\u05e1",
      country:"\u05d4\u05d5\u05dc\u05e0\u05d3",
      flag:"\uD83C\uDDF3\uD83C\uDDF1",
      year:"1891",
      color:"#0096d6",
      description:"Philips \u05d4\u05d9\u05d0 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d4\u05d5\u05dc\u05e0\u05d3\u05d9\u05ea \u05d1\u05ea\u05d0\u05d5\u05e8\u05d4 \u05dc\u05e8\u05db\u05d1, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d9\u05ea LED \u05d5-HID \u05de\u05ea\u05e7\u05d3\u05de\u05ea.",
      highlights:["\u05e1\u05e4\u05e7 OEM","\u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05ea LED","\u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4","\u05d7\u05d9\u05e1\u05db\u05d5\u05df \u05d1\u05d0\u05e0\u05e8\u05d2\u05d9\u05d4"]
    },
    "SWAG":{
      name:"Swag",
      nameHe:"\u05e1\u05d5\u05d5\u05d0\u05d2",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1954",
      color:"#003087",
      description:"Swag \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea, \u05de\u05e1\u05e4\u05e7\u05ea \u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1 \u05e9\u05dc \u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd \u05d5\u05d9\u05e4\u05e0\u05d9\u05d9\u05dd. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05e2\u05e1\u05e7\u05d9\u05ea \u05d5\u05ea\u05d0\u05d9\u05de\u05d5\u05ea\u05d4 \u05de\u05d5\u05e9\u05dc\u05de\u05ea.",
      highlights:["\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea","\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9"]
    },
    "TOPRAN":{
      name:"Topran",
      nameHe:"\u05d8\u05d5\u05e4\u05e8\u05df",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"1996",
      color:"#003087",
      description:"Topran \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea, \u05de\u05e1\u05e4\u05e7\u05ea \u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd, \u05d9\u05e4\u05e0\u05d9\u05d9\u05dd \u05d5\u05e7\u05d5\u05e8\u05d0\u05d9\u05d9\u05dd. \u05d0\u05d9\u05db\u05d5\u05ea\u05d4 \u05e2\u05e1\u05e7\u05d9\u05ea \u05d5\u05ea\u05d0\u05d9\u05de\u05d5\u05ea\u05d4 \u05de\u05d3\u05d5\u05d9\u05e7\u05ea.",
      highlights:["\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d3\u05d5\u05d9\u05e7\u05ea","\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9"]
    },
    "RIDEX":{
      name:"Ridex",
      nameHe:"\u05e8\u05d0\u05d9\u05d3\u05e7\u05e1",
      country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",
      flag:"\uD83C\uDDE9\uD83C\uDDEA",
      year:"2008",
      color:"#003087",
      description:"Ridex \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05d4\u05de\u05e1\u05e4\u05e7\u05ea \u05e4\u05ea\u05e8\u05d5\u05e0\u05d5\u05ea \u05d1\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9 \u05de\u05d1\u05dc\u05d9 \u05d5\u05d9\u05ea\u05d5\u05e8 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea. \u05de\u05ea\u05d0\u05d9\u05de\u05d4 \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1 \u05d4\u05e0\u05e4\u05d5\u05e6\u05d9\u05dd \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc.",
      highlights:["\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9","\u05d0\u05d9\u05db\u05d5\u05ea \u05d8\u05d5\u05d1\u05d4","\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea","\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1"]
    },
    "HI-Q":{
      name:"Hi-Q",
      nameHe:"\u05d4\u05d0\u05d9 \u05e7\u05d9\u05d5",
      country:"\u05e7\u05d5\u05e8\u05d0\u05d4",
      flag:"\uD83C\uDDF0\uD83C\uDDF7",
      year:"1975",
      color:"#e2000f",
      description:"Hi-Q \u05d4\u05d9\u05d0 \u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05e9\u05dc Sangsin Brake, \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05e7\u05d5\u05e8\u05d0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4. \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05e7\u05d5\u05e8\u05d0\u05d9\u05d9\u05dd \u05d5\u05d9\u05e4\u05e0\u05d9\u05d9\u05dd \u05d5\u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05e1\u05e4\u05e7 \u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "ICER":{
      name:"Icer",
      nameHe:"\u05d0\u05d9\u05e1\u05e8",
      country:"\u05e1\u05e4\u05e8\u05d3",
      flag:"\uD83C\uDDEA\uD83C\uDDF8",
      year:"1963",
      color:"#003087",
      description:"Icer \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05e1\u05e4\u05e8\u05d3\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05de\u05d5\u05e6\u05e8\u05d9\u05d4 \u05e0\u05e7\u05d9\u05d9\u05dd \u05de\u05d0\u05e1\u05d1\u05e1\u05d8 \u05d5\u05e2\u05d5\u05de\u05d3\u05d9\u05dd \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05dc\u05dc\u05d0 \u05d0\u05e1\u05d1\u05e1\u05d8","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "SANGSIN":{
      name:"Sangsin Brake",
      nameHe:"\u05e1\u05d0\u05e0\u05d2\u05e1\u05d9\u05df \u05d1\u05e8\u05d9\u05d9\u05e7",
      country:"\u05e7\u05d5\u05e8\u05d0\u05d4",
      flag:"\uD83C\uDDF0\uD83C\uDDF7",
      year:"1975",
      color:"#cc0000",
      description:"Sangsin Brake \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05e7\u05d5\u05e8\u05d0\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05e7\u05d5\u05e8\u05d0\u05d9\u05d9\u05dd, \u05d9\u05e4\u05e0\u05d9\u05d9\u05dd \u05d5\u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 ECE R90.",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90","\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05e1\u05e4\u05e7 \u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd"]
    },
    "MONTECCHIO":{
      name:"Montecchio",
      nameHe:"\u05de\u05d5\u05e0\u05d8\u05e7\u05d9\u05d5",
      country:"\u05d9\u05e9\u05e8\u05d0\u05dc",
      flag:"\uD83C\uDDEE\uD83C\uDDF1",
      year:"1947",
      color:"#1a3c6e",
      description:"\u05d0\u05d4\u05e8\u05d5\u05df \u05de\u05d5\u05e0\u05d8\u05e7\u05d9\u05d5 \u05d1\u05e2\"\u05de \u2014 \u05d4\u05d7\u05d1\u05e8\u05d4 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05e9\u05d5\u05e7 \u05d7\u05dc\u05e7\u05d9 \u05d4\u05d7\u05d9\u05dc\u05d5\u05e3 \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc \u05de\u05d0\u05d6 1947. \u05de\u05ea\u05de\u05d7\u05d4 \u05d1\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1 \u05e9\u05dc \u05d7\u05dc\u05e7\u05d9\u05dd \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd, \u05d9\u05e4\u05e0\u05d9\u05d9\u05dd \u05d5\u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05d9\u05dd. \u05e9\u05d9\u05e8\u05d5\u05ea \u05de\u05d5\u05de\u05d7\u05d9 \u05d0\u05d9\u05e9\u05d9 \u05e2\u05dd \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05e8\u05d1\u05d5\u05ea.",
      highlights:["\u05d5\u05d5\u05ea\u05e7\u05d9\u05df \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc \u05de\u05d0\u05d6 1947","\u05de\u05d2\u05d5\u05d5\u05df \u05e8\u05d7\u05d1","\u05e9\u05d9\u05e8\u05d5\u05ea \u05d0\u05d9\u05e9\u05d9","\u05d0\u05e1\u05e4\u05e7\u05d4 \u05de\u05d4\u05d9\u05e8\u05d4"]
    },
    "TOYOTA":{name:"\u05d8\u05d5\u05d9\u05d5\u05d8\u05d4 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc \u05d8\u05d5\u05d9\u05d5\u05d8\u05d4/\u05dc\u05e7\u05e1\u05d5\u05e1. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7 \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da.",founded:"",country:"\u05d9\u05e4\u05df",color:"#eb0a1e",highlights:H},
    "HYUNDAI":{name:"\u05d9\u05d5\u05e0\u05d3\u05d0\u05d9/\u05e7\u05d9\u05d4 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05dc\u05d9\u05d5\u05e0\u05d3\u05d0\u05d9 \u05d5\u05e7\u05d9\u05d4. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7 \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da.",founded:"",country:"\u05d3\u05e8\u05d5\u05dd \u05e7\u05d5\u05e8\u05d0\u05d4",color:"#002c5f",highlights:H},
    "RENAULT":{name:"\u05e8\u05e0\u05d5 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc \u05e8\u05e0\u05d5. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7 \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da.",founded:"",country:"\u05e6\u05e8\u05e4\u05ea",color:"#ffcc00",highlights:H},
    "PSA":{name:"\u05e4\u05d9\u05d6'\u05d5/\u05e1\u05d9\u05d8\u05e8\u05d5\u05d0\u05df \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e4\u05d9\u05d6'\u05d5/\u05e1\u05d9\u05d8\u05e8\u05d5\u05d0\u05df. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7.",founded:"",country:"\u05e6\u05e8\u05e4\u05ea",color:"#1f3c88",highlights:H},
    "MERCEDES":{name:"\u05de\u05e8\u05e6\u05d3\u05e1-\u05d1\u05e0\u05e5 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05de\u05e8\u05e6\u05d3\u05e1. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7 \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#333333",highlights:H},
    "BMW":{name:"BMW \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc BMW. \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7 \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#1c69d4",highlights:H},
    "VAG ORIGINAL":{name:"VAG Original",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc VAG (\u05e4\u05d5\u05dc\u05e7\u05e1\u05d5\u05d5\u05d0\u05d2\u05df, \u05e1\u05e7\u05d5\u05d3\u05d4, \u05d0\u05d0\u05d5\u05d3\u05d9, \u05e1\u05d9\u05d8). \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#001e50",highlights:H},
    "VAG":{name:"VAG Original",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc VAG (\u05e4\u05d5\u05dc\u05e7\u05e1\u05d5\u05d5\u05d0\u05d2\u05df, \u05e1\u05e7\u05d5\u05d3\u05d4, \u05d0\u05d0\u05d5\u05d3\u05d9, \u05e1\u05d9\u05d8). \u05de\u05ea\u05d0\u05d9\u05dd \u05d1\u05d3\u05d9\u05d5\u05e7.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#001e50",highlights:H},
    "AYD":{
      name:"AYD",
      nameHe:"\u05d0\u05d9.\\u05d5\u05d5\u05d0\u05d9.\u05d3\u05d9",
      country:"\u05d8\u05d5\u05e8\u05e7\u05d9\u05d4",
      flag:"\uD83C\uDDF9\uD83C\uDDF7",
      year:"1975",
      color:"#0054a6",
      description:"AYD \u05d4\u05d9\u05d0 \u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9 \u05d4\u05d9\u05d2\u05d5\u05d9 \u05d5\u05d4\u05ea\u05dc\u05d9\u05d9\u05d4 \u05d8\u05d5\u05e8\u05e7\u05d9\u05ea \u05de\u05d5\u05d1\u05d9\u05dc\u05d4, \u05de\u05e1\u05e4\u05e7\u05ea OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd. \u05e2\u05d5\u05de\u05d3\u05ea \u05d1\u05ea\u05e7\u05df ISO \u05d5\u05de\u05ea\u05d0\u05d9\u05de\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2 \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d9\u05dd.",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM","\u05ea\u05e7\u05df ISO","\u05d9\u05d9\u05e6\u05d5\u05e8 \u05de\u05ea\u05e7\u05d3\u05dd","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2 \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d9\u05dd"]
    },
    "TEKNOROT":{
      name:"Teknorot",
      nameHe:"\u05d8\u05e7\u05e0\u05d5\u05e8\u05d5\u05d8",
      country:"\u05d8\u05d5\u05e8\u05e7\u05d9\u05d4",
      flag:"\uD83C\uDDF9\uD83C\uDDF7",
      year:"1992",
      color:"#e31e24",
      description:"Teknorot \u05D4\u05D9\u05D0 \u05D9\u05E6\u05E8\u05E0\u05D9\u05EA \u05E8\u05DB\u05D9\u05D1\u05D9 \u05D4\u05D9\u05D2\u05D5\u05D9 \u05D5\u05D4\u05EA\u05DC\u05D9\u05D9\u05D4 \u05D8\u05D5\u05E8\u05E7\u05D9\u05EA \u05DE\u05D5\u05D1\u05D9\u05DC\u05D4, \u05E9\u05E0\u05D5\u05E1\u05D3\u05D4 \u05D1-1992 \u05D5\u05DE\u05EA\u05DE\u05D7\u05D4 \u05D1\u05D9\u05D9\u05E6\u05D5\u05E8 \u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD, \u05DE\u05D5\u05D8\u05D5\u05EA \u05D4\u05D9\u05D2\u05D5\u05D9, \u05D6\u05E8\u05D5\u05E2\u05D5\u05EA \u05D5\u05E8\u05DB\u05D9\u05D1\u05D9 \u05DE\u05EA\u05DC\u05D9\u05D4 \u05DE\u05E4\u05DC\u05D3\u05D4 \u05DE\u05D7\u05D5\u05E9\u05DC\u05EA \u05D5\u05D0\u05DC\u05D5\u05DE\u05D9\u05E0\u05D9\u05D5\u05DD \u05DE\u05D7\u05D5\u05E9\u05DC. \u05D4\u05DE\u05E4\u05E2\u05DC \u05DE\u05E9\u05E8\u05EA \u05DC\u05DE\u05E2\u05DC\u05D4 \u05DE-200 \u05D9\u05E6\u05E8\u05E0\u05D9 \u05E8\u05DB\u05D1 \u05D1\u05E2\u05D5\u05DC\u05DD, \u05D5\u05DE\u05D9\u05D9\u05E6\u05E8\u05EA \u05DE\u05E2\u05DC 50 \u05DE\u05D9\u05DC\u05D9\u05D5\u05DF \u05D7\u05DC\u05E7\u05D9\u05DD \u05D1\u05E9\u05E0\u05D4. \u05DB\u05DC \u05D4\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05E2\u05D5\u05D1\u05E8\u05D9\u05DD \u05D1\u05D3\u05D9\u05E7\u05D5\u05EA \u05D7\u05D5\u05D6\u05E7 \u05DE\u05D7\u05DE\u05D9\u05E8\u05D5\u05EA \u05D5\u05E2\u05D5\u05DE\u05D3\u05D9\u05DD \u05D1\u05EA\u05E7\u05E0\u05D9 ISO 9001 \u05D5-IATF 16949, \u05DE\u05D4 \u05E9\u05DE\u05D1\u05D8\u05D9\u05D7 \u05D0\u05D9\u05DB\u05D5\u05EA \u05D5\u05D0\u05DE\u05D9\u05E0\u05D5\u05EA \u05D1\u05E8\u05DE\u05D4 \u05D4\u05D2\u05D1\u05D5\u05D4\u05D4 \u05D1\u05D9\u05D5\u05EA\u05E8.",
      highlights:["\u05ea\u05e7\u05df IATF 16949","\u05e4\u05dc\u05d3\u05d4 \u05de\u05d7\u05d5\u05e9\u05dc\u05ea","\u05d7\u05d5\u05de\u05e8\u05d9\u05dd \u05de\u05ea\u05e7\u05d3\u05de\u05d9\u05dd","\u05e2\u05d5\u05d1\u05e8 \u05de\u05d1\u05d7\u05e0\u05d9 \u05d7\u05d5\u05d6\u05e7"]
    }
  };


  /* ===================================================
     STEP 3: Extract data from Konimbo DOM
     =================================================== */
  function getText(el) { return el ? (el.textContent || el.innerText || '').trim() : ''; }

  var productTitle = '';
  var titleEl = document.getElementById('item_current_title') ||
    document.querySelector('[id*="item_title"],[id*="product_title"]');
  var h1El = titleEl ? titleEl.getElementsByTagName('h1')[0] : null;
  if (h1El) productTitle = getText(h1El);
  if (!productTitle) {
    var itemShow = document.getElementById('item_show');
    if (itemShow) { var h1s = itemShow.getElementsByTagName('h1'); if (h1s.length) productTitle = getText(h1s[0]); }
  }
  if (!productTitle) { var ah1 = document.getElementsByTagName('h1'); if (ah1.length) productTitle = getText(ah1[0]); }
  if (!productTitle) productTitle = document.title.split('|')[0].trim();

  var priceEl = null;
  var allS = document.getElementsByTagName('span');
  for (var i = 0; i < allS.length; i++) {
    if ((allS[i].className||'').indexOf('price') !== -1 && getText(allS[i]).indexOf('\u20aa') !== -1) { priceEl = allS[i]; break; }
  }
  if (!priceEl) {
    var allD = document.getElementsByTagName('div');
    for (var d = 0; d < allD.length; d++) {
      if ((allD[d].className||'').indexOf('price') !== -1 && getText(allD[d]).indexOf('\u20aa') !== -1) { priceEl = allD[d]; break; }
    }
  }
  var productPrice = priceEl ? getText(priceEl).replace(/[^\d,.]/g,'').trim() : '';

  var skuValue = '';
  var mcMatch = productTitle.match(/\b(\d{4,5}[A-Za-z])\b/);
  if (mcMatch) skuValue = mcMatch[1];
  if (!skuValue) {
    var tParts = productTitle.split('|');
    for (var tp = tParts.length - 1; tp >= 0; tp--) {
      var skuM = tParts[tp].trim().match(/([A-Za-z][A-Za-z0-9\-]{3,}[0-9][A-Za-z0-9]*)/);
      if (skuM) {
        var cand = skuM[1].trim();
        if (/\d/.test(cand) && /[A-Za-z]/.test(cand) && !/[\u05d0-\u05ea]{3}/.test(cand)) {
          var bKs = Object.keys(BRAND_INFO);
          for (var bki = 0; bki < bKs.length; bki++) {
            if (cand.toUpperCase().indexOf(bKs[bki]) === 0) { cand = cand.substring(bKs[bki].length).trim(); break; }
          }
          if (cand) { skuValue = cand; break; }
        }
      }
    }
  }
  if (!skuValue) {
    var codeEls = document.getElementsByTagName('*');
    for (var ce = 0; ce < codeEls.length; ce++) {
      if ((codeEls[ce].className||'').toString().indexOf('code_item') !== -1) {
        var ct = getText(codeEls[ce]).replace(/\u05de\u05e7["'\u05d9\u05d8:\u05f4]+\s*/g,'').trim();
        if (ct) { skuValue = ct; break; }
      }
    }
  }

  var imageUrls = [];
  var imgSrc = document.getElementById('item_show_carousel') || document.getElementById('item_show') || document;
  var allImgs = imgSrc.getElementsByTagName('img');
  for (var im = 0; im < allImgs.length; im++) {
    var src = allImgs[im].src || allImgs[im].getAttribute('data-src') || '';
    if (src && src.indexOf('http') === 0) {
      var lsrc = src.toLowerCase();
      if (lsrc.indexOf('logo')===-1 && lsrc.indexOf('icon')===-1 && lsrc.indexOf('banner')===-1 &&
          lsrc.indexOf('spotlight')===-1 && lsrc.indexOf('.svg')===-1 && lsrc.indexOf('placeholder')===-1) {
        if (imageUrls.indexOf(src) === -1) imageUrls.push(src);
      }
    }
  }

  var breadcrumbItems = [];
  var bcLinks = document.querySelectorAll('#bread_crumbs a,.bread_crumbs a');
  for (var bc2 = 0; bc2 < bcLinks.length; bc2++) {
    var bt = getText(bcLinks[bc2]);
    if (bt) breadcrumbItems.push({text: bt, href: bcLinks[bc2].href || '#'});
  }

  /* Extract description from Konimbo — multiple selector fallbacks */
  var productDescription = '';
  var descSelectors = [
    '.item_description',
    '#item_description',
    '[class*="item_desc"]',
    '[id*="item_desc"]',
    '#item_content .description',
    '.product-description',
    '[class*="product_desc"]',
    '.item_details_text',
    '[class*="item_details"]',
    '#item_content'
  ];
  for (var ds = 0; ds < descSelectors.length; ds++) {
    var descEl = document.querySelector(descSelectors[ds]);
    if (descEl) {
      var descHtml = descEl.innerHTML || '';
      var descText = getText(descEl);
      /* Skip if it's just the title or too short */
      if (descText && descText.length > 20 && descText !== productTitle) {
        productDescription = descHtml;
        break;
      }
    }
  }

  var stockText = '\u05d6\u05de\u05d9\u05df \u05d1\u05de\u05dc\u05d0\u05d9';

  /* ===================================================
     STEP 4: Brand detection
     =================================================== */
  var detectedBrand = '';
  var titleUpper = productTitle.toUpperCase();
  var brandAliases = {
    'MANN ':'MANN-FILTER','MANN FILTER':'MANN-FILTER','FEBI':'FEBI BILSTEIN',
    'LIQUI':'LIQUI MOLY','LIQUI-MOLY':'LIQUI MOLY','BLUE PRINT':'BLUE PRINT',
    'BLUEPRINT':'BLUE PRINT','HI Q':'HI-Q','HIQ':'HI-Q',
    'VOLKSWAGEN':'VAG','AUDI ':'VAG','SKODA':'VAG','SEAT ':'VAG','CUPRA':'VAG'
  };
  var brandKeys = Object.keys(BRAND_INFO);
  for (var bk = 0; bk < brandKeys.length; bk++) {
    if (titleUpper.indexOf(brandKeys[bk]) !== -1) { detectedBrand = brandKeys[bk]; break; }
  }
  if (!detectedBrand) {
    var alKeys = Object.keys(brandAliases);
    for (var ai = 0; ai < alKeys.length; ai++) {
      if (titleUpper.indexOf(alKeys[ai]) !== -1) { detectedBrand = brandAliases[alKeys[ai]]; break; }
    }
  }
  if (!detectedBrand && skuValue && /^\d{4,5}[A-Za-z]$/.test(skuValue.trim())) detectedBrand = 'MONTECCHIO';

  var isOEMpart = false;
  if (!BRAND_INFO[detectedBrand] && skuValue) {
    var sk = skuValue.trim();
    if (/^\d{2}[A-Z]\d{5,7}[A-Z]{0,2}$/.test(sk)||/^\d[A-Z]\d\d{5,7}[A-Z]{0,2}$/.test(sk)) detectedBrand='VAG';
    else if (/^(044|909|178|233|164|480|433|488|900)\d{7}$/.test(sk)) detectedBrand='TOYOTA';
    else if (/^(281|263|971|548|311|923|586|517)\d{7,8}$/.test(sk)) detectedBrand='HYUNDAI';
    else if (/^\d{9,10}R$/.test(sk)) detectedBrand='RENAULT';
    else if (/^16\d{8}$/.test(sk)) detectedBrand='PSA';
    else if (/^A\d{10}$/.test(sk)) detectedBrand='MERCEDES';
    else if (/^(11|13|17|22|31|32|33|34|64)\d{9}$/.test(sk)) detectedBrand='BMW';
    if (detectedBrand) isOEMpart = true;
  }

  var brandData = BRAND_INFO[detectedBrand] || {name:detectedBrand||'\u05d9\u05e6\u05e8\u05df',description:'\u05d9\u05e6\u05e8\u05df \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05de\u05d5\u05d1\u05d9\u05dc \u05dc\u05e8\u05db\u05d1.',founded:'',country:'',color:'#1B4E91'};

  var productSubtitle = '';
  var hwds = productTitle.match(/[\u05d0-\u05ea]+(?:\s+[\u05d0-\u05ea]+)*/g);
  if (hwds && hwds.length > 0) {
    productSubtitle = hwds[0].trim();
    if (hwds.length > 1 && productSubtitle.split(' ').length < 2) productSubtitle += ' ' + hwds[1].trim();
  }
  productSubtitle = productSubtitle.replace(/\s*\|\s*/g,'').trim();
  if (productSubtitle === productTitle.trim()) productSubtitle = '';

  var categoryLabel = '';
  if (breadcrumbItems.length >= 2) {
    var bcl = breadcrumbItems[breadcrumbItems.length - 2];
    if (bcl.text && bcl.href.indexOf('#') === -1 && bcl.href !== window.location.href) categoryLabel = bcl.text;
  }

  /* ===================================================
     STEP 5: Find insertion target
     =================================================== */
  var targetInsertEl = document.getElementById('item_show')||document.getElementById('item_details')||
    document.getElementById('item_content')||document.getElementById('content_area')||
    document.getElementById('item_main')||document.getElementById('layout_item');
  if (!targetInsertEl) { var frm=document.querySelector('form#new_order,form.productForm'); if(frm) targetInsertEl=frm; }
  if (!targetInsertEl) {
    var bc3=document.getElementById('bread_crumbs');
    if(bc3&&bc3.nextElementSibling) targetInsertEl=bc3.nextElementSibling;
    else if(bc3&&bc3.parentElement) targetInsertEl=bc3.parentElement.children[0];
  }
  if (!targetInsertEl) { var ms=document.getElementsByTagName('main'); if(ms.length) targetInsertEl=ms[0]; }
  if (!targetInsertEl) {
    var ah1b=document.querySelectorAll('h1');
    for(var hi=0;hi<ah1b.length;hi++){if(ah1b[hi].textContent.indexOf(productTitle.substring(0,10))!==-1){targetInsertEl=ah1b[hi].parentElement;break;}}
  }
  if (!targetInsertEl) return;

  /* ===================================================
     STEP 6: Build HTML — EXACT section order from demo:
     1. .an-product-top (info LEFT, image RIGHT in demo RTL)
     2. .an-section-card — highlights (✦ ביצועים, איכות ובטיחות)
     3. .an-section-card — description (תיאור המוצר)
     4. .an-section-card — TecDoc (tabs: פרטים טכניים, התאמה לרכבים, מספרי OE)
     5. .an-section-card — Brand card
     =================================================== */
  var highlights = brandData.highlights || [
    '\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1',
    '\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05d0\u05d9\u05e8\u05d5\u05e4\u05d9\u05d9\u05dd',
    '\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd \u05e2\u05dd \u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05de\u05d5\u05d0\u05e8\u05da',
    '\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd'
  ];

  var cartSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
  var cartSvgSm = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
  var chevSvg = '<svg class="an-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';

  /* Images */
  var mainImgHtml = '', thumbsHtml = '';
  if (imageUrls.length > 0) {
    mainImgHtml = '<img src="'+imageUrls[0]+'" alt="'+productTitle+'" id="an-main-img">';
    for (var ti = 0; ti < Math.min(imageUrls.length, 5); ti++) {
      thumbsHtml += '<div class="an-thumb'+(ti===0?' an-thumb-active':'')+'" data-an-img="'+imageUrls[ti]+'"><img src="'+imageUrls[ti]+'" alt="'+(ti+1)+'"></div>';
    }
    for (var ti2 = imageUrls.length; ti2 < 3; ti2++) {
      thumbsHtml += '<div class="an-thumb"><div class="an-thumb-ph">'+(brandData.name||'').substring(0,8)+'</div></div>';
    }
  } else {
    var bN = (brandData.name||'').toUpperCase().substring(0,10);
    mainImgHtml = '<div class="an-img-ph"><div class="an-img-ph-brand">'+bN+'</div><div class="an-img-ph-sku">'+(skuValue||'')+'</div></div>';
    thumbsHtml = '<div class="an-thumb an-thumb-active"><div class="an-thumb-ph">'+bN+'</div></div><div class="an-thumb"><div class="an-thumb-ph">'+bN+'</div></div><div class="an-thumb"><div class="an-thumb-ph">'+bN+'</div></div>';
  }

  /* Breadcrumb */
  var bcHtml = '';
  if (breadcrumbItems.length > 0) {
    for (var bci = 0; bci < breadcrumbItems.length; bci++) {
      bcHtml += '<a href="'+breadcrumbItems[bci].href+'">'+breadcrumbItems[bci].text+'</a><span class="an-sep">/</span>';
    }
  } else {
    bcHtml = '<a href="/">\u05d3\u05e3 \u05d4\u05d1\u05d9\u05ea</a><span class="an-sep">/</span><a href="#">\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3</a><span class="an-sep">/</span>';
  }
  bcHtml += '<span class="an-current">'+productTitle.substring(0,60)+'</span>';

  /* Price */
  var cleanPrice = productPrice.replace(/[\u20aa]/g,'').replace(/[^\d,. ]/g,'').trim();
  var priceDisplay = cleanPrice ? cleanPrice+' \u20aa' : (priceEl ? getText(priceEl) : '');

  /* Highlights list */
  var hlItems = '';
  for (var hl = 0; hl < highlights.length; hl++) hlItems += '<li>'+highlights[hl]+'</li>';

  /* Brand highlights */
  var brandHlItems = '';
  if (brandData.highlights) {
    for (var bhl = 0; bhl < brandData.highlights.length; bhl++) brandHlItems += '<li>'+brandData.highlights[bhl]+'</li>';
  }

  /* Specs rows */
  var specRows = '';
  if (brandData.name && brandData.name !== '\u05d9\u05e6\u05e8\u05df') specRows += '<tr><td>\u05d9\u05e6\u05e8\u05df</td><td>'+brandData.name+'</td></tr>';
  if (skuValue) specRows += '<tr><td>\u05de\u05e7"\u05d8</td><td>'+skuValue+'</td></tr>';
  if (categoryLabel) specRows += '<tr><td>\u05e1\u05d5\u05d2 \u05de\u05d5\u05e6\u05e8</td><td>'+categoryLabel+'</td></tr>';

  /* ===== Build full HTML ===== */
  var html = '';

  /* Breadcrumb bar */
  html += '<div class="an-breadcrumb-bar"><nav class="an-breadcrumb">'+bcHtml+'</nav></div>';

  /* Page background wrapper + container */
  html += '<div class="an-page-bg"><div class="an-container">';

  /* ===================================================
     SECTION 1: .an-product-top — two-column grid
     In demo: info column left (RTL: visually right), image column right (RTL: visually left)
     =================================================== */
  html += '<div class="an-product-top">';

  /* Column 1: Info */
  html += '<div class="an-info-section">';
  html += '<div class="an-badge-row">';
  if (skuValue) html += '<span class="an-sku-badge">\u05de\u05e7"\u05d8: '+skuValue+'</span>';
  if (!isOEMpart && brandData.name) html += '<span class="an-brand-badge" style="background:'+(brandData.color||'#c8102e')+'">'+brandData.name+'</span>';
  html += '</div>';
  html += '<h1 class="an-product-title">'+productTitle+'</h1>';
  if (productSubtitle) html += '<div class="an-product-subtitle">'+productSubtitle+'</div>';
  html += '<div class="an-stock-status"><span class="an-stock-dot"></span>'+stockText+'</div>';
  html += '<div class="an-price-section"><span class="an-price">'+priceDisplay+'</span><span class="an-price-vat">\u05db\u05d5\u05dc\u05dc \u05de\u05e2"\u05de</span></div>';
  html += '<div class="an-cart-row" id="an-cart-row">';
  html += '<div class="an-qty-selector"><button class="an-qty-btn" id="an-qty-minus">\u2212</button><div class="an-qty-value" id="an-qty-val">1</div><button class="an-qty-btn" id="an-qty-plus">+</button></div>';
  html += '<button class="an-add-to-cart" id="an-add-to-cart">'+cartSvg+'\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e2\u05d2\u05dc\u05d4</button>';
  html += '</div>';
  html += '<div class="an-sold-by">\u05e0\u05de\u05db\u05e8 \u05d5\u05e0\u05e9\u05dc\u05d7 \u05e2\u05dc \u05d9\u05d3\u05d9 <strong>\u05d0\u05d5\u05d8\u05d5 \u05e0\u05d4\u05e8\u05d9\u05d4</strong></div>';
  html += '<div class="an-trust-box">';
  html += '<div class="an-trust-item"><span class="an-icon">\uD83D\uDE9A</span><span>\u05de\u05e9\u05dc\u05d5\u05d7 \u05e2\u05d3 7 \u05d9\u05de\u05d9 \u05e2\u05e1\u05e7\u05d9\u05dd \u05dc\u05db\u05dc \u05d4\u05d0\u05e8\u05e5</span></div>';
  html += '<div class="an-trust-item"><span class="an-icon">\uD83D\uDEE1\uFE0F</span><span>\u05d0\u05d7\u05e8\u05d9\u05d5\u05ea 3 \u05d7\u05d5\u05d3\u05e9\u05d9\u05dd / 6,000 \u05e7"\u05de</span></div>';
  html += '<div class="an-trust-item"><span class="an-icon">\uD83C\uDFC6</span><span>\u05de\u05d5\u05e8\u05e9\u05d9\u05dd \u05de\u05e9\u05e8\u05d3 \u05d4\u05ea\u05d7\u05d1\u05d5\u05e8\u05d4</span></div>';
  html += '<div class="an-trust-item"><span class="an-icon">\uD83D\uDD12</span><span>\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05d0\u05d5\u05d1\u05d8\u05d7 \u2014 SSL \u05de\u05d5\u05e6\u05e4\u05df</span></div>';
  html += '<div class="an-trust-item"><span class="an-icon">\uD83D\uDCB3</span><span>\u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05ea\u05e9\u05dc\u05d5\u05de\u05d9\u05dd \u05d1\u05e7\u05d5\u05e4\u05d4</span></div>';
  html += '</div>';
  html += '</div>'; /* end .an-info-section */

  /* Column 2: Image */
  html += '<div class="an-product-image-area">';
  html += '<div class="an-main-image">'+mainImgHtml+'</div>';
  html += '<div class="an-thumb-row">'+thumbsHtml+'</div>';
  html += '</div>'; /* end .an-product-image-area */

  html += '</div>'; /* end .an-product-top */

  /* ===================================================
     SECTION 2: Highlights — "✦ ביצועים, איכות ובטיחות"
     =================================================== */
  html += '<div class="an-section-card">';
  html += '<div class="an-section-header" id="an-hl-hdr"><h2>\u2756 \u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd, \u05d0\u05d9\u05db\u05d5\u05ea \u05d5\u05d1\u05d8\u05d9\u05d7\u05d5\u05ea</h2>'+chevSvg+'</div>';
  html += '<div class="an-section-body" id="an-hl-body">';
  html += '<ul class="an-highlights-list">'+hlItems+'</ul>';
  html += '</div></div>';

  /* ===================================================
     SECTION 3: Description — "תיאור המוצר" (from Konimbo)
     =================================================== */
  html += '<div class="an-section-card">';
  html += '<div class="an-section-header" id="an-desc-hdr"><h2>\u05ea\u05d9\u05d0\u05d5\u05e8 \u05d4\u05de\u05d5\u05e6\u05e8</h2>'+chevSvg+'</div>';
  html += '<div class="an-section-body" id="an-desc-body">';
  if (productDescription) {
    html += '<div class="an-description-section">'+productDescription+'</div>';
  } else {
    html += '<p class="an-description-text">'+productTitle+' \u2014 \u05d7\u05dc\u05e7 \u05d0\u05d9\u05db\u05d5\u05ea\u05d9 \u05dc\u05e8\u05db\u05d1\u05da. \u05d1\u05d3\u05d9\u05e7\u05ea \u05d4\u05ea\u05d0\u05de\u05d4 \u05de\u05d5\u05e9\u05dc\u05de\u05ea \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da. \u05d0\u05e1\u05e4\u05e7\u05d4 \u05de\u05d9\u05d9\u05d3\u05d9\u05ea \u05de\u05d4\u05de\u05dc\u05d0\u05d9.</p>';
  }
  html += '</div></div>';

  /* ===================================================
     SECTION 4: TecDoc — tabs: פרטים טכניים, התאמה לרכבים, מספרי OE
     =================================================== */
  html += '<div class="an-section-card" id="an-tecdoc-section">';
  html += '<div class="an-tecdoc-attribution"><div class="an-tecdoc-dot"></div><span>\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05de-TecDoc\u00ae Catalogue</span></div>';
  html += '<div id="an-tecdoc-wrap"></div>';
  html += '</div>';

  /* ===================================================
     SECTION 5: Brand card
     =================================================== */
  if (!isOEMpart && brandData.name && brandData.description) {
    var bc4 = brandData.color || '#1a4690';
    var bAb = brandData.name.toUpperCase(); if (bAb.length > 5) bAb = bAb.substring(0,5);
    var orig = brandData.country ? brandData.country+(brandData.year?', '+(brandData.founded||brandData.year):'') : '';
    var flagStr = brandData.flag ? brandData.flag+' ' : '';
    html += '<div class="an-section-card">';
    html += '<div class="an-brand-card">';
    html += '<div class="an-brand-sidebar" style="background:'+bc4+'"><span>'+bAb+'</span></div>';
    html += '<div class="an-brand-info">';
    html += '<h3>'+brandData.name+'</h3>';
    if (orig) html += '<div class="an-brand-origin">'+flagStr+orig+'</div>';
    html += '<p>'+brandData.description+'</p>';
    /* Brand card shows description only — no highlights list */
    html += '</div></div></div>';
  }

  html += '</div></div>'; /* end .an-container + .an-page-bg */


  /* ===================================================
     STEP 7: Insert into DOM
     =================================================== */
  var wrapper = document.createElement('div');
  wrapper.id = 'an-product-redesign';
  wrapper.setAttribute('dir', 'rtl');
  wrapper.innerHTML = html;
  targetInsertEl.parentNode.insertBefore(wrapper, targetInsertEl);
  var bCls = document.body.className || '';
  if (bCls.indexOf('an-redesigned') === -1) document.body.className = (bCls ? bCls + ' ' : '') + 'an-redesigned';

  /* ===================================================
     STEP 8: Wire up interactions
     =================================================== */

  /* Qty selector */
  var qtyVal = document.getElementById('an-qty-val');
  var qtyMinus = document.getElementById('an-qty-minus');
  var qtyPlus = document.getElementById('an-qty-plus');
  var qtyCount = 1;
  function updateQtyDisplay() { if(qtyVal) qtyVal.textContent = qtyCount; }
  if (qtyMinus) qtyMinus.addEventListener('click', function() { if(qtyCount>1){qtyCount--;updateQtyDisplay();} });
  if (qtyPlus) qtyPlus.addEventListener('click', function() { if(qtyCount<99){qtyCount++;updateQtyDisplay();} });

  /* Real cart click */
  function clickRealCart() {
    var btn = document.querySelector('.commit_to_real,a.buy_now,form#new_order input[type="submit"],form.productForm input[type="submit"]');
    if (btn) { btn.click(); return true; }
    return false;
  }
  var addBtn = document.getElementById('an-add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var oq = document.querySelector('input[name="quantity"],input[id*="quantity"],select[name="quantity"]');
      if (oq) oq.value = qtyCount;
      clickRealCart();
    });
  }

  /* Move TecDoc widget into our section */
  function moveTecDoc() {
    var tw = document.getElementById('tecdoc-widget');
    var wp = document.getElementById('an-tecdoc-wrap');
    if (tw && wp && !wp.querySelector('#tecdoc-widget')) {
      wp.appendChild(tw);
      tw.style.display = 'block';
      return true;
    }
    return false;
  }
  if (!moveTecDoc()) {
    [500,1500,3000,6000,10000,15000].forEach(function(t){ setTimeout(moveTecDoc, t); });
    if (typeof MutationObserver !== 'undefined') {
      var tdObs = new MutationObserver(function(){ if(moveTecDoc()) tdObs.disconnect(); });
      tdObs.observe(document.body, {childList:true, subtree:true});
      setTimeout(function(){ tdObs.disconnect(); }, 20000);
    }
  }

  /* Hide Konimbo's .tw-purchase-row */
  function hideTwPurchaseRow() {
    var twRow = document.querySelectorAll('.tw-purchase-row');
    for (var t = 0; t < twRow.length; t++) twRow[t].style.setProperty('display','none','important');
  }
  hideTwPurchaseRow();
  [300,1000,3000,6000].forEach(function(t){ setTimeout(hideTwPurchaseRow, t); });

  /* Thumbnail clicks */
  var thumbEls = document.querySelectorAll('#an-product-redesign .an-thumb[data-an-img]');
  var mainImg = document.getElementById('an-main-img');
  for (var th = 0; th < thumbEls.length; th++) {
    (function(thumb) {
      thumb.addEventListener('click', function() {
        var all = document.querySelectorAll('#an-product-redesign .an-thumb');
        for (var t=0;t<all.length;t++) all[t].className = all[t].className.replace(/\s*an-thumb-active/g,'');
        thumb.className += ' an-thumb-active';
        if (mainImg) mainImg.src = thumb.getAttribute('data-an-img');
      });
    })(thumbEls[th]);
  }

  /* Section toggles */
  function setupToggle(hId, bId) {
    var hE = document.getElementById(hId), bE = document.getElementById(bId);
    if (!hE || !bE) return;
    hE.addEventListener('click', function() {
      var c = hE.className || '';
      if (c.indexOf('an-collapsed') !== -1) {
        hE.className = c.replace(/\s*an-collapsed/g,'');
        bE.style.display = '';
      } else {
        hE.className = c + ' an-collapsed';
        bE.style.display = 'none';
      }
    });
  }
  setupToggle('an-hl-hdr','an-hl-body');
  setupToggle('an-desc-hdr','an-desc-body');

  /* Vehicle group accordion — delegated for async TecDoc content */
  document.addEventListener('click', function(e) {
    var hdr = null;
    var el = e.target;
    while (el && el !== document) {
      if (el.classList && el.classList.contains('an-veh-group-header')) { hdr = el; break; }
      if (el.classList && el.classList.contains('an-veh-model-row')) { hdr = el; break; }
      el = el.parentElement;
    }
    if (!hdr) return;
    if (hdr.classList.contains('an-veh-group-header')) {
      var grp = hdr.parentElement;
      var models = grp.querySelector('.an-veh-group-models');
      if (models) {
        var isOpen = grp.classList.contains('an-open');
        if (isOpen) { grp.classList.remove('an-open'); models.style.display='none'; }
        else { grp.classList.add('an-open'); models.style.display=''; }
      }
    } else if (hdr.classList.contains('an-veh-model-row')) {
      var item = hdr.parentElement;
      var engines = item.querySelector('.an-veh-engines');
      if (engines) {
        var isOpen2 = item.classList.contains('an-open');
        if (isOpen2) { item.classList.remove('an-open'); engines.style.display='none'; }
        else { item.classList.add('an-open'); engines.style.display=''; }
      }
    }
  });

  /* Tab switching — delegated */
  document.addEventListener('click', function(e) {
    var tab = null;
    var el2 = e.target;
    while (el2 && el2 !== document) {
      if (el2.classList && el2.classList.contains('an-tab')) { tab = el2; break; }
      el2 = el2.parentElement;
    }
    if (!tab) return;
    var tabsContainer = tab.parentElement;
    var panelId = tab.getAttribute('data-panel');
    if (!panelId) return;
    var allTabs = tabsContainer.querySelectorAll('.an-tab');
    for (var t=0;t<allTabs.length;t++) allTabs[t].classList.remove('an-active');
    tab.classList.add('an-active');
    var section = tabsContainer.parentElement;
    var allPanels = section.querySelectorAll('.an-tab-panel');
    for (var p=0;p<allPanels.length;p++) allPanels[p].classList.remove('an-active');
    var targetPanel = document.getElementById(panelId);
    if (targetPanel) targetPanel.classList.add('an-active');
  });

  /* ===================================================
     STEP 9: Sticky mobile bar
     =================================================== */
  var shortT = productTitle.length > 30 ? productTitle.substring(0,30)+'\u2026' : productTitle;
  var sBarHtml = '<div id="an-sticky-bar"><div class="an-sticky-inner"><div class="an-sticky-info"><span class="an-sticky-title">'+shortT+'</span><span class="an-sticky-price">'+priceDisplay+'</span></div><button class="an-sticky-buy" id="an-sticky-btn">'+cartSvgSm+'\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e2\u05d2\u05dc\u05d4</button></div></div>';
  var sc = document.createElement('div');
  sc.innerHTML = sBarHtml;
  document.body.appendChild(sc.firstChild);
  var sSBtn = document.getElementById('an-sticky-btn');
  if (sSBtn) sSBtn.addEventListener('click', function(e){e.preventDefault();clickRealCart();});

  var sBar = document.getElementById('an-sticky-bar');
  var pTop = document.querySelector('#an-product-redesign .an-product-top');
  var sVis = false;
  function checkSticky() {
    if (!pTop || !sBar) return;
    var r = pTop.getBoundingClientRect();
    var show = r.top < -200;
    if (show !== sVis) {
      sVis = show;
      if (show) sBar.classList.add('an-sticky-visible');
      else sBar.classList.remove('an-sticky-visible');
    }
  }
  window.addEventListener('scroll', checkSticky, {passive:true});

})();\n/* Mobile: image below title */\n@media (max-width: 768px) {\n  .an-product-top { display: flex !important; flex-direction: column !important; }\n  .an-info-section { order: 1 !important; }\n  .an-product-image-area { order: 2 !important; }\n}\n/* TecDoc tabs - wrap on mobile instead of scroll */\n@media (max-width: 768px) {\n  #tecdoc-widget .tw-tabs {\n    flex-wrap: wrap !important;\n    justify-content: center !important;\n    gap: 0 !important;\n  }\n  #tecdoc-widget .tw-tab {\n    padding: 10px 14px !important;\n    font-size: 13px !important;\n    flex: 1 1 auto !important;\n    text-align: center !important;\n    min-width: 0 !important;\n  }\n}\n

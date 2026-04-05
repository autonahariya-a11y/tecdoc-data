(function() {
  'use strict';

  /* ===================================================
     STEP 1: Inject CSS
     =================================================== */
  if (!document.getElementById('an-style-v2')) {
    var style = document.createElement('style');
    style.id = 'an-style-v2';
    style.textContent = '/* KONIMBO HIDING */\nbody.an-redesigned #item_show,body.an-redesigned #item_content,body.an-redesigned .specifications,body.an-redesigned #item_show_facebook,body.an-redesigned #item_show_carousel,body.an-redesigned .item_show_carousel,body.an-redesigned .item_container,body.an-redesigned #item_info,body.an-redesigned .item_main_top,body.an-redesigned #bread_crumbs,body.an-redesigned .product-container,body.an-redesigned #item_current_title,body.an-redesigned .code_item,body.an-redesigned #page_notice,body.an-redesigned #storiesWidget,body.an-redesigned .stories-wrapper{display:none !important}\nbody.an-redesigned #item_details,body.an-redesigned .item_main_bottom{display:block !important;height:0 !important;overflow:hidden !important;margin:0 !important;padding:0 !important;border:none !important;opacity:0 !important;pointer-events:none !important}\n#an-product-redesign{display:block !important}\n.tw-purchase-row{width:100% !important}\n.tw-purchase-row .tw-cart-btn{width:100% !important;height:54px !important;font-size:18px !important;font-weight:700 !important;border-radius:8px !important;box-shadow:0 4px 14px rgba(27,78,145,0.35) !important}\n\n    *, *::before, *::after {\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0;\n    }\n\n    :root {\n      --primary: #1B4E91;\n      --primary-dark: #153d73;\n      --brand-blue: #1a4690;\n      --brand-red: #c8102e;\n      --bg: #f7f8fa;\n      --white: #ffffff;\n      --text: #1a1a2e;\n      --text-secondary: #5a5a6e;\n      --text-muted: #8a8a9a;\n      --border: #e4e6eb;\n      --border-light: #f0f1f4;\n      --green: #00a651;\n      --green-bg: #e8f8ef;\n      --radius: 12px;\n      --radius-sm: 8px;\n      --shadow: 0 2px 8px rgba(0,0,0,0.06);\n      --shadow-lg: 0 4px 20px rgba(0,0,0,0.08);\n    }\n\n    body {\n      font-family: \'Heebo\', sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      line-height: 1.6;\n      -webkit-font-smoothing: antialiased;\n    }\n\n    /* ===== HEADER ===== */\n    .an-site-header {\n      background: var(--white);\n      border-bottom: 1px solid var(--border);\n      position: sticky;\n      top: 0;\n      z-index: 100;\n    }\n\n    .an-header-inner {\n      max-width: 1200px;\n      margin: 0 auto;\n      padding: 0 24px;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      height: 60px;\n    }\n\n    .an-logo {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      text-decoration: none;\n      color: var(--primary);\n      font-weight: 700;\n      font-size: 20px;\n    }\n\n    .an-logo-icon {\n      width: 36px;\n      height: 36px;\n      background: var(--primary);\n      border-radius: 8px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      font-size: 14px;\n      font-weight: 800;\n      letter-spacing: -0.5px;\n    }\n\n    .an-header-actions {\n      display: flex;\n      align-items: center;\n      gap: 20px;\n    }\n\n    .an-header-search {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      background: var(--bg);\n      border: 1px solid var(--border);\n      border-radius: 8px;\n      padding: 8px 14px;\n      width: 320px;\n      color: var(--text-muted);\n      font-size: 14px;\n    }\n\n    .an-header-search svg {\n      flex-shrink: 0;\n    }\n\n    .an-header-icons {\n      display: flex;\n      align-items: center;\n      gap: 16px;\n    }\n\n    .an-header-icon {\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: transparent;\n      border: none;\n      cursor: pointer;\n      color: var(--text-secondary);\n      transition: background 0.2s;\n      position: relative;\n    }\n\n    .an-header-icon:hover {\n      background: var(--bg);\n    }\n\n    .an-cart-badge {\n      position: absolute;\n      top: 4px;\n      left: 4px;\n      width: 18px;\n      height: 18px;\n      border-radius: 50%;\n      background: var(--primary);\n      color: white;\n      font-size: 11px;\n      font-weight: 700;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    /* ===== BREADCRUMB ===== */\n    .an-breadcrumb-bar {\n      background: var(--white);\n      border-bottom: 1px solid var(--border-light);\n    }\n\n    .an-breadcrumb {\n      max-width: 1200px;\n      margin: 0 auto;\n      padding: 12px 24px;\n      font-size: 13px;\n      color: var(--text-muted);\n      display: flex;\n      align-items: center;\n      gap: 6px;\n      flex-wrap: wrap;\n    }\n\n    .an-breadcrumb a {\n      color: var(--text-secondary);\n      text-decoration: none;\n      transition: color 0.2s;\n    }\n\n    .an-breadcrumb a:hover {\n      color: var(--primary);\n    }\n\n    .an-breadcrumb .sep {\n      color: var(--border);\n    }\n\n    .an-breadcrumb .an-current {\n      color: var(--text);\n      font-weight: 500;\n    }\n\n    /* ===== MAIN CONTAINER ===== */\n    .an-container {\n      max-width: 1200px;\n      margin: 0 auto;\n      padding: 24px;\n    }\n\n    /* ===== PRODUCT TOP SECTION ===== */\n    .an-product-layout {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 32px;\n      margin-bottom: 24px;\n    }\n\n    /* Image Area */\n    .an-image-section {\n      background: var(--white);\n      border-radius: var(--radius);\n      box-shadow: var(--shadow);\n      padding: 24px;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    }\n\n    .an-main-image {\n      width: 100%;\n      max-width: 400px;\n      aspect-ratio: 1;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-bottom: 16px;\n    }\n\n    .an-main-image svg {\n      width: 100%;\n      height: 100%;\n    }\n\n    .an-thumb-row {\n      display: flex;\n      gap: 10px;\n      justify-content: center;\n    }\n\n    .an-thumb {\n      width: 64px;\n      height: 64px;\n      border-radius: 8px;\n      border: 2px solid var(--border);\n      background: var(--bg);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n      transition: border-color 0.2s;\n      overflow: hidden;\n    }\n\n    .an-thumb.an-active {\n      border-color: var(--brand-red);\n    }\n\n    .an-thumb:hover {\n      border-color: var(--brand-red);\n    }\n\n    .an-thumb-ph {\n      font-size: 8px;\n      color: var(--text-muted);\n      font-weight: 600;\n      text-align: center;\n      line-height: 1.2;\n    }\n\n    /* Info Area */\n    .product-info {\n      display: flex;\n      flex-direction: column;\n      gap: 16px;\n    }\n\n    .an-sku-brand-row {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      flex-wrap: wrap;\n    }\n\n    .an-sku-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      background: var(--bg);\n      border: 1px solid var(--border);\n      border-radius: 6px;\n      padding: 5px 12px;\n      font-size: 13px;\n      color: var(--text-secondary);\n      font-weight: 500;\n    }\n\n    .an-brand-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      background: var(--brand-red);\n      border-radius: 6px;\n      padding: 5px 14px;\n      font-size: 13px;\n      color: white;\n      font-weight: 700;\n      letter-spacing: 0.5px;\n    }\n\n    .an-product-title {\n      font-size: 26px;\n      font-weight: 700;\n      color: var(--text);\n      line-height: 1.3;\n    }\n\n    .an-product-subtitle {\n      font-size: 15px;\n      color: var(--text-muted);\n      margin-top: -8px;\n    }\n\n    .stock-status {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      font-size: 14px;\n      font-weight: 500;\n      color: var(--green);\n    }\n\n    .an-stock-dot {\n      width: 10px;\n      height: 10px;\n      border-radius: 50%;\n      background: var(--green);\n      display: inline-block;\n      animation: pulse-dot 2s infinite;\n    }\n\n    @keyframes pulse-dot {\n      0%, 100% { opacity: 1; }\n      50% { opacity: 0.5; }\n    }\n\n    .an-price-row {\n      display: flex;\n      align-items: baseline;\n      gap: 10px;\n    }\n\n    .an-price-amount {\n      font-size: 34px;\n      font-weight: 800;\n      color: var(--text);\n    }\n\n    .an-price-vat {\n      font-size: 13px;\n      color: var(--text-muted);\n      font-weight: 400;\n    }\n\n    .an-cart-row {\n      display: flex;\n      flex-direction: column;\n      gap: 10px;\n    }\n\n    .an-cart-row .an-qty-selector {\n      align-self: flex-start;\n    }\n\n    .an-qty-selector {\n      display: flex;\n      align-items: center;\n      border: 1px solid var(--border);\n      border-radius: var(--radius-sm);\n      overflow: hidden;\n      background: var(--white);\n    }\n\n    .an-qty-btn {\n      width: 40px;\n      height: 44px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: var(--bg);\n      border: none;\n      cursor: pointer;\n      font-size: 18px;\n      color: var(--text-secondary);\n      font-weight: 600;\n      transition: background 0.2s;\n    }\n\n    .an-qty-btn:hover {\n      background: var(--border);\n    }\n\n    .an-qty-input {\n      width: 44px;\n      height: 44px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 16px;\n      font-weight: 600;\n      border-left: 1px solid var(--border);\n      border-right: 1px solid var(--border);\n    }\n\n    .an-add-to-cart-btn {\n      flex: 1;\n      height: 54px;\n      background: var(--primary);\n      color: white;\n      border: none;\n      border-radius: var(--radius-sm);\n      font-family: \'Heebo\', sans-serif;\n      font-size: 18px;\n      font-weight: 700;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      gap: 10px;\n      transition: background 0.2s, transform 0.1s;\n      letter-spacing: 0.3px;\n      box-shadow: 0 4px 14px rgba(27, 78, 145, 0.35);\n    }\n\n    .an-add-to-cart-btn:hover {\n      background: var(--primary-dark);\n    }\n\n    .an-add-to-cart-btn:active {\n      transform: scale(0.98);\n    }\n\n    .an-seller-note {\n      font-size: 13px;\n      color: var(--text-muted);\n    }\n\n    .an-seller-note strong {\n      color: var(--text-secondary);\n      font-weight: 600;\n    }\n\n    .an-trust-box {\n      background: #f9fafb;\n      border: 1px solid var(--border-light);\n      border-radius: var(--radius-sm);\n      padding: 16px 20px;\n      display: flex;\n      flex-direction: column;\n      gap: 10px;\n    }\n\n    .an-trust-item {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      font-size: 13.5px;\n      color: var(--text-secondary);\n      line-height: 1.4;\n    }\n\n    .an-trust-item .icon {\n      font-size: 17px;\n      width: 24px;\n      text-align: center;\n      flex-shrink: 0;\n    }\n\n    /* ===== SECTIONS (Cards) ===== */\n    .an-section-card {\n      background: var(--white);\n      border-radius: var(--radius);\n      box-shadow: var(--shadow);\n      margin-bottom: 20px;\n      overflow: hidden;\n    }\n\n    .an-section-header {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 18px 24px;\n      cursor: pointer;\n      user-select: none;\n      transition: background 0.2s;\n    }\n\n    .an-section-header:hover {\n      background: #fafbfc;\n    }\n\n    .an-section-header h2 {\n      font-size: 18px;\n      font-weight: 700;\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n    .an-chevron {\n      width: 24px;\n      height: 24px;\n      transition: transform 0.3s ease;\n      color: var(--text-muted);\n    }\n\n    .an-section-header.an-collapsed .an-chevron {\n      transform: rotate(180deg);\n    }\n\n    .an-section-body {\n      padding: 0 24px 24px;\n    }\n\n    .an-section-body.an-collapsed {\n      display: none;\n    }\n\n    /* ===== HIGHLIGHTS ===== */\n    .an-highlights-list {\n      list-style: none;\n      display: flex;\n      flex-direction: column;\n      gap: 12px;\n    }\n\n    .an-highlights-list li {\n      display: flex;\n      align-items: flex-start;\n      gap: 10px;\n      font-size: 15px;\n      color: var(--text-secondary);\n      line-height: 1.5;\n    }\n\n    .an-highlights-list li::before {\n      content: "✓";\n      color: var(--green);\n      font-weight: 700;\n      font-size: 14px;\n      margin-top: 2px;\n      flex-shrink: 0;\n    }\n\n    /* ===== DESCRIPTION ===== */\n    .an-description-text {\n      font-size: 15px;\n      color: var(--text-secondary);\n      line-height: 1.8;\n    }\n\n    /* ===== TECDOC SECTION ===== */\n    .tecdoc-attribution {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      padding: 14px 24px 0;\n      font-size: 12px;\n      color: var(--text-muted);\n    }\n\n    .tecdoc-dot {\n      width: 6px;\n      height: 6px;\n      border-radius: 50%;\n      background: var(--primary);\n      opacity: 0.5;\n      flex-shrink: 0;\n    }\n\n    /* ===== TABS ===== */\n    .an-tabs {\n      display: flex;\n      border-bottom: 2px solid var(--border-light);\n      padding: 0 24px;\n      margin-top: 12px;\n      gap: 0;\n      overflow-x: auto;\n      -webkit-overflow-scrolling: touch;\n    }\n\n    .an-tab {\n      padding: 12px 20px;\n      font-size: 14px;\n      font-weight: 500;\n      color: var(--text-muted);\n      border-bottom: 3px solid transparent;\n      margin-bottom: -2px;\n      cursor: pointer;\n      transition: all 0.2s;\n      white-space: nowrap;\n      user-select: none;\n    }\n\n    .an-tab:hover {\n      color: var(--text);\n    }\n\n    .an-tab.an-active {\n      color: var(--primary);\n      border-bottom-color: var(--primary);\n      font-weight: 600;\n    }\n\n    .an-tab .an-count {\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      min-width: 22px;\n      height: 20px;\n      border-radius: 10px;\n      background: var(--bg);\n      font-size: 11px;\n      font-weight: 600;\n      color: var(--text-muted);\n      padding: 0 6px;\n      margin-right: 4px;\n    }\n\n    .an-tab.an-active .an-count {\n      background: #e8eef6;\n      color: var(--primary);\n    }\n\n    /* ===== TAB PANELS ===== */\n    .an-tab-panel {\n      display: none;\n      padding: 20px 24px 24px;\n    }\n\n    .an-tab-panel.an-active {\n      display: block;\n    }\n\n    /* ===== SPECS TABLE ===== */\n    .an-specs-table {\n      width: 100%;\n      border-collapse: collapse;\n    }\n\n    .an-specs-table tr:nth-child(even) {\n      background: #fafbfc;\n    }\n\n    .an-specs-table td {\n      padding: 12px 16px;\n      font-size: 14px;\n      border-bottom: 1px solid var(--border-light);\n    }\n\n    .an-specs-table td:first-child {\n      font-weight: 600;\n      color: var(--text);\n      width: 40%;\n    }\n\n    .an-specs-table td:last-child {\n      color: var(--text-secondary);\n    }\n\n    /* ===== VEHICLE TABLE ===== */\n    .vehicle-table {\n      width: 100%;\n      border-collapse: collapse;\n    }\n\n    .vehicle-table thead {\n      background: #fafbfc;\n    }\n\n    .vehicle-table th {\n      padding: 12px 16px;\n      font-size: 12px;\n      font-weight: 600;\n      color: var(--text-muted);\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n      text-align: right;\n      border-bottom: 1px solid var(--border);\n    }\n\n    .vehicle-table td {\n      padding: 12px 16px;\n      font-size: 14px;\n      color: var(--text-secondary);\n      border-bottom: 1px solid var(--border-light);\n    }\n\n    .vehicle-table tr:hover {\n      background: #f8f9fb;\n    }\n\n    .vehicle-make {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n    }\n\n    .make-logo {\n      width: 28px;\n      height: 28px;\n      border-radius: 4px;\n      background: var(--bg);\n      border: 1px solid var(--border);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 9px;\n      font-weight: 700;\n      color: var(--text-muted);\n      flex-shrink: 0;\n    }\n\n    .vehicle-table tr.an-hidden-row {\n      display: none;\n    }\n\n    .show-more-btn {\n      display: block;\n      width: 100%;\n      margin-top: 16px;\n      padding: 12px;\n      border: 1px dashed var(--border);\n      border-radius: var(--radius-sm);\n      background: transparent;\n      color: var(--primary);\n      font-family: \'Heebo\', sans-serif;\n      font-size: 14px;\n      font-weight: 600;\n      cursor: pointer;\n      text-align: center;\n      transition: background 0.2s, border-color 0.2s;\n    }\n\n    .show-more-btn:hover {\n      background: #eef3fb;\n      border-color: var(--primary);\n    }\n\n    .show-more-btn.hidden {\n      display: none;\n    }\n\n    /* ===== OE NUMBERS GRID ===== */\n    .an-oe-grid {\n      display: flex;\n      flex-wrap: wrap;\n      gap: 8px;\n    }\n\n    .an-oe-chip {\n      display: inline-flex;\n      align-items: center;\n      background: #eef3fb;\n      border: 1px solid #c8d8f0;\n      border-radius: 6px;\n      padding: 6px 14px;\n      font-size: 13px;\n      font-weight: 600;\n      color: var(--primary);\n      font-family: \'Courier New\', monospace;\n      letter-spacing: 0.3px;\n      transition: background 0.15s;\n    }\n\n    .an-oe-chip:hover {\n      background: #ddeafa;\n    }\n\n    /* ===== BRAND CARD ===== */\n    .an-brand-card {\n      display: flex;\n      align-items: stretch;\n      overflow: hidden;\n    }\n\n    .an-brand-sidebar {\n      width: 100px;\n      min-height: 120px;\n      background: var(--brand-red);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex-shrink: 0;\n    }\n\n    .an-brand-sidebar span {\n      color: white;\n      font-size: 18px;\n      font-weight: 800;\n      letter-spacing: 1px;\n      writing-mode: horizontal-tb;\n    }\n\n    .an-brand-card-info {\n      padding: 20px 24px;\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n    }\n\n    .an-brand-card-info h3 {\n      font-size: 18px;\n      font-weight: 700;\n      color: var(--text);\n    }\n\n    .an-brand-card-info .an-brand-origin {\n      font-size: 13px;\n      color: var(--text-muted);\n      display: flex;\n      align-items: center;\n      gap: 6px;\n    }\n\n    .an-brand-card-info .an-brand-origin::before {\n      content: "🇮🇹";\n      font-size: 16px;\n    }\n\n    .an-brand-card-info p {\n      font-size: 14px;\n      color: var(--text-secondary);\n      line-height: 1.7;\n      margin-top: 4px;\n    }\n\n    /* ===== FOOTER ===== */\n    .site-footer {\n      text-align: center;\n      padding: 32px 24px;\n      font-size: 12px;\n      color: var(--text-muted);\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n    }\n\n    .site-footer .perplexity {\n      color: var(--text-muted);\n      opacity: 0.7;\n    }\n\n    /* ===== RESPONSIVE ===== */\n    @media (max-width: 768px) {\n      .an-header-search {\n        display: none;\n      }\n\n      .an-product-layout {\n        grid-template-columns: 1fr;\n        gap: 20px;\n      }\n\n      .an-product-title {\n        font-size: 22px;\n      }\n\n      .an-price-amount {\n        font-size: 28px;\n      }\n\n      .an-cart-row {\n        flex-direction: column;\n      }\n\n      .an-cart-row .an-qty-selector {\n        align-self: stretch;\n        justify-content: center;\n      }\n\n      .an-qty-selector {\n        width: 100%;\n        justify-content: center;\n      }\n\n      .an-qty-btn {\n        flex: 1;\n      }\n\n      .an-qty-input {\n        flex: 1;\n      }\n\n      .an-add-to-cart-btn {\n        width: 100%;\n      }\n\n      .an-brand-card {\n        flex-direction: column;\n      }\n\n      .an-brand-sidebar {\n        width: 100%;\n        min-height: 60px;\n      }\n\n      .an-tabs {\n        padding: 0 16px;\n      }\n\n      .an-tab {\n        padding: 12px 14px;\n        font-size: 13px;\n      }\n\n      .an-container {\n        padding: 16px;\n      }\n\n      .an-section-body {\n        padding: 0 16px 16px;\n      }\n\n      .an-tab-panel {\n        padding: 16px 16px 20px;\n      }\n\n      .an-section-header {\n        padding: 16px;\n      }\n\n      .vehicle-table {\n        font-size: 13px;\n      }\n\n      .vehicle-table th,\n      .vehicle-table td {\n        padding: 10px 10px;\n      }\n\n      .tecdoc-attribution {\n        padding: 14px 16px 0;\n      }\n    }\n\n    @media (max-width: 480px) {\n      .an-header-inner {\n        padding: 0 16px;\n      }\n\n      .an-breadcrumb {\n        padding: 10px 16px;\n        font-size: 12px;\n      }\n\n      .an-trust-item {\n        font-size: 13px;\n      }\n\n      .an-oe-chip {\n        font-size: 12px;\n        padding: 5px 10px;\n      }\n    }\n  \n    /* Vehicle Groups Accordion */\n    .an-veh-groups { display:flex; flex-direction:column; gap:2px; }\n    .an-veh-group { border:1px solid #e4e6eb; border-radius:10px; overflow:hidden; }\n    .an-veh-group-header { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; cursor:pointer; background:#fff; transition:background 0.15s; }\n    .an-veh-group-header:hover { background:#f7f8fa; }\n    .an-veh-make-info { display:flex; align-items:center; gap:12px; }\n    .an-veh-make-logo { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; letter-spacing:0.5px; flex-shrink:0; }\n    .an-veh-make-name { font-size:16px; font-weight:700; color:#1a1a2e; }\n    .an-veh-make-count { font-size:13px; color:#8a8a9a; font-weight:400; }\n    .an-veh-chevron { transition:transform 0.3s; flex-shrink:0; color:#8a8a9a; }\n    .an-veh-group.an-open .an-veh-chevron { transform:rotate(180deg); }\n    .an-veh-group-models { background:#fafbfc; border-top:1px solid #e4e6eb; }\n    .veh-model-table { width:100%; border-collapse:collapse; }\n    .veh-model-table td { padding:10px 18px; font-size:14px; color:#333; border-bottom:1px solid #f0f1f4; }\n    .veh-model-table tr:last-child td { border-bottom:none; }\n    .veh-model { font-weight:600; }\n    .veh-engine { color:#5a5a6e; }\n    .veh-years { color:#8a8a9a; direction:ltr; text-align:left; }\n    @media (max-width: 768px) {\n      .an-veh-group-header { padding:12px 14px; }\n      .an-veh-make-logo { width:32px; height:32px; font-size:11px; }\n      .an-veh-make-name { font-size:14px; }\n      .veh-model-table td { padding:8px 14px; font-size:13px; }\n    }\n\n  \n    /* Model rows inside manufacturer group */\n    .an-veh-model-item { border-bottom:1px solid #f0f1f4; }\n    .an-veh-model-item:last-child { border-bottom:none; }\n    .an-veh-model-row { display:flex; align-items:center; justify-content:space-between; padding:11px 20px 11px 18px; cursor:pointer; transition:background 0.12s; gap:8px; }\n    .an-veh-model-row:hover { background:#f0f4ff; }\n    .an-veh-model-name { font-size:14px; font-weight:600; color:#1a1a2e; flex:1; }\n    .an-veh-model-years { font-size:13px; color:#8a8a9a; direction:ltr; margin-left:12px; flex-shrink:0; }\n    .an-veh-model-chev { transition:transform 0.25s; flex-shrink:0; color:#b0b0b0; }\n    .an-veh-model-item.an-open .an-veh-model-chev { transform:rotate(180deg); }\n    /* Engine sub-rows */\n    .an-veh-engines { background:#f5f7fa; padding:0 20px 0 18px; }\n    .an-veh-engine-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0 8px 28px; font-size:13px; color:#5a5a6e; border-top:1px solid #ebedf2; }\n    .an-veh-engine-row:first-child { border-top:none; }\n    .an-veh-eng-years { font-size:12px; color:#a0a0a0; direction:ltr; }\n    @media (max-width:768px) {\n      .an-veh-model-row { padding:10px 14px; }\n      .an-veh-model-name { font-size:13px; }\n      .an-veh-engine-row { padding:7px 0 7px 20px; font-size:12px; }\n    }\n\n\n\n/* Page background */\n.an-page-bg { background: #f7f8fa; padding: 8px 0 40px; }\n\n/* Ensure product layout width */\n.an-product-layout { width: 100%; }\n\n/* Highlights box styling (if missing from demo) */\n.an-highlights-box {\n  background: var(--white); border-radius: var(--radius);\n  box-shadow: var(--shadow); margin-bottom: 20px; overflow: hidden;\n}\n\n/* TecDoc widget trust box hide (duplicate) */\nbody.an-redesigned .tw-strengths,\nbody.an-redesigned #tw-brand-info { display: none !important; }\n\n/* === KONIMBO OVERRIDES (important) === */\n.an-container { max-width: 1200px !important; margin: 0 auto !important; padding: 24px !important; }\n.an-page-bg { background: #f7f8fa !important; padding: 8px 0 40px !important; }\n.an-add-to-cart-btn { width: 100% !important; height: 54px !important; flex: unset !important; }\n.an-cart-row { display: flex !important; flex-direction: column !important; gap: 10px !important; }\n.an-brand-card { background: #f9fafb !important; border-radius: 12px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important; overflow: hidden !important; }\n.an-image-section { background: #fff !important; border-radius: 12px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important; padding: 24px !important; }\n.an-info-section { display: flex !important; flex-direction: column !important; gap: 4px !important; }\n';
    document.head.appendChild(style);

    /* Load Heebo font if not already loaded */
    if (!document.querySelector('link[href*="Heebo"]')) {
      var font = document.createElement('link');
      font.rel = 'stylesheet';
      font.href = 'https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800&display=swap';
      document.head.appendChild(font);
    }
  }

  /* ===================================================
     STEP 2: Category detection
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
     STEP 3: BRAND_INFO
     =================================================== */
  var H = ['\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05d4\u05d5\u05ea\u05e7\u05df \u05d1\u05e8\u05db\u05d1 \u05d1\u05de\u05e4\u05e2\u05dc','\u05ea\u05d0\u05d9\u05de\u05d5\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea \u05dc\u05d3\u05d2\u05dd \u05e9\u05dc\u05da','\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d0\u05d9\u05db\u05d5\u05ea \u05d1\u05d9\u05e0\u05dc\u05d0\u05d5\u05de\u05d9\u05d9\u05dd','\u05dc\u05dc\u05d0 \u05e4\u05e9\u05e8\u05d5\u05ea \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05d5\u05d1\u05d4\u05ea\u05d0\u05de\u05d4'];
  var BRAND_INFO = {
    "BREMBO":{name:"Brembo",description:"\u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd. \u05d9\u05d3\u05d5\u05e2\u05d4 \u05de\u05e2\u05d5\u05dc\u05dd \u05d4\u05de\u05d9\u05e8\u05d5\u05e6\u05d9\u05dd \u2014 F1, MotoGP.",founded:"1961",country:"\u05d0\u05d9\u05d8\u05dc\u05d9\u05d4",color:"#c8102e",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90 \u05d4\u05d0\u05d9\u05e8\u05d5\u05e4\u05d9","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05d4\u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05e0\u05d1\u05d3\u05e7 \u05d1\u05ea\u05e0\u05d0\u05d9 \u05de\u05d9\u05e8\u05d5\u05e6\u05d9\u05dd \u2014 F1, MotoGP","\u05d1\u05dc\u05d9\u05de\u05d4 \u05d7\u05d6\u05e7\u05d4 \u05d2\u05dd \u05d1\u05d8\u05de\u05e4\u05e8\u05d8\u05d5\u05e8\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d5\u05ea"]},
    "BOSCH":{name:"Bosch",description:"\u05e1\u05e4\u05e7\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05e8\u05db\u05d1 \u05d2\u05d3\u05d5\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd. \u05de\u05e2\u05dc 130 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df.",founded:"1886",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#e2000f",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1 \u05de\u05d4\u05de\u05e4\u05e2\u05dc","\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 ISO/TS 16949","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05de\u05ea\u05e7\u05d3\u05de\u05d9\u05dd \u2014 \u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05e9\u05d7\u05d9\u05e7\u05d4 \u05d5\u05d1\u05dc\u05d0\u05d9","\u05de\u05d5\u05ea\u05d0\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd"]},
    "MANN-FILTER":{name:"MANN-FILTER",description:"\u05de\u05d5\u05ea\u05d2 \u05d4\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d4\u05de\u05d5\u05d1\u05d9\u05dc \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea MANN+HUMMEL.",founded:"1941",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#1a4690",
      highlights:["\u05e1\u05d9\u05e0\u05d5\u05df \u05d9\u05e2\u05d9\u05dc \u05e9\u05dc 99.98% \u05de\u05d4\u05de\u05d6\u05d4\u05de\u05d9\u05dd","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05d4\u05d2\u05e0\u05d4 \u05de\u05e4\u05e0\u05d9 \u05dc\u05db\u05dc\u05d5\u05da, \u05d0\u05d1\u05e7 \u05d5\u05e9\u05d1\u05d1\u05d9\u05dd","\u05de\u05d0\u05e8\u05d9\u05da \u05d7\u05d9\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2 \u05d5\u05de\u05e9\u05e4\u05e8 \u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd"]},
    "MAHLE":{name:"Mahle",description:"\u05e7\u05d1\u05d5\u05e6\u05ea \u05d8\u05db\u05e0\u05d5\u05dc\u05d5\u05d2\u05d9\u05d4 \u05d1\u05d9\u05e0\u05dc\u05d0\u05d5\u05de\u05d9\u05ea. \u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d5\u05e8\u05db\u05d9\u05d1\u05d9 \u05de\u05e0\u05d5\u05e2 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1920",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#005b8e",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d1\u05d3\u05d9\u05e7\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d4","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d4\u05e1\u05d1\u05d9\u05d1\u05d4 \u05d4\u05de\u05d7\u05de\u05d9\u05e8\u05d9\u05dd","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05e1\u05d5\u05d2\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2\u05d9\u05dd \u05d5\u05d4\u05d3\u05dc\u05e7"]},
    "VALEO":{name:"Valeo",description:"\u05e1\u05e4\u05e7\u05d9\u05ea OEM \u05e6\u05e8\u05e4\u05ea\u05d9\u05ea. \u05de\u05d9\u05d6\u05d5\u05d2, \u05ea\u05d0\u05d5\u05e8\u05d4, \u05de\u05e6\u05de\u05d3\u05d9\u05dd, \u05de\u05d2\u05d1\u05d9\u05dd \u05d5\u05d7\u05e9\u05de\u05dc \u05dc\u05e8\u05db\u05d1.",founded:"1923",country:"\u05e6\u05e8\u05e4\u05ea",color:"#003087"},
    "TRW":{name:"TRW",description:"\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d1\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05dc\u05e8\u05db\u05d1 \u2014 \u05d1\u05dc\u05de\u05d9\u05dd, \u05d4\u05d9\u05d2\u05d5\u05d9 \u05d5\u05de\u05ea\u05dc\u05d9\u05dd. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea ZF.",founded:"1901",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003399",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90 \u05d4\u05d0\u05d9\u05e8\u05d5\u05e4\u05d9","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea \u05dc\u05db\u05dc \u05de\u05d5\u05e6\u05e8","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd \u05e2\u05dd \u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05de\u05d5\u05d0\u05e8\u05da"]},
    "FEBI BILSTEIN":{name:"Febi Bilstein",description:"\u05d7\u05d1\u05e8\u05d4 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea \u05e2\u05dd \u05de\u05e2\u05dc 175 \u05e9\u05e0\u05d5\u05ea \u05e0\u05d9\u05e1\u05d9\u05d5\u05df. \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1844",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#e8001c"},
    "MEYLE":{name:"Meyle",description:"\u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d2\u05e8\u05de\u05e0\u05d9\u05ea. \u05d9\u05d3\u05d5\u05e2\u05d4 \u05d1\u05e7\u05d5 MEYLE-HD \u05d4\u05de\u05d7\u05d5\u05d6\u05e7.",founded:"1958",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#0057a8",
      highlights:["\u05e7\u05d5 MEYLE-HD \u2014 \u05d7\u05dc\u05e7\u05d9\u05dd \u05de\u05d7\u05d5\u05d6\u05e7\u05d9\u05dd \u05de\u05e2\u05d1\u05e8 \u05dc\u05de\u05e7\u05d5\u05e8","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u05d5\u05de\u05e2\u05dc\u05d4 \u2014 \u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05de\u05d5\u05d2\u05d1\u05e8\u05ea","\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05de\u05d7\u05de\u05d9\u05e8\u05d5\u05ea \u05dc\u05db\u05dc \u05d7\u05dc\u05e7","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9 \u05d3\u05e8\u05d9\u05e9\u05d4 \u05d0\u05d9\u05e8\u05d5\u05e4\u05d9\u05d9\u05dd"]},
    "SKF":{name:"SKF",description:"\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d1\u05de\u05d9\u05e1\u05d1\u05d9\u05dd \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05e1\u05d9\u05d1\u05d5\u05d1 \u05dc\u05e8\u05db\u05d1.",founded:"1907",country:"\u05e9\u05d5\u05d5\u05d3\u05d9\u05d4",color:"#003087"},
    "NGK":{name:"NGK",description:"\u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05d4\u05de\u05e6\u05ea\u05d9\u05dd \u05d4\u05d2\u05d3\u05d5\u05dc\u05d4 \u05d1\u05e2\u05d5\u05dc\u05dd. \u05e1\u05e4\u05e7\u05d9\u05ea OEM \u05dc\u05db\u05dc \u05d9\u05e6\u05e8\u05e0\u05d9\u05d5\u05ea \u05d4\u05e8\u05db\u05d1.",founded:"1936",country:"\u05d9\u05e4\u05df",color:"#cc0000",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05e2\u05de\u05d9\u05d3\u05d5\u05ea \u05d1\u05d8\u05de\u05e4\u05e8\u05d8\u05d5\u05e8\u05d5\u05ea \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d5\u05ea","\u05d4\u05e6\u05ea\u05d4 \u05d9\u05e6\u05d9\u05d1\u05d4 \u05d5\u05d7\u05d9\u05e1\u05db\u05d5\u05df \u05d1\u05d3\u05dc\u05e7","\u05de\u05ea\u05d0\u05d9\u05de\u05d9\u05dd \u05dc\u05db\u05dc \u05e1\u05d5\u05d2\u05d9 \u05d4\u05de\u05e0\u05d5\u05e2\u05d9\u05dd"]},
    "DENSO":{name:"Denso",description:"\u05e1\u05e4\u05e7\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05d9\u05e4\u05e0\u05d9\u05ea, \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea Toyota.",founded:"1949",country:"\u05d9\u05e4\u05df",color:"#003087"},
    "SACHS":{name:"Sachs",description:"\u05de\u05d5\u05ea\u05d2 \u05d1\u05d5\u05dc\u05de\u05d9 \u05d6\u05e2\u05d6\u05d5\u05e2\u05d9\u05dd \u05d5\u05de\u05e6\u05de\u05d3. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea ZF.",founded:"1894",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#cc0000"},
    "LUK":{name:"LuK",description:"\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05de\u05e6\u05de\u05d3 \u05d5\u05d4\u05e0\u05e2\u05d4. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea Schaeffler.",founded:"1965",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#e2000f"},
    "INA":{name:"INA",description:"\u05de\u05d9\u05e1\u05d1\u05d9\u05dd, \u05e2\u05e8\u05db\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2, \u05de\u05d5\u05ea\u05d7\u05e0\u05d9\u05dd \u05d5\u05d2\u05dc\u05d2\u05dc\u05d5\u05ea. \u05d7\u05dc\u05e7 Schaeffler.",founded:"1946",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#e2000f"},
    "CONTINENTAL":{name:"Continental",description:"\u05e8\u05e6\u05d5\u05e2\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2, \u05e6\u05d9\u05e0\u05d5\u05e8\u05d5\u05ea, \u05d7\u05d9\u05d9\u05e9\u05e0\u05d9\u05dd \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05dc\u05e8\u05db\u05d1.",founded:"1871",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#ffa500"},
    "GATES":{name:"Gates",description:"\u05e8\u05e6\u05d5\u05e2\u05d5\u05ea, \u05e6\u05d9\u05e0\u05d5\u05e8\u05d5\u05ea \u05d5\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d4\u05e0\u05e2\u05d4 \u05dc\u05e8\u05db\u05d1.",founded:"1911",country:"\u05d0\u05e8\u05d4\"\u05d1",color:"#003087"},
    "HENGST":{name:"Hengst",description:"\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9\u05dd \u05d2\u05e8\u05de\u05e0\u05d9\u05dd \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1958",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003087"},
    "DAYCO":{name:"Dayco",description:"\u05e8\u05e6\u05d5\u05e2\u05d5\u05ea \u05d8\u05d9\u05d9\u05de\u05d9\u05e0\u05d2, \u05d2\u05dc\u05d2\u05dc\u05d5\u05ea, \u05de\u05d5\u05ea\u05d7\u05e0\u05d9\u05dd \u05d5\u05de\u05e9\u05d0\u05d1\u05d5\u05ea \u05de\u05d9\u05dd.",founded:"1905",country:"\u05d0\u05e8\u05d4\"\u05d1",color:"#cc0000"},
    "LEMFORDER":{name:"Lemf\u00f6rder",description:"\u05e8\u05db\u05d9\u05d1\u05d9 \u05d4\u05ea\u05dc\u05d9\u05d9\u05d4 \u05d5\u05d4\u05d9\u05d2\u05d5\u05d9. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea ZF.",founded:"1947",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003087"},
    "TEXTAR":{name:"Textar",description:"\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05de\u05d5\u05d1\u05d9\u05dc\u05d5\u05ea \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4. \u05d7\u05dc\u05e7 \u05de\u05e7\u05d1\u05d5\u05e6\u05ea TMD Friction.",founded:"1913",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#cc0000",
      highlights:["\u05e2\u05de\u05d9\u05d3\u05d4 \u05d1\u05ea\u05e7\u05df ECE R90 \u05d4\u05d0\u05d9\u05e8\u05d5\u05e4\u05d9","\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1","\u05dc\u05dc\u05d0 \u05d0\u05e1\u05d1\u05e1\u05d8 \u2014 \u05d1\u05dc\u05d9\u05de\u05d4 \u05e9\u05e7\u05d8\u05d4 \u05dc\u05dc\u05d0 \u05e8\u05e2\u05e9","\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd \u05e2\u05dd \u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05de\u05d5\u05d0\u05e8\u05da"]},
    "ATE":{name:"ATE",description:"\u05d3\u05d9\u05e1\u05e7\u05d9 \u05d1\u05dc\u05dd, \u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d5\u05e0\u05d5\u05d6\u05dc\u05d9 \u05d1\u05dc\u05de\u05d9\u05dd. \u05d7\u05dc\u05e7 Continental.",founded:"1906",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#ffa500"},
    "KNECHT":{name:"Knecht",description:"\u05e4\u05d9\u05dc\u05d8\u05e8\u05d9 Mahle \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1927",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#005b8e"},
    "NIPPARTS":{name:"Nipparts",description:"\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd.",founded:"1975",country:"\u05d4\u05d5\u05dc\u05e0\u05d3",color:"#cc0000"},
    "BLUE PRINT":{name:"Blue Print",description:"\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05e1\u05d9\u05d9\u05ea\u05d9\u05d9\u05dd \u05d5\u05d0\u05de\u05e8\u05d9\u05e7\u05d0\u05d9\u05d9\u05dd.",founded:"1997",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003087"},
    "MOTUL":{name:"Motul",description:"\u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05d9\u05dd \u05de\u05ea\u05e7\u05d3\u05de\u05d9\u05dd. \u05d9\u05d3\u05d5\u05e2 \u05de\u05e2\u05d5\u05dc\u05dd \u05d4\u05de\u05d9\u05e8\u05d5\u05e6\u05d9\u05dd.",founded:"1853",country:"\u05e6\u05e8\u05e4\u05ea",color:"#cc0000"},
    "CASTROL":{name:"Castrol",description:"\u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 \u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd. \u05d7\u05dc\u05e7 BP.",founded:"1899",country:"\u05d1\u05e8\u05d9\u05d8\u05e0\u05d9\u05d4",color:"#009900"},
    "LIQUI MOLY":{name:"Liqui Moly",description:"\u05e9\u05de\u05e0\u05d9\u05dd \u05d5\u05ea\u05d5\u05e1\u05e4\u05d9 \u05d3\u05dc\u05e7 \u05d2\u05e8\u05de\u05e0\u05d9\u05d9\u05dd \u05d1\u05d0\u05d9\u05db\u05d5\u05ea \u05d2\u05d1\u05d5\u05d4\u05d4.",founded:"1957",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#cc0000"},
    "MOBIL":{name:"Mobil",description:"\u05e9\u05de\u05e0\u05d9 \u05de\u05e0\u05d5\u05e2 ExxonMobil. \u05e1\u05d3\u05e8\u05ea Mobil 1 \u05d4\u05e1\u05d9\u05e0\u05ea\u05d8\u05d9\u05ea.",founded:"1911",country:"\u05d0\u05e8\u05d4\"\u05d1",color:"#cc0000"},
    "OSRAM":{name:"Osram",description:"\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05e2\u05d5\u05dc\u05de\u05d9\u05ea \u05d1\u05ea\u05d0\u05d5\u05e8\u05d4 \u05dc\u05e8\u05db\u05d1.",founded:"1919",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#ffa500"},
    "PHILIPS":{name:"Philips",description:"\u05ea\u05d0\u05d5\u05e8\u05d4 \u05dc\u05e8\u05db\u05d1 \u2014 \u05d4\u05dc\u05d5\u05d2\u05df, LED \u05d5\u05e7\u05e1\u05e0\u05d5\u05df.",founded:"1891",country:"\u05d4\u05d5\u05dc\u05e0\u05d3",color:"#0096d6"},
    "SWAG":{name:"Swag",description:"\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05e9\u05dc Bilstein Group.",founded:"1954",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003087"},
    "TOPRAN":{name:"Topran",description:"\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05dc\u05e8\u05db\u05d1\u05d9\u05dd \u05d0\u05d9\u05e8\u05d5\u05e4\u05d0\u05d9\u05d9\u05dd.",founded:"1996",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#003087"},
    "RIDEX":{name:"Ridex",description:"\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3 \u05d1\u05de\u05d7\u05d9\u05e8 \u05ea\u05d7\u05e8\u05d5\u05ea\u05d9.",founded:"",country:"",color:"#003087"},
    "HI-Q":{name:"Hi-Q",description:"\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05e9\u05dc Sangsin Brake \u05d4\u05e7\u05d5\u05e8\u05d0\u05d9\u05ea.",founded:"1975",country:"\u05e7\u05d5\u05e8\u05d0\u05d4",color:"#e2000f"},
    "ICER":{name:"Icer",description:"\u05e8\u05e4\u05d9\u05d3\u05d5\u05ea \u05d1\u05dc\u05dd \u05e1\u05e4\u05e8\u05d3\u05d9\u05d5\u05ea \u05d1\u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1963",country:"\u05e1\u05e4\u05e8\u05d3",color:"#003087"},
    "SANGSIN":{name:"Sangsin Brake",description:"\u05de\u05e2\u05e8\u05db\u05d5\u05ea \u05d1\u05dc\u05d9\u05de\u05d4 \u05e7\u05d5\u05e8\u05d0\u05d9\u05d5\u05ea. \u05e1\u05e4\u05e7\u05d9\u05ea OEM \u05dc\u05d9\u05d5\u05e0\u05d3\u05d0\u05d9/\u05e7\u05d9\u05d4.",founded:"1975",country:"\u05e7\u05d5\u05e8\u05d0\u05d4",color:"#cc0000"},
    "MONTECCHIO":{name:"Montecchio",description:"\u05d0\u05d4\u05e8\u05d5\u05df \u05de\u05d5\u05e0\u05d8\u05e7\u05d9\u05d5 \u05d1\u05e2\"\u05de \u2014 \u05d4\u05d7\u05d1\u05e8\u05d4 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05e9\u05d5\u05e7 \u05d7\u05dc\u05e7\u05d9 \u05d4\u05d7\u05d9\u05dc\u05d5\u05e3 \u05d1\u05d9\u05e9\u05e8\u05d0\u05dc \u05de\u05d0\u05d6 1947.",founded:"1947",country:"\u05d9\u05e9\u05e8\u05d0\u05dc",color:"#1a3c6e"},
    "TOYOTA":{name:"\u05d8\u05d5\u05d9\u05d5\u05d8\u05d4 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc \u05d8\u05d5\u05d9\u05d5\u05d8\u05d4/\u05dc\u05e7\u05e1\u05d5\u05e1.",founded:"",country:"\u05d9\u05e4\u05df",color:"#eb0a1e",highlights:H},
    "HYUNDAI":{name:"\u05d9\u05d5\u05e0\u05d3\u05d0\u05d9/\u05e7\u05d9\u05d4 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc \u05e7\u05d1\u05d5\u05e6\u05ea \u05d9\u05d5\u05e0\u05d3\u05d0\u05d9-\u05e7\u05d9\u05d4.",founded:"",country:"\u05d3\u05e8\u05d5\u05dd \u05e7\u05d5\u05e8\u05d0\u05d4",color:"#002c5f",highlights:H},
    "RENAULT":{name:"\u05e8\u05e0\u05d5 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc \u05e8\u05e0\u05d5.",founded:"",country:"\u05e6\u05e8\u05e4\u05ea",color:"#ffcc00",highlights:H},
    "PSA":{name:"\u05e4\u05d9\u05d6'\u05d5/\u05e1\u05d9\u05d8\u05e8\u05d5\u05d0\u05df \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc Stellantis.",founded:"",country:"\u05e6\u05e8\u05e4\u05ea",color:"#1f3c88",highlights:H},
    "MERCEDES":{name:"\u05de\u05e8\u05e6\u05d3\u05e1-\u05d1\u05e0\u05e5 \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc Mercedes-Benz.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#333333",highlights:H},
    "BMW":{name:"BMW \u05de\u05e7\u05d5\u05e8\u05d9",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc BMW.",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#1c69d4",highlights:H},
    "VAG ORIGINAL":{name:"VAG Original",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc VAG (VW, Audi, Skoda, Seat).",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#001e50",highlights:H},
    "VAG":{name:"VAG Original",description:"\u05d7\u05dc\u05e7 \u05de\u05e7\u05d5\u05e8\u05d9 \u05e9\u05dc VAG (VW, Audi, Skoda, Seat).",founded:"",country:"\u05d2\u05e8\u05de\u05e0\u05d9\u05d4",color:"#001e50",highlights:H},
    "AYD":{name:"AYD",description:"\u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9 \u05d4\u05d9\u05d2\u05d5\u05d9, \u05d4\u05ea\u05dc\u05d9\u05d9\u05d4 \u05d5\u05d1\u05dc\u05d9\u05de\u05d4 \u05de\u05d8\u05d5\u05e8\u05e7\u05d9\u05d4. \u05d0\u05d9\u05db\u05d5\u05ea OEM.",founded:"1975",country:"\u05d8\u05d5\u05e8\u05e7\u05d9\u05d4",color:"#0054a6",
      highlights:["\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05e1\u05e4\u05e7 OEM \u05dc\u05d9\u05e6\u05e8\u05e0\u05d9 \u05e8\u05db\u05d1 \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4, \u05d0\u05e1\u05d9\u05d4 \u05d5\u05d0\u05de\u05e8\u05d9\u05e7\u05d4","\u05ea\u05e7\u05df ISO \u2014 \u05d1\u05e7\u05e8\u05ea \u05d0\u05d9\u05db\u05d5\u05ea \u05d1\u05db\u05dc \u05e9\u05dc\u05d1","\u05d9\u05d9\u05e6\u05d5\u05e8 \u05de\u05ea\u05e7\u05d3\u05dd \u05d1\u05de\u05e4\u05e2\u05dc \u05d0\u05d7\u05d3","\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05ea\u05e0\u05d0\u05d9 \u05de\u05d6\u05d2 \u05d0\u05d5\u05d5\u05d9\u05e8 \u05d5\u05db\u05d1\u05d9\u05e9 \u05e7\u05d9\u05e6\u05d5\u05e0\u05d9\u05d9\u05dd"]},
    "TEKNOROT":{name:"Teknorot",description:"\u05d9\u05e6\u05e8\u05e0\u05d9\u05ea \u05e8\u05db\u05d9\u05d1\u05d9 \u05d4\u05d9\u05d2\u05d5\u05d9 \u05d5\u05d4\u05ea\u05dc\u05d9\u05d9\u05d4 \u05de\u05d5\u05d1\u05d9\u05dc\u05d4 \u05d1\u05d0\u05d9\u05e8\u05d5\u05e4\u05d4. \u05ea\u05e7\u05df IATF 16949.",founded:"1992",country:"\u05d8\u05d5\u05e8\u05e7\u05d9\u05d4",color:"#e31e24",
      highlights:["\u05ea\u05e7\u05df IATF 16949 + ISO 9001","\u05e4\u05dc\u05d3\u05d4 \u05de\u05d7\u05d5\u05e9\u05dc\u05ea \u2014 \u05e8\u05db\u05d9\u05d1\u05d9\u05dd \u05e2\u05de\u05d9\u05d3\u05d9\u05dd \u05de\u05d1\u05d3\u05d9\u05e7\u05d5\u05ea \u05d7\u05d5\u05d6\u05e7","\u05d7\u05d5\u05de\u05e8\u05d9\u05dd \u05de\u05ea\u05e7\u05d3\u05de\u05d9\u05dd \u2014 \u05d1\u05e8\u05d6\u05dc \u05d5\u05d0\u05dc\u05d5\u05de\u05d9\u05e0\u05d9\u05d5\u05dd \u05de\u05d7\u05d5\u05e9\u05dc","\u05e2\u05d5\u05d1\u05e8 \u05de\u05d1\u05d7\u05e0\u05d9 \u05d7\u05d5\u05d6\u05e7 \u05dc\u05e4\u05e0\u05d9 \u05d4\u05ea\u05e7\u05e0\u05d4 \u05d1\u05e8\u05db\u05d1"]}
  };

  /* ===================================================
     STEP 4: Extract data from Konimbo DOM
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

  var productDescription = '';
  var descEl = document.querySelector('.item_description,#item_content,[id*="item_desc"],[class*="item_desc"]');
  if (descEl) productDescription = descEl.innerHTML || '';

  var stockText = '\u05d6\u05de\u05d9\u05df \u05d1\u05de\u05dc\u05d0\u05d9';

  /* ===================================================
     STEP 5: Brand detection
     =================================================== */
  var detectedBrand = '';
  var titleUpper = productTitle.toUpperCase();
  var brandAliases = {
    'MANN ':'MANN-FILTER','MANN FILTER':'MANN-FILTER','FEBI':'FEBI BILSTEIN','LIQUI':'LIQUI MOLY',
    'LIQUI-MOLY':'LIQUI MOLY','BLUE PRINT':'BLUE PRINT','BLUEPRINT':'BLUE PRINT',
    'HI Q':'HI-Q','HIQ':'HI-Q','VOLKSWAGEN':'VAG','AUDI ':'VAG','SKODA':'VAG','SEAT ':'VAG',
    'CUPRA':'VAG','VW ':'VAG'
  };

  var bKeys = Object.keys(BRAND_INFO);
  for (var bk = 0; bk < bKeys.length; bk++) {
    if (titleUpper.indexOf(bKeys[bk]) !== -1) { detectedBrand = bKeys[bk]; break; }
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
     STEP 6: Find insertion target
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
     STEP 7: Build HTML
     =================================================== */
  var highlights = brandData.highlights || [
    '\u05d0\u05d9\u05db\u05d5\u05ea OEM \u2014 \u05d6\u05d4\u05d4 \u05dc\u05d7\u05dc\u05e7 \u05e9\u05de\u05d2\u05d9\u05e2 \u05e2\u05dd \u05d4\u05e8\u05db\u05d1',
    '\u05e2\u05d5\u05de\u05d3 \u05d1\u05ea\u05e7\u05e0\u05d9 \u05d1\u05d8\u05d9\u05d7\u05d5\u05ea \u05d0\u05d9\u05e8\u05d5\u05e4\u05d9\u05d9\u05dd',
    '\u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd \u05d2\u05d1\u05d5\u05d4\u05d9\u05dd \u05e2\u05dd \u05d0\u05d5\u05e8\u05da \u05d7\u05d9\u05d9\u05dd \u05de\u05d5\u05d0\u05e8\u05da',
    '\u05de\u05ea\u05d0\u05d9\u05dd \u05dc\u05db\u05dc \u05d3\u05d2\u05de\u05d9 \u05d4\u05e8\u05db\u05d1 \u05d4\u05de\u05d5\u05d1\u05d9\u05dc\u05d9\u05dd'
  ];

  var cartSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
  var cartSvgSm = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
  var chev = '<svg class="an-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
  var vehChev = '<svg class="an-veh-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
  var modelChev = '<svg class="an-veh-model-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';

  // Images
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

  // Breadcrumb
  var bcHtml = '';
  if (breadcrumbItems.length > 0) {
    for (var bci = 0; bci < breadcrumbItems.length; bci++) {
      bcHtml += '<a href="'+breadcrumbItems[bci].href+'">'+breadcrumbItems[bci].text+'</a><span class="an-sep">/</span>';
    }
  } else {
    bcHtml = '<a href="/">\u05d3\u05e3 \u05d4\u05d1\u05d9\u05ea</a><span class="an-sep">/</span><a href="#">\u05d7\u05dc\u05e7\u05d9 \u05d7\u05d9\u05dc\u05d5\u05e3</a><span class="an-sep">/</span>';
  }
  bcHtml += '<span class="an-current">'+productTitle.substring(0,60)+'</span>';

  // Price
  var cleanPrice = productPrice.replace(/[\u20aa]/g,'').replace(/[^\d,. ]/g,'').trim();
  var priceDisplay = cleanPrice ? cleanPrice+' \u20aa' : (priceEl ? getText(priceEl) : '');

  // Highlights list
  var hlItems = '';
  for (var hl = 0; hl < highlights.length; hl++) hlItems += '<li>'+highlights[hl]+'</li>';

  // Brand badge background color
  var brandBadgeBg = brandData.color || '#1a4690';

  // Brand card
  var brandCardHtml = '';
  if (!isOEMpart && brandData.name && brandData.description) {
    var bc4 = brandData.color || '#1a4690';
    var bAb = brandData.name.toUpperCase(); if (bAb.length > 5) bAb = bAb.substring(0,5);
    var orig = brandData.country ? brandData.country+(brandData.founded?', '+brandData.founded:'') : '';
    brandCardHtml = '<div class="an-section-card"><div class="an-brand-card">' +
      '<div class="an-brand-sidebar" style="background:'+bc4+'"><span>'+bAb+'</span></div>' +
      '<div class="an-brand-card-info"><h3>'+brandData.name+'</h3>' +
      (orig ? '<div class="an-brand-origin">'+orig+'</div>' : '') +
      '<p>'+brandData.description+'</p></div></div></div>';
  }

  // Specs
  var specRows = '';
  if (brandData.name && brandData.name !== '\u05d9\u05e6\u05e8\u05df') specRows += '<tr><td>\u05d9\u05e6\u05e8\u05df</td><td>'+brandData.name+'</td></tr>';
  if (skuValue) specRows += '<tr><td>\u05de\u05e7"\u05d8</td><td>'+skuValue+'</td></tr>';
  if (categoryLabel) specRows += '<tr><td>\u05e1\u05d5\u05d2 \u05de\u05d5\u05e6\u05e8</td><td>'+categoryLabel+'</td></tr>';

  /* Build HTML */
  var html = '';
  // Breadcrumb bar
  html += '<div class="an-breadcrumb-bar"><nav class="an-breadcrumb">'+bcHtml+'</nav></div>';
  // Page background + container
  html += '<div class="an-page-bg"><div class="an-container">';
  // Product layout (2-col desktop)
  html += '<div class="an-product-layout">';

  // LEFT/RIGHT col 1: images (right column in RTL = first in DOM)
  html += '<div class="an-image-section">';
  html += '<div class="an-main-image">'+mainImgHtml+'</div>';
  html += '<div class="an-thumb-row">'+thumbsHtml+'</div>';
  html += '</div>';

  // LEFT/RIGHT col 2: info
  html += '<div class="an-info-section">';
  // SKU + brand badges
  html += '<div class="an-sku-brand-row">';
  if (skuValue) html += '<span class="an-sku-badge">מק"ט: '+skuValue+'</span>';
  if (!isOEMpart && brandData.name) html += '<span class="an-brand-badge" style="background:'+brandBadgeBg+'">'+brandData.name+'</span>';
  html += '</div>';
  // Title
  html += '<h1 class="an-product-title">'+productTitle+'</h1>';
  if (productSubtitle) html += '<div class="an-product-subtitle">'+productSubtitle+'</div>';
  // Stock
  html += '<div class="an-stock-row"><span class="an-stock-dot"></span>'+stockText+'</div>';
  // Price
  html += '<div class="an-price-row"><span class="an-price-amount">'+priceDisplay+'</span><span class="an-price-vat">כולל מע"מ</span></div>';
  // Cart row
  html += '<div class="an-cart-row" id="an-cart-row">';
  html += '<div class="an-qty-selector"><button class="an-qty-btn" id="an-qty-minus">\u2212</button><input class="an-qty-input" id="an-qty-val" type="number" value="1" min="1" max="99" readonly><button class="an-qty-btn" id="an-qty-plus">+</button></div>';
  html += '<button class="an-add-to-cart-btn" id="an-add-to-cart">'+cartSvg+'\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e2\u05d2\u05dc\u05d4</button>';
  html += '</div>';
  // Seller note
  html += '<div class="an-seller-note">\u05e0\u05de\u05db\u05e8 \u05d5\u05e0\u05e9\u05dc\u05d7 \u05e2\u05dc \u05d9\u05d3\u05d9 <strong>\u05d0\u05d5\u05d8\u05d5 \u05e0\u05d4\u05e8\u05d9\u05d4</strong></div>';
  // Trust box
  html += '<div class="an-trust-box">';
  html += '<div class="an-trust-item"><span>\uD83D\uDE9A</span><span>\u05de\u05e9\u05dc\u05d5\u05d7 \u05e2\u05d3 7 \u05d9\u05de\u05d9 \u05e2\u05e1\u05e7\u05d9\u05dd \u05dc\u05db\u05dc \u05d4\u05d0\u05e8\u05e5</span></div>';
  html += '<div class="an-trust-item"><span>\uD83D\uDEE1\uFE0F</span><span>\u05d0\u05d7\u05e8\u05d9\u05d5\u05ea 3 \u05d7\u05d5\u05d3\u05e9\u05d9\u05dd / 6,000 \u05e7"\u05de</span></div>';
  html += '<div class="an-trust-item"><span>\uD83C\uDFC6</span><span>\u05de\u05d5\u05e8\u05e9\u05d9\u05dd \u05de\u05e9\u05e8\u05d3 \u05d4\u05ea\u05d7\u05d1\u05d5\u05e8\u05d4</span></div>';
  html += '<div class="an-trust-item"><span>\uD83D\uDD12</span><span>\u05ea\u05e9\u05dc\u05d5\u05dd \u05de\u05d0\u05d5\u05d1\u05d8\u05d7 \u2014 SSL \u05de\u05d5\u05e6\u05e4\u05df</span></div>';
  html += '<div class="an-trust-item"><span>\uD83D\uDCB3</span><span>\u05d0\u05e4\u05e9\u05e8\u05d5\u05ea \u05ea\u05e9\u05dc\u05d5\u05de\u05d9\u05dd \u05d1\u05e7\u05d5\u05e4\u05d4</span></div>';
  html += '</div>'; // trust-box
  // Highlights section (not OEM, inside info section)
  if (!isOEMpart) {
    html += '<div class="an-highlights-box">';
    html += '<div class="an-highlights-header" id="an-hl-hdr"><h2>\u2756 \u05d1\u05d9\u05e6\u05d5\u05e2\u05d9\u05dd, \u05d0\u05d9\u05db\u05d5\u05ea \u05d5\u05d1\u05d8\u05d9\u05d7\u05d5\u05ea</h2>'+chev+'</div>';
    html += '<div class="an-highlights-content" id="an-hl-cnt"><ul class="an-highlights-list">'+hlItems+'</ul></div>';
    html += '</div>';
  }
  html += '</div>'; // .an-info-section
  html += '</div>'; // .an-product-layout

  // Description card
  html += '<div class="an-section-card">';
  html += '<div class="an-section-header" id="an-desc-hdr"><h2>\u05ea\u05d9\u05d0\u05d5\u05e8 \u05d4\u05de\u05d5\u05e6\u05e8</h2>'+chev+'</div>';
  html += '<div class="an-section-body" id="an-desc-body">';
  html += productDescription ? '<div class="an-description-section">'+productDescription+'</div>' : '<p class="an-description-text">'+productTitle+'</p>';
  html += '</div></div>';

  // Tech specs card
  html += '<div class="an-section-card">';
  html += '<div class="an-section-header" id="an-specs-hdr"><h2>\u05e4\u05e8\u05d8\u05d9\u05dd \u05d8\u05db\u05e0\u05d9\u05d9\u05dd</h2>'+chev+'</div>';
  html += '<div class="an-section-body" id="an-specs-body">';
  html += '<table class="an-specs-table"><tbody>'+specRows+'</tbody></table>';
  html += '</div></div>';

  // Brand card
  html += brandCardHtml;

  // TecDoc section placeholder
  html += '<div class="an-section-card" id="an-tecdoc-section">';
  html += '<div class="an-tecdoc-attribution"><div class="an-tecdoc-dot"></div><span>\u05e0\u05ea\u05d5\u05e0\u05d9\u05dd \u05de-TecDoc\u00ae Catalogue</span></div>';
  html += '<div id="an-tecdoc-wrap"></div>';
  html += '</div>';

  html += '</div></div>'; // container + page-bg

  /* ===================================================
     STEP 8: Insert into DOM
     =================================================== */
  var wrapper = document.createElement('div');
  wrapper.id = 'an-product-redesign';
  wrapper.className = 'an-product-redesign';
  wrapper.innerHTML = html;
  targetInsertEl.parentNode.insertBefore(wrapper, targetInsertEl);
  var bCls = document.body.className || '';
  if (bCls.indexOf('an-redesigned') === -1) document.body.className = (bCls ? bCls + ' ' : '') + 'an-redesigned';

  /* ===================================================
     STEP 9: Wire up interactions
     =================================================== */
  // Qty +/-
  var qtyInput = document.getElementById('an-qty-val');
  var qtyMinus = document.getElementById('an-qty-minus');
  var qtyPlus = document.getElementById('an-qty-plus');
  if (qtyMinus && qtyInput) qtyMinus.addEventListener('click', function() { var v=parseInt(qtyInput.value,10)||1; if(v>1) qtyInput.value=v-1; });
  if (qtyPlus && qtyInput) qtyPlus.addEventListener('click', function() { var v=parseInt(qtyInput.value,10)||1; if(v<99) qtyInput.value=v+1; });

  function clickRealCart() {
    var btn = document.querySelector('.commit_to_real,a.buy_now,form#new_order input[type="submit"],form.productForm input[type="submit"]');
    if (btn) { btn.click(); return true; } return false;
  }
  var addBtn = document.getElementById('an-add-to-cart');
  if (addBtn) {
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var oq = document.querySelector('input[name="quantity"],input[id*="quantity"],select[name="quantity"]');
      if (oq && qtyInput) oq.value = parseInt(qtyInput.value,10) || 1;
      clickRealCart();
    });
  }

  // Move TecDoc widget
  function moveTecDoc() {
    var tw = document.getElementById('tecdoc-widget');
    var wp = document.getElementById('an-tecdoc-wrap');
    if (tw && wp && !wp.children.length) { wp.appendChild(tw); tw.style.display='block'; return true; }
    return false;
  }
  if (!moveTecDoc()) { [1000,3000,6000,10000,15000].forEach(function(t){setTimeout(moveTecDoc,t);}); }

  // Move .tw-purchase-row (TecDoc cart)
  var cartMoved = false;
  function moveCartRow() {
    if (cartMoved) return true;
    var twRow = document.querySelector('.tw-purchase-row');
    var cartRow = document.getElementById('an-cart-row');
    if (twRow && cartRow) { cartRow.parentNode.insertBefore(twRow, cartRow.nextSibling); cartRow.style.display='none'; cartMoved=true; return true; }
    return false;
  }
  if (!moveCartRow()) {
    [300,800,1500,3000,5000,8000,12000].forEach(function(t){setTimeout(moveCartRow,t);});
    if (typeof MutationObserver !== 'undefined') {
      var cObs = new MutationObserver(function(){if(moveCartRow()) cObs.disconnect();});
      cObs.observe(document.body,{childList:true,subtree:true});
      setTimeout(function(){cObs.disconnect();},15000);
    }
  }

  // Thumbnail clicks
  var thumbEls = document.querySelectorAll('#an-product-redesign .an-thumb[data-an-img]');
  var mainImg = document.getElementById('an-main-img');
  for (var th = 0; th < thumbEls.length; th++) {
    (function(thumb) {
      thumb.addEventListener('click', function() {
        var all = document.querySelectorAll('#an-product-redesign .an-thumb');
        for (var t=0;t<all.length;t++) all[t].className=all[t].className.replace(/\s*an-thumb-active/g,'');
        thumb.className += ' an-thumb-active';
        if (mainImg) mainImg.src = thumb.getAttribute('data-an-img');
      });
    })(thumbEls[th]);
  }

  // Highlights toggle
  var hlHdr = document.getElementById('an-hl-hdr');
  var hlCnt = document.getElementById('an-hl-cnt');
  if (hlHdr && hlCnt) {
    hlHdr.addEventListener('click', function() {
      var c = hlHdr.className||'';
      if (c.indexOf('an-sec-col')!==-1) { hlHdr.className=c.replace(/\s*an-sec-col/g,''); hlCnt.style.display=''; }
      else { hlHdr.className=c+' an-sec-col'; hlCnt.style.display='none'; }
    });
  }

  // Section toggles
  function setupToggle(hId, bId) {
    var hE=document.getElementById(hId), bE=document.getElementById(bId);
    if (!hE||!bE) return;
    hE.addEventListener('click', function() {
      var c=hE.className||'';
      if(c.indexOf('an-sec-col')!==-1){hE.className=c.replace(/\s*an-sec-col/g,'');bE.style.display='';}
      else{hE.className=c+' an-sec-col';bE.style.display='none';}
    });
  }
  setupToggle('an-desc-hdr','an-desc-body');
  setupToggle('an-specs-hdr','an-specs-body');

  // Vehicle group toggles (for TecDoc injected content)
  function setupVehGroups() {
    var grpHdrs = document.querySelectorAll('#an-product-redesign .an-veh-group-header');
    for (var gh=0;gh<grpHdrs.length;gh++) {
      (function(hdr){
        hdr.addEventListener('click', function(){
          var grp=hdr.parentElement;
          var models=grp.querySelector('.an-veh-group-models');
          if(!models) return;
          var isOpen=grp.className.indexOf('an-open')!==-1;
          if(isOpen){grp.className=grp.className.replace(/\s*an-open/g,'');models.style.display='none';}
          else{grp.className+=' an-open';models.style.display='';}
        });
      })(grpHdrs[gh]);
    }
    var modelRows = document.querySelectorAll('#an-product-redesign .an-veh-model-row');
    for (var mr=0;mr<modelRows.length;mr++) {
      (function(row){
        row.addEventListener('click', function(){
          var item=row.parentElement;
          var eng=item.querySelector('.an-veh-engines');
          if(!eng) return;
          var isOpen=item.className.indexOf('an-open')!==-1;
          if(isOpen){item.className=item.className.replace(/\s*an-open/g,'');eng.style.display='none';}
          else{item.className+=' an-open';eng.style.display='';}
        });
      })(modelRows[mr]);
    }
  }
  setupVehGroups();

  // Tab switching
  function setupTabs() {
    var tabs = document.querySelectorAll('#an-product-redesign .an-tab');
    for (var tb=0;tb<tabs.length;tb++) {
      (function(tab){
        tab.addEventListener('click', function(){
          var panelId = tab.getAttribute('data-an-panel');
          if (!panelId) return;
          var allTabs = document.querySelectorAll('#an-product-redesign .an-tab');
          var allPanels = document.querySelectorAll('#an-product-redesign .an-tab-panel');
          for (var at=0;at<allTabs.length;at++) allTabs[at].className=allTabs[at].className.replace(/\s*an-tab-active/g,'');
          for (var ap=0;ap<allPanels.length;ap++) allPanels[ap].className=allPanels[ap].className.replace(/\s*an-tab-active/g,'');
          tab.className+=' an-tab-active';
          var panel=document.getElementById(panelId);
          if(panel) panel.className+=' an-tab-active';
        });
      })(tabs[tb]);
    }
  }
  setupTabs();

  // Sticky mobile bar
  var shortT = productTitle.length > 30 ? productTitle.substring(0,30)+'\u2026' : productTitle;
  var sBH = '<div id="an-sticky-bar"><div class="an-sticky-inner"><div class="an-sticky-info"><span class="an-sticky-title">'+shortT+'</span><span class="an-sticky-price">'+priceDisplay+'</span></div><button class="an-sticky-buy" id="an-sticky-btn">'+cartSvgSm+'\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e2\u05d2\u05dc\u05d4</button></div></div>';
  var sc = document.createElement('div');
  sc.innerHTML = sBH;
  document.body.appendChild(sc.firstChild);
  var sSBtn = document.getElementById('an-sticky-btn');
  if (sSBtn) sSBtn.addEventListener('click', function(e){e.preventDefault();clickRealCart();});

  var sBar = document.getElementById('an-sticky-bar');
  var pLayout = document.querySelector('#an-product-redesign .an-product-layout');
  var sVis = false;
  function checkSticky() {
    if (!pLayout||!sBar) return;
    var r = pLayout.getBoundingClientRect();
    var show = r.top < -200;
    if (show !== sVis) { sVis=show; sBar.className=show?'an-sticky-visible':''; }
  }
  window.addEventListener('scroll', checkSticky, {passive:true});

})();

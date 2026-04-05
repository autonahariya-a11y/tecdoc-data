(function() {
  'use strict';

  /* ===================================================
     STEP 1: Inject CSS
     =================================================== */
  if (!document.getElementById('an-style-v2')) {
    var style = document.createElement('style');
    style.id = 'an-style-v2';
    style.textContent = [
      /* ===== KONIMBO ELEMENT HIDING ===== */
      'body.an-redesigned #item_show,',
      'body.an-redesigned #item_content,',
      'body.an-redesigned .specifications,',
      'body.an-redesigned #item_show_facebook,',
      'body.an-redesigned #item_show_carousel,',
      'body.an-redesigned .item_show_carousel,',
      'body.an-redesigned .item_container,',
      'body.an-redesigned #item_info,',
      'body.an-redesigned .item_main_top,',
      'body.an-redesigned #bread_crumbs,',
      'body.an-redesigned .product-container,',
      'body.an-redesigned #item_current_title,',
      'body.an-redesigned .code_item,',
      'body.an-redesigned #page_notice,',
      'body.an-redesigned #storiesWidget,',
      'body.an-redesigned .stories-wrapper{display:none!important}',
      'body.an-redesigned #item_details,',
      'body.an-redesigned .item_main_bottom{display:block!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;opacity:0!important;pointer-events:none!important}',

      /* ===== ROOT VARIABLES ===== */
      '.an-product-redesign,:root{',
      '--an-primary:#1B4E91;--an-primary-dark:#153d73;--an-brand-blue:#1a4690;--an-brand-red:#c8102e;',
      '--an-bg:#f7f8fa;--an-white:#ffffff;--an-text:#1a1a2e;--an-text-secondary:#5a5a6e;',
      '--an-text-muted:#8a8a9a;--an-border:#e4e6eb;--an-border-light:#f0f1f4;',
      '--an-green:#00a651;--an-green-bg:#e8f8ef;--an-radius:12px;--an-radius-sm:8px;',
      '--an-shadow:0 2px 8px rgba(0,0,0,0.06);--an-shadow-lg:0 4px 20px rgba(0,0,0,0.08)}',

      /* ===== PAGE BACKGROUND ===== */
      '#an-product-redesign{font-family:\'Heebo\',sans-serif;background:var(--an-bg);color:var(--an-text);',
      'line-height:1.6;-webkit-font-smoothing:antialiased;direction:rtl}',
      '#an-product-redesign *,#an-product-redesign *::before,#an-product-redesign *::after{box-sizing:border-box;margin:0;padding:0}',

      /* ===== BREADCRUMB ===== */
      '.an-breadcrumb-bar{background:var(--an-white);border-bottom:1px solid var(--an-border-light)}',
      '.an-breadcrumb{max-width:1200px;margin:0 auto;padding:12px 24px;font-size:13px;color:var(--an-text-muted);',
      'display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.an-breadcrumb a{color:var(--an-text-secondary);text-decoration:none;transition:color 0.2s}',
      '.an-breadcrumb a:hover{color:var(--an-primary)}',
      '.an-sep{color:var(--an-border)}',
      '.an-current{color:var(--an-text);font-weight:500}',

      /* ===== CONTAINER ===== */
      '.an-container{max-width:1200px;margin:0 auto;padding:24px}',
      '.an-page-bg{background:var(--an-bg)}',

      /* ===== PRODUCT TOP ===== */
      '.an-product-layout{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:24px}',

      /* ===== IMAGE AREA ===== */
      '.an-image-section{background:var(--an-white);border-radius:var(--an-radius);',
      'box-shadow:var(--an-shadow);padding:24px;display:flex;flex-direction:column;align-items:center}',
      '.an-main-image{width:100%;max-width:400px;aspect-ratio:1;display:flex;align-items:center;',
      'justify-content:center;margin-bottom:16px;overflow:hidden}',
      '.an-main-image img{width:100%;height:100%;object-fit:contain}',
      '.an-img-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;',
      'justify-content:center;background:#f5f6f8;border-radius:12px;gap:8px}',
      '.an-img-ph-brand{font-size:22px;font-weight:800;color:var(--an-primary);letter-spacing:2px}',
      '.an-img-ph-sku{font-size:16px;font-weight:600;color:var(--an-text-secondary)}',
      '.an-thumb-row{display:flex;gap:10px;justify-content:center}',
      '.an-thumb{width:64px;height:64px;border-radius:8px;border:2px solid var(--an-border);',
      'background:var(--an-bg);display:flex;align-items:center;justify-content:center;',
      'cursor:pointer;transition:border-color 0.2s;overflow:hidden}',
      '.an-thumb img{width:100%;height:100%;object-fit:contain}',
      '.an-thumb.an-thumb-active{border-color:var(--an-brand-red)}',
      '.an-thumb:hover{border-color:var(--an-brand-red)}',
      '.an-thumb-ph{font-size:8px;color:var(--an-text-muted);font-weight:600;text-align:center;line-height:1.2}',

      /* ===== INFO AREA ===== */
      '.an-info-section{display:flex;flex-direction:column;gap:16px}',
      '.an-sku-brand-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
      '.an-sku-badge{display:inline-flex;align-items:center;gap:6px;background:var(--an-bg);',
      'border:1px solid var(--an-border);border-radius:6px;padding:5px 12px;font-size:13px;',
      'color:var(--an-text-secondary);font-weight:500}',
      '.an-brand-badge{display:inline-flex;align-items:center;gap:6px;border-radius:6px;',
      'padding:5px 14px;font-size:13px;color:white;font-weight:700;letter-spacing:0.5px}',
      '.an-product-title{font-size:26px;font-weight:700;color:var(--an-text);line-height:1.3}',
      '.an-product-subtitle{font-size:15px;color:var(--an-text-muted);margin-top:-8px}',
      '.an-stock-row{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--an-green)}',
      '.an-stock-dot{width:10px;height:10px;border-radius:50%;background:var(--an-green);',
      'display:inline-block;animation:an-pulse 2s infinite;flex-shrink:0}',
      '@keyframes an-pulse{0%,100%{opacity:1}50%{opacity:0.5}}',
      '.an-price-row{display:flex;align-items:baseline;gap:10px}',
      '.an-price-amount{font-size:34px;font-weight:800;color:var(--an-text)}',
      '.an-price-vat{font-size:13px;color:var(--an-text-muted);font-weight:400}',

      /* ===== CART ROW ===== */
      '.an-cart-row{display:flex;flex-direction:column;gap:10px}',
      '.an-qty-selector{display:flex;align-items:center;border:1px solid var(--an-border);',
      'border-radius:var(--an-radius-sm);overflow:hidden;background:var(--an-white);align-self:flex-start}',
      '.an-qty-btn{width:40px;height:44px;display:flex;align-items:center;justify-content:center;',
      'background:var(--an-bg);border:none;cursor:pointer;font-size:18px;color:var(--an-text-secondary);',
      'font-weight:600;transition:background 0.2s;font-family:\'Heebo\',sans-serif}',
      '.an-qty-btn:hover{background:var(--an-border)}',
      '.an-qty-input{width:44px;height:44px;display:flex;align-items:center;justify-content:center;',
      'font-size:16px;font-weight:600;border:none;border-left:1px solid var(--an-border);',
      'border-right:1px solid var(--an-border);text-align:center;background:var(--an-white);',
      'color:var(--an-text);font-family:\'Heebo\',sans-serif;-moz-appearance:textfield}',
      '.an-qty-input::-webkit-inner-spin-button,.an-qty-input::-webkit-outer-spin-button{-webkit-appearance:none}',
      '.an-add-to-cart-btn{flex:1;height:54px;background:var(--an-primary);color:white;border:none;',
      'border-radius:var(--an-radius-sm);font-family:\'Heebo\',sans-serif;font-size:18px;font-weight:700;',
      'cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;',
      'transition:background 0.2s,transform 0.1s;letter-spacing:0.3px;',
      'box-shadow:0 4px 14px rgba(27,78,145,0.35);width:100%}',
      '.an-add-to-cart-btn:hover{background:var(--an-primary-dark)}',
      '.an-add-to-cart-btn:active{transform:scale(0.98)}',
      '.an-seller-note{font-size:13px;color:var(--an-text-muted)}',
      '.an-seller-note strong{color:var(--an-text-secondary);font-weight:600}',

      /* ===== TRUST BOX ===== */
      '.an-trust-box{background:#f9fafb;border:1px solid var(--an-border-light);',
      'border-radius:var(--an-radius-sm);padding:16px 20px;display:flex;flex-direction:column;gap:10px}',
      '.an-trust-item{display:flex;align-items:center;gap:10px;font-size:13.5px;',
      'color:var(--an-text-secondary);line-height:1.4}',
      '.an-trust-item>span:first-child{font-size:17px;width:24px;text-align:center;flex-shrink:0}',

      /* ===== HIGHLIGHTS BOX (inside info section) ===== */
      '.an-highlights-box{background:var(--an-white);border:1px solid var(--an-border-light);',
      'border-radius:var(--an-radius-sm);overflow:hidden}',
      '.an-highlights-header{display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 18px;cursor:pointer;user-select:none;transition:background 0.2s}',
      '.an-highlights-header:hover{background:#fafbfc}',
      '.an-highlights-header h2{font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px}',
      '.an-highlights-content{padding:0 18px 16px}',
      '.an-highlights-list{list-style:none;display:flex;flex-direction:column;gap:10px}',
      '.an-highlights-list li{display:flex;align-items:flex-start;gap:10px;font-size:14px;',
      'color:var(--an-text-secondary);line-height:1.5}',
      '.an-highlights-list li::before{content:"✓";color:var(--an-green);font-weight:700;',
      'font-size:13px;margin-top:2px;flex-shrink:0}',

      /* ===== SECTION CARDS ===== */
      '.an-section-card{background:var(--an-white);border-radius:var(--an-radius);',
      'box-shadow:var(--an-shadow);margin-bottom:20px;overflow:hidden}',
      '.an-section-header{display:flex;align-items:center;justify-content:space-between;',
      'padding:18px 24px;cursor:pointer;user-select:none;transition:background 0.2s}',
      '.an-section-header:hover{background:#fafbfc}',
      '.an-section-header h2{font-size:18px;font-weight:700;display:flex;align-items:center;gap:8px}',
      '.an-chevron{width:24px;height:24px;transition:transform 0.3s ease;color:var(--an-text-muted);flex-shrink:0}',
      '.an-sec-col .an-chevron{transform:rotate(180deg)}',
      '.an-section-body{padding:0 24px 24px}',
      '.an-description-section{font-size:15px;color:var(--an-text-secondary);line-height:1.8}',
      '.an-description-text{font-size:15px;color:var(--an-text-secondary);line-height:1.8}',

      /* ===== SPECS TABLE ===== */
      '.an-specs-table{width:100%;border-collapse:collapse}',
      '.an-specs-table tr:nth-child(even){background:#fafbfc}',
      '.an-specs-table td{padding:12px 16px;font-size:14px;border-bottom:1px solid var(--an-border-light)}',
      '.an-specs-table td:first-child{font-weight:600;color:var(--an-text);width:40%}',
      '.an-specs-table td:last-child{color:var(--an-text-secondary)}',

      /* ===== TECDOC SECTION ===== */
      '.an-tecdoc-attribution{display:flex;align-items:center;gap:8px;padding:14px 24px 0;',
      'font-size:12px;color:var(--an-text-muted)}',
      '.an-tecdoc-dot{width:6px;height:6px;border-radius:50%;background:var(--an-primary);',
      'opacity:0.5;flex-shrink:0}',

      /* ===== TABS ===== */
      '.an-tabs{display:flex;border-bottom:2px solid var(--an-border-light);padding:0 24px;',
      'margin-top:12px;gap:0;overflow-x:auto;-webkit-overflow-scrolling:touch}',
      '.an-tab{padding:12px 20px;font-size:14px;font-weight:500;color:var(--an-text-muted);',
      'border-bottom:3px solid transparent;margin-bottom:-2px;cursor:pointer;',
      'transition:all 0.2s;white-space:nowrap;user-select:none}',
      '.an-tab:hover{color:var(--an-text)}',
      '.an-tab.an-tab-active{color:var(--an-primary);border-bottom-color:var(--an-primary);font-weight:600}',
      '.an-tab .an-count{display:inline-flex;align-items:center;justify-content:center;',
      'min-width:22px;height:20px;border-radius:10px;background:var(--an-bg);font-size:11px;',
      'font-weight:600;color:var(--an-text-muted);padding:0 6px;margin-right:4px}',
      '.an-tab.an-tab-active .an-count{background:#e8eef6;color:var(--an-primary)}',

      /* ===== TAB PANELS ===== */
      '.an-tab-panel{display:none;padding:20px 24px 24px}',
      '.an-tab-panel.an-tab-active{display:block}',

      /* ===== OE NUMBERS ===== */
      '.an-oe-grid{display:flex;flex-wrap:wrap;gap:8px}',
      '.an-oe-chip{display:inline-flex;align-items:center;background:#eef3fb;border:1px solid #c8d8f0;',
      'border-radius:6px;padding:6px 14px;font-size:13px;font-weight:600;color:var(--an-primary);',
      'font-family:\'Courier New\',monospace;letter-spacing:0.3px;transition:background 0.15s}',
      '.an-oe-chip:hover{background:#ddeafa}',

      /* ===== VEHICLE GROUPS ===== */
      '.an-veh-groups{display:flex;flex-direction:column;gap:2px}',
      '.an-veh-group{border:1px solid #e4e6eb;border-radius:10px;overflow:hidden}',
      '.an-veh-group-header{display:flex;align-items:center;justify-content:space-between;',
      'padding:14px 18px;cursor:pointer;background:#fff;transition:background 0.15s}',
      '.an-veh-group-header:hover{background:#f7f8fa}',
      '.an-veh-make-info{display:flex;align-items:center;gap:12px}',
      '.an-veh-make-logo{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;',
      'justify-content:center;font-weight:800;font-size:12px;letter-spacing:0.5px;flex-shrink:0}',
      '.an-veh-make-name{font-size:16px;font-weight:700;color:#1a1a2e}',
      '.an-veh-make-count{font-size:13px;color:#8a8a9a;font-weight:400}',
      '.an-veh-chevron{transition:transform 0.3s;flex-shrink:0;color:#8a8a9a}',
      '.an-veh-group.an-open .an-veh-chevron{transform:rotate(180deg)}',
      '.an-veh-group-models{background:#fafbfc;border-top:1px solid #e4e6eb}',
      '.an-veh-model-item{border-bottom:1px solid #f0f1f4}',
      '.an-veh-model-item:last-child{border-bottom:none}',
      '.an-veh-model-row{display:flex;align-items:center;justify-content:space-between;',
      'padding:11px 20px 11px 18px;cursor:pointer;transition:background 0.12s;gap:8px}',
      '.an-veh-model-row:hover{background:#f0f4ff}',
      '.an-veh-model-name{font-size:14px;font-weight:600;color:#1a1a2e;flex:1}',
      '.an-veh-model-years{font-size:13px;color:#8a8a9a;direction:ltr;margin-left:12px;flex-shrink:0}',
      '.an-veh-model-chev{transition:transform 0.25s;flex-shrink:0;color:#b0b0b0}',
      '.an-veh-model-item.an-open .an-veh-model-chev{transform:rotate(180deg)}',
      '.an-veh-engines{background:#f5f7fa;padding:0 20px 0 18px}',
      '.an-veh-engine-row{display:flex;align-items:center;justify-content:space-between;',
      'padding:8px 0 8px 28px;font-size:13px;color:#5a5a6e;border-top:1px solid #ebedf2}',
      '.an-veh-engine-row:first-child{border-top:none}',
      '.an-veh-eng-years{font-size:12px;color:#a0a0a0;direction:ltr}',

      /* ===== BRAND CARD ===== */
      '.an-brand-card{display:flex;align-items:stretch;overflow:hidden}',
      '.an-brand-sidebar{width:100px;min-height:120px;display:flex;align-items:center;',
      'justify-content:center;flex-shrink:0}',
      '.an-brand-sidebar span{color:white;font-size:18px;font-weight:800;letter-spacing:1px}',
      '.an-brand-card-info{padding:20px 24px;display:flex;flex-direction:column;gap:6px}',
      '.an-brand-card-info h3{font-size:18px;font-weight:700;color:var(--an-text)}',
      '.an-brand-origin{font-size:13px;color:var(--an-text-muted);display:flex;align-items:center;gap:6px}',
      '.an-brand-card-info p{font-size:14px;color:var(--an-text-secondary);line-height:1.7;margin-top:4px}',

      /* ===== STICKY MOBILE BAR ===== */
      '#an-sticky-bar{position:fixed;bottom:0;right:0;left:0;z-index:9999;',
      'background:var(--an-white);border-top:1px solid var(--an-border);',
      'box-shadow:0 -2px 12px rgba(0,0,0,0.08);transform:translateY(100%);',
      'transition:transform 0.3s ease;font-family:\'Heebo\',sans-serif;direction:rtl}',
      '#an-sticky-bar.an-sticky-visible{transform:translateY(0)}',
      '.an-sticky-inner{max-width:1200px;margin:0 auto;padding:10px 16px;',
      'display:flex;align-items:center;justify-content:space-between;gap:12px}',
      '.an-sticky-info{display:flex;flex-direction:column;gap:2px;min-width:0}',
      '.an-sticky-title{font-size:13px;font-weight:600;color:var(--an-text);',
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.an-sticky-price{font-size:16px;font-weight:800;color:var(--an-text)}',
      '.an-sticky-buy{height:44px;padding:0 20px;background:var(--an-primary);color:white;',
      'border:none;border-radius:var(--an-radius-sm);font-family:\'Heebo\',sans-serif;font-size:15px;',
      'font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;flex-shrink:0;',
      'box-shadow:0 2px 8px rgba(27,78,145,0.3)}',
      '.an-sticky-buy:hover{background:var(--an-primary-dark)}',

      /* ===== RESPONSIVE ===== */
      '@media(max-width:768px){',
      '.an-product-layout{grid-template-columns:1fr;gap:20px}',
      '.an-product-title{font-size:22px}',
      '.an-price-amount{font-size:28px}',
      '.an-qty-selector{align-self:stretch;justify-content:center;width:100%}',
      '.an-qty-btn{flex:1}.an-qty-input{flex:1}',
      '.an-brand-card{flex-direction:column}',
      '.an-brand-sidebar{width:100%;min-height:60px}',
      '.an-tabs{padding:0 16px}.an-tab{padding:12px 14px;font-size:13px}',
      '.an-container{padding:16px}',
      '.an-section-body{padding:0 16px 16px}',
      '.an-tab-panel{padding:16px 16px 20px}',
      '.an-section-header{padding:16px}',
      '.an-tecdoc-attribution{padding:14px 16px 0}',
      '.an-veh-group-header{padding:12px 14px}',
      '.an-veh-make-logo{width:32px;height:32px;font-size:11px}',
      '.an-veh-make-name{font-size:14px}',
      '.an-veh-model-row{padding:10px 14px}',
      '.an-veh-model-name{font-size:13px}',
      '.an-veh-engine-row{padding:7px 0 7px 20px;font-size:12px}',
      '}',
      '@media(max-width:480px){',
      '.an-breadcrumb{padding:10px 16px;font-size:12px}',
      '.an-trust-item{font-size:13px}',
      '.an-oe-chip{font-size:12px;padding:5px 10px}',
      '}'
    ].join('');
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

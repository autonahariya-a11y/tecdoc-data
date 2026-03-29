/* ============================================================
 *  Auto Nahariya – Unified Category Results Script
 *  Merges original category browsing + hotfix (brand/model aliases)
 *  For Konimbo body_html hybrid field
 *  ------------------------------------------------------------ */

/* --- Globals (exposed before IIFE) --- */
window.__anImgCache = window.__anImgCache || {};
window.__anImgPreload = window.__anImgPreload || {};
window.__anCatIds = window.__anCatIds || {};
window.cImg = window.cImg || {};

/* --- Add to Cart (Konimbo find_id integration) --- */
window.__anAddCart = function (btn) {
  var iid = btn.getAttribute('data-iid');
  var nm  = btn.getAttribute('data-name');
  var url = btn.getAttribute('data-url');
  if (typeof find_id === 'function' && iid) {
    btn.classList.add('an-adding');
    try { find_id(iid, nm, '', '', 1, 1, ''); } catch (e) { /* silent */ }
    btn.classList.remove('an-adding');
    btn.classList.add('an-added');
    btn.innerHTML = '\u2713 \u05E0\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4';
    setTimeout(function () {
      btn.classList.remove('an-added');
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>' +
        '</svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4';
    }, 2000);
  } else if (url) {
    window.location.href = url;
  }
};

/* --- Fetch Product Images (paginated category scraping) --- */
window.__anFetchProductImages = function (catName, callback) {
  var CAT_IDS = {
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8": "190161",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF": "192219",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF": "196209",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8": "250645",
    "\u05DE\u05E6\u05EA\u05D9\u05DD": "198722",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4": "199315",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8": "213932",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC": "236613",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD": "199567",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF": "204362",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2": "207714",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05D6\u05E2\u05D6\u05D5\u05E2\u05D9\u05DD": "242151",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD": "214303",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF": "217343",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD": "215640",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1": "216111",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4": "216112",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8": "216113",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7": "226789",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5": "228178",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3": "234540",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2": "217398",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD": "727853",
    "\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA": "462359"
  };
  window.__anCatIds = CAT_IDS;

  var cid = CAT_IDS[catName];
  if (!cid) { callback({}); return; }
  if (window.__anImgCache[catName]) { callback(window.__anImgCache[catName]); return; }

  var map = {}, page = 1, maxPages = 20;

  function fetchPage() {
    var x = new XMLHttpRequest();
    x.open('GET', '/categories/' + cid + '?page=' + page, true);
    x.timeout = 10000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        var html = x.responseText;
        if (html.indexOf('page_no_referer') !== -1 || html.indexOf('item_id_') === -1) {
          finalize();
          return;
        }
        var re = /id="item_id_(\d+)"[\s\S]*?<img\s+class='img-responsive[^']*'\s+src='([^']*cloudfront[^']*)'/g;
        var m, found = 0;
        while ((m = re.exec(html)) !== null) { map[m[1]] = m[2]; found++; }
        if (found >= 12 && page < maxPages) { page++; fetchPage(); }
        else { finalize(); }
      } else { finalize(); }
    };
    x.onerror = x.ontimeout = function () { finalize(); };
    x.send();
  }

  function finalize() {
    var pre = window.__anImgPreload || {};
    for (var k in pre) { if (!map[k]) map[k] = pre[k]; }
    window.__anImgCache[catName] = map;
    callback(map);
  }

  fetchPage();
};


/* ============================================================
 *  MAIN IIFE
 * ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
   *  CSS INJECTION – Enhanced product cards & category tiles
   * ---------------------------------------------------------- */
  (function injectCSS() {
    var css =
      /* === AUTODOC-style Product List (horizontal cards) === */
      '.an-parts-finder .an-products-grid{display:flex;flex-direction:column;gap:12px;padding:12px 0}' +
      '.an-parts-finder .an-product-card{background:#fff;border:1px solid #e8eaed;border-radius:10px;overflow:hidden;display:flex;flex-direction:row;transition:box-shadow .2s ease;position:relative;min-height:160px}' +
      '.an-parts-finder .an-product-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);border-color:#329FDA}' +
      /* Image column */
      '.an-parts-finder .an-product-img-col{position:relative;flex:0 0 180px;display:flex;align-items:center;justify-content:center;padding:16px;background:#fafbfc;border-left:1px solid #f0f0f0}' +
      '.an-parts-finder .an-product-img{max-width:100%;max-height:140px;object-fit:contain}' +
      '.an-parts-finder .an-product-brand-logo{position:absolute;top:8px;left:8px;max-height:28px;max-width:80px;object-fit:contain}' +
      /* Info column */
      '.an-parts-finder .an-product-info-col{flex:1;padding:14px 18px;display:flex;flex-direction:column;gap:6px;direction:rtl;min-width:0}' +
      '.an-parts-finder .an-product-name{font-size:15px;font-weight:700;color:#1a1a2e;line-height:1.4;font-family:"Heebo",sans-serif;margin:0}' +
      '.an-parts-finder .an-product-meta-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:2px}' +
      '.an-parts-finder .an-product-code{font-size:12px;color:#329FDA;background:rgba(50,159,218,.1);padding:3px 10px;border-radius:5px;font-weight:600;display:inline-flex;align-items:center;gap:4px;font-family:monospace,sans-serif}' +
      '.an-parts-finder .an-product-cat-badge{font-size:11px;color:#666;background:#f0f0f0;padding:3px 8px;border-radius:5px;display:inline-block}' +
      '.an-parts-finder .an-product-years{font-size:12px;color:#888;display:inline-flex;align-items:center;gap:4px}' +
      '.an-parts-finder .an-product-years svg{flex-shrink:0}' +
      /* Specs mini-table */
      '.an-parts-finder .an-product-specs{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:4px;font-size:12px;color:#555}' +
      '.an-parts-finder .an-product-spec{display:flex;gap:4px}' +
      '.an-parts-finder .an-product-spec-label{color:#999;font-weight:400}' +
      '.an-parts-finder .an-product-spec-val{font-weight:500;color:#333}' +
      /* Action column */
      '.an-parts-finder .an-product-action-col{flex:0 0 auto;padding:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border-right:1px solid #f0f0f0;min-width:140px}' +
      '.an-parts-finder .an-product-stock{font-size:11px;color:#27ae60;display:flex;align-items:center;gap:4px;font-weight:500}' +
      '.an-parts-finder .an-product-stock::before{content:"";width:7px;height:7px;border-radius:50%;background:#27ae60;display:inline-block}' +
      '.an-parts-finder .an-btn{border:none;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;font-family:"Heebo",sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;transition:all .15s ease;text-decoration:none;text-align:center;width:100%}' +
      '.an-parts-finder .an-btn-cart{background:#329FDA;color:#fff}' +
      '.an-parts-finder .an-btn-cart:hover{background:#1B4E91}' +
      '.an-parts-finder .an-btn-cart.an-adding{opacity:.7}' +
      '.an-parts-finder .an-btn-cart.an-added{background:#27ae60;color:#fff}' +
      '.an-parts-finder .an-btn-view{background:transparent;color:#555;border:1.5px solid #ddd;font-size:12px;padding:7px 14px}' +
      '.an-parts-finder .an-btn-view:hover{border-color:#329FDA;color:#329FDA}' +
      /* Products topbar */
      '.an-parts-finder .an-products-topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 0;margin-bottom:4px;border-bottom:2px solid #329FDA;flex-wrap:wrap;gap:8px}' +
      '.an-parts-finder .an-products-back-btn{background:none;border:1.5px solid #ddd;border-radius:8px;padding:8px 16px;font-size:14px;font-family:"Heebo",sans-serif;cursor:pointer;display:flex;align-items:center;gap:6px;color:#333;transition:all .15s ease}' +
      '.an-parts-finder .an-products-back-btn:hover{border-color:#329FDA;color:#329FDA}' +
      '.an-parts-finder .an-products-cat-title{font-size:20px;font-weight:700;color:#1a1a2e;font-family:"Heebo",sans-serif}' +
      '.an-parts-finder .an-products-count{font-size:14px;color:#888;font-family:"Heebo",sans-serif}' +
      /* Enhanced Category Cards */
      '.an-parts-finder .an-cat-tile{background:#fff;border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:all .2s ease;border:1px solid #e8eaed;position:relative;overflow:hidden}' +
      '.an-parts-finder .an-cat-tile:hover{box-shadow:0 6px 24px rgba(50,159,218,.15);transform:translateY(-3px);border-color:#329FDA}' +
      '.an-parts-finder .an-cat-tile:hover::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3px;background:#329FDA}' +
      '.an-parts-finder .an-cat-tile .an-cat-img{max-height:100px;max-width:100%;object-fit:contain;margin:0 auto 12px;display:block;transition:transform .3s ease}' +
      '.an-parts-finder .an-cat-tile:hover .an-cat-img{transform:scale(1.08)}' +
      '.an-parts-finder .an-cat-name{font-size:15px;font-weight:600;color:#1a1a2e;font-family:"Heebo",sans-serif}' +
      '.an-parts-finder .an-cat-count{font-size:12px;color:#888;margin-top:4px}' +
      /* Brand filter bar */
      '.an-parts-finder .an-brand-filter-bar{display:flex;gap:8px;overflow-x:auto;padding:8px 0 12px;-webkit-overflow-scrolling:touch;scrollbar-width:thin}' +
      '.an-parts-finder .an-brand-filter-bar::-webkit-scrollbar{height:4px}' +
      '.an-parts-finder .an-brand-filter-bar::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}' +
      '.an-parts-finder .an-brand-chip{display:flex;align-items:center;gap:6px;padding:6px 14px;border:1.5px solid #e0e0e0;border-radius:20px;font-size:12px;font-weight:600;font-family:"Heebo",sans-serif;cursor:pointer;white-space:nowrap;background:#fff;transition:all .15s ease;color:#444;flex-shrink:0}' +
      '.an-parts-finder .an-brand-chip:hover,.an-parts-finder .an-brand-chip.active{border-color:#329FDA;background:rgba(50,159,218,.06);color:#1B4E91}' +
      '.an-parts-finder .an-brand-chip img{height:18px;object-fit:contain}' +
      '.an-parts-finder .an-brand-chip-all{background:#329FDA;color:#fff;border-color:#329FDA}' +
      '.an-parts-finder .an-brand-chip-all:hover,.an-parts-finder .an-brand-chip-all.active{background:#1B4E91;border-color:#1B4E91}' +
      /* Responsive: mobile */
      '@media(max-width:768px){' +
        '.an-parts-finder .an-product-card{flex-direction:column}' +
        '.an-parts-finder .an-product-img-col{flex:none;min-height:120px;border-left:none;border-bottom:1px solid #f0f0f0}' +
        '.an-parts-finder .an-product-action-col{flex-direction:row;border-right:none;border-top:1px solid #f0f0f0;min-width:auto;padding:10px 14px}' +
        '.an-parts-finder .an-btn{flex:1}' +
      '}' +
      '@media(max-width:550px){' +
        '.an-parts-finder .an-product-img-col{min-height:100px;padding:12px}' +
        '.an-parts-finder .an-product-info-col{padding:10px 14px}' +
        '.an-parts-finder .an-product-name{font-size:14px}' +
      '}';
    var style = document.createElement('style');
    style.setAttribute('data-an-enhanced', '1');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  })();


  /* ----------------------------------------------------------
   *  CONSTANTS & CONFIGURATION
   * ---------------------------------------------------------- */

  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1I5_KWRWIq1UpUDagRQVs65LuXELRSVCeInU0HRLcWHg/gviz/tq?tqx=out:csv';
  var TECDOC_DATA_BASE = 'https://autonahariya-a11y.github.io/tecdoc-data/data/';
  var WA_NUMBER = '97249517322';

  /* --- Merged Brand Aliases (original + hotfix) --- */
  var BRANDS = {
    "\u05D0\u05D0\u05D5\u05D3\u05D9":       ["\u05D0\u05D0\u05D5\u05D3\u05D9", "audi"],
    "\u05D0\u05D5\u05E4\u05DC":             ["\u05D0\u05D5\u05E4\u05DC", "opel"],
    "\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5": ["\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5", "\u05D0\u05DC\u05E4\u05D0\u05E8\u05D5\u05DE\u05D0\u05D5", "alfa romeo"],
    "\u05D1\u05D9.\u05D0\u05DE.\u05D5\u05D5": ["\u05D1\u05D9.\u05D0\u05DE.\u05D5\u05D5", "bmw", "\u05D1\u05DE\u05D5\u05D5", "BMW"],
    "\u05D2'\u05D9\u05E4":                 ["\u05D2'\u05D9\u05E4", "\u05D2\u05D9\u05E4", "jeep"],
    "\u05D3\u05D0\u05E6\u05D9\u05D4":       ["\u05D3\u05D0\u05E6\u05D9\u05D4", "dacia"],
    "\u05D4\u05D5\u05E0\u05D3\u05D4":       ["\u05D4\u05D5\u05E0\u05D3\u05D4", "honda"],
    "\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9": ["\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9", "\u05D9\u05D5\u05E0\u05D3\u05D4", "hyundai"],
    "\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4": ["\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4", "toyota"],
    "\u05D9\u05D2\u05D5\u05D0\u05E8":       ["\u05D9\u05D2\u05D5\u05D0\u05E8", "jaguar"],
    "\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8": ["\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8", "\u05DC\u05E0\u05D3\u05E8\u05D5\u05D1\u05E8", "land rover"],
    "\u05DC\u05E7\u05E1\u05D5\u05E1":       ["\u05DC\u05E7\u05E1\u05D5\u05E1", "lexus"],
    "\u05DE\u05D0\u05D6\u05D3\u05D4":       ["\u05DE\u05D0\u05D6\u05D3\u05D4", "\u05DE\u05D6\u05D3\u05D4", "mazda"],
    "\u05DE\u05E8\u05E6\u05D3\u05E1":       ["\u05DE\u05E8\u05E6\u05D3\u05E1", "\u05DE\u05E8\u05E6\u05D3\u05E1-\u05D1\u05E0\u05E5", "mercedes", "mercedes-benz", "\u05DE\u05E8\u05E6\u05D3\u05E1 \u05D1\u05E0\u05E5"],
    "\u05DE\u05D9\u05E0\u05D9":             ["\u05DE\u05D9\u05E0\u05D9", "mini"],
    "\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9": ["\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9", "mitsubishi"],
    "\u05E0\u05D9\u05E1\u05DF":             ["\u05E0\u05D9\u05E1\u05DF", "nissan"],
    "\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5": ["\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5", "subaru"],
    "\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9": ["\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9", "suzuki"],
    "\u05E1\u05D9\u05D0\u05D8":             ["\u05E1\u05D9\u05D0\u05D8", "seat"],
    "\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF": ["\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF", "citroen"],
    "\u05E1\u05E7\u05D5\u05D3\u05D4":       ["\u05E1\u05E7\u05D5\u05D3\u05D4", "skoda"],
    "\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D0\u05D2\u05DF": ["\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D0\u05D2\u05DF", "\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF", "volkswagen", "vw"],
    "\u05E4\u05D5\u05E8\u05D3":             ["\u05E4\u05D5\u05E8\u05D3", "ford"],
    "\u05E4\u05D9\u05D0\u05D8":             ["\u05E4\u05D9\u05D0\u05D8", "fiat"],
    "\u05E4\u05D9\u05D6'\u05D5":             ["\u05E4\u05D9\u05D6'\u05D5", "\u05E4\u05D6'\u05D5", "\u05E4\u05D2'\u05D5", "peugeot"],
    "\u05E7\u05D5\u05E4\u05E8\u05D0":       ["\u05E7\u05D5\u05E4\u05E8\u05D0", "cupra"],
    "\u05E7\u05D9\u05D4":                   ["\u05E7\u05D9\u05D4", "kia"],
    "\u05E8\u05E0\u05D5":                   ["\u05E8\u05E0\u05D5", "renault"],
    "\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8": ["\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8", "chevrolet"],
    "\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5": ["\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5", "isuzu"],
    "\u05D1\u05D9.\u05D5\u05D5.\u05D3\u05D9": ["BYD", "\u05D1\u05D9.\u05D5\u05D5.\u05D3\u05D9"],
    "DS": ["DS", "\u05D3\u05D9.\u05D0\u05E1"],
    "MG": ["MG", "\u05D0\u05DE.\u05D2'\u05D9"],
    "\u05E4\u05D5\u05E8\u05E9\u05D4":       ["\u05E4\u05D5\u05E8\u05E9\u05D4", "porsche"],
    "\u05D5\u05D5\u05DC\u05D5\u05D5":       ["\u05D5\u05D5\u05DC\u05D5\u05D5", "volvo"],
    "\u05E7\u05E8\u05D9\u05D9\u05D6\u05DC\u05E8": ["\u05E7\u05E8\u05D9\u05D9\u05D6\u05DC\u05E8", "chrysler"],
    "\u05D3\u05D9\u05D9\u05D4\u05D5": ["\u05D3\u05D9\u05D9\u05D4\u05D5", "daewoo"],
    "\u05D3\u05D9\u05D9\u05D4\u05D8\u05E1\u05D5": ["\u05D3\u05D9\u05D9\u05D4\u05D8\u05E1\u05D5", "daihatsu"],
    "\u05D2\u05E8\u05D9\u05D9\u05D8 \u05D5\u05D5\u05DC": ["\u05D2\u05E8\u05D9\u05D9\u05D8 \u05D5\u05D5\u05DC", "great wall", "gwm", "haval"],
    "\u05E1\u05DE\u05D0\u05E8\u05D8": ["\u05E1\u05DE\u05D0\u05E8\u05D8", "smart"],
    "\u05E1\u05D0\u05E0\u05D2\u05D9\u05D5\u05E0\u05D2": ["\u05E1\u05D0\u05E0\u05D2\u05D9\u05D5\u05E0\u05D2", "ssangyong", "kgm"]
  };

  /* --- Merged Model Aliases (original + hotfix Audi A1-A8, Q2-Q8) --- */
  var MODELS = {
    "CR-V":       ["CRV", "CR-V", "\u05E1\u05D9\u05D0\u05E8\u05D5\u05D9"],
    "HR-V":       ["HRV", "HR-V"],
    "\u05D0\u05E7\u05D5\u05E8\u05D3":   ["\u05D0\u05E7\u05D5\u05E8\u05D3", "ACCORD"],
    "\u05E1\u05D9\u05D5\u05D5\u05D9\u05E7": ["\u05E1\u05D9\u05D5\u05D5\u05D9\u05E7", "CIVIC"],
    "\u05D2'\u05D0\u05D6":     ["\u05D2'\u05D0\u05D6", "\u05D2\u05D0\u05D6", "JAZZ"],
    "\u05E4\u05E1\u05D0\u05D8":   ["\u05E4\u05E1\u05D0\u05D8", "PASSAT"],
    "\u05D2\u05D5\u05DC\u05E3":   ["\u05D2\u05D5\u05DC\u05E3", "GOLF"],
    "\u05D2'\u05D8\u05D4":     ["\u05D2'\u05D8\u05D4", "\u05D2\u05D8\u05D4", "JETTA"],
    "\u05D8\u05D5\u05E8\u05D0\u05DF": ["\u05D8\u05D5\u05E8\u05D0\u05DF", "TOURAN"],
    "\u05E7\u05D0\u05D3\u05D9":   ["\u05E7\u05D0\u05D3\u05D9", "CADDY"],
    "\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF": ["\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF", "TIGUAN"],
    "\u05E4\u05D5\u05DC\u05D5":   ["\u05E4\u05D5\u05DC\u05D5", "POLO"],
    "\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4": ["\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4", "OCTAVIA"],
    "\u05E1\u05D5\u05E4\u05E8\u05D1": ["\u05E1\u05D5\u05E4\u05E8\u05D1", "SUPERB"],
    "\u05E4\u05D0\u05D1\u05D9\u05D4": ["\u05E4\u05D0\u05D1\u05D9\u05D4", "FABIA"],
    "\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4": ["\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4", "COROLLA"],
    "\u05E7\u05D0\u05DE\u05E8\u05D9": ["\u05E7\u05D0\u05DE\u05E8\u05D9", "CAMRY"],
    "\u05D9\u05D0\u05E8\u05D9\u05E1": ["\u05D9\u05D0\u05E8\u05D9\u05E1", "YARIS"],
    "\u05E8\u05D0\u05D5 4":   ["RAV4", "RAV 4", "\u05E8\u05D0\u05D5 4", "\u05E8\u05D0\u05D54"],
    "\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8": ["\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8", "LAND CRUISER", "LANDCRUISER"],
    "\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8 \u05E4\u05E8\u05D3\u05D5": ["\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8 \u05E4\u05E8\u05D3\u05D5", "PRADO"],
    "C-HR":       ["CHR", "C-HR"],
    "\u05D4\u05D9\u05D9\u05DC\u05D5\u05E7\u05E1": ["\u05D4\u05D9\u05D9\u05DC\u05D5\u05E7\u05E1", "HILUX"],
    "\u05D0\u05D5\u05E8\u05D9\u05E1": ["\u05D0\u05D5\u05E8\u05D9\u05E1", "AURIS"],
    "\u05D0\u05D9\u05D9\u05D2\u05D5": ["\u05D0\u05D9\u05D9\u05D2\u05D5", "AYGO"],
    "\u05D8\u05D5\u05E7\u05E1\u05D5\u05DF": ["\u05D8\u05D5\u05E7\u05E1\u05D5\u05DF", "TUCSON"],
    "IX35":       ["IX35", "I35", "ix35"],
    "I30":        ["I30", "i30"],
    "I20":        ["I20", "i20"],
    "I10":        ["I10", "i10"],
    "\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4": ["\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4", "ELANTRA"],
    "\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4": ["\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4", "\u05E1\u05E0\u05D8\u05D4\u05E4\u05D4", "SANTA FE"],
    "\u05E7\u05D5\u05E0\u05D4":   ["\u05E7\u05D5\u05E0\u05D4", "KONA"],
    "\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6'": ["\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6'", "\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6", "SPORTAGE"],
    "\u05E4\u05D5\u05E8\u05D8\u05D4": ["\u05E4\u05D5\u05E8\u05D8\u05D4", "FORTE"],
    "\u05E1\u05D9\u05D3":     ["\u05E1\u05D9\u05D3", "CEED", "CEE'D"],
    "\u05E7\u05E8\u05E0\u05E1": ["\u05E7\u05E8\u05E0\u05E1", "CARENS"],
    "\u05E0\u05D9\u05E8\u05D5": ["\u05E0\u05D9\u05E8\u05D5", "NIRO"],
    "\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5": ["\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5", "PICANTO"],
    "\u05D0\u05E1\u05D8\u05E8\u05D4": ["\u05D0\u05E1\u05D8\u05E8\u05D4", "ASTRA"],
    "\u05E7\u05D5\u05E8\u05E1\u05D4": ["\u05E7\u05D5\u05E8\u05E1\u05D4", "CORSA"],
    "\u05DE\u05D5\u05E7\u05D4": ["\u05DE\u05D5\u05E7\u05D4", "MOKKA"],
    "\u05D6\u05D0\u05E4\u05D9\u05E8\u05D4": ["\u05D6\u05D0\u05E4\u05D9\u05E8\u05D4", "ZAFIRA"],
    "\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3": ["\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3", "GRANDLAND"],
    "\u05DE\u05D9\u05E7\u05E8\u05D4": ["\u05DE\u05D9\u05E7\u05E8\u05D4", "MICRA"],
    "\u05E7\u05E9\u05E7\u05D0\u05D9": ["\u05E7\u05E9\u05E7\u05D0\u05D9", "QASHQAI"],
    "X-TRAIL":    ["X-TRAIL", "XTRAIL", "\u05D0\u05E7\u05E1\u05D8\u05E8\u05D9\u05D9\u05DC"],
    "\u05D2'\u05D5\u05E7":     ["\u05D2'\u05D5\u05E7", "\u05D2\u05D5\u05E7", "JUKE"],
    "\u05DC\u05D9\u05E3":     ["\u05DC\u05D9\u05E3", "LEAF"],
    "\u05DC\u05D0\u05D5\u05DF": ["\u05DC\u05D0\u05D5\u05DF", "LEON"],
    "\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4": ["\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4", "IBIZA"],
    "\u05D3\u05D5\u05D1\u05DC\u05D5": ["\u05D3\u05D5\u05D1\u05DC\u05D5", "DOBLO"],
    "\u05E4\u05D5\u05E0\u05D8\u05D5": ["\u05E4\u05D5\u05E0\u05D8\u05D5", "PUNTO"],
    "500X":       ["500X", "500 X"],
    "500":        ["500"],
    "\u05D3\u05D9\u05DE\u05E7\u05E1": ["\u05D3\u05D9\u05DE\u05E7\u05E1", "D-MAX", "DMAX"],
    "\u05E1\u05D5\u05D9\u05E4\u05D8": ["\u05E1\u05D5\u05D9\u05E4\u05D8", "SWIFT"],
    "\u05D2'\u05D9\u05DE\u05E0\u05D9": ["\u05D2'\u05D9\u05DE\u05E0\u05D9", "\u05D2\u05D9\u05DE\u05D9\u05E0\u05D9", "JIMNY"],
    "\u05D5\u05D9\u05D8\u05E8\u05D4": ["\u05D5\u05D9\u05D8\u05E8\u05D4", "VITARA"],
    "\u05E1\u05DC\u05E8\u05D9\u05D5": ["\u05E1\u05DC\u05E8\u05D9\u05D5", "CELERIO"],
    "\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4": ["\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4", "IMPREZA"],
    "\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8": ["\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8", "FORESTER"],
    "\u05D0\u05D5\u05D8\u05D1\u05E7": ["\u05D0\u05D5\u05D8\u05D1\u05E7", "OUTBACK"],
    "XV":         ["XV"],
    "\u05DC\u05E0\u05E1\u05E8": ["\u05DC\u05E0\u05E1\u05E8", "LANCER"],
    "\u05D0\u05D5\u05D8\u05DC\u05E0\u05D3\u05E8": ["\u05D0\u05D5\u05D8\u05DC\u05E0\u05D3\u05E8", "OUTLANDER"],
    "\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8": ["\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8", "SPACE STAR", "\u05DE\u05D9\u05E8\u05D0\u05D6'"],
    "\u05D0\u05D8\u05E8\u05D0\u05D6'": ["\u05D0\u05D8\u05E8\u05D0\u05D6'", "ATTRAGE"],
    "\u05E4\u05D0\u05D2'\u05E8\u05D5": ["\u05E4\u05D0\u05D2'\u05E8\u05D5", "PAJERO"],
    "\u05E8\u05D9\u05D9\u05E0\u05D2'\u05E8": ["\u05E8\u05D9\u05D9\u05E0\u05D2'\u05E8", "RANGER"],
    "\u05E7\u05DC\u05D9\u05D0\u05D5": ["\u05E7\u05DC\u05D9\u05D0\u05D5", "CLIO"],
    "\u05DE\u05D2\u05D0\u05DF": ["\u05DE\u05D2\u05D0\u05DF", "MEGANE"],
    "\u05E7\u05E4\u05D8\u05D5\u05E8": ["\u05E7\u05E4\u05D8\u05D5\u05E8", "CAPTUR"],
    "\u05E7\u05E8\u05D5\u05D6": ["\u05E7\u05E8\u05D5\u05D6", "CRUZE"],
    "\u05E4\u05D5\u05E7\u05D5\u05E1": ["\u05E4\u05D5\u05E7\u05D5\u05E1", "FOCUS"],
    "\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4": ["\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4", "FIESTA"],
    "\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05D5": ["\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05D5", "MONDEO"],
    "\u05E7\u05D5\u05D2\u05D4": ["\u05E7\u05D5\u05D2\u05D4", "KUGA"],
    "\u05E4\u05D5\u05DE\u05D4": ["\u05E4\u05D5\u05DE\u05D4", "PUMA"],
    "C4 \u05E4\u05D9\u05E7\u05E1\u05D5": ["C4 \u05E4\u05D9\u05E7\u05E1\u05D5", "C4 PICASSO", "\u05E4\u05D9\u05E7\u05E1\u05D5"],
    "\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5": ["\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5", "BERLINGO"],
    "C3": ["C3"], "C4": ["C4"], "C5": ["C5"],
    "307": ["307"], "308": ["308"], "208": ["208"],
    "2008": ["2008"], "3008": ["3008"], "5008": ["5008"],
    "206": ["206"], "207": ["207"], "301": ["301"],
    "407": ["407"], "508": ["508"],
    "\u05E4\u05E8\u05D8\u05E0\u05E8": ["\u05E4\u05E8\u05D8\u05E0\u05E8", "PARTNER"],
    "2": ["2"], "3": ["3"], "5": ["5"], "6": ["6"],
    "CX-3": ["CX-3", "CX3"],
    "CX-5": ["CX-5", "CX5"],
    "CX-30": ["CX-30", "CX30"],
    "CX-90": ["CX-90", "CX90"],
    "\u05D3\u05D9\u05E1\u05E7\u05D1\u05E8\u05D9": ["\u05D3\u05D9\u05E1\u05E7\u05D1\u05E8\u05D9", "DISCOVERY"],
    "\u05E8\u05D9\u05D9\u05E0\u05D2' \u05E8\u05D5\u05D1\u05E8": ["\u05E8\u05D9\u05D9\u05E0\u05D2' \u05E8\u05D5\u05D1\u05E8", "RANGE ROVER"],
    "\u05D3\u05D9\u05E4\u05E0\u05D3\u05E8": ["\u05D3\u05D9\u05E4\u05E0\u05D3\u05E8", "DEFENDER"],
    "\u05D0\u05D5\u05D5\u05E0\u05E1\u05D9\u05E1": ["\u05D0\u05D5\u05D5\u05E0\u05E1\u05D9\u05E1", "AVENSIS"],
    "\u05E4\u05E8\u05D5\u05D5\u05D9\u05D4": ["\u05E4\u05E8\u05D5\u05D5\u05D9\u05D4", "PREVIA"],
    "\u05D5\u05E8\u05E1\u05D5": ["\u05D5\u05E8\u05E1\u05D5", "VERSO"],
    "\u05E4\u05E8\u05D9\u05D5\u05E1": ["\u05E4\u05E8\u05D9\u05D5\u05E1", "PRIUS"],
    "\u05D4\u05D9\u05D9\u05DC\u05E0\u05D3\u05E8": ["\u05D4\u05D9\u05D9\u05DC\u05E0\u05D3\u05E8", "HIGHLANDER"],
    "\u05E1\u05D5\u05E4\u05E8\u05D4": ["\u05E1\u05D5\u05E4\u05E8\u05D4", "SUPRA"],
    "\u05D1\u05D5\u05E7\u05E1\u05D8\u05E8": ["\u05D1\u05D5\u05E7\u05E1\u05D8\u05E8", "BOXSTER", "718 BOXSTER"],
    "\u05E7\u05D9\u05D9\u05DE\u05DF": ["\u05E7\u05D9\u05D9\u05DE\u05DF", "CAYMAN", "718 CAYMAN"],
    "\u05E7\u05D0\u05D9\u05D9\u05DF": ["\u05E7\u05D0\u05D9\u05D9\u05DF", "CAYENNE"],
    "\u05DE\u05E7\u05D0\u05DF": ["\u05DE\u05E7\u05D0\u05DF", "MACAN"],
    "\u05E4\u05E0\u05DE\u05E8\u05D4": ["\u05E4\u05E0\u05DE\u05E8\u05D4", "PANAMERA"],
    "\u05D8\u05D9\u05D9\u05E7\u05DF": ["\u05D8\u05D9\u05D9\u05E7\u05DF", "TAYCAN"],
    /* Audi models (from hotfix) */
    "A1": ["A1"], "A3": ["A3"], "A4": ["A4"], "A5": ["A5"],
    "A6": ["A6"], "A8": ["A8"],
    "Q2": ["Q2"], "Q3": ["Q3"], "Q5": ["Q5"], "Q7": ["Q7"], "Q8": ["Q8"]
  };

  /* --- Category Images (AUTODOC-style tiles) --- */
  var CAT_IMAGES = {
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8":   "https://i.imgur.com/g1qfgUD.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF":         "https://i.imgur.com/ESCTGoc.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF":   "https://i.imgur.com/9ZZ5pgy.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8":   "https://i.imgur.com/fBL6Sn4.png",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD":   "https://i.imgur.com/m39rCVF.png",
    "\u05DE\u05E6\u05EA\u05D9\u05DD":                             "https://i.imgur.com/L6FPX9R.png",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4":         "https://i.imgur.com/onOUmJJ.png",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD": "https://i.imgur.com/mHsOCQm.png",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD":                 "https://i.imgur.com/8n7O8pR.png",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF": "https://i.imgur.com/wqqrabP.png",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2": "https://i.imgur.com/2evfe27.png",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2":   "https://i.imgur.com/vIYvD2N.png",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3":                     "https://i.imgur.com/MzSSq9W.png",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD": "https://i.imgur.com/QJZhGK4.png",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7": "https://i.imgur.com/Lvj6TOq.png",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5": "https://i.imgur.com/a24nQJS.png",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8": "https://i.imgur.com/3AVB5iw.png",
    "\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA": "https://i.imgur.com/YHF5JGW.png",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC": "https://i.imgur.com/9EB3uy6.png",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF":               "https://i.imgur.com/WRiZaMn.png",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1":         "https://i.imgur.com/S1ZSZTp.png",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8":   "https://i.imgur.com/1HBbM50.png",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4":                     "https://i.imgur.com/HngAfcl.png"
  };

  /* --- Category display order (skip חלקי אספנות) --- */
  var CAT_ORDER = [
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD",
    "\u05DE\u05E6\u05EA\u05D9\u05DD",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4"
  ];


  /* ----------------------------------------------------------
   *  UTILITIES
   * ---------------------------------------------------------- */

  /** Normalise text for fuzzy matching: lowercase, strip dashes/dots/quotes, collapse whitespace */
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[-.'"\u05F3\u05F4]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Strip model-name generation suffixes (B7, MK3, Avant, Sportback, etc.) */
  function stripSuffix(name) {
    return name
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s+[A-Z]{1,3}\d{2,3}$/i, '')
      .replace(/\s+_[A-Z0-9]+_$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Parse CSV row respecting quoted fields */
  function parseCSVRow(line) {
    var cols = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (inQ && i + 1 < line.length && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQ = !inQ; }
      } else if (c === ',' && !inQ) {
        cols.push(cur.trim()); cur = '';
      } else { cur += c; }
    }
    cols.push(cur.trim());
    return cols;
  }

  /** Read URL search params (without URLSearchParams for IE compat) */
  function getParam(name) {
    var qs = window.location.search.substring(1);
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split('=');
      if (decodeURIComponent(kv[0]) === name) {
        return decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      }
    }
    return '';
  }

  /** Safe element getter */
  function $(id) { return document.getElementById(id); }

  /** Escape HTML */
  function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }


  /* ----------------------------------------------------------
   *  ALIAS RESOLUTION
   * ---------------------------------------------------------- */

  /** Given a brand_he or mfr value, return array of normalised aliases */
  function resolveBrand(raw) {
    var n = norm(raw);
    for (var key in BRANDS) {
      var aliases = BRANDS[key];
      for (var i = 0; i < aliases.length; i++) {
        if (norm(aliases[i]) === n) return aliases.map(norm);
      }
    }
    return n ? [n] : [];
  }

  /** Given a model_he/model_en value, return array of normalised aliases */
  function resolveModel(raw) {
    var stripped = stripSuffix(raw);
    var n = norm(stripped);
    for (var key in MODELS) {
      var aliases = MODELS[key];
      for (var i = 0; i < aliases.length; i++) {
        if (norm(aliases[i]) === n) return aliases.map(norm);
      }
    }
    /* Also try the un-stripped version */
    var n2 = norm(raw);
    if (n2 !== n) {
      for (var key2 in MODELS) {
        var aliases2 = MODELS[key2];
        for (var j = 0; j < aliases2.length; j++) {
          if (norm(aliases2[j]) === n2) return aliases2.map(norm);
        }
      }
    }
    return n ? [n] : [];
  }


  /* ----------------------------------------------------------
   *  CSV FETCH (single fetch, cached)
   * ---------------------------------------------------------- */

  var csvRows = null;   /* cached parsed rows */
  var csvError = false;

  function fetchCSV(cb) {
    if (csvRows) { cb(csvRows); return; }
    if (csvError) { cb([]); return; }

    var x = new XMLHttpRequest();
    x.open('GET', SHEET_URL, true);
    x.timeout = 15000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        var lines = x.responseText.split('\n');
        csvRows = [];
        /* Skip header row (index 0) */
        for (var i = 1; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          var cols = parseCSVRow(line);
          if (cols.length >= 7) csvRows.push(cols);
        }
        cb(csvRows);
      } else {
        csvError = true;
        cb([]);
      }
    };
    x.onerror = x.ontimeout = function () { csvError = true; cb([]); };
    x.send();
  }


  /* ----------------------------------------------------------
   *  PRODUCT MATCHING
   * ---------------------------------------------------------- */

  /**
   * All known vehicle brand names (Hebrew) for brand-carry-forward logic.
   * When scanning comma-separated vehicle lists like
   * "טויוטה קורולה, אבנסיס, ראב4" the brand טויוטה carries forward
   * to entries that don't introduce a new brand.
   */
  var ALL_BRANDS_HE = [
    '\u05d8\u05d5\u05d9\u05d5\u05d8\u05d4','\u05d4\u05d5\u05e0\u05d3\u05d4','\u05de\u05d6\u05d3\u05d4',
    '\u05e0\u05d9\u05e1\u05df','\u05de\u05d9\u05e6\u05d5\u05d1\u05d9\u05e9\u05d9','\u05e1\u05d5\u05d1\u05d0\u05e8\u05d5',
    '\u05d9\u05d5\u05e0\u05d3\u05d0\u05d9','\u05e7\u05d9\u05d4','\u05e4\u05d5\u05dc\u05e7\u05e1\u05d5\u05d5\u05d2\u05df',
    '\u05d0\u05d0\u05d5\u05d3\u05d9','\u05e1\u05e7\u05d5\u05d3\u05d4','\u05e1\u05d9\u05d0\u05d8',
    '\u05e4\u05d9\u05d0\u05d8','\u05d0\u05dc\u05e4\u05d0 \u05e8\u05d5\u05de\u05d0\u05d5',
    "\u05e4\u05d2\u05f3\u05d5",'\u05e1\u05d9\u05d8\u05e8\u05d5\u05d0\u05df','\u05e8\u05e0\u05d5',
    '\u05d0\u05d5\u05e4\u05dc','\u05e9\u05d1\u05e8\u05d5\u05dc\u05d4','\u05e4\u05d5\u05e8\u05d3',
    '\u05d1.\u05de.\u05d5\u05d5','\u05de\u05e8\u05e6\u05d3\u05e1','\u05d5\u05d5\u05dc\u05d5\u05d5',
    '\u05e1\u05d5\u05d6\u05d5\u05e7\u05d9','\u05d3\u05d9\u05d9\u05d4\u05d8\u05e1\u05d5',
    '\u05d0\u05d9\u05e1\u05d5\u05d6\u05d5',"\u05d2\u05f3\u05d9\u05e4",'\u05dc\u05e0\u05d3 \u05e8\u05d5\u05d1\u05e8',
    "\u05d2\u05f3\u05d0\u05d2\u05d5\u05d0\u05e8",'\u05de\u05d9\u05e0\u05d9',"\u05d3\u05d0\u05e6\u05f3\u05d9\u05d4",
    '\u05de\u05d9\u05e0\u05d9\u05e7\u05d5\u05e4\u05e8','\u05e1\u05e1\u05d0\u05e0\u05d2 \u05d9\u05d5\u05e0\u05d2'
  ];
  var ALL_BRANDS_NORM = [];
  for (var _bi = 0; _bi < ALL_BRANDS_HE.length; _bi++) ALL_BRANDS_NORM.push(norm(ALL_BRANDS_HE[_bi]));

  /**
   * Check if a comma-separated vehicle field matches brand+model,
   * using brand-carry-forward logic.
   * e.g. "טויוטה קורולה, אבנסיס, ראב4" – brand טויוטה carries forward.
   * Searching brand=טויוטה model=אבנסיס matches because אבנסיס
   * inherits the טויוטה brand from the first entry.
   * But "טויוטה היילקס, סקודה אוקטביה" searching for טויוטה אוקטביה
   * does NOT match because אוקטביה is under סקודה brand.
   */
  function fieldMatches(field, brandAliases, modelAliases) {
    if (!field) return false;
    var parts = field.split(',');
    var currentBrand = '';
    for (var p = 0; p < parts.length; p++) {
      var n = norm(parts[p]);
      /* Detect if this entry introduces a new brand (any known brand) */
      var entryBrand = '';
      for (var ab = 0; ab < ALL_BRANDS_NORM.length; ab++) {
        if (n.indexOf(ALL_BRANDS_NORM[ab]) !== -1) {
          entryBrand = ALL_BRANDS_NORM[ab];
          break;
        }
      }
      if (entryBrand) currentBrand = entryBrand;
      /* Check if current entry (under currentBrand) matches search */
      var matchesBrand = false;
      for (var b = 0; b < brandAliases.length; b++) {
        if (currentBrand && currentBrand.indexOf(brandAliases[b]) !== -1) {
          matchesBrand = true; break;
        }
        /* Also check entry text directly for brand */
        if (n.indexOf(brandAliases[b]) !== -1) {
          matchesBrand = true; break;
        }
      }
      if (!matchesBrand) continue;
      var matchesModel = false;
      for (var m = 0; m < modelAliases.length; m++) {
        if (n.indexOf(modelAliases[m]) !== -1) {
          matchesModel = true; break;
        }
      }
      if (matchesBrand && matchesModel) return true;
    }
    return false;
  }

  /**
   * Check if a selected year falls within a product's year range.
   * Formats: "1982-2006", "2010-2020", "2015+", "2005"
   * Returns true if year is in range OR if no year data is available.
   */
  function yearInRange(yearsStr, selectedYear) {
    if (!selectedYear) return true;   /* no year filter */
    if (!yearsStr) return false;      /* no year data — EXCLUDE from results */
    var y = parseInt(selectedYear, 10);
    if (isNaN(y)) return true;
    var clean = yearsStr.replace(/"/g, '').trim();
    /* Try range: "YYYY-YYYY" */
    var m = clean.match(/(\d{4})\s*[-–]\s*(\d{4})/);
    if (m) {
      var lo = parseInt(m[1], 10);
      var hi = parseInt(m[2], 10);
      return y >= lo && y <= hi;
    }
    /* Try open-ended: "YYYY+" or "מYYYY" */
    m = clean.match(/(\d{4})\s*[+]/);
    if (m) return y >= parseInt(m[1], 10);
    /* Single year */
    m = clean.match(/(\d{4})/);
    if (m) return y === parseInt(m[1], 10);
    return true; /* unrecognized format — include */
  }

  /**
   * Match products from CSV rows against selected vehicle.
   * selectedYear: the year chosen in the finder (string, e.g. "2017")
   * Returns object keyed by category name, each value is array of product objects.
   */
  function matchProducts(rows, brandAliases, modelAliases, selectedYear) {
    var results = {};
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var id       = r[0] || '';
      var name     = r[1] || '';
      var category = (r[2] || '').trim();
      var partCode = r[3] || '';
      var tecdocMfr   = r[4] || '';
      var tecdocModel = r[5] || '';
      var years    = r[6] || '';
      var vehicles = r[7] || '';
      var source   = r[8] || '';
      var link     = r[9] || '';

      if (!category || !id) continue;

      /* ---- Determine match type ---- */
      var matched = false;
      var hasTecDoc = !!(tecdocMfr.trim() || tecdocModel.trim());
      var hasYears  = !!years.trim();

      /* Priority 1: column 7 – vehicles from title */
      matched = fieldMatches(vehicles, brandAliases, modelAliases);

      /* Priority 2: columns 4+5 – TecDoc manufacturer + models */
      if (!matched) {
        var combined = tecdocMfr + ',' + tecdocModel;
        matched = fieldMatches(combined, brandAliases, modelAliases);
      }

      /* Priority 3: column 1 – product name */
      if (!matched) {
        matched = fieldMatches(name, brandAliases, modelAliases);
      }

      if (!matched) continue;

      /* ---- Year/Generation verification ---- */
      /* A product matches brand+model. Now verify it fits the selected year/generation. */

      if (hasTecDoc && hasYears) {
        /* Has TecDoc data AND year data — use year range check */
        if (!yearInRange(years, selectedYear)) continue;
      } else if (hasTecDoc) {
        /* Has TecDoc data but no explicit year range — TecDoc models are generation-specific, trust the match */
        /* (TecDoc model codes like _E18_ already represent specific generations) */
      } else if (hasYears) {
        /* No TecDoc but has year data (from title parsing) — use year range check */
        if (!yearInRange(years, selectedYear)) continue;
      } else {
        /* No TecDoc data AND no year data — cannot verify generation fit, EXCLUDE */
        continue;
      }

      /* ---- Skip products without TecDoc part code ---- */
      var cleanCode = partCode.replace(/"/g, '').trim();
      if (!cleanCode) continue;

      if (!results[category]) results[category] = [];

      /* ---- Deduplicate: skip if same product ID already in this category ---- */
      var cleanId = id.replace(/"/g, '');
      var dominated = false;
      for (var di = 0; di < results[category].length; di++) {
        if (results[category][di].id === cleanId) { dominated = true; break; }
      }
      if (dominated) continue;

      results[category].push({
        id: cleanId,
        name: name.replace(/"/g, ''),
        category: category.replace(/"/g, ''),
        partCode: cleanCode,
        years: years.replace(/"/g, ''),
        source: source.replace(/"/g, ''),
        link: (link || '').replace(/"/g, '')
      });
    }
    return results;
  }


  /* ----------------------------------------------------------
   *  TecDoc JSON VERIFICATION – validate products against
   *  real TecDoc vehicle compatibility data stored in JSON files.
   *  This ensures only parts that TecDoc confirms for the
   *  selected manufacturer+model+year are shown.
   * ---------------------------------------------------------- */

  /**
   * Extract base model name from vehicleData model key.
   * e.g. "COROLLA (דור 10) E150" → "COROLLA"
   *      "GOLF (דור 7) MK7"     → "GOLF"
   *      "COROLLA CROSS"          → "COROLLA CROSS"
   *      "RAV4 (דור 5) XA50"    → "RAV4"
   */
  function extractBaseModel(modelKey) {
    if (!modelKey) return '';
    /* Remove Hebrew generation info and trailing code: "(דור N) XXXX" */
    var cleaned = modelKey.replace(/\s*\(\u05d3\u05d5\u05e8\s+\d+\)\s*[A-Z]*\d*/g, '').trim();
    return cleaned || modelKey.split('(')[0].trim();
  }

  /**
   * Check if a TecDoc vehicle entry matches the selected vehicle.
   * Uses manufacturer + base model name + year overlap for precise matching.
   *
   * mfrEn: English manufacturer name from URL param (e.g. "TOYOTA")
   * baseModel: base model extracted from vehicleData key (e.g. "COROLLA")
   * selectedYear: year string (e.g. "2011")
   */
  function tecdocVehicleMatches(vehicle, mfrEn, baseModel, selectedYear) {
    if (!vehicle) return false;

    /* 1. Check manufacturer */
    var vMfr = (vehicle.manufacturerName || '').toUpperCase();
    var searchMfr = mfrEn.toUpperCase();
    /* Allow partial matches for manufacturer variants: TOYOTA (FAW), FORD (CHANGAN), etc. */
    var mfrOk = (vMfr.indexOf(searchMfr) !== -1 || searchMfr.indexOf(vMfr) !== -1);
    /* Special case: VW ↔ VOLKSWAGEN */
    if (!mfrOk) {
      mfrOk = (searchMfr === 'VW' && vMfr.indexOf('VW') !== -1) ||
              (searchMfr === 'VOLKSWAGEN' && vMfr.indexOf('VW') !== -1) ||
              (vMfr === 'VW' && searchMfr.indexOf('VOLKSWAGEN') !== -1);
    }
    if (!mfrOk) return false;

    /* 2. Check base model name appears in TecDoc model name */
    if (baseModel) {
      var vModel = (vehicle.modelName || '').toUpperCase();
      var searchModel = baseModel.toUpperCase();
      if (vModel.indexOf(searchModel) === -1) {
        return false;
      }
    }

    /* 3. Check year overlap (critical for generation accuracy) */
    if (selectedYear) {
      var y = parseInt(selectedYear, 10);
      if (!isNaN(y)) {
        var startStr = vehicle.constructionIntervalStart || '';
        var endStr = vehicle.constructionIntervalEnd || '';
        var startYear = startStr ? parseInt(startStr.substring(0, 4), 10) : 0;
        var endYear = endStr ? parseInt(endStr.substring(0, 4), 10) : 9999;
        if (isNaN(startYear)) startYear = 0;
        if (isNaN(endYear)) endYear = 9999;
        if (y < startYear || y > endYear) return false;
      }
    }
    return true;
  }

  /**
   * Fetch TecDoc JSON for a part code and check vehicle compatibility.
   * Calls cb(true) if the part fits, cb(false) otherwise.
   */
  function verifyPartTecDoc(partCode, mfrEn, baseModel, selectedYear, cb) {
    if (!partCode) { cb(false); return; }
    var url = TECDOC_DATA_BASE + encodeURIComponent(partCode) + '.json';
    var x = new XMLHttpRequest();
    x.open('GET', url, true);
    x.timeout = 8000;
    x.onreadystatechange = function () {
      if (x.readyState === 4) {
        if (x.status === 200) {
          try {
            var data = JSON.parse(x.responseText);
            var vehicles = data.vehicles || [];
            for (var i = 0; i < vehicles.length; i++) {
              if (tecdocVehicleMatches(vehicles[i], mfrEn, baseModel, selectedYear)) {
                cb(true);
                return;
              }
            }
            cb(false);
          } catch (e) {
            cb(true); /* parse error — don’t exclude */
          }
        } else if (x.status === 404) {
          cb(false); /* no TecDoc file — exclude */
        } else {
          cb(true); /* network error — don’t exclude */
        }
      }
    };
    x.onerror = x.ontimeout = function () { cb(true); };
    x.send();
  }

  /**
   * Verify all matched products against TecDoc JSON data.
   * For each product, fetches its TecDoc JSON and checks if any
   * vehicle entry matches the selected manufacturer + model + year.
   *
   * mfrEn:      English manufacturer key  (e.g. "TOYOTA")
   * modelKey:   vehicleData model key      (e.g. "COROLLA (דור 10) E150")
   * selectedYear: year string              (e.g. "2011")
   * cb:         callback receiving filtered results
   */
  function verifyWithTecDoc(matched, mfrEn, modelKey, selectedYear, cb) {
    var baseModel = extractBaseModel(modelKey);
    var categories = Object.keys(matched);
    var totalProducts = 0;
    var checkedProducts = 0;
    var verified = {};

    /* Count total products */
    for (var ci = 0; ci < categories.length; ci++) {
      totalProducts += matched[categories[ci]].length;
    }

    if (totalProducts === 0) { cb({}); return; }

    /* Verify each product in parallel */
    for (var c = 0; c < categories.length; c++) {
      var catName = categories[c];
      var products = matched[catName];
      for (var p = 0; p < products.length; p++) {
        (function (cat, product) {
          verifyPartTecDoc(product.partCode, mfrEn, baseModel, selectedYear, function (isMatch) {
            if (isMatch) {
              if (!verified[cat]) verified[cat] = [];
              verified[cat].push(product);
            }
            checkedProducts++;
            if (checkedProducts === totalProducts) {
              cb(verified);
            }
          });
        })(catName, products[p]);
      }
    }
  }


  /* ----------------------------------------------------------
   *  PAGE ACTIVATION – hide default content, show results
   * ---------------------------------------------------------- */

  function activatePage() {
    document.body.classList.add('an-results-active');

    var middle = $('bg_middle');
    var rp = $('anResultsPage');
    if (!rp) return;

    /* Move results section INTO #bg_middle so it appears
       in the main content area, between header and footer. */
    if (middle && rp.parentNode !== middle) {
      middle.appendChild(rp);
    }

    /* Hide page-specific content inside #bg_middle,
       keep site header (#bg_header) and footer (#bg_footer) visible. */
    if (middle) {
      var kids = middle.children;
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'LINK') continue;
        if (el === rp) continue;
        el.style.display = 'none';
      }
    }

    rp.style.display = 'block';
  }


  /* ----------------------------------------------------------
   *  RENDER: Category Grid (AUTODOC-style tiles)
   * ---------------------------------------------------------- */

  function renderCategories(matched, brandHe, modelHe) {
    var catGrid = $('anCatGrid');
    var sidebar = $('anCatSidebarList');
    if (!catGrid) return;

    catGrid.innerHTML = '';
    if (sidebar) sidebar.innerHTML = '';

    /* Build ordered list of categories that have matches */
    var ordered = [];
    for (var c = 0; c < CAT_ORDER.length; c++) {
      var cat = CAT_ORDER[c];
      if (matched[cat] && matched[cat].length > 0) {
        ordered.push(cat);
      }
    }
    /* Add any categories not in CAT_ORDER (except חלקי אספנות) */
    for (var cat2 in matched) {
      if (cat2 === '\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA') continue;
      if (ordered.indexOf(cat2) === -1 && matched[cat2].length > 0) {
        ordered.push(cat2);
      }
    }

    if (ordered.length === 0) {
      showEmpty(brandHe, modelHe);
      return;
    }

    /* Set page title */
    var pageTitle = $('anCatPageTitle');
    if (pageTitle) {
      pageTitle.textContent = '\u05D1\u05D7\u05E8 \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05E2\u05D1\u05D5\u05E8 ' +
        (brandHe || '') + ' ' + (modelHe || '');
    }

    for (var k = 0; k < ordered.length; k++) {
      var catName = ordered[k];
      var count = matched[catName].length;
      var img = CAT_IMAGES[catName] || '';

      /* Grid tile */
      var tile = document.createElement('div');
      tile.className = 'an-cat-tile';
      tile.setAttribute('data-cat', catName);
      tile.innerHTML =
        (img ? '<img src="' + esc(img) + '" alt="' + esc(catName) + '" class="an-cat-img" loading="lazy">' : '') +
        '<div class="an-cat-name">' + esc(catName) + '</div>' +
        '<div class="an-cat-count">' + count + ' \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD</div>';
      tile.addEventListener('click', (function (cn) {
        return function () { showProducts(cn, matched); };
      })(catName));
      catGrid.appendChild(tile);

      /* Sidebar entry */
      if (sidebar) {
        var li = document.createElement('li');
        li.className = 'an-sidebar-item';
        li.setAttribute('data-cat', catName);
        li.innerHTML = '<span class="an-sidebar-name">' + esc(catName) + '</span>' +
          '<span class="an-sidebar-count">' + count + '</span>';
        li.addEventListener('click', (function (cn) {
          return function () { showProducts(cn, matched); };
        })(catName));
        sidebar.appendChild(li);
      }
    }

    /* Category search filter */
    var searchInput = $('anCatSearchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.addEventListener('input', function () {
        var q = norm(this.value);
        var tiles = catGrid.querySelectorAll('.an-cat-tile');
        for (var t = 0; t < tiles.length; t++) {
          var cn = tiles[t].getAttribute('data-cat') || '';
          tiles[t].style.display = (!q || norm(cn).indexOf(q) !== -1) ? '' : 'none';
        }
        if (sidebar) {
          var items = sidebar.querySelectorAll('.an-sidebar-item');
          for (var s = 0; s < items.length; s++) {
            var sn = items[s].getAttribute('data-cat') || '';
            items[s].style.display = (!q || norm(sn).indexOf(q) !== -1) ? '' : 'none';
          }
        }
      });
    }

    /* Show category view, hide products view */
    var catView = $('anCategoryView');
    var prodView = $('anProductsView');
    if (catView) catView.style.display = '';
    if (prodView) prodView.style.display = 'none';
  }


  /* ----------------------------------------------------------
   *  RENDER: Products list for a category
   * ---------------------------------------------------------- */

  /* Known aftermarket parts brands for logo detection */
  var KNOWN_PART_BRANDS = ['MANN','BOSCH','MAHLE','HENGST','DENSO','NGK','VALEO','SACHS','LUK','TRW','BREMBO','DAYCO','GATES','CONTINENTAL','SKF','INA','FAG','FEBI','MEYLE','LEMFORDER','BLUE PRINT','PURFLUX','FILTRON','KNECHT','CHAMPION','DELPHI','NTK','Hi-Q','CTR','555','GMB','AISIN','KOYO','NTN','SNR'];
  var LOGOS_BASE = 'https://autonahariya-a11y.github.io/tecdoc-data/data/logos/';

  function showProducts(catName, matched) {
    var products = matched[catName] || [];
    var prodGrid = $('anProductsGrid');
    var prodView = $('anProductsView');
    var catView  = $('anCategoryView');
    var catTitle = $('anProductsCatTitle');
    var countEl  = $('anProductsCount');

    if (!prodGrid || !prodView) return;

    /* Switch views */
    if (catView) catView.style.display = 'none';
    prodView.style.display = '';

    /* Set header */
    if (catTitle) catTitle.textContent = catName;
    if (countEl) countEl.textContent = products.length + ' \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD';

    /* Detect unique parts brands for filter bar */
    var brandSet = {};
    for (var bi = 0; bi < products.length; bi++) {
      var pName = products[bi].name.toUpperCase();
      for (var bk = 0; bk < KNOWN_PART_BRANDS.length; bk++) {
        if (pName.indexOf(KNOWN_PART_BRANDS[bk]) !== -1) {
          brandSet[KNOWN_PART_BRANDS[bk]] = true;
          break;
        }
      }
    }

    /* Insert brand filter bar before grid */
    var existingBar = prodView.querySelector('.an-brand-filter-bar');
    if (existingBar) existingBar.remove();
    var brandKeys = Object.keys(brandSet).sort();
    if (brandKeys.length > 1) {
      var bar = document.createElement('div');
      bar.className = 'an-brand-filter-bar';
      bar.innerHTML = '<span class="an-brand-chip an-brand-chip-all active" data-brand="all">\u05D4\u05DB\u05DC (' + products.length + ')</span>';
      for (var bci = 0; bci < brandKeys.length; bci++) {
        var bSlug = brandKeys[bci].toLowerCase().replace(/[^a-z0-9]/g, '-');
        var bLogo = LOGOS_BASE + bSlug + '.svg';
        bar.innerHTML += '<span class="an-brand-chip" data-brand="' + esc(brandKeys[bci]) + '">' +
          '<img src="' + bLogo + '" onerror="this.style.display=\'none\'" alt="">' +
          esc(brandKeys[bci]) + '</span>';
      }
      var topbar = $('anProductsTopbar') || prodGrid.parentNode;
      if (topbar && topbar.parentNode) {
        topbar.parentNode.insertBefore(bar, prodGrid);
      }
      /* Filter logic */
      bar.addEventListener('click', function(e) {
        var chip = e.target.closest('.an-brand-chip');
        if (!chip) return;
        var chips = bar.querySelectorAll('.an-brand-chip');
        for (var cc = 0; cc < chips.length; cc++) chips[cc].classList.remove('active');
        chip.classList.add('active');
        var filter = chip.getAttribute('data-brand');
        var cards = prodGrid.querySelectorAll('.an-product-card');
        for (var ci = 0; ci < cards.length; ci++) {
          if (filter === 'all') { cards[ci].style.display = ''; }
          else { cards[ci].style.display = (cards[ci].getAttribute('data-brand') === filter) ? '' : 'none'; }
        }
        /* Update count */
        var visible = prodGrid.querySelectorAll('.an-product-card:not([style*="display: none"])').length;
        if (countEl) countEl.textContent = visible + ' \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD';
      });
    }

    /* Render AUTODOC-style horizontal product cards */
    prodGrid.innerHTML = '';
    for (var i = 0; i < products.length; i++) {
      var p = products[i];

      /* Detect parts brand for logo */
      var brandLogoUrl = '';
      var detectedBrand = '';
      var nameUpper = p.name.toUpperCase();
      for (var b = 0; b < KNOWN_PART_BRANDS.length; b++) {
        if (nameUpper.indexOf(KNOWN_PART_BRANDS[b]) !== -1) {
          detectedBrand = KNOWN_PART_BRANDS[b];
          var bSlug = KNOWN_PART_BRANDS[b].toLowerCase().replace(/[^a-z0-9]/g, '-');
          brandLogoUrl = LOGOS_BASE + bSlug + '.svg';
          break;
        }
      }

      var card = document.createElement('div');
      card.className = 'an-product-card';
      card.setAttribute('data-pid', p.id);
      card.setAttribute('data-brand', detectedBrand);

      var brandLogoHtml = brandLogoUrl
        ? '<img class="an-product-brand-logo" src="' + brandLogoUrl + '" onerror="this.style.display=\'none\'" alt="' + esc(detectedBrand) + '" loading="lazy">'
        : '';

      /* Year icon SVG */
      var yearIcon = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

      /* Part code icon SVG */
      var codeIcon = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> ';

      card.innerHTML =
        /* Image column */
        '<div class="an-product-img-col">' +
          brandLogoHtml +
          '<img class="an-product-img" data-pid="' + esc(p.id) + '" ' +
          'src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27150%27 height=%27150%27%3E%3Crect fill=%27%23f5f5f5%27 width=%27150%27 height=%27150%27 rx=%278%27/%3E%3C/svg%3E" ' +
          'alt="' + esc(p.name) + '" loading="lazy">' +
        '</div>' +
        /* Info column */
        '<div class="an-product-info-col">' +
          '<div class="an-product-name">' + esc(p.name) + '</div>' +
          '<div class="an-product-meta-row">' +
            (p.partCode ? '<span class="an-product-code">' + codeIcon + esc(p.partCode) + '</span>' : '') +
            '<span class="an-product-cat-badge">' + esc(catName) + '</span>' +
            (p.years ? '<span class="an-product-years">' + yearIcon + ' ' + esc(p.years) + '</span>' : '') +
          '</div>' +
        '</div>' +
        /* Action column */
        '<div class="an-product-action-col">' +
          '<div class="an-product-stock">\u05D1\u05DE\u05DC\u05D0\u05D9</div>' +
          '<button class="an-btn an-btn-cart" ' +
            'data-iid="' + esc(p.id) + '" data-name="' + esc(p.name) + '" data-url="' + esc(p.link || '') + '" ' +
            'onclick="window.__anAddCart(this)">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4' +
          '</button>' +
          (p.link ? '<a href="' + esc(p.link) + '" class="an-btn an-btn-view" target="_blank">\u05E6\u05E4\u05D4 \u05D1\u05DE\u05D5\u05E6\u05E8</a>' : '') +
        '</div>';

      prodGrid.appendChild(card);
    }

    /* Fetch real product images for this category */
    window.__anFetchProductImages(catName, function (imgMap) {
      var imgs = prodGrid.querySelectorAll('.an-product-img[data-pid]');
      for (var j = 0; j < imgs.length; j++) {
        var pid = imgs[j].getAttribute('data-pid');
        if (imgMap[pid]) {
          imgs[j].src = imgMap[pid];
        }
      }
    });

    /* Back to categories button */
    var backBtn = $('anBackToCats');
    if (backBtn) {
      backBtn.onclick = function () {
        prodView.style.display = 'none';
        if (catView) catView.style.display = '';
        /* Remove brand filter bar */
        var filterBar = document.querySelector('.an-brand-filter-bar');
        if (filterBar) filterBar.remove();
        window.scrollTo(0, 0);
      };
    }

    window.scrollTo(0, 0);
  }


  /* ----------------------------------------------------------
   *  EMPTY STATE
   * ---------------------------------------------------------- */

  function showEmpty(brandHe, modelHe) {
    var loading = $('anResultsLoading');
    var empty   = $('anResultsEmpty');
    var catView = $('anCategoryView');
    var waLink  = $('anEmptyWA');

    if (loading) loading.style.display = 'none';
    if (catView) catView.style.display = 'none';
    if (empty) empty.style.display = 'block';

    if (waLink) {
      var msg = encodeURIComponent(
        '\u05E9\u05DC\u05D5\u05DD, \u05D0\u05E0\u05D9 \u05DE\u05D7\u05E4\u05E9 \u05D7\u05DC\u05E7\u05D9\u05DD \u05DC' +
        (brandHe || '') + ' ' + (modelHe || '')
      );
      waLink.href = 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
    }
  }


  /* ----------------------------------------------------------
   *  MAIN: detect params & run
   * ---------------------------------------------------------- */

  function init() {
    /* Read URL params */
    var brandHe = getParam('brand_he') || getParam('mfr') || '';
    var brandEn = getParam('brand_en') || '';
    var modelHe = getParam('model_he') || '';
    var modelEn = getParam('model_en') || '';
    var year    = getParam('year') || '';
    var engine  = getParam('engine') || '';
    var engineCode = getParam('engineCode') || '';

    /* Bail out if no brand in URL */
    if (!brandHe && !brandEn) return;

    /* Activate results page */
    activatePage();

    /* Build vehicle title */
    var titleEl = $('anVehicleTitle');
    if (titleEl) {
      var titleParts = [brandHe || brandEn, modelHe || modelEn];
      if (year) titleParts.push(year);
      if (engine) titleParts.push('\u2022 ' + engine);
      if (engineCode) titleParts.push('(' + engineCode + ')');
      titleEl.textContent = titleParts.join(' ');
    }

    /* Back link */
    var backLink = $('anBackLink');
    if (backLink) {
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '/';
      });
    }

    /* Show loading spinner */
    var loading = $('anResultsLoading');
    if (loading) loading.style.display = 'block';

    /* Resolve brand & model aliases */
    var brandAliases = resolveBrand(brandHe || brandEn);
    if (brandEn) {
      var enAliases = resolveBrand(brandEn);
      for (var b = 0; b < enAliases.length; b++) {
        if (brandAliases.indexOf(enAliases[b]) === -1) brandAliases.push(enAliases[b]);
      }
    }

    var modelRaw = modelHe || modelEn || '';
    var modelAliases = resolveModel(modelRaw);
    if (modelEn && modelEn !== modelRaw) {
      var enModelAliases = resolveModel(modelEn);
      for (var m = 0; m < enModelAliases.length; m++) {
        if (modelAliases.indexOf(enModelAliases[m]) === -1) modelAliases.push(enModelAliases[m]);
      }
    }

    /* Get English manufacturer & model keys for TecDoc verification */
    var mfrEn = getParam('mfr') || brandEn || '';
    var modelKey = getParam('model') || modelEn || '';

    /* Fetch CSV & match */
    fetchCSV(function (rows) {
      if (!rows || rows.length === 0) {
        if (loading) loading.style.display = 'none';
        showEmpty(brandHe, modelHe);
        return;
      }

      var matched = matchProducts(rows, brandAliases, modelAliases, year);

      /* Verify against TecDoc JSON data for precise vehicle compatibility */
      if (mfrEn) {
        verifyWithTecDoc(matched, mfrEn, modelKey, year, function (verified) {
          if (loading) loading.style.display = 'none';
          renderCategories(verified, brandHe, modelHe || modelEn);
        });
      } else {
        /* No English mfr key — fall back to CSV-only matching */
        if (loading) loading.style.display = 'none';
        renderCategories(matched, brandHe, modelHe || modelEn);
      }
    });
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* TecDoc Widget v9.0 — AUTODOC-style Product Page + Spec Sections
   Loads TecDoc data from GitHub Pages JSON cache, falls back to live API.
   Enhances Konimbo product pages with tabbed AUTODOC layout.
   IIFE — no globals except window.tecdocSearch and config vars.
*/
(function () {
  'use strict';

  /* ══ CONFIGURATION ══ */
  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';
  var APIFY_TOKEN = window.TECDOC_APIFY_TOKEN || '';
  var API_URL = APIFY_TOKEN ? 'https://api.apify.com/v2/acts/making-data-meaningful~tecdoc/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120' : '';
  var WHATSAPP_NUMBER = '97249517322';

  var SPECS_VISIBLE = 6;

  /* Spec keys to exclude from display */
  var EXCLUDE_SPECS = {'EAN number':1, 'EAN':1, 'WVA Number':1, 'WVA number':1};

  /* ── Hebrew translations ── */
  var SPEC_TR = {
    'Fitting Position': '\u05DE\u05D9\u05E7\u05D5\u05DD \u05D4\u05EA\u05E7\u05E0\u05D4',
    'Height [mm]': '\u05D2\u05D5\u05D1\u05D4 [\u05DE"\u05DE]',
    'Bore Diameter [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05E0\u05E7\u05D1 [\u05DE"\u05DE]',
    'Brake Disc Type': '\u05E1\u05D5\u05D2 \u05D3\u05D9\u05E1\u05E7 \u05D1\u05DC\u05DD',
    'Brake Disc Thickness [mm]': '\u05E2\u05D5\u05D1\u05D9 \u05D3\u05D9\u05E1\u05E7 [\u05DE"\u05DE]',
    'Minimum thickness [mm]': '\u05E2\u05D5\u05D1\u05D9 \u05DE\u05D9\u05E0\u05D9\u05DE\u05DC\u05D9 [\u05DE"\u05DE]',
    'Hole Arrangement/Number': '\u05E1\u05D9\u05D3\u05D5\u05E8/\u05DE\u05E1\u05E4\u05E8 \u05D7\u05D5\u05E8\u05D9\u05DD',
    'Inner Diameter [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9 [\u05DE"\u05DE]',
    'Outer Diameter [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9 [\u05DE"\u05DE]',
    'Centering Diameter [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05DE\u05E8\u05DB\u05D5\u05D6 [\u05DE"\u05DE]',
    'Bolt Hole Circle \u00D8 [mm]': '\u05DE\u05E2\u05D2\u05DC \u05D1\u05E8\u05D2\u05D9\u05DD \u00D8 [\u05DE"\u05DE]',
    'Diameter [mm]': '\u05E7\u05D5\u05D8\u05E8 [\u05DE"\u05DE]',
    'Surface': '\u05DE\u05E9\u05D8\u05D7', 'Drilled': '\u05DE\u05E7\u05D5\u05D3\u05D7',
    'Material': '\u05D7\u05D5\u05DE\u05E8', 'Weight [kg]': '\u05DE\u05E9\u05E7\u05DC [\u05E7"\u05D2]',
    'Length [mm]': '\u05D0\u05D5\u05E8\u05DA [\u05DE"\u05DE]', 'Width [mm]': '\u05E8\u05D5\u05D7\u05D1 [\u05DE"\u05DE]',
    'Thickness [mm]': '\u05E2\u05D5\u05D1\u05D9 [\u05DE"\u05DE]',
    'Brake System': '\u05DE\u05E2\u05E8\u05DB\u05EA \u05D1\u05DC\u05D9\u05DE\u05D4',
    'Number per Axle': '\u05DB\u05DE\u05D5\u05EA \u05DC\u05E1\u05E8\u05DF',
    'Wear Warning Contact': '\u05D7\u05D9\u05D9\u05E9\u05DF \u05D1\u05DC\u05D0\u05D9',
    'Machining': '\u05E2\u05D9\u05D1\u05D5\u05D3', 'Product line': '\u05E7\u05D5 \u05DE\u05D5\u05E6\u05E8',
    'Test Mark': '\u05EA\u05D5 \u05EA\u05E7\u05DF', 'Condition': '\u05DE\u05E6\u05D1',
    'Tightening Torque [Nm]': '\u05DE\u05D5\u05DE\u05E0\u05D8 \u05D4\u05D9\u05D3\u05D5\u05E7 [Nm]',
    'Number of Holes': '\u05DE\u05E1\u05E4\u05E8 \u05D7\u05D5\u05E8\u05D9\u05DD',
    'Rim Hole Number': '\u05DE\u05E1\u05E4\u05E8 \u05D7\u05D5\u05E8\u05D9 \u05D7\u05D9\u05E9\u05D5\u05E7',
    'Supplementary Article/Supplementary Info': '\u05DE\u05D9\u05D3\u05E2 \u05DE\u05E9\u05DC\u05D9\u05DD',
    'for PR number': '\u05DC\u05DE\u05E1\u05E4\u05E8 PR',
    'Manufacturer': '\u05D9\u05E6\u05E8\u05DF',
    'Item number': '\u05DE\u05E7"\u05D8', 'directional': '\u05DB\u05D9\u05D5\u05D5\u05E0\u05D9',
    'Paired product': '\u05DE\u05D5\u05E6\u05E8 \u05DE\u05EA\u05D0\u05D9\u05DD',
    'Number of wear indicators [per axle]': '\u05DE\u05E1\u05E4\u05E8 \u05D7\u05D9\u05D9\u05E9\u05E0\u05D9 \u05D1\u05DC\u05D0\u05D9 \u05DC\u05E1\u05E8\u05DF',
    'Warning Contact Length [mm]': '\u05D0\u05D5\u05E8\u05DA \u05D7\u05D9\u05D9\u05E9\u05DF [\u05DE"\u05DE]',
    'Supplementary Article/Info 2': '\u05DE\u05D9\u05D3\u05E2 \u05DE\u05E9\u05DC\u05D9\u05DD 2',
    'Supplementary Article/Info': '\u05DE\u05D9\u05D3\u05E2 \u05DE\u05E9\u05DC\u05D9\u05DD',
    'Axle version': '\u05D2\u05E8\u05E1\u05EA \u05E1\u05E8\u05DF',
    'Pad Thickness [mm]': '\u05E2\u05D5\u05D1\u05D9 \u05E8\u05E4\u05D9\u05D3\u05D4 [\u05DE"\u05DE]',
    'Pad Thickness 1 [mm]': '\u05E2\u05D5\u05D1\u05D9 \u05E8\u05E4\u05D9\u05D3\u05D4 1 [\u05DE"\u05DE]',
    'with accessories': '\u05E2\u05DD \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD',
    'Packing Type': '\u05E1\u05D5\u05D2 \u05D0\u05E8\u05D9\u05D6\u05D4',
    'Vehicle Equipment': '\u05E6\u05D9\u05D5\u05D3 \u05E8\u05DB\u05D1',
    'Check Character': '\u05EA\u05D5 \u05D1\u05D3\u05D9\u05E7\u05D4',
    'MAPP': 'MAPP',
    'Spring/Clamp': '\u05E7\u05E4\u05D9\u05E5/\u05DE\u05D4\u05D3\u05E7',
    'Coating': '\u05E6\u05D9\u05E4\u05D5\u05D9'
  };

  var VAL_TR = {
    'HA': '\u05E1\u05E8\u05DF \u05D0\u05D7\u05D5\u05E8\u05D9', 'VA': '\u05E1\u05E8\u05DF \u05E7\u05D3\u05DE\u05D9',
    'Front Axle': '\u05E1\u05E8\u05DF \u05E7\u05D3\u05DE\u05D9', 'Rear Axle': '\u05E1\u05E8\u05DF \u05D0\u05D7\u05D5\u05E8\u05D9',
    'Front Axle Left': '\u05E1\u05E8\u05DF \u05E7\u05D3\u05DE\u05D9 \u05E9\u05DE\u05D0\u05DC',
    'Front Axle Right': '\u05E1\u05E8\u05DF \u05E7\u05D3\u05DE\u05D9 \u05D9\u05DE\u05D9\u05DF',
    'Rear Axle Left': '\u05E1\u05E8\u05DF \u05D0\u05D7\u05D5\u05E8\u05D9 \u05E9\u05DE\u05D0\u05DC',
    'Rear Axle Right': '\u05E1\u05E8\u05DF \u05D0\u05D7\u05D5\u05E8\u05D9 \u05D9\u05DE\u05D9\u05DF',
    'not prepared': '\u05DC\u05D0 \u05DE\u05D5\u05DB\u05DF', 'prepared': '\u05DE\u05D5\u05DB\u05DF',
    'with integrated wear warning contact': '\u05E2\u05DD \u05D7\u05D9\u05D9\u05E9\u05DF \u05D1\u05DC\u05D0\u05D9 \u05DE\u05E9\u05D5\u05DC\u05D1',
    'without wear warning contact': '\u05DC\u05DC\u05D0 \u05D7\u05D9\u05D9\u05E9\u05DF \u05D1\u05DC\u05D0\u05D9',
    'Externally Vented': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8 \u05D7\u05D9\u05E6\u05D5\u05E0\u05D9\u05EA',
    'Internally Vented': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9\u05EA',
    'Full': '\u05DE\u05DC\u05D0', 'Solid': '\u05DE\u05DC\u05D0',
    'Perforated': '\u05DE\u05E0\u05D5\u05E7\u05D1', 'Coated': '\u05DE\u05E6\u05D5\u05E4\u05D4',
    'High-carbon': '\u05E4\u05D7\u05DE\u05DF \u05D2\u05D1\u05D5\u05D4',
    'yes': '\u05DB\u05DF', 'no': '\u05DC\u05D0', 'New': '\u05D7\u05D3\u05E9',
    '37': '\u05DE\u05E6\u05D5\u05E4\u05D4'
  };
  var DISC_MAP = { '1': '\u05DE\u05DC\u05D0', '2': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8', '3': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9' };

  function trSpec(n) { return SPEC_TR[n] || n; }
  function trVal(n, v) {
    if (n === 'Brake Disc Type' && DISC_MAP[v]) return DISC_MAP[v];
    if (n === 'Surface' && VAL_TR[v]) return VAL_TR[v];
    if (n === 'Fitting Position') return v.split(/[;,]\s*/).map(function(x) { return VAL_TR[x.trim()] || x.trim(); }).join(' / ');
    return VAL_TR[v] || v;
  }
  function fmtDate(d) { if (!d) return ''; var x = new Date(d); return isNaN(x.getTime()) ? d : ('0'+(x.getMonth()+1)).slice(-2)+'.'+x.getFullYear(); }
  function esc(s) { if (!s && s !== 0) return ''; var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML; }

  /* ── State ── */
  var D = { articleNo:'', articleId:null, supplier:'', product:'', ean:'', specs:[], vehicles:[], oe:[] };

  /* ── API (live fallback) ── */
  function api(body) {
    return fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(function(r){return r.json();});
  }

  /* ── Detect article number ── */
  function detectArticleNo() {
    var sku = getStoreSKU();
    if (sku) {
      if (window.TECDOC_MAP && window.TECDOC_MAP[sku]) return window.TECDOC_MAP[sku];
      return sku;
    }
    var el = document.getElementById('tecdoc-widget');
    if (el) {
      var attr = el.getAttribute('data-article');
      if (attr && attr.trim()) return attr.trim();
    }
    return null;
  }

  function getStoreSKU() {
    var codeEl = document.querySelector('.code_item');
    if (codeEl) {
      var text = codeEl.textContent.trim();
      text = text.replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g, '').trim();
      if (text) return text;
    }
    return null;
  }

  /* ── Category detection ── */
  function isAutoPartsPage() {
    var bcLink = document.querySelector('#bread_crumbs a[href*="186807"]');
    if (bcLink) return true;
    var bc = document.getElementById('bread_crumbs');
    if (bc && bc.textContent.indexOf('\u05D7\u05DC\u05E7\u05D9 \u05D7\u05D9\u05DC\u05D5\u05E3 \u05DC\u05E8\u05DB\u05D1') !== -1) return true;
    return false;
  }

  /* ══════════════════════════════════════
     PRODUCT PAGE DETECTION — Read Konimbo DOM
     ══════════════════════════════════════ */
  function getProductPageData() {
    /* Only on single product pages with pricing info */
    var priceEl = document.querySelector('.price .number') || document.querySelector('.price_val');
    if (!priceEl) return null;

    var data = {};

    /* Title */
    var titleEl = document.querySelector('.item_title h1') || document.querySelector('h1.product_name');
    data.title = titleEl ? titleEl.textContent.trim() : '';

    /* Price */
    var priceText = priceEl.textContent.trim().replace(/[^\d.]/g, '');
    data.price = parseFloat(priceText) || 0;

    /* Image */
    var imgEl = document.querySelector('.item_image img') || document.querySelector('.main-image img');
    data.imageUrl = imgEl ? (imgEl.getAttribute('src') || '') : '';

    /* SKU */
    data.sku = getStoreSKU() || '';

    /* Product ID for add-to-cart */
    var idEl = document.querySelector('input[name="item_id"]') || document.querySelector('[data-item-id]');
    data.itemId = idEl ? (idEl.value || idEl.getAttribute('data-item-id') || '') : '';
    if (!data.itemId) {
      /* Try from URL: /items/XXXXX */
      var urlMatch = location.pathname.match(/\/items\/(\d+)/);
      if (urlMatch) data.itemId = urlMatch[1];
    }

    /* Category from breadcrumb */
    var bcLinks = document.querySelectorAll('#bread_crumbs a');
    data.category = '';
    for (var i = bcLinks.length - 1; i >= 0; i--) {
      var t = bcLinks[i].textContent.trim();
      if (t && t !== '\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA' && t !== '\u05D7\u05DC\u05E7\u05D9 \u05D7\u05D9\u05DC\u05D5\u05E3 \u05DC\u05E8\u05DB\u05D1') {
        data.category = t;
        break;
      }
    }

    /* Supplier/brand — extract from title or SKU prefix */
    data.brand = '';
    if (data.title) {
      /* Common patterns: "BRAND MODEL" or title starts with brand */
      var brandMatch = data.title.match(/^([A-Z][A-Z0-9-]+)\s/);
      if (brandMatch) data.brand = brandMatch[1];
    }

    return data;
  }

  /* ══════════════════════════════════════
     PRODUCT PAGE RENDERER — AUTODOC Style
     ══════════════════════════════════════ */
  function renderProductPage(pageData) {
    var inStock = pageData.price > 0;
    var priceStr = pageData.price > 0 ? '\u20AA' + Math.round(pageData.price) : '';
    var brandFromData = D.supplier || pageData.brand || '';
    var articleDisplay = D.articleNo || pageData.sku || '';

    /* Build quick specs from first few TecDoc specs */
    var quickSpecsHtml = '';
    var quickSpecs = [];
    for (var qi = 0; qi < D.specs.length && quickSpecs.length < 4; qi++) {
      var sn = D.specs[qi].criteriaName;
      if (EXCLUDE_SPECS[sn]) continue;
      quickSpecs.push({ name: trSpec(sn), value: trVal(sn, D.specs[qi].criteriaValue) });
    }
    if (quickSpecs.length) {
      quickSpecsHtml = '<table class="an-product__quick-specs">';
      for (var qsi = 0; qsi < quickSpecs.length; qsi++) {
        quickSpecsHtml += '<tr><td>' + esc(quickSpecs[qsi].name) + '</td><td>' + esc(quickSpecs[qsi].value) + '</td></tr>';
      }
      quickSpecsHtml += '</table>';
    }

    /* Purchase section */
    var purchaseHtml = '';
    purchaseHtml += '<div class="an-product__stock ' + (inStock ? 'an-product__stock--in' : 'an-product__stock--out') + '">';
    purchaseHtml += '<span class="an-product__stock-dot"></span>';
    purchaseHtml += inStock ? '\u05D1\u05DE\u05DC\u05D0\u05D9' : '\u05D0\u05D6\u05DC \u05D1\u05DE\u05DC\u05D0\u05D9';
    purchaseHtml += '</div>';

    if (inStock) {
      purchaseHtml += '<div class="an-product__price">' + priceStr + '<span class="an-product__price-vat"> \u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE</span></div>';
      purchaseHtml += '<div class="an-product__cart-row">';
      purchaseHtml += '<div class="an-product__qty"><button type="button" onclick="anQtyChange(1)">+</button><input type="number" id="anQtyInput" value="1" min="1" max="99"><button type="button" onclick="anQtyChange(-1)">\u2212</button></div>';
      purchaseHtml += '<button type="button" class="an-product__add-btn" id="anAddToCart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4</button>';
      purchaseHtml += '</div>';
    } else {
      var waMsg = encodeURIComponent('\u05D4\u05D9\u05D9, \u05D0\u05E9\u05DE\u05D7 \u05DC\u05E7\u05D1\u05DC \u05E2\u05D3\u05DB\u05D5\u05DF \u05DB\u05E9\u05D4\u05DE\u05D5\u05E6\u05E8 ' + (articleDisplay || pageData.title) + ' \u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9');
      purchaseHtml += '<a class="an-product__notify-btn" href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waMsg + '" target="_blank" rel="noopener">';
      purchaseHtml += '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.702-1.399A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.15 0-4.168-.665-5.828-1.8l-.244-.163-3.042.905.84-3.137-.17-.253A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>';
      purchaseHtml += '\u05D4\u05D5\u05D3\u05E2 \u05DC\u05D9 \u05DB\u05E9\u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9</a>';
    }

    /* Shipping */
    purchaseHtml += '<div class="an-product__shipping"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>\u05DE\u05E9\u05DC\u05D5\u05D7 \u05E2\u05D3 7 \u05D9\u05DE\u05D9 \u05E2\u05E1\u05E7\u05D9\u05DD | \u05D0\u05D9\u05E1\u05D5\u05E3 \u05E2\u05E6\u05DE\u05D9 \u05DE\u05E0\u05D4\u05E8\u05D9\u05D4</div>';

    /* Benefits */
    purchaseHtml += '<div class="an-product__benefits">';
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--warranty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA 3 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD / 6,000 \u05E7"\u05DE<small>\u05DE\u05D5\u05EA\u05E0\u05D9\u05EA \u05D1\u05D4\u05EA\u05E7\u05E0\u05D4 \u05D1\u05DE\u05D5\u05E1\u05DA \u05DE\u05D5\u05E8\u05E9\u05D4</small></div></div>';
    if (brandFromData) {
      purchaseHtml += '<div class="an-product__benefit an-product__benefit--original"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>\u05DE\u05D5\u05E6\u05E8 \u05DE\u05E7\u05D5\u05E8\u05D9 ' + esc(brandFromData) + '</div>';
    }
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--secure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>\u05EA\u05E9\u05DC\u05D5\u05DD \u05DE\u05D0\u05D5\u05D1\u05D8\u05D7</div>';
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--installments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05EA\u05E9\u05DC\u05D5\u05DE\u05D9\u05DD \u05D1\u05E7\u05D5\u05E4\u05D4</div>';
    purchaseHtml += '</div>';

    /* Subtitle */
    var subtitle = '';
    if (articleDisplay) subtitle += articleDisplay;
    if (D.product) subtitle += ' \u2014 ' + D.product;

    /* Build main product section */
    var html = '<div class="an-product" id="an-product-page">';

    /* Main 3-column grid */
    html += '<div class="an-product__main">';

    /* Column 3: Purchase (appears first in RTL flow but we use grid ordering) */
    html += '<div class="an-product__purchase">' + purchaseHtml + '</div>';

    /* Column 2: Info */
    html += '<div class="an-product__info">';
    html += '<h1 class="an-product__title">' + esc(pageData.title) + '</h1>';
    if (subtitle) html += '<div class="an-product__subtitle">' + esc(subtitle) + '</div>';
    if (brandFromData || articleDisplay) {
      html += '<div class="an-product__meta">';
      if (articleDisplay) html += '<span>\u05DE\u05E7"\u05D8: <strong>' + esc(articleDisplay) + '</strong></span>';
      if (brandFromData) html += '<span>\u05D9\u05E6\u05E8\u05DF: <strong>' + esc(brandFromData) + '</strong></span>';
      html += '</div>';
    }
    html += quickSpecsHtml;
    html += '</div>';

    /* Column 1: Image */
    html += '<div class="an-product__image">';
    if (pageData.imageUrl) html += '<img src="' + esc(pageData.imageUrl) + '" alt="' + esc(pageData.title) + '">';
    html += '</div>';

    html += '</div>'; /* end main */

    /* Tabs section */
    var vehicleCount = D.vehicles.length;
    var oeCount = 0;
    var oeBrands = {};
    for (var oi = 0; oi < D.oe.length; oi++) {
      var brand = D.oe[oi].oemBrand || 'Other';
      if (!oeBrands[brand]) oeBrands[brand] = [];
      if (oeBrands[brand].indexOf(D.oe[oi].oemDisplayNo) === -1) {
        oeBrands[brand].push(D.oe[oi].oemDisplayNo);
        oeCount++;
      }
    }

    html += '<div class="an-product__tabs-section">';
    html += '<div class="an-product__tabs-nav">';
    html += '<button type="button" class="an-product__tab-btn an-product__tab-btn--active" data-tab="specs"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</button>';
    html += '<button type="button" class="an-product__tab-btn" data-tab="vehicles"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD';
    if (vehicleCount) html += ' <span class="an-product__tab-badge">' + vehicleCount + '</span>';
    html += '</button>';
    html += '<button type="button" class="an-product__tab-btn" data-tab="oe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\u05DE\u05E1\u05E4\u05E8\u05D9 OE';
    if (oeCount) html += ' <span class="an-product__tab-badge">' + oeCount + '</span>';
    html += '</button>';
    html += '</div>';

    /* Tab panels */
    /* Panel 1: Specs */
    html += '<div class="an-product__tab-panel an-product__tab-panel--active" data-panel="specs">';
    html += '<div class="an-product__spec-header"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>\u05DE\u05E4\u05E8\u05D8 \u05D8\u05DB\u05E0\u05D9 \u2014 ' + esc(brandFromData ? brandFromData + ' ' + articleDisplay : articleDisplay) + '</div>';

    var filteredSpecs = [];
    for (var fi = 0; fi < D.specs.length; fi++) {
      if (!EXCLUDE_SPECS[D.specs[fi].criteriaName]) {
        filteredSpecs.push(D.specs[fi]);
      }
    }

    if (filteredSpecs.length || articleDisplay || brandFromData) {
      html += '<table class="an-product__spec-table">';
      if (articleDisplay) html += '<tr><td>\u05DE\u05E7"\u05D8</td><td>' + esc(articleDisplay) + '</td></tr>';
      if (brandFromData) html += '<tr><td>\u05D9\u05E6\u05E8\u05DF</td><td>' + esc(brandFromData) + '</td></tr>';
      if (D.product) html += '<tr><td>\u05E1\u05D5\u05D2 \u05DE\u05D5\u05E6\u05E8</td><td>' + esc(D.product) + '</td></tr>';
      for (var si = 0; si < filteredSpecs.length; si++) {
        html += '<tr><td>' + esc(trSpec(filteredSpecs[si].criteriaName)) + '</td><td>' + esc(trVal(filteredSpecs[si].criteriaName, filteredSpecs[si].criteriaValue)) + '</td></tr>';
      }
      html += '</table>';
    } else {
      html += '<div style="text-align:center;color:#aaa;padding:24px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    }
    html += '</div>';

    /* Panel 2: Vehicles */
    html += '<div class="an-product__tab-panel" data-panel="vehicles">';
    if (!D.vehicles.length) {
      html += '<div style="text-align:center;color:#aaa;padding:40px 16px;font-size:16px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD \u05DC\u05D7\u05DC\u05E7 \u05D6\u05D4</div>';
    } else {
      html += renderVehicleAccordion(D.vehicles);
    }
    html += '</div>';

    /* Panel 3: OE Numbers */
    html += '<div class="an-product__tab-panel" data-panel="oe">';
    if (!D.oe.length) {
      html += '<div style="text-align:center;color:#aaa;padding:40px 16px;font-size:16px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      html += '<div class="an-product__oe-header">\u05DE\u05E1\u05E4\u05E8\u05D9 OE \u05DE\u05E7\u05D1\u05D9\u05DC\u05D9\u05DD \u05DC\u05DE\u05E1\u05E4\u05E8 \u05D7\u05DC\u05E7 \u05D4\u05D7\u05D9\u05DC\u05D5\u05E3 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:</div>';
      html += renderOeAccordion(oeBrands);
    }
    html += '</div>';

    html += '</div>'; /* end tabs-section */

    html += '<div style="text-align:center;font-size:10px;color:#bbb;padding:8px 0;">\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc\u00AE Catalogue</div>';
    html += '</div>'; /* end an-product */

    return html;
  }

  function renderVehicleAccordion(vehicles) {
    var tree = buildTree(vehicles);
    var html = '<div class="tw-accordion" style="max-height:500px;">';
    var mKeys = Object.keys(tree).sort();
    for (var mk = 0; mk < mKeys.length; mk++) {
      var mfr = mKeys[mk], models = tree[mfr];
      html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(mfr) + '</span></div><div class="tw-acc-l1-body">';
      var mdKeys = Object.keys(models).sort();
      for (var mi = 0; mi < mdKeys.length; mi++) {
        var mn = mdKeys[mi], md = models[mn];
        html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">' + esc(mn) + '</span>';
        if (md.years) html += '<span class="tw-acc-l2-years">(' + esc(md.years) + ')</span>';
        html += '</div><div class="tw-acc-l2-body">';
        for (var ei = 0; ei < md.engines.length; ei++) {
          var e = md.engines[ei];
          html += '<div class="tw-acc-l3"><span class="tw-acc-l3-engine">' + esc(e.name) + '</span>';
          if (e.years) html += '<span class="tw-acc-l3-separator">,</span> <span class="tw-acc-l3-years">' + esc(e.years) + '</span>';
          html += '</div>';
        }
        html += '</div></div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderOeAccordion(oeBrands) {
    var html = '<div class="tw-accordion" style="margin-top:12px;max-height:400px;">';
    var bKeys = Object.keys(oeBrands).sort();
    for (var bi = 0; bi < bKeys.length; bi++) {
      var bn = bKeys[bi], nums = oeBrands[bn];
      html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(bn) + '</span><span class="tw-acc-l2-years">(' + nums.length + ')</span></div><div class="tw-acc-l1-body">';
      for (var ni = 0; ni < nums.length; ni++) {
        html += '<div class="tw-oe-acc-item"><span class="tw-oe-acc-num">' + esc(nums[ni]) + '</span></div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    html += '<div class="tw-oe-info">\u05DE\u05E1\u05E4\u05E8\u05D9 \u05D4-OE \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DC\u05D4\u05E9\u05D5\u05D5\u05D0\u05D4 \u05D1\u05DC\u05D1\u05D3. \u05D9\u05E9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1 \u05D4\u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05E8\u05DB\u05D9\u05E9\u05D4.</div>';
    return html;
  }

  /* ══════════════════════════════════════
     PRODUCT PAGE INJECTION
     ══════════════════════════════════════ */
  function injectProductPage(pageData) {
    var productHtml = renderProductPage(pageData);

    /* Find injection targets in Konimbo DOM */
    /* Strategy: hide default product sections, inject our layout before them */
    var itemMain = document.querySelector('.item_page_main') || document.querySelector('.item-page') || document.querySelector('#item_main');
    if (!itemMain) {
      /* Fallback: insert into #content or main content area */
      itemMain = document.querySelector('#content') || document.querySelector('main') || document.querySelector('.content');
    }

    if (!itemMain) return false;

    /* Hide original product sections that we're replacing */
    var hideSelectors = ['.item_image', '.item_right', '.item_info_top', '#item_content', '#item_specifications', '.price_area', '.add_to_cart_area'];
    for (var hi = 0; hi < hideSelectors.length; hi++) {
      var els = document.querySelectorAll(hideSelectors[hi]);
      for (var hj = 0; hj < els.length; hj++) {
        els[hj].style.display = 'none';
      }
    }

    /* Create container */
    var container = document.createElement('div');
    container.id = 'an-product-container';
    container.innerHTML = productHtml;

    /* Insert at the top of the main content area */
    if (itemMain.firstChild) {
      itemMain.insertBefore(container, itemMain.firstChild);
    } else {
      itemMain.appendChild(container);
    }

    /* Bind tab interactions */
    bindTabs(container);
    bindAccordions(container);
    bindCartActions(pageData);

    return true;
  }

  function bindTabs(container) {
    var tabs = container.querySelectorAll('.an-product__tab-btn');
    var panels = container.querySelectorAll('.an-product__tab-panel');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab');
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove('an-product__tab-btn--active');
        }
        this.classList.add('an-product__tab-btn--active');
        for (var k = 0; k < panels.length; k++) {
          if (panels[k].getAttribute('data-panel') === tabId) {
            panels[k].classList.add('an-product__tab-panel--active');
          } else {
            panels[k].classList.remove('an-product__tab-panel--active');
          }
        }
      });
    }
  }

  function bindCartActions(pageData) {
    /* Quantity +/- (exposed globally for onclick handlers) */
    window.anQtyChange = function(delta) {
      var input = document.getElementById('anQtyInput');
      if (!input) return;
      var val = parseInt(input.value) || 1;
      val = Math.max(1, Math.min(99, val + delta));
      input.value = val;
    };

    /* Add to cart — uses Konimbo's native find_id function */
    var addBtn = document.getElementById('anAddToCart');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        var qty = parseInt((document.getElementById('anQtyInput') || {}).value) || 1;
        if (typeof window.find_id === 'function') {
          /* find_id(id_item, title_item, price_item, img_item, quantity, quantity_step, upgrades) */
          window.find_id(
            pageData.itemId,
            pageData.title,
            pageData.price,
            pageData.imageUrl,
            qty,
            1,
            ''
          );
        } else {
          /* Fallback: try Konimbo's add-to-cart form */
          var form = document.querySelector('form.add_to_cart_form') || document.querySelector('form[action*="cart"]');
          if (form) {
            var qtyInput = form.querySelector('input[name="quantity"]');
            if (qtyInput) qtyInput.value = qty;
            form.submit();
          }
        }
      });
    }
  }

  /* ══════════════════════════════════════
     ORIGINAL WIDGET RENDERING (non-product-page)
     Vertical sections: Description → Vehicles → OE
     ══════════════════════════════════════ */

  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;

    var itemContent = document.getElementById('item_content');
    if (itemContent) {
      var h3 = itemContent.querySelector('h3, #item_content_title');
      if (h3) h3.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
      var specContainer = itemContent.querySelector('.specifications');
      if (specContainer) { specContainer.innerHTML = ''; }
      var widget = document.createElement('div');
      widget.id = 'tecdoc-widget';
      if (specContainer) { specContainer.appendChild(widget); }
      else { itemContent.appendChild(widget); }
      return widget;
    }

    var specsDiv = document.querySelector('#item_specifications .specifications');
    if (specsDiv) {
      specsDiv.innerHTML = '';
      var widget2 = document.createElement('div');
      widget2.id = 'tecdoc-widget';
      specsDiv.appendChild(widget2);
      var header = document.querySelector('#item_specifications h3');
      if (header) header.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
      return widget2;
    }

    var anchors = [
      document.getElementById('item_also_buy'),
      document.getElementById('item_info')
    ];
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i]) {
        var wrapper = document.createElement('div');
        wrapper.id = 'item_content';
        wrapper.className = 'item_attributes';
        var wh3 = document.createElement('h3');
        wh3.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
        wrapper.appendChild(wh3);
        var specDiv = document.createElement('div');
        specDiv.className = 'specifications full_width';
        wrapper.appendChild(specDiv);
        var widget3 = document.createElement('div');
        widget3.id = 'tecdoc-widget';
        specDiv.appendChild(widget3);
        anchors[i].parentNode.insertBefore(wrapper, anchors[i]);
        return widget3;
      }
    }
    return null;
  }

  function getWidget() { return document.getElementById('tecdoc-widget'); }

  function showLoading(step, pct) {
    var w = getWidget(); if (!w) return;
    w.innerHTML = '<div class="tw-loading"><div class="tw-spinner"></div>' +
      '<div class="tw-loading-text">' + esc(step) + '</div>' +
      '<div class="tw-progress"><div class="tw-progress-bar" style="width:'+pct+'%"></div></div>' +
      '<div class="tw-loading-step">\u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E0\u05D8\u05E2\u05E0\u05D9\u05DD \u05DE-TecDoc \u2014 \u05D0\u05E0\u05D0 \u05D4\u05DE\u05EA\u05D9\u05E0\u05D5</div></div>';
  }

  function showError(msg) {
    var w = getWidget(); if (!w) return;
    var parent = w.closest('#item_content, #item_specifications');
    if (parent) { parent.style.display = 'none'; }
    else { w.style.display = 'none'; }
  }

  /* Original vertical render (for non-product-page contexts) */
  function render() {
    var w = getWidget(); if (!w) return;
    var html = '';

    html += '<div class="tw-section tw-desc-section">';
    html += '<div class="tw-section-title">\u05EA\u05D9\u05D0\u05D5\u05E8</div>';
    if (!D.specs.length && !D.articleNo && !D.supplier && !D.ean) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    } else {
      var allSpecs = [];
      for (var i = 0; i < D.specs.length; i++) {
        if (!EXCLUDE_SPECS[D.specs[i].criteriaName]) {
          allSpecs.push({ name: trSpec(D.specs[i].criteriaName), value: trVal(D.specs[i].criteriaName, D.specs[i].criteriaValue) });
        }
      }
      if (D.articleNo) allSpecs.push({ name: '\u05DE\u05E7"\u05D8', value: D.articleNo });
      if (D.supplier) allSpecs.push({ name: '\u05D9\u05E6\u05E8\u05DF', value: D.supplier });

      var hasHidden = allSpecs.length > SPECS_VISIBLE;
      html += '<table class="tw-specs-table" id="tw-specs-tbl">';
      for (var si = 0; si < allSpecs.length; si++) {
        var cls = si >= SPECS_VISIBLE ? ' class="tw-spec-hidden"' : '';
        html += '<tr'+cls+'><td>'+esc(allSpecs[si].name)+':</td><td>'+esc(allSpecs[si].value)+'</td></tr>';
      }
      html += '</table>';

      if (hasHidden) {
        html += '<div class="tw-more-wrap"><button type="button" class="tw-more-btn" id="tw-more-toggle">\u05E2\u05D5\u05D3 <span class="tw-arrow">\u25BC</span></button></div>';
      }
    }
    html += '</div>';

    html += '<div class="tw-section tw-compat-section">';
    html += '<div class="tw-compat-header">';
    html += '<span class="tw-compat-icon">\uD83D\uDE97</span>';
    html += '<span class="tw-compat-title">\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD</span>';
    html += '</div>';

    if (!D.vehicles.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD</div>';
    } else {
      var tree = buildTree(D.vehicles);
      html += '<div class="tw-accordion">';
      var mKeys = Object.keys(tree).sort();
      for (var mk = 0; mk < mKeys.length; mk++) {
        var mfr = mKeys[mk], models = tree[mfr];
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(mfr) + '</span></div><div class="tw-acc-l1-body">';
        var mdKeys = Object.keys(models).sort();
        for (var mi = 0; mi < mdKeys.length; mi++) {
          var mn = mdKeys[mi], md = models[mn];
          html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">' + esc(mn) + '</span>';
          if (md.years) html += '<span class="tw-acc-l2-years">(' + esc(md.years) + ')</span>';
          html += '</div><div class="tw-acc-l2-body">';
          for (var ei = 0; ei < md.engines.length; ei++) {
            var e = md.engines[ei];
            html += '<div class="tw-acc-l3"><span class="tw-acc-l3-engine">' + esc(e.name) + '</span>';
            if (e.years) html += '<span class="tw-acc-l3-separator">,</span> <span class="tw-acc-l3-years">' + esc(e.years) + '</span>';
            html += '</div>';
          }
          html += '</div></div>';
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="tw-section tw-oe-section">';
    html += '<div class="tw-oe-header">';
    html += '<div class="tw-oe-title">\u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    html += '<div class="tw-oe-subtitle">\u05DE\u05E1\u05E4\u05E8\u05D9 OE \u05DE\u05E7\u05D1\u05D9\u05DC\u05D9\u05DD \u05DC\u05DE\u05E1\u05E4\u05E8 \u05D7\u05DC\u05E7 \u05D4\u05D7\u05D9\u05DC\u05D5\u05E3 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:</div>';
    html += '</div>';

    if (!D.oe.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      var byBrand = {};
      for (var oi = 0; oi < D.oe.length; oi++) {
        var o = D.oe[oi], brnd = o.oemBrand || 'Other';
        if (!byBrand[brnd]) byBrand[brnd] = [];
        if (byBrand[brnd].indexOf(o.oemDisplayNo) === -1) byBrand[brnd].push(o.oemDisplayNo);
      }
      html += '<div class="tw-accordion" style="margin-top:14px">';
      var bKeys = Object.keys(byBrand).sort();
      for (var bi = 0; bi < bKeys.length; bi++) {
        var bn = bKeys[bi], nums = byBrand[bn];
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(bn) + '</span><span class="tw-acc-l2-years">(' + nums.length + ')</span></div><div class="tw-acc-l1-body">';
        for (var ni = 0; ni < nums.length; ni++) {
          html += '<div class="tw-oe-acc-item"><span class="tw-oe-acc-num">' + esc(nums[ni]) + '</span></div>';
        }
        html += '</div></div>';
      }
      html += '</div>';
      html += '<div class="tw-oe-info">\u05DE\u05E1\u05E4\u05E8\u05D9 \u05D4-OE \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DC\u05D4\u05E9\u05D5\u05D5\u05D0\u05D4 \u05D1\u05DC\u05D1\u05D3. \u05D9\u05E9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1 \u05D4\u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05E8\u05DB\u05D9\u05E9\u05D4.</div>';
    }
    html += '</div>';

    html += '<div class="tw-footer"><span>\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc\u00AE Catalogue</span></div>';

    w.innerHTML = html;
    bindAccordions(w);
    bindMoreToggle(w);
  }

  function buildTree(vehicles) {
    var tree = {};
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i], mfr = v.manufacturerName || 'Other', model = v.modelName || 'Unknown';
      var sd = fmtDate(v.constructionIntervalStart), ed = fmtDate(v.constructionIntervalEnd);
      var yr = (sd || ed) ? (sd || '?') + ' - ' + (ed || '?') : '';
      if (!tree[mfr]) tree[mfr] = {};
      if (!tree[mfr][model]) tree[mfr][model] = { years: yr, ys: v.constructionIntervalStart || '', ye: v.constructionIntervalEnd || '', engines: [] };
      if (v.constructionIntervalStart && (!tree[mfr][model].ys || v.constructionIntervalStart < tree[mfr][model].ys)) tree[mfr][model].ys = v.constructionIntervalStart;
      if (v.constructionIntervalEnd && (!tree[mfr][model].ye || v.constructionIntervalEnd > tree[mfr][model].ye)) tree[mfr][model].ye = v.constructionIntervalEnd;
      tree[mfr][model].engines.push({ name: v.typeEngineName || '', years: yr });
    }
    Object.keys(tree).forEach(function(m) {
      Object.keys(tree[m]).forEach(function(md) {
        var d = tree[m][md], s = fmtDate(d.ys), e = fmtDate(d.ye);
        if (s || e) d.years = (s || '?') + ' - ' + (e || '?');
      });
    });
    return tree;
  }

  function bindAccordions(container) {
    var hs = container.querySelectorAll('.tw-acc-l1-header,.tw-acc-l2-header');
    for (var i = 0; i < hs.length; i++) {
      hs[i].addEventListener('click', function() {
        var p = this.parentElement, ic = this.querySelector('.tw-acc-icon'), open = p.classList.contains('tw-open');
        p.classList.toggle('tw-open');
        if (ic) ic.textContent = open ? '+' : '\u2212';
      });
    }
  }

  function bindMoreToggle(w) {
    var btn = w.querySelector('#tw-more-toggle');
    if (!btn) return;
    var tbl = w.querySelector('#tw-specs-tbl');
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var expanded = tbl.classList.toggle('tw-expanded');
      btn.classList.toggle('tw-expanded', expanded);
      btn.innerHTML = expanded ? '\u05E4\u05D7\u05D5\u05EA <span class="tw-arrow">\u25B2</span>' : '\u05E2\u05D5\u05D3 <span class="tw-arrow">\u25BC</span>';
    });
  }

  /* ══════════════════════════════════════
     CACHE + API LOADING (unchanged)
     ══════════════════════════════════════ */

  function loadFromCache(articleNo) {
    var variations = articleVariations(articleNo);
    function tryCache(idx) {
      if (idx >= variations.length) return Promise.reject('not_cached');
      var filename = variations[idx].replace(/[^a-zA-Z0-9]/g, '_') + '.json';
      return fetch(CACHE_URL + filename)
        .then(function(r) {
          if (!r.ok) return tryCache(idx + 1);
          return r.json();
        });
    }
    return tryCache(0);
  }

  function articleVariations(artNo) {
    var variations = [artNo];
    var noTrail = artNo.replace(/[A-Z]$/, '');
    if (noTrail !== artNo && noTrail.length > 3) variations.push(noTrail);
    var spaced = artNo.replace(/([A-Za-z]+)(\d+)/g, function(m, letters, digits) {
      var d = digits;
      if (d.length === 5) d = d.slice(0,2) + ' ' + d.slice(2);
      else if (d.length === 6) d = d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4);
      else if (d.length === 4) d = d.slice(0,2) + ' ' + d.slice(2);
      return letters + ' ' + d;
    });
    if (spaced !== artNo) variations.push(spaced);
    if (noTrail !== artNo && noTrail.length > 3) {
      var spacedNoTrail = noTrail.replace(/([A-Za-z]+)(\d+)/g, function(m, letters, digits) {
        var d = digits;
        if (d.length === 5) d = d.slice(0,2) + ' ' + d.slice(2);
        else if (d.length === 6) d = d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4);
        else if (d.length === 4) d = d.slice(0,2) + ' ' + d.slice(2);
        return letters + ' ' + d;
      });
      if (spacedNoTrail !== noTrail) variations.push(spacedNoTrail);
    }
    if (artNo.indexOf('.') > -1) variations.push(artNo.replace(/\./g, ' '));
    if (/^\d{10,}$/.test(artNo)) {
      variations.push(artNo.slice(0,5) + '-' + artNo.slice(5));
    }
    if (/^\d{5}[A-Z]/.test(artNo)) {
      variations.push(artNo.slice(0,5) + '-' + artNo.slice(5));
    }
    var pfxMatch = artNo.match(/^(FEB|MAN|NGK|BOS|VAL|LUK|SKF|INA|FAG|SNR)(\d{4,})$/i);
    if (pfxMatch) variations.push(pfxMatch[2]);
    var nospace = artNo.replace(/[\s.-]/g, '');
    if (nospace !== artNo) variations.push(nospace);
    return variations;
  }

  var PREFERRED_BRANDS = ['BOSCH','MANN-FILTER','MAHLE','HENGST FILTER','BREMBO','TRW','SACHS','VALEO','DENSO','NGK','SKF','FEBI BILSTEIN','MEYLE','OPTIMAL','MAPCO','JAPANPARTS','BLUE PRINT','ASHIKA','JAPKO','FILTRON','KNECHT','PURFLUX','CHAMPION','MOOG'];

  function loadFromAPI(articleNo) {
    if (!API_URL) return Promise.reject('no_token');
    var variations = articleVariations(articleNo);

    function tryVariation(idx) {
      if (idx >= variations.length) return Promise.reject('no_results');
      return api({
        endpoint_partsCompatibleVehiclesByArticleNo: true,
        parts_articleNo_20: variations[idx],
        parts_langId_20: 4, parts_countryFilterId_20: 81, parts_typeId_20: 1
      }).then(function(data) {
        if (!data || !data.length || !data[0].articles || !data[0].articles.length) {
          return tryVariation(idx + 1);
        }
        return data;
      });
    }

    function tryOemSearch(originalSku) {
      return api({
        endpoint_partsSearchArticlesByOem: true,
        parts_articleOemNo_29: originalSku,
        parts_langId_29: 4
      }).then(function(oemData) {
        if (!oemData || !oemData.length) return Promise.reject('no_results');
        var seen = {};
        var unique = [];
        for (var i = 0; i < oemData.length; i++) {
          var a = oemData[i];
          if (!a.articleId || seen[a.articleId]) continue;
          seen[a.articleId] = true;
          unique.push(a);
        }
        if (!unique.length) return Promise.reject('no_results');
        unique.sort(function(a, b) {
          var nameA = (a.supplierName || '').toUpperCase();
          var nameB = (b.supplierName || '').toUpperCase();
          var sA = -1, sB = -1;
          for (var p = 0; p < PREFERRED_BRANDS.length; p++) {
            if (sA === -1 && nameA.indexOf(PREFERRED_BRANDS[p].toUpperCase()) !== -1) sA = p;
            if (sB === -1 && nameB.indexOf(PREFERRED_BRANDS[p].toUpperCase()) !== -1) sB = p;
          }
          return (sA === -1 ? 999 : sA) - (sB === -1 ? 999 : sB);
        });
        var candidates = unique.slice(0, 5);
        var chain = Promise.resolve({ best: null, bestCount: 0 });
        candidates.forEach(function(cand) {
          chain = chain.then(function(state) {
            return api({
              endpoint_partsCompatibleVehiclesByArticleNo: true,
              parts_articleNo_20: cand.articleNo,
              parts_langId_20: 4, parts_countryFilterId_20: 81, parts_typeId_20: 1
            }).then(function(vData) {
              if (vData && vData.length && vData[0].articles && vData[0].articles.length) {
                var vc = (vData[0].articles[0].compatibleCars || []).length;
                if (vc > state.bestCount) {
                  state.best = vData[0].articles[0];
                  state.bestCount = vc;
                }
              }
              return state;
            }).catch(function() { return state; });
          });
        });
        return chain.then(function(state) {
          if (!state.best) return Promise.reject('no_results');
          return state.best;
        });
      });
    }

    function buildResultFromArticle(a, articleNo) {
      var result = {
        articleNo: a.articleNo || articleNo,
        articleId: a.articleId,
        supplier: a.supplierName || '',
        product: a.articleProductName || '',
        vehicles: a.compatibleCars || [],
        specs: [],
        oe: [],
        ean: ''
      };
      return api({ endpoint_partsArticleDetailsByArticleId:true, parts_articleId_13:a.articleId, parts_langId_13:4 })
        .then(function(det) {
          if (det && det.length) {
            var d = det[0];
            result.specs = d.articleAllSpecifications || [];
            result.oe = d.articleOemNo || [];
            if (d.articleEanNo && d.articleEanNo.eanNumbers) result.ean = d.articleEanNo.eanNumbers;
            if (d.article) {
              if (!result.product && d.article.articleProductName) result.product = d.article.articleProductName;
              if (!result.supplier && d.article.supplierName) result.supplier = d.article.supplierName;
            }
          }
          return result;
        });
    }

    return tryVariation(0).then(function(data) {
      if (!data || !data.length || !data[0].articles || !data[0].articles.length) {
        return Promise.reject('no_results');
      }
      return buildResultFromArticle(data[0].articles[0], articleNo);
    }).catch(function(err) {
      if (err !== 'no_results') return Promise.reject(err);
      return tryOemSearch(articleNo).then(function(bestArticle) {
        return buildResultFromArticle(bestArticle, articleNo);
      });
    });
  }

  function applyData(data) {
    D.articleNo = data.articleNo || '';
    D.articleId = data.articleId || null;
    D.supplier = data.supplier || '';
    D.product = data.product || '';
    D.ean = data.ean || '';
    D.specs = data.specs || [];
    D.vehicles = data.vehicles || [];
    D.oe = data.oe || [];
  }

  /* ══════════════════════════════════════
     MAIN INIT
     ══════════════════════════════════════ */
  function init() {
    if (!document.getElementById('tecdoc-widget') && !isAutoPartsPage()) return;

    var articleNo = detectArticleNo();
    if (!articleNo) return;

    /* Check if we're on a product page (has price) */
    var pageData = getProductPageData();
    var isProductPage = !!pageData;

    if (!isProductPage) {
      /* Category/results page — use original widget */
      var w = getOrCreateWidget();
      if (!w) return;
      showLoading('\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD...', 30);
    }

    loadFromCache(articleNo)
      .then(function(data) {
        applyData(data);
        if (isProductPage) {
          injectProductPage(pageData);
        } else {
          render();
        }
      })
      .catch(function() {
        if (!isProductPage) {
          showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
        }
        return loadFromAPI(articleNo)
          .then(function(data) {
            applyData(data);
            if (isProductPage) {
              injectProductPage(pageData);
            } else {
              render();
            }
          })
          .catch(function(err) {
            if (!isProductPage) {
              if (err === 'no_results') {
                showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
              } else {
                showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
              }
            }
          });
      });
  }

  /* ── Public API ── */
  window.tecdocSearch = function(articleNo) {
    if (!articleNo || !articleNo.trim()) return;
    var w = getOrCreateWidget();
    if (!w) return;
    D = { articleNo:'', articleId:null, supplier:'', product:'', ean:'', specs:[], vehicles:[], oe:[] };
    showLoading('\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD...', 30);
    loadFromCache(articleNo.trim())
      .then(function(data) { applyData(data); render(); })
      .catch(function() {
        showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
        return loadFromAPI(articleNo.trim())
          .then(function(data) { applyData(data); render(); })
          .catch(function(err) {
            if (err === 'no_results') showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
            else showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
          });
      });
  };

  document.addEventListener('DOMContentLoaded', init);
})();

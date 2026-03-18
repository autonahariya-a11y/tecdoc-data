/**
 * TecDoc Preloader — Eliminates loading delay on product pages
 *
 * This script runs BEFORE widget.js and pre-fetches the TecDoc JSON
 * for the current product using a synchronous approach, so the data
 * is available instantly when widget.js initializes.
 *
 * Place this in Konimbo foot_html BEFORE the widget.js script tag.
 *
 * Strategy:
 * 1. Detect the product SKU from the page DOM (same logic as widget.js)
 * 2. Build the GitHub Pages cache URL
 * 3. Fetch synchronously via XMLHttpRequest (blocking but instant from cache)
 * 4. Store in window.TECDOC_PRELOAD
 * 5. Widget.js picks it up and renders with zero delay
 */
(function() {
  'use strict';

  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';

  /* Detect SKU — mirrors widget.js getStoreSKU() + detectArticleNo() */
  function getStoreSKU() {
    var codeEl = document.querySelector('.code_item');
    if (codeEl) {
      var text = codeEl.textContent.trim();
      text = text.replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g, '').trim();
      if (text) return text;
    }
    var specItems = document.querySelectorAll('#item_specifications li');
    for (var si = 0; si < specItems.length; si++) {
      var b = specItems[si].querySelector('b');
      if (b && b.textContent.indexOf('\u05DE\u05E7') !== -1 && b.textContent.indexOf('\u05D8') !== -1) {
        var span = specItems[si].querySelector('span');
        if (span && span.textContent.trim()) return span.textContent.trim();
      }
    }
    return null;
  }

  function toFilename(artNo) {
    return artNo.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
  }

  /* Generate same filename variations as widget.js */
  function articleVariations(artNo) {
    var variations = [artNo];
    var noTrail = artNo.replace(/[A-Z]$/, '');
    if (noTrail !== artNo && noTrail.length > 3) variations.push(noTrail);
    var nospace = artNo.replace(/[\s.-]/g, '');
    if (nospace !== artNo) variations.push(nospace);
    if (artNo.indexOf('.') > -1) variations.push(artNo.replace(/\./g, ' '));
    return variations;
  }

  /* Only run on product pages (check for price element) */
  var priceEl = document.querySelector('.price_value, .price_current, .price .number, .price_val, .item_current_price');
  if (!priceEl) return;

  var sku = getStoreSKU();
  if (!sku) return;

  /* Use TECDOC_MAP if defined */
  if (window.TECDOC_MAP && window.TECDOC_MAP[sku]) {
    sku = window.TECDOC_MAP[sku];
  }

  var variations = articleVariations(sku);

  /* Try synchronous XHR for each variation (fast from browser/CDN cache) */
  window.TECDOC_PRELOAD = window.TECDOC_PRELOAD || {};

  for (var i = 0; i < variations.length; i++) {
    var filename = toFilename(variations[i]);
    var url = CACHE_URL + filename;
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); /* synchronous */
      xhr.timeout = 3000; /* 3 second timeout — don't block page forever */
      xhr.send();
      if (xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        var key = variations[i].replace(/[^a-zA-Z0-9]/g, '_');
        window.TECDOC_PRELOAD[key] = data;
        /* Also store under the original SKU */
        window.TECDOC_PRELOAD[sku.replace(/[^a-zA-Z0-9]/g, '_')] = data;
        console.log('[TecDoc Preloader] Loaded data for', sku, 'via', filename);
        return; /* success — stop trying variations */
      }
    } catch(e) {
      /* Silently continue to next variation */
    }
  }

  console.log('[TecDoc Preloader] No cached data found for', sku);
})();

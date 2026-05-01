/**
 * TecDoc Preloader — Eliminates loading delay on product pages
 *
 * This script runs BEFORE widget.js and pre-fetches the TecDoc JSON
 * for the current product using async fetch(), so the request starts
 * in parallel with HTML parsing — no render blocking.
 *
 * Place this in Konimbo foot_html BEFORE the widget.js script tag
 * (inline or without defer/async so it runs immediately).
 *
 * Strategy:
 * 1. Detect the product SKU from the page DOM (same logic as widget.js)
 * 2. Build the GitHub Pages cache URL
 * 3. Fire an async fetch() immediately — starts in parallel with page load
 * 4. Store { sku, promise, data } on window.TECDOC_PRELOAD
 * 5. Widget.js picks it up: if data is ready, render instantly (no skeleton)
 */
(function() {
  'use strict';

  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';

  /* ── Detect SKU — mirrors widget.js getStoreSKU() + detectArticleNo() ── */
  function getStoreSKU() {
    var codeEl = document.querySelector('.code_item');
    var sku = null;
    if (codeEl) {
      var text = codeEl.textContent.trim();
      text = text.replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g, '').trim();
      if (text) sku = text;
    }
    if (!sku) {
      var specItems = document.querySelectorAll('#item_specifications li');
      for (var si = 0; si < specItems.length; si++) {
        var b = specItems[si].querySelector('b');
        if (b && b.textContent.indexOf('\u05DE\u05E7') !== -1 && b.textContent.indexOf('\u05D8') !== -1) {
          var span = specItems[si].querySelector('span');
          if (span && span.textContent.trim()) { sku = span.textContent.trim(); break; }
        }
      }
    }
    // Montecchio pattern (4-5 digits + letter) → look for OEM SKU in title instead
    if (sku && /^\d{4,5}[A-Za-z]$/.test(sku)) {
      var title = document.title || '';
      var h1s = document.getElementsByTagName('h1');
      for (var hi = 0; hi < h1s.length; hi++) {
        title += ' ' + (h1s[hi].textContent || '');
      }
      var oemMatches = title.match(/\b([A-Z0-9][A-Z0-9\-]{4,}[0-9])\b/gi) || [];
      for (var om = 0; om < oemMatches.length; om++) {
        var candidate = oemMatches[om].trim();
        if (candidate === sku) continue;
        if (/^\d{4,5}[A-Za-z]$/.test(candidate)) continue;
        if (/[A-Za-z]/.test(candidate) && /\d/.test(candidate)) {
          return candidate;
        }
      }
    }
    return sku;
  }

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

  /* Generate same filename variations as widget.js articleVariations() */
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

  /* ── Only run on product pages ── */
  var priceEl = document.querySelector('.price_value, .price_current, .price .number, .price_val, .item_current_price');
  if (!priceEl) return;

  var articleNo = detectArticleNo();
  if (!articleNo) return;

  var variations = articleVariations(articleNo);

  /* ── Async fetch with variation chain ── */
  function tryCache(idx) {
    if (idx >= variations.length) return Promise.reject('not_cached');
    var filename = variations[idx].replace(/[^a-zA-Z0-9]/g, '_') + '.json';
    return fetch(CACHE_URL + filename)
      .then(function(r) {
        if (!r.ok) return tryCache(idx + 1);
        return r.json();
      });
  }

  var fetchPromise = tryCache(0);

  /* Store both the in-flight promise and (once resolved) the data */
  window.TECDOC_PRELOAD = {
    sku: articleNo,
    promise: fetchPromise,
    data: null
  };

  fetchPromise.then(function(d) {
    window.TECDOC_PRELOAD.data = d;
    console.log('[TecDoc Preloader] Data ready for', articleNo);
  }).catch(function() {
    console.log('[TecDoc Preloader] No cached data found for', articleNo);
  });

})();

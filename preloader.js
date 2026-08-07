/**
 * TecDoc Preloader v5 — Longest-SKU picker across title/H1/URL
 *
 * This script runs BEFORE widget.js and pre-fetches the TecDoc JSON
 * for the current product using async fetch(), so the request starts
 * in parallel with HTML parsing — no render blocking.
 *
 * v5 changes:
 *   • Uses a shared isLikelySku()/pickLongestSku() helper: picks the
 *     LONGEST alphanumeric token (≥6 chars, at least one digit, no Hebrew)
 *     from the title, then H1, then URL path.
 *   • No longer requires the trailing '| אוטו נהריה' anchor — works for
 *     titles that end with the SKU (like '... | 15208AA100').
 *   • URL parse tokenizes on non-alphanumeric characters so long SKUs like
 *     '15208AA100' don't get truncated to 'AA100'.
 */
(function() {
  'use strict';

  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';

  /* ── Longest-SKU picker (shared logic across title / H1 / URL) ── */
  function isLikelySku(candidate) {
    if (!candidate) return false;
    candidate = candidate.trim();
    if (candidate.length < 6 || candidate.length > 30) return false;
    if (/[\u05d0-\u05ea]/.test(candidate)) return false;  /* no Hebrew */
    if (!/\d/.test(candidate)) return false;              /* must have a digit */
    if (!/^[A-Za-z0-9][A-Za-z0-9._\/-]*[A-Za-z0-9]$/.test(candidate)) return false;
    var alnum = candidate.replace(/[^A-Za-z0-9]/g, '');
    if (alnum.length < candidate.length * 0.7) return false;
    return true;
  }
  function pickLongestSku(candidates) {
    var best = null;
    for (var ci = 0; ci < candidates.length; ci++) {
      var c = (candidates[ci] || '').trim();
      if (isLikelySku(c) && (!best || c.length > best.length)) best = c;
    }
    return best;
  }

  function skuFromTitle() {
    var title = document.title || '';
    return pickLongestSku(title.split('|'));
  }

  function skuFromH1() {
    var h1s = document.getElementsByTagName('h1');
    var candidates = [];
    for (var i = 0; i < h1s.length; i++) {
      var toks = (h1s[i].textContent || '').split(/[|\s,\u05f4\u05f3]+/);
      for (var j = 0; j < toks.length; j++) candidates.push(toks[j]);
    }
    return pickLongestSku(candidates);
  }

  function skuFromUrl() {
    var path = decodeURIComponent(window.location.pathname || '');
    return pickLongestSku(path.split(/[^A-Za-z0-9]+/));
  }

  /* ── Detect SKU — mirrors widget.js getStoreSKU() + adds title/url fallback ── */
  function getStoreSKU() {
    /* Try .code_item first — the traditional Konimbo location */
    var codeEl = document.querySelector('.code_item');
    var sku = null;
    if (codeEl) {
      var text = (codeEl.textContent || '').trim();
      text = text.replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g, '').trim();
      if (text) sku = text;
    }
    /* Try #item_specifications */
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

    /* v5: Fallback chain — title, then H1, then URL path */
    if (!sku) sku = skuFromTitle();
    if (!sku) sku = skuFromH1();
    if (!sku) sku = skuFromUrl();

    /* Montecchio pattern (4-5 digits + letter) → look for OEM SKU in title/H1 instead */
    if (sku && /^\d{4,5}[A-Za-z]$/.test(sku)) {
      var searchText = document.title || '';
      var h1s = document.getElementsByTagName('h1');
      for (var hi = 0; hi < h1s.length; hi++) {
        searchText += ' ' + (h1s[hi].textContent || '');
      }
      var oemMatches = searchText.match(/\b([A-Z0-9][A-Z0-9\-]{4,}[0-9])\b/gi) || [];
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
    /* v4: try multiple widget container IDs */
    var el = document.getElementById('tecdoc-widget') ||
             document.getElementById('an-tecdoc-wrap') ||
             document.getElementById('an-tecdoc-section');
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
    /* v4: dashed OEM variant, e.g. 04152YZZA6 → 04152-YZZA6 */
    var dashed = artNo.replace(/^(\d{4,6})([A-Z].+)$/i, '$1-$2');
    if (dashed !== artNo) variations.push(dashed);
    var pfxMatch = artNo.match(/^(FEB|MAN|NGK|BOS|VAL|LUK|SKF|INA|FAG|SNR)(\d{4,})$/i);
    if (pfxMatch) variations.push(pfxMatch[2]);
    var nospace = artNo.replace(/[\s.-]/g, '');
    if (nospace !== artNo) variations.push(nospace);
    return variations;
  }

  /* ── Only run on product pages ──
     v4: widen the selector so it works with newer/custom Konimbo layouts. */
  var priceEl = document.querySelector(
    '.price_value, .price_current, .price .number, .price_val, ' +
    '.item_current_price, #item_show_price, .price_number, ' +
    '[itemprop="price"], .item_price'
  );
  var itemContainer = document.querySelector('#item_details, #item_show, .item_show, .item_page');
  if (!priceEl && !itemContainer) return;

  var articleNo = detectArticleNo();
  if (!articleNo) {
    console.log('[TecDoc Preloader v5] No SKU detected on this page');
    return;
  }

  console.log('[TecDoc Preloader v5] Detected SKU:', articleNo);
  var variations = articleVariations(articleNo);

  /* ── Async fetch with variation chain ── */
  function tryCache(idx) {
    if (idx >= variations.length) return Promise.reject('not_cached');
    var filename = variations[idx].replace(/[^a-zA-Z0-9]/g, '_') + '.json';
    return fetch(CACHE_URL + filename)
      .then(function(r) {
        if (!r.ok) return tryCache(idx + 1);
        return r.json().then(function(data) {
          console.log('[TecDoc Preloader v5] Match on variation:', variations[idx]);
          return data;
        });
      });
  }

  var fetchPromise = tryCache(0);

  window.TECDOC_PRELOAD = {
    sku: articleNo,
    variations: variations,
    promise: fetchPromise,
    data: null
  };

  fetchPromise.then(function(d) {
    window.TECDOC_PRELOAD.data = d;
    console.log('[TecDoc Preloader v5] Data ready for', articleNo);
  }).catch(function(err) {
    console.log('[TecDoc Preloader v5] No cached data for', articleNo, '— tried', variations);
  });

})();

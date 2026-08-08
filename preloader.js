/**
 * TecDoc Preloader v7 — Dual-format cache support (object + array)
 *
 * v7 changes:
 *   • Support NEW cache format: {articleNo, vehicles, specs, oe, ...}
 *     (object with articleNo at root, no articles[] wrapper).
 *   • Still supports OLD format: [{articles: [{compatibleCars, ...}]}]
 *   • Empty-check adapts to whichever format arrived.
 *
 * v6 changes — Longest-SKU picker + null-articles guard
 *
 * v6 changes:
 *   • Filter out cached responses that have articles=null (SKU not in TecDoc).
 *     Storing null-articles as pre.data caused widget's fast-path to apply
 *     empty data and get stuck at loading skeleton.
 *   • Reject SKU candidates that look like year ranges (2011-2017, 2004-2009).
 *     Konimbo's .code_item sometimes shows year range instead of article number.
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

  /* v6: Guard against double-load — theme templates sometimes include this script
     twice, causing duplicate fetches and empty-shell widget race condition. */
  if (window.__TECDOC_PRELOADER_LOADED__) return;
  window.__TECDOC_PRELOADER_LOADED__ = true;

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
    /* v6: Reject year ranges (2011-2017, 2004-2009, 2007-2012) that Konimbo
       sometimes shows in .code_item instead of the real article number. */
    if (/^(19|20)\d{2}[-\u2013\u2014](19|20)\d{2}$/.test(candidate)) return false;
    /* v6: Reject single years like 2015+ */
    if (/^(19|20)\d{2}\+?$/.test(candidate)) return false;
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
      /* v6: Reject year ranges that Konimbo mistakenly puts in .code_item */
      if (text && !/^(19|20)\d{2}[-\u2013\u2014](19|20)\d{2}$/.test(text) && !/^(19|20)\d{2}\+?$/.test(text)) {
        sku = text;
      } else if (text) {
        console.log('[TecDoc Preloader v6] Ignoring year-range in .code_item:', text);
      }
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

  /* v11.22: Cache filename variations — tries the raw SKU + common no-punct forms.
     Cache files are named with underscores replacing / and spaces removed.
     We generate a small set here just for cache lookup; the widget's articleVariations()
     does the full brand-specific fanout for API calls. */
  function articleVariations(artNo) {
    if (!artNo) return [];
    var raw = artNo.trim();
    var variations = [raw];
    var noSpace = raw.replace(/\s+/g, '');
    if (noSpace !== raw) variations.push(noSpace);
    /* Cache files use underscore for slash */
    var underscored = noSpace.replace(/\//g, '_');
    if (underscored !== noSpace) variations.push(underscored);
    /* Drop trailing letter */
    var noTrail = raw.replace(/[A-Za-z]$/, '');
    if (noTrail !== raw && noTrail.length > 3) variations.push(noTrail);
    /* Hyundai/Kia 5-5 dashed */
    var hkMatch = noSpace.toUpperCase().match(/^(\d{5})([\dA-Z]{5})$/);
    if (hkMatch) variations.push(hkMatch[1] + '-' + hkMatch[2]);
    /* Dedupe */
    var seen = {};
    var out = [];
    for (var i = 0; i < variations.length; i++) {
      var v = variations[i];
      if (!v || seen[v.toUpperCase()]) continue;
      seen[v.toUpperCase()] = 1;
      out.push(v);
    }
    return out;
  }

  /* ── Only run on product pages ──
     v5: URL-based detection is the most reliable trigger since hybrid pages
     hide/collapse both #item_details and the price element. */
  var isProductUrl = /\/items\/\d+/.test(window.location.pathname || '');
  var priceEl = document.querySelector(
    '.price_value, .price_current, .price .number, .price_val, ' +
    '.item_current_price, #item_show_price, .price_number, ' +
    '[itemprop="price"], .item_price, .an-price'
  );
  var itemContainer = document.querySelector(
    '#item_details, #item_show, .item_show, .item_page, ' +
    '#an-product-redesign, #an-tecdoc-section, #an-tecdoc-wrap'
  );
  if (!isProductUrl && !priceEl && !itemContainer) return;

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
    /* v7: Support BOTH cache formats:
       - OLD (array): [{articles: [{compatibleCars, ...}]}]  — raw TecDoc API shape
       - NEW (object): {articleNo, supplier, vehicles, specs, oe, ...}  — pre-processed

       Also detect empty responses in either format (null-articles = not in TecDoc). */
    var hasArticles;
    if (Array.isArray(d)) {
      hasArticles = d.length && d[0] && d[0].articles && d[0].articles.length;
    } else if (d && typeof d === 'object') {
      /* New format — populated if it has vehicles OR specs OR articleNo */
      hasArticles = !!(d.articleNo && (
        (d.vehicles && d.vehicles.length) ||
        (d.specs && d.specs.length)
      ));
    } else {
      hasArticles = false;
    }

    if (!hasArticles) {
      console.log('[TecDoc Preloader v7] Cached but empty for', articleNo, '— will let widget fall through to API/error');
      window.TECDOC_PRELOAD.data = null;
      window.TECDOC_PRELOAD.empty = true;
      return;
    }
    window.TECDOC_PRELOAD.data = d;
    console.log('[TecDoc Preloader v7] Data ready for', articleNo, '(' + (Array.isArray(d) ? 'array' : 'object') + ' format)');
  }).catch(function(err) {
    console.log('[TecDoc Preloader v7] No cached data for', articleNo, '— tried', variations);
  });

})();

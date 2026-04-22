/* ============================================================
 * Auto Nahariya — Smart Search Results Filter
 * ============================================================
 * Runs on /search?q=...&make=...&model=...&year=...
 * Reads products from Konimbo's native search results and filters/sorts
 * by fitment using BOTH the product_lookup.json (title-parsed vehicles)
 * AND TecDoc JSON files (strict manufacturer+model+year range match).
 *
 * Matching priority (strict → lenient):
 *   1. TecDoc JSON match (manufacturer + model + year in interval)
 *   2. Title match (brand carry-forward + base model alias)
 *   3. No match → hidden (strict mode) or dimmed (soft mode)
 *
 * Installation: add to Konimbo Hybrid body_html OR foot_html.
 * Load product_lookup.json from GitHub Pages (same infra as tecdoc-data).
 * ============================================================ */
(function () {
  'use strict';

  /* ── Only run on the search page ───────────────────── */
  if (location.pathname.indexOf('/search') !== 0) return;

  /* ── Read params from URL ──────────────────────────── */
  function getParam(name) {
    var qs = location.search.substring(1).split('&');
    for (var i = 0; i < qs.length; i++) {
      var kv = qs[i].split('=');
      if (decodeURIComponent(kv[0]) === name) {
        return decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')).trim();
      }
    }
    return '';
  }
  var q     = getParam('q');
  var make  = getParam('make');
  var model = getParam('model');
  var year  = getParam('year');
  var plate = getParam('plate');
  /* If no vehicle context, nothing to filter — let Konimbo render as usual */
  if (!make && !model && !year && !plate) return;

  /* ── Config ─────────────────────────────────────────── */
  /* Allow override via window.ANH_BASE (for local preview / staging) */
  var BASE = window.ANH_BASE || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var LOOKUP_URL = window.ANH_LOOKUP_URL || (BASE + '/product_lookup.json');
  var DATA_URL = BASE + '/data/';
  var STRICT = true;  /* true = hide non-matching; false = dim */

  /* ── Categories config (TOP 10 in catalog) ─────────── */
  /* Maps category name (from product_lookup.json 'c' field) to image file */
  var CATEGORY_IMAGES = {
    'רפידות בלם':        'brake_pads',
    'פילטר שמן':         'oil_filter',
    'פילטר אויר':        'air_filter',
    'רצועות אביזרים':    'belts',
    'בולמי תא מטען':     'trunk_strut',
    'משולשים':           'triangle',
    'מצתים':             'sparkplugs',
    'פילטר מזגן':        'cabin_filter',
    'בולם מכסה מנוע':    'hood_strut',
    'סליל הצתה':         'coil'
  };
  var CATEGORIES_URL = BASE + '/categories/';

  /* ── Brand aliases Hebrew → English ────────────────── */
  var BRAND_ALIAS = {
    'טויוטה':['TOYOTA'], 'יונדאי':['HYUNDAI'], 'קיה':['KIA'],
    'מזדה':['MAZDA'], 'הונדה':['HONDA'], 'ניסן':['NISSAN'],
    'סובארו':['SUBARU'], 'מיצובישי':['MITSUBISHI'], 'סוזוקי':['SUZUKI'],
    'לקסוס':['LEXUS'], 'אינפיניטי':['INFINITI'], 'דייהטסו':['DAIHATSU'],
    'איסוזו':['ISUZU'], 'פורד':['FORD'], 'שברולט':['CHEVROLET'],
    'קאדילק':['CADILLAC'], 'דודג\'':['DODGE'], 'ג\'יפ':['JEEP'],
    'קרייזלר':['CHRYSLER'], 'ביואיק':['BUICK'],
    'אאודי':['AUDI'], 'ב.מ.וו':['BMW'], 'במוו':['BMW'],
    'מרצדס':['MERCEDES','MERCEDES-BENZ'], 'פולקסווגן':['VW','VOLKSWAGEN'],
    'סקודה':['SKODA'], 'סיאט':['SEAT'], 'פורשה':['PORSCHE'],
    'אופל':['OPEL','VAUXHALL'], 'פיאט':['FIAT'],
    'אלפא רומיאו':['ALFA ROMEO'], 'לנצ\'יה':['LANCIA'],
    'פג\'ו':['PEUGEOT'], 'סיטרואן':['CITROEN','CITROËN'],
    'רנו':['RENAULT'], 'דאצ\'יה':['DACIA'],
    'וולוו':['VOLVO'], 'סאאב':['SAAB'], 'מיני':['MINI'],
    'לנד רובר':['LAND ROVER'], 'ג\'אגואר':['JAGUAR'],
    'טסלה':['TESLA'],
    'גילי':['GEELY'], 'צ\'רי':['CHERY'], 'MG':['MG'],
    'ביוויי':['BYD'], 'BYD':['BYD']
  };

  function normalizeBrand(heBrand) {
    if (!heBrand) return [];
    var key = heBrand.trim();
    if (BRAND_ALIAS[key]) return BRAND_ALIAS[key];
    /* Try partial match */
    for (var k in BRAND_ALIAS) {
      if (key.indexOf(k) !== -1 || k.indexOf(key) !== -1) return BRAND_ALIAS[k];
    }
    return [key.toUpperCase()];
  }

  /* ── Extract base model (strip engine size, generation codes) ─ */
  function baseModel(modelStr) {
    if (!modelStr) return '';
    return modelStr.replace(/\([^)]*\)/g,'')
                   .replace(/\d+\.\d+/g,'')
                   .replace(/\s+/g,' ').trim().toUpperCase();
  }

  /* ── Normalize for Hebrew matching ─ */
  function normHe(s) {
    return (s || '').toLowerCase()
      .replace(/['"״׳]/g,'')
      .replace(/\s+/g,' ').trim();
  }

  /* ── Check title-based fitment (from "רכבים מהכותרת") ─ */
  function titleMatches(titleField, heBrand, heModel) {
    if (!titleField) return false;
    if (!heBrand && !heModel) return true;
    var entries = titleField.split(',');
    var currentBrand = '';
    var heBrandN = normHe(heBrand);
    var heModelN = normHe(heModel);
    for (var i = 0; i < entries.length; i++) {
      var n = normHe(entries[i]);
      /* Check if entry starts with a known brand */
      for (var b in BRAND_ALIAS) {
        if (n.indexOf(b) !== -1) { currentBrand = b; break; }
      }
      var brandOk = !heBrand ||
                    (currentBrand && currentBrand === heBrandN) ||
                    n.indexOf(heBrandN) !== -1;
      var modelOk = !heModel || n.indexOf(heModelN) !== -1;
      if (brandOk && modelOk) return true;
    }
    return false;
  }

  /* ── Check TecDoc fitment (strict: mfr + model + year in interval) ─ */
  function tecdocMatches(vehicles, mfrEnList, baseModelEn, yr) {
    if (!vehicles || !vehicles.length) return false;
    var yearI = parseInt(yr, 10) || 0;
    for (var i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      var vMfr = (v.manufacturerName || '').toUpperCase();
      /* Manufacturer check — any alias matches */
      var mfrOk = false;
      for (var m = 0; m < mfrEnList.length; m++) {
        if (vMfr.indexOf(mfrEnList[m]) !== -1) { mfrOk = true; break; }
        /* VW ↔ VOLKSWAGEN */
        if (mfrEnList[m] === 'VW' && vMfr.indexOf('VOLKSWAGEN') !== -1) { mfrOk = true; break; }
      }
      if (!mfrOk) continue;
      /* Model check (if provided) */
      if (baseModelEn) {
        var vModel = (v.modelName || '').toUpperCase();
        if (vModel.indexOf(baseModelEn) === -1) continue;
      }
      /* Year check (if provided) */
      if (yearI) {
        var s = (v.constructionIntervalStart || '').substring(0, 4);
        var e = (v.constructionIntervalEnd || '').substring(0, 4);
        var sY = parseInt(s, 10) || 0;
        var eY = parseInt(e, 10) || 9999;
        if (yearI < sY || yearI > eY) continue;
      }
      return true;
    }
    return false;
  }

  /* ── Main flow ──────────────────────────────────── */
  var mfrEnList = normalizeBrand(make);
  var baseModelEn = '';  /* English base model — currently we don't translate Hebrew models, rely on Konimbo's q= for text match + title for H match */
  console.log('[SearchFilter] Vehicle:', make, '/', model, '/', year, '→ EN:', mfrEnList);

  /* Fetch master product lookup (once, cached) */
  fetch(LOOKUP_URL + '?v=' + Date.now(), { cache: 'default' })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .then(function (lookup) {
      runFilter(lookup);
    })
    .catch(function (err) {
      console.warn('[SearchFilter] lookup fetch failed:', err);
      runFilter({});
    });

  function runFilter(lookup) {
    /* Expose lookup to category-strip builder */
    window.__anhLookup = lookup;
    /* Insert vehicle context banner */
    injectBanner();

    /* Find product cards on page. Konimbo uses .item_ib / .item_box / etc. */
    var cards = document.querySelectorAll('.item_ib, .item_box, .item, [data-item-id]');
    console.log('[SearchFilter] Found', cards.length, 'product cards');

    var matched = 0, hidden = 0, pending = 0;

    cards.forEach(function (card) {
      /* Extract Konimbo product ID from link or data attribute */
      var kid = '';
      var link = card.querySelector('a[href*="/items/"]');
      if (link) {
        var m = link.href.match(/\/items\/(\d+)/);
        if (m) kid = m[1];
      }
      if (!kid) return;  /* skip non-product cards */
      card.setAttribute('data-anh-kid', kid);

      var entry = lookup[kid];
      if (!entry) {
        /* No data — mark as unknown */
        markCard(card, 'unknown');
        if (STRICT) hidden++;
        return;
      }

      /* Check title match first (fast path) */
      var titleOk = titleMatches(entry.title, make, model);
      if (titleOk) {
        markCard(card, 'match');
        matched++;
        return;
      }

      /* Check pre-computed TecDoc data in the sheet (mfrs/mdls/y) */
      var tecdocSheetOk = false;
      if (entry.mfrs) {
        var mfrs = entry.mfrs.toUpperCase();
        for (var mi = 0; mi < mfrEnList.length; mi++) {
          if (mfrs.indexOf(mfrEnList[mi]) !== -1) { tecdocSheetOk = true; break; }
        }
        if (tecdocSheetOk && year && entry.y) {
          var ym = entry.y.match(/(\d{4})\s*-\s*(\d{4})/);
          if (ym) {
            var yI = parseInt(year,10);
            if (yI < parseInt(ym[1],10) || yI > parseInt(ym[2],10)) tecdocSheetOk = false;
          }
        }
      }
      if (tecdocSheetOk) {
        markCard(card, 'match');
        matched++;
        return;
      }

      /* If OEM code exists — fetch per-SKU JSON (strict TecDoc) */
      if (entry.oem) {
        pending++;
        var fname = entry.oem.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
        fetch(DATA_URL + fname, { cache: 'force-cache' })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            pending--;
            if (data && data.vehicles &&
                tecdocMatches(data.vehicles, mfrEnList, baseModelEn, year)) {
              markCard(card, 'match');
              matched++;
            } else {
              markCard(card, 'no-match');
              if (STRICT) hidden++;
            }
            updateBanner(matched, hidden, pending);
          })
          .catch(function () {
            pending--;
            markCard(card, 'unknown');
            if (STRICT) hidden++;
            updateBanner(matched, hidden, pending);
          });
      } else {
        markCard(card, 'no-match');
        if (STRICT) hidden++;
      }
    });
    updateBanner(matched, hidden, pending);
  }

  /* ── Mark a product card visually ─── */
  function markCard(card, state) {
    card.classList.remove('anh-match','anh-no-match','anh-unknown');
    card.classList.add('anh-' + state);
    if (STRICT && (state === 'no-match' || state === 'unknown')) {
      card.style.display = 'none';
    } else if (state === 'match') {
      /* Add a small "✓ מתאים לרכב שלך" badge */
      if (!card.querySelector('.anh-fit-badge')) {
        var badge = document.createElement('div');
        badge.className = 'anh-fit-badge';
        badge.textContent = '✓ מתאים לרכב שלך';
        badge.style.cssText = 'position:absolute;top:8px;right:8px;background:#1A9FD5;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700;z-index:2;';
        card.style.position = card.style.position || 'relative';
        card.insertBefore(badge, card.firstChild);
      }
    }
  }

  /* ── Inject a banner at top of search results ─── */
  function injectBanner() {
    if (document.getElementById('anh-vehicle-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'anh-vehicle-banner';
    banner.style.cssText = 'background:linear-gradient(135deg,#1A9FD5 0%,#0B3E5C 100%);color:#fff;padding:14px 20px;border-radius:12px;margin:0 0 20px;font-family:Rubik,Assistant,Heebo,Arial,sans-serif;direction:rtl;box-shadow:0 4px 12px rgba(11,62,92,0.2);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;';
    var label = plate ? ('מספר רכב: ' + plate) :
                        [make, model, year].filter(Boolean).join(' ');
    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:10px;">' +
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="14"/></svg>' +
        '<div><div style="font-size:12px;opacity:0.85;">מציג חלקים לרכב:</div>' +
        '<div style="font-size:17px;font-weight:700;">' + label + '</div></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;align-items:center;">' +
        '<span id="anh-counter" style="font-size:13px;opacity:0.9;">מסנן…</span>' +
        '<button id="anh-show-all" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;">הצג הכל</button>' +
        '<button id="anh-change-car" style="background:#F37021;border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;">שנה רכב</button>' +
      '</div>';

    /* Inject BEFORE results container (not inside — avoids grid layout) */
    var target = document.querySelector('#search_results, .search_results, #items_list, .items_list');
    if (target && target.parentNode) {
      target.parentNode.insertBefore(banner, target);
    } else {
      (document.querySelector('main, #content') || document.body).insertBefore(banner, document.body.firstChild);
    }

    document.getElementById('anh-show-all').addEventListener('click', function () {
      STRICT = false;
      document.querySelectorAll('.anh-no-match, .anh-unknown').forEach(function(c){
        c.style.display = '';
        c.style.opacity = '0.5';
      });
      this.style.display = 'none';
    });
    document.getElementById('anh-change-car').addEventListener('click', function () {
      location.href = '/';
    });
  }

  function updateBanner(matched, hidden, pending) {
    var el = document.getElementById('anh-counter');
    if (!el) return;
    if (pending > 0) {
      el.textContent = 'מסנן… (' + matched + ' התאמות)';
    } else {
      el.textContent = matched + ' מוצרים מתאימים · ' + hidden + ' הוסתרו';
    }
    /* Once filtering completes, build category strip from matched products */
    if (pending === 0 && !window.__anhCatsBuilt) {
      window.__anhCatsBuilt = true;
      setTimeout(buildCategoryStrip, 100);
    }
  }

  /* ── Category strip: shows clickable categories of matched products ── */
  function buildCategoryStrip() {
    if (document.getElementById('anh-category-strip')) return;
    if (!window.__anhLookup) return;

    /* Count how many MATCHED (visible) products fall in each category */
    var catCounts = {};
    var cards = document.querySelectorAll('.anh-match');
    cards.forEach(function (card) {
      var kid = card.getAttribute('data-anh-kid');
      if (!kid) return;
      var entry = window.__anhLookup[kid];
      if (!entry || !entry.c) return;
      var c = entry.c.trim();
      if (!CATEGORY_IMAGES[c]) return;  /* only show TOP 10 */
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    var cats = Object.keys(catCounts).sort(function (a, b) {
      return catCounts[b] - catCounts[a];
    });
    if (cats.length === 0) return;

    /* Build the strip */
    var strip = document.createElement('div');
    strip.id = 'anh-category-strip';
    strip.style.cssText = 'direction:rtl;font-family:Rubik,Assistant,Heebo,Arial,sans-serif;margin:0 0 24px;';

    var title = document.createElement('div');
    title.style.cssText = 'font-size:16px;font-weight:700;color:#0B3E5C;margin-bottom:12px;';
    title.textContent = 'עיין לפי קטגוריה';
    strip.appendChild(title);

    var scroller = document.createElement('div');
    scroller.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px;';

    cats.forEach(function (c) {
      var tile = document.createElement('button');
      tile.className = 'anh-cat-tile';
      tile.setAttribute('data-cat', c);
      tile.style.cssText = 'background:#fff;border:2px solid #E5ECF2;border-radius:12px;padding:10px 8px;cursor:pointer;transition:all 0.2s;display:flex;flex-direction:column;align-items:center;gap:8px;font-family:inherit;';
      tile.innerHTML =
        '<div style="width:70px;height:70px;background:linear-gradient(135deg,#E8F4FB 0%,#C7E4F3 100%);border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
          '<img src="' + CATEGORIES_URL + CATEGORY_IMAGES[c] + '.webp" alt="' + c + '" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="this.style.display=\'none\'" />' +
        '</div>' +
        '<div style="font-size:13px;font-weight:600;color:#0B3E5C;text-align:center;line-height:1.2;">' + c + '</div>' +
        '<div style="font-size:11px;color:#1A9FD5;font-weight:700;">' + catCounts[c] + ' מוצרים</div>';

      tile.addEventListener('mouseenter', function () {
        this.style.borderColor = '#1A9FD5';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 16px rgba(26,159,213,0.2)';
      });
      tile.addEventListener('mouseleave', function () {
        if (this.getAttribute('data-active') !== '1') {
          this.style.borderColor = '#E5ECF2';
          this.style.transform = '';
          this.style.boxShadow = '';
        }
      });
      tile.addEventListener('click', function () {
        filterByCategory(this.getAttribute('data-cat'), this);
      });
      scroller.appendChild(tile);
    });

    strip.appendChild(scroller);

    var banner = document.getElementById('anh-vehicle-banner');
    if (banner && banner.parentNode) {
      /* Insert AFTER the banner (outside the grid) */
      banner.parentNode.insertBefore(strip, banner.nextSibling);
    }
  }

  /* Filter visible cards by category — click again to clear */
  function filterByCategory(cat, clickedTile) {
    var tiles = document.querySelectorAll('.anh-cat-tile');
    var isActive = clickedTile.getAttribute('data-active') === '1';

    /* Reset all tiles */
    tiles.forEach(function (t) {
      t.setAttribute('data-active', '0');
      t.style.background = '#fff';
      t.style.borderColor = '#E5ECF2';
      t.style.transform = '';
      t.style.boxShadow = '';
    });

    var cards = document.querySelectorAll('.anh-match');

    if (isActive) {
      /* Clear filter — show all matching */
      cards.forEach(function (c) { c.style.display = ''; });
      return;
    }

    /* Activate this tile */
    clickedTile.setAttribute('data-active', '1');
    clickedTile.style.background = 'linear-gradient(135deg,#1A9FD5 0%,#0B3E5C 100%)';
    clickedTile.style.borderColor = '#0B3E5C';
    clickedTile.querySelectorAll('div').forEach(function (d) {
      if (d.style.color) d.style.color = '#fff';
    });

    /* Filter cards */
    cards.forEach(function (card) {
      var kid = card.getAttribute('data-anh-kid');
      var entry = window.__anhLookup[kid];
      if (entry && entry.c && entry.c.trim() === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    /* Scroll to top of results */
    var banner = document.getElementById('anh-vehicle-banner');
    if (banner) banner.scrollIntoView({behavior:'smooth',block:'start'});
  }
})();

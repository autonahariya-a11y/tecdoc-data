/* ================================================================================
 * Auto Nahariya — Inline Parts Finder
 * ================================================================================
 * Hijacks the #anh-parts-finder widget on autonahariya.co.il homepage.
 * Instead of redirecting to an external demo, loads product data lazily and
 * renders filtered results *in place* on the homepage — replacing the banner
 * groups (#homepage_group1..4) with a grid of matching products.
 *
 * Loads:
 *   - product_lookup.json  (1.1MB, ~2,177 products with fitment metadata)
 *   - price_map.json, image_map.json, sku_map.json (real Konimbo data)
 *   - /data/*.json (per-OEM TecDoc JSONs) on demand
 *
 * Failure mode: if load fails, we silently allow the original redirect behavior
 * so the user is not left stranded.
 * ================================================================================ */
(function () {
  'use strict';

  /* ── Config — single place to change ─────────────────────────── */
  var BASE = 'https://autonahariya-a11y.github.io/tecdoc-data/parts-finder';
  var TECDOC_DATA = 'https://autonahariya-a11y.github.io/tecdoc-data/data/';
  var VERSION = 'v1';

  /* ── Bail if widget not present ─────────────────────────────── */
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var widget = document.getElementById('anh-parts-finder');
    if (!widget) return;

    /* ── Reposition widget if it ended up at the bottom of <body> ─────── */
    /* When site admins paste the widget HTML via foot_html, it lands as a direct
       child of <body> and appears at the bottom of the page. We move it to right
       before #homepage_group1 (top banners area) so it sits in the hero region. */
    try {
      var parent = widget.parentElement;
      var landedInBody = parent && parent.tagName === 'BODY';
      if (landedInBody) {
        var target = document.getElementById('homepage_group1');
        if (target && target.parentNode) {
          target.parentNode.insertBefore(widget, target);
        } else {
          /* fallback — move to top of main content area */
          var main = document.querySelector('#bg_middle, .main_content, main');
          if (main) main.insertBefore(widget, main.firstChild);
        }
      }
    } catch (e) { /* best-effort — keep going */ }

    /* Find containers to hide when showing results */
    var homepageGroups = [];
    for (var gi = 1; gi <= 4; gi++) {
      var g = document.getElementById('homepage_group' + gi);
      if (g) homepageGroups.push(g);
    }

    /* Inject results CSS into <head> (innerHTML <style> tags don't always activate) */
    if (!document.getElementById('anh-ir-styles')) {
      var styleEl = document.createElement('style');
      styleEl.id = 'anh-ir-styles';
      styleEl.textContent = RESULTS_CSS;
      document.head.appendChild(styleEl);
    }

    /* Results container — inserted right after widget */
    var resultsWrap = document.createElement('div');
    resultsWrap.id = 'anh-inline-results';
    resultsWrap.setAttribute('hidden', '');
    resultsWrap.innerHTML =
      '<div class="anh-ir__header">' +
        '<div class="anh-ir__title-wrap">' +
          '<h2 class="anh-ir__title" id="anh-ir-title"></h2>' +
          '<span class="anh-ir__count" id="anh-ir-count"></span>' +
        '</div>' +
        '<button type="button" class="anh-ir__back" id="anh-ir-back">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
          '<span>חזרה לדף הבית</span>' +
        '</button>' +
      '</div>' +
      '<div class="anh-ir__cat-strip" id="anh-ir-cat-strip"></div>' +
      '<div class="anh-ir__grid" id="anh-ir-grid"></div>' +
      '<div class="anh-ir__empty" id="anh-ir-empty" hidden>' +
        '<p>לא נמצאו חלקים מתאימים לרכב זה במאגר הנוכחי.</p>' +
        '<p class="anh-ir__empty-hint">נסה רכב אחר, או <a href="/search?q=">חפש חופשי באתר</a>.</p>' +
      '</div>';
    widget.parentNode.insertBefore(resultsWrap, widget.nextSibling);

    document.getElementById('anh-ir-back').addEventListener('click', hideResults);

    /* Initialize widget UI (tabs + selects) — self-contained, no dependency on old inline script */
    initWidgetInterface(widget);

    /* ── Hijack all three submission paths ────────────────────── */
    /* Override data-target so the inline JS within the widget can't redirect */
    widget.dataset.target = 'javascript:void(0)';

    /* Capture phase listener on the widget itself — runs BEFORE the widget's own submit handler */
    widget.addEventListener('submit', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      /* stopImmediatePropagation too — the widget's inline script adds its own handler */
      if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      var form = ev.target;
      if (!form || !form.matches || !form.matches('.anh-widget__form')) return;

      var params = {};
      if (form.id === 'anh-plate-form') {
        var plate = (form.querySelector('#anh-plate-input') || {}).value || '';
        params.plate = plate.replace(/\D/g, '');
      } else if (form.id === 'anh-vehicle-form') {
        params.make   = (form.querySelector('#anh-sel-make')   || {}).value || '';
        var modelVal  = (form.querySelector('#anh-sel-model')  || {}).value || '';
        params.model  = modelVal === '__any__' ? '' : modelVal;
        params.year   = (form.querySelector('#anh-sel-year')   || {}).value || '';
        params.engine = (form.querySelector('#anh-sel-engine') || {}).value || '';
      }

      runSearch(form, params);
    }, true); /* capture = true */

    /* ── Widget UI initialization (tabs + cascading selects) ─────────── */
    function initWidgetInterface(root) {
      /* Tabs — switch between plate and vehicle forms */
      var tabs = root.querySelectorAll('.anh-widget__tab');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('anh-widget__tab--active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('anh-widget__tab--active');
          tab.setAttribute('aria-selected', 'true');
          var mode = tab.dataset.mode;
          root.querySelectorAll('.anh-widget__form').forEach(function (f) {
            f.hidden = f.dataset.mode !== mode;
          });
        });
      });

      /* Plate input — digits only, max 8 */
      var plateInput = root.querySelector('#anh-plate-input');
      if (plateInput) {
        plateInput.addEventListener('input', function () {
          plateInput.value = plateInput.value.replace(/[^\d]/g, '').slice(0, 8);
        });
      }

      /* Vehicle selects cascade: make > model > year > engine */
      var selMake   = root.querySelector('#anh-sel-make');
      var selModel  = root.querySelector('#anh-sel-model');
      var selYear   = root.querySelector('#anh-sel-year');
      var selEngine = root.querySelector('#anh-sel-engine');
      var vehBtn    = root.querySelector('#anh-vehicle-form .anh-widget__submit');
      if (!selMake || !selModel || !selYear || !selEngine) return;

      var topMakes = [
        'טויוטה','יונדאי','סקודה','קיה','מזדה',
        'וולקסווגן','פיאט','פורד','שברולט','רנו',
        'פיג׳ו','ניסאן','סיטרואן','BMW','מרצדס',
        'הונדה','סוזוקי','מיצובישי','סובארו','אופל'
      ];
      topMakes.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        selMake.appendChild(opt);
      });
      selMake.disabled = false;

      function resetSelect(sel, placeholder) {
        sel.innerHTML = '<option value="">' + placeholder + '</option>';
        sel.disabled = true;
      }

      selMake.addEventListener('change', function () {
        resetSelect(selModel,  'בחר דגם…');
        resetSelect(selYear,   'בחר שנה…');
        resetSelect(selEngine, 'בחר מנוע…');
        if (vehBtn) vehBtn.disabled = true;
        if (!selMake.value) return;
        selModel.disabled = false;
        selModel.innerHTML = '<option value="">בחר דגם…</option><option value="__any__">כל הדגמים</option>';
      });

      selModel.addEventListener('change', function () {
        resetSelect(selYear,   'בחר שנה…');
        resetSelect(selEngine, 'בחר מנוע…');
        if (vehBtn) vehBtn.disabled = true;
        if (!selModel.value) return;
        var cur = new Date().getFullYear();
        for (var y = cur; y >= 1990; y--) {
          var opt = document.createElement('option');
          opt.value = String(y); opt.textContent = String(y);
          selYear.appendChild(opt);
        }
        selYear.disabled = false;
      });

      selYear.addEventListener('change', function () {
        resetSelect(selEngine, 'בחר מנוע…');
        if (vehBtn) vehBtn.disabled = true;
        if (!selYear.value) return;
        var engines = [
          { v: 'petrol',   t: 'בנזין' },
          { v: 'diesel',   t: 'דיזל' },
          { v: 'hybrid',   t: 'היברידי' },
          { v: 'electric', t: 'חשמלי' },
          { v: 'any',      t: 'כל סוגי המנוע' }
        ];
        engines.forEach(function (e) {
          var opt = document.createElement('option');
          opt.value = e.v; opt.textContent = e.t;
          selEngine.appendChild(opt);
        });
        selEngine.disabled = false;
      });

      selEngine.addEventListener('change', function () {
        if (vehBtn) vehBtn.disabled = !selEngine.value;
      });
    }


    /* ── Search flow ──────────────────────────────────────────── */
    var dataCache = null;
    var loading = null;

    function runSearch(form, params) {
      setButtonLoading(form, true);
      ensureData()
        .then(function (data) {
          setButtonLoading(form, false);
          return resolveVehicle(params, data).then(function (resolved) {
            if (!resolved || !resolved.make) {
              /* Plate lookup failed or no vehicle context — show empty state */
              showEmpty(params.plate ? 'מספר הרכב ' + params.plate : 'הרכב שלך');
              return;
            }
            showResults(resolved, data);
          });
        })
        .catch(function (err) {
          setButtonLoading(form, false);
          console.error('[anh-inline] search failed — falling back to external demo', err);
          /* Fallback: redirect to the hosted parts-finder page which has the same data bundled. */
          var qs = new URLSearchParams();
          Object.keys(params).forEach(function (k) { if (params[k]) qs.set(k, params[k]); });
          window.location.href = BASE + '/?' + qs.toString();
        });
    }

    function ensureData() {
      if (dataCache) return Promise.resolve(dataCache);
      if (loading) return loading;
      loading = Promise.all([
        fetchJSON(BASE + '/product_lookup.json?' + VERSION),
        fetchJSON(BASE + '/price_map.json?' + VERSION),
        fetchJSON(BASE + '/image_map.json?' + VERSION),
        fetchJSON(BASE + '/sku_map.json?' + VERSION),
        fetchJSON(BASE + '/demo_ids.json?' + VERSION)
      ]).then(function (r) {
        dataCache = { lookup: r[0], prices: r[1], images: r[2], skus: r[3], demoIds: r[4] };
        return dataCache;
      });
      return loading;
    }

    function fetchJSON(url) {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('Fetch failed: ' + url);
        return r.json();
      });
    }

    /* ── Plate → vehicle resolution (via gov.il or cache) ──────── */
    function resolveVehicle(params, data) {
      if (params.make || params.model || params.year) {
        return Promise.resolve({
          make: params.make, model: params.model, year: params.year, engine: params.engine
        });
      }
      if (params.plate) {
        /* Try gov.il open-data API — CORS-friendly endpoint */
        var plateNum = params.plate;
        var url = 'https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=' + encodeURIComponent(plateNum) + '&limit=1';
        return fetch(url)
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var rec = (j && j.result && j.result.records && j.result.records[0]) || null;
            if (!rec) return null;
            /* Fields: tozeret_nm (make), kinuy_mishari (commercial name/model), shnat_yitzur (year) */
            return {
              make: (rec.tozeret_nm || '').split(' ')[0].trim(),  /* "טויוטה יפן" -> "טויוטה" */
              model: (rec.kinuy_mishari || '').trim(),
              year: String(rec.shnat_yitzur || '').trim(),
              engine: ''
            };
          })
          .catch(function () { return null; });
      }
      return Promise.resolve(null);
    }

    /* ── Render ───────────────────────────────────────────────── */
    function showResults(vehicle, data) {
      var title = 'חלקים מתאימים ל' +
        (vehicle.make ? vehicle.make + ' ' : '') +
        (vehicle.model ? vehicle.model + ' ' : '') +
        (vehicle.year ? vehicle.year : '').trim();
      document.getElementById('anh-ir-title').textContent = title;

      /* Filter products */
      var matches = filterProducts(vehicle, data);
      var countEl = document.getElementById('anh-ir-count');
      countEl.textContent = matches.length + ' מוצרים';

      var grid = document.getElementById('anh-ir-grid');
      grid.innerHTML = '';
      /* Inline style as a belt-and-braces safety against Konimbo CSS overrides */
      grid.style.cssText = 'display:grid !important; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap:16px !important; width:100% !important;';
      var empty = document.getElementById('anh-ir-empty');

      if (matches.length === 0) {
        empty.hidden = false;
        grid.hidden = true;
      } else {
        empty.hidden = true;
        grid.hidden = false;
        matches.forEach(function (p) { grid.appendChild(buildCard(p, data)); });
      }

      /* Category strip */
      renderCategoryStrip(matches);

      /* Hide banners, show results, scroll to widget */
      homepageGroups.forEach(function (g) { g.style.display = 'none'; });
      resultsWrap.hidden = false;
      widget.scrollIntoView({ behavior: 'smooth', block: 'start' });

      /* Analytics */
      try {
        if (window.dataLayer) window.dataLayer.push({
          event: 'anh_parts_search',
          make: vehicle.make, model: vehicle.model, year: vehicle.year,
          matches: matches.length
        });
      } catch (e) {}
    }

    function showEmpty(label) {
      document.getElementById('anh-ir-title').textContent = 'לא מצאנו את ' + label;
      document.getElementById('anh-ir-count').textContent = '';
      document.getElementById('anh-ir-grid').innerHTML = '';
      document.getElementById('anh-ir-grid').hidden = true;
      document.getElementById('anh-ir-empty').hidden = false;
      homepageGroups.forEach(function (g) { g.style.display = 'none'; });
      resultsWrap.hidden = false;
      widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function hideResults() {
      resultsWrap.hidden = true;
      homepageGroups.forEach(function (g) { g.style.display = ''; });
      widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function buildCard(p, data) {
      var kid = p.kid;
      var card = document.createElement('article');
      card.className = 'anh-ir__card';
      /* Inline styles as a safety net against Konimbo CSS overrides */
      card.style.cssText = 'background:#fff !important;border:1px solid #e5ebf0 !important;border-radius:12px !important;overflow:hidden !important;display:flex !important;flex-direction:column !important;width:auto !important;max-width:100% !important;float:none !important;text-align:right !important;';
      var img = p.img || '';
      var priceDisp = (p.price !== undefined && p.price !== null && p.price !== '')
        ? '₪ ' + p.price
        : '—';
      var skuDisp = p.sku || p.oem || kid;
      var prodUrl = 'https://www.autonahariya.co.il/items/' + kid;

      /* Styles applied inline to each element */
      var sThumb = 'display:flex !important;align-items:center !important;justify-content:center !important;background:#fff !important;aspect-ratio:1 !important;overflow:hidden !important;text-decoration:none !important;min-height:200px !important;';
      var sImg   = 'max-width:100% !important;max-height:100% !important;object-fit:contain !important;padding:16px !important;box-sizing:border-box !important;';
      var sCat   = 'font-size:12px !important;color:#1A9FD5 !important;padding:10px 14px 4px !important;text-align:right !important;';
      var sName  = 'margin:0 !important;padding:0 14px 10px !important;font-size:14px !important;line-height:1.4 !important;font-weight:600 !important;text-align:right !important;';
      var sNameA = 'color:#0B3E5C !important;text-decoration:none !important;';
      var sPrice = 'padding:0 14px !important;font-size:22px !important;font-weight:700 !important;color:#F37021 !important;text-align:right !important;margin-top:auto !important;';
      var sSku   = 'padding:2px 14px 10px !important;font-size:12px !important;color:#6b7780 !important;text-align:right !important;';
      var sActs  = 'display:grid !important;grid-template-columns:1fr 1fr !important;gap:0 !important;border-top:1px solid #e5ebf0 !important;';
      var sBtnC  = 'display:flex !important;align-items:center !important;justify-content:center !important;padding:12px !important;font-size:14px !important;font-weight:600 !important;text-decoration:none !important;background:#F37021 !important;color:#fff !important;';
      var sBtnP  = 'display:flex !important;align-items:center !important;justify-content:center !important;padding:12px !important;font-size:14px !important;font-weight:600 !important;text-decoration:none !important;background:#fff !important;color:#1A9FD5 !important;border-right:1px solid #e5ebf0 !important;';

      card.innerHTML =
        '<a class="anh-ir__thumb" style="' + sThumb + '" href="' + prodUrl + '" target="_blank" rel="noopener">' +
          (img ? '<img style="' + sImg + '" src="' + img + '" alt="' + escapeHtml(p.c || '') + '" loading="lazy">'
                : '<div class="anh-ir__thumb-fallback">' + escapeHtml(p.c || 'מוצר') + '</div>') +
        '</a>' +
        '<div class="anh-ir__cat" style="' + sCat + '">' + escapeHtml(p.c || '') + '</div>' +
        '<h3 class="anh-ir__name" style="' + sName + '"><a style="' + sNameA + '" href="' + prodUrl + '" target="_blank" rel="noopener">' +
          escapeHtml((p.n || '').substring(0, 80)) + '</a></h3>' +
        '<div class="anh-ir__price" style="' + sPrice + '">' + priceDisp + '</div>' +
        '<div class="anh-ir__sku" style="' + sSku + '">מק"ט: ' + escapeHtml(skuDisp) + '</div>' +
        '<div class="anh-ir__actions" style="' + sActs + '">' +
          '<a class="anh-ir__btn anh-ir__btn--cart" style="' + sBtnC + '" href="' + prodUrl + '#add-to-cart" target="_blank" rel="noopener">הוסף לעגלה</a>' +
          '<a class="anh-ir__btn anh-ir__btn--prod" style="' + sBtnP + '" href="' + prodUrl + '" target="_blank" rel="noopener">לדף המוצר</a>' +
        '</div>';
      return card;
    }

    function renderCategoryStrip(matches) {
      var strip = document.getElementById('anh-ir-cat-strip');
      strip.innerHTML = '';
      var counts = {};
      matches.forEach(function (p) {
        var c = p.c || 'אחר';
        counts[c] = (counts[c] || 0) + 1;
      });
      var cats = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 8);
      if (cats.length < 2) return;
      cats.forEach(function (c) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'anh-ir__chip';
        chip.dataset.cat = c;
        chip.innerHTML = '<span>' + escapeHtml(c) + '</span><em>' + counts[c] + '</em>';
        chip.addEventListener('click', function () {
          var active = chip.classList.contains('active');
          strip.querySelectorAll('.anh-ir__chip').forEach(function (x) { x.classList.remove('active'); });
          if (!active) chip.classList.add('active');
          filterByCategory(active ? '' : c);
        });
        strip.appendChild(chip);
      });
      var all = document.createElement('button');
      all.type = 'button';
      all.className = 'anh-ir__chip anh-ir__chip--all';
      all.innerHTML = '<span>הכל</span>';
      all.addEventListener('click', function () {
        strip.querySelectorAll('.anh-ir__chip').forEach(function (x) { x.classList.remove('active'); });
        filterByCategory('');
      });
      strip.insertBefore(all, strip.firstChild);
    }

    function filterByCategory(cat) {
      var cards = document.querySelectorAll('#anh-ir-grid .anh-ir__card');
      cards.forEach(function (card) {
        var cardCat = card.querySelector('.anh-ir__cat').textContent;
        card.style.display = (!cat || cardCat === cat) ? '' : 'none';
      });
    }

    /* ── Filtering logic (ported, simplified from search-filter.js) ─ */
    function filterProducts(vehicle, data) {
      var BRAND_ALIAS = {
        'טויוטה':['TOYOTA'], 'יונדאי':['HYUNDAI'], 'קיה':['KIA'],
        'מזדה':['MAZDA'], 'הונדה':['HONDA'], 'ניסן':['NISSAN'], 'ניסאן':['NISSAN'],
        'סובארו':['SUBARU'], 'מיצובישי':['MITSUBISHI'], 'סוזוקי':['SUZUKI'],
        'לקסוס':['LEXUS'], 'אינפיניטי':['INFINITI'], 'דייהטסו':['DAIHATSU'],
        'איסוזו':['ISUZU'], 'פורד':['FORD'], 'שברולט':['CHEVROLET'],
        'אאודי':['AUDI'], 'ב.מ.וו':['BMW'], 'במוו':['BMW'], 'BMW':['BMW'],
        'מרצדס':['MERCEDES','MERCEDES-BENZ'], 'פולקסווגן':['VOLKSWAGEN','VW'], 'וולקסווגן':['VOLKSWAGEN','VW'],
        'סקודה':['SKODA'], 'סיאט':['SEAT'], 'פורשה':['PORSCHE'],
        'אופל':['OPEL','VAUXHALL'], 'פיאט':['FIAT'],
        'אלפא רומיאו':['ALFA ROMEO'],
        "פג'ו":['PEUGEOT'], 'פיג׳ו':['PEUGEOT'], 'פיגו':['PEUGEOT'],
        'סיטרואן':['CITROEN','CITROËN'], 'רנו':['RENAULT'], 'דאצ\'יה':['DACIA'],
        "דודג'":['DODGE'], "ג'יפ":['JEEP'], 'קרייזלר':['CHRYSLER']
      };
      var MODEL_ALIAS = {
        'קורולה':['COROLLA'],'יאריס':['YARIS'],'אוריס':['AURIS'],'ראב4':['RAV4','RAV 4'],
        'קאמרי':['CAMRY'],'קמרי':['CAMRY'],'היילקס':['HILUX'],'פריוס':['PRIUS'],
        'סיטרואן':[],'וויגו':['WIGO'],'ויגו':['WIGO'],'אייגו':['AYGO'],
        'טוסון':['TUCSON'],'איוניק':['IONIQ'],'אלנטרה':['ELANTRA'],'סונטה':['SONATA'],
        'i10':['I10'],'i20':['I20'],'i25':['I25'],'i30':['I30'],'סנטה פה':['SANTA FE'],
        'פיקנטו':['PICANTO'],'ריו':['RIO'],'ספורטג':['SPORTAGE'],'סיד':['CEED','CEE\'D','PROCEED'],
        'קרניבל':['CARNIVAL','SEDONA'],'סטוניק':['STONIC'],'סלטוס':['SELTOS'],'נירו':['NIRO'],
        '3':['3','MAZDA3'],'6':['6','MAZDA6'],'CX-3':['CX-3'],'CX-5':['CX-5'],
        'סיוויק':['CIVIC'],'אקורד':['ACCORD'],'ג\'אז':['JAZZ'],'HR-V':['HR-V','HRV'],
        'מיקרה':['MICRA'],'קשקאי':['QASHQAI'],'ג\'וק':['JUKE'],'פאלסאר':['PULSAR'],
        'לנסר':['LANCER'],'אאוטלנדר':['OUTLANDER'],'ASX':['ASX'],
        'פוקוס':['FOCUS'],'פיאסטה':['FIESTA'],'קוגה':['KUGA','ESCAPE'],
        'גולף':['GOLF'],'פולו':['POLO'],'פאסאט':['PASSAT'],'ג\'טה':['JETTA'],'טיגואן':['TIGUAN'],
        'אוקטביה':['OCTAVIA'],'פאביה':['FABIA'],'קודיאק':['KODIAQ'],'קארוק':['KAROQ'],
        '500':['500'],'פנדה':['PANDA'],'דוקאטו':['DUCATO'],
        '207':['207'],'208':['208'],'301':['301'],'308':['308'],'3008':['3008'],'5008':['5008'],
        'קליאו':['CLIO'],'מגאן':['MEGANE'],'קפצ\'ור':['CAPTUR'],'קדג\'אר':['KADJAR']
      };

      var mfrEnList = BRAND_ALIAS[vehicle.make] || [(vehicle.make || '').toUpperCase()];
      var baseModelEn = (function () {
        var m = vehicle.model || '';
        /* Strip common suffixes */
        m = m.replace(/\s+Verso\b/ig, '').trim();
        for (var k in MODEL_ALIAS) {
          if (m.indexOf(k) !== -1 || m.toUpperCase().indexOf(k.toUpperCase()) !== -1) {
            return MODEL_ALIAS[k];
          }
        }
        var up = m.toUpperCase().trim();
        return up ? [up] : [];
      })();
      var yr = parseInt(vehicle.year, 10) || 0;

      var out = [];
      var lookup = data.lookup;
      var demoIds = data.demoIds;

      /* For now limit to products with price+image (the 140-product demo set).
       * Later: expand to full 2,177. */
      var ids = demoIds && demoIds.length ? demoIds : Object.keys(lookup);

      for (var i = 0; i < ids.length; i++) {
        var kid = String(ids[i]);
        var p = lookup[kid];
        if (!p) continue;
        /* Price gate — only show priced products (prices guaranteed for demoIds) */
        if (p.price === undefined || p.price === null || p.price === '') continue;

        /* Check mdls + title match */
        var mdlsOk = mdlsGenMatches(p.mdls || '', mfrEnList, baseModelEn, yr);
        var titleOk = titleMatches(p.title || '', vehicle.make, vehicle.model, yr);

        if (mdlsOk || titleOk) {
          out.push({
            kid: kid,
            n: p.n || '',
            c: p.c || '',
            price: p.price,
            sku: p.sku || '',
            oem: p.oem || '',
            img: p.img || ''
          });
        }
      }
      return out;
    }

    /* ── Fitment core (simplified ports) ───────────────────────── */
    var GEN_MAP = {
      'TOYOTA|COROLLA': [
        { from: 2000, to: 2007, gens: ['_E12_','ZZE12','CDE12','NDE12','ZRE12'] },
        { from: 2006, to: 2013, gens: ['_E15_','ZZE15','ZRE15','ADE15','NDE15'] },
        { from: 2013, to: 2018, gens: ['_E18_','ZRE17','ZRE18','ADE17','NDE17'] },
        { from: 2018, to: 2026, gens: ['_E21_','ZWE21','MZEA12','NRE21','ZRE21'] }
      ],
      'TOYOTA|YARIS': [
        { from: 2005, to: 2013, gens: ['_P9_','NCP9','KSP9','NLP9','ZSP9','SCP9'] },
        { from: 2010, to: 2020, gens: ['_P13_','NCP13','NSP13','NHP13','KSP13'] },
        { from: 2019, to: 2026, gens: ['_P15_','KSP21','MXPA1','MXPH1'] }
      ],
      'TOYOTA|AURIS': [
        { from: 2006, to: 2012, gens: ['_E15_','NZE15','ZRE15','ZZE15','ADE15','NDE15'] },
        { from: 2012, to: 2019, gens: ['_E18_','ZRE18','ADE18','NDE18','NRE18','ZWE18'] }
      ],
      'TOYOTA|RAV4': [
        { from: 2000, to: 2005, gens: ['_A2_','ACA2','CLA2','ZCA2'] },
        { from: 2005, to: 2013, gens: ['_A3_','ACA3','ALA3','GSA3','_MK3'] },
        { from: 2012, to: 2019, gens: ['_A4_','ALA4','ASA4','AVA4','WWA4','ZSA4'] },
        { from: 2018, to: 2026, gens: ['_A5_','AXAA5','AXAH5','MXAA5','MXAP5'] }
      ],
      'TOYOTA|HILUX': [
        { from: 2004, to: 2015, gens: ['_N1_','KUN1','GGN1','TGN1','_MK6','_MK7'] },
        { from: 2015, to: 2026, gens: ['_N1_','GUN1','TGN1','_MK8'] }
      ],
      'HYUNDAI|TUCSON': [
        { from: 2004, to: 2010, gens: ['_JM','TL_MK1'] },
        { from: 2009, to: 2015, gens: ['LM_','_IX35','IX35'] },
        { from: 2015, to: 2020, gens: ['_TL','TL_'] },
        { from: 2020, to: 2026, gens: ['_NX4','NX4_'] }
      ],
      'HYUNDAI|I20': [
        { from: 2008, to: 2014, gens: ['_PB_','_PBT_'] },
        { from: 2014, to: 2020, gens: ['_GB_','_IB_'] },
        { from: 2020, to: 2026, gens: ['_BC3_','_BI3_'] }
      ],
      'HYUNDAI|ELANTRA': [
        { from: 2006, to: 2011, gens: ['_HD'] },
        { from: 2010, to: 2015, gens: ['_MD','_UD'] },
        { from: 2015, to: 2020, gens: ['_AD'] },
        { from: 2020, to: 2026, gens: ['_CN7_'] }
      ],
      'KIA|PICANTO': [
        { from: 2003, to: 2011, gens: ['_SA'] },
        { from: 2011, to: 2017, gens: ['_TA'] },
        { from: 2017, to: 2026, gens: ['_JA'] }
      ],
      'KIA|SPORTAGE': [
        { from: 2004, to: 2010, gens: ['_JE_','_KM_'] },
        { from: 2010, to: 2015, gens: ['_SL'] },
        { from: 2015, to: 2022, gens: ['_QL','QLE_'] },
        { from: 2021, to: 2026, gens: ['_NQ5_'] }
      ],
      'KIA|CEED': [
        { from: 2006, to: 2012, gens: ['_ED'] },
        { from: 2012, to: 2018, gens: ['_JD'] },
        { from: 2018, to: 2026, gens: ['_CD'] }
      ],
      'NISSAN|MICRA': [
        { from: 2003, to: 2010, gens: ['_K12','K12_'] },
        { from: 2010, to: 2017, gens: ['_K13','K13_'] },
        { from: 2017, to: 2026, gens: ['_K14','K14_'] }
      ],
      'NISSAN|QASHQAI': [
        { from: 2007, to: 2014, gens: ['_J10','J10_'] },
        { from: 2013, to: 2021, gens: ['_J11','J11_'] },
        { from: 2021, to: 2026, gens: ['_J12','J12_'] }
      ]
    };

    var BRAND_FAMILIES = [
      ['TOYOTA','LEXUS','DAIHATSU'],
      ['HYUNDAI','KIA','GENESIS'],
      ['VOLKSWAGEN','VW','AUDI','SKODA','SEAT','CUPRA'],
      ['RENAULT','DACIA'],
      ['NISSAN','INFINITI','DATSUN'],
      ['PEUGEOT','CITROEN','CITROËN','DS','OPEL','VAUXHALL'],
      ['FIAT','ALFA ROMEO','LANCIA'],
      ['JEEP','CHRYSLER','DODGE','RAM'],
      ['BMW','MINI','ROLLS-ROYCE'],
      ['MERCEDES','MERCEDES-BENZ','SMART'],
      ['HONDA','ACURA']
    ];
    function brandFamily(make) {
      for (var i = 0; i < BRAND_FAMILIES.length; i++) {
        if (BRAND_FAMILIES[i].indexOf(make) !== -1) return i;
      }
      return 'M:' + make;
    }

    function mdlsGenMatches(mdls, mfrEnList, baseModelEnList, yr) {
      if (!mdls) return false;
      var up = mdls.toUpperCase();
      var entries = [];
      var depth = 0, cur = '';
      for (var i = 0; i < up.length; i++) {
        var ch = up.charAt(i);
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
          if (cur.trim()) entries.push(cur.trim());
          cur = '';
        } else cur += ch;
      }
      if (cur.trim()) entries.push(cur.trim());
      var famSet = {};
      for (var fe = 0; fe < entries.length; fe++) {
        var firstWord = entries[fe].split(/\s+/)[0];
        if (firstWord) famSet[brandFamily(firstWord)] = 1;
      }
      var nFams = 0; for (var fk in famSet) nFams++;
      if (nFams >= 3) return false;
      if (nFams >= 2 && entries.length >= 8) return false;

      for (var e = 0; e < entries.length; e++) {
        var line = entries[e];
        var mfrOk = false;
        for (var m = 0; m < mfrEnList.length; m++) {
          if (line.indexOf(mfrEnList[m]) === 0) { mfrOk = true; break; }
          if (mfrEnList[m] === 'VW' && line.indexOf('VOLKSWAGEN') === 0) { mfrOk = true; break; }
        }
        if (!mfrOk) continue;
        if (baseModelEnList && baseModelEnList.length) {
          var modelOk = false;
          for (var mm = 0; mm < baseModelEnList.length; mm++) {
            var needle = baseModelEnList[mm];
            var idx = line.indexOf(needle);
            if (idx === -1) continue;
            var before = idx === 0 ? ' ' : line.charAt(idx - 1);
            var after = idx + needle.length >= line.length ? ' ' : line.charAt(idx + needle.length);
            if (/[\s\-]/.test(before) && /[\s\(,]/.test(after)) { modelOk = true; break; }
          }
          if (!modelOk) continue;
        }
        if (baseModelEnList.indexOf('COROLLA') !== -1 && /COROLLA\s+VERSO/.test(line)) continue;
        if (!yr) return true;
        var paren = line.match(/\(([^)]+)\)/);
        var genCodes = paren ? paren[1] : '';
        var mapHit = null;
        for (var mmi = 0; mmi < mfrEnList.length && !mapHit; mmi++) {
          for (var mni = 0; mni < baseModelEnList.length && !mapHit; mni++) {
            var key = mfrEnList[mmi] + '|' + baseModelEnList[mni];
            if (GEN_MAP[key]) mapHit = GEN_MAP[key];
          }
        }
        if (!mapHit) {
          if (entries.length <= 4) return true;
          continue;
        }
        if (entries.length > 25) continue;
        for (var g = 0; g < mapHit.length; g++) {
          if (yr < mapHit[g].from || yr > mapHit[g].to) continue;
          for (var gg = 0; gg < mapHit[g].gens.length; gg++) {
            if (genCodes.indexOf(mapHit[g].gens[gg]) !== -1) return true;
          }
        }
      }
      return false;
    }

    function titleMatches(titleField, heBrand, heModel, yr) {
      if (!titleField) return false;
      if (!heBrand && !heModel) return true;
      var norm = function (s) { return (s || '').replace(/[\u0591-\u05c7]/g, '').replace(/\s+/g, ' ').trim().toUpperCase(); };
      var titleN = norm(titleField);
      var brandN = norm(heBrand);
      var modelN = norm(heModel);
      /* Brand check */
      if (brandN && titleN.indexOf(brandN) === -1) return false;
      /* Model check */
      if (modelN && titleN.indexOf(modelN) === -1) return false;
      /* Year check — if title contains a year range, gate by it */
      if (yr) {
        var rangeMatch = titleN.match(/(19|20)\d{2}\s*[-–]\s*(19|20)?\d{2,4}/);
        if (rangeMatch) {
          var parts = rangeMatch[0].replace(/\s/g, '').split(/[-–]/);
          var fromY = parseInt(parts[0], 10);
          var toY = parseInt(parts[1], 10);
          if (toY < 100) toY = 2000 + toY;
          if (fromY && toY && (yr < fromY || yr > toY)) return false;
        }
      }
      return true;
    }

    /* ── Helpers ──────────────────────────────────────────────── */
    function escapeHtml(s) {
      return String(s || '').replace(/[&<>"']/g, function (c) {
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
      });
    }

    function setButtonLoading(form, on) {
      var btn = form.querySelector('.anh-widget__submit');
      if (!btn) return;
      if (on) {
        btn.setAttribute('aria-busy', 'true');
        btn.disabled = true;
        btn.dataset._origText = btn.dataset._origText || (btn.querySelector('span') ? btn.querySelector('span').textContent : '');
        if (btn.querySelector('span')) btn.querySelector('span').textContent = 'טוען…';
      } else {
        btn.removeAttribute('aria-busy');
        btn.disabled = false;
        if (btn.querySelector('span') && btn.dataset._origText) btn.querySelector('span').textContent = btn.dataset._origText;
      }
    }
  });

  /* ── Styles for inline results (scoped with #anh-inline-results for max specificity) ── */
  var RESULTS_CSS = [
    '#anh-inline-results{direction:rtl;max-width:1200px;margin:20px auto 40px;padding:0 16px;font-family:Heebo,Rubik,Arial,sans-serif;box-sizing:border-box}',
    '#anh-inline-results[hidden]{display:none}',
    '#anh-inline-results *{box-sizing:border-box}',
    '#anh-inline-results .anh-ir__header{display:flex;align-items:center;justify-content:space-between;gap:12px;background:linear-gradient(135deg,#0B3E5C,#1A9FD5);color:#fff;padding:16px 20px;border-radius:12px;margin-bottom:16px;flex-wrap:wrap}',
    '#anh-inline-results .anh-ir__title-wrap{display:flex;align-items:baseline;gap:10px;flex:1;min-width:200px}',
    '#anh-inline-results .anh-ir__title{font-size:20px;font-weight:700;margin:0;color:#fff}',
    '#anh-inline-results .anh-ir__count{font-size:14px;opacity:0.9}',
    '#anh-inline-results .anh-ir__back{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;transition:background .15s}',
    '#anh-inline-results .anh-ir__back:hover{background:rgba(255,255,255,0.25)}',
    '#anh-inline-results .anh-ir__cat-strip{display:flex;gap:8px;overflow-x:auto;padding:4px 0 12px;margin-bottom:8px;scrollbar-width:thin}',
    '#anh-inline-results .anh-ir__chip{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid #dfe6ec;border-radius:20px;padding:6px 14px;cursor:pointer;font-size:14px;color:#0B3E5C;white-space:nowrap;transition:all .15s}',
    '#anh-inline-results .anh-ir__chip:hover{border-color:#1A9FD5}',
    '#anh-inline-results .anh-ir__chip.active{background:#1A9FD5;color:#fff;border-color:#1A9FD5}',
    '#anh-inline-results .anh-ir__chip em{font-style:normal;background:rgba(0,0,0,0.08);padding:1px 6px;border-radius:10px;font-size:12px}',
    '#anh-inline-results .anh-ir__chip.active em{background:rgba(255,255,255,0.25)}',
    '#anh-inline-results .anh-ir__chip--all{background:#0B3E5C;color:#fff;border-color:#0B3E5C}',
    '#anh-inline-results .anh-ir__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;width:100%}',
    '#anh-inline-results .anh-ir__card{background:#fff;border:1px solid #e5ebf0;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .15s;width:auto;max-width:100%;float:none}',
    '#anh-inline-results .anh-ir__card:hover{box-shadow:0 6px 20px rgba(11,62,92,0.12)}',
    '#anh-inline-results .anh-ir__thumb{display:flex;align-items:center;justify-content:center;background:#fff;aspect-ratio:1;overflow:hidden;text-decoration:none}',
    '#anh-inline-results .anh-ir__thumb img{max-width:100%;max-height:100%;object-fit:contain;padding:16px;box-sizing:border-box}',
    '#anh-inline-results .anh-ir__thumb-fallback{color:#9aa6b2;font-size:14px}',
    '#anh-inline-results .anh-ir__cat{font-size:12px;color:#1A9FD5;padding:10px 14px 4px;text-align:right}',
    '#anh-inline-results .anh-ir__name{margin:0;padding:0 14px 10px;font-size:14px;line-height:1.4;font-weight:600;text-align:right}',
    '#anh-inline-results .anh-ir__name a{color:#0B3E5C;text-decoration:none}',
    '#anh-inline-results .anh-ir__name a:hover{color:#1A9FD5}',
    '#anh-inline-results .anh-ir__price{padding:0 14px;font-size:22px;font-weight:700;color:#F37021;text-align:right;margin-top:auto}',
    '#anh-inline-results .anh-ir__sku{padding:2px 14px 10px;font-size:12px;color:#6b7780;text-align:right}',
    '#anh-inline-results .anh-ir__actions{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid #e5ebf0}',
    '#anh-inline-results .anh-ir__btn{display:flex;align-items:center;justify-content:center;padding:12px;font-size:14px;font-weight:600;text-decoration:none;transition:background .15s}',
    '#anh-inline-results .anh-ir__btn--cart{background:#F37021;color:#fff}',
    '#anh-inline-results .anh-ir__btn--cart:hover{background:#d95e18}',
    '#anh-inline-results .anh-ir__btn--prod{background:#fff;color:#1A9FD5;border-right:1px solid #e5ebf0}',
    '#anh-inline-results .anh-ir__btn--prod:hover{background:#f4fafd}',
    '#anh-inline-results .anh-ir__empty{text-align:center;padding:40px 16px;background:#fff;border:1px dashed #cfd8df;border-radius:12px;color:#6b7780}',
    '#anh-inline-results .anh-ir__empty-hint{font-size:13px;margin-top:8px}',
    '#anh-inline-results .anh-ir__empty a{color:#1A9FD5}',
    '@media(max-width:600px){#anh-inline-results .anh-ir__grid{grid-template-columns:repeat(2,1fr);gap:10px}#anh-inline-results .anh-ir__btn{padding:10px 4px;font-size:13px}#anh-inline-results .anh-ir__price{font-size:18px}#anh-inline-results .anh-ir__title{font-size:16px}}'
  ].join("");

})();

/* TecDoc Widget v8 — Autodoc-Exact Layout + Full Cache
   Vertical sections (no tabs): Description → Vehicle Compatibility → OE Numbers
   Loads pre-fetched TecDoc data from GitHub Pages JSON cache.
   91 products cached. Falls back to live API only if available.
*/
(function () {
  'use strict';

  /* ══ CONFIGURATION ══ */
  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';
  var APIFY_TOKEN = window.TECDOC_APIFY_TOKEN || '';
  var API_URL = APIFY_TOKEN ? 'https://api.apify.com/v2/acts/making-data-meaningful~tecdoc/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120' : '';

  /* How many spec rows to show before "More ▼" */
  var SPECS_VISIBLE = 6;

  /* ── Hebrew translations ── */
  var SPEC_TR = {
    'Fitting Position': 'מיקום התקנה',
    'Height [mm]': 'גובה [מ"מ]',
    'Bore Diameter [mm]': 'קוטר נקב [מ"מ]',
    'Brake Disc Type': 'סוג דיסק בלם',
    'Brake Disc Thickness [mm]': 'עובי דיסק [מ"מ]',
    'Minimum thickness [mm]': 'עובי מינימלי [מ"מ]',
    'Hole Arrangement/Number': 'סידור/מספר חורים',
    'Inner Diameter [mm]': 'קוטר פנימי [מ"מ]',
    'Outer Diameter [mm]': 'קוטר חיצוני [מ"מ]',
    'Centering Diameter [mm]': 'קוטר מרכוז [מ"מ]',
    'Bolt Hole Circle Ø [mm]': 'מעגל ברגים Ø [מ"מ]',
    'Diameter [mm]': 'קוטר [מ"מ]',
    'Surface': 'משטח', 'Drilled': 'מקודח',
    'Material': 'חומר', 'Weight [kg]': 'משקל [ק"ג]',
    'Length [mm]': 'אורך [מ"מ]', 'Width [mm]': 'רוחב [מ"מ]',
    'Thickness [mm]': 'עובי [מ"מ]',
    'WVA Number': 'מספר WVA',
    'Brake System': 'מערכת בלימה',
    'Number per Axle': 'כמות לסרן',
    'Wear Warning Contact': 'חיישן בלאי',
    'Machining': 'עיבוד', 'Product line': 'קו מוצר',
    'Test Mark': 'תו תקן', 'Condition': 'מצב',
    'Tightening Torque [Nm]': 'מומנט הידוק [Nm]',
    'Number of Holes': 'מספר חורים',
    'Rim Hole Number': 'מספר חורי חישוק',
    'Supplementary Article/Supplementary Info': 'מידע משלים',
    'for PR number': 'למספר PR',
    'Manufacturer': 'יצרן', 'EAN number': 'מספר EAN',
    'Item number': 'מק"ט', 'directional': 'כיווני',
    'Paired product': 'מוצר מתאים',
    'Number of wear indicators [per axle]': 'מספר חיישני בלאי לסרן',
    'Warning Contact Length [mm]': 'אורך חיישן [מ"מ]',
    'Supplementary Article/Info 2': 'מידע משלים 2',
    'Supplementary Article/Info': 'מידע משלים',
    'Axle version': 'גרסת סרן',
    'Pad Thickness [mm]': 'עובי רפידה [מ"מ]',
    'Pad Thickness 1 [mm]': 'עובי רפידה 1 [מ"מ]',
    'with accessories': 'עם אביזרים',
    'Number per Axle': 'כמות לסרן',
    'Packing Type': 'סוג אריזה',
    'Vehicle Equipment': 'ציוד רכב',
    'Check Character': 'תו בדיקה',
    'MAPP': 'MAPP',
    'Spring/Clamp': 'קפיץ/מהדק',
    'Coating': 'ציפוי'
  };

  var VAL_TR = {
    'HA': 'סרן אחורי', 'VA': 'סרן קדמי',
    'Front Axle': 'סרן קדמי', 'Rear Axle': 'סרן אחורי',
    'Front Axle Left': 'סרן קדמי שמאל',
    'Front Axle Right': 'סרן קדמי ימין',
    'Rear Axle Left': 'סרן אחורי שמאל',
    'Rear Axle Right': 'סרן אחורי ימין',
    'not prepared': 'לא מוכן', 'prepared': 'מוכן',
    'with integrated wear warning contact': 'עם חיישן בלאי משולב',
    'without wear warning contact': 'ללא חיישן בלאי',
    'Externally Vented': 'מאוורר חיצונית',
    'Internally Vented': 'מאוורר פנימית',
    'Full': 'מלא', 'Solid': 'מלא',
    'Perforated': 'מנוקב', 'Coated': 'מצופה',
    'High-carbon': 'פחמן גבוה',
    'yes': 'כן', 'no': 'לא', 'New': 'חדש',
    '37': 'מצופה'
  };
  var DISC_MAP = { '1': 'מלא', '2': 'מאוורר', '3': 'מאוורר פנימי' };

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
      text = text.replace(/^[מק"ט:.\s]+/g, '').trim();
      if (text) return text;
    }
    return null;
  }

  /* ── Category detection ── */
  function isAutoPartsPage() {
    /* Check breadcrumb for category 186807 (חלקי חילוף לרכב) */
    var bcLink = document.querySelector('#bread_crumbs a[href*="186807"]');
    if (bcLink) return true;
    /* Fallback: check breadcrumb text */
    var bc = document.getElementById('bread_crumbs');
    if (bc && bc.textContent.indexOf('חלקי חילוף לרכב') !== -1) return true;
    return false;
  }

  /* ── Injection ── */
  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;

    /* Priority 1: Replace #item_content ("מידע נוסף") on Konimbo product pages */
    var itemContent = document.getElementById('item_content');
    if (itemContent) {
      var h3 = itemContent.querySelector('h3, #item_content_title');
      if (h3) h3.textContent = 'פרטים טכניים';
      var specContainer = itemContent.querySelector('.specifications');
      if (specContainer) { specContainer.innerHTML = ''; }
      var widget = document.createElement('div');
      widget.id = 'tecdoc-widget';
      if (specContainer) { specContainer.appendChild(widget); }
      else { itemContent.appendChild(widget); }
      return widget;
    }

    /* Priority 2: Use existing #item_specifications if present */
    var specsDiv = document.querySelector('#item_specifications .specifications');
    if (specsDiv) {
      specsDiv.innerHTML = '';
      var widget2 = document.createElement('div');
      widget2.id = 'tecdoc-widget';
      specsDiv.appendChild(widget2);
      var header = document.querySelector('#item_specifications h3');
      if (header) header.textContent = 'פרטים טכניים';
      return widget2;
    }

    /* Priority 3: Fallback — create before #item_also_buy or #item_info */
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
        wh3.textContent = 'פרטים טכניים';
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
      '<div class="tw-loading-step">הנתונים נטענים מ-TecDoc — אנא המתינו</div></div>';
  }

  function showError(msg) {
    var w = getWidget(); if (!w) return;
    /* Hide the entire widget section when no data is found */
    var parent = w.closest('#item_content, #item_specifications');
    if (parent) { parent.style.display = 'none'; }
    else { w.style.display = 'none'; }
  }

  /* ═══ RENDER — Autodoc Vertical Sections ═══ */
  function render() {
    var w = getWidget(); if (!w) return;
    var html = '';

    /* ── SECTION 1: Description / Specs ── */
    html += '<div class="tw-section tw-desc-section">';
    html += '<div class="tw-section-title">תיאור</div>';
    if (!D.specs.length && !D.articleNo && !D.supplier && !D.ean) {
      html += '<div class="tw-empty">לא נמצאו מפרטים טכניים</div>';
    } else {
      /* Build spec rows: TecDoc specs + article/supplier/EAN */
      var allSpecs = [];
      for (var i = 0; i < D.specs.length; i++) {
        allSpecs.push({ name: trSpec(D.specs[i].criteriaName), value: trVal(D.specs[i].criteriaName, D.specs[i].criteriaValue) });
      }
      if (D.articleNo) allSpecs.push({ name: 'מק"ט', value: D.articleNo });
      if (D.supplier) allSpecs.push({ name: 'יצרן', value: D.supplier });
      if (D.ean) allSpecs.push({ name: 'מספר EAN', value: D.ean });

      var hasHidden = allSpecs.length > SPECS_VISIBLE;
      html += '<table class="tw-specs-table" id="tw-specs-tbl">';
      for (var si = 0; si < allSpecs.length; si++) {
        var cls = si >= SPECS_VISIBLE ? ' class="tw-spec-hidden"' : '';
        html += '<tr'+cls+'><td>'+esc(allSpecs[si].name)+':</td><td>'+esc(allSpecs[si].value)+'</td></tr>';
      }
      html += '</table>';

      if (hasHidden) {
        html += '<div class="tw-more-wrap"><button type="button" class="tw-more-btn" id="tw-more-toggle">עוד <span class="tw-arrow">▼</span></button></div>';
      }
    }
    html += '</div>';

    /* ── SECTION 2: Vehicle Compatibility ── */
    html += '<div class="tw-section tw-compat-section">';
    html += '<div class="tw-compat-header">';
    html += '<span class="tw-compat-icon">🚗</span>';
    html += '<span class="tw-compat-title">התאמה לרכבים</span>';
    html += '</div>';

    if (!D.vehicles.length) {
      html += '<div class="tw-empty">לא נמצאו רכבים תואמים</div>';
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

    /* ── SECTION 3: OE Numbers (accordion with +/- per brand) ── */
    html += '<div class="tw-section tw-oe-section">';
    html += '<div class="tw-oe-header">';
    html += '<div class="tw-oe-title">מספרי OE</div>';
    html += '<div class="tw-oe-subtitle">מספרי OE מקבלים למספר חלק החילוף המקורי:</div>';
    html += '</div>';

    if (!D.oe.length) {
      html += '<div class="tw-empty">לא נמצאו מספרי OE</div>';
    } else {
      /* Group OE by brand for accordion display */
      var byBrand = {};
      for (var oi = 0; oi < D.oe.length; oi++) {
        var o = D.oe[oi], brand = o.oemBrand || 'Other';
        if (!byBrand[brand]) byBrand[brand] = [];
        if (byBrand[brand].indexOf(o.oemDisplayNo) === -1) byBrand[brand].push(o.oemDisplayNo);
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
      html += '<div class="tw-oe-info">מספרי ה-OE משמשים להשוואה בלבד. יש לוודא התאמה לרכב הספציפי לפני רכישה.</div>';
    }
    html += '</div>';

    html += '<div class="tw-footer"><span>נתונים מ-TecDoc® Catalogue</span></div>';

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

  function bindAccordions(w) {
    var hs = w.querySelectorAll('.tw-acc-l1-header,.tw-acc-l2-header');
    for (var i = 0; i < hs.length; i++) {
      hs[i].addEventListener('click', function() {
        var p = this.parentElement, ic = this.querySelector('.tw-acc-icon'), open = p.classList.contains('tw-open');
        p.classList.toggle('tw-open');
        if (ic) ic.textContent = open ? '+' : '−';
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
      btn.innerHTML = expanded ? 'פחות <span class="tw-arrow">▲</span>' : 'עוד <span class="tw-arrow">▼</span>';
    });
  }

  /* ── Load from cached JSON ── */
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
    /* Strip trailing letter suffixes (X=Xtra, S=Sport, etc.) */
    var noTrail = artNo.replace(/[A-Z]$/, '');
    if (noTrail !== artNo && noTrail.length > 3) variations.push(noTrail);
    /* Add spaces for Brembo-style numbers (P85126 -> P 85 126) */
    var spaced = artNo.replace(/([A-Za-z]+)(\d+)/g, function(m, letters, digits) {
      var d = digits;
      if (d.length === 5) d = d.slice(0,2) + ' ' + d.slice(2);
      else if (d.length === 6) d = d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4);
      else if (d.length === 4) d = d.slice(0,2) + ' ' + d.slice(2);
      return letters + ' ' + d;
    });
    if (spaced !== artNo) variations.push(spaced);
    /* Spaced version of stripped suffix */
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
    var nospace = artNo.replace(/[\s.-]/g, '');
    if (nospace !== artNo) variations.push(nospace);
    return variations;
  }

  /* ── Load from live API (fallback) ── */
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

    return tryVariation(0).then(function(data) {
      if (!data || !data.length || !data[0].articles || !data[0].articles.length) {
        return Promise.reject('no_results');
      }
      var a = data[0].articles[0];
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
    });
  }

  /* ── Apply data to state and render ── */
  function applyData(data) {
    D.articleNo = data.articleNo || '';
    D.articleId = data.articleId || null;
    D.supplier = data.supplier || '';
    D.product = data.product || '';
    D.ean = data.ean || '';
    D.specs = data.specs || [];
    D.vehicles = data.vehicles || [];
    D.oe = data.oe || [];
    render();
  }

  /* ── Main flow ── */
  function init() {
    /* Only activate on auto-parts product pages (or if tecdoc-widget div already exists) */
    if (!document.getElementById('tecdoc-widget') && !isAutoPartsPage()) return;

    var articleNo = detectArticleNo();
    if (!articleNo) return;

    var w = getOrCreateWidget();
    if (!w) return;

    showLoading('טוען נתונים...', 30);

    loadFromCache(articleNo)
      .then(function(data) {
        applyData(data);
      })
      .catch(function() {
        showLoading('שלב 1 מתוך 2 — מחפש רכבים תואמים...', 20);
        return loadFromAPI(articleNo)
          .then(function(data) {
            applyData(data);
          })
          .catch(function(err) {
            if (err === 'no_results') {
              showError('לא נמצאו תוצאות עבור מספר קטלוגי: ' + articleNo);
            } else {
              showError('שגיאה בטעינת הנתונים.');
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
    showLoading('טוען נתונים...', 30);
    loadFromCache(articleNo.trim())
      .then(function(data) { applyData(data); })
      .catch(function() {
        showLoading('שלב 1 מתוך 2 — מחפש רכבים תואמים...', 20);
        return loadFromAPI(articleNo.trim())
          .then(function(data) { applyData(data); })
          .catch(function(err) {
            if (err === 'no_results') showError('לא נמצאו תוצאות עבור מספר קטלוגי: ' + articleNo);
            else showError('שגיאה בטעינת הנתונים.');
          });
      });
  };

  document.addEventListener('DOMContentLoaded', init);
})();

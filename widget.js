/* TecDoc Widget v6 — Cached Mode (Instant Load)
   Loads pre-fetched TecDoc data from a JSON file on GitHub Pages.
   Falls back to live API if article not found in cache.
   
   Configuration: set TECDOC_BASE_URL to your GitHub Pages URL.
*/
(function () {
  'use strict';

  /* ══ CONFIGURATION ══ */
  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';
  var APIFY_TOKEN = window.TECDOC_APIFY_TOKEN || '';
  var API_URL = APIFY_TOKEN ? 'https://api.apify.com/v2/acts/making-data-meaningful~tecdoc/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=120' : '';

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
    'WVA Number': '\u05DE\u05E1\u05E4\u05E8 WVA',
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
    'Manufacturer': '\u05D9\u05E6\u05E8\u05DF', 'EAN number': '\u05DE\u05E1\u05E4\u05E8 EAN',
    'Item number': '\u05DE\u05E7"\u05D8', 'directional': '\u05DB\u05D9\u05D5\u05D5\u05E0\u05D9',
    'Paired product': '\u05DE\u05D5\u05E6\u05E8 \u05DE\u05EA\u05D0\u05D9\u05DD'
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

  /* ── Injection ── */
  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;
    var specsDiv = document.querySelector('#item_specifications .specifications');
    if (specsDiv) {
      specsDiv.innerHTML = '';
      var widget = document.createElement('div');
      widget.id = 'tecdoc-widget';
      specsDiv.appendChild(widget);
      var header = document.querySelector('#item_specifications h3, #item_specifications .item_attributes > h3');
      if (header) header.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD \u05DE-TecDoc';
      return widget;
    }
    var itemSpecs = document.getElementById('item_specifications');
    if (itemSpecs) {
      var widget2 = document.createElement('div');
      widget2.id = 'tecdoc-widget';
      itemSpecs.parentNode.insertBefore(widget2, itemSpecs.nextSibling);
      return widget2;
    }
    /* Fallback: create a new section if #item_specifications doesn't exist */
    var anchors = [
      document.getElementById('item_content'),
      document.getElementById('item_also_buy'),
      document.getElementById('item_info')
    ];
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i]) {
        var wrapper = document.createElement('div');
        wrapper.id = 'item_specifications';
        wrapper.className = 'item_attributes';
        var h3 = document.createElement('h3');
        h3.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
        wrapper.appendChild(h3);
        var specDiv = document.createElement('div');
        specDiv.className = 'specifications';
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
    w.innerHTML = '<div class="tw-error"><div class="tw-error-icon">\u26A0</div><div>'+esc(msg)+'</div></div>';
  }

  /* ═══ RENDER ═══ */
  function render() {
    var w = getWidget(); if (!w) return;
    var html = '';

    html += '<div class="tw-tabs">';
    html += '<button type="button" class="tw-tab active" data-tab="specs">\u05DE\u05E4\u05E8\u05D8 \u05D8\u05DB\u05E0\u05D9</button>';
    html += '<button type="button" class="tw-tab" data-tab="vehicles">\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD</button>';
    html += '<button type="button" class="tw-tab" data-tab="oe">\u05DE\u05E1\u05E4\u05E8\u05D9 OE</button>';
    html += '</div>';

    /* TAB 1: Specs */
    html += '<div class="tw-content active" id="tw-tab-specs">';
    if (!D.specs.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    } else {
      html += '<table class="tw-specs-table">';
      for (var i = 0; i < D.specs.length; i++) {
        var s = D.specs[i];
        html += '<tr><td>'+esc(trSpec(s.criteriaName))+'</td><td>'+esc(trVal(s.criteriaName,s.criteriaValue))+'</td></tr>';
      }
      if (D.articleNo) html += '<tr><td>\u05DE\u05E7"\u05D8</td><td>'+esc(D.articleNo)+'</td></tr>';
      if (D.supplier) html += '<tr><td>\u05D9\u05E6\u05E8\u05DF</td><td>'+esc(D.supplier)+'</td></tr>';
      if (D.ean) html += '<tr><td>\u05DE\u05E1\u05E4\u05E8 EAN</td><td>'+esc(D.ean)+'</td></tr>';
      html += '</table>';
    }
    html += '</div>';

    /* TAB 2: Vehicles */
    html += '<div class="tw-content" id="tw-tab-vehicles"><div class="tw-compat-section">';
    if (!D.vehicles.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD</div>';
    } else {
      var tree = buildTree(D.vehicles);
      html += '<div class="tw-accordion">';
      var mKeys = Object.keys(tree).sort();
      for (var mk=0; mk<mKeys.length; mk++) {
        var mfr=mKeys[mk], models=tree[mfr];
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">'+esc(mfr)+'</span></div><div class="tw-acc-l1-body">';
        var mdKeys = Object.keys(models).sort();
        for (var mi=0; mi<mdKeys.length; mi++) {
          var mn=mdKeys[mi], md=models[mn];
          html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">'+esc(mn)+'</span>';
          if (md.years) html += '<span class="tw-acc-l2-years">('+esc(md.years)+')</span>';
          html += '</div><div class="tw-acc-l2-body">';
          for (var ei=0; ei<md.engines.length; ei++) {
            var e=md.engines[ei];
            html += '<div class="tw-acc-l3"><span class="tw-acc-l3-engine">'+esc(e.name)+'</span>';
            if (e.years) html += '<span class="tw-acc-l3-separator">,</span> <span class="tw-acc-l3-years">'+esc(e.years)+'</span>';
            html += '</div>';
          }
          html += '</div></div>';
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div></div>';

    /* TAB 3: OE Numbers */
    html += '<div class="tw-content" id="tw-tab-oe"><div class="tw-oe-section">';
    if (!D.oe.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      var byBrand = {};
      for (var oi=0; oi<D.oe.length; oi++) {
        var o=D.oe[oi], brand=o.oemBrand||'Other';
        if (!byBrand[brand]) byBrand[brand]=[];
        if (byBrand[brand].indexOf(o.oemDisplayNo)===-1) byBrand[brand].push(o.oemDisplayNo);
      }
      html += '<div class="tw-accordion">';
      var bKeys = Object.keys(byBrand).sort();
      for (var bi=0; bi<bKeys.length; bi++) {
        var bn=bKeys[bi], nums=byBrand[bn];
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">'+esc(bn)+'</span><span class="tw-acc-l2-years">('+nums.length+')</span></div><div class="tw-acc-l1-body">';
        for (var ni=0; ni<nums.length; ni++) {
          html += '<div class="tw-oe-acc-item"><span class="tw-oe-acc-num">'+esc(nums[ni])+'</span></div>';
        }
        html += '</div></div>';
      }
      html += '</div>';
      html += '<div class="tw-oe-info">\u05DE\u05E1\u05E4\u05E8\u05D9 \u05D4-OE \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DC\u05D4\u05E9\u05D5\u05D5\u05D0\u05D4 \u05D1\u05DC\u05D1\u05D3. \u05D9\u05E9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1 \u05D4\u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05E8\u05DB\u05D9\u05E9\u05D4.</div>';
    }
    html += '</div></div>';

    html += '<div class="tw-footer"><span>\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc\u00AE Catalogue</span></div>';

    w.innerHTML = html;
    bindTabs(w);
    bindAccordions(w);
  }

  function buildTree(vehicles) {
    var tree = {};
    for (var i=0; i<vehicles.length; i++) {
      var v=vehicles[i], mfr=v.manufacturerName||'Other', model=v.modelName||'Unknown';
      var sd=fmtDate(v.constructionIntervalStart), ed=fmtDate(v.constructionIntervalEnd);
      var yr = (sd||ed) ? (sd||'?')+' - '+(ed||'?') : '';
      if (!tree[mfr]) tree[mfr]={};
      if (!tree[mfr][model]) tree[mfr][model]={years:yr, ys:v.constructionIntervalStart||'', ye:v.constructionIntervalEnd||'', engines:[]};
      if (v.constructionIntervalStart && (!tree[mfr][model].ys || v.constructionIntervalStart<tree[mfr][model].ys)) tree[mfr][model].ys=v.constructionIntervalStart;
      if (v.constructionIntervalEnd && (!tree[mfr][model].ye || v.constructionIntervalEnd>tree[mfr][model].ye)) tree[mfr][model].ye=v.constructionIntervalEnd;
      tree[mfr][model].engines.push({name:v.typeEngineName||'', years:yr});
    }
    Object.keys(tree).forEach(function(m){ Object.keys(tree[m]).forEach(function(md){
      var d=tree[m][md], s=fmtDate(d.ys), e=fmtDate(d.ye);
      if (s||e) d.years=(s||'?')+' - '+(e||'?');
    });});
    return tree;
  }

  function bindTabs(w) {
    var tabs=w.querySelectorAll('.tw-tab');
    for (var i=0;i<tabs.length;i++) tabs[i].addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
      for (var j=0;j<tabs.length;j++) tabs[j].classList.remove('active');
      this.classList.add('active');
      var t=this.getAttribute('data-tab'), cs=w.querySelectorAll('.tw-content');
      for (var c=0;c<cs.length;c++) cs[c].classList.remove('active');
      var el=document.getElementById('tw-tab-'+t);
      if (el) el.classList.add('active');
    });
  }

  function bindAccordions(w) {
    var hs=w.querySelectorAll('.tw-acc-l1-header,.tw-acc-l2-header');
    for (var i=0;i<hs.length;i++) hs[i].addEventListener('click',function(){
      var p=this.parentElement, ic=this.querySelector('.tw-acc-icon'), open=p.classList.contains('tw-open');
      p.classList.toggle('tw-open');
      if (ic) ic.textContent=open?'+':'-';
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

  /* ── Generate article number variations for TecDoc lookup ── */
  function articleVariations(artNo) {
    var variations = [artNo];
    /* Try adding spaces: P85126 → P 85 126, AB12345 → AB 12345 */
    var spaced = artNo.replace(/([A-Za-z]+)(\d+)/g, function(m, letters, digits) {
      /* Split digits into groups: 85126 → 85 126 (2+3), 12345 → 12345 */
      var d = digits;
      if (d.length === 5) d = d.slice(0,2) + ' ' + d.slice(2);
      else if (d.length === 6) d = d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4);
      else if (d.length === 4) d = d.slice(0,2) + ' ' + d.slice(2);
      return letters + ' ' + d;
    });
    if (spaced !== artNo) variations.push(spaced);
    /* Try with dots instead of spaces */
    if (artNo.indexOf('.') > -1) variations.push(artNo.replace(/\./g, ' '));
    /* Try without any separators */
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
    var articleNo = detectArticleNo();
    if (!articleNo) return;

    var w = getOrCreateWidget();
    if (!w) return;

    showLoading('\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD...', 30);

    /* Try cache first (instant), fall back to live API */
    loadFromCache(articleNo)
      .then(function(data) {
        applyData(data);
      })
      .catch(function() {
        /* Not in cache — try live API */
        showLoading('\u05E9\u05DC\u05D1 1 \u05DE\u05EA\u05D5\u05DA 2 \u2014 \u05DE\u05D7\u05E4\u05E9 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD...', 20);
        return loadFromAPI(articleNo)
          .then(function(data) {
            applyData(data);
          })
          .catch(function(err) {
            if (err === 'no_results') {
              showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
            } else {
              showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
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
      .then(function(data) { applyData(data); })
      .catch(function() {
        showLoading('\u05E9\u05DC\u05D1 1 \u05DE\u05EA\u05D5\u05DA 2 \u2014 \u05DE\u05D7\u05E4\u05E9 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD...', 20);
        return loadFromAPI(articleNo.trim())
          .then(function(data) { applyData(data); })
          .catch(function(err) {
            if (err === 'no_results') showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
            else showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
          });
      });
  };

  document.addEventListener('DOMContentLoaded', init);
})();

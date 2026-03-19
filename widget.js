/* TecDoc Widget v9.1 — Tab Layout + Full Cache + OEM Fallback + Hide supplier for filters + Page cleanup + Hebrew product names
   Tabs: פרטים טכניים | התאמה לרכבים | מספרי OE
   Loads pre-fetched TecDoc data from GitHub Pages JSON cache.
   Falls back to live API with OEM search for manufacturer part numbers.
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
    'Coating': '\u05E6\u05D9\u05E4\u05D5\u05D9',
    'Filter type': '\u05E1\u05D5\u05D2 \u05E4\u05D9\u05DC\u05D8\u05E8',
    'Quantity': '\u05DB\u05DE\u05D5\u05EA',
    'Seal Material': '\u05D7\u05D5\u05DE\u05E8 \u05D0\u05D8\u05D9\u05DE\u05D4',
    'Packaging length [cm]': '\u05D0\u05D5\u05E8\u05DA \u05D0\u05E8\u05D9\u05D6\u05D4 [\u05E1"\u05DE]',
    'Packaging width [cm]': '\u05E8\u05D5\u05D7\u05D1 \u05D0\u05E8\u05D9\u05D6\u05D4 [\u05E1"\u05DE]',
    'Packaging height [cm]': '\u05D2\u05D5\u05D1\u05D4 \u05D0\u05E8\u05D9\u05D6\u05D4 [\u05E1"\u05DE]',
    'Net Weight [g]': '\u05DE\u05E9\u05E7\u05DC \u05E0\u05E7\u05D9 [\u05D2\u05E8\u05DD]',
    'Length 1 [mm]': '\u05D0\u05D5\u05E8\u05DA 1 [\u05DE"\u05DE]',
    'Width 1 [mm]': '\u05E8\u05D5\u05D7\u05D1 1 [\u05DE"\u05DE]',
    'Height 1 [mm]': '\u05D2\u05D5\u05D1\u05D4 1 [\u05DE"\u05DE]',
    'Inner Diameter 1 [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9 1 [\u05DE"\u05DE]',
    'Inner Diameter 2 [mm]': '\u05E7\u05D5\u05D8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9 2 [\u05DE"\u05DE]',
    'Diameter 1 [mm]': '\u05E7\u05D5\u05D8\u05E8 1 [\u05DE"\u05DE]',
    'Shape': '\u05E6\u05D5\u05E8\u05D4',
    'Quantity Unit': '\u05D9\u05D7\u05D9\u05D3\u05EA \u05DB\u05DE\u05D5\u05EA',
    'Fitting time [min.]': '\u05D6\u05DE\u05DF \u05D4\u05EA\u05E7\u05E0\u05D4 [\u05D3\u05E7\u05D5\u05EA]'
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

  var PRODUCT_TR = {
    'Brake Pad Set, disc brake': '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD, \u05D3\u05D9\u05E1\u05E7',
    'Brake Pad Set': '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD',
    'Brake Disc': '\u05D3\u05D9\u05E1\u05E7 \u05D1\u05DC\u05DD',
    'Brake Shoe Set': '\u05E1\u05D8 \u05E8\u05E4\u05D5\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD',
    'Air Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D5\u05D9\u05E8',
    'Oil Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF',
    'Fuel Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D3\u05DC\u05E7',
    'Cabin Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF',
    'Filter, interior air': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF',
    'Pollen Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF',
    'Spark Plug': '\u05DE\u05E6\u05EA',
    'Ignition Coil': '\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4',
    'Wiper Blade': '\u05DE\u05D2\u05D1 \u05E9\u05DE\u05E9\u05D4',
    'Wiper Blades': '\u05DE\u05D2\u05D1\u05D9 \u05E9\u05DE\u05E9\u05D4',
    'Shock Absorber': '\u05D1\u05D5\u05DC\u05DD \u05D6\u05E2\u05D6\u05D5\u05E2\u05D9\u05DD',
    'Coil Spring': '\u05E7\u05E4\u05D9\u05E5',
    'Wheel Bearing': '\u05DE\u05D9\u05E1\u05D1 \u05D2\u05DC\u05D2\u05DC',
    'Wheel Bearing Kit': '\u05E7\u05D9\u05D8 \u05DE\u05D9\u05E1\u05D1 \u05D2\u05DC\u05D2\u05DC',
    'Water Pump': '\u05DE\u05E9\u05D0\u05D1\u05EA \u05DE\u05D9\u05DD',
    'Thermostat': '\u05EA\u05E8\u05DE\u05D5\u05E1\u05D8\u05D8',
    'Radiator': '\u05E8\u05D3\u05D9\u05D0\u05D8\u05D5\u05E8',
    'Timing Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2',
    'Timing Belt Kit': '\u05E7\u05D9\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2',
    'Drive Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD',
    'V-Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA V',
    'Oil Pump': '\u05DE\u05E9\u05D0\u05D1\u05EA \u05E9\u05DE\u05DF',
    'Clutch Kit': '\u05E7\u05D9\u05D8 \u05DE\u05E6\u05DE\u05D3',
    'Clutch Disc': '\u05D3\u05D9\u05E1\u05E7 \u05DE\u05E6\u05DE\u05D3',
    'Ball Joint': '\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8',
    'Tie Rod End': '\u05E7\u05E6\u05D4 \u05DE\u05D5\u05D8 \u05D4\u05D2\u05D4',
    'Control Arm': '\u05DE\u05E9\u05D5\u05DC\u05E9',
    'Stabilizer Link': '\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1',
    'CV Joint': '\u05DE\u05E4\u05E8\u05E7 \u05D4\u05D5\u05DE\u05D5\u05E7\u05D9\u05E0\u05D8\u05D9',
    'Lambda Sensor': '\u05D7\u05D9\u05D9\u05E9\u05DF \u05D7\u05DE\u05E6\u05DF',
    'ABS Sensor': '\u05D7\u05D9\u05D9\u05E9\u05DF ABS',
    'Alternator': '\u05D0\u05DC\u05D8\u05E8\u05E0\u05D8\u05D5\u05E8',
    'Starter Motor': '\u05DE\u05E0\u05D5\u05E2 \u05D4\u05EA\u05E0\u05E2\u05D4',
    'Battery': '\u05DE\u05E6\u05D1\u05E8',
    'Brake Caliper': '\u05E7\u05DC\u05D9\u05E4\u05E8 \u05D1\u05DC\u05DD',
    'Brake Hose': '\u05E6\u05D9\u05E0\u05D5\u05E8 \u05D1\u05DC\u05DD',
    'Brake Drum': '\u05EA\u05D5\u05E3 \u05D1\u05DC\u05DD',
    'Exhaust Pipe': '\u05E6\u05D9\u05E0\u05D5\u05E8 \u05E4\u05DC\u05D9\u05D8\u05D4',
    'Catalytic Converter': '\u05DE\u05DE\u05D9\u05E8 \u05E7\u05D8\u05DC\u05D9\u05D8\u05D9',
    'Suspension Strut': '\u05D0\u05DE\u05D5\u05E8\u05D8\u05D9\u05E1\u05D5\u05E8',
    'Engine Mount': '\u05EA\u05E4\u05D5\u05E1\u05EA \u05DE\u05E0\u05D5\u05E2',
    'Gearbox Mount': '\u05EA\u05E4\u05D5\u05E1\u05EA \u05D2\u05D9\u05E8',
    'Headlight': '\u05E4\u05E0\u05E1 \u05E8\u05D0\u05E9\u05D9',
    'Tail Light': '\u05E4\u05E0\u05E1 \u05D0\u05D7\u05D5\u05E8\u05D9',
    'Brake Light': '\u05E4\u05E0\u05E1 \u05D1\u05DC\u05DD'
  };

  var DISC_MAP = { '1': '\u05DE\u05DC\u05D0', '2': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8', '3': '\u05DE\u05D0\u05D5\u05D5\u05E8\u05E8 \u05E4\u05E0\u05D9\u05DE\u05D9' };

  function trSpec(n) { return SPEC_TR[n] || n; }
  function trProduct(name) {
    if (!name) return '';
    if (PRODUCT_TR[name]) return PRODUCT_TR[name];
    // Try case-insensitive match
    var lower = name.toLowerCase();
    var keys = Object.keys(PRODUCT_TR);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].toLowerCase() === lower) return PRODUCT_TR[keys[i]];
    }
    return name;
  }
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

  /* ── Injection ── */
  function cleanPage() {
    /* Hide Konimbo sections we don't need on auto parts pages */
    var style = document.createElement('style');
    style.textContent = [
      /* Hide the text description under product image */
      '#item_content .description, #item_content .text, .item_text, .item_description { display:none !important; }',
      /* Hide "למה לקנות אצלנו" section */
      '.why_buy, .why-buy, [class*="why_buy"], [class*="why-buy"] { display:none !important; }',
      /* Hide the trust icons row (מוצרים באחריות, משלוחים מהירים, תשלום מאובטח) */
      '.trust_items, .trust-items, .trust_badges, .item_trust, #item_trust { display:none !important; }',
      /* Hide "שאל אותנו" and WhatsApp section */
      '.ask_about_item, .ask-about-item, #ask_about_item { display:none !important; }',
      /* Hide "חזור למעלה" button */
      '.back_to_top, .back-to-top, #back_to_top, a[href="#top"] { display:none !important; }',
      /* Hide Konimbo long description text block */
      '#item_content > .item_content_text, #item_content > p, #item_text { display:none !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;

    /* Priority 1: Replace #item_content ("מידע נוסף") on Konimbo product pages */
    var itemContent = document.getElementById('item_content');
    if (itemContent) {
      var h3 = itemContent.querySelector('h3, #item_content_title');
      if (h3) h3.style.display = 'none';
      var specContainer = itemContent.querySelector('.specifications');
      if (specContainer) { specContainer.innerHTML = ''; }
      var siblings = itemContent.children;
      for (var si = siblings.length - 1; si >= 0; si--) {
        var sib = siblings[si];
        if (sib !== specContainer && sib.id !== 'tecdoc-widget') {
          sib.style.display = 'none';
        }
      }
      var itemInfo = document.getElementById('item_info');
      if (itemInfo && itemInfo.nextSibling !== itemContent) {
        itemInfo.parentNode.insertBefore(itemContent, itemInfo.nextSibling);
      }
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
      if (header) header.style.display = 'none';
      return widget2;
    }

    /* Priority 3: Fallback — create after #item_info */
    var itemInfo2 = document.getElementById('item_info');
    if (itemInfo2) {
      var wrapper = document.createElement('div');
      wrapper.id = 'item_content';
      wrapper.className = 'item_attributes';
      var specDiv = document.createElement('div');
      specDiv.className = 'specifications full_width';
      wrapper.appendChild(specDiv);
      var widget3 = document.createElement('div');
      widget3.id = 'tecdoc-widget';
      specDiv.appendChild(widget3);
      itemInfo2.parentNode.insertBefore(wrapper, itemInfo2.nextSibling);
      return widget3;
    }

    /* Priority 4: Fallback — create before #item_also_buy */
    var anchors = [document.getElementById('item_also_buy')];
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i]) {
        var wrapper2 = document.createElement('div');
        wrapper2.id = 'item_content';
        wrapper2.className = 'item_attributes';
        var specDiv2 = document.createElement('div');
        specDiv2.className = 'specifications full_width';
        wrapper2.appendChild(specDiv2);
        var widget4 = document.createElement('div');
        widget4.id = 'tecdoc-widget';
        specDiv2.appendChild(widget4);
        anchors[i].parentNode.insertBefore(wrapper2, anchors[i]);
        return widget4;
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

  /* ═══ RENDER — Tab Layout ═══ */
  function render() {
    var w = getWidget(); if (!w) return;
    var html = '';

    /* ── TAB NAVIGATION ── */
    html += '<div class="tw-tabs">';
    html += '<div class="tw-tab tw-tab-active" data-tab="specs">\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    html += '<div class="tw-tab" data-tab="vehicles">\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD</div>';
    html += '<div class="tw-tab" data-tab="oe">\u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    html += '</div>';

    /* ── TAB PANEL 1: Technical Specs ── */
    html += '<div class="tw-panel tw-panel-active" data-panel="specs">';
    if (!D.specs.length && !D.articleNo && !D.supplier && !D.ean) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    } else {
      var allSpecs = [];
      /* Add article number first */
      if (D.articleNo) allSpecs.push({ name: '\u05DE\u05E7"\u05D8', value: D.articleNo });
      /* Add supplier (unless hidden for filters) */
      var pLow = (D.product || '').toLowerCase();
      var hideSupplier = (pLow === 'air filter' || pLow.indexOf('cabin air') !== -1 || pLow.indexOf('pollen') !== -1);
      if (D.supplier && !hideSupplier) allSpecs.push({ name: '\u05D9\u05E6\u05E8\u05DF', value: D.supplier });
      /* Add product type */
      if (D.product) {
        allSpecs.push({ name: '\u05E1\u05D5\u05D2 \u05DE\u05D5\u05E6\u05E8', value: trProduct(D.product) });
      }
      /* Add TecDoc specs */
      for (var i = 0; i < D.specs.length; i++) {
        allSpecs.push({ name: trSpec(D.specs[i].criteriaName), value: trVal(D.specs[i].criteriaName, D.specs[i].criteriaValue) });
      }
      if (D.ean) allSpecs.push({ name: '\u05DE\u05E1\u05E4\u05E8 EAN', value: D.ean });

      var hasHidden = allSpecs.length > SPECS_VISIBLE;
      html += '<table class="tw-specs-table" id="tw-specs-tbl">';
      for (var si = 0; si < allSpecs.length; si++) {
        var cls = si >= SPECS_VISIBLE ? ' class="tw-spec-hidden"' : '';
        html += '<tr'+cls+'><td>'+esc(allSpecs[si].name)+'</td><td>'+esc(allSpecs[si].value)+'</td></tr>';
      }
      html += '</table>';

      if (hasHidden) {
        html += '<div class="tw-more-wrap"><button type="button" class="tw-more-btn" id="tw-more-toggle">\u05E2\u05D5\u05D3 <span class="tw-arrow">\u25BC</span></button></div>';
      }
    }
    html += '</div>';

    /* ── TAB PANEL 2: Vehicle Compatibility ── */
    html += '<div class="tw-panel" data-panel="vehicles">';
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

    /* ── TAB PANEL 3: OE Numbers ── */
    html += '<div class="tw-panel" data-panel="oe">';
    if (!D.oe.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      var byBrand = {};
      for (var oi = 0; oi < D.oe.length; oi++) {
        var o = D.oe[oi], brand = o.oemBrand || 'Other';
        if (!byBrand[brand]) byBrand[brand] = [];
        if (byBrand[brand].indexOf(o.oemDisplayNo) === -1) byBrand[brand].push(o.oemDisplayNo);
      }
      html += '<div class="tw-oe-subtitle">\u05DE\u05E1\u05E4\u05E8\u05D9 OE \u05DE\u05E7\u05D1\u05D9\u05DC\u05D9\u05DD \u05DC\u05DE\u05E1\u05E4\u05E8 \u05D7\u05DC\u05E7 \u05D4\u05D7\u05D9\u05DC\u05D5\u05E3 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:</div>';
      html += '<div class="tw-accordion">';
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
    bindTabs(w);
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

  /* ── Tab switching ── */
  function bindTabs(w) {
    var tabs = w.querySelectorAll('.tw-tab');
    var panels = w.querySelectorAll('.tw-panel');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        var target = this.getAttribute('data-tab');
        for (var t = 0; t < tabs.length; t++) {
          tabs[t].classList.remove('tw-tab-active');
        }
        for (var p = 0; p < panels.length; p++) {
          panels[p].classList.remove('tw-panel-active');
        }
        this.classList.add('tw-tab-active');
        var targetPanel = w.querySelector('.tw-panel[data-panel="' + target + '"]');
        if (targetPanel) targetPanel.classList.add('tw-panel-active');
      });
    }
  }

  function bindAccordions(w) {
    var hs = w.querySelectorAll('.tw-acc-l1-header,.tw-acc-l2-header');
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

  /* ── Preferred brands for OEM fallback ranking ── */
  var PREFERRED_BRANDS = ['BOSCH','MANN-FILTER','MAHLE','HENGST FILTER','BREMBO','TRW','SACHS','VALEO','DENSO','NGK','SKF','FEBI BILSTEIN','MEYLE','OPTIMAL','MAPCO','JAPANPARTS','BLUE PRINT','ASHIKA','JAPKO','FILTRON','KNECHT','PURFLUX','CHAMPION','MOOG'];

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
    if (!document.getElementById('tecdoc-widget') && !isAutoPartsPage()) return;
    cleanPage();

    var articleNo = detectArticleNo();
    if (!articleNo) return;

    var w = getOrCreateWidget();
    if (!w) return;

    showLoading('\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD...', 30);

    loadFromCache(articleNo)
      .then(function(data) {
        applyData(data);
      })
      .catch(function() {
        showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
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
        showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
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

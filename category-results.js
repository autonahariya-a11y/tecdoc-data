/* ============================================================
 *  Auto Nahariya – Unified Category Results Script
 *  Merges original category browsing + hotfix (brand/model aliases)
 *  For Konimbo body_html hybrid field
 *  ------------------------------------------------------------ */

/* --- Globals (exposed before IIFE) --- */
window.__anImgCache = window.__anImgCache || {};
window.__anImgPreload = window.__anImgPreload || {};
window.__anCatIds = window.__anCatIds || {};
window.cImg = window.cImg || {};

/* --- Add to Cart (Konimbo find_id integration) --- */
window.__anAddCart = function (btn) {
  var iid = btn.getAttribute('data-iid');
  var nm  = btn.getAttribute('data-name');
  var url = btn.getAttribute('data-url');
  if (typeof find_id === 'function' && iid) {
    btn.classList.add('an-adding');
    try { find_id(iid, nm, '', '', 1, 1, ''); } catch (e) { /* silent */ }
    btn.classList.remove('an-adding');
    btn.classList.add('an-added');
    btn.innerHTML = '\u2713 \u05E0\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4';
    setTimeout(function () {
      btn.classList.remove('an-added');
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>' +
        '</svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4';
    }, 2000);
  } else if (url) {
    window.location.href = url;
  }
};

/* --- Fetch Product Images (paginated category scraping) --- */
window.__anFetchProductImages = function (catName, callback) {
  var CAT_IDS = {
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8": "190161",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF": "192219",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF": "196209",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8": "250645",
    "\u05DE\u05E6\u05EA\u05D9\u05DD": "198722",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4": "199315",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8": "213932",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC": "236613",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD": "199567",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF": "204362",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2": "207714",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05D6\u05E2\u05D6\u05D5\u05E2\u05D9\u05DD": "242151",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD": "214303",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF": "217343",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD": "215640",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1": "216111",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4": "216112",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8": "216113",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7": "226789",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5": "228178",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3": "234540",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2": "217398",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD": "727853",
    "\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA": "462359"
  };
  window.__anCatIds = CAT_IDS;

  var cid = CAT_IDS[catName];
  if (!cid) { callback({}); return; }
  if (window.__anImgCache[catName]) { callback(window.__anImgCache[catName]); return; }

  var map = {}, page = 1, maxPages = 20;

  function fetchPage() {
    var x = new XMLHttpRequest();
    x.open('GET', '/categories/' + cid + '?page=' + page, true);
    x.timeout = 10000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        var html = x.responseText;
        if (html.indexOf('page_no_referer') !== -1 || html.indexOf('item_id_') === -1) {
          finalize();
          return;
        }
        var re = /id="item_id_(\d+)"[\s\S]*?<img\s+class='img-responsive[^']*'\s+src='([^']*cloudfront[^']*)'/g;
        var m, found = 0;
        while ((m = re.exec(html)) !== null) { map[m[1]] = m[2]; found++; }
        if (found >= 12 && page < maxPages) { page++; fetchPage(); }
        else { finalize(); }
      } else { finalize(); }
    };
    x.onerror = x.ontimeout = function () { finalize(); };
    x.send();
  }

  function finalize() {
    var pre = window.__anImgPreload || {};
    for (var k in pre) { if (!map[k]) map[k] = pre[k]; }
    window.__anImgCache[catName] = map;
    callback(map);
  }

  fetchPage();
};


/* ============================================================
 *  MAIN IIFE
 * ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
   *  CONSTANTS & CONFIGURATION
   * ---------------------------------------------------------- */

  var SHEET_URL = 'https://docs.google.com/spreadsheets/d/1I5_KWRWIq1UpUDagRQVs65LuXELRSVCeInU0HRLcWHg/gviz/tq?tqx=out:csv';
  var WA_NUMBER = '97249517322';

  /* --- Merged Brand Aliases (original + hotfix) --- */
  var BRANDS = {
    "\u05D0\u05D0\u05D5\u05D3\u05D9":       ["\u05D0\u05D0\u05D5\u05D3\u05D9", "audi"],
    "\u05D0\u05D5\u05E4\u05DC":             ["\u05D0\u05D5\u05E4\u05DC", "opel"],
    "\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5": ["\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5", "\u05D0\u05DC\u05E4\u05D0\u05E8\u05D5\u05DE\u05D0\u05D5", "alfa romeo"],
    "\u05D1\u05D9.\u05D0\u05DE.\u05D5\u05D5": ["\u05D1\u05D9.\u05D0\u05DE.\u05D5\u05D5", "bmw", "\u05D1\u05DE\u05D5\u05D5", "BMW"],
    "\u05D2'\u05D9\u05E4":                 ["\u05D2'\u05D9\u05E4", "\u05D2\u05D9\u05E4", "jeep"],
    "\u05D3\u05D0\u05E6\u05D9\u05D4":       ["\u05D3\u05D0\u05E6\u05D9\u05D4", "dacia"],
    "\u05D4\u05D5\u05E0\u05D3\u05D4":       ["\u05D4\u05D5\u05E0\u05D3\u05D4", "honda"],
    "\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9": ["\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9", "\u05D9\u05D5\u05E0\u05D3\u05D4", "hyundai"],
    "\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4": ["\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4", "toyota"],
    "\u05D9\u05D2\u05D5\u05D0\u05E8":       ["\u05D9\u05D2\u05D5\u05D0\u05E8", "jaguar"],
    "\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8": ["\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8", "\u05DC\u05E0\u05D3\u05E8\u05D5\u05D1\u05E8", "land rover"],
    "\u05DC\u05E7\u05E1\u05D5\u05E1":       ["\u05DC\u05E7\u05E1\u05D5\u05E1", "lexus"],
    "\u05DE\u05D0\u05D6\u05D3\u05D4":       ["\u05DE\u05D0\u05D6\u05D3\u05D4", "\u05DE\u05D6\u05D3\u05D4", "mazda"],
    "\u05DE\u05E8\u05E6\u05D3\u05E1":       ["\u05DE\u05E8\u05E6\u05D3\u05E1", "mercedes", "\u05DE\u05E8\u05E6\u05D3\u05E1 \u05D1\u05E0\u05E5"],
    "\u05DE\u05D9\u05E0\u05D9":             ["\u05DE\u05D9\u05E0\u05D9", "mini"],
    "\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9": ["\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9", "mitsubishi"],
    "\u05E0\u05D9\u05E1\u05DF":             ["\u05E0\u05D9\u05E1\u05DF", "nissan"],
    "\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5": ["\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5", "subaru"],
    "\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9": ["\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9", "suzuki"],
    "\u05E1\u05D9\u05D0\u05D8":             ["\u05E1\u05D9\u05D0\u05D8", "seat"],
    "\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF": ["\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF", "citroen"],
    "\u05E1\u05E7\u05D5\u05D3\u05D4":       ["\u05E1\u05E7\u05D5\u05D3\u05D4", "skoda"],
    "\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D0\u05D2\u05DF": ["\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D0\u05D2\u05DF", "\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF", "volkswagen", "vw"],
    "\u05E4\u05D5\u05E8\u05D3":             ["\u05E4\u05D5\u05E8\u05D3", "ford"],
    "\u05E4\u05D9\u05D0\u05D8":             ["\u05E4\u05D9\u05D0\u05D8", "fiat"],
    "\u05E4\u05D9\u05D6'\u05D5":             ["\u05E4\u05D9\u05D6'\u05D5", "\u05E4\u05D6'\u05D5", "\u05E4\u05D2'\u05D5", "peugeot"],
    "\u05E7\u05D5\u05E4\u05E8\u05D0":       ["\u05E7\u05D5\u05E4\u05E8\u05D0", "cupra"],
    "\u05E7\u05D9\u05D4":                   ["\u05E7\u05D9\u05D4", "kia"],
    "\u05E8\u05E0\u05D5":                   ["\u05E8\u05E0\u05D5", "renault"],
    "\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8": ["\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8", "chevrolet"],
    "\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5": ["\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5", "isuzu"],
    "\u05D1\u05D9.\u05D5\u05D5.\u05D3\u05D9": ["BYD", "\u05D1\u05D9.\u05D5\u05D5.\u05D3\u05D9"],
    "DS": ["DS", "\u05D3\u05D9.\u05D0\u05E1"],
    "MG": ["MG", "\u05D0\u05DE.\u05D2'\u05D9"],
    "\u05E4\u05D5\u05E8\u05E9\u05D4":       ["\u05E4\u05D5\u05E8\u05E9\u05D4", "porsche"],
    "\u05D5\u05D5\u05DC\u05D5\u05D5":       ["\u05D5\u05D5\u05DC\u05D5\u05D5", "volvo"]
  };

  /* --- Merged Model Aliases (original + hotfix Audi A1-A8, Q2-Q8) --- */
  var MODELS = {
    "CR-V":       ["CRV", "CR-V", "\u05E1\u05D9\u05D0\u05E8\u05D5\u05D9"],
    "HR-V":       ["HRV", "HR-V"],
    "\u05D0\u05E7\u05D5\u05E8\u05D3":   ["\u05D0\u05E7\u05D5\u05E8\u05D3", "ACCORD"],
    "\u05E1\u05D9\u05D5\u05D5\u05D9\u05E7": ["\u05E1\u05D9\u05D5\u05D5\u05D9\u05E7", "CIVIC"],
    "\u05D2'\u05D0\u05D6":     ["\u05D2'\u05D0\u05D6", "\u05D2\u05D0\u05D6", "JAZZ"],
    "\u05E4\u05E1\u05D0\u05D8":   ["\u05E4\u05E1\u05D0\u05D8", "PASSAT"],
    "\u05D2\u05D5\u05DC\u05E3":   ["\u05D2\u05D5\u05DC\u05E3", "GOLF"],
    "\u05D2'\u05D8\u05D4":     ["\u05D2'\u05D8\u05D4", "\u05D2\u05D8\u05D4", "JETTA"],
    "\u05D8\u05D5\u05E8\u05D0\u05DF": ["\u05D8\u05D5\u05E8\u05D0\u05DF", "TOURAN"],
    "\u05E7\u05D0\u05D3\u05D9":   ["\u05E7\u05D0\u05D3\u05D9", "CADDY"],
    "\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF": ["\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF", "TIGUAN"],
    "\u05E4\u05D5\u05DC\u05D5":   ["\u05E4\u05D5\u05DC\u05D5", "POLO"],
    "\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4": ["\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4", "OCTAVIA"],
    "\u05E1\u05D5\u05E4\u05E8\u05D1": ["\u05E1\u05D5\u05E4\u05E8\u05D1", "SUPERB"],
    "\u05E4\u05D0\u05D1\u05D9\u05D4": ["\u05E4\u05D0\u05D1\u05D9\u05D4", "FABIA"],
    "\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4": ["\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4", "COROLLA"],
    "\u05E7\u05D0\u05DE\u05E8\u05D9": ["\u05E7\u05D0\u05DE\u05E8\u05D9", "CAMRY"],
    "\u05D9\u05D0\u05E8\u05D9\u05E1": ["\u05D9\u05D0\u05E8\u05D9\u05E1", "YARIS"],
    "\u05E8\u05D0\u05D5 4":   ["RAV4", "RAV 4", "\u05E8\u05D0\u05D5 4", "\u05E8\u05D0\u05D54"],
    "\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8": ["\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8", "LAND CRUISER", "LANDCRUISER"],
    "\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8 \u05E4\u05E8\u05D3\u05D5": ["\u05DC\u05E0\u05D3\u05E7\u05E8\u05D5\u05D6\u05E8 \u05E4\u05E8\u05D3\u05D5", "PRADO"],
    "C-HR":       ["CHR", "C-HR"],
    "\u05D4\u05D9\u05D9\u05DC\u05D5\u05E7\u05E1": ["\u05D4\u05D9\u05D9\u05DC\u05D5\u05E7\u05E1", "HILUX"],
    "\u05D0\u05D5\u05E8\u05D9\u05E1": ["\u05D0\u05D5\u05E8\u05D9\u05E1", "AURIS"],
    "\u05D0\u05D9\u05D9\u05D2\u05D5": ["\u05D0\u05D9\u05D9\u05D2\u05D5", "AYGO"],
    "\u05D8\u05D5\u05E7\u05E1\u05D5\u05DF": ["\u05D8\u05D5\u05E7\u05E1\u05D5\u05DF", "TUCSON"],
    "IX35":       ["IX35", "I35", "ix35"],
    "I30":        ["I30", "i30"],
    "I20":        ["I20", "i20"],
    "I10":        ["I10", "i10"],
    "\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4": ["\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4", "ELANTRA"],
    "\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4": ["\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4", "\u05E1\u05E0\u05D8\u05D4\u05E4\u05D4", "SANTA FE"],
    "\u05E7\u05D5\u05E0\u05D4":   ["\u05E7\u05D5\u05E0\u05D4", "KONA"],
    "\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6'": ["\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6'", "\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6", "SPORTAGE"],
    "\u05E4\u05D5\u05E8\u05D8\u05D4": ["\u05E4\u05D5\u05E8\u05D8\u05D4", "FORTE"],
    "\u05E1\u05D9\u05D3":     ["\u05E1\u05D9\u05D3", "CEED", "CEE'D"],
    "\u05E7\u05E8\u05E0\u05E1": ["\u05E7\u05E8\u05E0\u05E1", "CARENS"],
    "\u05E0\u05D9\u05E8\u05D5": ["\u05E0\u05D9\u05E8\u05D5", "NIRO"],
    "\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5": ["\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5", "PICANTO"],
    "\u05D0\u05E1\u05D8\u05E8\u05D4": ["\u05D0\u05E1\u05D8\u05E8\u05D4", "ASTRA"],
    "\u05E7\u05D5\u05E8\u05E1\u05D4": ["\u05E7\u05D5\u05E8\u05E1\u05D4", "CORSA"],
    "\u05DE\u05D5\u05E7\u05D4": ["\u05DE\u05D5\u05E7\u05D4", "MOKKA"],
    "\u05D6\u05D0\u05E4\u05D9\u05E8\u05D4": ["\u05D6\u05D0\u05E4\u05D9\u05E8\u05D4", "ZAFIRA"],
    "\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3": ["\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3", "GRANDLAND"],
    "\u05DE\u05D9\u05E7\u05E8\u05D4": ["\u05DE\u05D9\u05E7\u05E8\u05D4", "MICRA"],
    "\u05E7\u05E9\u05E7\u05D0\u05D9": ["\u05E7\u05E9\u05E7\u05D0\u05D9", "QASHQAI"],
    "X-TRAIL":    ["X-TRAIL", "XTRAIL", "\u05D0\u05E7\u05E1\u05D8\u05E8\u05D9\u05D9\u05DC"],
    "\u05D2'\u05D5\u05E7":     ["\u05D2'\u05D5\u05E7", "\u05D2\u05D5\u05E7", "JUKE"],
    "\u05DC\u05D9\u05E3":     ["\u05DC\u05D9\u05E3", "LEAF"],
    "\u05DC\u05D0\u05D5\u05DF": ["\u05DC\u05D0\u05D5\u05DF", "LEON"],
    "\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4": ["\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4", "IBIZA"],
    "\u05D3\u05D5\u05D1\u05DC\u05D5": ["\u05D3\u05D5\u05D1\u05DC\u05D5", "DOBLO"],
    "\u05E4\u05D5\u05E0\u05D8\u05D5": ["\u05E4\u05D5\u05E0\u05D8\u05D5", "PUNTO"],
    "500X":       ["500X", "500 X"],
    "500":        ["500"],
    "\u05D3\u05D9\u05DE\u05E7\u05E1": ["\u05D3\u05D9\u05DE\u05E7\u05E1", "D-MAX", "DMAX"],
    "\u05E1\u05D5\u05D9\u05E4\u05D8": ["\u05E1\u05D5\u05D9\u05E4\u05D8", "SWIFT"],
    "\u05D2\u05D9\u05DE\u05D9\u05E0\u05D9": ["\u05D2\u05D9\u05DE\u05D9\u05E0\u05D9", "JIMNY"],
    "\u05D5\u05D9\u05D8\u05E8\u05D4": ["\u05D5\u05D9\u05D8\u05E8\u05D4", "VITARA"],
    "\u05E1\u05DC\u05E8\u05D9\u05D5": ["\u05E1\u05DC\u05E8\u05D9\u05D5", "CELERIO"],
    "\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4": ["\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4", "IMPREZA"],
    "\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8": ["\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8", "FORESTER"],
    "\u05D0\u05D5\u05D8\u05D1\u05E7": ["\u05D0\u05D5\u05D8\u05D1\u05E7", "OUTBACK"],
    "XV":         ["XV"],
    "\u05DC\u05E0\u05E1\u05E8": ["\u05DC\u05E0\u05E1\u05E8", "LANCER"],
    "\u05D0\u05D5\u05D8\u05DC\u05E0\u05D3\u05E8": ["\u05D0\u05D5\u05D8\u05DC\u05E0\u05D3\u05E8", "OUTLANDER"],
    "\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8": ["\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8", "SPACE STAR", "\u05DE\u05D9\u05E8\u05D0\u05D6'"],
    "\u05D0\u05D8\u05E8\u05D0\u05D6'": ["\u05D0\u05D8\u05E8\u05D0\u05D6'", "ATTRAGE"],
    "\u05E7\u05DC\u05D9\u05D0\u05D5": ["\u05E7\u05DC\u05D9\u05D0\u05D5", "CLIO"],
    "\u05DE\u05D2\u05D0\u05DF": ["\u05DE\u05D2\u05D0\u05DF", "MEGANE"],
    "\u05E7\u05E4\u05D8\u05D5\u05E8": ["\u05E7\u05E4\u05D8\u05D5\u05E8", "CAPTUR"],
    "\u05E7\u05E8\u05D5\u05D6": ["\u05E7\u05E8\u05D5\u05D6", "CRUZE"],
    "\u05E4\u05D5\u05E7\u05D5\u05E1": ["\u05E4\u05D5\u05E7\u05D5\u05E1", "FOCUS"],
    "\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4": ["\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4", "FIESTA"],
    "\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05D5": ["\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05D5", "MONDEO"],
    "\u05E7\u05D5\u05D2\u05D4": ["\u05E7\u05D5\u05D2\u05D4", "KUGA"],
    "\u05E4\u05D5\u05DE\u05D4": ["\u05E4\u05D5\u05DE\u05D4", "PUMA"],
    "C4 \u05E4\u05D9\u05E7\u05E1\u05D5": ["C4 \u05E4\u05D9\u05E7\u05E1\u05D5", "C4 PICASSO", "\u05E4\u05D9\u05E7\u05E1\u05D5"],
    "\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5": ["\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5", "BERLINGO"],
    "C3": ["C3"], "C4": ["C4"], "C5": ["C5"],
    "307": ["307"], "308": ["308"], "208": ["208"],
    "2008": ["2008"], "3008": ["3008"], "5008": ["5008"],
    "206": ["206"], "207": ["207"], "301": ["301"],
    "407": ["407"], "508": ["508"],
    "\u05E4\u05E8\u05D8\u05E0\u05E8": ["\u05E4\u05E8\u05D8\u05E0\u05E8", "PARTNER"],
    "2": ["2"], "3": ["3"], "5": ["5"], "6": ["6"],
    "CX-3": ["CX-3", "CX3"],
    "CX-5": ["CX-5", "CX5"],
    "CX-30": ["CX-30", "CX30"],
    "CX-90": ["CX-90", "CX90"],
    "\u05D3\u05D9\u05E1\u05E7\u05D1\u05E8\u05D9": ["\u05D3\u05D9\u05E1\u05E7\u05D1\u05E8\u05D9", "DISCOVERY"],
    "\u05E8\u05D9\u05D9\u05E0\u05D2' \u05E8\u05D5\u05D1\u05E8": ["\u05E8\u05D9\u05D9\u05E0\u05D2' \u05E8\u05D5\u05D1\u05E8", "RANGE ROVER"],
    "\u05D3\u05D9\u05E4\u05E0\u05D3\u05E8": ["\u05D3\u05D9\u05E4\u05E0\u05D3\u05E8", "DEFENDER"],
    "\u05D0\u05D5\u05D5\u05E0\u05E1\u05D9\u05E1": ["\u05D0\u05D5\u05D5\u05E0\u05E1\u05D9\u05E1", "AVENSIS"],
    "\u05E4\u05E8\u05D5\u05D5\u05D9\u05D4": ["\u05E4\u05E8\u05D5\u05D5\u05D9\u05D4", "PREVIA"],
    "\u05D5\u05E8\u05E1\u05D5": ["\u05D5\u05E8\u05E1\u05D5", "VERSO"],
    "\u05E4\u05E8\u05D9\u05D5\u05E1": ["\u05E4\u05E8\u05D9\u05D5\u05E1", "PRIUS"],
    "\u05D4\u05D9\u05D9\u05DC\u05E0\u05D3\u05E8": ["\u05D4\u05D9\u05D9\u05DC\u05E0\u05D3\u05E8", "HIGHLANDER"],
    "\u05E1\u05D5\u05E4\u05E8\u05D4": ["\u05E1\u05D5\u05E4\u05E8\u05D4", "SUPRA"],
    "\u05D1\u05D5\u05E7\u05E1\u05D8\u05E8": ["\u05D1\u05D5\u05E7\u05E1\u05D8\u05E8", "BOXSTER", "718 BOXSTER"],
    "\u05E7\u05D9\u05D9\u05DE\u05DF": ["\u05E7\u05D9\u05D9\u05DE\u05DF", "CAYMAN", "718 CAYMAN"],
    "\u05E7\u05D0\u05D9\u05D9\u05DF": ["\u05E7\u05D0\u05D9\u05D9\u05DF", "CAYENNE"],
    "\u05DE\u05E7\u05D0\u05DF": ["\u05DE\u05E7\u05D0\u05DF", "MACAN"],
    "\u05E4\u05E0\u05DE\u05E8\u05D4": ["\u05E4\u05E0\u05DE\u05E8\u05D4", "PANAMERA"],
    "\u05D8\u05D9\u05D9\u05E7\u05DF": ["\u05D8\u05D9\u05D9\u05E7\u05DF", "TAYCAN"],
    /* Audi models (from hotfix) */
    "A1": ["A1"], "A3": ["A3"], "A4": ["A4"], "A5": ["A5"],
    "A6": ["A6"], "A8": ["A8"],
    "Q2": ["Q2"], "Q3": ["Q3"], "Q5": ["Q5"], "Q7": ["Q7"], "Q8": ["Q8"]
  };

  /* --- Category Images (AUTODOC-style tiles) --- */
  var CAT_IMAGES = {
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8":   "https://i.imgur.com/g1qfgUD.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF":         "https://i.imgur.com/ESCTGoc.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF":   "https://i.imgur.com/9ZZ5pgy.png",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8":   "https://i.imgur.com/fBL6Sn4.png",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD":   "https://i.imgur.com/m39rCVF.png",
    "\u05DE\u05E6\u05EA\u05D9\u05DD":                             "https://i.imgur.com/L6FPX9R.png",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4":         "https://i.imgur.com/onOUmJJ.png",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD": "https://i.imgur.com/mHsOCQm.png",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD":                 "https://i.imgur.com/8n7O8pR.png",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF": "https://i.imgur.com/wqqrabP.png",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2": "https://i.imgur.com/2evfe27.png",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2":   "https://i.imgur.com/vIYvD2N.png",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3":                     "https://i.imgur.com/MzSSq9W.png",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD": "https://i.imgur.com/QJZhGK4.png",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7": "https://i.imgur.com/Lvj6TOq.png",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5": "https://i.imgur.com/a24nQJS.png",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8": "https://i.imgur.com/3AVB5iw.png",
    "\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA": "https://i.imgur.com/YHF5JGW.png",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC": "https://i.imgur.com/9EB3uy6.png",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF":               "https://i.imgur.com/WRiZaMn.png",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1":         "https://i.imgur.com/S1ZSZTp.png",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8":   "https://i.imgur.com/1HBbM50.png",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4":                     "https://i.imgur.com/HngAfcl.png"
  };

  /* --- Category display order (skip חלקי אספנות) --- */
  var CAT_ORDER = [
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF",
    "\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8",
    "\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD",
    "\u05DE\u05E6\u05EA\u05D9\u05DD",
    "\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4",
    "\u05E8\u05E6\u05D5\u05E2\u05D5\u05EA \u05D0\u05D1\u05D9\u05D6\u05E8\u05D9\u05DD",
    "\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD",
    "\u05D1\u05D5\u05DC\u05DE\u05D9 \u05EA\u05D0 \u05DE\u05D8\u05E2\u05DF",
    "\u05D1\u05D5\u05DC\u05DD \u05DE\u05DB\u05E1\u05D4 \u05DE\u05E0\u05D5\u05E2",
    "\u05E1\u05D8 \u05D8\u05D9\u05D9\u05DE\u05D9\u05E0\u05D2",
    "\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3",
    "\u05DE\u05D9\u05DB\u05DC \u05E2\u05D9\u05D1\u05D5\u05D9 \u05D5\u05DE\u05DB\u05E1\u05D9\u05DD",
    "\u05DE\u05E9\u05D0\u05D1\u05D5\u05EA \u05D4\u05D2\u05D4 \u05DB\u05D5\u05D7",
    "\u05E6\u05D9\u05E0\u05D5\u05E8\u05D5\u05EA \u05D8\u05D5\u05E8\u05D1\u05D5",
    "\u05E1\u05DC\u05D9\u05DC \u05DB\u05E8\u05D9\u05EA \u05D0\u05D5\u05D9\u05E8",
    "\u05D7\u05D9\u05D9\u05E9\u05E0\u05D9\u05DD \u05D5\u05D7\u05DC\u05E7\u05D9 \u05D7\u05E9\u05DE\u05DC",
    "\u05E7\u05D5\u05DC\u05E8 \u05E9\u05DE\u05DF",
    "\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1",
    "\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8",
    "\u05E7\u05E6\u05D4 \u05D4\u05D2\u05D4"
  ];


  /* ----------------------------------------------------------
   *  UTILITIES
   * ---------------------------------------------------------- */

  /** Normalise text for fuzzy matching: lowercase, strip dashes/dots/quotes, collapse whitespace */
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[-.'"\u05F3\u05F4]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Strip model-name generation suffixes (B7, MK3, Avant, Sportback, etc.) */
  function stripSuffix(name) {
    return name
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s+[A-Z]{1,3}\d{2,3}$/i, '')
      .replace(/\s+_[A-Z0-9]+_$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Parse CSV row respecting quoted fields */
  function parseCSVRow(line) {
    var cols = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (inQ && i + 1 < line.length && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQ = !inQ; }
      } else if (c === ',' && !inQ) {
        cols.push(cur.trim()); cur = '';
      } else { cur += c; }
    }
    cols.push(cur.trim());
    return cols;
  }

  /** Read URL search params (without URLSearchParams for IE compat) */
  function getParam(name) {
    var qs = window.location.search.substring(1);
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split('=');
      if (decodeURIComponent(kv[0]) === name) {
        return decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      }
    }
    return '';
  }

  /** Safe element getter */
  function $(id) { return document.getElementById(id); }

  /** Escape HTML */
  function esc(s) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(s));
    return d.innerHTML;
  }


  /* ----------------------------------------------------------
   *  ALIAS RESOLUTION
   * ---------------------------------------------------------- */

  /** Given a brand_he or mfr value, return array of normalised aliases */
  function resolveBrand(raw) {
    var n = norm(raw);
    for (var key in BRANDS) {
      var aliases = BRANDS[key];
      for (var i = 0; i < aliases.length; i++) {
        if (norm(aliases[i]) === n) return aliases.map(norm);
      }
    }
    return n ? [n] : [];
  }

  /** Given a model_he/model_en value, return array of normalised aliases */
  function resolveModel(raw) {
    var stripped = stripSuffix(raw);
    var n = norm(stripped);
    for (var key in MODELS) {
      var aliases = MODELS[key];
      for (var i = 0; i < aliases.length; i++) {
        if (norm(aliases[i]) === n) return aliases.map(norm);
      }
    }
    /* Also try the un-stripped version */
    var n2 = norm(raw);
    if (n2 !== n) {
      for (var key2 in MODELS) {
        var aliases2 = MODELS[key2];
        for (var j = 0; j < aliases2.length; j++) {
          if (norm(aliases2[j]) === n2) return aliases2.map(norm);
        }
      }
    }
    return n ? [n] : [];
  }


  /* ----------------------------------------------------------
   *  CSV FETCH (single fetch, cached)
   * ---------------------------------------------------------- */

  var csvRows = null;   /* cached parsed rows */
  var csvError = false;

  function fetchCSV(cb) {
    if (csvRows) { cb(csvRows); return; }
    if (csvError) { cb([]); return; }

    var x = new XMLHttpRequest();
    x.open('GET', SHEET_URL, true);
    x.timeout = 15000;
    x.onload = function () {
      if (x.status >= 200 && x.status < 300) {
        var lines = x.responseText.split('\n');
        csvRows = [];
        /* Skip header row (index 0) */
        for (var i = 1; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          var cols = parseCSVRow(line);
          if (cols.length >= 7) csvRows.push(cols);
        }
        cb(csvRows);
      } else {
        csvError = true;
        cb([]);
      }
    };
    x.onerror = x.ontimeout = function () { csvError = true; cb([]); };
    x.send();
  }


  /* ----------------------------------------------------------
   *  PRODUCT MATCHING
   * ---------------------------------------------------------- */

  /**
   * Check if a text field contains BOTH a brand alias AND a model alias.
   * Works on comma-separated multi-value fields.
   */
  function fieldMatches(field, brandAliases, modelAliases) {
    if (!field) return false;
    var parts = field.split(',');
    var hasBrand = false, hasModel = false;
    for (var p = 0; p < parts.length; p++) {
      var n = norm(parts[p]);
      if (!hasBrand) {
        for (var b = 0; b < brandAliases.length; b++) {
          if (n.indexOf(brandAliases[b]) !== -1) { hasBrand = true; break; }
        }
      }
      if (!hasModel) {
        for (var m = 0; m < modelAliases.length; m++) {
          if (n.indexOf(modelAliases[m]) !== -1) { hasModel = true; break; }
        }
      }
      if (hasBrand && hasModel) return true;
    }
    return hasBrand && hasModel;
  }

  /**
   * Match products from CSV rows against selected vehicle.
   * Returns object keyed by category name, each value is array of product objects.
   */
  function matchProducts(rows, brandAliases, modelAliases) {
    var results = {};
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var id       = r[0] || '';
      var name     = r[1] || '';
      var category = (r[2] || '').trim();
      var partCode = r[3] || '';
      var tecdocMfr   = r[4] || '';
      var tecdocModel = r[5] || '';
      var years    = r[6] || '';
      var vehicles = r[7] || '';
      var source   = r[8] || '';
      var link     = r[9] || '';

      if (!category || !id) continue;

      /* Priority 1: column 7 – vehicles from title */
      var matched = fieldMatches(vehicles, brandAliases, modelAliases);

      /* Priority 2: columns 4+5 – TecDoc manufacturer + models */
      if (!matched) {
        var combined = tecdocMfr + ',' + tecdocModel;
        matched = fieldMatches(combined, brandAliases, modelAliases);
      }

      /* Priority 3: column 1 – product name */
      if (!matched) {
        matched = fieldMatches(name, brandAliases, modelAliases);
      }

      if (matched) {
        if (!results[category]) results[category] = [];
        results[category].push({
          id: id.replace(/"/g, ''),
          name: name.replace(/"/g, ''),
          category: category.replace(/"/g, ''),
          partCode: partCode.replace(/"/g, ''),
          years: years.replace(/"/g, ''),
          source: source.replace(/"/g, ''),
          link: (link || '').replace(/"/g, '')
        });
      }
    }
    return results;
  }


  /* ----------------------------------------------------------
   *  PAGE ACTIVATION – hide default content, show results
   * ---------------------------------------------------------- */

  function activatePage() {
    document.body.classList.add('an-results-active');

    /* Hide non-script children of #bg_middle or #wrapper */
    var wrapper = $('bg_middle') || $('wrapper');
    if (wrapper) {
      var kids = wrapper.children;
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el.id !== 'anResultsPage' && !el.querySelector('#anResultsPage')) {
          el.style.display = 'none';
        }
      }
    }

    /* Hide direct body children that aren't the wrapper */
    var bodyKids = document.body.children;
    for (var j = 0; j < bodyKids.length; j++) {
      var bk = bodyKids[j];
      if (bk.tagName === 'SCRIPT' || bk.tagName === 'STYLE' || bk.tagName === 'LINK') continue;
      if (bk.id === 'anResultsPage') continue;
      if (bk === wrapper) continue;
      if (bk.querySelector && bk.querySelector('#anResultsPage')) continue;
      bk.style.display = 'none';
    }

    var rp = $('anResultsPage');
    if (rp) rp.style.display = 'block';
  }


  /* ----------------------------------------------------------
   *  RENDER: Category Grid (AUTODOC-style tiles)
   * ---------------------------------------------------------- */

  function renderCategories(matched, brandHe, modelHe) {
    var catGrid = $('anCatGrid');
    var sidebar = $('anCatSidebarList');
    if (!catGrid) return;

    catGrid.innerHTML = '';
    if (sidebar) sidebar.innerHTML = '';

    /* Build ordered list of categories that have matches */
    var ordered = [];
    for (var c = 0; c < CAT_ORDER.length; c++) {
      var cat = CAT_ORDER[c];
      if (matched[cat] && matched[cat].length > 0) {
        ordered.push(cat);
      }
    }
    /* Add any categories not in CAT_ORDER (except חלקי אספנות) */
    for (var cat2 in matched) {
      if (cat2 === '\u05D7\u05DC\u05E7\u05D9 \u05D0\u05E1\u05E4\u05E0\u05D5\u05EA') continue;
      if (ordered.indexOf(cat2) === -1 && matched[cat2].length > 0) {
        ordered.push(cat2);
      }
    }

    if (ordered.length === 0) {
      showEmpty(brandHe, modelHe);
      return;
    }

    /* Set page title */
    var pageTitle = $('anCatPageTitle');
    if (pageTitle) {
      pageTitle.textContent = '\u05D1\u05D7\u05E8 \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05E2\u05D1\u05D5\u05E8 ' +
        (brandHe || '') + ' ' + (modelHe || '');
    }

    for (var k = 0; k < ordered.length; k++) {
      var catName = ordered[k];
      var count = matched[catName].length;
      var img = CAT_IMAGES[catName] || '';

      /* Grid tile */
      var tile = document.createElement('div');
      tile.className = 'an-cat-tile';
      tile.setAttribute('data-cat', catName);
      tile.innerHTML =
        (img ? '<img src="' + esc(img) + '" alt="' + esc(catName) + '" class="an-cat-img" loading="lazy">' : '') +
        '<div class="an-cat-name">' + esc(catName) + '</div>' +
        '<div class="an-cat-count">' + count + ' \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD</div>';
      tile.addEventListener('click', (function (cn) {
        return function () { showProducts(cn, matched); };
      })(catName));
      catGrid.appendChild(tile);

      /* Sidebar entry */
      if (sidebar) {
        var li = document.createElement('li');
        li.className = 'an-sidebar-item';
        li.setAttribute('data-cat', catName);
        li.innerHTML = '<span class="an-sidebar-name">' + esc(catName) + '</span>' +
          '<span class="an-sidebar-count">' + count + '</span>';
        li.addEventListener('click', (function (cn) {
          return function () { showProducts(cn, matched); };
        })(catName));
        sidebar.appendChild(li);
      }
    }

    /* Category search filter */
    var searchInput = $('anCatSearchInput');
    if (searchInput) {
      searchInput.value = '';
      searchInput.addEventListener('input', function () {
        var q = norm(this.value);
        var tiles = catGrid.querySelectorAll('.an-cat-tile');
        for (var t = 0; t < tiles.length; t++) {
          var cn = tiles[t].getAttribute('data-cat') || '';
          tiles[t].style.display = (!q || norm(cn).indexOf(q) !== -1) ? '' : 'none';
        }
        if (sidebar) {
          var items = sidebar.querySelectorAll('.an-sidebar-item');
          for (var s = 0; s < items.length; s++) {
            var sn = items[s].getAttribute('data-cat') || '';
            items[s].style.display = (!q || norm(sn).indexOf(q) !== -1) ? '' : 'none';
          }
        }
      });
    }

    /* Show category view, hide products view */
    var catView = $('anCategoryView');
    var prodView = $('anProductsView');
    if (catView) catView.style.display = '';
    if (prodView) prodView.style.display = 'none';
  }


  /* ----------------------------------------------------------
   *  RENDER: Products list for a category
   * ---------------------------------------------------------- */

  function showProducts(catName, matched) {
    var products = matched[catName] || [];
    var prodGrid = $('anProductsGrid');
    var prodView = $('anProductsView');
    var catView  = $('anCategoryView');
    var catTitle = $('anProductsCatTitle');
    var countEl  = $('anProductsCount');

    if (!prodGrid || !prodView) return;

    /* Switch views */
    if (catView) catView.style.display = 'none';
    prodView.style.display = '';

    /* Set header */
    if (catTitle) catTitle.textContent = catName;
    if (countEl) countEl.textContent = products.length + ' \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD';

    /* Render product cards (initially with placeholder images) */
    prodGrid.innerHTML = '';
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var card = document.createElement('div');
      card.className = 'an-product-card';
      card.setAttribute('data-pid', p.id);

      var imgPlaceholder = '<div class="an-product-img-wrap">' +
        '<img class="an-product-img" data-pid="' + esc(p.id) + '" ' +
        'src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'150\'%3E%3Crect fill=\'%23f0f0f0\' width=\'150\' height=\'150\'/%3E%3C/svg%3E" ' +
        'alt="' + esc(p.name) + '" loading="lazy">' +
        '</div>';

      var info = '<div class="an-product-info">' +
        '<div class="an-product-name">' + esc(p.name) + '</div>' +
        (p.partCode ? '<div class="an-product-code">\u05DE\u05E7\u05D8: ' + esc(p.partCode) + '</div>' : '') +
        (p.years ? '<div class="an-product-years">\u05E9\u05E0\u05D9\u05DD: ' + esc(p.years) + '</div>' : '') +
        '</div>';

      var actions = '<div class="an-product-actions">';
      if (p.link) {
        actions += '<a href="' + esc(p.link) + '" class="an-btn an-btn-view" target="_blank">\u05E6\u05E4\u05D4 \u05D1\u05DE\u05D5\u05E6\u05E8</a>';
      }
      actions += '<button class="an-btn an-btn-cart" ' +
        'data-iid="' + esc(p.id) + '" ' +
        'data-name="' + esc(p.name) + '" ' +
        'data-url="' + esc(p.link || '') + '" ' +
        'onclick="window.__anAddCart(this)">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>' +
        '<path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>' +
        '</svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4</button>';
      actions += '</div>';

      card.innerHTML = imgPlaceholder + info + actions;
      prodGrid.appendChild(card);
    }

    /* Fetch real product images for this category */
    window.__anFetchProductImages(catName, function (imgMap) {
      var imgs = prodGrid.querySelectorAll('.an-product-img[data-pid]');
      for (var j = 0; j < imgs.length; j++) {
        var pid = imgs[j].getAttribute('data-pid');
        if (imgMap[pid]) {
          imgs[j].src = imgMap[pid];
        }
      }
    });

    /* Back to categories button */
    var backBtn = $('anBackToCats');
    if (backBtn) {
      backBtn.onclick = function () {
        prodView.style.display = 'none';
        if (catView) catView.style.display = '';
        window.scrollTo(0, 0);
      };
    }

    window.scrollTo(0, 0);
  }


  /* ----------------------------------------------------------
   *  EMPTY STATE
   * ---------------------------------------------------------- */

  function showEmpty(brandHe, modelHe) {
    var loading = $('anResultsLoading');
    var empty   = $('anResultsEmpty');
    var catView = $('anCategoryView');
    var waLink  = $('anEmptyWA');

    if (loading) loading.style.display = 'none';
    if (catView) catView.style.display = 'none';
    if (empty) empty.style.display = 'block';

    if (waLink) {
      var msg = encodeURIComponent(
        '\u05E9\u05DC\u05D5\u05DD, \u05D0\u05E0\u05D9 \u05DE\u05D7\u05E4\u05E9 \u05D7\u05DC\u05E7\u05D9\u05DD \u05DC' +
        (brandHe || '') + ' ' + (modelHe || '')
      );
      waLink.href = 'https://wa.me/' + WA_NUMBER + '?text=' + msg;
    }
  }


  /* ----------------------------------------------------------
   *  MAIN: detect params & run
   * ---------------------------------------------------------- */

  function init() {
    /* Read URL params */
    var brandHe = getParam('brand_he') || getParam('mfr') || '';
    var brandEn = getParam('brand_en') || '';
    var modelHe = getParam('model_he') || '';
    var modelEn = getParam('model_en') || '';
    var year    = getParam('year') || '';
    var engine  = getParam('engine') || '';
    var engineCode = getParam('engineCode') || '';

    /* Bail out if no brand in URL */
    if (!brandHe && !brandEn) return;

    /* Activate results page */
    activatePage();

    /* Build vehicle title */
    var titleEl = $('anVehicleTitle');
    if (titleEl) {
      var titleParts = [brandHe || brandEn, modelHe || modelEn];
      if (year) titleParts.push(year);
      if (engine) titleParts.push('\u2022 ' + engine);
      if (engineCode) titleParts.push('(' + engineCode + ')');
      titleEl.textContent = titleParts.join(' ');
    }

    /* Back link */
    var backLink = $('anBackLink');
    if (backLink) {
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '/';
      });
    }

    /* Show loading spinner */
    var loading = $('anResultsLoading');
    if (loading) loading.style.display = 'block';

    /* Resolve brand & model aliases */
    var brandAliases = resolveBrand(brandHe || brandEn);
    if (brandEn) {
      var enAliases = resolveBrand(brandEn);
      for (var b = 0; b < enAliases.length; b++) {
        if (brandAliases.indexOf(enAliases[b]) === -1) brandAliases.push(enAliases[b]);
      }
    }

    var modelRaw = modelHe || modelEn || '';
    var modelAliases = resolveModel(modelRaw);
    if (modelEn && modelEn !== modelRaw) {
      var enModelAliases = resolveModel(modelEn);
      for (var m = 0; m < enModelAliases.length; m++) {
        if (modelAliases.indexOf(enModelAliases[m]) === -1) modelAliases.push(enModelAliases[m]);
      }
    }

    /* Fetch CSV & match */
    fetchCSV(function (rows) {
      if (loading) loading.style.display = 'none';

      if (!rows || rows.length === 0) {
        showEmpty(brandHe, modelHe);
        return;
      }

      var matched = matchProducts(rows, brandAliases, modelAliases);
      renderCategories(matched, brandHe, modelHe || modelEn);
    });
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

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

  /* ── Only run on the search page (or when explicitly forced for demo) ── */
  if (!window.ANH_FORCE_SEARCH_PATH && location.pathname.indexOf('/search') !== 0) return;

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
  /* Per-OEM TecDoc JSONs always come from GitHub Pages (never local demo folder) */
  var DATA_URL = window.ANH_DATA_URL || 'https://autonahariya-a11y.github.io/tecdoc-data/data/';
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

  /* ── Model aliases Hebrew → English (for TecDoc modelName matching) ── */
  var MODEL_ALIAS = {
    /* Toyota */
    'קורולה':['COROLLA'], 'יאריס':['YARIS'], 'אוריס':['AURIS'],
    'אוונסיס':['AVENSIS'], 'קאמרי':['CAMRY'], 'קמרי':['CAMRY'],
    'פריוס':['PRIUS'], 'היילקס':['HILUX'], 'ראב4':['RAV4','RAV 4'], 'ראב 4':['RAV4','RAV 4'],
    'לנד קרוזר':['LAND CRUISER'], 'סיאנה':['SIENNA'], 'ונזה':['VENZA'],
    'סי-אייצ\'-אר':['C-HR'], 'chr':['C-HR'], 'היילנדר':['HIGHLANDER'],
    /* Hyundai */
    'טוסון':['TUCSON'], 'סונטה':['SONATA'], 'אקסנט':['ACCENT'],
    'אלנטרה':['ELANTRA'], 'סנטה פה':['SANTA FE'], 'סנטאפה':['SANTA FE'],
    'קונה':['KONA'], 'איוניק':['IONIQ'], 'גץ':['GETZ'], 'i10':['I10'],
    'i20':['I20'], 'i30':['I30'], 'i35':['I35'], 'i40':['I40'], 'ix35':['IX35'],
    'איי10':['I10'], 'איי20':['I20'], 'איי30':['I30'],
    /* Kia */
    'ספורטאז':['SPORTAGE'], 'ספורטאז\'':['SPORTAGE'],
    'סיד':['CEED','CEE\'D','XCEED'], 'פיקנטו':['PICANTO'], 'ריו':['RIO'],
    'סורנטו':['SORENTO'], 'אופטימה':['OPTIMA'], 'נירו':['NIRO'],
    'קרניבל':['CARNIVAL'], 'סולטו':['SELTOS'], 'סטוניק':['STONIC'],
    /* Mazda */
    'מאזדה3':['3','MAZDA3'], 'מזדה3':['3','MAZDA3'],
    'מאזדה2':['2','MAZDA2'], 'מזדה2':['2','MAZDA2'],
    'מאזדה6':['6','MAZDA6'], 'מזדה6':['6','MAZDA6'],
    'cx-5':['CX-5'], 'cx5':['CX-5'], 'cx-3':['CX-3'], 'cx-30':['CX-30'],
    /* Honda */
    'סיוויק':['CIVIC'], 'אקורד':['ACCORD'], 'ג\'אז':['JAZZ'],
    'crv':['CR-V'], 'cr-v':['CR-V'], 'hrv':['HR-V'], 'hr-v':['HR-V'],
    'פיילוט':['PILOT'],
    /* Nissan */
    'מיקרה':['MICRA'], 'קשקאי':['QASHQAI'], 'ג\'וק':['JUKE'],
    'אלטימה':['ALTIMA'], 'סנטרה':['SENTRA'], 'אקס-טרייל':['X-TRAIL'],
    'אקסטרייל':['X-TRAIL'], 'לי':['LEAF'], 'ניבארה':['NAVARA'],
    /* Subaru */
    'אימפרזה':['IMPREZA'], 'פורסטר':['FORESTER'], 'אאוטבק':['OUTBACK'],
    'לגסי':['LEGACY'], 'b4':['B4'], 'xv':['XV'],
    /* Mitsubishi */
    'לנסר':['LANCER'], 'אאוטלנדר':['OUTLANDER'], 'אסקס':['ASX'],
    'ספייס סטאר':['SPACE STAR'], 'אטראז':['ATTRAGE'],
    /* Suzuki */
    'סוויפט':['SWIFT'], 'ויטארה':['VITARA','GRAND VITARA'],
    'איגניס':['IGNIS'], 'בלנו':['BALENO'], 'ג\'ימני':['JIMNY'],
    /* VW/Skoda/Seat */
    'גולף':['GOLF'], 'פולו':['POLO'], 'פאסט':['PASSAT'], 'ג\'טה':['JETTA'],
    'טיגואן':['TIGUAN'], 'טוראן':['TOURAN'], 'אוקטביה':['OCTAVIA'],
    'פאביה':['FABIA'], 'רפיד':['RAPID'], 'סופרב':['SUPERB'], 'קודיאק':['KODIAQ'],
    'קארוק':['KAROQ'], 'איביזה':['IBIZA'], 'לאון':['LEON'],
    'אטקה':['ATECA'], 'ארונה':['ARONA'],
    /* BMW/Mercedes/Audi */
    'סדרה 1':['1'], 'סדרה 3':['3'], 'סדרה 5':['5'], 'סדרה 7':['7'],
    'x1':['X1'], 'x3':['X3'], 'x5':['X5'], 'x6':['X6'],
    'a class':['A-CLASS','A'], 'c class':['C-CLASS','C'], 'e class':['E-CLASS','E'],
    'a3':['A3'], 'a4':['A4'], 'a6':['A6'], 'q3':['Q3'], 'q5':['Q5'], 'q7':['Q7'],
    /* French */
    '208':['208'], '308':['308'], '3008':['3008'], '5008':['5008'], '2008':['2008'],
    'פרטנר':['PARTNER'], 'c3':['C3'], 'c4':['C4'], 'c5':['C5'],
    'קליאו':['CLIO'], 'מגאן':['MEGANE'], 'קפצור':['CAPTUR'],
    'קדג\'אר':['KADJAR'], 'סניק':['SCENIC'], 'דאסטר':['DUSTER'],
    'לוגן':['LOGAN'], 'סנדרו':['SANDERO'],
    /* Chinese */
    'אטלס':['ATLAS'], 'אמגרנד':['EMGRAND'], 'ג\'יאומטרי':['GEOMETRY'],
    'טיגו':['TIGGO'], 'mg3':['3'], 'mg5':['5'], 'mg zs':['ZS'], 'hs':['HS']
  };

  function normalizeModel(heModel) {
    if (!heModel) return [];
    var key = heModel.trim().toLowerCase();
    if (MODEL_ALIAS[key]) return MODEL_ALIAS[key];
    for (var k in MODEL_ALIAS) {
      if (key.indexOf(k) !== -1 || k.indexOf(key) !== -1) return MODEL_ALIAS[k];
    }
    return [key.toUpperCase()];
  }

  /* ── Normalize for Hebrew matching ─ */
  function normHe(s) {
    return (s || '').toLowerCase()
      .replace(/['"״׳]/g,'')
      .replace(/\s+/g,' ').trim();
  }

  /* ── Year → generation code maps (for exact fitment checks) ─────────
   * Keys: MAKE|MODEL (uppercase). Values: array of {gens: [codes],
   * from: year, to: year}.
   * A product's mdls string must contain at least one gen code whose
   * year range includes the requested year.
   * Codes come from TecDoc (e.g. _E18_, _E12_, _P13_). */
  var GEN_MAP = {
    'TOYOTA|COROLLA': [
      { gens: ['_E8_','_E80_','_E9_'], from: 1983, to: 1995 },
      { gens: ['_E10_'], from: 1991, to: 2002 },
      { gens: ['_E11_'], from: 1995, to: 2002 },
      { gens: ['_E12_','ZZE12','R1_'], from: 2000, to: 2009 },
      { gens: ['_E14_','_E15_'], from: 2006, to: 2014 },
      { gens: ['_E16_','_E17_','_E18_','ZRE1'], from: 2012, to: 2019 },
      { gens: ['_E21_','ZWE21','ZRE21'], from: 2018, to: 2029 }
    ],
    'TOYOTA|YARIS': [
      { gens: ['_P1_'], from: 1999, to: 2005 },
      { gens: ['_P2_'], from: 2005, to: 2011 },
      { gens: ['_P9_'], from: 2005, to: 2013 },
      { gens: ['_P13_','DL2'], from: 2010, to: 2019 },
      { gens: ['_P15_','_P21_','DL2S'], from: 2019, to: 2029 }
    ],
    'TOYOTA|AURIS': [
      { gens: ['_E15_'], from: 2006, to: 2013 },
      { gens: ['_E18_'], from: 2012, to: 2019 }
    ],
    'TOYOTA|AVENSIS': [
      { gens: ['_T22_','_M2_'], from: 1997, to: 2003 },
      { gens: ['_T25_'], from: 2003, to: 2009 },
      { gens: ['_T27_'], from: 2008, to: 2019 }
    ],
    'TOYOTA|PRIUS': [
      { gens: ['_W1_'], from: 1997, to: 2003 },
      { gens: ['_W2_'], from: 2003, to: 2009 },
      { gens: ['_W3_','_W30_','_W35_'], from: 2009, to: 2016 },
      { gens: ['_W4_','_W5_'], from: 2015, to: 2022 },
      { gens: ['_W52_','NHP10'], from: 2011, to: 2020 }
    ],
    'TOYOTA|RAV4': [
      { gens: ['_A1_'], from: 1994, to: 2000 },
      { gens: ['_A2_'], from: 2000, to: 2006 },
      { gens: ['_A3_'], from: 2005, to: 2013 },
      { gens: ['_A4_'], from: 2012, to: 2019 },
      { gens: ['_A5_','_MXAA','_AXAH','_XA5'], from: 2018, to: 2029 }
    ],
    'HYUNDAI|I20': [
      { gens: ['PB','PBT'], from: 2008, to: 2014 },
      { gens: ['GB','IB'], from: 2014, to: 2020 },
      { gens: ['BC3','BI3'], from: 2020, to: 2029 }
    ],
    'HYUNDAI|ELANTRA': [
      { gens: ['XD'], from: 2000, to: 2006 },
      { gens: ['HD'], from: 2006, to: 2012 },
      { gens: ['JK'], from: 2010, to: 2014 },
      { gens: ['MD','UD'], from: 2010, to: 2016 },
      { gens: ['AD','ADA'], from: 2015, to: 2021 },
      { gens: ['CN7'], from: 2020, to: 2029 }
    ],
    'HYUNDAI|TUCSON': [
      { gens: ['JM'], from: 2004, to: 2010 },
      { gens: ['TL','TLE'], from: 2015, to: 2021 },
      { gens: ['NX4'], from: 2020, to: 2029 }
    ],
    'KIA|PICANTO': [
      { gens: ['SA'], from: 2003, to: 2011 },
      { gens: ['TA'], from: 2011, to: 2017 },
      { gens: ['JA'], from: 2017, to: 2029 }
    ],
    'KIA|SPORTAGE': [
      { gens: ['JE_','KM_'], from: 2004, to: 2010 },
      { gens: ['SL'], from: 2010, to: 2016 },
      { gens: ['QL','QLE'], from: 2015, to: 2021 },
      { gens: ['NQ5','K00'], from: 2021, to: 2029 }
    ],
    'KIA|CEED': [
      { gens: ['ED'], from: 2006, to: 2012 },
      { gens: ['JD'], from: 2012, to: 2018 },
      { gens: ['CD'], from: 2018, to: 2029 }
    ],
    'NISSAN|MICRA': [
      { gens: ['K10'], from: 1982, to: 1992 },
      { gens: ['K11'], from: 1992, to: 2002 },
      { gens: ['K12'], from: 2002, to: 2010 },
      { gens: ['K13','K13K','K13KK'], from: 2010, to: 2017 },
      { gens: ['K14'], from: 2016, to: 2029 }
    ],
    'NISSAN|QASHQAI': [
      { gens: ['J10','NJ10'], from: 2006, to: 2014 },
      { gens: ['J11'], from: 2013, to: 2021 },
      { gens: ['J12'], from: 2021, to: 2029 }
    ]
  };

  /* Given a mdls string, a make+model list and a year, return true
   * iff the mdls string contains at least one TecDoc model line where:
   *  (a) the line starts with one of the requested makes, AND
   *  (b) the line contains the requested base model, AND
   *  (c) the generation code in the parentheses matches a gen whose
   *      year range includes the requested year.
   * If no GEN_MAP exists for make|model, fall back to requiring the
   * line to contain BOTH make AND model in the same comma-entry
   * (no generation gate). */
  /* Same-family makes — don't count as "different brand" for universal detection.
   * Conservative: only truly shared-platform brands (same parent, same parts). */
  var BRAND_FAMILIES = [
    ['TOYOTA','LEXUS','DAIHATSU'],
    ['HYUNDAI','KIA','GENESIS'],
    ['VOLKSWAGEN','VW','AUDI','SKODA','SEAT','CUPRA'],
    ['RENAULT','DACIA'],
    ['NISSAN','INFINITI','DATSUN'],
    ['PEUGEOT','CITROEN','CITROëN','DS','OPEL','VAUXHALL'],
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
    return 'M:' + make;  /* own family */
  }

  function mdlsGenMatches(mdls, mfrEnList, baseModelEnList, yr) {
    if (!mdls) return false;
    var yearI = parseInt(yr, 10) || 0;
    var up = mdls.toUpperCase();
    /* Split into top-level entries: each entry is a single TecDoc model.
     * Entries are comma-separated but parentheses may themselves contain
     * commas (e.g. "_E18_, ZRE1_") — so respect nesting. */
    var entries = [];
    var depth = 0, cur = '';
    for (var i = 0; i < up.length; i++) {
      var ch = up.charAt(i);
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        if (cur.trim()) entries.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) entries.push(cur.trim());

    /* Universal-part detector: count distinct BRAND FAMILIES across all entries.
     * If >= 3 different families appear → part is universal → reject. */
    var famSet = {};
    for (var fe = 0; fe < entries.length; fe++) {
      var firstWord = entries[fe].split(/\s+/)[0];
      if (firstWord) famSet[brandFamily(firstWord)] = 1;
    }
    var nFams = 0;
    for (var fk in famSet) nFams++;
    if (nFams >= 3) return false;
    /* Secondary: 2 families AND many entries → universal belt/filter */
    if (nFams >= 2 && entries.length >= 8) return false;

    for (var e = 0; e < entries.length; e++) {
      var line = entries[e];
      /* Make gate */
      var mfrOk = false;
      for (var m = 0; m < mfrEnList.length; m++) {
        /* require it to START with the make to avoid "HONDA ..." matching TOYOTA through random substring */
        if (line.indexOf(mfrEnList[m]) === 0) { mfrOk = true; break; }
        if (mfrEnList[m] === 'VW' && line.indexOf('VOLKSWAGEN') === 0) { mfrOk = true; break; }
      }
      if (!mfrOk) continue;
      /* Model gate — base model word must appear on this same line */
      if (baseModelEnList && baseModelEnList.length) {
        var modelOk = false;
        for (var mm = 0; mm < baseModelEnList.length; mm++) {
          /* use whitespace boundaries to avoid COROLLA matching inside another word */
          var needle = baseModelEnList[mm];
          var idx = line.indexOf(needle);
          if (idx === -1) continue;
          /* character before must be space (or start) — after must be space or ( or , or end */
          var before = idx === 0 ? ' ' : line.charAt(idx - 1);
          var after = idx + needle.length >= line.length ? ' ' : line.charAt(idx + needle.length);
          if (/[\s\-]/.test(before) && /[\s\(,]/.test(after)) { modelOk = true; break; }
        }
        if (!modelOk) continue;
      }
      /* Block COROLLA Verso when searching plain COROLLA (Verso is a different vehicle) */
      if (baseModelEnList.indexOf('COROLLA') !== -1 && /COROLLA\s+VERSO/.test(line)) continue;

      /* Generation gate */
      if (!yearI) return true;  /* no year → skip gen check */
      var paren = line.match(/\(([^)]+)\)/);
      var genCodes = paren ? paren[1] : '';
      /* Find a GEN_MAP entry for any make|model combination */
      var mapHit = null;
      for (var mmi = 0; mmi < mfrEnList.length && !mapHit; mmi++) {
        for (var mni = 0; mni < baseModelEnList.length && !mapHit; mni++) {
          var key = mfrEnList[mmi] + '|' + baseModelEnList[mni];
          if (GEN_MAP[key]) mapHit = GEN_MAP[key];
        }
      }
      if (!mapHit) {
        /* No map — only accept if mdls is non-universal (few entries) */
        if (entries.length <= 4) return true;
        continue;
      }
      /* Even WITH a map: reject extreme universal listings (>25 entries) */
      if (entries.length > 25) continue;
      /* Need BOTH: generation code appears AND its year range includes yearI */
      for (var g = 0; g < mapHit.length; g++) {
        if (yearI < mapHit[g].from || yearI > mapHit[g].to) continue;
        for (var gg = 0; gg < mapHit[g].gens.length; gg++) {
          if (genCodes.indexOf(mapHit[g].gens[gg]) !== -1) return true;
        }
      }
    }
    return false;
  }

  /* ── Check title-based fitment (from "רכבים מהכותרת") ─
   *    VERY STRICT: require BOTH make AND model inside the SAME comma-entry.
   *    Also reject "universal" parts that list many unrelated makes. */
  function titleMatches(titleField, heBrand, heModel) {
    if (!titleField) return false;
    if (!heBrand && !heModel) return true;
    var entries = titleField.split(',');
    var currentBrand = '';
    var heBrandN = normHe(heBrand);
    var heModelN = normHe(heModel);
    /* Gather all distinct Hebrew brands mentioned anywhere in the title */
    var distinctBrands = {};
    var titleFullN = normHe(titleField);
    for (var bb in BRAND_ALIAS) {
      if (titleFullN.indexOf(bb) !== -1) distinctBrands[bb] = 1;
    }
    /* If title mentions 3+ different makes → "universal" — reject.
     * 2 is OK (e.g. Hyundai + Kia shared parts are common, Toyota + Lexus too). */
    var nBrands = Object.keys(distinctBrands).length;
    if (nBrands >= 3) return false;

    /* Year gate from title text: look for patterns like
     *   "2003-2007", "שנים 1996-2002", "משנת 2019", "משנת 2016 ומעלה"
     * If a year range is stated and the requested year is OUTSIDE it → reject.
     */
    if (arguments.length >= 4 && arguments[3]) {
      var yReq = parseInt(arguments[3], 10);
      var rangeM = titleField.match(/(\d{4})\s*[-–]\s*(\d{4})/);
      if (rangeM) {
        var fy = parseInt(rangeM[1], 10), ty = parseInt(rangeM[2], 10);
        if (yReq < fy || yReq > ty) return false;
      } else {
        var openM = titleField.match(/משנת\s+(\d{4})(?:\s+ומעלה)?/);
        if (openM) {
          var oy = parseInt(openM[1], 10);
          /* Accept anything >= the stated year; if requested year < it → reject */
          if (yReq < oy) return false;
        } else {
          /* "שנים 19-22" short form */
          var shortM = titleField.match(/שנים\s+(\d{2})[-–](\d{2})/);
          if (shortM) {
            var s1 = 2000 + parseInt(shortM[1], 10);
            var s2 = 2000 + parseInt(shortM[2], 10);
            if (yReq < s1 || yReq > s2) return false;
          }
        }
      }
    }
    /* Walk entries; brand is carried forward until a new brand appears */
    for (var i = 0; i < entries.length; i++) {
      var n = normHe(entries[i]);
      for (var b in BRAND_ALIAS) {
        if (n.indexOf(b) !== -1) { currentBrand = b; break; }
      }
      var brandOk = !heBrand ||
                    (currentBrand && currentBrand === heBrandN) ||
                    n.indexOf(heBrandN) !== -1;
      /* Model is REQUIRED when provided and must be in the SAME entry */
      var modelOk = !heModel || (heModelN && n.indexOf(heModelN) !== -1);
      if (brandOk && modelOk) return true;
    }
    return false;
  }

  /* ── Check TecDoc fitment (strict: mfr + model + year in interval) ─ */
  function tecdocMatches(vehicles, mfrEnList, baseModelEnList, yr) {
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
      /* Model check (if provided) — accept ANY of the English aliases */
      if (baseModelEnList && baseModelEnList.length) {
        var vModel = (v.modelName || '').toUpperCase();
        var modelOk = false;
        for (var mm = 0; mm < baseModelEnList.length; mm++) {
          if (vModel.indexOf(baseModelEnList[mm]) !== -1) { modelOk = true; break; }
        }
        if (!modelOk) continue;
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
  var baseModelEnList = normalizeModel(model);
  console.log('[SearchFilter] Vehicle:', make, '/', model, '/', year,
              '→ Make EN:', mfrEnList, '| Model EN:', baseModelEnList);

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

      /* ===== NEW STRICT ORDER =====
       * 1. If mdls present → require generation-accurate match (mdlsGenMatches).
       *    This is the ONLY trusted path for products with TecDoc data.
       * 2. If mdls absent AND title present → use restricted titleMatches
       *    (requires brand+model in same entry, rejects universal parts).
       * 3. Else → fall back to per-OEM TecDoc JSON fetch.
       * NOTE: we no longer short-circuit on title when mdls exists — that
       * allowed e.g. a belt listing 25 cars to match a Corolla search.
       */
      var hasMdls = !!(entry.mdls && entry.mdls.trim());
      if (hasMdls) {
        var genOk = mdlsGenMatches(entry.mdls, mfrEnList, baseModelEnList, year);
        if (genOk) {
          markCard(card, 'match');
          matched++;
          return;
        }
        /* mdls exists but generation didn't match → hard reject (don't fall back to title) */
        markCard(card, 'no-match');
        if (STRICT) hidden++;
        return;
      }

      /* No mdls — try the strict Hebrew title match (with year gate) */
      if (entry.title && titleMatches(entry.title, make, model, year)) {
        /* Additional year filter via y field if present */
        var yrHit2 = true;
        if (year && entry.y) {
          var ym2 = entry.y.match(/(\d{4})\s*-\s*(\d{4})/);
          if (ym2) {
            var yI2 = parseInt(year, 10);
            if (yI2 < parseInt(ym2[1], 10) || yI2 > parseInt(ym2[2], 10)) yrHit2 = false;
          }
        }
        if (yrHit2) {
          markCard(card, 'match');
          matched++;
          return;
        }
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
                tecdocMatches(data.vehicles, mfrEnList, baseModelEnList, year)) {
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
    }
    /* Clean up any stale "matches your vehicle" badges from prior versions */
    var stale = card.querySelector('.anh-fit-badge');
    if (stale) stale.parentNode.removeChild(stale);
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

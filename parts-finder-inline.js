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

  /* ── Category images — mirror /categories/*.webp from demo ──────────── */
  var CAT_IMG_BASE = 'https://autonahariya-a11y.github.io/tecdoc-data/parts-finder/categories/';
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

  /* Default category tiles when there are no matches (catalog browse) */
  var DEFAULT_CATEGORY_TILES = [
    'רפידות בלם','פילטר שמן','פילטר אויר','פילטר מזגן',
    'מצתים','סליל הצתה','רצועות אביזרים','משולשים',
    'בולמי תא מטען','בולם מכסה מנוע'
  ];

  /* ── Hebrew model-name map ─────────────────────────────────────
     Maps gov.il `kinuy_mishari` (English) to Hebrew.
     Fallback: if a model isn't listed, the English name is used.
     Keys are normalized to uppercase — lookup uses toUpperCase(). */
  var MODEL_HEB = {
    /* Toyota */
    'COROLLA': 'קורולה','COROLLA CROSS':'קורולה קרוס','YARIS':'יאריס','AURIS':'אוריס',
    'RAV4':'ראב4','RAV 4':'ראב4','CAMRY':'קאמרי','PRIUS':'פריוס','CHR':'סי-אייצ׳-אר','C-HR':'סי-אייצ׳-אר',
    'HILUX':'היילקס','LAND CRUISER':'לנד קרוזר','AVENSIS':'אוונסיס','HIACE':'הייאס',
    'PROACE':'פרואייס','AYGO':'אייגו',
    /* Hyundai */
    'I10':'איי 10','I20':'איי 20','I25':'איי 25','I30':'איי 30','I35':'איי 35',
    'IONIQ':'איוניק','TUCSON':'טוסון','SANTA FE':'סנטה פה','KONA':'קונה','BAYON':'באיון',
    'ELANTRA':'אלנטרה','SONATA':'סונטה','VENUE':'ונואה','STARIA':'סטריה','H1':'אייצ׳1',
    /* Kia */
    'PICANTO':'פיקנטו','RIO':'ריו','CEED':'סיד',"CEE'D":'סיד','STONIC':'סטוניק',
    'SPORTAGE':'ספורטאז׳','SPORTAGE NQ5':'ספורטאז׳','SORENTO':'סורנטו','NIRO':'נירו',
    'EV6':'איי-וי 6','CARNIVAL':'קרניבל','XCEED':'איקס-סיד','OPTIMA':'אופטימה','SOUL':'סול',
    /* Mazda */
    'MAZDA 2':'מאזדה 2','MAZDA 3':'מאזדה 3','MAZDA 5':'מאזדה 5','MAZDA 6':'מאזדה 6',
    'CX-3':'סי-אקס 3','CX-30':'סי-אקס 30','CX-5':'סי-אקס 5','CX-60':'סי-אקס 60','CX-9':'סי-אקס 9','MX-5':'אם-אקס 5',
    /* Mitsubishi */
    'OUTLANDER':'אאוטלנדר','SPACE STAR':'ספייס סטאר','LANCER':'לנסר','ASX':'איי-אס-אקס',
    'ECLIPSE CROSS':'אקליפס קרוס','PAJERO':'פאג׳רו','TRITON':'טריטון','ATTRAGE':'אטרז׳',
    /* Nissan */
    'MICRA':'מיקרה','JUKE':'ג׳וק','QASHQAI':'קשקאי','X-TRAIL':'אקס-טרייל','LEAF':'ליף',
    'NAVARA':'נאוארה','NOTE':'נוט','SENTRA':'סנטרה','PATHFINDER':'פאתפיינדר',
    /* Honda */
    'CIVIC':'סיוויק','JAZZ':'ג׳אז','HR-V':'אייצ׳-אר-וי','HRV':'אייצ׳-אר-וי','CR-V':'סי-אר-וי','CRV':'סי-אר-וי',
    'ACCORD':'אקורד','INSIGHT':'אינסייט','E':'הונדה אי',
    /* Suzuki */
    'SWIFT':'סוויפט','BALENO':'בלנו','VITARA':'ויטרה','S-CROSS':'אס-קרוס','JIMNY':'ג׳ימני','IGNIS':'איגניס',
    /* Ford */
    'FIESTA':'פיאסטה','FOCUS':'פוקוס','MONDEO':'מונדאו','ECOSPORT':'אקוספורט','KUGA':'קוגה',
    'PUMA':'פומה','EXPLORER':'אקספלורר','EDGE':'אדג׳','TRANSIT':'טרנזיט','RANGER':'ריינג׳ר',
    /* Opel/Vauxhall */
    'CORSA':'קורסה','ASTRA':'אסטרה','INSIGNIA':'אינסיגניה','MOKKA':'מוקה','CROSSLAND':'קרוסלנד',
    'GRANDLAND':'גרנדלנד','COMBO':'קומבו','VIVARO':'ויווארו',
    /* Peugeot */
    '208':'208','308':'308','508':'508','2008':'2008','3008':'3008','5008':'5008','RIFTER':'ריפטר','PARTNER':'פרטנר',
    /* Citroen */
    'C1':'סי 1','C3':'סי 3','C4':'סי 4','C5':'סי 5','C5 AIRCROSS':'סי 5 אירקרוס','BERLINGO':'ברלינגו',
    /* Renault */
    'CLIO':'קליאו','CAPTUR':'קפצ׳ור','MEGANE':'מגאן','KADJAR':'קדג׳אר','AUSTRAL':'אוסטרל','ARKANA':'ארקאנה',
    'ZOE':'זואי','TRAFIC':'טראפיק','KANGOO':'קנגו','DUSTER':'דאסטר',
    /* Dacia */
    'SANDERO':'סנדרו','LODGY':'לודג׳י','DOKKER':'דוקר',
    /* Volkswagen */
    'POLO':'פולו','GOLF':'גולף','PASSAT':'פאסאט','TIGUAN':'טיגואן','T-ROC':'טי-רוק','T-CROSS':'טי-קרוס',
    'TOURAN':'טוראן','CADDY':'קאדי','TRANSPORTER':'טרנספורטר','ID.3':'אי.די 3','ID.4':'אי.די 4',
    /* Skoda */
    'FABIA':'פאביה','SCALA':'סקאלה','OCTAVIA':'אוקטביה','SUPERB':'סופרב','KAMIQ':'קאמיק','KAROQ':'קארוק','KODIAQ':'קודיאק',
    /* Seat */
    'IBIZA':'איביזה','LEON':'לאון','ARONA':'ארונה','ATECA':'אטקה','TARRACO':'טראקו',
    /* BMW */
    'BMW 1':'סדרה 1','BMW 2':'סדרה 2','BMW 3':'סדרה 3','BMW 4':'סדרה 4','BMW 5':'סדרה 5','BMW 7':'סדרה 7',
    'X1':'איקס 1','X2':'איקס 2','X3':'איקס 3','X4':'איקס 4','X5':'איקס 5','X6':'איקס 6','X7':'איקס 7',
    'I3':'איי 3','I4':'איי 4','IX':'איי-אקס','IX3':'איי-אקס 3',
    /* Mercedes */
    'A-CLASS':'A קלאס','B-CLASS':'B קלאס','C-CLASS':'C קלאס','E-CLASS':'E קלאס','S-CLASS':'S קלאס',
    'GLA':'ג׳י-אל-אי','GLB':'ג׳י-אל-בי','GLC':'ג׳י-אל-סי','GLE':'ג׳י-אל-אי','GLS':'ג׳י-אל-אס',
    'CLA':'סי-אל-אי','CLS':'סי-אל-אס','VITO':'ויטו','V-CLASS':'V קלאס','SPRINTER':'ספרינטר',
    /* Audi */
    'A1':'איי 1','A3':'איי 3','A4':'איי 4','A5':'איי 5','A6':'איי 6','A7':'איי 7','A8':'איי 8',
    'Q2':'קיו 2','Q3':'קיו 3','Q4':'קיו 4','Q5':'קיו 5','Q7':'קיו 7','Q8':'קיו 8','E-TRON':'אי-טרון',
    /* Volvo */
    'V40':'וי 40','V60':'וי 60','V90':'וי 90','S60':'אס 60','S90':'אס 90','XC40':'אקס-סי 40',
    'XC60':'אקס-סי 60','XC90':'אקס-סי 90',
    /* Fiat */
    '500':'500','500X':'500 אקס','500L':'500 אל','PANDA':'פנדה','TIPO':'טיפו','DOBLO':'דובלו',
    /* Jeep */
    'RENEGADE':'רנגייד','COMPASS':'קומפאס','CHEROKEE':'צ׳ירוקי','GRAND CHEROKEE':'גרנד צ׳ירוקי','WRANGLER':'רנגלר',
    /* Chinese */
    'TIGGO 7 PRO':'טיגו 7 פרו','TIGGO 8 PRO':'טיגו 8 פרו','TIGGO 2':'טיגו 2',
    'ATTO 3':'אטו 3','HAN':'האן','SEAL':'סיל','DOLPHIN':'דולפין','SONG PLUS':'סונג פלוס','YUAN PLUS':'יואן פלוס',
    'ES6':'אי-אס 6','ET7':'אי-טי 7','X3 PRO':'איקס 3 פרו','X5':'איקס 5',
    'GEELY GEOMETRY C':'ג׳אומטרי C','COOLRAY':'קולריי','MG 3':'אם-ג׳י 3','MG 5':'אם-ג׳י 5','MG ZS':'אם-ג׳י זי-אס',
    'MG HS':'אם-ג׳י אייצ׳-אס','MG MARVEL R':'אם-ג׳י מארוול אר','MG4':'אם-ג׳י 4'
  };

  function toHebrewModel(en) {
    if (!en) return '';
    var key = String(en).trim().toUpperCase();
    /* Keep alphanumeric model codes as-is (e.g. A1, A3, X5, C200, GLE350, 320i, CR-V, CX-5).
       Rule: if the first token contains at least one letter AND at least one digit,
       treat it as a technical code and preserve the original English casing. */
    var firstWord = key.split(/\s+/)[0];
    if (/[A-Z]/.test(firstWord) && /[0-9]/.test(firstWord)) {
      return String(en).trim();
    }
    if (MODEL_HEB[key]) return MODEL_HEB[key];
    if (MODEL_HEB[firstWord]) return MODEL_HEB[firstWord];
    /* Fallback: return the original (English) name */
    return String(en).trim();
  }

  /* ── Bail if widget not present ─────────────────────────────── */
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  /* ── Styles for inline results (scoped with #anh-inline-results for max specificity) ── */
  var RESULTS_CSS = [
    '#anh-inline-results{direction:rtl;max-width:1200px;margin:20px auto 40px;padding:0 16px;font-family:Heebo,Rubik,Arial,sans-serif;box-sizing:border-box}',
    '#anh-inline-results[hidden]{display:none}',
    '#anh-inline-results *{box-sizing:border-box}',
    '#anh-inline-results .anh-ir__header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;background:linear-gradient(135deg,#0B3E5C,#1A9FD5);color:#fff;padding:18px 22px;border-radius:12px;margin-bottom:16px;flex-wrap:wrap}',
    '#anh-inline-results .anh-ir__title-wrap{display:flex;flex-direction:column;gap:10px;flex:1;min-width:220px}',
    '#anh-inline-results .anh-ir__title{font-size:22px;font-weight:700;margin:0;color:#fff;line-height:1.2;letter-spacing:-0.01em}',
    '#anh-inline-results .anh-ir__subtitle{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0}',
    '#anh-inline-results .anh-ir__spec{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.96);padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.18);white-space:nowrap}',
    '#anh-inline-results .anh-ir__spec-icon{width:12px;height:12px;flex-shrink:0;opacity:0.85}',
    '#anh-inline-results .anh-ir__back{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.18);color:#fff;border:1px solid rgba(255,255,255,0.35);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;transition:background .15s;flex-shrink:0}',
    '#anh-inline-results .anh-ir__back:hover{background:rgba(255,255,255,0.28)}',
    '@media(max-width:520px){#anh-inline-results .anh-ir__header{padding:14px 16px}#anh-inline-results .anh-ir__title{font-size:18px}#anh-inline-results .anh-ir__back{padding:6px 10px;font-size:13px}#anh-inline-results .anh-ir__back span{display:none}}',
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
    '#anh-inline-results .anh-ir__empty{text-align:center;padding:32px 20px;background:#fff;border:1px solid #E5ECF2;border-radius:12px;color:#0B3E5C;margin:0 0 20px !important}',
    '#anh-inline-results .anh-ir__empty-title{font-size:18px !important;font-weight:700 !important;color:#0B3E5C !important;margin:0 0 8px !important}',
    '#anh-inline-results .anh-ir__empty-sub{font-size:14px !important;color:#6b7780 !important;margin:0 0 20px !important;line-height:1.5 !important}',
    '#anh-inline-results .anh-ir__empty-actions{display:flex !important;gap:12px !important;justify-content:center !important;flex-wrap:wrap !important}',
    '#anh-inline-results .anh-ir__btn-wa{display:inline-flex !important;align-items:center !important;gap:8px !important;background:#25D366 !important;color:#fff !important;text-decoration:none !important;padding:12px 22px !important;border-radius:999px !important;font-weight:700 !important;font-size:15px !important;transition:all .2s !important;box-shadow:0 2px 8px rgba(37,211,102,0.3) !important}',
    '#anh-inline-results .anh-ir__btn-wa:hover{background:#1fb855 !important;transform:translateY(-1px) !important;box-shadow:0 4px 12px rgba(37,211,102,0.4) !important;color:#fff !important}',
    '#anh-inline-results .anh-ir__btn-wa svg{flex-shrink:0}',
    '#anh-inline-results .anh-ir__btn-search{display:inline-flex !important;align-items:center !important;background:#fff !important;color:#1A9FD5 !important;text-decoration:none !important;padding:12px 22px !important;border-radius:999px !important;font-weight:700 !important;font-size:15px !important;border:2px solid #1A9FD5 !important;transition:all .2s !important}',
    '#anh-inline-results .anh-ir__btn-search:hover{background:#1A9FD5 !important;color:#fff !important}',
    '#anh-inline-results .anh-ir__cat-tiles{display:grid !important;grid-template-columns:repeat(auto-fill,minmax(150px,1fr)) !important;gap:12px !important;margin:8px 0 20px !important;width:100% !important}',
    '#anh-inline-results .anh-ir__cat-tiles-title{font-size:16px;font-weight:700;color:#0B3E5C;margin:8px 0 4px;text-align:right}',
    '#anh-inline-results .anh-ir__tile{background:#fff !important;border:2px solid #E5ECF2 !important;border-radius:12px !important;padding:12px 8px !important;cursor:pointer !important;transition:all .2s !important;display:flex !important;flex-direction:column !important;align-items:center !important;gap:8px !important;text-decoration:none !important;font-family:inherit !important;color:#0B3E5C !important;text-align:center !important}',
    '#anh-inline-results .anh-ir__tile:hover{border-color:#1A9FD5 !important;transform:translateY(-2px) !important;box-shadow:0 6px 16px rgba(26,159,213,0.18) !important}',
    '#anh-inline-results .anh-ir__tile-imgwrap{width:90px !important;height:90px !important;background:linear-gradient(135deg,#E8F4FB 0%,#C7E4F3 100%) !important;border-radius:10px !important;overflow:hidden !important;display:flex !important;align-items:center !important;justify-content:center !important;flex-shrink:0 !important}',
    '#anh-inline-results .anh-ir__tile-imgwrap img{width:100% !important;height:100% !important;object-fit:cover !important}',
    '#anh-inline-results .anh-ir__tile-name{font-size:13px !important;font-weight:600 !important;color:#0B3E5C !important;line-height:1.25 !important;text-align:center !important}',
    '#anh-inline-results .anh-ir__tile-count{font-size:11px !important;font-weight:700 !important;color:#1A9FD5 !important}',
    '#anh-inline-results .anh-ir__section-title{font-size:17px;font-weight:700;color:#0B3E5C;margin:20px 0 12px;text-align:right;border-top:1px solid #e5ebf0;padding-top:16px}',
    '@media(max-width:600px){#anh-inline-results .anh-ir__cat-tiles{grid-template-columns:repeat(3,1fr) !important;gap:8px !important}#anh-inline-results .anh-ir__tile-imgwrap{width:64px !important;height:64px !important}#anh-inline-results .anh-ir__tile-name{font-size:12px !important}}',
    '@media(max-width:600px){#anh-inline-results .anh-ir__grid{grid-template-columns:repeat(2,1fr);gap:10px}#anh-inline-results .anh-ir__btn{padding:10px 4px;font-size:13px}#anh-inline-results .anh-ir__price{font-size:18px}#anh-inline-results .anh-ir__title{font-size:16px}}'
  ].join("");

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
          '<div class="anh-ir__subtitle" id="anh-ir-subtitle" hidden></div>' +
        '</div>' +
        '<button type="button" class="anh-ir__back" id="anh-ir-back">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
          '<span>חזרה לדף הבית</span>' +
        '</button>' +
      '</div>' +
      '<div class="anh-ir__empty" id="anh-ir-empty" hidden>' +
        '<p class="anh-ir__empty-title">לא נמצאו חלקים מתאימים לרכב זה במאגר הנוכחי</p>' +
        '<p class="anh-ir__empty-sub">אבל אנחנו מחזיקים מגוון רחב של חלקים ואביזרים לרכבכם — צרו איתנו קשר ונשמח לעזור.</p>' +
        '<div class="anh-ir__empty-actions">' +
          '<a class="anh-ir__btn-wa" href="https://wa.me/97249517322?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%97%D7%A4%D7%A9%20%D7%97%D7%9C%D7%A7%D7%99%D7%9D%20%D7%9C%D7%A8%D7%9B%D7%91%20%D7%A9%D7%9C%D7%99%20%E2%80%94%20%D7%AA%D7%95%D7%9B%D7%9C%D7%95%20%D7%9C%D7%A2%D7%96%D7%95%D7%A8%3F" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.264.489 1.696.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>' +
            '<span>דברו איתנו בוואטסאפ</span>' +
          '</a>' +
          '<a class="anh-ir__btn-search" href="https://www.autonahariya.co.il/search?q=">חיפוש חופשי באתר</a>' +
        '</div>' +
      '</div>' +
      '<div class="anh-ir__cat-strip" id="anh-ir-cat-strip"></div>' +
      '<div class="anh-ir__cat-tiles" id="anh-ir-cat-tiles"></div>' +
      '<h3 class="anh-ir__section-title" id="anh-ir-section-title" hidden>כל החלפים</h3>' +
      '<div class="anh-ir__grid" id="anh-ir-grid"></div>';
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
        /* Step 1 — plate lookup (primary dataset) */
        var plateNum = params.plate;
        var url = 'https://data.gov.il/api/3/action/datastore_search?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3&q=' + encodeURIComponent(plateNum) + '&limit=1';
        return fetch(url)
          .then(function (r) { return r.json(); })
          .then(function (j) {
            var rec = (j && j.result && j.result.records && j.result.records[0]) || null;
            if (!rec) return null;
            /* Build base vehicle */
            var baseMakeHeb = (rec.tozeret_nm || '').split(' ')[0].trim(); /* "מיצובישי יפן" -> "מיצובישי" */
            var baseVehicle = {
              make: baseMakeHeb,
              model: (rec.kinuy_mishari || '').trim(),
              year: String(rec.shnat_yitzur || '').trim(),
              engine: '',
              /* extras for display */
              kinuyEn: (rec.kinuy_mishari || '').trim(),
              modelHe: toHebrewModel(rec.kinuy_mishari),
              makeHe: baseMakeHeb,
              engineCode: (rec.degem_manoa || '').trim(),
              trim: (rec.ramat_gimur || '').trim(),
              fuel: (rec.sug_delek_nm || '').trim(),
              _tozeret_cd: rec.tozeret_cd,
              _degem_cd: rec.degem_cd,
              _shnat: rec.shnat_yitzur
            };
            /* Step 2 — enrich from catalog (engine cc + hp). If this call fails we still have a usable vehicle. */
            if (!rec.tozeret_cd || !rec.degem_cd) return baseVehicle;
            var catUrl = 'https://data.gov.il/api/3/action/datastore_search?resource_id=142afde2-6228-49f9-8a29-9b6c3a0cbe40' +
              '&filters=' + encodeURIComponent(JSON.stringify({ tozeret_cd: rec.tozeret_cd, degem_cd: rec.degem_cd })) +
              '&limit=10';
            return fetch(catUrl)
              .then(function (r2) { return r2.json(); })
              .then(function (j2) {
                var recs = (j2 && j2.result && j2.result.records) || [];
                /* Prefer a record matching the production year if available */
                var match = null;
                for (var i = 0; i < recs.length; i++) {
                  if (String(recs[i].shnat_yitzur) === String(rec.shnat_yitzur)) { match = recs[i]; break; }
                }
                if (!match && recs.length) match = recs[0];
                if (match) {
                  if (match.tozar) { baseVehicle.makeHe = match.tozar; baseVehicle.make = match.tozar; }
                  if (match.nefah_manoa) baseVehicle.engineCC = match.nefah_manoa;
                  if (match.koah_sus) baseVehicle.horsepower = match.koah_sus;
                  if (match.merkav && !baseVehicle.trim) baseVehicle.trim = match.merkav;
                }
                return baseVehicle;
              })
              .catch(function () { return baseVehicle; });
          })
          .catch(function () { return null; });
      }
      return Promise.resolve(null);
    }

    /* ── Render ───────────────────────────────────────────────── */
    function showResults(vehicle, data) {
      /* Prefer Hebrew translations when available */
      var displayMake = vehicle.makeHe || vehicle.make || '';
      var displayModel = vehicle.modelHe || vehicle.model || '';
      var title = 'חלקים מתאימים ל' +
        (displayMake ? displayMake + ' ' : '') +
        (displayModel ? displayModel + ' ' : '') +
        (vehicle.year ? vehicle.year : '').trim();
      document.getElementById('anh-ir-title').textContent = title;

      /* Build subtitle as individual chips: engine CC+liters, horsepower, fuel */
      var specs = [];
      if (vehicle.engineCC) {
        var liters = (vehicle.engineCC / 1000).toFixed(1).replace(/\.0$/, '');
        specs.push({ icon: 'engine', label: liters + 'L \u00B7 ' + vehicle.engineCC + ' סמ״ק' });
      }
      if (vehicle.horsepower) specs.push({ icon: 'power', label: vehicle.horsepower + ' כ״ס' });
      if (vehicle.fuel) specs.push({ icon: 'fuel', label: vehicle.fuel });
      var subEl = document.getElementById('anh-ir-subtitle');
      if (subEl) {
        subEl.innerHTML = '';
        if (specs.length) {
          specs.forEach(function (s) {
            var chip = document.createElement('span');
            chip.className = 'anh-ir__spec';
            var iconSvg = '';
            if (s.icon === 'engine') {
              iconSvg = '<svg class="anh-ir__spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h2V7h4v2h4V7h4v2h2v6h-2v2h-4v-2h-4v2h-4v-2H4z"/></svg>';
            } else if (s.icon === 'power') {
              iconSvg = '<svg class="anh-ir__spec-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.09 12.97h7.9l-1.08 8.93L19.91 11h-7.9z"/></svg>';
            } else if (s.icon === 'fuel') {
              iconSvg = '<svg class="anh-ir__spec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V6a2 2 0 012-2h7a2 2 0 012 2v16M3 22h11M14 10h2a2 2 0 012 2v5a2 2 0 004 0V7l-3-3"/></svg>';
            }
            chip.innerHTML = iconSvg + '<span>' + s.label + '</span>';
            subEl.appendChild(chip);
          });
          subEl.hidden = false;
        } else {
          subEl.hidden = true;
        }
      }

      /* Filter products */
      var matches = filterProducts(vehicle, data);

      var grid = document.getElementById('anh-ir-grid');
      grid.innerHTML = '';
      /* Inline style as a belt-and-braces safety against Konimbo CSS overrides */
      grid.style.cssText = 'display:grid !important; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap:16px !important; width:100% !important;';
      var empty = document.getElementById('anh-ir-empty');
      var _strip = document.getElementById('anh-ir-cat-strip');
      var _tiles = document.getElementById('anh-ir-cat-tiles');

      if (matches.length === 0) {
        /* No matches: show empty-state message, hide grid + category chips + tiles */
        empty.hidden = false;
        grid.hidden = true;
        if (_strip) _strip.hidden = true;
        if (_tiles) _tiles.hidden = true;
      } else {
        /* Matches found: show grid + category navigation, hide empty state */
        empty.hidden = true;
        grid.hidden = false;
        if (_strip) _strip.hidden = false;
        if (_tiles) _tiles.hidden = false;
        matches.forEach(function (p) { grid.appendChild(buildCard(p, data)); });
        renderCategoryStrip(matches);
        renderCategoryTiles(matches, true);
      }

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
      var subEl = document.getElementById('anh-ir-subtitle');
      if (subEl) { subEl.innerHTML = ''; subEl.hidden = true; }
      document.getElementById('anh-ir-grid').innerHTML = '';
      document.getElementById('anh-ir-grid').hidden = true;
      document.getElementById('anh-ir-empty').hidden = false;
      /* Hide chip strip, category tiles and section title completely on empty state */
      var strip = document.getElementById('anh-ir-cat-strip');
      if (strip) { strip.innerHTML = ''; strip.hidden = true; }
      var tiles = document.getElementById('anh-ir-cat-tiles');
      if (tiles) { tiles.innerHTML = ''; tiles.hidden = true; }
      var sec = document.getElementById('anh-ir-section-title');
      if (sec) sec.hidden = true;
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
      var hasPrice = (p.price !== undefined && p.price !== null && p.price !== '');
      var priceDisp = hasPrice ? ('₪ ' + p.price) : 'מחיר בדף המוצר';
      var skuDisp = p.sku || p.oem || kid;
      var prodUrl = 'https://www.autonahariya.co.il/items/' + kid;

      /* Styles applied inline to each element */
      var sThumb = 'display:flex !important;align-items:center !important;justify-content:center !important;background:#fff !important;aspect-ratio:1 !important;overflow:hidden !important;text-decoration:none !important;min-height:200px !important;';
      var sImg   = 'max-width:100% !important;max-height:100% !important;object-fit:contain !important;padding:16px !important;box-sizing:border-box !important;';
      var sCat   = 'font-size:12px !important;color:#1A9FD5 !important;padding:10px 14px 4px !important;text-align:right !important;';
      var sName  = 'margin:0 !important;padding:0 14px 10px !important;font-size:14px !important;line-height:1.4 !important;font-weight:600 !important;text-align:right !important;';
      var sNameA = 'color:#0B3E5C !important;text-decoration:none !important;';
      var sPrice = hasPrice
        ? 'padding:0 14px !important;font-size:22px !important;font-weight:700 !important;color:#F37021 !important;text-align:right !important;margin-top:auto !important;'
        : 'padding:0 14px !important;font-size:14px !important;font-weight:600 !important;color:#1A9FD5 !important;text-align:right !important;margin-top:auto !important;';
      var sSku   = 'padding:2px 14px 10px !important;font-size:12px !important;color:#6b7780 !important;text-align:right !important;';
      var sActs  = 'display:grid !important;grid-template-columns:1fr 1fr !important;gap:0 !important;border-top:1px solid #e5ebf0 !important;';
      var sBtnC  = 'display:flex !important;align-items:center !important;justify-content:center !important;padding:12px !important;font-size:14px !important;font-weight:600 !important;text-decoration:none !important;background:#F37021 !important;color:#fff !important;border:0 !important;cursor:pointer !important;font-family:inherit !important;';
      var sBtnP  = 'display:flex !important;align-items:center !important;justify-content:center !important;padding:12px !important;font-size:14px !important;font-weight:600 !important;text-decoration:none !important;background:#fff !important;color:#1A9FD5 !important;border-right:1px solid #e5ebf0 !important;';

      /* Cart action: button + JS handler that fetches the product page,
       * extracts the live authenticity_token and submits the same form
       * Konimbo's product page submits when its cart button is clicked.
       * This adds the item to cart and lands on the cart page — the same
       * UX as clicking 'Add to cart' on a product page directly. */
      var cartBtnHtml = hasPrice
        ? '<button type="button" class="anh-ir__btn anh-ir__btn--cart" data-anh-cart-add="' + kid + '" style="' + sBtnC + '">הוסף לעגלה</button>'
        : '';

      card.innerHTML =
        '<a class="anh-ir__thumb" style="' + sThumb + '" href="' + prodUrl + '" target="_blank" rel="noopener">' +
          (img ? '<img style="' + sImg + '" src="' + img + '" alt="' + escapeHtml(p.c || '') + '" loading="lazy" data-anh-img-fallback="' + kid + '">'
                : '<img style="' + sImg + '" src="" alt="' + escapeHtml(p.c || '') + '" loading="lazy" data-anh-img-needs="' + kid + '" hidden>' +
                  '<div class="anh-ir__thumb-fallback" data-anh-img-placeholder="' + kid + '">' + escapeHtml(p.c || 'מוצר') + '</div>') +
        '</a>' +
        '<div class="anh-ir__cat" style="' + sCat + '">' + escapeHtml(p.c || '') + '</div>' +
        '<h3 class="anh-ir__name" style="' + sName + '"><a style="' + sNameA + '" href="' + prodUrl + '" target="_blank" rel="noopener">' +
          escapeHtml((p.n || '').substring(0, 80)) + '</a></h3>' +
        '<div class="anh-ir__price" style="' + sPrice + '">' + priceDisp + '</div>' +
        '<div class="anh-ir__sku" style="' + sSku + '">מק"ט: ' + escapeHtml(skuDisp) + '</div>' +
        '<div class="anh-ir__actions" style="' + (hasPrice ? sActs : sActs.replace('grid-template-columns:1fr 1fr','grid-template-columns:1fr')) + '">' +
          cartBtnHtml +
          '<a class="anh-ir__btn anh-ir__btn--prod" style="' + (hasPrice ? sBtnP : sBtnC) + '" href="' + prodUrl + '" target="_blank" rel="noopener">' + (hasPrice ? 'לדף המוצר' : 'למוצר ומחיר') + '</a>' +
        '</div>';

      /* Wire up cart click — fetch live token from product page, then submit form */
      var cartBtn = card.querySelector('[data-anh-cart-add]');
      if (cartBtn) {
        cartBtn.addEventListener('click', function (ev) {
          ev.preventDefault();
          addItemToCart(kid, cartBtn);
        });
      }

      /* Lazy-load missing image: try to fetch og:image from product page */
      var imgNeeds = card.querySelector('[data-anh-img-needs]');
      if (imgNeeds) {
        lazyFetchImage(kid, imgNeeds, card.querySelector('[data-anh-img-placeholder]'));
      }
      return card;
    }

    /* Add item to Konimbo cart by submitting the same form their product page uses.
     * 1. Fetch the product page HTML
     * 2. Extract authenticity_token from the form
     * 3. Build & submit a hidden form to /orders/autonahariya/new
     * Behavior: opens the cart page in a new tab so the user sees confirmation. */
    function addItemToCart(kid, btn) {
      var origText = btn.textContent;
      btn.textContent = 'מוסיף...';
      btn.disabled = true;
      var prodUrl = 'https://www.autonahariya.co.il/items/' + kid;
      fetch(prodUrl, { credentials: 'include' })
        .then(function (r) { return r.text(); })
        .then(function (html) {
          /* Konimbo HTML has token as: name="authenticity_token" type="hidden" value="..."
             Match the token regardless of attribute order. */
          var m = html.match(/<input[^>]*name=["']authenticity_token["'][^>]*value=["']([^"']+)["']/i);
          if (!m) m = html.match(/<input[^>]*value=["']([^"']+)["'][^>]*name=["']authenticity_token["']/i);
          if (!m) throw new Error('no token');
          var token = m[1];
          var form = document.createElement('form');
          form.method = 'POST';
          /* The real productForm posts to secure.konimbo.co.il (not www) */
          form.action = 'https://secure.konimbo.co.il/orders/autonahariya/new#secureHook';
          form.target = '_blank';
          form.style.display = 'none';
          var fields = {
            'authenticity_token': token,
            'item_id': kid,
            'request_url': '/items/' + kid,
            'referer_url': location.href,
            'num_of_cart_items': '',
            'offer_code': '',
            'dont_go_back': '1'
          };
          for (var k in fields) {
            var inp = document.createElement('input');
            inp.type = 'hidden';
            inp.name = k;
            inp.value = fields[k];
            form.appendChild(inp);
          }
          document.body.appendChild(form);
          form.submit();
          setTimeout(function () { document.body.removeChild(form); }, 1000);
          btn.textContent = 'נוסף לעגלה ✓';
          setTimeout(function () { btn.textContent = origText; btn.disabled = false; }, 2500);
        })
        .catch(function (e) {
          /* Fallback: open product page so user can click cart there */
          window.open(prodUrl, '_blank', 'noopener');
          btn.textContent = origText;
          btn.disabled = false;
        });
    }

    /* Lazy-load image from product page when not in image_map */
    var IMG_FETCH_CACHE = {};
    var IMG_FETCH_QUEUE = [];
    var IMG_FETCH_ACTIVE = 0;
    var IMG_FETCH_MAX = 4;
    function lazyFetchImage(kid, imgEl, placeholderEl) {
      if (IMG_FETCH_CACHE[kid] === null) return; /* known to have none */
      if (IMG_FETCH_CACHE[kid]) {
        applyImage(IMG_FETCH_CACHE[kid], imgEl, placeholderEl);
        return;
      }
      IMG_FETCH_QUEUE.push({ kid: kid, imgEl: imgEl, placeholderEl: placeholderEl });
      pumpImgQueue();
    }
    function pumpImgQueue() {
      while (IMG_FETCH_ACTIVE < IMG_FETCH_MAX && IMG_FETCH_QUEUE.length) {
        var job = IMG_FETCH_QUEUE.shift();
        IMG_FETCH_ACTIVE++;
        (function (j) {
          fetch('https://www.autonahariya.co.il/items/' + j.kid, { credentials: 'omit' })
            .then(function (r) { return r.text(); })
            .then(function (html) {
              var m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
              if (!m) m = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
              var src = m && m[1];
              if (src && src.indexOf('159998') === -1) {
                IMG_FETCH_CACHE[j.kid] = src;
                applyImage(src, j.imgEl, j.placeholderEl);
              } else {
                IMG_FETCH_CACHE[j.kid] = null;
              }
            })
            .catch(function () { IMG_FETCH_CACHE[j.kid] = null; })
            .then(function () { IMG_FETCH_ACTIVE--; pumpImgQueue(); });
        })(job);
      }
    }
    function applyImage(src, imgEl, placeholderEl) {
      if (!imgEl) return;
      imgEl.src = src;
      imgEl.removeAttribute('hidden');
      if (placeholderEl) placeholderEl.style.display = 'none';
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


    function renderCategoryTiles(matches, hasMatches) {
      var tilesEl = document.getElementById('anh-ir-cat-tiles');
      var titleEl = document.getElementById('anh-ir-section-title');
      if (!tilesEl) return;
      tilesEl.innerHTML = '';

      var cats, counts = {};
      if (hasMatches && matches && matches.length) {
        matches.forEach(function (p) {
          var c = (p.c || '').trim();
          if (!c || !CATEGORY_IMAGES[c]) return;
          counts[c] = (counts[c] || 0) + 1;
        });
        cats = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
        if (cats.length === 0) {
          cats = DEFAULT_CATEGORY_TILES.slice();
        }
      } else {
        cats = DEFAULT_CATEGORY_TILES.slice();
      }

      if (cats.length === 0) { tilesEl.hidden = true; return; }
      tilesEl.hidden = false;

      cats.forEach(function (c) {
        var imgKey = CATEGORY_IMAGES[c];
        if (!imgKey) return;
        var tile = document.createElement('a');
        tile.className = 'anh-ir__tile';
        tile.setAttribute('data-cat', c);
        tile.href = 'javascript:void(0)';
        var countBadge = (hasMatches && counts[c])
          ? '<div class="anh-ir__tile-count">' + counts[c] + ' מוצרים</div>'
          : '';
        tile.innerHTML =
          '<div class="anh-ir__tile-imgwrap">' +
            '<img src="' + CAT_IMG_BASE + imgKey + '.webp" alt="' + escapeHtml(c) + '" loading="lazy" onerror="this.style.display=\'none\'" />' +
          '</div>' +
          '<div class="anh-ir__tile-name">' + escapeHtml(c) + '</div>' +
          countBadge;
        tile.addEventListener('click', function (e) {
          e.preventDefault();
          if (hasMatches && counts[c]) {
            /* In-page filter */
            var strip = document.getElementById('anh-ir-cat-strip');
            if (strip) strip.querySelectorAll('.anh-ir__chip').forEach(function (x) { x.classList.remove('active'); });
            filterByCategory(c);
            var grid = document.getElementById('anh-ir-grid');
            if (grid && !grid.hidden) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            /* Link to site search */
            window.location.href = 'https://www.autonahariya.co.il/search?q=' + encodeURIComponent(c);
          }
        });
        tilesEl.appendChild(tile);
      });

      /* Toggle section title visibility: show "כל החלפים" only when we have a grid of matches */
      if (titleEl) titleEl.hidden = !(hasMatches && matches && matches.length);
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
      /* Hebrew model name → English aliases (for Hebrew make/model search path) */
      var MODEL_ALIAS_HE = {
        /* Toyota */
        'קורולה':['COROLLA'],'יאריס':['YARIS'],'אוריס':['AURIS'],'ראב4':['RAV4','RAV 4'],
        'קאמרי':['CAMRY'],'קמרי':['CAMRY'],'היילקס':['HILUX'],'פריוס':['PRIUS'],
        'וויגו':['WIGO'],'ויגו':['WIGO'],'אייגו':['AYGO'],
        'לנד קרוזר':['LAND CRUISER','LANDCRUISER'],'אוונסיס':['AVENSIS'],
        /* Hyundai */
        'טוסון':['TUCSON'],'איוניק':['IONIQ'],'אלנטרה':['ELANTRA'],'סונטה':['SONATA'],
        'סנטה פה':['SANTA FE'],'קונה':['KONA'],'אקסנט':['ACCENT'],
        'ונו':['VENUE'],'גטס':['GETZ'],
        /* Kia */
        'פיקנטו':['PICANTO'],'ריו':['RIO'],'ספורטג':['SPORTAGE'],'סיד':['CEED','CEE\'D','PROCEED'],
        'קרניבל':['CARNIVAL','SEDONA'],'סטוניק':['STONIC'],'סלטוס':['SELTOS'],'נירו':['NIRO'],
        'סול':['SOUL'],'אופטימה':['OPTIMA','K5'],
        /* Honda */
        'סיוויק':['CIVIC'],'אקורד':['ACCORD'],'ג\'אז':['JAZZ','FIT'],
        /* Nissan */
        'מיקרה':['MICRA'],'קשקאי':['QASHQAI'],'ג\'וק':['JUKE'],'פאלסאר':['PULSAR'],
        'לף':['LEAF'],'נוט':['NOTE'],'סנטרה':['SENTRA'],
        /* Mitsubishi */
        'לנסר':['LANCER'],'אאוטלנדר':['OUTLANDER'],
        'פאג׳רו':['PAJERO','MONTERO','SHOGUN'],'פאג\'רו':['PAJERO','MONTERO','SHOGUN'],
        'אקליפס':['ECLIPSE','ECLIPSE CROSS'],'אקליפס קרוס':['ECLIPSE CROSS'],
        'ספייס סטאר':['SPACE STAR','MIRAGE'],'קולט':['COLT'],
        /* Suzuki */
        'סוויפט':['SWIFT'],'ויטרה':['VITARA','GRAND VITARA','ESCUDO'],'איגניס':['IGNIS'],
        'באלנו':['BALENO'],'גימני':['JIMNY'],
        /* Ford */
        'פוקוס':['FOCUS'],'פיאסטה':['FIESTA'],'קוגה':['KUGA','ESCAPE'],
        'מונדאו':['MONDEO','FUSION'],'פומה':['PUMA'],'רנג\'ר':['RANGER'],'אקו ספורט':['ECOSPORT','ECO SPORT'],
        'טרנזיט':['TRANSIT','TRANSIT CUSTOM','TRANSIT CONNECT'],
        /* Volkswagen */
        'גולף':['GOLF'],'פולו':['POLO'],'פאסאט':['PASSAT'],'ג\'טה':['JETTA'],'טיגואן':['TIGUAN'],
        'טוארג':['TOUAREG'],'שרן':['SHARAN'],'קאדי':['CADDY'],'טרנספורטר':['TRANSPORTER','T5','T6'],
        'ארטיאון':['ARTEON','CC'],
        /* Skoda */
        'אוקטביה':['OCTAVIA'],'פאביה':['FABIA'],'קודיאק':['KODIAQ'],'קארוק':['KAROQ'],
        'קמיק':['KAMIQ'],'סופרב':['SUPERB'],'סקאלה':['SCALA'],'רומסטר':['ROOMSTER'],
        /* SEAT */
        'איביזה':['IBIZA'],'לאון':['LEON'],'ארונה':['ARONA'],'אטקה':['ATECA'],
        'אלהמברה':['ALHAMBRA'],'טולדו':['TOLEDO'],
        /* Opel / Vauxhall */
        'קורסה':['CORSA'],'אסטרה':['ASTRA'],'אינסיגניה':['INSIGNIA'],'מוקה':['MOKKA','MOKKA X'],
        'קרוסלנד':['CROSSLAND','CROSSLAND X'],'גרנדלנד':['GRANDLAND','GRANDLAND X'],
        'מריבה':['MERIVA'],'זאפירה':['ZAFIRA'],'קומבו':['COMBO'],'ויואנו':['VIVARO'],
        'אגילה':['AGILA'],'אדם':['ADAM'],
        /* Fiat */
        'פנדה':['PANDA'],'דוקאטו':['DUCATO'],'דובלו':['DOBLO'],
        'פונטו':['PUNTO','GRANDE PUNTO'],'טיפו':['TIPO'],'באט':['BRAVO'],'פיורינו':['FIORINO'],
        /* Peugeot */
        'פרטנר':['PARTNER'],'בוקסר':['BOXER'],'ריפטר':['RIFTER'],
        /* Renault */
        'קליאו':['CLIO'],'מגאן':['MEGANE'],'קפצ\'ור':['CAPTUR'],'קדג\'אר':['KADJAR'],
        'קולאוס':['KOLEOS'],'סניק':['SCENIC','GRAND SCENIC'],'טאליסמן':['TALISMAN'],
        'קנגו':['KANGOO'],'טראפיק':['TRAFIC'],'מאסטר':['MASTER'],'זואי':['ZOE'],
        'אוסטרל':['AUSTRAL'],'ארקאנה':['ARKANA'],
        /* Citroen */
        'ברלינגו':['BERLINGO'],'ג\'אמפי':['JUMPY'],'ג\'אמפר':['JUMPER'],
        /* Dacia */
        'דאסטר':['DUSTER'],'סנדרו':['SANDERO'],'לוגן':['LOGAN'],'ספנדור':['SPRING'],
        'ג\'וגר':['JOGGER'],
        /* Jeep */
        'גרנד צ\'ירוקי':['GRAND CHEROKEE'],'צ\'ירוקי':['CHEROKEE'],'רנגייד':['RENEGADE'],
        'קומפאס':['COMPASS'],'רנגלר':['WRANGLER'],'גלאדיאטור':['GLADIATOR'],
        'קומנדר':['COMMANDER'],
        /* Chinese brands */
        'צ\'ירי':['CHERY'],'ג\'יאלי':['GEELY'],
        'טייקו':['TYCOON'],'טיגו':['TIGGO','TIGGO 4','TIGGO 7','TIGGO 8'],'אומודה':['OMODA'],
        /* Commercial vans */
        'איבקו דיילי':['IVECO DAILY','DAILY']
      };

      /* Make-scoped alphanumeric model codes (avoids collisions like Mazda "3" vs BMW "3-Series") */
      var MODEL_ALIAS_BY_MAKE = {
        'AUDI': {
          'A1':['A1'],'A3':['A3'],'A4':['A4'],'A5':['A5'],'A6':['A6'],'A7':['A7'],'A8':['A8'],
          'Q2':['Q2'],'Q3':['Q3','RSQ3'],'Q4':['Q4','Q4 E-TRON'],'Q5':['Q5','SQ5'],'Q7':['Q7','SQ7'],'Q8':['Q8','SQ8','RSQ8'],
          'TT':['TT','TTS','TT RS','TTRS'],'R8':['R8'],
          'E-TRON':['E-TRON','ETRON']
        },
        'BMW': {
          '1':['1 SERIES','SERIE 1','116','118','120','125','128','130','135','M135'],
          '2':['2 SERIES','SERIE 2','216','218','220','225','228','230','235','M235','M240'],
          '3':['3 SERIES','SERIE 3','316','318','320','323','325','328','330','335','340','M3'],
          '4':['4 SERIES','SERIE 4','418','420','425','428','430','435','440','M4'],
          '5':['5 SERIES','SERIE 5','518','520','523','525','528','530','535','540','550','M5'],
          '6':['6 SERIES','SERIE 6','628','630','635','640','650','M6'],
          '7':['7 SERIES','SERIE 7','728','730','735','740','745','750','760'],
          '8':['8 SERIES','SERIE 8','840','850','M8'],
          'X1':['X1'],'X2':['X2'],'X3':['X3','X3M'],'X4':['X4','X4M'],'X5':['X5','X5M'],
          'X6':['X6','X6M'],'X7':['X7'],
          'Z3':['Z3'],'Z4':['Z4'],
          'I3':['I3'],'I4':['I4'],'I7':['I7'],'I8':['I8'],'IX':['IX','IX1','IX3'],'IX3':['IX3'],'IX1':['IX1']
        },
        'MERCEDES': {
          'A':['A-CLASS','A CLASS','A150','A160','A170','A180','A200','A220','A250','A35','A45','AMG A'],
          'B':['B-CLASS','B CLASS','B150','B160','B170','B180','B200','B220','B250'],
          'C':['C-CLASS','C CLASS','C160','C180','C200','C220','C230','C240','C250','C280','C300','C320','C350','C400','C43','C63','AMG C'],
          'E':['E-CLASS','E CLASS','E200','E220','E230','E240','E250','E280','E300','E320','E350','E400','E450','E500','E550','E43','E53','E63','AMG E'],
          'S':['S-CLASS','S CLASS','S320','S350','S400','S420','S450','S500','S550','S560','S580','S600','S63','S65','AMG S'],
          'G':['G-CLASS','G CLASS','G320','G350','G400','G500','G550','G63','G65','AMG G','GELANDEWAGEN'],
          'CLA':['CLA','CLA180','CLA200','CLA220','CLA250','CLA35','CLA45'],
          'CLS':['CLS','CLS300','CLS350','CLS400','CLS450','CLS500','CLS550','CLS63'],
          'GLA':['GLA','GLA180','GLA200','GLA220','GLA250','GLA35','GLA45'],
          'GLB':['GLB','GLB200','GLB220','GLB250','GLB35'],
          'GLC':['GLC','GLC200','GLC220','GLC250','GLC300','GLC350','GLC43','GLC63'],
          'GLE':['GLE','GLE300','GLE350','GLE400','GLE450','GLE500','GLE53','GLE63','M-CLASS','ML','ML250','ML350'],
          'GLS':['GLS','GLS350','GLS400','GLS450','GLS500','GLS550','GLS580','GLS63','GL','GL-CLASS'],
          'VITO':['VITO','V-CLASS','V250','V300'],'SPRINTER':['SPRINTER'],
          'SLK':['SLK','SLC'],'SL':['SL'],'GT':['AMG GT','GT'],
          'EQA':['EQA'],'EQB':['EQB'],'EQC':['EQC'],'EQE':['EQE'],'EQS':['EQS'],'EQV':['EQV']
        },
        'MAZDA': {
          '2':['2','MAZDA2','DEMIO'],'3':['3','MAZDA3','AXELA'],'6':['6','MAZDA6','ATENZA'],
          'CX-3':['CX-3','CX3'],'CX-30':['CX-30','CX30'],'CX-5':['CX-5','CX5'],'CX-9':['CX-9','CX9'],
          'MX-5':['MX-5','MX5','MIATA']
        },
        'HONDA': {
          'CIVIC':['CIVIC'],'ACCORD':['ACCORD'],'JAZZ':['JAZZ','FIT'],
          'CR-V':['CR-V','CRV'],'HR-V':['HR-V','HRV'],'INSIGHT':['INSIGHT']
        },
        'NISSAN': {
          'X-TRAIL':['X-TRAIL','XTRAIL','ROGUE']
        },
        'MITSUBISHI': {
          'ASX':['ASX']
        },
        'SUZUKI': {
          'SX4':['SX4','S-CROSS','SCROSS'],'S-CROSS':['S-CROSS','SCROSS','SX4']
        },
        'VOLKSWAGEN': {
          'UP':['UP','UP!']
        },
        'FIAT': {
          '500':['500'],'500L':['500L'],'500X':['500X']
        },
        'PEUGEOT': {
          '107':['107'],'108':['108'],'207':['207'],'208':['208'],'301':['301'],'308':['308'],
          '508':['508'],'2008':['2008'],'3008':['3008'],'4008':['4008'],'5008':['5008']
        },
        'HYUNDAI': {
          'I10':['I10'],'I20':['I20'],'I25':['I25'],'I30':['I30'],'I35':['I35','IX35','TUCSON IX35'],
          'IX35':['IX35','TUCSON IX35']
        },
        'KIA': {
          'K5':['K5','OPTIMA']
        },
        'CITROEN': {
          'C1':['C1'],'C3':['C3','C3 AIRCROSS','C3 PICASSO'],
          'C4':['C4','C4 CACTUS','C4 PICASSO','C4 GRAND PICASSO'],
          'C5':['C5','C5 AIRCROSS']
        },
        'TOYOTA': {
          'C-HR':['C-HR','CHR']
        }
      };

      var mfrEnList = BRAND_ALIAS[vehicle.make] || [(vehicle.make || '').toUpperCase()];
      /* Build full brand alias list (HE + EN) for title/name matching */
      var brandAliasesAll = [];
      if (vehicle.make) brandAliasesAll.push(vehicle.make);
      if (vehicle.makeHe && vehicle.makeHe !== vehicle.make) brandAliasesAll.push(vehicle.makeHe);
      for (var bai = 0; bai < mfrEnList.length; bai++) brandAliasesAll.push(mfrEnList[bai]);
      var baseModelEn = (function () {
        var m = (vehicle.model || '').trim();
        /* Strip common trailing trims/suffixes */
        m = m.replace(/\s+Verso\b/ig, '').trim();
        var mUpper = m.toUpperCase();

        /* 1) Hebrew alias exact match */
        if (MODEL_ALIAS_HE[m]) return MODEL_ALIAS_HE[m];

        /* 2) Make-scoped alphanumeric code match (most reliable for codes like A1, X5, GLE350) */
        for (var i = 0; i < mfrEnList.length; i++) {
          var mfr = mfrEnList[i].toUpperCase();
          var codeMap = MODEL_ALIAS_BY_MAKE[mfr];
          if (!codeMap) continue;
          /* Exact match on whole model string */
          if (codeMap[mUpper]) return codeMap[mUpper];
          /* First token match (e.g. "A3 SPORTBACK" → A3) */
          var firstTok = mUpper.split(/\s+/)[0];
          if (codeMap[firstTok]) return codeMap[firstTok];
          /* Prefix match: code followed by digits, e.g. "C200" → code "C" */
          for (var key in codeMap) {
            /* Require code to be at start AND followed by a digit (handles C200, GLE350, 320i) */
            var re = new RegExp('^' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\d');
            if (re.test(mUpper)) return codeMap[key];
            /* Also code exactly equals whole string, e.g. "X5" === "X5" */
            if (mUpper === key) return codeMap[key];
          }
        }

        /* 3) Hebrew alias substring fallback */
        for (var k in MODEL_ALIAS_HE) {
          if (m.indexOf(k) !== -1) return MODEL_ALIAS_HE[k];
        }

        /* 4) Last resort: return uppercased first token as-is (preserves codes like A1, X5) */
        var firstWord = mUpper.split(/\s+/)[0];
        return firstWord ? [firstWord] : [];
      })();
      /* Build full model alias list (HE + EN) for title/name matching */
      var modelAliasesAll = [];
      if (vehicle.model) modelAliasesAll.push(vehicle.model);
      if (vehicle.modelHe && vehicle.modelHe !== vehicle.model) modelAliasesAll.push(vehicle.modelHe);
      for (var mai = 0; mai < baseModelEn.length; mai++) modelAliasesAll.push(baseModelEn[mai]);
      var yr = parseInt(vehicle.year, 10) || 0;

      var out = [];
      var lookup = data.lookup;
      var prices = data.prices || {};
      var images = data.images || {};
      var skus = data.skus || {};

      /* Scan ALL products in lookup (2,177). Price gate filters out
       * unpriced/out-of-stock entries. This replaces the demoIds limit
       * which restricted us to a narrow 140-product subset. */
      var ids = Object.keys(lookup);

      for (var i = 0; i < ids.length; i++) {
        var kid = String(ids[i]);
        var p = lookup[kid];
        if (!p) continue;
        /* Pull price/image/sku from side maps (product_lookup.json doesn't carry them) */
        var price = prices[kid];
        var img = images[kid];
        var sku = skus[kid];
        /* No price gate — show all matching products. Card renders "מחיר באתר"
         * for unpriced items and links to the live Konimbo product page. */

        /* Check mdls (strict gen-based) + title/name (loose HE+EN token match) */
        var mdlsOk = mdlsGenMatches(p.mdls || '', mfrEnList, baseModelEn, yr);
        /* When mdls is present and DOES NOT match, reject — strong negative signal.
         * mdls is the authoritative TecDoc compatibility list for the part. */
        if (p.mdls && !mdlsOk) continue;
        var titleOk = false, nameOk = false;
        if (!mdlsOk) {
          /* No mdls or unmatched mdls — fall back to text matching. Use stricter rules. */
          titleOk = titleMatches(p.title || '', brandAliasesAll, modelAliasesAll, yr);
          nameOk = titleMatches(p.n || '', brandAliasesAll, modelAliasesAll, yr);
        }
        var rank = 0;
        if (mdlsOk) rank += 4;       /* highest confidence */
        if (titleOk || nameOk) rank += 1;

        if (mdlsOk || titleOk || nameOk) {
          out.push({
            kid: kid,
            n: p.n || '',
            c: p.c || '',
            price: (price !== undefined && price !== null) ? price : '',
            sku: sku || '',
            oem: p.oem || '',
            img: img || '',
            /* Sort hint: confidence + price + image */
            _rank: rank * 100 + (price ? 2 : 0) + (img ? 1 : 0),
            _mdls: !!mdlsOk
          });
        }
      }
      /* Sort: priced+imaged first, then by category alphabetical */
      out.sort(function(a, b) {
        if (b._rank !== a._rank) return b._rank - a._rank;
        return (a.c || '').localeCompare(b.c || '', 'he');
      });
      return out;
    }

    /* ── Fitment core (simplified ports) ───────────────────────── */
    var GEN_MAP = {
      'TOYOTA|COROLLA': [
        { from: 2000, to: 2007, gens: ['ZZE12','CDE12','NDE12','ZRE12'] },
        { from: 2006, to: 2013, gens: ['ZZE15','ZRE15','ADE15','NDE15'] },
        { from: 2013, to: 2018, gens: ['ZRE17','ZRE18','ADE17','NDE17'] },
        { from: 2018, to: 2026, gens: ['ZWE21','MZEA12','NRE21','ZRE21'] }
      ],
      'TOYOTA|YARIS': [
        { from: 2005, to: 2013, gens: ['NCP9','KSP9','NLP9','ZSP9','SCP9'] },
        { from: 2010, to: 2020, gens: ['NCP13','NSP13','NHP13','KSP13'] },
        { from: 2019, to: 2026, gens: ['KSP21','MXPA1','MXPH1'] }
      ],
      'TOYOTA|AURIS': [
        { from: 2006, to: 2012, gens: ['NZE15','ZRE15','ZZE15','ADE15','NDE15'] },
        { from: 2012, to: 2019, gens: ['ZRE18','ADE18','NDE18','NRE18','ZWE18'] }
      ],
      'TOYOTA|RAV4': [
        { from: 2000, to: 2005, gens: ['ACA2','CLA2','ZCA2'] },
        { from: 2005, to: 2013, gens: ['ACA3','ALA3','GSA3'] },
        { from: 2012, to: 2019, gens: ['ALA4','ASA4','AVA4','WWA4','ZSA4'] },
        { from: 2018, to: 2026, gens: ['AXAA5','AXAH5','MXAA5','MXAP5'] }
      ],
      'TOYOTA|HILUX': [
        { from: 2004, to: 2015, gens: ['KUN1','GGN1','TGN1'] },
        { from: 2015, to: 2026, gens: ['GUN1','TGN1'] }
      ],
      'HYUNDAI|TUCSON': [
        { from: 2004, to: 2010, gens: ['JM'] },
        { from: 2009, to: 2015, gens: ['LM','IX35'] },
        { from: 2015, to: 2020, gens: ['TL'] },
        { from: 2020, to: 2026, gens: ['NX4'] }
      ],
      'HYUNDAI|I20': [
        { from: 2008, to: 2014, gens: ['PB','PBT'] },
        { from: 2014, to: 2020, gens: ['GB','IB'] },
        { from: 2020, to: 2026, gens: ['BC3','BI3'] }
      ],
      'HYUNDAI|ELANTRA': [
        { from: 2006, to: 2011, gens: ['HD'] },
        { from: 2010, to: 2015, gens: ['MD','UD'] },
        { from: 2015, to: 2020, gens: ['AD'] },
        { from: 2020, to: 2026, gens: ['CN7'] }
      ],
      'KIA|PICANTO': [
        { from: 2003, to: 2011, gens: ['SA'] },
        { from: 2011, to: 2017, gens: ['TA'] },
        { from: 2017, to: 2026, gens: ['JA'] }
      ],
      'KIA|SPORTAGE': [
        { from: 2004, to: 2010, gens: ['JE','KM'] },
        { from: 2010, to: 2015, gens: ['SL'] },
        { from: 2015, to: 2022, gens: ['QL','QLE'] },
        { from: 2021, to: 2026, gens: ['NQ5'] }
      ],
      'KIA|CEED': [
        { from: 2006, to: 2012, gens: ['ED'] },
        { from: 2012, to: 2018, gens: ['JD'] },
        { from: 2018, to: 2026, gens: ['CD'] }
      ],
      'NISSAN|MICRA': [
        { from: 2003, to: 2010, gens: ['K12'] },
        { from: 2010, to: 2017, gens: ['K13'] },
        { from: 2017, to: 2026, gens: ['K14'] }
      ],
      'NISSAN|QASHQAI': [
        { from: 2007, to: 2014, gens: ['J10'] },
        { from: 2013, to: 2021, gens: ['J11'] },
        { from: 2021, to: 2026, gens: ['J12'] }
      ],
      /* Audi — bare codes (matches actual data: 8X1, 8XA, GBA, GBH...) */
      'AUDI|A1': [
        { from: 2010, to: 2018, gens: ['8X1','8XA','8XF','8XK'] },
        { from: 2018, to: 2026, gens: ['GBA','GBH','GB1'] }
      ],
      'AUDI|A3': [
        { from: 1996, to: 2003, gens: ['8L1','8L'] },
        { from: 2003, to: 2013, gens: ['8P1','8PA','8P7'] },
        { from: 2012, to: 2020, gens: ['8V1','8VA','8VS','8VK','8VM','8V7','8VF','8V'] },
        { from: 2020, to: 2026, gens: ['8YA','8YF','8Y','GYB','GYH'] }
      ],
      'AUDI|A4': [
        { from: 2000, to: 2008, gens: ['8E2','8E5','8EC','8ED','8HE','B6','B7'] },
        { from: 2007, to: 2015, gens: ['8K2','8K5','B8'] },
        { from: 2015, to: 2023, gens: ['8W2','8WC','8W5','8WD','B9'] },
        { from: 2023, to: 2026, gens: ['B10'] }
      ],
      'AUDI|A5': [
        { from: 2007, to: 2016, gens: ['8T3','8TA','8F7','8T'] },
        { from: 2016, to: 2024, gens: ['F53','F57','F5'] }
      ],
      'AUDI|A6': [
        { from: 2004, to: 2011, gens: ['4F2','4F5','C6'] },
        { from: 2011, to: 2018, gens: ['4G2','4G5','C7'] },
        { from: 2018, to: 2026, gens: ['4A2','4A5','C8'] }
      ],
      'AUDI|Q3': [
        { from: 2011, to: 2019, gens: ['8UB','8UG','8U'] },
        { from: 2018, to: 2026, gens: ['F3B','F3N','F3'] }
      ],
      'AUDI|Q5': [
        { from: 2008, to: 2017, gens: ['8RB','8R'] },
        { from: 2016, to: 2026, gens: ['FYB','FY'] }
      ],
      'AUDI|Q7': [
        { from: 2005, to: 2015, gens: ['4LB','4L'] },
        { from: 2015, to: 2026, gens: ['4MB','4M'] }
      ],
      /* BMW — bare series codes */
      'BMW|1': [
        { from: 2004, to: 2013, gens: ['E81','E82','E87','E88'] },
        { from: 2011, to: 2019, gens: ['F20','F21'] },
        { from: 2019, to: 2026, gens: ['F40'] }
      ],
      'BMW|2': [
        { from: 2013, to: 2021, gens: ['F22','F23','F45','F46'] },
        { from: 2021, to: 2026, gens: ['G42','U06'] }
      ],
      'BMW|3': [
        { from: 1991, to: 2000, gens: ['E36'] },
        { from: 1998, to: 2006, gens: ['E46'] },
        { from: 2005, to: 2013, gens: ['E90','E91','E92','E93'] },
        { from: 2011, to: 2019, gens: ['F30','F31','F34','F80'] },
        { from: 2018, to: 2026, gens: ['G20','G21','G28'] }
      ],
      'BMW|4': [
        { from: 2013, to: 2020, gens: ['F32','F33','F36'] },
        { from: 2020, to: 2026, gens: ['G22','G23','G26'] }
      ],
      'BMW|5': [
        { from: 1988, to: 1995, gens: ['E34'] },
        { from: 1995, to: 2003, gens: ['E39'] },
        { from: 2003, to: 2010, gens: ['E60','E61'] },
        { from: 2009, to: 2017, gens: ['F10','F11','F18'] },
        { from: 2017, to: 2024, gens: ['G30','G31','G38'] },
        { from: 2023, to: 2026, gens: ['G60','G61'] }
      ],
      'BMW|X1': [
        { from: 2009, to: 2015, gens: ['E84'] },
        { from: 2015, to: 2022, gens: ['F48'] },
        { from: 2022, to: 2026, gens: ['U11'] }
      ],
      'BMW|X3': [
        { from: 2003, to: 2010, gens: ['E83'] },
        { from: 2010, to: 2017, gens: ['F25'] },
        { from: 2017, to: 2026, gens: ['G01'] }
      ],
      'BMW|X5': [
        { from: 1999, to: 2006, gens: ['E53'] },
        { from: 2006, to: 2013, gens: ['E70'] },
        { from: 2013, to: 2018, gens: ['F15'] },
        { from: 2018, to: 2026, gens: ['G05'] }
      ],
      'BMW|X6': [
        { from: 2007, to: 2014, gens: ['E71'] },
        { from: 2014, to: 2019, gens: ['F16'] },
        { from: 2019, to: 2026, gens: ['G06'] }
      ],
      /* Mercedes — *-CLASS keys (match real data) */
      'MERCEDES-BENZ|A-CLASS': [
        { from: 1997, to: 2005, gens: ['W168'] },
        { from: 2004, to: 2012, gens: ['W169'] },
        { from: 2012, to: 2018, gens: ['W176'] },
        { from: 2018, to: 2026, gens: ['W177','V177'] }
      ],
      'MERCEDES-BENZ|B-CLASS': [
        { from: 2005, to: 2011, gens: ['W245'] },
        { from: 2011, to: 2018, gens: ['W246','W242'] },
        { from: 2018, to: 2026, gens: ['W247'] }
      ],
      'MERCEDES-BENZ|C-CLASS': [
        { from: 2000, to: 2007, gens: ['W203','S203','CL203'] },
        { from: 2007, to: 2014, gens: ['W204','S204','C204'] },
        { from: 2014, to: 2021, gens: ['W205','S205','C205','A205'] },
        { from: 2021, to: 2026, gens: ['W206','S206'] }
      ],
      'MERCEDES-BENZ|E-CLASS': [
        { from: 2002, to: 2009, gens: ['W211','S211'] },
        { from: 2009, to: 2016, gens: ['W212','S212','C207','A207'] },
        { from: 2016, to: 2023, gens: ['W213','S213','C238','A238'] },
        { from: 2023, to: 2026, gens: ['W214','S214'] }
      ],
      'MERCEDES-BENZ|S-CLASS': [
        { from: 2005, to: 2013, gens: ['W221'] },
        { from: 2013, to: 2020, gens: ['W222'] },
        { from: 2020, to: 2026, gens: ['W223'] }
      ],
      'MERCEDES-BENZ|GLA-CLASS': [
        { from: 2013, to: 2020, gens: ['X156'] },
        { from: 2020, to: 2026, gens: ['H247'] }
      ],
      'MERCEDES-BENZ|GLA': [
        { from: 2013, to: 2020, gens: ['X156'] },
        { from: 2020, to: 2026, gens: ['H247'] }
      ],
      'MERCEDES-BENZ|GLC': [
        { from: 2015, to: 2022, gens: ['X253','C253'] },
        { from: 2022, to: 2026, gens: ['X254','C254'] }
      ],
      'MERCEDES-BENZ|GLE': [
        { from: 2015, to: 2019, gens: ['W166','C292'] },
        { from: 2018, to: 2026, gens: ['W167','C167'] }
      ],
      'MERCEDES-BENZ|VITO': [
        { from: 2003, to: 2014, gens: ['W639'] },
        { from: 2014, to: 2026, gens: ['W447'] }
      ],
      'MERCEDES-BENZ|SPRINTER': [
        { from: 2006, to: 2018, gens: ['906','W906'] },
        { from: 2018, to: 2026, gens: ['907','910','W907','W910'] }
      ],
      /* VW — bare codes (data uses 'VW' not 'VOLKSWAGEN') */
      'VW|GOLF': [
        { from: 1997, to: 2006, gens: ['1J1','1J5'] },
        { from: 2003, to: 2009, gens: ['1K1','1K5'] },
        { from: 2008, to: 2014, gens: ['5K1','AJ5'] },
        { from: 2012, to: 2020, gens: ['5G1','BA5','BE1','BE2','BV5','BQ1'] },
        { from: 2019, to: 2026, gens: ['CD1','CD5'] }
      ],
      'VW|POLO': [
        { from: 1994, to: 2001, gens: ['6N1','6N2'] },
        { from: 2001, to: 2009, gens: ['9N','9A4'] },
        { from: 2009, to: 2017, gens: ['6R1','6C1'] },
        { from: 2017, to: 2026, gens: ['AW1'] }
      ],
      'VW|TIGUAN': [
        { from: 2007, to: 2017, gens: ['5N1','5N2'] },
        { from: 2016, to: 2026, gens: ['AD1','AX1','BW2','BJ2'] }
      ],
      'VW|PASSAT': [
        { from: 1996, to: 2005, gens: ['3B2','3B3','3B5','3B6'] },
        { from: 2005, to: 2010, gens: ['3C2','3C5'] },
        { from: 2010, to: 2015, gens: ['362','365'] },
        { from: 2014, to: 2026, gens: ['3G2','3G5','CB2','CB5'] }
      ],
      'VW|TOURAN': [
        { from: 2003, to: 2015, gens: ['1T1','1T2','1T3'] },
        { from: 2015, to: 2026, gens: ['5T1'] }
      ],
      'VW|JETTA': [
        { from: 2005, to: 2010, gens: ['1K2'] },
        { from: 2010, to: 2018, gens: ['162','163'] },
        { from: 2018, to: 2026, gens: ['BU3'] }
      ],
      /* Renault */
      'RENAULT|KANGOO': [
        { from: 1997, to: 2008, gens: ['KC0','KC1'] },
        { from: 2008, to: 2021, gens: ['KW0','KW1','FW0','FW1'] },
        { from: 2021, to: 2026, gens: ['KF0'] }
      ],
      'RENAULT|KANGOO EXPRESS': [
        { from: 1997, to: 2008, gens: ['FC0','FC1'] },
        { from: 2008, to: 2021, gens: ['FW0','FW1'] },
        { from: 2021, to: 2026, gens: ['FF0'] }
      ],
      'RENAULT|CLIO': [
        { from: 1998, to: 2005, gens: ['BB','CB','SB'] },
        { from: 2005, to: 2014, gens: ['BR0','BR1','CR0','CR1','KR0','KR1','SR'] },
        { from: 2012, to: 2019, gens: ['BH','KH'] },
        { from: 2019, to: 2026, gens: ['B7','BF'] }
      ],
      'RENAULT|MEGANE': [
        { from: 1996, to: 2003, gens: ['BA0','BA1','LA0','LA1'] },
        { from: 2002, to: 2009, gens: ['BM0','BM1','CM0','CM1','EM0','EM1','KM0','KM1','LM0','LM1'] },
        { from: 2008, to: 2016, gens: ['BZ0','BZ1','DZ0','DZ1','EZ0','EZ1','KZ0','KZ1'] },
        { from: 2016, to: 2026, gens: ['B9A','B9M','B9N','BFB','KFB'] }
      ],
      'RENAULT|CAPTUR': [
        { from: 2013, to: 2020, gens: ['J5','H5'] },
        { from: 2019, to: 2026, gens: ['HF','HJB'] }
      ],
      'RENAULT|SCENIC': [
        { from: 2003, to: 2009, gens: ['JM0','JM1'] },
        { from: 2009, to: 2016, gens: ['JZ0','JZ1'] },
        { from: 2016, to: 2026, gens: ['J95'] }
      ],
      'RENAULT|TRAFIC': [
        { from: 2001, to: 2014, gens: ['EL','FL','JL'] },
        { from: 2014, to: 2026, gens: ['X82'] }
      ],
      'RENAULT|MASTER': [
        { from: 1998, to: 2010, gens: ['FD','ED','HD','UD'] },
        { from: 2010, to: 2026, gens: ['EV','HV','UV'] }
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

    /* textMatches — flexible matcher for product title/name fields.
     * brandAliases: array of possible brand strings (HE + EN), ANY must be found.
     * modelAliases: array of possible model strings (HE + EN), ANY must be found.
     * Returns true only when at least ONE brand alias AND at least ONE model alias
     * appear in the text. Handles mixed Hebrew+English products. */
    function titleMatches(titleField, brandAliases, modelAliases, yr) {
      if (!titleField) return false;
      var norm = function (s) { return (s || '').replace(/[\u0591-\u05c7]/g, '').replace(/[\u200f\u200e]/g,'').replace(/\s+/g, ' ').trim().toUpperCase(); };
      var textN = norm(titleField);
      if (!textN) return false;

      var toList = function (v) {
        if (!v) return [];
        if (Array.isArray(v)) return v.filter(Boolean).map(norm).filter(Boolean);
        return [norm(v)].filter(Boolean);
      };
      var brands = toList(brandAliases);
      var models = toList(modelAliases);
      if (!brands.length || !models.length) return false; /* must have both */

      /* Word-boundary helper: needs a non-alphanumeric char before & after.
       * Treats Hebrew letters as alphanumeric for this purpose so 'AUDI'
       * inside ' אאודי ' still matches. We use [^A-Z0-9\u0590-\u05FF]. */
      var wbTest = function (text, needle) {
        var esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('(^|[^A-Z0-9\\u0590-\\u05FF])' + esc + '([^A-Z0-9\\u0590-\\u05FF]|$)').test(text);
      };

      /* Brand check — ANY brand alias must appear with word boundaries */
      var brandHit = false;
      for (var bi = 0; bi < brands.length; bi++) {
        if (wbTest(textN, brands[bi])) { brandHit = true; break; }
      }
      if (!brandHit) return false;

      /* Model check — ANY model alias must appear with word boundaries.
       * For short codes (≤3 chars) like 'A1', 'X5', boundary is critical. */
      var modelHit = false;
      for (var mi = 0; mi < models.length; mi++) {
        var mk = models[mi];
        if (!mk) continue;
        if (wbTest(textN, mk)) { modelHit = true; break; }
      }
      if (!modelHit) return false;

      /* Year gate — if text contains a year range, require overlap */
      if (yr) {
        var rangeMatch = textN.match(/(19|20)\d{2}\s*[-–]\s*(19|20)?\d{2,4}/);
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


})();

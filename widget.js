/* TecDoc Widget v9.1 — AUTODOC-style Product Page + Spec Sections + Hebrew Vehicle Names
   Loads TecDoc data from GitHub Pages JSON cache, falls back to live API.
   Enhances Konimbo product pages with tabbed AUTODOC layout.
   IIFE — no globals except window.tecdocSearch and config vars.
*/
(function () {
  'use strict';

  /* ══ CONFIGURATION ══ */
  var BASE_URL = window.TECDOC_BASE_URL || 'https://autonahariya-a11y.github.io/tecdoc-data';
  var CACHE_URL = BASE_URL + '/data/';
  var APIFY_TOKEN = window.TECDOC_APIFY_TOKEN || '';
  var API_URL = APIFY_TOKEN ? 'https://api.apify.com/v2/acts/Zt16dqMI2yN7Igggl/run-sync-get-dataset-items?token=' + APIFY_TOKEN + '&timeout=90' : '';
  var WHATSAPP_NUMBER = '97249517322';

  var SPECS_VISIBLE = 6;

  /* Spec keys to exclude from display */
  var EXCLUDE_SPECS = {
    'EAN number':1, 'EAN':1, 'WVA Number':1, 'WVA number':1,
    'Supplementary Article/Supplementary Info':1,
    'Supplementary Article/Info':1,
    'Supplementary Article/Info 2':1,
    'Supplementary Info':1,
    'MAPP':1,
    'Check Character':1,
    'Packing Type':1,
    'Paired product':1,
    'Vehicle Equipment':1,
    'for PR number':1,
    'Test Mark':1
  };

  /* Check if a spec value is essentially zero / empty / irrelevant */
  function isZeroOrEmpty(val) {
    if (!val) return true;
    var v = val.toString().trim();
    if (!v) return true;
    if (v === '0' || v === '0.0' || v === '0.00' || v === '0,0' || v === '0,00') return true;
    if (v === '0 mm' || v === '0 kg' || v === '0 Nm') return true;
    if (/^0[\.\,]?0*\s*\w*$/.test(v)) return true;
    return false;
  }

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
    'Manufacturer': '\u05D9\u05E6\u05E8\u05DF',
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
    'Coating': '\u05E6\u05D9\u05E4\u05D5\u05D9'
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

  /* ── Hebrew product type translations ── */
  var PRODUCT_TR = {
    'Brake Pad Set': '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD',
    'Brake Pad Set, disc brake': '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD, \u05D3\u05D9\u05E1\u05E7',
    'Brake Pad Set, drum brake': '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD, \u05EA\u05D5\u05E3',
    'Brake Disc': '\u05D3\u05D9\u05E1\u05E7 \u05D1\u05DC\u05DD',
    'Brake Shoe Set': '\u05E1\u05D8 \u05D0\u05E4\u05E7\u05D5\u05E0\u05D5\u05EA \u05D1\u05DC\u05DD',
    'Oil Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF',
    'Air Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D5\u05D9\u05E8',
    'Cabin Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF',
    'Cabin Air Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF',
    'Fuel Filter': '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D3\u05DC\u05E7',
    'Spark Plug': '\u05DE\u05E6\u05EA \u05D4\u05E6\u05EA\u05D4',
    'Clutch Kit': '\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3',
    'Clutch Disc': '\u05D3\u05D9\u05E1\u05E7 \u05DE\u05E6\u05DE\u05D3',
    'Clutch Pressure Plate': '\u05DE\u05DB\u05E1\u05D4 \u05DC\u05D7\u05D9\u05E6\u05D4',
    'Water Pump': '\u05DE\u05E9\u05D0\u05D1\u05EA \u05DE\u05D9\u05DD',
    'Timing Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05EA\u05D6\u05DE\u05D5\u05DF',
    'Timing Belt Kit': '\u05E1\u05D8 \u05E8\u05E6\u05D5\u05E2\u05EA \u05EA\u05D6\u05DE\u05D5\u05DF',
    'V-Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05E0\u05D5\u05E2',
    'V-Ribbed Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05E0\u05D5\u05E2',
    'Serpentine Belt': '\u05E8\u05E6\u05D5\u05E2\u05EA \u05E0\u05D5\u05E2',
    'Ball Joint': '\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8',
    'Tie Rod End': '\u05DE\u05D5\u05D8 \u05D4\u05D2\u05D4',
    'Stabilizer Link': '\u05DE\u05D5\u05D8 \u05DE\u05D9\u05D9\u05E6\u05D1',
    'Control Arm': '\u05DE\u05E9\u05D5\u05DC\u05E9',
    'Shock Absorber': '\u05D1\u05D5\u05DC\u05DD',
    'Strut Mount': '\u05EA\u05D5\u05E4\u05E1\u05EA \u05D1\u05D5\u05DC\u05DD',
    'Wheel Bearing': '\u05DE\u05D9\u05E1\u05D1 \u05D2\u05DC\u05D2\u05DC',
    'Wheel Bearing Kit': '\u05E1\u05D8 \u05DE\u05D9\u05E1\u05D1 \u05D2\u05DC\u05D2\u05DC',
    'Wiper Blade': '\u05DC\u05D4\u05D1 \u05DE\u05D2\u05D1',
    'Battery': '\u05DE\u05E6\u05D1\u05E8',
    'Alternator': '\u05D0\u05DC\u05D8\u05E8\u05E0\u05D8\u05D5\u05E8',
    'Starter': '\u05DE\u05E0\u05D5\u05E2 \u05D4\u05EA\u05E0\u05E2\u05D4',
    'Thermostat': '\u05EA\u05E8\u05DE\u05D5\u05E1\u05D8\u05D8',
    'Radiator': '\u05E8\u05D3\u05D9\u05D0\u05D8\u05D5\u05E8',
    'Ignition Coil': '\u05E1\u05DC\u05D9\u05DC \u05D4\u05E6\u05EA\u05D4',
    'Lambda Sensor': '\u05D7\u05D9\u05D9\u05E9\u05DF \u05DC\u05DE\u05D1\u05D3\u05D4',
    'Brake Caliper': '\u05E7\u05DC\u05D9\u05E4\u05E8 \u05D1\u05DC\u05DD',
    'CV Joint': '\u05DE\u05E4\u05E8\u05E7 \u05D2\u05E8\u05E0\u05D0\u05D8',
    'Drive Shaft': '\u05D2\u05E8\u05E0\u05D0\u05D8',
    'Suspension Spring': '\u05E7\u05E4\u05D9\u05E5 \u05DE\u05EA\u05DC\u05D4',
    'Coil Spring': '\u05E7\u05E4\u05D9\u05E5 \u05DE\u05EA\u05DC\u05D4',
    'Engine Mount': '\u05EA\u05D5\u05E4\u05E1\u05EA \u05DE\u05E0\u05D5\u05E2',
    'Gearbox Mount': '\u05EA\u05D5\u05E4\u05E1\u05EA \u05EA\u05D9\u05D1\u05EA \u05D4\u05D9\u05DC\u05D5\u05DB\u05D9\u05DD',
    'Brake Hose': '\u05E6\u05D9\u05E0\u05D5\u05E8 \u05D1\u05DC\u05DD',
    'Brake Cable': '\u05DB\u05D1\u05DC \u05D1\u05DC\u05DD \u05D9\u05D3',
    'Gasket Set': '\u05E1\u05D8 \u05D0\u05D8\u05DE\u05D9\u05DD',
    'Piston Ring Set': '\u05E1\u05D8 \u05D8\u05D1\u05E2\u05D5\u05EA',
    'Tensioner Pulley': '\u05D2\u05DC\u05D2\u05DC\u05EA \u05DE\u05EA\u05D9\u05D7\u05D4',
    'Idler Pulley': '\u05D2\u05DC\u05D2\u05DC\u05EA \u05DE\u05D5\u05D1\u05DC\u05EA'
  };
  function trProduct(engName) {
    if (!engName) return '';
    if (PRODUCT_TR[engName]) return PRODUCT_TR[engName];
    /* Partial match — try without trailing descriptors */
    var parts = engName.split(',');
    if (parts.length > 1 && PRODUCT_TR[parts[0].trim()]) {
      return PRODUCT_TR[parts[0].trim()];
    }
    return '';
  }

  /* ── Hebrew vehicle manufacturer names ── */
  var MFR_HE = {
    'ALFA ROMEO': '\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5',
    'AUDI': '\u05D0\u05D5\u05D3\u05D9',
    'BMW': 'BMW',
    'CHEVROLET': '\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8',
    'CHRYSLER': '\u05E7\u05E8\u05D9\u05D9\u05D6\u05DC\u05E8',
    'CITROEN': '\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF',
    'CITRO\u00CBN': '\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF',
    'CUPRA': '\u05E7\u05D5\u05E4\u05E8\u05D0',
    'DACIA': '\u05D3\u05D0\u05E6\u05D9\u05D4',
    'DAEWOO': '\u05D3\u05D0\u05D5\u05D5',
    'DAIHATSU': '\u05D3\u05D9\u05D9\u05D4\u05D8\u05E1\u05D5',
    'DODGE': '\u05D3\u05D5\u05D3\u05D2\u05F3',
    'DS': 'DS',
    'FIAT': '\u05E4\u05D9\u05D0\u05D8',
    'FORD': '\u05E4\u05D5\u05E8\u05D3',
    'HONDA': '\u05D4\u05D5\u05E0\u05D3\u05D4',
    'HYUNDAI': '\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9',
    'INFINITI': '\u05D0\u05D9\u05E0\u05E4\u05D9\u05E0\u05D9\u05D8\u05D9',
    'ISUZU': '\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5',
    'JAGUAR': '\u05D9\u05D2\u05D5\u05D0\u05E8',
    'JEEP': '\u05D2\u05F3\u05D9\u05E4',
    'KIA': '\u05E7\u05D9\u05D0',
    'LANCIA': '\u05DC\u05E0\u05E6\u05F3\u05D9\u05D4',
    'LAND ROVER': '\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8',
    'LEXUS': '\u05DC\u05E7\u05E1\u05D5\u05E1',
    'MAZDA': '\u05DE\u05D0\u05D6\u05D3\u05D4',
    'MERCEDES-BENZ': '\u05DE\u05E8\u05E6\u05D3\u05E1',
    'MINI': '\u05DE\u05D9\u05E0\u05D9',
    'MITSUBISHI': '\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9',
    'NISSAN': '\u05E0\u05D9\u05E1\u05DF',
    'OPEL': '\u05D0\u05D5\u05E4\u05DC',
    'PEUGEOT': '\u05E4\u05D9\u05D6\u05F3\u05D5',
    'PORSCHE': '\u05E4\u05D5\u05E8\u05E9\u05D4',
    'RENAULT': '\u05E8\u05E0\u05D5',
    'SEAT': '\u05E1\u05D9\u05D0\u05D8',
    'SKODA': '\u05E1\u05E7\u05D5\u05D3\u05D4',
    '\u0160KODA': '\u05E1\u05E7\u05D5\u05D3\u05D4',
    'SMART': '\u05E1\u05DE\u05D0\u05E8\u05D8',
    'SSANGYONG': '\u05E1\u05D0\u05E0\u05D2\u05D9\u05D5\u05E0\u05D2',
    'SUBARU': '\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5',
    'SUZUKI': '\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9',
    'TESLA': '\u05D8\u05E1\u05DC\u05D4',
    'TOYOTA': '\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4',
    'VAUXHALL': '\u05D5\u05D5\u05E7\u05E1\u05D4\u05D5\u05DC',
    'VOLKSWAGEN': '\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF',
    'VW': '\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF',
    'VOLVO': '\u05D5\u05D5\u05DC\u05D5\u05D5',
    'MAN': 'MAN',
    'IVECO': '\u05D0\u05D9\u05D5\u05D5\u05E7\u05D5',
    'SAAB': '\u05E1\u05D0\u05D0\u05D1',
    'ROVER': '\u05E8\u05D5\u05D1\u05E8',
    'MG': 'MG',
    'GWM': 'GWM',
    'CHERY': '\u05E6\u05F3\u05E8\u05D9',
    'GEELY': '\u05D2\u05F3\u05D9\u05DC\u05D9',
    'BYD': 'BYD'
  };

  /* ── Hebrew vehicle model names ── */
  var MODEL_HE = {
    /* VW */
    'GOLF': '\u05D2\u05D5\u05DC\u05E3', 'POLO': '\u05E4\u05D5\u05DC\u05D5',
    'PASSAT': '\u05E4\u05E1\u05D0\u05D8', 'TIGUAN': '\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF',
    'TOURAN': '\u05D8\u05D5\u05E8\u05D0\u05DF', 'CADDY': '\u05E7\u05D0\u05D3\u05D9',
    'JETTA': '\u05D2\u05F3\u05D8\u05D4', 'ARTEON': '\u05D0\u05E8\u05D8\u05D9\u05D5\u05DF',
    'UP': '\u05D0\u05E4', 'UP!': '\u05D0\u05E4!', 'TOUAREG': '\u05D8\u05D5\u05D0\u05E8\u05D2',
    'T-ROC': '\u05D8\u05D9-\u05E8\u05D5\u05E7', 'T-CROSS': '\u05D8\u05D9-\u05E7\u05E8\u05D5\u05E1',
    'ID.3': 'ID.3', 'ID.4': 'ID.4', 'ID.5': 'ID.5',
    'TRANSPORTER': '\u05D8\u05E8\u05E0\u05E1\u05E4\u05D5\u05E8\u05D8\u05E8',
    'CRAFTER': '\u05E7\u05E8\u05E4\u05D8\u05E8', 'AMAROK': '\u05D0\u05DE\u05E8\u05D5\u05E7',
    'SHARAN': '\u05E9\u05D0\u05E8\u05DF', 'SCIROCCO': '\u05E1\u05D9\u05E8\u05D5\u05E7\u05D5',
    'BEETLE': '\u05D1\u05D9\u05D8\u05DC', 'BORA': '\u05D1\u05D5\u05E8\u05D0',
    'LUPO': '\u05DC\u05D5\u05E4\u05D5', 'FOX': '\u05E4\u05D5\u05E7\u05E1',
    'VENTO': '\u05D5\u05E0\u05D8\u05D5',
    /* Toyota */
    'COROLLA': '\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4', 'CAMRY': '\u05E7\u05DE\u05E8\u05D9',
    'YARIS': '\u05D9\u05D0\u05E8\u05D9\u05E1', 'RAV4': 'RAV4', 'RAV 4': 'RAV4',
    'LAND CRUISER': '\u05DC\u05E0\u05D3 \u05E7\u05E8\u05D5\u05D6\u05E8',
    'HILUX': '\u05D4\u05D9\u05DC\u05D5\u05E7\u05E1', 'PRIUS': '\u05E4\u05E8\u05D9\u05D5\u05E1',
    'AVENSIS': '\u05D0\u05D1\u05E0\u05E1\u05D9\u05E1', 'AURIS': '\u05D0\u05D5\u05E8\u05D9\u05E1',
    'C-HR': 'C-HR', 'AYGO': '\u05D0\u05D9\u05D2\u05D5',
    'VERSO': '\u05D5\u05E8\u05E1\u05D5', 'SUPRA': '\u05E1\u05D5\u05E4\u05E8\u05D0',
    'BZ4X': 'bZ4X',
    /* Hyundai */
    'I10': 'i10', 'I20': 'i20', 'I25': 'i25', 'I30': 'i30', 'I35': 'i35', 'I40': 'i40',
    'TUCSON': '\u05D8\u05D5\u05E1\u05D5\u05DF', 'SANTA FE': '\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4',
    'ELANTRA': '\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4', 'ACCENT': '\u05D0\u05E7\u05E1\u05E0\u05D8',
    'SONATA': '\u05E1\u05D5\u05E0\u05D8\u05D4', 'KONA': '\u05E7\u05D5\u05E0\u05D4',
    'IONIQ': '\u05D0\u05D9\u05D5\u05E0\u05D9\u05E7', 'IONIQ 5': '\u05D0\u05D9\u05D5\u05E0\u05D9\u05E7 5',
    'IONIQ 6': '\u05D0\u05D9\u05D5\u05E0\u05D9\u05E7 6',
    'GETZ': '\u05D2\u05D8\u05E1', 'CRETA': '\u05E7\u05E8\u05D8\u05D4',
    'BAYON': '\u05D1\u05D0\u05D9\u05D5\u05DF', 'VENUE': '\u05D5\u05E0\u05D9\u05D5',
    'VELOSTER': '\u05D5\u05DC\u05D5\u05E1\u05D8\u05E8',
    /* Kia */
    'SPORTAGE': '\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D2\u05F3',
    'PICANTO': '\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5', 'RIO': '\u05E8\u05D9\u05D5',
    'CEED': '\u05E1\u05D9\u05D3', "CEE'D": '\u05E1\u05D9\u05D3',
    'PROCEED': '\u05E4\u05E8\u05D5\u05E1\u05D9\u05D3', 'SORENTO': '\u05E1\u05D5\u05E8\u05E0\u05D8\u05D5',
    'NIRO': '\u05E0\u05D9\u05E8\u05D5', 'STONIC': '\u05E1\u05D8\u05D5\u05E0\u05D9\u05E7',
    'OPTIMA': '\u05D0\u05D5\u05E4\u05D8\u05D9\u05DE\u05D4', 'SOUL': '\u05E1\u05D5\u05DC',
    'CARNIVAL': '\u05E7\u05E8\u05E0\u05D9\u05D1\u05DC', 'FORTE': '\u05E4\u05D5\u05E8\u05D8\u05D4',
    'STINGER': '\u05E1\u05D8\u05D9\u05E0\u05D2\u05E8', 'EV6': 'EV6', 'EV9': 'EV9',
    'XCEED': '\u05D0\u05E7\u05E1\u05E1\u05D9\u05D3',
    /* Mazda */
    'MAZDA2': '\u05DE\u05D0\u05D6\u05D3\u05D4 2', 'MAZDA3': '\u05DE\u05D0\u05D6\u05D3\u05D4 3',
    'MAZDA6': '\u05DE\u05D0\u05D6\u05D3\u05D4 6', 'CX-3': 'CX-3', 'CX-5': 'CX-5',
    'CX-30': 'CX-30', 'CX-60': 'CX-60', 'MX-5': 'MX-5',
    /* Nissan */
    'QASHQAI': '\u05E7\u05E9\u05E7\u05D0\u05D9', 'JUKE': '\u05D2\u05F3\u05D5\u05E7',
    'X-TRAIL': '\u05D0\u05E7\u05E1-\u05D8\u05E8\u05D9\u05D9\u05DC',
    'MICRA': '\u05DE\u05D9\u05E7\u05E8\u05D4', 'NOTE': '\u05E0\u05D5\u05D8',
    'LEAF': '\u05DC\u05D9\u05E3', 'NAVARA': '\u05E0\u05D1\u05D0\u05E8\u05D4',
    'PATROL': '\u05E4\u05D8\u05E8\u05D5\u05DC', 'SENTRA': '\u05E1\u05E0\u05D8\u05E8\u05D4',
    'TIIDA': '\u05D8\u05D9\u05D9\u05D3\u05D4', 'ALMERA': '\u05D0\u05DC\u05DE\u05E8\u05D4',
    /* Renault */
    'CLIO': '\u05E7\u05DC\u05D9\u05D5', 'MEGANE': '\u05DE\u05D2\u05D0\u05DF',
    'M\u00C9GANE': '\u05DE\u05D2\u05D0\u05DF', 'CAPTUR': '\u05E7\u05E4\u05D8\u05D5\u05E8',
    'KADJAR': '\u05E7\u05D3\u05D2\u05F3\u05D0\u05E8', 'SCENIC': '\u05E1\u05E0\u05D9\u05E7',
    'SC\u00C9NIC': '\u05E1\u05E0\u05D9\u05E7',
    'KOLEOS': '\u05E7\u05D5\u05DC\u05D0\u05D5\u05E1', 'KANGOO': '\u05E7\u05E0\u05D2\u05D5',
    'FLUENCE': '\u05E4\u05DC\u05D5\u05D0\u05E0\u05E1', 'LAGUNA': '\u05DC\u05D2\u05D5\u05E0\u05D4',
    'ZOE': '\u05D6\u05D5\u05D0\u05D4', 'DUSTER': '\u05D3\u05D0\u05E1\u05D8\u05E8',
    'AUSTRAL': '\u05D0\u05D5\u05E1\u05D8\u05E8\u05DC', 'KAPTUR': '\u05E7\u05E4\u05D8\u05D5\u05E8',
    /* Peugeot */
    '208': '208', '308': '308', '508': '508', '2008': '2008', '3008': '3008', '5008': '5008',
    '107': '107', '206': '206', '207': '207', '301': '301', '307': '307', '407': '407',
    'PARTNER': '\u05E4\u05E8\u05D8\u05E0\u05E8', 'BOXER': '\u05D1\u05D5\u05E7\u05E1\u05E8',
    'RIFTER': '\u05E8\u05D9\u05E4\u05D8\u05E8',
    /* Citroen */
    'C1': 'C1', 'C3': 'C3', 'C4': 'C4', 'C5': 'C5',
    'C3 AIRCROSS': 'C3 \u05D0\u05D9\u05D9\u05E8\u05E7\u05E8\u05D5\u05E1',
    'C4 CACTUS': 'C4 \u05E7\u05E7\u05D8\u05D5\u05E1', 'C5 AIRCROSS': 'C5 \u05D0\u05D9\u05D9\u05E8\u05E7\u05E8\u05D5\u05E1',
    'BERLINGO': '\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5', 'JUMPER': '\u05D2\u05F3\u05DE\u05E4\u05E8',
    'NEMO': '\u05E0\u05DE\u05D5',
    /* Skoda */
    'OCTAVIA': '\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4', 'FABIA': '\u05E4\u05D0\u05D1\u05D9\u05D4',
    'SUPERB': '\u05E1\u05D5\u05E4\u05E8\u05D1', 'KAROQ': '\u05E7\u05D0\u05E8\u05D5\u05E7',
    'KODIAQ': '\u05E7\u05D5\u05D3\u05D9\u05D0\u05E7', 'KAMIQ': '\u05E7\u05DE\u05D9\u05E7',
    'SCALA': '\u05E1\u05E7\u05D0\u05DC\u05D4', 'RAPID': '\u05E8\u05D0\u05E4\u05D9\u05D3',
    'ROOMSTER': '\u05E8\u05D5\u05DE\u05E1\u05D8\u05E8', 'YETI': '\u05D9\u05D8\u05D9',
    'ENYAQ': '\u05D0\u05E0\u05D9\u05D0\u05E7',
    /* Seat */
    'LEON': '\u05DC\u05D9\u05D0\u05D5\u05DF', 'IBIZA': '\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4',
    'ARONA': '\u05D0\u05E8\u05D5\u05E0\u05D4', 'ATECA': '\u05D0\u05D8\u05E7\u05D4',
    'TARRACO': '\u05D8\u05D0\u05E8\u05D0\u05E7\u05D5', 'ALHAMBRA': '\u05D0\u05DC\u05D4\u05DE\u05D1\u05E8\u05D4',
    'MII': '\u05DE\u05D9',
    /* Ford */
    'FOCUS': '\u05E4\u05D5\u05E7\u05D5\u05E1', 'FIESTA': '\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4',
    'KUGA': '\u05E7\u05D5\u05D2\u05D4', 'PUMA': '\u05E4\u05D5\u05DE\u05D4',
    'ECOSPORT': '\u05D0\u05E7\u05D5\u05E1\u05E4\u05D5\u05E8\u05D8',
    'MONDEO': '\u05DE\u05D5\u05E0\u05D3\u05D0\u05D5', 'RANGER': '\u05E8\u05D9\u05D9\u05E0\u05D2\u05F3\u05E8',
    'TRANSIT': '\u05D8\u05E8\u05E0\u05D6\u05D9\u05D8', 'MUSTANG': '\u05DE\u05D5\u05E1\u05D8\u05E0\u05D2',
    'EDGE': '\u05D0\u05D3\u05D2\u05F3', 'GALAXY': '\u05D2\u05DC\u05E7\u05E1\u05D9',
    'S-MAX': 'S-MAX', 'B-MAX': 'B-MAX', 'C-MAX': 'C-MAX',
    'EXPLORER': '\u05D0\u05E7\u05E1\u05E4\u05DC\u05D5\u05E8\u05E8',
    'KA': '\u05E7\u05D0', 'KA+': '\u05E7\u05D0+',
    'TOURNEO CONNECT': '\u05D8\u05D5\u05E8\u05E0\u05D0\u05D5 \u05E7\u05D5\u05E0\u05E7\u05D8',
    'TOURNEO COURIER': '\u05D8\u05D5\u05E8\u05E0\u05D0\u05D5 \u05E7\u05D5\u05E8\u05D9\u05D9\u05E8',
    'TRANSIT CONNECT': '\u05D8\u05E8\u05E0\u05D6\u05D9\u05D8 \u05E7\u05D5\u05E0\u05E7\u05D8',
    'FULLBACK': '\u05E4\u05D5\u05DC\u05D1\u05E7',
    /* Opel */
    'CORSA': '\u05E7\u05D5\u05E8\u05E1\u05D4', 'ASTRA': '\u05D0\u05E1\u05D8\u05E8\u05D4',
    'INSIGNIA': '\u05D0\u05D9\u05E0\u05E1\u05D9\u05D2\u05E0\u05D9\u05D4',
    'MOKKA': '\u05DE\u05D5\u05E7\u05D4', 'CROSSLAND': '\u05E7\u05E8\u05D5\u05E1\u05DC\u05E0\u05D3',
    'GRANDLAND': '\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3',
    'KARL': '\u05E7\u05E8\u05DC', 'ADAM': '\u05D0\u05D3\u05DD',
    'MERIVA': '\u05DE\u05E8\u05D9\u05D1\u05D4', 'ZAFIRA': '\u05D6\u05E4\u05D9\u05E8\u05D4',
    'COMBO': '\u05E7\u05D5\u05DE\u05D1\u05D5', 'VIVARO': '\u05D5\u05D9\u05D5\u05D5\u05D0\u05E8\u05D5',
    'VECTRA': '\u05D5\u05E7\u05D8\u05E8\u05D4',
    /* Fiat */
    'PUNTO': '\u05E4\u05D5\u05E0\u05D8\u05D5', 'PANDA': '\u05E4\u05E0\u05D3\u05D4',
    '500': '500', '500X': '500X', '500L': '500L',
    'TIPO': '\u05D8\u05D9\u05E4\u05D5', 'DUCATO': '\u05D3\u05D5\u05E7\u05D0\u05D8\u05D5',
    'DOBLO': '\u05D3\u05D5\u05D1\u05DC\u05D5', 'BRAVO': '\u05D1\u05E8\u05D0\u05D5\u05D5',
    'LINEA': '\u05DC\u05D9\u05E0\u05D0\u05D4', 'STILO': '\u05E1\u05D8\u05D9\u05DC\u05D5',
    /* Audi */
    'A1': 'A1', 'A3': 'A3', 'A4': 'A4', 'A5': 'A5', 'A6': 'A6', 'A7': 'A7', 'A8': 'A8',
    'Q2': 'Q2', 'Q3': 'Q3', 'Q5': 'Q5', 'Q7': 'Q7', 'Q8': 'Q8',
    'TT': 'TT', 'E-TRON': 'e-tron', 'Q4 E-TRON': 'Q4 e-tron',
    /* BMW */
    '1': '\u05E1\u05D3\u05E8\u05D4 1', '2': '\u05E1\u05D3\u05E8\u05D4 2',
    '3': '\u05E1\u05D3\u05E8\u05D4 3', '4': '\u05E1\u05D3\u05E8\u05D4 4',
    '5': '\u05E1\u05D3\u05E8\u05D4 5', '6': '\u05E1\u05D3\u05E8\u05D4 6',
    '7': '\u05E1\u05D3\u05E8\u05D4 7', '8': '\u05E1\u05D3\u05E8\u05D4 8',
    'X1': 'X1', 'X2': 'X2', 'X3': 'X3', 'X4': 'X4', 'X5': 'X5', 'X6': 'X6', 'X7': 'X7',
    'IX': 'iX', 'IX3': 'iX3', 'I3': 'i3', 'I4': 'i4', 'I7': 'i7',
    'Z4': 'Z4',
    /* Mercedes */
    'A-CLASS': 'A-Class', 'B-CLASS': 'B-Class', 'C-CLASS': 'C-Class',
    'E-CLASS': 'E-Class', 'S-CLASS': 'S-Class',
    'GLA': 'GLA', 'GLB': 'GLB', 'GLC': 'GLC', 'GLE': 'GLE', 'GLS': 'GLS',
    'CLA': 'CLA', 'CLS': 'CLS',
    'SPRINTER': '\u05E1\u05E4\u05E8\u05D9\u05E0\u05D8\u05E8', 'VITO': '\u05D5\u05D9\u05D8\u05D5',
    'V-CLASS': 'V-Class',
    /* Honda */
    'CIVIC': '\u05E1\u05D9\u05D5\u05D5\u05D9\u05E7', 'JAZZ': '\u05D2\u05F3\u05D0\u05D6',
    'CR-V': 'CR-V', 'HR-V': 'HR-V', 'ACCORD': '\u05D0\u05E7\u05D5\u05E8\u05D3',
    /* Suzuki */
    'SWIFT': '\u05E1\u05D5\u05D5\u05D9\u05E4\u05D8', 'VITARA': '\u05D5\u05D9\u05D8\u05E8\u05D4',
    'JIMNY': '\u05D2\u05F3\u05D9\u05DE\u05E0\u05D9', 'IGNIS': '\u05D0\u05D9\u05D2\u05E0\u05D9\u05E1',
    'SX4': 'SX4', 'BALENO': '\u05D1\u05DC\u05E0\u05D5', 'ALTO': '\u05D0\u05DC\u05D8\u05D5',
    'S-CROSS': 'S-Cross', 'ACROSS': '\u05D0\u05E7\u05E8\u05D5\u05E1',
    'GRAND VITARA': '\u05D2\u05E8\u05E0\u05D3 \u05D5\u05D9\u05D8\u05E8\u05D4',
    /* Mitsubishi */
    'OUTLANDER': '\u05D0\u05D5\u05D8\u05DC\u05E0\u05D3\u05E8',
    'ASX': 'ASX', 'LANCER': '\u05DC\u05E0\u05E1\u05E8',
    'L200': 'L200', 'PAJERO': '\u05E4\u05D0\u05D2\u05F3\u05E8\u05D5',
    'ECLIPSE CROSS': '\u05D0\u05E7\u05DC\u05D9\u05E4\u05E1 \u05E7\u05E8\u05D5\u05E1',
    'SPACE STAR': '\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8',
    'MIRAGE': '\u05E1\u05E4\u05D9\u05D9\u05E1 \u05E1\u05D8\u05D0\u05E8',
    'ATTRAGE': '\u05D0\u05D8\u05E8\u05D0\u05D6\u05F3',
    /* Subaru */
    'IMPREZA': '\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4', 'FORESTER': '\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8',
    'OUTBACK': '\u05D0\u05D5\u05D8\u05D1\u05E7', 'XV': 'XV', 'LEGACY': '\u05DC\u05D2\u05E1\u05D9',
    'WRX': 'WRX', 'BRZ': 'BRZ', 'CROSSTREK': '\u05E7\u05E8\u05D5\u05E1\u05D8\u05E8\u05E7',
    /* Dacia */
    'SANDERO': '\u05E1\u05E0\u05D3\u05E8\u05D5', 'LOGAN': '\u05DC\u05D5\u05D2\u05DF',
    'DUSTER': '\u05D3\u05D0\u05E1\u05D8\u05E8', 'SPRING': '\u05E1\u05E4\u05E8\u05D9\u05E0\u05D2',
    'JOGGER': '\u05D2\u05F3\u05D5\u05D2\u05E8',
    /* Alfa Romeo */
    'GIULIETTA': '\u05D2\u05F3\u05D5\u05DC\u05D9\u05D0\u05D8\u05D4',
    'GIULIA': '\u05D2\u05F3\u05D5\u05DC\u05D9\u05D4', 'STELVIO': '\u05E1\u05D8\u05DC\u05D5\u05D9\u05D5',
    'MITO': '\u05DE\u05D9\u05D8\u05D5', '159': '159', '147': '147',
    /* Porsche */
    'CAYENNE': '\u05E7\u05D0\u05D9\u05D9\u05DF', 'MACAN': '\u05DE\u05D0\u05E7\u05DF',
    'PANAMERA': '\u05E4\u05E0\u05DE\u05E8\u05D4', 'TAYCAN': '\u05D8\u05D0\u05D9\u05E7\u05DF',
    '911': '911', 'BOXSTER': '\u05D1\u05D5\u05E7\u05E1\u05D8\u05E8',
    'CAYMAN': '\u05E7\u05D9\u05DE\u05DF', 'RC': 'RC',
    /* Volvo */
    'XC40': 'XC40', 'XC60': 'XC60', 'XC90': 'XC90',
    'S60': 'S60', 'S90': 'S90', 'V40': 'V40', 'V60': 'V60', 'V90': 'V90',
    'C40': 'C40',
    /* Jeep */
    'RENEGADE': '\u05E8\u05E0\u05D2\u05D9\u05D9\u05D3',
    'COMPASS': '\u05E7\u05D5\u05DE\u05E4\u05E1',
    'CHEROKEE': '\u05E6\u05F3\u05E8\u05D5\u05E7\u05D9',
    'GRAND CHEROKEE': '\u05D2\u05E8\u05E0\u05D3 \u05E6\u05F3\u05E8\u05D5\u05E7\u05D9',
    'WRANGLER': '\u05E8\u05E0\u05D2\u05DC\u05E8',
    /* Lexus */
    'NX': 'NX', 'RX': 'RX', 'UX': 'UX', 'IS': 'IS', 'ES': 'ES',
    /* Cupra */
    'FORMENTOR': '\u05E4\u05D5\u05E8\u05DE\u05E0\u05D8\u05D5\u05E8', 'BORN': '\u05D1\u05D5\u05E8\u05DF',
    /* Chevrolet */
    'CRUZE': '\u05E7\u05E8\u05D5\u05D6', 'AVEO': '\u05D0\u05D5\u05D5\u05D0\u05D5',
    'SPARK': '\u05E1\u05E4\u05D0\u05E8\u05E7', 'CAPTIVA': '\u05E7\u05E4\u05D8\u05D9\u05D1\u05D4',
    'TRAX': '\u05D8\u05E8\u05E7\u05E1', 'ORLANDO': '\u05D0\u05D5\u05E8\u05DC\u05E0\u05D3\u05D5',
    /* Smart */
    'FORTWO': '\u05E4\u05D5\u05E8\u05D8\u05D5',
    'FORFOUR': '\u05E4\u05D5\u05E8\u05E4\u05D5\u05E8',
    /* Mini */
    'COUNTRYMAN': '\u05E7\u05D0\u05E0\u05D8\u05E8\u05D9\u05DE\u05DF',
    'CLUBMAN': '\u05E7\u05DC\u05D0\u05D1\u05DE\u05DF',
    'ONE': 'One', 'COOPER': 'Cooper',
    /* Jaguar */
    'XE': 'XE', 'XF': 'XF', 'F-PACE': 'F-PACE', 'E-PACE': 'E-PACE',
    'I-PACE': 'I-PACE',
    /* Land Rover */
    'DISCOVERY': '\u05D3\u05D9\u05E1\u05E7\u05D5\u05D1\u05E8\u05D9',
    'DISCOVERY SPORT': '\u05D3\u05D9\u05E1\u05E7\u05D5\u05D1\u05E8\u05D9 \u05E1\u05E4\u05D5\u05E8\u05D8',
    'RANGE ROVER': '\u05E8\u05D9\u05D9\u05E0\u05D2\u05F3 \u05E8\u05D5\u05D1\u05E8',
    'RANGE ROVER EVOQUE': '\u05E8\u05D9\u05D9\u05E0\u05D2\u05F3 \u05E8\u05D5\u05D1\u05E8 \u05D0\u05D9\u05D5\u05D5\u05E7',
    'RANGE ROVER SPORT': '\u05E8\u05D9\u05D9\u05E0\u05D2\u05F3 \u05E8\u05D5\u05D1\u05E8 \u05E1\u05E4\u05D5\u05E8\u05D8',
    'RANGE ROVER VELAR': '\u05E8\u05D9\u05D9\u05E0\u05D2\u05F3 \u05E8\u05D5\u05D1\u05E8 \u05D5\u05D9\u05DC\u05D0\u05E8',
    'DEFENDER': '\u05D3\u05E4\u05E0\u05D3\u05E8',
    'FREELANDER': '\u05E4\u05E8\u05D9\u05DC\u05E0\u05D3\u05E8'
  };

  function trMfr(name) {
    if (!name) return name;
    var upper = name.toUpperCase().trim();
    var he = MFR_HE[upper];
    if (he) return he + ' / ' + name;
    return name;
  }

  function trModel(name) {
    if (!name) return name;
    var upper = name.toUpperCase().trim();
    /* Try exact match first */
    if (MODEL_HE[upper]) return MODEL_HE[upper];
    /* Try partial: "GOLF VII" → match GOLF → "\u05D2\u05D5\u05DC\u05E3 VII" */
    var parts = upper.split(/\s+/);
    if (parts.length > 1 && MODEL_HE[parts[0]]) {
      return MODEL_HE[parts[0]] + ' ' + parts.slice(1).join(' ');
    }
    /* Try 2-word model: "GRAND CHEROKEE" */
    if (parts.length > 2) {
      var twoWord = parts[0] + ' ' + parts[1];
      if (MODEL_HE[twoWord]) {
        return MODEL_HE[twoWord] + (parts.length > 2 ? ' ' + parts.slice(2).join(' ') : '');
      }
    }
    return name;
  }

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
    /* Try extracting from product title */
    var titleEl = document.querySelector('#item_current_title h1') || document.querySelector('h1');
    if (titleEl) {
      var code = extractCodeFromTitle(titleEl.textContent.trim());
      if (code) return code;
    }
    return null;
  }

  function getStoreSKU() {
    /* Try .code_item first */
    var codeEl = document.querySelector('.code_item');
    if (codeEl) {
      var text = codeEl.textContent.trim();
      text = text.replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g, '').trim();
      if (text) return text;
    }
    /* Try specs: מק"ט יצרן */
    var specItems = document.querySelectorAll('#item_specifications li');
    for (var si = 0; si < specItems.length; si++) {
      var b = specItems[si].querySelector('b');
      if (b && b.textContent.indexOf('\u05DE\u05E7') !== -1 && b.textContent.indexOf('\u05D8') !== -1) {
        var span = specItems[si].querySelector('span');
        if (span && span.textContent.trim()) return span.textContent.trim();
      }
    }
    return null;
  }

  /* Known brand names to strip from title when extracting article code */
  var KNOWN_BRANDS = ['MANN','MANN-FILTER','Hi-Q','HI-Q','BOSCH','MAHLE','HENGST','BREMBO','TRW','SACHS','VALEO','DENSO','NGK','SKF','FEBI','MEYLE','OPTIMAL','MAPCO','BLUE PRINT','ASHIKA','FILTRON','KNECHT','PURFLUX','CHAMPION','MOOG','CONTINENTAL','GATES','DAYCO','INA','FAG','SNR','LUK','JAPANPARTS','JAPKO','REINZ','ELRING','CORTECO','TOPRAN','SWAG','TEXTAR','ATE','FERODO','BERU','DELPHI','NISSENS','HELLA','OSRAM','PHILIPS','NTN'];

  /* Hebrew category prefixes to strip */
  var HEB_PREFIXES = [
    '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E9\u05DE\u05DF',   /* פילטר שמן */
    '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D0\u05D5\u05D9\u05E8', /* פילטר אויר */
    '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05D3\u05DC\u05E7',   /* פילטר דלק */
    '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05DE\u05D6\u05D2\u05DF', /* פילטר מזגן */
    '\u05E4\u05D9\u05DC\u05D8\u05E8 \u05E1\u05D5\u05DC\u05E8', /* פילטר סולר */
    '\u05E4\u05D9\u05DC\u05D8\u05E8',                       /* פילטר */
    '\u05E1\u05D8 \u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD', /* סט רפידות בלם */
    '\u05E8\u05E4\u05D9\u05D3\u05D5\u05EA \u05D1\u05DC\u05DD', /* רפידות בלם */
    '\u05D3\u05D9\u05E1\u05E7 \u05D1\u05DC\u05DD',         /* דיסק בלם */
    '\u05E1\u05D8 \u05DE\u05E6\u05DE\u05D3',               /* סט מצמד */
    '\u05E8\u05E6\u05D5\u05E2\u05EA \u05D8\u05D9\u05DE\u05D9\u05E0\u05D2', /* רצועת טימינג */
    '\u05DE\u05E9\u05D0\u05D1\u05EA \u05DE\u05D9\u05DD',   /* משאבת מים */
    '\u05DE\u05E9\u05D5\u05DC\u05E9\u05D9\u05DD',          /* משולשים */
    '\u05EA\u05E4\u05D5\u05D7 \u05E4\u05E8\u05D5\u05E0\u05D8', /* תפוח פרונט */
    '\u05DE\u05D0\u05E8\u05D6 \u05E7\u05D5\u05D9\u05DC\u05D9\u05DD' /* מארז קוילים */
  ];

  /* Extract article code from product title */
  function extractCodeFromTitle(title) {
    if (!title) return null;
    /* Strip Hebrew prefix */
    var cleaned = title;
    for (var hi = 0; hi < HEB_PREFIXES.length; hi++) {
      if (cleaned.indexOf(HEB_PREFIXES[hi]) === 0) {
        cleaned = cleaned.substring(HEB_PREFIXES[hi].length).trim();
        break;
      }
    }
    /* Strip known brand name from start */
    var upperCleaned = cleaned.toUpperCase();
    for (var bi = 0; bi < KNOWN_BRANDS.length; bi++) {
      var brand = KNOWN_BRANDS[bi].toUpperCase();
      if (upperCleaned.indexOf(brand) === 0) {
        cleaned = cleaned.substring(brand.length).trim();
        break;
      }
    }
    /* What remains should be the article code (e.g. "HU 7008 z", "SP1107F", "5PK1230") */
    cleaned = cleaned.trim();
    if (cleaned.length >= 3) return cleaned;
    /* Fallback: try regex patterns on original title */
    var patterns = [
      /([A-Z0-9]{2,}[A-Z]\d{3,}[A-Za-z0-9]*)/,       /* e.g. SP1107F, 04E115561AC */
      /(\d{3,}[A-Z][A-Za-z0-9]+)/,                     /* e.g. 281132S000, 5PK1230 */
      /([A-Z]{2,}[- ]?\d{3,}[- ]?[A-Za-z0-9]*)/       /* e.g. HU 7008 z */
    ];
    for (var pi = 0; pi < patterns.length; pi++) {
      var m = title.match(patterns[pi]);
      if (m && m[1] && m[1].length >= 4) return m[1];
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

  /* ══════════════════════════════════════
     PRODUCT PAGE DETECTION — Read Konimbo DOM
     ══════════════════════════════════════ */
  function getProductPageData() {
    /* Only on single product pages with pricing info */
    var priceEl = document.querySelector('.price_value') || document.querySelector('.price_current') || document.querySelector('.price .number') || document.querySelector('.price_val') || document.querySelector('.item_current_price');
    if (!priceEl) return null;

    var data = {};

    /* Title */
    var titleEl = document.querySelector('#item_current_title h1') || document.querySelector('.item_info h1') || document.querySelector('.item_title h1') || document.querySelector('h1.product_name') || document.querySelector('h1');
    data.title = titleEl ? titleEl.textContent.trim() : '';

    /* Price — prefer content attribute (Konimbo sets content="106.0") */
    var priceContent = priceEl.getAttribute('content');
    if (priceContent) {
      data.price = parseFloat(priceContent) || 0;
    } else {
      var priceText = priceEl.textContent.trim().replace(/[^\d.]/g, '');
      data.price = parseFloat(priceText) || 0;
    }

    /* Images — collect ALL from carousel */
    data.imageUrls = [];
    var carouselImgs = document.querySelectorAll('#item_show_carousel img, .item_image img, .main-image img, .carousel-inner img, .product-images img, .item_gallery img');
    for (var ci = 0; ci < carouselImgs.length; ci++) {
      var cSrc = carouselImgs[ci].getAttribute('src') || carouselImgs[ci].getAttribute('data-src') || '';
      if (cSrc && data.imageUrls.indexOf(cSrc) === -1) data.imageUrls.push(cSrc);
    }
    /* Also check carousel thumbnail links for bigger images */
    var thumbLinks = document.querySelectorAll('#item_show_carousel a, .product-thumbs a, .gallery-thumbs a');
    for (var tl = 0; tl < thumbLinks.length; tl++) {
      var tlHref = thumbLinks[tl].getAttribute('href') || '';
      if (tlHref && /\.(jpg|jpeg|png|webp)/i.test(tlHref) && data.imageUrls.indexOf(tlHref) === -1) data.imageUrls.push(tlHref);
    }
    data.imageUrl = data.imageUrls.length ? data.imageUrls[0] : '';

    /* YouTube video — check for embed or link in product description */
    data.youtubeId = '';
    var ytIframe = document.querySelector('#item_info iframe[src*="youtube"], #item_info iframe[src*="youtu.be"], .product_description iframe[src*="youtube"]');
    if (ytIframe) {
      var ytMatch = (ytIframe.getAttribute('src') || '').match(/(?:embed\/|v=)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) data.youtubeId = ytMatch[1];
    }
    if (!data.youtubeId) {
      var descEl = document.getElementById('item_info') || document.querySelector('.product_description');
      if (descEl) {
        var ytLinkMatch = descEl.innerHTML.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (ytLinkMatch) data.youtubeId = ytLinkMatch[1];
      }
    }

    /* SKU */
    data.sku = getStoreSKU() || '';

    /* Product ID for add-to-cart */
    var idEl = document.querySelector('input[name="item_id"]') || document.querySelector('[data-item-id]');
    data.itemId = idEl ? (idEl.value || idEl.getAttribute('data-item-id') || '') : '';
    if (!data.itemId) {
      /* Try from URL: /items/XXXXX */
      var urlMatch = location.pathname.match(/\/items\/(\d+)/);
      if (urlMatch) data.itemId = urlMatch[1];
    }

    /* Category from breadcrumb */
    var bcLinks = document.querySelectorAll('#bread_crumbs a');
    data.category = '';
    for (var i = bcLinks.length - 1; i >= 0; i--) {
      var t = bcLinks[i].textContent.trim();
      if (t && t !== '\u05D3\u05E3 \u05D4\u05D1\u05D9\u05EA' && t !== '\u05D7\u05DC\u05E7\u05D9 \u05D7\u05D9\u05DC\u05D5\u05E3 \u05DC\u05E8\u05DB\u05D1') {
        data.category = t;
        break;
      }
    }

    /* Supplier/brand — extract from title or SKU prefix */
    data.brand = '';
    if (data.title) {
      /* Common patterns: "BRAND MODEL" or title starts with brand */
      var brandMatch = data.title.match(/^([A-Z][A-Z0-9-]+)\s/);
      if (brandMatch) data.brand = brandMatch[1];
    }

    return data;
  }

  /* ══════════════════════════════════════
     PRODUCT PAGE RENDERER — AUTODOC Style
     ══════════════════════════════════════ */
  function renderProductPage(pageData) {
    var inStock = pageData.price > 0;
    var priceStr = pageData.price > 0 ? '\u20AA' + Math.round(pageData.price) : '';
    var brandFromData = D.supplier || pageData.brand || '';
    var articleDisplay = D.articleNo || pageData.sku || '';

    /* Build quick specs from first few TecDoc specs */
    var quickSpecsHtml = '';
    var quickSpecs = [];
    for (var qi = 0; qi < D.specs.length && quickSpecs.length < 4; qi++) {
      var sn = D.specs[qi].criteriaName;
      if (EXCLUDE_SPECS[sn]) continue;
      if (isZeroOrEmpty(D.specs[qi].criteriaValue)) continue;
      quickSpecs.push({ name: trSpec(sn), value: trVal(sn, D.specs[qi].criteriaValue) });
    }
    if (quickSpecs.length) {
      quickSpecsHtml = '<table class="an-product__quick-specs">';
      for (var qsi = 0; qsi < quickSpecs.length; qsi++) {
        quickSpecsHtml += '<tr><td>' + esc(quickSpecs[qsi].name) + '</td><td>' + esc(quickSpecs[qsi].value) + '</td></tr>';
      }
      quickSpecsHtml += '</table>';
    }

    /* Purchase section */
    var purchaseHtml = '';
    purchaseHtml += '<div class="an-product__stock ' + (inStock ? 'an-product__stock--in' : 'an-product__stock--out') + '">';
    purchaseHtml += '<span class="an-product__stock-dot"></span>';
    purchaseHtml += inStock ? '\u05D1\u05DE\u05DC\u05D0\u05D9' : '\u05D0\u05D6\u05DC \u05D1\u05DE\u05DC\u05D0\u05D9';
    purchaseHtml += '</div>';

    if (inStock) {
      purchaseHtml += '<div class="an-product__price">' + priceStr + '<span class="an-product__price-vat"> \u05DB\u05D5\u05DC\u05DC \u05DE\u05E2"\u05DE</span></div>';
      purchaseHtml += '<div class="an-product__cart-row">';
      purchaseHtml += '<div class="an-product__qty"><button type="button" onclick="anQtyChange(1)">+</button><input type="number" id="anQtyInput" value="1" min="1" max="99"><button type="button" onclick="anQtyChange(-1)">\u2212</button></div>';
      purchaseHtml += '<button type="button" class="an-product__add-btn" id="anAddToCart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4</button>';
      purchaseHtml += '</div>';
    } else {
      var waMsg = encodeURIComponent('\u05D4\u05D9\u05D9, \u05D0\u05E9\u05DE\u05D7 \u05DC\u05E7\u05D1\u05DC \u05E2\u05D3\u05DB\u05D5\u05DF \u05DB\u05E9\u05D4\u05DE\u05D5\u05E6\u05E8 ' + (articleDisplay || pageData.title) + ' \u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9');
      purchaseHtml += '<a class="an-product__notify-btn" href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + waMsg + '" target="_blank" rel="noopener">';
      purchaseHtml += '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.702-1.399A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.15 0-4.168-.665-5.828-1.8l-.244-.163-3.042.905.84-3.137-.17-.253A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>';
      purchaseHtml += '\u05D4\u05D5\u05D3\u05E2 \u05DC\u05D9 \u05DB\u05E9\u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9</a>';
    }

    /* Shipping */
    purchaseHtml += '<div class="an-product__shipping"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>\u05DE\u05E9\u05DC\u05D5\u05D7 \u05E2\u05D3 7 \u05D9\u05DE\u05D9 \u05E2\u05E1\u05E7\u05D9\u05DD | \u05D0\u05D9\u05E1\u05D5\u05E3 \u05E2\u05E6\u05DE\u05D9 \u05DE\u05E0\u05D4\u05E8\u05D9\u05D4</div>';

    /* Benefits */
    purchaseHtml += '<div class="an-product__benefits">';
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--warranty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><div>\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA 3 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD / 6,000 \u05E7"\u05DE<small>\u05DE\u05D5\u05EA\u05E0\u05D9\u05EA \u05D1\u05D4\u05EA\u05E7\u05E0\u05D4 \u05D1\u05DE\u05D5\u05E1\u05DA \u05DE\u05D5\u05E8\u05E9\u05D4</small></div></div>';
    if (brandFromData) {
      purchaseHtml += '<div class="an-product__benefit an-product__benefit--original"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>\u05DE\u05D5\u05E6\u05E8 \u05DE\u05E7\u05D5\u05E8\u05D9 ' + esc(brandFromData) + '</div>';
    }
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--secure"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>\u05EA\u05E9\u05DC\u05D5\u05DD \u05DE\u05D0\u05D5\u05D1\u05D8\u05D7</div>';
    purchaseHtml += '<div class="an-product__benefit an-product__benefit--installments"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05EA\u05E9\u05DC\u05D5\u05DE\u05D9\u05DD \u05D1\u05E7\u05D5\u05E4\u05D4</div>';
    purchaseHtml += '</div>';

    /* Subtitle — product type only (no article number, it's shown below) */
    var subtitle = '';
    if (D.product) subtitle = D.product;

    /* Build main product section */
    var html = '<div class="an-product" id="an-product-page">';

    /* Main 3-column grid */
    html += '<div class="an-product__main">';

    /* Column 3: Purchase (appears first in RTL flow but we use grid ordering) */
    html += '<div class="an-product__purchase">' + purchaseHtml + '</div>';

    /* Column 2: Info */
    html += '<div class="an-product__info">';
    html += '<h1 class="an-product__title">' + esc(pageData.title) + '</h1>';
    if (subtitle) html += '<div class="an-product__subtitle">' + esc(subtitle) + '</div>';
    if (brandFromData || articleDisplay) {
      html += '<div class="an-product__meta">';
      if (articleDisplay) html += '<span>\u05DE\u05E7"\u05D8: <strong>' + esc(articleDisplay) + '</strong></span>';
      if (brandFromData) html += '<span>\u05D9\u05E6\u05E8\u05DF: <strong>' + esc(brandFromData) + '</strong></span>';
      html += '</div>';
    }
    html += quickSpecsHtml;
    html += '</div>';

    /* Column 1: Image gallery with brand logo + thumbnails */
    html += '<div class="an-product__image-col">';

    /* Main image (brand logo overlaid inside) */
    html += '<div class="an-product__image" id="anMainImageWrap">';
    if (brandFromData) {
      html += '<div class="an-product__brand-logo">';
      html += '<span class="an-product__brand-logo-text">' + esc(brandFromData) + '</span>';
      html += '</div>';
    }
    if (pageData.imageUrl) html += '<img src="' + esc(pageData.imageUrl) + '" alt="' + esc(pageData.title) + '" id="anMainImage">';
    html += '</div>';

    /* Thumbnail strip (only if multiple images or youtube) */
    var allImages = pageData.imageUrls || (pageData.imageUrl ? [pageData.imageUrl] : []);
    var hasYT = pageData.youtubeId || false;
    if (allImages.length > 1 || hasYT) {
      html += '<div class="an-product__thumbs">';
      for (var ti = 0; ti < allImages.length; ti++) {
        html += '<div class="an-product__thumb' + (ti === 0 ? ' an-product__thumb--active' : '') + '" data-an-thumb-idx="' + ti + '" data-an-img="' + esc(allImages[ti]) + '">';
        html += '<img src="' + esc(allImages[ti]) + '" alt="">';
        html += '</div>';
      }
      if (hasYT) {
        html += '<div class="an-product__thumb an-product__thumb--video" data-an-thumb-idx="yt" data-an-yt="' + esc(pageData.youtubeId) + '"></div>';
      }
      html += '</div>';
    }

    html += '</div>'; /* end image-col */

    html += '</div>'; /* end main */

    /* Tabs section */
    var vehicleCount = D.vehicles.length;
    var oeCount = 0;
    var oeBrands = {};
    for (var oi = 0; oi < D.oe.length; oi++) {
      var brand = D.oe[oi].oemBrand || 'Other';
      if (!oeBrands[brand]) oeBrands[brand] = [];
      if (oeBrands[brand].indexOf(D.oe[oi].oemDisplayNo) === -1) {
        oeBrands[brand].push(D.oe[oi].oemDisplayNo);
        oeCount++;
      }
    }

    html += '<div class="an-product__tabs-section">';
    html += '<div class="an-product__tabs-nav">';
    html += '<button type="button" class="an-product__tab-btn an-product__tab-btn--active" data-tab="specs">\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</button>';
    html += '<button type="button" class="an-product__tab-btn" data-tab="vehicles">\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD</button>';
    html += '<button type="button" class="an-product__tab-btn" data-tab="oe">\u05DE\u05E1\u05E4\u05E8\u05D9 OE</button>';
    html += '</div>';

    /* Tab panels */
    /* Panel 1: Specs */
    html += '<div class="an-product__tab-panel an-product__tab-panel--active" data-panel="specs">';
    /* spec header removed per user request */

    /* Check if Fitting Position exists in TecDoc specs; if not, infer from product title */
    var hasFittingPos = false;
    for (var fp = 0; fp < D.specs.length; fp++) {
      if (D.specs[fp].criteriaName === 'Fitting Position') { hasFittingPos = true; break; }
    }
    if (!hasFittingPos && pageData.title) {
      var tLower = pageData.title;
      var posVal = '';
      if (/\u05E7\u05D3\u05DE\u05D9|\u05E7\u05D3\u05DE\u05D9\u05D5\u05EA|front/i.test(tLower)) posVal += '\u05E1\u05E8\u05DF \u05E7\u05D3\u05DE\u05D9';
      if (/\u05D0\u05D7\u05D5\u05E8\u05D9|\u05D0\u05D7\u05D5\u05E8\u05D9\u05D5\u05EA|rear/i.test(tLower)) posVal += (posVal ? ' / ' : '') + '\u05E1\u05E8\u05DF \u05D0\u05D7\u05D5\u05E8\u05D9';
      if (posVal) {
        D.specs.unshift({ criteriaName: 'Fitting Position', criteriaValue: posVal });
      }
    }

    var filteredSpecs = [];
    for (var fi = 0; fi < D.specs.length; fi++) {
      if (!EXCLUDE_SPECS[D.specs[fi].criteriaName] && !isZeroOrEmpty(D.specs[fi].criteriaValue)) {
        filteredSpecs.push(D.specs[fi]);
      }
    }

    if (filteredSpecs.length || articleDisplay || brandFromData) {
      html += '<table class="an-product__spec-table">';
      if (articleDisplay) html += '<tr><td>\u05DE\u05E7"\u05D8</td><td>' + esc(articleDisplay) + '</td></tr>';
      if (brandFromData) html += '<tr><td>\u05D9\u05E6\u05E8\u05DF</td><td>' + esc(brandFromData) + '</td></tr>';
      if (D.product) {
        var productHe = trProduct(D.product);
        var productDisplay = productHe ? productHe : D.product;
        html += '<tr><td>\u05E1\u05D5\u05D2 \u05DE\u05D5\u05E6\u05E8</td><td>' + esc(productDisplay) + '</td></tr>';
      }
      for (var si = 0; si < filteredSpecs.length; si++) {
        html += '<tr><td>' + esc(trSpec(filteredSpecs[si].criteriaName)) + '</td><td>' + esc(trVal(filteredSpecs[si].criteriaName, filteredSpecs[si].criteriaValue)) + '</td></tr>';
      }
      html += '</table>';
    } else {
      html += '<div style="text-align:center;color:#aaa;padding:24px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    }
    html += '</div>';

    /* Panel 2: Vehicles */
    html += '<div class="an-product__tab-panel" data-panel="vehicles">';
    if (!D.vehicles.length) {
      html += '<div style="text-align:center;color:#aaa;padding:40px 16px;font-size:16px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD \u05DC\u05D7\u05DC\u05E7 \u05D6\u05D4</div>';
    } else {
      html += renderVehicleAccordion(D.vehicles);
    }
    html += '</div>';

    /* Panel 3: OE Numbers */
    html += '<div class="an-product__tab-panel" data-panel="oe">';
    if (!D.oe.length) {
      html += '<div style="text-align:center;color:#aaa;padding:40px 16px;font-size:16px;">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      html += '<div class="an-product__oe-header">\u05DE\u05E1\u05E4\u05E8\u05D9 OE \u05DE\u05E7\u05D1\u05D9\u05DC\u05D9\u05DD \u05DC\u05DE\u05E1\u05E4\u05E8 \u05D7\u05DC\u05E7 \u05D4\u05D7\u05D9\u05DC\u05D5\u05E3 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:</div>';
      html += renderOeAccordion(oeBrands);
    }
    html += '</div>';

    html += '</div>'; /* end tabs-section */

    html += '<div style="text-align:center;font-size:10px;color:#bbb;padding:8px 0;">\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc\u00AE Catalogue</div>';
    html += '</div>'; /* end an-product */

    return html;
  }

  function renderVehicleAccordion(vehicles) {
    var tree = buildTree(vehicles);
    var totalCount = vehicles.length;
    var mfrCount = Object.keys(tree).length;
    var html = '';
    html += '<div class="tw-accordion" style="max-height:500px;">';
    var mKeys = Object.keys(tree).sort();
    for (var mk = 0; mk < mKeys.length; mk++) {
      var mfr = mKeys[mk], models = tree[mfr];
      var mfrHe = trMfr(mfr);
      var modelCount = Object.keys(models).length;
      html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(mfrHe) + '</span></div><div class="tw-acc-l1-body">';
      var mdKeys = Object.keys(models).sort();
      for (var mi = 0; mi < mdKeys.length; mi++) {
        var mn = mdKeys[mi], md = models[mn];
        var mnHe = trModel(mn);
        html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">' + esc(mnHe) + '</span>';
        if (md.years) html += '<span class="tw-acc-l2-years">' + esc(md.years) + '</span>';
        html += '</div><div class="tw-acc-l2-body">';
        for (var ei = 0; ei < md.engines.length; ei++) {
          var e = md.engines[ei];
          html += '<div class="tw-acc-l3"><span class="tw-acc-l3-engine">' + esc(e.name) + '</span>';
          if (e.engineCode) html += '<span class="tw-acc-l3-model-code">(' + esc(e.engineCode) + ')</span>';
          if (e.years) html += '<span class="tw-acc-l3-separator">|</span> <span class="tw-acc-l3-years">' + esc(e.years) + '</span>';
          html += '</div>';
        }
        html += '</div></div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderOeAccordion(oeBrands) {
    var html = '<div class="tw-accordion" style="margin-top:12px;max-height:400px;">';
    var bKeys = Object.keys(oeBrands).sort();
    for (var bi = 0; bi < bKeys.length; bi++) {
      var bn = bKeys[bi], nums = oeBrands[bn];
      html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(bn) + '</span><span class="tw-acc-l2-years">(' + nums.length + ')</span></div><div class="tw-acc-l1-body">';
      for (var ni = 0; ni < nums.length; ni++) {
        html += '<div class="tw-oe-acc-item"><span class="tw-oe-acc-num">' + esc(nums[ni]) + '</span></div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    html += '<div class="tw-oe-info">\u05DE\u05E1\u05E4\u05E8\u05D9 \u05D4-OE \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DC\u05D4\u05E9\u05D5\u05D5\u05D0\u05D4 \u05D1\u05DC\u05D1\u05D3. \u05D9\u05E9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1 \u05D4\u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05E8\u05DB\u05D9\u05E9\u05D4.</div>';
    return html;
  }

  /* ══════════════════════════════════════
     PRODUCT PAGE INJECTION
     ══════════════════════════════════════ */
  function injectProductPage(pageData) {
    var productHtml = renderProductPage(pageData);

    /* Find the layout_item wrapper (parent of #item_main) */
    var layoutItem = document.getElementById('layout_item');
    var itemMain = document.querySelector('#item_main');
    var insertTarget = layoutItem || (itemMain && itemMain.parentNode) || document.querySelector('#bg_middle');
    if (!insertTarget) return false;

    /* Remove loading skeleton if present */
    var skel = document.getElementById('an-product-skeleton');
    if (skel) skel.remove();

    /* Hide ALL original product sections (may already be hidden by skeleton phase) */
    hideOriginalProductPage();

    /* Create container */
    var container = document.createElement('div');
    container.id = 'an-product-container';
    container.innerHTML = productHtml;

    /* Insert as first child of layout_item */
    if (insertTarget.firstChild) {
      insertTarget.insertBefore(container, insertTarget.firstChild);
    } else {
      insertTarget.appendChild(container);
    }

    /* Bind tab interactions */
    bindTabs(container);
    bindAccordions(container);
    bindCartActions(pageData);
    bindImageLightbox(container);

    return true;
  }

  function bindImageLightbox(container) {
    var mainImg = container.querySelector('#anMainImage');
    var mainWrap = container.querySelector('#anMainImageWrap');

    /* Lightbox on main image click */
    if (mainImg) {
      mainImg.addEventListener('click', function() {
        /* Don't lightbox if currently showing video */
        if (mainWrap && mainWrap.querySelector('iframe')) return;
        openLightbox(mainImg.src, mainImg.alt);
      });
    }

    function openLightbox(src, alt) {
      var lb = document.createElement('div');
      lb.className = 'an-product__lightbox';
      var closeBtn = document.createElement('button');
      closeBtn.className = 'an-product__lightbox-close';
      closeBtn.innerHTML = '\u00D7';
      var bigImg = document.createElement('img');
      bigImg.src = src;
      bigImg.alt = alt || '';
      lb.appendChild(closeBtn);
      lb.appendChild(bigImg);
      document.body.appendChild(lb);
      setTimeout(function() { lb.classList.add('an-lb-visible'); }, 20);
      function closeLb() {
        lb.classList.remove('an-lb-visible');
        setTimeout(function() { lb.remove(); }, 300);
        document.removeEventListener('keydown', escHandler);
      }
      function escHandler(ev) { if (ev.key === 'Escape') closeLb(); }
      lb.addEventListener('click', function(ev) {
        if (ev.target !== bigImg) closeLb();
      });
      document.addEventListener('keydown', escHandler);
    }

    /* Thumbnail gallery interaction */
    var thumbs = container.querySelectorAll('.an-product__thumb');
    for (var i = 0; i < thumbs.length; i++) {
      thumbs[i].addEventListener('click', function() {
        /* Update active state */
        for (var j = 0; j < thumbs.length; j++) thumbs[j].classList.remove('an-product__thumb--active');
        this.classList.add('an-product__thumb--active');

        var imgUrl = this.getAttribute('data-an-img');
        var ytId = this.getAttribute('data-an-yt');

        if (ytId) {
          /* Show YouTube video */
          mainWrap.innerHTML = '<iframe class="an-product__video-frame" src="https://www.youtube.com/embed/' + ytId + '?rel=0" allowfullscreen allow="autoplay; encrypted-media"></iframe>';
        } else if (imgUrl && mainImg) {
          /* Remove any video iframe, restore image */
          var existingFrame = mainWrap.querySelector('iframe');
          if (existingFrame) {
            existingFrame.remove();
            if (!mainWrap.querySelector('img')) {
              var newImg = document.createElement('img');
              newImg.id = 'anMainImage';
              newImg.style.cssText = 'max-width:100%;max-height:400px;object-fit:contain;padding:8px;cursor:zoom-in;';
              newImg.addEventListener('click', function() { openLightbox(this.src, this.alt); });
              mainWrap.appendChild(newImg);
              mainImg = newImg;
            }
          }
          var curImg = mainWrap.querySelector('img');
          if (curImg) curImg.src = imgUrl;
        }
      });
    }
  }

  function bindTabs(container) {
    var tabs = container.querySelectorAll('.an-product__tab-btn');
    var panels = container.querySelectorAll('.an-product__tab-panel');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab');
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove('an-product__tab-btn--active');
        }
        this.classList.add('an-product__tab-btn--active');
        for (var k = 0; k < panels.length; k++) {
          if (panels[k].getAttribute('data-panel') === tabId) {
            panels[k].classList.add('an-product__tab-panel--active');
          } else {
            panels[k].classList.remove('an-product__tab-panel--active');
          }
        }
      });
    }
  }

  function bindCartActions(pageData) {
    /* Quantity +/- (exposed globally for onclick handlers) */
    window.anQtyChange = function(delta) {
      var input = document.getElementById('anQtyInput');
      if (!input) return;
      var val = parseInt(input.value) || 1;
      val = Math.max(1, Math.min(99, val + delta));
      input.value = val;
    };

    /* Add to cart — uses Konimbo's native find_id function */
    var addBtn = document.getElementById('anAddToCart');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        var qty = parseInt((document.getElementById('anQtyInput') || {}).value) || 1;
        if (typeof window.find_id === 'function') {
          /* find_id(id_item, title_item, price_item, img_item, quantity, quantity_step, upgrades) */
          var cartId = 'item_id_' + pageData.itemId;
          window.find_id(
            cartId,
            pageData.title,
            pageData.price,
            pageData.imageUrl,
            qty,
            1,
            ''
          );
        } else {
          /* Fallback: try Konimbo's add-to-cart form */
          var form = document.querySelector('form.add_to_cart_form') || document.querySelector('form[action*="cart"]');
          if (form) {
            var qtyInput = form.querySelector('input[name="quantity"]');
            if (qtyInput) qtyInput.value = qty;
            form.submit();
          }
        }
      });
    }
  }

  /* ══════════════════════════════════════
     ORIGINAL WIDGET RENDERING (non-product-page)
     Vertical sections: Description → Vehicles → OE
     ══════════════════════════════════════ */

  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;

    var itemContent = document.getElementById('item_content');
    if (itemContent) {
      var h3 = itemContent.querySelector('h3, #item_content_title');
      if (h3) h3.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
      var specContainer = itemContent.querySelector('.specifications');
      if (specContainer) { specContainer.innerHTML = ''; }
      var widget = document.createElement('div');
      widget.id = 'tecdoc-widget';
      if (specContainer) { specContainer.appendChild(widget); }
      else { itemContent.appendChild(widget); }
      return widget;
    }

    var specsDiv = document.querySelector('#item_specifications .specifications');
    if (specsDiv) {
      specsDiv.innerHTML = '';
      var widget2 = document.createElement('div');
      widget2.id = 'tecdoc-widget';
      specsDiv.appendChild(widget2);
      var header = document.querySelector('#item_specifications h3');
      if (header) header.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
      return widget2;
    }

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
        wh3.textContent = '\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD';
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
      '<div class="tw-loading-step">\u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05E0\u05D8\u05E2\u05E0\u05D9\u05DD \u05DE-TecDoc \u2014 \u05D0\u05E0\u05D0 \u05D4\u05DE\u05EA\u05D9\u05E0\u05D5</div></div>';
  }

  function showError(msg) {
    var w = getWidget(); if (!w) return;
    var parent = w.closest('#item_content, #item_specifications');
    if (parent) { parent.style.display = 'none'; }
    else { w.style.display = 'none'; }
  }

  /* Original vertical render (for non-product-page contexts) */
  function render() {
    var w = getWidget(); if (!w) return;
    var html = '';

    html += '<div class="tw-section tw-desc-section">';
    html += '<div class="tw-section-title">\u05EA\u05D9\u05D0\u05D5\u05E8</div>';
    if (!D.specs.length && !D.articleNo && !D.supplier && !D.ean) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E4\u05E8\u05D8\u05D9\u05DD \u05D8\u05DB\u05E0\u05D9\u05D9\u05DD</div>';
    } else {
      var allSpecs = [];
      for (var i = 0; i < D.specs.length; i++) {
        if (!EXCLUDE_SPECS[D.specs[i].criteriaName] && !isZeroOrEmpty(D.specs[i].criteriaValue)) {
          allSpecs.push({ name: trSpec(D.specs[i].criteriaName), value: trVal(D.specs[i].criteriaName, D.specs[i].criteriaValue) });
        }
      }
      if (D.articleNo) allSpecs.push({ name: '\u05DE\u05E7"\u05D8', value: D.articleNo });
      if (D.supplier) allSpecs.push({ name: '\u05D9\u05E6\u05E8\u05DF', value: D.supplier });

      var hasHidden = allSpecs.length > SPECS_VISIBLE;
      html += '<table class="tw-specs-table" id="tw-specs-tbl">';
      for (var si = 0; si < allSpecs.length; si++) {
        var cls = si >= SPECS_VISIBLE ? ' class="tw-spec-hidden"' : '';
        html += '<tr'+cls+'><td>'+esc(allSpecs[si].name)+':</td><td>'+esc(allSpecs[si].value)+'</td></tr>';
      }
      html += '</table>';

      if (hasHidden) {
        html += '<div class="tw-more-wrap"><button type="button" class="tw-more-btn" id="tw-more-toggle">\u05E2\u05D5\u05D3 <span class="tw-arrow">\u25BC</span></button></div>';
      }
    }
    html += '</div>';

    html += '<div class="tw-section tw-compat-section">';
    html += '<div class="tw-compat-header">';
    html += '<span class="tw-compat-icon">\uD83D\uDE97</span>';
    html += '<span class="tw-compat-title">\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1\u05D9\u05DD</span>';
    html += '</div>';

    if (!D.vehicles.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05E8\u05DB\u05D1\u05D9\u05DD \u05EA\u05D5\u05D0\u05DE\u05D9\u05DD</div>';
    } else {
      var tree = buildTree(D.vehicles);
      html += '<div class="tw-accordion">';
      var mKeys = Object.keys(tree).sort();
      for (var mk = 0; mk < mKeys.length; mk++) {
        var mfr = mKeys[mk], models = tree[mfr];
        var mfrHe = trMfr(mfr);
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(mfrHe) + '</span></div><div class="tw-acc-l1-body">';
        var mdKeys = Object.keys(models).sort();
        for (var mi = 0; mi < mdKeys.length; mi++) {
          var mn = mdKeys[mi], md = models[mn];
          var mnHe = trModel(mn);
          html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">' + esc(mnHe) + '</span>';
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

    html += '<div class="tw-section tw-oe-section">';
    html += '<div class="tw-oe-header">';
    html += '<div class="tw-oe-title">\u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    html += '<div class="tw-oe-subtitle">\u05DE\u05E1\u05E4\u05E8\u05D9 OE \u05DE\u05E7\u05D1\u05D9\u05DC\u05D9\u05DD \u05DC\u05DE\u05E1\u05E4\u05E8 \u05D7\u05DC\u05E7 \u05D4\u05D7\u05D9\u05DC\u05D5\u05E3 \u05D4\u05DE\u05E7\u05D5\u05E8\u05D9:</div>';
    html += '</div>';

    if (!D.oe.length) {
      html += '<div class="tw-empty">\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05DE\u05E1\u05E4\u05E8\u05D9 OE</div>';
    } else {
      var byBrand = {};
      for (var oi = 0; oi < D.oe.length; oi++) {
        var o = D.oe[oi], brnd = o.oemBrand || 'Other';
        if (!byBrand[brnd]) byBrand[brnd] = [];
        if (byBrand[brnd].indexOf(o.oemDisplayNo) === -1) byBrand[brnd].push(o.oemDisplayNo);
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
      html += '<div class="tw-oe-info">\u05DE\u05E1\u05E4\u05E8\u05D9 \u05D4-OE \u05DE\u05E9\u05DE\u05E9\u05D9\u05DD \u05DC\u05D4\u05E9\u05D5\u05D5\u05D0\u05D4 \u05D1\u05DC\u05D1\u05D3. \u05D9\u05E9 \u05DC\u05D5\u05D5\u05D3\u05D0 \u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05E8\u05DB\u05D1 \u05D4\u05E1\u05E4\u05E6\u05D9\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9 \u05E8\u05DB\u05D9\u05E9\u05D4.</div>';
    }
    html += '</div>';

    html += '<div class="tw-footer"><span>\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc\u00AE Catalogue</span></div>';

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
      tree[mfr][model].engines.push({ name: v.typeEngineName || '', years: yr, engineCode: v.engineCode || '' });
    }
    Object.keys(tree).forEach(function(m) {
      Object.keys(tree[m]).forEach(function(md) {
        var d = tree[m][md], s = fmtDate(d.ys), e = fmtDate(d.ye);
        if (s || e) d.years = (s || '?') + ' - ' + (e || '?');
      });
    });
    return tree;
  }

  function bindAccordions(container) {
    var hs = container.querySelectorAll('.tw-acc-l1-header,.tw-acc-l2-header');
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

  /* ══════════════════════════════════════
     CACHE + API LOADING (unchanged)
     ══════════════════════════════════════ */

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

  var PREFERRED_BRANDS = ['BOSCH','MANN-FILTER','MAHLE','HENGST FILTER','BREMBO','TRW','SACHS','VALEO','DENSO','NGK','SKF','FEBI BILSTEIN','MEYLE','OPTIMAL','MAPCO','JAPANPARTS','BLUE PRINT','ASHIKA','JAPKO','FILTRON','KNECHT','PURFLUX','CHAMPION','MOOG'];

  function loadFromAPI(articleNo) {
    if (!API_URL) return Promise.reject('no_token');
    var variations = articleVariations(articleNo);

    function tryVariation(idx) {
      if (idx >= variations.length) return Promise.reject('no_results');
      return api({
        endpoint_partsCompatibleVehiclesByArticleNo: true,
        parts_articleNo_20: variations[idx],
        parts_langId_20: 43, parts_countryFilterId_20: 120, parts_typeId_20: 1
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
        parts_langId_29: 43
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
              parts_langId_20: 43, parts_countryFilterId_20: 120, parts_typeId_20: 1
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
      return api({ endpoint_partsArticleDetailsByArticleId:true, parts_articleId_13:a.articleId, parts_langId_13:43 })
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

  function applyData(data) {
    D.articleNo = data.articleNo || '';
    D.articleId = data.articleId || null;
    D.supplier = data.supplier || '';
    D.product = data.product || '';
    D.ean = data.ean || '';
    D.specs = data.specs || [];
    D.vehicles = data.vehicles || [];
    D.oe = data.oe || [];
  }

  /* ── Immediately hide original Konimbo product page ── */
  function hideOriginalProductPage() {
    var hideSelectors = ['#item_main', '#item_info', '#item_show_facebook', '#item_group1'];
    for (var hi = 0; hi < hideSelectors.length; hi++) {
      var els = document.querySelectorAll(hideSelectors[hi]);
      for (var hj = 0; hj < els.length; hj++) {
        els[hj].style.display = 'none';
      }
    }
  }

  /* ── Show loading skeleton while TecDoc data loads ── */
  function showProductSkeleton(pageData) {
    var layoutItem = document.getElementById('layout_item');
    var itemMain = document.querySelector('#item_main');
    var insertTarget = layoutItem || (itemMain && itemMain.parentNode) || document.querySelector('#bg_middle');
    if (!insertTarget) return;

    /* Remove previous skeleton if any */
    var prev = document.getElementById('an-product-skeleton');
    if (prev) prev.remove();

    var skel = document.createElement('div');
    skel.id = 'an-product-skeleton';
    skel.innerHTML = '<div class="an-product" style="opacity:1;">' +
      '<div class="an-product__main">' +
      '<div class="an-product__purchase" style="padding:24px;">' +
      '<div class="an-skel-block" style="width:60%;height:20px;margin-bottom:12px;"></div>' +
      '<div class="an-skel-block" style="width:40%;height:36px;margin-bottom:16px;"></div>' +
      '<div class="an-skel-block" style="width:100%;height:48px;border-radius:10px;margin-bottom:12px;"></div>' +
      '<div class="an-skel-block" style="width:80%;height:14px;margin-bottom:8px;"></div>' +
      '<div class="an-skel-block" style="width:70%;height:14px;margin-bottom:8px;"></div>' +
      '<div class="an-skel-block" style="width:60%;height:14px;"></div>' +
      '</div>' +
      '<div class="an-product__info" style="padding:24px;">' +
      '<div class="an-skel-block" style="width:80%;height:22px;margin-bottom:10px;"></div>' +
      '<div class="an-skel-block" style="width:50%;height:14px;margin-bottom:20px;"></div>' +
      '<div class="an-skel-block" style="width:100%;height:120px;border-radius:8px;"></div>' +
      '</div>' +
      '<div class="an-product__image-col">' +
      '<div class="an-product__image" style="min-height:200px;display:flex;align-items:center;justify-content:center;">' +
      (pageData.imageUrl ? '<img src="' + esc(pageData.imageUrl) + '" alt="" style="max-height:200px;opacity:0.6;">' : '<div class="an-skel-block" style="width:70%;height:180px;border-radius:8px;"></div>') +
      '</div></div>' +
      '</div>' +
      '<div style="padding:20px;text-align:center;color:#9ca3af;font-size:13px;font-family:Heebo,sans-serif;">\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u05DE-TecDoc...</div>' +
      '</div>';

    if (insertTarget.firstChild) {
      insertTarget.insertBefore(skel, insertTarget.firstChild);
    } else {
      insertTarget.appendChild(skel);
    }
  }

  /* ══════════════════════════════════════
     MAIN INIT
     ══════════════════════════════════════ */
  function init() {
    if (window._tecdocInitDone) return; window._tecdocInitDone = true;
    console.log('[TecDoc] init() called, readyState:', document.readyState);
    if (!document.getElementById('tecdoc-widget') && !isAutoPartsPage()) {
      console.log('[TecDoc] Not an auto parts page, exiting');
      return;
    }

    var articleNo = detectArticleNo();
    console.log('[TecDoc] articleNo:', articleNo);
    if (!articleNo) return;

    /* Check if we're on a product page (has price) */
    var pageData = getProductPageData();
    var isProductPage = !!pageData;
    console.log('[TecDoc] isProductPage:', isProductPage, pageData ? 'title=' + pageData.title : '');

    if (!isProductPage) {
      /* Category/results page — use original widget */
      var w = getOrCreateWidget();
      if (!w) return;
      showLoading('\u05D8\u05D5\u05E2\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD...', 30);
    } else {
      /* Product page — immediately hide original and show loading skeleton */
      hideOriginalProductPage();
      showProductSkeleton(pageData);
    }

    loadFromCache(articleNo)
      .then(function(data) {
        applyData(data);
        if (isProductPage) {
          injectProductPage(pageData);
        } else {
          render();
        }
      })
      .catch(function() {
        if (!isProductPage) {
          showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
        }
        return loadFromAPI(articleNo)
          .then(function(data) {
            applyData(data);
            if (isProductPage) {
              injectProductPage(pageData);
            } else {
              render();
            }
          })
          .catch(function(err) {
            if (!isProductPage) {
              if (err === 'no_results') {
                showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
              } else {
                showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
              }
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
      .then(function(data) { applyData(data); render(); })
      .catch(function() {
        showLoading('\u05DE\u05D7\u05E4\u05E9 \u05D1\u05E7\u05D8\u05DC\u05D5\u05D2 TecDoc...', 20);
        return loadFromAPI(articleNo.trim())
          .then(function(data) { applyData(data); render(); })
          .catch(function(err) {
            if (err === 'no_results') showError('\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E2\u05D1\u05D5\u05E8 \u05DE\u05E1\u05E4\u05E8 \u05E7\u05D8\u05DC\u05D5\u05D2\u05D9: ' + articleNo);
            else showError('\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E0\u05EA\u05D5\u05E0\u05D9\u05DD.');
          });
      });
  };

  /* Handle both early and late loading */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    /* DOM already ready — script was loaded dynamically after DOMContentLoaded */
    init();
  }

  /* ══════════════════════════════════════
     OE SEARCH ENHANCEMENT
     Adds OE number search to both desktop and mobile search bars.
     Loads oe-search-index.json from GitHub Pages.
     ══════════════════════════════════════ */
  var OE_INDEX = null;
  var OE_INDEX_URL = BASE_URL + '/data/oe-search-index.json';

  function loadOEIndex() {
    if (OE_INDEX) return Promise.resolve(OE_INDEX);
    return fetch(OE_INDEX_URL).then(function(r) {
      if (!r.ok) throw new Error('OE index not found');
      return r.json();
    }).then(function(data) {
      OE_INDEX = data;
      console.log('[TecDoc] OE search index loaded:', Object.keys(data).length, 'entries');
      return data;
    }).catch(function(e) {
      console.log('[TecDoc] OE index load failed:', e.message);
      OE_INDEX = {};
      return OE_INDEX;
    });
  }

  function searchOE(query) {
    if (!OE_INDEX || !query || query.length < 3) return [];
    var norm = query.replace(/[\s\-]/g, '').toUpperCase();
    var results = [];
    var keys = Object.keys(OE_INDEX);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(norm) !== -1) {
        var entries = OE_INDEX[keys[i]];
        for (var j = 0; j < entries.length; j++) {
          var dup = false;
          for (var r = 0; r < results.length; r++) {
            if (results[r].a === entries[j].a) { dup = true; break; }
          }
          if (!dup) {
            results.push(entries[j]);
          }
        }
      }
      if (results.length >= 8) break;
    }
    return results;
  }

  /* Build a Konimbo product URL from article number */
  function buildProductSearchUrl(articleNo) {
    return '/search/?q=' + encodeURIComponent(articleNo);
  }

  /* ── OE search dropdown UI ── */
  function createOEDropdown(inputEl) {
    var existing = inputEl.parentNode.querySelector('.an-oe-dropdown');
    if (existing) return existing;
    var dd = document.createElement('div');
    dd.className = 'an-oe-dropdown';
    dd.style.cssText = 'position:absolute;left:0;right:0;top:100%;z-index:999999;' +
      'background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;' +
      'box-shadow:0 8px 24px rgba(0,0,0,0.12);max-height:400px;overflow-y:auto;display:none;' +
      'font-family:Heebo,sans-serif;direction:rtl;';
    /* Make parent positioned */
    var parent = inputEl.parentNode;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(dd);
    return dd;
  }

  function renderOEResults(dropdown, results, query) {
    if (!results.length) {
      dropdown.style.display = 'none';
      return;
    }
    var html = '<div style="padding:8px 14px;font-size:11px;color:#9ca3af;border-bottom:1px solid #f0f0f0;">' +
      '\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05DC\u05E4\u05D9 \u05DE\u05E1\u05E4\u05E8 OE: ' + esc(query) + '</div>';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var productHe = trProduct(r.p);
      var label = (productHe || r.p) + ' ' + r.s + ' ' + r.a;
      html += '<a href="/search/?q=' + encodeURIComponent(r.a) + '" ' +
        'style="display:flex;align-items:center;gap:10px;padding:10px 14px;' +
        'text-decoration:none;color:#1a2332;border-bottom:1px solid #f5f5f5;' +
        'transition:background 0.15s;font-size:13px;" ' +
        'onmouseover="this.style.background=\'#f0f7ff\'" onmouseout="this.style.background=\'#fff\'">' +
        '<div style="flex:1;">' +
        '<div style="font-weight:500;">' + esc(label) + '</div>' +
        '<div style="font-size:11px;color:#329FDA;">OE: ' + esc(r.d) + ' (' + esc(r.b) + ')</div>' +
        '</div>' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#329FDA" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>' +
        '</a>';
    }
    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  }

  function enhanceSearch() {
    loadOEIndex().then(function() {
      /* ── Desktop: enhance existing jQuery UI autocomplete on #q ── */
      var desktopInput = document.getElementById('q');
      if (desktopInput) {
        var desktopDD = createOEDropdown(desktopInput);
        var debounceTimer = null;
        desktopInput.addEventListener('input', function() {
          clearTimeout(debounceTimer);
          var val = desktopInput.value.trim();
          debounceTimer = setTimeout(function() {
            var results = searchOE(val);
            if (results.length > 0) {
              renderOEResults(desktopDD, results, val);
            } else {
              desktopDD.style.display = 'none';
            }
          }, 300);
        });
        desktopInput.addEventListener('blur', function() {
          setTimeout(function() { desktopDD.style.display = 'none'; }, 200);
        });
        desktopInput.addEventListener('focus', function() {
          var val = desktopInput.value.trim();
          if (val.length >= 3) {
            var results = searchOE(val);
            if (results.length > 0) renderOEResults(desktopDD, results, val);
          }
        });
      }

      /* ── Mobile: add autocomplete to #nah-search-bar ── */
      var mobileBar = document.getElementById('nah-search-bar');
      if (mobileBar) {
        var mobileInput = mobileBar.querySelector('input[type="text"]');
        if (mobileInput) {
          var mobileDD = createOEDropdown(mobileInput);
          /* Also make nah-search-bar itself positioned for dropdown */
          mobileBar.style.position = 'relative';
          mobileBar.style.zIndex = '9999';
          var mTimer = null;

          function doMobileSearch(val) {
            if (!val || val.length < 2) {
              mobileDD.style.display = 'none';
              return;
            }
            /* First check OE results */
            var oeResults = searchOE(val);

            /* Also fetch Konimbo autocomplete */
            fetch('/auto_complete?term=' + encodeURIComponent(val))
              .then(function(r) { return r.ok ? r.json() : []; })
              .catch(function() { return []; })
              .then(function(konimboResults) {
                var html = '';

                /* Konimbo results */
                if (konimboResults && konimboResults.length) {
                  for (var k = 0; k < konimboResults.length; k++) {
                    var item = konimboResults[k];
                    var itemLabel = typeof item === 'string' ? item : (item.label || item.value || '');
                    var itemUrl = typeof item === 'object' && item.url ? item.url : '/search/?q=' + encodeURIComponent(itemLabel);
                    var itemImg = typeof item === 'object' && item.image ? item.image : '';
                    html += '<a href="' + esc(itemUrl) + '" ' +
                      'style="display:flex;align-items:center;gap:10px;padding:10px 14px;' +
                      'text-decoration:none;color:#1a2332;border-bottom:1px solid #f5f5f5;' +
                      'transition:background 0.15s;font-size:13px;" ' +
                      'onmouseover="this.style.background=\'#f0f7ff\'" onmouseout="this.style.background=\'#fff\'">';
                    if (itemImg) {
                      html += '<img src="' + esc(itemImg) + '" style="width:40px;height:40px;object-fit:contain;border-radius:4px;" alt="">';
                    }
                    html += '<div style="flex:1;font-weight:500;">' + esc(itemLabel) + '</div>';
                    html += '</a>';
                  }
                }

                /* OE results */
                if (oeResults.length) {
                  html += '<div style="padding:8px 14px;font-size:11px;color:#9ca3af;border-bottom:1px solid #f0f0f0;' +
                    'border-top:1px solid #e5e7eb;background:#fafbfc;">' +
                    '\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05DC\u05E4\u05D9 \u05DE\u05E1\u05E4\u05E8 OE</div>';
                  for (var oi = 0; oi < oeResults.length; oi++) {
                    var r = oeResults[oi];
                    var pHe = trProduct(r.p);
                    var lbl = (pHe || r.p) + ' ' + r.s + ' ' + r.a;
                    html += '<a href="/search/?q=' + encodeURIComponent(r.a) + '" ' +
                      'style="display:flex;align-items:center;gap:10px;padding:10px 14px;' +
                      'text-decoration:none;color:#1a2332;border-bottom:1px solid #f5f5f5;' +
                      'transition:background 0.15s;font-size:13px;" ' +
                      'onmouseover="this.style.background=\'#f0f7ff\'" onmouseout="this.style.background=\'#fff\'">' +
                      '<div style="flex:1;">' +
                      '<div style="font-weight:500;">' + esc(lbl) + '</div>' +
                      '<div style="font-size:11px;color:#329FDA;">OE: ' + esc(r.d) + ' (' + esc(r.b) + ')</div>' +
                      '</div>' +
                      '</a>';
                  }
                }

                /* "See all results" link */
                if (html) {
                  html += '<a href="/search/?q=' + encodeURIComponent(val) + '" ' +
                    'style="display:block;padding:10px 14px;text-align:center;color:#329FDA;' +
                    'font-size:13px;font-weight:500;text-decoration:none;border-top:1px solid #e5e7eb;' +
                    'background:#fafbfc;">\u05DC\u05DB\u05DC \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA..</a>';
                }

                if (html) {
                  mobileDD.innerHTML = html;
                  mobileDD.style.display = 'block';
                } else {
                  mobileDD.style.display = 'none';
                }
              });
          }

          mobileInput.addEventListener('input', function() {
            clearTimeout(mTimer);
            var val = mobileInput.value.trim();
            mTimer = setTimeout(function() { doMobileSearch(val); }, 400);
          });
          mobileInput.addEventListener('focus', function() {
            var val = mobileInput.value.trim();
            if (val.length >= 2) doMobileSearch(val);
          });
          /* Close on tap outside */
          document.addEventListener('click', function(e) {
            if (!mobileBar.contains(e.target)) {
              mobileDD.style.display = 'none';
            }
          });
        }
      }
    });
  }

  /* Init search enhancement when DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceSearch);
  } else {
    enhanceSearch();
  }
})();

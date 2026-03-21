/* TecDoc Widget v11.1 — Tab Layout + Full Cache + OEM Fallback + Hide supplier for filters + Page cleanup + Hebrew product names + Strengths/USP + Custom Purchase Area
   Changes in v11.1: Hide old Konimbo +/- qty box aggressively. Out-of-stock detection with red indicator + WhatsApp CTA. Hide duplicate stock indicators. Stock above price.
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

  /* Specs to HIDE from consumers (technical/catalog data not useful for private buyer) */
  var HIDDEN_SPECS = [
    'WVA Number', 'Supplementary Article/Supplementary Info',
    'Supplementary Article/Info 2', 'Supplementary Article/Info',
    'for PR number', 'Check Character', 'MAPP',
    'Packaging length [cm]', 'Packaging width [cm]', 'Packaging height [cm]',
    'Net Weight [g]', 'Fitting time [min.]', 'Packing Type',
    'Quantity Unit', 'EAN number'
  ];

  /* Specs to show FIRST (priority order) — Fitting Position at the top */
  var PRIORITY_SPECS = ['Fitting Position'];

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

  /* ── Vehicle brand/model Hebrew translations ── */
  var BRAND_TR = {
    'ALFA ROMEO':'\u05D0\u05DC\u05E4\u05D0 \u05E8\u05D5\u05DE\u05D0\u05D5','AUDI':'\u05D0\u05D5\u05D3\u05D9',
    'BMW':'\u05D1\u05D9.\u05D0\u05DE.\u05D3\u05D1\u05DC\u05D5','CHEVROLET':'\u05E9\u05D1\u05E8\u05D5\u05DC\u05D8',
    'CHRYSLER':'\u05E7\u05E8\u05D9\u05D9\u05D6\u05DC\u05E8','CITROEN':'\u05E1\u05D9\u05D8\u05E8\u05D5\u05D0\u05DF',
    'CUPRA':'\u05E7\u05D5\u05E4\u05E8\u05D0','DACIA':'\u05D3\u05D0\u05E6\u05F3\u05D9\u05D4',
    'DAEWOO':'\u05D3\u05D0\u05D5\u05D5','DS':'DS','FIAT':'\u05E4\u05D9\u05D0\u05D8',
    'FORD':'\u05E4\u05D5\u05E8\u05D3','HONDA':'\u05D4\u05D5\u05E0\u05D3\u05D4',
    'HYUNDAI':'\u05D9\u05D5\u05E0\u05D3\u05D0\u05D9','INFINITI':'\u05D0\u05D9\u05E0\u05E4\u05D9\u05E0\u05D9\u05D8\u05D9',
    'ISUZU':'\u05D0\u05D9\u05E1\u05D5\u05D6\u05D5','JAGUAR':'\u05D9\u05D2\u05D5\u05D0\u05E8',
    'JEEP':'\u05D2\u05F3\u05D9\u05E4','KIA':'\u05E7\u05D9\u05D4',
    'LANCIA':'\u05DC\u05E0\u05E6\u05F3\u05D9\u05D4','LAND ROVER':'\u05DC\u05E0\u05D3 \u05E8\u05D5\u05D1\u05E8',
    'LEXUS':'\u05DC\u05E7\u05E1\u05D5\u05E1','MAZDA':'\u05DE\u05D0\u05D6\u05D3\u05D4',
    'MERCEDES-BENZ':'\u05DE\u05E8\u05E6\u05D3\u05E1','MINI':'\u05DE\u05D9\u05E0\u05D9',
    'MITSUBISHI':'\u05DE\u05D9\u05E6\u05D5\u05D1\u05D9\u05E9\u05D9','NISSAN':'\u05E0\u05D9\u05E1\u05DF',
    'OPEL':'\u05D0\u05D5\u05E4\u05DC','PEUGEOT':'\u05E4\u05D9\u05D6\u05F3\u05D5',
    'PORSCHE':'\u05E4\u05D5\u05E8\u05E9\u05D4','RENAULT':'\u05E8\u05E0\u05D5',
    'SEAT':'\u05E1\u05D9\u05D0\u05D8','SKODA':'\u05E1\u05E7\u05D5\u05D3\u05D4',
    'SMART':'\u05E1\u05DE\u05D0\u05E8\u05D8','SSANGYONG':'\u05E1\u05D0\u05E0\u05D2\u05D9\u05D5\u05E0\u05D2',
    'SUBARU':'\u05E1\u05D5\u05D1\u05D0\u05E8\u05D5','SUZUKI':'\u05E1\u05D5\u05D6\u05D5\u05E7\u05D9',
    'TESLA':'\u05D8\u05E1\u05DC\u05D4','TOYOTA':'\u05D8\u05D5\u05D9\u05D5\u05D8\u05D4',
    'VOLKSWAGEN':'\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF','VW':'\u05E4\u05D5\u05DC\u05E7\u05E1\u05D5\u05D5\u05D2\u05DF',
    'VOLVO':'\u05D5\u05D5\u05DC\u05D5\u05D5'
  };
  /* ── Vehicle sub-type Hebrew translations ── */
  var MODEL_PART_TR = {
    'Variant': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Estate': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Touring': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Sportback': '\u05E1\u05E4\u05D5\u05E8\u05D8\u05D1\u05E7',
    'Convertible': '\u05E7\u05D1\u05E8\u05D9\u05D5\u05DC\u05D8',
    'Cabriolet': '\u05E7\u05D1\u05E8\u05D9\u05D5\u05DC\u05D8',
    'Roadster': '\u05E8\u05D5\u05D3\u05E1\u05D8\u05E8',
    'Limousine': '\u05E1\u05D3\u05D0\u05DF',
    'Saloon': '\u05E1\u05D3\u05D0\u05DF',
    'Sedan': '\u05E1\u05D3\u05D0\u05DF',
    'Hatchback': '\u05D4\u05D0\u05E6\u05F3\u05D1\u05E7',
    'Coupe': '\u05E7\u05D5\u05E4\u05D4',
    'SUV': 'SUV',
    'Van': '\u05DE\u05E1\u05D7\u05E8\u05D9',
    'Combi': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Sportstourer': '\u05E1\u05E4\u05D5\u05E8\u05D8\u05D8\u05D5\u05E8\u05E8',
    'Allstreet': '\u05D0\u05D5\u05DC\u05E1\u05D8\u05E8\u05D9\u05D8',
    'Alltrack': '\u05D0\u05D5\u05DC\u05D8\u05E8\u05E7',
    'Shooting Brake': '\u05E9\u05D5\u05D8\u05D9\u05E0\u05D2 \u05D1\u05E8\u05D9\u05D9\u05E7',
    'Sportwagon': '\u05E1\u05E4\u05D5\u05E8\u05D8\u05D5\u05D5\u05D0\u05D2\u05D5\u05DF',
    'Break': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Station Wagon': '\u05E1\u05D8\u05D9\u05D9\u05E9\u05DF',
    'Avant': '\u05D0\u05D5\u05D5\u05D0\u05E0\u05D8',
    'Wagon': '\u05E7\u05D5\u05DE\u05D1\u05D9',
    'Gran Turismo': '\u05D2\u05E8\u05DF \u05D8\u05D5\u05E8\u05D9\u05D6\u05DE\u05D5',
    'Cross': '\u05E7\u05E8\u05D5\u05E1',
    'MPV': 'MPV',
    'Compact': '\u05E7\u05D5\u05DE\u05E4\u05E7\u05D8',
    'Pickup': '\u05D8\u05E0\u05D3\u05E8'
  };

  /* ── Car model name Hebrew translations (popular models in Israel) ── */
  var MODEL_NAME_TR = {
    /* VW */
    'GOLF':'\u05D2\u05D5\u05DC\u05E3','TIGUAN':'\u05D8\u05D9\u05D2\u05D5\u05D0\u05DF','PASSAT':'\u05E4\u05E1\u05D0\u05D8',
    'POLO':'\u05E4\u05D5\u05DC\u05D5','TOURAN':'\u05D8\u05D5\u05E8\u05D0\u05DF','ARTEON':'\u05D0\u05E8\u05D8\u05D9\u05D0\u05D5\u05DF',
    'JETTA':'\u05D2\u05F3\u05D8\u05D4','T-ROC':'\u05D8\u05D9-\u05E8\u05D5\u05E7','T-CROSS':'\u05D8\u05D9-\u05E7\u05E8\u05D5\u05E1',
    'TAOS':'\u05D8\u05D0\u05D5\u05E1','CADDY':'\u05E7\u05D0\u05D3\u05D9','TRANSPORTER':'\u05D8\u05E8\u05E0\u05E1\u05E4\u05D5\u05E8\u05D8\u05E8',
    'UP':'\u05D0\u05E4','CC':'CC','ID.3':'ID.3','ID.4':'ID.4','ID.5':'ID.5',
    'SHARAN':'\u05E9\u05D0\u05E8\u05DF','SCIROCCO':'\u05E1\u05D9\u05E8\u05D5\u05E7\u05D5',
    'TARRACO':'\u05D8\u05D0\u05E8\u05E7\u05D5','TAYRON':'\u05D8\u05D9\u05D9\u05E8\u05D5\u05DF',
    'LAVIDA':'\u05DC\u05D0\u05D5\u05D9\u05D3\u05D4','THARU':'\u05EA\u05D0\u05E8\u05D5','MAGOTAN':'\u05DE\u05D0\u05D2\u05D5\u05D8\u05DF',
    'SPORTSVAN':'\u05E1\u05E4\u05D5\u05E8\u05D8\u05E1\u05D5\u05D5\u05D0\u05DF',
    /* SKODA */
    'OCTAVIA':'\u05D0\u05D5\u05E7\u05D8\u05D1\u05D9\u05D4','KAROQ':'\u05E7\u05D0\u05E8\u05D5\u05E7','KODIAQ':'\u05E7\u05D5\u05D3\u05D9\u05D0\u05E7',
    'SUPERB':'\u05E1\u05D5\u05E4\u05E8\u05D1','FABIA':'\u05E4\u05D0\u05D1\u05D9\u05D4','RAPID':'\u05E8\u05E4\u05D9\u05D3',
    'SCALA':'\u05E1\u05E7\u05D0\u05DC\u05D4','KAMIQ':'\u05E7\u05DE\u05D9\u05E7','ENYAQ':'\u05D0\u05E0\u05D9\u05D0\u05E7',
    'YETI':'\u05D9\u05D8\u05D9','ROOMSTER':'\u05E8\u05D5\u05DE\u05E1\u05D8\u05E8',
    /* SEAT / CUPRA */
    'LEON':'\u05DC\u05D9\u05D0\u05D5\u05DF','IBIZA':'\u05D0\u05D9\u05D1\u05D9\u05D6\u05D4','ATECA':'\u05D0\u05D8\u05E7\u05D4',
    'ARONA':'\u05D0\u05E8\u05D5\u05E0\u05D4','FORMENTOR':'\u05E4\u05D5\u05E8\u05DE\u05E0\u05D8\u05D5\u05E8',
    'ALHAMBRA':'\u05D0\u05DC\u05D4\u05DE\u05D1\u05E8\u05D4','TOLEDO':'\u05D8\u05D5\u05DC\u05D3\u05D5',
    /* AUDI */
    'A1':'A1','A3':'A3','A3L':'A3L','A4':'A4','A5':'A5','A6':'A6','A7':'A7','A8':'A8',
    'Q2':'Q2','Q3':'Q3','Q5':'Q5','Q7':'Q7','Q8':'Q8',
    'TT':'TT','R8':'R8','E-TRON':'E-TRON',
    /* BMW */
    '1 SERIES':'\u05E1\u05D3\u05E8\u05D4 1','2 SERIES':'\u05E1\u05D3\u05E8\u05D4 2','3 SERIES':'\u05E1\u05D3\u05E8\u05D4 3',
    '4 SERIES':'\u05E1\u05D3\u05E8\u05D4 4','5 SERIES':'\u05E1\u05D3\u05E8\u05D4 5','6 SERIES':'\u05E1\u05D3\u05E8\u05D4 6',
    '7 SERIES':'\u05E1\u05D3\u05E8\u05D4 7','8 SERIES':'\u05E1\u05D3\u05E8\u05D4 8',
    'X1':'X1','X2':'X2','X3':'X3','X4':'X4','X5':'X5','X6':'X6','X7':'X7',
    'Z4':'Z4','I3':'I3','IX':'IX','IX3':'IX3',
    /* Mercedes */
    'A-CLASS':'\u05DE\u05D7\u05DC\u05E7\u05EA A','B-CLASS':'\u05DE\u05D7\u05DC\u05E7\u05EA B','C-CLASS':'\u05DE\u05D7\u05DC\u05E7\u05EA C',
    'E-CLASS':'\u05DE\u05D7\u05DC\u05E7\u05EA E','S-CLASS':'\u05DE\u05D7\u05DC\u05E7\u05EA S',
    'CLA':'CLA','CLS':'CLS','GLA':'GLA','GLB':'GLB','GLC':'GLC','GLE':'GLE','GLS':'GLS',
    'VITO':'\u05D5\u05D9\u05D8\u05D5','SPRINTER':'\u05E1\u05E4\u05E8\u05D9\u05E0\u05D8\u05E8',
    /* Toyota */
    'COROLLA':'\u05E7\u05D5\u05E8\u05D5\u05DC\u05D4','CAMRY':'\u05E7\u05DE\u05E8\u05D9','RAV4':'RAV4','RAV 4':'RAV4',
    'YARIS':'\u05D9\u05D0\u05E8\u05D9\u05E1','AYGO':'\u05D0\u05D9\u05D2\u05D5','C-HR':'C-HR',
    'LAND CRUISER':'\u05DC\u05E0\u05D3 \u05E7\u05E8\u05D5\u05D6\u05E8','HILUX':'\u05D4\u05D9\u05DC\u05D5\u05E7\u05E1',
    'PRIUS':'\u05E4\u05E8\u05D9\u05D5\u05E1','AVENSIS':'\u05D0\u05D1\u05E0\u05E1\u05D9\u05E1','AURIS':'\u05D0\u05D5\u05E8\u05D9\u05E1',
    /* Hyundai */
    'TUCSON':'\u05D8\u05D5\u05E1\u05D5\u05DF','I10':'I10','I20':'I20','I30':'I30','I40':'I40',
    'KONA':'\u05E7\u05D5\u05E0\u05D4','IONIQ':'\u05D0\u05D9\u05D5\u05E0\u05D9\u05E7','SANTA FE':'\u05E1\u05E0\u05D8\u05D4 \u05E4\u05D4',
    'ELANTRA':'\u05D0\u05DC\u05E0\u05D8\u05E8\u05D4','ACCENT':'\u05D0\u05E7\u05E1\u05E0\u05D8','GETZ':'\u05D2\u05D8\u05E1',
    'CRETA':'\u05E7\u05E8\u05D8\u05D4','BAYON':'\u05D1\u05D0\u05D9\u05D5\u05DF','VENUE':'\u05D5\u05E0\u05D9\u05D5',
    /* Kia */
    'SPORTAGE':'\u05E1\u05E4\u05D5\u05E8\u05D8\u05D0\u05D6\u05F3','PICANTO':'\u05E4\u05D9\u05E7\u05E0\u05D8\u05D5',
    'RIO':'\u05E8\u05D9\u05D5','CEED':'\u05E1\u05D9\u05D3','NIRO':'\u05E0\u05D9\u05E8\u05D5',
    'SORENTO':'\u05E1\u05D5\u05E8\u05E0\u05D8\u05D5','STONIC':'\u05E1\u05D8\u05D5\u05E0\u05D9\u05E7',
    'CARNIVAL':'\u05E7\u05E8\u05E0\u05D9\u05D5\u05DC','OPTIMA':'\u05D0\u05D5\u05E4\u05D8\u05D9\u05DE\u05D4',
    'SOUL':'\u05E1\u05D5\u05DC','STINGER':'\u05E1\u05D8\u05D9\u05E0\u05D2\u05E8','EV6':'EV6',
    /* Renault */
    'CLIO':'\u05E7\u05DC\u05D9\u05D5','MEGANE':'\u05DE\u05D2\u05D0\u05DF','CAPTUR':'\u05E7\u05E4\u05D8\u05D5\u05E8',
    'KADJAR':'\u05E7\u05D3\u05D2\u05F3\u05D0\u05E8','KOLEOS':'\u05E7\u05D5\u05DC\u05D9\u05D0\u05D5\u05E1',
    'SCENIC':'\u05E1\u05E6\u05E0\u05D9\u05E7','KANGOO':'\u05E7\u05E0\u05D2\u05D5',
    'TALISMAN':'\u05D8\u05DC\u05D9\u05E1\u05DE\u05DF','LAGUNA':'\u05DC\u05D0\u05D2\u05D5\u05E0\u05D4',
    'FLUENCE':'\u05E4\u05DC\u05D5\u05D0\u05E0\u05E1','SANDERO':'\u05E1\u05E0\u05D3\u05E8\u05D5',
    'DUSTER':'\u05D3\u05D0\u05E1\u05D8\u05E8','ZOE':'\u05D6\u05D5\u05D0\u05D4',
    /* Peugeot */
    '208':'208','308':'308','3008':'3008','2008':'2008','5008':'5008',
    '206':'206','207':'207','301':'301','407':'407','508':'508',
    'PARTNER':'\u05E4\u05E8\u05D8\u05E0\u05E8','RIFTER':'\u05E8\u05D9\u05E4\u05D8\u05E8',
    /* Citroen */
    'C1':'C1','C3':'C3','C4':'C4','C5':'C5','BERLINGO':'\u05D1\u05E8\u05DC\u05D9\u05E0\u05D2\u05D5',
    'C-ELYSEE':'C-\u05D0\u05DC\u05D9\u05D6\u05D4','C3 AIRCROSS':'C3 \u05D0\u05D9\u05D9\u05E8\u05E7\u05E8\u05D5\u05E1',
    'C4 CACTUS':'C4 \u05E7\u05E7\u05D8\u05D5\u05E1','C5 AIRCROSS':'C5 \u05D0\u05D9\u05D9\u05E8\u05E7\u05E8\u05D5\u05E1',
    /* Nissan */
    'QASHQAI':'\u05E7\u05E9\u05E7\u05D0\u05D9','JUKE':'\u05D2\u05F3\u05D5\u05E7','X-TRAIL':'\u05D0\u05E7\u05E1-\u05D8\u05E8\u05D9\u05D9\u05DC',
    'MICRA':'\u05DE\u05D9\u05E7\u05E8\u05D4','NOTE':'\u05E0\u05D5\u05D8','LEAF':'\u05DC\u05D9\u05E3',
    'NAVARA':'\u05E0\u05D1\u05D0\u05E8\u05D4','PATHFINDER':'\u05E4\u05D0\u05EA\u05E4\u05D9\u05D9\u05E0\u05D3\u05E8',
    /* Honda */
    'CIVIC':'\u05E1\u05D9\u05D5\u05D9\u05E7','JAZZ':'\u05D2\u05F3\u05D0\u05D6','HR-V':'HR-V','CR-V':'CR-V',
    'ACCORD':'\u05D0\u05E7\u05D5\u05E8\u05D3',
    /* Mazda */
    'CX-5':'CX-5','CX-3':'CX-3','CX-30':'CX-30','CX-60':'CX-60',
    'MAZDA3':'\u05DE\u05D0\u05D6\u05D3\u05D4 3','MAZDA6':'\u05DE\u05D0\u05D6\u05D3\u05D4 6','MAZDA2':'\u05DE\u05D0\u05D6\u05D3\u05D4 2',
    /* Suzuki */
    'SWIFT':'\u05E1\u05D5\u05D5\u05D9\u05E4\u05D8','VITARA':'\u05D5\u05D9\u05D8\u05D0\u05E8\u05D4','BALENO':'\u05D1\u05DC\u05E0\u05D5',
    'JIMNY':'\u05D2\u05F3\u05D9\u05DE\u05E0\u05D9','SX4':'SX4','IGNIS':'\u05D0\u05D9\u05D2\u05E0\u05D9\u05E1',
    /* Subaru */
    'IMPREZA':'\u05D0\u05D9\u05DE\u05E4\u05E8\u05D6\u05D4','FORESTER':'\u05E4\u05D5\u05E8\u05E1\u05D8\u05E8',
    'OUTBACK':'\u05D0\u05D0\u05D5\u05D8\u05D1\u05E7','XV':'XV','LEGACY':'\u05DC\u05D2\u05E1\u05D9',
    /* Fiat */
    'PUNTO':'\u05E4\u05D5\u05E0\u05D8\u05D5','PANDA':'\u05E4\u05E0\u05D3\u05D4','500':'500','500X':'500X','500L':'500L',
    'TIPO':'\u05D8\u05D9\u05E4\u05D5','DUCATO':'\u05D3\u05D5\u05E7\u05D0\u05D8\u05D5',
    /* Opel */
    'CORSA':'\u05E7\u05D5\u05E8\u05E1\u05D4','ASTRA':'\u05D0\u05E1\u05D8\u05E8\u05D4','INSIGNIA':'\u05D0\u05D9\u05E0\u05E1\u05D9\u05D2\u05E0\u05D9\u05D4',
    'MOKKA':'\u05DE\u05D5\u05E7\u05D4','CROSSLAND':'\u05E7\u05E8\u05D5\u05E1\u05DC\u05E0\u05D3','GRANDLAND':'\u05D2\u05E8\u05E0\u05D3\u05DC\u05E0\u05D3',
    'ZAFIRA':'\u05D6\u05E4\u05D9\u05E8\u05D4','MERIVA':'\u05DE\u05E8\u05D9\u05D1\u05D4','VECTRA':'\u05D5\u05E7\u05D8\u05E8\u05D4',
    /* Ford */
    'FOCUS':'\u05E4\u05D5\u05E7\u05D5\u05E1','FIESTA':'\u05E4\u05D9\u05D0\u05E1\u05D8\u05D4','KUGA':'\u05E7\u05D5\u05D2\u05D4',
    'PUMA':'\u05E4\u05D5\u05DE\u05D4','MONDEO':'\u05DE\u05D5\u05E0\u05D3\u05D9\u05D0\u05D5','ECOSPORT':'\u05D0\u05E7\u05D5\u05E1\u05E4\u05D5\u05E8\u05D8',
    'RANGER':'\u05E8\u05E0\u05D2\u05F3\u05E8','TRANSIT':'\u05D8\u05E8\u05E0\u05D6\u05D9\u05D8','MUSTANG':'\u05DE\u05D5\u05E1\u05D8\u05E0\u05D2',
    /* Volvo */
    'S40':'S40','S60':'S60','S80':'S80','S90':'S90',
    'V40':'V40','V60':'V60','V90':'V90',
    'XC40':'XC40','XC60':'XC60','XC90':'XC90',
    /* Alfa Romeo */
    'GIULIETTA':'\u05D2\u05F3\u05D5\u05DC\u05D9\u05D0\u05D8\u05D4','GIULIA':'\u05D2\u05F3\u05D5\u05DC\u05D9\u05D4',
    'STELVIO':'\u05E1\u05D8\u05DC\u05D5\u05D9\u05D5','MITO':'\u05DE\u05D9\u05D8\u05D5',
    '147':'147','156':'156','159':'159'
  };

  function trModelName(name) {
    if (!name) return name;
    /* Remove chassis codes in parentheses for cleaner display */
    var clean = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    /* Translate Roman numerals to regular numbers first */
    clean = clean.replace(/\bVIII\b/g, '8').replace(/\bVII\b/g, '7').replace(/\bVI\b/g, '6');
    clean = clean.replace(/\bIV\b/g, '4').replace(/\bIII\b/g, '3').replace(/\bII\b/g, '2');
    /* Translate known sub-type keywords */
    var ptKeys = Object.keys(MODEL_PART_TR);
    for (var i = 0; i < ptKeys.length; i++) {
      var re = new RegExp('\\b' + ptKeys[i] + '\\b', 'gi');
      clean = clean.replace(re, MODEL_PART_TR[ptKeys[i]]);
    }
    /* Translate car model names */
    var words = clean.split(/\s+/);
    var result = [];
    var skip = false;
    for (var w = 0; w < words.length; w++) {
      if (skip) { skip = false; continue; }
      /* Try two-word matches first (e.g. 'LAND CRUISER', 'SANTA FE') */
      if (w + 1 < words.length) {
        var twoWord = words[w] + ' ' + words[w+1];
        if (MODEL_NAME_TR[twoWord.toUpperCase()]) {
          result.push(MODEL_NAME_TR[twoWord.toUpperCase()]);
          skip = true;
          continue;
        }
      }
      /* Single word match */
      var upper = words[w].toUpperCase();
      if (MODEL_NAME_TR[upper]) {
        result.push(MODEL_NAME_TR[upper]);
      } else {
        result.push(words[w]);
      }
    }
    return result.join(' ');
  }

  function trBrand(name) {
    if (!name) return '';
    var upper = name.toUpperCase();
    if (BRAND_TR[upper]) return BRAND_TR[upper] + ' ' + name;
    return name;
  }

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
    /* Hide ONLY specific Konimbo sections by CSS — safe, targeted approach */
    var style = document.createElement('style');
    style.textContent = [
      /* Hide "למה לקוחות קונים אצלנו" section */
      '#why_buy, div.why_buy, .why_buy_section { display:none !important; }',
      /* Hide the trust icons row */
      '#trust_icons, .trust_icons_row, div.trust_row { display:none !important; }',
      /* Hide "שאל אותנו" and WhatsApp section */
      '#ask_section, .ask_us { display:none !important; }',
      /* Hide compare link */
      'a[href*="add_compare"], a.compare_link, #add_compare { display:none !important; }',
      /* Hide "חזור למעלה" button */
      '.back_to_top, .back-to-top, #back_to_top, a[href="#top"] { display:none !important; }',
      /* Hide delivery info */
      '#delivery_info, .delivery_details, div.item_delivery { display:none !important; }',
      /* Hide read-more link */
      'a.read_more_link { display:none !important; }',
      /* Hide description text — Konimbo uses p, span, or div for product descriptions */
      '#item_info > p { display:none !important; }',
      '#item_info > .item_description, #item_info > .description, .item_description { display:none !important; }',
      '#item_info > span:not(.code_item):not(.price):not([class*="price"]):not([class*="stock"]) { display:none !important; }',
      'a.read_more_link, a.read_more, .read_more_link { display:none !important; }',
      /* Broad Konimbo description selectors */
      '.item_description, .desc, .item_desc, .product_description, .product-description { display:none !important; }',
      '.item_right > .description, .item_right > div.desc { display:none !important; }',
      /* Konimbo real structure: hide unwanted sections */
      '#item_anchors { display:none !important; }',
      '#item_show_facebook { display:none !important; }',
      '#item_current_sub_title { display:none !important; }',
      '.wrap_content_top { display:none !important; }',
      /* Hide shipping/warranty/ask-us/trust icons in Konimbo */
      '.item_shipping, .item_warranty, .item_delivery, .shipping_details { display:none !important; }',
      '.ask_about_item, .ask_us, .ask_question, [class*="ask_about"] { display:none !important; }',
      '.item_trust, .trust_icons, .trust_badges, .item_badges, .trust-icons { display:none !important; }',
      '.item_extra_details, .extra_details, .item_extra_info { display:none !important; }',
      '#item_shipping, #item_warranty, #shipping_info, #warranty_info { display:none !important; }',
      '.whatsapp_product, .product_whatsapp { display:none !important; }',
      /* Aggressively target trust/icon containers by common Konimbo patterns */
      '[class*="trust"], [class*="Trust"], [class*="badge"], [class*="guarantee"] { }',
      '.item_main_bottom [class*="trust"] { display:none !important; }',
      '.item_main_bottom [class*="icon"] { display:none !important; }',
      '.item_main_bottom [class*="badge"] { display:none !important; }',
      /* TecDoc-hidden marker class */
      '.tw-hidden { display:none !important; }',
      /* Hide "Buy Now" button */
      '.buy_now_button, .buy-now-button, [class*="buy_now"], [class*="buy-now"] { display:none !important; }',

      /* Purchase area row styling */
      '.item_price { font-size:32px !important; font-weight:700 !important; color:#1a1a1a !important; font-family:"Heebo",Arial,sans-serif !important; padding:4px 0 8px !important; }',
      '.purchase-area .quantity-row { margin-bottom:0; }',
      '.purchase-area .buttons-row { display:flex; align-items:center; gap:10px; }',
      '.purchase-area { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }'
    ].join('\n');
    document.head.appendChild(style);

    /* Also use JS DOM manipulation as backup — runs multiple times to catch late-loading elements */
    setTimeout(function() { cleanPageDOM(); }, 300);
    setTimeout(function() { cleanPageDOM(); }, 1000);
    setTimeout(function() { cleanPageDOM(); }, 2500);
    setTimeout(function() { cleanPageDOM(); }, 5000);
    setTimeout(function() { cleanPageDOM(); }, 8000);

    /* MutationObserver: catch dynamically loaded elements */
    if (typeof MutationObserver !== 'undefined') {
      var cleanupCount = 0;
      var observer = new MutationObserver(function() {
        if (cleanupCount < 10) {
          cleanupCount++;
          cleanPageDOM();
        }
      });
      var detailsEl = document.getElementById('item_details');
      if (detailsEl) {
        observer.observe(detailsEl, { childList: true, subtree: true });
        /* Stop observing after 15 seconds to avoid infinite loops */
        setTimeout(function() { observer.disconnect(); }, 15000);
      }
    }

    /* Inject stock indicator next to the price area */
    injectStockIndicator();
    /* Merge SKU into brand-badge */
    mergeSKUintoBrandBadge();
    /* Style quantity + cart + price with retries for late-loading elements */
    stylePurchaseArea();
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 500);
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 1500);
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 3000);
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 6000);
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 10000);
    setTimeout(function() { stylePurchaseArea(); injectStockIndicator(); }, 15000);

    /* MutationObserver specifically for cart area: re-apply styles when Konimbo re-renders */
    if (typeof MutationObserver !== 'undefined') {
      var purchaseCount = 0;
      var purchaseObserver = new MutationObserver(function() {
        if (purchaseCount < 20) {
          purchaseCount++;
          stylePurchaseArea();
          injectStockIndicator();
        }
      });
      var bodyEl = document.body;
      if (bodyEl) {
        purchaseObserver.observe(bodyEl, { childList: true, subtree: true });
        setTimeout(function() { purchaseObserver.disconnect(); }, 20000);
      }
    }
  }

  function detectOutOfStock() {
    /* Check if product is out of stock by looking for Konimbo's indicators */
    /* Konimbo uses various patterns: disabled cart button, 'אזל' text, 'out_of_stock' class, quantity=0 */
    var body = document.body;
    if (!body) return false;
    var bodyText = body.innerHTML || '';
    /* Check for common Konimbo out-of-stock signals */
    var cartBtn = document.querySelector('.add_to_cart_button');
    if (!cartBtn) {
      /* Also search by text */
      var allA = document.getElementsByTagName('a');
      for (var i = 0; i < allA.length; i++) {
        if ((allA[i].textContent || '').trim().indexOf('\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4') !== -1) {
          cartBtn = allA[i]; break;
        }
      }
    }
    if (cartBtn) {
      var btnStyle = window.getComputedStyle(cartBtn);
      if (btnStyle.display === 'none' || btnStyle.visibility === 'hidden') return true;
      if (cartBtn.classList.contains('disabled') || cartBtn.hasAttribute('disabled')) return true;
    }
    /* Check for Konimbo out-of-stock text patterns */
    var spans = document.getElementsByTagName('span');
    for (var s = 0; s < spans.length; s++) {
      var txt = (spans[s].textContent || '').trim();
      if (txt === '\u05D0\u05D6\u05DC \u05DE\u05D4\u05DE\u05DC\u05D0\u05D9' || txt === '\u05DC\u05D0 \u05D6\u05DE\u05D9\u05DF' || txt === 'Out of stock') return true;
    }
    /* Check for item_not_available class or similar */
    if (document.querySelector('.item_not_available, .out-of-stock, .out_of_stock, [class*="not_available"]')) return true;
    /* Check if price is 0 — treat as out of stock */
    var priceEl = document.querySelector('.item_price .price') || document.querySelector('.item_price');
    if (priceEl) {
      var priceText = (priceEl.textContent || '').replace(/[^0-9.,]/g, '').trim();
      var priceNum = parseFloat(priceText.replace(',', '.'));
      if (priceNum === 0 || priceText === '' || priceText === '0' || priceText === '0.00') return true;
    }
    return false;
  }

  function injectStockIndicator() {
    /* Don't inject if already exists */
    if (document.querySelector('.tw-stock-inline')) return;
    /* Find price area to place stock ABOVE it */
    var priceArea = document.querySelector('.item_price, .price-area, .price_area, #item_price');
    var codeItem = document.querySelector('.code_item');
    if (!priceArea && !codeItem) return;

    var isOOS = detectOutOfStock();
    var stockEl = document.createElement('div');
    stockEl.className = 'tw-stock-inline';
    stockEl.setAttribute('style', 'display:flex !important; align-items:center !important; gap:8px !important; padding:8px 0 4px !important; clear:both !important; width:100% !important;');
    if (isOOS) {
      stockEl.innerHTML = '<span class="tw-stock-dot-inline tw-out-of-stock-inline"></span><span class="tw-stock-text-inline" style="color:#ef4444 !important;">\u05D0\u05D6\u05DC \u05DE\u05D4\u05DE\u05DC\u05D0\u05D9</span>';
    } else {
      stockEl.innerHTML = '<span class="tw-stock-dot-inline tw-in-stock-inline"></span><span class="tw-stock-text-inline">\u05D6\u05DE\u05D9\u05DF \u05D1\u05DE\u05DC\u05D0\u05D9</span>';
    }
    /* Insert BEFORE price area (stock above price) */
    if (priceArea && priceArea.parentNode) {
      priceArea.parentNode.insertBefore(stockEl, priceArea);
    } else if (codeItem) {
      codeItem.parentNode.insertBefore(stockEl, codeItem.nextSibling);
    }

    /* Hide Konimbo's own stock indicator if it exists (to avoid duplicate) */
    var allSpans = document.getElementsByTagName('span');
    for (var hs = 0; hs < allSpans.length; hs++) {
      var hsTxt = (allSpans[hs].textContent || '').trim();
      if ((hsTxt === '\u05D6\u05DE\u05D9\u05DF \u05D1\u05DE\u05DC\u05D0\u05D9' || hsTxt === '\u05D0\u05D6\u05DC \u05DE\u05D4\u05DE\u05DC\u05D0\u05D9') && !allSpans[hs].classList.contains('tw-stock-text-inline')) {
        var sParent = allSpans[hs].closest ? allSpans[hs].closest('div,span,p') : allSpans[hs].parentElement;
        if (sParent && !sParent.classList.contains('tw-stock-inline')) {
          sParent.setAttribute('style', 'display:none !important;');
        }
      }
    }

    /* Add inline styles since this is outside the widget scope */
    if (!document.querySelector('#tw-stock-style')) {
      var stockStyle = document.createElement('style');
      stockStyle.id = 'tw-stock-style';
      stockStyle.textContent = [
        '.tw-stock-inline { display:flex !important; align-items:center !important; gap:8px !important; padding:8px 0 4px !important; }',
        '.tw-stock-dot-inline { width:10px; height:10px; border-radius:50%; flex-shrink:0; display:inline-block; }',
        '.tw-stock-dot-inline.tw-in-stock-inline { background:#22c55e; box-shadow:0 0 6px rgba(34,197,94,0.5); }',
        '.tw-stock-dot-inline.tw-out-of-stock-inline { background:#ef4444; box-shadow:0 0 6px rgba(239,68,68,0.5); }',
        '.tw-stock-text-inline { font-size:14px; font-weight:600; color:#22c55e; font-family:"Heebo",Arial,sans-serif; }',
        '.tw-stock-text-inline[style*="ef4444"] { color:#ef4444 !important; }'
      ].join('\n');
      document.head.appendChild(stockStyle);
    }
  }

  function mergeSKUintoBrandBadge() {
    if (document.querySelector('.tw-sku-merged')) return;
    /* Find the gray SKU box (code_item) and the brand-badge */
    var codeEl = document.querySelector('.item_main_top .code_item') || document.querySelector('#item_info .code_item') || document.querySelector('.code_item');
    var badge = document.querySelector('.brand-badge');
    if (!codeEl || !badge) return;
    /* Create a flex wrapper that places them side by side */
    var wrapper = document.createElement('div');
    wrapper.className = 'tw-sku-merged';
    wrapper.style.cssText = 'display:flex; align-items:center; gap:8px; margin-top:12px;';
    /* Move the brand-badge into the wrapper */
    badge.parentNode.insertBefore(wrapper, badge);
    badge.style.margin = '0';
    wrapper.appendChild(badge);
    /* Replace code_item with a proper RTL badge matching brand-badge style */
    var skuBadge = document.createElement('div');
    skuBadge.style.cssText = 'display:flex; align-items:center; gap:8px; background:#f8f9fa; padding:8px 12px; border-radius:6px; border:1px solid #eee; direction:rtl;';
    skuBadge.innerHTML = '<span style="font-size:13px;color:#666;">\u05DE\u05E7"\u05D8:</span> <strong style="font-size:14px;color:#1B4E91;font-weight:600;">' + esc(codeEl.textContent.trim().replace(/^[\u05DE\u05E7"\u05D8:.\s]+/g,'').trim()) + '</strong>';
    codeEl.style.display = 'none';
    wrapper.appendChild(skuBadge);
  }

  function hideBuyNowByText() {
    /* Find and hide any element that says "קנה עכשיו" by text content */
    var candidates = document.querySelectorAll('a, button, input[type="submit"], input[type="button"], div[role="button"]');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var txt = (el.textContent || el.value || '').trim();
      if (txt.indexOf('\u05E7\u05E0\u05D4 \u05E2\u05DB\u05E9\u05D9\u05D5') !== -1) {
        el.style.display = 'none';
      }
    }
  }

  function stylePurchaseArea() {
    /* Check if already styled AND styles haven't been overridden by Konimbo */
    var existingStyled = document.querySelector('.tw-purchase-styled');
    if (existingStyled) {
      /* Verify our styles are still applied (Konimbo may override) */
      var bg = window.getComputedStyle(existingStyled).backgroundColor;
      if (bg && bg.indexOf('27') !== -1 && bg.indexOf('78') !== -1 && bg.indexOf('145') !== -1) return; /* Still #1B4E91 */
      /* Styles were overridden — remove marker and re-apply */
      existingStyled.classList.remove('tw-purchase-styled');
    }

    /* Strategy: Inject aggressive CSS into <body> to override Konimbo styles, THEN use JS for fine-tuning.
       Konimbo loads styles after <head> stylesheets, so we inject at the end of <body> to win cascade. */

    /* 1. Inject body-level CSS override (wins cascade over <head> styles) */
    if (!document.querySelector('#tw-purchase-css')) {
      var s = document.createElement('style');
      s.id = 'tw-purchase-css';
      s.textContent = [
        '/* TW Purchase Area Override v10.9 */',
        '/* Hide buy-now and old Konimbo quantity everywhere */',
        '.buy_now_button, .buy-now-button, [class*="buy_now"], [class*="buy-now"] { display: none !important; }',
        '/* Nuclear option: hide ALL quantity-related Konimbo elements */',
        '.item_quantity, .item_quantity_wrapper, .quantity_up, .quantity_down, .item_quantity_input { display:none !important; width:0 !important; height:0 !important; position:absolute !important; overflow:hidden !important; pointer-events:none !important; }',
        '.item_add_to_cart input[type="number"], .item_main_bottom input[type="number"], #item_details input[type="number"] { display:none !important; width:0 !important; height:0 !important; position:absolute !important; overflow:hidden !important; -webkit-appearance:none !important; -moz-appearance:textfield !important; }',
        '/* Restore OUR qty selector */',
        '.tw-qty-selector, .tw-qty-selector * { display:flex !important; position:static !important; width:auto !important; height:auto !important; overflow:visible !important; pointer-events:auto !important; visibility:visible !important; opacity:1 !important; }',
        '.tw-qty-selector input { display:block !important; width:38px !important; height:100% !important; }',
        '.tw-whatsapp-btn { display:flex !important; visibility:visible !important; opacity:1 !important; height:48px !important; min-height:48px !important; }',
        '.tw-whatsapp-row { display:flex !important; min-height:48px !important; }',
        '/* Hide number input spinners */',
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none !important; margin: 0 !important; }',
        '/* Purchase row layout — SEPARATED buttons */',
        '.tw-purchase-row { display:flex !important; align-items:stretch !important; gap:10px !important; flex-wrap:nowrap !important; direction:rtl !important; margin-top:8px !important; width:100% !important; max-width:420px !important; }',
        '.tw-purchase-row a, .tw-purchase-row .tw-cart-btn { background:#1B4E91 !important; color:#fff !important; border:none !important; border-radius:8px !important; font-size:17px !important; font-weight:700 !important; height:48px !important; display:flex !important; align-items:center !important; justify-content:center !important; gap:8px !important; flex:1 !important; padding:0 16px !important; text-decoration:none !important; font-family:"Heebo",sans-serif !important; cursor:pointer !important; box-sizing:border-box !important; line-height:1.2 !important; white-space:nowrap !important; }',
        '/* Custom qty selector styling */',
        '.tw-qty-selector { display:flex !important; flex-direction:row !important; align-items:center !important; border:2px solid #e0e0e0 !important; border-radius:8px !important; overflow:hidden !important; flex-shrink:0 !important; height:48px !important; min-width:110px !important; background:#fff !important; }',
        '.tw-qty-selector span { width:36px !important; height:100% !important; border:none !important; background:transparent !important; font-size:22px !important; cursor:pointer !important; color:#333 !important; display:flex !important; align-items:center !important; justify-content:center !important; padding:0 !important; margin:0 !important; line-height:1 !important; user-select:none !important; flex-shrink:0 !important; }',
        '.tw-qty-selector input { width:38px !important; height:100% !important; text-align:center !important; border:none !important; border-right:1px solid #e0e0e0 !important; border-left:1px solid #e0e0e0 !important; font-size:16px !important; font-weight:600 !important; color:#333 !important; -moz-appearance:textfield !important; background:#fff !important; padding:0 !important; margin:0 !important; outline:none !important; }',
        '/* Mobile purchase area */',
        '@media (max-width: 480px) { .tw-purchase-row { max-width:100% !important; } .tw-purchase-row a, .tw-purchase-row .tw-cart-btn { font-size:15px !important; height:44px !important; padding:0 12px !important; } .tw-qty-selector { height:44px !important; min-width:100px !important; } .tw-qty-selector span { width:32px !important; font-size:20px !important; } .tw-qty-selector input { width:34px !important; font-size:15px !important; } }'
      ].join('\n');
      document.body.appendChild(s);
    }

    /* 1b. Aggressively hide ALL original Konimbo quantity selectors.
       On Konimbo, className returns empty from JS, so we find by TEXT CONTENT and structure. */
    var HIDE_STYLE = 'display:none !important; width:0 !important; height:0 !important; position:absolute !important; overflow:hidden !important; pointer-events:none !important;';
    
    /* Find spans/divs that contain only "+" or "-" and are NOT inside our widget */
    var allEls = document.getElementsByTagName('span');
    for (var sq = 0; sq < allEls.length; sq++) {
      var sqText = (allEls[sq].textContent || '').trim();
      if ((sqText === '+' || sqText === '-' || sqText === '\u2212') && allEls[sq].children.length === 0) {
        /* Check it's NOT inside our custom widget */
        var inOurWidget = false;
        var checkParent = allEls[sq];
        for (var up = 0; up < 5; up++) {
          if (!checkParent) break;
          if (checkParent.className && (checkParent.className.indexOf('tw-qty') !== -1 || checkParent.className.indexOf('tw-purchase') !== -1)) {
            inOurWidget = true; break;
          }
          checkParent = checkParent.parentElement;
        }
        if (!inOurWidget) {
          /* This is a Konimbo +/- button — hide its container */
          var qtyContainer = allEls[sq].parentElement;
          if (qtyContainer) {
            qtyContainer.setAttribute('style', HIDE_STYLE);
            /* Also hide grandparent if it looks like a qty wrapper (has 2-3 children: +, input, -) */
            var gp = qtyContainer.parentElement;
            if (gp && gp.children.length <= 4) {
              var hasInput = gp.getElementsByTagName('input').length > 0;
              if (hasInput) {
                gp.setAttribute('style', HIDE_STYLE);
              }
            }
          }
        }
      }
    }
    /* Also hide any input[type=number] outside our widget */
    var allInputsQ = document.getElementsByTagName('input');
    for (var iq = 0; iq < allInputsQ.length; iq++) {
      if (allInputsQ[iq].type === 'number') {
        var inWidget = false;
        var chk = allInputsQ[iq];
        for (var u2 = 0; u2 < 5; u2++) {
          if (!chk) break;
          if (chk.className && (chk.className.indexOf('tw-qty') !== -1 || chk.className.indexOf('tw-purchase') !== -1)) {
            inWidget = true; break;
          }
          chk = chk.parentElement;
        }
        if (!inWidget) {
          allInputsQ[iq].setAttribute('style', HIDE_STYLE);
          if (allInputsQ[iq].parentElement) {
            allInputsQ[iq].parentElement.setAttribute('style', HIDE_STYLE);
          }
        }
      }
    }

    /* 2. Find the cart button — by class OR text content */
    var cartBtn = document.querySelector('.item_add_to_cart .add_to_cart_button') ||
                  document.querySelector('.add_to_cart_button') ||
                  document.querySelector('a[class*="add_to_cart"]');
    if (!cartBtn) {
      var allAnchors = document.getElementsByTagName('a');
      for (var ai = 0; ai < allAnchors.length; ai++) {
        var atxt = (allAnchors[ai].textContent || '').trim();
        if (atxt === '\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4' || atxt.indexOf('\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4') !== -1) {
          cartBtn = allAnchors[ai];
          break;
        }
      }
    }
    if (!cartBtn) return;

    /* 2b. Check if out of stock — replace purchase area with WhatsApp button */
    var isOOS = detectOutOfStock();
    if (isOOS) {
      /* Hide existing purchase row if it was built before OOS was detected */
      var existPR = document.querySelector('.tw-purchase-row');
      if (existPR) existPR.setAttribute('style', 'display:none !important;');
    }
    if (isOOS && !document.querySelector('.tw-whatsapp-row')) {
      /* Build WhatsApp CTA instead of cart */
      var productTitle = '';
      var h1 = document.querySelector('#item_current_title h1') || document.querySelector('h1');
      if (h1) productTitle = (h1.textContent || '').trim();
      var sku = '';
      var codeEl = document.querySelector('.code_item');
      if (codeEl) sku = (codeEl.textContent || '').replace(/[^a-zA-Z0-9]/g, ' ').trim();
      var waMsg = '\u05E9\u05DC\u05D5\u05DD, \u05D0\u05E9\u05DE\u05D7 \u05DC\u05E2\u05D3\u05DB\u05DF \u05D0\u05D5\u05EA\u05D9 \u05DB\u05E9\u05D4\u05DE\u05D5\u05E6\u05E8: ' + productTitle;
      if (sku) waMsg += ' (\u05DE\u05E7"\u05D8: ' + sku + ')';
      waMsg += ' \u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9. \u05EA\u05D5\u05D3\u05D4!';
      var waUrl = 'https://wa.me/97249517322?text=' + encodeURIComponent(waMsg);

      var waRow = document.createElement('div');
      waRow.className = 'tw-whatsapp-row';
      waRow.setAttribute('style', 'display:flex !important; direction:rtl !important; margin-top:8px !important; width:100% !important; max-width:420px !important; min-height:48px !important;');
      var waLink = document.createElement('a');
      waLink.href = waUrl;
      waLink.target = '_blank';
      waLink.rel = 'noopener';
      waLink.className = 'tw-whatsapp-btn';
      waLink.setAttribute('style',
        'background:#25D366 !important; color:#fff !important; border:none !important; border-radius:8px !important; ' +
        'font-size:17px !important; font-weight:700 !important; height:48px !important; min-height:48px !important; ' +
        'display:flex !important; visibility:visible !important; opacity:1 !important; position:static !important; ' +
        'align-items:center !important; justify-content:center !important; gap:10px !important; width:100% !important; ' +
        'padding:0 16px !important; text-decoration:none !important; font-family:Heebo,sans-serif !important; ' +
        'cursor:pointer !important; box-sizing:border-box !important; overflow:visible !important;');
      waLink.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.624-1.467A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.16 0-4.16-.681-5.803-1.84l-.416-.262-2.743.87.893-2.666-.287-.442A9.72 9.72 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>' +
        '\u05E2\u05D3\u05DB\u05E0\u05D5 \u05DB\u05E9\u05D9\u05D7\u05D6\u05D5\u05E8 \u05DC\u05DE\u05DC\u05D0\u05D9';
      waRow.appendChild(waLink);

      /* Insert WhatsApp row after price, or before cart area */
      var priceEl = document.querySelector('.item_price');
      var cartParent = cartBtn.parentElement;
      if (priceEl && priceEl.parentNode) {
        priceEl.parentNode.insertBefore(waRow, priceEl.nextSibling);
      } else if (cartParent && cartParent.parentElement) {
        cartParent.parentElement.insertBefore(waRow, cartParent);
      }
      /* Hide original cart area */
      if (cartParent) {
        cartParent.setAttribute('style', 'position:absolute !important; width:0 !important; height:0 !important; overflow:hidden !important; opacity:0 !important; pointer-events:none !important;');
      }
      return; /* Don't build cart row when OOS */
    }

    /* Skip if already fully built */
    if (document.querySelector('.tw-purchase-row')) {
      var existRow = document.querySelector('.tw-purchase-row');
      var bg = window.getComputedStyle(existRow.querySelector('a') || existRow).backgroundColor;
      if (bg && bg.indexOf('27') !== -1) return;
    }

    /* 3. Find the original quantity input (by tag, NOT class — Konimbo blocks class selectors) */
    var origQtyInput = null;
    var searchRoot = cartBtn.parentElement;
    for (var up = 0; up < 5 && searchRoot && !origQtyInput; up++) {
      var allInp = searchRoot.getElementsByTagName('input');
      for (var qi = 0; qi < allInp.length; qi++) {
        if (allInp[qi].type === 'number' || allInp[qi].name === 'quantity') {
          origQtyInput = allInp[qi];
          break;
        }
      }
      searchRoot = searchRoot.parentElement;
    }

    /* 4. Hide ALL original purchase elements — aggressively walk up from cart button and hide siblings */
    var cartParent = cartBtn.parentElement;
    if (cartParent) {
      /* Hide all children of cart parent except the cart button itself */
      var siblings = cartParent.children;
      for (var si = 0; si < siblings.length; si++) {
        var sib = siblings[si];
        if (sib === cartBtn) continue;
        if (sib.classList && sib.classList.contains('tw-purchase-row')) continue;
        /* Hide original qty containers, buy-now buttons, etc */
        var sibText = (sib.textContent || '').trim();
        if (sibText === '+' || sibText === '-' || sibText === '\u2212' ||
            sib.tagName === 'INPUT' ||
            (sib.getElementsByTagName && sib.getElementsByTagName('input').length > 0) ||
            sibText.indexOf('\u05E7\u05E0\u05D4') !== -1) {
          sib.setAttribute('style', 'display:none !important; width:0 !important; height:0 !important; position:absolute !important; overflow:hidden !important;');
        }
      }
    }

    /* Also hide original qty if it exists — and its container */
    if (origQtyInput) {
      origQtyInput.setAttribute('style', 'position:absolute !important; opacity:0 !important; pointer-events:none !important; width:0 !important; height:0 !important;');
      var qtyParent = origQtyInput.parentElement;
      if (qtyParent && qtyParent !== cartParent) {
        qtyParent.setAttribute('style', 'display:none !important; width:0 !important; height:0 !important; position:absolute !important;');
      }
    }

    /* 5. Build a complete purchase row: [cart button] [qty selector] — connected, same height */
    if (!document.querySelector('.tw-purchase-row')) {
      var purchaseRow = document.createElement('div');
      purchaseRow.className = 'tw-purchase-row';
      purchaseRow.setAttribute('style',
        'display:flex !important; align-items:stretch !important; gap:10px !important; flex-wrap:nowrap !important; direction:rtl !important; margin-top:8px !important; width:100% !important; max-width:420px !important;');

      /* Clone & restyle the cart button */
      var cartClone = cartBtn.cloneNode(true);
      cartClone.setAttribute('style',
        'background:#1B4E91 !important; color:#fff !important; border:none !important; border-radius:8px !important; ' +
        'font-size:17px !important; font-weight:700 !important; height:48px !important; display:flex !important; align-items:center !important; ' +
        'justify-content:center !important; gap:8px !important; flex:1 !important; padding:0 16px !important; text-decoration:none !important; ' +
        'font-family:"Heebo",sans-serif !important; cursor:pointer !important; box-sizing:border-box !important; line-height:1.2 !important; white-space:nowrap !important;');
      /* Clean up clone text — ensure it says הוסף לעגלה with cart icon */
      cartClone.innerHTML = '<span style="display:flex;align-items:center;flex-shrink:0;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span>\u05D4\u05D5\u05E1\u05E3 \u05DC\u05E2\u05D2\u05DC\u05D4';
      /* Wire up click — trigger the ORIGINAL cart button */
      cartClone.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cartBtn.click();
      });

      /* Build custom qty selector */
      var newQty = document.createElement('div');
      newQty.className = 'tw-qty-selector';
      var qtyVal = (origQtyInput && origQtyInput.value) ? parseInt(origQtyInput.value) || 1 : 1;
      var btnStyle = 'width:36px;height:100%;border:none;background:transparent;font-size:22px;cursor:pointer;color:#333;display:flex;align-items:center;justify-content:center;padding:0;margin:0;line-height:1;user-select:none;flex-shrink:0;font-family:"Heebo",sans-serif;-webkit-tap-highlight-color:transparent;';

      var plusBtn = document.createElement('span');
      plusBtn.textContent = '+';
      plusBtn.setAttribute('style', btnStyle);

      var newInput = document.createElement('input');
      newInput.type = 'text';
      newInput.value = qtyVal;
      newInput.readOnly = true;
      newInput.setAttribute('style',
        'width:38px;height:100%;text-align:center;border:none;border-right:1px solid #e0e0e0;border-left:1px solid #e0e0e0;' +
        'font-size:16px;font-weight:600;color:#333;background:#fff;padding:0;margin:0;font-family:"Heebo",sans-serif;outline:none;-webkit-appearance:none;');

      var minusBtn = document.createElement('span');
      minusBtn.textContent = '\u2212';
      minusBtn.setAttribute('style', btnStyle);

      plusBtn.addEventListener('click', function() {
        var v = parseInt(newInput.value) || 1;
        newInput.value = v + 1;
        if (origQtyInput) { origQtyInput.value = v + 1; origQtyInput.dispatchEvent(new Event('change', {bubbles:true})); }
      });
      minusBtn.addEventListener('click', function() {
        var v = parseInt(newInput.value) || 1;
        if (v > 1) {
          newInput.value = v - 1;
          if (origQtyInput) { origQtyInput.value = v - 1; origQtyInput.dispatchEvent(new Event('change', {bubbles:true})); }
        }
      });

      newQty.appendChild(plusBtn);
      newQty.appendChild(newInput);
      newQty.appendChild(minusBtn);

      purchaseRow.appendChild(cartClone);
      purchaseRow.appendChild(newQty);

      /* Insert the purchase row — BEFORE the original cart area, or after price */
      if (cartParent && cartParent.parentElement) {
        cartParent.parentElement.insertBefore(purchaseRow, cartParent);
      }

      /* Hide the original cart area entirely */
      if (cartParent) {
        cartParent.setAttribute('style', 'position:absolute !important; width:0 !important; height:0 !important; overflow:hidden !important; opacity:0 !important; pointer-events:none !important;');
      }
    }

    /* 6. Hide buy-now buttons */
    hideBuyNowByText();

    /* 7. Style the price */
    var priceEl = document.querySelector('.item_price');
    if (priceEl && !priceEl.classList.contains('tw-price-styled')) {
      priceEl.setAttribute('style', 'font-size:32px !important; font-weight:700 !important; color:#1a1a1a !important; font-family:"Heebo",Arial,sans-serif !important; padding:2px 0 6px !important; direction:rtl !important;');
      var priceSpan = priceEl.querySelector('.price');
      if (priceSpan) priceSpan.setAttribute('style', 'font-size:inherit !important; font-weight:inherit !important; color:inherit !important;');
      priceEl.classList.add('tw-price-styled');
    }
  }

  function cleanPageDOM() {
    /* 1. Hide by specific IDs */
    var idsToHide = ['why_buy', 'trust_icons', 'ask_section', 'delivery_info'];
    for (var i = 0; i < idsToHide.length; i++) {
      var el = document.getElementById(idsToHide[i]);
      if (el) el.style.display = 'none';
    }

    /* 2. Hide compare link */
    var compareLinks = document.querySelectorAll('a[href*="add_compare"]');
    for (var c = 0; c < compareLinks.length; c++) compareLinks[c].style.display = 'none';

    /* 3. Hide read-more link (multiple selectors for Konimbo variants) */
    var readMore = document.querySelectorAll('a.read_more_link, a.read_more, a[class*="read_more"]');
    for (var r = 0; r < readMore.length; r++) readMore[r].style.display = 'none';

    /* 4. Hide old Konimbo product description & unwanted sections.
       Real Konimbo structure:
         #item_current_title > h1
         #item_details > .item_main_top (code_item, sub_title, etc)
                       > .item_main_bottom (price, cart, description text, shipping, etc)
         #item_show_facebook
         .specifications.full_width > #tecdoc-widget
    */
    /* 4a. Hide #item_anchors ("הוסף להשוואה") */
    var anchors = document.getElementById('item_anchors');
    if (anchors) anchors.style.display = 'none';

    /* 4b. Deep-hide description, shipping, warranty, ask-us, icons inside #item_details.
       We walk ALL descendants and hide by text content pattern matching.
       Also walk UP from matches to hide parent containers. */
    var itemDetails = document.getElementById('item_details');
    if (itemDetails) {
      /* Known Hebrew text patterns to hide */
      var hidePatterns = [
        '\u05DE\u05E9\u05DC\u05D5\u05D7',    /* משלוח (shipping) */
        '\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA',  /* אחריות (warranty) */
        '\u05D6\u05DE\u05DF \u05D0\u05E1\u05E4\u05E7\u05D4', /* זמן אספקה (delivery time) */
        '\u05D0\u05D9\u05E1\u05D5\u05E3 \u05E2\u05E6\u05DE\u05D9', /* איסוף עצמי (self pickup) */
        '\u05E9\u05D0\u05DC \u05D0\u05D5\u05EA\u05E0\u05D5', /* שאל אותנו (ask us) */
        '\u05DC\u05DE\u05D4 \u05DC\u05E7\u05D5\u05D7\u05D5\u05EA', /* למה לקוחות (why buy) */
        '\u05DE\u05E9\u05DC\u05D5\u05D7\u05D9\u05DD \u05DE\u05D4\u05D9\u05E8\u05D9\u05DD', /* משלוחים מהירים */
        '\u05EA\u05E9\u05DC\u05D5\u05DD \u05DE\u05D0\u05D5\u05D1\u05D8\u05D7', /* תשלום מאובטח */
        '\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D1\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA', /* מוצרים באחריות */
        '\u05DE\u05D0\u05D5\u05D1\u05D8\u05D7', /* מאובטחת - also catches קניה מאובטחת */
        'WhatsApp',
        '\u05D4\u05EA\u05DE\u05D5\u05E0\u05D4 \u05DC\u05D4\u05DE\u05D7\u05E9\u05D4' /* התמונה להמחשה (illustration only) */
      ];

      /* Helper: check if element is safe to hide (does not contain price/cart/widget) */
      function isSafeToHide(el) {
        var cls = (el.className || '').toString();
        var id = el.id || '';
        if (cls.indexOf('price') !== -1 || cls.indexOf('item_add') !== -1 || cls.indexOf('cart') !== -1) return false;
        if (cls.indexOf('tw-') !== -1 || id === 'tecdoc-widget') return false;
        if (id === 'item_details' || cls.indexOf('item_main_top') !== -1) return false;
        if (el.querySelector && el.querySelector('.add_to_cart_button, [class*="price"], input[name="quantity"], #tecdoc-widget, [class*="tw-"]')) return false;
        return true;
      }

      /* Search ALL descendant elements (broad tag list) */
      var allEls = itemDetails.querySelectorAll('div, p, span, section, a, li, ul, b, strong, h3, h4, h5, h6, label, td, img');
      for (var ae = 0; ae < allEls.length; ae++) {
        var el = allEls[ae];
        /* For img elements, use alt text */
        var elTxt = el.tagName === 'IMG' ? (el.alt || '') : (el.textContent || '');
        elTxt = elTxt.trim();
        if (!isSafeToHide(el)) continue;
        /* Check if this element's text matches a hide pattern */
        for (var hp = 0; hp < hidePatterns.length; hp++) {
          if (elTxt.indexOf(hidePatterns[hp]) !== -1 && elTxt.length < 500) {
            if (isSafeToHide(el)) {
              el.style.display = 'none';
              /* WALK UP: also hide parent containers (up to 3 levels) if they're small enough */
              var parent = el.parentElement;
              for (var up = 0; up < 3 && parent; up++) {
                var parentTxt = (parent.textContent || '').trim();
                if (parentTxt.length < 200 && isSafeToHide(parent)) {
                  parent.style.display = 'none';
                }
                parent = parent.parentElement;
              }
            }
            break;
          }
        }
      }

      /* 4b2. Additional: hide all elements between cart and widget that have no price/cart */
      var widget = document.getElementById('tecdoc-widget');
      var mainBottom = itemDetails.querySelector('.item_main_bottom');
      if (mainBottom && widget) {
        var children = mainBottom.children;
        for (var ci = 0; ci < children.length; ci++) {
          var child = children[ci];
          if (child === widget || child.contains(widget)) continue;
          /* Keep only elements that contain price, cart, or quantity */
          if (isSafeToHide(child)) {
            var childTxt = (child.textContent || '').trim();
            /* Keep if it has ₪ and is very short (price) */
            if (childTxt.indexOf('\u20AA') !== -1 && childTxt.length < 20) continue;
            /* Keep quantity/cart containers */
            if (child.querySelector && child.querySelector('.add_to_cart_button, input[name="quantity"], [class*="price"], [class*="quantity"]')) continue;
            /* Everything else in item_main_bottom that's not price/cart — check patterns */
            for (var hp2 = 0; hp2 < hidePatterns.length; hp2++) {
              if (childTxt.indexOf(hidePatterns[hp2]) !== -1) {
                child.style.display = 'none';
                break;
              }
            }
          }
        }
      }
    }

    /* 4c. Hide #item_show_facebook */
    var fb = document.getElementById('item_show_facebook');
    if (fb) fb.style.display = 'none';

    /* 4d. Hide sub_title and wrap_content_top in item_main_top (usually already hidden) */
    var subTitle = document.getElementById('item_current_sub_title');
    if (subTitle) subTitle.style.display = 'none';
    var wrapTop = document.querySelector('.wrap_content_top');
    if (wrapTop) wrapTop.style.display = 'none';

    /* 4e. Fallback: #item_info approach for non-standard Konimbo layouts */
    var itemInfo = document.getElementById('item_info');
    if (itemInfo) {
      var pTags = itemInfo.querySelectorAll(':scope > p');
      for (var p = 0; p < pTags.length; p++) pTags[p].style.display = 'none';
      var spans = itemInfo.querySelectorAll(':scope > span');
      for (var s = 0; s < spans.length; s++) {
        var sp = spans[s];
        if (sp.classList.contains('code_item') || sp.className.indexOf('price') !== -1) continue;
        if (sp.textContent.trim().length > 30) sp.style.display = 'none';
      }
    }

    /* 5. Hide back-to-top */
    var backTop = document.querySelectorAll('.back_to_top, .back-to-top, #back_to_top, a[href="#top"]');
    for (var b = 0; b < backTop.length; b++) backTop[b].style.display = 'none';

    /* 6. Hide Buy Now button */
    hideBuyNowByText();
  }

  function getOrCreateWidget() {
    var existing = document.getElementById('tecdoc-widget');
    if (existing) return existing;

    /* Priority 0: Konimbo real layout — place inside #item_details after .item_main_bottom */
    var itemDetails = document.getElementById('item_details');
    if (itemDetails) {
      var widget0 = document.createElement('div');
      widget0.id = 'tecdoc-widget';
      widget0.style.cssText = 'width:100%; padding:0 15px;';
      var mainBottom = itemDetails.querySelector('.item_main_bottom');
      if (mainBottom && mainBottom.nextSibling) {
        itemDetails.insertBefore(widget0, mainBottom.nextSibling);
      } else {
        itemDetails.appendChild(widget0);
      }
      /* Hide old #item_content / specifications if they exist */
      var oldContent = document.getElementById('item_content');
      if (oldContent) oldContent.style.display = 'none';
      var oldSpecs = document.querySelector('#item_specifications');
      if (oldSpecs) oldSpecs.style.display = 'none';
      return widget0;
    }

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

    /* Priority 3: Fallback — append to body */
    var widget3 = document.createElement('div');
    widget3.id = 'tecdoc-widget';
    document.body.appendChild(widget3);
    return widget3;
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

  /* ═══ STRENGTHS / USP BADGES ═══ */
  function renderStrengths() {
    /* Only inject once */
    if (document.querySelector('.tw-strengths')) return;
    var w = getWidget(); if (!w) return;

    var strengthsHTML = '<div class="tw-strengths">';
    var items = [
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', text: '\u05DE\u05E9\u05DC\u05D5\u05D7 \u05E2\u05D3 7 \u05D9\u05DE\u05D9 \u05E2\u05E1\u05E7\u05D9\u05DD' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', text: '\u05D0\u05D7\u05E8\u05D9\u05D5\u05EA 3 \u05D7\u05D5\u05D3\u05E9\u05D9\u05DD / 6,000 \u05E7"\u05DE' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>', text: '\u05DE\u05D5\u05E8\u05E9\u05D9\u05DD \u05DE\u05E9\u05E8\u05D3 \u05D4\u05EA\u05D7\u05D1\u05D5\u05E8\u05D4' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', text: '\u05EA\u05E9\u05DC\u05D5\u05DD \u05DE\u05D0\u05D5\u05D1\u05D8\u05D7' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>', text: '\u05D0\u05E4\u05E9\u05E8\u05D5\u05EA \u05EA\u05E9\u05DC\u05D5\u05DE\u05D9\u05DD \u05D1\u05E7\u05D5\u05E4\u05D4' }
    ];
    for (var i = 0; i < items.length; i++) {
      strengthsHTML += '<div class="tw-strength-item">' +
        '<span class="tw-strength-icon">' + items[i].icon + '</span>' +
        '<span class="tw-strength-text">' + items[i].text + '</span>' +
        '</div>';
    }
    strengthsHTML += '</div>';

    /* Insert BEFORE the widget content (tabs) */
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = strengthsHTML;
    var strengthsEl = tempDiv.firstChild;
    w.insertBefore(strengthsEl, w.firstChild);
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
      /* Add supplier row */
      var pLow = (D.product || '').toLowerCase();
      var hideSupplier = (pLow === 'air filter' || pLow.indexOf('cabin air') !== -1 || pLow.indexOf('pollen') !== -1);
      if (D.supplier && !hideSupplier) {
        allSpecs.push({ name: '\u05D9\u05E6\u05E8\u05DF', value: D.supplier });
      }
      /* Add article number as separate row */
      if (D.articleNo) {
        allSpecs.push({ name: '\u05DE\u05E7"\u05D8', value: D.articleNo });
      }
      /* Add product type */
      if (D.product) {
        allSpecs.push({ name: '\u05E1\u05D5\u05D2 \u05DE\u05D5\u05E6\u05E8', value: trProduct(D.product) });
      }
      /* Add TecDoc specs — skip empty, 0, hidden, or irrelevant values */
      var prioritySpecs = [];
      var normalSpecs = [];
      for (var i = 0; i < D.specs.length; i++) {
        var sv = (D.specs[i].criteriaValue || '').trim();
        if (!sv || sv === '0' || sv === '0.0' || sv === '0,0' || sv === '-' || sv === 'N/A') continue;
        var rawName = D.specs[i].criteriaName || '';
        var sn = rawName.toLowerCase();
        /* Skip EAN */
        if (sn.indexOf('ean') !== -1) continue;
        /* Skip hidden specs (not relevant for private consumer) */
        var isHidden = false;
        for (var hi = 0; hi < HIDDEN_SPECS.length; hi++) {
          if (rawName === HIDDEN_SPECS[hi] || sn === HIDDEN_SPECS[hi].toLowerCase()) { isHidden = true; break; }
        }
        if (isHidden) continue;
        /* Check if priority spec */
        var isPriority = false;
        for (var pi = 0; pi < PRIORITY_SPECS.length; pi++) {
          if (rawName === PRIORITY_SPECS[pi]) { isPriority = true; break; }
        }
        var specObj = { name: trSpec(rawName), value: trVal(rawName, D.specs[i].criteriaValue) };
        if (isPriority) { prioritySpecs.push(specObj); } else { normalSpecs.push(specObj); }
      }
      /* Merge: priority specs first, then normal */
      allSpecs = allSpecs.concat(prioritySpecs).concat(normalSpecs);

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
        html += '<div class="tw-acc-l1"><div class="tw-acc-l1-header" data-level="1"><span class="tw-acc-icon">+</span><span class="tw-acc-l1-name">' + esc(trBrand(mfr)) + '</span></div><div class="tw-acc-l1-body">';
        var mdKeys = Object.keys(models).sort();
        for (var mi = 0; mi < mdKeys.length; mi++) {
          var mn = mdKeys[mi], md = models[mn];
          html += '<div class="tw-acc-l2"><div class="tw-acc-l2-header" data-level="2"><span class="tw-acc-icon">+</span><span class="tw-acc-l2-name">' + esc(trModelName(mn)) + '</span>';
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
    renderStrengths();
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

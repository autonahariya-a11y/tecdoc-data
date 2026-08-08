/* TecDoc SKU Override Table — v2 (43 auto-discovered mappings)
 *
 * זהו קובץ המיפוי הידני עבור מק"טים שהחיפוש האוטומטי לא מוצא ב-TecDoc.
 * ─────────────────────────────────────────────────────────────────────
 * מבנה: מק"ט חנות → מק"ט/וריאציות ידועות ב-TecDoc
 *
 * כל אחת מהוריאציות תיבדק מול Apify. הראשונה שמחזירה נתונים היא שתופיע.
 *
 * הטבלה הזו נבנתה אוטומטית ב-2026-08-08 ע"י build-tecdoc-overrides.js
 * מדגם מלא: כל 332 המק"טים הלא-cached בקטלוג של Auto Nahariya.
 *
 * איך להוסיף מק"ט חדש:
 *   1. מצא בטבלת TecDoc את המק"ט המדויק (למשל דרך www.tecdoc.net או www.parts-catalog.online)
 *   2. הוסף שורה בסקציה "הוספות ידניות": 'הMKT_בחנות': ['וריאציה1', 'וריאציה2']
 *   3. commit + push. הטבלה נטענת אוטומטית.
 *
 * דוגמאות ידועות שכבר מטופלות ב-widget.js (לא צריך לרשום כאן):
 *   OX387D → OX 387D  (MAHLE spacing)
 *   263203V000 → 26320-3V000  (Hyundai/Kia dash)
 *   04E115561AC → 04E 115 561 AC  (VAG grouping)
 */
(function(){
  'use strict';

  window.TECDOC_MAP = window.TECDOC_MAP || {};

  var overrides = {
    /* ============================================================
       AUTO-GENERATED overrides (built 2026-08-08 via build-tecdoc-overrides.js)
       Sample size: 332 / 332 uncached SKUs (full scan)
       Found 43 verified mappings: OEM → aftermarket equivalent in TecDoc
       ============================================================ */

    /* ─── יונדאי/קיה/ג'נסיס (OEM → aftermarket) ─── */
    '263202F100': ['HU 7027 z'],       // MANN-FILTER (112 vehicles)
    '2630035531': ['W 8017'],           // MANN-FILTER (125 vehicles)
    '263202R001': ['0 986 AF0 371'],   // BOSCH (6 vehicles)
    '263203CAA0': ['OX 1176D'],         // MAHLE (3 vehicles)
    '263502J001': ['E1192H D921'],     // HENGST FILTER (10 vehicles)
    '263502M100': ['E997H D896'],       // HENGST FILTER (27 vehicles)
    '263502S000': ['0 986 AF0 367'],   // BOSCH (1 vehicle)
    '263502T000': ['R2959P'],           // RYCO (5 vehicles)

    /* ─── טויוטה/לקסוס (OEM → aftermarket) ─── */
    '04152YZZA5': ['HU 7009 z'],        // MANN-FILTER (114 vehicles)
    '90915YZZD2': ['W 7015'],           // MANN-FILTER (406 vehicles)
    '90915YZZN2': ['LS743'],            // PURFLUX (622 vehicles)
    '90919-01259': ['0 242 230 610'],  // BOSCH (16 vehicles)

    /* ─── מצתי דנסו לטויוטה/דיהאטסו (OEM → BOSCH) ─── */
    '18827-09080': ['0 242 135 545'],
    '18841-11051': ['0 242 229 630'],
    '18844-10060': ['0 242 135 554'],
    '18846-10060': ['0 242 129 524'],
    '18846-11070': ['0 242 135 548'],
    '18847-11160': ['0 242 129 524'],
    '18848-10080': ['0 242 135 554'],
    '18849-09070': ['0 242 135 556'],
    '18849-11070': ['0 242 135 564'],
    '18858-10090': ['0 242 129 515'],
    '18868-08095': ['0 242 135 533'],

    /* ─── סובארו (OEM → MANN) ─── */
    '15208AA160': ['W 6019'],
    '15208HG00D': ['HU 7044 z'],

    /* ─── ניסאן/סוזוקי (OEM → aftermarket) ─── */
    '1651061AV1': ['OC 215'],           // MAHLE (262 vehicles)
    '1651084M00': ['W 6026'],           // MANN (21 vehicles)
    'MQ718353': ['ADN12112'],           // BLUE PRINT (1005 vehicles)

    /* ─── רנו/דאציה/ניסאן (OEM → aftermarket) ─── */
    '152093920R': ['HU 6011 z'],       // MANN (393 vehicles)
    '152095084R': ['HU 10 002 z'],     // MANN (275 vehicles)
    '224015145R': ['OE261'],            // CHAMPION (143 vehicles)
    '224019133R': ['0 242 140 565'],   // BOSCH (354 vehicles)
    '7700500155': ['0 242 235 666'],   // BOSCH (3083 vehicles!)

    /* ─── פג'ו/סיטרואן (OEM → MANN) ─── */
    '1610693780': ['HU 7033 z'],
    '9809532380': ['W 7063'],

    /* ─── איסוזו/אופל/שברולט (OEM → aftermarket) ─── */
    '8973587200': ['W 8018'],           // MANN (14 vehicles)
    '8981650710': ['OC 1243'],          // MAHLE (13 vehicles)
    '8982705240': ['0 986 AF0 361'],   // BOSCH (4 vehicles)

    /* ─── קרייזלר/ג'יפ/דודג' (OEM → aftermarket) ─── */
    '04892339AA': ['W 7030'],           // MANN (215 vehicles)
    '68079744AA': ['HU 6009 z'],       // MANN (30 vehicles)
    '68191349AC': ['OX 1228D'],         // MAHLE (5 vehicles)

    /* ─── שונות ─── */
    'HU713': ['66026'],                 // OSSCA (23 vehicles) — MANN alternative
    'W75': ['55060'],                   // MOTIP (4 vehicles)

    /* ============================================================
       הוספות ידניות — הוסף כאן:
       'SKU_בחנות': ['פורמט_TecDoc_1', 'פורמט_TecDoc_2'],
       ============================================================ */
  };

  /* מיזוג לתוך המפה הגלובלית — לא דורס מיפויים קיימים */
  Object.keys(overrides).forEach(function(k){
    if (!window.TECDOC_MAP[k]) window.TECDOC_MAP[k] = overrides[k];
  });

  console.log('[TecDoc Overrides v2] loaded ' + Object.keys(overrides).length + ' verified mappings');
})();

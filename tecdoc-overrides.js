/* TecDoc SKU Override Table — v1
 *
 * זהו קובץ המיפוי הידני עבור מק"טים שהחיפוש האוטומטי לא מוצא ב-TecDoc.
 * ─────────────────────────────────────────────────────────────────────
 * מבנה: מק"ט חנות → מק"ט/וריאציות ידועות ב-TecDoc
 *
 * כל אחת מהוריאציות תיבדק מול Apify. הראשונה שמחזירה נתונים היא שתופיע.
 *
 * איך להוסיף מק"ט חדש:
 *   1. מצא בטבלת TecDoc את המק"ט המדויק (למשל דרך www.tecdoc.net או www.parts-catalog.online)
 *   2. הוסף שורה: 'הMKT_בחנות': ['וריאציה1', 'וריאציה2']
 *   3. commit + push. הטבלה נטענת אוטומטית עם 5 דקות cache.
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
    /* ─────────── MANN-FILTER ─────────── */
    /* פורמט: SKU חנות: [וריאציה נכונה ב-TecDoc, וריאציות חלופיות...] */
    // 'HU815/2x': ['HU 815/2 x'],  // מטופל אוטומטית ע"י brand rule

    /* ─────────── ACDelco (בעייתי — TecDoc לא תמיד מכיל) ─────────── */
    // 'PF48': ['PF48E', 'AC-PF48'],  // הוסף מק"טי ACDelco כאן

    /* ─────────── Hi-Q רפידות בלם ─────────── */
    // 'SP1107F': ['SP 1107 F', 'HI-Q SP1107F'],

    /* ─────────── יונדאי/קיה — OEM עם מקף ─────────── */
    // '263203V000': ['26320-3V000'],  // מטופל אוטומטית

    /* ─────────── ידני — יש להוסיף כאן מק"טים שגילית ─────────── */
    // 'SKU_בחנות': ['פורמט_TecDoc'],
  };

  /* מיזוג לתוך המפה הגלובלית — לא דורס מיפויים קיימים */
  Object.keys(overrides).forEach(function(k){
    if (!window.TECDOC_MAP[k]) window.TECDOC_MAP[k] = overrides[k];
  });

  console.log('[TecDoc Overrides v1] loaded ' + Object.keys(overrides).length + ' manual mappings');
})();

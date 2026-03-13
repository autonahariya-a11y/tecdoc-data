# TecDoc Widget — Auto Nahariya

ווידג'ט שמציג נתוני TecDoc (מפרט טכני, התאמה לרכבים, מספרי OE) בעמודי מוצר בקונימבו.

הנתונים נשמרים מראש כקבצי JSON ונטענים מיידית — בלי המתנה ל-API.

## מבנה הקבצים

```
widget.js          ← הווידג'ט (להטמעה בחנות)
widget.css         ← עיצוב (להטמעה בחנות)
data/
  articles.txt     ← רשימת מק"טים (שורה לכל מק"ט)
  09_A427_11.json  ← נתונים שמורים לכל מוצר
  82B0003.json
  ...
scripts/
  fetch-tecdoc.js  ← סקריפט שמושך נתונים מ-TecDoc
```

## התקנה

### 1. הוסף מק"טים
ערוך את `data/articles.txt` — הוסף שורה לכל מק"ט מוצר:
```
09.A427.11
82B0003
23894
```

### 2. הרץ את הסקריפט (פעם ראשונה)
```bash
node scripts/fetch-tecdoc.js
```
זה ימשוך את כל הנתונים מ-TecDoc וישמור אותם בתיקיית `data/`.

### 3. הפעל GitHub Pages
ב-Settings → Pages → Source → בחר **main branch** → Save.
הקבצים יהיו זמינים ב:
`https://autonahariya-a11y.github.io/tecdoc-data/`

### 4. הטמע בקונימבו
בשדה `foot_html` של החנות:
```html
<link rel="stylesheet" href="https://autonahariya-a11y.github.io/tecdoc-data/widget.css">
<script src="https://autonahariya-a11y.github.io/tecdoc-data/widget.js"></script>
```

## עדכון אוטומטי
GitHub Actions מריץ את הסקריפט אוטומטית כל שבוע (יום ראשון).
אפשר גם להריץ ידנית: Actions → Update TecDoc Data → Run workflow.

## הוספת מוצרים חדשים
1. ערוך את `data/articles.txt` — הוסף את המק"ט
2. לך ל-Actions → Run workflow (או חכה לעדכון השבועי)
3. הנתונים יהיו זמינים תוך דקות

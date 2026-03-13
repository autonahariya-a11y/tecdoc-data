#!/usr/bin/env node
/**
 * TecDoc Data Pre-Fetcher
 * 
 * Reads a list of article numbers from data/articles.txt (one per line),
 * fetches TecDoc data for each, and saves individual JSON files to data/.
 * 
 * Usage:
 *   node scripts/fetch-tecdoc.js
 * 
 * The articles.txt file should contain one TecDoc article number per line:
 *   09.A427.11
 *   82B0003
 *   23894
 */

const fs = require('fs');
const path = require('path');

const API_URL = `https://api.apify.com/v2/acts/making-data-meaningful~tecdoc/run-sync-get-dataset-items?token=${process.env.APIFY_TOKEN || 'YOUR_APIFY_TOKEN'}&timeout=120`;
const DATA_DIR = path.join(__dirname, '..', 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.txt');

/* Delay between API calls to avoid rate limiting (ms) */
const DELAY_MS = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiCall(body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

function toFilename(articleNo) {
  return articleNo.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
}

function articleVariations(artNo) {
  const variations = [artNo];
  const spaced = artNo.replace(/([A-Za-z]+)(\d+)/g, (m, letters, digits) => {
    let d = digits;
    if (d.length === 5) d = d.slice(0,2) + ' ' + d.slice(2);
    else if (d.length === 6) d = d.slice(0,2) + ' ' + d.slice(2,4) + ' ' + d.slice(4);
    else if (d.length === 4) d = d.slice(0,2) + ' ' + d.slice(2);
    return letters + ' ' + d;
  });
  if (spaced !== artNo) variations.push(spaced);
  if (artNo.includes('.')) variations.push(artNo.replace(/\./g, ' '));
  const nospace = artNo.replace(/[\s.-]/g, '');
  if (nospace !== artNo) variations.push(nospace);
  return [...new Set(variations)];
}

async function fetchArticle(articleNo) {
  console.log(`  [1/2] Fetching vehicles for ${articleNo}...`);
  
  const variations = articleVariations(articleNo);
  let vehicleData = null;
  
  for (const variant of variations) {
    const data = await apiCall({
      endpoint_partsCompatibleVehiclesByArticleNo: true,
      parts_articleNo_20: variant,
      parts_langId_20: 4,
      parts_countryFilterId_20: 81,
      parts_typeId_20: 1
    });
    if (data && data.length && data[0].articles && data[0].articles.length) {
      vehicleData = data;
      if (variant !== articleNo) console.log(`    Found with variation: ${variant}`);
      break;
    }
    if (variations.length > 1) await sleep(DELAY_MS);
  }

  if (!vehicleData || !vehicleData.length || !vehicleData[0].articles || !vehicleData[0].articles.length) {
    console.log(`  ⚠ No results found for ${articleNo} (tried ${variations.length} variations)`);
    return null;
  }

  const article = vehicleData[0].articles[0];
  const result = {
    articleNo: article.articleNo || articleNo,
    articleId: article.articleId,
    supplier: article.supplierName || '',
    product: article.articleProductName || '',
    vehicles: article.compatibleCars || [],
    specs: [],
    oe: [],
    ean: '',
    fetchedAt: new Date().toISOString()
  };

  await sleep(DELAY_MS);

  console.log(`  [2/2] Fetching specs & OE for ${articleNo}...`);
  const detailData = await apiCall({
    endpoint_partsArticleDetailsByArticleId: true,
    parts_articleId_13: article.articleId,
    parts_langId_13: 4
  });

  if (detailData && detailData.length) {
    const det = detailData[0];
    result.specs = det.articleAllSpecifications || [];
    result.oe = det.articleOemNo || [];
    if (det.articleEanNo && det.articleEanNo.eanNumbers) {
      result.ean = det.articleEanNo.eanNumbers;
    }
    if (det.article) {
      if (!result.product && det.article.articleProductName) result.product = det.article.articleProductName;
      if (!result.supplier && det.article.supplierName) result.supplier = det.article.supplierName;
    }
  }

  return result;
}

async function main() {
  console.log('=== TecDoc Data Pre-Fetcher ===\n');

  /* Read articles list */
  if (!fs.existsSync(ARTICLES_FILE)) {
    console.error(`Error: ${ARTICLES_FILE} not found.`);
    console.error('Create a file with one article number per line.');
    process.exit(1);
  }

  const articles = fs.readFileSync(ARTICLES_FILE, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  console.log(`Found ${articles.length} articles to process.\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < articles.length; i++) {
    const articleNo = articles[i];
    const filename = toFilename(articleNo);
    const filepath = path.join(DATA_DIR, filename);

    console.log(`[${i + 1}/${articles.length}] ${articleNo}`);

    /* Check if already cached and still fresh (less than 7 days old) */
    if (fs.existsSync(filepath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        if (existing.fetchedAt) {
          const age = Date.now() - new Date(existing.fetchedAt).getTime();
          const days = age / (1000 * 60 * 60 * 24);
          if (days < 7) {
            console.log(`  ✓ Already cached (${Math.round(days)}d old) — skipping\n`);
            skipped++;
            continue;
          }
        }
      } catch(e) { /* re-fetch if corrupt */ }
    }

    try {
      const data = await fetchArticle(articleNo);
      if (data) {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log(`  ✓ Saved → ${filename} (${data.vehicles.length} vehicles, ${data.specs.length} specs, ${data.oe.length} OE numbers)\n`);
        success++;
      } else {
        failed++;
        console.log('');
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}\n`);
      failed++;
    }

    /* Delay between articles */
    if (i < articles.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('=== Summary ===');
  console.log(`Total: ${articles.length}`);
  console.log(`Success: ${success}`);
  console.log(`Skipped (fresh cache): ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Scan ONLY the "spare parts" category tree (חלקי חילוף לרכב).
 *
 * Strategy:
 *   1. Start from https://www.autonahariya.co.il/186807-חלקי-חילוף-לרכב
 *   2. BFS crawl to discover all sub-categories under it
 *   3. For each category, page through all products (Konimbo paginates
 *      via ?p=1..N or shows all inline; we follow /items/ links).
 *   4. For each /items/ URL, fetch the page and extract SKU from <title>.
 *   5. Compare against existing data/*.json files.
 *   6. Output data/spare-parts-skus.txt and data/missing-spare-parts.txt.
 *
 * Env vars:
 *   LIMIT_CATEGORIES=N  cap discovery for testing
 *   LIMIT_PRODUCTS=N    cap product URL processing
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_SKUS = path.join(DATA_DIR, 'spare-parts-skus.txt');
const OUTPUT_MISSING = path.join(DATA_DIR, 'missing-spare-parts.txt');
const REPORT_FILE = path.join(DATA_DIR, 'spare-parts-scan-report.json');

const BASE = 'https://www.autonahariya.co.il';
const ROOT_CATEGORY = `${BASE}/186807-%D7%97%D7%9C%D7%A7%D7%99-%D7%97%D7%99%D7%9C%D7%95%D7%A3-%D7%9C%D7%A8%D7%9B%D7%91`;

const CONCURRENCY = 6;
const REQUEST_DELAY_MS = 250;

function toFilename(sku) {
  return sku.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchText(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TecDocBot/1.0)' },
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.status === 404) return { ok: false, notFound: true };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      return { ok: true, text };
    } catch (err) {
      if (attempt === retries) return { ok: false, error: err.message };
      await sleep(1000 * (attempt + 1));
    }
  }
}

/**
 * Extract SKU from Konimbo product page <title>.
 * Format: 'שם המוצר | תיאור | מק"ט | אוטו נהריה'
 */
function extractSku(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) return null;
  const title = titleMatch[1];
  const skuMatch = title.match(/\|\s*([^|]{2,40}?)\s*\|\s*אוטו\s*נהריה/);
  if (!skuMatch) return null;
  const candidate = skuMatch[1].trim();
  if (candidate.length < 4 || candidate.length > 30) return null;
  if (/[א-ת]/.test(candidate)) return null;   /* no Hebrew */
  if (!/[A-Za-z0-9]/.test(candidate)) return null;
  return candidate;
}

/**
 * Extract category and product links from a category page's HTML.
 * Konimbo category URLs: /{digits}-{slug}
 * Konimbo product URLs:  /items/{...}
 */
function extractLinks(html) {
  const categoryLinks = new Set();
  const productLinks = new Set();

  /* Match all href="..." occurrences */
  const hrefRegex = /href=["']([^"'#<> ]+)["']/g;
  let m;
  while ((m = hrefRegex.exec(html))) {
    let url = m[1];
    if (url.startsWith('//')) url = 'https:' + url;
    else if (url.startsWith('/')) url = BASE + url;
    else if (!url.startsWith('http')) continue;

    /* Only autonahariya.co.il */
    if (!url.startsWith(BASE)) continue;

    /* Strip query string for dedup */
    const clean = url.split('?')[0].split('#')[0];

    if (clean.includes('/items/')) {
      productLinks.add(clean);
    } else {
      /* Category URL pattern: /{digits}-{slug} */
      const catMatch = clean.match(/^https?:\/\/[^\/]+\/(\d+)-[^\/]+\/?$/);
      if (catMatch) {
        categoryLinks.add(clean);
      }
    }
  }
  return { categoryLinks: [...categoryLinks], productLinks: [...productLinks] };
}

/**
 * Fetch all pages of a paginated category and collect all product links.
 */
async function collectFromCategory(catUrl, allSubCats) {
  const products = new Set();
  let page = 1;
  const maxPages = 100;   /* safety */

  while (page <= maxPages) {
    const pageUrl = page === 1 ? catUrl : `${catUrl}?page=${page}`;
    const r = await fetchText(pageUrl);
    if (!r.ok) break;
    const { categoryLinks, productLinks } = extractLinks(r.text);
    const before = products.size;
    productLinks.forEach(p => products.add(p));
    categoryLinks.forEach(c => allSubCats.add(c));

    /* Stop if no new products found on this page */
    if (products.size === before && page > 1) break;
    if (productLinks.length === 0) break;

    page++;
    await sleep(REQUEST_DELAY_MS);
  }

  return products;
}

async function discoverCategories() {
  console.log(`Discovering sub-categories under root...`);
  const visited = new Set();
  const toVisit = [ROOT_CATEGORY];
  const allProducts = new Set();
  const limitCats = parseInt(process.env.LIMIT_CATEGORIES || '0', 10);

  while (toVisit.length > 0 && visited.size < 500) {
    const cat = toVisit.shift();
    if (visited.has(cat)) continue;
    visited.add(cat);

    if (limitCats > 0 && visited.size > limitCats) break;

    console.log(`  [${visited.size}] Crawling ${decodeURIComponent(cat.replace(BASE, ''))}...`);

    const subCats = new Set();
    const products = await collectFromCategory(cat, subCats);
    products.forEach(p => allProducts.add(p));

    console.log(`     ${products.size} products, ${subCats.size} sub-cats`);

    for (const s of subCats) {
      if (!visited.has(s)) toVisit.push(s);
    }
  }

  console.log(`\n  Total: ${visited.size} categories, ${allProducts.size} product URLs`);
  return { categories: [...visited], products: [...allProducts] };
}

async function processProduct(url, existingFiles) {
  const r = await fetchText(url);
  if (!r.ok) return { url, status: r.notFound ? 'not-found' : 'fetch-failed' };
  const sku = extractSku(r.text);
  if (!sku) return { url, status: 'no-sku' };
  const filename = toFilename(sku);
  const hasData = existingFiles.has(filename);
  return { url, sku, filename, status: hasData ? 'cached' : 'missing' };
}

async function main() {
  console.log('=== Spare Parts SKU Scanner ===\n');

  const existingFiles = new Set(
    fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  );
  console.log(`${existingFiles.size} existing JSON files in data/\n`);

  const { categories, products } = await discoverCategories();

  const limitProducts = parseInt(process.env.LIMIT_PRODUCTS || '0', 10);
  const workingSet = limitProducts > 0 ? products.slice(0, limitProducts) : products;
  console.log(`\nProcessing ${workingSet.length} product URLs (concurrency ${CONCURRENCY})...\n`);

  const results = [];
  const queue = [...workingSet];
  let done = 0;

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      const r = await processProduct(url, existingFiles);
      results.push(r);
      done++;
      if (done % 100 === 0) {
        const missing = results.filter(x => x.status === 'missing').length;
        const cached = results.filter(x => x.status === 'cached').length;
        const nosku = results.filter(x => x.status === 'no-sku').length;
        console.log(`  [${done}/${workingSet.length}] cached=${cached} missing=${missing} no-sku=${nosku}`);
      }
      await sleep(REQUEST_DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const byStatus = {};
  const allSkus = new Set();
  const missing = [];
  const noSku = [];
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    if (r.sku) allSkus.add(r.sku);
    if (r.status === 'missing') missing.push(r);
    if (r.status === 'no-sku') noSku.push(r);
  }

  console.log('\n=== Results ===');
  for (const [s, c] of Object.entries(byStatus)) console.log(`  ${s}: ${c}`);
  console.log(`  Unique SKUs: ${allSkus.size}`);

  const liveSkus = [...allSkus].sort();
  fs.writeFileSync(OUTPUT_SKUS, [
    '# Spare parts SKUs from live category tree',
    `# Generated: ${new Date().toISOString()}`,
    `# Total: ${liveSkus.length}`,
    '',
    ...liveSkus
  ].join('\n') + '\n');
  console.log(`\n\u2713 ${liveSkus.length} spare-part SKUs \u2192 data/spare-parts-skus.txt`);

  const uniqueMissing = [...new Set(missing.map(r => r.sku))].sort();
  fs.writeFileSync(OUTPUT_MISSING, [
    '# Missing spare-part SKUs \u2014 present on site, no JSON file',
    `# Generated: ${new Date().toISOString()}`,
    `# Total: ${uniqueMissing.length}`,
    '',
    ...uniqueMissing
  ].join('\n') + '\n');
  console.log(`\u2713 ${uniqueMissing.length} missing spare-part SKUs \u2192 data/missing-spare-parts.txt`);

  fs.writeFileSync(REPORT_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    categoriesCrawled: categories.length,
    productUrlsFound: products.length,
    urlsScanned: workingSet.length,
    summary: byStatus,
    uniqueSkus: allSkus.size,
    missingCount: uniqueMissing.length,
    missingSample: missing.slice(0, 100),
    noSkuSample: noSku.slice(0, 50)
  }, null, 2));
  console.log(`\u2713 Report \u2192 data/spare-parts-scan-report.json`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

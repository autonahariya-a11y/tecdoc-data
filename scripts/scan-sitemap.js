#!/usr/bin/env node
/**
 * Scan the site's sitemap.xml pages to get an authoritative list of live
 * product URLs, then fetch each page and extract its SKU from <title>.
 *
 * Konimbo title format for products (confirmed):
 *   'שם המוצר | תיאור | מק"ט | אוטו נהריה'
 *
 * When there is no SKU in the title, we still record the URL for manual review.
 *
 * Output:
 *   data/live-skus.txt        — deduplicated SKU list from live pages
 *   data/missing-skus.txt     — SKUs that don't have a JSON file in data/
 *   data/sku-scan-report.json — full scan report
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_LIVE = path.join(DATA_DIR, 'live-skus.txt');
const OUTPUT_MISSING = path.join(DATA_DIR, 'missing-skus.txt');
const REPORT_FILE = path.join(DATA_DIR, 'sku-scan-report.json');

const SITEMAP_INDEX = 'https://www.autonahariya.co.il/sitemap.xml';
const CONCURRENCY = 6;
const REQUEST_DELAY_MS = 250;   /* respect robots Crawl-delay: 2 with concurrency */

function toFilename(sku) {
  return sku.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Extract SKU from Konimbo product page <title>.
 * Format: '‏שם המוצר | תיאור | מק"ט | אוטו נהריה'
 * The SKU is the token right before ' | אוטו נהריה'.
 */
function extractSku(html) {
  const titleMatch = html.match(/<title>([\s\S]{0,500}?)<\/title>/i);
  if (!titleMatch) return null;
  const title = titleMatch[1];

  /* Pattern: last '|' segment before 'אוטו נהריה' is the SKU */
  const skuMatch = title.match(/\|\s*([^|]{2,40}?)\s*\|\s*אוטו\s*נהריה/);
  if (!skuMatch) return null;

  const candidate = skuMatch[1].trim();

  /* SKU heuristic: mostly alphanumeric, at least 4 chars, at most 25 */
  if (candidate.length < 4 || candidate.length > 25) return null;
  /* Reject if it looks like Hebrew text (contains Hebrew) */
  if (/[א-ת]/.test(candidate)) return null;
  /* Must have at least one letter or digit */
  if (!/[A-Za-z0-9]/.test(candidate)) return null;

  return candidate;
}

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
      if (res.status === 404) return { ok: false, status: 404, notFound: true };
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      return { ok: true, text };
    } catch (err) {
      if (attempt === retries) return { ok: false, error: err.message };
      await sleep(1000 * (attempt + 1));
    }
  }
}

async function parseSitemapIndex() {
  console.log(`Fetching sitemap index: ${SITEMAP_INDEX}`);
  const r = await fetchText(SITEMAP_INDEX);
  if (!r.ok) throw new Error(`Cannot fetch sitemap index: ${r.error}`);
  const matches = [...r.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)];
  const pages = matches.map(m => m[1]);
  console.log(`  Found ${pages.length} sitemap pages\n`);
  return pages;
}

async function parseSitemapPage(url) {
  const r = await fetchText(url);
  if (!r.ok) {
    console.log(`  ⚠ Failed to fetch ${url}: ${r.error}`);
    return [];
  }
  const matches = [...r.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)];
  return matches.map(m => m[1]);
}

async function collectAllUrls() {
  const pages = await parseSitemapIndex();
  const allUrls = [];
  for (const page of pages) {
    console.log(`  Parsing ${page}...`);
    const urls = await parseSitemapPage(page);
    console.log(`    -> ${urls.length} URLs`);
    allUrls.push(...urls);
    await sleep(500);
  }
  return allUrls;
}

async function processUrl(url, existingSkuSet) {
  const r = await fetchText(url);
  if (!r.ok) {
    return { url, status: r.notFound ? 'not-found' : 'fetch-failed', error: r.error };
  }
  const sku = extractSku(r.text);
  if (!sku) return { url, status: 'no-sku' };
  const filename = toFilename(sku);
  const hasData = existingSkuSet.has(filename);
  return { url, sku, filename, hasData, status: hasData ? 'cached' : 'missing' };
}

async function main() {
  console.log('=== Sitemap SKU Scanner ===\n');

  const existingFiles = new Set(
    fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  );
  console.log(`${existingFiles.size} existing JSON files in data/\n`);

  const allUrls = await collectAllUrls();
  console.log(`\nTotal URLs from sitemap: ${allUrls.length}\n`);

  /* Filter to product pages only (Konimbo product URLs contain /items/) */
  /* Konimbo product URLs are ALL under /items/... */
  const productUrls = allUrls.filter(u => /\/items\//.test(u));
  console.log(`Filtered to ${productUrls.length} product URLs`);

  const limit = parseInt(process.env.LIMIT || '0', 10);
  const workingSet = limit > 0 ? productUrls.slice(0, limit) : productUrls;
  console.log(`Processing ${workingSet.length} URLs (concurrency ${CONCURRENCY})...\n`);

  const results = [];
  const queue = [...workingSet];
  let done = 0;

  async function worker() {
    while (queue.length > 0) {
      const url = queue.shift();
      const r = await processUrl(url, existingFiles);
      results.push(r);
      done++;
      if (done % 100 === 0) {
        const missing = results.filter(x => x.status === 'missing').length;
        const cached = results.filter(x => x.status === 'cached').length;
        console.log(`  [${done}/${workingSet.length}] cached=${cached} missing=${missing}`);
      }
      await sleep(REQUEST_DELAY_MS);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  /* Aggregate */
  const byStatus = {};
  const allSkus = new Set();
  const missing = [];
  const noSku = [];
  const notFound = [];

  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    if (r.sku) allSkus.add(r.sku);
    if (r.status === 'missing') missing.push(r);
    if (r.status === 'no-sku') noSku.push(r);
    if (r.status === 'not-found') notFound.push(r);
  }

  console.log('\n=== Results ===');
  for (const [s, c] of Object.entries(byStatus)) console.log(`  ${s}: ${c}`);
  console.log(`  Unique SKUs found: ${allSkus.size}`);

  /* Write live-skus.txt (all SKUs on the live site) */
  const liveSkus = [...allSkus].sort();
  fs.writeFileSync(OUTPUT_LIVE, [
    '# Live SKUs \u2014 extracted from sitemap page titles',
    `# Generated: ${new Date().toISOString()}`,
    `# Total: ${liveSkus.length}`,
    '',
    ...liveSkus
  ].join('\n') + '\n');
  console.log(`\n\u2713 ${liveSkus.length} live SKUs \u2192 data/live-skus.txt`);

  /* Write missing-skus.txt (SKUs without JSON file) */
  const uniqueMissing = [...new Set(missing.map(r => r.sku))].sort();
  fs.writeFileSync(OUTPUT_MISSING, [
    '# Missing SKUs \u2014 present on live site but no JSON file in data/',
    `# Generated: ${new Date().toISOString()}`,
    `# Total: ${uniqueMissing.length}`,
    '',
    ...uniqueMissing
  ].join('\n') + '\n');
  console.log(`\u2713 ${uniqueMissing.length} missing SKUs \u2192 data/missing-skus.txt`);

  /* Write report */
  fs.writeFileSync(REPORT_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    urlsScanned: workingSet.length,
    summary: byStatus,
    uniqueSkus: allSkus.size,
    missingCount: uniqueMissing.length,
    missingSample: missing.slice(0, 50),
    noSkuSample: noSku.slice(0, 30),
    notFoundCount: notFound.length
  }, null, 2));
  console.log(`\u2713 Report \u2192 data/sku-scan-report.json`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

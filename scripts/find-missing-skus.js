#!/usr/bin/env node
/**
 * Find SKUs missing from data/ by scanning live product pages.
 *
 * Strategy:
 *   1. Read product_lookup.json to get all product URLs from the site
 *   2. Fetch each product page HTML (with concurrency limit)
 *   3. Extract SKU from .code_item element (rendered on client)
 *      — since the SKU appears server-side in the page HTML too,
 *        a simple regex against the raw HTML works
 *   4. Compare against existing data/*.json files
 *   5. Write missing SKUs to data/missing-skus.txt
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOOKUP_FILE = path.join(__dirname, '..', 'product_lookup.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'missing-skus.txt');
const REPORT_FILE = path.join(DATA_DIR, 'sku-scan-report.json');

const CONCURRENCY = 8;
const REQUEST_DELAY_MS = 150;

function toFilename(sku) {
  return sku.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/**
 * Extract SKU from raw HTML of a Konimbo product page.
 * The SKU is typically inside a class="code_item" span, e.g.:
 *   <span class="code_item">מק"ט: 04152YZZA6</span>
 * Or inside a data attribute / meta property.
 */
function extractSku(html) {
  /* Primary: page <title> has stable format '... | SKU | אוטו נהריה' */
  const titleMatch = html.match(/<title>([\s\S]{0,500}?)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    /* Look for SKU between pipes — must be 4+ chars, alphanumeric with optional dash/dot */
    const pipeMatch = title.match(/\|\s*([A-Z0-9][A-Z0-9\-._\s]{2,30}?)\s*\|\s*אוטו\s*נהריה/i);
    if (pipeMatch) {
      let sku = pipeMatch[1].trim();
      /* Reject if it's just numeric AND looks like a year/price (< 4 chars or > 20) */
      if (sku.length >= 4 && sku.length <= 25 && /[A-Z0-9]/i.test(sku)) {
        return sku;
      }
    }
    /* If title has a Konimbo product code before the pipe list */
    const anyPipeMatch = title.match(/\|\s*([A-Z]{1,6}[\s\-\.]?\d{3,10}[A-Z0-9\-]{0,10})\s*\|/);
    if (anyPipeMatch) return anyPipeMatch[1].replace(/\s+/g, '').trim();
  }

  /* Fallback: canonical URL — some products encode SKU at end of URL */
  const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canonMatch) {
    const url = decodeURIComponent(canonMatch[1]);
    /* Look for a SKU-like token at end of URL path */
    const urlSkuMatch = url.match(/-([A-Z][A-Z0-9]{2,4}\d{2,10}[A-Z0-9]*)(?:\/|$)/i) || url.match(/-(\d{7,12})(?:\/|$)/);
    if (urlSkuMatch) return urlSkuMatch[1];
  }

  return null;
}

async function fetchPage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TecDocBot/1.0)' },
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, status: res.status };
    const html = await res.text();
    return { ok: true, html };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function processProduct(kid, entry, existingSkuSet) {
  const url = entry.url;
  if (!url) return { kid, status: 'no-url' };

  const result = await fetchPage(url);
  if (!result.ok) return { kid, url, status: 'fetch-failed', error: result.error || `HTTP ${result.status}` };

  const sku = extractSku(result.html);
  if (!sku) return { kid, url, status: 'no-sku-found' };

  const filename = toFilename(sku);
  const hasData = existingSkuSet.has(filename);
  return { kid, url, sku, filename, hasData, status: hasData ? 'cached' : 'missing' };
}

async function main() {
  console.log('=== Missing SKU Finder ===\n');

  const lookup = JSON.parse(fs.readFileSync(LOOKUP_FILE, 'utf-8'));
  const products = Object.entries(lookup);
  console.log(`Loaded ${products.length} products from product_lookup.json`);

  /* Build set of existing data filenames for O(1) lookup */
  const existingFiles = new Set(
    fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))
  );
  console.log(`Found ${existingFiles.size} existing JSON files in data/\n`);

  const limit = parseInt(process.env.LIMIT || '0', 10);
  const workingSet = limit > 0 ? products.slice(0, limit) : products;
  console.log(`Processing ${workingSet.length} products (concurrency ${CONCURRENCY})...\n`);

  const results = [];
  let done = 0;

  /* Simple concurrency pool */
  const queue = [...workingSet];
  async function worker(id) {
    while (queue.length > 0) {
      const [kid, entry] = queue.shift();
      const r = await processProduct(kid, entry, existingFiles);
      results.push(r);
      done++;
      if (done % 50 === 0) {
        const missing = results.filter(x => x.status === 'missing').length;
        console.log(`  [${done}/${workingSet.length}] processed — ${missing} missing so far`);
      }
      await sleep(REQUEST_DELAY_MS);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  /* Aggregate */
  const byStatus = {};
  const missing = [];
  const noSku = [];
  for (const r of results) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    if (r.status === 'missing') missing.push(r);
    if (r.status === 'no-sku-found') noSku.push(r);
  }

  console.log('\n=== Results ===');
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}`);
  }

  /* Write missing SKUs to file */
  const uniqueMissing = [...new Set(missing.map(r => r.sku))];
  const output = [
    '# Missing SKUs — auto-generated by find-missing-skus.js',
    `# Generated: ${new Date().toISOString()}`,
    `# Total: ${uniqueMissing.length}`,
    '',
    ...uniqueMissing
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`\n✓ Wrote ${uniqueMissing.length} missing SKUs to ${path.relative(process.cwd(), OUTPUT_FILE)}`);

  /* Write full report for debugging */
  fs.writeFileSync(REPORT_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalScanned: workingSet.length,
    summary: byStatus,
    missing: missing.slice(0, 500),   /* cap for repo size */
    noSkuFound: noSku.slice(0, 100)
  }, null, 2));
  console.log(`✓ Wrote detailed report to ${path.relative(process.cwd(), REPORT_FILE)}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

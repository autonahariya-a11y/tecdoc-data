#!/usr/bin/env node
/**
 * Live scan of Air Filter + Oil Filter categories.
 * Uses persistent cookie jar to avoid bot-block redirect page.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const zlib = require('zlib');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REPORT_FILE = path.join(DATA_DIR, 'scan-filters-report.json');

const CATEGORIES = [
  { id: 190161, name: 'פילטר אוויר' },
  { id: 192219, name: 'פילטר שמן' },
];

const CONCURRENCY = 5;
const DELAY_MS = 250;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/* Simple cookie jar */
const cookieJar = new Map();
function setCookies(setCookieHeader) {
  if (!setCookieHeader) return;
  const arr = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const c of arr) {
    const [nameVal] = c.split(';');
    const [name, ...valParts] = nameVal.split('=');
    if (name) cookieJar.set(name.trim(), valParts.join('=').trim());
  }
}
function cookieHeader() {
  const arr = [];
  for (const [k, v] of cookieJar) arr.push(`${k}=${v}`);
  return arr.join('; ');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function toFilename(sku) { return sku.replace(/[^a-zA-Z0-9]/g, '_') + '.json'; }

function req(url, referer, retries = 3) {
  return new Promise((resolve) => {
    const attempt = (attemptsLeft) => {
      const u = new URL(url);
      const headers = {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      };
      if (referer) headers['Referer'] = referer;
      const ck = cookieHeader();
      if (ck) headers['Cookie'] = ck;

      const r = https.request({
        method: 'GET',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers,
        timeout: 25000,
      }, (res) => {
        setCookies(res.headers['set-cookie']);
        // handle redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const newUrl = new URL(res.headers.location, url).toString();
          res.resume();
          return attempt(attemptsLeft); // follow with same retry count; new URL
        }
        const chunks = [];
        let stream = res;
        const enc = res.headers['content-encoding'];
        if (enc === 'gzip') stream = res.pipe(zlib.createGunzip());
        else if (enc === 'deflate') stream = res.pipe(zlib.createInflate());
        else if (enc === 'br') stream = res.pipe(zlib.createBrotliDecompress());
        stream.on('data', c => chunks.push(c));
        stream.on('end', () => {
          const html = Buffer.concat(chunks).toString('utf8');
          // Blocked page has SHORT html (~1.6KB) with these markers - real pages contain the SVG bt_Back to top too
          const isBlocked = html.length < 5000 && /page_no_referer|עבור לדף המבוקש/.test(html);
          if (isBlocked && attemptsLeft > 0) {
            setTimeout(() => attempt(attemptsLeft - 1), 2000);
            return;
          }
          if (isBlocked) return resolve({ ok: false, error: 'blocked' });
          resolve({ ok: true, html, status: res.statusCode });
        });
        stream.on('error', () => attemptsLeft > 0 ? setTimeout(() => attempt(attemptsLeft - 1), 2000) : resolve({ ok: false, error: 'stream_error' }));
      });
      r.on('error', () => attemptsLeft > 0 ? setTimeout(() => attempt(attemptsLeft - 1), 2000) : resolve({ ok: false, error: 'req_error' }));
      r.on('timeout', () => { r.destroy(); attemptsLeft > 0 ? attempt(attemptsLeft - 1) : resolve({ ok: false, error: 'timeout' }); });
      r.end();
    };
    attempt(retries);
  });
}

/* Prime cookies by hitting home page */
async function primeCookies() {
  console.log('Priming cookies...');
  const r = await req('https://www.autonahariya.co.il/', null);
  console.log(`  home: status=${r.status}, cookies=${cookieJar.size}`);
  return r.ok;
}

async function getCategoryProductIds(categoryId, catName) {
  const ids = new Set();
  let page = 1;
  const referer = 'https://www.autonahariya.co.il/';
  while (true) {
    const url = page === 1
      ? `https://www.autonahariya.co.il/${categoryId}`
      : `https://www.autonahariya.co.il/${categoryId}?page=${page}`;
    const r = await req(url, referer);
    if (!r.ok) { console.log(`  ${catName} page ${page}: ${r.error}`); break; }
    const before = ids.size;
    const matches = r.html.matchAll(/\/items\/(\d+)/g);
    for (const m of matches) ids.add(m[1]);
    const added = ids.size - before;
    console.log(`  ${catName} page ${page}: +${added} (total ${ids.size})`);
    if (added === 0) break;
    page++;
    if (page > 40) break;
    await sleep(DELAY_MS);
  }
  return Array.from(ids);
}

function extractSku(html) {
  const codeMatch = html.match(/<div\s+class=["']code_item\s+col-xs-4["'][^>]*>\s*([^<\s][^<]*?)\s*<\/div>/);
  if (codeMatch) {
    const sku = codeMatch[1].trim().replace(/\s+/g, ' ');
    if (sku && sku.length >= 3 && sku.length <= 40 && !/^מק/.test(sku)) return sku;
  }
  return null;
}

function extractSecondCode(html) {
  // Try schema.org sku or ProductID
  const m1 = html.match(/"sku"\s*:\s*"([^"]+)"/);
  if (m1) return m1[1];
  return null;
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : null;
}

async function scanProduct(id, category) {
  const url = `https://www.autonahariya.co.il/items/${id}`;
  const r = await req(url, 'https://www.autonahariya.co.il/');
  if (!r.ok) return { id, category, error: r.error };
  const sku = extractSku(r.html);
  const title = extractTitle(r.html);
  return { id, category, sku, title, url };
}

async function runInBatches(items, worker, concurrency) {
  const results = [];
  let i = 0;
  const total = items.length;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      const res = await worker(items[idx], idx);
      results[idx] = res;
      if (idx % 25 === 0) process.stdout.write(`  ${idx}/${total}\n`);
      await sleep(DELAY_MS);
    }
  }
  const workers = Array(Math.min(concurrency, items.length)).fill(0).map(() => next());
  await Promise.all(workers);
  return results;
}

function findCachedFile(sku) {
  const variations = new Set();
  variations.add(sku);
  variations.add(sku.replace(/\s+/g, ''));
  variations.add(sku.replace(/[\s\-\.]/g, ''));
  variations.add(sku.replace(/\s+/g, '').toUpperCase());
  const nospace = sku.replace(/[\s\-\.]/g, '').toUpperCase();
  const hk = nospace.match(/^(\d{5})([\dA-Z]{5})$/);
  if (hk) variations.add(hk[1] + '-' + hk[2]);
  const toy = nospace.match(/^(\d{5})([A-Z0-9]{4})([A-Z0-9]{2})$/);
  if (toy) variations.add(toy[1] + '-' + toy[2] + '-' + toy[3]);

  for (const v of variations) {
    const filename = toFilename(v);
    const p = path.join(DATA_DIR, filename);
    if (fs.existsSync(p)) {
      try {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        const hasVehicles = Array.isArray(data)
          ? (data[0]?.articles?.[0]?.compatibleCars?.length > 0)
          : (data.vehicles?.length > 0 || data.specs?.length > 0);
        return { filename, hasVehicles, variation: v };
      } catch (e) {}
    }
  }
  return null;
}

(async () => {
  console.log('=== Live scan: air + oil filters ===\n');
  await primeCookies();

  const allProducts = [];
  for (const cat of CATEGORIES) {
    console.log(`\n[${cat.name}] category ${cat.id}`);
    const ids = await getCategoryProductIds(cat.id, cat.name);
    for (const id of ids) allProducts.push({ id, category: cat.name });
  }

  const seen = new Set();
  const products = [];
  for (const p of allProducts) if (!seen.has(p.id)) { seen.add(p.id); products.push(p); }
  console.log(`\nTotal unique products: ${products.length}`);
  console.log(`\nFetching products (${CONCURRENCY} concurrent)...\n`);

  const results = await runInBatches(products, (p) => scanProduct(p.id, p.category), CONCURRENCY);

  const withSku = results.filter(r => r.sku);
  const noSku = results.filter(r => !r.sku && !r.error);
  const errors = results.filter(r => r.error);

  const hits = [];
  const misses = [];
  for (const r of withSku) {
    const cached = findCachedFile(r.sku);
    if (cached && cached.hasVehicles) hits.push({ ...r, cached });
    else misses.push({ ...r, cachedButEmpty: !!cached });
  }

  const report = {
    scannedAt: new Date().toISOString(),
    totalProducts: products.length,
    withSku: withSku.length,
    noSku: noSku.length,
    errors: errors.length,
    hits: hits.length,
    misses: misses.length,
    hitDetails: hits.map(h => ({ id: h.id, sku: h.sku, category: h.category, cachedFile: h.cached.filename })),
    missDetails: misses.map(m => ({ id: m.id, sku: m.sku, category: m.category, title: m.title, cachedButEmpty: m.cachedButEmpty })),
    noSkuDetails: noSku.map(n => ({ id: n.id, category: n.category, title: n.title })),
    errorDetails: errors.map(e => ({ id: e.id, category: e.category, error: e.error })),
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${products.length}`);
  console.log(`  With SKU: ${withSku.length}`);
  console.log(`    HITS: ${hits.length}`);
  console.log(`    MISSES: ${misses.length}`);
  console.log(`  No SKU: ${noSku.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`\nReport: ${REPORT_FILE}`);
})();

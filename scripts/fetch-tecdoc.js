#!/usr/bin/env node
/**
 * TecDoc Data Pre-Fetcher (v2 — with OEM fallback)
 *
 * Reads a list of article numbers from data/articles.txt (one per line),
 * fetches TecDoc data for each, and saves individual JSON files to data/.
 *
 * Search strategy per article:
 *   1. partsCompatibleVehiclesByArticleNo (tries all variations)
 *   2. Fallback: partsSearchArticlesByOem (for original manufacturer OEM numbers)
 *      — then fetch full details for the returned articleId
 *
 * When OEM fallback is used, the ORIGINAL OEM manufacturer name (e.g. TOYOTA,
 * CITROËN) is preserved as `originalManufacturer`, while `supplier` reflects
 * the aftermarket supplier that TecDoc actually returned.
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
  if (res.status === 401 || res.status === 403) {
    const errText = await res.text().catch(() => '');
    throw new Error(`APIFY_AUTH_FAILED (HTTP ${res.status}): ${errText.slice(0, 200)}`);
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`APIFY_HTTP_${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function verifyToken() {
  console.log('Verifying Apify token with a probe call...');
  const data = await apiCall({
    endpoint_partsCompatibleVehiclesByArticleNo: true,
    parts_articleNo_20: 'OC 1183',
    parts_langId_20: 4,
    parts_countryFilterId_20: 81,
    parts_typeId_20: 1
  });
  if (!data || !data.length || !data[0].articles || !data[0].articles.length) {
    throw new Error('APIFY_PROBE_FAILED: token accepted but probe returned no data.');
  }
  console.log(`  \u2713 Token valid — probe returned ${data[0].articles.length} article(s)\n`);
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
  /* Add dashed OEM variation for numbers like "04152YZZA6" -> "04152-YZZA6" */
  const dashed = artNo.replace(/^(\d{4,6})([A-Z].+)$/i, '$1-$2');
  if (dashed !== artNo) variations.push(dashed);
  return [...new Set(variations)];
}

/**
 * Fetch complete data by articleId (specs, OE numbers, compatible vehicles).
 */
async function fetchDetailsByArticleId(articleId) {
  const result = { specs: [], oe: [], ean: '', vehicles: [] };

  const detailData = await apiCall({
    endpoint_partsArticleDetailsByArticleId: true,
    parts_articleId_13: articleId,
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
      result.product = det.article.articleProductName || '';
      result.supplier = det.article.supplierName || '';
      result.articleNo = det.article.articleNo || '';
    }
  }

  await sleep(DELAY_MS);

  /* Fetch compatible vehicles via the article's canonical articleNo */
  if (result.articleNo) {
    const vehicleData = await apiCall({
      endpoint_partsCompatibleVehiclesByArticleNo: true,
      parts_articleNo_20: result.articleNo,
      parts_langId_20: 4,
      parts_countryFilterId_20: 81,
      parts_typeId_20: 1
    });
    if (vehicleData && vehicleData.length && vehicleData[0].articles && vehicleData[0].articles.length) {
      result.vehicles = vehicleData[0].articles[0].compatibleCars || [];
    }
  }

  return result;
}

/**
 * OEM search fallback — for original manufacturer part numbers that TecDoc
 * only knows via cross-reference (e.g. Toyota 04152YZZA6 → Bosch 0 986 4B7 013).
 */
async function fetchByOem(oemNo) {
  console.log(`    Trying OEM search for ${oemNo}...`);
  const variations = articleVariations(oemNo);

  for (const variant of variations) {
    const data = await apiCall({
      endpoint_partsSearchArticlesByOem: true,
      parts_langId_29: 4,
      parts_articleOemNo_29: variant
    });

    if (data && data.length && data[0].articleId) {
      const first = data[0];
      /* originalManufacturer = the manufacturer that owns this OEM number */
      const originalMfr = first.manufacturerName || '';
      const articleId = first.articleId;
      console.log(`    ✓ OEM match: ${originalMfr} → ${first.articleNo} by ${first.supplierName} (articleId ${articleId})`);

      await sleep(DELAY_MS);
      const details = await fetchDetailsByArticleId(articleId);

      return {
        articleNo: oemNo,                    /* preserve user's original SKU */
        articleId: articleId,
        supplier: details.supplier || first.supplierName || '',
        product: details.product || first.articleProductName || '',
        originalManufacturer: originalMfr,   /* NEW — Toyota/Citroën/etc. */
        matchedArticleNo: details.articleNo, /* the aftermarket article number that matched */
        vehicles: details.vehicles || [],
        specs: details.specs || [],
        oe: details.oe || [],
        ean: details.ean || '',
        source: 'oem-search',
        fetchedAt: new Date().toISOString()
      };
    }
    if (variations.length > 1) await sleep(DELAY_MS);
  }
  return null;
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
    /* Fallback: try OEM search for original-manufacturer parts */
    console.log(`  ⚠ articleNo lookup failed — trying OEM fallback...`);
    const oemResult = await fetchByOem(articleNo);
    if (oemResult) return oemResult;
    console.log(`  ⚠ No results found for ${articleNo} (tried ${variations.length} articleNo variations + OEM fallback)`);
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
    source: 'article-search',
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
  console.log('=== TecDoc Data Pre-Fetcher (v2 with OEM fallback) ===\n');

  if (!fs.existsSync(ARTICLES_FILE)) {
    console.error(`Error: ${ARTICLES_FILE} not found.`);
    process.exit(1);
  }

  const articles = fs.readFileSync(ARTICLES_FILE, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  console.log(`Found ${articles.length} articles to process.\n`);

  try {
    await verifyToken();
  } catch (err) {
    console.error(`\n✗ Aborting: ${err.message}`);
    console.error('Update the APIFY_TOKEN secret in the repo and re-run.\n');
    process.exit(2);
  }

  /* Force-refetch mode — set FORCE_REFETCH=1 to ignore cache freshness */
  const forceRefetch = process.env.FORCE_REFETCH === '1';
  /* Only-missing mode — skip anything already present regardless of age */
  const onlyMissing = process.env.ONLY_MISSING === '1';

  if (forceRefetch) console.log('⚠ FORCE_REFETCH mode: ignoring cache freshness.\n');
  if (onlyMissing) console.log('⚠ ONLY_MISSING mode: skipping any article that has an existing file.\n');

  let success = 0;
  let failed = 0;
  let skipped = 0;
  let oemMatches = 0;

  for (let i = 0; i < articles.length; i++) {
    const articleNo = articles[i];
    const filename = toFilename(articleNo);
    const filepath = path.join(DATA_DIR, filename);

    console.log(`[${i + 1}/${articles.length}] ${articleNo}`);

    if (fs.existsSync(filepath)) {
      if (onlyMissing) {
        console.log(`  ✓ Already exists — skipping (ONLY_MISSING)\n`);
        skipped++;
        continue;
      }
      if (!forceRefetch) {
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
    }

    try {
      const data = await fetchArticle(articleNo);
      if (data) {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        const via = data.source === 'oem-search' ? ' [via OEM]' : '';
        console.log(`  ✓ Saved${via} → ${filename} (${data.vehicles.length} vehicles, ${data.specs.length} specs, ${data.oe.length} OE)\n`);
        success++;
        if (data.source === 'oem-search') oemMatches++;
      } else {
        failed++;
        console.log('');
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}\n`);
      failed++;
      if (err.message && err.message.startsWith('APIFY_AUTH_FAILED')) {
        console.error('\n✗ Auth failure detected mid-run — aborting to save API credits.');
        process.exit(3);
      }
    }

    if (i < articles.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('=== Summary ===');
  console.log(`Total: ${articles.length}`);
  console.log(`Success: ${success} (${oemMatches} via OEM fallback)`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

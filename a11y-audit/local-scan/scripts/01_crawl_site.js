/**
 * 01_crawl_site.js
 * Discovers every URL on the site via:
 *   1. sitemap.xml (and any nested sitemap index files)
 *   2. BFS crawl of internal links from the homepage (same-origin only)
 * Writes config/site_map.json => [{ url, page_type, source }]
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const cfg = require('../config/settings');

function abs(p) {
  return path.join(__dirname, '..', p);
}

function shouldSkip(url) {
  return cfg.SKIP_PATTERNS.some((re) => re.test(url));
}

function classifyPageType(url) {
  const u = url.toLowerCase();
  if (u === cfg.BASE_URL + '/' || u === cfg.BASE_URL) return 'home';
  if (/\/(book|booking|checkout|cart)/.test(u)) return 'booking_flow';
  if (/\/(tour|tours|experience|product)/.test(u)) return 'product_listing_or_pdp';
  if (/\/(manage|my-booking)/.test(u)) return 'manage_bookings';
  if (/\/(help|support|faq)/.test(u)) return 'help_support';
  if (/\/(about)/.test(u)) return 'about_us';
  if (/\/(group|private-hire)/.test(u)) return 'group_booking';
  if (/\/(things-to-do)/.test(u)) return 'things_to_do';
  if (/\/(terms|privacy|legal|sitemap)/.test(u)) return 'legal_sitemap';
  if (/\/(service-update|route)/.test(u)) return 'service_updates_routes';
  return 'other';
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function getSitemapUrls() {
  const urls = new Set();
  const toVisit = [cfg.SITEMAP_URL];
  const visited = new Set();

  while (toVisit.length) {
    const smUrl = toVisit.pop();
    if (visited.has(smUrl)) continue;
    visited.add(smUrl);
    try {
      const xml = await fetchText(smUrl);
      // Nested sitemap index
      const sitemapMatches = [...xml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)];
      if (sitemapMatches.length) {
        for (const m of sitemapMatches) toVisit.push(m[1].trim());
        continue;
      }
      const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
      for (const m of locMatches) urls.add(m[1].trim());
    } catch (e) {
      console.warn(`[sitemap] could not fetch ${smUrl}: ${e.message}`);
    }
  }
  return urls;
}

async function bfsCrawl(seedUrls, existing) {
  const origin = new URL(cfg.BASE_URL).origin;
  const found = new Set(existing);
  const queue = [{ url: cfg.BASE_URL, depth: 0 }];
  const visited = new Set();

  const browser = await chromium.launch();
  const context = await browser.newContext();

  try {
    while (queue.length) {
      if (cfg.MAX_PAGES && found.size >= cfg.MAX_PAGES) break;
      const { url, depth } = queue.shift();
      const normalized = url.split('#')[0];
      if (visited.has(normalized) || depth > cfg.CRAWL_DEPTH) continue;
      visited.add(normalized);

      let page;
      try {
        page = await context.newPage();
        await page.goto(normalized, { timeout: cfg.NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' });
        const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
        for (const href of hrefs) {
          try {
            const u = new URL(href);
            if (u.origin !== origin) continue;
            const clean = u.origin + u.pathname; // drop query/hash for dedupe
            if (shouldSkip(clean)) continue;
            if (!found.has(clean)) {
              found.add(clean);
              queue.push({ url: clean, depth: depth + 1 });
            }
          } catch (_) {
            /* ignore malformed hrefs */
          }
        }
      } catch (e) {
        console.warn(`[crawl] failed ${normalized}: ${e.message}`);
      } finally {
        if (page) await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  return found;
}

(async () => {
  console.log('[1/4] Discovering URLs from sitemap.xml ...');
  const sitemapUrls = await getSitemapUrls();
  console.log(`  found ${sitemapUrls.size} URLs in sitemap(s)`);

  console.log('[1/4] BFS-crawling internal links from homepage ...');
  const allUrls = await bfsCrawl(sitemapUrls, sitemapUrls);
  console.log(`  total unique URLs after crawl: ${allUrls.size}`);

  let list = [...allUrls]
    .filter((u) => !shouldSkip(u))
    .map((u) => ({ url: u, page_type: classifyPageType(u) }));

  if (cfg.MAX_PAGES) list = list.slice(0, cfg.MAX_PAGES);

  const outPath = abs(cfg.SITE_MAP_FILE);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(list, null, 2));
  console.log(`[1/4] Wrote ${list.length} pages to ${cfg.SITE_MAP_FILE}`);

  const byType = {};
  for (const p of list) byType[p.page_type] = (byType[p.page_type] || 0) + 1;
  console.log('  breakdown by page_type:', byType);
})();

/**
 * 07_verify_backdrops.js
 * Settles the "is this contrast failure real?" question for every flagged
 * element, by determining what the text is ACTUALLY sitting on.
 *
 * Computed styles alone cannot answer this: when text sits on a hero image or
 * a gradient, `background-color` is transparent all the way up the tree, and a
 * naive walk falls through to the page background — reporting e.g.
 * "white on #f8f5ef = 1.09:1" for a hero heading that is perfectly legible on
 * a photo. This script classifies each case instead of guessing:
 *
 *   REAL_FAIL        flat opaque backdrop, ratio genuinely below threshold
 *   ON_IMAGE         text sits on a background-image  -> needs scrim check
 *   ON_GRADIENT      text sits on a gradient          -> needs scrim check
 *   OVER_MEDIA       an <img>/<video> renders behind the text box
 *   PASSES           recomputed against the true backdrop, it actually passes
 *
 * Produces:
 *   data/backdrop_verification.json  machine-readable verdicts
 *   output/verify-backdrops.html     visual report — element crops side by side,
 *                                    grouped by verdict, so a human can confirm
 *                                    a whole cluster in one glance
 *
 * Usage: node scripts/07_verify_backdrops.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const cfg = require('../config/settings');
const { parseColor, contrastRatio, toHex, compositeOver } = require('./lib/contrast');

const abs = (p) => path.join(__dirname, '..', p);
const OUT_JSON = 'data/backdrop_verification.json';
const OUT_HTML = 'output/verify-backdrops.html';
const CROP_DIR = 'data/crops';

function requiredRatio(px, weight) {
  const large = px >= 24 || (px >= 18.66 && weight >= 700);
  return large ? 3.0 : 4.5;
}

/** Collect the selectors we need to adjudicate, from the contrast pass. */
function collectTargets() {
  const file = abs(cfg.CONTRAST_FILE);
  if (!fs.existsSync(file)) {
    console.error(`Missing ${cfg.CONTRAST_FILE} — run "npm run contrast" first.`);
    process.exit(1);
  }
  const findings = JSON.parse(fs.readFileSync(file, 'utf8'));
  const byUrl = new Map();
  for (const f of findings) {
    if (!f.selector) continue;
    if (!byUrl.has(f.url)) byUrl.set(f.url, []);
    byUrl.get(f.url).push(f);
  }
  return byUrl;
}

async function verifyOnPage(page, url, findings, cropDir) {
  const out = [];
  await page.goto(url, { timeout: cfg.NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  for (const f of findings) {
    let rec = { url, selector: f.selector, reported: f };
    try {
      const loc = page.locator(f.selector).first();
      if (!(await loc.count())) { rec.verdict = 'NOT_FOUND'; out.push(rec); continue; }

      // What is genuinely behind this text?
      const probe = await loc.evaluate((node) => {
        const cs = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const res = {
          color: cs.color,
          fontSize: parseFloat(cs.fontSize),
          fontWeight: parseInt(cs.fontWeight, 10) || 400,
          ownBg: cs.backgroundColor,
          ownBgImage: cs.backgroundImage,
          chain: [],
          mediaBehind: false
        };
        // Walk ancestors recording the first meaningful paint layer
        let el = node;
        let depth = 0;
        while (el && depth < 25) {
          const s = getComputedStyle(el);
          const entry = {
            tag: el.tagName.toLowerCase(),
            cls: (typeof el.className === 'string' ? el.className : '').slice(0, 80),
            bg: s.backgroundColor,
            bgImage: s.backgroundImage !== 'none' ? s.backgroundImage.slice(0, 90) : null
          };
          res.chain.push(entry);
          if (entry.bgImage) { res.paintLayer = 'image'; res.paintDetail = entry.bgImage; break; }
          const m = s.backgroundColor.match(/rgba?\(([^)]+)\)/);
          if (m) {
            const p = m[1].split(',').map(Number);
            const a = p[3] === undefined ? 1 : p[3];
            if (a === 1) { res.paintLayer = 'color'; res.paintDetail = `rgb(${p[0]}, ${p[1]}, ${p[2]})`; break; }
          }
          el = el.parentElement;
          depth++;
        }
        // Is an <img>/<video>/<canvas>/<svg> painted behind this box?
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const stack = document.elementsFromPoint(cx, cy) || [];
        for (const s of stack) {
          const t = s.tagName.toLowerCase();
          if (['img', 'video', 'canvas', 'picture'].includes(t)) { res.mediaBehind = true; res.mediaTag = t; break; }
          if (t === 'svg' && s !== node && !node.contains(s)) { res.mediaBehind = true; res.mediaTag = 'svg'; break; }
        }
        return res;
      });

      const fg = parseColor(probe.color);
      const need = requiredRatio(probe.fontSize, probe.fontWeight);
      rec.font = { size: probe.fontSize, weight: probe.fontWeight, required: need };
      rec.fg = fg ? toHex(fg) : null;
      rec.paintLayer = probe.paintLayer || 'none';
      rec.paintDetail = probe.paintDetail || null;

      if (probe.mediaBehind) {
        rec.verdict = 'OVER_MEDIA';
        rec.note = `A <${probe.mediaTag}> is painted behind this text. Contrast depends on the image itself — check the busiest/lightest part of the photo, and add a scrim or text shadow if the text is not legible everywhere.`;
      } else if (probe.paintLayer === 'image') {
        rec.verdict = /gradient/i.test(probe.paintDetail || '') ? 'ON_GRADIENT' : 'ON_IMAGE';
        rec.note = `Backdrop is ${rec.verdict === 'ON_GRADIENT' ? 'a gradient' : 'a background-image'}: ${probe.paintDetail}. A computed ratio is meaningless here — verify against the lightest point.`;
      } else if (probe.paintLayer === 'color') {
        const bg = parseColor(probe.paintDetail);
        if (fg && bg) {
          const ratio = contrastRatio(compositeOver(fg, bg), bg);
          rec.trueBg = toHex(bg);
          rec.trueRatio = Number(ratio.toFixed(2));
          rec.verdict = ratio < need ? 'REAL_FAIL' : 'PASSES';
          rec.note = ratio < need
            ? `Genuine failure on a flat backdrop: ${toHex(fg)} on ${toHex(bg)} = ${ratio.toFixed(2)}:1, needs ${need}:1.`
            : `Recomputed against the true backdrop it PASSES at ${ratio.toFixed(2)}:1 — the original flag was a false positive.`;
        } else rec.verdict = 'UNKNOWN';
      } else {
        rec.verdict = 'UNKNOWN';
        rec.note = 'No paint layer found in 25 ancestors.';
      }

      // Crop for the visual report
      try {
        const safe = (f.selector.replace(/[^a-z0-9]/gi, '_').slice(0, 60)) + '_' + Math.random().toString(36).slice(2, 7);
        const crop = `${safe}.png`;
        await loc.screenshot({ path: path.join(cropDir, crop) });
        rec.crop = crop;
      } catch (_) { /* element may be off-screen */ }
    } catch (e) {
      rec.verdict = 'ERROR';
      rec.note = e.message.slice(0, 120);
    }
    out.push(rec);
  }
  return out;
}

function buildHtml(results) {
  const groups = {};
  for (const r of results) (groups[r.verdict] = groups[r.verdict] || []).push(r);
  const order = ['REAL_FAIL', 'PASSES', 'ON_IMAGE', 'ON_GRADIENT', 'OVER_MEDIA', 'UNKNOWN', 'NOT_FOUND', 'ERROR'];
  const meta = {
    REAL_FAIL: ['#e30910', 'Genuine failures — fix these', 'Flat opaque backdrop, ratio verified below the WCAG threshold. Safe for a developer to action directly.'],
    PASSES: ['#16a34a', 'False positives — no action', 'Recomputed against the real backdrop, these pass. They were artefacts of the earlier backdrop guess.'],
    ON_IMAGE: ['#f59e0b', 'On a background image — human check', 'Ratio cannot be computed from styles. Check the lightest area of the image; add a scrim if needed.'],
    ON_GRADIENT: ['#f59e0b', 'On a gradient — human check', 'Same as above; check the lightest stop of the gradient.'],
    OVER_MEDIA: ['#f59e0b', 'Over a photo/video — human check', 'An image or video element paints behind this text.'],
    UNKNOWN: ['#737373', 'Undetermined', 'Could not resolve a paint layer.'],
    NOT_FOUND: ['#737373', 'Element not found', 'Selector no longer matches — content may be dynamic.'],
    ERROR: ['#737373', 'Errored', 'See note.']
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let html = `<!doctype html><meta charset="utf-8"><title>Backdrop verification</title>
<style>
 body{font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;background:#fafafa;color:#171717}
 header{background:#164291;color:#fff;padding:28px 40px}
 header h1{margin:0 0 6px;font-size:26px}
 header p{margin:0;opacity:.85;max-width:900px}
 .summary{display:flex;gap:10px;flex-wrap:wrap;padding:20px 40px;background:#fff;border-bottom:1px solid #e5e5e5}
 .pill{padding:8px 14px;border-radius:999px;font-weight:700;font-size:13px;color:#fff}
 section{padding:26px 40px}
 h2{font-size:19px;margin:0 0 4px}
 .desc{color:#525252;margin:0 0 16px;max-width:900px}
 .row{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid #e5e5e5;border-radius:10px;padding:12px;margin-bottom:10px}
 .row img{max-width:320px;max-height:120px;border:1px solid #d4d4d4;border-radius:6px;background:#fff}
 .meta{flex:1;min-width:0}
 code{background:#f3f4f6;padding:1px 5px;border-radius:4px;font-size:12px;word-break:break-all}
 .note{color:#525252;margin-top:6px}
 .swatch{display:inline-block;width:13px;height:13px;border:1px solid #999;vertical-align:-2px;border-radius:3px;margin-right:4px}
</style>
<header><h1>Backdrop verification</h1>
<p>Each flagged element was re-inspected to find what it is <em>actually</em> sitting on. Confirm the amber groups by eye — one glance per group is usually enough, since a whole cluster is normally the same component repeated.</p></header>
<div class="summary">`;
  for (const k of order) if (groups[k]) html += `<span class="pill" style="background:${meta[k][0]}">${k}: ${groups[k].length}</span>`;
  html += `</div>`;

  for (const k of order) {
    const list = groups[k];
    if (!list) continue;
    html += `<section><h2 style="color:${meta[k][0]}">${meta[k][1]} — ${list.length}</h2><p class="desc">${meta[k][2]}</p>`;
    for (const r of list.slice(0, 120)) {
      html += `<div class="row">`;
      if (r.crop) html += `<img src="../data/crops/${esc(r.crop)}" alt="">`;
      html += `<div class="meta"><code>${esc(r.selector)}</code><div class="note">`;
      if (r.fg) html += `<span class="swatch" style="background:${esc(r.fg)}"></span>text ${esc(r.fg)} `;
      if (r.trueBg) html += `&nbsp;<span class="swatch" style="background:${esc(r.trueBg)}"></span>on ${esc(r.trueBg)} = <b>${esc(r.trueRatio)}:1</b> (needs ${esc(r.font && r.font.required)}:1)`;
      html += `</div><div class="note">${esc(r.note || '')}</div>`;
      html += `<div class="note" style="font-size:12px;opacity:.7">${esc(r.url)}</div></div></div>`;
    }
    if (list.length > 120) html += `<p class="desc">…and ${list.length - 120} more (see JSON).</p>`;
    html += `</section>`;
  }
  return html;
}

(async () => {
  const byUrl = collectTargets();
  const cropDir = abs(CROP_DIR);
  fs.mkdirSync(cropDir, { recursive: true });
  fs.mkdirSync(abs('output'), { recursive: true });

  const total = [...byUrl.values()].reduce((n, a) => n + a.length, 0);
  console.log(`[verify] Adjudicating ${total} flagged elements across ${byUrl.size} pages ...`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const results = [];
  let n = 0;
  for (const [url, findings] of byUrl) {
    try {
      const r = await verifyOnPage(page, url, findings, cropDir);
      results.push(...r);
    } catch (e) {
      console.warn(`  [verify] ${url}: ${e.message}`);
    }
    n++;
    process.stdout.write(`\r  ${n}/${byUrl.size} pages`);
  }
  await browser.close();
  console.log('');

  fs.writeFileSync(abs(OUT_JSON), JSON.stringify(results, null, 2));
  fs.writeFileSync(abs(OUT_HTML), buildHtml(results));

  const counts = {};
  for (const r of results) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  console.log('\n[verify] VERDICTS:');
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(4)}  ${k}`);
  console.log(`\n  Machine-readable: ${OUT_JSON}`);
  console.log(`  Visual report:    ${OUT_HTML}   <-- open this in a browser`);
  console.log('\n  REAL_FAIL rows are safe for a developer to fix directly.');
  console.log('  ON_IMAGE / ON_GRADIENT / OVER_MEDIA need one human glance each (grouped for speed).');
})();

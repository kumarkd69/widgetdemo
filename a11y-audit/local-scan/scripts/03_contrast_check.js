/**
 * 03_contrast_check.js
 * For every axe "color-contrast" violation AND every "needs review" incomplete
 * result, re-visits the page, pulls the actual computed styles for the flagged
 * selector, and runs the validated luminance/contrast formula to get a precise
 * ratio + exact hex fix. Cross-references against the Figma token fixes:
 *   - if the live color matches a known-bad token's hex -> "Figma itself needs
 *     the fix" (already tracked in Design Tokens tab)
 *   - if the live color does NOT match any known token hex -> "drift: dev
 *     implemented differently than designed" (flagged separately)
 * Writes data/contrast_findings.json
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const cfg = require('../config/settings');
const seed = require('../config/figma_tokens_seed.json');
const { parseColor, contrastRatio, toHex, compositeOver } = require('./lib/contrast');

function abs(p) {
  return path.join(__dirname, '..', p);
}

function nearestToken(hex) {
  const target = hex.replace('#', '');
  const [tr, tg, tb] = [0, 2, 4].map((i) => parseInt(target.slice(i, i + 2), 16));
  let best = null;
  let bestDist = Infinity;
  for (const t of seed.tokens) {
    if (!t.hex) continue;
    const h = t.hex.replace('#', '');
    if (h.length !== 6) continue;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  return { token: best, distance: bestDist };
}

function requiredRatioFor(fontSizePx, fontWeight) {
  const isLarge = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
  return isLarge ? 3.0 : 4.5;
}

async function reCheckOnPage(browser, url, selectors) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];
  try {
    await page.goto(url, { timeout: cfg.NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' });
    for (const sel of selectors) {
      try {
        const loc = page.locator(sel).first();
        if (!(await loc.count())) continue;
        const style = await loc.evaluate((node) => {
          const cs = getComputedStyle(node);
          return {
            color: cs.color,
            bg: cs.backgroundColor,
            fontSize: parseFloat(cs.fontSize),
            fontWeight: parseInt(cs.fontWeight, 10) || 400
          };
        });
        const fg = parseColor(style.color);
        let bgColor = parseColor(style.bg);
        let bgSource = 'element';

        // Walk up ancestors for an opaque background if this element's own bg is
        // transparent. If we hit a background-image/gradient on the way up, the
        // effective backdrop is a picture, not a flat color — computed styles
        // cannot tell us the actual pixel behind the text, so we must NOT guess.
        // (Guessing white here is what produced the bogus "#ffffff on #ffffff
        // = 1:1" rows in the first run.)
        if (!bgColor || bgColor.a === 0) {
          const resolved = await loc.evaluate((node) => {
            let el = node.parentElement;
            while (el) {
              const cs = getComputedStyle(el);
              if (cs.backgroundImage && cs.backgroundImage !== 'none') {
                return { kind: 'image', detail: cs.backgroundImage.slice(0, 120) };
              }
              const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
              if (m) {
                const p = m[1].split(',').map((s) => parseFloat(s));
                const alpha = p[3] === undefined ? 1 : p[3];
                if (alpha === 1) return { kind: 'color', value: `rgb(${p[0]}, ${p[1]}, ${p[2]})` };
              }
              el = el.parentElement;
            }
            // Nothing opaque found anywhere up the tree: fall back to the
            // document canvas color, which IS knowable.
            const bodyBg = getComputedStyle(document.body).backgroundColor;
            const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
            for (const c of [bodyBg, htmlBg]) {
              const m = c.match(/rgba?\(([^)]+)\)/);
              if (m) {
                const p = m[1].split(',').map((s) => parseFloat(s));
                if ((p[3] === undefined ? 1 : p[3]) === 1) return { kind: 'canvas', value: `rgb(${p[0]}, ${p[1]}, ${p[2]})` };
              }
            }
            return { kind: 'unknown' };
          });

          if (resolved.kind === 'image') {
            // Report for human review rather than inventing a ratio.
            results.push({
              url,
              selector: sel,
              current_fg: toHex(fg),
              current_bg: 'background-image (unresolvable)',
              ratio: null,
              required_ratio: requiredRatioFor(style.fontSize, style.fontWeight),
              font_size_px: style.fontSize,
              font_weight: style.fontWeight,
              classification: 'needs_manual_review',
              suggested_fix:
                `Text sits on a background image (${resolved.detail}). Contrast math cannot resolve this — ` +
                `verify by eye at the darkest and lightest points of the image. If it fails, add a scrim/overlay ` +
                `or a solid text background rather than adjusting the text color alone.`
            });
            continue;
          }
          if (resolved.kind === 'unknown') continue; // cannot judge; do not guess
          bgColor = parseColor(resolved.value);
          bgSource = resolved.kind;
        }
        if (!fg || !bgColor) continue;

        // Identical fg/bg almost always means our backdrop resolution failed
        // rather than a genuine invisible-text bug. Flag, don't assert.
        if (toHex(fg) === toHex(bgColor) && bgSource !== 'element') {
          results.push({
            url,
            selector: sel,
            current_fg: toHex(fg),
            current_bg: toHex(bgColor),
            ratio: 1,
            required_ratio: requiredRatioFor(style.fontSize, style.fontWeight),
            font_size_px: style.fontSize,
            font_weight: style.fontWeight,
            classification: 'needs_manual_review',
            suggested_fix:
              'Foreground and resolved background are identical, which usually means the real backdrop could not ' +
              'be determined from computed styles (image, gradient, canvas or transformed ancestor). Verify by eye ' +
              'before filing — this row is NOT a confirmed failure.'
          });
          continue;
        }

        const compositedFg = compositeOver(fg, bgColor);
        const ratio = contrastRatio(compositedFg, bgColor);
        const needed = requiredRatioFor(style.fontSize, style.fontWeight);
        if (ratio < needed) {
          const fgHex = toHex(compositedFg);
          const nearest = nearestToken(fgHex);
          const isKnownBadToken = nearest.token && nearest.distance < 6 && nearest.token.status && nearest.token.status.startsWith('fail');
          results.push({
            url,
            selector: sel,
            current_fg: fgHex,
            current_bg: toHex(bgColor),
            ratio: Number(ratio.toFixed(2)),
            required_ratio: needed,
            font_size_px: style.fontSize,
            font_weight: style.fontWeight,
            nearest_token: nearest.token ? nearest.token.token : null,
            token_hex_distance: Number(nearest.distance.toFixed(1)),
            classification: isKnownBadToken
              ? 'figma_token_fix_needed'
              : 'live_site_drift_from_figma',
            suggested_fix: isKnownBadToken
              ? nearest.token.fix || 'See Design Tokens tab'
              : `Darken/adjust ${fgHex} to reach ${needed}:1 against ${toHex(bgColor)} (not traced to a known Figma token — likely a dev-only value)`
          });
        }
      } catch (_) {
        /* selector not resolvable in this DOM state — skip */
      }
    }
  } catch (e) {
    console.warn(`  [contrast] ${url}: ${e.message}`);
  } finally {
    await context.close();
  }
  return results;
}

(async () => {
  const rawDir = abs(cfg.RAW_DIR);
  if (!fs.existsSync(rawDir)) {
    console.error(`No ${cfg.RAW_DIR} found — run "npm run scan" first.`);
    process.exit(1);
  }

  const byUrl = new Map();
  for (const file of fs.readdirSync(rawDir)) {
    if (!file.endsWith('.json')) continue;
    const data = JSON.parse(fs.readFileSync(path.join(rawDir, file), 'utf8'));
    if (!data.axe) continue;
    const selectors = new Set();
    for (const v of data.axe.violations || []) {
      if (v.id !== 'color-contrast') continue;
      for (const node of v.nodes || []) {
        for (const t of node.target || []) selectors.add(t);
      }
    }
    for (const inc of data.axe.incomplete || []) {
      if (inc.id !== 'color-contrast') continue;
      for (const node of inc.nodes || []) {
        for (const t of node.target || []) selectors.add(t);
      }
    }
    if (selectors.size) {
      if (!byUrl.has(data.url)) byUrl.set(data.url, new Set());
      for (const s of selectors) byUrl.get(data.url).add(s);
    }
  }

  console.log(`[3/4] Re-checking contrast on ${byUrl.size} pages with flagged selectors ...`);
  const browser = await chromium.launch();
  const all = [];
  for (const [url, selectors] of byUrl) {
    const results = await reCheckOnPage(browser, url, [...selectors]);
    all.push(...results);
    console.log(`  ${url}: ${results.length} confirmed contrast failures`);
  }
  await browser.close();

  fs.writeFileSync(abs(cfg.CONTRAST_FILE), JSON.stringify(all, null, 2));
  const manual = all.filter((r) => r.classification === 'needs_manual_review').length;
  const drift = all.filter((r) => r.classification === 'live_site_drift_from_figma').length;
  const tokenIssue = all.filter((r) => r.classification === 'figma_token_fix_needed').length;
  console.log(`[3/4] Wrote ${all.length} contrast findings to ${cfg.CONTRAST_FILE}`);
  console.log(`  ${tokenIssue} trace to known Figma token fixes`);
  console.log(`  ${drift} are live-site drift not traced to a token`);
  console.log(`  ${manual} need manual review (background image/gradient — not auto-judgeable)`);
})();

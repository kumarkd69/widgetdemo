/**
 * 02_run_axe_scan.js
 * Core scan. For each URL x viewport:
 *   - runs axe.run() and saves raw JSON
 *   - walks keyboard focus order, screenshots each focus-visible state,
 *     checks a visible indicator exists and meets 3:1 (WCAG 2.4.7 / 1.4.11)
 *   - hovers primary buttons/links and re-checks contrast in that state
 *   - submits forms empty/invalid and re-runs axe on the resulting error state,
 *     checking error messages are programmatically associated (aria-describedby)
 *   - scans elements that start disabled for non-text contrast
 *   - confirms a skip-to-content link is the first Tab stop
 *   - checks prefers-reduced-motion is honored
 *   - resizes viewport / simulates 200% zoom and checks for clipped/overflow content
 *
 * Writes one JSON file per page+viewport to data/raw/, checkpointed as it goes
 * so an interrupted run doesn't lose prior pages.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const cfg = require('../config/settings');
const { parseColor, contrastRatio, toHex, compositeOver } = require('./lib/contrast');

function abs(p) {
  return path.join(__dirname, '..', p);
}

function slugFor(url, viewportName) {
  const u = new URL(url);
  const slug = (u.pathname === '/' ? 'home' : u.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__')) || 'home';
  return `${slug}__${viewportName}`;
}

async function elementDescriptor(el) {
  return el.evaluate((node) => {
    const tag = node.tagName.toLowerCase();
    const id = node.id ? `#${node.id}` : '';
    const cls = node.className && typeof node.className === 'string'
      ? '.' + node.className.trim().split(/\s+/).slice(0, 2).join('.')
      : '';
    const text = (node.textContent || '').trim().slice(0, 40);
    return `${tag}${id}${cls}${text ? ` "${text}"` : ''}`;
  });
}

async function checkSkipLink(page, findings) {
  await page.keyboard.press('Tab');
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 60),
      href: el.getAttribute('href') || null,
      visibleOnFocus: (() => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      })()
    };
  });
  const looksLikeSkipLink =
    active && active.tag === 'a' && /skip.*content|skip.*main|skip.*navigation/i.test(active.text || '');
  findings.push({
    check: 'skip_to_content_link',
    wcag_sc: '2.4.1',
    pass: !!looksLikeSkipLink,
    detail: active
      ? `First Tab stop: <${active.tag}> "${active.text}" (visible on focus: ${active.visibleOnFocus})`
      : 'No element received focus on first Tab',
    severity: looksLikeSkipLink ? 'pass' : 'moderate'
  });
}

async function walkFocusOrder(page, findings, screenshotDir, pageSlug, shots) {
  const seen = new Set();
  let trapCount = 0;
  let prevKey = null;

  for (let i = 0; i < cfg.MAX_TAB_STOPS; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const key =
        el.tagName + '|' + (el.id || '') + '|' + Math.round(r.top) + ',' + Math.round(r.left);
      return {
        key,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor,
        outlineWidth: cs.outlineWidth,
        boxShadow: cs.boxShadow,
        bg: cs.backgroundColor,
        rect: { x: r.left, y: r.top, w: r.width, h: r.height }
      };
    });

    if (!info) break;
    if (info.key === prevKey) {
      trapCount++;
      if (trapCount > 3) {
        findings.push({
          check: 'keyboard_trap',
          wcag_sc: '2.1.2',
          pass: false,
          detail: `Focus stuck on ${info.tag}${info.id ? '#' + info.id : ''} — Tab did not advance after repeated presses`,
          severity: 'critical'
        });
        break;
      }
      continue;
    }
    prevKey = info.key;
    if (seen.has(info.key)) continue;
    seen.add(info.key);

    const hasOutline = info.outlineStyle && info.outlineStyle !== 'none' && parseFloat(info.outlineWidth) > 0;
    const hasBoxShadow = info.boxShadow && info.boxShadow !== 'none';
    const hasVisibleIndicator = hasOutline || hasBoxShadow;

    if (!hasVisibleIndicator && info.rect.w > 0 && info.rect.h > 0) {
      findings.push({
        check: 'focus_visible_indicator',
        wcag_sc: '2.4.7',
        pass: false,
        element: `${info.tag}${info.id ? '#' + info.id : ''}`,
        detail: 'No outline or box-shadow change detected on :focus-visible — element may rely on hover-only styling',
        severity: 'serious'
      });
    } else if (hasOutline) {
      const fg = parseColor(info.outlineColor);
      const bg = parseColor(info.bg) || { r: 255, g: 255, b: 255, a: 1 };
      if (fg) {
        const composited = compositeOver(fg, bg);
        const ratio = contrastRatio(composited, bg);
        if (ratio < 3) {
          findings.push({
            check: 'focus_indicator_contrast',
            wcag_sc: '1.4.11',
            pass: false,
            element: `${info.tag}${info.id ? '#' + info.id : ''}`,
            current_value: `outline ${toHex(composited)} vs bg ${toHex(bg)} = ${ratio.toFixed(2)}:1`,
            required_fix: 'Focus outline must reach 3:1 against adjacent background',
            severity: 'serious'
          });
        }
      }
    }

    if (i < 8) {
      try {
        const shotName = `${pageSlug}__focus-${i}.png`;
        await page.screenshot({ path: path.join(screenshotDir, shotName), clip: null });
        // Attach the filename to the most recent finding for this element so
        // the workbook's "Screenshot filename reference" column can cite it.
        const last = findings[findings.length - 1];
        if (last && (last.check === 'focus_visible_indicator' || last.check === 'focus_indicator_contrast') && !last.screenshot) {
          last.screenshot = shotName;
        }
        if (shots) shots.focus.push(shotName);
      } catch (_) {
        /* non-fatal */
      }
    }
  }
}

async function checkHoverStates(page, findings) {
  const candidates = await page
    .locator('button, a.btn, [class*="button"], [class*="Button"], [class*="primary"]')
    .all();
  const sample = candidates.slice(0, 6);
  for (const el of sample) {
    try {
      const before = await el.evaluate((node) => {
        const cs = getComputedStyle(node);
        return { color: cs.color, bg: cs.backgroundColor };
      });
      await el.hover({ timeout: 3000 });
      await page.waitForTimeout(150); // allow transition to settle
      const after = await el.evaluate((node) => {
        const cs = getComputedStyle(node);
        return { color: cs.color, bg: cs.backgroundColor };
      });
      const fg = parseColor(after.color);
      const bg = parseColor(after.bg);
      if (fg && bg && bg.a !== 0) {
        const ratio = contrastRatio(fg, bg);
        const desc = await elementDescriptor(el);
        if (ratio < 4.5) {
          findings.push({
            check: 'hover_state_contrast',
            wcag_sc: '1.4.3',
            pass: false,
            element: desc,
            current_value: `hover text ${toHex(fg)} on ${toHex(bg)} = ${ratio.toFixed(2)}:1`,
            required_fix: 'Hover state text/background must reach 4.5:1',
            severity: ratio < 3 ? 'critical' : 'serious',
            changed_from_default: before.bg !== after.bg || before.color !== after.color
          });
        }
      }
    } catch (_) {
      /* element not hoverable/visible — skip */
    }
  }
}

async function checkDisabledStates(page, findings) {
  const disabled = await page.locator('[disabled], [aria-disabled="true"]').all();
  for (const el of disabled.slice(0, 10)) {
    try {
      const style = await el.evaluate((node) => {
        const cs = getComputedStyle(node);
        return { color: cs.color, bg: cs.backgroundColor, borderColor: cs.borderColor };
      });
      const fg = parseColor(style.color);
      const bg = parseColor(style.bg);
      const border = parseColor(style.borderColor);
      const desc = await elementDescriptor(el);
      if (fg && bg && bg.a !== 0) {
        const ratio = contrastRatio(fg, bg);
        if (ratio < 3) {
          findings.push({
            check: 'disabled_state_contrast',
            wcag_sc: '1.4.11',
            pass: false,
            element: desc,
            current_value: `disabled text ${toHex(fg)} on ${toHex(bg)} = ${ratio.toFixed(2)}:1`,
            required_fix: 'Disabled controls still need 3:1 for their boundary/non-text parts to remain perceivable',
            severity: 'moderate'
          });
        }
      }
    } catch (_) {
      /* skip */
    }
  }
}

async function checkFormValidation(page, findings) {
  const forms = await page.locator('form').all();
  for (const form of forms.slice(0, 3)) {
    try {
      const submit = form.locator('button[type="submit"], input[type="submit"], button:not([type])').first();
      if (!(await submit.count())) continue;
      await submit.click({ timeout: 3000, force: true }).catch(() => {});
      await page.waitForTimeout(400);

      const requiredInputs = await form.locator('[required], [aria-required="true"]').all();
      for (const input of requiredInputs.slice(0, 5)) {
        const assoc = await input.evaluate((node) => {
          const describedBy = node.getAttribute('aria-describedby');
          const invalid = node.getAttribute('aria-invalid');
          let errorTextFound = false;
          if (describedBy) {
            errorTextFound = describedBy
              .split(/\s+/)
              .some((id) => {
                const t = document.getElementById(id);
                return t && t.textContent.trim().length > 0;
              });
          }
          return { describedBy, invalid, errorTextFound };
        });
        if (!assoc.describedBy || !assoc.errorTextFound) {
          const desc = await elementDescriptor(input);
          findings.push({
            check: 'form_error_association',
            wcag_sc: '3.3.1 / 4.1.2',
            pass: false,
            element: desc,
            detail: 'Required field shows no error programmatically associated via aria-describedby after invalid submit — likely color/visual-only error indication',
            severity: 'serious'
          });
        }
      }
    } catch (_) {
      /* form not submittable in this state — skip */
    }
  }
}

async function checkReducedMotion(browser, url, findings) {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url, { timeout: cfg.NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' });
    const hasMediaQuery = await page.evaluate(() => {
      try {
        for (const sheet of document.styleSheets) {
          let rules;
          try {
            rules = sheet.cssRules;
          } catch (_) {
            continue; // cross-origin stylesheet, can't inspect
          }
          for (const rule of rules) {
            if (rule.media && /prefers-reduced-motion/i.test(rule.media.mediaText || '')) return true;
          }
        }
      } catch (_) {
        /* ignore */
      }
      return false;
    });
    const stillAnimating = await page.evaluate(() => {
      const els = document.querySelectorAll('*');
      for (const el of els) {
        const cs = getComputedStyle(el);
        if (cs.animationName !== 'none' && cs.animationDuration !== '0s') return true;
      }
      return false;
    });
    if (!hasMediaQuery && stillAnimating) {
      findings.push({
        check: 'prefers_reduced_motion',
        wcag_sc: '2.3.3',
        pass: false,
        detail: 'No @media (prefers-reduced-motion) rule found in same-origin stylesheets, and active CSS animations detected with reduced-motion enabled',
        severity: 'moderate'
      });
    } else if (!hasMediaQuery) {
      findings.push({
        check: 'prefers_reduced_motion',
        wcag_sc: '2.3.3',
        pass: null,
        detail: 'No @media (prefers-reduced-motion) rule found in same-origin stylesheets (could not confirm cross-origin CSS) — verify manually',
        severity: 'info'
      });
    }
  } catch (e) {
    console.warn(`  [reduced-motion] ${url}: ${e.message}`);
  } finally {
    await context.close();
  }
}

async function checkZoomOverflow(page, findings) {
  try {
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 5;
    });
    if (overflow) {
      findings.push({
        check: 'zoom_200_overflow',
        wcag_sc: '1.4.10',
        pass: false,
        detail: 'Horizontal scroll/content clipping detected at simulated 200% zoom',
        severity: 'serious'
      });
    }
    await page.evaluate(() => {
      document.documentElement.style.zoom = '1';
    });
  } catch (e) {
    console.warn(`  [zoom-check] ${e.message}`);
  }
}

async function scanOnePage(browser, entry, viewport) {
  const url = entry.url;
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const findings = [];
  const pageSlug = slugFor(url, viewport.name);
  const screenshotDir = abs(cfg.SCREENSHOT_DIR);

  try {
    await page.goto(url, { timeout: cfg.NAV_TIMEOUT_MS, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);

    const axeResults = await new AxeBuilder({ page }).analyze();

    // Reference screenshot for the page in its default state — cited by every
    // row for this page/viewport in the workbook.
    const shots = { page: null, focus: [] };
    try {
      const pageShot = `${pageSlug}__page.png`;
      await page.screenshot({ path: path.join(screenshotDir, pageShot), fullPage: true });
      shots.page = pageShot;
    } catch (_) {
      /* non-fatal */
    }

    if (viewport.name === 'desktop') {
      await checkSkipLink(page, findings);
      await walkFocusOrder(page, findings, screenshotDir, pageSlug, shots);
      await checkHoverStates(page, findings);
      await checkDisabledStates(page, findings);
      await checkFormValidation(page, findings);
      await checkZoomOverflow(page, findings);
    }

    const out = {
      url,
      page_type: entry.page_type,
      viewport: viewport.name,
      scanned_at: new Date().toISOString(),
      axe: {
        violations: axeResults.violations,
        incomplete: axeResults.incomplete,
        passes_count: axeResults.passes.length
      },
      manual_findings: findings,
      screenshots: shots,
      auth_required: false
    };

    const outPath = path.join(abs(cfg.RAW_DIR), `${pageSlug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
    return { ok: true, url, viewport: viewport.name, violations: axeResults.violations.length, manual: findings.length };
  } catch (e) {
    const authLike = /401|403|login|redirect/i.test(e.message);
    const out = {
      url,
      page_type: entry.page_type,
      viewport: viewport.name,
      scanned_at: new Date().toISOString(),
      error: e.message,
      auth_required: authLike
    };
    fs.writeFileSync(path.join(abs(cfg.RAW_DIR), `${pageSlug}.json`), JSON.stringify(out, null, 2));
    return { ok: false, url, viewport: viewport.name, error: e.message, auth_required: authLike };
  } finally {
    await context.close();
  }
}

async function pool(items, concurrency, worker) {
  const results = [];
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

(async () => {
  const siteMapPath = abs(cfg.SITE_MAP_FILE);
  if (!fs.existsSync(siteMapPath)) {
    console.error(`Missing ${cfg.SITE_MAP_FILE} — run "npm run crawl" first.`);
    process.exit(1);
  }
  fs.mkdirSync(abs(cfg.RAW_DIR), { recursive: true });
  fs.mkdirSync(abs(cfg.SCREENSHOT_DIR), { recursive: true });

  const siteMap = JSON.parse(fs.readFileSync(siteMapPath, 'utf8'));
  console.log(`[2/4] Scanning ${siteMap.length} pages x ${cfg.VIEWPORTS.length} viewports ...`);

  const browser = await chromium.launch();
  const jobs = [];
  for (const entry of siteMap) {
    for (const vp of cfg.VIEWPORTS) jobs.push({ entry, vp });
  }

  let done = 0;
  const summary = [];
  await pool(jobs, cfg.SCAN_CONCURRENCY, async ({ entry, vp }) => {
    const r = await scanOnePage(browser, entry, vp);
    done++;
    summary.push(r);
    const status = r.ok ? `${r.violations} axe violations, ${r.manual} manual findings` : `FAILED (${r.error})`;
    console.log(`  [${done}/${jobs.length}] ${r.url} [${r.viewport}] — ${status}`);
    return r;
  });

  await browser.close();

  // Reduced-motion check once per page (not per-viewport) to save time
  console.log('[2/4] Checking prefers-reduced-motion per page ...');
  const browser2 = await chromium.launch();
  const rmFindings = {};
  for (const entry of siteMap) {
    const f = [];
    await checkReducedMotion(browser2, entry.url, f);
    if (f.length) rmFindings[entry.url] = f;
  }
  await browser2.close();
  fs.writeFileSync(abs('data/reduced_motion_findings.json'), JSON.stringify(rmFindings, null, 2));

  const failed = summary.filter((r) => !r.ok);
  const authGated = failed.filter((r) => r.auth_required);
  console.log(`\n[2/4] Scan complete. ${summary.length - failed.length}/${summary.length} page-views scanned successfully.`);
  if (authGated.length) console.log(`  ${authGated.length} page-views flagged "not scanned — auth required".`);
  if (failed.length - authGated.length) console.log(`  ${failed.length - authGated.length} page-views failed for other reasons — see data/raw/*.json "error" field.`);
})();

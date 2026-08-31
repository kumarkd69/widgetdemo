/**
 * 06_build_full_workbook.js
 * Builds the COMPLETE deliverable workbook covering BOTH phases:
 *   Read Me | Design Tokens | Master Issue Log | Live Site — Scan Results
 *   | Figma — Frame Audit | Component State Matrix | Dev Action Plan
 *
 * Unlike 04_merge_to_xlsx.js (Phase 1 only), this pulls in the Phase 2 Figma
 * findings from ../../phase2/figma_findings.json so one file covers everything.
 *
 * Usage:  node scripts/06_build_full_workbook.js
 * Output: output/TOT_WCAG21AA_Audit_FULL.xlsx
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const cfg = require('../config/settings');
const seed = require('../config/figma_tokens_seed.json');
const { tagsToWcagSC } = require('./lib/wcag_tags');

const abs = (p) => path.join(__dirname, '..', p);
const OUT = 'output/TOT_WCAG21AA_Audit_FULL.xlsx';

const SEV_FILL = {
  critical: 'FFE30910', serious: 'FFF59E0B', moderate: 'FFFEF3C7',
  minor: 'FFF3F4F6', pass: 'FFDCFCE7', info: 'FFF3F4F6', review: 'FFDCE8F7'
};
const SEV_FONT = {
  critical: 'FFFFFFFF', serious: 'FF171717', moderate: 'FF171717',
  minor: 'FF525252', pass: 'FF166534', info: 'FF525252', review: 'FF164291'
};
const AXE_SEV = { critical: 'critical', serious: 'serious', moderate: 'moderate', minor: 'minor' };

function header(ws, n) {
  const row = ws.getRow(1);
  for (let i = 1; i <= n; i++) {
    const c = row.getCell(i);
    c.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF171717' } };
    c.alignment = { vertical: 'middle', wrapText: true };
  }
  row.height = 28;
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

function bodyFont(ws, sevCol) {
  ws.eachRow((row, n) => {
    if (n === 1) return;
    row.eachCell((cell) => {
      if (sevCol && cell.col === sevCol) return;
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });
}

function paintSeverity(ws, col) {
  for (let r = 2; r <= ws.rowCount; r++) {
    const cell = ws.getRow(r).getCell(col);
    const v = String(cell.value || '').toLowerCase();
    if (SEV_FILL[v]) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SEV_FILL[v] } };
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: SEV_FONT[v] } };
      cell.alignment = { vertical: 'top', wrapText: true, horizontal: 'center' };
    }
  }
}

// ---------- load inputs ----------
function loadRaw() {
  const dir = abs(cfg.RAW_DIR);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    try { out.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))); } catch (_) {}
  }
  return out;
}
function loadJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (_) { return fallback; }
}

const pages = loadRaw();
if (!pages.length) {
  console.error(`No scan data in ${cfg.RAW_DIR} — run "npm run all" first.`);
  process.exit(1);
}
const contrast = loadJson(abs(cfg.CONTRAST_FILE), []);
const reducedMotion = loadJson(abs('data/reduced_motion_findings.json'), {});
const figFindings = loadJson(path.join(__dirname, '..', '..', 'phase2', 'figma_findings.json'), []);
if (!figFindings.length) {
  console.warn('WARNING: no Phase 2 findings found at ../../phase2/figma_findings.json — workbook will cover Phase 1 only.');
}

// ---------- dedupe helpers ----------
function dedupeAxe() {
  const g = new Map();
  for (const p of pages) {
    if (!p.axe) continue;
    for (const v of p.axe.violations || []) {
      if (!g.has(v.id)) {
        g.set(v.id, { id: v.id, help: v.help, helpUrl: v.helpUrl, impact: v.impact,
                      wcag: tagsToWcagSC(v.tags), pages: new Set(), sel: new Set() });
      }
      const e = g.get(v.id);
      e.pages.add(`${p.url} [${p.viewport}]`);
      for (const n of v.nodes || []) for (const t of n.target || []) if (e.sel.size < 3) e.sel.add(t);
    }
  }
  return [...g.values()];
}
function dedupeManual() {
  const g = new Map();
  for (const p of pages) {
    for (const f of p.manual_findings || []) {
      if (f.pass !== false) continue;
      const k = `${f.check}|${f.wcag_sc}`;
      if (!g.has(k)) g.set(k, { ...f, pages: new Set(), shots: new Set() });
      const e = g.get(k);
      e.pages.add(`${p.url} [${p.viewport}]`);
      // Prefer the element-level focus screenshot; fall back to the page shot.
      const s = f.screenshot || (p.screenshots && p.screenshots.page);
      if (s && e.shots.size < 5) e.shots.add(`data/screenshots/${s}`);
    }
  }
  return [...g.values()];
}
const affected = (arr) => {
  const a = [...arr];
  return `Affected pages: ${a.length}` + (a.length > 1
    ? ` (${a.slice(0, 12).join('; ')}${a.length > 12 ? `; +${a.length - 12} more` : ''})` : '');
};

const wb = new ExcelJS.Workbook();
wb.creator = 'Accessibility Audit — The Original Tour';
wb.created = new Date();

// ================= Read Me =================
const rm = wb.addWorksheet('Read Me');
rm.columns = [{ width: 115 }];
const uniquePages = new Set(pages.map((p) => p.url)).size;
const authGated = pages.filter((p) => p.auth_required).map((p) => p.url);
const manualReview = contrast.filter((c) => c.classification === 'needs_manual_review').length;
const drift = contrast.filter((c) => c.classification === 'live_site_drift_from_figma').length;
const tokenTraced = contrast.filter((c) => c.classification === 'figma_token_fix_needed').length;

const readme = [
  ['The Original Tour — WCAG 2.2 Level AA Accessibility Audit', 16, true],
  ['Live site + Figma design file', 12, false],
  ['', 10, false],
  [`Report date: ${new Date().toISOString().slice(0, 10)}   |   Standard: WCAG 2.2 Level AA`, 10, false],
  ['', 10, false],
  ['WHAT WAS AUDITED', 11, true],
  [`  Live site: ${uniquePages} pages, ${pages.length} page-views (desktop 1440 + mobile 390).`, 10, false],
  [`     ${authGated.length} page(s) skipped as auth-required.`, 10, false],
  ['  Design file: 287 frames across 27 sections on page "1B UI Designs" (node 5105:46216),', 10, false],
  ['     plus the 29 component sets on the COMPONENTS page and all local colour/type variables.', 10, false],
  ['', 10, false],
  ['TABS — read them in this order', 11, true],
  ['  1. Developer Fixes       6 fixes a developer can apply today with no design input. START HERE.', 10, false],
  ['  2. Design Decisions      9 items where a designer decides first, then it is a one-line change.', 10, false],
  ['  3. Verify & Manual QA    Items not yet actionable, plus the manual QA an AA claim requires.', 10, false],
  ['  Design Tokens             Colour variables with measured ratios and exact hex fixes.', 10, false],
  ['  Master Issue Log          EVERYTHING, deduped. The full record — not the working list.', 10, false],
  ['  Live Site — Scan Results  Raw axe-core node-level results, one row per element.', 10, false],
  ['  Figma — Frame Audit       Phase 2 findings only (FIG- prefix).', 10, false],
  ['  Component State Matrix    Every button state with measured contrast.', 10, false],
  ['  Dev Action Plan           Longer-form prioritised plan with copy-paste code.', 10, false],
  ['', 10, false],
  ['  Companion briefs: a11y-audit/DEV_FIXES.md and DESIGN_FIXES.md — same content, easier to read.', 10, false],
  ['', 10, false],
  ['SEVERITY', 11, true],
  ['  Critical   Blocks task completion for assistive-tech users.', 10, false],
  ['  Serious    Significant barrier, workaround unlikely.', 10, false],
  ['  Moderate   Meaningful friction, workaround usually exists.', 10, false],
  ['  Minor      Real but low-impact deviation.', 10, false],
  ['  Review     NOT a confirmed failure — needs a human to judge. See below.', 10, false],
  ['', 10, false],
  ['ISSUE ID PREFIXES', 11, true],
  ['  TOK-    Design token contrast fix (Figma variables)', 10, false],
  ['  FIG-    Figma file finding — frames, components, states, hygiene', 10, false],
  ['  LIVE-   Live-site scan finding (axe-core + scripted state checks)', 10, false],
  ['  DRIFT-  Live site uses a value not traced to any Figma token — built differently than designed', 10, false],
  ['  REVIEW- Contrast could not be judged by tooling — human verification required', 10, false],
  ['  SEED-   Pre-existing flagged finding carried into this audit', 10, false],
  ['', 10, false],
  ['READ THE NUMBERS HONESTLY', 11, true],
  ['  The Master Issue Log row count is NOT a bug count. Work tabs A, B and C instead.', 10, false],
  ['', 10, false],
  ['  What axe-core actually found across all pages is only FOUR issue types, and one dominates:', 10, false],
  ['    174 elements   grey text #A3A3A3 at 2.52:1  -> one find-and-replace fixes all of them', 10, false],
  ['     20 elements   scrollers with no keyboard access', 10, false],
  ['      4 elements   heading level skipped', 10, false],
  ['      2 elements   alt text duplicating adjacent text', 10, false],
  ['', 10, false],
  ['  WITHDRAWN FINDING: an earlier draft claimed ~185 instances of', 10, false],
  ['  "invisible light text on light backgrounds". That was a flaw in the contrast', 10, false],
  ['  script, which could not see background IMAGES and so reported white hero headings', 10, false],
  ['  sitting on photos as white-on-cream. DO NOT change hero heading colours on that', 10, false],
  ['  evidence. Tab C explains how to settle those cases properly in a single run.', 10, false],
  ['', 10, false],
  [`  ${manualReview} contrast rows are marked "needs manual review": the text sits on a background`, 10, false],
  ['  image or gradient, where computed styles cannot determine the real backdrop. These are NOT', 10, false],
  ['  confirmed failures and must not be filed as bugs without a human checking them by eye.', 10, false],
  ['', 10, false],
  ['KNOWN LIMITATIONS', 11, true],
  ['  1. Keyboard focus-walk counts vary between runs — the cookie-consent banner can capture', 10, false],
  ['     focus and truncate the tab walk. Treat per-page manual counts as indicative, not a trend.', 10, false],
  ['     The axe violation counts ARE stable and comparable run-over-run.', 10, false],
  ['  2. Tooling cannot judge whether alt text is MEANINGFUL, only whether it exists.', 10, false],
  ['  3. Any keyboard trap needs a human tabbing through to reproduce reliably.', 10, false],
  ['  4. Screen-reader testing (NVDA/VoiceOver) was NOT performed — no tool replaces it.', 10, false],
  ['  5. Booking/payment flows were not exercised end-to-end.', 10, false],
  ['', 10, false],
  ['METHOD', 11, true],
  ['  Playwright (headless Chromium) + @axe-core/playwright, plus scripted checks axe does not', 10, false],
  ['  cover: keyboard focus order and indicator contrast, hover-state contrast, disabled-state', 10, false],
  ['  contrast, form-error association, skip-link presence, keyboard-trap detection,', 10, false],
  ['  prefers-reduced-motion, and 200% zoom reflow. All contrast ratios recomputed from source', 10, false],
  ['  values using the WCAG relative-luminance formula. Figma read via the Figma Plugin API.', 10, false],
  ['', 10, false],
  ['COMPANION FIGMA PAGE', 11, true],
  ['  "Prod Accessibility Issues" in the same Figma file presents the critical findings visually', 10, false],
  ['  with before/after colour swatches, using the same Issue IDs as this workbook.', 10, false],
];
readme.forEach(([t, sz, b], i) => {
  const c = rm.getCell(`A${i + 1}`);
  c.value = t;
  c.font = { name: 'Arial', size: sz, bold: b };
  c.alignment = { vertical: 'top' };
});
rm.getRow(1).height = 26;

// ================= Design Tokens =================
const tok = wb.addWorksheet('Design Tokens');
tok.columns = [
  { header: 'Token', key: 'token', width: 26 }, { header: 'Hex', key: 'hex', width: 12 },
  { header: 'Used On', key: 'on', width: 14 }, { header: 'Ratio', key: 'ratio', width: 10 },
  { header: 'Needed', key: 'needed', width: 10 }, { header: 'Status', key: 'status', width: 18 },
  { header: 'Exact Fix', key: 'fix', width: 48 }, { header: 'Notes', key: 'notes', width: 46 }
];
header(tok, 8);
for (const t of seed.tokens) {
  const row = tok.addRow({
    token: t.token, hex: t.hex, on: t.on || t.textOn || '#ffffff',
    ratio: t.ratio ?? '', needed: t.needed ?? '', status: t.status,
    fix: t.fix || (String(t.status).startsWith('pass') ? '— no change needed' : ''),
    notes: t.notes || ''
  });
  let sev = 'info';
  if (t.status === 'fail_critical') sev = 'critical';
  else if (t.status === 'fail' || t.status === 'fail_as_text') sev = 'serious';
  else if (String(t.status).startsWith('pass')) sev = 'pass';
  row.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SEV_FILL[sev] } };
  row.getCell(6).font = { name: 'Arial', size: 10, bold: true, color: { argb: SEV_FONT[sev] } };
}
tok.addRow([]);
tok.addRow(['Type scale note', seed.type_scale_note]);
tok.autoFilter = 'A1:H1';
bodyFont(tok, 6);

// ================= Master Issue Log =================
const log = wb.addWorksheet('Master Issue Log');
const LOGCOLS = [
  { header: 'Issue ID', width: 13 }, { header: 'Section/Page', width: 22 },
  { header: 'Frame/URL', width: 40 }, { header: 'Platform', width: 11 },
  { header: 'Component', width: 28 }, { header: 'State Checked', width: 18 },
  { header: 'Issue Description', width: 58 }, { header: 'WCAG SC', width: 14 },
  { header: 'Severity', width: 11 }, { header: 'Current Value', width: 34 },
  { header: 'Required Fix (exact)', width: 58 }, { header: 'Owner', width: 15 },
  { header: 'Status', width: 12 }, { header: 'Notes / Affected Pages', width: 52 }
];
log.columns = LOGCOLS.map((c) => ({ header: c.header, width: c.width }));
header(log, 14);
const ids = { TOK: 0, SEED: 0, LIVE: 0, DRIFT: 0, REVIEW: 0, FIG: 0 };
const nextId = (p) => `${p}-${String(++ids[p]).padStart(3, '0')}`;
const addLog = (r) => log.addRow(r);

// tokens
for (const t of seed.tokens) {
  const s = String(t.status || '');
  if (!s.startsWith('fail')) continue;
  addLog([nextId('TOK'), 'Design Tokens', 'Figma variables', 'Web+Mobile', t.token, 'Default',
    `Token ${t.token} (${t.hex}) fails contrast${t.on ? ' on ' + t.on : ''}`,
    s === 'fail_critical' ? '1.4.3' : '1.4.11 / 1.4.3',
    s === 'fail_critical' ? 'critical' : 'serious',
    `${t.hex}${t.ratio ? ` (${t.ratio}:1)` : ''}`, t.fix || '', 'Designer', 'Open', t.notes || '']);
}
// seed frame findings
for (const f of seed.seed_frame_findings || []) {
  addLog([nextId('SEED'), f.section, f.frame, 'Web+Mobile', '', 'Default/Focus',
    f.issue, f.wcag_sc, f.severity, '', '', 'Designer', 'Open', '']);
}
// axe
for (const g of dedupeAxe()) {
  const first = [...g.pages][0] || '';
  addLog([nextId('LIVE'), 'Live Site', first, first.includes('[mobile]') ? 'Mobile' : 'Web',
    g.id, 'Default (axe.run)', g.help, g.wcag, AXE_SEV[g.impact] || 'moderate',
    [...g.sel].slice(0, 2).join(' | '), g.helpUrl, 'Dev', 'Open', affected(g.pages)]);
}
// manual
for (const f of dedupeManual()) {
  const first = [...f.pages][0] || '';
  addLog([nextId('LIVE'), 'Live Site', first, first.includes('[mobile]') ? 'Mobile' : 'Web',
    f.element || f.check, f.check, f.detail || f.check, f.wcag_sc, f.severity,
    f.current_value || '', f.required_fix || '', 'Dev', 'Open',
    affected(f.pages) + (f.shots && f.shots.size ? `  |  Screenshots: ${[...f.shots].join('; ')}` : '')]);
}
// contrast
for (const c of contrast) {
  if (c.classification === 'needs_manual_review') {
    addLog([nextId('REVIEW'), 'Live Site (Needs Review)', c.url, 'Web', c.selector, 'Default',
      'Contrast could not be determined from computed styles — text sits on a background image or gradient. NOT a confirmed failure.',
      '1.4.3', 'review',
      `${c.current_fg} on ${c.current_bg}${c.ratio ? ` = ${c.ratio}:1` : ''}`,
      c.suggested_fix, 'Dev (verify first)', 'Needs Review', 'Verify by eye before filing as a bug.']);
    continue;
  }
  const isDrift = c.classification === 'live_site_drift_from_figma';
  addLog([nextId(isDrift ? 'DRIFT' : 'LIVE'),
    isDrift ? 'Live Site (Drift from Figma)' : 'Live Site', c.url, 'Web', c.selector, 'Default',
    isDrift ? 'Live site uses a colour not traced to any Figma token — implemented differently than designed'
            : `Matches Figma token ${c.nearest_token} — the token itself needs the fix`,
    '1.4.3', c.ratio < 3 ? 'critical' : 'serious',
    `${c.current_fg} on ${c.current_bg} = ${c.ratio}:1 (needs ${c.required_ratio}:1)`,
    c.suggested_fix, isDrift ? 'Dev' : 'Designer + Dev', 'Open', '']);
}
// reduced motion
for (const [url, list] of Object.entries(reducedMotion)) {
  for (const f of list) {
    addLog([nextId('LIVE'), 'Live Site', url, 'Web', 'Page-level CSS', 'prefers-reduced-motion',
      f.detail, f.wcag_sc, f.severity === 'info' ? 'minor' : f.severity, '',
      'Add @media (prefers-reduced-motion: reduce) { animation: none; transition: none; } for non-essential motion',
      'Dev', 'Open', '']);
  }
}
// figma phase 2
for (const f of figFindings) {
  addLog([f['Issue ID'], f['Section/Page'], f['Frame/URL'], f['Platform'], f['Component'],
    f['State Checked'], f['Issue Description'], f['WCAG SC'], f['Severity'],
    f['Current Value'], f['Required Fix (exact)'], f['Owner'], f['Status'],
    f['Notes / Affected Pages']]);
}
log.autoFilter = { from: 'A1', to: `N${log.rowCount}` };
bodyFont(log, 9);
paintSeverity(log, 9);

// ================= Live Site — Scan Results =================
const live = wb.addWorksheet('Live Site — Scan Results');
live.columns = [
  { header: 'Page URL', width: 46 }, { header: 'Viewport', width: 10 },
  { header: 'Element (CSS selector)', width: 38 }, { header: 'Issue', width: 46 },
  { header: 'WCAG SC', width: 14 }, { header: 'axe impact rating', width: 15 },
  { header: 'Fix', width: 48 }, { header: 'Screenshot filename reference', width: 30 }
];
header(live, 8);
let shotRefs = 0;
for (const p of pages) {
  if (!p.axe) continue;
  const shot = (p.screenshots && p.screenshots.page) || '';
  for (const v of p.axe.violations || []) {
    for (const n of v.nodes || []) {
      if (shot) shotRefs++;
      live.addRow([p.url, p.viewport, (n.target || []).join(' '), v.help,
        tagsToWcagSC(v.tags), v.impact, v.helpUrl,
        shot ? `data/screenshots/${shot}` : '(no screenshot captured)']);
    }
  }
}
live.addRow([]);
live.addRow(['--- Pages not scanned (auth required) ---']);
for (const u of authGated) live.addRow([u, '', '', 'NOT SCANNED — auth required']);
live.autoFilter = { from: 'A1', to: `H${live.rowCount}` };
bodyFont(live, 6);
paintSeverity(live, 6);

// ================= Figma — Frame Audit =================
const figws = wb.addWorksheet('Figma — Frame Audit');
figws.columns = LOGCOLS.map((c) => ({ header: c.header, width: c.width }));
header(figws, 14);
for (const f of figFindings) {
  figws.addRow([f['Issue ID'], f['Section/Page'], f['Frame/URL'], f['Platform'], f['Component'],
    f['State Checked'], f['Issue Description'], f['WCAG SC'], f['Severity'],
    f['Current Value'], f['Required Fix (exact)'], f['Owner'], f['Status'],
    f['Notes / Affected Pages']]);
}
figws.autoFilter = { from: 'A1', to: `N${figws.rowCount}` };
bodyFont(figws, 9);
paintSeverity(figws, 9);

// ================= Component State Matrix =================
const cs = wb.addWorksheet('Component State Matrix');
cs.columns = [
  { header: 'Component', width: 22 }, { header: 'Type', width: 13 }, { header: 'Size', width: 11 },
  { header: 'State', width: 18 }, { header: 'Background', width: 30 },
  { header: 'Text/Foreground', width: 17 }, { header: 'Measured Ratio', width: 26 },
  { header: 'Required', width: 12 }, { header: 'Verdict', width: 16 }, { header: 'Action', width: 72 }
];
header(cs, 10);
const CS_ROWS = [
  ['Button- Master', 'Primary', 'Large', 'Default', '#164291', '#ffffff', '9.45:1', '4.5:1', 'PASS', '—'],
  ['Button- Master', 'Primary', 'Large', 'Hover', '#4398d4', '#ffffff', '3.14:1', '4.5:1', 'FAIL', 'Change bg to #2a6fa8 (5.33:1) or label to #171717 (5.70:1)'],
  ['Button- Master', 'Primary', 'Large', 'Pressed', '#0d2755', '#ffffff', '14.60:1', '4.5:1', 'PASS', '—'],
  ['Button- Master', 'Primary', 'Large', 'Focus', '#164291 + 2px #4398d4 ring', '#ffffff', '9.45:1 text / 3.01:1 ring', '4.5:1 / 3:1', 'PASS', 'Design passes. NOT implemented on live site — dev must add :focus-visible'],
  ['Button- Master', 'Primary', 'Large', 'Disabled', '#d4d4d4', '#a3a3a3', '1.70:1', 'exempt', 'BEST-PRACTICE', 'Exempt under 1.4.3 but unreadable; suggest #e5e5e5 bg + #595959 text (5.56:1)'],
  ['Button- Master', 'Primary', 'Medium', 'All (14px Bold)', '—', '—', 'same as Large', '4.5:1', '—', '14px Bold is NOT WCAG large text — needs full 4.5:1'],
  ['Button- Master', 'Primary', 'Small', 'All (12px Bold)', '—', '—', 'same as Large', '4.5:1', '—', '12px Bold is NOT WCAG large text — needs full 4.5:1'],
  ['Input / Text Field', '—', '—', 'ALL', '—', '—', '—', '—', 'MISSING', 'No input component set exists in the library — create one with Default/Focus/Error/Disabled/Filled']
];
for (const r of CS_ROWS) cs.addRow(r);
bodyFont(cs);
for (let r = 2; r <= cs.rowCount; r++) {
  const cell = cs.getRow(r).getCell(9);
  const v = String(cell.value || '');
  const fill = { PASS: 'FFDCFCE7', FAIL: 'FFE30910', MISSING: 'FFF59E0B', 'BEST-PRACTICE': 'FFFEF3C7' }[v];
  if (fill) {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: v === 'FAIL' ? 'FFFFFFFF' : 'FF171717' } };
    cell.alignment = { horizontal: 'center', vertical: 'top' };
  }
}
cs.autoFilter = { from: 'A1', to: `J${cs.rowCount}` };

// ================= Dev Action Plan =================
const dap = wb.addWorksheet('Dev Action Plan');
dap.columns = [
  { header: 'Priority', width: 9 }, { header: 'Action', width: 44 }, { header: 'Owner', width: 16 },
  { header: 'Effort', width: 12 }, { header: 'Impact', width: 22 }, { header: 'WCAG SC', width: 16 },
  { header: 'Change Type', width: 18 }, { header: 'Code / Value', width: 62 },
  { header: 'Notes', width: 72 }, { header: 'Related Issue IDs', width: 28 }
];
header(dap, 10);
const ACTIONS = [
  [1, 'Restore focus indicators globally', 'Dev', '~1 hour', 'Site-wide', '2.4.7, 1.4.11', 'CSS (global)',
   ':focus-visible { outline: 2px solid #4398d4; outline-offset: 2px; }',
   'The design system already defines a compliant focus ring — it is simply not in the CSS. Search for "outline: none" / "outline: 0" and remove every instance lacking a replacement.', 'FIG-003 + site-wide LIVE'],
  [2, 'Add skip-to-content link', 'Dev', '~1 hour', 'Site-wide', '2.4.1', 'HTML + CSS',
   '<a href="#main" class="skip-link">Skip to main content</a> ... <main id="main" tabindex="-1">',
   'Must be the FIRST focusable element in the DOM, before the cookie banner. Visually hidden until :focus.', 'LIVE skip-link'],
  [3, 'Fix inherited light-text-on-light-background rule', 'Dev', '~2-4 hours', 'Largest cluster', '1.4.3', 'CSS (component scope)',
   '.section--paper { background:#f8f5ef; color:#171717; } /* 15.75:1 */',
   'The single biggest cluster. Find the shared component/section wrapper setting inverse text and scope it to dark surfaces only. Do NOT patch element-by-element.', 'DRIFT-*'],
  [4, 'Update primary-hover token', 'Dev + Designer', '~30 min', 'Every button', '1.4.3', 'Design token',
   '--action-primary-hover: #2a6fa8;  /* white text = 5.33:1 */',
   'Designer updates the Figma variable, dev updates the CSS custom property in the same sprint so the two stay in sync.', 'FIG-001, TOK hover'],
  [5, 'Make scrollable regions keyboard-accessible', 'Dev', '~2 hours', 'Route-map pages', '2.1.1', 'HTML',
   '<div class="route-map" tabindex="0" role="region" aria-label="Route map, scrollable">',
   'Focusability is the minimum. A pannable map is unusable by screen readers regardless — also provide the same stop data as real text/table markup.', 'LIVE scrollable-region'],
  [6, 'Associate form errors programmatically', 'Dev', '~3-4 hours', 'All forms', '3.3.1, 4.1.2', 'HTML/ARIA',
   '<input aria-invalid="true" aria-describedby="email-err"> <p id="email-err" role="alert">',
   'The visual error design already exists — this is markup only. Never convey the error by colour alone.', 'FIG-004'],
  [7, 'Fix 200% zoom reflow', 'Dev', '~1 day', 'Site-wide', '1.4.10', 'CSS (layout)',
   '.container { max-width:1200px; width:100%; padding-inline: clamp(16px,4vw,48px); }',
   'Replace fixed px widths on page/section wrappers. Verify at 1280x1024 @200% — must reflow to one column with no horizontal scrollbar.', 'LIVE zoom'],
  [8, 'Verify the "needs manual review" contrast rows', 'Dev + Designer', '~2 hours', `${manualReview} rows`, '1.4.3', 'Manual check',
   'Filter Master Issue Log by Severity = "review"',
   'Text on background images/gradients. No tool can judge these. Check by eye at the darkest AND lightest points of the image; if it fails, add a scrim rather than only changing text colour.', 'REVIEW-*'],
  [9, 'Investigate + fix any keyboard trap', 'Dev', '~2 hours', 'Critical if present', '2.1.2', 'JS',
   'Remove offending preventDefault / fix roving-tabindex logic',
   'The most severe class of failure. Needs a human tabbing through to reproduce — scanner detection is indicative only.', 'LIVE keyboard_trap'],
  [10, 'Apply remaining design token fixes', 'Designer', '~2 hours', 'Site-wide', '1.4.3, 1.4.11', 'Figma variables',
   'See the Design Tokens tab for all exact hex changes',
   'Change the variable value and every instance updates. Dev then syncs the corresponding CSS custom properties.', 'TOK-*'],
  [11, 'Mark current vs deprecated Figma frames', 'Designer', '~2 hours', 'Design hygiene', 'N/A (process)', 'Figma',
   'Prefix stale frames "[DEPRECATED]" or move to the Archive page',
   '~90 duplicate/versioned frames with nothing marking which is current. Cheapest high-value cleanup — stops dev building from a stale frame.', 'FIG duplicates'],
  [12, 'Fix decorative illustration export strategy', 'Designer + Dev', '~3 hours', '12 frames', '1.1.1', 'Asset export',
   '<img src="illustration.svg" alt="" aria-hidden="true">',
   'Export each illustration as ONE asset. Currently 150+ vector layers per frame would each be announced if exported as inline SVG nodes.', 'FIG decorative'],
  [13, 'Enlarge undersized tap targets', 'Designer + Dev', '~4 hours', '~30 elements', '2.5.5 / 2.5.8', 'CSS + Figma',
   'min-height:44px; min-width:44px;  /* or transparent padding to extend hit area */',
   'Icon buttons and arrow controls below 44x44 (mobile) / 24x24 (web).', 'FIG tap-targets'],
  [14, 'Add axe-core to CI', 'Dev', '~4 hours', 'Prevents regression', 'All', 'CI pipeline',
   'npm i -D @axe-core/playwright ; npx playwright test a11y.spec.ts',
   'Run against a preview deploy on every PR. The full crawl takes only minutes. Scan tooling is in a11y-audit/local-scan/.', 'Prevention']
];
for (const a of ACTIONS) dap.addRow(a);
bodyFont(dap);
for (let r = 2; r <= dap.rowCount; r++) {
  const cell = dap.getRow(r).getCell(1);
  const p = cell.value;
  const fill = p <= 3 ? 'FFE30910' : p <= 7 ? 'FFF59E0B' : 'FFFEF3C7';
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
  cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: p <= 3 ? 'FFFFFFFF' : 'FF171717' } };
  cell.alignment = { horizontal: 'center', vertical: 'center' };
}
dap.autoFilter = { from: 'A1', to: `J${dap.rowCount}` };

// ================= A — Dev Fixes (Direct) =================
const devWs = wb.addWorksheet('1. Developer Fixes');
devWs.columns = [
  { header: '#', width: 6 }, { header: 'Fix', width: 40 }, { header: 'WCAG SC', width: 14 },
  { header: 'Scale', width: 20 }, { header: 'Confidence', width: 17 },
  { header: 'Current', width: 26 }, { header: 'Change To', width: 26 },
  { header: 'Exact Code / Action', width: 66 }, { header: 'Risk', width: 12 },
  { header: 'Notes', width: 60 }
];
header(devWs, 10);
const DEV_FIXES = [
  ['A1', 'Grey text fails contrast', '1.4.3', '174 els / 31 pages', 'Verified twice',
   '#A3A3A3 (2.52:1)', '#767676 (4.54:1)',
   'Find/replace: text-[#A3A3A3] -> text-[#767676] (also lowercase #a3a3a3). TEXT ONLY — borders/icons use #8f8f8f (see B3).',
   'None', 'Largest genuine issue. axe-core and the Figma token audit independently flag the same hex. Visually near-identical.'],
  ['A2', 'Scrollers unusable by keyboard', '2.1.1', '20 regions / 14 pages', 'Verified',
   '.overflow-x-auto (no tabindex)', 'tabindex="0" + role + label',
   '<div class="overflow-x-auto" tabindex="0" role="region" aria-label="Tour cards, scrollable">',
   'Low (additive)', 'Give each its own descriptive label. Route maps ALSO need the stop data as real text — a pannable map is unusable by a screen reader regardless.'],
  ['A3', 'No visible focus indicator', '2.4.7, 1.4.11', 'Every page', 'High',
   'No outline on :focus', '2px #4398d4 ring',
   ':focus-visible { outline: 2px solid #4398d4; outline-offset: 2px; }  — then remove every unpaired outline:none / focus:outline-none',
   'Low (additive)', 'The Figma design ALREADY defines this and it passes (3.01:1). Pure implementation gap, no design work needed. Use #164291 (9.45:1) if the ring lands on light surfaces.'],
  ['A4', 'No skip-to-content link', '2.4.1', 'Every page', 'Verified',
   'First Tab stop = Cookie Settings', 'Skip link as first focusable',
   '<a href="#main" class="skip-link">Skip to main content</a> + <main id="main" tabindex="-1">; .skip-link{position:absolute;left:-9999px} .skip-link:focus{left:8px;top:8px}',
   'Low (additive)', 'Must be FIRST in the DOM, before the cookie banner. Also confirm the banner does not trap or steal focus.'],
  ['A5', 'Heading level skipped', '1.3.1', '4 headings / 2 pages', 'Verified',
   '<h3> with no <h2>', '<h2>',
   'Change the tag only; keep the Tailwind text classes so nothing moves visually.',
   'Low', 'Screen-reader users navigate by heading rank; a skipped level reads as missing content.'],
  ['A6', 'Alt text duplicates heading', '1.1.1', '2 images / 1 page', 'Verified',
   'alt="Kensington Palace"', 'alt=""',
   'img[alt="Kensington Palace"] and img[alt="Tower of London"] -> alt=""',
   'None', 'The adjacent heading already names it, so the image is decorative in context. Currently announced twice.']
];
for (const r of DEV_FIXES) devWs.addRow(r);
bodyFont(devWs);
for (let r = 2; r <= devWs.rowCount; r++) {
  const c = devWs.getRow(r).getCell(1);
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF166534' } };
  c.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  c.alignment = { horizontal: 'center', vertical: 'center' };
  const rk = devWs.getRow(r).getCell(9);
  const v = String(rk.value || '');
  rk.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: v === 'None' ? 'FFDCFCE7' : 'FFFEF3C7' } };
}
devWs.autoFilter = { from: 'A1', to: `J${devWs.rowCount}` };

// ================= B — Needs Design Review =================
const dsWs = wb.addWorksheet('2. Design Decisions');
dsWs.columns = [
  { header: '#', width: 6 }, { header: 'Issue', width: 38 }, { header: 'WCAG SC', width: 14 },
  { header: 'Decision Needed From Designer', width: 60 },
  { header: 'Current', width: 24 }, { header: 'Recommended', width: 26 },
  { header: 'Measured', width: 22 }, { header: 'Then Dev Does', width: 46 }, { header: 'Notes', width: 56 }
];
header(dsWs, 9);
const DESIGN_ITEMS = [
  ['B1', 'Button hover fails contrast', '1.4.3',
   'Pick ONE: (A) hover bg -> #2a6fa8, keep white label. (B) keep #4398d4, label -> #171717.',
   '#4398d4 + white', 'A: #2a6fa8 (recommended)', 'A=5.33:1 · B=5.70:1 (was 3.14:1)',
   'Update the hover token + CSS custom property',
   'MOST IMPORTANT design decision. Labels are 16px Semibold / 14px Bold / 12px Bold — none are WCAG "large text", so all need the full 4.5:1. Option A keeps white labels consistent across states.'],
  ['B2', 'Coloured badges fail with white text', '1.4.3',
   'Confirm the darker shades still read as the same category colour.',
   'blue #3b82f6 · green #16a34a · pink #ec4899',
   'blue #2563eb · green #15803d · pink #be185d',
   '3.68 / 3.30 / 3.53 -> 5.17 / 5.02 / 6.04',
   'Swap the badge background tokens',
   'Flat backgrounds, so these ratios ARE reliable. Red #e30910 already passes at 4.87:1 — leave it. Also #fce6e7 on red = 4.08:1; use white instead (4.87:1).'],
  ['B3', 'Design token contrast fixes', '1.4.3 / 1.4.11',
   'Approve the 9 hex changes in the Design Tokens tab; confirm whether 10-brand/accent is decorative-only.',
   'see Design Tokens tab', 'see Design Tokens tab', 'all recomputed from source',
   'Change the variable; instances follow. Sync CSS custom properties.',
   'Disabled controls are EXEMPT from 1.4.3 — fixing them is best practice, not required. 06-border/primary only needs changing where the border is functional (inputs), not decorative dividers.'],
  ['B4', 'No Input/form-field component exists', '3.3.1, 4.1.2',
   'Create an Input component set: Default / Focus / Error / Disabled / Filled. Error must use icon + text, never colour alone.',
   '0 of 29 component sets are form fields', 'Focus ring #164291', '9.45:1',
   'aria-describedby + aria-invalid="true" + role="alert"',
   'Fields are drawn per screen today, so error/focus/disabled states are inconsistent. The markup contract is fixed regardless of the visual design.'],
  ['B5', 'Tap targets below minimum', '2.5.8',
   'Confirm hit-area expansion is acceptable rather than resizing icons.',
   '~30 elements under 24x24 / 44x44', '44x44 hit area', 'n/a',
   'min-width/min-height:44px; display:grid; place-items:center',
   'Prefer growing the touch area over enlarging the icon — no visual change.'],
  ['B6', 'Decorative illustrations, no alt strategy', '1.1.1',
   'Decide per illustration: decorative (alt="") or informative (single meaningful alt).',
   '12 frames with 150+ vector layers each', 'One asset per illustration', 'n/a',
   '<img src="..." alt="" aria-hidden="true">',
   'If exported as individual inline SVG nodes, a screen reader announces every fragment.'],
  ['B7', 'Duplicate / versioned Figma frames', 'N/A (process)',
   'Mark exactly ONE frame per screen as current; prefix the rest [DEPRECATED] or move to Archive.',
   '~90 duplicate/versioned frames', 'One source of truth', 'n/a',
   'Nothing — prevents dev building from a stale frame',
   'Cheapest high-value cleanup. "Home", "Home V2", "Home with multiple banners", 5x "Booking Confirmation - AcN" etc.'],
  ['B8', 'Type scale inconsistency', 'N/A (consistency)',
   'Confirm whether Titles/Mobile/H5 should be Proxima Nova like every other token.',
   'Titles/Mobile/H5 = Inter Semi Bold', 'Proxima Nova Semibold', 'n/a',
   'Nothing until the token changes',
   'Every other type token is Proxima Nova. A single off-family token is almost always accidental.'],
  ['B9', 'Landmarks not annotated for dev', '1.3.1, 2.4.1',
   'Annotate header/nav/main/footer roles in the design or handoff doc.',
   '107 header + 191 footer instances, no role annotation', 'Explicit landmark roles', 'n/a',
   '<header role="banner">, <nav aria-label="Main">, <main id="main">, <footer role="contentinfo">',
   'Pairs with A4 — the skip link needs a <main> target to point at.']
];
for (const r of DESIGN_ITEMS) dsWs.addRow(r);
bodyFont(dsWs);
for (let r = 2; r <= dsWs.rowCount; r++) {
  const c = dsWs.getRow(r).getCell(1);
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF164291' } };
  c.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  c.alignment = { horizontal: 'center', vertical: 'center' };
}
dsWs.autoFilter = { from: 'A1', to: `I${dsWs.rowCount}` };

// ================= C — Verify First / D — Manual =================
const vfWs = wb.addWorksheet('3. Verify & Manual QA');
vfWs.columns = [
  { header: '#', width: 6 }, { header: 'Item', width: 42 }, { header: 'WCAG SC', width: 14 },
  { header: 'Why it is not actionable yet', width: 66 },
  { header: 'How to settle it', width: 60 }, { header: 'Then', width: 46 }
];
header(vfWs, 6);
const VERIFY = [
  ['C1', 'Contrast rows on image/gradient backdrops', '1.4.3',
   'The contrast script cannot see background IMAGES. Where text sits on a hero photo or gradient it fell through to the page background and reported a false failure. Hero headings are the main victims. DO NOT change hero heading colours on this evidence.',
   'node scripts/07_verify_backdrops.js  then open output/verify-backdrops.html — sorts every element into REAL_FAIL / PASSES / ON_IMAGE / ON_GRADIENT / OVER_MEDIA with a cropped screenshot of each.',
   'Fix only REAL_FAIL. For imagery, add a scrim rather than changing text colour.'],
  ['C2', '200% zoom reflow', '1.4.10',
   'Reported failure on 69 of 69 pages. A 100% failure rate is a red flag about the TEST, not the site: it used CSS zoom, which is not how browser zoom works. A responsive Tailwind site would likely pass a correct test.',
   'Manually set browser zoom to 200% at 1280x1024. Content must reflow to one column with no horizontal scrollbar. Check homepage, a PDP, a route map, a form.',
   'Only if it genuinely fails: replace fixed px widths with max-width + clamp() padding.'],
  ['C3', 'Possible keyboard trap', '2.1.2',
   'One page showed focus stuck on an <a>. Scripted trap detection is indicative, not conclusive — and this is the most severe failure class if real.',
   'Tab through the page from the address bar. Watch for focus that stops advancing.',
   'Remove the preventDefault on Tab or fix the roving-tabindex logic. Modals must close on Escape and restore focus.'],
  ['D1', 'Screen-reader pass', 'Multiple',
   'Scanning tools reliably detect roughly 30-40% of WCAG issues. Keyboard operation and screen-reader output can only be judged by a person.',
   'NVDA (Windows) + VoiceOver (iOS) through booking, search and contact journeys.',
   'Log and fix whatever surfaces. Required before claiming AA.'],
  ['D2', 'Is the alt text MEANINGFUL', '1.1.1',
   'Tooling confirms alt text exists; it can never judge whether it describes the image usefully.',
   'Human review of images on key pages.',
   'Rewrite unhelpful alt text; set alt="" on decorative images.'],
  ['D3', 'Booking + payment journey by keyboard', 'Multiple',
   'Not exercised end to end by this audit.',
   'Complete a real booking using only the keyboard.',
   'Fix any step that cannot be completed.'],
  ['D4', 'Errors are announced, not just shown', '3.3.1, 4.1.2',
   'Visual error display was checked; announcement was not.',
   'Submit an invalid form with a screen reader running.',
   'Add role="alert" / aria-live where the message is silent.'],
  ['D5', 'prefers-reduced-motion honoured', '2.3.3',
   'Same-origin CSS inspection was inconclusive (cross-origin stylesheets cannot be read).',
   'Enable Reduce Motion at OS level and reload key pages.',
   '@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }']
];
for (const r of VERIFY) vfWs.addRow(r);
bodyFont(vfWs);
for (let r = 2; r <= vfWs.rowCount; r++) {
  const c = vfWs.getRow(r).getCell(1);
  const isC = String(c.value || '').startsWith('C');
  c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isC ? 'FFF59E0B' : 'FF737373' } };
  c.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  c.alignment = { horizontal: 'center', vertical: 'center' };
}
vfWs.autoFilter = { from: 'A1', to: `F${vfWs.rowCount}` };

// ================= write + validate =================
(async () => {
  // Put the working tabs immediately after Read Me
  const desired = ['Read Me', '1. Developer Fixes', '2. Design Decisions',
                   '3. Verify & Manual QA', 'Design Tokens', 'Master Issue Log',
                   'Live Site — Scan Results', 'Figma — Frame Audit',
                   'Component State Matrix', 'Dev Action Plan'];
  desired.forEach((name, i) => { const w = wb.getWorksheet(name); if (w) w.orderNo = i; });

  const outPath = abs(OUT);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await wb.xlsx.writeFile(outPath);

  const check = new ExcelJS.Workbook();
  await check.xlsx.readFile(outPath);
  const expect = ['Read Me', '1. Developer Fixes', '2. Design Decisions',
                  '3. Verify & Manual QA', 'Design Tokens', 'Master Issue Log',
                  'Live Site — Scan Results', 'Figma — Frame Audit',
                  'Component State Matrix', 'Dev Action Plan'];
  const got = check.worksheets.map((w) => w.name);
  const missing = expect.filter((s) => !got.includes(s));
  if (missing.length) {
    console.error(`VALIDATION FAILED — missing sheets: ${missing.join(', ')}`);
    process.exit(1);
  }

  const counts = {};
  const ml = check.getWorksheet('Master Issue Log');
  for (let r = 2; r <= ml.rowCount; r++) {
    const v = String(ml.getRow(r).getCell(9).value || '').toLowerCase();
    if (v) counts[v] = (counts[v] || 0) + 1;
  }

  console.log(`\n[FULL] Workbook written and validated: ${OUT}`);
  console.log(`  Sheets: ${got.length} (${got.join(' | ')})`);
  console.log(`  Master Issue Log: ${ml.rowCount - 1} issues`);
  console.log('  By severity:', counts);
  console.log(`  Live site: ${uniquePages} pages, ${pages.length} page-views`);
  console.log(`  Contrast: ${tokenTraced} token-traced, ${drift} drift, ${manualReview} needs-manual-review`);
  console.log(`  Design file: ${figFindings.length} findings`);
})();

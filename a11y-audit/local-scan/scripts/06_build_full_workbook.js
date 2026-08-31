/**
 * 06_build_full_workbook.js
 * Builds the COMPLETE deliverable workbook covering BOTH phases:
 *   Read Me | Design Tokens | Master Issue Log | Live Site — Automated Findings
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
      if (!g.has(k)) g.set(k, { ...f, pages: new Set() });
      g.get(k).pages.add(`${p.url} [${p.viewport}]`);
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
wb.creator = 'TOT WCAG 2.1 AA Audit Pipeline';
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
  ['The Original Tour — WCAG 2.1 AA Accessibility Audit', 16, true],
  ['Phases 1 & 2 — live site + Figma design file', 12, false],
  ['', 10, false],
  [`Generated: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}   |   Standard: WCAG 2.1 Level AA`, 10, false],
  ['', 10, false],
  ['WHAT WAS AUDITED', 11, true],
  [`  Phase 1 — Live site: ${uniquePages} pages, ${pages.length} page-views (desktop 1440 + mobile 390).`, 10, false],
  [`     ${authGated.length} page(s) skipped as auth-required.`, 10, false],
  ['  Phase 2 — Figma: 287 frames across 27 sections on page "1B UI Designs" (node 5105:46216),', 10, false],
  ['     plus the 29 component sets on the COMPONENTS page and all local colour/type variables.', 10, false],
  ['', 10, false],
  ['TABS', 11, true],
  ['  Design Tokens            Colour variables with measured ratios and exact hex fixes.', 10, false],
  ['  Master Issue Log         EVERYTHING, deduped. Filter by Severity or Owner to plan work.', 10, false],
  ['  Live Site — Automated    Raw axe-core node-level results, one row per element.', 10, false],
  ['  Figma — Frame Audit      Phase 2 findings only (FIG- prefix).', 10, false],
  ['  Component State Matrix   Every button state with measured contrast — the root-cause table.', 10, false],
  ['  Dev Action Plan          Prioritised actions with copy-paste code. START HERE.', 10, false],
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
  ['  LIVE-   Automated live-site finding (axe-core + scripted state checks)', 10, false],
  ['  DRIFT-  Live site uses a value not traced to any Figma token — built differently than designed', 10, false],
  ['  REVIEW- Contrast could not be judged automatically — human verification required', 10, false],
  ['  SEED-   Pre-existing flagged finding carried into this audit', 10, false],
  ['', 10, false],
  ['READ THE NUMBERS HONESTLY', 11, true],
  ['  Critical rows are NOT all independent bugs. The large majority share ONE root cause', 10, false],
  ['  (light text inheriting onto light backgrounds) and are fixed by a single CSS change.', 10, false],
  ['  Likewise the site-wide focus-indicator and skip-link findings are each one global fix.', 10, false],
  ['  Work the Dev Action Plan tab in order — the first three items clear the large majority.', 10, false],
  ['', 10, false],
  [`  ${manualReview} contrast rows are marked "needs manual review": the text sits on a background`, 10, false],
  ['  image or gradient, where computed styles cannot determine the real backdrop. These are NOT', 10, false],
  ['  confirmed failures and must not be filed as bugs without a human checking them by eye.', 10, false],
  ['', 10, false],
  ['KNOWN LIMITATIONS', 11, true],
  ['  1. Keyboard focus-walk counts vary between runs — the cookie-consent banner can capture', 10, false],
  ['     focus and truncate the tab walk. Treat per-page manual counts as indicative, not a trend.', 10, false],
  ['     The axe violation counts ARE stable and comparable run-over-run.', 10, false],
  ['  2. Automation cannot judge whether alt text is MEANINGFUL, only whether it exists.', 10, false],
  ['  3. Any keyboard trap needs a human tabbing through to reproduce reliably.', 10, false],
  ['  4. Screen-reader testing (NVDA/VoiceOver) was NOT performed — automation cannot replace it.', 10, false],
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
    f.current_value || '', f.required_fix || '', 'Dev', 'Open', affected(f.pages)]);
}
// contrast
for (const c of contrast) {
  if (c.classification === 'needs_manual_review') {
    addLog([nextId('REVIEW'), 'Live Site (Needs Review)', c.url, 'Web', c.selector, 'Default',
      'Contrast could not be determined automatically — text sits on a background image or gradient. NOT a confirmed failure.',
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

// ================= Live Site — Automated Findings =================
const live = wb.addWorksheet('Live Site — Automated Findings');
live.columns = [
  { header: 'Page URL', width: 46 }, { header: 'Viewport', width: 10 },
  { header: 'Element (CSS selector)', width: 38 }, { header: 'Issue', width: 46 },
  { header: 'WCAG SC', width: 14 }, { header: 'axe impact rating', width: 15 },
  { header: 'Fix', width: 48 }, { header: 'Screenshot filename reference', width: 30 }
];
header(live, 8);
for (const p of pages) {
  if (!p.axe) continue;
  for (const v of p.axe.violations || []) {
    for (const n of v.nodes || []) {
      live.addRow([p.url, p.viewport, (n.target || []).join(' '), v.help,
        tagsToWcagSC(v.tags), v.impact, v.helpUrl, '']);
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
   'Text on background images/gradients. Automation cannot judge these. Check by eye at the darkest AND lightest points of the image; if it fails, add a scrim rather than only changing text colour.', 'REVIEW-*'],
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
   'Run against a preview deploy on every PR. The full crawl takes only minutes. Pipeline already written in a11y-audit/local-scan/.', 'Prevention']
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

// ================= write + validate =================
(async () => {
  const outPath = abs(OUT);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await wb.xlsx.writeFile(outPath);

  const check = new ExcelJS.Workbook();
  await check.xlsx.readFile(outPath);
  const expect = ['Read Me', 'Design Tokens', 'Master Issue Log', 'Live Site — Automated Findings',
                  'Figma — Frame Audit', 'Component State Matrix', 'Dev Action Plan'];
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
  console.log(`  Phase 1: ${uniquePages} pages, ${pages.length} page-views`);
  console.log(`  Contrast: ${tokenTraced} token-traced, ${drift} drift, ${manualReview} needs-manual-review`);
  console.log(`  Phase 2: ${figFindings.length} Figma findings`);
})();

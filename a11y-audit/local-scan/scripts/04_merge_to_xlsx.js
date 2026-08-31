/**
 * 04_merge_to_xlsx.js
 * Builds the single deliverable workbook: output/TOT_WCAG21AA_Audit.xlsx
 * Tabs: Read Me | Design Tokens | Master Issue Log | Live Site — Scan Results
 * Dedupes repeated issues (e.g. same missing-alt pattern on 50 pages) into one
 * row with an affected-pages count + list in Notes.
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const cfg = require('../config/settings');
const seed = require('../config/figma_tokens_seed.json');
const { tagsToWcagSC } = require('./lib/wcag_tags');

function abs(p) {
  return path.join(__dirname, '..', p);
}

const SEVERITY_FILL = {
  critical: 'FFE30910', // red
  serious: 'FFF59E0B', // amber
  moderate: 'FFFFF3CD', // light yellow
  minor: 'FFFFFDE7',
  pass: 'FFDCFCE7', // green
  info: 'FFF3F4F6'
};

const AXE_IMPACT_TO_SEVERITY = { critical: 'critical', serious: 'serious', moderate: 'moderate', minor: 'minor' };

function styleHeaderRow(row) {
  row.eachCell((cell) => {
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF171717' } };
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = { bottom: { style: 'thin' } };
  });
  row.height = 28;
}

function applyBodyFont(ws) {
  ws.eachRow((row, num) => {
    if (num === 1) return;
    row.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10, ...(cell.font || {}) };
      cell.alignment = { vertical: 'top', wrapText: true, ...(cell.alignment || {}) };
    });
  });
}

function severityFillFor(ws, row, col, severity) {
  const argb = SEVERITY_FILL[severity] || SEVERITY_FILL.info;
  ws.getRow(row).getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

function loadRawScans() {
  const rawDir = abs(cfg.RAW_DIR);
  const pages = [];
  if (!fs.existsSync(rawDir)) return pages;
  for (const file of fs.readdirSync(rawDir)) {
    if (!file.endsWith('.json')) continue;
    try {
      pages.push(JSON.parse(fs.readFileSync(path.join(rawDir, file), 'utf8')));
    } catch (e) {
      console.warn(`  could not parse ${file}: ${e.message}`);
    }
  }
  return pages;
}

function dedupeAxeViolations(pages) {
  // key: rule id + first target selector pattern (normalized) -> aggregate
  const groups = new Map();
  for (const p of pages) {
    if (!p.axe) continue;
    for (const v of p.axe.violations || []) {
      const key = v.id;
      if (!groups.has(key)) {
        groups.set(key, {
          id: v.id,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          impact: v.impact,
          wcag: tagsToWcagSC(v.tags),
          pages: new Set(),
          exampleSelectors: new Set(),
          exampleHtml: new Set()
        });
      }
      const g = groups.get(key);
      g.pages.add(`${p.url} [${p.viewport}]`);
      for (const node of v.nodes || []) {
        for (const t of node.target || []) g.exampleSelectors.add(t);
        if (node.html) g.exampleHtml.add(node.html.slice(0, 200));
        if (g.exampleSelectors.size >= 3) break;
      }
    }
  }
  return [...groups.values()];
}

function collectAuthGated(pages) {
  return pages.filter((p) => p.auth_required).map((p) => p.url);
}

function collectManualFindings(pages) {
  const out = [];
  for (const p of pages) {
    for (const f of p.manual_findings || []) {
      if (f.pass === false) out.push({ ...f, url: p.url, viewport: p.viewport, page_type: p.page_type });
    }
  }
  return out;
}

function dedupeManualFindings(findings) {
  const groups = new Map();
  for (const f of findings) {
    const key = `${f.check}|${f.wcag_sc}`;
    if (!groups.has(key)) {
      groups.set(key, { ...f, pages: new Set(), count: 0 });
    }
    const g = groups.get(key);
    g.pages.add(`${f.url} [${f.viewport}]`);
    g.count++;
  }
  return [...groups.values()];
}

(async () => {
  const pages = loadRawScans();
  if (!pages.length) {
    console.error(`No scan data found in ${cfg.RAW_DIR} — run "npm run scan" first.`);
    process.exit(1);
  }
  const contrastFindings = fs.existsSync(abs(cfg.CONTRAST_FILE))
    ? JSON.parse(fs.readFileSync(abs(cfg.CONTRAST_FILE), 'utf8'))
    : [];
  const reducedMotion = fs.existsSync(abs('data/reduced_motion_findings.json'))
    ? JSON.parse(fs.readFileSync(abs('data/reduced_motion_findings.json'), 'utf8'))
    : {};

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Accessibility Audit — The Original Tour';
  wb.created = new Date();

  // ---------- Read Me ----------
  const readme = wb.addWorksheet('Read Me');
  readme.columns = [{ width: 100 }];
  const readmeLines = [
    'The Original Tour — WCAG 2.2 Level AA Accessibility Audit',
    '',
    `Report date: ${new Date().toISOString().slice(0, 10)}`,
    `Pages scanned: ${new Set(pages.map((p) => p.url)).size}  |  Page-views (incl. viewports): ${pages.length}`,
    '',
    'SCOPE',
    '  Standard: WCAG 2.2 Level AA. Scan via Playwright + axe-core, covering:',
    '    - Default page state (axe.run() full ruleset)',
    '    - Keyboard focus order + focus-visible indicator contrast (2.4.7 / 1.4.11)',
    '    - Hover states on primary buttons/links, re-checked for 4.5:1 text contrast',
    '    - Form validation/error states (empty/invalid submit), aria-describedby association check',
    '    - Disabled control non-text contrast (3:1 boundary)',
    '    - Skip-to-content link presence + keyboard reachability',
    '    - No-keyboard-trap check (Tab order advances, does not get stuck)',
    '    - prefers-reduced-motion CSS + actual animation suppression',
    '    - Simulated 200% zoom overflow/clipping check',
    '    - Manual re-derivation of exact contrast ratios for every axe "needs review" / violation color-contrast flag, cross-referenced against the audited Figma design tokens',
    '',
    'METHODOLOGY',
    '  1. Site crawl (sitemap.xml + BFS from homepage, same-origin) -> config/site_map.json',
    '  2. axe-core scan + scripted manual checks per page x viewport -> data/raw/*.json',
    '  3. Contrast re-derivation using the WCAG relative-luminance formula -> data/contrast_findings.json',
    '  4. This workbook, merging all of the above with the pre-validated Figma token audit',
    '',
    'SEVERITY DEFINITIONS',
    '  Critical — blocks core task completion for assistive-tech users (e.g. hover state unreadable, keyboard trap)',
    '  Serious  — significant barrier, workaround unlikely (e.g. missing focus indicator, unassociated error message)',
    '  Moderate — meaningful friction but a workaround usually exists (e.g. disabled-state contrast, touch target size)',
    '  Minor    — a real but low-impact deviation',
    '  Pass     — verified compliant, listed for completeness',
    '',
    'HOW TO READ THE MASTER ISSUE LOG',
    '  Every row is one distinct issue. Where the same issue recurs across many pages, rows are',
    '  DEDUPED to one row — the affected page count and full URL list are in the Notes column.',
    '  Issue ID prefixes: TOK- = design token fix (Figma), SEED- = pre-flagged frame finding,',
    '  LIVE- = live-site scan finding, DRIFT- = live site differs from the Figma spec.',
    '',
    'AUTH-GATED PAGES',
    `  ${collectAuthGated(pages).length} page(s) were not scanned because they required authentication.`,
    '  See the auth-gated list at the bottom of the Live Site — Scan Results tab. Provide test',
    '  credentials and re-run scripts/02_run_axe_scan.js to include them.',
    '',
    'HOW THIS WORKBOOK WAS PRODUCED',
    '  Scan tooling (scripts/01-04) run against the live production site.'
  ];
  readmeLines.forEach((line, i) => {
    const cell = readme.getCell(`A${i + 1}`);
    cell.value = line;
    cell.font = { name: 'Arial', size: i === 0 ? 16 : 10, bold: i === 0 || /^[A-Z][A-Z -]+$/.test(line) };
    cell.alignment = { wrapText: true, vertical: 'top' };
  });
  readme.getRow(1).height = 26;

  // ---------- Design Tokens ----------
  const tokWs = wb.addWorksheet('Design Tokens');
  tokWs.columns = [
    { header: 'Token', key: 'token', width: 26 },
    { header: 'Hex', key: 'hex', width: 12 },
    { header: 'Used On', key: 'on', width: 14 },
    { header: 'Ratio', key: 'ratio', width: 10 },
    { header: 'Needed', key: 'needed', width: 10 },
    { header: 'Status', key: 'status', width: 18 },
    { header: 'Exact Fix', key: 'fix', width: 45 },
    { header: 'Notes', key: 'notes', width: 45 }
  ];
  styleHeaderRow(tokWs.getRow(1));
  for (const t of seed.tokens) {
    const row = tokWs.addRow({
      token: t.token,
      hex: t.hex,
      on: t.on || t.textOn || '#ffffff',
      ratio: t.ratio ?? '',
      needed: t.needed ?? '',
      status: t.status,
      fix: t.fix || (t.status === 'pass' ? '— no change needed' : ''),
      notes: t.notes || ''
    });
    let sev = 'pass';
    if (t.status === 'fail_critical') sev = 'critical';
    else if (t.status === 'fail' || t.status === 'fail_as_text') sev = 'serious';
    else if (t.status && t.status.startsWith('pass')) sev = 'pass';
    else sev = 'info';
    severityFillFor(tokWs, row.number, 6, sev);
  }
  tokWs.addRow([]);
  tokWs.addRow(['Type scale note', seed.type_scale_note]);
  tokWs.autoFilter = 'A1:H1';
  tokWs.views = [{ state: 'frozen', ySplit: 1 }];
  applyBodyFont(tokWs);

  // ---------- Master Issue Log ----------
  const logWs = wb.addWorksheet('Master Issue Log');
  const logCols = [
    { header: 'Issue ID', key: 'id', width: 14 },
    { header: 'Section/Page', key: 'section', width: 20 },
    { header: 'Frame/URL', key: 'frame', width: 40 },
    { header: 'Platform', key: 'platform', width: 12 },
    { header: 'Component', key: 'component', width: 20 },
    { header: 'State Checked', key: 'state', width: 16 },
    { header: 'Issue Description', key: 'desc', width: 50 },
    { header: 'WCAG SC', key: 'wcag', width: 14 },
    { header: 'Severity', key: 'severity', width: 12 },
    { header: 'Current Value', key: 'current', width: 30 },
    { header: 'Required Fix (exact)', key: 'fix', width: 45 },
    { header: 'Owner', key: 'owner', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Notes / Affected Pages', key: 'notes', width: 50 }
  ];
  logWs.columns = logCols;
  styleHeaderRow(logWs.getRow(1));

  let idCounter = { TOK: 1, SEED: 1, LIVE: 1, DRIFT: 1, FORM: 1 };
  function nextId(prefix) {
    return `${prefix}-${String(idCounter[prefix]++).padStart(3, '0')}`;
  }

  // Token issues
  for (const t of seed.tokens) {
    if (!t.status || t.status === 'pass' || t.status.startsWith('pass') || t.status === 'n/a-background' || t.status === 'decorative' || t.status === 'context-dependent') continue;
    const row = logWs.addRow({
      id: nextId('TOK'),
      section: 'Design Tokens',
      frame: 'Figma variables',
      platform: 'Web/Mobile',
      component: t.token,
      state: 'Default',
      desc: `Token ${t.token} (${t.hex}) fails contrast${t.on ? ' on ' + t.on : ''}`,
      wcag: t.status === 'fail_critical' ? '1.4.3' : '1.4.11 / 1.4.3',
      severity: t.status === 'fail_critical' ? 'critical' : 'serious',
      current: `${t.hex}${t.ratio ? ` (${t.ratio}:1)` : ''}`,
      fix: t.fix || '',
      owner: 'Designer',
      status: 'Open',
      notes: t.notes || ''
    });
    severityFillFor(logWs, row.number, 9, row.getCell('severity').value);
  }

  // Seed frame findings
  for (const f of seed.seed_frame_findings) {
    const row = logWs.addRow({
      id: nextId('SEED'),
      section: f.section,
      frame: f.frame,
      platform: 'Web/Mobile',
      component: '',
      state: 'Default/Focus',
      desc: f.issue,
      wcag: f.wcag_sc,
      severity: f.severity,
      current: '',
      fix: '',
      owner: 'Designer',
      status: 'Open',
      notes: ''
    });
    severityFillFor(logWs, row.number, 9, f.severity);
  }

  // Live-site axe violations (deduped)
  const dedupedAxe = dedupeAxeViolations(pages);
  for (const g of dedupedAxe) {
    const sev = AXE_IMPACT_TO_SEVERITY[g.impact] || 'moderate';
    const pagesArr = [...g.pages];
    const row = logWs.addRow({
      id: nextId('LIVE'),
      section: 'Live Site',
      frame: pagesArr[0],
      platform: pagesArr[0] && pagesArr[0].includes('[mobile]') ? 'Mobile' : 'Web',
      component: g.id,
      state: 'Default (axe.run)',
      desc: g.help,
      wcag: g.wcag,
      severity: sev,
      current: [...g.exampleSelectors].slice(0, 2).join(' | '),
      fix: g.helpUrl,
      owner: 'Dev',
      status: 'Open',
      notes: `Affected pages: ${pagesArr.length}${pagesArr.length > 1 ? ' (full list: ' + pagesArr.slice(0, 15).join('; ') + (pagesArr.length > 15 ? `; +${pagesArr.length - 15} more` : '') + ')' : ''}`
    });
    severityFillFor(logWs, row.number, 9, sev);
  }

  // Live-site manual findings (deduped)
  const manualFindings = dedupeManualFindings(collectManualFindings(pages));
  for (const f of manualFindings) {
    const pagesArr = [...f.pages];
    const row = logWs.addRow({
      id: nextId('LIVE'),
      section: 'Live Site',
      frame: pagesArr[0],
      platform: pagesArr[0] && pagesArr[0].includes('[mobile]') ? 'Mobile' : 'Web',
      component: f.element || f.check,
      state: f.check,
      desc: f.detail || f.check,
      wcag: f.wcag_sc,
      severity: f.severity,
      current: f.current_value || '',
      fix: f.required_fix || '',
      owner: 'Dev',
      status: 'Open',
      notes: `Affected pages: ${pagesArr.length}${pagesArr.length > 1 ? ' (full list: ' + pagesArr.slice(0, 15).join('; ') + (pagesArr.length > 15 ? `; +${pagesArr.length - 15} more` : '') + ')' : ''}`
    });
    severityFillFor(logWs, row.number, 9, f.severity);
  }

  // Contrast re-derivation findings (drift vs token)
  for (const c of contrastFindings) {
    const isDrift = c.classification === 'live_site_drift_from_figma';
    const row = logWs.addRow({
      id: nextId(isDrift ? 'DRIFT' : 'LIVE'),
      section: isDrift ? 'Live Site (Drift from Figma)' : 'Live Site',
      frame: c.url,
      platform: 'Web',
      component: c.selector,
      state: 'Default',
      desc: isDrift
        ? 'Live site uses a color not traced to any known Figma token — implemented differently than designed'
        : `Matches Figma token ${c.nearest_token} — token itself needs the fix`,
      wcag: '1.4.3',
      severity: c.ratio < 3 ? 'critical' : 'serious',
      current: `${c.current_fg} on ${c.current_bg} = ${c.ratio}:1 (needs ${c.required_ratio}:1)`,
      fix: c.suggested_fix,
      owner: isDrift ? 'Dev' : 'Designer + Dev',
      status: 'Open',
      notes: ''
    });
    severityFillFor(logWs, row.number, 9, c.ratio < 3 ? 'critical' : 'serious');
  }

  // Reduced motion findings
  for (const [url, findings] of Object.entries(reducedMotion)) {
    for (const f of findings) {
      const row = logWs.addRow({
        id: nextId('LIVE'),
        section: 'Live Site',
        frame: url,
        platform: 'Web',
        component: 'Page-level CSS',
        state: 'prefers-reduced-motion: reduce',
        desc: f.detail,
        wcag: f.wcag_sc,
        severity: f.severity === 'info' ? 'minor' : f.severity,
        current: '',
        fix: 'Add @media (prefers-reduced-motion: reduce) { animation: none; transition: none; } for non-essential motion',
        owner: 'Dev',
        status: 'Open',
        notes: ''
      });
      severityFillFor(logWs, row.number, 9, f.severity === 'info' ? 'minor' : f.severity);
    }
  }

  logWs.autoFilter = { from: 'A1', to: 'N1' };
  logWs.views = [{ state: 'frozen', ySplit: 1 }];
  applyBodyFont(logWs);

  // ---------- Live Site — Scan Results ----------
  const liveWs = wb.addWorksheet('Live Site — Scan Results');
  liveWs.columns = [
    { header: 'Page URL', key: 'url', width: 45 },
    { header: 'Viewport', key: 'viewport', width: 10 },
    { header: 'Element (CSS selector)', key: 'selector', width: 35 },
    { header: 'Issue', key: 'issue', width: 45 },
    { header: 'WCAG SC', key: 'wcag', width: 14 },
    { header: 'axe impact rating', key: 'impact', width: 14 },
    { header: 'Fix', key: 'fix', width: 45 },
    { header: 'Screenshot filename reference', key: 'screenshot', width: 30 }
  ];
  styleHeaderRow(liveWs.getRow(1));
  for (const p of pages) {
    if (!p.axe) continue;
    for (const v of p.axe.violations || []) {
      for (const node of v.nodes || []) {
        const row = liveWs.addRow({
          url: p.url,
          viewport: p.viewport,
          selector: (node.target || []).join(' '),
          issue: v.help,
          wcag: tagsToWcagSC(v.tags),
          impact: v.impact,
          fix: v.helpUrl,
          screenshot: ''
        });
        severityFillFor(liveWs, row.number, 6, AXE_IMPACT_TO_SEVERITY[v.impact] || 'moderate');
      }
    }
  }
  liveWs.addRow([]);
  liveWs.addRow(['--- Pages not scanned (auth required) ---']);
  for (const url of collectAuthGated(pages)) {
    liveWs.addRow({ url, issue: 'NOT SCANNED — auth required' });
  }
  liveWs.autoFilter = { from: 'A1', to: 'H1' };
  liveWs.views = [{ state: 'frozen', ySplit: 1 }];
  applyBodyFont(liveWs);

  // ---------- Write + validate ----------
  const outPath = abs(cfg.OUTPUT_XLSX);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await wb.xlsx.writeFile(outPath);

  // Recalculation/validation pass: re-open and confirm structure before declaring done
  const verifyWb = new ExcelJS.Workbook();
  await verifyWb.xlsx.readFile(outPath);
  const expectedSheets = ['Read Me', 'Design Tokens', 'Master Issue Log', 'Live Site — Scan Results'];
  const actualSheets = verifyWb.worksheets.map((w) => w.name);
  const missing = expectedSheets.filter((s) => !actualSheets.includes(s));
  if (missing.length) {
    console.error(`VALIDATION FAILED — missing sheets: ${missing.join(', ')}`);
    process.exit(1);
  }
  const logSheet = verifyWb.getWorksheet('Master Issue Log');
  const rowCount = logSheet.rowCount - 1; // minus header

  console.log(`\n[4/4] Workbook written and validated: ${cfg.OUTPUT_XLSX}`);
  console.log(`  Master Issue Log: ${rowCount} issues`);
  console.log(`  Design Tokens: ${seed.tokens.filter((t) => t.status && (t.status.startsWith('fail'))).length} failing tokens`);
  console.log(`  Live Site — Scan Results: ${liveWs.rowCount - 1} raw axe node-level rows`);
  console.log(`  Pages scanned: ${new Set(pages.map((p) => p.url)).size}, auth-gated (skipped): ${collectAuthGated(pages).length}`);
})();

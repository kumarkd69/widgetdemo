/**
 * 05_diff_runs.js
 * Compares the current scan against the previous archived run and reports
 * what was FIXED, what is NEW, and what is STILL OPEN.
 *
 * Usage:
 *   node scripts/05_diff_runs.js                 # compare data/raw vs data/baseline
 *   node scripts/05_diff_runs.js --save-baseline # archive current run as the baseline
 *
 * Typical flow for a re-scan:
 *   npm run all                       (first run — produces data/raw)
 *   node scripts/05_diff_runs.js --save-baseline
 *   ...devs ship fixes...
 *   npm run all                       (second run)
 *   node scripts/05_diff_runs.js      (shows the delta)
 */
const fs = require('fs');
const path = require('path');
const cfg = require('../config/settings');

const abs = (p) => path.join(__dirname, '..', p);
const BASELINE_DIR = abs('data/baseline');
const RAW_DIR = abs(cfg.RAW_DIR);

function loadRun(dir) {
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    } catch (_) {
      continue;
    }
    if (!data.axe) continue;
    for (const v of data.axe.violations || []) {
      for (const node of v.nodes || []) {
        const key = `${data.url}|${data.viewport}|${v.id}|${(node.target || []).join(' ')}`;
        map.set(key, { url: data.url, viewport: data.viewport, rule: v.id, impact: v.impact, help: v.help, target: (node.target || []).join(' ') });
      }
    }
    for (const f of data.manual_findings || []) {
      if (f.pass === false) {
        const key = `${data.url}|${data.viewport}|manual:${f.check}|${f.element || ''}`;
        map.set(key, { url: data.url, viewport: data.viewport, rule: `manual:${f.check}`, impact: f.severity, help: f.detail || f.check, target: f.element || '' });
      }
    }
  }
  return map;
}

if (process.argv.includes('--save-baseline')) {
  fs.rmSync(BASELINE_DIR, { recursive: true, force: true });
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
  let n = 0;
  for (const file of fs.readdirSync(RAW_DIR)) {
    if (!file.endsWith('.json')) continue;
    fs.copyFileSync(path.join(RAW_DIR, file), path.join(BASELINE_DIR, file));
    n++;
  }
  fs.writeFileSync(path.join(BASELINE_DIR, '_meta.json'), JSON.stringify({ savedAt: new Date().toISOString(), files: n }, null, 2));
  console.log(`Baseline saved: ${n} page files -> data/baseline/`);
  process.exit(0);
}

const baseline = loadRun(BASELINE_DIR);
const current = loadRun(RAW_DIR);

if (!baseline.size) {
  console.error('No baseline found. Run:  node scripts/05_diff_runs.js --save-baseline');
  process.exit(1);
}

const fixed = [...baseline.keys()].filter((k) => !current.has(k)).map((k) => baseline.get(k));
const added = [...current.keys()].filter((k) => !baseline.has(k)).map((k) => current.get(k));
const still = [...current.keys()].filter((k) => baseline.has(k)).map((k) => current.get(k));

function groupByRule(list) {
  const g = {};
  for (const item of list) g[item.rule] = (g[item.rule] || 0) + 1;
  return Object.entries(g).sort((a, b) => b[1] - a[1]);
}

const meta = fs.existsSync(path.join(BASELINE_DIR, '_meta.json'))
  ? JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, '_meta.json'), 'utf8'))
  : {};

console.log('\n=====================================================');
console.log(' ACCESSIBILITY RE-SCAN COMPARISON');
console.log('=====================================================');
console.log(`Baseline saved:  ${meta.savedAt || 'unknown'}`);
console.log(`Current scan:    ${new Date().toISOString()}`);
console.log('');
console.log(`  Baseline findings: ${baseline.size}`);
console.log(`  Current findings:  ${current.size}`);
console.log('');
console.log(`  FIXED:      ${fixed.length}`);
console.log(`  NEW:        ${added.length}`);
console.log(`  STILL OPEN: ${still.length}`);
console.log('');

if (fixed.length) {
  console.log('--- FIXED (by rule) ---');
  for (const [rule, n] of groupByRule(fixed)) console.log(`  ${String(n).padStart(4)}  ${rule}`);
  console.log('');
}
if (added.length) {
  console.log('--- NEW REGRESSIONS (by rule) ---');
  for (const [rule, n] of groupByRule(added)) console.log(`  ${String(n).padStart(4)}  ${rule}`);
  console.log('');
  console.log('  First 10 new findings:');
  for (const a of added.slice(0, 10)) console.log(`    ${a.url} [${a.viewport}] ${a.rule} — ${a.target}`);
  console.log('');
}
if (still.length) {
  console.log('--- STILL OPEN (by rule) ---');
  for (const [rule, n] of groupByRule(still)) console.log(`  ${String(n).padStart(4)}  ${rule}`);
  console.log('');
}

fs.writeFileSync(abs('data/diff_report.json'), JSON.stringify({
  baselineSavedAt: meta.savedAt || null,
  comparedAt: new Date().toISOString(),
  counts: { baseline: baseline.size, current: current.size, fixed: fixed.length, added: added.length, stillOpen: still.length },
  fixed, added, stillOpen: still
}, null, 2));
console.log('Full detail written to data/diff_report.json');

# TOT WCAG 2.1 AA — Local Live-Site Scan

This pipeline runs Phase 1 of the audit (the live site) against
`https://www.theoriginaltour.com/`. It's designed to run on **your own
machine/network** — the remote session that generated this code has its
egress explicitly blocked for this domain, so the scan itself has to run
somewhere with real access.

## Prerequisites

- Node.js 18+ (Node 22 recommended)
- A network that can actually reach `theoriginaltour.com` (your personal
  laptop, per our conversation)

## Setup

```bash
cd a11y-audit/local-scan
npm install
npx playwright install chromium   # downloads a local Chromium build
```

## Run everything

```bash
npm run all
```

This runs, in order:

1. `npm run crawl` — discovers every URL (sitemap.xml + BFS crawl) →
   `config/site_map.json`
2. `npm run scan` — axe-core + the scripted manual checks (focus order,
   hover states, disabled states, form-error association, skip link,
   keyboard trap, reduced-motion, 200% zoom) per page × viewport →
   `data/raw/*.json`, checkpointed as it goes (safe to Ctrl-C and resume —
   re-running `scan` just overwrites/re-checks each page's file)
3. `npm run contrast` — re-derives exact contrast ratios for every axe
   color-contrast flag and cross-references against the validated Figma
   token fixes → `data/contrast_findings.json`
4. `npm run merge` — builds the final workbook →
   `output/TOT_WCAG21AA_Audit.xlsx`

Each step can also be run individually (`npm run crawl`, `npm run scan`,
etc.) — useful if you want to inspect `config/site_map.json` before
committing to a full scan, or re-run just the merge after editing seed
data.

## Tuning scope

Environment variables (set before `npm run scan`, or export them for the
whole session):

- `A11Y_MAX_PAGES=25` — cap the crawl/scan to the first N pages (useful for
  a fast first pass before committing to the full site)
- `A11Y_CRAWL_DEPTH=2` — how many link-hops deep the BFS crawl goes

Edit `config/settings.js` directly for anything else (viewports scanned,
concurrency, URL patterns to skip).

## Pages that need login

Any page the crawler can reach but that redirects to a login/auth flow is
recorded with `"auth_required": true` in its `data/raw/*.json` file and
listed explicitly in the final workbook's "Live Site — Automated Findings"
tab rather than silently dropped. If you have test credentials, add a
Playwright `storageState` / login step to `scripts/02_run_axe_scan.js`
(`context = await browser.newContext({ storageState: 'auth.json' })`) and
re-run.

## Re-running later (progress tracking)

After a run, archive it as the comparison point:

```bash
node scripts/05_diff_runs.js --save-baseline
```

Then after devs ship fixes, re-run the scan and compare:

```bash
npm run all
node scripts/05_diff_runs.js
```

You get a FIXED / NEW / STILL OPEN breakdown by rule instead of another flat
list, plus full detail in `data/diff_report.json`. The NEW section is the
important one — it catches regressions introduced by the fixes themselves.

## Building the COMPLETE workbook (both phases)

`npm run all` produces the Phase 1 workbook only. To get the full 7-tab file
that also includes the Phase 2 Figma findings, the component state matrix and
the developer action plan:

```bash
npm run full            # after a scan has already run
```

or do the whole thing in one go:

```bash
npm run everything      # crawl + scan + contrast + full workbook
```

Output: `output/TOT_WCAG21AA_Audit_FULL.xlsx` — this is the file to circulate.

## Output

`output/TOT_WCAG21AA_Audit.xlsx` — the complete workbook: Read Me, Design
Tokens (the pre-validated Figma seed data), Master Issue Log (everything,
deduped), and Live Site — Automated Findings (raw axe rows). The merge
script re-opens the file after writing it and verifies all four sheets
exist before declaring success — if it errors, the file was not silently
left corrupt.

## Sending results back

You don't need to send anything back — the workbook is the deliverable and
is generated entirely on your machine. If you want help interpreting it,
prioritizing fixes, or building the Figma annotation layer (Phase 2) against
these findings, send the `.xlsx` back into this conversation and/or push
`data/raw/` + `data/contrast_findings.json` to this branch.

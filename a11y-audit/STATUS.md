# The Original Tour — WCAG 2.1 AA Audit: Status

_Last updated: 2026-08-26_

## Blocker (why this isn't fully automated end-to-end)

This remote session's network egress policy blocks `theoriginaltour.com`
outright (confirmed via both raw HTTPS and the WebFetch tool — `403` /
`EGRESS_BLOCKED` on both `www.` and the apex domain). That's a policy
decision at the environment level, not something fixable from inside the
session. Two ways to unblock:

- Allowlist the domain in this environment's network settings (claude.ai/code
  → Environments → this environment), then Phase 1 can run directly from
  here end-to-end as originally scoped.
- Run the scan locally, per below (current path).

## Phase 1 — Live Site

**Status: pipeline built and validated, not yet run against the real site.**

- `a11y-audit/local-scan/` — a complete, tested Node.js pipeline
  (Playwright + axe-core + exceljs) implementing the full spec: sitemap +
  BFS crawl, axe scan per page × viewport, scripted manual checks (focus
  order/indicator contrast, hover-state contrast, disabled-state contrast,
  form-error association, skip link, keyboard-trap detection,
  prefers-reduced-motion, 200%-zoom overflow), contrast re-derivation
  cross-referenced against the validated Figma token seed data, and a
  4-tab Excel workbook builder with dedupe, severity color-coding, frozen
  headers, and autofilter.
- **Verified working**: ran `node --check` on every script, installed
  dependencies, and dry-ran the merge step against representative mock
  scan data — it produced a valid `.xlsx` (4 sheets, correct row counts,
  re-opened and validated after write). The merge/report logic is proven;
  only the actual network fetch against the live site is blocked here.
- **Next action**: run `npm run all` inside `a11y-audit/local-scan/` from a
  machine with real access to `theoriginaltour.com` (confirmed available on
  the user's personal laptop). See that folder's `README.md` for exact
  steps. Output lands at `a11y-audit/local-scan/output/TOT_WCAG21AA_Audit.xlsx`.

## Phase 2 — Figma

**Status: not started (per original instructions — Phase 2 begins only
after Phase 1 is reviewed).**

- Figma access confirmed viable from this session: authenticated as the
  user's account, with View access to "The Original Tour" team, and
  successfully pulled metadata for node `5105:46216` (page "✅ 1B UI
  Designs 💻 📱") — 200+ frames confirmed present, matching the brief.
- `config/figma_tokens_seed.json` (already in the repo) holds the fully
  validated token contrast table from the seed data, ready to be reused
  as-is for the Design Tokens tab and cross-referencing in Phase 2.

## Files in this repo so far

```
a11y-audit/
  STATUS.md                          (this file)
  local-scan/
    README.md                        run instructions
    package.json
    config/settings.js                tunable scan parameters
    config/figma_tokens_seed.json     validated Figma token contrast table (seed data)
    scripts/01_crawl_site.js
    scripts/02_run_axe_scan.js
    scripts/03_contrast_check.js
    scripts/04_merge_to_xlsx.js
    scripts/lib/contrast.js           WCAG luminance/contrast math
    scripts/lib/wcag_tags.js          axe tag -> WCAG SC mapping
```

# The Original Tour — WCAG 2.1 AA Audit: Status

_Last updated: 2026-08-31 (WCAG 2.2 AA)_

## Both phases COMPLETE — live site re-scanned 31 Aug

### Deliverables — WCAG 2.2 Level AA
- **`WCAG22_AA_AUDIT.md`** — the full audit. 11 areas, per-issue format,
  PASS / FAIL / NEEDS TESTING scorecard. **18 FAIL, 26 NEEDS TESTING.**
- **`DEV_FIXES.md`** — 12 numbered fixes, every value pre-decided.
- **`DESIGN_FIXES.md`** — 6 items only a designer can do in Figma.
- **`MANUAL_TEST_PLAN.md`** — scripts all 26 untested criteria. ~2 days.
- Figma page **"Accessibility Fixes — WCAG 2.2 AA"** (node `14863:221`).
  The older 2.1 page is renamed `[SUPERSEDED]` rather than deleted.

**Status: NOT WCAG 2.2 AA conformant.** A single unresolved failure breaks
conformance, so both the 18 verified failures and the 26 untested criteria must
be settled before any AA claim.

### Standard changed 2.1 -> 2.2
Six criteria are new in 2.2 and were never assessed by earlier passes:
2.4.11 Focus Not Obscured (AA) · 2.5.7 Dragging Movements (AA) ·
2.5.8 Target Size (AA) · 3.2.6 Consistent Help (A) · 3.3.7 Redundant Entry (A) ·
3.3.8 Accessible Authentication (AA). 4.1.1 Parsing was removed in 2.2.

Accuracy notes: 2.3.3 reduced motion is **AAA**, not counted against AA.
2.5.8 requires **24x24** at AA; 44x44 is 2.5.5 (AAA).
Reflow at 320px/400% was **never tested** — not assumed to pass.
- **`DEV_HANDOVER.md`** — superseded by DEV_FIXES.md + DESIGN_FIXES.md.
- `output/TOT_WCAG21AA_Audit_FULL.xlsx` — 7-tab workbook, both phases.
  Regenerate any time with `npm run full` in `local-scan/`.
- Figma page **"Prod Accessibility Issues"** (node `14651:221`) in file
  `NpuVbHpQHxyeiIG2KKupwv`.

## Phase 1 — Live Site

Runs from a machine with real network access (this session's egress policy
blocks `theoriginaltour.com`; the pipeline is built and validated here, then
executed locally).

### Re-scan comparison

| | 26 Aug | 31 Aug | |
|---|---|---|---|
| Pages / page-views | 69 / 138 | 69 / 138 | unchanged |
| Raw axe violations | 202 | 202 | **identical** |
| Contrast findings | 269 | 330 | +61 |
| → token-traced | 45 | 46 | ~same |
| → live-site drift | 224 | 214 | −10 |
| → needs manual review | n/a | 70 | new category |
| Phase 1 issue log | 360 | 420 | +60 |

**No fixes have shipped between the two runs.** The axe violation count is
identical at 202 — same rules, same pages. None of the Dev Action Plan items
have landed yet.

**The count increase is a script correction, not new problems.** The +61 is
almost entirely the 70 new `needs_manual_review` rows: text sitting on a
background image or gradient, where computed styles cannot resolve the real
backdrop. The old script silently assumed white and either fabricated a
failure or dropped the case. Drift correspondingly fell 224 → 214 and the
bogus `#ffffff on #ffffff` rows are gone. **The report is more accurate even
though the number went up.**

Top findings (unchanged): no focus indicator site-wide, no skip link
site-wide, 200% zoom reflow failure site-wide, large cluster of
light-text-on-light-background, keyboard-inaccessible scroll regions on the
route-map pages.

### Baseline
`data/baseline/` holds the 31 Aug run (138 page files). Future runs:
`npm run all && node scripts/05_diff_runs.js` → FIXED / NEW / STILL OPEN.

## Phase 2 — Figma: COMPLETE

- 287 frames across 27 sections on page `5105:46216` audited
- 29 component sets on the COMPONENTS page inspected
- 136 findings (FIG- prefix)

### Key correction made during Phase 2
An early draft finding claimed interactive states were undesigned. That was
**wrong** — verified against the real component library, `Button- Master` has a
complete 60-variant matrix (Default/Hover/Pressed/Focus/Disabled x 4 Types x 3
Sizes). The real finding is more useful: the **Focus state is correctly designed
and compliant (3.01:1 ring) but never implemented in code**. That reframes the
site-wide focus failure from a design gap to a pure dev gap — roughly an hour
of CSS rather than a design cycle.

Also corrected: the original seed table cited the hover fix `#2a6fa8` at 7.1:1.
Recomputed from the actual component fill, the true ratio is **5.33:1** — still
an AA pass, but the earlier figure was overstated.

## MAJOR CORRECTION (31 Aug) — read before acting on contrast

An earlier version of this audit claimed ~185 instances of "invisible light text
on light backgrounds" and called it the single biggest issue. **That was largely
a flaw in the contrast script, not a fault in the site.**

The script could not see background *images*. Where white text sits on a hero
photo or gradient, it walked up the DOM for a solid colour, found none, and fell
through to the page background — reporting "white on cream = 1.09:1". The
affected elements are hero headings and card badges, which are almost certainly
rendering correctly.

**Do not change hero heading colours on that evidence.** `07_verify_backdrops.js`
settles every such case in one run and produces a visual report.

## What the trustworthy data says

axe-core (which reports "incomplete" rather than guessing) found only **four**
issue types across all 69 pages:

| Nodes | Pages | Issue |
|---|---|---|
| 174 | 31 | Colour contrast — almost all `text-[#A3A3A3]` at 2.52:1 |
| 20 | 14 | Scrollable region not keyboard accessible |
| 4 | 2 | Heading level skipped |
| 2 | 1 | Alt text duplicates adjacent text |

The top row is cross-verified: `#A3A3A3` is exactly the `01-text/tertiary` token
the Figma audit independently flagged. **One find-and-replace fixes 174 elements.**

Also downgraded: the 200% zoom finding reported 69/69 pages failing. A 100%
failure rate indicts the test, not the site — it used CSS `zoom`, which is not
how browser zoom works. Needs a proper manual retest before anyone actions it.

## Known limitations (documented in the workbook's Read Me)

1. **70 rows are marked `review`, not failures.** Text on background
   images/gradients cannot be judged automatically. Must be verified by eye
   before being filed as bugs.
2. **Focus-walk counts vary run to run.** The cookie-consent banner can capture
   focus and truncate the tab walk, so per-page manual counts swing between
   runs (e.g. `/tours/` desktop: 43 on 26 Aug, 4 on 31 Aug). Treat them as
   indicative, not a trend line. **The axe counts ARE stable and comparable.**
   Not yet fixed — see Open items.
3. Automation cannot judge whether alt text is *meaningful*, only that it exists.
4. Any keyboard trap needs a human tabbing through to reproduce reliably.
5. No screen-reader (NVDA/VoiceOver) testing was performed.
6. Booking/payment flows were not exercised end-to-end.

## Open items

- **Dismiss the cookie banner before the focus walk** (~30 min) so focus-order
  results become deterministic and run-over-run comparable. Worth doing before
  devs start shipping, or the first progress diff will be partly noise.
- Screen-reader pass on the key booking journey (manual, not automatable).

## Files

```
a11y-audit/
  STATUS.md
  output/TOT_WCAG21AA_Audit_FULL.xlsx     final deliverable (7 tabs)
  phase2/audit_figma.py                    Figma frame-audit script
  phase2/figma_findings.json               136 Phase 2 findings
  local-scan/                              Phase 1 pipeline (run locally)
    scripts/01_crawl_site.js               sitemap + BFS crawl
    scripts/02_run_axe_scan.js             axe + scripted state checks
    scripts/03_contrast_check.js           exact ratios + token cross-ref
    scripts/04_merge_to_xlsx.js            Phase 1 workbook
    scripts/05_diff_runs.js                run-over-run comparison
    scripts/06_build_full_workbook.js      COMPLETE 7-tab workbook
```

### Commands

```bash
npm run everything   # crawl + scan + contrast + full workbook
npm run full         # rebuild full workbook from existing scan data
node scripts/05_diff_runs.js --save-baseline   # bank a comparison point
node scripts/05_diff_runs.js                   # FIXED / NEW / STILL OPEN
```

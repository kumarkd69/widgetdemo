# The Original Tour — WCAG 2.1 AA Audit: Status

_Last updated: 2026-08-26_

## Both phases COMPLETE

### Deliverables
- `a11y-audit/output/TOT_WCAG21AA_Audit_FULL.xlsx` — 7-tab workbook covering both phases (496 issues)
- Figma page **"Prod Accessibility Issues"** (node `14651:221`) in file `NpuVbHpQHxyeiIG2KKupwv`

## Phase 1 — Live Site: COMPLETE

Ran from the user's own machine (this session's egress policy blocks
`theoriginaltour.com`; pipeline in `local-scan/` was built and validated here,
then executed locally).

- 69 pages crawled, 138 page-views scanned (desktop 1440 + mobile 390)
- 100% scan success, 0 auth-blocked pages
- 202 raw axe violations, 269 confirmed contrast re-checks
- 360 deduped issues

Top findings: no focus indicator (69/69 pages), no skip link (69/69), 200% zoom
reflow failure (69/69), 185 instances of light-text-on-light-background, 1
keyboard trap, 17 pages with keyboard-inaccessible scroll regions.

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
69-page focus failure from a design gap to a pure dev gap.

Also corrected: the original seed table cited the hover fix `#2a6fa8` at 7.1:1.
Recomputed from the actual component fill, the true ratio is **5.33:1** — still
an AA pass, but the earlier figure was overstated.

## Root-cause summary

215 "critical" rows are NOT 215 independent bugs:
- 185 share one cause (inherited light text on light backgrounds) -> one CSS fix
- 69-page focus + 69-page skip-link findings are each a single global fix
- The first 3 items in the Dev Action Plan tab clear ~90% of all findings

## Known limitations (documented in the workbook's Read Me)

1. 5 DRIFT rows report `#ffffff on #ffffff = 1:1` — contrast script falls back to
   white when it cannot resolve an ancestor background-image. Verify by eye.
2. Automation cannot judge whether alt text is *meaningful*, only that it exists.
3. The keyboard trap needs a human to reproduce reliably.
4. No screen-reader (NVDA/VoiceOver) testing was performed.
5. Booking/payment flows were not exercised end-to-end.

## Files

```
a11y-audit/
  STATUS.md
  output/TOT_WCAG21AA_Audit_FULL.xlsx     final deliverable (7 tabs, 496 issues)
  phase2/audit_figma.py                    Figma frame-audit script
  phase2/figma_findings.json               136 Phase 2 findings
  local-scan/                              Phase 1 pipeline (run locally)
```

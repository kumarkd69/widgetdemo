# Accessibility — The Original Tour
### WCAG 2.2 Level AA · start here

**Current status: not conformant.** 17 verified failures, 27 criteria still
unverified. This page is the route to resolving all of it.

| Document | For | What it is |
|---|---|---|
| **`DEV_FIXES.md`** | Developers | 12 numbered fixes, every value decided |
| **`DESIGN_FIXES.md`** | Designers | 6 Figma changes only a designer can make |
| **`MANUAL_TEST_PLAN.md`** | QA / tester | 26 tests covering the 27 unverified criteria |
| **`WCAG22_AA_AUDIT.md`** | Reference / compliance | Full audit, per-criterion, with scorecard |
| Figma: *Accessibility Fixes — WCAG 2.2 AA* | Everyone | The same content, visually |

---

## How to resolve everything

The three workstreams below are **independent**. Run them in parallel. The
common mistake is treating manual testing as a final sign-off step — it is the
longest task and the one most likely to uncover new failures, so it must start
on day one alongside the others.

```
Day 1     ├── Step 0: verify + regenerate      (30 min, blocks nothing)
          │
          ├── Track A: developer fixes          ██████████  2–3 days
          ├── Track B: design changes           ██████      1–2 days
          └── Track C: manual testing           ████████    2 days   ← START NOW
                                                    │
Day 4-5                                             ▼
          └── Fix what Track C surfaced, re-scan, compare
```

---

## Step 0 — before scoping anything (30 minutes)

Two commands. Do these first: they change how much work there actually is.

```bash
cd a11y-audit/local-scan
git pull

# 1. Settle the ~214 unproven contrast rows
node scripts/07_verify_backdrops.js
open output/verify-backdrops.html

# 2. Regenerate the workbook from current data
npm run full
```

The verifier sorts every ambiguous contrast row into `REAL_FAIL`, `PASSES`, or
"sits on an image — human check". Most are expected to clear. **Only `REAL_FAIL`
rows become dev work.** Skipping this step means either fixing things that
aren't broken, or missing ones that are.

> `npm run full` has not yet been run against the full 69-page dataset — only
> against sample data. If it errors, send the output and it can be corrected.

---

## Track A — Developer fixes · 2–3 days

Work `DEV_FIXES.md` top to bottom. Nothing waits on a designer; every value is
already decided.

| # | Fix | Effort | Clears |
|---|---|---|---|
| 1 | `text-[#A3A3A3]` → `text-[#767676]` | 1 hr | 174 elements, 31 pages |
| 2 | `:focus-visible` ring | 1 hr | Site-wide |
| 3 | Skip-to-content link | 1 hr | Site-wide |
| 4 | `tabindex="0"` on scrollers | 2 hrs | 20 regions |
| 5 | Badge + token colour values | 2 hrs | Site-wide |
| 6 | Heading tags, alt text | 30 min | 6 elements |
| 7 | Landmark elements | 2 hrs | Site-wide |
| 8 | Tap target hit areas | 4 hrs | ~30 controls |
| 9 | Form ARIA — **inspect first** | 0–4 hrs | All forms |

Item 9 may already be correct — the scan produced no evidence either way. Check
the existing markup before changing it.

**Item 1 is the highest return in the whole project:** one find-and-replace,
174 elements, no visual risk.

---

## Track B — Design changes · 1–2 days

Work `DESIGN_FIXES.md`. Independent of Track A — developers are shipping the
recommended values already, so nothing is blocked waiting on these.

1. Confirm the button hover fix (Option A `#2a6fa8` is being shipped by default)
2. Update the 8 colour variables + 3 badge colours
3. Create the Input component with Default / Focus / Error / Disabled / Filled
4. Mark one frame per screen as current, deprecate ~90 duplicates
5. Decide decorative vs informative for 12 illustrations
6. Fix the `Titles/Mobile/H5` font inconsistency

Item 4 costs almost nothing and prevents developers building from stale frames —
worth doing first.

---

## Track C — Manual testing · 2 days · **start immediately**

Work `MANUAL_TEST_PLAN.md`. One tester, comfortable with a keyboard and a screen
reader. No development knowledge needed for most of it.

**Why this starts on day one:** 27 criteria are currently unknown. Some will
pass, some will fail, and the failures become additional dev work. Discovering
that in week two means re-planning; discovering it on day two means absorbing it.

The four to do first, in order:

1. **Reflow at 320px / 400% zoom** — never tested, Level AA, commonly fails.
   Highest chance of adding new work.
2. **Keyboard trap** — Level A, most severe failure class if real.
3. **Focus obscured by the sticky header** — new in WCAG 2.2, high suspicion.
4. **Route maps** — is the route information available as text at all? If not,
   that's a content problem no code change fixes.

---

## Then — close it out

```bash
# after fixes are deployed
cd a11y-audit/local-scan
npm run everything
node scripts/05_diff_runs.js
```

`05_diff_runs.js` reports FIXED / NEW / STILL OPEN against the banked baseline.
Watch the **NEW** column — that catches regressions introduced by the fixes.

You are done when: every item in `DEV_FIXES.md` is shipped · `MANUAL_TEST_PLAN.md`
has no outstanding FAIL · the re-scan is clean.

---

## Two things worth knowing before you start

**Scanning finds roughly 30–40% of WCAG issues.** The 17 verified failures are
the floor, not the ceiling. Track C exists because the rest can only be found by
a person using a keyboard and a screen reader.

**Not all 17 failures are equally evidenced.** Four are confirmed by axe-core and
are the most reliable. Eight are measured from the Figma file, so the design
system is certain but live incidence is inferred. Five come from checks written
for this audit — the same tooling that produced two findings later withdrawn.
Confirm rather than assume, particularly on anything that looks surprising.

**On the conformance statement:** if some items cannot be closed before launch,
publish a *partial* conformance statement naming exactly what does not yet
conform and when it will. An inaccurate blanket AA claim carries more legal and
reputational exposure than an honest one that admits known gaps.

---

## Running the scan yourself

```bash
cd a11y-audit/local-scan
npm install
npx playwright install chromium
npm run everything      # crawl + scan + contrast + workbook
```

Full crawl of 69 pages takes a few minutes. Add it to CI to stop regressions:

```bash
npm i -D @axe-core/playwright
npx playwright test a11y.spec.ts    # fail the build on any violation
```

# Accessibility Fixes — Developer Handover
### theoriginaltour.com · WCAG 2.1 Level AA

**Read this first.** Every fix below is written to be applied as-is. Nothing here
requires a refactor. The site is Tailwind CSS, so most fixes are class or token
swaps.

There are **6 fixes a developer can apply today** with no design input. They clear
the large majority of confirmed issues. Everything else is either a design
decision (Section B) or needs one verification step first (Section C).

> **Important — read before you touch contrast.** An earlier draft of this audit
> claimed ~185 instances of "invisible light text". That was largely a flaw in my
> own scanner: it could not see background *images*, so white hero headings sitting
> on photos were reported as white-on-cream. **Do not change hero heading colours.**
> Section C explains how to settle those cases properly in one run.

---

## SECTION A — Apply directly. No design input needed.

Ordered by impact. A1–A2 are pure find-and-replace; A3–A4 are additive.

---

### A1 · Grey text fails contrast — 174 elements across 31 pages
**WCAG 1.4.3 (AA)** · Confidence: **verified twice** (axe-core + Figma token audit agree)

`#A3A3A3` on white measures **2.52:1**. AA requires **4.5:1** for text this size
(it is used at `text-xs` / `text-sm`). This is the single largest genuine issue.

```diff
- text-[#A3A3A3]
+ text-[#767676]
```

Find and replace across the codebase, case-insensitively:

| Find | Replace |
|---|---|
| `text-[#A3A3A3]` | `text-[#767676]` |
| `text-[#a3a3a3]` | `text-[#767676]` |
| `#A3A3A3` (as a text colour) | `#767676` |

`#767676` = **4.54:1** on white — the lightest grey that passes AA. It is
visually near-identical, so there is no layout or design risk.

> Only change it where it is **text**. If `#A3A3A3` is used for a border or an
> icon, see B3 — those need `#8f8f8f` instead (3:1 threshold, not 4.5:1).

**Verify:** re-run the scan; the "colour contrast" violation count should drop
from 174 to near zero.

---

### A2 · Horizontal scrollers can't be used with a keyboard — 20 regions, 14 pages
**WCAG 2.1.1 (A)** · Confidence: **verified** (axe-core)

Every `.overflow-x-auto` carousel is mouse/touch-only. A keyboard user cannot
scroll it, so the content inside is unreachable. Mostly the route-map and
card carousels.

```diff
- <div class="overflow-x-auto ...">
+ <div class="overflow-x-auto ..." tabindex="0" role="region" aria-label="Tour cards, scrollable">
```

Give each one a label that describes *its own* content ("Route map, scrollable",
"Popular tours, scrollable"). Do not reuse one generic label.

> **Also required for the route maps:** a pannable map is unusable by a screen
> reader no matter how focusable it is. The same stop/route information must exist
> as real text or a table somewhere on the page. If it already does, you are done.
> If not, this is a content task — flag it, do not skip it.

---

### A3 · No visible keyboard focus indicator — every page
**WCAG 2.4.7 (AA), 1.4.11 (AA)** · Confidence: **high** — the design already exists

**The design system already specifies a compliant focus ring and it was never
implemented.** `Button- Master` in Figma defines a Focus variant: a 2px `#4398d4`
ring, which measures 3.01:1 against the button and 3.14:1 against a white page —
both clear the 3:1 requirement. So this is implementation only, no design work.

Add once, globally:

```css
:focus-visible {
  outline: 2px solid #4398d4;
  outline-offset: 2px;
}
```

Then **search the codebase for `outline: none`, `outline: 0`, and
`focus:outline-none`** and remove every instance that has no replacement ring.
This is usually the actual culprit — a global reset that was never paired with a
focus style.

> The 3.01:1 margin is thin. If the ring will ever sit on a light surface, use
> `#164291` instead (9.45:1 on white). Both are existing brand tokens.

---

### A4 · No skip-to-content link — every page
**WCAG 2.4.1 (A)** · Confidence: **verified** (scripted tab-order check)

On all 69 pages the first Tab stop is the cookie banner's "Cookie Settings"
button. A keyboard user must tab through the entire header and nav on every
page before reaching content.

```html
<!-- FIRST focusable element in the DOM, before the cookie banner -->
<a href="#main" class="skip-link">Skip to main content</a>
...
<main id="main" tabindex="-1"> ... </main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 12px 20px;
  background: #164291;
  color: #ffffff;   /* 9.45:1 */
  border-radius: 0 0 6px 0;
}
.skip-link:focus { left: 8px; top: 8px; }
```

> **Check the cookie banner too.** If it traps focus or auto-focuses on load, the
> skip link is useless. The banner should be reachable but must not capture focus
> before the user asks for it.

---

### A5 · Heading levels skip a rank — 4 headings, 2 pages
**WCAG 1.3.1 (A)** · Confidence: **verified** (axe-core)

An `<h3>` appears with no `<h2>` above it. Screen-reader users navigate by
heading structure, and a skipped rank reads as missing content.

```diff
- <h3 class="...">Section title</h3>
+ <h2 class="...">Section title</h2>
```

Change the **tag**, keep the Tailwind text classes so nothing moves visually.

---

### A6 · Image alt text duplicates the adjacent heading — 2 images, 1 page
**WCAG 1.1.1 (A)** · Confidence: **verified** (axe-core)

On the attractions listing, `img[alt="Kensington Palace"]` sits directly beside a
heading reading "Kensington Palace". A screen reader announces it twice.

```diff
- <img alt="Kensington Palace" ...>
+ <img alt="" ...>
```

The adjacent heading already names it, so the image is decorative in context.
Same for `img[alt="Tower of London"]`.

---

## SECTION B — Needs a design decision first

A developer should **not** pick these values alone. Each needs a designer to sign
off, then it becomes a one-line change. All are required for AA.

---

### B1 · Button hover state fails contrast — every primary button
**WCAG 1.4.3 (AA)** · **This is the most important design decision on the list.**

Hover is `#4398d4` with a white label = **3.14:1**. Button labels are 16px
Semibold / 14px Bold / 12px Bold — **none** qualify as WCAG "large text"
(that needs ≥18.66px bold), so all three sizes require the full 4.5:1.

Two valid fixes — **designer picks one**:

| Option | Change | Result |
|---|---|---|
| **A (recommended)** | Hover background → `#2a6fa8` | white label = **5.33:1** ✅ |
| **B** | Keep `#4398d4`, label → `#171717` | **5.70:1** ✅ |

Option A keeps white labels consistent across all states. Option B preserves the
lighter blue but makes hover the only state with dark text.

Apply to the Hover variant of all 4 Types × 3 Sizes (12 Figma variants), then the
matching CSS token.

---

### B2 · Coloured badges fail contrast with white text
**WCAG 1.4.3 (AA)** · Confidence: **verified** (flat backgrounds, ratios reliable)

| Badge | Current | Ratio | Fix to | New ratio |
|---|---|---|---|---|
| Blue | `#3b82f6` | 3.68:1 ❌ | `#2563eb` | **5.17:1** ✅ |
| Green | `#16a34a` | 3.30:1 ❌ | `#15803d` | **5.02:1** ✅ |
| Pink | `#ec4899` | 3.53:1 ❌ | `#be185d` | **6.04:1** ✅ |
| Red | `#e30910` | 4.87:1 ✅ | — | no change |

Each fix keeps the hue and shifts one step darker on the same Tailwind scale.
Designer should confirm the darker shades still read as the same category colour.

Also: **`#fce6e7` text on `#e30910` = 4.08:1** (9 instances) — just short of 4.5.
Use plain white instead: **4.87:1** ✅

---

### B3 · Design token fixes
**WCAG 1.4.3 / 1.4.11** · Change the variable, every instance follows.

| Token | Current | Ratio | Fix to | New | Threshold |
|---|---|---|---|---|---|
| `01-text/tertiary` | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 | 4.5 (text) |
| `01-text/disabled` | `#d4d4d4` | 1.48:1 | `#949494` | 4.20:1 | see note |
| `04-icon/disabled` | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.40:1 | 3.0 (icon) |
| `06-border/primary` | `#e5e5e5` | 1.26:1 | `#8f8f8f` | 3.03:1 | 3.0 (input borders) |
| `06-border/strong` | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 | 3.0 |
| `10-brand/accent` | `#9cd1f3` | 1.64:1 | `#3f8fc4` | 3.10:1 | 3.0 if meaningful |
| `11-primitive/amber/500` | `#f59e0b` | 2.15:1 | `#b45309` | 5.02:1 | 3.0 |
| `11-primitive/neutral/300` | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.03:1 | 3.0 |
| `success/icon` used **as text** | `#16a34a` | 3.30:1 | add `success/text` `#15803d` | 4.60:1 | 4.5 |

**Notes for the designer:**
- `06-border/primary` only needs changing where the border is *functional*
  (input fields, control boundaries). Purely decorative dividers are exempt.
- `10-brand/accent` — if it is decorative only, no change is needed. Confirm.
- `success/icon` is fine at 3:1 for icons. The problem is reusing it for text.
  Split it into two tokens rather than changing the icon colour.
- **Disabled controls are exempt from 1.4.3.** Fixing them is best practice, not
  strictly required for AA. Deprioritise if time is short.

**Verified passing — do not change:** `01-text/primary` 17.93:1 ·
`01-text/secondary` 7.81:1 · `01-text/link` 9.45:1 · `semantic/text/link` 4.87:1 ·
`warning/text` 5.02:1 · `info/icon` 5.56:1 · `06-border/focus` 9.45:1 ·
inverse on Footer BG 13.07:1 · text on Paper BG 15.75:1 · text on Header 14.71:1

---

### B4 · Form fields have no component, and errors aren't announced
**WCAG 3.3.1 (A), 4.1.2 (A)**

There is **no Input/Text Field component** anywhere in the library (29 component
sets, none are form fields). Fields are drawn per screen, so error, focus and
disabled states are inconsistent.

**Designer:** create an Input set with variants Default / Focus / Error /
Disabled / Filled. Focus ring `#164291` (9.45:1). Error must use an icon **and**
text, never colour alone.

**Developer:** whatever the visual design, the markup must be:

```html
<label for="email">Email address</label>
<input id="email" aria-invalid="true" aria-describedby="email-err">
<p id="email-err" role="alert">Enter a valid email address</p>
```

- `aria-describedby` links the message to the field
- `aria-invalid="true"` marks the field as failed
- `role="alert"` announces it when it appears

---

### B5 · Tap targets below minimum — ~30 elements
**WCAG 2.5.8 (AA, 2.2)** · Target: 24×24 minimum, 44×44 recommended on mobile

Icon buttons and arrow controls (mostly the `vuesax` arrows and hero search
affordances) are below minimum. Prefer extending the hit area over resizing the
icon:

```css
.icon-btn { min-width: 44px; min-height: 44px; display: grid; place-items: center; }
```

The icon stays its current size; only the touch area grows.

---

### B6 · Decorative illustrations need an export strategy
**WCAG 1.1.1 (A)**

Twelve frames contain 150+ vector layers each (pigeons, trees, skyline). If these
export as individual inline SVG nodes, a screen reader announces every fragment.

Export each illustration as **one** asset:

```html
<img src="skyline.svg" alt="" aria-hidden="true">
```

If an illustration conveys real information, give it a single meaningful `alt`
instead. Never ship hundreds of separately exposed nodes.

---

## SECTION C — Verify before fixing. Do not act on these yet.

These are cases where my automated tooling could not reach a trustworthy answer.
Acting on them blind risks breaking working pages.

---

### C1 · ~214 contrast rows on image/gradient backdrops — **run the verifier**

My contrast script could not see background *images*. Where text sits on a hero
photo or gradient, it fell through to the page background and reported a false
failure. Hero headings are the main victims.

**One command settles it:**

```bash
cd a11y-audit/local-scan
node scripts/07_verify_backdrops.js
open output/verify-backdrops.html
```

It re-inspects every flagged element, works out what it is *actually* sitting on,
and sorts them:

| Verdict | Meaning | Action |
|---|---|---|
| `REAL_FAIL` | Flat backdrop, genuinely fails | **Fix — safe to action directly** |
| `PASSES` | Passes against the true backdrop | Ignore — false positive |
| `ON_IMAGE` / `ON_GRADIENT` / `OVER_MEDIA` | Sits on imagery | One human glance per cluster |

The HTML report shows a **cropped screenshot of each element**, grouped by
verdict — so a whole repeated component is confirmed in one look, not 214.

For anything on imagery, the correct fix is almost never changing the text
colour. It is adding a scrim/overlay so the text is legible over the *lightest*
part of the image:

```css
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55));
}
```

---

### C2 · 200% zoom reflow — **retest before actioning**
**WCAG 1.4.10 (AA)**

My check reported failure on **69 of 69 pages**. A 100% failure rate is a red flag
about the test, not the site: I used CSS `zoom`, which is not how browser zoom
works. A responsive Tailwind site would very likely pass a correct test.

**Correct manual test:** set the browser to 200% zoom at 1280×1024 (equivalent to
a 640px viewport). Content must reflow to a single column with **no horizontal
scrollbar**. Check the homepage, a PDP, a route map, and a form page.

Only if it genuinely fails:

```css
.container {
  max-width: 1200px;
  width: 100%;
  padding-inline: clamp(16px, 4vw, 48px);
}
/* avoid: width: 1200px; min-width: 1200px; */
```

---

### C3 · Possible keyboard trap — **needs a human**
**WCAG 2.1.2 (A)** · The most severe failure class if real.

One page showed focus stuck on an `<a>` — Tab stopped advancing. Automated
detection here is indicative, not conclusive.

**Test:** tab through the page from the address bar. If focus gets stuck, find the
handler calling `preventDefault` on Tab, or the roving-tabindex logic, and fix it.
Any modal must also close on `Escape` and return focus to its trigger.

---

## SECTION D — Required for an AA claim, cannot be automated

**Do not skip these.** A site is not AA-conformant because a scanner is quiet.
Automated tooling catches roughly 30–40% of WCAG issues.

| # | Task | Why |
|---|---|---|
| D1 | Screen-reader pass (NVDA/Windows + VoiceOver/iOS) on booking, search, contact | The only way to know the experience actually works |
| D2 | Review whether `alt` text is *meaningful*, not just present | Automation confirms existence, never quality |
| D3 | Test the full booking + payment journey end to end by keyboard | Not exercised by this audit |
| D4 | Confirm error messages are announced, not just displayed | Needs a real screen reader |
| D5 | Check `prefers-reduced-motion` actually suppresses animation | Same-origin CSS inspection was inconclusive |

---

## Recommended order of work

1. **A1** — one find-and-replace, clears 174 elements
2. **A3 + A4** — global CSS + one link, clears every page
3. **A2, A5, A6** — small, contained
4. **C1** — run the verifier, fix only `REAL_FAIL`
5. **B1 + B2 + B3** — designer decides, then token swaps
6. **B4, B5, B6** — design + build
7. **C2, C3** — verify, fix if real
8. **D1–D5** — manual QA before you claim conformance

## Stop this recurring

```bash
npm i -D @axe-core/playwright
npx playwright test a11y.spec.ts   # fail the build on any violation
```

Run against a preview deploy on every PR. The full 69-page crawl takes minutes.
The pipeline is already written in `a11y-audit/local-scan/`.

---

## Confidence key

| Level | Meaning |
|---|---|
| **Verified twice** | axe-core and the Figma audit independently agree |
| **Verified** | axe-core confirmed; axe does not guess on contrast |
| **High** | Cross-checked against the design system by hand |
| **Needs verification** | My tooling could not reach a trustworthy answer — Section C |

Figures come from a full crawl of 69 pages × 2 viewports (desktop 1440, mobile
390) on **31 Aug 2026**. Between the 26 Aug and 31 Aug runs the axe violation
count was **identical at 202** — no fixes had shipped in that window.

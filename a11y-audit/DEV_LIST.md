# Developer list — accessibility
### theoriginaltour.com · WCAG 2.2 AA

Design-side work is done. The design tokens and button component in Figma are
now correct, so the values below are final — nothing here is waiting on anyone.

Work top to bottom. Item 1 is by far the highest return.

---

### 1 · Grey text — 174 elements, 31 pages · 1 hr
`#A3A3A3` on white = 2.52:1. Needs 4.5:1.

```
text-[#A3A3A3]  →  text-[#767676]
text-[#a3a3a3]  →  text-[#767676]
```

Case-insensitive find and replace. `#767676` = 4.54:1.

> This is a **code-only** problem. The Figma token is already correct at
> `#525252` — the hex is hardcoded in the markup and never came from the token.

---

### 2 · Focus ring — every page · 1 hr
No custom focus style exists, so focus falls back to the browser default black
outline: 2.22:1 against the `#154291` buttons. Needs 3:1.

```css
:focus-visible {
  outline: 2px solid #2a6fa8;
  outline-offset: 2px;
}
```

`outline-offset` matters — it puts the ring outside the component, where it
measures 5.33:1 against the page. Without the offset it sits on the button and
drops to 1.77:1.

Then grep for `outline: none`, `outline: 0`, `focus:outline-none` and remove any
that have no replacement.

**Destructive / delete buttons** need their own ring — use `#991b1b` (8.31:1):
```css
.btn-destructive:focus-visible { outline-color: #991b1b; }
```

---

### 3 · Skip to content — every page · 1 hr
First Tab stop is currently the cookie banner.

```html
<a href="#main" class="skip-link">Skip to main content</a>
<main id="main" tabindex="-1"> ... </main>
```
```css
.skip-link { position:absolute; left:-9999px; z-index:9999;
             padding:12px 20px; background:#164291; color:#fff; }
.skip-link:focus { left:8px; top:8px; }
```

Must be first in the DOM, before the banner. Check the banner doesn't trap or
steal focus.

---

### 4 · Horizontal scrollers — 20 regions, 14 pages · 2 hrs
`.overflow-x-auto` carousels are mouse/touch only.

```html
<div class="overflow-x-auto" tabindex="0" role="region"
     aria-label="Popular tours, scrollable">
```

Label each one for its own content. **Route maps also need the stop data as
real text or a table** — a pannable map is unusable by a screen reader however
focusable it is.

---

### 5 · Badge colours · 1 hr

| Badge | Now | Change to | Result |
|---|---|---|---|
| Blue | `#3b82f6` | `#2563eb` | 3.68 → 5.17:1 |
| Green | `#16a34a` | `#15803d` | 3.30 → 5.02:1 |
| Pink | `#ec4899` | `#be185d` | 3.53 → 6.04:1 |
| Red | `#e30910` | no change | 4.87:1 already |

Also `#fce6e7` text on the red badge = 4.08:1 → use plain white (4.87:1).

---

### 6 · Sync these token values · 1 hr
Match what is now in Figma:

```
--border-primary:  #737373   /* was #e5e5e5 — 1.26:1, now 4.74:1 */
--text-tertiary:   #525252   /* confirm code matches; see item 1 */
--action-primary-hover: #2a6fa8
--focus-ring:      #2a6fa8
--focus-ring-destructive: #991b1b
```

Apply `--border-primary` to **functional** borders only — inputs, control
boundaries. Decorative dividers stay light and are exempt.

---

### 7 · Landmarks + heading levels · 2 hrs
```html
<header role="banner"> <nav aria-label="Main"> <main id="main"> <footer role="contentinfo">
```
And two pages have an `<h3>` with no `<h2>` — change the tag, keep the classes.

---

### 8 · Tap targets + duplicate alt · 2 hrs
```css
.icon-btn { min-width:44px; min-height:44px; display:grid; place-items:center; }
```
Grow the hit area, not the icon. 24×24 is the AA floor; 44×44 is better on mobile.

```html
<!-- attractions listing: heading already names these -->
<img alt="" ...>   <!-- was alt="Kensington Palace" / "Tower of London" -->
```

---

### 9 · Form fields — **check before changing** · 0–4 hrs
The scan produced no evidence either way, so this may already be correct.
Submit a form with invalid data and inspect. If these are present, tick it off:

```html
<label for="email">Email address</label>
<input id="email" aria-invalid="true" aria-describedby="email-err">
<p id="email-err" role="alert">Enter a valid email address</p>
```

Never signal an error by colour alone — keep the icon and the text.

There is now an **`Input- Master`** component set in Figma (COMPONENTS page) with
Default / Focus / Filled / Error / Disabled. Build against it. Values:

| Part | Value | Ratio |
|---|---|---|
| Border, default | `#737373` | 4.74:1 |
| Focus ring, 2px **outside** | `#164291` | 9.45:1 |
| Border, error | `#c2070d` | 6.31:1 |
| Error message text | `#9e1525` | 8.11:1 |
| Placeholder | `#525252` | 7.81:1 |
| Disabled text on `#fafafa` | `#525252` | 7.49:1 |

Field height is 48px, which clears the 24×24 minimum target size (2.5.8).
Keep the visible `<label>` — placeholder text is not a label (2.4.6, 3.3.2).

---

### 10 · Illustrations — 12 images · 15 min
Confirmed **decorative** by the designer. Ship an empty alt attribute:

```html
<img src="..." alt="">
```

`alt=""` and *no* `alt` attribute are not the same thing — an omitted attribute
makes screen readers announce the filename. It must be present and empty.

---

### 11 · Alerts — keep the icon and the label · 0 hrs
No change needed, but **don't regress this one.** The alert border colours
(`#86efac` success, `#fcd34d` warning, `#f49898` error, `#86b0e3` info) all sit
below 3:1. They're exempt only because each alert also carries a distinct icon
and a text label naming its type, so colour is reinforcement rather than the
sole signal (1.4.1, 1.4.11).

Strip the icon or the label and these become real failures. Same for the brand
accent `#9cd1f3` — decorative only. If it ever lands on an icon, link or active
state, darken it to `#3f8fc4` (3.10:1) first.

---

## Before you ship

**Run the contrast verifier.** ~214 flagged rows are unproven — the scanner
could not resolve background images, so white text on hero photos was wrongly
reported as failing. **Do not change hero heading colours** without this.

```bash
cd a11y-audit/local-scan && node scripts/07_verify_backdrops.js
open output/verify-backdrops.html
```

Fix only `REAL_FAIL`. For text on imagery, add a scrim rather than changing the
text colour.

**Test 200% and 400% zoom by hand.** The scripted check was unreliable. At 400%
(320px viewport) content must reflow to one column with no horizontal scroll.

**Tab through for a keyboard trap.** One page showed focus getting stuck.

## Stop it coming back
```bash
npm i -D @axe-core/playwright
npx playwright test a11y.spec.ts    # fail the build on any violation
```

---

**Not covered here:** screen-reader testing, keyboard-testing the booking
journey, and whether alt text is *meaningful*. Scanning finds 30–40% of WCAG
issues; the rest needs a person. See `MANUAL_TEST_PLAN.md`.

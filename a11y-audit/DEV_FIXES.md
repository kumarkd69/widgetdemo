# Accessibility Fixes — Developer List
### theoriginaltour.com · WCAG 2.2 Level AA · Whole site (all 69 pages)

Every value below is already decided. Nothing here is waiting on a designer.
Work top to bottom — it is ordered by impact.

The site is Tailwind, so most of these are class or token swaps.

> **One warning before you touch colours.** Do **not** change the colour of hero
> headings or any text sitting on a photo. An earlier draft wrongly flagged those —
> the contrast scan could not resolve image backdrops. See check A below.

---

## 1. Grey text — 174 elements, 31 pages
**WCAG 1.4.3** · `#A3A3A3` on white = **2.52:1**, needs 4.5:1

Find and replace, case-insensitive:

```
text-[#A3A3A3]  →  text-[#767676]
text-[#a3a3a3]  →  text-[#767676]
```

`#767676` = 4.54:1, the lightest grey that passes. Visually near-identical.

**Only where it's text.** For borders and icons the threshold is 3:1 — use
`#8f8f8f` there (see item 8).

---

## 2. Focus indicator — every page
**WCAG 2.4.7, 1.4.11** · Nothing currently shows focus

```css
:focus-visible {
  outline: 2px solid #4398d4;
  outline-offset: 2px;
}
```

Then search for `outline: none`, `outline: 0`, `focus:outline-none` and delete
every one that has no replacement. A global reset is usually the real cause.

This ring is already specified in the Figma design system and measures 3.01:1 —
it was simply never built. If it lands on a light surface anywhere, use `#164291`
(9.45:1) instead.

---

## 3. Skip to content — every page
**WCAG 2.4.1** · First Tab stop is currently the cookie banner

```html
<a href="#main" class="skip-link">Skip to main content</a>
<main id="main" tabindex="-1"> ... </main>
```

```css
.skip-link { position:absolute; left:-9999px; z-index:9999;
             padding:12px 20px; background:#164291; color:#fff; }
.skip-link:focus { left:8px; top:8px; }
```

Must be the **first focusable element in the DOM**, before the cookie banner.
Also check the banner doesn't trap focus or grab it on load — if it does, the
skip link is useless.

---

## 4. Horizontal scrollers — 20 regions, 14 pages
**WCAG 2.1.1** · Mouse/touch only, keyboard users can't reach the content

```html
<div class="overflow-x-auto ..."
     tabindex="0"
     role="region"
     aria-label="Popular tours, scrollable">
```

Give each one a label describing its own content. Don't reuse one string.

**Route maps additionally:** a pannable map is unusable by a screen reader no
matter how focusable it is. The stop and route information must also exist as
real text or a table on the page. If it already does, you're done.

---

## 5. Badge colours — white text fails
**WCAG 1.4.3** · Flat backgrounds, so these numbers are reliable

| Badge | Current | Ratio | Change to | New |
|---|---|---|---|---|
| Blue | `#3b82f6` | 3.68:1 | `#2563eb` | 5.17:1 |
| Green | `#16a34a` | 3.30:1 | `#15803d` | 5.02:1 |
| Pink | `#ec4899` | 3.53:1 | `#be185d` | 6.04:1 |
| Red | `#e30910` | 4.87:1 | *no change* | — |

Also: `#fce6e7` text on the red badge = 4.08:1. Use plain white → 4.87:1.

---

## 6. Button hover state
**WCAG 1.4.3** · `#4398d4` + white label = **3.14:1**

```
--action-primary-hover: #2a6fa8;   /* white label = 5.33:1 */
```

Labels are 16px Semibold / 14px Bold / 12px Bold — none count as WCAG "large
text", so all need the full 4.5:1.

> Design may instead prefer keeping `#4398d4` and switching the label to
> `#171717` (5.70:1). Both pass. Ship `#2a6fa8` unless told otherwise — it keeps
> white labels consistent across every state.

---

## 7. Form errors must be announced
**WCAG 3.3.1, 4.1.2** · Errors are currently visual only

```html
<label for="email">Email address</label>
<input id="email" aria-invalid="true" aria-describedby="email-err">
<p id="email-err" role="alert">Enter a valid email address</p>
```

- `aria-describedby` links the message to the field
- `aria-invalid="true"` marks it failed
- `role="alert"` announces it when it appears

Never signal an error with colour alone — keep the icon and the text.

---

## 8. Colour token values
**WCAG 1.4.3, 1.4.11** · Update these wherever they're defined

| Token / usage | Current | Ratio | Change to | New |
|---|---|---|---|---|
| tertiary text | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 |
| disabled text | `#d4d4d4` | 1.48:1 | `#949494` | 4.20:1 |
| disabled icon | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.40:1 |
| input borders | `#e5e5e5` | 1.26:1 | `#8f8f8f` | 3.03:1 |
| strong border | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 |
| brand accent | `#9cd1f3` | 1.64:1 | `#3f8fc4` | 3.10:1 |
| amber | `#f59e0b` | 2.15:1 | `#b45309` | 5.02:1 |
| neutral-300 | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.03:1 |
| green used as **text** | `#16a34a` | 3.30:1 | `#15803d` | 4.60:1 |

**Scope notes:**
- Input borders: only where the border is *functional*. Decorative dividers are exempt.
- Green `#16a34a` is fine for **icons** (3:1). Only change it where it's **text**.
- Disabled controls are technically exempt from 1.4.3 — do them anyway, they're currently unreadable.
- `#9cd1f3` — if it's purely decorative, leave it.

**Already passing, don't touch:** `#171717` 17.93:1 · `#525252` 7.81:1 ·
`#164291` 9.45:1 · `#e30910` 4.87:1 · `#b45309` 5.02:1 · `#2467c0` 5.56:1

---

## 9. Tap targets
**WCAG 2.5.8** · ~30 icon buttons and arrows below minimum

```css
.icon-btn { min-width: 44px; min-height: 44px;
            display: grid; place-items: center; }
```

Grow the hit area, not the icon. No visual change.

---

## 10. Heading levels — 4 headings, 2 pages
**WCAG 1.3.1** · An `<h3>` with no `<h2>` above it

```diff
- <h3 class="...">Section title</h3>
+ <h2 class="...">Section title</h2>
```

Change the tag only. Keep the Tailwind classes so nothing moves.

---

## 11. Duplicate alt text — 2 images, 1 page
**WCAG 1.1.1** · Announced twice

```diff
- <img alt="Kensington Palace" ...>
+ <img alt="" ...>
```

Same for `img[alt="Tower of London"]`. The adjacent heading already names them.

---

## 12. Landmarks
**WCAG 1.3.1** · Needed for item 3 to work

```html
<header role="banner">
<nav aria-label="Main">
<main id="main">
<footer role="contentinfo">
```

---

# Before you ship — three checks

These aren't optional. Each takes minutes.

### A. Settle the remaining contrast rows
~214 rows are flagged but unproven. The contrast scan could not resolve background
images, so white text on hero photos was wrongly reported as failing.

```bash
cd a11y-audit/local-scan
node scripts/07_verify_backdrops.js
open output/verify-backdrops.html
```

Fix only what comes back `REAL_FAIL`. Anything on imagery: don't change the text
colour, add a scrim.

```css
.hero::after { content:""; position:absolute; inset:0;
  background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55)); }
```

### B. Check 200% zoom by hand
The scripted check for this is unreliable — it reported every page failing, which
indicts the test rather than the site. Set the browser to 200% at 1280×1024.
Content must reflow to one column with no horizontal scrollbar. Check the
homepage, a PDP, a route map and a form.

Only if it genuinely fails:
```css
.container { max-width:1200px; width:100%;
             padding-inline: clamp(16px, 4vw, 48px); }
```

### C. Tab through for a keyboard trap
One page showed focus getting stuck. Tab through from the address bar. If focus
stops advancing, find the `preventDefault` on Tab or the roving-tabindex bug.
Modals must close on Escape and return focus to their trigger.

---

# This will not make you AA on its own

Scanning tools reliably detect roughly **30–40%** of WCAG issues. A quiet scanner
is not conformance — keyboard operation, screen-reader output and whether copy
actually helps someone recover can only be judged by a person. Before anyone
claims AA:

1. Screen-reader pass — NVDA (Windows) and VoiceOver (iOS) through booking,
   search and contact
2. Complete a real booking using only the keyboard
3. Review whether `alt` text is *meaningful*, not just present
4. Confirm errors are announced, not just displayed
5. Confirm `prefers-reduced-motion` actually stops animation

---

# Stop it coming back

```bash
npm i -D @axe-core/playwright
npx playwright test a11y.spec.ts    # fail the build on any violation
```

Run against a preview deploy on every PR. The full 69-page crawl takes minutes.
The pipeline is in `a11y-audit/local-scan/`.

---

**Scope:** all 69 pages of the live site, desktop (1440) and mobile (390),
scanned 31 Aug 2026. Contrast ratios computed with the WCAG relative-luminance
formula and cross-checked against the Figma design tokens.

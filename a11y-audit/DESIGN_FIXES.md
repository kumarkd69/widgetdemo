# Accessibility Fixes — Designer List
### The Original Tour · WCAG 2.2 Level AA · Figma file `NpuVbHpQHxyeiIG2KKupwv`

Short list. Everything a developer can do without you is already on
`DEV_FIXES.md` with the values chosen — you don't need to approve those, though
you're welcome to override item 1.

These six are things **only** you can do, in the Figma file.

---

## 1. Button hover — confirm which fix (optional)

Hover is `#4398d4` with a white label = **3.14:1**. AA needs 4.5:1, because
button labels are 16px Semibold / 14px Bold / 12px Bold — none reach the "large
text" threshold of 18.66px bold.

Dev is shipping **Option A** unless you say otherwise:

| | Change | Result |
|---|---|---|
| **A (shipping)** | Hover bg → `#2a6fa8`, keep white label | **5.33:1** |
| **B** | Keep `#4398d4`, label → `#171717` | **5.70:1** |

A keeps white labels consistent across every state. B preserves the lighter blue
but makes hover the only state with dark text.

**Update the Hover variant across all 4 Types × 3 Sizes — 12 variants in
`Button- Master`.**

> Worth knowing: the **Focus** variant is already correct. A 2px `#4398d4` ring
> at 3.01:1 passes. It was simply never implemented in code — dev is fixing that.

---

## 2. Update the colour variables

Change the variable value and every instance follows.

| Token | Current | Ratio | Change to | New |
|---|---|---|---|---|
| `01-text/tertiary` | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 |
| `01-text/disabled` | `#d4d4d4` | 1.48:1 | `#949494` | 4.20:1 |
| `04-icon/disabled` | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.40:1 |
| `06-border/primary` | `#e5e5e5` | 1.26:1 | `#8f8f8f` | 3.03:1 |
| `06-border/strong` | `#a3a3a3` | 2.52:1 | `#767676` | 4.54:1 |
| `10-brand/accent` | `#9cd1f3` | 1.64:1 | `#3f8fc4` | 3.10:1 |
| `11-primitive/amber/500` | `#f59e0b` | 2.15:1 | `#b45309` | 5.02:1 |
| `11-primitive/neutral/300` | `#d4d4d4` | 1.48:1 | `#8f8f8f` | 3.03:1 |

Plus the badge colours: blue `#3b82f6` → `#2563eb`, green `#16a34a` → `#15803d`,
pink `#ec4899` → `#be185d`. Each is one step darker on the same scale — please
confirm they still read as the same category colour.

**Two judgement calls for you:**

- **`10-brand/accent`** — if it's decorative only (never carries meaning), it
  doesn't need to change. Confirm either way.
- **`success/icon` `#16a34a`** — fine for icons at 3:1, but it's being reused for
  body text where it needs 4.5:1. **Add a second token** `success/text` =
  `#15803d` (4.60:1) rather than changing the icon colour.

**Already passing, leave alone:** `01-text/primary` 17.93:1 · `01-text/secondary`
7.81:1 · `01-text/link` 9.45:1 · `semantic/text/link` 4.87:1 · `warning/text`
5.02:1 · `info/icon` 5.56:1 · `06-border/focus` 9.45:1 · inverse on Footer BG
13.07:1 · text on Paper BG 15.75:1 · text on Header 14.71:1

---

## 3. Create an Input component

There is **no** Input, Text Field, Select or Checkbox component anywhere in the
library — 29 component sets, none of them form fields. Fields are drawn per
screen, which is why error and focus states are inconsistent across the product.

Create a component set with variants:

| Variant | Spec |
|---|---|
| Default | Border `#8f8f8f` (3.03:1) |
| Focus | 2px `#164291` ring (9.45:1) |
| Error | Red border **plus an icon plus message text** — never colour alone |
| Disabled | Text `#949494`, border `#8f8f8f` |
| Filled | — |

The error state matters most. Dev will wire `aria-describedby`, `aria-invalid`
and `role="alert"`, but the design has to include a visible icon and message —
colour on its own fails for colour-blind users.

---

## 4. Mark which frames are current

**~90 duplicate or versioned frames** exist on the "1B UI Designs" page with
nothing indicating which is live: "Home", "Home V2", "Home with multiple
banners", five "Booking Confirmation - AcN" variants, 56 frames in
"Empty States - 1B" plus 32 more in "1C -Empty States", and several screens
appearing in two sections at once.

Mark exactly **one** frame per screen as current. Prefix the rest
`[DEPRECATED]` or move them to the Archive page.

This is the cheapest high-value item on the list — right now a developer can
easily build from a stale frame, and that's a whole class of bug that never
needed to exist.

---

## 5. Decide the illustration export strategy

Twelve frames contain **150+ vector layers each** (pigeons, trees, skyline). If
those export as individual inline SVG nodes, a screen reader announces every
fragment — hundreds of meaningless announcements.

For each illustration, decide:

- **Decorative** → export as one flat asset, dev sets `alt="" aria-hidden="true"`
- **Informative** → export as one asset, and write the alt text yourself

Either way: **one asset per illustration**, never a tree of separate nodes.

---

## 6. One small consistency fix

`Titles/Mobile/H5` is set in **Inter Semi Bold**. Every other type token in the
file is **Proxima Nova**. Almost certainly accidental — change it to match,
or tell dev it's deliberate.

---

# Tap targets — shared with dev

~30 icon buttons and arrow controls sit below the 24×24 (web) / 44×44 (mobile)
minimum, mostly the `vuesax` arrows and the hero search affordances.

Dev is handling this in CSS by growing the **hit area** rather than the icon, so
there's no visual change. Nothing needed from you unless you'd rather the icons
themselves were larger — in which case, say so now.

---

# What the design file cannot tell us

Worth knowing where the limits of a design-file review are:

- Whether text over hero photography is legible depends on the **image**, not the
  design tokens. Dev is running a verification pass on the live site.
- Reading order and focus order can't be derived from a Figma layout. If a screen
  has a non-obvious tab order, annotate it.
- Nothing in Figma tells a developer which element is `<main>`, `<nav>` or
  `<header>`. Annotating those on key templates would remove a lot of guesswork.

---

**Reference:** 287 frames across 27 sections audited on page "✅ 1B UI Designs"
(node `5105:46216`), plus all 29 component sets and every local colour and type
variable. Full detail on the Figma page **"Accessibility Fixes — WCAG 2.2 AA"**.

# Designer decisions — settled

_Recorded 1 Sep 2026. These were the six open items blocking the Figma side of
the WCAG 2.2 AA audit. Each had more than one defensible answer, so each was put
to the designer rather than decided unilaterally._

Figma page: **`♿ A11y — Fixes Applied & Remaining`**, section 03.

---

## 1. Brand accent — decorative · no change

`10-brand/accent` `#9cd1f3` (1.64:1) and `accent-hover` `#63b5e8` (2.26:1) stay
as they are.

Confirmed decorative: background washes and illustration fills only, never
carrying status or interaction. 1.4.11 governs components and meaningful
graphics, so decorative use is exempt.

**Constraint for developers:** if either value is ever applied to an icon, link
or active state it must be darkened to `#3f8fc4` (3.10:1) first.

---

## 2. Alert borders — icon and text also present · exempt · no change

`success/border` `#86efac`, `warning/border` `#fcd34d`, `error/border` `#f49898`,
`info/border` `#86b0e3` are all below 3:1, but each alert also carries a distinct
icon and a text label naming its type. Colour is reinforcement, not the sole
signal, so 1.4.1 and 1.4.11 are both satisfied.

**Constraint for developers:** removing the icon or the label turns these into
real failures. Don't ship a colour-only alert.

---

## 3. Illustrations — decorative · `alt=""`

All 12 convey mood only; the adjacent heading and body copy carry the meaning.

`alt=""` and a missing `alt` attribute are not the same thing — an omitted
attribute makes screen readers announce the filename. The attribute must be
present and empty.

---

## 4. Input component — built

**`Input- Master`** now exists on the COMPONENTS page, five states, all bound to
existing tokens and all contrast-checked from source values:

| Part | Value | Ratio | Criterion |
|---|---|---|---|
| Label `#171717` on `#ffffff` | 17.93:1 | ✅ | 1.4.3 |
| Value `#171717` | 17.93:1 | ✅ | 1.4.3 |
| Placeholder `#525252` | 7.81:1 | ✅ | 1.4.3 |
| Helper `#525252` | 7.81:1 | ✅ | 1.4.3 |
| Border, default `#737373` | 4.74:1 | ✅ | 1.4.11 (needs 3:1) |
| Focus ring `#164291`, 2px outside | 9.45:1 | ✅ | 1.4.11, 2.4.7 |
| Border, error `#c2070d` | 6.31:1 | ✅ | 1.4.11 |
| Error text `#9e1525` | 8.11:1 | ✅ | 1.4.3 |
| Disabled `#525252` on `#fafafa` | 7.49:1 | ✅ | exempt, done anyway |

Implementation rules are written into the component description in Figma:

1. Focus ring is 2px **outside** the border — `outline` + `outline-offset: 2px`,
   never `outline: none`. The browser default measures 2.22:1 on dark surfaces.
2. Error is never colour alone (1.4.1) — the icon and the message text both
   carry it.
3. Placeholder text is not a label. Keep the visible `<label>` (2.4.6, 3.3.2).
4. Markup: `<label for>` + `aria-invalid="true"` + `aria-describedby` pointing at
   the message, `role="alert"` on the message (3.3.1, 4.1.2).
5. Field height 48px clears the 24×24 minimum target size (2.5.8).

---

## 5. `Titles/Mobile/H5` Semi Bold — intentional · no change

The heavier weight is deliberate. Recorded so future audits stop re-raising it.

This was a consistency observation, not a WCAG issue — no success criterion
governs font weight.

---

## 6. `06-border/primary` — kept at `#737373`

Changed from `#e5e5e5` (1.26:1), which failed 1.4.11 on any functional border.
`#737373` (4.74:1) was kept over the lighter `#8f8f8f` (3.03:1) so there is
margin if the border is ever placed on a tinted rather than a white surface.

---

## 7. Duplicate frames — 8 tagged, 14 left open

**The earlier "~90 duplicates" figure was wrong.** It counted desktop/mobile
pairs of the same screen as copies. Grouping by section *and* exact width gives
19 same-name clusters, 24 redundant frames — not 90.

Of those, 8 were near-identical (height within 5%) and are now prefixed
`[DEPRECATED]`, keeping the newest of each cluster:

| Kept | Deprecated | Section | Size |
|---|---|---|---|
| `5987:53498` | `5987:53373` Booking Confirmed | 1C - Manage Bookings | 393×852 |
| `8161:147811` | `6142:60500` Change Tour Date | 1C - Manage Bookings | 393×1853 |
| `8207:155752` | `6142:45966` Review your booking | 1C - Manage Bookings | 393×1078 |
| `13008:119067` | `13004:118411` Find Your Booking | 1C - Manage Bookings | 353×549 |
| `8187:149134` | `6443:40716` Change Tour Date | 1C - Manage Bookings | 1440×1139 |
| `8207:155917` | `6443:41191` Review your booking | 1C - Manage Bookings | 1440×1266 |
| `9243:140848` | `9212:136822` No Content | Empty States - 1B | 393×1420 |
| `9243:140878` | `9212:136982` No Content | Empty States - 1B | 1440×1292 |

> **"Newest" is inferred from the node-ID ordinal**, not a timestamp — the Figma
> Plugin API exposes no per-node modified date. Node IDs increase monotonically
> with creation, so the highest ordinal is the most recently created frame. That
> is a good proxy for a duplicated frame, but it is a proxy.

### The 14 still open — one line from a designer each

These share a name inside one section at one width but differ in height, which
usually means different content rather than a stale copy. Tagging them would
have been guessing.

| Section | Name | Kept | Other | Height diff |
|---|---|---|---|---|
| Home | Home | `8136:114482` (950) | `8136:113142` (5993) | 84% |
| 1C - Manage Bookings | Booking Confirmed | `5987:53498` (852) | `5987:53127` (3633) | 77% |
| 1C - Manage Bookings | Booking Confirmation | `6654:122931` (1000) | `6446:67411` (2262) | 56% |
| 1C - Manage Bookings | Booking Confirmation | `6654:122931` (1000) | `6443:43397` (1174) | 15% |
| 1C - Manage Bookings | Add-ons | `13351:125700` (1530) | `13351:124502` (1279) | 16% |
| Suggestive Search | Suggestive Search (Mobile) | `5987:56613` (3081) | `5987:55868` (2186) | 29% |
| 1C - Post Trip Jounrney | Booking Confirmed | `5987:63293` (1704) | `5987:63057` (2375) | 28% |
| Service Updates & Routes/ Maps | Service Updates - Mobile | `7857:99327` (1696) | `7857:94882` (1389) | 18% |
| Service Updates & Routes/ Maps | Service Updates - Mobile | `7857:99327` (1696) | `5987:66699` (4569) | 63% |
| Service Updates & Routes/ Maps | Service Updates | `7857:100165` (1314) | `7857:94912` (1237) | 6% |
| Service Updates & Routes/ Maps | Service Updates | `7857:100165` (1314) | `6452:122276` (2781) | 53% |
| Things to do | Things To Do Article Page | `6654:140777` (3345) | `6611:78205` (3575) | 6% |
| Current - Group Booking & Private Hire - 1C | Group Booking | `12592:168618` (1194) | `12592:167936` (2877) | 58% |
| Current - Group Booking & Private Hire - 1C | Group Booking | `12592:168632` (977) | `12592:168101` (1694) | 42% |

The three at 6–16% are the likeliest genuine duplicates — worth checking first.

---

## What these decisions do not close

The design system is now clean, but **conformance is a property of the built
product**, not the design file:

- **174 grey-text elements** across 31 pages remain unfixed. This is code-only —
  `#A3A3A3` is hardcoded in the Tailwind markup, and the Figma token was always
  correct at `#525252`. See `DEV_LIST.md` item 1.
- **27 success criteria remain untested.** Keyboard operation, screen-reader
  output, reflow at 320px / 400% zoom, focus not obscured by the sticky header,
  and error announcement only exist once built. See `MANUAL_TEST_PLAN.md`,
  roughly two days.

A single unresolved failure anywhere breaks conformance, so no AA claim should
be made until both are closed.

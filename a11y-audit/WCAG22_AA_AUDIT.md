# WCAG 2.2 Level AA — Full Accessibility Audit
### theoriginaltour.com · live site + Figma design file
**Audited:** 31 Aug 2026 · **Standard:** WCAG 2.2 Level AA (strict)

---

## Before you read the findings

**Evidence base.** All 69 pages of the live site were crawled (sitemap + link
crawl) and scanned at desktop 1440px and mobile 390px — 138 page-views, 100%
success. The Figma file was audited across 287 frames, 27 sections and all 29
component sets. Every contrast ratio below was computed with the WCAG
relative-luminance formula from source values, not estimated.

**What this audit cannot tell you.** It did not include real-device, keyboard,
browser or screen-reader testing. WCAG 2.2 also introduced six success
criteria that post-date most audit tooling, and several of them (Dragging
Movements, Consistent Help, Redundant Entry, Accessible Authentication, Focus
Not Obscured) cannot be detected by any automated scan. Those are marked **NEEDS TESTING** — that is an
honest "unknown", not a pass.

**Automated tooling catches roughly 30–40% of WCAG issues.** This audit is not a
conformance certificate and must not be presented as one until the NEEDS TESTING
items are resolved by a human.

**Two findings from an earlier draft have been withdrawn.** They are recorded
here rather than quietly removed, because acting on either would have caused harm:

1. An earlier version claimed ~185 instances of "invisible light text on light
   backgrounds". That was a flaw in the contrast script, which could not see
   background *images* and fell through to the page background. The affected
   elements are hero headings and card badges on photography. **Do not change
   hero text colours on that evidence** — see C-07.
2. An earlier version reported a 200% zoom failure on 69 of 69 pages. A 100%
   failure rate indicts the test, not the site: it used CSS `zoom`, which is not
   how browser zoom works. Reclassified to NEEDS TESTING — see R-02.

Note: **4.1.1 Parsing was removed in WCAG 2.2** and is not assessed here.

---

# 1 · Colour & Contrast

---

### C-01 · Tertiary grey text fails minimum contrast
**Issue:** Small body and caption text is set in `#A3A3A3` on white, measuring
2.52:1. This is the highest-volume genuine failure on the site.
**WCAG:** 1.4.3 Contrast (Minimum) — **Level AA**
**Severity:** **Critical**
**Current:** `text-[#A3A3A3]` used at `text-xs` and `text-sm` on **174 elements
across 31 pages**. Ratio **2.52:1** against white; AA requires 4.5:1 at these sizes.
**Required Fix:** Change to `#767676` (**4.54:1**). Case-insensitive find/replace:
`text-[#A3A3A3]` → `text-[#767676]`.
**Design Recommendation:** Update the `01-text/tertiary` variable in Figma to
`#767676`. It is the lightest neutral that passes at 4.5:1, so the visual
hierarchy between primary/secondary/tertiary text is preserved. Do not go lighter
in pursuit of a softer look — there is no lighter value that conforms.
**Developer Note:** Only change it where the token is used for **text**. Where the
same hex is used for borders or icons the threshold is 3:1 (see C-05, C-10) and
`#8f8f8f` is the correct value. Cross-verified: axe-core flagged this in the code
and the Figma token audit flagged the same hex independently.

---

### C-02 · Primary button hover state fails contrast
**Issue:** The hover background is too light for its white label.
**WCAG:** 1.4.3 Contrast (Minimum) — **Level AA**
**Severity:** **High**
**Current:** Hover background `#4398d4` with `#ffffff` label = **3.14:1**. Button
labels are 16px Semibold (Large), 14px Bold (Medium), 12px Bold (Small). **None
reach the WCAG "large text" threshold** of ≥18.66px bold or ≥24px, so all three
sizes require the full 4.5:1. Affects every primary button on the site.
**Required Fix:** Change the hover background to `#2a6fa8` → white label = **5.33:1**.
**Design Recommendation:** Update the Hover variant across all 4 Types × 3 Sizes
(12 variants) in `Button- Master`. The alternative — keeping `#4398d4` and
switching the label to `#171717` (5.70:1) — also conforms, but makes hover the
only state with dark text, which weakens the visual consistency of the set.
Recommend `#2a6fa8`.
**Developer Note:** Update the corresponding CSS custom property in the same
release as the Figma change so design and code do not drift.

---

### C-03 · Category badges fail contrast with white text
**Issue:** Coloured badges use white text on mid-tone fills.
**WCAG:** 1.4.3 Contrast (Minimum) — **Level AA**
**Severity:** **High**
**Current:** Blue `#3b82f6` = **3.68:1** · Green `#16a34a` = **3.30:1** ·
Pink `#ec4899` = **3.53:1**. All below 4.5:1. Red `#e30910` = 4.87:1 and passes.
**Required Fix:** Blue → `#2563eb` (5.17:1) · Green → `#15803d` (5.02:1) ·
Pink → `#be185d` (6.04:1). Leave red unchanged.
**Design Recommendation:** Each replacement is one step darker on the same colour
ramp, so category recognition is retained. Confirm the darker pink in particular
still reads as distinct from the brand red at small badge sizes.
**Developer Note:** These sit on flat opaque fills, so unlike C-07 these ratios
are reliable and safe to action immediately.

---

### C-04 · Pale pink text on the red badge
**Issue:** Low-contrast text on the brand red fill.
**WCAG:** 1.4.3 Contrast (Minimum) — **Level AA**
**Severity:** Medium
**Current:** `#fce6e7` on `#e30910` = **4.08:1** — marginally below 4.5:1. Nine instances.
**Required Fix:** Use `#ffffff` → **4.87:1**.
**Design Recommendation:** There is no benefit to the tinted pink here; plain
white is both compliant and cleaner. Remove the tint from the token.
**Developer Note:** None beyond the colour swap.

---

### C-05 · Functional borders fail non-text contrast
**Issue:** Input and control borders are too faint to perceive.
**WCAG:** 1.4.11 Non-text Contrast — **Level AA**
**Severity:** **High**
**Current:** `06-border/primary` = `#e5e5e5` on white = **1.26:1**.
`06-border/strong` = `#a3a3a3` = **2.52:1**. Both below the 3:1 required for
components that convey boundaries.
**Required Fix:** `06-border/primary` → `#8f8f8f` (**3.03:1**);
`06-border/strong` → `#767676` (**4.54:1**).
**Design Recommendation:** Apply only where the border is **functional** — input
fields, control boundaries, focusable card edges. Purely decorative dividers
between content blocks are exempt from 1.4.11 and can stay light; changing those
would make the UI heavier for no conformance benefit. Audit each usage before
applying globally.
**Developer Note:** A field whose only boundary indicator is a 1.26:1 border is
effectively invisible to low-vision users — this is a genuine usability failure,
not a technicality.

---

### C-06 · Remaining token contrast failures
**Issue:** Several tokens fall below their applicable threshold.
**WCAG:** 1.4.3 (text) / 1.4.11 (non-text) — **Level AA**
**Severity:** Medium
**Current:**
| Token | Value | Ratio | Threshold |
|---|---|---|---|
| `04-icon/disabled` | `#d4d4d4` | 1.48:1 | 3:1 |
| `11-primitive/neutral/300` | `#d4d4d4` | 1.48:1 | 3:1 |
| `11-primitive/amber/500` | `#f59e0b` | 2.15:1 | 3:1 |
| `10-brand/accent` | `#9cd1f3` | 1.64:1 | 3:1 (if meaningful) |
| `success/icon` used as **text** | `#16a34a` | 3.30:1 | 4.5:1 |
**Required Fix:** `#d4d4d4` → `#8f8f8f` (3.03:1) · `#f59e0b` → `#b45309` (5.02:1) ·
`#9cd1f3` → `#3f8fc4` (3.10:1) · add a new `success/text` token `#15803d` (4.60:1).
**Design Recommendation:** For `success/icon`, **do not change the icon colour** —
`#16a34a` is compliant at 3:1 for icons. The failure is reusing an icon token for
body text. Split it into two tokens. For `10-brand/accent`: if it is purely
decorative and never carries meaning, no change is required — confirm and
document that decision so it is not re-flagged in future audits.
**Developer Note:** `#f59e0b` should reuse the existing, already-passing
`warning/text` token rather than introducing a new value.

---

### C-07 · Text over images and gradients — unverified
**Issue:** Contrast of text sitting on photography cannot be determined by
computed styles, and the initial automated verdict on these was wrong.
**WCAG:** 1.4.3 Contrast (Minimum) — **Level AA**
**Severity:** **NEEDS TESTING** (potentially High)
**Current:** Approximately 214 elements — hero headings, card badges over
thumbnails — sit on background images or gradients. The contrast script could not
resolve the true backdrop and defaulted to the page background, producing false
failures such as "white on #f8f5ef = 1.09:1". **These are not confirmed failures.**
**Required Fix:** Run the verifier, then fix only what it classifies `REAL_FAIL`:
```bash
cd a11y-audit/local-scan
node scripts/07_verify_backdrops.js
open output/verify-backdrops.html
```
It sorts every element into REAL_FAIL / PASSES / ON_IMAGE / ON_GRADIENT /
OVER_MEDIA with a cropped screenshot of each, so a repeated component is
adjudicated in one glance.
**Design Recommendation:** Where text over imagery genuinely fails, **do not
change the text colour** — that produces dark text on dark photography. Add a
scrim so the text is legible over the *lightest* region of any image:
`linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55))`. Specify a minimum
scrim opacity in the design system so it survives future image swaps. Contrast
must hold for **every** image that can appear in that slot, not just the current one.
**Developer Note:** Contrast over a CMS-controlled image is a systemic risk, not a
one-off fix. A scrim is the only durable solution; per-image tuning will regress
the moment content is updated.

---

### C-08 · Colour as the sole means of conveying information — unverified
**Issue:** Cannot confirm that links in body copy, error states and category
badges are distinguishable without colour perception.
**WCAG:** 1.4.1 Use of Colour — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Inline link styling within paragraphs was not captured
by the scan, and error states were not exercised on a live form.
**Required Fix:** Verify that inline links carry a non-colour affordance
(underline being the conventional one) and that error states pair colour with an
icon and text.
**Design Recommendation:** Underline links in body copy by default. Removing
underlines and relying on `#164291` alone fails 1.4.1 even though that blue
passes 1.4.3 — the two criteria are independent. Navigation and button links are
exempt where position and shape make their role obvious.
**Developer Note:** Test by rendering pages in greyscale. Anything whose meaning
disappears fails.

---

# 2 · Typography

---

### T-01 · Heading hierarchy skips a level
**Issue:** An `<h3>` appears with no preceding `<h2>`.
**WCAG:** 1.3.1 Info and Relationships — **Level A**
**Severity:** **High**
**Current:** 4 headings across 2 pages. Confirmed by axe-core.
**Required Fix:** Change the tag to `<h2>`, retaining the existing Tailwind text
classes so nothing shifts visually.
**Design Recommendation:** Heading *rank* and heading *size* are separate
concerns. Design should specify both — a visual scale plus the semantic level —
so developers never have to infer rank from font size. Add the intended level to
the type styles in Figma.
**Developer Note:** Screen-reader users navigate by heading rank; a skipped level
reads as missing content. Never choose a heading tag for its default size.

---

### T-02 · Body copy below readable minimum in the design
**Issue:** Some text is specified below 14px.
**WCAG:** Related to 1.4.4 Resize Text — **Level AA** (no absolute minimum size
is mandated by WCAG)
**Severity:** Medium
**Current:** A group of text nodes in the Figma file render under 12px effective
height. Small-button labels are specified at 12px Bold.
**Required Fix:** Raise body and caption copy to a minimum of 14px; 16px preferred
for sustained reading.
**Design Recommendation:** WCAG sets no hard minimum, so this is a usability
finding rather than a strict failure — but 12px body copy combined with the
tertiary grey in C-01 compounds into a genuine barrier. Fixing C-01 is mandatory;
raising size is strongly advised. If 12px is retained for legal or caption text,
ensure it uses `01-text/primary`, never tertiary.
**Developer Note:** Ensure text scales with user font-size settings — avoid
locking sizes in `px` where `rem` is viable.

---

### T-03 · Text spacing override — untested
**Issue:** Cannot confirm the layout survives user-applied text spacing.
**WCAG:** 1.4.12 Text Spacing — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed.
**Required Fix:** Apply line-height 1.5×, paragraph spacing 2×, letter spacing
0.12em, word spacing 0.16em via a bookmarklet or devtools. No content may be
clipped or overlap.
**Design Recommendation:** Avoid fixed-height containers around text. Use
`min-height` so blocks grow with their content.
**Developer Note:** Fixed `height` on text containers is the usual cause of
failure here.

---

### T-04 · Type family inconsistency
**Issue:** One type token uses a different family from the rest of the scale.
**WCAG:** No criterion — consistency/QA finding
**Severity:** Low
**Current:** `Titles/Mobile/H5` is Inter Semi Bold. Every other type token in the
file is Proxima Nova.
**Required Fix:** Change to Proxima Nova Semibold, or document the exception.
**Design Recommendation:** Almost certainly accidental. A single off-family token
will render inconsistently against the rest of the mobile ramp.
**Developer Note:** No WCAG impact. Include in the same release as the token
changes.

---

# 3 · Keyboard Accessibility

---

### K-01 · Horizontal scroll regions are not keyboard operable
**Issue:** Carousels and scrollers cannot be operated without a mouse.
**WCAG:** 2.1.1 Keyboard — **Level A**
**Severity:** **Critical**
**Current:** 20 `.overflow-x-auto` regions across 14 pages have no `tabindex`, so
keyboard users cannot scroll them and cannot reach content inside. Confirmed by
axe-core. Predominantly the route-map and card carousels.
**Required Fix:**
```html
<div class="overflow-x-auto ..." tabindex="0" role="region"
     aria-label="Popular tours, scrollable">
```
Each region needs a label describing its own content.
**Design Recommendation:** Add visible previous/next controls to carousels rather
than relying on scroll alone. Scroll affordance is invisible to keyboard users
and unreliable on desktop trackpads. Buttons also satisfy 2.5.7 (K-05) and give a
clear target for 2.5.8 (TT-01).
**Developer Note:** `tabindex="0"` on a scroll container is the correct native
solution — no ARIA scrollbar pattern is needed. For the route maps, focusability
alone is insufficient: a pannable map is unusable by a screen reader regardless,
so the same route and stop data must exist as text or a table (see I-03).

---

### K-02 · Suspected keyboard trap
**Issue:** Focus appeared to stop advancing on one page.
**WCAG:** 2.1.2 No Keyboard Trap — **Level A**
**Severity:** **Critical if confirmed** — **NEEDS TESTING**
**Current:** A scripted tab-walk found focus stuck on an `<a>` element after
repeated Tab presses. Automated trap detection is indicative, not conclusive.
**Required Fix:** Tab through the page from the browser address bar. If focus
stops advancing, remove the `preventDefault` on Tab or correct the roving-tabindex
logic.
**Design Recommendation:** Every dismissible overlay must specify its close
behaviour in the design: Escape closes, focus returns to the trigger, focus is
contained while open.
**Developer Note:** This is the single most severe failure class in WCAG — a
trapped user cannot leave without closing the tab. Verify manually before launch.

---

### K-03 · Focus order begins in the cookie banner
**Issue:** The first Tab stop on every page is the cookie consent control.
**WCAG:** 2.4.3 Focus Order — **Level A**
**Severity:** **High**
**Current:** On all 69 pages the first focusable element is the "Cookie Settings"
button. A keyboard user traverses the full header and navigation on every page
before reaching content.
**Required Fix:** Add a skip link as the first focusable element (see N-01) and
ensure the consent banner does not auto-focus on load.
**Design Recommendation:** Consent UI should be reachable but not dominate the
entry point of every page. If it must appear first visually, ensure the skip link
still precedes it in the DOM.
**Developer Note:** Verify the banner does not trap focus. A consent modal that
contains focus while dismissible only by mouse is both a 2.1.2 and 2.4.3 failure.

---

### K-04 · Composite widget keyboard behaviour — untested
**Issue:** Menus, dropdowns, tabs, accordions and modals were not exercised.
**WCAG:** 2.1.1 Keyboard (A) · 4.1.2 Name, Role, Value (A)
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. The scan detected these components exist (FAQ
accordions, navigation menus, suggestive search) but did not operate them.
**Required Fix:** Verify against the ARIA Authoring Practices patterns: menus
respond to arrow keys and Escape; accordions toggle on Enter/Space and expose
`aria-expanded`; modals contain focus, close on Escape and restore focus; tabs
support arrow-key navigation.
**Design Recommendation:** Specify keyboard interaction in the component
documentation. Undocumented keyboard behaviour is the most common cause of
inaccessible custom widgets.
**Developer Note:** Prefer native `<details>`/`<summary>`, `<button>` and
`<dialog>` where possible — they provide correct semantics and keyboard handling
without ARIA. Only reach for ARIA where no native element fits.

---

### K-05 · Dragging movements — untested *(new in WCAG 2.2)*
**Issue:** Functionality that requires dragging must have a single-pointer
alternative.
**WCAG:** 2.5.7 Dragging Movements — **Level AA (new in 2.2)**
**Severity:** **NEEDS TESTING** (likely applicable)
**Current:** Not assessed. The route-map pages are the primary concern — pannable
maps, and any date-range or slider controls in the booking flow.
**Required Fix:** Every drag interaction needs an equivalent that works with a
single pointer without dragging — zoom/pan buttons on maps, numeric inputs or
stepper buttons alongside sliders.
**Design Recommendation:** Add explicit `+` / `−` / directional controls to any
map. Provide text inputs beside any slider. These also satisfy K-01 and TT-01.
**Developer Note:** This criterion is new in WCAG 2.2 and is frequently missed
because it did not exist in 2.1. Third-party map embeds must be checked — an
embedded widget's failure is still your failure.

---

# 4 · Focus States

---

### F-01 · No visible focus indicator anywhere
**Issue:** Keyboard focus is not visible on any interactive element.
**WCAG:** 2.4.7 Focus Visible — **Level AA**
**Severity:** **Critical**
**Current:** No focus indicator detected on any of the 69 pages. Keyboard and
screen-magnifier users cannot tell where they are.
**Required Fix:**
```css
:focus-visible { outline: 2px solid #4398d4; outline-offset: 2px; }
```
Then remove every `outline: none` / `outline: 0` / `focus:outline-none` that has
no replacement.
**Design Recommendation:** **The design system already solves this.** The Focus
variant in `Button- Master` specifies a 2px `#4398d4` ring measuring **3.01:1**
against the button and **3.14:1** against a white page — both clear the 3:1
requirement. This is purely an implementation gap. Note that 3.01:1 is a thin
margin: if the ring will ever sit on a light surface, specify `#164291` (9.45:1)
instead, and consider adopting that as the single global focus colour for safety.
**Developer Note:** Use `:focus-visible`, not `:focus`, so mouse users do not see
rings on click. A global CSS reset stripping outlines is almost always the root
cause. This is roughly an hour of work and resolves the failure site-wide.

---

### F-02 · Focus obscured by sticky elements — untested *(new in WCAG 2.2)*
**Issue:** A focused element must not be entirely hidden by author-created
sticky or fixed content.
**WCAG:** 2.4.11 Focus Not Obscured (Minimum) — **Level AA (new in 2.2)**
**Severity:** **NEEDS TESTING** (high suspicion)
**Current:** Not assessed. The site has a sticky header and a cookie banner —
the two most common causes of this failure.
**Required Fix:** Tab through each template. When focus moves to an element near
the top of the viewport after scrolling, confirm it is not hidden behind the
sticky header. Fix with `scroll-margin-top` equal to the header height:
```css
:target, :focus-visible { scroll-margin-top: 96px; }
```
**Design Recommendation:** Specify the sticky header height as a token and use it
for scroll offsets, so the two cannot drift apart. Where the cookie banner is
fixed to the bottom, confirm it does not cover focused form controls.
**Developer Note:** Cannot be detected automatically — needs manual tabbing at
several scroll positions. New in 2.2, so it is easily missed by teams working
from a 2.1 checklist. Note this criterion requires the element not be *entirely*
hidden; partial obscuring passes at AA but fails 2.4.12 at AAA.

---

### F-03 · Focus indicator must not rely on colour change alone
**Issue:** Confirm the focus indicator is a shape change, not just a recolour.
**WCAG:** 2.4.7 Focus Visible — **Level AA**
**Severity:** Low (design already compliant)
**Current:** The designed indicator is a 2px ring — a shape change, which is correct.
**Required Fix:** None, provided F-01 is implemented as specified.
**Design Recommendation:** Maintain the ring approach for every component type,
including inputs, links, cards and custom controls — not only buttons. The
component library currently defines a Focus variant for buttons but, because no
input component exists (FM-02), field focus is unspecified.
**Developer Note:** Ensure the ring is applied to links and custom interactive
elements too, not just `<button>`.

---

# 5 · Touch Targets

---

### TT-01 · Interactive targets below minimum size *(new in WCAG 2.2)*
**Issue:** Icon buttons and arrow controls are smaller than the required minimum.
**WCAG:** 2.5.8 Target Size (Minimum) — **Level AA (new in 2.2)**
**Severity:** **High**
**Current:** Approximately 30 interactive elements measure below 24×24 CSS px —
predominantly the `vuesax` arrow icons and hero search affordances, some as small
as 24×24 device px on mobile frames where 44×44 is appropriate.
**Required Fix:** Ensure every target is at least **24×24 CSS px**, or has
sufficient spacing to satisfy the undersized-target exception.
```css
.icon-btn { min-width: 44px; min-height: 44px; display: grid; place-items: center; }
```
**Design Recommendation:** Grow the **hit area**, not the icon — the icon keeps
its current visual size while the touch target expands via padding, so there is
no visual change. Specify 44×44 as the mobile default in the design system:
24×24 is the AA floor, but 44×44 is the usability target and matches platform
guidance on both iOS and Android.
**Developer Note:** WCAG 2.2 requires 24×24 at AA (2.5.8); the 44×44 figure comes
from 2.5.5 Target Size (Enhanced), which is AAA. Meeting 44×44 satisfies both.
Exceptions exist for inline links within text — do not pad those.

---

### TT-02 · Spacing between adjacent controls — untested
**Issue:** Closely spaced controls cause mis-taps even when individually large enough.
**WCAG:** 2.5.8 Target Size (Minimum) — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Adjacent-control spacing was not measured.
**Required Fix:** Measure gaps between adjacent interactive elements, especially
in card grids, pagination and the booking stepper.
**Design Recommendation:** Minimum 8px between adjacent targets; 12px preferred
on mobile. The 2.5.8 spacing exception permits targets under 24×24 only where the
surrounding undisturbed space brings the effective area to 24×24 — so spacing and
size must be assessed together, never separately.
**Developer Note:** Requires real-device measurement.

---

# 6 · Forms

---

### FM-01 · Error messages are not programmatically associated
**Issue:** Validation errors are displayed visually but not linked to their field.
**WCAG:** 3.3.1 Error Identification (A) · 4.1.2 Name, Role, Value (A)
**Severity:** **Critical**
**Current:** A scripted check submitted forms with invalid data. Required fields
showed no `aria-describedby` pointing to error text, and no `aria-invalid`. A
screen-reader user receives no indication that a field failed or why.
**Required Fix:**
```html
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email"
       aria-invalid="true" aria-describedby="email-err">
<p id="email-err" role="alert">Enter an email address in the format name@example.com</p>
```
**Design Recommendation:** The error state must combine **three** signals: colour,
an icon, and text. Colour alone fails 1.4.1. Position the message directly beneath
its field, never only in a summary at the top — though an additional summary is
good practice for long forms.
**Developer Note:** `aria-describedby` links message to field; `aria-invalid`
marks the failure; `role="alert"` announces it on appearance. Do not use
`aria-live` on a container that is always present *and* `role="alert"` on the
message — that double-announces. Use one.

---

### FM-02 · No form-field component exists in the design system
**Issue:** Input fields are drawn ad hoc on each screen.
**WCAG:** 3.3.2 Labels or Instructions — **Level A**
**Severity:** **High**
**Current:** None of the 29 component sets in the Figma library is an input,
select, checkbox or radio. Field states are therefore inconsistent across the
product, and error/focus/disabled treatments are unspecified.
**Required Fix:** Create an Input component set with Default, Focus, Error,
Disabled and Filled variants.
**Design Recommendation:** Specify: border `#8f8f8f` (3.03:1) default; 2px
`#164291` focus ring (9.45:1); error with red border **plus icon plus message**;
disabled text `#949494`. Labels must be **visible and persistent** — a floating
label that disappears on input, or a placeholder used as the only label, fails
3.3.2 because the user loses the field's purpose while completing it.
**Developer Note:** Every input needs a programmatically associated `<label for>`.
`aria-label` is acceptable only where a visible label genuinely cannot exist.
Placeholders are never labels.

---

### FM-03 · Error suggestion — untested
**Issue:** Errors must describe how to correct the problem, not merely that one exists.
**WCAG:** 3.3.3 Error Suggestion — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed — the content of live error messages was not captured.
**Required Fix:** Review every validation message. "Invalid email" identifies the
error but does not suggest a fix; "Enter an email address in the format
name@example.com" satisfies 3.3.3.
**Design Recommendation:** Write error copy as instructions, not verdicts. Include
the expected format for dates, phone numbers and card details.
**Developer Note:** Applies to server-side validation responses too, not just
client-side.

---

### FM-04 · Input purpose / autocomplete — untested
**Issue:** Fields collecting personal data must identify their purpose programmatically.
**WCAG:** 1.3.5 Identify Input Purpose — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Highly relevant to the booking and contact flows,
which collect name, email, phone and payment details.
**Required Fix:** Add the correct `autocomplete` tokens: `name`, `email`, `tel`,
`street-address`, `postal-code`, `cc-number`, `cc-exp`.
**Design Recommendation:** No visual impact. It materially reduces effort for
users with motor or cognitive disabilities, and improves conversion for everyone.
**Developer Note:** Use the exact tokens from the HTML specification —
`autocomplete="email"`, not `autocomplete="on"`.

---

### FM-05 · Required/optional indication — untested
**Issue:** Required fields must be clearly identified.
**WCAG:** 3.3.2 Labels or Instructions — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed.
**Required Fix:** Mark required fields visibly and programmatically.
**Design Recommendation:** An asterisk alone is weak — pair it with a legend, or
label optional fields instead where most are required. Never indicate requirement
by colour alone.
**Developer Note:** Use the native `required` attribute; it conveys the state to
assistive technology without ARIA.

---

### FM-06 · Redundant entry — untested *(new in WCAG 2.2)*
**Issue:** Information already entered must not be requested again in the same process.
**WCAG:** 3.3.7 Redundant Entry — **Level A (new in 2.2)**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Directly relevant to the multi-step booking flow.
**Required Fix:** Re-entered information must be auto-populated or selectable —
for example, a "billing address same as contact address" option.
**Design Recommendation:** Review the booking flow for any field asked twice
across steps. Provide a copy/confirm control rather than requiring re-typing.
**Developer Note:** New in WCAG 2.2. Exceptions exist where re-entry is essential
(e.g. confirming a password), but convenience is not an exception.

---

### FM-07 · Accessible authentication — untested *(new in WCAG 2.2)*
**Issue:** Authentication must not depend on a cognitive function test.
**WCAG:** 3.3.8 Accessible Authentication (Minimum) — **Level AA (new in 2.2)**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. The "Manage Bookings" area was reached but not
authenticated into.
**Required Fix:** Ensure login does not require remembering or transcribing
information without an alternative. Password fields must allow paste; CAPTCHAs
that require puzzle-solving or transcription fail unless an alternative exists.
**Design Recommendation:** Support password managers. Allow booking-reference
lookup by paste. Avoid image-recognition CAPTCHAs.
**Developer Note:** New in WCAG 2.2 and commonly failed. Blocking paste on a
password field is an outright failure. Object-recognition CAPTCHA is permitted
only where an alternative non-cognitive method is offered.

---

# 7 · Navigation

---

### N-01 · No skip-to-content mechanism
**Issue:** No means of bypassing repeated blocks of content.
**WCAG:** 2.4.1 Bypass Blocks — **Level A**
**Severity:** **High**
**Current:** No skip link exists on any of the 69 pages. Combined with K-03, every
page requires traversing the consent banner, header and full navigation before
reaching content.
**Required Fix:**
```html
<a href="#main" class="skip-link">Skip to main content</a>
<main id="main" tabindex="-1"> ... </main>
```
```css
.skip-link { position:absolute; left:-9999px; z-index:9999;
             padding:12px 20px; background:#164291; color:#fff; }
.skip-link:focus { left:8px; top:8px; }
```
**Design Recommendation:** The link must be **visible when focused** — a
permanently hidden skip link fails. Style it as a solid pill in the top-left, at
least 44px tall, with the same focus ring as everything else.
**Developer Note:** Must be the first focusable element in the DOM, before the
consent banner. Proper landmarks (N-02) also satisfy 2.4.1 for screen-reader
users, but a visible skip link is still required for sighted keyboard users.

---

### N-02 · Landmark structure not specified or verified
**Issue:** Page regions are not identified for assistive technology.
**WCAG:** 1.3.1 Info and Relationships — **Level A**
**Severity:** Medium
**Current:** Header (107 instances) and footer (191 instances) appear as
components throughout the Figma file with no landmark annotation. Live-site
landmark usage was not directly verified.
**Required Fix:**
```html
<header role="banner"> <nav aria-label="Main"> <main id="main"> <footer role="contentinfo">
```
**Design Recommendation:** Annotate landmark roles on template frames in Figma.
Developers should never have to guess which container is `<main>`. Where multiple
navigation regions exist, each needs a distinct `aria-label`.
**Developer Note:** Native elements carry implicit roles — `<header>`, `<nav>`,
`<main>`, `<footer>` need no explicit `role` attribute when used as direct
children of `<body>`. Do not add redundant ARIA.

---

### N-03 · Page titles — untested
**Issue:** Each page needs a unique, descriptive title.
**WCAG:** 2.4.2 Page Titled — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not captured by the scan.
**Required Fix:** Verify each of the 69 pages has a unique `<title>` following a
consistent pattern, e.g. "Buckingham Palace — Things To Do — The Original Tour".
**Design Recommendation:** Specify the title pattern in the content guidelines.
Most-specific information first, brand last — screen-reader users hear the
beginning first.
**Developer Note:** Verify SPA route changes update the title and announce it.

---

### N-04 · Link purpose / ambiguous link text — untested
**Issue:** Link text must convey purpose, in context.
**WCAG:** 2.4.4 Link Purpose (In Context) — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Card-based layouts of this kind commonly repeat "Learn
more" and "Book now" across many cards.
**Required Fix:** Audit for repeated generic link text. Either extend the visible
text, or provide an accessible name that includes the destination.
**Design Recommendation:** Prefer descriptive visible text — "Book the Hop-On
Hop-Off tour" rather than "Book now". Screen-reader users often navigate by a
list of links, where twenty identical "Learn more" entries are useless.
**Developer Note:** Where the visual design requires short labels, use
`aria-label` on the link, or visually hidden text inside it. If `aria-label` is
used, it **must** contain the visible text string to satisfy 2.5.3 Label in Name.

---

### N-05 · Consistent navigation and identification — untested
**Issue:** Navigation must be consistently ordered and components consistently
identified across pages.
**WCAG:** 3.2.3 Consistent Navigation (AA) · 3.2.4 Consistent Identification (AA)
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. The scan indicates a shared header/footer component,
which suggests consistency, but this was not verified across templates.
**Required Fix:** Confirm nav order is identical on every page and that repeated
components use consistent labels and icons.
**Design Recommendation:** The ~90 duplicate/versioned frames in the Figma file
are a direct risk here — if developers build different pages from different frame
versions, navigation can diverge. Resolve the duplicates (see D-01).
**Developer Note:** Low risk given shared components; verify on the route-map and
booking templates, which are most likely to diverge.

---

### N-06 · Consistent help — untested *(new in WCAG 2.2)*
**Issue:** Help mechanisms must appear in the same relative order across pages.
**WCAG:** 3.2.6 Consistent Help — **Level A (new in 2.2)**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. The site has Help & Support, Contact Us and a
Report an Issue flow.
**Required Fix:** Ensure the contact/help entry point occupies the same relative
position in the header or footer on every page where it appears.
**Design Recommendation:** Fix its position in the global header or footer. It
does not have to appear on every page — but where it does, the position must be
consistent.
**Developer Note:** New in WCAG 2.2. Simple to satisfy via a shared component, but
must be verified rather than assumed.

---

# 8 · Images & Media

---

### I-01 · Alt text duplicates adjacent visible text
**Issue:** The same words are announced twice.
**WCAG:** 1.1.1 Non-text Content — **Level A**
**Severity:** Low
**Current:** `img[alt="Kensington Palace"]` and `img[alt="Tower of London"]` sit
directly beside headings containing identical text. Confirmed by axe-core.
**Required Fix:** Set `alt=""` on both.
**Design Recommendation:** Where an image sits beside a heading that names it, the
image is decorative in context. Note this in the content guidelines — it is a
frequent and easily repeated error.
**Developer Note:** `alt=""` (empty, present) is correct. Omitting the attribute
entirely is not equivalent and causes screen readers to announce the filename.

---

### I-02 · Decorative illustrations have no export strategy
**Issue:** Complex illustrations risk being exposed as many individual nodes.
**WCAG:** 1.1.1 Non-text Content — **Level A**
**Severity:** Medium
**Current:** Twelve Figma frames each contain 150+ vector/boolean layers (pigeons,
trees, skyline). If exported as inline SVG without treatment, every fragment is
announced.
**Required Fix:** Export each illustration as a single asset with
`alt="" aria-hidden="true"`. If informative, give it one meaningful `alt`.
**Design Recommendation:** Decide decorative vs informative per illustration and
record it on the frame. Flatten before export.
**Developer Note:** For inline SVG use `aria-hidden="true"` plus `focusable="false"`
— the latter prevents a tab stop in older browsers.

---

### I-03 · Information conveyed only by images — route maps
**Issue:** Route information may exist only in graphical form.
**WCAG:** 1.1.1 Non-text Content (A) · 1.4.5 Images of Text (AA)
**Severity:** **High** (pending verification)
**Current:** Eleven route-map pages present routes and stops as pannable
graphics. Whether an equivalent text version exists was not verified.
**Required Fix:** Provide the stop sequence and route detail as real text or a
table on the same page.
**Design Recommendation:** This is the most significant *content* accessibility
risk on the site. A visual map is genuinely useful and should stay — but it
cannot be the only representation. An accessible stop list also benefits SEO and
mobile users on slow connections. If any stop names are baked into the map image
as text, that additionally fails 1.4.5.
**Developer Note:** Cannot be solved with ARIA. Requires a text equivalent in the
content model.

---

### I-04 · Alt text quality — untested
**Issue:** Automation confirms alt exists, never that it is meaningful.
**WCAG:** 1.1.1 Non-text Content — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Only two alt-text failures were machine-detectable. The quality of
alt text across the site is unassessed.
**Required Fix:** Human review of images on key templates.
**Design Recommendation:** Provide alt text alongside image assets in the CMS
brief. Decorative images take `alt=""`.
**Developer Note:** Ensure the CMS exposes an alt field and that it is mandatory
for content images.

---

### I-05 · Multimedia captions and flashing — untested
**Issue:** Video/audio requirements and flash thresholds unassessed.
**WCAG:** 1.2.2 Captions (A) · 1.2.3 Audio Description or Media Alternative (A) ·
1.2.5 Audio Description (AA) · 2.3.1 Three Flashes (A)
**Severity:** **NEEDS TESTING**
**Current:** No video or audio content was detected by the scan, but presence was
not exhaustively confirmed.
**Required Fix:** If any video exists, it needs synchronised captions and an audio
description or full text alternative. Confirm nothing flashes more than three
times per second.
**Design Recommendation:** Specify captions as a launch requirement for any
promotional video. Autoplaying video with sound also engages 1.4.2.
**Developer Note:** Third-party embeds (YouTube, Vimeo) still require captions to
be present on the hosted asset.

---

# 9 · Responsive & Reflow

---

### R-01 · Reflow at 320px / 400% zoom — untested
**Issue:** Content must reflow to a single column without two-dimensional scrolling.
**WCAG:** 1.4.10 Reflow — **Level AA**
**Severity:** **NEEDS TESTING** (Critical if it fails)
**Current:** **Not tested.** Scanning covered 1440px and 390px only. 400% zoom —
equivalent to a 320px CSS viewport — was never assessed.
**Required Fix:** Test every template at 1280×1024 with 400% browser zoom, or a
320px-wide viewport. No horizontal scrolling may be required for content that
does not inherently need two-dimensional layout.
**Design Recommendation:** Define behaviour at 320px explicitly in the design
system. The booking stepper, route maps and card carousels are highest risk.
Maps and data tables are legitimately exempt as content requiring 2D layout —
but their *surrounding* page must still reflow.
**Developer Note:** This is the most significant untested criterion in this audit.
It cannot be inferred from the 390px mobile scan, because 320px with 400% zoom
scales text far beyond what a mobile viewport does.

---

### R-02 · Resize text to 200% — retest required
**Issue:** Content must remain usable at 200% zoom.
**WCAG:** 1.4.4 Resize Text — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** The automated check reported failure on 69 of 69 pages. **That result
is not reliable** — it used CSS `zoom`, which does not replicate browser zoom,
and a 100% failure rate indicts the method rather than the site. A responsive Tailwind build would
ordinarily pass.
**Required Fix:** Set browser zoom to 200% at 1280×1024. Verify no content is
clipped, overlapped or lost. Check the homepage, a PDP, a route map and a form.
**Design Recommendation:** Only if it genuinely fails: replace fixed pixel widths
on page and section wrappers with `max-width` plus fluid padding.
**Developer Note:** Test with real browser zoom (Cmd/Ctrl +), not devtools device
emulation and not CSS `zoom` — the three behave differently.

---

### R-03 · Tablet breakpoint — untested
**Issue:** The intermediate breakpoint was not scanned.
**WCAG:** 1.4.10 Reflow (AA) · 1.3.4 Orientation (AA)
**Severity:** **NEEDS TESTING**
**Current:** Only 1440px and 390px were scanned. Tablet (768–1024px) and landscape
orientation were not.
**Required Fix:** Scan or manually review at 768px and 1024px, in both orientations.
**Design Recommendation:** Tablet is where carousel and grid layouts most often
break. Confirm content is not locked to portrait — 1.3.4 prohibits restricting
orientation unless essential.
**Developer Note:** Add 768px to the scan viewport list in `config/settings.js`
for future runs.

---

# 10 · Motion & Animation

---

### M-01 · Reduced-motion support — unconfirmed
**Issue:** Cannot confirm whether motion is suppressed for users who request it.
**WCAG:** 2.3.3 Animation from Interactions — **Level AAA** *(not required at AA)*
**Severity:** **NEEDS TESTING** (best practice, not an AA failure)
**Current:** The scan could not find a `prefers-reduced-motion` media query in
same-origin stylesheets, but cross-origin CSS could not be inspected, so this is
inconclusive.
**Required Fix:** Enable Reduce Motion at OS level and reload key pages. Confirm
non-essential animation stops.
**Design Recommendation:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important;
    animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```
**Developer Note:** Being explicit about the level: **2.3.3 is AAA and is not
required for AA conformance.** It is included here because it is low-cost and high
value for users with vestibular disorders — but it must not be recorded as an AA failure.

---

### M-02 · Auto-moving content — untested
**Issue:** Content that moves, scrolls or auto-updates for more than five seconds
must be pausable.
**WCAG:** 2.2.2 Pause, Stop, Hide — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Auto-advancing carousels are the usual cause; the site
has multiple card carousels whose behaviour was not observed.
**Required Fix:** If any carousel auto-advances, provide a visible pause control.
**Design Recommendation:** Prefer carousels that do not auto-advance. If marketing
requires it, add a pause/play control of at least 24×24 and stop rotation on
hover and on focus.
**Developer Note:** This is Level A — a failure here is more serious than most
items in this report.

---

# 11 · Component States

---

### S-01 · Interactive states — audited summary
**Issue:** Component state coverage is strong in design but partly unimplemented,
and two states are undefined.
**WCAG:** 1.4.11 Non-text Contrast (AA) · 2.4.7 Focus Visible (AA) · 4.1.2 (A)
**Severity:** **High**
**Current:** `Button- Master` defines a complete 60-variant matrix — Default,
Hover, Pressed, Focus, Disabled × 4 Types × 3 Sizes. Measured:

| State | Background | Label | Ratio | Verdict |
|---|---|---|---|---|
| Default | `#164291` | `#ffffff` | 9.45:1 | **PASS** |
| Hover | `#4398d4` | `#ffffff` | 3.14:1 | **FAIL** (C-02) |
| Pressed | `#0d2755` | `#ffffff` | 14.60:1 | **PASS** |
| Focus | `#164291` + 2px `#4398d4` ring | `#ffffff` | 9.45:1 text / 3.01:1 ring | **PASS** (not implemented — F-01) |
| Disabled | `#d4d4d4` | `#a3a3a3` | 1.70:1 | Exempt from 1.4.3 |

**No Loading state and no Selected state are defined anywhere in the library.**
**Required Fix:** Fix Hover (C-02). Implement Focus (F-01). Add Loading and
Selected variants.
**Design Recommendation:** A booking flow triggers asynchronous actions, so a
Loading state is essential — without one, developers improvise, and a spinner
that replaces a label with no accessible name is a common 4.1.2 failure. Specify:
label retained, spinner added, button disabled, `aria-busy="true"`.
**Developer Note:** Disabled buttons are exempt from contrast requirements, but
`#a3a3a3` on `#d4d4d4` at 1.70:1 is genuinely unreadable. Recommend `#e5e5e5`
background with `#595959` text (5.56:1). Never convey disabled state by colour
alone — use the `disabled` attribute so it is exposed to assistive technology.

---

### S-02 · Expanded/collapsed and selected states — untested
**Issue:** State changes must be exposed programmatically, not only visually.
**WCAG:** 4.1.2 Name, Role, Value — **Level A**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. The site has FAQ accordions, navigation dropdowns and
suggestive search — all state-bearing components.
**Required Fix:** Accordions and disclosure triggers need `aria-expanded`
reflecting current state. Tabs need `aria-selected`. Suggestive search needs the
combobox pattern with `aria-expanded`, `aria-controls` and `aria-activedescendant`.
**Design Recommendation:** Every state in the design must have a non-colour
indicator — a chevron rotation, a weight change, an underline. Colour-only state
changes fail 1.4.1.
**Developer Note:** Prefer native `<details>`/`<summary>` for accordions — correct
semantics with no ARIA. Only use the ARIA disclosure pattern where the native
element cannot be styled to requirements.

---

### S-03 · Content on hover or focus — untested
**Issue:** Tooltips and hover-revealed content have specific requirements.
**WCAG:** 1.4.13 Content on Hover or Focus — **Level AA**
**Severity:** **NEEDS TESTING**
**Current:** Not assessed. Tooltip components were not exercised.
**Required Fix:** Any content revealed on hover/focus must be dismissible
(Escape), hoverable (the pointer can move onto it without it disappearing), and
persistent (it remains until dismissed or focus moves).
**Design Recommendation:** Avoid tooltips for essential information. If a tooltip
carries meaning, that meaning must also be available without hover — a
keyboard-only or touch user may never trigger it.
**Developer Note:** Pure-CSS `:hover` tooltips almost always fail this criterion
because they are neither dismissible nor hoverable.

---

# WCAG 2.2 Level AA — Compliance Scorecard

**Verdict definitions.** PASS = verified conformant. FAIL = verified
non-conformant. NEEDS TESTING = genuinely unknown; treat as a potential failure
until resolved.

### ❌ FAIL — verified non-conformant (11)

| Ref | Criterion | Level | Severity |
|---|---|---|---|
| C-01 | 1.4.3 Contrast (Minimum) — tertiary grey text | AA | Critical |
| C-02 | 1.4.3 Contrast (Minimum) — button hover | AA | High |
| C-03 | 1.4.3 Contrast (Minimum) — badges | AA | High |
| C-04 | 1.4.3 Contrast (Minimum) — pink on red | AA | Medium |
| C-05 | 1.4.11 Non-text Contrast — functional borders | AA | High |
| C-06 | 1.4.3 / 1.4.11 — remaining tokens | AA | Medium |
| T-01 | 1.3.1 Info and Relationships — heading skip | A | High |
| K-01 | 2.1.1 Keyboard — scroll regions | A | Critical |
| F-01 | 2.4.7 Focus Visible | AA | Critical |
| N-01 | 2.4.1 Bypass Blocks — no skip link | A | High |
| I-01 | 1.1.1 Non-text Content — duplicated alt | A | Low |

Plus, from the design system: **FM-01** (3.3.1 / 4.1.2, Critical), **FM-02**
(3.3.2, High), **TT-01** (2.5.8, High), **I-02** (1.1.1, Medium), **S-01**
(1.4.11 / 2.4.7, High), **K-03** (2.4.3, High), **N-02** (1.3.1, Medium).

**Total verified failures: 18** — of which **4 Critical**, **8 High**.

### ⚠️ NEEDS TESTING — cannot be determined without manual/device testing (22)

| Ref | Criterion | Level | Note |
|---|---|---|---|
| C-07 | 1.4.3 Contrast — text over imagery | AA | Run `07_verify_backdrops.js` |
| C-08 | 1.4.1 Use of Colour | A | Greyscale review |
| T-03 | 1.4.12 Text Spacing | AA | Bookmarklet test |
| K-02 | 2.1.2 No Keyboard Trap | A | **Critical if confirmed** |
| K-04 | 2.1.1 Keyboard — composite widgets | A | Manual |
| K-05 | 2.5.7 Dragging Movements | AA **(2.2)** | Route maps |
| F-02 | 2.4.11 Focus Not Obscured | AA **(2.2)** | Sticky header — high suspicion |
| TT-02 | 2.5.8 Target Size — spacing | AA **(2.2)** | Device measurement |
| FM-03 | 3.3.3 Error Suggestion | AA | Review message copy |
| FM-04 | 1.3.5 Identify Input Purpose | AA | autocomplete tokens |
| FM-05 | 3.3.2 Labels or Instructions | A | Required indication |
| FM-06 | 3.3.7 Redundant Entry | A **(2.2)** | Booking flow |
| FM-07 | 3.3.8 Accessible Authentication | AA **(2.2)** | Login/paste |
| N-03 | 2.4.2 Page Titled | A | 69 titles |
| N-04 | 2.4.4 Link Purpose | A | "Learn more" audit |
| N-05 | 3.2.3 / 3.2.4 Consistency | AA | Cross-template |
| N-06 | 3.2.6 Consistent Help | A **(2.2)** | Help placement |
| I-03 | 1.1.1 / 1.4.5 — route map text equivalent | A/AA | **High risk** |
| I-04 | 1.1.1 — alt quality | A | Human review |
| I-05 | 1.2.2 / 1.2.3 / 2.3.1 — media | A | If media exists |
| R-01 | 1.4.10 Reflow @320px | AA | **Never tested** |
| R-02 | 1.4.4 Resize Text @200% | AA | Prior test invalid |
| R-03 | 1.3.4 Orientation / tablet | AA | Not scanned |
| M-02 | 2.2.2 Pause, Stop, Hide | A | Carousel behaviour |
| S-02 | 4.1.2 Name, Role, Value — states | A | Accordions, search |
| S-03 | 1.4.13 Content on Hover or Focus | AA | Tooltips |

### ✅ PASS — verified conformant (selected)

| Criterion | Evidence |
|---|---|
| 1.4.3 — primary/secondary/link text | 17.93:1 / 7.81:1 / 9.45:1 |
| 1.4.3 — inverse text on brand, footer, action colours | 4.87:1 / 13.07:1 / 9.45:1 |
| 1.4.3 — button Default and Pressed states | 9.45:1 / 14.60:1 |
| 1.4.11 — designed focus ring | 3.01:1 / 3.14:1 (design only — not implemented) |
| 1.4.3 — warning and info tokens | 5.02:1 / 5.56:1 |
| 1.1.1 — image alt present | Only 2 machine-detectable failures across 69 pages |
| 4.1.1 Parsing | **Removed in WCAG 2.2** — not assessed |

### Summary

| Verdict | Count |
|---|---|
| **FAIL** | **18** (4 Critical, 8 High, 5 Medium, 1 Low) |
| **NEEDS TESTING** | **26** |
| **PASS** | Selected criteria verified above |

**Current status: NOT WCAG 2.2 Level AA conformant.**

Eighteen verified failures must be fixed. Twenty-six criteria cannot be assessed
without manual testing — and because a single failure anywhere breaks
conformance, **the site cannot be declared AA until those are resolved too.**

### The honest bottom line

The verified failures are, on the whole, cheap to fix: one find-and-replace
resolves 174 elements, and two additive CSS changes resolve two site-wide
criteria. The design system is in better shape than the implementation — the
focus ring is already designed correctly and simply was not built.

The real risk is the **NEEDS TESTING** column, and specifically these four:

1. **R-01 Reflow at 320px** — never tested, AA, and a common failure
2. **I-03 route maps** — likely no text equivalent for route information
3. **K-05 / F-02 / FM-06 / FM-07** — four WCAG 2.2 criteria that did not exist in
   2.1, so a team working from a 2.1 checklist will have missed them entirely
4. **K-02 keyboard trap** — Level A, and the most severe class of failure

None of those can be settled from a scan. Budget for a manual accessibility test
pass — roughly two days for a competent tester across these templates — before
any conformance claim is made.

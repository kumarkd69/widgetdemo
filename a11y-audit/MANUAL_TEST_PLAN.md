# Manual Accessibility Test Plan
### theoriginaltour.com · WCAG 2.2 Level AA · 26 unresolved criteria

**Purpose.** The automated audit verified 18 failures and left 26 criteria
undetermined. Automated tooling catches roughly 30–40% of WCAG issues; the rest
require a human. **The site cannot be declared AA conformant until this plan is
completed**, because a single unresolved failure anywhere breaks conformance.

**Effort:** roughly 2 days for one competent tester.
**Skill needed:** comfortable with keyboard-only navigation and a screen reader.
No development knowledge required for most tests.

---

## Setup — 30 minutes

**Browsers:** Chrome or Edge (primary), Safari (for VoiceOver tests).

**Screen readers** — use the pairings assistive-technology users actually use:
| Platform | Screen reader | Browser |
|---|---|---|
| Windows | NVDA (free, nvaccess.org) | Chrome or Firefox |
| macOS | VoiceOver (built in, ⌘F5) | Safari |
| iOS | VoiceOver (Settings → Accessibility) | Safari |

**Browser extensions:** axe DevTools or WAVE (free) — useful for spot checks,
but this plan deliberately covers what they *cannot* detect.

**Text-spacing bookmarklet** for TEST 3 — save as a bookmark:
```javascript
javascript:(function(){var d=document,s=d.createElement('style');s.innerHTML='*{line-height:1.5!important;letter-spacing:0.12em!important;word-spacing:0.16em!important}p{margin-bottom:2em!important}';d.head.appendChild(s)})();
```

**Test pages** — this set covers every template:
1. Homepage — `/`
2. Product listing — `/tours/`
3. Product detail — `/tours/hop-on-hop-off-london-1-3-day/`
4. Route map — `/routes-maps/red/`
5. Contact form — `/help-and-support/contact-us/`
6. Manage bookings — `/my-bookings/`
7. FAQ / accordions — `/help-and-support/`
8. Search — `/search/`

**Recording results:** mark each test PASS / FAIL / N/A. For every FAIL, capture
the page URL, the element, what happened, and what you expected. A screenshot or
short screen recording is worth far more than a written description.

---

# PRIORITY 1 — Do these first

The four highest-risk unresolved items. If time runs short, do only these.

---

## TEST 1 · Reflow at 320px (400% zoom) — **highest risk**
**WCAG 1.4.10 Reflow — Level AA** · Ref R-01
**Never tested. Common failure. Blocks conformance if it fails.**

**Steps**
1. Set the browser window to exactly **1280×1024**.
2. Zoom to **400%** (Ctrl/Cmd + repeatedly — the zoom indicator must read 400%).
3. Visit each of the 8 test pages.

**Expected:** content reflows to a single column. **No horizontal scrolling** is
required to read content.

**Fail if:** you must scroll horizontally to read a sentence; content is clipped
or overlaps; controls become unreachable; a fixed-width element forces sideways
scrolling.

**Legitimate exceptions:** the route **map** itself and any data table may
require two-dimensional scrolling — that content genuinely needs 2D layout. The
page *around* them must still reflow.

**Watch closely:** the booking stepper, card carousels, route-map pages, the
sticky header (does it consume the whole screen at 400%?), and the cookie banner.

> Use real browser zoom (Ctrl/Cmd +). **Not** devtools device emulation, and not
> CSS `zoom` — all three behave differently, and getting this wrong is what
> invalidated the automated result.

| Page | Result | Notes |
|---|---|---|
| Homepage | ☐ PASS ☐ FAIL | |
| Product listing | ☐ PASS ☐ FAIL | |
| Product detail | ☐ PASS ☐ FAIL | |
| Route map | ☐ PASS ☐ FAIL | |
| Contact form | ☐ PASS ☐ FAIL | |
| Manage bookings | ☐ PASS ☐ FAIL | |
| FAQ | ☐ PASS ☐ FAIL | |
| Search | ☐ PASS ☐ FAIL | |

---

## TEST 2 · Keyboard trap
**WCAG 2.1.2 No Keyboard Trap — Level A** · Ref K-02
**Most severe failure class in WCAG. A trapped user must close the browser tab.**

**Steps**
1. Click the browser address bar (so focus starts outside the page).
2. Press **Tab** repeatedly through the entire page.
3. Then **Shift+Tab** all the way back.
4. Repeat on all 8 test pages, and inside every modal, dropdown and menu.

**Expected:** focus always advances and can always leave every component.

**Fail if:** Tab stops advancing; focus cycles endlessly inside a component with
no exit; you cannot return to the browser chrome.

**Test especially:** the cookie banner, any modal, the suggestive-search
dropdown, the date picker, and embedded map widgets.

☐ PASS ☐ FAIL — Pages tested: ______________________

---

## TEST 3 · Focus not obscured by the sticky header
**WCAG 2.4.11 Focus Not Obscured (Minimum) — Level AA · NEW IN 2.2** · Ref F-02
**High suspicion — the site has a sticky header and a cookie banner.**

**Steps**
1. Scroll halfway down a long page (a PDP works well).
2. Press **Tab** repeatedly and watch each focused element.
3. Pay attention when focus moves to an element near the top of the viewport.

**Expected:** the focused element is never *entirely* hidden behind the sticky
header or the cookie banner.

**Fail if:** you can tell focus moved (the page scrolled) but you cannot see the
focused element because the header covers it.

> This criterion did not exist in WCAG 2.1, so teams working from a 2.1 checklist
> miss it. At AA, *partial* obscuring is acceptable — only *entirely* hidden
> fails. (Fully unobscured is 2.4.12, which is AAA.)

**If it fails**, the fix is `scroll-margin-top` equal to the header height.

☐ PASS ☐ FAIL ☐ N/A (no sticky elements)

---

## TEST 4 · Route maps — is the information available as text?
**WCAG 1.1.1 (A) · 1.4.5 Images of Text (AA)** · Ref I-03
**The most significant content risk on the site.**

**Steps**
1. Visit `/routes-maps/red/` and the other route pages.
2. Turn on a screen reader and navigate the page.
3. Ask: can the **stop sequence and route detail** be obtained without seeing the map?

**Expected:** stops and route information exist as real text or a table on the page.

**Fail if:** the route is conveyed only by the map graphic; stop names are baked
into the image as text (this additionally fails 1.4.5).

**This cannot be fixed with ARIA.** It requires a text equivalent in the content
model — which also helps SEO and users on slow connections.

| Route page | Text equivalent present? | Notes |
|---|---|---|
| Red | ☐ YES ☐ NO | |
| Blue | ☐ YES ☐ NO | |
| Green | ☐ YES ☐ NO | |
| Pink | ☐ YES ☐ NO | |
| Others | ☐ YES ☐ NO | |

---

# PRIORITY 2 — WCAG 2.2 criteria that didn't exist in 2.1

Easily missed. Each is quick to check.

---

## TEST 5 · Dragging movements
**WCAG 2.5.7 — Level AA · NEW IN 2.2** · Ref K-05

Any function that uses dragging must have a single-pointer alternative.

**Steps** — for each of: route maps (panning), any date-range slider, any
carousel that responds to swipe, any drag-to-reorder:
1. Try to achieve the same result **without dragging** — using only clicks/taps.

**Expected:** buttons or inputs provide an equivalent (zoom `+`/`−`, pan arrows,
a numeric input beside a slider).

**Fail if:** the only way to pan the map or set a value is by dragging.

> Third-party embeds count. An embedded map's failure is still your failure.

☐ PASS ☐ FAIL — Components checked: ______________________

---

## TEST 6 · Redundant entry
**WCAG 3.3.7 — Level A · NEW IN 2.2** · Ref FM-06

**Steps**
1. Start a booking and proceed through every step.
2. Note any information you are asked for **twice** in the same process.

**Expected:** previously entered information is auto-populated or selectable
(e.g. "billing address same as contact address").

**Fail if:** you must re-type an address, name or email already provided.

**Exception:** re-entry that is essential (confirming a password) is permitted.
Convenience is not an exception.

☐ PASS ☐ FAIL — Fields repeated: ______________________

---

## TEST 7 · Accessible authentication
**WCAG 3.3.8 — Level AA · NEW IN 2.2** · Ref FM-07

**Steps** — on any login or booking-reference lookup:
1. Try to **paste** into the password / reference field.
2. Check whether a password manager can fill it.
3. Note any CAPTCHA and what it requires.

**Expected:** paste works; password managers function; no cognitive-function test
without an alternative.

**Fail if:** paste is blocked; a CAPTCHA requires transcribing text or solving a
puzzle with no alternative method.

> Blocking paste on a password field is an outright failure — and common.

☐ PASS ☐ FAIL ☐ N/A (no authentication)

---

## TEST 8 · Consistent help
**WCAG 3.2.6 — Level A · NEW IN 2.2** · Ref N-06

**Steps**
1. On each test page, find the help/contact entry point.
2. Note its position relative to other content.

**Expected:** where present, it appears in the **same relative order** on every page.

**Fail if:** contact is in the header on one page and only the footer on another.

> It need not appear on every page. Where it does, position must be consistent.

☐ PASS ☐ FAIL

---

## TEST 9 · Target size and spacing
**WCAG 2.5.8 — Level AA · NEW IN 2.2** · Ref TT-01, TT-02

**Steps**
1. On a real mobile device, attempt to tap every icon button, arrow control,
   carousel control, pagination link and close button.
2. Note any you mis-tap or must aim carefully for.

**Expected:** every target is at least **24×24 CSS px**, or has enough
undisturbed space around it to reach an effective 24×24.

**Fail if:** targets are smaller and tightly packed. Adjacent controls closer
than 24px centre-to-centre are the usual cause.

**Exception:** inline links inside a sentence are exempt.

> AA requires 24×24 (2.5.8). 44×44 is 2.5.5, which is AAA — recommended, not required.

☐ PASS ☐ FAIL — Problem controls: ______________________

---

# PRIORITY 3 — Screen reader and forms

---

## TEST 10 · Screen-reader pass
**Multiple criteria** · Ref D1
**Budget 3–4 hours. The single most valuable test in this plan.**

Complete these journeys **using only the screen reader**, with the monitor turned
off or your eyes closed for at least one run:

**A. Find and view a tour**
Homepage → browse tours → open a product page → read price and description.

**B. Complete the contact form**
Navigate to contact → complete every field → submit with an error → correct it →
submit successfully.

**C. Search**
Use the search box → review results → open one.

**Record for each:**
| Question | A | B | C |
|---|---|---|---|
| Could you complete it unaided? | ☐ | ☐ | ☐ |
| Was every control announced with a meaningful name? | ☐ | ☐ | ☐ |
| Were images described usefully (or correctly silent)? | ☐ | ☐ | ☐ |
| Was the heading structure logical? | ☐ | ☐ | ☐ |
| Were errors announced when they appeared? | ☐ | ☐ | ☐ |
| Did anything read in an illogical order? | ☐ | ☐ | ☐ |

**Listen for:** "button" with no name · "link" with no context · "graphic"
followed by a filename · form fields announced without a label · content that
appears visually but is never announced · state changes (expanded/collapsed) that
are silent.

---

## TEST 11 · Forms in detail
**WCAG 3.3.1 (A) · 3.3.2 (A) · 3.3.3 (AA) · 1.3.5 (AA)** · Ref FM-01, FM-03, FM-04, FM-05

On the contact, report-an-issue and lost-item forms:

**11a — Labels (3.3.2)**
Every field has a **visible** label that stays visible while typing.
Fail if placeholder text is the only label, or a floating label disappears on input.
☐ PASS ☐ FAIL

**11b — Required fields (3.3.2)**
Required fields are clearly marked, not by colour alone.
☐ PASS ☐ FAIL

**11c — Error identification (3.3.1)**
Submit the form empty. Errors must be announced by the screen reader, not just
shown. Each error must be associated with its field.
☐ PASS ☐ FAIL

**11d — Error suggestion (3.3.3)**
Errors must say **how to fix** the problem. "Invalid email" fails;
"Enter an email address in the format name@example.com" passes.
☐ PASS ☐ FAIL

**11e — Autocomplete (1.3.5)**
Right-click a name/email/phone field → Inspect. Confirm an `autocomplete`
attribute with the correct token (`name`, `email`, `tel`, `postal-code`).
☐ PASS ☐ FAIL

**11f — Colour alone (1.4.1)**
View the error state in greyscale (devtools → Rendering → emulate achromatopsia).
The error must remain identifiable.
☐ PASS ☐ FAIL

---

## TEST 12 · Interactive components
**WCAG 2.1.1 (A) · 4.1.2 (A)** · Ref K-04, S-02

For each of: FAQ accordions · navigation dropdowns · suggestive search ·
date picker · any modal · any tabs

**Keyboard:**
- Reachable by Tab ☐
- Operable with Enter/Space ☐
- Arrow keys work where expected (menus, tabs) ☐
- Escape closes it ☐
- Focus returns to the trigger on close ☐
- Focus stays inside an open modal ☐

**Screen reader:**
- Announces its role ("button", "menu", "dialog") ☐
- Announces state — expanded/collapsed, selected ☐
- State announcement updates on change ☐

**Fail if** an accordion never announces expanded/collapsed, or a modal lets
focus escape to the page behind it.

---

# PRIORITY 4 — Remaining checks

---

## TEST 13 · Resize text to 200%
**WCAG 1.4.4 — Level AA** · Ref R-02
Browser at 1280×1024, zoom **200%**. Content must remain usable — nothing
clipped, overlapping or lost.
*(The automated result for this was invalid; treat as untested.)*
☐ PASS ☐ FAIL

## TEST 14 · Text spacing
**WCAG 1.4.12 — Level AA** · Ref T-03
Run the bookmarklet from Setup on each test page. Nothing may be clipped or
overlap. Fixed-height text containers are the usual cause of failure.
☐ PASS ☐ FAIL

## TEST 15 · Page titles
**WCAG 2.4.2 — Level A** · Ref N-03
Check the browser tab title on each test page. Each must be unique and
descriptive, most-specific information first.
☐ PASS ☐ FAIL

## TEST 16 · Link purpose
**WCAG 2.4.4 — Level A** · Ref N-04
With a screen reader, list all links on a page (NVDA: `Insert+F7`).
Fail if many read identically ("Learn more", "Book now") with no distinguishing context.
☐ PASS ☐ FAIL

## TEST 17 · Use of colour
**WCAG 1.4.1 — Level A** · Ref C-08
Emulate achromatopsia (devtools → Rendering). Check inline links in body copy are
still identifiable (underline), error states remain clear, and category badges
are still distinguishable.
☐ PASS ☐ FAIL

## TEST 18 · Moving content
**WCAG 2.2.2 — Level A** · Ref M-02
Do any carousels auto-advance? If motion lasts more than 5 seconds there must be
a visible pause control.
☐ PASS ☐ FAIL ☐ N/A

## TEST 19 · Tooltips / hover content
**WCAG 1.4.13 — Level AA** · Ref S-03
Any content revealed on hover or focus must be: dismissible with Escape,
hoverable (pointer can move onto it), and persistent until dismissed.
Pure-CSS `:hover` tooltips almost always fail.
☐ PASS ☐ FAIL ☐ N/A

## TEST 20 · Orientation and tablet
**WCAG 1.3.4 — Level AA** · Ref R-03
Test on a tablet in both portrait and landscape. Content must not be locked to
one orientation.
☐ PASS ☐ FAIL

## TEST 21 · Reduced motion
**WCAG 2.3.3 — Level AAA** · Ref M-01
Enable Reduce Motion at OS level, reload key pages, confirm non-essential
animation stops.
> **AAA, not required for AA.** Record it, but do not count a failure here
> against AA conformance.
☐ PASS ☐ FAIL

## TEST 22 · Alt text quality
**WCAG 1.1.1 — Level A** · Ref I-04
Review images on key templates. Does the alt text convey what the image conveys?
Are decorative images silent (`alt=""`)?
☐ PASS ☐ FAIL

## TEST 23 · Media
**WCAG 1.2.2 / 1.2.3 (A) · 2.3.1 (A)** · Ref I-05
If any video or audio exists: synchronised captions present, audio description or
text alternative provided, nothing flashes more than 3× per second.
☐ PASS ☐ FAIL ☐ N/A

## TEST 24 · Consistent navigation
**WCAG 3.2.3 / 3.2.4 — Level AA** · Ref N-05
Navigation is in the same order on every page; repeated components use consistent
labels and icons.
☐ PASS ☐ FAIL

## TEST 25 · Booking journey by keyboard
**Multiple criteria** · Ref D3
Complete a real booking using **only** the keyboard, through to payment. Note any
step that cannot be completed. This journey was not exercised by the audit at all.
☐ PASS ☐ FAIL

## TEST 26 · Contrast over imagery
**WCAG 1.4.3 — Level AA** · Ref C-07
Run the verifier first:
```bash
cd a11y-audit/local-scan && node scripts/07_verify_backdrops.js
open output/verify-backdrops.html
```
Then eyeball the `ON_IMAGE` / `ON_GRADIENT` / `OVER_MEDIA` groups. Check the
**lightest** region of each image — and remember the image can change via the CMS,
so the answer must hold for any image in that slot, not just today's.
☐ PASS ☐ FAIL

---

# Reporting

For every FAIL record:

```
Test:          TEST 3 — Focus not obscured
WCAG:          2.4.11 Focus Not Obscured (Minimum) — AA
Page:          /tours/hop-on-hop-off-london-1-3-day/
What happened: Tabbing to the "Select date" button after scrolling — the button
               receives focus but is completely hidden behind the sticky header.
Expected:      Focused element visible.
Evidence:      screenshot-014.png
```

Then re-run the automated scan to confirm nothing regressed:
```bash
cd a11y-audit/local-scan
npm run everything
node scripts/05_diff_runs.js
```

---

# Conformance statement — the honest position

**Do not publish an accessibility statement claiming WCAG 2.2 AA until:**

1. All 18 verified failures are fixed *(see `DEV_FIXES.md`)*
2. This plan is complete with no outstanding FAIL
3. The re-run scan is clean

If some items cannot be fixed before launch, the correct approach is a **partial
conformance statement** that names precisely what does not yet conform and when
it will — not a blanket claim. An inaccurate accessibility statement carries more
legal and reputational risk than an honest one admitting known gaps.

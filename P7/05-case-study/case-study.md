# Span: a bridge for health cover when you leave a job

**A concept that shows the date your group cover ends, what you keep, and three routes to stay covered, with the least health data. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | People relying on employer cover discover it ends only after they leave, and the window to keep waiting-period credit is buried in HR emails and policy documents. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the IRDAI master circular coverage on migration and portability, mapped the ecosystem, designed three concepts, built flows, hi-fi screens, an HR console and a prototype. |
| Key insight | The date is the product. 'Your cover ends on 30 Nov 2026' does more than any explainer. |
| Status | Concept. No interviews or tests. Windows and routes are tagged [VERIFY] because sources disagree. |

## Context
IRDAI's Master Circular on Health Insurance (29 May 2024) says members of a group policy must be offered migration to an individual or family floater policy on exit. Credit for waiting periods and moratorium carries over [VERIFY]. Sources disagree on whether a group member can port to a different insurer.
Standard portability needs an application 45 to 60 days before renewal, with a 15-day response, and the pre-existing waiting cap is 36 months with a 5-year moratorium [VERIFY].

## The real problem
I started with 'a portability tool'. The harder problem is awareness: people don't know the date, and nobody tells them what they keep.
One assumption I can't prove: that HR will share exit dates. Without them, employees have to enter the date themselves.

## Research (desk only)
I read the circular summaries and insurer and aggregator guidance, scored today's exit experience on Nielsen's ten heuristics (about 2.0 of 5, from typical patterns) and mapped ten parties.
No interviews. Personas are proto-personas. A 10-person plan is ready, and it avoids asking for diagnoses.

## Insights
- Migration and portability already exist. A personal timeline doesn't.
- Credit is invisible. Showing it as a number per family member changes the decision.
- Older and chronic-condition buyers fear underwriting more than cost; health data should come last.

## Strategy and principles
Six principles: dates first, show what you keep, calm urgency, neutral on insurers, health data last and least, the whole family.

## Three concepts, one winner
A Auto-migrate at exit. B Cover-cliff timeline with guided choice. C Human case manager.
B scored 33 of 35, A 22, C 21. A spends someone's money without a choice. C reintroduces conflict of interest; it can come later as an advisor call.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| Open with the date | Open with options | Some alarm; copy stays calm |
| Credit per person as a number | A single 'you keep credit' line | More to read |
| Unknown routes labelled 'Unknown' | Guess a rule | Less certainty on screen |
| Health questions last | Ask upfront | Less personalised early advice |
| No auto-migrate | Auto-migrate default | Employees must act |

## The solution
Open from an HR invite or add your last day. See the cover-cliff bridge with today, act-by and cover-ends. See what you keep, lose and change. Compare three routes with credit and deadline. Check a short document list. Apply with a pre-filled form and the least health data. HR sees status only.
_Figma frames: A3 Cover cliff, A4 Keep and lose, B1 Compare routes, B5 Submitted_

## Before vs after
|  | Today | With Span (target) |
|---|---|---|
| Knowing the date | One line in a checklist | Dated timeline |
| What you keep | Hidden in PDFs | Credit per person |
| Choosing | Conflicting advice | Three routes side by side |
| Applying | Long forms | Pre-filled, least data |

## Edge cases
No exit date, loading, a past date, offline, a permission prompt and an unknown route are designed. If the cliff has passed, Span says what's still possible without blame.
_Figma frames: S3 Error, S6 Route unknown, C2 Cliff passed_

## Accessibility
Contrast with the WCAG formula: white on purple 10.41:1; gold markers never carry white text (1.96:1). Status is glyph plus word plus colour. The bridge has a text alternative. Dates are written in full.

## Validation
Planned: six sessions, six tasks, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: 5 of 6 testers state their cover-end and act-by dates; applications started by the act-by date (to be measured). North Star: leavers with continuous cover 30 days after exit (to be measured).

## What I'd do next
- Run interviews and tests.
- Verify windows and routes with three insurers.
- Pilot with one employer.

## Reflection
I'd start with the HR side sooner. If HR sends the date, everything else gets easier.

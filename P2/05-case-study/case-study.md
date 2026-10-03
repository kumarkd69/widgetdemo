# Nod: one place to see, understand and withdraw your consent

**A concept for a DPDP consent manager where withdrawing takes one tap and ends with proof. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | People can't see, understand or reliably withdraw consent with the apps holding their data. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the DPDP Act and Rules, mapped the ecosystem, designed three concepts, built flows, hi-fi screens and a prototype, wrote test and release plans. |
| Key insight | The law says stop processing. Users need to see it stop. A receipt beats a toggle. |
| Status | Concept. No interviews or tests yet. Consent Manager registration is not open as of Oct 2026 [VERIFY]. |

## Context
India's DPDP Rules were notified in November 2025. Consent Manager registration is due to start on 13 November 2026 [VERIFY]. A Consent Manager is a registered, data-blind service where people give, review and withdraw consent. Using one is optional for companies.
Nobody has designed this for Indian users yet. Account Aggregators do something similar in finance only.

## The real problem
I started with 'a dashboard of consents'. The harder problem is trust: after you withdraw, how do you know the company stopped?
One assumption I still can't prove: that companies will join an optional service. Without them the inventory is empty. I designed the screen to say so honestly (12 of 31 apps use Nod).

## Research (desk only)
I read the Act and Rules, trade analyses and Sahamati's Account Aggregator material. I scored today's consent flows against Nielsen's ten heuristics (average about 2 out of 5, from typical patterns, not tested apps).
I have not interviewed anyone. The personas are proto-personas. A 10-person interview plan is ready.

## Insights
- Granting consent is one tap; withdrawing is buried. The law asks for equal ease.
- No rule says how a company proves it stopped. That is the gap a receipt can fill.
- Children's data and low-literacy users need different paths, not a smaller version of the same screen.

## Strategy and principles
Six principles: equal ease, proof not promise, data-blind by design, plain first, neutral, guardian-safe. I used them to score every concept.

## Three concepts, one winner
A Auto-pilot: rules withdraw for you. B Guided clean-up: one inventory, plain purposes, one-tap withdraw, receipt. C Human-assisted: voice and a family helper.
B scored 33 of 35, C 25, A 21. I dropped A because consent should be a conscious act. C comes later because helper access is a privacy risk.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| Show a stopped receipt | Just a toggle | Needs a signed stop signal from companies |
| Honest coverage bar | Hide the empty gaps | Looks emptier, earns trust |
| Equal-weight Allow / Don't allow | Highlight Allow | Fewer opt-ins for companies |
| Verify the parent once via DigiLocker | Collect the parent's ID in Nod | Parents without DigiLocker need another route [VERIFY] |
| Mobile OTP only | Email and password | Shared phones need a PIN later |

## The solution
Link with your mobile number. See every consent and a data tree where solid branches are active and dashed ones are stopped. Open an app to read its purpose in two sentences. Withdraw, see a waiting clock, get a receipt with time and ID.
_Figma frames: A4 Your consents, B1 Consent detail, B4 Receipt, C1 New request_

## Before vs after
|  | Today | With Nod (target) |
|---|---|---|
| Steps | 9 | 4 |
| Active time | 30-60 min | Under 30 seconds |
| Channels | 3 | 1 |
| Proof | None | Receipt with time and ID |

## Edge cases
Empty list, loading, wrong code, offline and notification permission are all designed. When a company stays silent for 7 days, Nod prepares the grievance and the Board path.
_Figma frames: S1 Empty, S3 Error, S4 Offline_

## Accessibility
Contrast checked with the WCAG formula: white on primary 8.73:1; status colours at least 5.02:1. Targets 48 px. Status is a glyph plus a word plus colour. Hindi and Kannada copy is drafted by me and needs native review.

## Validation
Planned: six sessions, five tasks, SUS. Target 80 or above, to be measured. Nothing has been tested yet.

## Impact
No results yet. Targets: withdraw in under 30 seconds, 90% of users correctly say whether a company stopped. North Star: verified withdrawals per active user per quarter (to be measured).

## What I'd do next
- Run the 10 interviews and 6 tests.
- Get legal review of the purpose wording.
- Pilot with 2-3 fiduciaries once registration opens.

## Reflection
I would start with the receipt, not the inventory. The inventory is a list. The receipt is the product.

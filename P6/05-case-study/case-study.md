# Sooner: a clear price and the right ambulance, before it is sent

**A concept that shows the price cap, the equipment level and the arrival time before a private ambulance is dispatched, and checks the bill afterwards. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | In an emergency, families can't see the price, the equipment level or the arrival time before choosing a private ambulance, and can't tell afterwards whether they were overcharged. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the ambulance code and state fare orders, mapped the ecosystem, designed three concepts, built flows, hi-fi screens for families, drivers and operators, and a prototype. |
| Key insight | Panic needs one step, one price and one honest ETA. Everything else can wait. |
| Status | Concept. No interviews or tests. State fare caps and certificates are tagged [VERIFY]. |

## Context
India's National Ambulance Code, AIS-125, defines road ambulance types A to D, from patient transport to advanced life support [VERIFY amendments]. 108 is the free public ambulance in most states.
Fare caps exist in places, mostly set in 2021: Delhi fixed ₹4,000 for an advanced ambulance for the first 10 km, then ₹100 a km [VERIFY if in force]. Karnataka looks like it is moving private ambulances under the KPME Act [VERIFY]. Reports describe families charged ₹6,800 for a 4 km transfer [VERIFY].

## The real problem
I started with 'an Uber for ambulances'. The harder problem is trust under panic: the family can't judge price or kit, and has no time to ask.
One assumption I can't prove: that operators will share live fleet data and accept a price band.

## Research (desk only)
I read the code summaries, state fare orders and press reports, scored today's booking experience on Nielsen's ten heuristics (from typical patterns) and mapped the parties.
No interviews. Personas are proto-personas. A 10-person plan is ready, and it never asks anyone to retell a real emergency.

## Insights
- Price caps exist but are state by state; the product must read them from data.
- Families need needs, not conditions: oxygen, a breathing machine, a baby.
- The call is the failure point. The bill is the second failure point.

## Strategy and principles
Six principles: price before dispatch, right kit in plain words, three taps, never diagnose, works on weak signal, fair to operators.

## Three concepts, one winner
A Live bidding. B Quote card, then one tap. C Concierge hotline.
B scored 33 of 35, C 23, A 17. Bidding is too slow in an emergency. A hotline keeps the verbal price. It stays as the SMS and call fallback inside B.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| One red help button and Call 108 | A full home screen | No marketing before help |
| Ask for needs, not conditions | A symptom checker | The crew may still triage on arrival |
| A price cap, not an exact fare | Exact fare at booking | Distance may change; we tell first |
| Gauge compares bill to quote | A plain total | One more screen before paying |
| SMS fallback | App only | More build work |

## The solution
Tap help. Confirm the pickup spot. Switch on what the patient needs. See one card with the price cap, the kit level and the ETA. Confirm. Track the crew with a code that proves it is them. See the bill against the quote before paying. Operators and drivers get a console and a job card.
_Figma frames: A1 Help now, A4 Quote card, B1 On the way, B3 Bill within cap_

## Before vs after
|  | Today | With Sooner (target) |
|---|---|---|
| First step | Search and call | One tap |
| Price | Verbal | Capped, before dispatch |
| Equipment | Unknown | Basic, Advanced, Neonatal |
| Bill | Cash, no receipt | Checked against the quote |

## Edge cases
No ambulance nearby, loading, outside the service area, weak signal, location permission and an expired quote are designed. If the bill is above the cap, Sooner flags it and lets the family pay the quoted amount.
_Figma frames: S1 No ambulance nearby, S4 Weak signal, B4 Bill above cap_

## Accessibility
Contrast with the WCAG formula: white on blue 6.09:1; the red help button carries white text only (5.62:1); dark text on red fails (3.13:1) and is never used. Status is glyph plus word plus colour. The gauge has a text alternative.

## Validation
Planned: six sessions, six tasks, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: 5 of 6 testers reach the quote card in under 3 minutes; ambulances arriving with the stated kit at the quoted price (to be measured). North Star: share of requests where the ambulance arrives with the stated equipment level at the quoted price (to be measured).

## What I'd do next
- Run interviews and tests.
- Verify state caps and the AIS-125 mapping.
- Pilot with five operators in one city.

## Reflection
I'd talk to an operator first. Without their data and a fair price band, the quote card is only a promise.

# Passline: a calm assistant for barrier-free toll e-notices

**A concept that alerts owners in minutes, proves a notice is real, shows the passage and guides a dispute inside 72 hours. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | When barrier-free tolling misses or misreads a payment, owners learn too late, can't tell if the notice is real or right, and risk paying double or a block. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the 2026 toll and motor-vehicle rule changes, mapped the ecosystem, designed three concepts, built flows, hi-fi screens, a fleet view and a prototype. |
| Key insight | The clock decides everything. 72 hours is the whole design, and fake e-notice SMS is the biggest risk. |
| Status | Concept. No interviews or tests. Data access is unconfirmed. |

## Context
The National Highways Fee (Second Amendment) Rules, 2026 took effect on 17 March 2026. A failed toll triggers an e-notice. Pay the normal fee within 72 hours or it becomes double. A representation can be filed on the portal within 72 hours, and authorities must answer within 5 days. After 15 days unpaid with no representation, dues go to VAHAN and can block transfer, fitness and permits [VERIFY].
MLFF began in May 2026 at Chorayasi (Gujarat), then Rajasthan, and reached Tamil Nadu on 1 October 2026.

## The real problem
I started with 'show the e-notice nicely'. The harder problem is trust: is this notice real, and is it my car?
One assumption I can't prove: that Passline can get alerts and passage data from the official systems. Without them it falls back to parsing SMS on the device, which is weaker.

## Research (desk only)
I read the rules, press releases and trade coverage, scored today's flow on Nielsen's ten heuristics (about 2.4 of 5, from typical patterns) and mapped ten parties.
No interviews. Personas are proto-personas. A 10-person plan is ready.

## Insights
- The portal already lets owners pay and dispute. What's missing is early warning, proof and evidence help.
- The brief missed the 5-day response rule; it matters for the dispute clock.
- A fake e-notice SMS looks just like a real one.

## Strategy and principles
Six principles: early not loud, prove it's real, show the passage, clock first, owner and driver together, pay or dispute with equal ease.

## Three concepts, one winner
A Auto-pay every notice. B Alert, verify, decide. C A human help desk.
B scored 34 of 35, C 22, A 16. A pays for errors and hides dispute rights. C is costly and slow inside a 72-hour window.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| Clock first on the notice | Amount first | Less room for detail above the fold |
| Verify before pay | Pay at once | One extra step |
| Equal-size Pay and Dispute | Highlight Pay | Fewer quick payments |
| Alerts only inside the app | SMS links | One more app for owners |
| No auto-pay | Auto-pay default | Owners must act within 72 hours |

## The solution
Add a car with an OTP to the owner of record. Get an alert within minutes. Open the notice and see the route ribbon and the 72-hour clock. Check it is verified. See the passage. Pay the normal fee or file a guided dispute with an evidence checklist.
_Figma frames: A3 Alert, A4 Notice, B1 Passage, B6 Filed_

## Before vs after
|  | Today | With Passline (target) |
|---|---|---|
| Learn of the failure | SMS maybe a day later | Alert within minutes |
| Know it's real | No way to check | Verified pill |
| See the passage | Not shown | Photo, gantry, time |
| Dispute | Long form | 3 steps, evidence checklist |

## Edge cases
Empty, loading, a wrong plate, offline, a permission prompt and a fake-notice warning are designed. Offline keeps notices readable and holds payment until reconnection.
_Figma frames: S3 Error, S4 Offline, S6 Fake notice_

## Accessibility
Contrast with the WCAG formula: white on green 5.32:1; green on background 4.81:1, so green text is only used large and on white; dark on yellow 10.87:1; white on yellow only 1.62:1, so never used. Status is glyph plus word plus colour. The clock bar labels every segment.

## Validation
Planned: six sessions, six tasks, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: alert within minutes, 90% can spot a fake SMS, dispute filed in under 5 minutes. North Star: share of e-notices resolved within 72 hours (to be measured).

## What I'd do next
- Run interviews and tests.
- Ask NHAI and IHMCL about alert, verification and passage data.
- Pilot on one corridor.

## Reflection
I'd start from the fake-SMS problem. If people can't trust a notice, nothing else matters.

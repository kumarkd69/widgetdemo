# Fineprint: buying insurance on Bima Sugam without an agent, and still understanding it

**A concept that starts from needs, shows what a policy does NOT cover first, ranks by open rules and keeps a licensed person one tap away. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | Without agents, buyers choose among dozens of jargon-heavy policies alone and learn what's not covered at claim time. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the public record on Bima Sugam and IRDAI's mis-selling work, mapped the ecosystem, designed three concepts, built flows, hi-fi screens, a coverage-shape visual and a prototype. |
| Key insight | People don't need more products. They need the limits in rupees, before they buy. |
| Status | Concept. No interviews or tests. Sample plans are fictional. Bima Sugam's live status is unclear in sources [VERIFY]. |

## Context
Bima Sugam is IRDAI's unified marketplace, run by a not-for-profit Section 8 company. Insurers pay a platform fee, reported at 5-7%, instead of agent commissions [VERIFY]. Bima Pehchaan gives one KYC and one dashboard of policies.
Sources disagree on rollout: one quotes IRDAI's chairman saying first products launch by end-September 2026; others describe motor, health and life going live from July. I treat live status as unknown.

## The real problem
I started with 'a comparison tool'. Comparison isn't the problem. Understanding is: sub-limits, co-pay and room-rent caps are learned at claim time.
One assumption I can't prove: that policy terms exist as structured data. Without it, summaries and the simulator need manual curation.

## Research (desk only)
I read news, IRDAI statements and trade coverage, scored a typical buying flow on Nielsen's ten heuristics (about 2.2 of 5, from typical patterns) and mapped ten parties.
No interviews. Personas are proto-personas. A 10-person plan is ready.

## Insights
- Mis-selling complaints are rising (26,667 for life insurers in FY25) [VERIFY].
- Removing agents removes explanation as well as commission.
- A single 'best policy' pick would look like advice and hide limits.

## Strategy and principles
Six principles: needs before products, not-covered first, open rules, honest trade-offs, minimum data, a person when it matters.

## Three concepts, one winner
A One-tap recommender. B Needs-first guide with open rules. C Human-assisted advisor.
B scored 33 of 35, C 26, A 14. A is opaque. C brings back the old conflict of interest, so it stays as a fallback.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| Not-covered card above the covered list | Benefits first | The policy looks less attractive at first glance |
| Open ranking rules, no sponsored items | Paid placement | No revenue from placement |
| Simulator shows what you pay | Show what the plan covers | A simulation can't predict every claim |
| 'Prefer not to say' as a real answer | Required health questions | Less personal ranking |
| Licensed advisor fallback | Chatbot only | Cost and availability |

## The solution
Answer five questions. See four plans under a banner that says no one pays to be higher. Read what each plan does NOT cover. Compare two plans in one sentence of trade-offs. Test a hospital stay and see what you'd pay. See your own gaps in a coverage shape, or book a licensed advisor.
_Figma frames: A4 Shortlist, B1 Not covered, B3 Simulator, C1 My cover_

## Before vs after
|  | Today | With Fineprint (target) |
|---|---|---|
| Starting point | Product list | Five needs questions |
| Learning limits | At claim time | Limits first |
| Trust in ranking | Unclear | Open rules |
| Help | Sales line | Licensed advisor, free |

## Edge cases
Empty, loading, a too-low budget, offline, a permission prompt and missing plan data are designed. When we don't have a plan's terms, we say so and never guess.
_Figma frames: S3 Error, S5 Permission, S6 Data missing_

## Accessibility
Contrast with the WCAG formula: white on green 9.38:1; gold highlights never carry white text (2.39:1). Status is glyph plus word plus colour. The coverage shape has a text alternative. Amounts use Indian grouping.

## Validation
Planned: six sessions, six tasks, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: 80% recall of limits, 6 of 6 testers say no one pays for ranking. North Star: buyers who can say what their policy does NOT cover 30 days after buying (to be measured).

## What I'd do next
- Run interviews and tests.
- Ask insurers and BSIF about structured terms and third-party access.
- Get a legal view on advice versus information.

## Reflection
I'd test the simulator first. 'You pay ₹52,000' teaches more in five seconds than any table.

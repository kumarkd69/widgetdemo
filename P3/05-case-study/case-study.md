# Mend: a calm companion for the first hour after a UPI scam

**A concept that gets a shaken person to the right first action in seconds, keeps one case across four systems and is honest about recovery. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | In the first hour after fraud, victims must work four unconnected systems with no single case, organised evidence, status or honest expectations. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read how 1930, NCRP, banks and the new Money Restoration Module work, mapped the ecosystem, designed three concepts, built flows, hi-fi screens, a helper view and a prototype. |
| Key insight | The refund clock in the brief often doesn't apply: scam victims usually authorise the payment. Honest expectations matter more than a countdown. |
| Status | Concept. No interviews or tests. Needs trauma-aware research first. |

## Context
Victims are told to call 1930 within the first hour, file on cybercrime.gov.in, tell their bank and go to police. These are separate channels. A Money Restoration Module and a Grievance Redressal Module became functional in April 2026 [VERIFY]. Government figures say over ₹11,158 crore was saved across 32.80 lakh complaints as of 30 June 2026 [VERIFY].
Reporting is faster now. Investigation and restoration lag, with no universal timeline.

## The real problem
I started with 'a zero-liability deadline clock'. That was wrong for most cases. RBI's 2017 rule limits liability for unauthorised transactions reported within 3 working days. In 'digital arrest' and collect-request scams the victim authorises the payment, so the clock may not apply [VERIFY].
One assumption I can't prove: that a shaken person will open an app in the first hour. I designed one big button and nothing else on Home.

## Research (desk only)
I read government material, the RBI circular and news coverage, scored today's reporting flow on Nielsen's ten heuristics (about 2.2 of 5, from typical patterns) and mapped ten parties.
No interviews. Personas are composites. Interviews need trauma-aware care: support contact, easy stop, no pressure.

## Insights
- Four channels give four reference numbers, and people lose them.
- Evidence is scattered, and nobody tells victims to keep it.
- False hope and despair both hurt. Honest, steady expectations help.

## Strategy and principles
Six principles: one thing at a time, honest hope, speed first, evidence by default, steady voice, shared not taken over.

## Three concepts, one winner
A Auto-pilot files and calls for you. B Guided first hour with a case river and evidence vault. C A human volunteer calls back.
B scored 32 of 35, C 25, A 21. A acts for a shaken person without a clear choice. C is costly and risky; it can come later through a partner.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| One big button on Home | Menu of options | No browsing on first open |
| Ask 'Did you approve it?' after saying it's not their fault | Show the refund clock to everyone | One extra screen, but honest |
| Golden-hour ring says 'Sooner is better. Later still helps.' | Hard countdown | Less urgency, less distress |
| Case river is manual | Wait for agency integration | More typing for the victim |
| Mend never files for the victim | Auto-file | Slower, but no wrong complaints |

## The solution
Tap 'I was scammed'. Call 1930 with a script. Save the number. Tell the bank with a ready message. File on the portal with facts pre-filled. Then follow one case river, keep evidence, and read an honest 'what to expect' card.
_Figma frames: A3 Call 1930, B1 Case river, B2 Evidence, A2 Triage_

## Before vs after
|  | Today | With Mend (target) |
|---|---|---|
| First step | Search online, call family | One big button |
| Case numbers | Scattered | One saved case |
| Evidence | Hunted for later | Checklist, auto-collect with permission |
| Status | Check four places | One river |
| Expectations | Hope or despair | Honest card, no promise |

## Edge cases
No case, loading, a wrong number, offline, a permission prompt and an overdue case are designed. Offline still lets you call 1930.
_Figma frames: S3 Error, S4 Offline, S6 Overdue_

## Accessibility
Contrast with the WCAG formula: white on primary 14.64:1; status colours at least 5.02:1; coral never under white text (2.80:1). Status is glyph plus word plus colour. Home button is 72 px high. Short, blame-free sentences. Hindi and Kannada drafted by me, needing native review.

## Validation
Planned: six careful sessions with a fictional scenario and a support contact, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: first action in under 10 seconds; 6 of 6 testers say a refund isn't guaranteed. North Star: share finishing the first-hour checklist within 60 minutes (to be measured).

## What I'd do next
- Run trauma-aware interviews with willing past victims.
- Ask I4C and a bank partner about links, numbers and status data.
- Legal review of liability wording.

## Reflection
I'd drop the countdown idea earlier. Calm and honest helped more than urgency.

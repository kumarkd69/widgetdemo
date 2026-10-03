# Rein: payment limits and a clear 'why' for AI agents on UPI

**A concept that lets people set a small mandate, see every agent payment with its reason, stop it in one tap and dispute it with evidence. Targets only: untested.**

## TL;DR
|  |  |
|---|---|
| Problem | People will let AI agents pay within limits they set, but can't see why, stop quickly, or get recourse when it's within limits and wrong. |
| My role | Lead designer. Research, strategy, UX, UI, plan. Solo, desk-based. |
| Timeline | October 2026, concept phase. |
| What I did | Read the public record on NPCI's Unified Agent Protocol, UPI Circle and Reserve Pay, mapped the ecosystem, designed three concepts, built flows, hi-fi screens, a bank console and a prototype. |
| Key insight | The model must never authorise. Owners need the request, the checks and a stop button, not the model's thoughts. |
| Status | Concept. No interviews or tests. UAP needs RBI approval and is not live [VERIFY]. |

## Context
NPCI is building a Unified Agent Protocol to register, verify and authorise AI agents on UPI. It builds on UPI Circle (full delegation up to ₹5,000 a payment and ₹15,000 a month) and Reserve Pay (about ₹10,000 over 90 days) [VERIFY]. A pilot with Claude, Zomato, Swiggy and Zepto began on 20 Feb 2026.
At GFF on 10 Sep 2026 NPCI's chairman said AI may recommend but authentication and settlement must follow deterministic, auditable rules. Liability is still under discussion.

## The real problem
I started with 'agent permissions'. The sharper problem is recourse: a payment can be inside the mandate and still be wrong.
One assumption I can't prove: that people will read a 'why' explanation. I kept it to three lines and test it in E3.

## Research (desk only)
I read the news and NPCI statements, scored today's delegation flows on Nielsen's ten heuristics (about 2.3 of 5, from typical patterns) and mapped ten parties in the ecosystem.
No interviews yet. Personas are proto-personas. A 10-person plan is ready.

## Insights
- Limits already exist (Circle, Reserve Pay). Visibility, why and recourse do not.
- A hold should be rare and quick, or people approve blindly.
- A bank officer needs mandate, request, checks and timeline in one view.

## Strategy and principles
Six principles: limits before trust, short why, the model never authorises, one tap to stop, quiet by default, family-safe.

## Three concepts, one winner
A Autopilot with silent holds. B Envelope, feed and quick hold. C Family co-pilot approving every payment above ₹500.
B scored 33 of 35, C 25, A 22. A tells owners too late. C creates approval fatigue and makes a helper the bottleneck.

## Key decisions
| Decision | Alternatives | Trade-off accepted |
|---|---|---|
| Why card shows request + checks | Full reasoning transcript | Less insight into the agent, more clarity for the owner |
| Small default mandate (₹1,000 / ₹5,000) | Wide default | Extra steps to raise limits |
| Hold inside the agent chat | Push notification only | Needs agent providers to support it |
| Pause first, revoke second | One 'stop' button | Two choices, but pause is reversible |
| Equal Approve once / Block | Highlight Approve | Slower decisions, fewer blind approvals |

## The solution
Pick a verified agent. Set a mandate with a worst case shown in rupees. Watch the mandate envelope fill as the agent pays. Open any payment to see why. Unusual payments are held in the chat. Pause in one tap. Dispute with an evidence pack.
_Figma frames: A3 Review mandate, B1 Activity, B2 Why card, B3 Held in chat_

## Before vs after
|  | Today | With Rein (target) |
|---|---|---|
| See what the agent paid | Bank SMS, no agent label | Live feed by agent |
| Know why | Not available | Why card, 1 tap |
| Stop it | Unclear | Pause in 1 tap |
| Dispute inside limits | Manual evidence | 3 steps with evidence pack |

## Edge cases
Empty, loading, wrong PIN, offline and declined are designed. Offline queues Pause and says so.
_Figma frames: S3 Error, S4 Offline, S6 Declined_

## Accessibility
Contrast with the WCAG formula: white on primary 9.51:1; status colours at least 5.02:1; amber is never used under white text (2.08:1). Status is glyph plus word plus colour. Envelope segments are labelled with amounts.

## Validation
Planned: six sessions, six tasks, SUS target 80+ (to be measured). Nothing tested yet.

## Impact
No results yet. Targets: mandate set in under 2 minutes, pause under 10 seconds, 90% can say their maximum monthly loss. North Star: share of agent payments marked 'expected' (to be measured).

## What I'd do next
- Run interviews and tests.
- Ask a bank partner about a dispute reason code for agent payments.
- Pilot with one agent provider once UAP is clear.

## Reflection
I'd show the envelope earlier. People understand 'you can lose at most this' faster than any permission list.

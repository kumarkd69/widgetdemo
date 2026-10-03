# Taala: one way to prove it's you, across five financial products

**Concept project.** Orbit Financial is fictional. Research so far is desk research; interviews and an app audit are planned, not done. Every claim links to a file in this repo.

**Outcome in one line:** I designed a risk-based authentication system and migration plan that moves a five-product financial group off SMS OTP as the default, while staying inside the RBI's 2025 authentication rules.

## TL;DR
- **Problem:** Each product built its own login and payment checks. Six OTP screens, three PIN designs, no shared fallback. SMS OTP did the heavy lifting: legal, but easy to phish and useless abroad.
- **My role:** Designer of record — research, strategy, policy, design system, migration plan. Solo concept, Oct 2026.
- **What I did:** Read the rules, wrote a risk-to-auth decision matrix (32 rows), a fallback ladder where every path ends with a person, a 17-component design system with a signature Trust Meter, screens across five products in three languages, and a phased migration with metrics.
- **Key insight:** Consistency is a security feature. If there are six real OTP screens, a seventh fake one blends in.

## Context
On 25 September 2025 the RBI issued the Authentication Mechanisms for Digital Payment Transactions Directions, 2025, effective 1 April 2026 ([notes](../research/regulation/rbi-directions-notes.md)). Two factors per payment (¶6), one of them dynamic for anything other than card-present (¶6). SMS OTP stays valid (¶5(f)). Issuers may add risk-based checks (¶8). Card issuers must validate extra authentication on cross-border online payments when the overseas merchant asks, by 1 October 2026. *Paragraph numbers not quoted by a source are still being checked against the primary text.*

The rule is a floor. It says what's required, not how it should feel.

## The problem inside the organisation
Orbit met the rule — mostly with SMS OTP. The brief described six OTP patterns, three PIN designs, two biometric prompts and no shared risk logic ([scenario](../research/audit/inconsistencies.md)). That meant:
- Same risk, different friction per product.
- Compliance chased screenshots from five teams.
- Users couldn't learn what a real screen looks like.
I then ran a desk audit of five real apps from their public help pages (Bank A, UPI app B, Card C, Wallet D, Broker E). It found the same pattern in the wild: SMS OTP still the default for online card payments, PIN lengths that change with the bank, PIN resets that need only card details and an SMS code, and a 24-hour lockout after three wrong UPI PINs ([audit](../research/audit/inconsistencies.md)).

## Research
- **Desk research:** regulation, NPCI biometric rules, `.bank.in` domain rule, and a desk audit of 5 real apps from public sources (12 findings, each linked).
- **Proto-personas:** Meena, Arjun, Imran, Priya, two accessibility users, and four internal users ([personas](../research/synthesis/personas.md)).
- **Not yet done:** hands-on app walkthroughs, interviews and usability tests. I wrote the plan: 12 participants, Kannada and Hindi sessions, screen-reader users ([plan](../research/synthesis/research-plan.md)).

## Insights
1. **The rule is a floor, not a design.** Extra checks are allowed (¶8) but nobody has to explain them. → Every step-up gets one plain sentence.
2. **OTP is legal but is the weakest link we control.** It fails for NRIs with their Indian SIM off and is phishable. → Device-bound keys by default; OTP as fallback.
3. **Consistency is a security feature.** → Same risk, same pattern, across all products.

## Strategy
**Bet:** one policy engine, one set of components, one vocabulary ([scope](../strategy/scope.md)).
**Principles:** Risk decides friction · Same risk, same pattern · Never a dead end · Phishing-resistant by default · Explain, don't scare · Inclusive by default ([principles](../strategy/principles.md)).
**Non-goals:** we don't build the fraud model or remove OTP.

## The decision matrix
Four tiers — Low, Medium, High, Blocked — plus logged exemptions ([matrix](../strategy/decision-matrix.md)). Every row meets two categories with one dynamic factor. Bands and cooling periods are labelled as Orbit policy, not regulation.
**Worked example:** Arjun sends ₹2,00,000 to a new payee at 11:04 PM. High tier: passkey + password + approve on his phone. ₹50,000 goes now; the rest after 24 hours or after a short video call. He's told this when he adds the payee, not when it fails.

## Fallbacks: never a dead end
Meena's fingerprint fails twice at the kirana counter. Today she'd see "Authentication failed". In Taala the same sheet offers "Use UPI PIN" and she's done ([ladder](../strategy/fallback-ladder.md)). After a lockout, the card always shows an end time and a person to talk to. High-risk recovery never relies on OTP alone.

## The design system
- **Trust Meter:** lock + 4 segments + label + reason. Never colour alone.
- **17 components**, one Auth Sheet that hosts every factor so fallbacks never change screens.
- **Three languages** (English, Hindi, Kannada), drafts flagged for native review.
- **WCAG 2.2 AA:** 48dp targets, timers with "Need more time?", PIN digits never read aloud.

## Migration
Five phases: Foundations → Pilot (UPI, small payments, 5%) → Dual-run → Default switch per product → Long tail → Deprecate ([plan](../migration/migration-plan.md)). Enrolment happens after a successful payment, never as a gate at login. An Auth Council governs changes through RFCs ([governance](../migration/governance.md)).

## Validation
Not run yet. Planned: moderated tests of 5 tasks with 12 participants; A/B of step-up with and without explanation (H1).

## Impact (all targets)
First-attempt success ≥ 95% at Low tier; OTP share of dynamic factors < 30% after default switch; −20% auth support tickets ([metrics](../migration/metrics.md)).

## Reflection
- I'd run the audit and five interviews before writing the matrix; some bands are educated guesses.
- The hardest problems aren't screens: whether a device key + biometric counts as two factors is a compliance call I can only frame.
- Next: shared-phone profiles for small merchants, and more Indian languages.

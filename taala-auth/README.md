# Taala — Unified Authentication for Indian Digital Payments

Taala (ತಾಳ / ताला, "lock") is a concept project. It designs one risk-based way to authenticate users across every product of a fictional Indian financial group, Orbit Financial: bank app and net banking, UPI, cards, wallet and stockbroking.

It responds to the RBI's Authentication Mechanisms for Digital Payment Transactions Directions, 2025 [VERIFY dates and paragraphs in Phase 1], and plans the move off OTP-only authentication. SMS OTP stays as a valid fallback; it stops being the default.

**Status:** concept. Desk research only until real interview notes are added to `research/interviews/`. Designer of record: Kumar.

## Folder map

| Folder | What's in it | Phase |
|---|---|---|
| `CLAUDE.md` | Project brief and rules. Read first. | — |
| `PLAN.md` | Phases, deliverables, acceptance criteria, inputs needed | 0 |
| `DECISIONS.md` | Log of design decisions (ADR format) | all |
| `research/regulation/` | RBI notes by paragraph; rule-to-requirement table | 1 |
| `research/audit/` | Kumar's screenshots of 5 app types; audit matrix; inconsistencies | 2 |
| `research/interviews/` | Real interview notes (Kumar adds) | 3+ |
| `research/synthesis/` | Hypotheses, proto-personas, journeys, insights, research plan | 3 |
| `strategy/` | Principles, scope, risk-to-auth decision matrix, fallback ladder | 4–5 |
| `design-system/` | Tokens, components, patterns, content, accessibility, adoption guide | 6 |
| `migration/` | Migration plan, rollout timeline, governance, metrics | 7 |
| `handoff/` | Component specs, policy engine API contract, open questions | 8 |
| `case-study/` | Portfolio case study, captions, interview Q&A | 9 |
| `figma/` | `figma-log.md`: file key, page and node IDs | 6+ |

## Ground rules
- Every RBI claim cites a paragraph and an rbi.org.in URL. Unverified items are tagged [VERIFY].
- Real apps are anonymised (Bank A, UPI app B, Card C, Wallet D, Broker E) in anything portfolio-facing.
- Numbers are sourced, or labelled "target" or "estimate".

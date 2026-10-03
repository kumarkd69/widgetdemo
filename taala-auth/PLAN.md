# Plan

Nine phases after this kickoff. I stop after each one; Kumar reviews and decides before the next starts. Phase 6 stops after each of its five parts.

Legend for "Needs from Kumar": **Input** = material only you can supply. **Decision** = a call that changes what I build.

---

## Phase 0 — Kickoff (this phase)
**Deliverables:** folder structure, `README.md`, `PLAN.md`, `DECISIONS.md` (template + ADR-001), `figma/figma-log.md`, list of weak assumptions (below).
**Acceptance:** structure matches CLAUDE.md; plan reviewed.
**Needs from Kumar:** answers to the decisions at the end of this file.

## Phase 1 — Regulation
**Deliverables:** `research/regulation/rbi-directions-notes.md`, `research/regulation/rule-to-requirement.md` (15–25 rows), CLAUDE.md regulatory section marked Confirmed / Corrected / Not found, "What the rules do NOT say".
**Acceptance:**
- Every claim cites a paragraph number and an rbi.org.in URL. No claim rests on news alone.
- Exemptions copied exactly from the text, with limits.
- Nothing says OTP is banned.
- Anything I can't open on rbi.org.in is tagged [VERIFY], not guessed.
**Needs from Kumar:** nothing to start. If rbi.org.in blocks my fetch, a PDF of the Directions and FAQs dropped into `research/regulation/`.

## Phase 2 — Competitive audit
**Deliverables:** `research/audit/audit-matrix.md`, `research/audit/inconsistencies.md` (10–15 items), heuristic scores per app (10 Nielsen + 3 security, 1–5).
**Acceptance:**
- Every finding cites a screenshot file name.
- Empty folders are reported and skipped, never filled with guesses.
- Apps anonymised as Bank A, UPI app B, Card C, Wallet D, Broker E.
**Needs from Kumar:** **Input** — screenshots in `research/audit/screenshots/{bank,upi,card,wallet,broker}/`. Name them by moment, e.g. `03-payment-step-up.png`. Cover: first login, device binding, unlock, payment, add beneficiary, high value, PIN/device change, failed attempt, lockout, recovery. Blur account numbers, names and balances first. A short note per app on what you did to reach each screen helps me estimate steps and time.

## Phase 3 — Synthesis
**Deliverables:** `hypotheses.md` (8–10), `personas.md` (9 proto-personas), `journeys.md` (3 journeys), `insights.md` (6–8 with HMWs), research plan (12 participants, discussion guide, usability test plan, consent notes).
**Acceptance:** without interview notes, everything is labelled hypothesis or proto-persona. Every insight cites an audit file, an RBI paragraph or an interview note.
**Needs from Kumar:** **Input** — any real interview notes in `research/interviews/`. Optional but it changes how honest the case study can be.

## Phase 4 — Strategy and decision matrix
**Deliverables:** `strategy/principles.md`, `strategy/scope.md`, `strategy/decision-matrix.md` + `.csv` (tier summary, ≥25 rows, 10 worked examples, RBI mapping, tunable vs fixed), ADRs.
**Acceptance:** every row meets two factors with at least one dynamic factor, unless it cites a listed exemption. Amount bands are justified.
**Needs from Kumar:** **Decision** — amount bands and the new-beneficiary cooling period (I'll propose; you choose).

## Phase 5 — Fallback flows
**Deliverables:** `strategy/fallback-ladder.md` with Mermaid flows per factor, special cases, message table in English / Hindi / Kannada, recovery security rules.
**Acceptance:** no path ends in a dead end; last step is always a human or assisted route. High-risk recovery never relies on OTP alone. Hindi and Kannada tagged [VERIFY with native speaker].
**Needs from Kumar:** **Input** — a native Hindi and Kannada reviewer (you, or someone you name).

## Phase 6 — Design system and Figma (5 parts, stop after each)
- **A. Spec files:** `tokens.json`, `components.md` (17 components), `patterns.md` (7), `content-guidelines.md`, `a11y.md`, `adoption-guide.md`.
- **B. Figma foundations + components:** all pages, Cover, Read me, Foundations, every component as a variant set bound to variables, Do/Don't panels.
- **C. Story + Flows & Policy:** story boards; decision matrix exhibit; fallback flowcharts; 1440 Policy console.
- **D. Product screens:** Bank, UPI, Cards, Wallet, Invest, Net banking (1440). Key screens in Hindi and Kannada.
- **E. States & Fallbacks:** every failure, lockout, cooldown, recovery, offline and a11y state from Phase 5.

**Acceptance:** no hardcoded hex; contrast passes WCAG 2.2 AA; status never by colour alone; no clipped text in any of the 3 scripts; same tier = same pattern across products; screenshots checked after each step; `figma-log.md` updated.
**Needs from Kumar:** **Decision** — which Figma team and plan (see below). **Decision** — final palette and type after Part A.

## Phase 7 — Migration plan
**Deliverables:** `migration-plan.md`, `rollout-timeline.md` (Mermaid Gantt), `governance.md`, `metrics.md`; Figma page 11.
**Acceptance:** baselines say "to be measured"; targets say "target"; each metric has an event name; each phase has entry and exit criteria.
**Needs from Kumar:** **Decision** — which product pilots first (I'll recommend UPI low-value per the brief).

## Phase 8 — Handoff
**Deliverables:** `api-contract.md`, `specs.md`, `open-questions.md` with owners; Figma page 12 with redlines.
**Acceptance:** every API field has a UI use; every [VERIFY] left in the repo appears in open questions.

## Phase 9 — Case study
**Deliverables:** `case-study.md`, `captions.md`, `interview-qna.md` (12 questions), Figma page 13 built from instances, 60-second pitch, 10-minute outline.
**Acceptance:** first person as Kumar; concept status stated; desk research vs interviews stated honestly; every claim cites a repo file or source.
**Needs from Kumar:** **Input** — your real role, timeline and anything you'd change in the voice.

---

## Weak or risky assumptions in CLAUDE.md

1. **UPI auth isn't ours to redesign.** UPI PIN capture runs through NPCI's common library, and the PIN is mandated by NPCI rules, not just RBI. Orbit can't swap the UPI PIN for a passkey. NPCI has been adding biometric options for UPI [VERIFY current NPCI circulars]. Taala should wrap UPI (trust meter, explanation, fallback) but treat the PIN step as fixed. This shapes the decision matrix.
2. **Card CNP auth runs through 3-D Secure.** The challenge is hosted by the issuer's ACS, often a vendor, inside a merchant's checkout. Orbit controls the ACS challenge UI and app-based approval, not the merchant page. "Same pattern as UPI" is only partly reachable here.
3. **Stockbroking is SEBI, not RBI.** Order placement auth falls under SEBI/exchange rules (e.g. 2FA for trading login) [VERIFY]. Only the bank-to-broker funds transfer is a payment under the RBI Directions. Orbit Invest also has to be a separate legal entity. I'll scope Invest as "same pattern, different regulator".
4. **"Passkeys are device-bound" is often false.** Most Android and iOS passkeys sync across devices via the platform account. Whether a synced passkey counts as a possession or dynamic factor under the Directions is unclear [VERIFY]. A device-bound key (in-app keystore + signed challenge) may be the safer default, with passkeys for net banking.
5. **The timeline has already passed.** Today is 2 Oct 2026. The Directions took effect 1 April 2026 and the cross-border CNP date was 1 Oct 2026 [VERIFY both]. **Resolved (ADR-002):** the story is set after April 2026 — Orbit meets the minimum with OTP; Taala moves it to better factors.
6. **Exemptions and amount bands.** Small-value, e-mandate and offline limits come from separate RBI/NPCI circulars and change often. I won't use any limit I can't cite.
7. **Cooling periods on new beneficiaries** are common bank practice, not (as far as I know) an RBI rule in these Directions. They'll be an Orbit policy choice, labelled as such.
8. **".bank.in"** — RBI's domain circular came out in 2025 with a deadline later that year [VERIFY]. Net banking screens can show it, but the domain is a trust cue, not an auth factor.
9. **DPDP.** The Act is from 2023; the Rules were notified later [VERIFY date]. Biometric templates should stay on device; Taala never stores them. Consent copy will need a legal check.
10. **"Orbit Financial" may clash** with existing Indian fintech names. I'll check in Phase 1; have a backup ready (e.g. "Kaveri Financial").
11. **The internal problem is invented.** "Six OTP patterns, three PINs" is a scenario. In the case study it must read as a fictional brief backed by the real-app audit, not as Orbit research.
12. **Personas are made up.** Meena, Arjun, Imran and Priya are reasonable but unvalidated. Without interviews, the case study should say so, and the research plan becomes a key exhibit.
13. **Shared phones and dual SIM** (Imran) clash with device binding, which ties one user to one device and SIM. This needs an explicit design answer, not a footnote.
14. **Figma quota. Resolved (ADR-003):** using the shared Starter file; the Pro team refused file creation (guest seat). All teams where you have full seats are Starter. Starter has tight MCP limits and one variable mode, so no light/dark or language modes. The build in Phase 6 is large (17 components, ~40 screens, 3 scripts). See decision 1.
15. **Hindi and Kannada copy** written by me will be unidiomatic in places. It needs a native reviewer before it reaches screens.

## Figma deliverables per phase (ADR-003: whole project in Figma)
| Phase | Figma page | Boards |
|---|---|---|
| 1 | 01 Story | RBI rules board: key paragraphs, rule-to-requirement summary, "what the rules don't say" |
| 2 | 01 Story | Audit board: anonymised findings, inconsistency cards, heuristic score chart |
| 3 | 01 Story | Personas, 3 journey maps, insights + HMWs, hypotheses |
| 4 | 01 Story, 05 Flows & Policy | Principles, scope, tier summary, decision matrix exhibit, worked examples |
| 5 | 05 Flows & Policy | Fallback ladder flowcharts, message table |
| 6 | Cover → 10 | Foundations, components, patterns, screens, states |
| 7 | 11 Migration | Roadmap, metrics tree, exec summary |
| 8 | 12 Handoff | Specs, redlines |
| 9 | 13 Case study | 1440 long-form case study from instances |

To keep the research boards consistent with the later system, I'll build a small set of foundations (colours, type) on 02 Foundations at the start of Phase 1, then expand it in Phase 6.

## Decisions (answered 2 Oct 2026)
1. Figma: shared file `neC2nH6A7j7ZFyPBDh9N7H`, all 15 pages created. Pro team refused file creation.
2. Repo: `taala-auth/` in `widgetdemo` for now.
3. Timeline: after April 2026.
4. Screenshots: still needed before Phase 2.

## Status (3 Oct 2026)
| Phase | Repo | Figma |
|---|---|---|
| 1 Regulation | Done; primary text blocked by network → [VERIFY ¶] tags | 01 Story · Context |
| 2 Audit | Blocked: no screenshots. Frame + checklist ready | 01 Story · Problem (scenario) |
| 3 Synthesis | Done as hypotheses / proto-personas + research plan | 01 Story |
| 4 Strategy | Done (32-row matrix) | 05 Flows & Policy |
| 5 Fallbacks | Done | 05 Flows & Policy |
| 6 Design system | Done | 02–10 |
| 7 Migration | Done | 11 Migration |
| 8 Handoff | Done | 12 Handoff |
| 9 Case study | Done (concept status stated) | 13 Case study |

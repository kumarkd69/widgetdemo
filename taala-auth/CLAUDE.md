# Project: Taala — Unified Authentication for Indian Digital Payments

## Your role
You are a design-led product team in one: a principal product designer, a UX researcher, a payments product manager and a design-systems lead, working the way a platform team at Google, Microsoft or a top Indian fintech would. You produce research, strategy, a design system, Figma screens, a migration plan and a portfolio case study. Your work must read as senior, evidence-based and human, never generic or "AI-template".

The human (Kumar, Senior UI/UX Designer, 5+ years in fintech, insurance, mobility and media) is the designer of record. You draft; he reviews and decides. Stop at the end of every phase and wait for review.

## The project in one line
Design "Taala" (Hindi/Kannada for "lock"), a unified authentication system for a fictional Indian financial group, so that every product (bank app, UPI, cards, wallet, stockbroking) authenticates users in one consistent, risk-based way that complies with the RBI's new authentication directions, and migrate them off OTP-only authentication.

## Fictional organisation (never use real brands as "our" company)
- Group: "Orbit Financial" (fictional; confirm no Indian financial brand uses this name before final use, rename if it does).
- Products: Orbit Bank (mobile + net banking), Orbit UPI, Orbit Cards (credit/debit), Orbit Wallet (PPI), Orbit Invest (stockbroking).
- Problem inside the org: each product team built its own auth. Six patterns for OTP, three PIN designs, two biometric prompts, no shared fallback logic, no shared risk engine contract.

## Regulatory context (checked in Phase 1 — see research/regulation/rbi-directions-notes.md)
Primary source: Reserve Bank of India (Authentication Mechanisms for Digital Payment Transactions) Directions, 2025 (RBI/2025-26/79), issued 25 September 2025: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0
Status key: **Confirmed** = matches RBI page text seen via search index, with paragraph; **Confirmed (no ¶)** = consistent across RBI index + secondary sources, paragraph not confirmed; **Corrected** = brief was wrong or imprecise; **Not found**. The primary text could not be opened in this environment (network policy). Re-check all items before publishing.
- Effective 1 April 2026 for payment system providers and participants (banks and non-banks). — Confirmed (no ¶)
- At least two distinct factors: has, knows, is. — Confirmed, ¶6 and ¶5(f)
- For non-card-present payments, one factor is dynamically created or proven (proof of possession unique to the transaction). — Confirmed, ¶6
- SMS OTP is not discontinued; it is listed as a valid factor. — Confirmed, ¶5(f)
- Alternatives encouraged. — Corrected: sources name biometrics (device-native or Aadhaar), software tokens, device-based tokens, cryptographic credentials. "Passkeys" by name: Not found.
- Risk-based checks beyond the two-factor minimum. — Confirmed, ¶8
- Interoperability and open access (incl. tokenisation for all token requestors). — Confirmed (no ¶)
- Issuer ensures robustness and integrity before deployment; compensates the customer in full for losses from non-compliant transactions. — Corrected: compensation is tied to non-compliance, not all fraud. (no ¶)
- Cross-border CNP: by 1 October 2026, card issuers validate AFA on non-recurring cross-border CNP when the overseas merchant or acquirer requests it. — Confirmed (no ¶)
- DPDP Act, 2023 compliance. — Confirmed (no ¶)
- Exemptions: small-value contactless card-present (≤ ₹5,000 reported), recurring e-mandate after the first, PPI-MTS and gift PPIs, NETC, small-value offline, GDS/IATA travel on corporate cards. — Confirmed (no ¶); limits [VERIFY]
- Factors must be independent: compromise of one must not affect the other. — Added (no ¶)
Related: `.bank.in` circular RBI/2025-26/28, 22 Apr 2025, migration by 31 Oct 2025 — Confirmed by two reports. NPCI on-device biometric for UPI from 8 Oct 2025, cap ₹5,000 (reported ₹10,000 from Jul 2026) — [VERIFY].

## Users
External (end customers):
1. Meena, 58, retired teacher in Dharwad, uses UPI for groceries, nervous about fraud, mid-range Android, sometimes no data signal.
2. Arjun, 29, software engineer in Bengaluru, heavy UPI + credit card + trading user, hates friction, uses passkeys elsewhere.
3. Imran, 41, small shop owner in Hubballi, receives and pays via UPI all day, shares a phone with family, dual SIM.
4. Priya, 34, NRI in Dubai, uses Indian cards for cross-border online purchases, Indian SIM often off.
5. Accessibility: a low-vision user who relies on TalkBack; a user whose fingerprint doesn't register reliably (manual labour).
Internal (platform customers):
6. Product engineer on a product team who must adopt Taala.
7. Fraud/risk analyst who tunes risk rules.
8. Compliance officer who must prove RBI compliance.
9. Customer support agent handling lockouts.

## Core deliverables
1. Regulation brief with a rule-to-design-requirement table.
2. Competitive audit of 5 app types (bank, UPI, card, wallet, broker) with an inconsistency report.
3. Personas, journey maps, insights and principles.
4. Risk-to-authentication decision matrix (the policy engine contract).
5. Fallback flows: what happens when each factor fails, including lockout and assisted recovery.
6. Taala design system: tokens, components, patterns, content guidelines, accessibility rules, adoption guidelines.
7. Figma file with full structure: Cover, Read me, Story, Foundations, Components, Patterns, Flows, Screens per product, States, Migration, Handoff, Case study.
8. Migration plan: OTP-only to Taala, with phases, team rollout, governance and metrics.
9. Portfolio case study.

## Design principles (draft; refine after research)
1. Risk decides friction: low-risk payments feel instant; high-risk ones explain why they need more.
2. Same moment, same pattern: a UPI payment and a card payment of the same risk look and feel the same.
3. Never a dead end: every failed factor has a next option, and the last option is a human.
4. Phishing-resistant by default: prefer device-bound and passkey factors; OTP is a fallback, not the default.
5. Explain, don't scare: one plain sentence on why a check is needed, in the user's language.
6. Inclusive by design: works without biometrics, on low-end phones, offline-tolerant, screen-reader complete, in English, Hindi and Kannada at minimum.

## Repo structure
All project files live in `taala-auth/` inside this repo (the repo root is an unrelated Flutter demo).
/research/regulation      rbi-directions-notes.md, rule-to-requirement.md
/research/audit           screenshots/ (provided by Kumar), audit-matrix.md, inconsistencies.md
/research/interviews      real interview notes (provided by Kumar)
/research/synthesis       personas.md, journeys.md, insights.md, hypotheses.md
/strategy                 principles.md, decision-matrix.md (+ .csv), fallback-ladder.md, scope.md
/design-system            tokens.json, components.md, patterns.md, content-guidelines.md, a11y.md, adoption-guide.md
/migration                migration-plan.md, rollout-timeline.md, metrics.md, governance.md
/handoff                  specs.md, api-contract.md (policy engine request/response), open-questions.md
/case-study               case-study.md, captions.md, interview-qna.md
/figma                    figma-log.md (file key, page and node IDs, what was built)
DECISIONS.md              Architecture-decision-record style log of every major design decision

## Figma build rules
- Target file: https://www.figma.com/design/neC2nH6A7j7ZFyPBDh9N7H/rbi (file key `neC2nH6A7j7ZFyPBDh9N7H`). See /figma/figma-log.md.
- Use the Figma MCP tools. Load the figma-use skill before any write. Build foundations (variables, text styles) before components, components before screens.
- Pages: Cover, Read me, 01 Story, 02 Foundations, 03 Components, 04 Patterns, 05 Flows & Policy, 06 Screens · Bank, 07 Screens · UPI, 08 Screens · Cards & Cross-border, 09 Screens · Wallet & Invest, 10 States & Fallbacks, 11 Migration, 12 Handoff, 13 Case study.
- Mobile-first: 390x844 frames for apps, 1440 for net banking and the internal admin/policy console.
- Auto layout everywhere. Bind colours, spacing and radius to variables. Never hardcode hex in screens.
- After each build step, screenshot, check for clipping, overlap, contrast and logic errors, and fix before moving on.
- Log every file key, page ID and component ID in /figma/figma-log.md so work can resume across sessions.

## Visual direction
- Calm, trustworthy, distinctive. Not a generic bank blue. Suggested: deep indigo base, a warm saffron accent for attention, a mint green for success, with a clear risk colour scale (Low / Medium / High / Blocked) that never relies on colour alone.
- Typography: Inter or a similar humanist sans for Latin; Noto Sans Devanagari and Noto Sans Kannada (or Anek) for Indic scripts. Test every component in all three languages.
- Signature element: a "trust meter" or lock motif that shows the current risk level and why, used consistently across products.
- Use original vector illustrations only. No stock photos of real people, no real bank or app logos in our designs. Audit screenshots of real apps stay in research and are anonymised ("Bank A", "UPI app B") in the case study.

## Writing rules
- Plain English, short sentences, no buzzwords (no "seamless", "delightful", "leverage", "robust", "cutting-edge").
- Every number has a source or is labelled "target" or "estimate".
- Research you didn't do is never presented as done. Desk research is labelled desk research. Interview findings are only written after Kumar provides real notes.
- INR with Indian grouping (₹1,25,000). Times like 9:42 PM.

## Definition of done for every phase
- Files written in the right folder, with sources.
- A short summary in chat: what was made, what's [VERIFY], what needs Kumar's decision.
- STOP and wait for review.

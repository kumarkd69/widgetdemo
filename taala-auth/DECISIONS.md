# Decisions

One entry per major design decision. Newest at the bottom. Status is one of: Proposed, Accepted, Superseded by ADR-NNN, Rejected.

---

## ADR template

### ADR-NNN: <short title>
- **Date:** YYYY-MM-DD
- **Status:** Proposed
- **Phase:** <phase number>
- **Owner:** Kumar

**Context**
What problem or question forced this decision. Cite evidence (RBI paragraph, audit file, interview note).

**Options**
1. Option A — pros / cons
2. Option B — pros / cons
3. Option C — pros / cons

**Decision**
What we chose, in one or two sentences.

**Consequences**
What gets easier, what gets harder, what we now have to do, what we can't do any more.

---

## ADR-001: Keep the project in a sub-folder of the existing repo
- **Date:** 2026-10-02
- **Status:** Proposed
- **Phase:** 0
- **Owner:** Kumar

**Context**
The working repo (`widgetdemo`) is an unrelated Flutter widget demo. The brief asks for an empty project folder.

**Options**
1. Put Taala in `taala-auth/` inside this repo — keeps one branch, no new repo; mixes two projects.
2. Move Taala to its own repo — clean history, better for a portfolio link; needs a new repo created by Kumar.

**Decision**
Option 1 for now. Move to its own repo before the case study goes public.

**Consequences**
All paths in CLAUDE.md are relative to `taala-auth/`. The Flutter files are untouched.

---

## ADR-002: Set the story after 1 April 2026
- **Date:** 2026-10-02
- **Status:** Accepted
- **Phase:** 0
- **Owner:** Kumar

**Context**
The RBI Directions took effect on 1 April 2026 [VERIFY in Phase 1]. Today is 2 Oct 2026.

**Options**
1. Backdate the story to before April 2026 — a deadline race; reads less honest given today's date.
2. Set it after April 2026 — Orbit meets the minimum two-factor rule mostly with SMS OTP; Taala moves it to phishing-resistant factors and one shared pattern.

**Decision**
Option 2.

**Consequences**
The case study's problem is "compliant on paper, fragmented and phishing-prone in practice", not "non-compliant". The cross-border CNP rule (1 Oct 2026 [VERIFY]) is a live, current requirement in the story. Migration plan starts from a compliant OTP baseline.

---

## ADR-003: Build everything in the shared Figma file; Figma is the main deliverable
- **Date:** 2026-10-02
- **Status:** Accepted
- **Phase:** 0
- **Owner:** Kumar

**Context**
Kumar wants the whole project in Figma for a portfolio case study. Creating a file on the Pro team ("Design Lab") failed: guest seat, no permission. Other full-seat teams are Starter.

**Options**
1. Use the shared file `neC2nH6A7j7ZFyPBDh9N7H` (Starter) — works now; one variable mode only; MCP rate limits may pause the build.
2. Wait for a Pro team — more modes and quota; blocks progress.

**Decision**
Option 1. Every phase also produces Figma boards, not only Phase 6+. Markdown in this repo stays as the source of truth for text and citations; Figma is the presentation.

**Consequences**
- One variable mode: no light/dark or per-language modes. Languages are shown as separate frames; dark mode is out of scope.
- If MCP quota runs out mid-build, work pauses and resumes from `figma/figma-log.md`.
- Moving to Pro later is a file move, not a rebuild.

---

## ADR-004: Device-bound key is the default dynamic factor in apps; passkey on web
- **Date:** 2026-10-02 · **Status:** Accepted · **Phase:** 4 · **Owner:** Kumar

**Context** ¶6 needs a dynamic factor for non-card-present payments. SMS OTP qualifies (¶5(f)) but is phishable and fails abroad (I2, I6). Synced passkeys may not count as proof of possession of a specific device [VERIFY].

**Options** 1. SMS OTP default — familiar; phishable; SIM-dependent. 2. Synced passkey everywhere — phishing-resistant; possession of the device unclear; uneven on Android Go. 3. Device-bound key in secure hardware for apps, passkey for net banking — phishing-resistant, transaction-bound signature, works offline-ish; needs device binding.

**Decision** Option 3.

**Consequences** Device binding becomes a core flow. Net banking needs a second possession path (push to phone) for High tier. Compliance must accept DK signature as the dynamic factor.

---

## ADR-005: OTP stays, as fallback only
- **Date:** 2026-10-02 · **Status:** Accepted · **Phase:** 4

**Context** OTP is valid (¶5(f)) and universal; removing it strands users without a bound device.

**Decision** OTP is never the default where DK/PK works. It's offered as fallback in Low and Medium, always with "never share" copy, and never alone.

**Consequences** OTP share of dynamic factors becomes a headline metric. SMS cost falls gradually (estimate).

---

## ADR-006: No OTP-only path for High-risk changes or recovery
- **Date:** 2026-10-02 · **Status:** Accepted · **Phase:** 4–5

**Context** Factor independence (R6): if SMS can both reset the PIN and deliver the dynamic factor, a SIM swap defeats both.

**Decision** High tier and recovery require DK, or assisted verification. OTP may be one of several factors there, never the only one besides knowledge.

**Consequences** Some users will need video KYC or a branch. Support needs capacity (migration risks).

---

## ADR-007: Four tiers plus Exempt, three categories at High
- **Date:** 2026-10-02 · **Status:** Accepted · **Phase:** 4

**Context** ¶8 allows risk-based checks above the floor. Too many tiers confuse users and analysts.

**Decision** Low, Medium, High, Blocked, plus Exempt (logged). High = has + knows + is.

**Consequences** Trust Meter has four visible states. Risk can tune inputs but not invent tiers without an RFC.

---

## ADR-008: Cooling periods are Orbit policy and are said upfront
- **Date:** 2026-10-02 · **Status:** Accepted · **Phase:** 4

**Context** No RBI rule on cooling found (R23). Users discover limits only on failure.

**Decision** New-payee cap ₹50,000 (net banking) / ₹25,000 (UPI) in the first 24 h; shown when adding the payee; releasable via assisted path. Values are tunable.

**Consequences** Arjun's journey includes a hold; the assisted release path must exist on day one.

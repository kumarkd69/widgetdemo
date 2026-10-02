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

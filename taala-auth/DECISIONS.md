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

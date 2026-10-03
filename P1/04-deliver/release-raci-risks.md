# P1 Rein · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: badge, holds, evidence pack|Release 2: templates, family view, bank console|
| Research |10 interviews, 6 usability sessions|Pilot with one agent provider and one bank|Hold-fatigue study|
| Compliance |Track UAP and RBI approval [VERIFY]|Agree liability wording with bank partner|Dispute reason code with NPCI|
| Engineering |Mock agent and bank APIs|Mandate service, why records|Console, auto-pause rules|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Compliance | Bank partner | Research |
|---|---|---|---|---|---|---|
| Mandate rules | C | A | R | C | C | I |
| Why record format | R | A | R | I | C | C |
| Hold logic | C | A | R | C | C | I |
| Dispute evidence pack | R | A | R | C | R | I |
| Usability tests | A | C | I | I | I | R |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| UAP launch and RBI approval [VERIFY] | NPCI / RBI | Any live launch |
| Agent registry access | NPCI | Badge |
| Bank dispute system accepts agent reason code | Bank, NPCI | Dispute pilot |
| Agent provider integration (e.g. Claude, ChatGPT via Razorpay) | Providers | Feed and holds |
| UPI app partner for UI | TPAP | Pilot |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| UAP delayed or changed | 3 | 3 | 9 | Design around mandate principles; mock integrations |
| Liability inside mandate stays unresolved | 3 | 3 | 9 | Clear wording, evidence pack, bank pilot |
| Hold fatigue makes users approve blindly | 2 | 3 | 6 | Rare holds, equal buttons, test in E2 |
| Manipulated prompts slip through | 2 | 3 | 6 | Merchant allowlist, new-merchant hold |
| Users read 'Verified' as 'safe' | 2 | 3 | 6 | Wording: 'Listed in registry'; limits stay visible |
| Agent providers don't expose request text | 2 | 2 | 4 | Ask for minimal why schema early |
| Bank doesn't adopt dispute type | 2 | 2 | 4 | Start with one bank; share evidence benefit |


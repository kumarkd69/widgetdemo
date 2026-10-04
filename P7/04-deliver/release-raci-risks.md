# P7 Span · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: credit, route cards, reminders|Release 2: family, pre-filled form, HR console|
| Research |10 interviews, 6 sessions|Pilot with one employer and one insurer|Retiree path study|
| Compliance |Verify windows and routes with 3 insurers [VERIFY]|Data-sharing agreement with a pilot employer|Review health data handling (DPDP)|
| Engineering |Mock HR and insurer data|Timeline engine, reminders|HR console, insurer handoff|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Legal | HR / Insurer | Research |
|---|---|---|---|---|---|---|
| Timeline rules | C | A | R | C | C | I |
| Route cards and wording | R | A | I | C | C | C |
| Application handoff | C | A | R | C | R | I |
| Usability tests | A | C | I | I | I | R |
| HR data sharing | I | A | C | R | R | I |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| Verified windows by insurer and route [VERIFY] | Insurers / IRDAI | Route cards |
| HR exit dates | Employers | Invite flow |
| Insurer application handoff | Insurers | Application |
| Credit data (waiting, moratorium) | Insurers | Credit per member |
| Native-speaker review | Content | Before tests |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Windows differ by insurer and we show a wrong date | 3 | 3 | 9 | 'Confirm with insurer' on every deadline; verify with 3 insurers |
| HR doesn't share exit dates | 3 | 2 | 6 | Employee-entered dates first; HR console later |
| Health data mishandled | 2 | 3 | 6 | Ask last and least; consent; encrypt; DPDP review |
| Credit shown wrongly | 2 | 3 | 6 | Label estimated vs verified; link to insurer record |
| Reminders feel like pressure | 2 | 2 | 4 | Cap at 3 a week; calm copy |
| Seen as insurer advice | 2 | 3 | 6 | Show routes neutrally; licensed advisor for advice |
| Late users find no good option | 3 | 2 | 6 | Honest late-path screen; advisor link |


# P6 Sooner · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: confirm, share, arrival code, UPI pay|Release 2: hospital picker, transfer mode, dispute|
| Research |10 interviews, 6 sessions|Pilot in one city with 5 operators|Rural reach study|
| Compliance |Verify state fare caps and AIS-125 mapping [VERIFY]|Operator agreements and price bands|Review location data handling (DPDP)|
| Engineering |Mock fleet and quote data|Quote engine, tracking, SMS fallback|Operator console, driver app, invoice check|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Legal | Operators | Research |
|---|---|---|---|---|---|---|
| Quote rules and price bands | C | A | R | C | C | I |
| Need questions and wording | R | A | I | C | I | C |
| Dispatch and driver flow | C | A | R | I | R | I |
| Usability tests | A | C | I | I | I | R |
| Fare cap compliance | I | A | C | R | C | I |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| Verified fare caps by state [VERIFY] | State transport departments | Quote card |
| Live fleet and vehicle kit data | Operators | Quote and dispatch |
| Crew certificate source [VERIFY] | Regulators / operators | Crew card |
| Maps and ETA service | Vendor | Tracking |
| Native-speaker review | Content | Before tests |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Wrong or outdated state fare cap shown | 3 | 3 | 9 | Show a cap only after a state-level check [VERIFY]; label as quoted by the operator |
| Operators don't join or share live data | 3 | 3 | 9 | Start with a few operators; fast payment; simple driver app |
| Seen as medical advice | 2 | 3 | 6 | Needs, not conditions; Call 108 always visible; legal review |
| ETA is wrong | 3 | 2 | 6 | Show confidence; SMS update; refund policy for no-shows |
| Fake crew certificates | 2 | 3 | 6 | Mark as [VERIFY] until a source exists; operator audit |
| Location data misuse | 2 | 3 | 6 | Share only with the crew until trip ends; DPDP review |
| Caps too low for operators | 2 | 2 | 4 | Price bands set with operators; distance and kit adjustments |


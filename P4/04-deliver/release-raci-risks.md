# P4 Passline · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: verify, evidence checklist|Release 2: driver link, fleet, car check|
| Research |10 interviews, 6 sessions|Pilot on one corridor (e.g. Surat-Bharuch)|Fleet study|
| Compliance |Read the rules with legal; agree notice wording|Ask NHAI/IHMCL for data access [VERIFY]|Privacy review of photos|
| Engineering |Mock notice engine|Alert service, OTP, pay|Fleet, bulk pay|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Legal | NHAI / IHMCL | Research |
|---|---|---|---|---|---|---|
| Alert content | R | A | C | C | I | C |
| Notice verification | C | A | R | C | C | I |
| Dispute guide | R | A | I | C | C | C |
| Usability tests | A | C | I | I | I | R |
| Data access request | I | A | C | R | C | I |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| Alert or notice feed | NHAI / IHMCL / issuers | Alerts |
| Verification endpoint | NIC / NHAI | Verified badge |
| Passage photo access | NHAI / operators | Passage view |
| Payment rails (UPI) | Payment partner | Pay |
| VAHAN or official dues source for used cars [VERIFY] | MoRTH / NIC | Car check |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| No alert or notice feed available to a third party | 3 | 3 | 9 | Start with SMS parsing on device; ask for an official API |
| Fake notices copy our alerts | 2 | 3 | 6 | Alerts only in-app; verification screen; education |
| Passage photos unavailable or private | 3 | 2 | 6 | Fall back to time and gantry; never store photos without consent |
| Late alert causes a double fee | 2 | 3 | 6 | Multiple channels; fast alert SLA |
| Wrong dispute advice | 2 | 3 | 6 | Plain reasons only; link to the official portal |
| Alert fatigue | 2 | 2 | 4 | Only failed payments and deadlines |
| Rules change | 2 | 2 | 4 | Rules in config; review each release |


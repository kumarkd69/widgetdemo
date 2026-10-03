# P3 Mend · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, careful tests|Release 1: triage, drafts, reminders|Release 2: voice, auto-gather, share pack|
| Research |10 trauma-aware interviews|Pilot with a bank and a victim-support NGO|Call-back pilot|
| Compliance |Legal review of liability wording|Agree numbers and links with I4C/bank [VERIFY]|Ask for status API access|
| Engineering |Offline-first prototype|Case storage, encrypted evidence|Agency status where available|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Legal | Support partner | Research |
|---|---|---|---|---|---|---|
| Liability wording | C | A | I | R | C | I |
| Script and drafts | R | A | I | C | C | C |
| Evidence storage | C | A | R | C | I | I |
| Usability tests (ethics) | A | C | I | C | C | R |
| Helpline numbers list | C | A | C | R | C | I |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| Correct 1930 / NCRP / bank links | I4C, banks | Always, checked each release |
| Status data from agencies | I4C / banks | Case river automation |
| Money Restoration Module process [VERIFY] | MHA / I4C | Recover stage |
| Victim-support NGO partner | NGO | Pilot |
| Native-speaker review | Content | Before tests |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Wrong or outdated helpline or portal link | 2 | 3 | 6 | Verify each release; link only to official sources |
| Liability wording misleads victims | 2 | 3 | 6 | Legal review; show 'may not be covered' honestly |
| Evidence privacy breach | 2 | 3 | 6 | Encrypted on device, share only by choice |
| Scammers imitate Mend | 2 | 3 | 6 | One official link; warnings; no phone numbers except 1930 |
| Victims stop after the 1930 call | 3 | 2 | 6 | Reminders, small next steps |
| Distress from the ring or tone | 2 | 3 | 6 | Soft copy; test E1; support option |
| Agencies never expose status | 3 | 2 | 6 | Manual river is the product, not a stopgap |


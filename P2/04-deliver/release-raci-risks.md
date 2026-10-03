# P2 Nod · Validate and plan (plans only; no tests run yet)

## Now / Next / Later
_Release slices follow the story map. Dependencies noted in the risk table._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: plain cards, waiting state, requests|Release 2: guardian view, rights, bulk withdraw|
| Research |10 interviews, 6 usability sessions|Pilot with 2-3 fiduciaries|Voice and helper mode study|
| Compliance |Legal review of purpose wording|Apply for registration once Rule 4 opens; ₹2 crore net worth [VERIFY]|Audit trail and proof standards|
| Engineering |Mock fiduciary API|Consent artifact service, receipts|Fiduciary console, voice|

| RACI | Design (Kumar) | PM | Engineering | Legal / Compliance | Fiduciary partner | Research |
|---|---|---|---|---|---|---|
| Purpose card wording | R | A | I | C | C | C |
| Consent artifact format | C | A | R | C | C | I |
| Receipt flow | R | A | R | C | R | I |
| Usability tests | A | C | I | I | I | R |
| Registration application | I | A | C | R | I | I |
| Analytics events | C | A | R | I | I | I |

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Registration opens late or rules change | High (3) | High (3) | 9 | Run on mock fiduciaries; keep design principle-driven |
| Few fiduciaries integrate (optional) | High (3) | High (3) | 9 | Honest coverage; start with finance AAs; fiduciary console demo |
| Receipt not trusted without a signed company signal | Medium (2) | High (3) | 6 | Signed stop signal in the spec; escalate path |
| Purpose wording legally wrong | Medium (2) | High (3) | 6 | Legal review before any launch |
| Guardian verification excludes parents without DigiLocker | Medium (2) | Medium (2) | 4 | Alternate verified routes [VERIFY] |
| Hindi/Kannada copy errors | Medium (2) | Medium (2) | 4 | Native review before tests |
| Low-literacy users can't complete | Medium (2) | High (3) | 6 | Voice later; test with 2 such users now |

| Dependency | Owner | Needed by |
|---|---|---|
| Board registration process open (13 Nov 2026 [VERIFY]) | MeitY / Board | Before any live launch |
| Fiduciary integration API | Fiduciary partner | Pilot |
| DigiLocker parent verification | MeitY | Guardian release |
| OTP / SMS provider | Engineering | MVP |
| Native-speaker review | Content | Before tests |


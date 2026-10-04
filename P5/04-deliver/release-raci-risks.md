# P5 Fineprint · Validate and plan (plans only; nothing tested yet)

## Now / Next / Later
_Release slices follow the story map._ [Hypothesis]

| |Now (Q4 2026)|Next (Q1-Q2 2027)|Later (H2 2027+)|
|---|---|---|---|
| Product |Walking skeleton prototype, tests|Release 1: rules page, plain words, renewal|Release 2: simulator, gaps, advisor|
| Research |10 interviews, 6 sessions|Pilot with 2 insurers' data|Claims-experience study|
| Compliance |Check advice vs information with legal [VERIFY]|Agree open ranking rules with insurers|Review advisor model|
| Engineering |Mock plan data|Ranking engine with versioned rules|Simulator, advisor booking|

## Who does what, and what we wait on
_R responsible, A accountable, C consulted, I informed._ [Hypothesis]

| RACI | Design (Kumar) | PM | Engineering | Legal | Insurers / BSIF | Research |
|---|---|---|---|---|---|---|
| Ranking rules | C | A | R | C | C | I |
| Not-covered summaries | R | A | C | C | C | C |
| Simulator logic | C | A | R | C | C | I |
| Usability tests | A | C | I | I | I | R |
| Advisor model | C | A | I | R | I | I |
| Analytics events | C | A | R | I | I | I |

| Dependency | Owner | Needed by |
|---|---|---|
| Structured policy terms (limits, waiting, exclusions) | Insurers / BSIF | Summaries, simulator |
| Permission to build on Bima Sugam [VERIFY] | BSIF / IRDAI | Hand-off |
| Bima Pehchaan consent access [VERIFY] | BSIF | Gap view |
| Licensed advisor partner | Partner | Advisor booking |
| Native-speaker review | Content | Before tests |

## Likelihood × impact
_Scale 1 low to 3 high. Score = likelihood × impact._ [Hypothesis]

| Risk | Likelihood | Impact | Score | Mitigation |
|---|---|---|---|---|
| Policy terms not available as data | 3 | 3 | 9 | Start with a few insurers; manual curation with audit |
| A ranked list is treated as advice | 2 | 3 | 6 | Legal view early; licensed advisor for recommendations |
| Simulator misleads | 2 | 3 | 6 | Label as estimate; show assumptions; test accuracy |
| Insurers reject open rules | 2 | 3 | 6 | Publish rules; start with those who agree |
| Rules gamed by insurers | 2 | 2 | 4 | Versioned rules; periodic review |
| Data minimisation breached | 2 | 3 | 6 | Optional questions; consent for portfolio read |
| Bima Sugam access blocked | 3 | 2 | 6 | Hand off by link; no scraping |


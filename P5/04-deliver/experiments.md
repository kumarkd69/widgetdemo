# P5 Fineprint · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Not-covered first | Showing limits first raises correct recall of limits | A/B | Recall of 3 limits at 30 days | ~360 per arm |
| E2 Simulator placement | Running the simulator before compare leads to a lower out-of-pocket choice | A/B | Out-of-pocket of chosen plan in the sample stay | ~400 per arm |
| E3 Rules page prominence | A visible rules banner lifts trust ratings without lowering conversion | A/B | Trust rating (1-5); hand-off rate to Bima Sugam | ~380 per arm |

- Guardrails: sponsored placements = 0; recommendations without a visible rule = 0; data collected beyond needs = 0; claims-rejection surprises (target: falling).
- Stop early if a guardrail breaks. Minimum 2 weeks.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


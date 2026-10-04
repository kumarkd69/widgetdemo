# P6 Sooner · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Quote card vs price range | A single capped price beats a price range for confirming in under 3 minutes | A/B | Confirmed within 3 min | ~400 per arm |
| E2 Plain kit names | Basic, Advanced, Neonatal beat vehicle type codes for choosing the right kit | A/B | Kit matched to need | ~380 per arm |
| E3 ETA confidence | Showing ETA confidence lowers repeat calls to the driver | A/B | Calls to driver per trip | ~360 per arm |

- Guardrails: diagnosis-like advice = 0; invoice above quote (target zero); operator payment delay; time to first ETA.
- Stop early if a guardrail breaks. Minimum 2 weeks. No test delays the Call 108 link.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


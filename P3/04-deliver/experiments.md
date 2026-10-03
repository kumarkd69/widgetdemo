# P3 Mend · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates. All tests need an ethics review first._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Golden-hour ring | Showing time left speeds the call without raising distress | A/B | Time to 1930 call; distress rating | ~360 per arm |
| E2 Triage position | Asking 'Did you approve it?' after the call lowers drop-off | A/B | Drop-off before the call | ~400 per arm |
| E3 Permission wording | Explaining 'why' raises call-log permission grants | A/B | Grant rate | ~380 per arm |

- Guardrails: refund promises = 0; distress rating not above baseline; first action under 10 s; evidence privacy incidents = 0.
- Stop early if a guardrail breaks. Minimum 2 weeks. Ethics review before any test.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


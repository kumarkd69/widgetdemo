# P2 Nod · Validate and plan (plans only; no tests run yet)

## Three tests after launch
_Hypotheses, design, sample size and guardrails. Numbers are planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Purpose card wording | Two plain sentences are recalled better than a data list | A/B, 50/50 | Correct recall of what data is used | ~360 per arm (60% to 70%, 80% power, alpha 0.05) |
| E2 Coverage bar | Showing '12 of 31 apps' raises trust without lowering retention | A/B | Trust rating (1-5); day-30 retention | ~400 per arm |
| E3 Notification ask timing | Asking after first withdrawal beats asking at onboarding | A/B | Opt-in rate | ~500 per arm |

- Guardrails for all tests: time to withdraw does not rise above 30 s; no increase in support tickets per 1,000 users; no user is nudged to keep consent.
- Stop a test early if a guardrail breaks. Run at least 2 full weeks.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2 for proportions.


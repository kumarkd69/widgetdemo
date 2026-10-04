# P4 Passline · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Alert timing | A push within 5 minutes beats SMS within 1 hour for resolving in 72 h | A/B | Resolved within 72 h | ~400 per arm |
| E2 Passage view | Showing the passage before pay lowers wrong payments | A/B | Disputes filed for cloned or wrong-class cases that were first paid | ~380 per arm |
| E3 Verified badge wording | 'Verified with official source' beats 'Genuine notice' for fake-SMS rejection | A/B | Fake-notice rejection | ~360 per arm |

- Guardrails: no clicks on fake notices; disputes filed after 72 h do not rise; alert opt-outs do not rise.
- Stop early if a guardrail breaks. Minimum 2 weeks.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


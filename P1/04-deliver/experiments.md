# P1 Rein · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Default limits | ₹1,000 / ₹5,000 defaults lead to more mandates set than ₹500 / ₹2,000 without more wrong-intent payments | A/B | Mandates created; wrong-intent per 10,000 | ~400 per arm |
| E2 Hold channel | Hold inside the agent chat is decided faster than a push notification | A/B | Time to decision; hold abandonment | ~360 per arm |
| E3 Why card content | Request + checks beats request only for 'expected' marking | A/B | Share marked 'expected' | ~380 per arm |

- Guardrails: pause under 10 s; approval prompts per mandate per week do not rise; wrong-intent payments per 10,000 do not rise; held payments later confirmed fine stay low.
- Stop early if a guardrail breaks. Minimum 2 weeks.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


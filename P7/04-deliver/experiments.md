# P7 Span · Validate and plan (plans only; nothing tested yet)

## Three tests after launch
_Hypotheses, design, sample size, guardrails. Planning estimates._ [Hypothesis]

| Test | Hypothesis | Design | Primary metric | Sample (est.) |
|---|---|---|---|---|
| E1 Bridge visual | The bridge beats a plain list for understanding the gap and acting by the date | A/B | Application started by act-by date | ~400 per arm |
| E2 Reminder cadence | Reminders at 45, 30 and 7 days beat 30 and 7 | A/B | Application started by act-by date | ~380 per arm |
| E3 Health questions last | Placing health questions last lowers drop-off and raises comfort | A/B | Drop-off; comfort rating | ~360 per arm |

- Guardrails: health data beyond need = 0; fear-based copy = 0; reminders per week above 3 = 0; insurer nudges without disclosure = 0.
- Stop early if a guardrail breaks. Minimum 2 weeks.
- Sample size: n = 2 x (1.96+0.84)^2 x p(1-p) / d^2.


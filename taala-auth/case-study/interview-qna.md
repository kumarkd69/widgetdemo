# Interview Q&A

**1. Why not just keep OTP?** It's legal (¶5(f)), and we keep it as a fallback. But it's phishable, depends on a SIM, and fails abroad. A device key signs the exact amount and payee, so a scammer can't talk you into reading it out.

**2. How did you balance fraud and conversion?** I let risk decide friction. Low-risk payments are one touch; friction rises only with risk, and each step adds one thing in the same sheet. Guardrails stop rollout if fraud or first-attempt success move the wrong way.

**3. How do you get six product teams to adopt this?** Make adopting cheaper than building: one SDK call, components that already pass a11y and compliance, a kill switch, and an Auth Council that turns disputes into RFCs instead of escalations.

**4. You didn't interview anyone. Why should I trust this?** You shouldn't yet, and I say so. I separated desk research from findings, wrote hypotheses with pass signals, and a 12-person plan. The matrix is built to be retuned without redesign.

**5. What's the hardest decision here?** Whether a device key unlocked by biometrics counts as two factors. It's a compliance call. I designed for both answers: if it doesn't, Low tier becomes key + PIN.

**6. Why four tiers?** Fewer can't separate "new payee" from "SIM swap". More, and neither users nor analysts can keep them straight.

**7. What happens when the policy engine is down?** The SDK fails closed to a cached Medium plan (key + PIN). It never skips authentication.

**8. How is this accessible?** Trust Meter never relies on colour; PIN digits aren't spoken; every timer can be extended; OTP is one field. Tested plan includes screen-reader users.

**9. How did you handle languages?** Every explanation is a string ID in three languages from day one. Hindi and Kannada drafts are flagged for native review, not shipped as-is.

**10. What would you cut for an MVP?** Everything but UPI Low tier, the Auth Sheet, Trust Meter, PIN, biometric, fallback and lockout. That pilots the system where volume is high and risk is low.

**11. How do you measure success?** First-attempt success for legitimate users is the north star; OTP share and fraud loss in basis points sit under it; guardrails define when to roll back.

**12. What would you do differently?** Run the audit first. The scenario's six OTP patterns are plausible, but real screenshots would make the problem undeniable.

## 60-second pitch
"Indian payment rules now require two factors with one dynamic factor. Most banks meet that with SMS OTP — legal, but easy to phish and useless when your Indian SIM is in a drawer abroad. I designed Taala, a unified authentication system for a fictional five-product financial group. One policy engine decides how much proof a payment needs; one bottom sheet with a Trust Meter shows the user why. Low-risk payments take one touch; high-risk ones explain themselves. Every failure has a next step, and the last step is always a person. I wrote the decision matrix, fallback ladder, a 17-component system in English, Hindi and Kannada, and a phased migration with metrics. It's a concept: research is desk-based, and the interview plan is ready to run."

## 10-minute outline
1. Hook: Meena's failed fingerprint (1 min)
2. The rule and what it doesn't say (1 min)
3. Problem inside Orbit (1 min)
4. Insights (1 min)
5. Principles and scope (1 min)
6. Decision matrix + one worked example (1.5 min)
7. Fallback ladder (1 min)
8. Trust Meter and design system; cross-product board (1.5 min)
9. Migration and metrics (1 min)
10. What's unvalidated and what's next (1 min)

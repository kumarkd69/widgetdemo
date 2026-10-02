# Component specs

## Behaviour
| Component | Timers | Retry limits | Autofill | Focus order | Haptics | Motion (reduced) | SR announcement |
|---|---|---|---|---|---|---|---|
| Auth Sheet | Challenge 120 s, extendable | — | — | Title → meter → summary → factor → footer | Light on open | Slide up 300 ms (fade 100 ms) | See a11y.md |
| Trust Meter | — | — | — | Single focus stop | — | Fill 450 ms (none) | Tier + reason |
| Biometric | OS | 2 then Chooser; 5/session | — | Prompt → "Try another way" | Success / error | Shake 200 ms (none) | Result |
| PIN Pad | — | 3 → lockout | — | Dots (label) → keys row-wise → Forgot | Tick per key | Dots shake (none) | "Digit entered, n of 6" |
| OTP Input | Expiry 180 s; resend 30 s; extend +120 s | 3 wrong → 30 min | SMS Retriever / one-time-code | Field → resend → alternative | Success | — | Filled / error |
| Cooldown | Live countdown, updates SR every 60 s max | — | — | Title → end time → actions | — | — | End time |
| Toast | 4 s, pauses on focus/hover | — | — | Not focus-trapping | — | Fade | Polite |

## Analytics events
| Event | Properties |
|---|---|
| `taala_sheet_opened` | decision_id, product, moment, tier, locale |
| `taala_stepup_shown` | decision_id, explanation_id |
| `taala_factor_started` | decision_id, factor |
| `taala_factor_result` | decision_id, factor, result, attempt_n, duration_ms |
| `taala_fallback_chosen` | decision_id, from_factor, to_factor |
| `taala_lockout` | decision_id, factor, until |
| `taala_auth_succeeded` | decision_id, duration_ms, factors |
| `taala_sheet_dismissed` | decision_id, stage |
| `taala_enrol_prompt_shown` / `_completed` / `_declined` | surface |
| `taala_recovery_started` / `_completed` | route |
| `taala_why_opened` | explanation_id |
No PII, no amounts in analytics (amount band only).

## QA acceptance per pattern
**Approve a payment:** Low shows no explainer; Trust Meter matches tier; success in one sheet; SR reads amount and payee; 3 languages fit without truncation at 200% text.
**Step up:** explainer above factor; cooling shown before commit; extra factor in same sheet.
**Fall back:** Chooser appears after 2 BIO fails; last option is a human route; engine called on fallback.
**Recover:** no OTP-only route; 6 h cooling applied; all devices notified.
**Bind a new device:** SIM change < 48 h → Blocked; 12 h payee lock shown.
**Cross-border:** push arrives with SIM absent; FX line shown; QR fallback works.
**Approve on another device:** codes match on both screens; domain visible.

# Migration plan: OTP-first to Taala

Setting: Orbit Financial, after 1 April 2026 (ADR-002). Orbit meets ¶6, mostly via SMS OTP. All Orbit numbers are **estimates** for a fictional group.

## Current state (scenario)
| Product | Auth moments | Dynamic factor today | OTP dependency |
|---|---|---|---|
| Orbit Bank (app + web) | login, add payee, transfer, PIN change, device change | SMS OTP | High |
| Orbit UPI | bind, pay, PIN set/reset | Device binding (SIM SMS) + UPI PIN | Medium (bind/reset) |
| Orbit Cards | CNP domestic, cross-border, tokens | SMS OTP via ACS | Very high |
| Orbit Wallet | load, spend, KYC upgrade | SMS OTP | High |
| Orbit Invest | login, funds in/out, orders | SMS/email OTP (SEBI) | High |
- **SMS cost:** estimate ₹0.15–0.25 per OTP SMS (to be measured against Orbit's contract).
- **Exposure:** SIM swap, OTP phishing (vishing, fake KYC SMS), OTP fails abroad (R13).

## Target state
Policy engine + Taala SDK + shared components. Device-bound key default in apps, passkeys on web, OTP fallback only (ADR-004/005).

## Phases
| # | Phase | Scope | Entry criteria | Exit criteria |
|---|---|---|---|---|
| 0 | Foundations | Engine contract v1, design system v1, compliance sign-off on DK as dynamic factor | Funded team; ADRs 4–8 accepted | Engine in staging; components pass a11y; compliance memo signed |
| 1 | Pilot | UPI A0–A1, Low tier, 5% of Android users | Phase 0 exit; kill switch tested | First-attempt success ≥ legacy; no fraud uplift; support tickets flat (targets) |
| 2 | Dual-run | UPI all tiers + Bank transfers; A/B 50/50 | Pilot exit | Metrics hold for 4 weeks; incident playbook used once in drill |
| 3 | Default switch per product | DK/passkey default, OTP fallback in UPI, Bank, Cards (incl. cross-border push) | Dual-run exit per product | OTP share of dynamic factors < 30% (target) per product |
| 4 | Long tail | Net banking passkeys, Wallet, Invest, recovery, shared-phone profiles | Phase 3 for ≥ 3 products | All auth moments on Taala (target 95%) |
| 5 | Deprecate legacy | Remove old OTP screens and PIN designs | Phase 4 exit; 1 quarter of notice | Legacy components deleted; lint blocks reuse |

## User migration: progressive enrolment
- **When:** right after a successful payment, not at login (H6).
- **How:** a card under the Success Confirmation: "Next time, approve with your fingerprint. No SMS code needed." [Set up] [Not now]. Max once per 7 days; stop after 3 "Not now".
- **No forced moment:** users who never enrol keep PIN + OTP until Phase 5, then PIN + DK (DK binding happens silently where possible).
- Copy:
  - EN: "Next time, approve with your fingerprint. No SMS code needed."
  - HI [VERIFY]: "अगली बार फ़िंगरप्रिंट से मंज़ूरी दें। SMS कोड की ज़रूरत नहीं।"
  - KN [VERIFY]: "ಮುಂದಿನ ಬಾರಿ ಬೆರಳಚ್ಚಿನಿಂದ ಅನುಮೋದಿಸಿ. SMS ಕೋಡ್ ಬೇಕಿಲ್ಲ."

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| Old Android without secure hardware | Software-backed key + PIN, Medium cap on amounts; OTP fallback kept |
| Users without biometrics | PIN path is first-class (MSG_BIO_NONE) |
| SMS fallback abused by fraudsters | Fallback rate monitored per user; OTP never alone at High; velocity rules |
| Support spike at default switch | Staffed 2× for 2 weeks; agent console; in-app help |
| Compliance doubts on DK/passkey | Phase 0 sign-off; evidence logs from day one |
| Cross-border date (1 Oct 2026) | Cards cross-border push moved into Phase 2 for Cards |
| Vendor ACS can't do in-app push | Contract change in Phase 0; QR fallback |

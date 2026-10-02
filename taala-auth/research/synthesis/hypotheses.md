# Hypotheses

**No interview notes exist** (`research/interviews/` is empty). Everything here is a hypothesis to test, not a finding. Sources: regulation notes (Phase 1) and the Orbit scenario.

| ID | Hypothesis | Why we think it | How to test | Pass signal |
|---|---|---|---|---|
| H1 | Users abandon high-value payments more when a step-up appears **without** a reason than **with** a one-line reason. | ¶8 lets issuers add checks; nothing makes them explain. | A/B in prototype test: step-up with vs without explainer, ₹2,00,000 transfer, 12 participants; later live A/B on abandonment. | ≥ 20% fewer abandons with explainer (target) |
| H2 | Users over 50 trust a payment more when they see *why* it's safe (trust meter) than when they see nothing. | Meena proto-persona; fraud anxiety in older users (desk). | Think-aloud + 1–7 trust rating after each of 4 flows. | Mean trust +1 point with meter (target) |
| H3 | When fingerprint fails, most users retry until locked out rather than look for another option. | Common pattern in biometric UX (desk). | Simulated fingerprint failure in prototype; count retries before switching. | With Fallback Chooser shown after 2 fails, ≥ 80% switch before lockout (target) |
| H4 | Users can't tell a real OTP screen from a fake one when patterns vary. | Orbit has six OTP patterns (scenario). | Show 6 OTP screens (3 real Taala, 3 spoofed); ask which to trust. | Accuracy rises with one consistent pattern |
| H5 | NRI users fail cross-border CNP when OTP goes to an Indian SIM that's off. | Priya; R13 cross-border rule. | Diary study / screener with 4 NRIs; count failed foreign online purchases in 30 days. | ≥ half report a failure in last 3 months |
| H6 | Users enrol a passkey or device binding more readily right after a successful payment than at login. | Progressive enrolment practice (desk). | Live A/B in pilot: prompt at login vs after success. | Higher opt-in after success |
| H7 | Shared-phone users (Imran) want separate profiles, not a shared PIN. | Shared devices common in small businesses (desk). | 3 interviews with shop owners; card sort of options. | Majority pick per-person profile |
| H8 | Users on a phone call while approving a large transfer are often being coached by a scammer. | Social engineering pattern (desk). | Fraud team data: % of confirmed scam transfers with active call. | Share above base rate → justify call warning |
| H9 | TalkBack users fail OTP entry when boxes are split into 6 separate fields. | Known a11y issue with split inputs (desk). | Usability test with 3 screen-reader users. | Single field with 6 visual boxes passes |
| H10 | Same pattern across UPI, card and bank reduces "is this real?" support calls. | Principle 2. | Pilot: support tickets per 10,000 auths, before/after. | Drop (target set in metrics.md) |

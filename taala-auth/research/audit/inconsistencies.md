# Inconsistencies and gaps — desk audit

Evidence = public source IDs from `audit-matrix.md` (no screenshots exist). Apps anonymised. Severity is my judgement from the evidence.

| # | Finding | Evidence | Why it matters | Type | Severity | Taala answer |
|---|---|---|---|---|---|---|
| F1 | **SMS OTP is still the default dynamic factor for online card payments**; app approval exists only for select cases. | C1, C2, C4 | Phishable; fails when the SIM is off abroad — the exact cross-border case the 1 Oct 2026 rule targets. | Security, compliance | High | Device-key push by default (CB-01); OTP as fallback (ADR-005). |
| F2 | **UPI PIN length is 4 or 6 depending on the bank**, so one app shows different PIN pads. | B1, B3 | Recall errors; users can't learn one pattern. | Usability, consistency | Medium | PIN Pad has both lengths with the same layout; Orbit standardises app PIN at 6. |
| F3 | **Three PIN types across apps**: 6-digit MPIN (Bank A), 4/6 UPI PIN (B), 4-digit passcode (Wallet D's bank). | A1, B1, D5 | "Which PIN?" confusion; phishing scripts exploit it. | Usability | Medium | One app PIN + UPI PIN only; labels always name which PIN. |
| F4 | **Wallet D uses four different factor sets** depending on own device, new device, app lock, bank access. | D2, D3 | Users can't predict what will be asked; fake prompts blend in. | Consistency, security | Medium | One Auth Sheet; risk tier decides factors. |
| F5 | **PIN reset via card details + SMS OTP** (UPI app B). Both can be phished in the same call. | B1 | Recovery becomes the weakest link; violates factor independence (R6). | Security | High | No SMS-only recovery; card route also needs fingerprint (ADR-006). |
| F6 | **3 wrong UPI PINs → 24-hour block**; 3 failed resets → 24 h block across all UPI apps. | B2, D4 | Long dead end for people with poor recall or a shaky hand; no human route mentioned. | Usability, inclusion | High | Lockout Card with end time + reset + human route; never only "wait". |
| F7 | **New-device login falls back to SMS/email OTP** even at the broker with the strongest 2FA. | E3, D3 | SIM swap gets a foothold at the device-change moment. | Security | High | New device: approve on old device first; SIM change < 48 h → video KYC (DEV-01/02). |
| F8 | **Cooling-period limits vary by bank and rail** (₹50,000 NEFT/RTGS vs ₹25,000 IMPS; 30 min to 72 h). Users often find them only on failure. | A2, X2 | Surprise failures at high-stress moments. | Transparency | Medium | Show the cap when the payee is added (ADR-008). |
| F9 | **UPI apps have screen-reader gaps**: unlabelled buttons, PIN reset hard to reach, vague errors, no audio/haptic feedback. | X1 | Excludes visually impaired users; pushes them to share PINs with helpers. | Accessibility | High | TalkBack scripts, focus order, no spoken digits (a11y.md). |
| F10 | **Different second factors for the same "approve" moment**: app approval (Card C NetBanking), app code (Broker E), OTP (Wallet D), PIN (UPI B). | C3, E1, D1, B1 | Same moment, different patterns → harder to spot fakes (Insight I3). | Consistency | Medium | Same risk, same pattern across products. |
| F11 | **App-based approval is opt-in and buried** (Card C's app-based authentication needs separate registration). | C1, C4 | The safer factor goes unused; OTP stays default. | Adoption | Medium | Progressive enrolment after a successful payment. |
| F12 | **"Never share OTP" warnings sit in help pages and SMS**, not consistently on the entry screen. | D1, RBI advisories | The warning isn't present at the moment of risk. [VERIFY on-screen copy with screenshots] | Security | Low | Never-share line is part of the OTP Input component. |

## What the desk audit can't tell us
- Exact screen copy, step counts and timings.
- Whether step-ups explain themselves on screen.
- Visual consistency within each app.
These need screenshots or a hands-on walkthrough. Status: optional follow-up.

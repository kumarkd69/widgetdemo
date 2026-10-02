# Risk-to-authentication decision matrix

This is the policy engine contract. The CSV (`decision-matrix.csv`) is the source; this file explains it. **Tiers, bands and cooling periods are Orbit policy built on ¶8 (risk-based checks), not RBI rules.**

## Factor codes
| Code | Factor | Category (¶5(f)) | Dynamic? (¶6) |
|---|---|---|---|
| DK | Device-bound key in the phone's secure hardware signs a challenge with amount, payee and nonce | has | Yes — signature is unique to the transaction |
| BIO | On-device fingerprint or face, used to unlock DK | is | No |
| APIN | Orbit app PIN, 6 digits | knows | No |
| UPIN | UPI PIN (NPCI rules) | knows | No |
| PK | Passkey (WebAuthn) for net banking | has | Yes — signed challenge [VERIFY synced passkeys] |
| OTP | SMS one-time code | has (SIM) | Yes |
| password | Net banking password | knows | No |
| assisted | Human route: call-back, video KYC, branch | — | — |

**Independence rule (R6):** BIO + DK count as two categories only if DK signs and BIO is verified by the OS for that signature. If an auditor rejects this, Low tier becomes DK + PIN; flagged in open questions.

## Amount bands (Orbit policy)
| Band | Range | Why this edge |
|---|---|---|
| A0 | up to ₹500 | Everyday micro-spend (tea, transport, kirana). Where speed matters most. Edge: estimate. |
| A1 | ₹501 – ₹5,000 | ₹5,000 matches the reported contactless exemption limit and NPCI's launch cap for UPI biometrics [VERIFY both]. One mental model across rails. |
| A2 | ₹5,001 – ₹25,000 | Large household spend. ₹25,000 is also the new-payee 24-hour cap (Orbit policy). |
| A3 | ₹25,001 – ₹1,00,000 | Up to the usual UPI P2P per-transaction limit [VERIFY]. |
| A4 | above ₹1,00,000 | Net banking / IMPS / NEFT territory; rare and high-impact. |

## (a) Tier summary

| Tier | When | Factors | User sees | Fallback | Holds |
|---|---|---|---|---|---|
| **Low** | Known payee/merchant, bound device, no anomaly, A0–A2 | DK + BIO (or DK + PIN) | Trust Meter "Low · known payee". One touch. | DK + PIN, then OTP + PIN (non-UPI) | None |
| **Medium** | New payee or merchant, A2–A3, abroad, new browser, mandate set-up | DK + PIN (always knowledge) | Trust Meter "Medium" + one-line reason | OTP + PIN; QR on another device | None |
| **High** | New payee + large amount, night + new payee, SIM change < 48h, active call, new device, PIN reset | DK + PIN + BIO (three categories) | Step-up Explainer, Trust Meter "High", cooling notice | Assisted only (no OTP-only path) | Cooling caps (Orbit policy) |
| **Blocked** | Rooted/emulated device, SIM swap + new device, confirmed fraud signal | None in-app | Lockout Card with reason and human route | Video KYC, branch, call-back | Until assisted check |
| **Exempt** | Listed exemptions only | Per exemption | Light confirmation | — | Logged with `exemption_code` |

## (b) Full matrix
| row_id | transaction_type | amount_band | beneficiary | device | sim | anomaly | exemption | risk_tier | primary_factors | factor_categories | fallback_factors | cooling_period | explanation_id | rbi_basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| UPI-01 | UPI P2M | A0-A1 | known | bound | unchanged | none | none | Low | DK+BIO | has+is | DK+UPIN | none | EXP_LOW_KNOWN_SMALL | ¶6; NPCI biometric cap (R21) |
| UPI-02 | UPI P2M | A0-A1 | known | bound | unchanged | none | none | Low | DK+UPIN | has+knows | DK+BIO | none | EXP_LOW_KNOWN_SMALL | ¶6 |
| UPI-03 | UPI P2M | A2 | known | bound | unchanged | none | none | Low | DK+UPIN | has+knows | assisted | none | EXP_LOW_KNOWN | ¶6; above biometric cap |
| UPI-04 | UPI P2P | A0-A1 | known | bound | unchanged | none | none | Low | DK+BIO | has+is | DK+UPIN | none | EXP_LOW_KNOWN_SMALL | ¶6 |
| UPI-05 | UPI P2P | A2 | new | bound | unchanged | none | none | Medium | DK+UPIN | has+knows | DK+UPIN after cooldown | none | EXP_MED_NEW_PAYEE | ¶6; ¶8 |
| UPI-06 | UPI P2P | A3 | new | bound | unchanged | none | none | High | DK+UPIN+BIO | has+knows+is | DK+UPIN+OTP | first 24h cap ₹25000 (Orbit policy) | EXP_HIGH_NEW_PAYEE_LARGE | ¶6; ¶8 |
| UPI-07 | UPI P2P | A2-A3 | any | bound | unchanged | active call detected | none | High | DK+UPIN+pause 30s | has+knows | assisted | 30s pause + scam warning (Orbit policy) | EXP_HIGH_ON_CALL | ¶8 |
| UPI-08 | UPI any | any | any | bound | changed <48h | none | none | High | DK+UPIN+BIO | has+knows+is | assisted | limit ₹5000/day for 48h (Orbit policy) | EXP_HIGH_SIM_CHANGED | ¶8; R6 |
| UPI-09 | UPI any | any | any | rooted/emulator | any | any | none | Blocked | none | — | assisted (branch/video) | until device clean | EXP_BLOCK_DEVICE | ¶8; R15 |
| UPI-10 | UPI Lite / offline | A0 | known | bound | any | none | small-value offline | Exempt | DK | has | DK+UPIN | none | EXP_EXEMPT_SMALL_OFFLINE | Exemptions [VERIFY limits] |
| CNP-01 | Card CNP domestic | A0-A1 | saved merchant | bound | unchanged | none | none | Low | DK+BIO (in-app push) | has+is | OTP+APIN | none | EXP_LOW_KNOWN_SMALL | ¶6 |
| CNP-02 | Card CNP domestic | A2-A3 | new merchant | bound | unchanged | none | none | Medium | DK+APIN (in-app push) | has+knows | OTP+APIN | none | EXP_MED_NEW_MERCHANT | ¶6; ¶8 |
| CNP-03 | Card CNP domestic | A4 | any | bound | unchanged | none | none | High | DK+APIN+BIO | has+knows+is | OTP+APIN+assisted | none | EXP_HIGH_LARGE | ¶6; ¶8 |
| CNP-04 | Card CNP domestic | any | any | not bound | unchanged | none | none | Medium | OTP+APIN | has+knows | assisted | none | EXP_MED_NO_APP | ¶6; ¶5(f) OTP valid |
| CB-01 | Card CNP cross-border (AFA requested) | A0-A2 | any | bound | absent | abroad (expected) | none | Medium | DK+BIO or DK+APIN (push) | has+is / has+knows | QR approve-on-another-device; email OTP [VERIFY] | none | EXP_MED_ABROAD | Cross-border rule (R13) |
| CB-02 | Card CNP cross-border (AFA requested) | A3-A4 | any | bound | absent | abroad | none | High | DK+APIN+BIO | has+knows+is | assisted call-back | none | EXP_HIGH_ABROAD_LARGE | R13; ¶8 |
| CB-03 | Card CNP cross-border (no AFA request) | any | any | any | any | none | none | Medium (risk-scored) | risk-based; step-up to CB-01 if score high | — | — | none | EXP_MED_ABROAD | R14 [VERIFY scope] |
| NB-01 | Net banking transfer | A0-A2 | known | passkey enrolled | n/a | none | none | Low | PK+password | has+knows | DK push+password; OTP+password | none | EXP_LOW_KNOWN | ¶6 |
| NB-02 | Net banking transfer | A3-A4 | new | passkey enrolled | n/a | none | none | High | PK+password+DK push to phone | has+knows+has(2nd device) | assisted | new payee cap ₹50000 first 24h (Orbit policy) | EXP_HIGH_NEW_PAYEE_LARGE | ¶6; ¶8 |
| NB-03 | Net banking login | — | — | new browser | n/a | none | none | Medium | password+DK push | knows+has | password+OTP | none | EXP_MED_NEW_DEVICE | ¶6 |
| NB-04 | Add beneficiary (any channel) | — | new | bound | unchanged | none | none | Medium | DK+APIN | has+knows | OTP+APIN | payee usable at once up to cap (Orbit policy) | EXP_MED_ADD_PAYEE | ¶8 |
| WAL-01 | Wallet spend | A0-A1 | known | bound | unchanged | none | none | Low | DK+BIO | has+is | DK+APIN | none | EXP_LOW_KNOWN_SMALL | ¶6 |
| WAL-02 | Wallet load from card/UPI | A1-A2 | own instrument | bound | unchanged | none | none | Low | inherits source instrument auth (UPI/CNP row) | — | — | none | EXP_LOW_OWN_FUNDS | ¶6 via source |
| WAL-03 | Wallet gift / transit PPI | A0 | — | any | any | none | PPI-MTS / Gift PPI | Exempt | DK or none per product | — | — | none | EXP_EXEMPT_PPI | Exemptions [VERIFY] |
| INV-01 | Bank-to-broker funds transfer | A2-A3 | own broker a/c (verified) | bound | unchanged | none | none | Low | DK+BIO | has+is | DK+APIN | none | EXP_LOW_OWN_FUNDS | ¶6 |
| INV-02 | Broker order placement | any | — | bound | unchanged | none | SEBI scope | Low (SEBI) | session (DK) + BIO at login | has+is | APIN | none | EXP_INFO_SEBI | SEBI 2FA [VERIFY] (R25) |
| INV-03 | Broker withdrawal to new bank a/c | A3 | new | bound | unchanged | none | none | High | DK+APIN+BIO | has+knows+is | assisted | 24h hold (Orbit policy) | EXP_HIGH_NEW_PAYEE_LARGE | ¶8 |
| EMD-01 | E-mandate registration | any | merchant | bound | unchanged | none | none | Medium | DK+APIN | has+knows | OTP+APIN | none | EXP_MED_MANDATE | ¶6; first debit not exempt (R19) |
| EMD-02 | E-mandate recurring debit (not first) | within mandate | merchant | — | — | none | recurring e-mandate | Exempt | none (pre-debit notice) | — | — | none | EXP_EXEMPT_MANDATE | Exemptions [VERIFY limits] |
| DEV-01 | Bind new device | — | — | new | unchanged | none | none | High | old device DK approve OR (OTP+APIN+BIO enrol) | has+knows+is | video KYC | 12h new-device payee lock (Orbit policy) | EXP_HIGH_NEW_DEVICE | ¶8; R6 |
| DEV-02 | Bind new device | — | — | new | changed <48h | none | none | Blocked | none in-app | — | video KYC or branch | until assisted check | EXP_BLOCK_SIM_SWAP | ¶8; R6 |
| REC-01 | Reset app/UPI PIN | — | — | bound | unchanged | none | none | High | DK+BIO + card/Aadhaar-OTP check | has+is+knows | video KYC | 6h cooling on new payees (Orbit policy) | EXP_HIGH_RECOVERY | R6; I5 |

## (c) Worked examples

| # | Scenario | Row | Experience |
|---|---|---|---|
| 1 | Meena pays ₹450 at her kirana | UPI-01 | Trust Meter Low. Touch sensor. Done in ~3 s (target). |
| 2 | Same, fingerprint fails twice | UPI-01 → fallback | Fallback Chooser: "Use UPI PIN". Same sheet. No restart. |
| 3 | Imran pays a regular supplier ₹18,000 | UPI-03 | Above biometric cap → UPI PIN. Low tier, no explainer. |
| 4 | Imran sends ₹25,000 to a new contact | UPI-05 | Medium: "First payment to this person". UPI PIN. |
| 5 | Arjun sends ₹2,00,000 to a new payee at 11:04 PM via net banking | NB-02 | High: passkey + password + approve on phone. ₹50,000 goes now, ₹1,50,000 after 24h, or release via video call. |
| 6 | Meena is on a call and tries to send ₹40,000 | UPI-07 | High: 30 s pause, "Is someone on the phone asking you to pay? Banks never ask this." Option to cancel or continue. |
| 7 | Priya buys an ₹18,000 course from a US site, SIM off | CB-01 | Push to her app; Face ID + DK. Trust Meter Medium "Payment abroad". |
| 8 | Priya's push doesn't arrive | CB-01 fallback | Scan QR in browser from bound phone ("Approve on another device"). |
| 9 | Arjun's SIM was replaced yesterday; he gets a new phone | DEV-02 | Blocked in-app. "For your safety, finish this on a video call." Book slot. |
| 10 | Ravi (TalkBack) resets his app PIN | REC-01 | High: DK + biometric/face (or card check), no OTP-only path; screen reader announces every step; no timer without extension. |

## (d) How each row meets RBI ¶6
- Every non-exempt row lists **two or more distinct categories** in `factor_categories` and a **dynamic factor** (DK, PK or OTP), satisfying ¶6.
- Exempt rows (UPI-10, WAL-03, EMD-02) carry an `exemption_code` and cite the exemption list [VERIFY limits].
- INV-02 (order placement) cites SEBI, not RBI (R25).
- WAL-02 inherits the auth of the source instrument (UPI or card row).
- CB-03 relies on R14, whose scope is unconfirmed.

## (e) Tunable vs fixed

| Fixed by regulation (engine refuses to change) | Tunable by Risk team (in Policy console, logged, Auth Council approval for loosening) |
|---|---|
| Minimum two distinct categories (¶6) | Amount band edges |
| One dynamic factor for non-card-present (¶6) | Signals that raise a tier (night hours, velocity, geo) |
| Exemption list and limits (per RBI/NPCI) | Cooling caps and durations |
| Cross-border AFA when merchant requests (R13) | Attempt limits before fallback (within a11y floor) |
| UPI PIN rules and biometric cap (NPCI) | Which explanation string shows |
| No OTP-only recovery for High (Orbit hard rule, ADR-006) | Pilot % per product |

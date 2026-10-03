# Audit matrix — desk audit

**Method:** desk audit from public sources, 3 Oct 2026. No screenshots and no hands-on testing (Kumar has none). Each cell records only what a cited source states. "Not found" means no public source; it does not mean the feature is missing. Apps are anonymised; the key is in `app-key.md` (research only).

Time estimates and step counts are **not** recorded: they need hands-on testing.

## Sources
| ID | Source |
|---|---|
| A1 | YONO registration guides: https://cleartax.in/s/yono-sbi-app · https://www.sbi-hrms.com/2026/05/sbi-yono-mpin-reset.html |
| A2 | SBI cooling period explainer: https://capitalflowindia.in/decoding-sbis-cooling-period-your-guide-to-secure-transfers/ · https://www.nobroker.in/forum/what-is-cooling-period-in-sbi-yono/ |
| B1 | Google Pay Help, create/reset UPI PIN: https://support.google.com/pay/india/answer/9091045 |
| B2 | Google Pay Help, incorrect UPI PIN: https://support.google.com/pay/india/answer/7430541 |
| B3 | NPCI UPI product page: https://www.npci.org.in/product/upi |
| C1 | HDFC enhanced security for card transactions: https://www.hdfcbank.com/personal/pay/cards/enhanced-security-cards-transactions-information/credit-cards |
| C2 | HDFC NetSafe / OTP: https://netsafe.hdfcbank.com/ · https://www.hdfcbank.com/personal/pay/stay-secure/otp-checkout |
| C3 | HDFC Kavach (app approval for NetBanking): https://www.hdfc.bank.in/resources/way-to-bank/online-banking/net-banking/two-step-verification |
| C4 | Guide on OTP abroad: https://www.citizennest.com/guide/hdfc-credit-card-payment-failed-fix |
| D1 | Paytm OTP security: https://paytm.com/support/privacy-security/paytm-otp-security-is-critical |
| D2 | Paytm Security Shield: https://paytm.com/blog/paytm-help/enable-paytm-app-security-shield/ |
| D3 | Paytm blog on login factors: https://medium.com/paytm-blog/your-paytm-id-password-is-not-enough-to-access-paytm-wallet-account-f224f646b27e |
| D4 | Paytm UPI PIN attempts FAQ: https://paytm.com/faqs/upi/how-do-i-reset-my-upi-pin-after-too-many-attempts |
| D5 | Paytm Payments Bank 4-digit passcode: https://paytm-14642.medium.com/how-to-reset-your-paytm-payments-bank-passcode-7194bbbceaf3 |
| E1 | Zerodha post on moving from PIN to 2FA: https://x.com/zerodhaonline/status/1583415941458669569 |
| E2 | Zerodha device lock bulletin: https://zerodha.com/marketintel/bulletin/332586/mandatory-device-lock-for-kite-login |
| E3 | Zerodha TOTP support: https://support.zerodha.com/category/trading-and-markets/general-kite/login-credentials-of-trading-platforms/articles/remove-this-totp-when-i-log-in-to-kite |
| X1 | UPI accessibility usability study (15 visually impaired participants, 3 UPI apps): https://ieeexplore.ieee.org/document/10379087/ |
| X2 | Cooling-period practice across banks: https://www.trustybull.com/explain/en/digital-banking/cooldown-period-new-beneficiary-net-banking |

## Matrix

| Auth moment | Bank A | UPI app B | Card C | Wallet D | Broker E |
|---|---|---|---|---|---|
| Install / first login | Net banking ID + password **or** ATM card + account details, then SMS OTP (A1) | Phone number verification + bank account link (B1) | Not found | ID + password; new device needs OTP to registered mobile (D3) | Login + 2FA (app code or TOTP); SMS/email OTP on new device (E1, E3) |
| Device binding | SIM, device and customer verification before MPIN (A1) | SMS-based binding to the phone number (B3) [VERIFY detail] | Not found | Account linked to device; OTP on new device (D1, D3) | Mandatory device lock for app login (E2) |
| App unlock | **6-digit MPIN**, or fingerprint / face (A1) | Phone screen lock / app lock (B1) [VERIFY] | App login (C3) | "Security Shield": fingerprint, Face ID or custom PIN (D2) | Device lock + app code (E2) |
| Payment | Not found for in-app transfers | **UPI PIN, 4 or 6 digits — length set by the bank** (B1, B3) | **SMS OTP** at checkout (C2); app approval offered for select cases (C1, C4) | OTP for sensitive actions (D1); UPI PIN for UPI | n/a (orders: 2FA at login) |
| Add beneficiary | Cooling period after adding payee (A2) | n/a (UPI) | n/a | Not found | Not found |
| High-value transaction | Cap during cooling (commonly ₹50,000 NEFT/RTGS, ₹25,000 IMPS in first 24 h across banks) (A2, X2) | NPCI per-transaction limits (B3) | Not found | Not found | n/a |
| Change PIN / device | MPIN reset with SIM/device/customer verification, OTP or net banking (A1) | UPI PIN reset with **debit card details + OTP** (B1) | NetSafe registration via OTP to mobile + email (C2) | OTP to change password or log in on a new device (D1) | TOTP removal / new device via SMS/email OTP (E3) |
| Failed attempt | Not found | Wrong UPI PIN → retry; warning before lock in some apps (B2) | Not found | Wrong UPI PIN → retry (D4) | Not found |
| Lockout | Not found | **3 wrong UPI PINs → 24 h block** on debits, or reset PIN (B2) | Not found | Same 24 h UPI rule; reset blocked 24 h across all UPI apps after 3 failed resets (D4) | Not found |
| Recovery | MPIN reset; may need fresh registration (A1) | Reset via card + OTP (B1) | Not found | Not found | SMS/email OTP fallback (E3) |
| Accessibility issues (public evidence) | Not found | UPI apps: unlabelled buttons, PIN reset hard to reach by voice, vague errors, no audio/haptic feedback on QR scan (X1, study of 3 UPI apps incl. B) | Not found | Same study covered Wallet D's UPI flow (X1) | Not found |

## Heuristic scores

Only scored where public evidence exists. 1 = poor, 5 = strong. **Low confidence**: desk evidence, not observation. "—" = needs hands-on testing.

| Heuristic | Bank A | UPI app B | Card C | Wallet D | Broker E |
|---|---|---|---|---|---|
| 4 Consistency and standards | 3 — MPIN fixed at 6 digits within the app (A1) | 2 — UPI PIN length depends on the bank, so the same app shows 4 or 6 (B1) | 2 — OTP at checkout, app approval only for some flows (C1, C2) | 2 — four different login factor sets by context (D3) | 4 — one 2FA model for all logins since 2022 (E1) |
| 5 Error prevention | — | 3 — warning before lock in some apps (B2) | — | — | — |
| 9 Help users recover from errors | 3 — MPIN reset path documented (A1) | 3 — reset avoids 24 h wait (B2) | — | 2 — failed resets lock all UPI apps for 24 h (D4) | 3 — documented OTP fallback (E3) |
| S1 Phishing resistance | 2 — OTP in registration and reset (A1) | 3 — UPI PIN never sent by SMS, but reset relies on card + OTP (B1) | 2 — SMS OTP default at checkout (C2) | 2 — OTP central to new device (D1) | 4 — app code/TOTP default (E1) |
| S2 Recovery safety | 3 — SIM + device checks (A1) | 2 — card details + OTP can reset PIN; both can be phished together (B1) | — | 2 — new device via OTP (D3) | 2 — SMS/email OTP fallback (E3) |
| S3 Transparency of risk | 3 — cooling period publicised (A2) | — | — | — | — |

Nielsen 1, 2, 3, 6, 7, 8, 10: — (need UI observation).

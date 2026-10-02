# Audit matrix

**Status: blocked — no screenshots.** All five folders in `screenshots/` (bank, upi, card, wallet, broker) were empty on 2 Oct 2026. Per the brief, I have not described what any real app does. The matrix below is the empty frame, ready to fill the moment screenshots land.

Anonymised names for anything portfolio-facing: **Bank A, UPI app B, Card C, Wallet D, Broker E.**

## How to capture (for Kumar)
- One folder per app. File names: `NN-moment-short.png`, e.g. `05-payment-step-up.png`.
- Blur names, account numbers, balances, phone numbers before saving.
- Add `notes.md` per folder: device, OS, app version, date, and what you tapped to get each screen. Time each moment with a stopwatch if you can.

## Matrix (fill per cell: factors · steps · time · key copy · fallback · a11y issues · evidence file)

| Auth moment | Bank A | UPI app B | Card C | Wallet D | Broker E |
|---|---|---|---|---|---|
| Install / first login | — | — | — | — | — |
| Device binding | — | — | — | — | — |
| App unlock | — | — | — | — | — |
| Payment / transfer | — | — | — | — | — |
| Add beneficiary | — | — | — | — | — |
| High-value transaction | — | — | — | — | — |
| Change PIN / device | — | — | — | — | — |
| Failed attempt | — | — | — | — | — |
| Lockout | — | — | — | — | — |
| Recovery | — | — | — | — | — |

## Heuristic scorecard (1–5, one line of reasoning each)

| Heuristic | Bank A | UPI app B | Card C | Wallet D | Broker E |
|---|---|---|---|---|---|
| 1 Visibility of system status | — | — | — | — | — |
| 2 Match with the real world | — | — | — | — | — |
| 3 User control and freedom | — | — | — | — | — |
| 4 Consistency and standards | — | — | — | — | — |
| 5 Error prevention | — | — | — | — | — |
| 6 Recognition over recall | — | — | — | — | — |
| 7 Flexibility and efficiency | — | — | — | — | — |
| 8 Aesthetic and minimal design | — | — | — | — | — |
| 9 Help users recover from errors | — | — | — | — | — |
| 10 Help and documentation | — | — | — | — | — |
| S1 Phishing resistance | — | — | — | — | — |
| S2 Recovery safety | — | — | — | — | — |
| S3 Transparency of risk | — | — | — | — | — |

## What to look for (checklist, not findings)
- OTP as the main dynamic factor where a device-bound option exists.
- PIN lengths that differ across the same group's apps (4 vs 6).
- Step-up with no reason given.
- Dead ends: "Try again later" with no next step or contact.
- No path when biometrics fail or aren't enrolled.
- Different words for the same action (Verify / Authenticate / Confirm / Authorise).
- Phishing-prone patterns: OTP screens without "never share", links in SMS, OTP read aloud by agents.
- Timers that expire with no way to extend (WCAG 2.2.1).
- Biometric prompt with no screen-reader label.

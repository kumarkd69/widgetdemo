# Components

All components use semantic tokens (`tokens.json`). Minimum target 48×48. Every text slot is tested in English, Hindi and Kannada (Indic line height 1.6). Screen-reader scripts live in `a11y.md`.

## 1. Auth Sheet
- **Anatomy:** handle · header (title + close) · Trust Meter slot · Transaction Summary slot · factor slot (Biometric / PIN / OTP / Passkey) · footer (secondary link "Try another way").
- **Variants:** `tier` = Low / Medium / High / Blocked · `factor` = Biometric / PIN / OTP / Passkey / Push.
- **States:** opening, waiting for factor, verifying (spinner, no dismiss), success (hands off to Success Confirmation), error.
- **Behaviour:** Bottom sheet, max 90% height; never full-screen except Blocked. Factor swap happens inside the sheet (no new screen). Back = cancel with confirm if money is in flight.
- **Content:** Title is the verb + amount: "Pay ₹450". Never "Authenticate".

## 2. Trust Meter (signature)
- **Anatomy:** lock glyph · 4-segment bar · tier label · reason (one line).
- **Variants:** `tier` = Low / Medium / High / Blocked · `size` = Compact (inline) / Full (in sheet).
- **Redundancy:** colour + icon shape + number of filled segments + text label. Blocked adds diagonal stripes.
- **Behaviour:** Static; animates fill once on open (reduced motion: no animation). Tap opens "Why this check?" explainer.
- **Content:** Reason ≤ 48 characters in English, from `explanation_id`.

## 3. Biometric Prompt
- Wraps the OS biometric dialog. Pre-prompt text in our sheet says what will happen.
- **States:** ready, scanning, matched, no match (shake + MSG_BIO_RETRY), unavailable.
- After 2 fails → Fallback Chooser automatically.

## 4. Passkey Prompt
- Web (net banking) and app. Pre-prompt: "Use your passkey to sign in to orbit.bank.in". Shows domain.
- **States:** ready, OS dialog open, success, cancelled → "Approve on your phone" option.

## 5. PIN Pad
- **Variants:** `length` = 4 / 6 · `scramble` = off / on · `type` = App PIN / UPI PIN.
- **Anatomy:** dots row · keypad 3×4 (1–9, blank, 0, delete) · "Forgot PIN?".
- **States:** empty, typing, error (dots shake, MSG_PIN_WRONG), locked.
- **Behaviour:** Auto-submits on last digit. Keys 64dp. Scramble shuffles digits once per open (not per tap). Haptic on each key.
- **UPI PIN:** behaviour per NPCI library; we only style the wrapper (R22).

## 6. OTP Input
- One text field, `autocomplete="one-time-code"`, shown as 6 boxes.
- **Anatomy:** label · boxes · never-share warning (always visible) · resend timer · "Approve in app instead" (if bound).
- **States:** empty, filling, autofilled, error, expired.
- **Behaviour:** SMS Retriever / iOS autofill. Resend at 30 s, max 3. "Need more time?" extends expiry.

## 7. Device Binding Status
- Row/card showing this device: name, bound since, last used, key status (OK / Missing / Revoked). Action: "Remove this device".

## 8. Step-up Explainer
- Appears above the factor in Medium and High. Icon + one-sentence reason + "Why?" link.
- Never uses red for Medium. High shows cooling info if any.

## 9. Fallback Chooser
- List of up to 3 options, in this order: other strong factor → OTP (if allowed by tier) → "Get help".
- Each option: icon, label, one-line hint. Last option is always a human route.

## 10. Cooldown Timer
- Countdown + reason + what you can do now. Shows end time ("until 9:42 PM") as well as countdown, so screen readers don't need live updates.

## 11. Lockout Card
- **Anatomy:** Blocked Trust Meter · title · reason · end time · primary "Reset PIN" or "Book a video call" · secondary "Call us".
- Never a dead end.

## 12. Recovery Entry
- Start of the Recover pattern. Lists the ways back that this account qualifies for, strongest first.

## 13. Success Confirmation
- Large tick, amount, payee, time, reference. Sound + haptic. "Share receipt". Variants: Payment / Approved / Exempt (lighter).

## 14. Transaction Summary Card
- Payee (name, verified badge, handle or masked account), amount (₹ with Indian grouping), source, date/time, FX line for cross-border.

## 15. Language Switcher
- Chip group: English / हिन्दी / ಕನ್ನಡ. Labels in their own script. Persists per user.

## 16. Inline Error
- Icon + text under the field. `feedback/error` on `feedback/error-bg`. Announced politely.

## 17. Toast
- Bottom, 4 s, pausable on focus. Never carries the only copy of important info.

## Shared primitives
Button (Primary / Secondary / Tertiary; sizes L 56 / M 48), Icon set (lock states, fingerprint, face, key, phone, sms, shield, call, clock, globe, info).

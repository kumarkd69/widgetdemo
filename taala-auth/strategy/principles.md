# Principles

Six principles. Evidence is desk research and regulation until interviews run.

### 1. Risk decides friction
- **In practice:** Low-risk = one touch. Friction only grows with risk, and each step up adds one thing, never a restart.
- **Settles:** Should a ₹450 kirana payment ask for a PIN when biometrics work? No — DK + BIO is two categories (UPI-01).
- **Evidence:** ¶8 allows extra checks; ¶6 sets the floor (R4, R9). Insight I1.

### 2. Same risk, same pattern
- **In practice:** One Auth Sheet, one Trust Meter, one set of words across UPI, cards, bank, wallet, invest.
- **Settles:** Cards wanted their own 3DS-style full screen. No — the in-app push opens the same Auth Sheet.
- **Evidence:** Orbit scenario O1–O3; insight I3; H4.

### 3. Never a dead end
- **In practice:** Every failure shows the next option. The last option is always a person, with a time and a way to reach them.
- **Settles:** What happens after 3 wrong PINs? Lockout Card with a cooldown timer **and** "Talk to us" — never just "Try later".
- **Evidence:** Insight I4; Meena and Lakshmi proto-personas.

### 4. Phishing-resistant by default; OTP is a fallback
- **In practice:** Default dynamic factor = device-bound key (or passkey on web). OTP appears only when that can't work, always with "never share" copy.
- **Settles:** Keep OTP for new-device bind? Only combined with PIN + biometric enrol, and never during a SIM change window (DEV-01/02).
- **Evidence:** ¶5(f) keeps OTP valid; R5, R24; insight I2.

### 5. Explain, don't scare
- **In practice:** One sentence, why this check, in the user's language. No red unless money is actually at risk. No technical words ("authentication", "token").
- **Settles:** Do we say "SIM changed"? Yes, plainly: "Your SIM changed recently, so we're being careful for 2 days."
- **Evidence:** R10, H1, insight I8.

### 6. Inclusive by default
- **In practice:** Works without biometrics, on Android Go, offline-tolerant for small UPI, full screen-reader support, English + Hindi + Kannada, no timer without an "I need more time" option.
- **Settles:** Split 6-box OTP input? Visually yes; technically one field, so TalkBack reads it as one (H9).
- **Evidence:** Personas 5a/5b; WCAG 2.2 (2.2.1 Timing Adjustable, 2.5.8 Target Size).

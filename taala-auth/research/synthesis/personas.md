# Personas

**All are proto-personas** — built from the brief and desk research, not interviews. Validate with the research plan (`research-plan.md`) before calling them personas.

## External

### 1. Meena, 58 — "I don't want to be the person who gets cheated" (proto-persona)
- **Context:** Retired teacher, Dharwad. Pays the kirana, milk and medicine by UPI. Son set up the app.
- **Device:** Mid-range Android, 3 years old. Fingerprint sensor works most days, not when hands are wet or dry. Weak data at the market.
- **Languages:** Kannada first, reads English slowly, some Hindi.
- **Goals:** Pay small amounts fast; never lose money; not look confused at the counter.
- **Fears:** Fraud calls, "KYC expiry" SMS, pressing the wrong button.
- **Current auth pain:** Fingerprint fails; app says "Authentication failed" with no next step; she enters the UPI PIN slowly while people wait.
- **What "secure" means to her:** "The app tells me it's safe, in my language."

### 2. Arjun, 29 — "Don't make me prove I'm me five times" (proto-persona)
- **Context:** Software engineer, Bengaluru. UPI daily, credit card online, trades weekly.
- **Device:** Flagship Android plus a laptop. Uses passkeys on Google and GitHub.
- **Languages:** English, Hindi, Kannada (spoken).
- **Goals:** Speed; one way to approve everything; control over limits.
- **Fears:** Account takeover; trading app blocked during market hours.
- **Current auth pain:** OTP for every card payment; different PIN rules per app; new-device lockouts.
- **"Secure":** "Phishing-proof keys, not codes I can be tricked into reading out."

### 3. Imran, 41 — "My phone is the shop's phone" (proto-persona)
- **Context:** Small shop owner, Hubballi. Receives 100+ UPI payments a day; pays suppliers.
- **Device:** One Android, dual SIM; family members use it in the evening.
- **Languages:** Hindi, Kannada, Dakhni Urdu; English numbers only.
- **Goals:** Collect payments without interruptions; pay suppliers in bulk; keep family from spending by mistake.
- **Fears:** Wrong SIM bound; son paying from his account; supplier scams.
- **Current auth pain:** Device binding tied to one SIM; when SIM 2 is active the app re-verifies.
- **"Secure":** "Only I can send money. Anyone can receive."

### 4. Priya, 34 — "My Indian SIM is in a drawer in Dubai" (proto-persona)
- **Context:** NRI marketing manager, Dubai. Uses Indian credit card for US/UK websites and Indian bills.
- **Device:** iPhone with UAE eSIM; Indian SIM off most of the time.
- **Languages:** English, Hindi.
- **Goals:** Pay from abroad without hunting for the Indian SIM.
- **Fears:** Card blocked abroad; missing an OTP during a course sale deadline.
- **Current auth pain:** OTPs go to the Indian number; email OTP not always offered.
- **"Secure":** "Approve in my bank app wherever I am."

### 5a. Ravi, 45, low-vision TalkBack user (proto-persona)
- **Context:** Accountant, Mysuru. Uses TalkBack and magnification.
- **Goals:** Pay and approve without sighted help.
- **Pain:** Unlabelled biometric icons; OTP timers that expire while TalkBack reads; split OTP boxes.
- **"Secure":** "I can do it myself, so nobody else learns my PIN."

### 5b. Lakshmi, 38, construction worker whose fingerprint doesn't register (proto-persona)
- **Context:** Mason, Bengaluru outskirts. Worn fingerprints.
- **Goals:** Pay without being made to feel the phone "rejects" her.
- **Pain:** Repeated fingerprint failures, then lockout. Face unlock unreliable in low light.
- **"Secure":** "A PIN I know works every time."

## Internal (platform customers)

### 6. Dev, product engineer on Orbit Cards
- **Needs:** One SDK; a clear request/response contract; components that already pass a11y; a kill switch; migration checklist.
- **Pain today:** Builds auth screens from scratch; every compliance review is new.

### 7. Farah, fraud and risk analyst
- **Needs:** Tune thresholds without a release; simulate a transaction and see the user experience; see false-positive rates.
- **Pain today:** Rules live in five codebases.

### 8. Suresh, compliance officer
- **Needs:** Proof that every transaction had two distinct factors with one dynamic (¶6), or an exemption code; exportable evidence.
- **Pain today:** Asks each team for screenshots before audits.

### 9. Anjali, customer support agent
- **Needs:** See why a user was locked out, what they tried, and what they can do next; a safe way to help without asking for OTPs.
- **Pain today:** No shared view; users read OTPs to agents (unsafe).

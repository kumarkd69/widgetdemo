# Scope

**The bet:** If every Orbit product asks the same policy engine "how should this person prove it's them?" and shows the answer through the same components, then legitimate users will pass first time more often, OTP phishing and SIM-swap fraud will fall, and compliance can prove ¶6 for every transaction.

## MVP (Pilot + Dual-run)
- Policy engine contract v1 (request/response, explanation IDs, audit log).
- Components: Auth Sheet, Trust Meter, Biometric Prompt, PIN Pad, OTP Input, Fallback Chooser, Lockout Card, Success Confirmation, Inline Error.
- Patterns: Approve a payment, Fall back.
- One product, one moment: UPI P2M/P2P, A0–A1, Low tier.
- English, Hindi, Kannada.

## Next
- Medium and High tiers; Step-up Explainer; Cooldown Timer; scam-call warning.
- Device binding v2 (device key), Bind a new device, Recover.
- Cards CNP domestic + cross-border in-app approval (R13).
- Policy console for Risk.

## Later
- Net banking passkeys + `.bank.in` trust cue.
- Wallet and Invest.
- Approve on another device (QR).
- Shared-phone profiles (Imran).
- More languages (Tamil, Telugu, Marathi, Bengali).

## Non-goals
- We don't build the fraud model; we define its contract (signals in, tier out).
- We don't change NPCI's UPI PIN rules or card networks' 3DS protocol.
- We don't remove SMS OTP.
- We don't store biometrics, ever.
- Card-present / PoS flows are out of scope.
- No marketing launch design; only in-product enrolment.

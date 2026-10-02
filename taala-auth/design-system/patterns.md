# Patterns

Each pattern is product-agnostic. Products only change the Transaction Summary content.

## Approve a payment
1. User taps Pay → app calls policy engine (`/v1/auth/decide`).
2. Auth Sheet opens with Trust Meter (tier from response) + summary.
3. Primary factor from `plan.primary` runs in the sheet.
4. Success → Success Confirmation. Failure → Fall back.
**Rule:** Low tier shows no explainer; Medium/High always do.

## Step up
1. Engine returns a higher tier than the product's default → Step-up Explainer appears above the factor.
2. Extra factor runs in the same sheet (e.g. PIN after biometric for High).
3. Cooling info shown before the user commits, not after.

## Fall back
1. Factor fails per ladder → Fallback Chooser lists `plan.fallbacks` in order.
2. Last row always "Get help".
3. Choosing a fallback calls `/v1/auth/fallback` so the engine can re-check tier.

## Recover
1. Entry from Lockout Card, "Forgot PIN" or Settings.
2. Recovery Entry lists qualifying routes: DK + BIO on bound device → card check + OTP + BIO → video KYC.
3. New PIN → 6 h cooling on new payees → notify all devices.
**Rule:** No OTP-only path (ADR-006).

## Bind a new device
1. "New phone? Let's set it up safely."
2. If an old bound device exists: approve on old device (push or QR).
3. Else: OTP + PIN + biometric enrol; if SIM changed < 48 h → Blocked → video KYC.
4. Generate device key; show Device Binding Status; 12 h new-payee lock.

## Cross-border card approval
1. Overseas merchant/acquirer requests AFA → ACS → push to Orbit app.
2. Auth Sheet shows merchant, local currency + ₹ estimate, "Payment abroad" (Medium).
3. DK + BIO or DK + PIN. Never SMS-first when SIM absent.
4. Fallback: Approve on another device; then call-back.

## Approve on another device
1. Desktop/browser shows a QR + 6-character code, and the domain.
2. User scans in Orbit app on bound phone → Auth Sheet with the browser's request.
3. Phone shows matching code; user confirms it matches (anti-relay).
4. Approve with DK + BIO/PIN. Browser updates.

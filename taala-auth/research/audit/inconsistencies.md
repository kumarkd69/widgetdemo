# Inconsistencies

**Status: blocked — no screenshots (see `audit-matrix.md`).** No real-app findings are written here.

What exists instead, so later phases aren't stuck:

## A. The Orbit brief's internal problem (fictional scenario, not research)
These come from CLAUDE.md's scenario. In the case study they are presented as **the brief**, never as audit results.

| # | Inconsistency inside Orbit (scenario) | Why it matters | Type | Severity |
|---|---|---|---|---|
| O1 | Six OTP screen patterns across five products | Users can't learn what a real OTP screen looks like, so a fake one is easy to accept | Security, usability | High |
| O2 | Three PIN designs (4-digit, 6-digit, alphanumeric) | Recall errors and lockouts; support load | Usability | Medium |
| O3 | Two biometric prompts with different wording | Same moment feels different; trust drops | Consistency | Medium |
| O4 | No shared fallback logic | Some flows dead-end when biometrics fail | Usability, accessibility | High |
| O5 | No shared risk engine contract | Same risk gets different friction per product; compliance can't prove ¶6 uniformly | Compliance | High |
| O6 | SMS OTP is the dynamic factor everywhere | Exposed to SIM swap and OTP phishing; fails for NRIs with SIM off | Security, inclusion | High |

## B. Hypotheses the audit should test (from desk research, unconfirmed)
Each needs a screenshot before it becomes a finding.
- H-A1: At least one app shows a step-up with no reason.
- H-A2: At least two apps use different PIN lengths for similar moments.
- H-A3: At least one app has no path when fingerprint fails, other than retry.
- H-A4: OTP screens don't all carry a "never share this" warning.
- H-A5: Lockout screens give no time or contact.
- H-A6: Different verbs for the same action across apps.

## When screenshots arrive
I'll replace section B with 10–15 findings, each with: evidence file, why it matters, type, severity, and the Taala rule that fixes it.

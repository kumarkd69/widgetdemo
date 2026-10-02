# Policy engine API contract (v1)

## `POST /v1/auth/decide`
Called by a product before any auth moment.

### Request
```json
{
  "request_id": "b6f1c1e2-7f1a-4c55-9d1e-2a9f3c0e1a77",
  "idempotency_key": "upi-pay-20261003-214201-8821",
  "product": "upi",
  "moment": "payment",
  "transaction": {
    "type": "UPI_P2M",
    "amount_paise": 45000,
    "currency": "INR",
    "payee": { "id_hash": "a91f…", "known_since_days": 210, "verified_merchant": true },
    "cross_border": false,
    "afa_requested_by_merchant": null,
    "mandate": null
  },
  "context": {
    "device": { "binding_id": "dev_7Qx…", "key_status": "ok", "integrity": "pass", "biometric_available": true },
    "sim": { "status": "present", "changed_hours_ago": null },
    "session_age_s": 140,
    "locale": "kn-IN",
    "accessibility": { "screen_reader": false },
    "on_active_call": false,
    "network": "online",
    "local_time": "2026-10-03T21:42:01+05:30"
  }
}
```

### Response
```json
{
  "decision_id": "dec_01J9…",
  "tier": "LOW",
  "exemption_code": null,
  "explanation_id": "EXP_LOW_KNOWN_SMALL",
  "plan": {
    "primary": [
      { "factor": "DK", "category": "has", "dynamic": true },
      { "factor": "BIO", "category": "is", "dynamic": false }
    ],
    "fallbacks": [
      [ { "factor": "DK", "category": "has", "dynamic": true }, { "factor": "UPIN", "category": "knows", "dynamic": false } ],
      [ { "factor": "ASSISTED", "route": "callback" } ]
    ],
    "challenge": { "nonce": "q2Lr…", "binds": ["amount", "payee", "decision_id"], "expires_s": 120 }
  },
  "cooling": null,
  "limits": { "attempts_per_factor": { "BIO": 2, "UPIN": 3 } },
  "rule_version": "2026.10.1",
  "ui": { "trust_meter_segments": 1, "show_explainer": false }
}
```

### How the UI uses each field
| Field | UI use |
|---|---|
| `tier` | Trust Meter variant; Auth Sheet variant |
| `explanation_id` | Look up copy in user's `locale` (EN/HI/KN); shows in Trust Meter + Step-up Explainer |
| `plan.primary` | Which factor component(s) to render, in order |
| `plan.fallbacks` | Fallback Chooser options, in order; last always assisted |
| `plan.challenge` | Passed to the device key signer; UI shows nothing |
| `cooling` | Cooldown notice before commit (`{ "cap_paise": 2500000, "until": "…" }`) |
| `limits.attempts_per_factor` | Tries-left text |
| `exemption_code` | Exempt confirmation variant; no meter |
| `ui.show_explainer` | Step-up Explainer on/off |

## `POST /v1/auth/fallback`
Body: `{ decision_id, failed_factor, reason }` → returns a new plan (tier may rise).

## `POST /v1/auth/result`
Body: `{ decision_id, outcome: "success|failed|abandoned", factors_used: [...], signature_ref }` → `204`. Feeds evidence log.

## Error codes
| Code | HTTP | Meaning | UI |
|---|---|---|---|
| `TAALA_DEVICE_UNTRUSTED` | 403 | Integrity fail | Blocked → assisted |
| `TAALA_KEY_MISSING` | 409 | DK missing (reinstall) | Bind new device |
| `TAALA_RATE_LIMITED` | 429 | Too many attempts | Lockout Card |
| `TAALA_DECISION_EXPIRED` | 410 | Challenge expired | Restart sheet silently once |
| `TAALA_ENGINE_UNAVAILABLE` | 503 | Engine down | Fail **closed** to Medium plan cached in SDK (DK + PIN); never skip auth |
| `TAALA_BAD_REQUEST` | 400 | Contract error | Dev-only error |

## Idempotency
`idempotency_key` per money movement; same key within 24 h returns the same `decision_id`. Prevents double debit on retries.

## Latency budget
Engine p50 ≤ 80 ms, p99 ≤ 300 ms. SDK timeout 800 ms → cached fallback plan.

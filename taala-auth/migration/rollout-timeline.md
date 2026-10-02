# Rollout timeline

Quarters are a plan (target), starting Q3 FY27 (Oct 2026).

```mermaid
gantt
  title Taala rollout (target)
  dateFormat YYYY-MM-DD
  section Platform
  Engine contract v1 + SDK         :p1, 2026-10-05, 60d
  Design system v1                 :p2, 2026-10-05, 60d
  Policy console                   :p3, after p1, 45d
  section Compliance
  DK-as-dynamic-factor sign-off    :c1, 2026-10-15, 45d
  Evidence log audit               :c2, after p1, 30d
  section UPI
  Pilot 5% (Low tier)              :u1, 2026-12-15, 45d
  Dual-run all tiers               :u2, after u1, 60d
  Default switch                   :u3, after u2, 30d
  section Cards
  Cross-border push approval       :k1, 2026-12-01, 60d
  Domestic CNP dual-run            :k2, after k1, 60d
  Default switch                   :k3, after k2, 30d
  section Bank
  Transfers dual-run               :b1, 2027-02-01, 60d
  Net banking passkeys             :b2, after b1, 60d
  section Wallet and Invest
  Wallet                           :w1, 2027-04-15, 60d
  Invest                           :i1, 2027-05-15, 60d
  section Support and comms
  Agent console + runbooks         :s1, 2026-11-15, 45d
  In-app education                 :m1, 2026-12-15, 120d
  section Deprecation
  Legacy removal                   :d1, 2027-08-01, 60d
```

## Gates
| Gate | When | Who decides | Evidence |
|---|---|---|---|
| G0 Foundations ready | end Nov 2026 | Auth Council | Contract, components, compliance memo |
| G1 Pilot go | mid Dec 2026 | Auth Council + UPI lead | Kill switch drill, dashboards live |
| G2 Dual-run go | Feb 2027 | Auth Council | Pilot metrics vs guardrails |
| G3 Default switch | per product | Product lead + Risk + Compliance | 4 weeks dual-run within guardrails |
| G4 Deprecation | Aug 2027 | Auth Council | 95% of moments on Taala |

## Owners
Platform (engine, SDK, components) · UPI, Cards, Bank, Wallet, Invest product teams · Risk (rules, thresholds) · Compliance (sign-off, evidence) · Support (console, runbooks) · Marketing/comms (in-app education, no launch campaign).

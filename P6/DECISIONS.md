# P6 Decision log

(ADR-style: options, trade-offs, consequences)

## D1 · Concept B (quote card, then one tap) chosen · Phase C
Options: A live bidding (17/35), B quote card + one tap (33/35), C concierge hotline (23/35).
Trade-off: B needs operator price bands and live fleet data; accepted because bidding is too slow in an emergency and a hotline keeps the verbal-price trust gap.
Consequence: SMS and call fallback inside B; no symptom checker (we never diagnose); price bands shown as "cap" and tagged [VERIFY] per state.

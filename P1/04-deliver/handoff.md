# P1 Rein · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Payment row | Height 56, padding 12, radius 12, border 1 theme/border; status pill glyph + word; amounts in ₹ with Indian grouping. |
| Hold card | Border 2 theme/warning, radius 20, padding 20. Title '! Held for your OK: ₹x'. |
| Why card | Three lines max: request, checks (✓ list), agent. |
| Mandate envelope | Segments spent / reserved / left; labels carry amounts. |
| Approve once / Block | Same size, same weight, no default focus. |

| Event | Properties | When |
|---|---|---|
| mandate_created | agent_id, per_payment_cap, monthly_cap, merchants | Confirm PIN |
| payment_seen | payment_id, amount, within_limit | Feed row shown |
| why_opened | payment_id | Why card opened |
| hold_shown / hold_decision | payment_id, channel, decision, ms | Hold flow |
| pause_all / revoke | agent_id, ms | Pause or revoke |
| dispute_started / dispute_outcome | payment_id, reason, outcome | Dispute flow |
| expected_marked | payment_id, value | Weekly review (later) |

| Story | Acceptance criteria |
|---|---|
| Mandate | Given caps and merchants, when I confirm with PIN, then the mandate is active and the worst case is shown in ₹. |
| Why | Given a settled payment, when I open it, then I see the request, the checks and the agent in under 1 second. |
| Hold | Given an unusual payment, then it is held, I get one prompt in chat and in app, and Approve once and Block are equal in size. |
| Pause | Given any state, when I tap Pause all, then no new payment is approved within 5 seconds and I see a confirmation. |
| Dispute | Given a settled payment, when I send a dispute, then the bank receives mandate, request, checks and timeline with a case id. |


# P2 Nod · Validate and plan (plans only; no tests run yet)

## Specs, events, acceptance criteria
_Hero screens are marked Ready for dev in Figma._ [Ready for review]

| Component | Spec |
|---|---|
| Consent row | Height 56, padding 12, radius 12, border 1 theme/border. Status pill: glyph + word. States: Active, Stopped, Review. |
| Receipt card | Border 2 theme/primary, radius 20, padding 20. Fields: company, time (9:42 PM), receipt ID. |
| Primary button | Height 48, radius 12, fill theme/primary, label theme/on-primary, full width. |
| Allow / Don't allow | Same size and style; neither pre-focused. |

| Event | Properties | When |
|---|---|---|
| link_started / link_completed | method, time_ms | Link flow |
| consent_viewed | company_id, purpose_id | Detail opened |
| withdraw_confirmed | company_id, consent_age_days | Withdraw tapped |
| receipt_received | company_id, wait_hours | Company confirms |
| escalation_started | company_id, day | Grievance opened |
| request_decision | company_id, decision | Allow / refuse |
| guardian_decision | decision | Parent decides |

| Story | Acceptance criteria |
|---|---|
| Withdraw | Given an active consent, when I tap Withdraw and confirm, then status becomes Withdrawal sent and the company is notified within 1 minute. |
| Receipt | Given the company confirms, then I see a receipt with time and ID within 1 minute and get one notification. |
| Waiting | Given 7 days pass with no confirmation, then the grievance option is highlighted and a Board path is offered. |
| New request | Given a request, both buttons are equal size and neither is pre-selected. |
| Offline | Given no connection, I see my last saved list with a banner and withdrawals are disabled. |


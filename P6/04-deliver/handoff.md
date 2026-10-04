# P6 Sooner · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Quote card | Radius 16, padding 16; status pill glyph + word; states Offered, Expired, Above cap; price always a cap in ₹ with Indian grouping. |
| Need row | Height 56; a switch with state read aloud; plain-word label, never a condition. |
| Crew card | Name, role, certificate status; 'checked' only when a source exists [VERIFY]. |
| Quote gauge | Bar ₹0 to ₹6,000; black tick at the cap; fill blue within cap, red above; text alternative required. |
| Help button | Accent red with white text only; full width; first focus. |

| Event | Properties | When |
|---|---|---|
| help_tapped | source | Help now |
| pickup_confirmed | accuracy_m | Pickup |
| need_selected | need | Needs |
| quote_viewed / quote_confirmed | kit, cap, eta_min | Quote |
| trip_started / trip_ended | distance_km | Trip |
| bill_checked | amount, cap, above_cap | Bill |
| dispute_raised | reason | Bill |

| Story | Acceptance criteria |
|---|---|
| Help | Given the home screen, one tap starts a request and Call 108 stays visible. |
| Quote | Given the needs, the quote shows kit, cap and ETA before dispatch; expired quotes are never used. |
| Never diagnose | Given any screen, no question asks for a condition or symptom. |
| Weak signal | Given no data, ETA and driver number arrive by SMS. |
| Bill | Given a bill above the cap, it is flagged and the family can pay the quoted amount. |


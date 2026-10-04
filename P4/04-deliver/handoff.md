# P4 Passline · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Notice row | Height 56, padding 12, radius 12; plate, time left, amount; status pill glyph + word. States: Open, Paid, Disputed. |
| Clock bar | Three labelled segments: 0-72 h normal fee, after 72 h double, 15 days VAHAN. Marker shows now. |
| Alert | One sentence: plate, amount, deadline. Never contains a link other than the app. |
| Verified pill | Appears only after a successful official check. |
| Pay and dispute buttons | Equal size, adjacent, no pre-selection. |

| Event | Properties | When |
|---|---|---|
| vehicle_added | method | OTP verified |
| alert_received / alert_opened | ms_to_open | Alert |
| notice_verified | result | Verification |
| passage_viewed | has_photo | Passage opened |
| notice_paid | amount, hours_left | Pay |
| dispute_filed | reason, hours_left | Filed |
| fake_notice_flagged | source | Report |

| Story | Acceptance criteria |
|---|---|
| Alert | Given a failed payment, an alert shows plate, amount and deadline within 5 minutes of the feed. |
| Clock | Given an open notice, the 72-hour clock is visible without scrolling. |
| Verify | Given a notice, the Verified pill shows only after an official check passes. |
| Equal ease | Given a notice, Pay and Dispute are the same size and weight. |
| Dispute | Given a reason, the evidence checklist lists exactly the items required and can file within 72 hours. |


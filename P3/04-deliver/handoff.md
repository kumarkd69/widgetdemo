# P3 Mend · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Home button | Height 72, radius 12, fill theme/primary, label H3 on-primary, full width. |
| Channel row | Height 56, status pill glyph + word. States: Done, Waiting, Next. |
| Golden-hour ring | 170 px, 14 px band, arc = time left of 60 min; text alternative required; no animation. |
| Script card | Border 2 theme/primary, max 5 lines. |
| Evidence row | Auto-added items show ✓ Added. |

| Event | Properties | When |
|---|---|---|
| start_tapped | ms_since_open | Home button |
| triage_answer | answer | Triage |
| call_1930_tapped | ms_since_open | Call button |
| number_saved | channel | Number saved |
| bank_message_copied | - | Copy message |
| evidence_added | type, auto | Evidence |
| update_logged | channel | Case river |
| helper_invited | scopes | Invite sent |

| Story | Acceptance criteria |
|---|---|
| Start | Given the app is open, the start button is visible without scrolling and starts the flow in one tap. |
| Call | Given the Call button, a tap opens the dialler with 1930 pre-filled. |
| Save | Given a reporting number, I can save it now or later; it appears on the case river. |
| Honest | Given any screen about recovery, no copy promises a refund. |
| Offline | Given no connection, I can still call, and entries sync when I reconnect. |


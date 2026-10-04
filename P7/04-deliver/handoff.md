# P7 Span · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Route card | Radius 16, padding 16; status pill glyph + word; states Available, Unknown, Not available; deadline tagged 'confirm with insurer' until verified. |
| Timeline step | Height 56; date in full; days left with ! when under 30. |
| Credit row | Member, years of waiting-period credit, moratorium years; 'Verified' or 'Estimated' label. |
| Coverage bridge | Piers left and right; dashed arch when a gap exists; solid when bridged; text alternative required. |
| Reminders | Max 3 per week; calm copy; one action each. |

| Event | Properties | When |
|---|---|---|
| invite_opened | source | Invite |
| dates_confirmed | days_to_exit | Confirm |
| cliff_viewed | days_to_cliff | Timeline |
| route_viewed / route_chosen | route, state | Compare |
| checklist_item_added | item | Checklist |
| application_submitted | route, days_before_cliff | Submit |
| reminder_sent / reminder_opened | days_before | Reminders |

| Story | Acceptance criteria |
|---|---|
| Date | Given an exit date, the timeline shows today, act-by and cover end in full dates. |
| Keep | Given a member, credit is shown as a number with Verified or Estimated. |
| Routes | Given three routes, each shows state, credit and deadline; unverified deadlines say 'confirm with insurer'. |
| Health data | Given the application, health questions appear last and only if required. |
| Reminders | Given a cliff date, reminders go at 45, 30 and 7 days and never more than 3 a week. |


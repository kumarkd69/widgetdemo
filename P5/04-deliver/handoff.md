# P5 Fineprint · Validate and plan (plans only; nothing tested yet)

## Specs, events, acceptance criteria
_Hero frames carry '· Ready for dev' in their names._ [Ready for review]

| Component | Spec |
|---|---|
| Plan row | Height 56, padding 12, radius 12; premium, cover, limits count. States: Listed, Selected, Data missing. |
| Not-covered card | Border 2 theme/warning, radius 20; title '! What this does NOT cover'; list of limits in ₹. |
| You-pay card | Border 2 theme/primary; amount in ₹ with Indian grouping; assumptions line. |
| Coverage shape | Five axes; dashed outer = need, filled = have; labels with ✓ ! ✕; text alternative required. |
| Rule banner | Always above any ranked list: 'Ranked by open rules. No one pays to be higher.' |

| Event | Properties | When |
|---|---|---|
| needs_started / needs_completed | questions_answered, ms | Questionnaire |
| shortlist_viewed | rule_version, plans_count | Shortlist |
| limits_viewed | plan_id | Not-covered opened |
| compare_viewed | plan_ids | Compare |
| simulator_run | scenario, plan_ids | Simulator |
| rules_viewed | rule_version | Rules page |
| advisor_booked | language, slot | Advisor |

| Story | Acceptance criteria |
|---|---|
| Needs first | Given the start screen, no plan is shown before at least two needs answers. |
| Not covered first | Given a plan, the not-covered card appears above the covered list. |
| Open rules | Given a ranked list, the rule banner and a link to rules are above it. |
| Simulator | Given a scenario, the result shows the out-of-pocket amount for each plan with its assumptions. |
| No sponsored | Given any list, no item is placed by payment; there is no sponsored label. |


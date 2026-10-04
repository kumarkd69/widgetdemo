# P7 Span · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Span
  - My cliff
    - Timeline
    - Keep and lose
  - Options
    - Compare routes
      - Migrate
      - Port
      - Fresh policy
  - Family
    - Credit per member
  - Apply
    - Checklist
    - Application
  - Reminders

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Exit | exit date, cover end date, reason | has Members | Scheduled, Window open, Passed |
| Group cover | insurer, sum insured, members, policy no. | belongs to Exit | Active, Ending, Ended |
| Member | name, age band, relationship | has Credit | Covered, Uncovered |
| Credit | years served on waiting periods, moratorium years, no-claim bonus | belongs to Member | Verified, Estimated |
| Route | migrate, port, fresh; conditions; deadline | belongs to Exit | Available, Not available, Unknown [VERIFY] |
| Application | route, documents, answers | belongs to Route | Draft, Submitted, Accepted, Declined |
| Reminder | date, channel | belongs to Exit | Scheduled, Sent |


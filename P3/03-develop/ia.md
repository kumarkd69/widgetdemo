# P3 Mend · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Mend
  - Start: I was scammed
    - First hour checklist
      - Call 1930
      - Tell bank
      - File NCRP
  - My case
    - Case river
    - Evidence vault
    - Letters
    - What to expect
  - Family
    - Helper access
  - Learn
  - Settings

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Case | opened at, amount, how it happened | has Channel reports, Evidence | Opened, Reported, Bank informed, NCRP filed, Waiting, Restored, Closed |
| Channel report | channel (1930, bank, NCRP, police), reference number, date | belongs to Case | Not started, Done, Waiting, Update received, Overdue |
| Evidence item | type, source, time, file | belongs to Case | Added, Verified |
| Letter | to, subject, body | belongs to Case | Draft, Sent |
| Status event | who, what, when | belongs to Channel report | Final |
| Helper link | helper, what they can see | Person x Person | Pending, Active, Cancelled |
| Transaction | UTR, amount, time, authorised? | belongs to Case | Reported, Frozen, Restored [VERIFY] |


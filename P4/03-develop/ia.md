# P4 Passline · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Passline
  - Vehicles
    - Notice
      - Passage evidence
      - Pay
      - Dispute
  - Fleet
    - By cab
  - Check a car
    - Dues result
  - Help
    - Is my notice real?
  - Settings

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Vehicle | plate, class, FASTag id, owner | has Notices | Active |
| Passage | gantry, time, photo, tag read | belongs to Vehicle | Recorded |
| Notice | amount, issued at, deadline, official id | has Passage | Issued, Paid, Disputed, Overdue, Recorded in VAHAN, Cancelled |
| Payment | amount, time, receipt | belongs to Notice | Done |
| Dispute | reason, evidence items, filed at, reply due | belongs to Notice | Draft, Filed, Under review, Upheld, Rejected |
| Evidence item | type, file | belongs to Dispute | Added |
| Driver link | name, vehicle, alerts on | Person x Vehicle | Pending, Active |


# P6 Sooner · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Sooner
  - Help now
    - Need questions
    - Quote card
  - My ride
    - Tracking
    - Crew card
  - Bill
    - Invoice check
    - Receipt
  - Operator console
    - Requests
    - Fleet
    - Price bands
  - Driver app
    - Job card

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Request | pickup, hospital, need flags, time | has Quote, has Trip | Draft, Quoted, Confirmed, Cancelled |
| Need | oxygen, ventilator, baby, stretcher | belongs to Request | Selected |
| Quote | kit level, price cap, ETA, distance | belongs to Request, from Operator | Offered, Accepted, Expired |
| Operator | name, licence, fleet, price band | has Vehicles | Active, Suspended |
| Vehicle | type A-D [VERIFY], kit list, crew | belongs to Operator | Free, Assigned, On trip |
| Trip | route, start, end, distance | belongs to Request | En route, Arrived, Completed |
| Invoice | amount, items, vs quote | belongs to Trip | Matches, Above quote, Disputed |


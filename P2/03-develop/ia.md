# P2 Nod · Develop

## Sitemap and object model
_What exists in the product and how things relate._ [Ready for review]

- Nod
  - Home: your consents
    - Consent detail
      - Withdraw
      - Receipt
  - Requests
    - New consent request
  - Family
    - Guardian approvals
  - Rights
    - Access / erase / grievance
  - Settings
    - Language and voice
    - Linked accounts

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Person (Data Principal) | id, mobile, language | has many Consents, may have Guardian | Active |
| Fiduciary | name, category, Nod-enabled | has many Purposes | Registered / Not enabled |
| Purpose | plain text, data categories, duration | belongs to Fiduciary | Active |
| Consent | purpose, given at, expires at | Person x Purpose | Requested, Active, Withdrawal sent, Stopped, Disputed, Expired |
| Receipt | id, stopped at, fiduciary signature | belongs to Consent | Issued |
| Rights request | type, text, due date | Person x Fiduciary | Open, Answered, Escalated |
| Guardian link | child, parent, verification | Person x Person | Pending, Verified |


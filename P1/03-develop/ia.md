# P1 Rein · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Rein
  - Agents
    - Agent profile and badge
      - Mandate
      - Pause / revoke
  - Activity
    - Payment
      - Why card
      - Dispute
  - Holds
    - Confirm or block
  - Family
    - Helper view
  - Settings

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Agent | name, provider, registry id, badge | has Mandates | Verified / Unverified |
| Mandate | cap per payment, monthly cap, merchants, categories, expiry | Person x Agent | Draft, Active, Paused, Revoked, Expired |
| Payment | amount, merchant, time, request text | belongs to Mandate | Requested, Checked, Settled, Held, Declined, Disputed |
| Why record | request, checks run, rule that allowed it | belongs to Payment | Final |
| Hold | reason, deadline | belongs to Payment | Open, Approved, Blocked |
| Dispute | reason, evidence pack, case id | belongs to Payment | Open, Refund, Rejected, Appealed |
| Family link | helper, rights (view only) | Person x Person | Pending, Active |


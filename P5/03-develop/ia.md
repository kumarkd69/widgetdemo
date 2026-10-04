# P5 Fineprint · Develop

## Sitemap and object model
_What exists and how it relates._ [Ready for review]

- Fineprint
  - My needs
    - Shortlist
      - Plan summary: not covered
      - Compare
      - Simulator
  - My cover
    - Gaps
    - Renewals
  - How we rank
    - Ranking rules
  - Talk to a person
    - Book advisor
  - Settings

| Object | Key attributes | Relations | States |
|---|---|---|---|
| Needs profile | who is covered, conditions, city, budget | has Shortlists | Draft, Done |
| Plan | insurer, sum insured, premium, limits, waiting periods, exclusions | in Shortlist | Listed |
| Shortlist | plans, rule version, date | belongs to Needs profile | Active |
| Rule | name, weight, source | used by Ranking | Published |
| Scenario | procedure, days, room, city | has Result | Draft, Run |
| Result | bill, plan pays, you pay, reasons | belongs to Scenario | Final |
| Portfolio item | policy, insurer, cover, renewal date | from Bima Pehchaan (consent) | Active, Renewal due, Lapsed |
| Advisor session | time, language, notes shared | Person x Advisor | Booked, Done |


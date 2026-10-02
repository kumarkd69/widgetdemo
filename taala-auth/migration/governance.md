# Governance

## Auth Council
- **Members:** Head of Platform (chair), Principal Designer (Taala), Head of Risk, Compliance lead, a rotating product lead, Support lead, Security architect.
- **Cadence:** fortnightly, 45 min; async RFC review between meetings.
- **Decides:** new factors, new tiers, loosening any rule, exemptions use, gate approvals, deprecations.
- **Doesn't decide:** product roadmaps; tightening rules for an incident (Risk may tighten at once and report back).

## RFC process
1. Author writes an RFC (problem, evidence, proposal, risk, regulatory basis, a11y impact).
2. 5 working days comment period.
3. Council decision recorded as an ADR in `DECISIONS.md`.
4. Design + engine changes ship behind a flag.

## Contribution model
- Product teams can propose components or patterns; Platform reviews for consistency.
- "Contribute back" bar: works in 3 languages, passes a11y, has content and analytics specs.

## Versioning and deprecation
- See `design-system/adoption-guide.md`. Component library and SDK follow SemVer; Figma library published with changelog.

## Compliance evidence
- Engine logs per transaction: request ID, tier, factors used (with categories), dynamic factor proof reference, exemption code, outcome, timestamp. Signed and retained per Orbit policy [retention period: open question].
- Quarterly evidence pack for audits: sample of logs, rule versions in force, Council minutes.
- Policy console exports a per-transaction evidence view for disputes (R16).

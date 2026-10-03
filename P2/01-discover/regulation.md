# P2 Nod · Regulation (desk research, 3 Oct 2026)

| Fact | Source | Status |
|---|---|---|
| DPDP Rules 2025 notified mid-Nov 2025. Sources say 13 or 14 Nov; brief said 13 Nov. | [Wikipedia](https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Rules,_2025), [dcomply](https://dpdpa.dcomply.in/rules/) | [VERIFY] against the gazette (MeitY) |
| Rule 4 (Consent Manager registration) operative 13 Nov 2026. | [Cyberaube](https://cyberaube.com/blog/dpdp-consent-manager-deadline-november-2026-data-fiduciary-playbook), [Maheshwari](https://www.maheshwariandco.com/blog/consent-manager-under-dpdp-rules/) | [VERIFY] |
| Most duties (notice, etc.) phase in by ~13 May 2027. | [consentos](https://consentos.in/learn/dpdp-compliance-timeline/) | [VERIFY] |
| s.6: consent is free, specific, informed, unconditional, unambiguous, by clear affirmative action. | [DPDPA s.6](https://www.dpdpa.com/dpdpa2023/chapter-2/section6.html) | Act text |
| s.6(4): withdrawal must be as easy as giving; fiduciary must stop processing within a reasonable time. | same | Act text |
| s.6(7): a person may give, manage, review, withdraw consent via a Consent Manager. | [DigitalAnumati](https://trust.digitalanumati.com/consent-manager-under-dpdp-act/) | [VERIFY] |
| s.9 + Rule 10: verifiable parental consent for under-18s; no tracking or targeted ads at children; DigiLocker-type verification allowed. | [Veritect](https://veritect.ai/digital-data-ai-law/dpdp-childrens-data-compliance-playbook) | [VERIFY]; brief's child rule confirmed in principle |
| Board set up Nov 2025 but not fully staffed; MeitY invited applications 6 May 2026; registration not operating as of Aug 2026. | [OpenIAM](https://www.openiam.com/blog/dpdp-act-consent-manager-enterprise-readiness), [compliancehub](https://compliancehub.wiki/india-dpdp-consent-manager-november-2026-phase-two-deadline-compliance/) | Secondary sources [VERIFY] |
| Min net worth ₹2 crore for Consent Managers. | brief | [VERIFY] |
| Prior art: RBI Account Aggregators act as data-blind consent managers in finance. | [Sahamati](https://sahamati.org.in/faq/) | Source read |

## Rule → design implication
| Rule | Design implication |
|---|---|
| Withdrawal as easy as giving | One-tap withdraw from the consent card, same depth as grant |
| Fiduciary must stop processing | Show a "stopped" receipt with fiduciary acknowledgement, not just a flag |
| Data-blind manager | App stores consent records only, never the data. Insights come from consent metadata |
| Child consent needs verified parent | Guardian view with identity check; child profile shows no tracking |
| Optional for companies | Many apps won't appear. Inventory must show coverage honestly |

## What the rules don't say [open questions]
- How a fiduciary proves processing stopped, and how fast "reasonable time" is.
- Whether a manager may send nudges or rank purposes (neutrality).
- Interoperability format between managers (no mandated standard found).
- Who pays a manager if companies' use is optional.
- Registration is not open yet, so Nod is a design concept, not a live service.

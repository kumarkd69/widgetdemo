# RBI Authentication Directions, 2025: notes

**Source status: read the important part first.**
This environment's network policy blocks `rbi.org.in` and `rbidocs.rbi.org.in` (checked 2 Oct 2026). I could not open the primary text. These notes come from search results over the RBI site plus law-firm and Big Four summaries. Paragraph numbers are given only where a source quoted them. Everything else is tagged **[VERIFY ¶]**: the rule is reported the same way by several sources, but its paragraph number is not confirmed.

**Before any of this is shown publicly, Kumar or I must check it against the primary text.** To unblock: add `rbi.org.in`, `www.rbi.org.in` and `rbidocs.rbi.org.in` to the environment's allowed domains, or drop the PDF in this folder.

## Sources

| ID | Source | Type |
|---|---|---|
| S1 | RBI notification page, Id 12898: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12898&Mode=0 | Primary (not opened; seen via search index) |
| S2 | RBI press release, 25 Sep 2025: https://rbidocs.rbi.org.in/rdocs/PressRelease/PDFs/PR1165D250AB0389BE4D3D9E006CECD26F928E.PDF | Primary (not opened; seen via search index) |
| S3 | Khaitan & Co, ERGO note, 3 Oct 2025: https://www.khaitanco.com/sites/default/files/2025-10/ERGO%20-%20RBI%20Authentication%20mechanisms%20for%20digital%20payment%20Directions,%202025%20-%203%20October%202025.pdf | Secondary (law firm) |
| S4 | KPMG India, Dec 2025: https://kpmg.com/in/en/insights/2025/12/reserve-bank-of-india-rbi-authentication-mechanisms-for-digital-payment-transactions-directions-2025.html | Secondary |
| S5 | Mondaq / Legal500 analysis: https://www.mondaq.com/india/new-technology/1728730/ | Secondary |
| S6 | Lawrbit analysis (cites Para 8): https://www.lawrbit.com/article/rbi-digital-payment-authentication-guidelines/ | Secondary |
| S7 | RBI circular on `.bank.in` domains, 22 Apr 2025 (RBI/2025-26/28), via Business Standard: https://www.business-standard.com/finance/news/rbi-asks-banks-to-complete-migration-to-bank-in-domain-by-october-31-2025-125042201515_1.html | Secondary report of a primary circular |
| S8 | NPCI on-device biometric for UPI, live 8 Oct 2025, via Upstox: https://upstox.com/news/personal-finance/latest-updates/how-to-use-face-and-fingerprint-for-faster-upi-payments-6-key-fa-qs-you-should-know/article-182641/ | Secondary |
| S10 | Veritect compliance playbook (quotes Direction 9(2), refers to Direction 10): https://veritect.ai/digital-data-ai-law/rbi-auth-mechanisms-compliance-playbook | Secondary (quotes text) |
| S11 | RBI Annual Report 2024-25 figures, via Corbado: https://www.corbado.com/blog/rbi-2fa-directives | Secondary |
| S12 | Bloomberg on RBI fraud data: https://www.bloomberg.com/news/articles/2024-05-30/online-payment-frauds-jump-over-400-in-india-rbi-data-shows | Secondary (news) |
| S9 | RBI FAQ, device-based tokenisation: https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=2917 | Primary (not opened) |

## Identity of the document
- Title: Reserve Bank of India (Authentication mechanisms for digital payment transactions) Directions, 2025. (S1, S2)
- Reference: RBI/2025-26/79. (search index over S4/S6) [VERIFY ¶ header]
- Issued: 25 September 2025. (S1, S2)
- Followed a draft framework, 31 July 2024 (Business Standard). Builds on "Framework on Alternative Authentication Mechanisms" announced earlier (S1 index).

## Summary by paragraph

### Scope and effective date — [VERIFY ¶, likely ¶2–4]
- Applies to **all Payment System Providers and Payment System Participants, banks and non-banks**. (S1, S2, S3)
- Applies to **all domestic digital payment transactions** unless specifically exempted. (S1, S3)
- Also includes instructions for **specific cross-border card transactions**, to give similar safety to online international payments with Indian-issued cards. (S1 index, S4)
- **Compliance by 1 April 2026.** (S1, S2, S3)

### Definitions — ¶5
- ¶5(f) defines the factors of authentication (cited by S6/regstreet: "two distinct factors of authentication as defined in paragraph 5(f)").
- Factors can be **something the user has, knows, or is**. Examples given in the text: password, SMS-based OTP, passphrase, PIN, card hardware, software token, fingerprint, or any other form of biometrics (**device-native or Aadhaar-based**). (S1 index)

### Principles — ¶6
1. **Minimum two factors.** All digital payment transactions are authenticated by at least two distinct factors, unless exempted. (¶6, per S6 and S1 index)
2. **One dynamic factor.** For digital payment transactions **other than card-present**, at least one factor is "dynamically created or proven, i.e. the proof of possession of the factor, being sent as part of the transaction, is unique to that transaction." (¶6, S1 index)
3. **Independence.** The factors are designed so that compromise of one does not affect the reliability of the other. (S3) [VERIFY ¶6 sub-para]

### Encouraging new factors — [VERIFY ¶, likely ¶7]
- The Directions aim to let the ecosystem use technology beyond SMS OTP. (S1, S2, S3)
- Secondary sources list biometrics, device-based tokens and cryptographic credentials as allowed alternatives. (S4, S5)
- The text does **not** name "passkeys" as far as any source quotes. Passkeys fit as "software token" + cryptographic proof of possession. [VERIFY: whether a synced passkey is accepted as a possession factor]

### Risk-based checks — ¶8
- Issuers may adopt **additional risk-based checks beyond the minimum two factors**, based on the fraud-risk perception of the transaction. (S2; ¶8 per S6)
- Signals named by commentators: device attributes, location, transaction history, behaviour. (S6) These examples are secondary; the RBI text may not list them. [VERIFY]

### Interoperability and open access — [VERIFY ¶, likely ¶9]
- Authentication and tokenisation services should be interoperable and accessible across platforms and apps, whatever the device or OS. (S6)
- Issuers should offer tokenisation to all token requestors for all use cases or channels. (S4 / taxmann)

### Cross-border card-not-present — ¶10 (per S10; [VERIFY])
- **By 1 October 2026**, card issuers must put in place a mechanism to **validate AFA on non-recurring cross-border CNP transactions when the overseas merchant or acquirer asks for it**. (S2, S3)
- Some commentators say issuers must also apply risk-based authentication to all cross-border CNP transactions (S6). This is wider than S2's wording. Treat as [VERIFY].

### Issuer responsibility and compensation — ¶9 (per S10; [VERIFY])
- Issuers ensure the **robustness and integrity** of an authentication mechanism **before deployment**. (S3)
- ¶9(2): "If any loss arises out of transactions effected without complying with these directions, the issuer shall compensate the customer for the loss in full without demur." (quoted by S10)

### Data protection — [VERIFY ¶]
- Implementation must comply with the **Digital Personal Data Protection Act, 2023**. (S1 index, S4)

### Exemptions — [VERIFY ¶ and exact limits]
Reported by S5 as "existing exemptions" carried forward:
| Exemption | Limit reported | Confidence |
|---|---|---|
| Small-value contactless card transactions at PoS | up to ₹5,000 per transaction | Medium (S1 index) |
| Recurring transactions under the e-mandate framework, other than the first | per e-mandate framework limits | Medium |
| Select PPIs: PPI-MTS (mass transit), Gift PPIs | per PPI Master Direction | Medium |
| NETC (FASTag) transactions | — | Medium |
| Small-value digital payments in offline mode | per offline framework | Medium |
| Travel bookings via GDS/IATA with commercial/corporate cards | — | Low |
**Do not design to any limit in this table until it is checked.** Limits live in separate circulars (contactless, e-mandate, offline, PPI) that change over time.

## Related rules outside these Directions
| Rule | What it says | Source | Status |
|---|---|---|---|
| `.bank.in` domains | Banks to move to `.bank.in` by 31 Oct 2025, run via IDRBT. Aim: stop phishing and spoofing. NBFCs to get `.fin.in`. | S7 | Date confirmed by 2 reports; circular not opened |
| UPI on-device biometrics | From 8 Oct 2025, NPCI allows fingerprint/face on the phone instead of UPI PIN, up to ₹5,000 per transaction at launch; reports say raised to ₹10,000 in July 2026. Optional; disabled after 90 days unused. | S8 | [VERIFY with NPCI circular] |
| UPI PIN | Set and captured under NPCI rules, not by the bank alone. | NPCI | [VERIFY] |
| SEBI trading 2FA | Order placement and broker login sit under SEBI/exchange rules, not these Directions. | — | [VERIFY] |
| DPDP Rules | Rules under the 2023 Act, notified Nov 2025. | — | [VERIFY] |

## What the rules do NOT say

| People assume | What the text supports |
|---|---|
| "SMS OTP is banned from April 2026." | False. SMS-based OTP is listed as a valid factor (¶5(f), S1 index). The Directions encourage alternatives; they don't remove OTP. |
| "Every payment now needs biometrics." | False. Biometrics are one option among has / knows / is. |
| "Card-present payments need a dynamic factor." | No. The dynamic-factor rule applies to transactions **other than** card-present (¶6). |
| "Every cross-border card payment needs OTP from 1 Oct 2026." | No. The issuer must be able to validate AFA **when the overseas merchant or acquirer asks** (S2). Wider claims are unconfirmed. |
| "The rules define risk tiers and amount bands." | No source shows tiers or bands. ¶8 permits extra risk-based checks; the tiers are the issuer's design. **Taala's tiers are Orbit policy, not regulation.** |
| "The rules require a cooling period for new beneficiaries." | Not found in any source. Cooling periods are an Orbit choice. |
| "Passkeys are named and approved." | Not found. They fit the definitions; acceptance of synced passkeys is open. |
| "The rules apply to stock orders." | No. They cover digital payment transactions. Broker order auth is SEBI's. |
| "Exemptions are new." | Sources describe them as existing exemptions carried forward. |
| "Issuers are liable for all fraud." | Full compensation is tied to losses from transactions done **without complying** with the Directions (S4). Other liability rules (e.g. RBI's limited-liability circulars) still apply separately. |

## Fraud context (for the case study's "why now")
| Figure | Source | Use as |
|---|---|---|
| 13,516 card/internet fraud cases, ₹520 crore, FY 2024-25 | RBI Annual Report 2024-25, via S11 | Context; [VERIFY in RBI report] |
| Account-takeover fraud +310% year on year | RBI Bulletin, June 2025, via secondary sources | Context; [VERIFY] |
| Online payment frauds up over 400% (FY24) | S12 | Context |

## Secondary-source claims that overreach
- Some vendors say the Directions "require device-bound alternatives" or "phase out SMS OTP". The RBI text lists SMS OTP as a valid factor (¶5(f)). Treat these as marketing, not law.

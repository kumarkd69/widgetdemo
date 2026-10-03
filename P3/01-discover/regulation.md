# P3 Mend · Discover (desk research, 3 Oct 2026)

## Mend: a recovery companion for fraud victims
_In the worst hour of their financial life, victims must work four separate systems, gather evidence they didn't know to keep, then wait months with no visibility. Desk research only._ [Ready for review]

My role: lead designer. Method: Double Diamond, Discover. We can't promise recovery. [VERIFY] means check against a primary source before relying on it.

## How reporting and recovery work today
_Cited facts and what each means for design._ [Hypothesis]

| Fact | Source | Design implication |
|---|---|---|
| Victims should call 1930 (24x7) and file on cybercrime.gov.in; 1930 lodges a reporting number and sends a freeze request to the receiving bank. | Right to Information wiki, RBL Bank, news4hackers | First screen = one big call button, then a case number to store |
| Reporting on NCRP/1930 feeds CFCFRMS, which connects 85+ banks and payment intermediaries. | Drishti IAS, MHA material | Banks learn through CFCFRMS; victim still contacts own bank |
| A Money Restoration Module and a Grievance Redressal Module became functional in April 2026. A January 2026 SOP sets the process for freezing, lien and restoration. | PIB (CFCFRMS 2.0), Drishti IAS, SOP | Show restoration as a separate, slower stage with no universal timeline [VERIFY] |
| The system helped save over ₹11,158 crore across 32.80 lakh complaints as of 30 Jun 2026. | Free Press Journal, Sarkaritel | Use as context only; it is a government figure [VERIFY] |
| RBI July 2017 circular: zero liability for third-party breaches reported within 3 working days; limited liability if reported in 4-7 working days; bank shadow-credits within 10 working days of notice. | RBI circular 6 Jul 2017 via Lexology, Mondaq | Show the clock only for unauthorised transactions |
| Digital-arrest scams make the victim pay under fear. The victim usually authorises the payment. | NITI Aayog note, Forbes India | Triage: 'Did you enter your PIN or approve the payment?' Authorised payments are probably outside the zero-liability framework [VERIFY] |
| Rajasthan HC issued guidelines on bank account freezes in cyber-fraud cases (Sep 2026). | SCC Online | Relevant to mule-freeze scenario (Imran) [VERIFY] |

Correction to the brief: it says reporting within 3 working days limits liability. That holds for unauthorised transactions. Most scam losses are authorised by the victim, so a refund clock would mislead. What the rules don't say: a universal restoration timeline; who tells the victim a hold became a restoration; how to prove a transfer was coerced.


# P1 Rein · Discover (desk research, 3 Oct 2026)

## Rein: payment controls for AI agents on UPI
_People are about to let AI agents spend their money. Today's controls were built for family delegation, not software that acts alone, errs, or is manipulated. All desk research; no interviews yet._ [Ready for review]

My role: lead designer. Method: Double Diamond, Discover. Tags: [VERIFY] means check against a primary source (NPCI, RBI) before relying on it.

## What is known about UPI agent payments
_Cited facts and what each means for design._ [Hypothesis]

| Fact | Source | Design implication |
|---|---|---|
| NPCI is building a Unified Agent Protocol (UAP) to register, verify and authorise AI agents on UPI. Needs RBI approval before launch. | Business Standard (8-9 Jul 2026), BusinessWorld | Design for a registry and a verified-agent badge, but promise no launch date |
| UAP borrows UPI Circle (delegation) and Reserve Pay (pre-blocked funds per merchant). | Startup Fortune, Clearing Post | Mandate = who, what, how much, how often, which merchants, expiry |
| UPI Circle full delegation: up to ₹5,000 per transaction and ₹15,000 per month; ₹5,000 cap in first 24 h for a new delegate. | Kiwi, Paytm FAQ | Default mandate limits start inside these numbers [VERIFY if agents get different caps] |
| Reserve Pay: about ₹10,000 blocked across 90 days per merchant [VERIFY]. | Startup Fortune | Show blocked funds as 'reserved', not 'spent' |
| Pilots: ChatGPT with Razorpay and NPCI (announced at GFF 2025); Claude pilot with Zomato, Swiggy, Zepto on 20 Feb 2026, built on Reserve Pay, limited users. | Business Today, Analytics India Mag | Real merchants exist today; test with them |
| NPCI chairman at GFF, 10 Sep 2026: AI may recommend, but authentication and settlement must follow deterministic, auditable rules. Liability regime under discussion. | MediaNama | Agent never authorises. Rein shows deterministic checks, not model reasoning |
| NPCI-run agent registry; AiNxt and AtOM launched to help partners certify agent workflows [VERIFY]. | MediaNama, Revrag | Know-Your-Agent badge comes from the registry |

What the rules don't say: who is liable when an agent pays within its mandate but against the user's interest; whether agents get their own limits; how revocation reaches a pending order; how a user proves a merchant's prompt manipulated the agent; the dispute reason code for agent payments.


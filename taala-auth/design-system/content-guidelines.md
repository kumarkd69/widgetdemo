# Content guidelines

## Voice
Calm, plain, on the user's side. Short sentences. Say what happened, why, and what to do next.

## Word list (one word per action, across all products)
| Use | Don't use |
|---|---|
| Approve (a payment) | Authenticate, Authorise, Verify, Validate |
| Confirm (it's you) | Authenticate |
| PIN / UPI PIN | MPIN, TPIN, password (for PINs) |
| Code (SMS) | OTP in headings (OTP ok in help text) |
| Paused (account/PIN) | Blocked, Frozen, Suspended (to users) |
| Payee | Beneficiary (to users) |
| This phone | Device |
| Get help / Talk to us | Contact customer care |

## Formats
- Money: ₹1,25,000 (Indian grouping); no decimals unless paise matter.
- Time: 9:42 PM. Dates: 3 Oct 2026.
- Counts: "2 tries left", not "2 attempt(s) remaining".

## Explanations (Step-up and Trust Meter)
- One sentence, ≤ 48 characters in English. Start with the reason, not with "For security reasons".
- Name the signal if it helps the user act ("New payee", "Payment abroad", "SIM changed recently"). Never reveal model scores or thresholds.
- Good: "New payee and a large amount." Bad: "This transaction has been flagged as high risk."

## Errors
- What happened + what to do: "Wrong PIN. 2 tries left."
- Never blame: not "You entered an incorrect PIN".
- Every error has an action.

## Scam protection copy
- Always on OTP screens: "Never share this code. Orbit will never ask for it."
- On-call warning uses a question, not an accusation.

## Languages
- English, Hindi, Kannada at launch. Strings keyed by ID (`MSG_*`, `EXP_*`).
- Write for translation: no idioms, no puns, avoid gendered verbs in Hindi where possible.
- Every Hindi and Kannada string is **[VERIFY with native speaker]** until reviewed.
- Allow 40% text expansion; Kannada often runs longer.

## Explanation strings
| ID | English |
|---|---|
| EXP_LOW_KNOWN_SMALL | Known payee, small amount. |
| EXP_LOW_KNOWN | You've paid them before. |
| EXP_LOW_OWN_FUNDS | Moving your own money. |
| EXP_MED_NEW_PAYEE | First payment to this person. |
| EXP_MED_NEW_MERCHANT | First time at this shop. |
| EXP_MED_ABROAD | Payment abroad. |
| EXP_MED_NEW_DEVICE | New browser or phone. |
| EXP_MED_ADD_PAYEE | Adding a new payee. |
| EXP_MED_MANDATE | Setting up a repeat payment. |
| EXP_MED_NO_APP | App not set up on this phone. |
| EXP_HIGH_NEW_PAYEE_LARGE | New payee and a large amount. |
| EXP_HIGH_LARGE | Large amount. |
| EXP_HIGH_ABROAD_LARGE | Large payment abroad. |
| EXP_HIGH_ON_CALL | You're on a call. Take a moment. |
| EXP_HIGH_SIM_CHANGED | SIM changed recently. |
| EXP_HIGH_NEW_DEVICE | Setting up a new phone. |
| EXP_HIGH_RECOVERY | Resetting your PIN. |
| EXP_BLOCK_DEVICE | This phone isn't safe for payments. |
| EXP_BLOCK_SIM_SWAP | New SIM and new phone together. |
| EXP_EXEMPT_* | (no meter text; light confirmation) |
| EXP_INFO_SEBI | Trading login confirmed. |

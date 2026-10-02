# Journeys

Hypothetical journeys from proto-personas. Two columns per journey: **today** (Orbit before Taala, scenario) is in the pain column; **opportunity** is the Taala answer.

## (a) Meena pays ₹450 at a kirana store; fingerprint fails

| Stage | User action | Factor used | Thought / feeling | Pain | Opportunity |
|---|---|---|---|---|---|
| Scan | Scans shop QR | — | "Quick, people are waiting." | Weak data; app slow to load | Offline-tolerant scan; cache payee |
| Review | Sees ₹450, shop name | — | "Is this the right shop?" | Shop name in English only | Payee name + verified badge, in Kannada |
| Approve | Touches sensor | Biometric (is) + device key (has, dynamic) | Calm | — | Trust Meter: Low, "Known shop, small amount" |
| Fail ×2 | Sensor rejects dry finger | — | Embarrassed | Today: "Authentication failed", no next step | After 2 fails: Fallback Chooser with "Use UPI PIN" first |
| Fallback | Enters 4/6-digit UPI PIN | PIN (knows) + device key (has) | Relief | Today: PIN pad hidden behind menu | PIN pad opens in same sheet; no restart |
| Done | Shows success to shopkeeper | — | "Done. Good." | Tiny success text | Large ₹ amount, tick, sound, haptic |

## (b) Arjun sends ₹2,00,000 to a new beneficiary at 11:04 PM

| Stage | User action | Factor used | Thought / feeling | Pain | Opportunity |
|---|---|---|---|---|---|
| Add payee | Adds landlord's account | — | "Annoying but fine." | Today: OTP to add payee, OTP again to pay | One approval to add, with clear cooling notice |
| Cooling | Sees "New payees: up to ₹50,000 in the first 24 hours" (Orbit policy) | — | "Why?" | Today: limit discovered only at failure | Say it upfront, with the reason |
| Amount | Enters ₹2,00,000 | — | "It's my money." | — | Trust Meter: High, "New payee, large amount, late night" |
| Step-up | Approves with passkey + app PIN | has (dynamic) + knows | Mild friction, understood | Today: OTP, which he knows is phishable | Passkey/device key; OTP only as fallback |
| Hold | Funds above cooling cap queued for 6:00 AM, or he calls to release | — | Frustrated if urgent | No way to override today | "Release now" via video call or branch (assisted path) |
| Done | Confirmation + undo window notice | — | Reassured | — | Notification on all bound devices |

## (c) Priya buys an ₹18,000 course from a US site; Indian SIM off

| Stage | User action | Factor used | Thought / feeling | Pain | Opportunity |
|---|---|---|---|---|---|
| Checkout | Enters card on US site | Card details (has? no — static data) | "Hope it works." | — | — |
| Merchant asks AFA | 3DS challenge triggered by merchant | — | — | Today: OTP to Indian SIM, which is off | ACS sends push to Orbit app on her bound iPhone (R13) |
| Approve | Opens push, sees merchant, ₹18,000, USD amount | Device key (has, dynamic) + Face ID or app PIN | "Oh, this is easy." | — | Same Auth Sheet as domestic; Trust Meter Medium: "Payment abroad" |
| No push? | Push delayed | — | Anxious; sale ends in 10 min | — | "Approve on another device" via QR in browser, or email OTP [VERIFY allowed] |
| Done | Merchant confirms | — | Relief | — | Receipt in app with FX rate |

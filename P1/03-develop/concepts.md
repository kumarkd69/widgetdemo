# P1 Rein · Develop

## Three directions, one winner
_Automated, guided and human-assisted. Scored against the six principles._ [Ready for review]

**A · Autopilot with silent holds**
- Idea: agent pays freely inside a wide limit; a risk engine silently holds oddities.
- Storyboard: set limit once → agent pays → rare hold email.
- Pros: least friction.
- Cons: owner learns late; weak 'why'.
- Risk: wrong-intent payments inside the limit go unnoticed.

**B · Envelope, feed and quick hold (chosen)**
- Idea: a small mandate envelope, live feed with a short why, one-tap pause, quick confirm only for unusual payments.
- Storyboard: set envelope → agent pays → feed shows why → odd payment held → owner confirms or blocks.
- Pros: control, visibility, little nagging.
- Cons: needs a feed people look at.
- Risk: hold fatigue if rules are loose.

**C · Family co-pilot**
- Idea: every payment above ₹500 goes to a family member to approve.
- Storyboard: agent asks → family approves → payment.
- Pros: safe for Meena.
- Cons: approval fatigue; slows the point of agents.
- Risk: helper becomes the bottleneck.


| Criterion (1-5) | A Autopilot | B Envelope + feed | C Co-pilot |
|---|---|---|---|
| Limits before trust | 3 | 5 | 4 |
| Short why | 2 | 5 | 3 |
| Model never authorises | 4 | 5 | 5 |
| One tap to stop | 3 | 5 | 3 |
| Quiet by default | 5 | 4 | 1 |
| Family-safe | 2 | 4 | 5 |
| Fits North Star (expected payments) | 3 | 5 | 4 |
| Total (out of 35) | 22 | 33 | 25 |

Decision: build B. Family co-pilot becomes an optional view in a later release. A is rejected: silent holds mean owners learn too late. Logged in DECISIONS.md.


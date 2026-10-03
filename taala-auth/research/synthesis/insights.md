# Insights

**Status: desk-research insights, not interview findings.** Each rests on the regulation notes and the desk audit of 5 real apps (`research/audit/inconsistencies.md`, F1–F12). Interviews are still to run.

| # | Insight | Evidence | Implication | How might we… |
|---|---|---|---|---|
| I1 | **The rule is a floor, not a design.** ¶6 sets two factors and one dynamic; ¶8 allows more. Nothing tells issuers how to make extra checks understandable. | rule-to-requirement R4, R9, R10 | The opportunity is in *how* extra checks feel, not in what's required. | HMW make every extra check feel deserved? |
| I2 | **OTP is legal but is the weakest link we control.** It's listed as a valid factor (¶5(f)), yet it's exposed to SIM swap and phishing and fails abroad. | R5, R13, R24; F1, F7 | Keep OTP, demote it to fallback; default to device-bound keys. | HMW move people off OTP without taking it away? |
| I3 | **Consistency is a security feature.** If six OTP screens exist, a seventh fake one blends in. | F4, F10; H4 | Same risk → same pattern, across all five products. | HMW make the real thing recognisable at a glance? |
| I4 | **Failure is the real first-run experience for some users.** Worn fingerprints, wet hands, old sensors. | F6, F9; H3 | The fallback ladder is a core flow, not an edge case. | HMW make a failed fingerprint a non-event? |
| I5 | **Recovery is where attackers go.** If PIN reset is OTP-only, all the strong factors are bypassed. | R6; F5 | No OTP-only recovery for high-risk changes. | HMW make recovery hard for fraudsters and kind to owners? |
| I6 | **Cross-border is now a live gap.** The 1 Oct 2026 rule meets users whose Indian SIM is off. | R13; Priya | App-based approval is the default for cross-border CNP. | HMW approve a foreign purchase without an Indian SIM? |
| I7 | **The real customers of the platform are internal.** Engineers, risk, compliance and support each need a different view of the same decision. | Internal proto-personas 6–9 | Ship a contract, a console and evidence logs, not just screens. | HMW make adopting Taala easier than building your own? |
| I8 | **People don't trust what they can't read.** Kannada- and Hindi-first users read English warnings slowly or not at all. | Meena, Imran | Every explanation string exists in 3 languages from day one. | HMW explain risk in one plain sentence in the user's language? |

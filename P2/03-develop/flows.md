# P2 Nod · Develop

## Core task flows
_Five flows and the state machine of a Consent._ [Ready for review]

Flow 1 · Link apps (first run)

```mermaid
flowchart LR
  a["Open Nod"]
  b["Choose language"]
  c["Verify mobile (OTP)"]
  d["Find apps that use Nod"]
  e{"Any found?"}
  f["Show inventory"]
  g["Explain coverage, invite later"]
  a --> b
  b --> c
  c --> d
  d --> e
  e -->|Yes| f
  e -->|No| g
```

Flow 2 · Withdraw with proof

```mermaid
flowchart LR
  a["Open Nod"]
  b["Pick an app"]
  c["Read purpose card"]
  d{"Withdraw?"}
  e["Confirm what changes"]
  j["Consent kept"]
  f["Send stop request"]
  g{"Company confirms in 7 days?"}
  h["Stopped receipt"]
  i["Escalate: raise grievance"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| j
  e --> f
  f --> g
  g -->|Yes| h
  g -->|No| i
```

Flow 3 · New consent request

```mermaid
flowchart LR
  a["Company asks via Nod"]
  b["Show purpose and data"]
  c{"Allow?"}
  d["Record consent, tell company"]
  e["Record refusal, tell company"]
  a --> b
  b --> c
  c -->|Allow| d
  c -->|Don't allow| e
```

Flow 4 · Guardian approves a child's consent

```mermaid
flowchart LR
  a["Child's app asks consent"]
  b["Parent notified"]
  c{"Parent verified?"}
  d["Verify via DigiLocker"]
  e{"Approve or refuse"}
  f["Record decision"]
  a --> b
  b --> c
  c -->|Yes| e
  c -->|No| d
  d --> e
  e --> f
```

Flow 5 · Rights request

```mermaid
flowchart LR
  a["Open Rights"]
  b["Pick type and company"]
  c["Write or speak request"]
  d["Send, track due date"]
  e{"Answered in time?"}
  f["Close with answer"]
  g["Escalate to Board"]
  a --> b
  b --> c
  c --> d
  d --> e
  e -->|Yes| f
  e -->|No| g
```

State machine · Consent

```mermaid
flowchart LR
  a["Requested"]
  b["Active"]
  c["Withdrawal sent"]
  d["Stopped (receipt)"]
  e["Disputed"]
  f["Expired"]
  a -->|Allow| b
  b -->|Withdraw| c
  c -->|Confirmed| d
  c -->|No answer 7 days| e
  e -->|Resolved| d
  b -->|Time up| f
```


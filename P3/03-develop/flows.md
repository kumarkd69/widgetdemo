# P3 Mend · Develop

## Core task flows
_Four flows and two state machines._ [Ready for review]

Flow 1 · First hour

```mermaid
flowchart LR
  a["Tap 'I was scammed'"]
  b["Call 1930 (script shown)"]
  c["Save reporting number"]
  d["Tell your bank (call + draft)"]
  e["File on cybercrime.gov.in (pre-filled)"]
  f{"Did you approve it?"}
  g["Honest note: may not be covered"]
  h["Show zero-liability clock"]
  i["Case created"]
  a --> b
  b --> c
  c --> d
  d --> e
  e --> f
  f -->|Yes| g
  f -->|No| h
  g --> i
  h --> i
```

Flow 2 · Evidence

```mermaid
flowchart LR
  a["Open Evidence"]
  b["Auto-gather: calls, SMS, UPI receipt"]
  c{"Permission given?"}
  d["Add screenshots, statement"]
  f["Evidence pack ready"]
  e["Guided manual checklist"]
  a --> b
  b --> c
  c -->|Yes| d
  d --> f
  c -->|No| e
  e --> d
```

Flow 3 · Track the case

```mermaid
flowchart LR
  a["Agency replies or time passes"]
  b["Add update or accept reminder"]
  c["Case river updates"]
  d{"Overdue?"}
  g["Keep waiting, next check date"]
  e["Draft follow-up letter"]
  f["Send and log"]
  a --> b
  b --> c
  c --> d
  d -->|No| g
  d -->|Yes| e
  e --> f
```

Flow 4 · Family helper

```mermaid
flowchart LR
  a["Victim invites helper"]
  b["Choose what helper can see"]
  c["Helper verifies by OTP"]
  d{"Victim approves?"}
  e["Helper can act, log is visible"]
  f["Invite cancelled"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
```

State machine · Case

```mermaid
flowchart LR
  a["Opened"]
  b["Reported (1930)"]
  c["Bank informed"]
  d["NCRP filed"]
  e["Waiting"]
  f["Restored"]
  g["Closed, not recovered"]
  a -->|Call done| b
  b --> c
  c --> d
  d --> e
  e -->|Money restored| f
  e -->|Agency closes| g
```

State machine · Channel report

```mermaid
flowchart LR
  a["Not started"]
  b["Done, number saved"]
  c["Waiting"]
  d["Update received"]
  e["Closed"]
  f["Overdue"]
  g["Follow-up sent"]
  a --> b
  b --> c
  c -->|Reply| d
  d --> e
  c -->|No news in time| f
  f --> g
```


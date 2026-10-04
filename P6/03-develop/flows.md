# P6 Sooner · Develop

## Core task flows
_Five flows and the request state machine._ [Ready for review]

Flow 1 · Ask for help

```mermaid
flowchart LR
  a["Open Sooner"]
  b["Confirm pickup spot"]
  c["Answer 3 need questions"]
  d["See quote card"]
  e["Confirm in one tap"]
  a --> b
  b --> c
  c --> d
  d --> e
```

Flow 2 · Quote and confirm

```mermaid
flowchart LR
  a["Quote card shown"]
  b{"Price within cap?"}
  c["Confirm"]
  d["Ask for another operator"]
  a --> b
  b -->|Yes| c
  b -->|No| d
  d --> a
```

Flow 3 · Track and arrive

```mermaid
flowchart LR
  a["Operator assigned"]
  b["Live ETA"]
  c{"Signal OK?"}
  d["Crew arrives, code shown"]
  e["SMS updates"]
  a --> b
  b --> c
  c -->|Yes| d
  c -->|No| e
  e --> d
```

Flow 4 · Pay and check

```mermaid
flowchart LR
  a["Trip ends"]
  b["Invoice received"]
  c{"Matches quote?"}
  d["Pay by UPI"]
  e["Flag and dispute"]
  a --> b
  b --> c
  c -->|Yes| d
  c -->|No| e
  e --> d
```

Flow 5 · Operator dispatch

```mermaid
flowchart LR
  a["Request arrives"]
  b{"Free vehicle with kit?"}
  c["Assign driver"]
  d["Trip logged"]
  e["Decline, family told"]
  a --> b
  b -->|Yes| c
  b -->|No| e
  c --> d
```

Request state machine

```mermaid
flowchart LR
  a["Draft"]
  b["Quoted"]
  c["Confirmed"]
  d["En route"]
  e["Completed"]
  f["Cancelled"]
  g["Expired"]
  a --> b
  b --> c
  c --> d
  d --> e
  c --> f
  b --> g
```


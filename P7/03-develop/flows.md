# P7 Span · Develop

## Core task flows
_Five flows and the cover state machine._ [Ready for review]

Flow 1 · See my cliff

```mermaid
flowchart LR
  a["HR invite or add my exit date"]
  b["Confirm exit date and insurer"]
  c["See the cliff timeline"]
  d["Add family members covered"]
  e["Reminders set"]
  a --> b
  b --> c
  c --> d
  d --> e
```

Flow 2 · Choose a route

```mermaid
flowchart LR
  a["Open Options"]
  b["See keep, lose, change"]
  c["Compare migrate, port, fresh"]
  d{"Same insurer OK?"}
  e["Migrate with same insurer"]
  f["Compare other insurers (port) [VERIFY]"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
```

Flow 3 · Prepare documents

```mermaid
flowchart LR
  a["Open checklist"]
  b["ID, policy copy, exit letter"]
  c{"All ready?"}
  d["Ready to apply"]
  e["Ask HR or insurer for missing items"]
  a --> b
  b --> c
  c -->|Yes| d
  c -->|No| e
  e --> d
```

Flow 4 · Apply with minimal health data

```mermaid
flowchart LR
  a["Start application"]
  b["Pre-fill from policy"]
  c["Only the health questions required"]
  d{"Pre-existing condition?"}
  e["Add details, nothing more"]
  f["Submit"]
  g["Submit with details"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
  e --> g
```

Flow 5 · HR exit workflow

```mermaid
flowchart LR
  a["HR logs exit date"]
  b["Span sends employee invite"]
  c["Employee chooses a route"]
  d{"Reply within 7 days?"}
  e["Insurer told of the choice"]
  f["Reminder, then HR follow-up"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
```

State machine · Cover transition

```mermaid
flowchart LR
  a["Employed, covered"]
  b["Exit scheduled"]
  c["Window open"]
  d["Applied"]
  e["Cover continues"]
  f["Cliff passed"]
  g["Fresh policy, underwriting [VERIFY]"]
  a -->|Exit date set| b
  b -->|Window opens| c
  c -->|Apply| d
  d -->|Accepted| e
  c -->|Date passes| f
  f --> g
```


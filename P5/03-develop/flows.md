# P5 Fineprint · Develop

## Core task flows
_Five flows and the policy state machine._ [Ready for review]

Flow 1 · Start with my needs

```mermaid
flowchart LR
  a["Start with my needs"]
  b["Who is covered?"]
  c["Conditions and budget (minimum data)"]
  d["Shortlist of 3 to 5 with rules shown"]
  e{"Refine needs?"}
  f["Go to compare"]
  g["Back to questions"]
  a --> b
  b --> c
  c --> d
  d --> e
  e -->|No| f
  e -->|Yes| g
```

Flow 2 · Compare two plans

```mermaid
flowchart LR
  a["Pick two plans"]
  b["Open side-by-side"]
  c["Not-covered first, then trade-offs"]
  d{"Test a hospital stay?"}
  e["Run simulator"]
  f["Choose and buy on Bima Sugam"]
  g["Back to compare"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
  e --> g
```

Flow 3 · Hospital-stay simulator

```mermaid
flowchart LR
  a["Open simulator"]
  b["Pick scenario, e.g. 5 days, knee surgery"]
  c["Room type and city"]
  d["See what you'd pay: co-pay, room cap, sub-limits"]
  e{"Surprised?"}
  f["Compare other plans"]
  g["Keep this plan"]
  a --> b
  b --> c
  c --> d
  d --> e
  e -->|Yes| f
  e -->|No| g
```

Flow 4 · Gap check with my existing cover

```mermaid
flowchart LR
  a["Open My cover"]
  b["Ask consent to read Bima Pehchaan policies"]
  c{"Consent given?"}
  d["Show coverage shape and gaps"]
  e["Suggest what to ask for"]
  f["Add policies by hand"]
  a --> b
  b --> c
  c -->|Yes| d
  d --> e
  c -->|No| f
```

Flow 5 · Talk to a licensed advisor

```mermaid
flowchart LR
  a["Tap Talk to a person"]
  b["Share only what you choose"]
  c["Pick a time and language"]
  d{"Advisor available?"}
  e["Booked call"]
  f["Callback within a day"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
```

State machine · Policy

```mermaid
flowchart LR
  a["Needs draft"]
  b["Shortlisted"]
  c["Compared"]
  d["Bought on Bima Sugam"]
  e["Waiting period"]
  f["Active"]
  g["Renewal due"]
  h["Renewed"]
  i["Lapsed"]
  a --> b
  b --> c
  c -->|Choose| d
  d --> e
  e -->|Waiting ends| f
  f -->|30 days before| g
  g -->|Renew| h
  g -->|Missed| i
```


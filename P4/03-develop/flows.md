# P4 Passline · Develop

## Core task flows
_Five flows and the Notice state machine._ [Ready for review]

Flow 1 · Add a vehicle

```mermaid
flowchart LR
  a["Open Passline"]
  b["Enter plate number"]
  c["Verify owner by OTP"]
  d{"Plate and owner match?"}
  e["Vehicle added, alerts on"]
  f["Ask owner to update number in VAHAN"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  d -->|No| f
```

Flow 2 · Alert, verify, pay

```mermaid
flowchart LR
  a["Failed-payment alert"]
  b["Open notice, see 72-hour clock"]
  c["Verify with official source"]
  d{"Genuine and yours?"}
  e["Pay normal fee ₹85"]
  f["Receipt, notice closed"]
  g["Go to dispute"]
  a --> b
  b --> c
  c --> d
  d -->|Yes| e
  e --> f
  d -->|No| g
```

Flow 3 · Dispute inside 72 hours

```mermaid
flowchart LR
  a["Not my car, wrong class or charged twice"]
  b["Pick the reason"]
  c["Passline lists evidence needed"]
  d["Add photos, RC, FASTag statement"]
  e["File representation"]
  f{"Reply in 5 days?"}
  g["Claim invalid if no reply"]
  h{"Upheld?"}
  i["Notice cancelled"]
  j["Pay fee if still due [VERIFY]"]
  a --> b
  b --> c
  c --> d
  d --> e
  e --> f
  f -->|No| g
  f -->|Yes| h
  h -->|Yes| i
  h -->|No| j
```

Flow 4 · Fleet clear-up

```mermaid
flowchart LR
  a["Open Fleet"]
  b["See notices by cab, least time first"]
  c{"Which action?"}
  d["Pay selected"]
  f["All clear"]
  e["Dispute one cab"]
  g["Case filed"]
  a --> b
  b --> c
  c -->|Pay| d
  d --> f
  c -->|Dispute| e
  e --> g
```

Flow 5 · Check a used car

```mermaid
flowchart LR
  a["Enter plate and RC owner"]
  b["Check unpaid fees [VERIFY source]"]
  c{"Dues found?"}
  d["Clear: buy with confidence"]
  e["Show amount and notice"]
  f["Ask seller to clear before transfer"]
  a --> b
  b --> c
  c -->|No| d
  c -->|Yes| e
  e --> f
```

State machine · Notice

```mermaid
flowchart LR
  a["Paid at normal fee"]
  b["Issued"]
  c["Overdue (double fee)"]
  d["Recorded in VAHAN"]
  e["Cancelled"]
  f["Disputed"]
  g["Rejected"]
  b -->|Pay within 72 h| a
  b -->|No action in 72 h| c
  c -->|Over 15 days, no representation| d
  b -->|Representation within 72 h| f
  f -->|Upheld| e
  f -->|Rejected| g
  g -->|Fee due again| c
```


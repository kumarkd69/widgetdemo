# P1 Rein · Develop

## Core task flows
_Five flows and two state machines._ [Ready for review]

Flow 1 · Create a mandate

```mermaid
flowchart LR
  a["Agent asks to pay for you"]
  b["Review agent badge"]
  c["Pick template or custom"]
  d["Set per-payment, monthly, merchants, expiry"]
  e["Preview worst case spend"]
  f{"Looks right?"}
  g["Confirm with UPI PIN"]
  h["Mandate active"]
  i["Back to limits"]
  a --> b
  b --> c
  c --> d
  d --> e
  e --> f
  f -->|Yes| g
  g --> h
  f -->|No| i
```

Flow 2 · Agent pays inside the mandate

```mermaid
flowchart LR
  a["Agent requests payment"]
  b["Rein checks mandate, merchant, amount"]
  c{"Within limits and normal?"}
  d["Pay and write the why card"]
  e["Appears in feed"]
  f{"Hard limit broken?"}
  g["Declined, reason shown"]
  h["Hold for owner OK"]
  a --> b
  b --> c
  c -->|Yes| d
  d --> e
  c -->|No| f
  f -->|Yes| g
  f -->|No| h
```

Flow 3 · Anomaly hold

```mermaid
flowchart LR
  a["Hold notice in chat and app"]
  b["Show request, merchant, amount, checks"]
  c{"Owner action"}
  d["Approve once"]
  e["Block this payment"]
  f{"Pause agent too?"}
  g["Agent paused"]
  h["Agent stays active"]
  a --> b
  b --> c
  c -->|Approve| d
  c -->|Block| e
  e --> f
  f -->|Yes| g
  f -->|No| h
```

Flow 4 · Pause or revoke

```mermaid
flowchart LR
  a["Open Rein or tap in chat"]
  b{"Pause or revoke?"}
  c["Pause: new payments blocked, mandate kept"]
  e["Resume any time"]
  d["Revoke: mandate ends, pending orders cancelled if possible"]
  f["Revocation receipt"]
  a --> b
  b -->|Pause| c
  c --> e
  b -->|Revoke| d
  d --> f
```

Flow 5 · Dispute within limits

```mermaid
flowchart LR
  a["Open payment, tap Dispute"]
  b["Pick reason: wrong item, not expected, manipulated"]
  c["Rein builds evidence pack"]
  d["Send to bank dispute desk"]
  e{"Officer decision"}
  f["Refund with date"]
  g["Appeal path [VERIFY]"]
  a --> b
  b --> c
  c --> d
  d --> e
  e -->|Refund| f
  e -->|Reject| g
```

State machine · Mandate

```mermaid
flowchart LR
  a["Draft"]
  b["Active"]
  c["Revoked"]
  d["Paused"]
  e["Expired"]
  a -->|Confirm PIN| b
  b -->|Revoke| c
  b -->|Pause| d
  d -->|Expiry passes| e
```

State machine · Payment

```mermaid
flowchart LR
  a["Requested"]
  b["Checked"]
  c["Settled"]
  d["Disputed"]
  e["Held"]
  f["Declined"]
  a --> b
  b -->|Normal| c
  c -->|Owner disputes| d
  b -->|Unusual| e
  e -->|Owner blocks| f
  e -->|Owner approves| c
```


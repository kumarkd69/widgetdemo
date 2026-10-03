# Figma log

| Item | Value |
|---|---|
| File | https://www.figma.com/design/neC2nH6A7j7ZFyPBDh9N7H/rbi |
| File key | `neC2nH6A7j7ZFyPBDh9N7H` |
| Plan | Starter (one variable mode). Pro "Design Lab" refused file creation (guest seat). |
| Dev status | `devStatus` API not available on this plan → visible "✓ Ready for dev" badges above each screen instead. |

## Pages
| Page | ID | Contents |
|---|---|---|
| Cover | `0:1` | Cover frame `11:442` (lock + trust-meter motif) |
| Read me | `3:2` | `11:487` page guide, status legend, naming, changelog, known limits |
| 01 Story | `3:3` | Boards: Context `13:2`, Problem `13:75`, People `13:128`, Journeys `14:45`, Insights `14:289`, Principles `14:342`, Strategy `14:376`, Research plan `14:405` |
| 02 Foundations | `3:4` | Header `11:2`, primitives `11:6`, semantic + contrast `11:153`, risk scale `11:229`, type in 3 scripts `11:316`, spacing/radius/elevation/motion `11:370` |
| 03 Components | `3:5` | See component table |
| 04 Patterns | `3:6` | 7 pattern strips `15:5`…`15:215` |
| 05 Flows & Policy | `3:7` | Policy board `16:2`, worked examples `16:163`, full matrix `16:389`, tunable/fixed `16:1381`, fallback ladder `17:448` (5 flowcharts), special cases + trilingual messages `18:448`, Policy console 1440 (component `26:3099`) |
| 06 Screens · Bank | `3:8` | 8 mobile + 2 net banking 1440 |
| 07 Screens · UPI | `3:9` | 10 screens incl. HI and KN |
| 08 Screens · Cards & Cross-border | `3:10` | 8 screens |
| 09 Screens · Wallet & Invest | `3:11` | 6 screens |
| 10 States & Fallbacks | `3:12` | 15 state screens (`24:5`…`24:710`) |
| 11 Migration | `3:13` | Exec summary `25:2`, roadmap `25:32` (grid component `26:3102`), phases `25:132`, metrics tree `25:175` (component `26:3103`) |
| 12 Handoff | `3:14` | Specs `26:2`, analytics + API `26:143`, QA `26:240`, redlines `26:271` |
| 13 Case study | `3:15` | 1440 long-form `27:2`, built from instances |

## Variables and styles
- Collections: Primitives `VariableCollectionId:6:2` (33, hidden), Color `6:36` (38 semantic, aliased), Dimension `6:75` (11 space + 5 radius). All with WEB code syntax.
- 21 text styles (Display, Heading, Body, Label, Caption, Overline, Amount, Numeric, Indic/HI ×3, Indic/KN ×3). 3 effect styles.

## Components (03 Components)
| Component | ID |
|---|---|
| Icons (36) | `7:9`…`7:265` |
| Button | `7:283` |
| Trust Meter | `7:389` |
| PIN Pad | `8:359` |
| OTP Input | `8:469` |
| Biometric Prompt | `8:533` |
| Passkey Prompt | `8:564` |
| Inline Error | `8:568` |
| Toast | `8:591` |
| Transaction Summary Card | `9:164` |
| Step-up Explainer | `9:185` |
| Fallback Chooser | `9:267` |
| Cooldown Timer | `9:271` |
| Lockout Card | `9:320` |
| Recovery Entry | `9:321` |
| Success Confirmation | `9:381` |
| Device Binding Status | `9:419` |
| Language Switcher | `9:447` |
| Status bar / Top bar | `10:208` / `10:239` |
| Auth Sheet (factor = instance swap) | `10:478` |
| Usage Do/Don't section | `10:479` |

## Screens turned into components (reused as instances in 13 Case study)
UPI `26:1411`–`26:1415` · Bank `26:1436`–`26:1439` · Cards `26:1789`–`26:1791` · Wallet/Invest `26:2075`–`26:2076` · States `26:2612`–`26:2614` · Exhibits: tier summary `26:3101`, biometric flow `26:3100`, roadmap `26:3102`, metrics tree `26:3103`, console `26:3099`.

## Build log
- 2026-10-02 — Pages created.
- 2026-10-02/03 — Foundations, 20 component sets, all pages built. Screenshot-checked; fixed: collapsed horizontal components, opaque scrim, text overflow, flowchart edges crossing nodes, roadmap overlaps, dark status bars, tier-table widths.

## Known gaps
- Hindi/Kannada copy needs native review.
- Audit board waits on real screenshots.
- RBI paragraph numbers other than ¶5(f), ¶6, ¶8 are [VERIFY].

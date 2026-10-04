# P6 Sooner · Discover (desk research, 4 Oct 2026)

## Sooner: private ambulance price and dispatch
_In an emergency, families have no time to compare and no power to negotiate. They don't know whether the ambulance that arrives has the right equipment, what it will cost, or when it will come. Researched from scratch; desk research only._ [Ready for review]

My role: lead designer. Method: Double Diamond, Discover. We never diagnose. [VERIFY] means check against a primary source (state gazette, MoRTH) before relying on it.

## What is known about ambulance rules and prices
_Cited facts and what each means for design. The brief asked for everything to be researched from scratch._ [Hypothesis]

| Fact | Source | Design implication |
|---|---|---|
| National Ambulance Code AIS-125 (MoRTH): road ambulance types A to D (patient transport, basic life support, advanced life support, first responder). Part 1 covers the vehicle; Part 2 covers medical equipment. MoRTH has proposed amendments (neonatal, multi-stretcher) [VERIFY]. | MoRTH, ARAI (AIS-125 parts 1 and 2), Medical Buyer | Show equipment level (Basic, Advanced, Neonatal) in plain words |
| Public service: 108 is free emergency ambulance in most states, often run with a partner (in Karnataka, 108 Arogya Kavacha); 102 serves maternity and infants; 112 is the unified emergency number being integrated. | Wikipedia, VMEDO, Deccan Herald | Always offer 'Call 108 (free)' beside private options |
| Delhi (May 2021, COVID-era order): patient transport ₹1,500 for first 10 km, BLS ₹2,000, ALS ₹4,000, then ₹100 a km [VERIFY if in force]. | Business Standard, Deccan Herald, All India Radio | Evidence that caps are workable; check each state |
| Haryana, Uttar Pradesh and Punjab districts fixed per-km caps in 2021; Haryana asked for ₹50,000 minimum penalty on overcharging [VERIFY]. | Hindustan Times, Tribune | Caps vary by state: price engine must be state-aware |
| Karnataka: Deccan Herald reports private ambulances will come under the KPME Act with regulated fares [VERIFY date and status]. One site lists ₹350-₹2,500 bands [VERIFY]. | Deccan Herald, righttoinformation.wiki | Do not hard-code caps; read from state data |
| Reported overcharging: a Bengaluru family charged ₹6,800 for a 4 km transfer including add-on 'charges'; Telangana families paid ₹8,000 and ₹15,000 for transfers [VERIFY]. | righttoinformation.wiki, Siasat | Itemised, capped quote shown before dispatch |
| Clinical Establishments Act: I could not confirm any ambulance-specific provision [VERIFY]. | - | Do not cite it in the product |

Correction to the brief: it asked me to find state caps and AIS-125 details. I found Delhi, Haryana, UP and Punjab caps, mostly from 2021, and Karnataka's regulation still looks pending. What the rules don't say: a national price cap; how crew certification is shown to families; who is liable if triage advice is wrong; how private and 108 dispatch should hand over.


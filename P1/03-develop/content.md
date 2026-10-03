# P1 Rein · Develop

## Content model and critical microcopy
_Hindi and Kannada drafted by me: native-speaker review needed._ [Hypothesis]

| Message | English | Hindi (review) | Kannada (review) |
|---|---|---|---|
| Pause | Pause all agents | सभी एजेंट रोकें | ಎಲ್ಲ ಏಜೆಂಟ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸಿ |
| Hold | Held for your OK: ₹1,850 | आपकी मंज़ूरी के लिए रोका गया: ₹1,850 | ನಿಮ್ಮ ಒಪ್ಪಿಗೆಗಾಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ: ₹1,850 |
| Paid | Paid ₹480 to Zomato. Inside your ₹5,000 monthly limit. | Zomato को ₹480 चुकाए। आपकी ₹5,000 मासिक सीमा के भीतर। | Zomatoಗೆ ₹480 ಪಾವತಿಸಲಾಗಿದೆ. ನಿಮ್ಮ ₹5,000 ಮಾಸಿಕ ಮಿತಿಯೊಳಗೆ. |
| Why | Why this payment | यह भुगतान क्यों | ಈ ಪಾವತಿ ಏಕೆ |
| Badge | Verified agent | सत्यापित एजेंट | ಪರಿಶೀಲಿತ ಏಜೆಂಟ್ |

| Content type | Fields | Rules |
|---|---|---|
| Why card | Request text, checks run, rule that allowed | Max 3 short lines; no model reasoning |
| Hold | Amount, merchant, reason, deadline | Equal-weight Approve / Block |
| Mandate summary | Caps, merchants, expiry, worst case | Always in ₹ with Indian grouping |


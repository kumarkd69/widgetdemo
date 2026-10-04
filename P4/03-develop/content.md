# P4 Passline · Develop

## Content model and critical microcopy
_Hindi and Kannada drafted by me: native-speaker review needed._ [Hypothesis]

| Message | English | Hindi (review) | Kannada (review) |
|---|---|---|---|
| Alert | Toll not paid. Pay ₹85 within 72 hours. | टोल का भुगतान नहीं हुआ। 72 घंटे में ₹85 चुकाएँ। | ಟೋಲ್ ಪಾವತಿಯಾಗಿಲ್ಲ. 72 ಗಂಟೆಗಳಲ್ಲಿ ₹85 ಪಾವತಿಸಿ. |
| Clock | After 72 hours it is ₹170. | 72 घंटे के बाद ₹170 लगेगा। | 72 ಗಂಟೆಗಳ ನಂತರ ₹170. |
| Verified | This notice is genuine. | यह नोटिस असली है। | ಈ ನೋಟಿಸ್ ನಿಜವಾದದ್ದು. |
| Question | Is this your vehicle? | क्या यह आपकी गाड़ी है? | ಇದು ನಿಮ್ಮ ವಾಹನವೇ? |
| Filed | Dispute filed. Reply due in 5 days. | विवाद दर्ज हुआ। 5 दिन में जवाब आना है। | ವಿವಾದ ದಾಖಲಾಗಿದೆ. 5 ದಿನಗಳಲ್ಲಿ ಉತ್ತರ ಬರಬೇಕು. |

| Content type | Fields | Rules |
|---|---|---|
| Alert | Plate, amount, deadline | Under 120 characters; never a link to anything but the app |
| Notice | Official id, gantry, time, amount | Time as 9:42 PM; amount in ₹ |
| Dispute reason | Plain-language label | No legal jargon |


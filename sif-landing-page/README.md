# SIF Landing Page – CLASSIF by UTI Mutual Fund

Static, dependency-free page. No build step, no external requests.

## Structure
```
index.html                 page markup
css/styles.css             all styles (tokens at the top of the file)
js/main.js                 header state, reveals, scroll-scrubbed hero, tabs, FAQ
assets/fonts/              Montserrat 400–800, latin + latin-ext (covers ₹), woff2, SIL OFL 1.1
assets/images/             logo, favicon, hero poster (webp + jpg)
assets/video-frames/       140 webp frames of the hero video, drawn on a canvas as you scroll
```

## Run
Serve the folder over HTTP, for example `npx serve .` or `python3 -m http.server`, then open the printed URL.

## Notes
- Font: Montserrat everywhere, self-hosted with `font-display: swap`. Bold and medium weights are preloaded.
- Hero: the poster image shows first. Frames load progressively (frame 1, then every 8th, then the rest). On reduced-motion or Data Saver, frames are skipped and the poster stays.
- Layout: 100px side gutters on desktop, 48px on tablet, 20px on phones. 50px between sections. Each section fits one screen at 1440×900, 1300×760, 390×844 and 360×740.
- Phones: card groups and the comparison table scroll sideways. The nav becomes a menu button.
- Accessibility: text contrast meets WCAG 2.2 AA. Includes a skip link, visible focus states, ARIA tabs and accordion, and reduced-motion support.
- Nav links (Home / About Us / Learn) are placeholders (`href="#"`).
- Replace `assets/images/classif-logo.png` with the official SVG logo when available.

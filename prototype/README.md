# The Original Tour – Track map prototype

Clickable, mobile-mockup prototype of the **Map** flow from the Figma file
"The Original Tour Website Design" (section `Map`, node 19494:175830).

- `index.html` – the prototype (open via a local server, e.g. `python3 -m http.server`).
- `dist/the-original-tour-prototype.html` – single self-contained file (all images and fonts inlined). Rebuild with `python3 build.py`.
- `assets/` – map artwork and photos exported from Figma; Figtree font (OFL) stands in for Proxima Nova.

## What's interactive
- Map: drag to pan (with inertia), pinch / mouse wheel / trackpad pinch / double-tap to zoom, rubber-band edges.
- Moving the map lowers the sheet and hides the logo row and nav ("Zoom in" screen); tap the sheet to bring it back.
- Bottom sheet: drag between lowered / default / expanded ("Drawer up"), tap the handle, scroll when expanded.
- Route chips and route cards: All routes, Red route, Blue route.
- Stop markers and bus markers on the map, attraction circles, stop rows, "Starts at" card → stop / attraction / route screens.
- All Stops / All Buses toggle, live bus countdown.
- Location toggle (side panel): "In Mumbai" vs "In London" → nearest-stop suggestion.
- Nearest stop card, "Start here" and the stop pin → walking directions with an animated walker, recenter and mute buttons, Exit.

Only elements with a designed screen are clickable (Red route, other stops, other attractions and All Buses are not linked). Search: search icon → tap field or "Westminster" → Blue Route result → stop screen.

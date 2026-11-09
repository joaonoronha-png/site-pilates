# JD Car Detailing — Website (demo)

Single-page, fully responsive site for **JD Car Detailing**, a mobile auto detailing business in Clearwater, FL.

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`). No build step.

## Features
- Animated preloader, hero with foam-bubble canvas, parallax and word-by-word title reveal
- "Open now" badge and "next available" slot (Clearwater time)
- Services cards with 3D tilt + spotlight hover
- Packages with Sedan / SUV / Truck price toggle and Maintenance Club strip
- Animated process timeline, stat counters, rotating badge, marquee
- Filterable gallery with lightbox (keyboard + arrows)
- Review highlights slider (summarized from public reviews; swap in verbatim reviews when available)
- Live quote builder (size + package + add-ons) that sends every selection to the business WhatsApp
- ZIP-code service-area checker + map
- FAQ accordion, CTA banner, mobile sticky Call / Text / Quote bar
- Custom cursor, magnetic buttons, scroll progress bar, reduced-motion support, SEO + schema.org

## Editing
- Phone: search for `7277464419` / `(727) 746-4419`
- Prices: `PRICES` and `ADDONS` in `assets/js/main.js` and `data-prices` in `index.html`
- Photos: `assets/img/` — current images are free stock photos (Pexels) used as placeholders;
  swap them for the business's own Instagram photos when available.

## Brand assets
- `assets/img/jd-logo.png` — the business's real logo (from its public TikTok profile @cardetailing.jd), background removed.
- Brand colors (orange / silver / black) taken from the logo.
- Public profiles: Instagram/TikTok/Facebook `cardetailing.jd`. Their beacons.ai link page is used only as an information source; all booking goes to WhatsApp.

## Real content from @cardetailing.jd (Instagram, public)
- `assets/img/ig/` — covers of the business's public Instagram reels (360×640, the max Instagram serves for covers):
  company photos (owner shots kept but not used on the page), Shaq Duty detail, Lamborghini, Porsche, Honda, Lexus, paint correction,
  paint gauge, engine bay, interior "before". Shown as photos on the site (no Instagram links/videos).
- Bio facts used: "Mobile Car Wash & Professional Detailing", "We come to you: home or office",
  "Comfort + Quality + Trust", "We make your car shine anywhere", 🇺🇸🇻🇪, 1.9K followers.
- Real photos are used only where their portrait framing fits (gallery, about, exterior card, Shaq section); landscape slots use professional stock photos.

## 3D satellite map
- Self-hosted, no external tiles: `assets/map/sat-detail.jpg` (≈2.2 km, ~0.7 m/px) and `assets/map/sat-context.jpg` (≈12 km)
  are public-domain aerial imagery (USGS / USDA NAIP), plus `assets/map/buildings.geojson` — 2,071 real building footprints
  with heights from OpenStreetMap (© OpenStreetMap contributors, ODbL), rendered as 3D with MapLibre.
- Before/after sliders were removed (no real before/after photos yet).

## Google Business Profile content (from owner-provided screen recordings, Nov 2026)
- Rating: 5.0 · 108 Google reviews (used in hero, stats, reviews section and schema.org aggregateRating).
- Five real reviews (Winston Ramsay, zuexyfn, Parker Reinheimer, Daniela Rodriguez, Larry Alvarez). The recordings showed
  Google's Portuguese translation; English text is a faithful re-translation — swap in exact original wording if available.
- `assets/img/g/` — photos from the Google listing: Nissan 370Z with the JD trailer, F-150, F-150 interior, BMW X6, Corolla, Traverse.

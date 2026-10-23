# AgroMind

**An offline-first agronomy platform for growers — in your browser.**

A crop knowledge base, a season planner, practical field calculators, live weather with planting advice, and a field journal. Crop data and calculators run fully offline; weather uses the free open-meteo API (no key). Nothing is uploaded.

## Pages
- **Home** (`index.html`) — landing with a live 3D terrain hero, stats and navigation.
- **Crops** (`crops.html`) — searchable library of 18 crops: spacing, season, days-to-harvest, water/sun, soil pH, sow depth, companions, avoid-with, notes.
- **Planner** (`planner.html`) — month-by-month sow/transplant/harvest calendar + bed spacing calculator.
- **Tools** (`calculators.html`) — fertilizer-by-N, irrigation (ET), yield, seed-rate, compost mix, plant-count.
- **Field** (`field.html`) — live weather + 7-day forecast + planting/watering advice, and a field journal.
- **Settings** (`settings.html`) — metric/imperial units, theme, accent, JSON export/import.

## Highlights (50+ features)
18-crop database with 11 attributes each · search & season filter · crop detail · planting calendar · multi-crop plan · 6 calculators · live weather + forecast · frost/watering/planting advice · field journal (add/edit/delete, status) · metric/imperial · JSON backup · 3D terrain hero (Three.js) · custom cursor · ambient motion · light & dark · 4 accents · keyboard shortcuts · autosave · offline-first · responsive.

## Deploy (free)
Static site, no build. Upload the folder (all `.html`, `core.css`, `app.css`, `core.js`, `app.js`, `three.min.js`) to a GitHub repo → connect Netlify/Vercel. `index.html` is the entry. Local: `python3 -m http.server`.

## Tech
Vanilla HTML/CSS/JS + Three.js (bundled locally, works offline). Weather via open-meteo. Fonts: Bricolage Grotesque, Inter, IBM Plex Mono. No framework, no tracker, no backend.

# AgroMind — Plan

**What it is:** An offline-first agronomy platform for smallholders, gardeners and students. A crop knowledge base, a planting planner, practical calculators (spacing, fertilizer/NPK, irrigation, yield, compost, seed rate), a field journal, and live weather-based advice. Core tools run fully offline; weather uses the free open-meteo API (no key) client-side.

**Visual identity:** Earthy / organic (distinct lane from Loom/Pulse/Forge/Mimic). Deep forest-charcoal canvas, leaf-green + earth-amber accents, cream text; Bricolage Grotesque display + Inter + IBM Plex Mono. Signature motion: a generative **growing vine/sprout** hero that grows, sprouts leaves and sways, over soft green light. Custom cursor. Bespoke leaf/sprout logo. No emojis — inline SVG icons.

**Tech:** Static multi-page site. Shared `agro.css` + `agro.js`. State in localStorage (`agro_mp`): field journal, saved plans, prefs. Weather via open-meteo (geocoding + forecast), fully client-side, no key.

## Pages
1. **index.html — Home (landing)**: growing-vine hero, live journal/crop stats, feature grid, marquee, CTA.
2. **crops.html — Crop library**: searchable database of ~18 crops with season, spacing, days-to-harvest, water/sun need, soil pH range, sowing depth, companions, notes; filter by season/type.
3. **planner.html — Planner**: pick crops → planting calendar (sow/transplant/harvest windows by month), bed spacing calculator (plants per bed), succession reminders, save a plan.
4. **calculators.html — Calculators**: NPK/fertilizer amount, irrigation (ET-based), yield estimate, seed rate, plant spacing/row, compost C:N mix.
5. **field.html — Field & weather**: live weather for a location (open-meteo) + planting/watering advice; a field journal (add plots, log tasks/observations, status).
6. **settings.html — Settings**: theme, accent, units (metric/imperial), data export/import, journal reset, feature list, about.

## 50+ features
Crops (12): searchable crop DB, per-crop season, spacing, days-to-harvest, water need, sun need, soil pH range, sowing depth, companions, avoid-with, notes, filter by season/type.
Planner (8): month-by-month sow/transplant/harvest calendar, multi-crop plan, bed spacing → plant count, row calculator, succession spacing, save plan, load plan, plan summary.
Calculators (10): fertilizer by N target, NPK blend split, irrigation liters/day, yield estimate, seed rate per area, plant spacing grid, compost brown:green ratio, unit conversion, area calc, germination-rate adjust.
Field & weather (8): geocode a place, current weather, 7-day forecast, frost warning, watering advice, planting-window advice, field journal (add/edit/delete plot), task log.
Platform (12+): multi-page nav, light & dark, accents, metric/imperial units, custom cursor, growing-vine motion, scroll reveals, journal autosave, export/import JSON, copy results, keyboard shortcuts, offline (except weather), responsive.

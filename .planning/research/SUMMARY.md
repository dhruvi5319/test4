# Project Research Summary

**Project:** Simple Weather App
**Domain:** Frontend-Only Consumer Weather Application
**Researched:** 2026-04-28
**Confidence:** HIGH

## Executive Summary

This is a frontend-only web app serving a saturated but poorly executed market. The core user job is simple and consistent across all research: answer "what should I wear / do I need an umbrella?" in under 3 seconds. Domain, UX, and competitive research all converge on the same principle — **ruthless simplicity beats feature breadth**. The winning differentiator is being faster, cleaner, and less annoying than Weather.com/AccuWeather (a low bar), while being more polished than developer tools like `wttr.in`. The market gap is real: 100M daily queries to an ASCII terminal tool proves demand for no-account, instant weather access; no mainstream-quality web app has filled this gap cleanly.

The recommended approach is React 19 + Vite 8 + Open-Meteo API + TanStack Query + Recharts + Tailwind CSS v4. Open-Meteo is the decisive API choice — no key required eliminates the single biggest pain point in portfolio weather apps (exposed API keys), provides richer data than OWM's free tier (14-day forecasts, no key), and sources from national weather services (ECMWF, NOAA, DWD). The stack is well-understood, has excellent charting and data-fetching tooling, and deploys to Vercel with zero configuration.

The primary risks are all execution quality issues, not technical unknowns: timezone handling bugs (UTC vs. location timezone), failing to handle geolocation denial gracefully, poor contrast on dynamic weather-condition backgrounds, and not caching API responses (leading to redundant calls or stale-data confusion). All pitfalls are well-documented and preventable with the right patterns from the start. There are no fundamental architecture unknowns.

---

## Key Findings

### Recommended Stack

All four research files independently converge on the same stack. Open-Meteo is the unanimous API recommendation — no key, no security risk, superior free tier. React + Vite is the clear framework choice for its charting library ecosystem and TanStack Query integration. Tailwind CSS v4 with its Vite plugin is the styling default in 2026. No alternative seriously challenges these choices.

**Core technologies:**
- **React 19 + TypeScript**: Component model + TanStack Query integration — best ecosystem for data fetching, charting, and state management
- **Vite 8**: Build tool with `npm create vite@latest -- --template react-ts`; HMR, env vars, static deploy to `dist/`
- **Open-Meteo API**: Primary weather data source — completely free, no API key, 14-day forecasts, `timezone=auto` param, CC BY 4.0 attribution required
- **TanStack Query v5**: API caching layer — `staleTime: 10min` prevents redundant calls; `isLoading`/`isError` states handle UI feedback
- **Recharts**: React-native charting — `AreaChart` for temperature trend, `BarChart` for precipitation probability
- **Tailwind CSS v4**: Utility-first styling via Vite plugin — fast responsive layout, no CSS file management overhead
- **Browser Geolocation API + Nominatim**: GPS detection + free reverse geocoding (no key required)
- **Vercel**: Zero-config deployment, HTTPS by default (required for Geolocation API), auto-deploys from GitHub

### Expected Features

Domain and UX research agree on feature priority. The top 2–3 user jobs (immediate clothing decision, day planning, week planning) cover ~90% of app opens. Features beyond that tier should be deferred.

**Must have (P0 — table stakes):**
- Current temperature (large, dominant) + feels-like temperature — primary data pair
- Weather condition with icon + text label (day/night variants required — sun at 9pm destroys trust)
- Today's high / low + precipitation probability %
- Location search by city name with autocomplete after 2+ chars
- Unit toggle (°C / °F) — visible on main screen, persisted in localStorage
- 7-day daily forecast (day, icon, high/low, precip%)
- Responsive mobile-first layout

**Should have (P1 — differentiators):**
- Hourly forecast for next 24h (horizontal scroll row of cards)
- GPS geolocation — opt-in button, not automatic on load; graceful fallback if denied
- Sunrise / sunset times
- UV index, wind speed + direction, humidity, visibility
- Skeleton loading states + stale data timestamp ("Updated 5m ago")
- Condition-aware background (sky color shifts with weather/time-of-day)
- `aria-live` regions for data updates; WCAG AA contrast on all condition backgrounds

**Defer (v2+):**
- Multiple saved locations (requires localStorage architecture upgrade)
- Animated weather backgrounds (CSS keyframes; non-trivial to do well)
- Air quality index (Open-Meteo has AQI endpoint; defer to keep v1 simple)
- Weather alerts / severe weather warnings (legal complexity, NWS feed integration)
- Radar maps (MapLibre/Leaflet complexity; out of scope for "simple")
- Push notifications, user accounts, historical data (requires backend)

**Anti-features — never build:**
- Autoplay video, excessive ad slots, account creation modals, news/trending content

### Architecture Approach

This is a single-page application with no backend. All state is component-local + TanStack Query cache + localStorage. The architecture is straightforward: a location state drives all API calls; TanStack Query caches responses keyed by `[lat, lon]`; components are organized around data tiers (current, hourly, daily). The only architectural decision requiring care is the separation of geocoding (city search → lat/lon via Open-Meteo Geocoding API) from weather fetching (lat/lon → weather data via Open-Meteo Forecast API), and the addition of Nominatim for reverse geocoding when GPS is used.

**Major components:**
1. **LocationBar** — Search input with autocomplete (Open-Meteo Geocoding), GPS button, recent locations chips (localStorage)
2. **CurrentConditions** — Hero section: large temp, feels-like, condition icon+text, high/low, precip%; condition-aware background; day/night icon variant logic
3. **HourlyForecast** — Horizontal scroll row; time + icon + temp + precip%; min 44px touch targets
4. **DailyForecast** — 7-row vertical list; day + icon + high/low + precip%; Recharts AreaChart for temperature trend overlay (optional)
5. **WeatherDetails** — Secondary metrics: UV, wind, humidity, visibility, sunrise/sunset; collapsed by default (progressive disclosure)
6. **SettingsBar** — °C/°F toggle (localStorage persist); "Updated [time]" freshness indicator
7. **API layer** — `useWeather(lat, lon)` hook wrapping TanStack Query + Open-Meteo fetch; `useGeocode(query)` hook for search; error/loading state surfaced to UI

### Critical Pitfalls

All four research sources identify overlapping risks. The following are non-negotiable to get right from Phase 1:

1. **Timezone bugs** — Open-Meteo returns UTC by default; use `timezone=auto` query param and `Intl.DateTimeFormat` for display. Never use the browser's local timezone for the location's data. This breaks sunrise/sunset, hourly labels, and all time-dependent displays.
2. **Geolocation denial with no fallback** — ~10%+ of desktop users deny geolocation; many more on first load. Never block UI on permission; show city search as the primary input; geolocation is an opt-in enhancement, not a gate.
3. **API key exposure (if switching to OWM)** — Open-Meteo eliminates this entirely. If OWM is used, document the exposure, set HTTP referrer restrictions in OWM dashboard, and never commit `.env` files.
4. **Contrast failures on dynamic backgrounds** — White text on sky-blue (sunny) and light-gradient backgrounds frequently fails WCAG 1.4.3 (4.5:1 AA). Test every condition state + time-of-day. This is a common failure in the 26,000+ portfolio weather apps surveyed.
5. **No loading/error/stale states** — Blank screen on API failure or slow network permanently loses users. TanStack Query's `isLoading`/`isError` + skeleton components + cached stale-data display ("last updated N minutes ago") must be built in from the start, not added later.
6. **Fake precision / unit mismatch** — Show integers ("18°C", not "18.47°C"); auto-detect locale for default unit; provide visible toggle. Burying °C/°F in settings is cited as a top complaint across all competitive research.

---

## Implications for Roadmap

Based on the combined research, 4 phases are suggested. The ordering is driven by: (1) data-layer correctness must precede visual polish, (2) P0 features must ship before P1 features, (3) accessibility is woven in from Phase 1 not bolted on at the end.

### Phase 1: Foundation + Current Conditions
**Rationale:** Everything else depends on the API integration and location architecture being correct. Timezone handling, geolocation fallback, and caching strategy must be established here — retrofitting these later is the #1 source of bugs in the competitive landscape survey.
**Delivers:** Working app that answers the core question — "what is the weather right now at my location?"
**Implements:** Vite + React + TypeScript scaffold; Open-Meteo API integration; TanStack Query setup with `staleTime`; LocationBar (search + GPS); CurrentConditions hero; `timezone=auto` from day 1; skeleton loading + error states; °C/°F toggle with localStorage persistence
**Avoids:** Timezone bugs, geolocation-denial blank screens, API key exposure, no-error-state failure

### Phase 2: Forecast Views
**Rationale:** After current conditions work correctly, the next highest-value features by usage frequency are hourly and 7-day forecasts. These use the same API call (Open-Meteo returns all data in one request), so it's an additive rendering phase, not a new integration.
**Delivers:** Complete weather picture — hourly scroll + 7-day summary rows with precipitation probability
**Implements:** HourlyForecast component (horizontal scroll, 44px touch targets, time + icon + temp + precip%); DailyForecast component (vertical list, high/low + precip%); Recharts AreaChart for temperature trend; day/night icon variant logic; precipitation % on all forecast cards
**Avoids:** Missing precip% (top user complaint), non-responsive overflow cards, tiny tap targets

### Phase 3: Details + Polish
**Rationale:** Secondary data (UV, wind, humidity, sunrise/sunset) and visual quality (condition backgrounds, animations) are differentiators, not table stakes. Building them after the core is stable avoids premature complexity.
**Delivers:** Full competitive parity with major apps minus the bloat; visual identity
**Implements:** WeatherDetails panel (UV, wind, humidity, visibility, sunrise/sunset) with progressive disclosure; condition-aware background gradients (day/night, weather state); `prefers-reduced-motion` support for any animations; WCAG contrast audit on all condition backgrounds; "Updated [time]" freshness indicator; recent locations in localStorage
**Avoids:** Contrast failures on dynamic backgrounds, animations triggering vestibular issues, data density overload

### Phase 4: Quality + Accessibility Hardening
**Rationale:** Accessibility and error-case handling are what separates portfolio-quality builds from production-quality ones. The competitive research shows 26,000+ portfolio apps fail here. This phase is what makes the app genuinely usable, not just visually impressive.
**Delivers:** Accessible, production-hardened app; correct behavior in all edge cases
**Implements:** Full WCAG AA audit (1.4.1 color-not-only, 1.4.3 contrast, 2.5.8 touch targets, screen reader aria labels, `aria-live` for data updates); offline/stale-data graceful degradation with cached localStorage data; "city not found" / disambiguation error states; Vercel deployment with HTTPS; attribution footer (Open-Meteo CC BY 4.0)
**Avoids:** Color-blindness failures, screen reader gaps, blank-screen on network error, localhost-only geolocation

### Phase Ordering Rationale

- **API-first ordering**: Phases 1→2→3 build on a single, stable Open-Meteo request. No phase requires a new API integration (Nominatim for reverse geocoding is the only addition). This eliminates integration risk from later phases.
- **Progressive disclosure mirrors user priority**: Each phase adds the next tier of data from the domain research (P0 → P1 → P1/P2), matching how users actually scan a weather app.
- **Quality before extras**: Phase 4 before any v2 features (AQI, animations, radar) ensures the core is solid. The competitive research shows incumbents failed by layering complexity onto a shaky core.
- **No backend dependency at any phase**: The entire roadmap is frontend-only as specified. All state is TanStack Query cache + localStorage.

### Research Flags

Phases with standard patterns (no deeper research needed):
- **Phase 1:** React + Vite + TanStack Query + Open-Meteo are extremely well-documented. Setup is mechanical.
- **Phase 2:** Recharts AreaChart/BarChart patterns are standard; Open-Meteo API already returns hourly + daily in one call.
- **Phase 3:** Tailwind gradient utilities + `prefers-reduced-motion` are standard patterns.

Phases that may benefit from deeper research during planning:
- **Phase 3 (condition backgrounds):** Color palette design for all weather states + day/night variants + WCAG contrast simultaneously is non-trivial. May need a dedicated design pass before implementation.
- **Phase 4 (accessibility audit):** Recharts SVG chart accessibility (screen reader support for data charts) is an area with inconsistent library support — verify what Recharts provides vs. what needs manual ARIA enhancement.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified against official docs (Vite, Open-Meteo, MDN Geolocation). React + TanStack Query recommendation is based on ecosystem analysis, not benchmarks. |
| Features | HIGH | Domain + UX + competitive research all converge on the same P0/P1 list. Priority order is well-justified across sources. |
| Architecture | HIGH | Single-page app with no backend is architecturally simple. Component boundaries are standard. TanStack Query patterns are established. |
| Pitfalls | HIGH | Pitfalls are directly observable in the 26,000+ portfolio app landscape and in competitive sites (visited live). Timezone + geolocation + contrast are the canonical failure modes. |

**Overall confidence:** HIGH

### Gaps to Address

- **Recharts chart accessibility**: Library support for screen readers on SVG charts is underspecified in research. Validate during Phase 2 — if Recharts doesn't provide adequate ARIA support natively, consider a `<table>` fallback for forecast data alongside charts.
- **Open-Meteo geocoding quality**: The geocoding API (city search autocomplete) was not deeply tested for edge cases (ambiguous city names like "Springfield"). Nominatim is available as a fallback. Validate during Phase 1 implementation.
- **Condition-aware color palette**: The specific color values for all weather-condition + time-of-day combinations that simultaneously satisfy visual design and WCAG 1.4.3 contrast requirements are not specified in research. This needs a design decision before Phase 3 implementation.
- **Mobile session performance target**: UX research cites < 2s load on mobile; technical research says React + Recharts + TanStack Query ≈ 250KB gzipped. This is acceptable but should be verified against Core Web Vitals in Phase 1 before adding chart libraries in Phase 2.

---

## Sources

### Primary (HIGH confidence — official docs, live sites verified 2026-04-28)
- Open-Meteo API docs: https://open-meteo.com/en/docs — API params, timezone handling, WMO codes, pricing
- Open-Meteo Pricing: https://open-meteo.com/en/pricing — rate limits, non-commercial terms
- OpenWeatherMap Pricing: https://openweathermap.org/price — free tier comparison
- Vite Getting Started: https://vitejs.dev/guide/ — v8.0.10 confirmed
- MDN Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API — Baseline Widely Available
- W3C WCAG 2.2: https://www.w3.org/WAI/WCAG22/ — 1.4.1, 1.4.3, 2.5.8 criteria
- Weather.com, AccuWeather, Wunderground, Windy: live site observations
- wttr.in GitHub README: https://github.com/chubin/wttr.in — 29.5k stars, ~100M queries/day stats
- GitHub search (weather app javascript, by stars): 26,200+ repositories surveyed

### Secondary (MEDIUM confidence — established patterns, community consensus)
- Nielsen Norman Group: progressive disclosure, touch target sizing, mobile session length
- Recharts npm/ecosystem: library capability assessment from training data + npm stats
- TanStack Query v5: caching patterns from training data + npm stats
- Dark Sky legacy analysis: training data + PirateWeather background documentation
- User scenario analysis: synthesized from domain knowledge + API data structures

### Tertiary (LOW confidence — inferred)
- "What users rave about" in weather apps: inferred from adoption patterns (Dark Sky legacy, wttr.in scale), not from review aggregation
- Micro-interaction UX recommendations: industry pattern consensus, not formally user-tested

---
*Research completed: 2026-04-28*
*Ready for roadmap: yes*

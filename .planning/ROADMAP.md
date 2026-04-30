# Roadmap: Simple Weather App

## Overview

A four-phase build delivering a frontend-only weather application that answers "what should I wear right now?" in under 3 seconds for any location. Phase 1 establishes the correct data foundation and core UI. Phase 2 adds forecast depth. Phase 3 adds visual identity and secondary details. Phase 4 hardens accessibility and production quality. The entire stack (React 19 + Vite + Open-Meteo + TanStack Query + Recharts + Tailwind CSS v4) is frontend-only with no backend at any phase.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned v1.0 milestone work
- Decimal phases (e.g., 2.1): Urgent insertions via `/pivota_spec-insert-phase` if needed

- [ ] **Phase 1: Foundation + Current Conditions** - Working app scaffold with live current weather for any searched location
- [ ] **Phase 2: Forecast Views** - Complete hourly + 7-day forecast with precipitation and temperature trend chart
- [ ] **Phase 3: Details + Polish** - Secondary weather metrics, condition-aware visual identity, freshness indicators
- [ ] **Phase 4: Quality + Accessibility Hardening** - WCAG AA compliant, production-deployed, all error/edge cases handled

## Phase Details

### Phase 1: Foundation + Current Conditions
**Status**: passed
**Goal**: Users can instantly see current weather conditions for any location they search for
**Depends on**: Nothing (first phase)
**Requirements**: REQ-01 (location search), REQ-02 (current conditions)
**Success Criteria** (what must be TRUE):
  1. User can type a city name and see matching suggestions after 2+ characters; selecting one loads weather data
  2. User can see current temperature (large/dominant), feels-like temperature, weather condition with icon and text label, today's high/low, humidity, wind speed, and precipitation probability
  3. User can tap a GPS button to auto-detect location; if permission is denied, the search input remains usable with no blank screen or stuck state
  4. User can toggle between °C and °F, and the preference persists after page reload
  5. User sees a skeleton loading state while data is fetching and a clear error message if the API call fails — never a blank screen
**Plans**: 5 plans

Plans:
- [ ] 01-01-PLAN.md — Vite + React 19 + TypeScript + Tailwind CSS v4 + TanStack Query scaffold
- [ ] 01-02-PLAN.md — Open-Meteo API layer (useGeocode + useWeather hooks, timezone=auto, staleTime 10min)
- [ ] 01-03-PLAN.md — LocationBar component (city search autocomplete + GPS opt-in button)
- [ ] 01-04-PLAN.md — CurrentConditions hero component (temperature, feels-like, condition icon, high/low, precip%, humidity, wind)
- [ ] 01-05-PLAN.md — °C/°F toggle with localStorage persistence + skeleton/error states

### Phase 2: Forecast Views
**Status**: passed
**Goal**: Users can see a complete weather picture — hourly conditions for the next 24 hours and a 7-day daily forecast summary
**Depends on**: Phase 1
**Requirements**: REQ-03 (multi-day forecast), REQ-04 (weather icons/visual indicators)
**Success Criteria** (what must be TRUE):
  1. User can scroll a horizontal row of hourly forecast cards (next 24h) showing time, condition icon, temperature, and precipitation probability; all cards have 44px minimum touch targets
  2. User can see a vertical 7-day daily forecast list showing day name, condition icon, high/low temperatures, and precipitation probability for each day
  3. Condition icons correctly show day vs. night variants (sun icon does not appear at 9pm)
  4. A Recharts AreaChart temperature trend visualization is visible on the daily forecast — user can see the temperature curve across the week at a glance
  5. Precipitation probability is displayed on both hourly and daily cards (not missing from either view)
**Plans**: TBD

Plans:
- [ ] 02-01: HourlyForecast component (horizontal scroll, 44px touch targets, time + icon + temp + precip%)
- [ ] 02-02: DailyForecast component (vertical list, day + icon + high/low + precip%) + day/night icon variant logic
- [ ] 02-03: Recharts AreaChart temperature trend overlay for weekly view

### Phase 3: Details + Polish
**Status**: failed
**Goal**: Users get a visually distinctive, complete app with secondary weather metrics and a condition-aware interface that feels premium
**Depends on**: Phase 2
**Requirements**: REQ-05 (desktop + mobile display), REQ-04 (continued — visual polish of icons/backgrounds)
**Success Criteria** (what must be TRUE):
  1. App displays correctly and usably on mobile (375px) and desktop (1280px) viewports — no overflow, no tiny tap targets, no truncated labels
  2. User can expand a "Details" panel (collapsed by default) to see UV index, wind speed + direction, visibility, and sunrise/sunset times
  3. App background color/gradient shifts to reflect current weather condition and time of day (e.g., deep blue at night, sky blue on clear day, grey on overcast) — all condition + time-of-day combinations pass WCAG 1.4.3 4.5:1 contrast ratio
  4. A freshness indicator ("Updated 5m ago") is visible, and recent location searches appear as quick-select chips that persist across reloads
  5. Any animations or transitions respect `prefers-reduced-motion` — no motion plays for users who have opted out
**Plans**: TBD

Plans:
- [ ] 03-01: Responsive layout audit + mobile-first refinement (Tailwind breakpoints, touch targets, overflow fixes)
- [ ] 03-02: WeatherDetails panel (UV, wind direction, visibility, sunrise/sunset) with progressive disclosure
- [ ] 03-03: Condition-aware background gradients (all weather states × day/night) with WCAG contrast validation
- [ ] 03-04: Freshness indicator ("Updated N ago") + recent locations localStorage chips + `prefers-reduced-motion` guard

### Phase 4: Quality + Accessibility Hardening
**Goal**: App is fully accessible, production-deployed on HTTPS, and handles every edge and error case gracefully
**Depends on**: Phase 3
**Requirements**: REQ-01 through REQ-05 (hardened — all requirements made production-quality)
**Success Criteria** (what must be TRUE):
  1. All interactive elements (search input, GPS button, forecast cards, toggle) are reachable and operable via keyboard; screen readers announce weather data updates via `aria-live` regions
  2. App passes WCAG AA audit: 1.4.1 (color not sole conveyor of meaning), 1.4.3 (4.5:1 contrast ratio on all condition backgrounds), 2.5.8 (44px touch targets) — verified with automated + manual check
  3. If a searched city is not found or is ambiguous, user sees a clear "City not found — try a different spelling" message rather than a blank result or silent failure
  4. If the network is offline or the API returns an error, the app displays the last cached data (if available) with a "showing data from X minutes ago" indicator, or a friendly "unable to load weather" message if no cache exists
  5. App is live at a public HTTPS URL (Vercel deployment), geolocation works correctly (requires HTTPS), and the Open-Meteo CC BY 4.0 attribution footer is visible
**Plans**: 4 plans

Plans:
- [ ] 04-01-PLAN.md — Keyboard nav hardening + aria-describedby + skip link + aria-live region permanence
- [ ] 04-02-PLAN.md — axe-core dev audit integration + TemperatureTrendChart sr-only table + touch target confirmation
- [ ] 04-03-PLAN.md — Offline banner + stale-cache display + city-not-found inline message
- [ ] 04-04-PLAN.md — vercel.json SPA routing config + README deployment docs + attribution footer audit

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Current Conditions | 0/5 | Planned | - |
| 2. Forecast Views | 0/3 | Not started | - |
| 3. Details + Polish | 0/4 | Not started | - |
| 4. Quality + Accessibility Hardening | 0/4 | Not started | - |

---

## Requirement Coverage

| Requirement | Description | Phase |
|-------------|-------------|-------|
| REQ-01 | User can search for weather by city/location name | Phase 1 |
| REQ-02 | User can view current weather conditions (temperature, description, humidity, wind) | Phase 1 |
| REQ-03 | User can view a multi-day forecast (3–7 days) | Phase 2 |
| REQ-04 | User can see weather icons/visual indicators for conditions | Phase 2 |
| REQ-05 | App displays data clearly on both desktop and mobile | Phase 3 |

**Coverage: 5/5 requirements mapped ✓**

---

## Stack Reference

Decided per research (SUMMARY.md, 2026-04-28):

| Layer | Technology | Decision |
|-------|-----------|----------|
| Framework | React 19 + TypeScript | Component model + TanStack Query integration |
| Build tool | Vite 8 | `npm create vite@latest -- --template react-ts`; HMR, static deploy |
| Styling | Tailwind CSS v4 | Vite plugin; utility-first responsive layout |
| Weather data | Open-Meteo API | No API key, 14-day forecasts, `timezone=auto`, CC BY 4.0 |
| Data fetching | TanStack Query v5 | `staleTime: 10min`; `isLoading`/`isError` states |
| Charting | Recharts | `AreaChart` (temp trend), `BarChart` (precip probability) |
| Geocoding | Open-Meteo Geocoding + Nominatim (GPS fallback) | No key required for either |
| Deployment | Vercel | Zero-config, HTTPS by default, required for Geolocation API |

---

## Critical Pitfalls (Non-Negotiable from Phase 1)

Per research — these must be correct from the start or they break everything:

1. **`timezone=auto`** — Set on every Open-Meteo request from day 1; use `Intl.DateTimeFormat` for display
2. **Geolocation fallback** — GPS is opt-in; search input is always the primary path; denial never blocks the UI
3. **No API key exposure** — Open-Meteo eliminates this risk entirely; never switch to OWM without documenting exposure
4. **WCAG contrast on dynamic backgrounds** — Test all condition + time-of-day combinations in Phase 3 before shipping Phase 4
5. **Loading/error/stale states** — Built in Phase 1 via TanStack Query; never left as a "polish later" item
6. **Integer display** — Show "18°C" not "18.47°C"; auto-detect locale for default unit; toggle visible on main screen

---
*Roadmap created: 2026-04-29*
*Based on: PROJECT.md + research/SUMMARY.md*
*Granularity: Standard (5-8 phases → 4 phases, appropriate for focused scope)*
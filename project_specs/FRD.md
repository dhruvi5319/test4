# Functional Requirements Document (FRD)
## Simple Weather App

**Version:** 1.0
**Date:** 2026-04-29
**Status:** Active
**Source documents:** PRD.md, TECH-ARCH.md, USER-STORIES.md, ROADMAP.md

---

## Table of Contents

1. [FR-01: Location Search with Autocomplete](#fr-01-location-search-with-autocomplete)
2. [FR-02: GPS Geolocation Opt-In](#fr-02-gps-geolocation-opt-in)
3. [FR-03: Current Weather Display](#fr-03-current-weather-display)
4. [FR-04: Unit Toggle °C/°F](#fr-04-unit-toggle-cf)
5. [FR-05: Hourly Forecast](#fr-05-hourly-forecast)
6. [FR-06: Daily Forecast](#fr-06-daily-forecast)
7. [FR-07: Temperature Trend Chart](#fr-07-temperature-trend-chart)
8. [FR-08: Weather Details Panel](#fr-08-weather-details-panel)
9. [FR-09: Condition-Aware Backgrounds](#fr-09-condition-aware-backgrounds)
10. [FR-10: Loading and Error States](#fr-10-loading-and-error-states)
11. [FR-11: Accessibility](#fr-11-accessibility)
12. [FR-12: Freshness Indicator + Recent Locations](#fr-12-freshness-indicator--recent-locations)

---

## FR-01: Location Search with Autocomplete

**Phase:** 1 — Foundation + Current Conditions
**Requirement:** REQ-01
**Stories:** US-01 through US-05 (Epic E1)

### Description

A search input in the LocationBar component that accepts city name text and displays autocomplete suggestions from the Open-Meteo Geocoding API after 2+ characters are typed. Selecting a suggestion loads weather data for that location.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| User keystrokes | string | Keyboard/touch input |
| Geocoding API response | JSON | Open-Meteo Geocoding API |

### Processing / Behavior

1. User focuses the search input.
2. On each keystroke, if `input.length >= 2`, fire debounced geocode request (300–500ms debounce).
3. Call `GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json`.
4. Display up to 5 results as a dropdown list below the input. Each result shows: city name + country code (e.g., "London, GB").
5. User selects a result by click, tap, or keyboard (arrow keys + Enter).
6. On selection: populate input with selected city name; close dropdown; store `{name, latitude, longitude, country}` as active location state; trigger weather fetch.
7. Pressing Enter with dropdown open selects the first suggestion.
8. Pressing Escape closes the dropdown without selection.
9. If `input.length < 2`, hide/clear dropdown.

### Outputs

| Output | Description |
|--------|-------------|
| Dropdown list | Up to 5 city suggestions |
| Active location state | `{name, latitude, longitude, country}` stored in component state |
| Weather fetch trigger | `useWeather(lat, lon)` called with selected coordinates |

### Validation Rules

- Minimum 2 characters before geocode request fires.
- Debounce: 300–500ms — do not fire on every keystroke.
- If API returns 0 results: show inline message "No cities found — try a different spelling."
- Maximum 5 suggestions displayed (use `count=5` param).
- Input accepts any Unicode text (international city names).

### Error Handling

| Error | Behavior |
|-------|----------|
| Geocoding API network failure | Show "Unable to search — check your connection" below input; do not crash |
| 0 results returned | Show "No cities found — try a different spelling" in dropdown area |
| API timeout (> 5s) | Treat as network failure |

### Dependencies

- Open-Meteo Geocoding API (no key required)
- `useGeocode(query)` TanStack Query hook
- LocationBar component
- Active location state (drives FR-03, FR-05, FR-06)

---

## FR-02: GPS Geolocation Opt-In

**Phase:** 1 — Foundation + Current Conditions
**Requirement:** REQ-01
**Stories:** US-16 through US-18 (Epic E6)

### Description

A GPS icon button in the LocationBar that, when tapped, requests browser geolocation permission and — if granted — reverse-geocodes the coordinates to a city name and loads weather for that location. Permission denial never blocks the UI.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| User tap/click on GPS button | Event | Browser |
| `GeolocationPosition` | Object | `navigator.geolocation.getCurrentPosition()` |
| Reverse geocode response | JSON | Nominatim API |

### Processing / Behavior

1. GPS button is visible in LocationBar at all times alongside the search input.
2. On button tap: call `navigator.geolocation.getCurrentPosition(success, error, {timeout: 10000})`.
3. Show a loading indicator on the GPS button while awaiting permission/position.
4. **On success:** receive `{latitude, longitude}`. Call Nominatim reverse geocode: `GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json`. Extract city/town name. Set as active location. Trigger weather fetch.
5. **On denial / error:** show inline message "Location access denied — search for a city above." Search input remains fully usable. No blank screen, no stuck state.
6. Geolocation is **never** triggered automatically on page load — only on explicit button tap.

### Outputs

| Output | Description |
|--------|-------------|
| Active location state | `{name, latitude, longitude}` from reverse geocode |
| Weather fetch trigger | `useWeather(lat, lon)` called |
| Error message | Shown inline if permission denied |

### Validation Rules

- Must only use HTTPS (geolocation API requires secure context).
- Timeout: 10 seconds max for position acquisition.
- If Nominatim returns no city name, fall back to displaying coordinates (e.g., "37.77°N, 122.42°W").
- GPS button is always visible — never hidden after use.

### Error Handling

| Error | Behavior |
|-------|----------|
| Permission denied (`PERMISSION_DENIED`) | Show "Location access denied — search for a city above" |
| Position unavailable (`POSITION_UNAVAILABLE`) | Show "Unable to detect location — search for a city above" |
| Timeout (`TIMEOUT`) | Show "Location timed out — search for a city above" |
| Nominatim network failure | Use coordinates as fallback location name |
| HTTP context (not HTTPS) | GPS button disabled with tooltip "Requires HTTPS" |

### Dependencies

- Browser Geolocation API (MDN Baseline Widely Available)
- Nominatim reverse geocode API (no key required)
- LocationBar component
- FR-01 (search input always available as fallback)

---

## FR-03: Current Weather Display

**Phase:** 1 — Foundation + Current Conditions
**Requirement:** REQ-02
**Stories:** US-06 through US-11 (Epic E2)

### Description

The CurrentConditions hero component displays the primary weather data for the active location: current temperature (large/dominant), feels-like temperature, weather condition with WMO icon and text label, today's high/low, humidity, wind speed, and precipitation probability.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Active location | `{name, latitude, longitude}` | FR-01 or FR-02 |
| Open-Meteo forecast response | JSON | `useWeather(lat, lon)` hook |
| Unit preference | `"celsius" \| "fahrenheit"` | localStorage via FR-04 |

### Processing / Behavior

1. When active location changes, `useWeather(lat, lon)` fires a request to:
   `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
2. Parse response: extract `current` fields and `daily[0]` high/low.
3. Map `weather_code` (WMO code) to condition text label and icon identifier.
4. Apply unit conversion if preference is Fahrenheit: `F = C × 9/5 + 32` (integers only — round, never show decimals).
5. Render CurrentConditions component with all fields.
6. Location name is displayed as the card/section heading.

### Outputs

| Field | Format | Example |
|-------|--------|---------|
| Temperature | Integer + unit | "18°C" or "64°F" |
| Feels-like | Integer + unit | "Feels like 15°C" |
| Condition text | String | "Partly cloudy" |
| Condition icon | SVG/image | Day/night variant based on current hour |
| High / Low | Integer + unit | "H: 21° L: 12°" |
| Humidity | Integer + % | "Humidity: 72%" |
| Wind speed | Integer + unit | "Wind: 14 km/h" or "9 mph" |
| Precipitation % | Integer + % | "Precip: 30%" |
| Location name | String | "London, GB" |

### Validation Rules

- All temperature values displayed as integers (Math.round) — never decimals.
- Wind speed: km/h when °C active; mph when °F active.
- Condition icon must use day variant if current hour (in location's timezone) is between sunrise and sunset; night variant otherwise. Never show a sun icon after dark.
- `timezone=auto` must be set on every Open-Meteo request — non-negotiable.
- If any field is missing from API response, show "—" rather than crashing.

### Error Handling

| Error | Behavior |
|-------|----------|
| API network failure | Show error state (see FR-10) |
| Missing field in response | Render "—" for that field |
| Invalid WMO code | Render generic "Unknown" condition with neutral icon |

### Dependencies

- Open-Meteo Forecast API
- `useWeather(lat, lon)` TanStack Query hook (`staleTime: 10min`)
- WMO weather code mapping table
- FR-01 / FR-02 (active location)
- FR-04 (unit preference)
- FR-10 (loading/error states)

---

## FR-04: Unit Toggle °C/°F

**Phase:** 1 — Foundation + Current Conditions
**Requirement:** REQ-02 (display), REQ-05 (usability)
**Stories:** US-19 through US-21 (Epic E7)

### Description

A visible toggle on the main screen (in SettingsBar) that switches all temperature displays between Celsius and Fahrenheit. The preference persists across page reloads via localStorage.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| User toggle interaction | click/tap | SettingsBar component |
| Stored preference | `"celsius" \| "fahrenheit"` | `localStorage.getItem("unit")` |

### Processing / Behavior

1. On app load: read `localStorage.getItem("unit")`. If present and valid, use it. If absent or invalid, default to `"celsius"`.
2. Render toggle button showing current unit (e.g., "°C / °F" with active unit highlighted).
3. On toggle: flip unit; write to `localStorage.setItem("unit", newUnit)`; re-render all temperature displays.
4. No API refetch required — temperature conversion is applied client-side to cached data.
5. Toggle is visible on the main screen at all times — never buried in a settings page.

### Outputs

| Output | Description |
|--------|-------------|
| Unit state | Global unit preference propagated to all components |
| localStorage entry | `key: "unit"`, `value: "celsius" \| "fahrenheit"` |
| Re-rendered temperatures | All temperature values converted and re-displayed |

### Validation Rules

- Only two valid values: `"celsius"` or `"fahrenheit"`. Any other localStorage value treated as invalid → default to `"celsius"`.
- Conversion: `F = Math.round(C × 9/5 + 32)`. Always integer output.
- Wind speed switches with unit: km/h (°C) ↔ mph (°F).
- Preference persists indefinitely until toggled again.

### Error Handling

| Error | Behavior |
|-------|----------|
| localStorage unavailable (private browsing) | Default to °C; toggle works in-session but does not persist |
| Invalid stored value | Default to °C |

### Dependencies

- SettingsBar component
- All temperature-displaying components (FR-03, FR-05, FR-06, FR-08)
- localStorage API

---

## FR-05: Hourly Forecast

**Phase:** 2 — Forecast Views
**Requirement:** REQ-03, REQ-04
**Stories:** US-12 through US-14 (Epic E3 subset)

### Description

A horizontally scrollable row of forecast cards showing weather conditions for each hour over the next 24 hours. Each card shows: time, condition icon, temperature, and precipitation probability. All cards meet 44px minimum touch target sizing.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Open-Meteo hourly data | JSON array | `useWeather(lat, lon)` hook |
| Unit preference | `"celsius" \| "fahrenheit"` | FR-04 |
| Location timezone | string | Open-Meteo `timezone` field in response |

### Processing / Behavior

1. Extract `hourly` arrays from Open-Meteo response: `time`, `temperature_2m`, `weather_code`, `precipitation_probability`.
2. Slice to next 24 entries starting from the current hour (use location timezone, not browser timezone).
3. For each hour: format time using `Intl.DateTimeFormat` with location timezone (e.g., "3 PM", "03:00").
4. Map `weather_code` to day/night icon variant based on hour vs. sunrise/sunset.
5. Render as horizontal scroll container. Each card: min-width sufficient for content, min-height 44px.
6. Scroll is touch-friendly (CSS `overflow-x: auto; scroll-snap-type: x mandatory`).
7. Current hour card is visually highlighted (e.g., bold or accent border).

### Outputs

| Element | Content |
|---------|---------|
| Hour label | "3 PM" or "15:00" (locale-aware) |
| Condition icon | Day/night WMO variant |
| Temperature | Integer + unit |
| Precipitation % | Integer + "%" |

### Validation Rules

- Always show exactly 24 cards (next 24 hours from current hour).
- Never use browser local timezone for time display — always use location timezone from API response.
- Touch target: each card must be at minimum 44×44px (WCAG 2.5.8).
- Precipitation probability displayed on every card — never omitted.

### Error Handling

| Error | Behavior |
|-------|----------|
| Hourly data missing | Show "Hourly forecast unavailable" placeholder in scroll area |
| Missing field for a specific hour | Show "—" for that field |

### Dependencies

- `useWeather` hook (hourly data already included in FR-03 API call with `hourly=` params)
- FR-04 (unit preference)
- FR-03 (timezone and sunrise/sunset for icon variants)
- WMO code mapping table

---

## FR-06: Daily Forecast

**Phase:** 2 — Forecast Views
**Requirement:** REQ-03, REQ-04
**Stories:** US-12 through US-14 (Epic E3 subset)

### Description

A vertical list of 7 daily forecast rows. Each row shows: day name, condition icon, high temperature, low temperature, and precipitation probability. Day/night icon variants are resolved per day.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Open-Meteo daily data | JSON array | `useWeather(lat, lon)` hook |
| Unit preference | `"celsius" \| "fahrenheit"` | FR-04 |
| Location timezone | string | Open-Meteo response |

### Processing / Behavior

1. Extract `daily` arrays: `time`, `temperature_2m_max`, `temperature_2m_min`, `weather_code`, `precipitation_probability_max`.
2. For each of 7 days:
   - Format day name: "Today", "Tomorrow", then weekday names (e.g., "Wed", "Thu").
   - Use daytime icon variant for daily rows (daily forecast is inherently daytime summary).
   - Apply unit conversion to high/low.
3. Render as a vertical list. Each row spans full width, with day, icon, high/low, and precip% in a single row layout.
4. Today's row may be visually distinguished (e.g., bold day label).

### Outputs

| Element | Content |
|---------|---------|
| Day label | "Today", "Tomorrow", "Wed", … |
| Condition icon | Daytime WMO variant |
| High temp | Integer + unit |
| Low temp | Integer + unit |
| Precipitation % | Integer + "%" |

### Validation Rules

- Always show exactly 7 days.
- Precipitation probability displayed on every row — never omitted.
- Day names use location timezone for date boundaries.
- High/low both shown — never just one.

### Error Handling

| Error | Behavior |
|-------|----------|
| Daily data missing | Show "Daily forecast unavailable" placeholder |
| Missing field for a specific day | Show "—" for that field |

### Dependencies

- `useWeather` hook (daily data in same API call)
- FR-04 (unit preference)
- FR-07 (temperature data reused for chart)
- WMO code mapping table

---

## FR-07: Temperature Trend Chart

**Phase:** 2 — Forecast Views
**Requirement:** REQ-03, REQ-04
**Stories:** US-15 (Epic E3)

### Description

A Recharts `AreaChart` displaying the temperature curve across the 7-day daily forecast. Gives users a visual at-a-glance sense of whether temperatures are rising, falling, or stable over the week.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Daily high temperatures | number[] (7 values) | FR-06 data |
| Daily low temperatures | number[] (7 values) | FR-06 data |
| Day labels | string[] | FR-06 formatted day names |
| Unit preference | `"celsius" \| "fahrenheit"` | FR-04 |

### Processing / Behavior

1. Construct data array: `[{day, high, low}, …]` for 7 days.
2. Render `<AreaChart>` with two `<Area>` series: high temperature (warm color) and low temperature (cool color).
3. X-axis: day labels (abbreviated). Y-axis: temperature values with unit label.
4. Chart is responsive (uses `<ResponsiveContainer width="100%">`).
5. Chart is lazy-loaded (dynamic import) to avoid adding Recharts to the initial bundle.
6. If `prefers-reduced-motion` is active: disable chart animation (`isAnimationActive={false}`).

### Outputs

- Visual area chart rendered below or alongside the DailyForecast list.
- Y-axis label reflects current unit (°C or °F).

### Validation Rules

- Always shows 7 data points — no partial charts.
- Y-axis auto-scales to data range (no hard-coded min/max).
- Chart width is 100% of its container — no fixed pixel widths.
- Recharts must be lazy-loaded (not in main bundle).

### Error Handling

| Error | Behavior |
|-------|----------|
| Recharts fails to load | Show "Temperature chart unavailable" text fallback |
| Data contains null/undefined | Filter or replace with interpolated value; log warning |

### Dependencies

- Recharts library (lazy-loaded)
- FR-06 (daily temperature data)
- FR-04 (unit preference)

---

## FR-08: Weather Details Panel

**Phase:** 3 — Details + Polish
**Requirement:** REQ-02 (extended), REQ-05
**Stories:** US-10, US-11 (Epic E2 subset)

### Description

A collapsible "Details" panel (collapsed by default) that reveals secondary weather metrics: UV index, wind speed + direction, visibility, sunrise time, and sunset time. Uses progressive disclosure to avoid overwhelming casual users.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Open-Meteo current data (extended) | JSON | `useWeather` hook (additional params) |
| User expand/collapse interaction | click/tap | WeatherDetails component |

### Processing / Behavior

1. Panel is collapsed by default — shows a "Details" / "More info" trigger button.
2. On expand: animate open (respect `prefers-reduced-motion` — if active, no animation).
3. Display fields:
   - **UV Index:** integer (0–11+), with label (e.g., "Low", "Moderate", "High", "Very High", "Extreme").
   - **Wind direction:** cardinal direction string (e.g., "NW") derived from wind direction degrees.
   - **Visibility:** integer in km or miles (unit-matched to temperature unit selection).
   - **Sunrise:** formatted time in location timezone (e.g., "6:23 AM").
   - **Sunset:** formatted time in location timezone (e.g., "8:47 PM").
4. Wind speed (already in FR-03 hero) may be repeated here with direction for completeness.
5. Panel state (expanded/collapsed) is not persisted — resets to collapsed on page reload.

### Outputs

| Field | Format | Example |
|-------|--------|---------|
| UV Index | Integer + label | "UV: 6 — High" |
| Wind direction | Cardinal | "NW" or "Northwest" |
| Visibility | Integer + unit | "Visibility: 10 km" |
| Sunrise | Time string | "Sunrise: 6:23 AM" |
| Sunset | Time string | "Sunset: 8:47 PM" |

### Validation Rules

- All times displayed in location timezone (never browser timezone).
- UV label thresholds: 0–2 Low, 3–5 Moderate, 6–7 High, 8–10 Very High, 11+ Extreme.
- Wind direction: derive cardinal from degrees (e.g., 315° → NW). Use 8-point compass.
- Visibility: km when °C active; miles when °F active.

### Error Handling

| Error | Behavior |
|-------|----------|
| Field missing from API | Show "—" for that field |
| UV index not available | Omit UV row rather than showing "—" |

### Dependencies

- `useWeather` hook (additional `current=` params: `uv_index`, `wind_direction_10m`, `visibility`, `sunrise`, `sunset`)
- FR-04 (unit preference for visibility)
- FR-03 (timezone context)

---

## FR-09: Condition-Aware Backgrounds

**Phase:** 3 — Details + Polish
**Requirement:** REQ-04, REQ-05
**Stories:** US-32, US-33 (Epic E9 subset)

### Description

The app's background color/gradient shifts to reflect the current weather condition and time of day (day vs. night). All condition + time-of-day combinations must pass WCAG 1.4.3 (4.5:1 contrast ratio) for text readability.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| Current WMO weather code | integer | FR-03 data |
| Is daytime boolean | boolean | Derived from current hour vs. sunrise/sunset |

### Processing / Behavior

1. Derive `isDaytime` from current hour in location timezone vs. sunrise/sunset times.
2. Map `(weatherConditionGroup, isDaytime)` to a CSS gradient class. Condition groups:
   - Clear / sunny
   - Partly cloudy
   - Overcast / cloudy
   - Fog / mist
   - Drizzle / light rain
   - Rain / heavy rain
   - Snow
   - Thunderstorm
3. Apply gradient as the app's root background (full-bleed).
4. All gradients pre-validated against WCAG 1.4.3 (4.5:1 contrast ratio) for white and dark text.
5. Background transition: smooth CSS transition on condition change (disabled when `prefers-reduced-motion` active).

### Outputs

- Background gradient applied to app root element.
- All text on all condition backgrounds passes WCAG 1.4.3 4.5:1 contrast.

### Validation Rules

- Every (condition group × day/night) combination must have a defined gradient — no fallback to white/blank.
- All gradients must be validated for WCAG 1.4.3 contrast before Phase 3 ships.
- `prefers-reduced-motion`: disable CSS transition; gradient still changes, just instantly.
- Color must not be the sole differentiator of condition type (WCAG 1.4.1) — condition text label always present.

### Error Handling

| Error | Behavior |
|-------|----------|
| Unknown WMO code | Use "overcast" daytime gradient as safe fallback |
| `isDaytime` cannot be determined | Use daytime gradient as safe fallback |

### Dependencies

- FR-03 (WMO code + timezone/sunrise/sunset)
- WMO code → condition group mapping table
- WCAG 1.4.3 pre-validated color palette (design decision required before Phase 3 — noted in ROADMAP.md)

---

## FR-10: Loading and Error States

**Phase:** 1 — Foundation + Current Conditions (established), Phase 4 (hardened)
**Requirement:** All REQs (cross-cutting)
**Stories:** US-22 through US-26 (Epic E8)

### Description

The app must never show a blank screen. All data-fetching states are handled explicitly: skeleton loading while fetching, clear error messages on failure, and stale data display with a timestamp when the network is unavailable.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| TanStack Query `isLoading` | boolean | `useWeather` / `useGeocode` hooks |
| TanStack Query `isError` | boolean | Same hooks |
| TanStack Query `data` (stale) | object | Cache |
| Network status | online/offline | `navigator.onLine` / network events |

### Processing / Behavior

1. **Loading state:** While `isLoading` is true and no cached data exists, render skeleton components (animated placeholder shapes matching the layout of CurrentConditions, HourlyForecast, DailyForecast). Never show a blank white screen.
2. **Error state:** If `isError` is true and no cached data exists, show a friendly error message: "Unable to load weather. Check your connection and try again." with a retry button.
3. **Stale data:** If `isError` is true but cached data exists (TanStack Query retains last successful response), display the cached data with a stale indicator: "Showing data from X minutes ago."
4. **Offline:** If `navigator.onLine` is false, display cached data (if available) with offline banner: "You're offline — showing last known weather."
5. TanStack Query config: `staleTime: 10 * 60 * 1000` (10 min), `retry: 2`.

### Outputs

| State | UI |
|-------|----|
| Loading (no cache) | Skeleton components |
| Error (no cache) | Error message + retry button |
| Error (with cache) | Cached data + "Showing data from X min ago" |
| Offline (with cache) | Cached data + offline banner |
| Offline (no cache) | "No cached data available" message |
| Success | Normal weather UI |

### Validation Rules

- A blank screen is never an acceptable state — any of the above must render.
- Skeleton layout must match the actual content layout (same dimensions, same zones).
- "X minutes ago" must use accurate elapsed time from `dataUpdatedAt` timestamp.
- Retry button in error state must re-trigger the query.

### Error Handling

This FR *is* the error handling layer. No further error handling above it.

### Dependencies

- TanStack Query v5 (`useQuery`, `QueryClient` configuration)
- All data-fetching hooks (FR-01, FR-03, FR-05, FR-06)
- localStorage (for stale data persistence across sessions — Phase 4)

---

## FR-11: Accessibility

**Phase:** 3 (foundations), 4 — Quality + Accessibility Hardening
**Requirement:** REQ-05 (cross-cutting quality)
**Stories:** US-34 through US-38 (Epic E9)

### Description

The app meets WCAG 2.2 AA standards. All interactive elements are keyboard-navigable, screen readers receive meaningful announcements for weather data updates, and all visual states have non-color alternatives.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| User keyboard navigation | Tab, Enter, Escape, Arrow keys | Keyboard |
| Screen reader focus | focus events | Assistive technology |
| `prefers-reduced-motion` | CSS media query | Browser |
| `prefers-color-scheme` | CSS media query | Browser |

### Processing / Behavior

1. **Keyboard navigation:** All interactive elements (search input, GPS button, dropdown suggestions, unit toggle, details panel trigger, forecast cards) reachable via Tab. Logical focus order follows visual layout. Escape closes dropdown.
2. **`aria-live` regions:** `<div aria-live="polite" aria-atomic="true">` wraps weather data output. When data updates (new city selected or data refreshes), screen readers announce: "Weather for [city]: [temperature], [condition]."
3. **`aria-label` on icons:** All SVG weather icons have `aria-label="[condition name] icon"` or `aria-hidden="true"` with adjacent text label. Never icon-only without accessible text.
4. **Color not sole indicator (WCAG 1.4.1):** Condition type communicated via text label + icon, not color alone. Loading state uses "Loading…" text, not spinner-only.
5. **Contrast (WCAG 1.4.3):** All text on all condition backgrounds achieves 4.5:1 ratio (normal text) and 3:1 (large text). Verified in FR-09.
6. **Touch targets (WCAG 2.5.8):** All interactive elements minimum 44×44px — enforced in FR-05 (hourly cards), LocationBar buttons, unit toggle.
7. **Recharts accessibility:** Provide a visually hidden `<table>` alongside the AreaChart containing the same temperature data for screen readers.

### Outputs

- App navigable without a mouse.
- Screen reader users receive weather updates via `aria-live`.
- WCAG AA automated audit (axe-core or Lighthouse) passes with 0 critical violations.

### Validation Rules

- Tab order follows logical reading order.
- No keyboard trap (user can always Tab away from any element).
- Focus indicator visible on all interactive elements (not hidden with `outline: none`).
- `aria-live` region only announces on data change — not on every render.

### Error Handling

| Error | Behavior |
|-------|----------|
| Screen reader not detecting live region | Ensure `aria-live` div exists in DOM at all times (not conditionally rendered) |

### Dependencies

- All components (cross-cutting)
- FR-09 (contrast on dynamic backgrounds)
- FR-07 (chart accessibility table fallback)
- FR-10 (loading states need accessible text labels)

---

## FR-12: Freshness Indicator + Recent Locations

**Phase:** 3 — Details + Polish
**Requirement:** REQ-01, REQ-02
**Stories:** US-11 (E2), US-04 (E1)

### Description

A "Updated X min ago" timestamp shown near the weather data, and a set of recent location chips (up to 5) below the search input that allow quick one-tap re-selection of previously searched cities. Both persist via localStorage.

### Inputs

| Input | Type | Source |
|-------|------|--------|
| `dataUpdatedAt` | timestamp (ms) | TanStack Query cache metadata |
| Recent locations list | JSON array | `localStorage.getItem("recentLocations")` |
| Active location selection | location object | FR-01 or FR-02 |

### Processing / Behavior

**Freshness indicator:**
1. After weather data loads, record `dataUpdatedAt` from TanStack Query.
2. Display "Updated just now" immediately after fetch.
3. Update display every 60 seconds: "Updated 1 min ago", "Updated 5 min ago", etc.
4. If data is stale (from FR-10 error state), indicator uses the cached `dataUpdatedAt` timestamp.

**Recent locations:**
1. On each successful weather load, prepend the location `{name, latitude, longitude, country}` to the recent locations list in localStorage.
2. Deduplicate by `name` — if city already in list, move it to front.
3. Store maximum 5 recent locations.
4. Render as chip buttons below the search input (not visible when search input is empty and no recent locations exist).
5. Tapping a chip sets it as the active location and triggers a weather fetch — same as FR-01 selection.
6. Chips persist across page reloads.

### Outputs

| Output | Description |
|--------|-------------|
| Freshness label | "Updated X min ago" near weather data |
| Recent location chips | Up to 5 tap-to-select city buttons |
| localStorage entry | `key: "recentLocations"`, `value: JSON array of location objects` |

### Validation Rules

- Maximum 5 recent locations stored. On overflow, drop the oldest.
- Deduplication: case-insensitive city name match.
- Freshness: "just now" for 0–59s; "X min ago" for 1–59 min; "over an hour ago" for 60+ min.
- If localStorage unavailable: freshness indicator still shown (in-session only); chips not shown (graceful degradation).

### Error Handling

| Error | Behavior |
|-------|----------|
| localStorage unavailable | Suppress chips; freshness indicator works in-session only |
| Corrupted localStorage value | Clear and start fresh; no crash |

### Dependencies

- TanStack Query cache metadata (`dataUpdatedAt`)
- FR-01 (location selection mechanism)
- FR-10 (stale data timestamp reuse)
- localStorage API

---

## Requirement Coverage

| FR | Description | REQ | Phase |
|----|-------------|-----|-------|
| FR-01 | Location search with autocomplete | REQ-01 | 1 |
| FR-02 | GPS geolocation opt-in | REQ-01 | 1 |
| FR-03 | Current weather display | REQ-02 | 1 |
| FR-04 | Unit toggle °C/°F | REQ-02, REQ-05 | 1 |
| FR-05 | Hourly forecast | REQ-03, REQ-04 | 2 |
| FR-06 | Daily forecast | REQ-03, REQ-04 | 2 |
| FR-07 | Temperature trend chart | REQ-03, REQ-04 | 2 |
| FR-08 | Weather details panel | REQ-02, REQ-05 | 3 |
| FR-09 | Condition-aware backgrounds | REQ-04, REQ-05 | 3 |
| FR-10 | Loading and error states | All REQs | 1 + 4 |
| FR-11 | Accessibility | REQ-05 | 3 + 4 |
| FR-12 | Freshness indicator + recent locations | REQ-01, REQ-02 | 3 |

**Coverage: 5/5 requirements covered ✓**

---

*FRD version 1.0 — 2026-04-29*
*Based on: PRD.md, TECH-ARCH.md, USER-STORIES.md, ROADMAP.md*

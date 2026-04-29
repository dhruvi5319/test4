# User Stories — Simple Weather App

| Field         | Value                                              |
|---------------|----------------------------------------------------|
| **Product**   | Simple Weather App                                 |
| **Version**   | 1.0                                                |
| **Date**      | 2026-04-29                                         |
| **Status**    | Draft                                              |
| **Author**    | Pivota Spec User Stories Generator                 |
| **Sources**   | PRD.md · PERSONAS.md · ROADMAP.md                  |

---

## Personas Quick Reference

| ID     | Name          | Role                   | Primary Goal                                                   |
|--------|---------------|------------------------|----------------------------------------------------------------|
| PER-01 | Marcus Webb   | Daily Commuter         | Go/no-go clothing decision in under 10 seconds every morning   |
| PER-02 | Priya Nair    | Weekend Outdoor Planner| Reliably plan multi-day outdoor activities using accurate forecasts |
| PER-03 | Donna Hartley | Casual Checker         | Quick, plain-English weather answer with zero interface friction |

---

## Priority Definitions

| Level | Label    | Definition                                                                 |
|-------|----------|----------------------------------------------------------------------------|
| P0    | Critical | Must ship to call it v1.0 — app is broken or meaningless without this     |
| P1    | High     | Expected by target personas; strong differentiator; ships in v1.0          |
| P2    | Medium   | Valuable enhancement; targeted for v1.1 or as time permits                 |
| P3    | Low      | Nice-to-have; explicitly deferred to v2+                                   |

---

## Story Points Scale

| Points | Effort Estimate       |
|--------|-----------------------|
| 1      | Trivial (< 1 hour)    |
| 2      | Small (half-day)      |
| 3      | Medium (1 day)        |
| 5      | Large (2–3 days)      |
| 8      | Extra-large (4–5 days)|

---

## Epic Overview

| Epic | Name                        | Feature Ref | Phase   | Stories |
|------|-----------------------------|-------------|---------|---------|
| E1   | Location Search             | F0          | Phase 1 | US-1.1 – US-1.5 |
| E2   | Current Weather Conditions  | F1          | Phase 1 | US-2.1 – US-2.6 |
| E3   | Multi-Day Forecast          | F3          | Phase 2 | US-3.1 – US-3.4 |
| E4   | Weather Icons & Visuals     | F4          | Phase 2–3 | US-4.1 – US-4.4 |
| E5   | Responsive Layout           | F5          | Phase 3 | US-5.1 – US-5.3 |
| E6   | GPS Geolocation             | F0          | Phase 1 | US-6.1 – US-6.3 |
| E7   | Unit Toggle (°C / °F)       | F1          | Phase 1 | US-7.1 – US-7.3 |
| E8   | Loading & Error States      | F7          | Phase 1 & 4 | US-8.1 – US-8.5 |
| E9   | Accessibility               | F8          | Phase 4 | US-9.1 – US-9.5 |

---

## Epic 1: Location Search (F0 · REQ-01)

**Goal:** Any user can find weather for any location by typing a city name. This is the entry point to the entire app — every other feature depends on a resolved location.

---

### US-1.1: City Name Search with Autocomplete

**As a** daily commuter (Marcus), **I want to** type a city name and see matching suggestions instantly, **so that** I can select the right location quickly without needing to type the full name or worry about spelling.

**Acceptance Criteria:**
- [ ] **Given** I open the app, **When** I focus the search input, **Then** the input is auto-focused and ready for typing with no prior interaction required
- [ ] **Given** I type 1 character, **When** the input receives the keystroke, **Then** no API call is made and no suggestions appear
- [ ] **Given** I type 2 or more characters, **When** the input value changes, **Then** the Open-Meteo Geocoding API is queried and a dropdown of up to 5 matching city suggestions appears within 500ms
- [ ] **Given** suggestions are displayed, **When** I click or tap a suggestion, **Then** weather data for that city loads immediately and the suggestion dropdown closes
- [ ] **Given** I type a string that returns no geocoding results, **When** the API responds, **Then** a "City not found — try a different spelling" message appears in the dropdown (not a blank dropdown)
- [ ] **Given** I am on a slow connection, **When** the geocoding API has not yet responded, **Then** a loading indicator is shown inside the dropdown area (not a blank dropdown)

**Priority:** P0 | **Feature Ref:** F0 | **Phase:** 1 | **Story Points:** 5

---

### US-1.2: Select a Location from Suggestions

**As a** casual checker (Donna), **I want to** select my city from a suggestions list with a single tap, **so that** I can get my weather answer without typing the full city name or worrying about capitalization.

**Acceptance Criteria:**
- [ ] **Given** autocomplete suggestions are visible, **When** I tap a suggestion on mobile, **Then** the tap target is at least 44 × 44 px and registers correctly without zooming
- [ ] **Given** I select a suggestion, **When** the selection is confirmed, **Then** the search input displays the selected city name and the suggestions dropdown closes
- [ ] **Given** I select a city that shares a name with cities in multiple countries (e.g., "Portland"), **When** suggestions appear, **Then** each suggestion includes the country and/or state/region name for disambiguation (e.g., "Portland, Oregon, US")
- [ ] **Given** I select a location, **When** weather data finishes loading, **Then** the page title or header updates to show the selected city name

**Priority:** P0 | **Feature Ref:** F0 | **Phase:** 1 | **Story Points:** 3

---

### US-1.3: Recent Location Quick-Select

**As a** daily commuter (Marcus), **I want to** see my recently searched cities below the search bar as quick-select chips, **so that** I can switch back to a city I've already searched in a single tap without re-typing.

**Acceptance Criteria:**
- [ ] **Given** I have previously searched one or more cities, **When** I open or return to the app, **Then** up to 5 recent city names appear as tappable chips below the search input
- [ ] **Given** recent location chips are visible, **When** I tap a chip, **Then** weather for that city loads immediately without going through the autocomplete flow
- [ ] **Given** recent locations exist in `localStorage`, **When** I close and reopen the browser tab, **Then** the same chips are still visible (chips persist across sessions)
- [ ] **Given** I search a new city that is already in my recent list, **When** the search completes, **Then** the chip moves to the first position (most recent) instead of duplicating
- [ ] **Given** I have more than 5 recent searches, **When** a new search is added, **Then** the oldest entry is removed so the list stays at 5 chips maximum

**Priority:** P1 | **Feature Ref:** F0 | **Phase:** 3 | **Story Points:** 3

---

### US-1.4: Clear / Change Location

**As a** casual checker (Donna), **I want to** easily clear the current city and search for a different one, **so that** I can check the weather for my sister's city in Canada without getting confused by the previous result.

**Acceptance Criteria:**
- [ ] **Given** a city is currently loaded, **When** I tap or click the search input, **Then** the current city name is selected/highlighted and ready to be overwritten immediately
- [ ] **Given** I start typing a new city name, **When** the input value changes, **Then** the previous weather data remains visible (not cleared) until the new city is selected, preventing a blank screen mid-search
- [ ] **Given** I clear the search input completely, **When** the input is empty, **Then** the recent locations chips reappear and no weather data is shown (not an error state)
- [ ] **Given** I press the Escape key while the search dropdown is open, **When** Escape is pressed, **Then** the dropdown closes and focus returns to the search input

**Priority:** P0 | **Feature Ref:** F0 | **Phase:** 1 | **Story Points:** 2

---

### US-1.5: Geocoding Error Handling

**As a** casual checker (Donna), **I want to** see a helpful message when my city search doesn't find a result, **so that** I know to try a different spelling rather than thinking the app is broken.

**Acceptance Criteria:**
- [ ] **Given** I type a city name that returns zero geocoding results, **When** the API responds, **Then** the message "City not found — try a different spelling" appears below the search input
- [ ] **Given** the geocoding API call fails due to a network error, **When** the error occurs, **Then** a message "Could not search locations — check your connection" appears and the input remains editable
- [ ] **Given** an error message is displayed, **When** I begin typing again, **Then** the error message disappears and the normal autocomplete flow resumes
- [ ] **Given** an ambiguous city name returns multiple plausible matches, **When** suggestions appear, **Then** each result shows enough context (country, region) for the user to choose the correct one

**Priority:** P0 | **Feature Ref:** F0 | **Phase:** 4 | **Story Points:** 2

---

## Epic 2: Current Weather Conditions (F1 · REQ-02)

**Goal:** The hero section answers "what is the weather right now?" in a single glance — temperature, condition, feels-like, high/low, humidity, wind, and precipitation probability all visible above the fold without scrolling.

---

### US-2.1: View Current Temperature

**As a** daily commuter (Marcus), **I want to** see the current temperature large and dominant the moment the page loads, **so that** I can make my coat/umbrella decision in under 5 seconds before I leave the house.

**Acceptance Criteria:**
- [ ] **Given** a city is selected and data has loaded, **When** I view the main screen, **Then** the current temperature is displayed as the largest typographic element on the screen, visible without scrolling on any supported viewport (375px – 1280px)
- [ ] **Given** the temperature value from the API, **When** it is displayed, **Then** it is rounded to the nearest integer with no decimal places (e.g., "18°C" not "18.47°C")
- [ ] **Given** the unit is set to °C, **When** I view the temperature, **Then** the °C symbol is displayed adjacent to the number
- [ ] **Given** the unit is set to °F, **When** I view the temperature, **Then** the value is converted and displayed with the °F symbol
- [ ] **Given** a temperature is displayed, **When** I view the page, **Then** the feels-like temperature is shown as a secondary data point directly adjacent to or below the main temperature

**Priority:** P0 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 3

---

### US-2.2: View Weather Condition Text and Icon

**As a** casual checker (Donna), **I want to** see the weather condition described in plain text alongside a clear icon, **so that** I can understand "it's sunny" or "it's rainy" without parsing numbers.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the current conditions, **Then** a condition icon and a plain-English text label are shown together (e.g., sun icon + "Clear Sky", cloud icon + "Partly Cloudy")
- [ ] **Given** the current time is after sunset at the selected location, **When** a clear-sky or partly-cloudy condition is displayed, **Then** a moon/night icon is shown instead of a sun icon
- [ ] **Given** the current time is before sunset, **When** a clear-sky condition is displayed, **Then** a sun icon is shown (not a moon icon)
- [ ] **Given** any weather condition is displayed, **When** I view the icon, **Then** the icon is never used as the sole indicator of weather state — a text label is always present alongside it (WCAG 1.4.1)
- [ ] **Given** all WMO weather codes 0–99 returned by Open-Meteo, **When** any code is received, **Then** a matching icon and text label are displayed (no missing icon fallback to a broken image)

**Priority:** P0 | **Feature Ref:** F1, F4 | **Phase:** 1 | **Story Points:** 5

---

### US-2.3: View Today's High and Low Temperature

**As a** daily commuter (Marcus), **I want to** see today's high and low temperatures at a glance, **so that** I can decide on layers for the whole day in one look without checking a forecast card.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the current conditions section, **Then** today's high temperature and low temperature are displayed as a paired value (e.g., "H: 24°C · L: 14°C")
- [ ] **Given** the high/low is displayed, **When** I view the values, **Then** high is always shown first, then low (never reversed)
- [ ] **Given** the unit toggle is switched, **When** the unit changes from °C to °F (or vice versa), **Then** the high/low values convert and update immediately alongside the main temperature

**Priority:** P0 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 2

---

### US-2.4: View Humidity and Wind Speed

**As a** weekend outdoor planner (Priya), **I want to** see current humidity and wind speed in the main conditions view, **so that** I can quickly assess whether conditions are suitable for my outdoor activities without tapping into a details panel.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the current conditions section, **Then** current humidity is displayed as a percentage (e.g., "Humidity: 62%")
- [ ] **Given** weather data is loaded, **When** I view the current conditions section, **Then** current wind speed is displayed with its unit (e.g., "Wind: 14 km/h" or "Wind: 9 mph")
- [ ] **Given** the wind speed is displayed, **When** I view it, **Then** the unit matches the selected temperature unit system (km/h with °C; mph with °F)
- [ ] **Given** humidity and wind are both present, **When** I view the page on a 375px mobile viewport, **Then** both values are visible without horizontal overflow or truncation

**Priority:** P0 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 2

---

### US-2.5: View Precipitation Probability for Today

**As a** daily commuter (Marcus), **I want to** see the chance of rain for today on the main screen, **so that** I know whether to grab my umbrella before leaving — without having to tap into a separate forecast view.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the current conditions, **Then** today's precipitation probability is displayed as a percentage (e.g., "Rain: 40%") in the hero section
- [ ] **Given** precipitation probability is 0%, **When** it is displayed, **Then** it shows "0%" (not blank or hidden) so the absence of rain is explicitly confirmed
- [ ] **Given** the precipitation probability is displayed, **When** I view the page, **Then** the value is clearly labelled so it cannot be confused with humidity or another percentage value

**Priority:** P0 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 2

---

### US-2.6: View Data Freshness Indicator

**As a** weekend outdoor planner (Priya), **I want to** see when the weather data was last updated, **so that** I can trust I'm seeing a current forecast and not data from 4 hours ago when I'm committing to outdoor plans.

**Acceptance Criteria:**
- [ ] **Given** weather data has successfully loaded, **When** I view the main screen, **Then** an "Updated X minutes ago" indicator is visible on the current conditions section at all times
- [ ] **Given** data is fewer than 1 minute old, **When** the freshness indicator updates, **Then** it reads "Updated just now"
- [ ] **Given** data is exactly 10 minutes old (at the TanStack Query stale boundary), **When** I view the indicator, **Then** it reads "Updated 10 minutes ago" before any refresh
- [ ] **Given** the app is showing cached offline data, **When** no network is available, **Then** the indicator reads "Showing data from X minutes ago (offline)" to clearly communicate stale state
- [ ] **Given** data has been displayed for a period of time, **When** the "Updated X ago" clock ticks, **Then** the counter updates at reasonable intervals (e.g., every minute) without forcing a data re-fetch

**Priority:** P1 | **Feature Ref:** F7 | **Phase:** 3 | **Story Points:** 3

---

## Epic 3: Multi-Day Forecast (F2, F3 · REQ-03)

**Goal:** Users can see a complete picture of the coming days — hourly conditions for the next 24 hours and a 7-day daily forecast — so they can plan commutes, outdoor activities, and wardrobes beyond today.

---

### US-3.1: View 7-Day Daily Forecast

**As a** weekend outdoor planner (Priya), **I want to** see a 7-day daily forecast on the main screen, **so that** I can identify viable outdoor days for the coming weekend in a single planning session without opening another app.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the forecast section, **Then** exactly 7 daily rows are displayed showing: abbreviated day name, condition icon, high temperature, low temperature, and precipitation probability
- [ ] **Given** the 7-day list is displayed, **When** I view it on a desktop viewport (1024px+), **Then** all 7 rows are visible without horizontal scroll or pagination
- [ ] **Given** the 7-day list is displayed, **When** I view it on a mobile viewport (375px), **Then** all 7 rows are visible in a vertical list without horizontal overflow — a single downward scroll reaches all days
- [ ] **Given** precipitation probability is shown per day, **When** I view any daily row, **Then** the precipitation percentage is present (never omitted or hidden to save space)
- [ ] **Given** high/low temperatures are shown, **When** I view any daily row, **Then** the high is always displayed before the low, and both use the currently selected temperature unit
- [ ] **Given** the unit toggle is switched, **When** the unit changes, **Then** all 7 days' temperatures convert and update simultaneously

**Priority:** P0 | **Feature Ref:** F3 | **Phase:** 2 | **Story Points:** 5

---

### US-3.2: View Hourly Forecast for the Next 24 Hours

**As a** daily commuter (Marcus), **I want to** scroll through an hourly forecast for the next 24 hours, **so that** I can quickly identify whether rain is expected during my 8–9 AM and 5–6 PM commute windows without navigating to a separate screen.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the hourly forecast section, **Then** a horizontally scrollable row of cards is displayed, each showing: hour label (e.g., "9 AM"), condition icon, temperature, and precipitation probability
- [ ] **Given** the hourly row is visible, **When** I count the cards, **Then** cards for the next 24 hours are present starting from the current hour
- [ ] **Given** I interact with hourly cards on a touch device, **When** I tap a card, **Then** the tap target is at minimum 44 × 44 px (WCAG 2.5.8) and the card responds without requiring precise tapping
- [ ] **Given** the current time is after sunset at the selected location, **When** hourly cards for nighttime hours are displayed, **Then** those cards show night variants of condition icons (moon/stars for clear, not sun)
- [ ] **Given** precipitation probability for an hour is 0%, **When** the card is displayed, **Then** "0%" is shown explicitly rather than the field being left blank
- [ ] **Given** a keyboard user navigates the hourly row, **When** using Tab/Arrow keys, **Then** each card receives focus and the row scrolls to keep the focused card visible

**Priority:** P1 | **Feature Ref:** F2 | **Phase:** 2 | **Story Points:** 5

---

### US-3.3: View Temperature Trend Chart for the Week

**As a** weekend outdoor planner (Priya), **I want to** see a temperature trend chart alongside the 7-day forecast, **so that** I can spot temperature patterns (e.g., warming Thursday through Saturday) at a glance without reading each number individually.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the weekly forecast section, **Then** a Recharts AreaChart displaying the temperature curve across 7 days is rendered alongside or below the daily forecast list
- [ ] **Given** the chart is displayed, **When** I view the Y-axis, **Then** it shows the temperature unit matching the current toggle selection (°C or °F)
- [ ] **Given** the unit toggle is switched, **When** the unit changes, **Then** the chart data and Y-axis labels update immediately to the new unit
- [ ] **Given** a screen reader user encounters the chart, **When** they navigate to it, **Then** an accessible text alternative (e.g., `aria-label` summary or a data table) is available describing the temperature trend
- [ ] **Given** the `prefers-reduced-motion` media query is active, **When** the chart renders, **Then** chart entry animations are disabled and the chart renders statically

**Priority:** P1 | **Feature Ref:** F3 | **Phase:** 2 | **Story Points:** 5

---

### US-3.4: View Secondary Weather Details (UV, Wind, Visibility, Sunrise/Sunset)

**As a** weekend outdoor planner (Priya), **I want to** expand a "Details" panel to see UV index, wind direction, visibility, and sunrise/sunset times, **so that** I can assess conditions for a dawn hike or cycling trip without leaving the app or opening a second weather source.

**Acceptance Criteria:**
- [ ] **Given** the current conditions section is visible, **When** I view the page on initial load, **Then** the Details panel is collapsed by default (not expanded) so casual users are not overwhelmed
- [ ] **Given** the Details panel is collapsed, **When** I tap or click the "Details" toggle/button, **Then** the panel expands to display: UV index (numeric), wind speed + cardinal direction + degrees (e.g., "14 km/h NW · 315°"), visibility in km (or miles in imperial), humidity (if not shown in hero), sunrise time, sunset time
- [ ] **Given** the Details panel is expanded, **When** I tap the toggle again, **Then** the panel collapses
- [ ] **Given** sunrise and sunset times are displayed, **When** I view them, **Then** they reflect the selected location's local timezone (not my browser's local time)
- [ ] **Given** I reload the page, **When** the app initialises, **Then** the Details panel returns to its collapsed (default) state — panel state does not persist across reloads
- [ ] **Given** a keyboard user navigates to the Details toggle, **When** they press Enter or Space, **Then** the panel expands/collapses and focus is managed appropriately

**Priority:** P1 | **Feature Ref:** F6 | **Phase:** 3 | **Story Points:** 5

---

## Epic 4: Weather Icons & Visual Indicators (F4 · REQ-04)

**Goal:** Every weather state is communicated visually through consistent, recognizable icons that adapt to time of day and a condition-aware background that immediately signals the current weather environment.

---

### US-4.1: Full WMO Icon Coverage (Codes 0–99)

**As a** casual checker (Donna), **I want to** always see a recognizable weather icon no matter what the conditions are, **so that** I never encounter a blank space or broken image where the weather icon should be.

**Acceptance Criteria:**
- [ ] **Given** any WMO weather interpretation code (0–99) returned by Open-Meteo, **When** the icon is rendered, **Then** a mapped icon is displayed — there is no code that falls through to a broken image or missing icon placeholder
- [ ] **Given** the full WMO code range, **When** icons are implemented, **Then** all state categories are covered: clear (0), partly cloudy (1–3), foggy (45, 48), drizzle (51–57), rain (61–67), freezing rain (66–67), snow (71–77), snow showers (85–86), rain showers (80–82), thunderstorm (95–99)
- [ ] **Given** icons are used in current conditions, hourly cards, and daily forecast rows, **When** the same WMO code appears in multiple locations, **Then** the same icon is used consistently across all three components

**Priority:** P0 | **Feature Ref:** F4 | **Phase:** 2 | **Story Points:** 3

---

### US-4.2: Day/Night Icon Variants

**As a** daily commuter (Marcus), **I want to** see icons that reflect the time of day at my selected location, **so that** a nighttime "Clear Sky" shows a moon rather than a sun and I'm not confused by a sunny icon at 10 PM.

**Acceptance Criteria:**
- [ ] **Given** the current time is before sunrise or after sunset at the selected location, **When** clear-sky (WMO 0) or partly-cloudy (WMO 1–2) conditions are displayed in the current conditions hero, **Then** a night variant icon is used (moon/stars, not sun)
- [ ] **Given** the current time is between sunrise and sunset, **When** clear-sky or partly-cloudy conditions are displayed, **Then** a day variant icon is used (sun, not moon)
- [ ] **Given** hourly forecast cards span both day and nighttime hours, **When** cards after sunset are rendered, **Then** those cards use night icons and cards before sunset use day icons — the transition is accurate to the location's local timezone
- [ ] **Given** the selected location is in a timezone far from the user's local timezone (e.g., user is in NY, viewing Tokyo), **When** icons are displayed, **Then** day/night logic uses Tokyo's local time, not New York's

**Priority:** P0 | **Feature Ref:** F4 | **Phase:** 2 | **Story Points:** 3

---

### US-4.3: Condition-Aware Background Gradient

**As a** casual checker (Donna), **I want to** see a background colour that reflects the current weather and time of day, **so that** I can sense "it's a grey cloudy day" or "it's clear and sunny" immediately from the visual environment without reading any text.

**Acceptance Criteria:**
- [ ] **Given** weather data is loaded, **When** I view the current conditions hero, **Then** the background gradient shifts based on the current weather state (e.g., deep navy for clear night, sky blue for clear day, muted grey for overcast, dark grey for thunderstorm)
- [ ] **Given** all weather state × time-of-day combinations are designed, **When** any combination is displayed, **Then** text overlaid on the background achieves a minimum WCAG 1.4.3 contrast ratio of 4.5:1
- [ ] **Given** a new location is selected, **When** weather data loads, **Then** the background transitions to the appropriate gradient for the new location's conditions (not stuck on the previous location's gradient)
- [ ] **Given** the `prefers-reduced-motion` media query is active, **When** the background transitions, **Then** the gradient changes immediately without a CSS animated transition

**Priority:** P1 | **Feature Ref:** F4 | **Phase:** 3 | **Story Points:** 5

---

### US-4.4: Accessible Icon + Text Label Pairing

**As a** casual checker (Donna) using a screen reader, **I want to** have weather conditions communicated in text as well as visually, **so that** I understand the forecast even if I can't see the icons.

**Acceptance Criteria:**
- [ ] **Given** any weather icon is rendered, **When** it is displayed, **Then** a plain-English text label is always shown alongside it — the icon is never the only way weather state is communicated (WCAG 1.4.1: use of color/icon not sole conveyor)
- [ ] **Given** a weather icon is rendered in the DOM, **When** a screen reader encounters it, **Then** the icon has an appropriate `aria-label` or `alt` attribute (e.g., `aria-label="Partly cloudy"`) and is not announced as a decorative image if paired text is absent
- [ ] **Given** icons with paired text labels, **When** the icon is marked decorative (`aria-hidden="true"`) and the adjacent text label is visible, **Then** screen readers read the text label only — avoiding redundant announcement

**Priority:** P1 | **Feature Ref:** F4, F8 | **Phase:** 4 | **Story Points:** 2

---

## Epic 5: Responsive Layout — Desktop & Mobile (F5 · REQ-05)

**Goal:** The app renders correctly and usably on every supported viewport from 375px mobile to 1280px+ desktop with no overflow, no broken layouts, and no unusable touch targets.

---

### US-5.1: Usable Mobile Layout (375px)

**As a** daily commuter (Marcus) checking weather on his iPhone 14, **I want to** see all critical weather data clearly on a 375px screen without horizontal overflow or content cut off, **so that** I can get my answer in 10 seconds while standing in my kitchen.

**Acceptance Criteria:**
- [ ] **Given** the app is loaded on a 375px viewport, **When** I view the page, **Then** there is zero horizontal overflow — no content extends beyond the viewport edge and no horizontal scrollbar appears on the page body
- [ ] **Given** the mobile layout, **When** I view the current conditions, hourly forecast, and daily forecast, **Then** all three sections are accessible via a single vertical scroll — no horizontal swipe is required to find any primary content
- [ ] **Given** all interactive elements on mobile (search input, GPS button, unit toggle, forecast cards, Details panel toggle), **When** I inspect their dimensions, **Then** every tap target measures at least 44 × 44 px
- [ ] **Given** I use the app with the system font size increased (e.g., accessibility large text), **When** the page renders, **Then** no text is truncated with ellipsis on labels that communicate critical information (temperature, condition name, day names)
- [ ] **Given** the mobile layout, **When** I view the 7-day forecast, **Then** all 7 days are visible in a vertical list without any days being cut off or requiring a "show more" tap

**Priority:** P0 | **Feature Ref:** F5 | **Phase:** 3 | **Story Points:** 5

---

### US-5.2: Usable Desktop Layout (1024px+)

**As a** weekend outdoor planner (Priya) on her MacBook Pro, **I want to** see the full weather picture in a well-organized desktop layout, **so that** I can run my weekly outdoor activity planning session without pagination or excessive scrolling.

**Acceptance Criteria:**
- [ ] **Given** the app is loaded on a 1024px+ viewport, **When** I view the page, **Then** the current conditions section and forecast section are arranged in a wider, side-by-side or multi-column layout that makes better use of available horizontal space
- [ ] **Given** the desktop layout, **When** I view the 7-day forecast, **Then** all 7 rows are visible without horizontal scroll or pagination — no "next week" button needed
- [ ] **Given** the desktop layout, **When** I view the current conditions hero, **Then** the temperature, condition, high/low, humidity, wind, and precipitation probability are all visible above the fold without any vertical scroll
- [ ] **Given** I resize the browser window from 375px to 1280px, **When** Tailwind breakpoints activate, **Then** the layout transitions cleanly at each breakpoint without overlapping elements or invisible content

**Priority:** P0 | **Feature Ref:** F5 | **Phase:** 3 | **Story Points:** 3

---

### US-5.3: Tablet Layout (768px–1023px)

**As a** casual checker (Donna) on her iPad 7th gen, **I want to** see a layout that makes good use of the iPad's medium-sized screen, **so that** I can read weather information comfortably at my kitchen table without needing to pinch-zoom or deal with a phone-sized layout stretched to fill the screen.

**Acceptance Criteria:**
- [ ] **Given** the app is loaded on a 768px–1023px viewport (tablet range), **When** I view the layout, **Then** content is not simply stretched mobile layout — it uses the additional width meaningfully (e.g., current conditions and some details shown side-by-side)
- [ ] **Given** the tablet layout, **When** I view text at the default iPad system font size, **Then** all temperatures, condition labels, and day names are readable at a comfortable size without zooming
- [ ] **Given** the tablet layout, **When** I view the app at 768px, **Then** no content overflows horizontally and all sections are reachable via vertical scroll

**Priority:** P1 | **Feature Ref:** F5 | **Phase:** 3 | **Story Points:** 3

---

## Epic 6: GPS Geolocation (F0 — Opt-In)

**Goal:** Users can tap a GPS button to auto-detect their location as a convenience enhancement. This is always opt-in; denying permission never blocks the app.

---

### US-6.1: Opt-In GPS Location Detection

**As a** daily commuter (Marcus), **I want to** tap a GPS button to automatically detect my location, **so that** I can skip typing my city on a rushed morning when I just want to see my local weather immediately.

**Acceptance Criteria:**
- [ ] **Given** I open the app, **When** I view the search area, **Then** a GPS/location button is visible alongside the search input (not hidden in a settings menu)
- [ ] **Given** I tap the GPS button, **When** the browser Geolocation API is invoked, **Then** the browser's native permission dialog appears requesting location access
- [ ] **Given** I grant geolocation permission, **When** the browser returns coordinates, **Then** the coordinates are reverse-geocoded via Nominatim to a human-readable city name, and weather for that location loads
- [ ] **Given** I grant geolocation permission and the reverse geocode succeeds, **When** weather loads, **Then** the location name displayed is a readable city name (e.g., "Chicago, IL") not raw coordinates (e.g., "41.8781, -87.6298")
- [ ] **Given** geolocation is used successfully, **When** the location is resolved, **Then** it is also added to the recent locations list in `localStorage`

**Priority:** P1 | **Feature Ref:** F0 | **Phase:** 1 | **Story Points:** 5

---

### US-6.2: Graceful Handling of Geolocation Denial

**As a** casual checker (Donna) who declines location permissions, **I want to** have the app continue working normally after I deny GPS access, **so that** I don't end up with a blank screen or a stuck loading state just because I chose not to share my location.

**Acceptance Criteria:**
- [ ] **Given** I tap the GPS button and then deny the browser permission request, **When** permission is denied, **Then** the app remains fully functional — no blank screen, no stuck spinner, no error modal blocking the UI
- [ ] **Given** geolocation permission has been previously denied by the browser, **When** I tap the GPS button again, **Then** a helpful message appears explaining that location access is blocked and suggesting I search by city name instead
- [ ] **Given** geolocation is denied, **When** the denial is handled, **Then** focus returns to the city name search input so the user can proceed with the manual search path immediately
- [ ] **Given** geolocation is unavailable (e.g., the browser doesn't support it or is on HTTP), **When** the GPS button is present, **Then** tapping it shows a graceful "Location detection unavailable" message rather than a JavaScript error

**Priority:** P0 | **Feature Ref:** F0 | **Phase:** 1 | **Story Points:** 3

---

### US-6.3: Geolocation on HTTPS Only

**As a** developer deploying the app, **I want** the GPS feature to function correctly in the production HTTPS environment, **so that** the browser Geolocation API is available and users who opt in get accurate location detection.

**Acceptance Criteria:**
- [ ] **Given** the app is deployed to a public Vercel HTTPS URL, **When** I tap the GPS button on a supported browser (Chromium 110+, Firefox 115+, Safari 16+), **Then** the browser permission dialog appears and geolocation works as expected
- [ ] **Given** the app is accessed over HTTP (non-HTTPS), **When** I tap the GPS button, **Then** the GPS feature fails gracefully with a message rather than causing a JavaScript error (browsers block geolocation on non-HTTPS origins)
- [ ] **Given** the app is on HTTPS and geolocation is granted, **When** coordinates are returned, **Then** the `timezone=auto` parameter is correctly set on all subsequent Open-Meteo API requests using the resolved coordinates

**Priority:** P0 | **Feature Ref:** F0, F9 | **Phase:** 4 | **Story Points:** 2

---

## Epic 7: Unit Toggle — °C / °F (F1)

**Goal:** Users can switch between Celsius and Fahrenheit on the main screen with a single tap, and their preference is remembered across sessions.

---

### US-7.1: Toggle Between °C and °F

**As a** daily commuter (Marcus), **I want to** switch between Celsius and Fahrenheit with a single tap on the main screen, **so that** I can quickly share a screenshot with my European colleague without digging through a settings menu.

**Acceptance Criteria:**
- [ ] **Given** the app is loaded with weather data, **When** I view the main screen, **Then** a °C/°F toggle is visible in the current conditions section — not buried in a hamburger menu, settings screen, or secondary panel
- [ ] **Given** the toggle is visible, **When** I tap °F (from a °C state), **Then** all temperature values on screen (current temp, feels-like, high, low, hourly cards, daily forecast, chart) convert to Fahrenheit simultaneously with no partial update
- [ ] **Given** I tap the toggle, **When** the unit switches, **Then** wind speed units also update (km/h ↔ mph) to match the selected system
- [ ] **Given** I tap the toggle, **When** the unit switches, **Then** the transition is immediate — there is no loading state or API re-fetch triggered by a unit toggle (conversion is client-side only)

**Priority:** P0 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 3

---

### US-7.2: Persist Unit Preference Across Sessions

**As a** casual checker (Donna), **I want** the app to remember my temperature unit preference after I close and reopen my browser, **so that** I don't have to switch from °C to °F every single visit when checking the weather for my Canadian sister.

**Acceptance Criteria:**
- [ ] **Given** I toggle the unit to °F, **When** I close the browser tab and reopen the app URL, **Then** the app loads with °F selected — not defaulting back to °C
- [ ] **Given** the unit preference is stored, **When** I check `localStorage`, **Then** a key (e.g., `weather_unit`) stores the value "C" or "F"
- [ ] **Given** I clear my browser's `localStorage`, **When** the app loads with no stored preference, **Then** it defaults to the locale-appropriate unit (°C for metric-system countries, °F for the United States) based on browser locale detection

**Priority:** P1 | **Feature Ref:** F1 | **Phase:** 1 | **Story Points:** 2

---

### US-7.3: Unit Toggle Accessibility

**As a** keyboard user, **I want to** operate the °C/°F unit toggle using only my keyboard, **so that** I can change the displayed unit without needing a mouse or touch input.

**Acceptance Criteria:**
- [ ] **Given** the unit toggle is present, **When** I navigate with Tab, **Then** the toggle receives keyboard focus and shows a visible focus indicator
- [ ] **Given** the toggle has keyboard focus, **When** I press Enter or Space, **Then** the unit switches (same as a mouse click/tap)
- [ ] **Given** the toggle is a button or checkbox, **When** a screen reader announces it, **Then** the announced label clearly communicates its state (e.g., "Temperature unit: Celsius — press to switch to Fahrenheit")

**Priority:** P1 | **Feature Ref:** F1, F8 | **Phase:** 4 | **Story Points:** 1

---

## Epic 8: Loading & Error States (F7)

**Goal:** Users never see a blank screen. Every loading, error, and offline state is handled with visible, helpful feedback that allows them to continue using the app.

---

### US-8.1: Skeleton Loading State During Data Fetch

**As a** daily commuter (Marcus), **I want to** see a skeleton placeholder while weather data is loading, **so that** I know the app is working and roughly where the data will appear — not staring at a blank page wondering if it's broken.

**Acceptance Criteria:**
- [ ] **Given** I select a new city and weather data has not yet returned, **When** the loading state is active (`isLoading: true`), **Then** skeleton placeholder shapes appear in the positions of the temperature, condition icon, high/low, and forecast sections
- [ ] **Given** the skeleton is visible, **When** I view the page, **Then** there is no blank white space — the layout is pre-populated with grey animated placeholder shapes
- [ ] **Given** the `prefers-reduced-motion` query is active, **When** the skeleton is displayed, **Then** the pulse/shimmer animation is disabled and skeletons render as static muted shapes
- [ ] **Given** weather data returns successfully, **When** the response arrives, **Then** the skeleton state is replaced by actual data in a clean transition with no layout shift (no elements jumping position)

**Priority:** P0 | **Feature Ref:** F7 | **Phase:** 1 | **Story Points:** 3

---

### US-8.2: API Error State

**As a** casual checker (Donna), **I want to** see a friendly error message when the weather data fails to load, **so that** I know something went wrong (not that the app is just slow) and understand what to do next.

**Acceptance Criteria:**
- [ ] **Given** the Open-Meteo weather API returns a non-2xx response or network error, **When** TanStack Query catches the error, **Then** a friendly error message is displayed (e.g., "Unable to load weather data — please try again") rather than a blank screen or a raw error object
- [ ] **Given** an error state is displayed, **When** I view the page, **Then** a "Try again" button or link is present that re-triggers the API call
- [ ] **Given** I tap "Try again", **When** the retry is initiated, **Then** the skeleton loading state reappears while the retry fetch is in progress
- [ ] **Given** cached weather data exists from a previous successful fetch, **When** the API call fails, **Then** the cached data is displayed with a visible "Showing cached data — live data unavailable" notice instead of a full error state

**Priority:** P0 | **Feature Ref:** F7 | **Phase:** 1 | **Story Points:** 3

---

### US-8.3: Offline / No Network State

**As a** weekend outdoor planner (Priya) on a hiking trail with intermittent connectivity, **I want to** still see the last weather data I loaded when my signal drops, **so that** I can reference my earlier forecast check without the app going blank.

**Acceptance Criteria:**
- [ ] **Given** the device is offline (no network), **When** I open the app with previously cached weather data, **Then** the cached data is displayed with a clearly visible "Showing data from X minutes ago (offline)" indicator
- [ ] **Given** the device is offline and no cached data exists, **When** the app attempts to load weather, **Then** a friendly "Unable to load weather — check your connection" message is shown, and the search input remains usable for when connection resumes
- [ ] **Given** the device comes back online while the app is open, **When** network connectivity is restored, **Then** the app automatically refreshes weather data (or displays a "Tap to refresh" prompt) within a reasonable time without requiring a full page reload
- [ ] **Given** offline state is active, **When** I view the freshness indicator, **Then** it clearly differentiates between "data is 10 minutes old and still valid" versus "data is stale because we're offline" through different wording or visual treatment

**Priority:** P1 | **Feature Ref:** F7 | **Phase:** 4 | **Story Points:** 3

---

### US-8.4: City Not Found Error State

**As a** casual checker (Donna), **I want to** see a clear message when the city I typed doesn't match any results, **so that** I know to try a different spelling rather than assuming the app has crashed.

**Acceptance Criteria:**
- [ ] **Given** I type a city name and select a suggestion, **When** the geocoding API returns no results for the typed string, **Then** the message "City not found — try a different spelling" is displayed in or below the search input
- [ ] **Given** a "city not found" state is shown, **When** I see the message, **Then** the search input is still focused and editable — I can immediately retype without clicking anywhere first
- [ ] **Given** a "city not found" message is displayed, **When** I successfully search a different city, **Then** the error message clears immediately and the normal weather view is shown
- [ ] **Given** the city name is partially ambiguous (e.g., "Springfield" exists in 30+ US states), **When** the geocoding API returns multiple results, **Then** suggestions include enough disambiguation (state/country) for the user to select the correct one

**Priority:** P0 | **Feature Ref:** F0, F7 | **Phase:** 4 | **Story Points:** 2

---

### US-8.5: No Blank Screen Contract

**As any** user, **I want to** always see some content or a meaningful message on screen, **so that** I never encounter an empty white page that makes me think the app is broken or didn't load.

**Acceptance Criteria:**
- [ ] **Given** any combination of loading, error, offline, or no-data state, **When** the app renders, **Then** a blank white screen is never displayed — either a skeleton, error message, cached data, or "search a city to start" prompt is always visible
- [ ] **Given** the app is opened for the first time with no cached location, **When** the page loads, **Then** a clear welcome or prompt state is shown (e.g., "Search a city to get started") rather than an empty layout
- [ ] **Given** an unhandled JavaScript error occurs, **When** the error is caught by a React Error Boundary, **Then** a fallback UI with a friendly "Something went wrong — please refresh" message is shown instead of a blank screen

**Priority:** P0 | **Feature Ref:** F7 | **Phase:** 1 | **Story Points:** 2

---

## Epic 9: Accessibility (F8 · WCAG 2.2 AA)

**Goal:** The app meets WCAG 2.2 Level AA across all states and components, verified by automated tooling and manual screen reader testing. Accessibility is built in from Phase 1, not retrofitted.

---

### US-9.1: Full Keyboard Navigation

**As a** keyboard-only user, **I want to** operate every feature of the app using only my keyboard, **so that** I can access weather information without needing a mouse or touch input.

**Acceptance Criteria:**
- [ ] **Given** the page loads, **When** I press Tab, **Then** focus moves in a logical order: search input → GPS button → unit toggle → recent location chips → hourly cards → daily forecast rows → details panel toggle
- [ ] **Given** any interactive element (search, GPS, toggle, chips, cards, details panel), **When** it receives keyboard focus, **Then** a clearly visible focus indicator is displayed (not removed or hidden with `outline: none`)
- [ ] **Given** the search autocomplete dropdown is open, **When** I press the Down Arrow key, **Then** focus moves to the first suggestion; Up Arrow moves back to the input; Enter selects the focused suggestion; Escape closes the dropdown
- [ ] **Given** the horizontally scrollable hourly forecast row, **When** I navigate with Tab/Arrow keys, **Then** I can reach and activate every card without using a mouse or touch scroll gesture

**Priority:** P1 | **Feature Ref:** F8 | **Phase:** 4 | **Story Points:** 5

---

### US-9.2: Screen Reader Announcements for Weather Data Updates

**As a** screen reader user, **I want to** be informed when weather data updates after a new city search, **so that** I know new data has loaded without having to navigate the entire page to discover the change.

**Acceptance Criteria:**
- [ ] **Given** I select a new city and weather data loads, **When** the data replaces the previous city's data, **Then** an `aria-live` region announces the new city name and current temperature (e.g., "Weather updated for Chicago: 18 degrees Celsius, clear sky")
- [ ] **Given** an `aria-live` region is implemented, **When** I inspect the DOM, **Then** the region uses `aria-live="polite"` (not `"assertive"`) so the announcement waits for the user to finish their current interaction
- [ ] **Given** the freshness indicator updates (e.g., "Updated 5m ago" → "Updated 6m ago"), **When** the counter changes, **Then** the update does NOT trigger an `aria-live` announcement (to avoid repeatedly interrupting screen reader users with minor time updates)
- [ ] **Given** an error state appears, **When** the error message is rendered, **Then** the `aria-live` region announces the error message to the screen reader user

**Priority:** P1 | **Feature Ref:** F8 | **Phase:** 4 | **Story Points:** 3

---

### US-9.3: WCAG Contrast Compliance on All Backgrounds

**As a** casual checker (Donna) with mild visual impairment, **I want to** read all weather text clearly against the background in every condition and time-of-day combination, **so that** I can read the temperature even when the background is a bright sky blue or a dark navy night gradient.

**Acceptance Criteria:**
- [ ] **Given** every condition × time-of-day background gradient combination (e.g., clear/day, clear/night, overcast/day, thunderstorm/night), **When** text is overlaid on the gradient, **Then** all normal text achieves a minimum 4.5:1 contrast ratio (WCAG 1.4.3 AA)
- [ ] **Given** all background combinations are tested, **When** the audit is run with a colour contrast analyser, **Then** zero combinations fall below 4.5:1 — the palette is validated before Phase 4 ships
- [ ] **Given** condition icons in the hero, **When** they are rendered on the condition-aware background, **Then** the icons are distinguishable at 3:1 contrast ratio or higher (WCAG 1.4.11 non-text contrast)

**Priority:** P1 | **Feature Ref:** F8, F4 | **Phase:** 4 | **Story Points:** 3

---

### US-9.4: Reduced Motion Support

**As a** user with vestibular disorders, **I want** all animations and transitions to be disabled when I have set `prefers-reduced-motion: reduce` in my OS settings, **so that** moving elements don't cause me discomfort or distraction.

**Acceptance Criteria:**
- [ ] **Given** the user's OS is set to reduce motion, **When** `prefers-reduced-motion: reduce` is detected by CSS, **Then** skeleton loading animations (pulse/shimmer) are disabled
- [ ] **Given** reduced motion is active, **When** the background gradient transitions to a new weather condition, **Then** the transition plays with no animated duration (instant swap, no fade or morph)
- [ ] **Given** reduced motion is active, **When** the Recharts temperature trend chart renders, **Then** chart entry animations are disabled and the chart appears fully rendered immediately
- [ ] **Given** reduced motion is active, **When** the Details panel expands or collapses, **Then** any CSS height/opacity transition is disabled and the expand/collapse is instantaneous

**Priority:** P1 | **Feature Ref:** F8 | **Phase:** 3 | **Story Points:** 2

---

### US-9.5: WCAG AA Automated Audit Passes

**As a** developer shipping to production, **I want** the app to pass a WCAG AA automated audit with zero violations, **so that** I have a reproducible, documented baseline that confirms accessibility compliance before deployment.

**Acceptance Criteria:**
- [ ] **Given** the production build is deployed, **When** an axe-core automated scan is run against the live URL, **Then** zero WCAG AA violations are reported in the axe output
- [ ] **Given** multiple app states (loading, data loaded, error, offline), **When** axe-core is run against each state, **Then** zero violations appear in any state — the scan is not limited to the happy-path loaded view
- [ ] **Given** the automated scan passes, **When** a manual keyboard + screen reader check is performed, **Then** all interactive elements are operable, all data changes are announced, and tab order is logical
- [ ] **Given** the WCAG 2.5.8 touch target requirement, **When** all interactive element dimensions are inspected in DevTools on a 375px viewport, **Then** every element measures ≥ 44 × 44 px

**Priority:** P1 | **Feature Ref:** F8 | **Phase:** 4 | **Story Points:** 3

---

## Story Index

| Story ID | Title                                           | Persona       | Priority | Phase | Points | Feature Ref |
|----------|-------------------------------------------------|---------------|----------|-------|--------|-------------|
| US-1.1   | City Name Search with Autocomplete              | Marcus, Donna | P0       | 1     | 5      | F0          |
| US-1.2   | Select a Location from Suggestions              | Donna         | P0       | 1     | 3      | F0          |
| US-1.3   | Recent Location Quick-Select                    | Marcus        | P1       | 3     | 3      | F0          |
| US-1.4   | Clear / Change Location                         | Donna         | P0       | 1     | 2      | F0          |
| US-1.5   | Geocoding Error Handling                        | Donna         | P0       | 4     | 2      | F0          |
| US-2.1   | View Current Temperature                        | Marcus        | P0       | 1     | 3      | F1          |
| US-2.2   | View Weather Condition Text and Icon            | Donna         | P0       | 1     | 5      | F1, F4      |
| US-2.3   | View Today's High and Low Temperature           | Marcus        | P0       | 1     | 2      | F1          |
| US-2.4   | View Humidity and Wind Speed                    | Priya         | P0       | 1     | 2      | F1          |
| US-2.5   | View Precipitation Probability for Today        | Marcus        | P0       | 1     | 2      | F1          |
| US-2.6   | View Data Freshness Indicator                   | Priya         | P1       | 3     | 3      | F7          |
| US-3.1   | View 7-Day Daily Forecast                       | Priya         | P0       | 2     | 5      | F3          |
| US-3.2   | View Hourly Forecast for the Next 24 Hours      | Marcus        | P1       | 2     | 5      | F2          |
| US-3.3   | View Temperature Trend Chart for the Week       | Priya         | P1       | 2     | 5      | F3          |
| US-3.4   | View Secondary Weather Details                  | Priya         | P1       | 3     | 5      | F6          |
| US-4.1   | Full WMO Icon Coverage (Codes 0–99)             | Donna         | P0       | 2     | 3      | F4          |
| US-4.2   | Day/Night Icon Variants                         | Marcus        | P0       | 2     | 3      | F4          |
| US-4.3   | Condition-Aware Background Gradient             | Donna         | P1       | 3     | 5      | F4          |
| US-4.4   | Accessible Icon + Text Label Pairing            | Donna         | P1       | 4     | 2      | F4, F8      |
| US-5.1   | Usable Mobile Layout (375px)                    | Marcus        | P0       | 3     | 5      | F5          |
| US-5.2   | Usable Desktop Layout (1024px+)                 | Priya         | P0       | 3     | 3      | F5          |
| US-5.3   | Tablet Layout (768px–1023px)                    | Donna         | P1       | 3     | 3      | F5          |
| US-6.1   | Opt-In GPS Location Detection                   | Marcus        | P1       | 1     | 5      | F0          |
| US-6.2   | Graceful Handling of Geolocation Denial         | Donna         | P0       | 1     | 3      | F0          |
| US-6.3   | Geolocation on HTTPS Only                       | Developer     | P0       | 4     | 2      | F0, F9      |
| US-7.1   | Toggle Between °C and °F                        | Marcus        | P0       | 1     | 3      | F1          |
| US-7.2   | Persist Unit Preference Across Sessions         | Donna         | P1       | 1     | 2      | F1          |
| US-7.3   | Unit Toggle Accessibility                       | Keyboard user | P1       | 4     | 1      | F1, F8      |
| US-8.1   | Skeleton Loading State During Data Fetch        | Marcus        | P0       | 1     | 3      | F7          |
| US-8.2   | API Error State                                 | Donna         | P0       | 1     | 3      | F7          |
| US-8.3   | Offline / No Network State                      | Priya         | P1       | 4     | 3      | F7          |
| US-8.4   | City Not Found Error State                      | Donna         | P0       | 4     | 2      | F0, F7      |
| US-8.5   | No Blank Screen Contract                        | All           | P0       | 1     | 2      | F7          |
| US-9.1   | Full Keyboard Navigation                        | Keyboard user | P1       | 4     | 5      | F8          |
| US-9.2   | Screen Reader Announcements for Data Updates    | Screen reader | P1       | 4     | 3      | F8          |
| US-9.3   | WCAG Contrast Compliance on All Backgrounds     | Donna         | P1       | 4     | 3      | F8, F4      |
| US-9.4   | Reduced Motion Support                          | All           | P1       | 3     | 2      | F8          |
| US-9.5   | WCAG AA Automated Audit Passes                  | Developer     | P1       | 4     | 3      | F8          |

**Total stories:** 38 | **Total story points:** 124

---

## Stories by Phase

### Phase 1 — Foundation + Current Conditions (REQ-01, REQ-02)

| Story ID | Title                                      | Priority | Points |
|----------|--------------------------------------------|----------|--------|
| US-1.1   | City Name Search with Autocomplete         | P0       | 5      |
| US-1.2   | Select a Location from Suggestions         | P0       | 3      |
| US-1.4   | Clear / Change Location                    | P0       | 2      |
| US-2.1   | View Current Temperature                   | P0       | 3      |
| US-2.2   | View Weather Condition Text and Icon       | P0       | 5      |
| US-2.3   | View Today's High and Low Temperature      | P0       | 2      |
| US-2.4   | View Humidity and Wind Speed               | P0       | 2      |
| US-2.5   | View Precipitation Probability for Today   | P0       | 2      |
| US-6.1   | Opt-In GPS Location Detection              | P1       | 5      |
| US-6.2   | Graceful Handling of Geolocation Denial    | P0       | 3      |
| US-7.1   | Toggle Between °C and °F                   | P0       | 3      |
| US-7.2   | Persist Unit Preference Across Sessions    | P1       | 2      |
| US-8.1   | Skeleton Loading State During Data Fetch   | P0       | 3      |
| US-8.2   | API Error State                            | P0       | 3      |
| US-8.5   | No Blank Screen Contract                   | P0       | 2      |

**Phase 1 Total:** 15 stories · 45 points

---

### Phase 2 — Forecast Views (REQ-03, REQ-04)

| Story ID | Title                                       | Priority | Points |
|----------|---------------------------------------------|----------|--------|
| US-3.1   | View 7-Day Daily Forecast                   | P0       | 5      |
| US-3.2   | View Hourly Forecast for the Next 24 Hours  | P1       | 5      |
| US-3.3   | View Temperature Trend Chart for the Week   | P1       | 5      |
| US-4.1   | Full WMO Icon Coverage (Codes 0–99)         | P0       | 3      |
| US-4.2   | Day/Night Icon Variants                     | P0       | 3      |

**Phase 2 Total:** 5 stories · 21 points

---

### Phase 3 — Details + Polish (REQ-05, REQ-04 visual polish)

| Story ID | Title                                    | Priority | Points |
|----------|------------------------------------------|----------|--------|
| US-1.3   | Recent Location Quick-Select             | P1       | 3      |
| US-2.6   | View Data Freshness Indicator            | P1       | 3      |
| US-3.4   | View Secondary Weather Details           | P1       | 5      |
| US-4.3   | Condition-Aware Background Gradient      | P1       | 5      |
| US-5.1   | Usable Mobile Layout (375px)             | P0       | 5      |
| US-5.2   | Usable Desktop Layout (1024px+)          | P0       | 3      |
| US-5.3   | Tablet Layout (768px–1023px)             | P1       | 3      |
| US-9.4   | Reduced Motion Support                   | P1       | 2      |

**Phase 3 Total:** 8 stories · 29 points

---

### Phase 4 — Quality + Accessibility Hardening (All REQ, production-ready)

| Story ID | Title                                           | Priority | Points |
|----------|-------------------------------------------------|----------|--------|
| US-1.5   | Geocoding Error Handling                        | P0       | 2      |
| US-4.4   | Accessible Icon + Text Label Pairing            | P1       | 2      |
| US-6.3   | Geolocation on HTTPS Only                       | P0       | 2      |
| US-7.3   | Unit Toggle Accessibility                       | P1       | 1      |
| US-8.3   | Offline / No Network State                      | P1       | 3      |
| US-8.4   | City Not Found Error State                      | P0       | 2      |
| US-9.1   | Full Keyboard Navigation                        | P1       | 5      |
| US-9.2   | Screen Reader Announcements for Data Updates    | P1       | 3      |
| US-9.3   | WCAG Contrast Compliance on All Backgrounds     | P1       | 3      |
| US-9.5   | WCAG AA Automated Audit Passes                  | P1       | 3      |

**Phase 4 Total:** 10 stories · 26 points

---

## Requirement Coverage Matrix

| Requirement | Description                                              | Stories Covering                              | Status  |
|-------------|----------------------------------------------------------|-----------------------------------------------|---------|
| REQ-01      | Location search by city name                             | US-1.1, US-1.2, US-1.3, US-1.4, US-1.5       | ✓ Full  |
| REQ-02      | Current conditions (temp, description, humidity, wind)   | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5       | ✓ Full  |
| REQ-03      | Multi-day forecast (3–7 days)                            | US-3.1, US-3.2, US-3.3                        | ✓ Full  |
| REQ-04      | Weather icons/visual indicators                          | US-2.2, US-4.1, US-4.2, US-4.3, US-4.4       | ✓ Full  |
| REQ-05      | Desktop and mobile display                               | US-5.1, US-5.2, US-5.3                        | ✓ Full  |
| —           | GPS geolocation (opt-in)                                 | US-6.1, US-6.2, US-6.3                        | ✓ Full  |
| —           | Unit toggle (°C/°F)                                      | US-7.1, US-7.2, US-7.3                        | ✓ Full  |
| —           | Loading and error states                                 | US-8.1, US-8.2, US-8.3, US-8.4, US-8.5       | ✓ Full  |
| —           | Accessibility requirements                               | US-9.1, US-9.2, US-9.3, US-9.4, US-9.5       | ✓ Full  |

**Coverage: 9/9 requirement areas fully mapped ✓**

---

*User Stories version 1.0 — generated 2026-04-29*  
*Sources: PRD.md · PERSONAS.md · ROADMAP.md*  
*Total: 38 stories · 124 story points across 4 phases*

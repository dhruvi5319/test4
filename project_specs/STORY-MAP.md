# STORY-MAP — Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-04-29 |
| **Author** | Pivota Spec Story Map Generator |
| **Related Personas** | PERSONAS.md |
| **Related JTBD** | JTBD.md |
| **Related User Stories** | USER-STORIES.md |
| **Related Roadmap** | .planning/ROADMAP.md |

---

## Overview

This Story Map organizes all 38 user stories into a two-dimensional grid:

- **X-axis (Backbone):** Five user activities that span every persona's journey — from finding their location to reading the full weather picture confidently.
- **Y-axis (Ribs):** Stories are stacked within each activity, ordered top-to-bottom from minimum viable value (P0) to full value (P1/P2).
- **Horizontal release slices:** Phase 1 through Phase 4 cut across the backbone as swim lanes, each slice enabling at least one complete persona journey.
- **NaC column:** Each row carries a Natural Acceptance Criterion derived from the intersection of a specific JTBD outcome and the activity context. NaC are not invented — they trace back to a named JTBD job outcome.

**Map ID convention:** `SM-{Epic}.{NN}` (e.g., SM-1.01 = Epic 1, entry 01).

---

## Personas & Journeys at a Glance

| Persona | Primary Journey | Critical Stage | Key JTBD |
|---|---|---|---|
| PER-01 Marcus (Commuter) | Open → Find city → Read temp + precip → Close (≤15s) | Read Current Conditions | JTBD-01.1, JTBD-01.2 |
| PER-02 Priya (Planner) | Open → Find city → Scan 7-day → Drill hourly → Check details → Confirm freshness | Explore Forecast + Check Details | JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4 |
| PER-03 Donna (Casual) | Open → City loads → Read condition icon + text → Glance week → Close (≤20s) | Arrive + Read Current Conditions | JTBD-03.1, JTBD-03.2 |

---

## Story Map Backbone

The five backbone activities map to the shared journey stages all three personas traverse:

```
BACKBONE ──────────────────────────────────────────────────────────────────────────────────────
  ACT-1: FIND A LOCATION  │  ACT-2: READ CURRENT  │  ACT-3: EXPLORE   │  ACT-4: CHECK   │  ACT-5: TRUST
  (Search / GPS / Recent) │  CONDITIONS (Hero)    │  FORECAST         │  DETAILS        │  & RESILIENCE
────────────────────────────────────────────────────────────────────────────────────────────────
```

---

## Story Map Matrix

> Stories within each phase slice are ordered: P0 first (bold = must-have), then P1. The NaC column traces to the JTBD source in brackets.

---

### ACT-1 · Find a Location

| SM-ID | Story | Persona | Priority | Phase | Points | Natural Acceptance Criterion (NaC) | JTBD Source |
|---|---|---|---|---|---|---|---|
| SM-1.01 | **US-1.1** City Name Search with Autocomplete | Marcus, Donna | P0 | 1 | 5 | Typing 2+ characters returns ≤5 city suggestions within 500 ms; selecting one loads weather — total time from open to data ≤ 10 s | JTBD-01.1: Minimize time from app open to clothing decision |
| SM-1.02 | **US-1.2** Select a Location from Suggestions | Donna | P0 | 1 | 3 | Suggestion tap targets are ≥ 44 × 44 px; selection loads weather and updates the page header city name | JTBD-03.3: Access weather for a non-home location without disrupting normal use |
| SM-1.03 | **US-1.4** Clear / Change Location | Donna | P0 | 1 | 2 | Tapping the search input highlights current city name; typing a new query leaves previous weather visible until selection; Escape closes dropdown | JTBD-03.3: Access weather for a non-home location without friction |
| SM-1.04 | **US-6.2** Graceful Handling of Geolocation Denial | Donna | P0 | 1 | 3 | Denying GPS permission leaves the app fully functional with search input focused; no blank screen, no blocking modal | JTBD-X.2: Never be interrupted by the app's own needs |
| SM-1.05 | **US-6.1** Opt-In GPS Location Detection | Marcus | P1 | 1 | 5 | Tapping the GPS button invokes the browser permission dialog; granting it loads weather and adds the city to recent locations | JTBD-01.1: Minimize time from app open to clothing decision |
| SM-1.06 | **US-7.2** Persist Unit Preference Across Sessions | Donna | P1 | 1 | 2 | After toggling to °F, closing and reopening the browser retains °F; `localStorage` key `weather_unit` equals "F" | JTBD-X.3: Trust the numbers being displayed |
| SM-1.07 | **US-1.3** Recent Location Quick-Select | Marcus | P1 | 3 | 3 | Up to 5 recent city chips appear below search; tapping a chip loads weather instantly; chips persist across browser sessions | JTBD-02.5: Check weather for a remote location without friction |
| SM-1.08 | **US-1.5** Geocoding Error Handling | Donna | P0 | 4 | 2 | Zero-results search shows "City not found — try a different spelling"; network failure shows "Could not search locations"; error clears on next keystroke | JTBD-X.1: Load useful data before patience runs out |
| SM-1.09 | **US-6.3** Geolocation on HTTPS Only | Dev | P0 | 4 | 2 | GPS works on production HTTPS; fails gracefully on HTTP with a user-readable message; `timezone=auto` is set on all subsequent API calls | JTBD-X.3: Trust the numbers being displayed |
| SM-1.10 | **US-8.4** City Not Found Error State | Donna | P0 | 4 | 2 | "City not found" message appears in-line; search input stays focused and editable; success on retry clears the message | JTBD-03.3: Access weather for a non-home location without disruption |

---

### ACT-2 · Read Current Conditions

| SM-ID | Story | Persona | Priority | Phase | Points | Natural Acceptance Criterion (NaC) | JTBD Source |
|---|---|---|---|---|---|---|---|
| SM-2.01 | **US-2.1** View Current Temperature | Marcus | P0 | 1 | 3 | Current temp is the largest typographic element, visible above the fold on all viewports 375px–1280px, displayed as an integer (no decimals) | JTBD-01.1: Minimize time from app open to clothing decision |
| SM-2.02 | **US-2.2** View Weather Condition Text and Icon | Donna | P0 | 1 | 5 | Condition icon + plain-English text label (e.g., "Clear Sky") appear together; night icon shown after sunset at the selected location's timezone | JTBD-03.1: Reduce "should I go outside?" to a single glance |
| SM-2.03 | **US-2.3** View Today's High and Low Temperature | Marcus | P0 | 1 | 2 | High and Low are displayed as a pair (H first, L second); both convert immediately when unit toggle is tapped | JTBD-01.1: Minimize time from app open to clothing decision |
| SM-2.04 | **US-2.4** View Humidity and Wind Speed | Priya | P0 | 1 | 2 | Humidity (%) and wind speed (with unit) are visible in the hero on a 375px viewport without overflow; wind unit matches temperature unit system | JTBD-02.3: Consolidate secondary conditions into one app |
| SM-2.05 | **US-2.5** View Precipitation Probability for Today | Marcus | P0 | 1 | 2 | Today's precip % is labelled and in the hero section; "0%" is shown explicitly when there is no rain chance | JTBD-01.1: Minimize time from app open to clothing decision |
| SM-2.06 | **US-7.1** Toggle Between °C and °F | Marcus | P0 | 1 | 3 | °C/°F toggle is visible on the main screen (not in a menu); tapping it converts all values (temp, feels-like, high/low, hourly, daily, chart, wind) instantly with no API re-fetch | JTBD-01.4: Translate displayed values to the expected unit in ≤ 5 s |
| SM-2.07 | **US-8.1** Skeleton Loading State During Data Fetch | Marcus | P0 | 1 | 3 | While `isLoading: true`, grey animated skeleton shapes fill the temperature, icon, high/low, and forecast positions; no blank white areas; skeletons are static under `prefers-reduced-motion` | JTBD-X.1: Load useful data before patience runs out |
| SM-2.08 | **US-8.2** API Error State | Donna | P0 | 1 | 3 | Non-2xx or network error shows a friendly message + "Try again" button; cached data is displayed with a "showing cached data" notice if available | JTBD-X.1: Load useful data before patience runs out |
| SM-2.09 | **US-8.5** No Blank Screen Contract | All | P0 | 1 | 2 | In every state (loading, error, offline, first visit), something is always visible: skeleton, error message, cached data, or "Search a city to get started" prompt | JTBD-X.1: Zero blank-screen states across all error and loading paths |
| SM-2.10 | **US-2.6** View Data Freshness Indicator | Priya | P1 | 3 | 3 | "Updated X minutes ago" is always visible on the current conditions screen; offline state reads "Showing data from X minutes ago (offline)"; counter ticks every minute without triggering a re-fetch | JTBD-02.4: Verify data currency before making an irreversible commitment |

---

### ACT-3 · Explore Forecast

| SM-ID | Story | Persona | Priority | Phase | Points | Natural Acceptance Criterion (NaC) | JTBD Source |
|---|---|---|---|---|---|---|---|
| SM-3.01 | **US-3.1** View 7-Day Daily Forecast | Priya, Donna | P0 | 2 | 5 | All 7 daily rows (day name, icon, high, low, precip%) are visible without horizontal scroll on 1024px+ desktop; all 7 visible in vertical scroll on 375px mobile | JTBD-02.1: Compress multi-source planning into a single app interaction |
| SM-3.02 | **US-4.1** Full WMO Icon Coverage (Codes 0–99) | Donna | P0 | 2 | 3 | Every WMO code 0–99 maps to a rendered icon; no broken image or missing icon placeholder across current conditions, hourly cards, and daily rows | JTBD-03.1: Reduce "should I go outside?" to a single glance |
| SM-3.03 | **US-4.2** Day/Night Icon Variants | Marcus | P0 | 2 | 3 | Clear/partly-cloudy conditions use moon icon before sunrise or after sunset at the selected location's local timezone; sun icon never appears at night | JTBD-02.2: Replace day-level uncertainty with hour-level precision |
| SM-3.04 | **US-3.2** View Hourly Forecast for the Next 24 Hours | Marcus | P1 | 2 | 5 | Horizontal scrollable row shows 24 cards (current hour + next 23h) each with hour, icon, temp, precip%; all tap targets ≥ 44 × 44 px; keyboard navigable | JTBD-01.2: Reduce uncertainty about short-range rain risk for specific clock windows |
| SM-3.05 | **US-3.3** View Temperature Trend Chart for the Week | Priya | P1 | 2 | 5 | Recharts AreaChart renders a 7-day temperature curve; Y-axis unit matches toggle; chart updates on unit change; static (no animation) under `prefers-reduced-motion` | JTBD-02.1: Identify viable outdoor days for the weekend at a glance |

---

### ACT-4 · Check Details

| SM-ID | Story | Persona | Priority | Phase | Points | Natural Acceptance Criterion (NaC) | JTBD Source |
|---|---|---|---|---|---|---|---|
| SM-4.01 | **US-3.4** View Secondary Weather Details (UV, Wind, Visibility, Sunrise/Sunset) | Priya | P1 | 3 | 5 | Details panel is collapsed by default; ≤ 2 taps from main screen; expanded view shows UV index, wind speed + direction + degrees, visibility, humidity, sunrise, sunset in the selected location's local timezone | JTBD-02.3: Consolidate secondary conditions into one app in ≤ 30 s |
| SM-4.02 | **US-4.3** Condition-Aware Background Gradient | Donna | P1 | 3 | 5 | Background gradient shifts for all weather state × time-of-day combinations; all text achieves ≥ 4.5:1 WCAG 1.4.3 contrast ratio; gradient transitions instantly under `prefers-reduced-motion` | JTBD-03.1: Sense weather state immediately from the visual environment |

---

### ACT-5 · Trust & Resilience

| SM-ID | Story | Persona | Priority | Phase | Points | Natural Acceptance Criterion (NaC) | JTBD Source |
|---|---|---|---|---|---|---|---|
| SM-5.01 | **US-5.1** Usable Mobile Layout (375px) | Marcus | P0 | 3 | 5 | Zero horizontal overflow on 375px; all tap targets ≥ 44 × 44 px; all 7 forecast days visible in vertical list; no critical text truncated at large system font size | JTBD-X.4: Use the app on any device without compromise |
| SM-5.02 | **US-5.2** Usable Desktop Layout (1024px+) | Priya | P0 | 3 | 3 | 1024px+ shows multi-column layout; full 7-day forecast without horizontal scroll; all hero data above the fold; layout transitions cleanly at Tailwind breakpoints | JTBD-X.4: Use the app on any device without compromise |
| SM-5.03 | **US-5.3** Tablet Layout (768px–1023px) | Donna | P1 | 3 | 3 | 768px layout meaningfully uses extra width (not just stretched mobile); text readable at default iPad font size; no horizontal overflow | JTBD-X.4: Use the app on any device without compromise |
| SM-5.04 | **US-9.4** Reduced Motion Support | All | P1 | 3 | 2 | Under `prefers-reduced-motion: reduce`: skeleton animations disabled; background transitions are instant; Recharts chart renders statically; Details panel expands/collapses instantly | JTBD-03.4: Navigate secondary controls with confidence that errors are reversible |
| SM-5.05 | **US-8.3** Offline / No Network State | Priya | P1 | 4 | 3 | Offline + cached data: shows cached data with "Showing data from X minutes ago (offline)"; offline + no cache: shows "Unable to load weather — check your connection"; auto-refreshes on reconnect | JTBD-02.4: Verify data currency before committing to plans |
| SM-5.06 | **US-4.4** Accessible Icon + Text Label Pairing | Donna | P1 | 4 | 2 | Every weather icon has an adjacent text label; icons with paired text are `aria-hidden="true"`; icons without paired text have an appropriate `aria-label` | JTBD-03.4: Navigate the app without anxiety or confusion |
| SM-5.07 | **US-7.3** Unit Toggle Accessibility | Keyboard | P1 | 4 | 1 | Toggle is reachable via Tab; Enter/Space toggles the unit; screen reader announces "Temperature unit: Celsius — press to switch to Fahrenheit" | JTBD-X.4: Use the app on any device without compromise |
| SM-5.08 | **US-9.1** Full Keyboard Navigation | Keyboard | P1 | 4 | 5 | Tab order: search → GPS → unit toggle → recent chips → hourly cards → daily rows → details toggle; all elements show visible focus indicator; autocomplete navigable with Arrow/Enter/Escape | JTBD-X.4: Use the app on any device without compromise |
| SM-5.09 | **US-9.2** Screen Reader Announcements for Data Updates | Screen reader | P1 | 4 | 3 | `aria-live="polite"` region announces city + current temp + condition on city change; freshness counter updates do NOT trigger announcements; error messages are announced | JTBD-X.2: Never be interrupted by the app's own needs |
| SM-5.10 | **US-9.3** WCAG Contrast Compliance on All Backgrounds | Donna | P1 | 4 | 3 | All text on all condition × time-of-day backgrounds achieves ≥ 4.5:1 (WCAG 1.4.3); icons achieve ≥ 3:1 (WCAG 1.4.11); verified by colour contrast analyser before Phase 4 ships | JTBD-X.4: Use the app on any device without compromise |
| SM-5.11 | **US-9.5** WCAG AA Automated Audit Passes | Dev | P1 | 4 | 3 | axe-core scan across loading, loaded, error, and offline states returns zero WCAG AA violations; all elements ≥ 44 × 44 px on 375px viewport confirmed in DevTools | JTBD-X.4: Use the app on any device without compromise |

---

## Release Swim Lanes (Phase Summary)

```
BACKBONE ──────────────────────────────────────────────────────────────────────────────
           ACT-1: FIND     │  ACT-2: READ CURRENT  │  ACT-3: EXPLORE   │ ACT-4 │ ACT-5
           LOCATION        │  CONDITIONS (Hero)    │  FORECAST         │ DETAIL │ TRUST
──────────────────────────────────────────────────────────────────────────────────────
PHASE 1 │ US-1.1 US-1.2   │ US-2.1 US-2.2 US-2.3 │                   │       │
"Core   │ US-1.4 US-6.2   │ US-2.4 US-2.5 US-7.1 │                   │       │
 Check" │ US-6.1 US-7.2   │ US-8.1 US-8.2 US-8.5 │                   │       │
──────────────────────────────────────────────────────────────────────────────────────
PHASE 2 │                 │                       │ US-3.1 US-4.1     │       │
"Fore-  │                 │                       │ US-4.2 US-3.2     │       │
 cast"  │                 │                       │ US-3.3            │       │
──────────────────────────────────────────────────────────────────────────────────────
PHASE 3 │ US-1.3          │ US-2.6                │                   │US-3.4 │ US-5.1
"Polish"│                 │                       │                   │US-4.3 │ US-5.2
        │                 │                       │                   │       │ US-5.3
        │                 │                       │                   │       │ US-9.4
──────────────────────────────────────────────────────────────────────────────────────
PHASE 4 │ US-1.5 US-6.3   │                       │                   │       │ US-8.3
"Hard-  │ US-8.4          │                       │                   │       │ US-4.4
 ening" │                 │                       │                   │       │ US-7.3
        │                 │                       │                   │       │ US-9.1
        │                 │                       │                   │       │ US-9.2
        │                 │                       │                   │       │ US-9.3
        │                 │                       │                   │       │ US-9.5
──────────────────────────────────────────────────────────────────────────────────────
```

---

## NaC Derivation Table

Full traceability: JTBD outcome → Journey activity → NaC → Story

| JTBD-ID | Functional Outcome | Activity | Derived NaC | Story |
|---|---|---|---|---|
| JTBD-01.1 | Minimize time from app open to clothing decision | ACT-1: Find Location | Typing 2+ chars returns suggestions within 500 ms; full open-to-data flow ≤ 10 s | US-1.1 |
| JTBD-01.1 | Minimize time from app open to clothing decision | ACT-2: Read Current | Temp + feels-like + precip % visible above fold within 2 s; no scroll or tap required | US-2.1, US-2.3, US-2.5 |
| JTBD-01.2 | Reduce uncertainty about short-range rain risk | ACT-3: Explore Forecast | Hourly row accessible in one tap; each card shows precip %; all targets ≥ 44 px | US-3.2 |
| JTBD-01.3 | Reduce morning prep time by planning night before | ACT-3: Explore Forecast | Tomorrow's high/low + precip % visible in 7-day row without sub-navigation | US-3.1 |
| JTBD-01.4 | Translate displayed values to the expected unit | ACT-2: Read Current | Toggle visible on main screen; all values convert instantly in one tap, no re-fetch | US-7.1 |
| JTBD-02.1 | Compress multi-source planning into one interaction | ACT-3: Explore Forecast | Full 7-day rows (icon, H/L, precip%) on desktop without horizontal scroll; temp trend chart gives shape-at-a-glance | US-3.1, US-3.3 |
| JTBD-02.2 | Replace day-level uncertainty with hour-level precision | ACT-3: Explore Forecast | Hourly cards show day/night icon variants; cards span 24 h; precip% on every card | US-3.2, US-4.2 |
| JTBD-02.3 | Consolidate secondary conditions into one app | ACT-4: Check Details | Details panel reachable in ≤ 2 taps; shows UV, wind, sunrise/sunset in location's timezone | US-3.4, US-2.4 |
| JTBD-02.4 | Verify data currency before committing to plans | ACT-2: Read Current | "Updated X minutes ago" always visible; offline variant reads "Showing data from X min ago (offline)" | US-2.6, US-8.3 |
| JTBD-02.5 | Access location-specific data for non-home locations | ACT-1: Find Location | Recent city chips persist; selecting a chip loads weather without re-typing | US-1.3 |
| JTBD-03.1 | Reduce "should I go outside?" to a single glance | ACT-2: Read Current | Condition icon + plain-English text label visible above fold within 3 s; condition-aware background reinforces state visually | US-2.2, US-4.3 |
| JTBD-03.2 | Identify optimal outdoor days in one view | ACT-3: Explore Forecast | All 7 forecast rows visible in a single scroll; recognisable icons; readable high/low without zoom | US-3.1 |
| JTBD-03.3 | Access weather for a non-home location without friction | ACT-1: Find Location | Search bar is prominent; autocomplete returns results; switching back via recent chip ≤ 3 taps | US-1.2, US-1.4, US-1.3 |
| JTBD-03.4 | Navigate secondary controls with confidence | ACT-5: Trust & Resilience | All controls have plain-English labels; progressive disclosure means secondary options don't clutter the main view; every action is reversible | US-4.4, US-9.4 |
| JTBD-X.1 | Load useful data before patience runs out | ACT-2: Read Current | Skeleton fills layout while loading; friendly error + retry on failure; no blank white screen in any state | US-8.1, US-8.2, US-8.5, US-1.5 |
| JTBD-X.2 | Never be interrupted by the app's own needs | ACT-1: Find Location | GPS is opt-in button only; denying permission leaves search input focused; no modal/overlay/account prompt ever appears | US-6.2, US-6.1, US-9.2 |
| JTBD-X.3 | Trust the numbers being displayed | ACT-2: Read Current | Temps display as integers; units match localStorage preference; time labels use searched location's timezone; freshness timestamp always visible | US-2.1, US-7.1, US-7.2, US-6.3 |
| JTBD-X.4 | Use the app on any device without compromise | ACT-5: Trust & Resilience | No overflow on 375px–1280px; all tap targets ≥ 44 × 44 px; text readable at default system font size on iPad; WCAG AA verified | US-5.1, US-5.2, US-5.3, US-9.1, US-9.3, US-9.5 |

---

## Release Planning

### Phase 1 · "Core Weather Check"
**Theme:** A working app that gives any user a complete current-conditions answer for any searched city in under 15 seconds. Marcus's P0 morning journey is fully deliverable.

**Persona journeys enabled:** PER-01 (full P0 morning check), PER-03 (basic today's conditions)

| Story | Activity | JTBD | Points |
|---|---|---|---|
| US-1.1 City Name Search with Autocomplete | ACT-1 | JTBD-01.1, JTBD-03.3 | 5 |
| US-1.2 Select a Location from Suggestions | ACT-1 | JTBD-03.3 | 3 |
| US-1.4 Clear / Change Location | ACT-1 | JTBD-03.3 | 2 |
| US-6.2 Graceful Handling of Geolocation Denial | ACT-1 | JTBD-X.2 | 3 |
| US-6.1 Opt-In GPS Location Detection | ACT-1 | JTBD-01.1 | 5 |
| US-7.2 Persist Unit Preference Across Sessions | ACT-1 | JTBD-X.3 | 2 |
| US-2.1 View Current Temperature | ACT-2 | JTBD-01.1 | 3 |
| US-2.2 View Weather Condition Text and Icon | ACT-2 | JTBD-03.1 | 5 |
| US-2.3 View Today's High and Low Temperature | ACT-2 | JTBD-01.1 | 2 |
| US-2.4 View Humidity and Wind Speed | ACT-2 | JTBD-02.3 | 2 |
| US-2.5 View Precipitation Probability for Today | ACT-2 | JTBD-01.1 | 2 |
| US-7.1 Toggle Between °C and °F | ACT-2 | JTBD-01.4 | 3 |
| US-8.1 Skeleton Loading State During Data Fetch | ACT-2 | JTBD-X.1 | 3 |
| US-8.2 API Error State | ACT-2 | JTBD-X.1 | 3 |
| US-8.5 No Blank Screen Contract | ACT-2 | JTBD-X.1 | 2 |

**Phase 1 Total:** 15 stories · 45 points

---

### Phase 2 · "Forecast Views"
**Theme:** Adds hourly and 7-day forecast depth. Priya's planning journey and Marcus's commute-window scan both become fully deliverable. Donna gains the 7-day week view.

**Persona journeys enabled:** PER-01 (commute-window scan added), PER-02 (weekly planning P0), PER-03 (week scan added)

| Story | Activity | JTBD | Points |
|---|---|---|---|
| US-3.1 View 7-Day Daily Forecast | ACT-3 | JTBD-02.1, JTBD-03.2 | 5 |
| US-4.1 Full WMO Icon Coverage (Codes 0–99) | ACT-3 | JTBD-03.1 | 3 |
| US-4.2 Day/Night Icon Variants | ACT-3 | JTBD-02.2 | 3 |
| US-3.2 View Hourly Forecast for the Next 24 Hours | ACT-3 | JTBD-01.2 | 5 |
| US-3.3 View Temperature Trend Chart for the Week | ACT-3 | JTBD-02.1 | 5 |

**Phase 2 Total:** 5 stories · 21 points

---

### Phase 3 · "Details + Polish"
**Theme:** Adds secondary weather details, condition-aware visual identity, freshness indicator, recent location chips, and responsive layout across mobile/tablet/desktop. Priya's full P1 planning journey completes. Donna's experience becomes frictionless on her iPad.

**Persona journeys enabled:** PER-02 (details + freshness complete), PER-03 (tablet layout, visual comfort), all personas (responsive coverage)

| Story | Activity | JTBD | Points |
|---|---|---|---|
| US-1.3 Recent Location Quick-Select | ACT-1 | JTBD-02.5, JTBD-03.3 | 3 |
| US-2.6 View Data Freshness Indicator | ACT-2 | JTBD-02.4 | 3 |
| US-3.4 View Secondary Weather Details | ACT-4 | JTBD-02.3 | 5 |
| US-4.3 Condition-Aware Background Gradient | ACT-4 | JTBD-03.1 | 5 |
| US-5.1 Usable Mobile Layout (375px) | ACT-5 | JTBD-X.4 | 5 |
| US-5.2 Usable Desktop Layout (1024px+) | ACT-5 | JTBD-X.4 | 3 |
| US-5.3 Tablet Layout (768px–1023px) | ACT-5 | JTBD-X.4 | 3 |
| US-9.4 Reduced Motion Support | ACT-5 | JTBD-03.4 | 2 |

**Phase 3 Total:** 8 stories · 29 points

---

### Phase 4 · "Quality + Accessibility Hardening"
**Theme:** Hardens all error and edge cases, achieves WCAG AA across every state, deploys to production HTTPS. Every persona's full journey is robust, accessible, and production-verified.

**Persona journeys enabled:** All (full production quality), keyboard/screen reader users (complete accessibility)

| Story | Activity | JTBD | Points |
|---|---|---|---|
| US-1.5 Geocoding Error Handling | ACT-1 | JTBD-X.1 | 2 |
| US-6.3 Geolocation on HTTPS Only | ACT-1 | JTBD-X.3 | 2 |
| US-8.4 City Not Found Error State | ACT-1 | JTBD-03.3 | 2 |
| US-4.4 Accessible Icon + Text Label Pairing | ACT-5 | JTBD-03.4 | 2 |
| US-7.3 Unit Toggle Accessibility | ACT-5 | JTBD-X.4 | 1 |
| US-8.3 Offline / No Network State | ACT-5 | JTBD-02.4 | 3 |
| US-9.1 Full Keyboard Navigation | ACT-5 | JTBD-X.4 | 5 |
| US-9.2 Screen Reader Announcements for Data Updates | ACT-5 | JTBD-X.2 | 3 |
| US-9.3 WCAG Contrast Compliance on All Backgrounds | ACT-5 | JTBD-X.4 | 3 |
| US-9.5 WCAG AA Automated Audit Passes | ACT-5 | JTBD-X.4 | 3 |

**Phase 4 Total:** 10 stories · 26 points

---

## Coverage Analysis

### Persona Coverage by Phase

| Persona | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|
| PER-01 Marcus (Commuter) | ✅ Full P0 morning check complete | ✅ Commute-window hourly scan added | ✅ Recent chips + mobile layout | ✅ Hardened + accessible |
| PER-02 Priya (Planner) | ⚠️ Partial — current conditions only | ✅ 7-day + hourly planning enabled | ✅ Details + freshness + desktop layout | ✅ Hardened + offline resilience |
| PER-03 Donna (Casual) | ✅ Today's condition check complete | ✅ 7-day week view added | ✅ Tablet layout + visual comfort | ✅ Full accessibility |

### JTBD Coverage by Phase

| JTBD | Priority | Phase First Addressed | Fully Resolved By |
|---|---|---|---|
| JTBD-01.1 Morning go/no-go | P0 | Phase 1 | Phase 1 |
| JTBD-01.2 Commute-window precipitation scan | P0 | Phase 2 | Phase 2 |
| JTBD-01.3 Evening tomorrow-planning check | P1 | Phase 2 | Phase 2 |
| JTBD-01.4 Unit conversion for colleagues | P2 | Phase 1 | Phase 1 |
| JTBD-02.1 Identify viable outdoor days | P0 | Phase 2 | Phase 2 |
| JTBD-02.2 Find precise rain window within a day | P0 | Phase 2 | Phase 2 |
| JTBD-02.3 Verify secondary conditions before trip | P1 | Phase 1 (partial) | Phase 3 |
| JTBD-02.4 Confirm data freshness before committing | P1 | Phase 3 | Phase 4 (offline) |
| JTBD-02.5 Check remote trailhead location | P2 | Phase 3 | Phase 3 |
| JTBD-03.1 Quick "good garden day?" confirmation | P0 | Phase 1 | Phase 3 (visual) |
| JTBD-03.2 Weekly garden day scan | P0 | Phase 2 | Phase 2 |
| JTBD-03.3 City switch for visiting family | P1 | Phase 1 | Phase 3 (recent chips) |
| JTBD-03.4 Use app without fear of breaking it | P1 | Phase 3 | Phase 4 |
| JTBD-X.1 Load useful data before patience runs out | P0 | Phase 1 | Phase 4 (edge cases) |
| JTBD-X.2 Never be interrupted by app's own needs | P0 | Phase 1 | Phase 4 (screen readers) |
| JTBD-X.3 Trust the numbers being displayed | P0 | Phase 1 | Phase 4 (HTTPS + timezone) |
| JTBD-X.4 Use the app on any device without compromise | P0 | Phase 3 | Phase 4 (WCAG AA) |

### Activity Coverage by Phase

| Backbone Activity | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---|---|---|---|---|
| ACT-1: Find a Location | ✅ Core stories (P0) | — | Recent chips | Error hardening |
| ACT-2: Read Current Conditions | ✅ Full hero (P0) | — | Freshness indicator | — |
| ACT-3: Explore Forecast | — | ✅ 7-day + hourly + chart | — | — |
| ACT-4: Check Details | — | — | ✅ Details panel + background | — |
| ACT-5: Trust & Resilience | — | — | ✅ Responsive + reduced motion | ✅ Accessibility + offline |

### Gap Analysis

**No orphan stories:** All 38 user stories are placed in the map. ✓

**JTBD fully addressed:** All 17 JTBD outcomes map to at least one story. ✓

**Identified tensions (design notes, not gaps):**
- **JTBD-02.3 partial in Phase 1:** Humidity and wind speed (US-2.4) are in the hero from Phase 1, giving Priya basic trip-condition data. UV index and sunrise/sunset require the Phase 3 Details panel (US-3.4). This is an intentional progressive disclosure tradeoff, not a gap.
- **JTBD-X.4 spans three phases:** Responsive layout concerns (ACT-5) begin with Phase 3 layout work and are fully locked down in Phase 4's WCAG audit. This is correct sequencing — structure before audit.
- **ACT-3 (Forecast) is unaddressed in Phase 1:** This is intentional. Phase 1 establishes the data and hero layer; forecast depth adds complexity. Marcus and Donna's P0 journeys are complete with Phase 1 hero data alone.

---

## NaC-to-Acceptance Criteria Alignment

Verifies that each NaC derived from JTBD outcomes aligns with the formal acceptance criteria in USER-STORIES.md.

| SM-ID | Story | NaC (from map) | Aligned AC in USER-STORIES.md |
|---|---|---|---|
| SM-1.01 | US-1.1 | Suggestions appear within 500 ms on 2+ chars; open-to-data ≤ 10 s | AC: "API queried and dropdown appears within 500ms" ✓ |
| SM-1.02 | US-1.2 | Suggestion tap targets ≥ 44 × 44 px | AC: "tap target is at least 44 × 44 px" ✓ |
| SM-1.04 | US-6.2 | GPS denial leaves app fully functional; no blank screen | AC: "app remains fully functional — no blank screen, no stuck spinner" ✓ |
| SM-2.01 | US-2.1 | Temp displayed as integer, largest typographic element, above fold | AC: "rounded to the nearest integer with no decimal places" ✓ |
| SM-2.02 | US-2.2 | Night icon shown after sunset at selected location's timezone | AC: "current time is after sunset at the selected location, then a moon/night icon is shown" ✓ |
| SM-2.06 | US-7.1 | Toggle visible on main screen; all values convert instantly, no re-fetch | AC: "transition is immediate — there is no loading state or API re-fetch triggered by a unit toggle" ✓ |
| SM-2.07 | US-8.1 | Skeletons fill layout; static under `prefers-reduced-motion` | AC: "prefers-reduced-motion query is active… pulse/shimmer animation is disabled" ✓ |
| SM-2.10 | US-2.6 | "Updated X min ago" always visible; counter ticks without re-fetch | AC: "counter updates at reasonable intervals without forcing a data re-fetch" ✓ |
| SM-3.01 | US-3.1 | All 7 rows visible without horizontal scroll on 1024px+; vertical scroll on 375px | AC: "all 7 rows are visible without horizontal scroll or pagination" / "visible in a vertical list without horizontal overflow" ✓ |
| SM-3.03 | US-4.2 | Day/night logic uses selected location's local timezone, not browser | AC: "day/night logic uses Tokyo's local time, not New York's" ✓ |
| SM-4.01 | US-3.4 | Details panel collapsed by default; sunrise/sunset in location's timezone | AC: "collapsed by default… reflect the selected location's local timezone (not my browser's local time)" ✓ |
| SM-5.01 | US-5.1 | Zero horizontal overflow on 375px; all tap targets ≥ 44 px | AC: "zero horizontal overflow — no content extends beyond the viewport edge" / "every tap target measures at least 44 × 44 px" ✓ |
| SM-5.09 | US-9.2 | `aria-live="polite"`; freshness counter does NOT trigger announcements | AC: "uses aria-live="polite"" / "freshness indicator updates… does NOT trigger an aria-live announcement" ✓ |
| SM-5.10 | US-9.3 | All text ≥ 4.5:1 contrast; icons ≥ 3:1 | AC: "minimum 4.5:1 contrast ratio (WCAG 1.4.3 AA)" / "icons are distinguishable at 3:1 contrast ratio or higher" ✓ |

**Alignment result:** All NaC reviewed against formal AC — no contradictions found. NaC are direct derivations from JTBD outcomes expressed as testable conditions that the AC operationalise. ✓

---

## Story Count by Epic & Phase

| Epic | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|---|---|---|---|---|---|
| E1: Location Search | 3 (US-1.1,1.2,1.4) | — | 1 (US-1.3) | 2 (US-1.5, US-8.4) | 6* |
| E2: Current Conditions | 5 (US-2.1–2.5) | — | 1 (US-2.6) | — | 6 |
| E3: Multi-Day Forecast | — | 3 (US-3.1–3.3) | 1 (US-3.4) | — | 4 |
| E4: Weather Icons & Visuals | — | 2 (US-4.1,4.2) | 1 (US-4.3) | 1 (US-4.4) | 4 |
| E5: Responsive Layout | — | — | 3 (US-5.1–5.3) | — | 3 |
| E6: GPS Geolocation | 2 (US-6.1,6.2) | — | — | 1 (US-6.3) | 3 |
| E7: Unit Toggle | 2 (US-7.1,7.2) | — | — | 1 (US-7.3) | 3 |
| E8: Loading & Error States | 3 (US-8.1,8.2,8.5) | — | — | 2 (US-8.3,8.4) | 5* |
| E9: Accessibility | — | — | 1 (US-9.4) | 4 (US-9.1–9.3,9.5) | 5 |
| **Phase Totals** | **15 · 45 pts** | **5 · 21 pts** | **8 · 29 pts** | **10 · 26 pts** | **38 · 121 pts** |

> \* US-8.4 (City Not Found Error State) sits at the intersection of E1 and E8 — counted under E1 for backbone mapping; US-1.5 cross-references error handling.

---

*Story Map version 1.0 — generated 2026-04-29*
*Sources: PERSONAS.md · JTBD.md · USER-STORIES.md · .planning/ROADMAP.md*
*Total mapped: 38 stories · 4 phases · 5 backbone activities · 17 JTBD outcomes · 0 orphans*

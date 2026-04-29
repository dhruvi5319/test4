# Phase 1: Foundation + Current Conditions - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Working app scaffold with live current weather for any searched location. Delivers: Vite + React 19 + TypeScript + Tailwind CSS v4 setup; Open-Meteo API integration with `useGeocode` + `useWeather` hooks; LocationBar component (city search autocomplete + GPS opt-in button); CurrentConditions hero (temperature, feels-like, condition icon, high/low, precip%, humidity, wind); °C/°F toggle with localStorage persistence; skeleton loading + error states.

Forecast views (hourly, daily), details panel, condition-aware backgrounds, and accessibility hardening are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Search Input Behavior
- Autocomplete suggestions appear after **2+ characters** typed
- Dropdown style: **simple list below the input** — city name + country code, no extra decoration
- After selection: **show the selected city name in the input, close the dropdown** — user sees what they picked and can clear/re-search
- Enter key: **selects the first suggestion automatically** — fast keyboard path; type city, press Enter, weather loads

### Claude's Discretion
- Debounce timing for the geocode API call (300–500ms is standard)
- Exact dropdown shadow/border styling
- Loading spinner vs skeleton within the dropdown while suggestions fetch
- Keyboard arrow-key navigation within the dropdown list
- Clear/X button to reset the search input

</decisions>

<specifics>
## Specific Ideas

No specific references cited — open to standard approaches within the decisions above.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Roadmap
- `.planning/PROJECT.md` — Project scope, requirements (REQ-01, REQ-02), out-of-scope items
- `.planning/ROADMAP.md` — Phase 1 success criteria, plan list (01-01 through 01-05), critical pitfalls (timezone, geolocation fallback, no blank screens)
- `.planning/research/SUMMARY.md` — Stack decisions, API patterns, pitfall list, architecture approach

### Spec Documents
- `project_specs/PRD.md` — Feature requirements F0–F9, NFRs (< 2s load, WCAG AA, 44px targets), risk table
- `project_specs/TECH-ARCH.md` — Component architecture, `useWeather`/`useGeocode` hook patterns, data models, TanStack Query config, error handling strategy, TypeScript interfaces
- `project_specs/USER-STORIES.md` — E1 (location search), E2 (current conditions), E6 (GPS), E7 (unit toggle), E8 (loading/error states) — acceptance criteria for Phase 1 stories

### API
- Open-Meteo Forecast API: `https://api.open-meteo.com/v1/forecast` — use `timezone=auto` on every request (non-negotiable per ROADMAP.md critical pitfalls)
- Open-Meteo Geocoding API: `https://geocoding-api.open-meteo.com/v1/search` — city name → lat/lon; triggers after 2+ chars

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing codebase

### Established Patterns
- None yet — Phase 1 establishes the patterns all subsequent phases follow

### Integration Points
- Phase 1 output (location state, `useWeather` hook, TanStack Query provider) is the foundation all Phase 2–4 components consume

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-foundation-current-conditions*
*Context gathered: 2026-04-29*

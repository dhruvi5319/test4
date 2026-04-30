# Plan 01-02: API Layer Summary

## Completed
2026-04-30

## Plan Objective
Build the complete API layer: fetch functions, TanStack Query hooks, unit preference hook, WMO weather code mapping table, and display formatters.

## Key Files Created/Verified
- `src/api/openMeteo.ts` — fetchWeather() with timezone=auto, all current/hourly/daily fields
- `src/api/nominatim.ts` — reverseGeocode() with city/town/village/county fallback chain
- `src/hooks/useWeather.ts` — TanStack Query wrapper with raw→normalized mapping, unit in queryKey
- `src/hooks/useGeocode.ts` — Debounced (350ms) geocode query, enabled for 2+ chars only
- `src/hooks/useUnitPreference.ts` — localStorage-backed unit toggle with try/catch wrapping
- `src/utils/weatherCodes.ts` — WMO_CONDITIONS mapping table (all codes 0–99), getWeatherCondition()
- `src/utils/formatters.ts` — formatTemperature (integer), formatLocalTime, formatLocalDay, degreesToCardinal

## Must-Have Truths Verified
- ✅ useWeather(lat, lon) returns normalized weather data from Open-Meteo with timezone=auto
- ✅ useGeocode(query) only fires when query.length >= 2 (debounced 350ms)
- ✅ useUnitPreference reads from localStorage key 'weatherUnit', defaults to 'metric'
- ✅ reverseGeocode(lat, lon) calls Nominatim with zoom=10, falls back to coordinates on error
- ✅ getWeatherCondition(code) returns WeatherCondition for all WMO codes 0–99
- ✅ formatTemperature(18.47, 'metric') returns '18°C' (integer display)

## Build Verification
- `npm run build` exits 0 ✓
- All 7 files compile with zero TypeScript errors ✓
- timezone: 'auto' confirmed in openMeteo.ts URLSearchParams ✓
- is_day included in current params (not in daily — avoids 400 error) ✓

## Deviations
- useGeocode uses `useDebounce` (the actual export from use-debounce package) rather than `useDebounceValue` as plan noted
- useWeather hook performs raw API → normalized WeatherData mapping (cleaner than consuming raw response directly in components)

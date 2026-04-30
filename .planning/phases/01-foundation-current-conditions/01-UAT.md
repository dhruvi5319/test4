---
status: testing
phase: 01-foundation-current-conditions
source: 01-01-SUMMARY.md, 01-02-SUMMARY.md, 01-03-SUMMARY.md, 01-04-SUMMARY.md, 01-05-SUMMARY.md
started: 2026-04-30T00:00:00.000Z
updated: 2026-04-30T00:00:00.000Z
---

## Current Test

number: 1
name: Location Search Autocomplete
expected: |
  Open the app. Type 2+ characters (e.g., "lon") into the search input. A dropdown with up to 5 city suggestions appears below the input. Selecting one fills the input with the city name and loads weather data.
awaiting: user response

## Tests

### 1. Location Search Autocomplete
expected: Typing 2+ chars shows dropdown of city suggestions; selecting one loads weather
result: [pending]

### 2. GPS Location Detection
expected: A GPS button is visible. Clicking it prompts for location permission. If granted, weather for current location loads. If denied, an inline error appears and search input remains usable — no blank screen or stuck state.
result: [pending]

### 3. Current Weather Display
expected: After selecting a location, the current temperature is displayed large and prominently. Below it: feels-like temperature, weather condition icon with text label, today's high/low, humidity, wind speed, and precipitation probability. All temperatures are integers (e.g., "18°C" not "18.47°C").
result: [pending]

### 4. Skeleton Loading State
expected: While weather data is fetching, a skeleton loading placeholder is visible. The screen is never blank during loading.
result: [pending]

### 5. Error State on API Failure
expected: If the API call fails (e.g., network error), a clear error card with a retry button is shown. The screen is never blank on error.
result: [pending]

### 6. Unit Toggle (°C/°F)
expected: A °C/°F toggle is always visible on the main screen. Clicking switches all temperatures between Celsius and Fahrenheit. The active unit is visually highlighted.
result: [pending]

### 7. Unit Persistence
expected: After selecting a unit preference and reloading the page, the chosen unit (°C or °F) persists and temperatures display in that unit.
result: [pending]

### 8. App Renders Without Errors
expected: The app loads in the browser with no blank screen, no console errors, and Tailwind CSS styles applied. The layout includes LocationBar, SettingsBar, and CurrentConditions sections.
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0

## Gaps

[none yet]

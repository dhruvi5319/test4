# Phase 1: Foundation + Current Conditions — Research

**Researched:** 2026-04-29  
**Domain:** React SPA scaffold · Open-Meteo API · TanStack Query v5 · Tailwind CSS v4  
**Confidence:** HIGH

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Autocomplete suggestions appear after **2+ characters** typed
- Dropdown style: **simple list below the input** — city name + country code, no extra decoration
- After selection: **show the selected city name in the input, close the dropdown**
- Enter key: **selects the first suggestion automatically**
- `timezone=auto` on every Open-Meteo request (non-negotiable from ROADMAP.md critical pitfalls)
- Geolocation is opt-in button only — never auto-requested on page load
- No blank screens — skeleton + error states built in Phase 1
- Show integers only (e.g., "18°C", never "18.47°C")

### Claude's Discretion
- Debounce timing for the geocode API call (300–500ms is standard)
- Exact dropdown shadow/border styling
- Loading spinner vs skeleton within the dropdown while suggestions fetch
- Keyboard arrow-key navigation within the dropdown list
- Clear/X button to reset the search input

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope

</user_constraints>

---

## Summary

Phase 1 builds the complete app foundation: scaffold, API layer, location search, current weather hero, and unit toggle. All five plans (01-01 through 01-05) have well-understood, well-documented implementation patterns in 2026. This is a mechanical assembly phase with no architectural unknowns — the risk is in correctness details (timezone, geolocation fallback, no blank screens) rather than technology choices.

The stack is fully verified against current npm registry and official documentation (April 2026): Vite 8.0.10, React 19.2.5, TanStack Query 5.100.6, Tailwind CSS 4.2.4, TypeScript 6.0.3. All are current stable releases published within the last 30 days.

**Primary recommendation:** Implement plans in strict order 01-01 → 01-02 → 01-03 → 01-04 → 01-05. The API layer (01-02) must exist before components (01-03, 01-04) consume it. The unit toggle (01-05) must be built last since it threads through all display components.

---

## Standard Stack

### Core (Verified against npm registry 2026-04-29)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | 8.0.10 | Build tool + dev server | HMR, native ESM, `npm create vite@latest` zero-config; published 2026-04-23 |
| react | 19.2.5 | UI framework | Concurrent features, latest stable; TanStack Query integration is idiomatic |
| react-dom | 19.2.5 | DOM renderer | Paired with react |
| typescript | 6.0.3 | Type safety | Catches API shape mismatches at compile time; required by vite react-ts template |
| @tanstack/react-query | 5.100.6 | API caching + loading/error states | `staleTime`, `isLoading`/`isError`, deduplication; published 2026-04-28 |
| tailwindcss | 4.2.4 | Utility-first CSS | v4 Vite plugin integration — no `tailwind.config.js` file needed |
| @tailwindcss/vite | 4.2.4 | Vite plugin for Tailwind v4 | Replaces the PostCSS workflow entirely in v4 |
| @vitejs/plugin-react | 6.0.1 | React Fast Refresh in Vite | Auto-included by `npm create vite@latest -- --template react-ts` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| recharts | 3.8.1 | AreaChart / BarChart | Phase 2 charts — lazy-loaded; don't import in Phase 1 components |
| use-debounce | 10.1.1 | `useDebounceValue` hook | Debouncing the geocode search query (300–500ms); `peerDeps: react: '*'` compat React 19 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `use-debounce` | `useMemo` + `setTimeout` hand-roll | Hand-roll introduces stale closure bugs, `use-debounce` is 1KB and well-tested |
| Open-Meteo Geocoding API | Google Places Autocomplete | Google requires API key + billing; Open-Meteo geocoding needs no key |
| Nominatim reverse geocoding | Open-Meteo has no reverse geocoding | Nominatim is the only free, no-key reverse geocoding option for GPS flow |

### Installation

```bash
# Scaffold (run in parent directory)
npm create vite@latest weather-app -- --template react-ts
cd weather-app

# Runtime dependencies
npm install @tanstack/react-query use-debounce recharts

# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite
```

**Version verification (confirmed 2026-04-29):**
- `vite`: 8.0.10 (published 2026-04-23)
- `react`: 19.2.5
- `@tanstack/react-query`: 5.100.6 (published 2026-04-28)
- `tailwindcss` / `@tailwindcss/vite`: 4.2.4
- `typescript`: 6.0.3
- `@vitejs/plugin-react`: 6.0.1
- `recharts`: 3.8.1
- `use-debounce`: 10.1.1

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── api/
│   ├── openMeteo.ts        # fetchWeather() function
│   └── nominatim.ts        # reverseGeocode() function
├── hooks/
│   ├── useWeather.ts        # TanStack Query wrapper for weather fetch
│   ├── useGeocode.ts        # TanStack Query wrapper for geocoding
│   └── useUnitPreference.ts # localStorage read/write for °C/°F
├── components/
│   ├── LocationBar.tsx      # Search input + GPS button + dropdown
│   ├── CurrentConditions.tsx # Hero weather display
│   ├── CurrentConditionsSkeleton.tsx
│   └── WeatherErrorCard.tsx
├── utils/
│   ├── weatherCodes.ts      # WMO code → label + icon + background
│   ├── formatters.ts        # Intl.DateTimeFormat helpers
│   └── wind.ts              # Wind direction degrees → cardinal
├── types/
│   ├── location.ts          # Location, RecentLocation interfaces
│   ├── weather.ts           # CurrentWeather, WeatherData, etc.
│   └── openMeteoRaw.ts      # OpenMeteoResponse, GeocodingResult raw shapes
├── App.tsx                  # QueryClientProvider root
├── AppShell.tsx             # Layout + active location state
└── main.tsx                 # ReactDOM.createRoot entry point
```

### Pattern 1: Tailwind CSS v4 Setup (New in v4 — Different from v3)

**What:** v4 uses a Vite plugin instead of PostCSS. No `tailwind.config.js`, no `postcss.config.js`. Config is CSS-first.

**Source:** Official Tailwind CSS docs (https://tailwindcss.com/docs/installation) — confirmed 2026-04-29

**vite.config.ts:**
```typescript
// Source: https://tailwindcss.com/docs/installation (v4.2.4 official docs)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**src/index.css (replaces tailwind.config.js directives in v4):**
```css
/* Source: https://tailwindcss.com/docs/installation */
@import "tailwindcss";
```

**Key v4 difference:** In v3, you added `@tailwind base; @tailwind components; @tailwind utilities;`. In v4, the single `@import "tailwindcss";` replaces all three. Custom theme overrides use `@theme { }` blocks in CSS, not `theme.extend` in JS config.

### Pattern 2: TanStack Query v5 Setup

**What:** QueryClient initialization with global defaults; wrap root in QueryClientProvider.

**Source:** Official TanStack Query v5 docs (https://tanstack.com/query/latest/docs/framework/react/quick-start) — confirmed 2026-04-29

**⚠️ Breaking change from v4:** In v5, `isLoading` is `isPending && isFetching`. For disabled/lazy queries (like `useGeocode` when input < 2 chars), use `isLoading` (derived), NOT `isPending`, because `isPending` is true for disabled queries that have never run.

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,    // 10 minutes — weather data freshness window
      gcTime: 30 * 60 * 1000,       // 30 minutes — keep in cache after unmount
      retry: 2,
      networkMode: 'offlineFirst',   // show cached data while offline
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
```

### Pattern 3: useWeather Hook

**What:** Wraps Open-Meteo Forecast API with TanStack Query. Unit is included in `queryKey` so changing °C/°F busts the cache and triggers a new fetch.

```typescript
// src/hooks/useWeather.ts
// Source: TECH-ARCH.md + TanStack Query v5 official docs
import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../api/openMeteo';
import { useUnitPreference } from './useUnitPreference';

export function useWeather(lat: number | null, lon: number | null) {
  const { unit } = useUnitPreference();

  return useQuery({
    queryKey: ['weather', lat, lon, unit],      // unit in key → re-fetch on unit change
    queryFn: () => fetchWeather(lat!, lon!, unit),
    enabled: lat !== null && lon !== null,       // only fetch when location selected
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
```

### Pattern 4: useGeocode Hook with Debounce

**What:** Debounced geocoding search using `use-debounce` + TanStack Query. The `enabled` guard enforces the 2+ character minimum.

**Source:** TanStack Query v5 docs (lazy queries pattern) + `use-debounce` package

```typescript
// src/hooks/useGeocode.ts
import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'use-debounce';

async function fetchGeocode(query: string): Promise<GeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  });
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  );
  if (!res.ok) throw new Error(`Geocoding error: ${res.status}`);
  const data = await res.json();
  return data.results ?? [];
}

export function useGeocode(query: string) {
  const [debouncedQuery] = useDebounceValue(query, 350); // 350ms — within 300–500ms discretion range

  return useQuery({
    queryKey: ['geocode', debouncedQuery],
    queryFn: () => fetchGeocode(debouncedQuery),
    enabled: debouncedQuery.length >= 2,        // locked decision: 2+ characters
    staleTime: 5 * 60 * 1000,                   // geocode results cached 5 min
    gcTime: 15 * 60 * 1000,
  });
}
```

**Why `useDebounceValue` over `useDebounce`:** `useDebounceValue` returns `[debouncedValue, setValue]` — it debounces a value directly, so the `queryKey` only changes after the debounce fires, preventing intermediate fetches. `useDebounce` debounces a function callback.

### Pattern 5: Open-Meteo API Full Request

**What:** All Phase 1 current conditions fields plus Phase 2 hourly/daily fields requested in a single call. Requesting everything upfront avoids a second API call when Phase 2 components mount.

**Source:** Official Open-Meteo API docs (https://open-meteo.com/en/docs) — confirmed 2026-04-29

```typescript
// src/api/openMeteo.ts
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: 'metric' | 'imperial'
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',                      // ← direct API flag; no need to compute from sunrise/sunset for current
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'is_day',                      // ← needed for Phase 2 day/night icon variants
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',                // NON-NEGOTIABLE — see Critical Pitfalls
    forecast_days: '7',
    ...(unit === 'imperial' && {
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
    }),
  });

  const res = await fetch(`${FORECAST_BASE}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}
```

**Important discovery:** The Open-Meteo API returns an `is_day` field (0 or 1) in both `current` and `hourly` data. Using `is_day` directly is simpler and more reliable than computing day/night from sunrise/sunset times — removes the need to parse and compare ISO-8601 time strings for the current condition.

### Pattern 6: useUnitPreference Hook

```typescript
// src/hooks/useUnitPreference.ts
import { useState, useEffect } from 'react';

type UnitSystem = 'metric' | 'imperial';
const STORAGE_KEY = 'weatherUnit';
const VALID_UNITS: UnitSystem[] = ['metric', 'imperial'];

function readStoredUnit(): UnitSystem {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_UNITS.includes(stored as UnitSystem)) {
      return stored as UnitSystem;
    }
  } catch {
    // localStorage unavailable (private browsing)
  }
  return 'metric'; // default per FRD-04
}

export function useUnitPreference() {
  const [unit, setUnitState] = useState<UnitSystem>(readStoredUnit);

  const setUnit = (newUnit: UnitSystem) => {
    setUnitState(newUnit);
    try {
      localStorage.setItem(STORAGE_KEY, newUnit);
    } catch {
      // localStorage unavailable — toggle works in-session only (per FRD-04)
    }
  };

  return { unit, setUnit };
}
```

### Pattern 7: Component Loading/Error Pattern

**Source:** TanStack Query v5 official docs — confirmed 2026-04-29

```typescript
// Standard pattern used in ALL data-consuming components
function CurrentConditions({ lat, lon }: { lat: number; lon: number }) {
  const { data, isLoading, isError, refetch } = useWeather(lat, lon);

  // isLoading = isPending && isFetching (v5 derived flag)
  // Safe to use for both initial load and lazy/disabled query states
  if (isLoading) return <CurrentConditionsSkeleton />;
  if (isError)   return <WeatherErrorCard onRetry={() => refetch()} />;
  return <CurrentConditionsDisplay data={data!} />;
}
```

### Pattern 8: Nominatim Reverse Geocode (GPS Flow)

**Source:** Official Nominatim API docs (https://nominatim.org/release-docs/develop/api/Reverse/) — confirmed 2026-04-29

```typescript
// src/api/nominatim.ts
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
    zoom: '10',         // zoom=10 → city-level result (per Nominatim zoom table)
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data = await res.json();
  // Fallback chain per TECH-ARCH.md
  return (
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.county ??
    `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`    // last resort: show coordinates
  );
}
```

**Nominatim usage policy note:** Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/) requires a valid `User-Agent` or `Referer` header for automated/bulk requests. The GPS button is user-triggered (one request per user action, not bulk), so this is acceptable. No API key required. Add app name in User-Agent for good citizenship.

### Anti-Patterns to Avoid

- **`useEffect` + `useState` for API calls:** Creates race conditions, double-fetches in StrictMode, no deduplication. Use `useQuery` for ALL API data.
- **`tailwind.config.js` in v4:** There is no JS config file in Tailwind v4. Theme customization uses `@theme {}` blocks in CSS. Any tutorial using `tailwind.config.js` is showing v3 instructions.
- **`@tailwind base/components/utilities` directives in v4:** These v3 directives are replaced by a single `@import "tailwindcss";` in v4.
- **Browser timezone for weather display:** `new Date().toLocaleTimeString()` uses the browser's local timezone, not the weather location's timezone. Always use `Intl.DateTimeFormat` with the `timeZone` field from the API response.
- **Omitting `timezone=auto`:** Without it, Open-Meteo returns UTC timestamps. All hourly times, sunrise, sunset, and daily boundaries will be wrong. Non-negotiable from day 1.
- **Auto-requesting geolocation on page load:** Browsers suppress automatic permission prompts on many sites. Users deny geolocation when they don't understand why it's being requested. GPS is always opt-in via button click only.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Debounced input | Custom `useEffect` + `useRef` + `clearTimeout` | `useDebounceValue` from `use-debounce` | Stale closure bugs, SSR edge cases; `use-debounce` handles all of them |
| API caching + loading states | `useState` + `useEffect` + manual cache Map | TanStack Query `useQuery` | Race conditions, StrictMode double-invoke, no deduplication; TanStack Query solves all |
| Temperature unit conversion | Custom conversion module | Inline `Math.round(c * 9/5 + 32)` + Open-Meteo's `temperature_unit=fahrenheit` param | Open-Meteo converts server-side when param is set; client-side conversion only needed for display-only toggles |
| WMO code → condition name | Scraping Wikipedia WMO tables | Pre-built mapping table (see Code Examples) | The WMO table is small (< 20 codes to handle), static, and well-defined; a lookup object is the correct pattern |
| Geocoding | Building a city name database | Open-Meteo Geocoding API | It's free, accurate, global, and no key required |
| Reverse geocoding | IP-based location | Nominatim + Browser Geolocation API | IP geolocation is inaccurate (city-level at best); browser GPS is precise |

**Key insight:** Every "build it yourself" impulse in Phase 1 has a free, no-key, well-tested alternative. The only custom code needed is glue (hooks, type converters, component layout).

---

## Common Pitfalls

### Pitfall 1: Omitting `timezone=auto` on Open-Meteo Requests
**What goes wrong:** Open-Meteo returns UTC timestamps by default. Hourly forecasts show times 0–23 in UTC, not in the location's local time. Sunrise/sunset times are wrong. Daily forecast day boundaries are wrong for locations with UTC offsets.
**Why it happens:** Developers forget to add the parameter, or see the API response looks "normal" for their own local timezone (which happens to be UTC+0).
**How to avoid:** Add `timezone: 'auto'` to `URLSearchParams` in `fetchWeather()`. Write a test that checks for London at 11pm local time — without `timezone=auto` the API will show 23:00 as next day.
**Warning signs:** Sunrise time says "00:32" for a European city; today's hourly forecast starts at midnight UTC (12am or some non-local hour).

### Pitfall 2: Using `isPending` for Lazy/Disabled Queries (TanStack Query v5)
**What goes wrong:** `useGeocode(query)` with `enabled: query.length >= 2` — when the input has 0–1 characters, the query is disabled. In TanStack Query v5, disabled queries have `status === 'pending'`, so `isPending` is `true` even though no fetch is happening. Rendering a loading spinner on `isPending` will show a spinner on empty input.
**Why it happens:** v5 changed the semantics of `isLoading` — it's now `isPending && isFetching`, a derived flag that is false for disabled queries.
**How to avoid:** Use `isLoading` (not `isPending`) as the loading indicator for ALL queries in this app.
**Warning signs:** Loading spinner appears on fresh page load before user types anything.

### Pitfall 3: Geolocation Denial with No Fallback
**What goes wrong:** The GPS button calls `navigator.geolocation.getCurrentPosition` with only a success callback. On denial, nothing happens — the UI is stuck, no error shown, no fallback to search.
**Why it happens:** The error callback is omitted or the error cases aren't mapped to user-facing messages.
**How to avoid:** Always provide both success AND error callbacks. Map all three error codes: `PERMISSION_DENIED` (1), `POSITION_UNAVAILABLE` (2), `TIMEOUT` (3). Show inline message under the GPS button, keep search input active.
**Warning signs:** Clicking GPS button and denying permission leaves the button in a loading state forever.

### Pitfall 4: `localStorage` Crashing in Private Browsing
**What goes wrong:** `localStorage.getItem/setItem` throws a `SecurityError` in some browsers in private/incognito mode. Without a try/catch, the entire app crashes when reading the unit preference.
**Why it happens:** Browsers differ in how they handle `localStorage` in private mode — some allow it, some throw.
**How to avoid:** Always wrap `localStorage` access in try/catch. Default to `'metric'` on any error. The unit toggle still works in-session even if persistence fails.
**Warning signs:** "SecurityError: localStorage access denied" in console; app crashes on page load in private browsing.

### Pitfall 5: Geocoding API — 1-Character Query Returns No Results by Design
**What goes wrong:** User types a single character, no results appear, user thinks the API is broken.
**Why it happens:** The Open-Meteo Geocoding API **by design** returns empty results for 1-character queries. This is documented behavior: "An empty string or only 1 character will return an empty result."
**How to avoid:** The `enabled: debouncedQuery.length >= 2` guard in `useGeocode` prevents the fetch entirely for 0–1 character inputs. This matches the locked decision (autocomplete after 2+ chars) and aligns with the API's own design.
**Warning signs:** Fetch fires with `name=L` and returns `{results: []}` — this means the `enabled` guard is missing or the debounce isn't applied to the query key.

### Pitfall 6: Missing `count` Param in Geocoding Request Returns 10 Results
**What goes wrong:** The Open-Meteo Geocoding API defaults to `count=10`. Without setting `count=5`, the dropdown shows 10 results.
**How to avoid:** Always include `count: '5'` in the geocoding params (per FRD-01).

### Pitfall 7: `visibility` Field Mismatch Between Phases
**What goes wrong:** The TECH-ARCH.md specifies `visibility` in the `daily` request params, but Open-Meteo's `visibility` variable is an **hourly** variable (instantaneous value in meters), not a daily aggregate. Requesting `visibility` in the `daily` params will return a 400 error.
**How to avoid:** 
  - For Phase 1 (current conditions): `visibility` is a `current` variable — add it to the `current=` param list if needed.
  - For Phase 3 (details panel): use `current=visibility` (instantaneous), not `daily=visibility`.
  - The daily available variants are `mean_visibility`, `maximum_visibility`, `minimum_visibility`.
**Source:** Open-Meteo API docs — the variable table shows `visibility` listed under hourly/current, not daily aggregations.

### Pitfall 8: Tailwind v4 — No `tailwind.config.js`, No PostCSS Config
**What goes wrong:** Developer copies a v3 tutorial and creates `tailwind.config.js` and `postcss.config.js`. These files are ignored by v4's Vite plugin, and custom theme values don't work.
**How to avoid:** Use only `@import "tailwindcss";` in `src/index.css`. Theme customization goes in `@theme {}` blocks in CSS, not JS. The `@tailwindcss/vite` plugin handles everything via `vite.config.ts`.
**Warning signs:** `tailwind.config.js` exists but custom colors don't apply in the browser.

---

## Code Examples

### Complete WMO Weather Code Mapping Table

```typescript
// src/utils/weatherCodes.ts
// Source: https://open-meteo.com/en/docs#weathervariables (verified 2026-04-29)

export interface WeatherCondition {
  label: string;
  iconDay: string;       // used as icon identifier / filename key
  iconNight: string;
  description: string;   // accessible text for aria-label
}

export const WMO_CONDITIONS: Record<number, WeatherCondition> = {
  // Clear
  0:  { label: 'Clear sky',            iconDay: 'sun',            iconNight: 'moon',           description: 'Clear sky' },
  // Mainly clear / partly cloudy / overcast
  1:  { label: 'Mainly clear',         iconDay: 'sun-cloud',      iconNight: 'moon-cloud',     description: 'Mainly clear' },
  2:  { label: 'Partly cloudy',        iconDay: 'cloud-sun',      iconNight: 'cloud-moon',     description: 'Partly cloudy' },
  3:  { label: 'Overcast',             iconDay: 'cloud',          iconNight: 'cloud',          description: 'Overcast' },
  // Fog
  45: { label: 'Fog',                  iconDay: 'fog',            iconNight: 'fog',            description: 'Foggy' },
  48: { label: 'Icy fog',              iconDay: 'fog',            iconNight: 'fog',            description: 'Depositing rime fog' },
  // Drizzle
  51: { label: 'Light drizzle',        iconDay: 'drizzle',        iconNight: 'drizzle',        description: 'Light drizzle' },
  53: { label: 'Moderate drizzle',     iconDay: 'drizzle',        iconNight: 'drizzle',        description: 'Moderate drizzle' },
  55: { label: 'Heavy drizzle',        iconDay: 'drizzle',        iconNight: 'drizzle',        description: 'Dense drizzle' },
  // Freezing drizzle
  56: { label: 'Light freezing drizzle', iconDay: 'sleet',        iconNight: 'sleet',          description: 'Light freezing drizzle' },
  57: { label: 'Heavy freezing drizzle', iconDay: 'sleet',        iconNight: 'sleet',          description: 'Heavy freezing drizzle' },
  // Rain
  61: { label: 'Light rain',           iconDay: 'rain',           iconNight: 'rain',           description: 'Slight rain' },
  63: { label: 'Moderate rain',        iconDay: 'rain',           iconNight: 'rain',           description: 'Moderate rain' },
  65: { label: 'Heavy rain',           iconDay: 'rain-heavy',     iconNight: 'rain-heavy',     description: 'Heavy rain' },
  // Freezing rain
  66: { label: 'Light freezing rain',  iconDay: 'sleet',          iconNight: 'sleet',          description: 'Light freezing rain' },
  67: { label: 'Heavy freezing rain',  iconDay: 'sleet',          iconNight: 'sleet',          description: 'Heavy freezing rain' },
  // Snow
  71: { label: 'Light snow',           iconDay: 'snow',           iconNight: 'snow',           description: 'Slight snowfall' },
  73: { label: 'Moderate snow',        iconDay: 'snow',           iconNight: 'snow',           description: 'Moderate snowfall' },
  75: { label: 'Heavy snow',           iconDay: 'snow-heavy',     iconNight: 'snow-heavy',     description: 'Heavy snowfall' },
  77: { label: 'Snow grains',          iconDay: 'snow-grains',    iconNight: 'snow-grains',    description: 'Snow grains' },
  // Rain showers
  80: { label: 'Light showers',        iconDay: 'showers',        iconNight: 'showers',        description: 'Slight rain showers' },
  81: { label: 'Moderate showers',     iconDay: 'showers',        iconNight: 'showers',        description: 'Moderate rain showers' },
  82: { label: 'Violent showers',      iconDay: 'showers-heavy',  iconNight: 'showers-heavy',  description: 'Violent rain showers' },
  // Snow showers
  85: { label: 'Light snow showers',   iconDay: 'snow-showers',   iconNight: 'snow-showers',   description: 'Slight snow showers' },
  86: { label: 'Heavy snow showers',   iconDay: 'snow-showers',   iconNight: 'snow-showers',   description: 'Heavy snow showers' },
  // Thunderstorm
  95: { label: 'Thunderstorm',         iconDay: 'thunderstorm',   iconNight: 'thunderstorm',   description: 'Thunderstorm' },
  96: { label: 'Thunderstorm w/ hail', iconDay: 'thunderstorm',   iconNight: 'thunderstorm',   description: 'Thunderstorm with slight hail' },
  99: { label: 'Thunderstorm w/ hail', iconDay: 'thunderstorm',   iconNight: 'thunderstorm',   description: 'Thunderstorm with heavy hail' },
};

// Safe lookup with fallback for unknown codes
export function getWeatherCondition(code: number): WeatherCondition {
  return WMO_CONDITIONS[code] ?? {
    label: 'Unknown',
    iconDay: 'cloud',
    iconNight: 'cloud',
    description: 'Unknown weather condition',
  };
}
```

### Timezone-Aware Time Formatting

```typescript
// src/utils/formatters.ts
// Source: MDN Intl.DateTimeFormat (standard Web API, no library needed)

export function formatTemperature(value: number, unit: 'metric' | 'imperial'): string {
  return `${Math.round(value)}°${unit === 'metric' ? 'C' : 'F'}`;
}

// timezone comes from Open-Meteo response.timezone (e.g., "America/New_York")
export function formatLocalTime(
  isoString: string,
  timezone: string,
  options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' }
): string {
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: timezone }).format(
    new Date(isoString)
  );
}

export function formatLocalDay(
  isoDateString: string,  // "YYYY-MM-DD" from Open-Meteo daily
  timezone: string,
  index: number           // 0 = Today, 1 = Tomorrow, 2+ = weekday name
): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  }).format(new Date(`${isoDateString}T12:00:00`)); // noon to avoid DST edge cases
}
```

### GPS Geolocation with Full Error Handling

```typescript
// LocationBar.tsx — GPS button handler
function handleGpsClick() {
  if (!navigator.geolocation) {
    setGpsError('Geolocation is not supported by your browser');
    return;
  }
  setIsGeolocating(true);
  setGpsError(null);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const name = await reverseGeocode(latitude, longitude);
        onLocationSelect({ lat: latitude, lon: longitude, name });
      } catch {
        setGpsError('Unable to determine your city name — try searching instead');
      } finally {
        setIsGeolocating(false);
      }
    },
    (error) => {
      setIsGeolocating(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setGpsError('Location access denied — search for a city above');
          break;
        case error.POSITION_UNAVAILABLE:
          setGpsError('Unable to detect location — search for a city above');
          break;
        case error.TIMEOUT:
          setGpsError('Location timed out — search for a city above');
          break;
        default:
          setGpsError('Location error — search for a city above');
      }
    },
    { timeout: 10000, maximumAge: 300000 }
  );
}
```

### LocationBar State and Dropdown Behavior

```typescript
// src/components/LocationBar.tsx — key state + behavior

// Locked decisions implemented:
// - Dropdown after 2+ chars (enforced by useGeocode's enabled guard)
// - City name shows in input after selection
// - Dropdown closes after selection
// - Enter key selects first suggestion

const [inputValue, setInputValue] = useState('');
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const { data: suggestions = [], isLoading: isFetchingSuggestions } = useGeocode(inputValue);

const handleSelect = (result: GeocodingResult) => {
  setInputValue(result.name);           // show selected city name in input
  setIsDropdownOpen(false);             // close dropdown
  onLocationSelect({                    // bubble up to AppShell
    lat: result.latitude,
    lon: result.longitude,
    name: `${result.name}, ${result.country_code}`,
    country: result.country_code,
    admin1: result.admin1,
  });
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && suggestions.length > 0) {
    handleSelect(suggestions[0]);       // Enter = select first suggestion (locked decision)
  }
  if (e.key === 'Escape') {
    setIsDropdownOpen(false);
  }
};

// Show dropdown when we have results or are loading (and input has 2+ chars)
useEffect(() => {
  setIsDropdownOpen(inputValue.length >= 2 && (suggestions.length > 0 || isFetchingSuggestions));
}, [inputValue, suggestions, isFetchingSuggestions]);
```

### Skeleton Loading Component Pattern

```typescript
// src/components/CurrentConditionsSkeleton.tsx
// Tailwind v4 — uses animate-pulse from built-in utilities

export function CurrentConditionsSkeleton() {
  return (
    <div className="animate-pulse p-6 space-y-4" aria-label="Loading weather data">
      {/* Temperature placeholder */}
      <div className="h-16 w-32 bg-white/30 rounded-lg" />
      {/* Feels-like placeholder */}
      <div className="h-5 w-40 bg-white/30 rounded" />
      {/* Condition placeholder */}
      <div className="flex gap-3">
        <div className="h-10 w-10 bg-white/30 rounded-full" />
        <div className="h-10 w-28 bg-white/30 rounded" />
      </div>
      {/* High/Low placeholder */}
      <div className="h-5 w-24 bg-white/30 rounded" />
      {/* Metrics row placeholder */}
      <div className="flex gap-6">
        <div className="h-5 w-20 bg-white/30 rounded" />
        <div className="h-5 w-20 bg-white/30 rounded" />
        <div className="h-5 w-20 bg-white/30 rounded" />
      </div>
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind `tailwind.config.js` + PostCSS | `@tailwindcss/vite` plugin + `@import "tailwindcss"` in CSS | Tailwind v4.0 (late 2024) | Simpler setup, faster builds — but all v3 tutorials are misleading |
| TanStack Query `isLoading` = "no data yet" | `isPending && isFetching` (derived `isLoading`) | TanStack Query v5 | `isPending` alone is true for disabled queries — must use `isLoading` for UI guards |
| Open-Meteo 14-day max forecast | Open-Meteo 16-day max forecast | ~2025 API update | `forecast_days` max is now 16 (was 14); 7 days is the default |
| Vite `create-react-app` | `npm create vite@latest -- --template react-ts` | Vite became de-facto standard ~2023 | CRA is unmaintained; Vite is the current standard |
| Computing `is_day` from sunrise/sunset comparison | Use `is_day` field directly from Open-Meteo response | Always available, just underused | Simpler, more reliable — API does the comparison for us |

**Deprecated/outdated:**
- `create-react-app`: Unmaintained since 2023; use `npm create vite@latest`
- `tailwind.config.js` + `postcss.config.js` with Vite: v3 pattern; v4 uses Vite plugin
- `@tailwind base; @tailwind components; @tailwind utilities;` CSS directives: v3 only; v4 uses `@import "tailwindcss"`
- `isLoading` ≠ `isPending` in TanStack Query v5: TanStack Query v4 used these differently

---

## Open Questions

1. **Icon asset strategy**
   - What we know: The WMO condition codes map to string identifiers (e.g., `'sun'`, `'rain-heavy'`). Components will reference icons via these identifiers.
   - What's unclear: The planner needs to decide whether Phase 1 uses (a) emoji as placeholder icons, (b) inline SVG components, (c) an icon font like Lucide React, or (d) imported SVG files.
   - Recommendation: Lucide React (`npm view lucide-react version` → current) has `Sun`, `Cloud`, `CloudRain`, `Snowflake`, `Wind`, `CloudLightning` icons that cover all WMO groups. Using Lucide for Phase 1 avoids a refactor in later phases. Claude's discretion on final icon solution.

2. **Geocoding result disambiguation display**
   - What we know: Open-Meteo returns `admin1` (state/province) alongside city name and country code.
   - What's unclear: Should the dropdown show "Springfield, US" or "Springfield, IL, US" to help users distinguish multiple "Springfield" entries?
   - Recommendation: Show `{name}, {admin1 ? admin1 + ', ' : ''}{country_code}` when `admin1` is available. Adds minimal complexity while resolving the Springfield problem.

3. **Icon night variant for `weather_code` groups 44–99 (precipitation)**
   - What we know: The `is_day` field from Open-Meteo gives us the 0/1 flag directly. The WMO conditions table has `iconDay`/`iconNight` for each code.
   - What's unclear: For most precipitation codes (rain, snow, thunderstorm), day and night icons are visually identical in most icon sets. The distinction matters most for codes 0–3 (clear/partly cloudy).
   - Recommendation: Implement the `is_day` check throughout but in Phase 1 it's most visible impact is on code 0 (sun vs moon). Non-blocking.

---

## Sources

### Primary (HIGH confidence — official docs verified 2026-04-29)

- **Open-Meteo Forecast API** — https://open-meteo.com/en/docs
  - Full parameter table (current, hourly, daily variables)
  - `is_day` variable in current and hourly
  - WMO weather code table (all codes 0–99)
  - `timezone=auto` parameter behavior
  - Rate limits: 10,000/day, 600/minute non-commercial

- **Open-Meteo Geocoding API** — https://open-meteo.com/en/docs/geocoding-api
  - 1-char query returns empty by design
  - 2-char exact match; 3+ fuzzy matching
  - Full response JSON shape with `admin1`, `country_code`
  - `count` param default is 10 (need to set `count=5`)

- **Tailwind CSS v4.2.4** — https://tailwindcss.com/docs/installation
  - Vite plugin setup: `@tailwindcss/vite` + `@import "tailwindcss"` in CSS
  - No `tailwind.config.js` in v4
  - Version confirmed: 4.2.4 current

- **TanStack Query v5.100.6** — https://tanstack.com/query/latest/docs/framework/react/
  - Quick start, queries guide, disabling queries guide
  - `isLoading` = `isPending && isFetching` (v5 derived flag)
  - `enabled: false` for lazy queries
  - `skipToken` for TypeScript-safe disabled queries

- **Nominatim Reverse Geocode API** — https://nominatim.org/release-docs/develop/api/Reverse/
  - `zoom=10` for city-level results
  - Response structure: `address.city`, `.town`, `.village`, `.county`
  - Usage policy: valid User-Agent required for bulk use; single user-triggered requests acceptable

- **npm registry** — versions verified with `npm view [package] version` 2026-04-29

### Secondary (MEDIUM confidence)

- `use-debounce` 10.1.1 — `peerDependencies: { react: '*' }` confirming React 19 compat; `useDebounceValue` API
- MDN Geolocation API — error code constants (PERMISSION_DENIED=1, POSITION_UNAVAILABLE=2, TIMEOUT=3)

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — all versions verified against npm registry 2026-04-29
- Architecture: HIGH — all patterns from official docs + TECH-ARCH.md (itself HIGH confidence)
- Open-Meteo API params: HIGH — verified against live official docs 2026-04-29
- WMO code table: HIGH — extracted directly from Open-Meteo docs
- Tailwind v4 setup: HIGH — verified against official tailwindcss.com docs
- TanStack Query v5 patterns: HIGH — verified against official tanstack.com docs
- Pitfalls: HIGH — pitfalls 1-6 are directly observable from docs; pitfall 7 (visibility field) is a specific discovery from Open-Meteo variable tables

**Research date:** 2026-04-29  
**Valid until:** 2026-05-29 (stable libraries; re-verify package versions before implementation)

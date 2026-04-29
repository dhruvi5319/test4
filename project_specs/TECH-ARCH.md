# Technical Architecture: Simple Weather App

**Version:** 1.0  
**Date:** 2026-04-29  
**Project:** Simple Weather App  
**Architecture Type:** Frontend-Only Single-Page Application (SPA)  
**Confidence:** HIGH — all stack decisions verified against official documentation (2026-04-28)

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Technology Stack](#2-technology-stack)
3. [Component Architecture](#3-component-architecture)
4. [Data Flow](#4-data-flow)
5. [State Management](#5-state-management)
6. [API Integration Patterns](#6-api-integration-patterns)
7. [Data Models & TypeScript Interfaces](#7-data-models--typescript-interfaces)
8. [Error Handling Strategy](#8-error-handling-strategy)
9. [Performance Architecture](#9-performance-architecture)
10. [Security Architecture](#10-security-architecture)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Accessibility Architecture](#12-accessibility-architecture)
13. [Key Architectural Decisions](#13-key-architectural-decisions)

---

## 1. Architectural Overview

### Architecture Pattern

The Simple Weather App is a **frontend-only Single-Page Application (SPA)**. There is no custom backend server, no database, and no server-side rendering at any phase. All application state lives in one of three locations: TanStack Query's in-memory cache (API response data), browser `localStorage` (user preferences and recent locations), or React component local state (transient UI state like search input value).

The application makes direct browser-to-API calls to two external services: the **Open-Meteo API** for weather data and geocoding, and **Nominatim (OpenStreetMap)** for reverse geocoding when GPS coordinates need to be resolved to a city name. No custom API proxy or backend-for-frontend is required, as Open-Meteo requires no authentication key.

### System Context Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 React SPA (Vite build)                    │   │
│  │                                                           │   │
│  │  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐  │   │
│  │  │ LocationBar  │   │TanStack Query│   │ localStorage │  │   │
│  │  │  (search +  │   │    Cache     │   │  (prefs +    │  │   │
│  │  │   GPS btn)  │   │ (weather +   │   │   recent     │  │   │
│  │  └──────┬──────┘   │  geocode)   │   │  locations)  │  │   │
│  │         │           └──────┬───────┘   └──────────────┘  │   │
│  │         │                  │                               │   │
│  │  ┌──────▼──────────────────▼─────────────────────────┐   │   │
│  │  │              UI Components                         │   │   │
│  │  │  CurrentConditions │ HourlyForecast │ DailyForecast│   │   │
│  │  │  WeatherDetails    │ SettingsBar    │ Recharts     │   │   │
│  │  └───────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│              │ fetch()              │ fetch()                    │
└──────────────┼──────────────────────┼────────────────────────────┘
               │                      │
               ▼                      ▼
  ┌────────────────────┐   ┌──────────────────────────┐
  │   Open-Meteo API   │   │  Nominatim API           │
  │                    │   │  (OpenStreetMap)         │
  │  • Forecast API    │   │                          │
  │  • Geocoding API   │   │  • Reverse geocoding     │
  │  (no key required) │   │  (lat/lon → city name)   │
  │  CC BY 4.0         │   │  (no key required)       │
  └────────────────────┘   └──────────────────────────┘
```

### Deployment Topology

```
┌──────────────────────────────────────────────────────┐
│                    GitHub Repository                  │
│  main branch push → triggers Vercel auto-deploy       │
└──────────────────────┬───────────────────────────────┘
                       │ git push
                       ▼
┌──────────────────────────────────────────────────────┐
│                   Vercel Platform                     │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │  Build Pipeline                              │    │
│  │  npm run build → vite build → dist/ folder   │    │
│  └──────────────────────────────────────────────┘    │
│                       │                               │
│  ┌────────────────────▼─────────────────────────┐    │
│  │  Static Asset CDN (Global Edge Network)      │    │
│  │  index.html + *.js + *.css chunks            │    │
│  │  HTTPS enforced (required for Geolocation)   │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose | Rationale |
|-------|-----------|---------|---------|-----------|
| Framework | React | 19.x | UI component model | Largest ecosystem for data-fetching + charting libraries |
| Language | TypeScript | 5.x | Type safety | Catches API shape mismatches at compile time |
| Build Tool | Vite | 8.x | Dev server + production bundler | HMR, native ESM, Rolldown-based builds; zero-config Vercel deploy |
| Styling | Tailwind CSS | v4.x | Utility-first CSS | Vite plugin integration; responsive layout without CSS file management |
| Data Fetching | TanStack Query | v5.x | API caching + state | `staleTime` prevents redundant API calls; `isLoading`/`isError` for UI states |
| HTTP Client | Native `fetch()` | browser built-in | API requests | No extra dependency needed for simple GET requests |
| Charting | Recharts | 2.x | Temperature + precip charts | React-native; `AreaChart` + `BarChart`; tree-shakeable; `ResponsiveContainer` built-in |
| Weather API | Open-Meteo | REST | Weather data | No API key required; 14-day forecast; `timezone=auto`; CC BY 4.0 |
| Geocoding | Open-Meteo Geocoding API | REST | City name → lat/lon | Same API, no key; returns multiple results for autocomplete |
| Reverse Geocoding | Nominatim (OpenStreetMap) | REST | lat/lon → city name | No key required; used only for GPS flow |
| Geolocation | Browser Geolocation API | Web API | GPS coordinates | Native browser API; Baseline Widely Available since 2015 |
| Persistence | `localStorage` | Web API | User preferences + recent locations | No backend required; survives page reload |
| Deployment | Vercel | — | Static hosting + CDN | Zero-config Vite detection; HTTPS by default; auto-deploy from GitHub |

### Package Installation Reference

```bash
# Scaffold
npm create vite@latest weather-app -- --template react-ts
cd weather-app

# Runtime dependencies
npm install @tanstack/react-query recharts

# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite
```

### Vite Configuration

```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

## 3. Component Architecture

### Component Tree

```
App
├── QueryClientProvider          (TanStack Query root — wraps entire tree)
│   └── AppShell
│       ├── SettingsBar          (°C/°F toggle + "Updated N ago" indicator)
│       ├── LocationBar          (city search autocomplete + GPS button + recent chips)
│       └── WeatherDashboard     (renders only when a location is selected)
│           ├── CurrentConditions  (hero: temp, feels-like, condition, high/low, precip%, humidity, wind)
│           ├── HourlyForecast     (horizontal scroll row: next 24h cards)
│           ├── DailyForecast      (vertical list: 7-day + Recharts AreaChart temp trend)
│           └── WeatherDetails     (collapsible: UV, wind direction, visibility, sunrise/sunset)
```

### Component Responsibilities

#### `App`
The root component. Initializes `QueryClient` with global defaults (`staleTime`, `gcTime`). Renders `AppShell`. Holds no weather-specific state.

#### `AppShell`
Top-level layout container. Manages the active `location` state (selected `{ lat, lon, name }` object). Passes location down to `WeatherDashboard`. Renders the condition-aware background gradient class based on weather code + time of day (Phase 3).

#### `SettingsBar`
- Renders the `°C / °F` toggle button
- Reads/writes unit preference to `localStorage` via a `useUnitPreference` hook
- Displays the `lastUpdatedAt` timestamp from TanStack Query metadata as "Updated N min ago"
- No API calls

#### `LocationBar`
- Primary search `<input>` — always visible, never gated on geolocation
- Calls `useGeocode(query)` hook for autocomplete suggestions (debounced, fires after 2+ characters)
- Renders dropdown list of geocoding results
- GPS opt-in `<button>` — calls `navigator.geolocation.getCurrentPosition` only on user click
  - On success: calls Nominatim reverse geocoding to resolve `lat/lon → city name`
  - On denial/error: shows inline error message; search input remains fully usable
- Reads/writes recent locations array to `localStorage`
- Emits selected `{ lat, lon, name }` up to `AppShell` via callback prop

#### `CurrentConditions`
- Consumes `useWeather(lat, lon)` hook data
- Renders hero section: large current temperature, feels-like, WMO condition icon + text label (day/night variant), today's high/low, precipitation probability, humidity, wind speed
- Shows skeleton loading state when `isLoading === true`
- Shows error state when `isError === true`
- Displays integer-rounded temperatures only (never "18.47°C")
- Day/night icon variant determined by comparing current time against `sunrise`/`sunset` from API response

#### `HourlyForecast`
- Consumes `useWeather` data (already fetched by `CurrentConditions`; TanStack Query deduplicates)
- Renders horizontal scroll container of hourly cards for next 24 hours
- Each card: formatted time (via `Intl.DateTimeFormat` with location timezone), WMO condition icon, temperature, precipitation probability %
- Minimum 44px touch target on each card (WCAG 2.5.8)
- Shows skeleton cards while loading

#### `DailyForecast`
- Consumes `useWeather` data
- Renders vertical list of 7 daily forecast rows: day name, WMO condition icon (day variant), high/low temperatures, precipitation probability %
- Renders a `Recharts` `<AreaChart>` for temperature trend across the 7-day window below the list
- Day/night icon variant: daily forecast always uses day icons

#### `WeatherDetails`
- Consumes `useWeather` data
- Collapsed by default (progressive disclosure — Phase 3)
- Expanded panel shows: UV index, wind speed + compass direction, visibility (km/mi), sunrise time, sunset time
- All values formatted with correct units based on `useUnitPreference`

#### Custom Hooks (API Layer)

| Hook | Inputs | Returns | API Used |
|------|--------|---------|---------|
| `useWeather(lat, lon)` | `number, number` | `{ data, isLoading, isError, dataUpdatedAt }` | Open-Meteo Forecast API |
| `useGeocode(query)` | `string` | `{ data: GeocodingResult[], isLoading, isError }` | Open-Meteo Geocoding API |
| `useReverseGeocode(lat, lon)` | `number, number` | `Promise<string>` (city name) | Nominatim API |
| `useUnitPreference()` | — | `{ unit, setUnit }` | `localStorage` |

---

## 4. Data Flow

### Flow 1: City Search → Weather Display

```
User types in LocationBar input
         │
         ▼ (debounce ~300ms, fires after 2+ chars)
useGeocode(query) hook
         │
         ▼
GET https://geocoding-api.open-meteo.com/v1/search
    ?name={query}&count=5&language=en&format=json
         │
         ▼
TanStack Query caches result under key: ['geocode', query]
         │
         ▼
Dropdown list renders with matching city suggestions
         │
         ▼ (user selects a result)
AppShell location state updated: { lat, lon, name }
         │
         ├──► Recent locations array updated in localStorage
         │
         ▼
WeatherDashboard renders, useWeather(lat, lon) fires
         │
         ▼
GET https://api.open-meteo.com/v1/forecast
    ?latitude={lat}&longitude={lon}
    &current=temperature_2m,relative_humidity_2m,
             apparent_temperature,precipitation_probability,
             weather_code,wind_speed_10m,wind_direction_10m
    &hourly=temperature_2m,precipitation_probability,weather_code
    &daily=weather_code,temperature_2m_max,temperature_2m_min,
           precipitation_probability_max,sunrise,sunset,uv_index_max
    &wind_speed_unit=mph         (if unit === 'imperial')
    &temperature_unit=fahrenheit (if unit === 'imperial')
    &timezone=auto
    &forecast_days=7
         │
         ▼
TanStack Query caches result under key: ['weather', lat, lon]
staleTime: 10 minutes — no re-fetch within window
gcTime:    30 minutes — data evicted from cache after 30min idle
         │
         ▼
All weather components re-render with live data
Skeleton states replaced with real content
```

### Flow 2: GPS → Weather Display

```
User clicks "Use My Location" button in LocationBar
         │
         ▼
navigator.geolocation.getCurrentPosition() called
    options: { timeout: 10000, maximumAge: 300000 }
         │
         ├── Permission DENIED ──► Show inline error message
         │                         Search input remains active
         │                         No UI blocked or blanked
         │
         └── Permission GRANTED
                   │
                   ▼
             { latitude, longitude } received
                   │
                   ▼
             GET https://nominatim.openstreetmap.org/reverse
                 ?lat={lat}&lon={lon}&format=json
                   │
                   ▼
             City name extracted from response
             (nominatim response: .address.city || .address.town || .address.village)
                   │
                   ▼
             AppShell location state updated: { lat, lon, name }
                   │
                   ▼
             Same weather fetch flow as City Search (above)
```

### Flow 3: Unit Toggle

```
User clicks °C/°F toggle in SettingsBar
         │
         ▼
useUnitPreference() setUnit() called
         │
         ├──► localStorage['weatherUnit'] updated ('metric' | 'imperial')
         │
         └──► React state update triggers re-render of all consuming components
                   │
                   ▼
             TanStack Query cache is INVALIDATED for ['weather', lat, lon]
             (unit change requires new API call with different unit params)
                   │
                   ▼
             New Open-Meteo request fires with updated unit query params
             Fresh data displays with correct units
```

---

## 5. State Management

The app uses **no global state management library** (no Redux, no Zustand, no Context for data). State is organized into three tiers:

### Tier 1: Server State — TanStack Query Cache (In-Memory)

All API response data is owned by TanStack Query. Components read from the cache via hooks — they never hold API data in local `useState`.

| Cache Key | Data | staleTime | gcTime |
|-----------|------|-----------|--------|
| `['weather', lat, lon]` | Full Open-Meteo forecast response | 10 minutes | 30 minutes |
| `['geocode', query]` | Array of geocoding search results | 5 minutes | 15 minutes |

**Key behaviors:**
- Multiple components calling `useWeather(lat, lon)` with the same `[lat, lon]` share a single cache entry — zero duplicate network requests
- `staleTime: 10min` means data is considered fresh for 10 minutes; no background refetch within that window
- On network reconnect or window focus, TanStack Query will refetch stale data automatically
- Stale data is shown during refetch (not a blank screen)

### Tier 2: Persisted Client State — localStorage

User preferences and non-ephemeral UI state that must survive page reload.

| Key | Type | Description |
|-----|------|-------------|
| `weatherUnit` | `'metric' \| 'imperial'` | Temperature/wind unit preference |
| `recentLocations` | `RecentLocation[]` (JSON) | Last 5 searched locations for quick-select chips |

### Tier 3: Ephemeral UI State — React Component State

Transient UI state that resets on page reload and is local to a single component.

| Component | State | Type | Purpose |
|-----------|-------|------|---------|
| `LocationBar` | `searchQuery` | `string` | Controlled input value |
| `LocationBar` | `isDropdownOpen` | `boolean` | Autocomplete dropdown visibility |
| `LocationBar` | `isGeolocating` | `boolean` | GPS loading spinner |
| `WeatherDetails` | `isExpanded` | `boolean` | Collapsible panel open/closed |
| `AppShell` | `activeLocation` | `Location \| null` | Currently selected location |

---

## 6. API Integration Patterns

### Open-Meteo Forecast API

**Base URL:** `https://api.open-meteo.com/v1/forecast`  
**Auth:** None — no API key required  
**Rate Limits:** 10,000 calls/day, 600/minute (non-commercial)  
**License:** CC BY 4.0 — attribution required in UI footer

#### Full Request Pattern

```typescript
// src/api/openMeteo.ts

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

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
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
      'visibility',
    ].join(','),
    timezone: 'auto',                          // REQUIRED — never omit
    forecast_days: '7',
    ...(unit === 'imperial' && {
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
    }),
  });

  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}
```

#### `useWeather` Hook

```typescript
// src/hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../api/openMeteo';

export function useWeather(lat: number | null, lon: number | null) {
  const { unit } = useUnitPreference();

  return useQuery({
    queryKey: ['weather', lat, lon, unit],      // unit in key → cache busted on unit change
    queryFn: () => fetchWeather(lat!, lon!, unit),
    enabled: lat !== null && lon !== null,       // don't fetch until location is selected
    staleTime: 10 * 60 * 1000,                  // 10 minutes
    gcTime: 30 * 60 * 1000,                     // 30 minutes
    retry: 2,
  });
}
```

### Open-Meteo Geocoding API

**Base URL:** `https://geocoding-api.open-meteo.com/v1/search`  
**Auth:** None  
**Usage:** Forward geocoding only (city name → lat/lon)

#### `useGeocode` Hook

```typescript
// src/hooks/useGeocode.ts
import { useQuery } from '@tanstack/react-query';

async function fetchGeocode(query: string): Promise<GeocodingResult[]> {
  if (query.length < 2) return [];
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
  return useQuery({
    queryKey: ['geocode', query],
    queryFn: () => fetchGeocode(query),
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
```

### Nominatim Reverse Geocoding API

**Base URL:** `https://nominatim.openstreetmap.org/reverse`  
**Auth:** None  
**Usage:** GPS coordinates → city name (called imperatively, not via a persistent query)  
**Note:** Nominatim requires a `User-Agent` or `Referer` header for identification per their usage policy.

```typescript
// src/api/nominatim.ts

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
    format: 'json',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params}`,
    {
      headers: {
        'Accept-Language': 'en',
      },
    }
  );
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data = await res.json();
  // Fallback chain: city → town → village → county
  return (
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.county ??
    'Unknown Location'
  );
}
```

---

## 7. Data Models & TypeScript Interfaces

### Core Domain Types

```typescript
// src/types/location.ts

export interface Location {
  lat: number;
  lon: number;
  name: string;         // "London", "New York", etc.
  country?: string;     // "GB", "US"
  admin1?: string;      // State/region for disambiguation
}

export interface RecentLocation extends Location {
  searchedAt: number;   // Unix timestamp (ms)
}
```

```typescript
// src/types/weather.ts

export type UnitSystem = 'metric' | 'imperial';

export interface CurrentWeather {
  temperature: number;              // integer display value
  feelsLike: number;
  humidity: number;                 // 0–100 %
  precipitationProbability: number; // 0–100 %
  weatherCode: number;              // WMO weather code
  windSpeed: number;
  windDirection: number;            // degrees 0–360
}

export interface HourlyWeather {
  time: string;                     // ISO-8601, location timezone
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface DailyWeather {
  date: string;                     // "YYYY-MM-DD"
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  sunrise: string;                  // ISO-8601, location timezone
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather[];          // next 24 entries
  daily: DailyWeather[];            // 7 entries
  timezone: string;                 // "America/New_York", "Europe/London", etc.
  fetchedAt: number;                // Unix timestamp (ms) for "Updated N ago"
  unit: UnitSystem;
}
```

### Open-Meteo Raw API Response Shape

```typescript
// src/types/openMeteoRaw.ts

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}
```

### Open-Meteo Geocoding API Response Shape

```typescript
// src/types/openMeteoRaw.ts (continued)

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;      // State/province
  admin2?: string;      // County
}
```

### WMO Weather Code Mapping

```typescript
// src/utils/weatherCodes.ts

export interface WeatherCondition {
  label: string;          // "Clear sky", "Moderate rain", etc.
  iconDay: string;        // Icon identifier for daytime
  iconNight: string;      // Icon identifier for nighttime
  backgroundClass: string; // Tailwind gradient class (condition-aware background)
}

// WMO code 0 = clear sky, 1-3 = partly cloudy, etc.
// Full mapping: https://open-meteo.com/en/docs#weathervariables
export const WMO_CONDITIONS: Record<number, WeatherCondition> = {
  0:  { label: 'Clear sky',        iconDay: 'sun',           iconNight: 'moon',         backgroundClass: 'bg-gradient-to-b from-sky-400 to-blue-500' },
  1:  { label: 'Mainly clear',     iconDay: 'sun-cloud',     iconNight: 'moon-cloud',   backgroundClass: 'bg-gradient-to-b from-sky-300 to-blue-400' },
  2:  { label: 'Partly cloudy',    iconDay: 'cloud-sun',     iconNight: 'cloud-moon',   backgroundClass: 'bg-gradient-to-b from-slate-300 to-sky-400' },
  3:  { label: 'Overcast',         iconDay: 'cloud',         iconNight: 'cloud',        backgroundClass: 'bg-gradient-to-b from-slate-400 to-slate-500' },
  45: { label: 'Fog',              iconDay: 'fog',           iconNight: 'fog',          backgroundClass: 'bg-gradient-to-b from-slate-300 to-slate-400' },
  51: { label: 'Light drizzle',    iconDay: 'drizzle',       iconNight: 'drizzle',      backgroundClass: 'bg-gradient-to-b from-slate-400 to-blue-600' },
  61: { label: 'Slight rain',      iconDay: 'rain',          iconNight: 'rain',         backgroundClass: 'bg-gradient-to-b from-slate-500 to-blue-700' },
  71: { label: 'Slight snow',      iconDay: 'snow',          iconNight: 'snow',         backgroundClass: 'bg-gradient-to-b from-slate-200 to-blue-200' },
  95: { label: 'Thunderstorm',     iconDay: 'thunderstorm',  iconNight: 'thunderstorm', backgroundClass: 'bg-gradient-to-b from-slate-700 to-slate-900' },
  // ... full WMO code table in implementation
};
```

---

## 8. Error Handling Strategy

### Error Taxonomy

| Error Type | Cause | UI Response | Recovery |
|-----------|-------|-------------|---------|
| `GEOLOCATION_DENIED` | User blocks location permission | Inline message under GPS button; search input stays active | User types city manually |
| `GEOLOCATION_UNAVAILABLE` | No GPS hardware or signal | Same as above | Same as above |
| `GEOCODING_NO_RESULTS` | City name not found | "City not found — try a different spelling" under dropdown | User corrects input |
| `WEATHER_API_ERROR` | Open-Meteo returns non-200 | Error card replaces skeleton; shows cached data if available | TanStack Query retries ×2; user can manually refetch |
| `NETWORK_OFFLINE` | No internet connection | Show stale cached data + "Showing data from N min ago" banner; if no cache, show friendly offline message | Auto-refetch on reconnect (TanStack Query `networkMode`) |
| `NOMINATIM_ERROR` | Reverse geocode fails | Use raw "lat, lon" as location display name; weather still loads | Transparent to user |

### Loading States

All data-dependent UI renders in one of three states: **loading**, **error**, or **success**. Blank states are never acceptable.

```typescript
// Pattern used in every data-consuming component
function CurrentConditions({ lat, lon }: { lat: number; lon: number }) {
  const { data, isLoading, isError } = useWeather(lat, lon);

  if (isLoading) return <CurrentConditionsSkeleton />;
  if (isError)   return <WeatherErrorCard onRetry={() => refetch()} />;
  return <CurrentConditionsDisplay data={data} />;
}
```

### Stale Data Display

```typescript
// SettingsBar.tsx — "Updated N ago" indicator
function UpdatedIndicator({ dataUpdatedAt }: { dataUpdatedAt: number }) {
  const minutesAgo = Math.floor((Date.now() - dataUpdatedAt) / 60000);
  if (minutesAgo < 1) return <span>Updated just now</span>;
  return <span>Updated {minutesAgo}m ago</span>;
}
```

### TanStack Query Global Error Config

```typescript
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      networkMode: 'offlineFirst',   // show cached data while offline
    },
  },
});
```

---

## 9. Performance Architecture

### Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Initial page load | < 2s on 4G mobile | Core UX requirement from research |
| Time to first weather data | < 3s end-to-end | Open-Meteo API: < 10ms; Vite bundle: < 250KB |
| Bundle size (gzipped) | ≈ 250KB | React + Recharts + TanStack Query baseline |
| API calls per session | ≤ 2 per location per 10min | TanStack Query `staleTime` enforcement |
| Geolocation timeout | 10s max, then fallback | `getCurrentPosition` options |

### Bundle Size Strategy

```
React + React-DOM:       ~45KB  gzipped
TanStack Query v5:       ~13KB  gzipped
Recharts (tree-shaken):  ~95KB  gzipped  ← lazy-loaded
Tailwind CSS v4:         ~15KB  gzipped  (only used utilities, purged at build)
App code + types:        ~30KB  gzipped
─────────────────────────────────────────
Total estimate:         ~198KB  gzipped  (within < 250KB target)
```

### Code Splitting

Chart components are lazy-loaded — they are only needed after weather data is available, and their ~95KB contribution should not block initial render.

```typescript
// src/components/DailyForecast.tsx
import { lazy, Suspense } from 'react';

const TemperatureTrendChart = lazy(
  () => import('./TemperatureTrendChart')
);

function DailyForecast({ data }: { data: DailyWeather[] }) {
  return (
    <>
      <DailyList data={data} />
      <Suspense fallback={<ChartSkeleton />}>
        <TemperatureTrendChart data={data} />
      </Suspense>
    </>
  );
}
```

### API Request Optimization

Only request the exact Open-Meteo variables needed — the API supports granular variable selection and returns a smaller JSON payload accordingly. For example, a request with all needed current + hourly + daily variables for 7 days returns approximately 8–12KB JSON.

### Caching Architecture

```
Request for weather(lat, lon):
    │
    ├── Cache hit (< 10min old) → return cached data immediately, no network request
    │
    ├── Cache hit (> 10min, < 30min old) → return stale data IMMEDIATELY, 
    │   then background-refetch and update UI when fresh data arrives
    │
    └── Cache miss → show skeleton, fetch, cache result for 10min window
```

---

## 10. Security Architecture

### Threat Model

This is a frontend-only app with no user authentication, no user data storage beyond localStorage preferences, and no API keys. The attack surface is minimal. The primary concerns are:

1. **No API key exposure** — eliminated by Open-Meteo (no key required)
2. **HTTPS enforcement** — required for Geolocation API; enforced by Vercel
3. **XSS via API data** — weather API returns structured JSON, not HTML; data rendered via React (which escapes by default)
4. **Privacy of location data** — coordinates are sent directly from browser to Open-Meteo and Nominatim; they are never routed through a custom server

### Security Properties

| Property | Implementation | Status |
|----------|---------------|--------|
| No secrets in source code | Open-Meteo requires no API key | ✅ By design |
| No secrets in git | No `.env` files with keys needed | ✅ By design |
| HTTPS enforced | Vercel enforces HTTPS on all deployments; HTTP redirects to HTTPS | ✅ Platform-enforced |
| Geolocation permission model | Browser native permission prompt; user must explicitly grant; never auto-requested | ✅ By design |
| Location data privacy | Coordinates sent to Open-Meteo (EU GDPR compliant) and Nominatim (OSM, EU) directly from browser | ✅ No custom server in chain |
| XSS protection | React JSX escapes all string interpolation by default; no `dangerouslySetInnerHTML` | ✅ Framework default |
| Dependency supply chain | All dependencies from reputable npm packages; lock file committed | ✅ Standard practice |
| No user PII collected | No accounts, no analytics (v1), no cookies | ✅ By design |

### Geolocation Security Note

The Browser Geolocation API requires a **secure context (HTTPS)**. On `localhost`, it works over HTTP for development. On any deployed URL, HTTPS is mandatory — without it, `navigator.geolocation` is `undefined` and the GPS feature silently fails. Vercel enforces HTTPS on all deployments and auto-redirects HTTP to HTTPS, satisfying this requirement.

### Content Security Policy (Optional — Phase 4)

A minimal CSP header can be added via `vercel.json` to restrict resource origins:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; connect-src 'self' https://api.open-meteo.com https://geocoding-api.open-meteo.com https://nominatim.openstreetmap.org; script-src 'self'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

---

## 11. Deployment Architecture

### Deployment Pipeline

```
Developer pushes to GitHub (main branch)
         │
         ▼
Vercel webhook triggered (auto-configured on project link)
         │
         ▼
Vercel Build Environment
  Node.js 20.x
  npm ci
  npm run build   →   vite build
         │
         ▼
  dist/ output:
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js     (main bundle)
  │   ├── TemperatureTrendChart-[hash].js  (lazy chunk)
  │   └── index-[hash].css
         │
         ▼
Vercel CDN — Global edge network
  • HTTPS enforced, HTTP → HTTPS redirect
  • Brotli + gzip compression on all assets
  • Cache-Control: immutable on hashed assets
  • SPA routing: all paths → index.html (configured automatically)
         │
         ▼
Live at: https://weather-app-[hash].vercel.app
         (or custom domain)
```

### Vercel Configuration

No `vercel.json` is required for basic deployment. Vercel auto-detects Vite and configures:
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback routing: `index.html` for all routes

Optional `vercel.json` for CSP headers (Phase 4):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Environment Variables

No environment variables are required for v1 (Open-Meteo needs no key). If a keyed API were ever introduced:

```bash
# .env.local  (gitignored — development only)
VITE_WEATHER_API_KEY=your_key_here

# Vercel Dashboard → Project Settings → Environment Variables
# Variable: VITE_WEATHER_API_KEY
# Environments: Production, Preview, Development
```

Note: `VITE_` prefixed variables are inlined into the compiled JavaScript bundle at build time. They are **not server-side secrets** and will be visible in the browser. This is acceptable only for low-risk free-tier keys with domain restrictions applied in the API provider's dashboard.

---

## 12. Accessibility Architecture

Accessibility is built in from Phase 1, not retrofitted. The following patterns are mandatory from the first implementation phase.

### WCAG 2.2 AA Target Criteria

| Criterion | Description | Implementation |
|-----------|-------------|----------------|
| 1.4.1 Use of Color | Color alone must not convey information | Weather icons always include text label alongside icon |
| 1.4.3 Contrast (Minimum) | 4.5:1 ratio for normal text | All condition-aware backgrounds tested against text colors before Phase 3 ships |
| 2.1.1 Keyboard | All functionality via keyboard | Autocomplete dropdown navigable with arrow keys + Enter; GPS button focusable |
| 2.4.3 Focus Order | Logical focus sequence | DOM order matches visual order; no CSS-only reordering |
| 2.5.8 Target Size | 44×44px minimum touch targets | Hourly forecast cards, GPS button, toggle — all ≥ 44px |
| 4.1.3 Status Messages | Status updates announced to AT | `aria-live="polite"` on weather data region |

### Key ARIA Patterns

```tsx
{/* Weather data region — announced on update */}
<section aria-live="polite" aria-label="Current weather conditions">
  <CurrentConditions data={data} />
</section>

{/* Search combobox */}
<input
  role="combobox"
  aria-autocomplete="list"
  aria-controls="location-suggestions"
  aria-expanded={isDropdownOpen}
  aria-label="Search for a city"
/>
<ul id="location-suggestions" role="listbox">
  {results.map(r => (
    <li key={r.id} role="option" aria-selected={false}>{r.name}</li>
  ))}
</ul>

{/* GPS button */}
<button
  aria-label="Use my current location"
  aria-pressed={isGeolocating}
>
  {/* icon */}
</button>

{/* Unit toggle */}
<button
  role="switch"
  aria-checked={unit === 'imperial'}
  aria-label="Temperature unit"
>
  °C / °F
</button>
```

### Motion Safety

```css
/* All transitions and animations must be wrapped */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Recharts Chart Accessibility

Recharts renders SVG charts that are not natively accessible to screen readers. To ensure WCAG compliance, every chart component must include a visually-hidden `<table>` with the same data:

```tsx
function TemperatureTrendChart({ data }: { data: DailyWeather[] }) {
  return (
    <div>
      {/* Visual chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          {/* ... */}
        </AreaChart>
      </ResponsiveContainer>

      {/* Screen reader fallback — visually hidden */}
      <table className="sr-only">
        <caption>7-day temperature trend</caption>
        <thead>
          <tr><th>Day</th><th>High</th><th>Low</th></tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.date}>
              <td>{formatDay(d.date)}</td>
              <td>{d.tempMax}°</td>
              <td>{d.tempMin}°</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 13. Key Architectural Decisions

### ADR-01: Frontend-Only Architecture (No Backend)

**Decision:** Build as a pure frontend SPA with no custom backend server.

**Rationale:** Weather display is a read-only operation against public APIs. A backend would add infrastructure cost, deployment complexity, and maintenance burden without providing any user value for v1. Open-Meteo's no-key API eliminates the only traditional reason to add a backend (API key proxying).

**Consequences:** No user accounts, no server-side personalization, no push notifications (all acceptable per PROJECT.md out-of-scope list). State is limited to TanStack Query cache + localStorage.

---

### ADR-02: Open-Meteo as Primary Weather API

**Decision:** Use Open-Meteo instead of OpenWeatherMap, WeatherAPI.com, or Tomorrow.io.

**Rationale:**
- No API key required → zero security risk, zero key management, no `.env` files
- 14-day forecasts vs. OWM free tier's 5 days
- `timezone=auto` parameter resolves the #1 timezone bug in weather apps automatically
- CC BY 4.0 attribution is a simple footer line — no complex licensing
- 10,000 calls/day is sufficient for personal/portfolio use

**Consequences:** CC BY 4.0 attribution footer is mandatory in all deployments. Non-commercial use only — if this becomes a commercial product, a paid Open-Meteo plan is required.

---

### ADR-03: TanStack Query v5 for All API State

**Decision:** Use TanStack Query v5 as the sole data-fetching and caching layer. No `useEffect` + `useState` patterns for API calls.

**Rationale:** TanStack Query provides `staleTime`, request deduplication, background refetch, `isLoading`/`isError` states, and `networkMode: 'offlineFirst'` — all of which are required for a correct weather app. Implementing equivalent behavior with `useEffect` + `useState` is possible but introduces significant boilerplate and edge-case bugs (race conditions, double-fetch on StrictMode, no deduplication).

**Consequences:** `QueryClientProvider` must wrap the entire app. All components that consume API data must use `useQuery` hooks, not imperative fetch calls.

---

### ADR-04: `timezone=auto` — Non-Negotiable from Day 1

**Decision:** Every Open-Meteo API request must include `timezone=auto`. This is a required parameter, not optional.

**Rationale:** Without `timezone=auto`, Open-Meteo returns timestamps in UTC. Displaying UTC timestamps as local times causes incorrect sunrise/sunset, wrong hourly labels, and incorrect day boundaries — the #1 observable bug across the 26,000+ portfolio weather apps surveyed in research. `Intl.DateTimeFormat` with the `timeZone` option from the API response handles all display formatting.

**Consequences:** The `timezone` field from the API response must be stored alongside weather data and passed to all time formatting functions. It is included in the `WeatherData` TypeScript interface.

---

### ADR-05: Geolocation as Opt-In, Never Auto-Requested

**Decision:** The GPS geolocation button triggers permission request only on explicit user click. The app never calls `navigator.geolocation.getCurrentPosition` automatically on page load.

**Rationale:** ~10%+ of desktop users deny geolocation. Browsers now suppress automatic permission prompts on many sites, and auto-requesting on load produces a permission prompt before the user understands the app's purpose. City search is the primary, always-available path. GPS is an enhancement, not a gate.

**Consequences:** The LocationBar must always render the city search input as the primary element. The GPS button is visually secondary. Permission denial must show a helpful inline message and return focus to the search input.

---

### ADR-06: Recharts with Lazy Loading for Charts

**Decision:** Use Recharts (not Chart.js, Nivo, or D3) for all data visualizations, loaded via `React.lazy()`.

**Rationale:** Recharts is React-native (no adapter), provides the exact chart types needed (`AreaChart` for temperature trend, `BarChart` for precipitation), ships with `ResponsiveContainer`, and is tree-shakeable. At ~95KB gzipped after tree-shaking, lazy-loading keeps it out of the critical path — charts are only rendered after weather data is available, so deferred loading has no UX impact.

**Consequences:** Chart components must be wrapped in `React.lazy()` and `<Suspense>` with a skeleton fallback. SVG charts require a visually-hidden `<table>` fallback for screen reader accessibility (Recharts does not provide native ARIA support).

---

### ADR-07: Vercel for Deployment

**Decision:** Deploy to Vercel, not Netlify, GitHub Pages, or Cloudflare Pages.

**Rationale:** Vercel has zero-config Vite detection (no `vercel.json` needed), enforces HTTPS by default (required for Geolocation API on deployed URLs), provides a global CDN, and auto-deploys from GitHub on push. HTTPS enforcement is non-negotiable — without it, the Geolocation API is silently unavailable.

**Consequences:** Geolocation will work correctly on all Vercel-hosted URLs. If the project is ever moved to a non-HTTPS host, geolocation must be explicitly tested and the deployment platform must enforce HTTPS.

---

*Technical Architecture document created: 2026-04-29*  
*Based on: PROJECT.md, research/SUMMARY.md, research/technical.md, ROADMAP.md*  
*Stack: React 19 + Vite 8 + TypeScript + Tailwind CSS v4 + TanStack Query v5 + Recharts + Open-Meteo + Nominatim + Vercel*

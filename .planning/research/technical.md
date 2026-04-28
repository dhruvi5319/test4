# Technical Research: Simple Weather App

**Domain:** Frontend-only weather application using public APIs  
**Researched:** 2026-04-28  
**Overall Confidence:** HIGH (all major claims verified against official docs)

---

## 1. Weather API Comparison

### Free-Tier Summary

| API | Free Calls | Forecast Range | Key Limits | No Key Required? | CORS-Friendly? |
|-----|-----------|----------------|------------|-----------------|----------------|
| **Open-Meteo** | 300,000/month (10,000/day, 600/min) | 14 days | Non-commercial only | ✅ YES | ✅ YES |
| **OpenWeatherMap (Free)** | 1,000,000/month (60 calls/min) | 5-day/3-hr forecast | Requires free API key | No | ✅ YES (HTTPS) |
| **WeatherAPI.com (Free)** | 100,000/month | 3-day forecast | Requires free API key | No | ✅ YES |
| **Tomorrow.io (Free)** | Not explicitly stated; limited | 5-day forecast | Requires API key; 1 alert | No | ✅ YES |

### Detailed Analysis

#### Open-Meteo (RECOMMENDED for personal/portfolio projects)
- **Source:** https://open-meteo.com/en/pricing (verified 2026-04-28)
- **Completely free for non-commercial use** with no API key required
- Free tier: 10,000 API calls/day, 300,000/month, 600/minute
- Endpoints: Current weather, hourly/daily forecasts up to 14 days, historical (80+ years), air quality, geocoding, elevation
- Data sources: DWD (Germany), NOAA (US), Météo-France, CMC (Canada) — multi-model ensemble
- Resolution: Up to 1 km for Europe/US (local models), 11 km global
- Updates hourly (local 1km models); global models updated every 6h
- JSON-based RESTful API — no SDK needed, query with lat/lon
- **No API key for frontend = zero key exposure risk**
- Attribution required (CC BY 4.0 license)
- **Best for:** development, portfolio, non-commercial apps

#### OpenWeatherMap (RECOMMENDED if needing wider recognition)
- **Source:** https://openweathermap.org/price (verified 2026-04-28)
- Free tier: 60 calls/min, 1,000,000 calls/month
- Includes: Current Weather API, 3-hour Forecast (5 days), Air Pollution, Geocoding, Weather Maps (15 layers)
- One Call API 3.0 (separate subscription): 1,000 free calls/day, pay-per-call after that
  - Offers: 1-min forecast, 48-hr hourly, 8-day daily, government alerts, AI weather summaries
- API key required → **must be embedded in frontend** (see security section)
- Data update frequency: every 2 hours on free tier
- Most tutorials and Stack Overflow answers use this → easiest to get help
- **Best for:** apps where OWM brand recognition matters, or if you need weather maps

#### WeatherAPI.com
- **Source:** https://www.weatherapi.com/pricing.aspx (verified 2026-04-28)
- Free tier: 100,000 calls/month (≈3,333/day)
- Includes: Realtime, 3-day forecast, Astronomy, IP Lookup, Search API, Weather Maps, limited Sports
- Limitation: Only 1 day of historical, limited alerts
- Uptime: 95.5% on free tier (concerning for production)
- **Best for:** apps needing astronomy data; otherwise inferior to Open-Meteo/OWM on free tier

#### Tomorrow.io
- **Source:** https://tomorrow.io/weather-api/ (verified 2026-04-28)
- Free tier: 5-day forecast, core data layers, 24hr historical, 1 monitored location, 1 alert
- 60+ data layers including air quality, pollen, fire index, soil — richest data catalog
- Call limits not clearly stated on free page (enterprise-focused product)
- **Best for:** if you need specialty data (pollen, fire, maritime); overkill for simple weather app

### **Recommendation: Open-Meteo for non-commercial + OpenWeatherMap as fallback**

Open-Meteo is the clear winner for a simple weather app:
1. No API key → no security concerns whatsoever
2. More generous free tier (10K/day vs OWM's 1K for One Call)
3. 14-day forecasts vs OWM free tier's 5-day
4. No rate limit issues in development
5. CC BY 4.0 attribution is simple footer text

Use OpenWeatherMap's free tier (Current + 5-day forecast) as a fallback/alternative if the project description specifically requires OWM.

---

## 2. Frontend Framework

### Options Evaluated

| Framework | Bundle Size | DX | Learning Curve | Weather App Fit |
|-----------|------------|-----|----------------|-----------------|
| **React 19** | ~45KB | Excellent | Medium | ✅ Best ecosystem |
| **Vue 3** | ~33KB | Excellent | Low | ✅ Great fit |
| **Svelte 5** | ~7KB | Good | Medium | ✅ Smallest bundle |
| **Vanilla JS** | ~0KB | Poor | Low | ⚠️ Tedious state mgmt |

### **Recommendation: React 19 with Vite**

**Why React:**
- Largest ecosystem of UI component libraries (shadcn/ui, Radix, etc.)
- TanStack Query (React Query) v5 is the best-in-class data-fetching/caching layer — perfect for weather APIs where you want to cache responses and manage loading states
- Best charting library support (Recharts is React-native; Nivo is React-native)
- Most tutorials, examples, community knowledge for weather apps
- Vite + React is the dominant SPA scaffolding in 2026

**Why not Vue:** Valid alternative, but React has deeper charting library support
**Why not Svelte:** Smaller ecosystem for data-fetching patterns; fewer charting options
**Why not Vanilla:** Managing API state, loading states, and geolocation callbacks without a framework is significantly more complex

### Vite as Build Tool
- **Source:** https://vitejs.dev/guide/ (verified 2026-04-28)
- Current version: Vite 8.x (v8.0.10 confirmed)
- Native ESM dev server with HMR — instant updates during development
- Rolldown-based production builds (fast, optimized)
- Built-in environment variable handling via `.env` files with `VITE_` prefix
- Templates: `npm create vite@latest` → select `react-ts`
- Requires Node.js 20.19+ or 22.12+
- Static site deployment guide built-in: GitHub Pages, Netlify, Vercel, Cloudflare Pages all documented

---

## 3. API Key Security in Frontend-Only Apps

### The Fundamental Problem
**API keys embedded in frontend JavaScript are always publicly visible.** Any user can find them via browser DevTools → Network tab, or by reading the source bundle. There is no way to truly hide an API key in a frontend-only app.

### Risk Assessment by API

| API | Risk Level | Why |
|-----|-----------|-----|
| Open-Meteo | **NONE** — no key needed | Perfect solution |
| OpenWeatherMap free | **LOW** | Free tier; OWM allows domain restrictions |
| WeatherAPI.com free | **LOW-MEDIUM** | Free tier; abuse = your account gets suspended |
| Tomorrow.io | **MEDIUM** | Paid tiers exist; no domain restriction on free |

### Mitigation Strategies (for keyed APIs)

1. **Use Open-Meteo and avoid the problem entirely** — strongly recommended

2. **Domain/Referrer Restrictions** — OpenWeatherMap supports API key restrictions by HTTP referrer. Set allowed domains in OWM dashboard so key only works on your domain.

3. **Environment Variables via Vite** — Store key as `VITE_WEATHER_API_KEY` in `.env.local`, add `.env.local` to `.gitignore`. Key won't be in source control, but IS exposed in the compiled bundle.
   ```bash
   # .env.local (gitignored)
   VITE_WEATHER_API_KEY=your_key_here
   # Access in code:
   import.meta.env.VITE_WEATHER_API_KEY
   ```

4. **Deploy-time secrets (Netlify/Vercel env vars)** — Same exposure issue (key ends up in JS bundle), but at least it's not in your git repository.

5. **Rate limiting acceptance** — For a personal/portfolio app, if the key is abused, you'll just hit rate limits on the free tier. Not a financial risk.

### **Recommendation: Use Open-Meteo to eliminate the problem. If using OWM, set domain restrictions on the API key and document the known exposure in README.**

---

## 4. Charting & Visualization Libraries

### Options for Weather Data

| Library | Framework | Bundle Size | Weather Suitability | Notes |
|---------|-----------|------------|---------------------|-------|
| **Recharts** | React-only | ~230KB | ✅ Excellent | Most popular React charting; line/area charts perfect for temp |
| **Chart.js + react-chartjs-2** | Framework-agnostic | ~200KB | ✅ Excellent | Well-documented; canvas-based |
| **Nivo** | React-only | ~500KB (tree-shakeable) | ✅ Good | Beautiful; heavy |
| **Visx** (Airbnb) | React | Lightweight | ✅ Good | D3-based; complex API |
| **Victory** | React | ~400KB | ✅ Good | Older; less maintained |
| **ApexCharts** | Framework-agnostic | ~400KB | ✅ Good | Feature-rich |

### **Recommendation: Recharts**

**Why Recharts for weather apps:**
- React-native (no adapter needed)
- `<LineChart>` and `<AreaChart>` are perfect for temperature/precipitation over time
- `<BarChart>` works well for daily precipitation probability
- Responsive containers built-in (`<ResponsiveContainer>`)
- Well-maintained, ~230KB, minimal dependencies
- Simple declarative API that's easy to customize with themes

**Charts needed for a weather app:**
- **Temperature line/area chart** — 24-hour or 7-day temperature trend
- **Precipitation bar chart** — Daily or hourly precipitation probability
- **Humidity/wind line chart** (optional)
- (No specialized chart types needed — standard line/bar/area suffice)

**Install:**
```bash
npm install recharts
```

**Example usage:**
```tsx
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={hourlyData}>
    <XAxis dataKey="time" />
    <YAxis />
    <Tooltip />
    <Area type="monotone" dataKey="temperature" stroke="#3b82f6" fill="#93c5fd" />
  </AreaChart>
</ResponsiveContainer>
```

---

## 5. Geolocation (Browser API)

### Browser Geolocation API
- **Source:** https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API (verified 2026-04-28)
- **Baseline Widely Available** — supported since July 2015, works in all modern browsers
- **Requires HTTPS** (secure context) — works on localhost for development
- User must grant explicit permission via browser prompt

### Key Methods
```javascript
// One-time position fetch
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // fetch weather for lat/lon
  },
  (error) => {
    // Handle: PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
    console.error(error.message);
  },
  { timeout: 10000, maximumAge: 300000 } // options
);
```

### Implementation Patterns

1. **Ask for geolocation on first load** — "Use my location" button is better UX than auto-requesting
2. **Always provide city search fallback** — ~10% of users deny geolocation; many more on desktop
3. **Cache coordinates** — Use `maximumAge: 300000` (5 min) to avoid repeated GPS queries
4. **Error handling is mandatory** — PERMISSION_DENIED is very common; show clear fallback UI

### Reverse Geocoding (lat/lon → city name)
- Open-Meteo provides its own free Geocoding API (forward: city → lat/lon)
- For reverse geocoding (lat/lon → city name), use:
  - OpenWeatherMap Reverse Geocoding API (free, included in free tier)
  - Nominatim (OpenStreetMap) — completely free, no key needed: `https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json`
  - Open-Meteo doesn't offer reverse geocoding

**Recommendation:** Use Nominatim for reverse geocoding (no key, no rate limit concerns for personal use). Or use OpenWeatherMap's geocoding if already using OWM.

---

## 6. Performance Considerations

### Key Performance Concerns

#### API Response Caching
- Weather data doesn't change every second — **cache aggressively**
- Recommended: TanStack Query with `staleTime: 10 * 60 * 1000` (10 minutes)
- This prevents redundant API calls when user navigates back to the page
- Open-Meteo updates local models hourly; OWM free tier every 2 hours — no need to refetch more often

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['weather', lat, lon],
  queryFn: () => fetchWeather(lat, lon),
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000,    // 30 minutes garbage collection
});
```

#### Bundle Size
- Target: < 300KB gzipped total for good Core Web Vitals
- React + Recharts + TanStack Query ≈ ~250KB gzipped (acceptable)
- Use Vite's tree-shaking; import only needed Recharts components
- Lazy-load chart components with `React.lazy()` — charts aren't needed until data loads

#### Network Considerations
- Open-Meteo API response time: < 10ms (per their docs, NVMe-cached)
- Select only needed variables in Open-Meteo request to reduce response payload
- Show skeleton loading states during initial fetch (improves perceived performance)

#### Geolocation Performance
- `getCurrentPosition` can take 2-10 seconds — show loading state immediately
- Use `maximumAge` option to use cached position
- Don't block page render waiting for geolocation — show search input immediately

### Performance Stack
```
TanStack Query v5     → API caching, request deduplication, background refetch
React.lazy()          → Code-split charts (loaded only when data available)
Vite production build → Minification, chunk splitting, tree-shaking
```

---

## 7. Build Tools & Deployment

### Build Tool: Vite 8
- **Source:** https://vitejs.dev/guide/ (verified 2026-04-28)
- Latest: v8.0.10 (as of April 2026)
- `npm create vite@latest my-weather-app -- --template react-ts`
- Built-in: TypeScript, JSX, HMR, env vars, production optimization
- Static output to `dist/` folder → deployable anywhere

### Deployment Options (All Free)

| Platform | Setup | Deploy | CDN | Custom Domain | Best For |
|----------|-------|--------|-----|---------------|---------|
| **Vercel** | Connect GitHub | Auto on push | ✅ Global | ✅ Free | Best DX; zero config |
| **Netlify** | Connect GitHub | Auto on push | ✅ Global | ✅ Free | Great; similar to Vercel |
| **Cloudflare Pages** | Connect GitHub | Auto on push | ✅ Global edge | ✅ Free | Fastest globally |
| **GitHub Pages** | GitHub Actions | Manual/Auto | ✅ Basic | ✅ (via DNS) | If project on GitHub |

**Recommendation: Vercel** — Zero-config Vite detection, instant deployments, great free tier, environment variables support in dashboard (for API keys if using keyed APIs).

### Vite Deployment Config for Vercel
No extra config needed — Vercel auto-detects Vite and sets:
- Build command: `npm run build`
- Output directory: `dist`

### Environment Variables
```bash
# .env.local (development, gitignored)
VITE_OWM_API_KEY=your_key

# Vercel dashboard → Project Settings → Environment Variables
# Same key name: VITE_OWM_API_KEY
```

---

## 8. Complete Recommended Stack

```
Framework:     React 19 + TypeScript
Build tool:    Vite 8 (npm create vite@latest -- --template react-ts)
Weather API:   Open-Meteo (primary, no key) + OWM fallback option
Styling:       Tailwind CSS v4 (utility-first, great for responsive weather cards)
Charting:      Recharts (React-native, lightweight, perfect chart types)
Data Fetching: TanStack Query v5 (caching, loading states, background refetch)
HTTP Client:   Native fetch() (no axios needed for simple GET requests)
Geolocation:   Browser Geolocation API + Nominatim reverse geocoding
Deployment:    Vercel (zero-config, free, auto-deploys from GitHub)
```

### Installation
```bash
npm create vite@latest weather-app -- --template react-ts
cd weather-app
npm install
npm install @tanstack/react-query recharts
npm install -D tailwindcss @tailwindcss/vite
```

### Tailwind v4 Vite Config
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 9. Common Pitfalls

### Pitfall 1: API Key Exposure
**Problem:** Storing API keys in frontend code or `.env` files that get committed to git  
**Prevention:** Use Open-Meteo (no key needed) or add `.env.local` to `.gitignore`. Never use `.env` (committed by default in some setups).

### Pitfall 2: Geolocation Denied, No Fallback
**Problem:** App breaks or shows unhelpful error if user denies location permission  
**Prevention:** Always show a city search input as the primary input. Make geolocation opt-in (button click), not automatic on load.

### Pitfall 3: No Loading/Error States
**Problem:** API calls take 200-2000ms; blank screen while loading looks broken  
**Prevention:** TanStack Query provides `isLoading`, `isError`, `data` — use skeleton components during loading.

### Pitfall 4: HTTPS Requirement for Geolocation
**Problem:** Geolocation API only works on HTTPS (or localhost). HTTP deployments will silently fail.  
**Prevention:** All recommended deployment platforms (Vercel, Netlify, Cloudflare) provide HTTPS by default.

### Pitfall 5: Timezone Handling
**Problem:** Weather APIs return UTC timestamps; sunrise/sunset times need timezone conversion  
**Prevention:** Open-Meteo has a `timezone=auto` parameter that auto-resolves timezone from coordinates. Use it. `Intl.DateTimeFormat` for display formatting.

### Pitfall 6: Units (Metric vs Imperial)
**Problem:** Different users expect different units; hard to add later if not designed in from start  
**Prevention:** Add a units toggle from day 1. Open-Meteo supports `temperature_unit=fahrenheit` and `wind_speed_unit=mph` as query params. OWM supports `units=imperial`.

### Pitfall 7: Excessive API Calls Without Caching
**Problem:** Searching the same city multiple times triggers duplicate API calls; exceeds free tier  
**Prevention:** TanStack Query with `staleTime` prevents duplicate calls. Query key should include location so different locations are cached separately.

### Pitfall 8: Chart Library Bundle Bloat
**Problem:** Importing all of a charting library (e.g., all of Nivo) adds 500KB+ to bundle  
**Prevention:** Use Recharts with named imports (tree-shakeable). Lazy-load chart components.

---

## 10. Sources

| Source | URL | Confidence | Date Verified |
|--------|-----|------------|---------------|
| Open-Meteo Pricing | https://open-meteo.com/en/pricing | HIGH | 2026-04-28 |
| Open-Meteo Features | https://open-meteo.com/en/features | HIGH | 2026-04-28 |
| OpenWeatherMap Pricing | https://openweathermap.org/price | HIGH | 2026-04-28 |
| OpenWeatherMap One Call 3.0 API | https://openweathermap.org/api/one-call-3 | HIGH | 2026-04-28 |
| WeatherAPI.com Pricing | https://www.weatherapi.com/pricing.aspx | HIGH | 2026-04-28 |
| Tomorrow.io Weather API | https://tomorrow.io/weather-api/ | HIGH | 2026-04-28 |
| Vite Getting Started | https://vitejs.dev/guide/ | HIGH | 2026-04-28 |
| Vite Static Deploy | https://vite.dev/guide/static-deploy | HIGH | 2026-04-28 |
| MDN Geolocation API | https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API | HIGH | 2026-04-28 |
| Chart.js Getting Started | https://www.chartjs.org/docs/latest/getting-started/ | HIGH | 2026-04-28 |
| Recharts (npm/docs) | Training data + npm stats | MEDIUM | — |
| TanStack Query v5 | Training data + npm stats | MEDIUM | — |

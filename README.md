# Simple Weather App

A fast, clean, frontend-only weather application. Search any city to get current conditions, 24-hour hourly forecast, and 7-day daily forecast — no account required, no ads.

**Live demo:** Deploy to Vercel (see below)

## Features

- Current conditions: temperature, feels-like, humidity, wind, precipitation %
- 24-hour hourly forecast with day/night icons
- 7-day daily forecast with temperature trend chart
- Weather details: UV index, wind direction, visibility, sunrise/sunset
- Condition-aware backgrounds (day/night gradients per weather state)
- °C/°F toggle — persists across reloads
- GPS location detection (opt-in)
- Recent location chips (last 5 searches, localStorage)
- Offline support — shows cached data when network unavailable
- WCAG AA accessible

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| Weather API | [Open-Meteo](https://open-meteo.com) (free, no key required) |
| Charting | Recharts (lazy-loaded) |
| Geocoding | Open-Meteo Geocoding + Nominatim |
| Deployment | Vercel |

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run preview   # preview production build
```

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

The `vercel.json` in this repo configures SPA routing and security headers automatically.

> **Note:** Geolocation API requires HTTPS. Vercel provides HTTPS by default — geolocation will work on your deployed URL but not on plain `http://localhost` (use `https://localhost` or the Vite dev server which handles this).

## Attribution

Weather data provided by [Open-Meteo](https://open-meteo.com) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

# Weather App Domain Research

**Domain:** Consumer Weather Application
**Researched:** 2026-04-28
**Overall Confidence:** HIGH (based on official API documentation, established domain knowledge, and weather data standards)

---

## Executive Summary

Weather apps are one of the most consistently used categories of consumer software — used multiple times daily by most smartphone owners. The domain is mature, with clear conventions, established data formats, and well-understood user expectations. The key challenge is not novelty but **ruthless simplicity**: users want the answer to "what should I wear / do I need an umbrella?" in under 3 seconds.

A frontend-only weather app using a public API sits in a crowded space, but wins by excelling at speed, clarity, and trustworthiness of display — not raw feature count.

---

## 1. Core Jobs-to-Be-Done (What Users Actually Want)

Users open a weather app to answer one of a small set of questions:

| Primary Job | Frequency | Example Question |
|-------------|-----------|------------------|
| **Immediate outfit/umbrella decision** | Multiple times daily | "Do I need a jacket today?" |
| **Day planning** | Once per morning | "Will it rain this afternoon?" |
| **Week planning** | A few times per week | "Which day should I schedule the hike?" |
| **Travel prep** | Occasional | "What's the weather in Paris next Thursday?" |
| **Outdoor activity safety** | Situational | "Is it safe to drive / cycle / run?" |
| **Severe weather monitoring** | Rare but critical | "Is there a storm coming?" |

**Key insight:** The top 2–3 jobs cover 90% of opens. Nail these before adding anything else.

---

## 2. Standard Weather Data Displayed

### Tier 1 — Must-Display (Users expect these; their absence makes the app feel broken)

| Data Point | Unit Options | Notes |
|------------|-------------|-------|
| **Current temperature** | °C / °F | Most prominent element; largest text |
| **Feels like (apparent temperature)** | °C / °F | Critical — actual temp often misleading |
| **Weather condition** | Text + icon | "Partly cloudy", "Heavy rain", etc. |
| **High / Low for today** | °C / °F | Day range planning |
| **Precipitation probability** | % | "Chance of rain" is king for decision-making |
| **Humidity** | % | Affects comfort perception |
| **Wind speed & direction** | km/h / mph / m/s | Safety + comfort |
| **3–7 day forecast** | Daily summary | Minimum viable forecast |

### Tier 2 — Expected by Many (Absence noted; presence appreciated)

| Data Point | Unit Options | Notes |
|------------|-------------|-------|
| **Hourly forecast** | Next 24–48h | Commuting decisions |
| **UV Index** | 0–11+ scale | Sun protection decisions |
| **Visibility** | km / miles | Driving safety |
| **Sunrise / Sunset** | Local time | Planning, photography |
| **Wind gusts** | km/h / mph | Different from sustained wind |
| **Dew point** | °C / °F | Better humidity comfort proxy than RH% |
| **Atmospheric pressure** | hPa / inHg | Trend matters more than value |

### Tier 3 — Power User / Specialized

| Data Point | Notes |
|------------|-------|
| **Air quality index (AQI)** | Health-sensitive users |
| **Pollen count** | Allergy sufferers |
| **Moon phase** | Outdoor/astronomy enthusiasts |
| **Precipitation amount** | Gardeners, farmers |
| **Snowfall depth** | Cold regions |
| **Cloud cover %** | Photography, solar panels |

---

## 3. Standard Data Formats and Units

### Temperature
- **Metric:** Celsius (°C) — used everywhere except USA, some Caribbean nations
- **Imperial:** Fahrenheit (°F) — default for US users
- **Scientific:** Kelvin (K) — OpenWeatherMap API default; must convert for display
- **Rule:** Always offer C/F toggle; auto-detect from locale

### Wind Speed
- **km/h** — metric countries
- **mph** — US/UK
- **m/s** — scientific, Scandinavia
- **knots** — maritime/aviation
- Direction: degrees (0–360°) or cardinal (N, NNE, NE, etc., 16-point compass)

### Precipitation
- **mm** — metric (millimeters per hour or per day)
- **inches** — imperial
- Snowfall: **cm** (metric) or **inches** (imperial)

### Pressure
- **hPa** (hectopascals) = mbar — standard meteorological unit
- **inHg** (inches of mercury) — US usage
- Trend (rising/falling) more useful than absolute value

### UV Index
- WMO standard scale: 0–2 (Low), 3–5 (Moderate), 6–7 (High), 8–10 (Very High), 11+ (Extreme)
- Unitless integer

### Air Quality
- **AQI** (Air Quality Index) — US EPA standard: 1–6 (Good to Hazardous)
- **DEFRA** index — UK standard
- Individual pollutants: CO, NO₂, O₃, SO₂, PM2.5, PM10 in μg/m³

### Weather Condition Codes
- **WMO WW codes** — open-meteo.com uses these (0=clear sky, 1-3=partly cloudy, 45/48=fog, 51-67=drizzle/rain, 71-77=snow, 80-82=showers, 85-86=snow showers, 95=thunderstorm, 96/99=hail)
- **OpenWeatherMap codes** — proprietary codes (800=clear, 801-804=clouds, 2xx=thunderstorm, 3xx=drizzle, 5xx=rain, 6xx=snow, 7xx=atmosphere)
- WeatherAPI.com uses its own condition code system with icons

### Time
- ISO 8601 format from APIs (`2026-04-28T14:00`)
- Display in local timezone (critical — always resolve to user's location timezone)
- Unix timestamps common in API responses

---

## 4. Key User Scenarios

### Scenario A: Morning Commuter (Daily, High Frequency)
**Context:** Checking before leaving home
**Needs:** Current conditions, today's hourly forecast, precipitation probability, feels-like temp
**Time budget:** < 5 seconds
**Device:** Mobile phone, often glanced at quickly
**Critical data:** "Will I need an umbrella at 6pm?"

### Scenario B: Event Planner (Weekly)
**Context:** Deciding when to hold outdoor event
**Needs:** 7-day forecast with daily high/low, precipitation probability, wind
**Time budget:** 30–60 seconds browsing
**Critical data:** "Which day this weekend is best for a barbecue?"

### Scenario C: Traveler (Occasional, High Importance)
**Context:** Planning packing for a trip
**Needs:** Multi-day forecast for a different city, temperature ranges, general conditions
**Time budget:** Several minutes
**Critical data:** "Will it be cold/rainy in Berlin next week?"

### Scenario D: Outdoor Activity (Situational, Safety-Critical)
**Context:** Hikers, cyclists, runners, gardeners
**Needs:** Wind speed/gusts, precipitation probability by hour, UV index, sunrise/sunset
**Time budget:** 2–5 minutes of detailed review
**Critical data:** "Is it safe to summit at 2pm? When does lightning risk peak?"

### Scenario E: Safety Monitoring (Rare but Urgent)
**Context:** Severe weather approaching
**Needs:** Government alerts/warnings, hourly precipitation, wind warnings
**Time budget:** Immediate
**Critical data:** "Is a tornado/hurricane/blizzard coming to my area?"

---

## 5. Common Pain Points with Existing Weather Apps

### P1 — Data Accuracy & Trust
- Forecast accuracy degrades sharply beyond 5 days
- Hyperlocal accuracy is poor (airport vs. your neighborhood)
- Users blame the app when forecasts are wrong, even if the underlying model is at fault
- **Mitigation:** Show data update timestamps; source the model name; use "feels like" to compensate

### P2 — Information Overload
- Many apps pack too much data per screen, especially on mobile
- Users can't find the key answer quickly
- **Mitigation:** Progressive disclosure — surface the top 3 facts first; hide details on interaction

### P3 — Unit Mismatch
- US users getting Celsius; non-US users getting Fahrenheit
- No easy toggle, or toggle buried in settings
- **Mitigation:** Auto-detect locale + visible toggle on main screen

### P4 — Location Issues
- "Current location" permission denied → no weather displayed
- Location search ambiguity (multiple cities named the same)
- Slow or failed geocoding
- **Mitigation:** Graceful fallback to city name search; handle permission denial with clear messaging

### P5 — Stale Data
- Displaying cached data as if current
- No indication of when data was last fetched
- API rate limiting causing silent failures
- **Mitigation:** Show "last updated" timestamp; clear error states for API failures

### P6 — Timezone Confusion
- Showing UTC times instead of local times
- Sunrise/sunset in wrong timezone
- API returns UTC; app must convert to location's local timezone
- **Mitigation:** Always use the location's timezone, not the user's browser timezone

### P7 — Poor Offline/Error Handling
- Blank screen on network failure
- No cached previous data shown
- **Mitigation:** Cache last successful response with timestamp; show stale-but-labeled data

### P8 — Accessibility Gaps
- Color-only weather severity indicators (color blindness)
- Small tap targets for mobile
- Missing alt text on weather icons
- No screen reader support for forecast data
- **Mitigation:** See Accessibility section below

---

## 6. Accessibility & Usability Concerns

### Color Blindness (8% of males)
- Weather severity scales (green/yellow/orange/red for warnings) are color-coded
- Rain probability bars are often color-only
- **Must do:** Pair color with labels, icons, and/or patterns
- UV index color scale must have text labels (Low/Mod/High/Very High/Extreme)
- AQI color bands must have text equivalents

### Screen Reader Support
- Weather icons must have descriptive `alt` text ("Partly cloudy" not "cloud-icon.png")
- Temperature readings should be expressed as numbers with units in aria labels
- Forecast tables/lists need proper semantic HTML (use `<table>` or ARIA roles for forecast rows)
- Dynamic data updates should use `aria-live` regions for screen readers

### Motor/Touch Accessibility
- Minimum touch target: 44×44px (Apple HIG) / 48×48dp (Material Design)
- Avoid swipe-only interactions without fallback buttons
- Forecast scroll areas need adequate affordance

### Cognitive Load
- Weather is often checked under time pressure (rushing out the door)
- Simplicity > completeness for the primary view
- Color coding should follow conventions: blue=cold, red=hot, grey=cloud, yellow=sun

### Internationalization (i18n)
- RTL language support for Arabic, Hebrew, etc.
- Date formats vary (MM/DD vs DD/MM vs YYYY-MM-DD)
- Number formats (1,234.5 vs 1.234,5)
- Temperature/wind unit preferences by region
- Wind cardinal directions in local language

### Performance Accessibility
- Users in lower-bandwidth regions or on mobile data
- Keep initial page weight low; icons as SVG or lightweight sprite
- Weather data is small JSON; this is not the bottleneck — images/animations are

---

## 7. Weather API Landscape (for Frontend-Only Apps)

### Recommended: Open-Meteo (FREE, no API key required)
- **URL:** https://api.open-meteo.com/v1/forecast
- **Cost:** Completely free for non-commercial use (no API key needed)
- **Data:** Current, hourly, 15-minutely, daily forecasts up to 16 days
- **Variables:** Temperature, humidity, precipitation, wind, UV index, pressure, visibility, sunrise/sunset, WMO weather codes
- **Units:** Configurable (metric/imperial)
- **Rate limit:** Fair use (no hard published limit for reasonable personal use)
- **Source:** Multiple national weather models (ECMWF, GFS, DWD, etc.)
- **Confidence:** HIGH (official documentation verified)

### Alternative: OpenWeatherMap (Free tier with API key)
- **Free tier:** 1,000 calls/day, current weather + 5-day/3-hour forecast
- **Requires:** API key registration (free account)
- **Note:** Paid tier needed for hourly forecast beyond free tier limits
- **Confidence:** HIGH (official documentation verified)

### Alternative: WeatherAPI.com (Free tier with API key)
- **Free tier:** 1,000,000 calls/month, 3-day forecast
- **Requires:** API key registration
- **Strengths:** Pollen, astronomy, marine, sports data
- **Confidence:** HIGH (official documentation verified)

### Recommendation for this project
Use **Open-Meteo** — no API key needed eliminates a key friction point for users cloning/running the app, ideal for a simple demo/learning project. Rich data, excellent documentation, and genuinely free.

---

## 8. Domain-Specific Standards & Conventions

### WMO Weather Interpretation Codes (used by Open-Meteo)
```
0        Clear sky
1,2,3    Mainly clear, partly cloudy, overcast
45,48    Fog
51,53,55 Drizzle (Light/Moderate/Dense)
61,63,65 Rain (Slight/Moderate/Heavy)
71,73,75 Snow fall (Slight/Moderate/Heavy)
77       Snow grains
80,81,82 Rain showers (Slight/Moderate/Violent)
85,86    Snow showers (Slight/Heavy)
95       Thunderstorm
96,99    Thunderstorm with hail
```

### "Feels Like" / Apparent Temperature Calculation
Apparent temperature combines:
- **Wind Chill** (cold temperatures): perceived coldness from wind
- **Heat Index** (hot + humid): perceived heat from humidity
- Open-Meteo combines these automatically as `apparent_temperature`
- OpenWeatherMap calls this `feels_like`

### Forecast Accuracy Expectations (important for user trust)
- 1-day: ~90% accurate for temperature within ±2°C
- 3-day: ~80% reliable
- 5-day: ~70% reliable
- 7-day: ~50% reliable (rough guidance only)
- Beyond 10 days: climatological average, not true forecast
- **UI implication:** Consider visual treatment that conveys decreasing confidence at longer range

---

## 9. Feature Priority for MVP

### Must Have (P0)
1. Current conditions (temp, feels like, condition icon, humidity, wind)
2. Today's high/low
3. Precipitation probability
4. Location search (city name input)
5. Unit toggle (°C / °F)
6. 7-day daily forecast

### Should Have (P1)
7. Hourly forecast (next 24h)
8. UV index
9. Sunrise/sunset times
10. Wind gusts + direction
11. Visibility
12. Responsive mobile layout

### Nice to Have (P2)
13. Geolocation (current location detection)
14. Multiple saved locations
15. Animated weather backgrounds/icons
16. Air quality index
17. Weather alerts/warnings

### Explicitly Out of Scope (for simple frontend app)
- Historical weather data
- Radar maps
- Push notifications (requires backend)
- User accounts (requires backend)
- Hyperlocal station data
- Agricultural/marine/road risk APIs

---

## 10. Anti-Features to Avoid

| Anti-Feature | Why Avoid |
|--------------|-----------|
| **Autoplay video ads** | Industry cliché; destroys trust and performance |
| **Excessive push notification requests** | Frontend-only app shouldn't need this |
| **Overloaded primary view** | Users need 1 answer fast, not 30 data points |
| **No error handling for API failures** | Blank screens lose users permanently |
| **Hiding the unit toggle** | Burying °C/°F in settings is a common complaint |
| **Ignoring timezone** | Showing UTC times breaks all time-dependent data |
| **Fake "precision"** | Showing temperature as "18.47°C" instead of "18°C" erodes trust |

---

## Sources

- Open-Meteo API Documentation: https://open-meteo.com/en/docs (HIGH confidence, official)
- OpenWeatherMap Current Weather API: https://openweathermap.org/current (HIGH confidence, official)
- WeatherAPI.com Documentation: https://www.weatherapi.com/docs/ (HIGH confidence, official)
- WMO UV Index guidelines: https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index (standard reference)
- Open-Meteo WMO weather code table: from official API docs (HIGH confidence)
- Unit conventions: verified against Open-Meteo API parameter definitions (HIGH confidence)
- User scenario analysis: synthesized from domain knowledge + API data structures (MEDIUM confidence — based on established UX patterns for information-seeking apps)

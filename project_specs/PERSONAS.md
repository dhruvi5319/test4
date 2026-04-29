# PERSONAS — Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-04-29 |
| **Related PRD** | PROJECT.md |
| **Research Sources** | .planning/research/SUMMARY.md, .planning/research/ux.md |
| **Author** | Pivota Spec Personas Generator |

---

## Persona Summary Table

| ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Marcus Webb | Daily Commuter | Get a go/no-go clothing decision in under 10 seconds every morning |
| PER-02 | Priya Nair | Weekend Outdoor Planner | Reliably plan multi-day outdoor activities using accurate forecasts |
| PER-03 | Donna Hartley | Casual Checker | Get a quick, plain-English weather answer without navigating a cluttered app |

---

## PER-01: Marcus Webb — The Daily Commuter

**Age:** 31  
**Occupation:** Account Manager at a downtown marketing firm  
**Location:** Chicago, IL

### Role & Context

Marcus commutes 45 minutes each way by train and foot — a 10-minute walk from the station to his office exposed to whatever the weather has decided to do. Every weekday morning, between brewing coffee and grabbing his bag, he opens a weather app on his phone. The decision tree is simple: coat or no coat, umbrella or not, lighter layers because it's warmer than yesterday. He checks weather on his iPhone 14 while standing in his kitchen, usually while doing something else. He has 15–20 seconds of attention to spare before he has to leave. He checks weather again around lunch to decide whether to walk to a nearby restaurant or order in, and sometimes once more in the late afternoon to plan the commute home.

Marcus has tried Weather.com and AccuWeather but abandons them out of frustration — by the time the page loads and he's dismissed an ad, he's already running late. He uses `wttr.in` occasionally because it's fast, but the ASCII output feels like a developer toy and he has to squint to parse it. He wants something that loads fast, looks clean, and gives him the answer before he has to think about it.

### Goals

- See the current temperature and "feels like" value instantly — no scrolling, no loading spinner (F0: current conditions)
- Know if it will rain during his commute windows: 8–9 AM and 5–6 PM (F1: hourly forecast with precipitation %)
- Get today's high/low at a glance so he can decide on layers (F0: current conditions — high/low)
- Switch between °C and °F without digging through settings (F1: unit toggle, localStorage persisted)

### Pain Points

- Current apps take 3–6 seconds to load and the first thing visible is an ad or a location permission popup — he's already annoyed
- Precipitation probability is buried under two taps; he wants it front and center
- Weather.com shows 12 metrics before he can see the temperature — data overload for a 15-second check
- Hourly forecast cards on AccuWeather overflow off the screen on mobile; he has to pinch-zoom to see 9 AM
- The unit is sometimes wrong (°F when he expects °C or vice versa) and there's no visible toggle

### Technical Comfort Level

**Intermediate.** Comfortable with any web app or native app. Does not read documentation, does not explore settings menus. If the answer isn't visible in 2 seconds, he assumes the app is broken or slow and closes it.

### Top Tasks

1. **Check current temperature + feels-like** (daily, multiple times — critical)
2. **Scan hourly precipitation % for commute windows** (daily — high)
3. **Read today's high/low** to choose outerwear (daily — high)
4. **Glance at tomorrow's forecast** to plan bag contents the night before (3–4×/week — medium)
5. **Toggle °F ↔ °C** when sharing a screenshot with a non-US colleague (occasional — low)

### Context of Use

- **Device:** iPhone 14, primarily mobile browser or PWA
- **When:** 7:30–8:00 AM kitchen check; 12:00 PM lunch decision; 4:30–5:00 PM commute-home check
- **Environment:** Standing, one hand, often glancing between app and coffee — zero tolerance for friction
- **Session length:** 10–20 seconds per check

### Success Criteria

- Reaches current temperature + condition within 2 seconds of page load, no scroll required
- Sees hourly precipitation % for the next 12 hours without more than one tap
- Completes a typical morning weather check in under 15 seconds
- Never encounters a blank screen or invisible spinner while waiting for data

---

## PER-02: Priya Nair — The Weekend Outdoor Planner

**Age:** 38  
**Occupation:** Landscape architect, freelance  
**Location:** Portland, OR

### Role & Context

Priya spends most of her working hours outdoors — site visits, client walkthroughs, and her own weekend hiking and cycling habit that she treats as non-negotiable. Weather isn't a casual curiosity for her; it's an operational variable. Every Thursday or Friday she blocks time to check the 5–7 day forecast and decide which weekend activities are go, which need to move, and what gear to pack. She checks weather on both her laptop (during planning sessions at her desk) and her Android phone (quick checks while on site or mid-hike). She is comfortable reading detailed weather data — precipitation probability, wind speed, UV index, and sunrise/sunset times are all meaningful to her, not noise.

Priya's frustration with existing apps is not about overload — it's about inaccuracy and unreliability. She has been burned by apps that show "20% chance of rain" on Sunday only for the forecast to flip to 80% by Saturday evening, with no indication the forecast had changed. She also finds that many apps show day-level forecasts without sufficient hourly granularity — knowing it rains "on Sunday" is useless; she needs to know if the rain clears by 10 AM or arrives at noon. She trusts apps that show data freshness timestamps and that clearly source from authoritative weather services.

### Goals

- Plan outdoor activities 5–7 days out with confidence in forecast accuracy (F1: 7-day daily forecast)
- Identify the specific hours a rain window opens and closes on a given day (F1: hourly forecast)
- Check wind speed and UV index before cycling and hiking trips (F2: weather details panel)
- Know exactly when sunrise and sunset fall for dawn hikes and evening site visits (F2: sunrise/sunset)
- Trust that the data she's seeing is current — not 4 hours stale (F1: "Updated N minutes ago" freshness indicator)
- Use the app on both desktop and mobile with the same quality experience (F0: responsive layout)

### Pain Points

- Most apps show only day-level precipitation (e.g., "Rain Sunday") with no hourly breakdown — useless for planning a morning hike around afternoon storms
- Forecast accuracy feels low and no app communicates forecast confidence or data freshness
- Wind data and UV index are buried 3–4 taps deep or missing entirely on mobile layouts
- Desktop layouts on Weather.com and AccuWeather are dominated by ads, sponsored content, and irrelevant widgets (news, pollen, traffic) — she has to visually hunt for the actual forecast
- No "last updated" timestamp means she can't tell if she's seeing the 6 AM model run or the noon update
- Temperature in the wrong unit with no quick toggle (she works with both US and European clients)

### Technical Comfort Level

**High.** Comfortable with data-dense web apps, browser developer tools, and reading API documentation as a layperson. Will actively explore settings and secondary views. Expects responsiveness and accurate data over visual sparkle. Uses dark mode on her laptop.

### Top Tasks

1. **Read the 7-day forecast to identify viable outdoor days** (weekly, Thursday/Friday planning session — critical)
2. **Drill into hourly forecast for a specific day** to find rain windows (weekly — critical)
3. **Check wind speed + UV index** before outdoor trips (2–3×/week — high)
4. **Confirm sunrise/sunset time** for dawn hikes and dusk site visits (weekly — high)
5. **Verify forecast freshness** via "last updated" timestamp before committing to plans (weekly — medium)
6. **Search a remote trailhead location by name** rather than her home city (monthly — medium)

### Context of Use

- **Devices:** 14" MacBook Pro (planning sessions, desk); Samsung Galaxy S23 (on-site, mid-hike quick checks)
- **When:** Thursday/Friday afternoons for weekend planning; morning-of confirmation check; sporadic mid-activity checks
- **Environment:** Desk (laptop, full attention); field conditions (phone, one hand, bright sunlight, gloves)
- **Session length:** 3–8 minutes for planning sessions; 20–40 seconds for quick checks

### Success Criteria

- Can build a complete outdoor activity plan for the weekend in a single 5-minute session using only this app
- Hourly forecast is accessible within one tap from the 7-day view — no re-search required
- Wind speed and UV index are visible without more than two taps from the main screen
- "Last updated" timestamp is always visible on the current conditions screen
- Desktop layout shows 7-day forecast without requiring horizontal scroll or pagination

---

## PER-03: Donna Hartley — The Casual Checker

**Age:** 57  
**Occupation:** Retired school librarian, part-time volunteer at a community garden  
**Location:** Tucson, AZ

### Role & Context

Donna checks the weather a few times a week — mostly when she's deciding whether to spend the afternoon at the garden or stay in, or when family is visiting and she wants to know what to expect. Weather for Donna is a background fact of life, not a planning exercise. She doesn't track precipitation probability or UV index; she wants to know "will it be hot today?" and "is rain coming?" in the plainest possible terms. She uses an older iPad (iPad 7th gen) at home on her kitchen table and occasionally her iPhone SE (2nd gen) when she's out.

Donna is not intimidated by technology, but she is intolerant of complexity. She bookmarked a weather site five years ago, but it now auto-plays video ads and she can't find the temperature without scrolling past a news feed. She tried asking her smart speaker instead, which works fine for "is it raining," but she likes seeing the week laid out visually. She uses the same two or three apps for everything and does not download new ones without a specific reason. A well-designed web app that loads fast and looks trustworthy is exactly what she would use instead if she knew it existed.

Donna represents the largest single group of weather app users — people whose only job-to-be-done is a simple present-state confirmation with zero tolerance for interface friction or visual noise.

### Goals

- Know immediately whether today is hot, mild, cool, or rainy — without parsing numbers (F0: condition icon + text label + temperature)
- See whether rain is expected this week without tapping into any sub-views (F1: 7-day forecast, above the fold or one scroll)
- Avoid being pestered by account creation prompts, push notification requests, or ads (project constraint: no account system; no notifications)
- Use the app comfortably on an older iPad without layout breakage or tiny text (F0: responsive layout, readable typography)
- Not worry about accidentally changing a setting or losing her current view (F0: no complex navigation)

### Pain Points

- Auto-playing video ads on Weather.com are startling and she can't find the close button — she leaves the site
- AccuWeather's "feels like" explanation, pollen count, and allergy index appear before the temperature — she finds it overwhelming and confusing
- Apps that require or heavily push location permissions feel intrusive; she prefers to just type her city
- Text is often too small on weather apps on her iPad — she enlarges it in Settings but layouts break
- Apps that load a spinner for 4+ seconds feel unresponsive; she taps again, which sometimes refreshes the wrong thing
- Push notification permission dialogs on every visit feel like harassment
- The °C/°F issue trips her up when visiting her sister in Canada — there's no obvious way to switch

### Technical Comfort Level

**Basic–Intermediate.** Comfortable navigating websites and apps she already knows. Will not explore unfamiliar UI patterns. If a control isn't obviously labeled, she won't find it. Pinch-to-zoom is a fallback she uses when text is too small. Does not use browser DevTools or app settings beyond the top-level screen.

### Top Tasks

1. **Read today's temperature and condition at a glance** — "Is it hot/mild/cold, is it sunny/rainy?" (several times/week — critical)
2. **Scan the 7-day forecast** to know which days are good for garden visits (weekly — high)
3. **Search her city by name** when the app doesn't auto-detect her location (every visit — high)
4. **Switch to a different city** when family is visiting or she's traveling (occasional — medium)
5. **Read the high/low** to decide whether afternoon outdoor plans are comfortable (several times/week — medium)

### Context of Use

- **Devices:** iPad 7th gen (primary, home/kitchen table); iPhone SE 2nd gen (occasional, out of the house)
- **When:** Morning, before deciding on the day's outdoor plan; occasionally evening to check next day
- **Environment:** Kitchen table, relaxed, full attention — but low patience for confusion
- **Session length:** 15–30 seconds; she is done as soon as she has her answer

### Success Criteria

- Reaches a readable current temperature and condition icon within 3 seconds of opening the page — no permission dialogs, no ads, no spinner
- Today's forecast plus the next 7 days are visible in a single scroll or less
- Text is readable at default system font size on a 10.2" iPad (no pinch-zoom required)
- Zero modal popups, account prompts, or push notification requests on any visit
- A complete "is it a good garden day?" check takes under 20 seconds from first load

---

## Persona Relationships

| Persona | Interacts With | Nature of Interaction |
|---|---|---|
| PER-01 Marcus (Commuter) | PER-03 Donna (Casual) | Shares the instant-answer use case; differs in frequency and data needs |
| PER-01 Marcus (Commuter) | PER-02 Priya (Planner) | Shares mobile-first context; differs in session depth and data complexity tolerance |
| PER-02 Priya (Planner) | PER-01 Marcus (Commuter) | Priya's desktop session produces the same data Markus skims in 15s on mobile |
| PER-02 Priya (Planner) | PER-03 Donna (Casual) | Opposite ends of data tolerance — Priya's "more details" is Donna's "too much" |
| PER-03 Donna (Casual) | PER-01 Marcus (Commuter) | Both want fast load + no friction; Donna has lower tech tolerance and longer page-load patience |

These three personas do not directly interact with each other in the product — the app has no social or collaboration features. The relationship table describes design tensions the team should track: features that serve PER-02 (data depth) must not impose on PER-01 and PER-03 (speed and simplicity). Progressive disclosure is the resolution pattern.

---

## Feature–Persona Matrix

Features derived from PROJECT.md requirements and research-validated P0/P1 feature list.

| Feature | Description | PER-01 Marcus | PER-02 Priya | PER-03 Donna |
|---|---|---|---|---|
| **F0** | Search by city/location name | Primary | Primary | Primary |
| **F1** | Current conditions (temp, feels-like, condition icon+text) | Primary | Primary | Primary |
| **F2** | Today's high / low | Primary | Primary | Primary |
| **F3** | Precipitation probability (current day) | Primary | Primary | Secondary |
| **F4** | Hourly forecast — next 24h (icon, temp, precip%) | Primary | Primary | None |
| **F5** | 7-day daily forecast (icon, high/low, precip%) | Secondary | Primary | Primary |
| **F6** | °C / °F unit toggle (persisted in localStorage) | Secondary | Secondary | Secondary |
| **F7** | Weather details panel (UV, wind, humidity, visibility) | None | Primary | None |
| **F8** | Sunrise / sunset times | None | Primary | None |
| **F9** | "Updated N minutes ago" freshness indicator | None | Primary | Secondary |
| **F10** | GPS / geolocation (opt-in, with graceful fallback) | Secondary | Secondary | Secondary |
| **F11** | Condition-aware background (sky gradient by weather/time) | Secondary | None | Primary |
| **F12** | Skeleton loading states + error states | Primary | Secondary | Primary |
| **F13** | Responsive layout (mobile + desktop parity) | Primary | Primary | Primary |
| **F14** | Day/night weather icon variants | Secondary | Secondary | Primary |
| **F15** | Accessible contrast + ARIA labels (WCAG AA) | Secondary | Secondary | Primary |

**Key:** Primary = core to this persona's success / pain point resolution · Secondary = useful but not essential · None = not relevant to this persona's use case

---

*Personas generated: 2026-04-29*  
*Derived from: PROJECT.md · .planning/research/SUMMARY.md · .planning/research/ux.md*  
*Next downstream documents: JTBD, User Stories, Journey Maps*

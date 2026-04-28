# UX Research: Simple Weather App

**Focus Area:** UX — Patterns, Hierarchy, Visual Conventions, Accessibility, Mobile
**Researched:** 2026-04-28
**Overall Confidence:** HIGH (primary sources: Nielsen Norman Group, W3C WCAG 2.2, OpenWeatherMap official docs)

---

## 1. Information Hierarchy — What Users Expect First

Weather apps must answer one question instantly: **"What is the weather like RIGHT NOW, and do I need to change my plans?"**

### Primary tier (above the fold, immediately visible)
| Data Point | Rationale |
|---|---|
| Current temperature (large, dominant) | #1 user mental model for weather |
| "Feels like" temperature | More actionable than raw temp (wind chill, humidity) |
| Current condition (icon + text label) | Visual shortcut + textual fallback for accessibility |
| Location name | Confirms the user is looking at the right place |
| High / Low for today | Planning horizon = today |

### Secondary tier (scroll or tap to reveal)
| Data Point | Rationale |
|---|---|
| Hourly forecast (next 12–24 hours) | "Should I bring an umbrella at 3pm?" |
| 7-day forecast summary | Weekend planning; secondary usage pattern |
| Precipitation probability % | Most-asked secondary metric |
| Wind speed + direction | Relevant for outdoor activities |
| Humidity | Comfort indicator |
| UV index | Health/skin context |
| Sunrise / Sunset | Daylight planning |

### Tertiary tier (advanced / expandable)
| Data Point | Rationale |
|---|---|
| Visibility | Driving conditions |
| Pressure | Power users / aviation |
| Dew point | Advanced comfort metric |
| Air quality index | Growing relevance; not expected by all users |

**Pattern:** Apply **progressive disclosure** (Nielsen Norman Group, 2006 — verified). Show primary tier by default; secondary tier via scroll; tertiary on explicit user action ("More details"). This satisfies both casual and power users without cognitive overload.

---

## 2. Layout and Visual Conventions

### Hero Section (Current Conditions)
- **Large temperature numeral** is the dominant visual element — typically 64–96px, center-aligned on mobile
- Condition icon positioned above or beside temperature (left-align icon on desktop, above on mobile)
- Background color/gradient shifts with condition and time-of-day to reinforce status (sky blue for clear, grey for overcast, dark blue for night). This is convention, not gimmick — Weather.com, Apple Weather, and Google Weather all use it
- **Do NOT rely on color alone** for condition communication (WCAG 1.4.1, Level A — verified). Always pair color change with icon + text label

### Forecast Cards (Horizontal Scroll or Grid)
- **Hourly forecast:** horizontal scroll row of compact cards
  - Each card: time + icon + temperature
  - Minimum card width: ~60px; minimum tap target height: 44px / 10mm (WCAG 2.5.8 + NN/G touch research)
- **7-day forecast:** vertical list of rows or fixed grid
  - Each row: day name + icon + high / low temp + precipitation %
  - Visual convention: high temp right-aligned, low temp grayed/smaller beside it

### Temperature Display
- Show **both °C and °F**, or detect locale and show primary with toggle. Never force one.
- High = bold/warm color accent; Low = muted/cooler accent
- "Feels like" always paired with actual temp, never standalone

### Icon System (standard taxonomy — HIGH confidence, OpenWeatherMap official docs verified)
| Condition Group | Display Priority |
|---|---|
| Clear sky (day/night) | 01d / 01n |
| Few clouds | 02d / 02n |
| Scattered / broken clouds | 03d, 04d / 03n, 04n |
| Shower rain | 09d / 09n |
| Rain | 10d / 10n |
| Thunderstorm | 11d / 11n |
| Snow | 13d / 13n |
| Mist / fog / haze / dust | 50d / 50n |

**Recommendation:** Use animated SVG icons for current conditions (subtle animation = sunny rays rotating, rain drops falling), static SVG for forecast cards (performance + visual noise). The **Lucide** icon library or a dedicated weather icon set (e.g., Erik Flowers' weather-icons) maps well to this taxonomy.

**Always include day/night variants** — showing a sun icon at 11pm is a user trust violation.

---

## 3. Search / Location Experience

### Core Pattern (HIGH confidence — NN/G verified)
1. **Visible search box at top of page** — not hidden behind a magnifying glass icon click on the primary surface
2. **Auto-suggest as user types** — show city + country/state suggestions after 2+ characters (reduces wrong-city ambiguity e.g., "Springfield" exists in 35 US states)
3. **GPS / current location detection** — offer on first load via browser Geolocation API with clear permission prompt copy: "Allow [App] to use your location to show local weather"
4. **Recent locations** — persist last 3–5 searched locations in localStorage; show as quick chips under search box
5. **No "Advanced Search"** — weather apps don't need it; keep one input field only

### Search UX Anti-patterns to avoid
- Requiring full city + country code entry with no suggestion
- Forcing location permission before any content loads (blocks users who refuse)
- No error state for invalid/not-found location queries ("We couldn't find 'Lnodon'. Did you mean London?")
- Overwriting the previous location without confirmation

### Fallback Logic
If geolocation denied → show last searched location → if none, show search-empty state with prompt to enter city.

---

## 4. Mobile-First Considerations

### Touch Targets (HIGH confidence — NN/G Aurora Harley, 2019 — verified)
- Minimum interactive element size: **44 × 44px** (Apple HIG) / **1cm × 1cm physical size** (NN/G research)
- WCAG 2.5.8 (Level AA, WCAG 2.2): minimum 24×24 CSS pixels — treat 44px as the practical target
- Forecast cards in horizontal scroll must be wide enough to tap without precision
- Location search input: full-width on mobile

### Viewport & Layout
- **Single column** layout on mobile (< 640px)
- **Two column** on tablet/desktop: current conditions left, details right
- Current conditions card: full viewport width on mobile — users should not need to scroll to see today's temp + condition
- Bottom navigation (if needed) is preferred to hamburger menus on mobile — thumb reach zone

### Performance
- Mobile sessions average **72 seconds** (NN/G verified). Weather data must load in < 2s. Use skeleton screens during API fetch, not blank white
- Cache last-fetched weather data in localStorage with timestamp; show cached data immediately while refreshing in background (stale-while-revalidate pattern)
- Defer loading of 7-day forecast until after current conditions render

### Gestures (MEDIUM confidence — industry standard, unverified against user testing)
- Swipe down on current conditions to manually refresh
- Swipe left/right on hourly forecast cards to scroll
- Avoid non-standard gestures (pinch to zoom on weather maps is ok; shake to change location is a gimmick)

---

## 5. Accessibility Standards

### Color Usage (HIGH confidence — W3C WCAG 2.2 verified)
**WCAG 1.4.1 (Level A): Color must NOT be the only means of conveying information.**
- Do NOT rely on sky gradient color alone to convey "sunny" vs "rainy" — always pair with icon + text label
- If precipitation probability uses a colored bar, also show the percentage number
- Condition icon SVGs must have `aria-label` or adjacent visible text

### Contrast (HIGH confidence — W3C WCAG 2.2 verified)
**WCAG 1.4.3 (Level AA): Minimum contrast ratio 4.5:1 for normal text, 3:1 for large text (≥18pt / 14pt bold).**
- Temperature numerals are typically large scale → minimum 3:1 against background
- Condition description text (regular size) → minimum 4.5:1
- White text on sky-blue background is a common weather app failure — **test all condition backgrounds**
- Night mode dark backgrounds: white text (#fff) on dark (#1a1a2e) easily achieves 12:1+ — safe
- Sunny yellow/white text on bright sky-blue frequently fails — use dark text or strong contrast overlay

### Screen Reader Support
- Weather icons (decorative when accompanied by text) → `aria-hidden="true"` + adjacent visible text
- Icons used standalone (forecast cards where only icon shown) → `role="img" aria-label="Rain"`
- Temperature values: `<span aria-label="72 degrees Fahrenheit">72°F</span>`
- Live region for dynamically updated weather data: `aria-live="polite"`

### Non-text Contrast (WCAG 1.4.11, Level AA)
- UI components (search input border, buttons) need 3:1 contrast against adjacent colors

### WCAG 1.3.3: No sensory-only instructions
- "The icon above shows your current conditions" fails — pair with text

---

## 6. Micro-interactions That Enhance Weather UX

### Loading States
- **Skeleton screens** (not spinners) during initial data load — sketch the temperature and card shapes
- **Stale data indicator**: subtle "Updated 5m ago" timestamp; no jarring refresh animations

### Current Conditions Animation (MEDIUM confidence — industry pattern, not formally studied)
- Subtle ambient animations tied to condition improve perceived quality without distraction:
  - Clear: soft sun pulse / gentle rays rotation
  - Rain: falling rain drops at low opacity in background
  - Snow: slow-falling snowflake particles
  - Cloudy: slowly drifting cloud layer
  - Thunderstorm: occasional subtle lightning flash
- **Key constraint:** `prefers-reduced-motion` media query must disable all animations (WCAG 2.3.3, Level AAA advisory — best practice)

### Temperature Unit Toggle
- °F ↔ °C toggle: instant visual switch with brief scale-fade transition on the number
- Persist preference in localStorage

### Location Change
- When switching locations, fade-out old weather card, fade-in new — no jarring jump
- Brief "Updating weather for [City]..." status message

### Forecast Hover / Focus States
- Desktop: hover on forecast day card reveals precipitation details tooltip
- All hover states must also be keyboard-focus states (WCAG 2.4.7)

---

## 7. Common UX Mistakes in Weather Apps

### Critical Mistakes (cause significant user dissatisfaction)

**1. Hiding current conditions below the fold**
- The app's only job is to answer "what's the weather now?" — if that requires scrolling, the app has failed
- Prevention: current temp + condition = first visual hierarchy, full width hero on mobile

**2. Color-only condition communication**
- Blue background = rain? Users with color blindness don't know. WCAG 1.4.1 violation
- Prevention: icon + text label always accompany background color changes

**3. No day/night icon variants**
- Showing a sun icon at 9pm destroys user trust. The data feels wrong even when it's correct
- Prevention: pass day/night flag from API (OpenWeatherMap provides `dt`, `sunrise`, `sunset`)

**4. Forcing location permission before showing any UI**
- Users who decline permission see nothing — they leave
- Prevention: show last-cached or default location data immediately; offer GPS upgrade

**5. Contrast failures on dynamic backgrounds**
- White text on gradient backgrounds that shift with weather conditions frequently fails contrast at 4.5:1
- Prevention: test all condition states + all times of day in accessibility checker

### Moderate Mistakes

**6. Overwhelming users with data density**
- Showing humidity, pressure, dew point, UV, visibility, wind gust all at once
- Prevention: progressive disclosure — secondary data collapsed by default

**7. Ambiguous temperature display**
- "72 / 58" — is this F or C? High or Low? AM or PM?
- Prevention: always label units; label High/Low explicitly

**8. No empty/error states**
- API timeout = blank screen with no explanation
- Prevention: show last cached data with "Unable to refresh — showing data from [time]" message

**9. Missing precipitation probability**
- Users consistently report P(rain) as the #1 secondary data point they seek
- Prevention: show rain % prominently in both hourly and daily forecast rows

**10. Non-responsive forecast cards**
- Fixed-width forecast cards that overflow on small screens
- Prevention: CSS `overflow-x: auto` on forecast container; cards use `min-width` not `width`

### Minor Mistakes

**11. Tiny tap targets on forecast scroll**
- Forecast hour cards often shrink to ~30px width on mobile
- Prevention: enforce minimum 44px tap target height; allow horizontal scroll

**12. Animations that ignore `prefers-reduced-motion`**
- Background weather animations can trigger vestibular disorders
- Prevention: `@media (prefers-reduced-motion: reduce)` disables all CSS animations

**13. No "last updated" timestamp**
- Users can't tell if they're looking at stale data from this morning
- Prevention: display "Updated [time]" below current conditions; auto-refresh every 10-15 minutes

---

## 8. Visual Design Conventions Summary

| Convention | Recommendation | Confidence |
|---|---|---|
| Background adapts to weather | Yes — sky gradient shifts with condition | HIGH (industry standard) |
| Day/night icon variants | Required | HIGH (OpenWeatherMap docs) |
| Temperature as dominant element | Yes — largest text on screen | HIGH (universal pattern) |
| Animated current conditions | Optional but enhances quality | MEDIUM |
| Horizontal scroll for hourly | Yes — swipeable card row | HIGH (industry standard) |
| Vertical list for 7-day | Yes — scannable daily rows | HIGH (industry standard) |
| Color for condition status | Only as supplement, never only cue | HIGH (WCAG 1.4.1) |
| Unit toggle (°F/°C) | Required — persist in localStorage | HIGH |
| Precipitation % on cards | Yes — show on both hourly + daily | HIGH |

---

## Sources

| Source | URL | Confidence | Notes |
|---|---|---|---|
| NN/G: Mobile UX Limitations | https://www.nngroup.com/articles/mobile-ux/ | HIGH | Authoritative; official research |
| NN/G: Progressive Disclosure | https://www.nngroup.com/articles/progressive-disclosure/ | HIGH | Authoritative; official research |
| NN/G: Touch Target Size | https://www.nngroup.com/articles/touch-target-size/ | HIGH | 1cm×1cm minimum; physical measurement |
| NN/G: Search Visible & Simple | https://www.nngroup.com/articles/search-visible-and-simple/ | HIGH | Authoritative; search box patterns |
| WCAG 2.2 SC 1.4.1 Use of Color | https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html | HIGH | Official W3C standard |
| WCAG 2.2 SC 1.4.3 Contrast Minimum | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | HIGH | Official W3C standard; 4.5:1 AA |
| OpenWeatherMap Icon/Condition Codes | https://openweathermap.org/weather-conditions | HIGH | Official API documentation |
| WCAG 2.2 Quickref (2.5.8 Target Size) | https://www.w3.org/WAI/WCAG22/quickref/ | HIGH | Official W3C standard |

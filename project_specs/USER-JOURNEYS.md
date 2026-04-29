# USER JOURNEYS — Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-04-29 |
| **Related Personas** | PERSONAS.md (PER-01 Marcus Webb, PER-02 Priya Nair, PER-03 Donna Hartley) |
| **Related PRD** | PRD.md |
| **Related Roadmap** | .planning/ROADMAP.md |
| **Author** | Pivota Spec Journeys Generator |

---

## Journey Index

| JRN-ID | Persona | Scenario | Key Features | Stage Count |
|---|---|---|---|---|
| JRN-01.1 | PER-03 Donna Hartley | First-time user checks weather using GPS auto-detect | F0, F1, F3, F4, F5, F10 | 6 |
| JRN-01.2 | PER-01 Marcus Webb | User searches for weather in a different city | F0, F1, F2, F4, F5 | 5 |
| JRN-02.1 | PER-02 Priya Nair | User plans a weekend outdoor trip using 7-day forecast + details | F0, F3, F6, F7, F8, F9 | 7 |
| JRN-03.1 | PER-01 Marcus Webb | Mobile morning commute — quick glance check | F1, F2, F4, F5, F7 | 5 |
| JRN-04.1 | PER-01 / PER-03 | Error scenario: API failure and city-not-found | F0, F7, F12 (error states) | 5 |

---

## Journeys by Persona

---

## JRN-01.1 — First-Time User Checks Weather Using GPS

**Persona:** PER-03 Donna Hartley — The Casual Checker
**Device:** iPad 7th gen, home kitchen table, relaxed and full attention
**Trigger:** Donna decides she might visit the community garden this afternoon and wants to know if it will be hot or rainy. She heard about this app from a neighbour and typed the URL into Safari for the first time.
**Goal:** Confirm whether today is a good garden day in under 20 seconds — without signing up for anything or being pestered by ads.
**Related Features:** F0 (Location Search & GPS), F1 (Current Conditions), F3 (7-Day Forecast), F4 (Icons), F5 (Responsive Layout), F10 (GPS Geolocation)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Arrive** | Types URL into Safari, page loads | App landing state (empty search, GPS button visible) | "Oh good, it loaded fast. No ads jumping out at me." | Cautiously optimistic | Past experience: weather sites autoplay videos and show a spinner for 5 seconds | Sub-2s load with a clean hero — no ad, no modal — earns immediate trust |
| **2. Orient** | Scans the screen — sees a search bar and a small GPS icon next to it | Location bar (F0) — search input + GPS button | "Should I type my city or tap that little icon? I think that's for my location." | Slightly uncertain | GPS icon may not be obviously labeled; she's used to typing a city name | Clear ARIA label + visible tooltip text: "Use my location" removes ambiguity |
| **3. Request Location** | Taps the GPS button; browser shows a permission dialog | Browser geolocation permission dialog | "Will this app share my location with someone? I hope it's just for the weather." | Mildly anxious | Permission dialogs feel surveillance-like to less technical users | Inline micro-copy before the tap: "We only use this to show your local weather — never stored." |
| **4. Allow & Load** | Taps "Allow" in the browser dialog; skeleton loading state appears briefly | Skeleton loading state (F7 / F12) → Current conditions hero (F1) | "Okay, something's loading… there it is! 'Tucson, AZ — 94°F, Sunny.'" | Relieved, satisfied | A loading spinner with no visible progress feels broken; she may tap again | Skeleton screen (not blank, not spinner) shows structure while data fetches — she knows something is coming |
| **5. Read Answer** | Reads large temperature display, sunny icon, and high/low — doesn't scroll | Current conditions hero (F1), condition icon (F4), high/low | "94°F high, 78°F low. That's hot. Better go in the morning." | Confident, done | If "feels like" and the actual temp are too close in visual weight, she may misread | Make current temp dominant (large font), feels-like clearly secondary — she gets the answer without parsing |
| **6. Check the Week** | Scrolls down one swipe, scans the 7-day row | 7-day forecast (F3), condition icons (F4) | "Let me see… sunny all week except Thursday looks different. Good." | Content, satisfied | If 7-day forecast requires a second tap or sub-page, she won't bother | 7-day forecast visible in one swipe from the hero — no tap required |

### Key Moments

- **Decision Point — Stage 2:** Does she use the GPS button or type her city? If the GPS button is not clearly labeled with text ("Use my location"), she will skip it and type — costing extra steps and potentially getting a wrong result. The GPS button must have a visible text label or tooltip, not just an icon.
- **Risk of Abandonment — Stage 3:** The browser location permission dialog is outside the app's control, but the framing matters. If no micro-copy prepares her for the dialog, she may feel surveilled and decline — then face the blank search bar with no guidance.
- **Delight Opportunity — Stage 4:** The skeleton loading state is a small but crucial moment. If the screen stays visually structured (bones of the layout visible) rather than blank, Donna infers "it's working" and waits those extra 1–2 seconds with confidence.
- **Delight Opportunity — Stage 5:** A condition-aware background gradient (sky blue on a clear sunny day) communicates "sunny" before she reads the text. For Donna, the visual answer arrives before the cognitive answer — this is the ideal.

### Success Outcome

Donna confirms it will be 94°F and sunny today, and sees at a glance that the week is mostly clear except Thursday — all within 20 seconds of opening the app, with zero account prompts, no ads, and no pinch-zooming required on her iPad.

### Feature Touchpoints

| Stage | Features Involved |
|---|---|
| Arrive | F5 (Responsive Layout), F4 (Condition-aware background) |
| Orient | F0 (Location bar — GPS button) |
| Request Location | F10 (GPS Geolocation — browser permission) |
| Allow & Load | F7 (Freshness indicator), F12 (Skeleton loading state) |
| Read Answer | F1 (Current Conditions), F4 (Icons), F6 (°C/°F toggle visible) |
| Check the Week | F3 (7-Day Forecast), F4 (Icons) |

---

## JRN-01.2 — User Searches for Weather in a Different City

**Persona:** PER-01 Marcus Webb — The Daily Commuter
**Device:** iPhone 14, standing in his kitchen at 7:45 AM
**Trigger:** Marcus is flying to New York next Tuesday and wants to know what the weather will be like there while packing his bag tonight — but first he's running his standard morning check for Chicago. He needs to switch to a different city quickly and efficiently.
**Goal:** Search for New York, get the current conditions + a quick read on the week, then close the app — all in under 30 seconds.
**Related Features:** F0 (Location Search & Autocomplete), F1 (Current Conditions), F2 (Hourly Forecast), F4 (Icons), F5 (Responsive Layout)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Switch Context** | Taps the city name / search bar at the top to change location | Location bar (F0) — currently showing "Chicago, IL" | "Let me just tap the city and type the new one." | Neutral, habitual | If tapping the city name doesn't open the search input immediately, he'll be confused — he expects this to be the location-switch control | Make the full location bar / city name a clearly tappable target that opens the search input on tap |
| **2. Type & Select** | Types "New Y" and immediately sees autocomplete suggestions; taps "New York, NY, USA" | Autocomplete dropdown (F0) | "There it is. Second option." | Efficient, satisfied | Autocomplete that fires only after 3+ characters feels laggy; wrong suggestions at the top waste a tap | Fire autocomplete after 2 characters; rank most-populous / most-common results first so "New York, NY" is always in the top 2 |
| **3. Load New Location** | Selection triggers immediate data fetch; skeleton state appears | Skeleton loading state → Current conditions hero (F1) | "Loading… okay, 62°F in New York. Chillier than Chicago right now." | Focused | If the previous city's data lingers for more than 500ms before the skeleton appears, it's disorienting — he might think his tap didn't register | Immediately replace content with skeleton on selection (zero flicker of stale data) |
| **4. Scan Conditions** | Reads temperature, condition icon, and precipitation % without scrolling | Current conditions hero (F1), precipitation % (F3) | "Partly cloudy, 62°F, 30% rain chance. Probably fine. Light jacket." | Decisive, confident | If precipitation % is buried below the fold on mobile, he makes his decision with incomplete data | Show precip% in the hero section — it's Marcus's #1 decision variable |
| **5. Quick Hourly Check** | Swipes the hourly row to check the Tuesday forecast window | Hourly forecast row (F2) | "Wait, this is today's hourly. I need next Tuesday — the 7-day will have to do." | Slightly frustrated | Hourly forecast is for the next 24h, not next week — he realizes this mid-swipe and pivots to the 7-day list | Opportunity: in a future release, let users tap a day in the 7-day to see that day's hourly (progressive drill-down) |

### Key Moments

- **Decision Point — Stage 2:** If the autocomplete requires 3+ characters or shows irrelevant results first, Marcus will abandon and search manually — costing 5–10 extra seconds in a 15-second total budget.
- **Risk of Abandonment — Stage 3:** Stale data (Chicago weather) remaining visible for more than 500ms after he selects New York will make him doubt whether his tap registered. He may tap again, triggering a double request.
- **Delight Opportunity — Stage 2:** Recent location chips ("Chicago, IL · New York, NY") below the search input let Marcus switch cities in one tap after the first visit — no typing at all on return trips.

### Success Outcome

Marcus identifies New York's current conditions (62°F, partly cloudy, 30% rain chance) and gets a feel for the week via the 7-day row — all within 25 seconds of tapping the location bar. He decides to pack a light jacket and closes the app.

### Feature Touchpoints

| Stage | Features Involved |
|---|---|
| Switch Context | F0 (Location bar — tap-to-search) |
| Type & Select | F0 (Autocomplete suggestions, recent chips) |
| Load New Location | F12 (Skeleton state), F7 (Freshness indicator resets) |
| Scan Conditions | F1 (Current Conditions), F3 (Precip % in hero) |
| Quick Hourly Check | F2 (Hourly Forecast), F3 (7-Day Forecast) |

---

## JRN-02.1 — Weekend Trip Planning Session

**Persona:** PER-02 Priya Nair — The Weekend Outdoor Planner
**Device:** 14" MacBook Pro, at her desk on Friday afternoon
**Trigger:** It's Thursday afternoon. Priya wants to plan a weekend cycling ride and a Sunday hike. She opens the weather app to decide which day works for which activity, which route is appropriate for the wind, and whether she needs to pack rain gear.
**Goal:** Build a complete outdoor plan for Saturday and Sunday in a single 5–8 minute session — knowing which hours are rain-free, what the UV and wind look like, and whether her data is current.
**Related Features:** F0 (Search), F3 (7-Day Forecast), F6 (Details Panel), F7 (Freshness Indicator), F8 (Sunrise/Sunset), F9 (Updated timestamp)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open & Locate** | Opens the app in Chrome; the app remembers Portland from yesterday via localStorage chip | Location bar (F0) — recent location chip: "Portland, OR" | "Good, it still has Portland. Let me just click that." | Efficient, businesslike | If the app opens with an empty search bar and no memory, she re-types her city every session — a minor but repeated annoyance | Recent location chips persisted in `localStorage` make the return visit frictionless |
| **2. Verify Data Freshness** | Immediately looks for the "Updated N minutes ago" timestamp | Freshness indicator (F9) in current conditions hero | "Updated 4 minutes ago — good. This is the noon model run." | Confident, trusting | If there's no freshness timestamp, she cannot know if she's looking at 6 AM data or current data — this is a trust-breaker for her | Always-visible "Updated X min ago" indicator below the current conditions block; this single element can unlock Priya's confidence |
| **3. Read 7-Day Overview** | Scans the 7-day daily forecast list without horizontal scrolling | 7-day forecast (F3) — vertical list, desktop layout | "Saturday looks okay — partly cloudy, 40% rain. Sunday looks better — 15% rain. Let me look at Saturday's hours." | Analytical, focused | Desktop apps that put the 7-day behind a tab or require horizontal scrolling interrupt her scanning rhythm | On desktop, render 7-day as a vertical list visible without scroll or pagination — all 7 days in one glance |
| **4. Drill Into Hourly** | Clicks Saturday's row to expand or navigate to Saturday's hourly view | 7-day row → hourly forecast for Saturday (F2) | "So the 40% rain — is that all day or just afternoon? If it clears by 10 AM I can still ride." | Cautiously hopeful | Apps that only show a day-level precip summary without hourly breakdown make this question unanswerable — she has been burned by this | Hourly forecast accessible within one tap from the 7-day row; no re-search, no page navigation |
| **5. Check Wind & UV** | Expands the "Details" panel to read wind speed, direction, and UV index | Weather details panel (F6) | "Wind NW at 12 mph — manageable for cycling. UV 7 — I need sunscreen." | Prepared, methodical | If the details panel is buried behind 3+ taps or is mobile-only, she skips this and guesses — which affects safety | Details panel collapsed by default (doesn't clutter casual views) but expands with a single click/tap — Priya's patience for exploration is high |
| **6. Check Sunrise/Sunset** | Reads sunrise and sunset times within the expanded details panel | Details panel (F6) — sunrise/sunset section (F8) | "Sunrise at 5:52 AM Saturday. If I leave at 6:15 I'll have light from the start. Perfect." | Delighted, decisive | If sunrise/sunset display uses UTC rather than Portland's local timezone, the times are wrong — a critical trust failure | `timezone=auto` on all Open-Meteo calls + `Intl.DateTimeFormat` ensures local times are always correct |
| **7. Confirm Plan & Close** | Writes her plan notes, closes app | (Off-app — notebook or calendar) | "Saturday: cycling 8 AM–noon before rain risk rises. Sunday: trail hike, full day. Done." | Satisfied, confident | None at this stage — app has answered all her questions | Consider: a future "Share forecast" feature for sharing the weekend plan with hiking partners |

### Key Moments

- **Decision Point — Stage 3:** If the 7-day view shows Saturday with "40% rain" but gives no hourly breakdown on click, Priya cannot make her go/no-go decision and will open a competing app for the hourly view. She will not return.
- **Decision Point — Stage 6:** If sunrise/sunset times are displayed in UTC rather than Portland local time, the displayed time ("13:52 UTC" or incorrect "8:52 AM") makes her plan wrong. This is a silent critical error — she won't know until she's in the field in the dark.
- **Risk of Abandonment — Stage 2:** If no freshness timestamp exists, Priya opens the browser DevTools to look at the network request timestamp. If she sees a 6-hour-old response, she closes the app permanently.
- **Delight Opportunity — Stage 5:** The Details panel collapsed by default serves both Priya and Marcus simultaneously — Priya can expand it for depth; Marcus never sees it and isn't slowed down. This is progressive disclosure working correctly.

### Success Outcome

Priya builds her full weekend activity plan (Saturday: cycling 8 AM–noon; Sunday: hike all day) using only this app in a 6-minute session. She knows wind is manageable, UV is high enough for sunscreen, rain risk is post-noon Saturday only, and sunrise is 5:52 AM. She trusts the data because the freshness indicator confirmed it's 4 minutes old.

### Feature Touchpoints

| Stage | Features Involved |
|---|---|
| Open & Locate | F0 (Recent location chips, localStorage) |
| Verify Data Freshness | F9 (Updated timestamp / freshness indicator) |
| Read 7-Day Overview | F3 (7-Day Forecast), F5 (Desktop responsive layout) |
| Drill Into Hourly | F2 (Hourly Forecast), F3 (7-day tap-to-hourly) |
| Check Wind & UV | F6 (Weather Details Panel — UV, wind speed, wind direction) |
| Check Sunrise/Sunset | F6 (Details Panel), F8 (Sunrise/Sunset — local timezone) |
| Confirm Plan | (Off-app completion — no feature needed) |

---

## JRN-03.1 — Mobile Morning Commute: Quick Glance Check

**Persona:** PER-01 Marcus Webb — The Daily Commuter
**Device:** iPhone 14, one hand, standing in kitchen, coffee in the other hand, 7:48 AM
**Trigger:** Marcus's alarm went off 20 minutes ago. He's about to walk out the door. He needs one answer in the next 15 seconds: umbrella or no umbrella?
**Goal:** Determine if rain is likely during his 8–9 AM walk from the train station to the office — without unlocking a second screen, without scrolling more than once.
**Related Features:** F1 (Current Conditions), F2 (Hourly Forecast), F4 (Icons), F5 (Responsive Mobile Layout), F7 (Freshness)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Open App** | Unlocks phone, taps app bookmark / PWA icon | App loads — current conditions hero visible immediately | "Come on, load fast." | Impatient, time-pressured | A 3–5 second blank screen or loading spinner makes him close the app before data appears | Sub-2 second first meaningful content; skeleton state during any brief fetch ensures he sees structure immediately |
| **2. Read Temperature** | Glances at the large temperature figure — "58°F, Feels like 52°F" | Current conditions hero (F1) — temperature, feels-like | "Colder than I thought. Definitely a coat." | Decided on coat — efficient | If feels-like and actual temp have equal visual weight, he reads the wrong one first | Actual temp visually dominant (large); feels-like clearly labeled "Feels like" in smaller text below |
| **3. Read Precipitation** | Scans for the rain probability figure in the hero | Current conditions hero (F1) — precipitation probability (F3) | "35% rain chance. Borderline. I need to see the 8 AM hour specifically." | Uncertain — needs more | If precipitation % is not in the hero and requires scrolling, he makes his decision with less information — and may be wrong | Precip% displayed in the hero card, not below the fold |
| **4. Scan Hourly Row** | Swipes horizontally on the hourly forecast row; finds the 8 AM card | Hourly forecast (F2) — horizontal scroll row | "8 AM: 55°F, 60% rain. 9 AM: 57°F, 50%. Okay. Umbrella." | Clear, decisive | If hourly cards are too small to read without zooming (touch targets < 44px), or if 8 AM isn't visible without scrolling 3+ swipes, he gives up | Show the next 6 hours at glance-width; the upcoming commute window (8–9 AM) should be within one swipe for a 7:45 AM check |
| **5. Close & Act** | Locks phone, grabs umbrella from the rack | (Off-app) | "Good call. Now let's go." | Confident, relieved | None — the app answered the question correctly and fast | If a small "rain likely during your commute" contextual note appeared at 7:45 AM based on the hourly, it would feel magical — future feature (requires push/notification, deferred) |

### Key Moments

- **Decision Point — Stage 3:** The 35% precip in the hero is ambiguous — Marcus doesn't act on it. His real decision happens at Stage 4 when he sees 60% at 8 AM specifically. If the hourly row is inaccessible or illegible on mobile, he flips a coin.
- **Risk of Abandonment — Stage 1:** Marcus has zero tolerance for a slow load. If he sees a blank screen for more than 1.5 seconds, he already knows the weather from yesterday's experience and closes the app. The skeleton loading state is not optional — it is the feature.
- **Delight Opportunity — Stage 2:** The condition-aware background (grey, cloud-toned gradient at 7:48 AM on an overcast day) communicates "not sunny" before he reads a word. The visual answer lands 200ms before the cognitive one.

### Success Outcome

Marcus confirms 60% rain at 8 AM and grabs his umbrella — the right decision — in 12 seconds from app open to lock screen. He was never asked for a notification permission, never saw an ad, and never needed to scroll more than once.

### Feature Touchpoints

| Stage | Features Involved |
|---|---|
| Open App | F5 (Responsive Mobile Layout), F12 (Skeleton loading state) |
| Read Temperature | F1 (Current Conditions — temp + feels-like dominant display) |
| Read Precipitation | F1 (Precip % in hero), F4 (Condition icon + day/night variant) |
| Scan Hourly Row | F2 (Hourly Forecast — horizontal scroll, 44px targets, time + icon + temp + precip%) |
| Close & Act | (Off-app) |

---

## JRN-04.1 — Error Scenarios: API Failure & City Not Found

**Persona:** PER-01 Marcus Webb (API failure); PER-03 Donna Hartley (city not found)
**Device:** PER-01: iPhone 14 (commute check, spotty train WiFi); PER-03: iPad 7th gen (home, stable WiFi)
**Trigger (API failure):** Marcus opens the app on the train. The Open-Meteo API call fails — either a network timeout on cellular or a transient API error. He gets no weather data.
**Trigger (City not found):** Donna tries to search for her sister's town — "Campbellford, ON" — and misspells it as "Campbelford." The geocoding API returns no results.
**Goal (both):** The app must never show a blank screen. It must give a clear, helpful message that preserves dignity and offers a clear next step.
**Related Features:** F0 (Search), F7 (Error + stale state handling), F12 (Skeleton → error states)

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **1. Trigger Error (API)** | Marcus opens the app on the train; app attempts to fetch Chicago weather; network times out after 5s | Skeleton loading state (F12) → transitions to error state (F7) | "It's loading… still loading… something's wrong." | Impatient, then irritated | A skeleton that stays visible for 5+ seconds without feedback feels more broken than a spinner | After 3 seconds without response, show a subtle "Taking longer than usual…" sub-label below the skeleton |
| **2. See Error State (API)** | App displays friendly error: "Unable to load weather — check your connection. Showing data from 8 minutes ago." | Error state / stale cache fallback (F7) | "Oh, it's showing old data. At least I can see it." | Relieved (cached data exists), or frustrated (no cache) | If no cached data exists — first-time on this route — the screen must not be blank. It must show the friendly error with a retry button | If cached data exists: show it with a "stale data" badge. If no cache: show a friendly "Unable to load" message with a "Try again" button — never a blank screen |
| **3. Retry (API)** | Marcus taps "Try again" button | Retry trigger → new API request → skeleton → data loads | "Good, it loaded." | Relieved | If retry is not obvious (small link, hard-to-tap target), he'll just close the app | Large, clearly labeled "Try again" button (≥ 44px); also auto-retry silently in the background using TanStack Query's retry logic |
| **4. Trigger Error (City Not Found)** | Donna types "Campbelford" (misspelled); presses Search | Autocomplete dropdown shows no matching suggestions | "Hmm, nothing is showing up. Did I spell it wrong?" | Confused, mildly frustrated | If the autocomplete just shows an empty dropdown with no message, she doesn't know if the app is loading or if the name is wrong | On empty autocomplete results after a 500ms debounce: show "No results for 'Campbelford' — try a different spelling" inside the dropdown panel |
| **5. Recover (City Not Found)** | Donna sees the friendly "City not found" message, corrects to "Campbellford, Ontario," selects the result | Autocomplete dropdown → correct suggestion appears → weather loads | "Oh! Two L's. There it is." | Relieved, slightly amused | If the error message doesn't offer a concrete suggestion ("try a different spelling"), she may think the city is not supported rather than misspelled | Error message text: "No locations found for '[query]' — try checking the spelling, or search for the nearest major city." |

### Key Moments

- **Critical Moment — Stage 2 (API failure, no cache):** A blank white screen after a network failure is the single worst outcome in any web app. It communicates "broken." Every path through an API failure must render at least one visible, human-readable sentence. This is non-negotiable per PRD F7 and Phase 4 success criteria.
- **Critical Moment — Stage 2 (API failure, with cache):** Showing stale cached data with a visible "stale" indicator is significantly better than showing an error alone. Marcus gets his answer (even if 8 minutes old) and knows it's old. This is the ideal fallback path.
- **Risk of Abandonment — Stage 4 (City Not Found):** An empty autocomplete with no message looks like a bug, not a search result. Donna will try tapping the field again, then give up and ask her smart speaker instead. The in-dropdown "no results" message is the only thing that keeps her in the app.
- **Delight Opportunity — Stage 5:** Auto-correcting or offering a fuzzy match ("Did you mean: Campbellford, Ontario?") would recover Donna's experience gracefully. Even without auto-correct, a clear "try a different spelling" message is far better than silence.

### Success Outcome (API failure)
Marcus sees the last cached data (8 minutes old, clearly labeled), or a friendly error with a prominent retry button. He never sees a blank screen. He retries, data loads, and he gets his commute answer.

### Success Outcome (City not found)
Donna sees "No results for 'Campbelford' — try a different spelling" in the search dropdown, corrects to "Campbellford, Ontario," selects the suggestion, and sees her sister's city weather within 30 seconds of the first attempt.

### Feature Touchpoints

| Stage | Features Involved |
|---|---|
| Trigger Error (API) | F7 (Stale state handling), F12 (Skeleton → error transition) |
| See Error State | F7 (Friendly error message + cached data display) |
| Retry | F7 (Retry button — F0 refetch trigger) |
| Trigger (City Not Found) | F0 (Autocomplete — empty state handling) |
| Recover | F0 (Corrected search → suggestion → weather load) |

---

## Cross-Journey Patterns

### Common Pain Points (Appearing in 3+ Journeys)

- **Blank screen / invisible loading state** — Surfaces in JRN-01.1 (Donna, GPS load), JRN-03.1 (Marcus, commute), JRN-04.1 (error scenario). The skeleton loading state (F12) is the universal resolution pattern. It is a P0 requirement, not a polish item.
- **Precipitation % not visible without scrolling** — Appears in JRN-01.2 (Marcus, city search) and JRN-03.1 (Marcus, commute). Both depend on the same PRD requirement: precipitation % displayed in the current conditions hero, above the fold on mobile.
- **No freshness indicator** — Surfaces as a critical trust issue in JRN-02.1 (Priya) and JRN-04.1 (Marcus, stale cache). The "Updated N minutes ago" timestamp (F9) resolves both.
- **Slow or laggy autocomplete** — Appears in JRN-01.2 (Marcus, switching cities) and JRN-04.1 (Donna, city-not-found). Fire on 2 characters, rank sensibly, show empty-state message on no results.

### Shared Opportunities (Solvable Once, Benefits All Personas)

| Opportunity | Journeys | Resolution |
|---|---|---|
| Skeleton loading state replaces blank screen | JRN-01.1, JRN-03.1, JRN-04.1 | F12: skeleton component built in Phase 1 (non-deferrable) |
| Precipitation % in hero (above fold, mobile) | JRN-01.2, JRN-03.1 | F1: include precip% in the hero card layout |
| Recent location chips (localStorage) | JRN-01.2, JRN-02.1 | F0: recent chips persist in localStorage; one implementation |
| Freshness indicator always visible | JRN-02.1, JRN-04.1 | F9: "Updated N min ago" under current conditions |
| Accessible autocomplete with empty-state message | JRN-01.2, JRN-04.1 | F0: "No results for '[query]'" in-dropdown message |
| Condition-aware background communicates weather instantly | JRN-01.1, JRN-03.1 | F4: gradient shifts by weather state + time of day |

### Persona Convergence Points

The following journey stages are where multiple personas experience the **same touchpoint** with different depth of need:

| Touchpoint | Marcus (PER-01) | Priya (PER-02) | Donna (PER-03) |
|---|---|---|---|
| Current conditions hero | Scans in 3 seconds, done | Reads as confirmation before planning | Primary destination — the whole session |
| 7-day forecast | Glances at the week trend | Studies each day's hourly breakdown | Scans visually — sunny vs. rainy |
| GPS button | Uses occasionally | Uses occasionally on mobile | Tried once; primarily types city |
| Details panel (F6) | Never opens | Opens every planning session | Never opens |
| Error states | Needs fast retry path | Needs stale data + timestamp | Needs friendly, plain-English message |

**Design tension:** Features that serve Priya's depth (Details panel, hourly drill-down, freshness timestamp) must be invisible to Marcus and Donna unless they seek them out. Progressive disclosure is the correct resolution pattern — already specified in PRD F6.

---

## Journey-to-Feature Traceability

| Journey | Stage | Feature | Expected Outcome |
|---|---|---|---|
| JRN-01.1 | Allow & Load | F12 (Skeleton) | Never blank screen during GPS location fetch |
| JRN-01.1 | Read Answer | F1 (Current Conditions) | Donna reads temp + condition in ≤ 3 seconds |
| JRN-01.1 | Check the Week | F3 (7-Day) | 7-day visible in one scroll from hero |
| JRN-01.2 | Type & Select | F0 (Autocomplete) | Suggestions appear after 2 characters; correct city in top 2 |
| JRN-01.2 | Scan Conditions | F1 + F3 (Precip % in hero) | Marcus makes coat/umbrella decision without scrolling |
| JRN-01.2 | Recent Chips | F0 (localStorage chips) | Return visit: one-tap location switch, no re-typing |
| JRN-02.1 | Verify Freshness | F9 (Updated timestamp) | Priya sees "Updated 4m ago" — trusts the data |
| JRN-02.1 | Read 7-Day | F3 (7-Day Forecast) | Desktop: 7 days visible without scroll or pagination |
| JRN-02.1 | Drill Into Hourly | F2 (Hourly from 7-day tap) | Hourly accessible within 1 tap from 7-day row |
| JRN-02.1 | Check Wind & UV | F6 (Details Panel) | Details panel expands in 1 tap; UV + wind visible |
| JRN-02.1 | Check Sunrise/Sunset | F8 (Sunrise/Sunset — local TZ) | Times shown in Portland local time, not UTC |
| JRN-03.1 | Open App | F12 (Skeleton) | App shows skeleton within 300ms; data within 2s |
| JRN-03.1 | Read Precipitation | F1 (Precip % in hero) | 35% rain chance visible without scroll on iPhone 14 |
| JRN-03.1 | Scan Hourly Row | F2 (Hourly — touch targets) | 8 AM card readable, ≥ 44px targets, within 1–2 swipes |
| JRN-04.1 | See Error (API, cached) | F7 (Stale cache fallback) | Cached data shown with "data from 8m ago" label |
| JRN-04.1 | See Error (API, no cache) | F7 (Friendly error message) | "Unable to load weather" + retry button — never blank |
| JRN-04.1 | City Not Found | F0 (Empty state message) | "No results for '[query]'" shown in autocomplete dropdown |

---

## Validation Checklist

- [x] Every persona (PER-01, PER-02, PER-03) has at least one primary journey
- [x] Every journey maps to at least one PRD feature (F0–F12)
- [x] All journey stage tables have all columns populated (no empty cells)
- [x] Success outcomes are defined for each journey
- [x] Key moments identified in each journey (decision points, delight, abandonment risks)
- [x] Cross-journey patterns documented (4 common pain points, 6 shared opportunities)
- [x] Persona convergence points identified
- [x] Feature touchpoints reference valid PRD feature IDs
- [x] Journey-to-feature traceability table is complete
- [x] Error journeys cover both API failure and city-not-found paths
- [x] No all-positive emotional journeys — friction documented honestly in all 5 journeys

---

*User Journeys generated: 2026-04-29*
*Derived from: PERSONAS.md · PRD.md · .planning/ROADMAP.md*
*Next downstream documents: Story Maps, UX Wireframes, Sprint-Ready User Stories*

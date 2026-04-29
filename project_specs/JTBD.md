# JTBD — Simple Weather App

| Field | Value |
|---|---|
| **Product** | Simple Weather App |
| **Version** | 1.0 |
| **Date** | 2026-04-29 |
| **Related Personas** | PER-01 Marcus Webb · PER-02 Priya Nair · PER-03 Donna Hartley |
| **Related PRD** | project_specs/PRD.md |
| **Research Sources** | .planning/research/SUMMARY.md |
| **Author** | Pivota Spec JTBD Generator |

---

## JTBD Summary Table

| JTBD-ID | Persona | Job Statement (short form) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Marcus (Commuter) | Decide coat/umbrella before leaving the house | P0 |
| JTBD-01.2 | PER-01 Marcus (Commuter) | Scan commute-window precipitation risk at a glance | P0 |
| JTBD-01.3 | PER-01 Marcus (Commuter) | Check tomorrow's outlook the night before | P1 |
| JTBD-01.4 | PER-01 Marcus (Commuter) | Switch temperature units when sharing with colleagues | P2 |
| JTBD-02.1 | PER-02 Priya (Planner) | Identify which weekend days are viable for outdoor activity | P0 |
| JTBD-02.2 | PER-02 Priya (Planner) | Find the precise rain window within a specific day | P0 |
| JTBD-02.3 | PER-02 Priya (Planner) | Verify secondary conditions before a cycling or hiking trip | P1 |
| JTBD-02.4 | PER-02 Priya (Planner) | Confirm the data is fresh before committing to outdoor plans | P1 |
| JTBD-02.5 | PER-02 Priya (Planner) | Check weather for a remote trailhead, not her home city | P2 |
| JTBD-03.1 | PER-03 Donna (Casual) | Know immediately whether today is a good garden day | P0 |
| JTBD-03.2 | PER-03 Donna (Casual) | Scan the week to pick good outdoor days without sub-menus | P0 |
| JTBD-03.3 | PER-03 Donna (Casual) | Check weather for a city she's visiting or expecting visitors from | P1 |
| JTBD-03.4 | PER-03 Donna (Casual) | Use the app comfortably without fear of breaking something | P1 |

---

## PER-01: Marcus Webb — The Daily Commuter

---

### JTBD-01.1: Morning Go/No-Go Decision

**Job Statement:**
When I'm getting ready to leave for work and have 15 seconds before I need to grab my bag, I want to see the current temperature, feels-like value, and whether it will rain this morning, so I can decide on outerwear without stopping to think.

**Functional Job:** Minimize time from app open to clothing decision.
**Emotional Job:** Feel confident I won't be caught underdressed or soaked.
**Social Job:** Appear appropriately dressed at client meetings — not be "the person who didn't check the weather."

**Job Executor Context:**
- **When:** 7:30–8:00 AM, immediately before leaving home
- **Where:** Kitchen, standing, one hand, often while doing something else
- **Why now:** The decision window closes the moment he walks out the door

**Current Alternatives:**
- Opens Weather.com — waits 4–6 seconds through ad load, then hunts for temperature past a news feed
- Checks AccuWeather — dismisses a permission pop-up, then pinch-zooms an overflowing hourly row
- Occasionally uses `wttr.in` — fast but ASCII output requires mental parsing

**Hiring Criteria:**
- Current temperature and feels-like are visible above the fold within 2 seconds of page load — no scroll, no spinner
- Precipitation probability for the morning hours is visible without any tap
- App loads fully on mobile in under 2 seconds on a 4G connection
- Zero permission dialogs, zero ads on any visit

**Firing Criteria:**
- Any visit that produces a blank screen or spinner lasting more than 3 seconds
- Precipitation data buried behind a tap or a secondary screen
- A permission modal blocks the view before data is visible

**Success Measure:** Marcus can read current temp + feels-like + morning precip % and close the app within 15 seconds of opening it, with no scrolling and no taps beyond the initial city search.

**Related Features:** F0 (location search), F1 (current conditions), F2 (hourly forecast), F4 (weather icons), F5 (responsive layout), F7 (data freshness), F12 (skeleton + error states)
**Priority:** P0

---

### JTBD-01.2: Commute-Window Precipitation Scan

**Job Statement:**
When I'm deciding whether to walk to lunch or order in — or planning my trip home — I want to quickly scan precipitation probability for the next few hours, so I can avoid getting caught in rain during a 10-minute outdoor exposure window.

**Functional Job:** Reduce uncertainty about short-range rain risk for specific clock windows.
**Emotional Job:** Feel in control of my day rather than at the mercy of unpredictable weather.
**Social Job:** Not arrive at a client lunch drenched — maintain professional composure.

**Job Executor Context:**
- **When:** Around noon (lunch decision) and 4:30–5:00 PM (commute home planning)
- **Where:** Office desk or phone at desk — slightly more time than the morning check but still under 30 seconds
- **Why now:** The window for action (ordering food vs. walking; leaving early vs. waiting it out) closes in minutes

**Current Alternatives:**
- Navigates to a second tab on AccuWeather's hourly view — requires 2–3 taps and a page reload
- Asks a colleague who also doesn't know
- Just steps outside and checks, accepting the uncertainty

**Hiring Criteria:**
- Hourly forecast row shows precipitation % on every card, visible with one tap or no tap from the current conditions screen
- Cards for commute hours (8–9 AM, 5–6 PM) are reachable by horizontal scroll without pinch-zoom
- All hourly cards have minimum 44px touch targets on mobile

**Firing Criteria:**
- Precipitation % is absent from hourly cards
- Hourly row overflows off the screen and requires pinch-zoom to read
- Hourly forecast is behind a paywall or requires account sign-in

**Success Measure:** Marcus can locate the precipitation % for a specific clock hour within one tap and 10 seconds from the main screen.

**Related Features:** F2 (hourly forecast), F1 (current conditions), F4 (weather icons), F5 (responsive layout)
**Priority:** P0

---

### JTBD-01.3: Evening Tomorrow-Planning Check

**Job Statement:**
When I'm packing my bag the night before a workday, I want to quickly confirm tomorrow's forecast high/low and precipitation outlook, so I can decide whether to add a layer, bring an umbrella, or pack a rain jacket.

**Functional Job:** Reduce morning preparation time by planning ahead the night before.
**Emotional Job:** Feel organized and prepared rather than rushed and reactive.
**Social Job:** Not be visibly under- or over-prepared for weather compared to colleagues.

**Job Executor Context:**
- **When:** 9:00–10:00 PM, 3–4 nights per week
- **Where:** Home, phone or couch, more time available than morning check
- **Why now:** Last opportunity to pack appropriately before tomorrow's commute

**Current Alternatives:**
- Checks the same weather app he used that morning, scrolls to find "tomorrow"
- Relies on his phone's lock-screen weather widget, which sometimes shows wrong-unit data

**Hiring Criteria:**
- Tomorrow's forecast (high/low + precip %) is visible within the 7-day row without navigating to a separate screen
- Data is clearly labeled by day name (not just a date number)
- Unit preference from the morning check (°F) is still active — no reset between sessions

**Firing Criteria:**
- Unit preference resets every visit, requiring him to toggle again
- Tomorrow's data requires navigating to a separate page or sub-view

**Success Measure:** Marcus reads tomorrow's high/low and precipitation outlook in under 20 seconds from the main screen without changing any settings.

**Related Features:** F3 (7-day forecast), F1 (current conditions), F6 (unit toggle + localStorage)
**Priority:** P1

---

### JTBD-01.4: Unit Conversion for Colleague Communication

**Job Statement:**
When I want to share a weather screenshot with a colleague who uses Celsius, I want to switch the displayed temperature unit instantly, so I can communicate clearly without explaining conversion math.

**Functional Job:** Translate displayed values to the unit my audience expects.
**Emotional Job:** Feel competent and helpful rather than creating confusion.
**Social Job:** Appear internationally aware in a globally distributed team.

**Job Executor Context:**
- **When:** Occasional — a few times per month, during a Slack or Teams exchange
- **Where:** Wherever he's sitting when the conversation happens
- **Why now:** A colleague just asked "what's it like in Chicago today?" and expects Celsius

**Current Alternatives:**
- Does mental math (°F − 32 × 5/9) and types it in chat
- Opens a unit-converter website in a second tab
- Ignores the request or explains the °F value with a qualifier

**Hiring Criteria:**
- °C/°F toggle is visible on the main screen — no settings menus required
- Toggle applies instantly to all displayed values (current, hourly, daily)
- Preference is remembered for the next session via localStorage

**Firing Criteria:**
- Toggle is hidden inside a settings drawer that requires multiple taps
- Toggle applies only to current conditions but not hourly or daily rows
- Preference reverts to default on page reload

**Success Measure:** Marcus switches from °F to °C and back in under 5 seconds with one tap, with all displayed values updating immediately.

**Related Features:** F6 (unit toggle + localStorage), F1 (current conditions), F2 (hourly forecast), F3 (7-day forecast)
**Priority:** P2

---

## PER-02: Priya Nair — The Weekend Outdoor Planner

---

### JTBD-02.1: Identify Viable Outdoor Days for the Weekend

**Job Statement:**
When I sit down Thursday or Friday to plan my weekend outdoor schedule, I want to see a 7-day forecast that shows each day's precipitation probability, high/low, and condition icon at a glance, so I can decide which days are go and which need to be rescheduled without opening multiple apps or cross-referencing sources.

**Functional Job:** Compress a multi-source planning session into a single app interaction.
**Emotional Job:** Feel confident in my plans rather than anxious about making the wrong call.
**Social Job:** Be the reliable person who knows whether the weekend hike is happening — not the person who committed and then cancelled when it rained.

**Job Executor Context:**
- **When:** Thursday or Friday afternoon, during a dedicated 3–8 minute planning session
- **Where:** 14" MacBook Pro at her desk — full attention, not a quick glance
- **Why now:** Weekend commitments need to be confirmed or rescheduled by Friday evening

**Current Alternatives:**
- Weather.com: 7-day view is present but surrounded by ads, sponsored content, and news widgets — she visually hunts for the forecast row
- AccuWeather: Desktop layout shows only 3 days before requiring horizontal scroll or "see more"
- Cross-references two apps to verify — adds 5–10 minutes and still produces uncertainty

**Hiring Criteria:**
- 7-day daily forecast is a primary component visible without horizontal scroll on a 1024px+ desktop layout
- Each daily row shows: day name, condition icon, high, low, precipitation probability %
- Precipitation probability is shown for every day — never omitted or hidden behind a tap
- Recharts temperature trend visualization gives a week-long temperature shape at a glance
- No ads, news widgets, or sponsored content compete for visual attention

**Firing Criteria:**
- 7-day forecast requires horizontal scrolling or pagination on a desktop viewport
- Precipitation % is absent from daily rows
- Desktop layout is dominated by non-weather content (news, pollen, ads)

**Success Measure:** Priya can identify viable vs. non-viable weekend days and build a complete outdoor activity plan in a single 5-minute session using only this app, without opening a second source.

**Related Features:** F3 (7-day forecast), F1 (current conditions), F4 (weather icons), F5 (responsive layout), F7 (data freshness)
**Priority:** P0

---

### JTBD-02.2: Find the Precise Rain Window Within a Day

**Job Statement:**
When I'm planning a morning hike for a day that shows some precipitation, I want to drill into the hourly forecast for that specific day to see exactly when rain arrives and when it clears, so I can schedule my departure time around the window rather than cancelling the whole activity.

**Functional Job:** Replace day-level precipitation uncertainty with hour-level precision.
**Emotional Job:** Feel empowered to make smart decisions rather than defaulting to "play it safe and cancel."
**Social Job:** Be known as the person who accurately predicts whether a group outing will work out — not the over-cautious one who cancels when there was a workable window.

**Job Executor Context:**
- **When:** During the Thursday/Friday planning session, after identifying a "possibly viable" day in the 7-day view
- **Where:** Desk (laptop) or on-site (phone) — both contexts matter
- **Why now:** The go/no-go decision for a group activity depends on hour-level data, not day-level summaries

**Current Alternatives:**
- Most apps show only "Rain Sunday" with no hourly breakdown — she cancels or guesses
- Windy.com has hourly rain layers on a radar map — useful but complex to parse for a specific location
- Cross-references two weather sources for hourly data, averaging the result mentally

**Hiring Criteria:**
- Hourly forecast for a specific day is accessible within one tap from the 7-day view — no re-search required
- Each hourly card shows: time, condition icon (day/night variant), temperature, precipitation probability %
- Hourly view scrolls horizontally and covers at least 24 hours
- Day/night icon variants are correct per the location's local timezone — a sun icon never shows at 9 PM

**Firing Criteria:**
- Hourly forecast is not linked from the 7-day view — requires navigating back to main screen and re-selecting a day
- Precipitation % is absent from any hourly card
- Hourly data shows only 6–12 hours rather than the full 24-hour window

**Success Measure:** Priya can identify the opening and closing time of a rain window on a specific day within 40 seconds of viewing the 7-day forecast, without leaving the app.

**Related Features:** F2 (hourly forecast), F3 (7-day forecast), F4 (weather icons), F5 (responsive layout)
**Priority:** P0

---

### JTBD-02.3: Verify Secondary Conditions Before a Trip

**Job Statement:**
When I'm preparing for a cycling or hiking trip and precipitation looks acceptable, I want to quickly check wind speed, UV index, and sunrise/sunset times, so I can decide on sun protection, pacing, and whether to start at dawn or wait.

**Functional Job:** Consolidate secondary conditions into one app rather than checking specialist sources.
**Emotional Job:** Feel fully prepared — not surprised by unexpected wind, UV burn, or running out of daylight.
**Social Job:** Demonstrate trail awareness and planning competence to hiking or cycling partners.

**Job Executor Context:**
- **When:** Morning-of confirmation check, 2–3 times per week before outdoor trips
- **Where:** Phone (on-site or at home), sometimes laptop at desk
- **Why now:** Final prep window before departure; decisions about sunscreen, timing, gear are made here

**Current Alternatives:**
- Checks wind on one app, UV index on a separate UV-specific site, and sunrise on a third tool
- Weather.com buries wind and UV 3–4 taps deep on mobile — she often skips checking
- Accepts the uncertainty and brings extra gear as a hedge

**Hiring Criteria:**
- Wind speed + direction, UV index, and sunrise/sunset are accessible within two taps from the main screen
- These values are grouped in a progressive-disclosure "Details" panel — present but not cluttering the primary view for other users
- All sunrise/sunset times use the location's local timezone (not the browser's local timezone)
- Values are readable in bright sunlight on a phone screen (contrast ≥ 4.5:1)

**Firing Criteria:**
- Wind speed, UV index, or sunrise/sunset are missing from the app entirely
- Details panel requires more than two taps to reach from the main screen
- Sunrise/sunset shows the wrong time due to timezone handling errors

**Success Measure:** Priya reads wind speed, UV index, and sunrise time within two taps and 30 seconds of opening the app on her phone, even in bright outdoor conditions.

**Related Features:** F6 (secondary details panel — UV, wind, sunrise/sunset), F1 (current conditions), F5 (responsive layout), F8 (accessibility — contrast)
**Priority:** P1

---

### JTBD-02.4: Confirm Data Freshness Before Committing to Plans

**Job Statement:**
When I'm about to finalize plans for a weekend activity based on the forecast I'm seeing, I want to know exactly how recently the weather data was fetched, so I can trust I'm seeing the latest model run and not a 6-hour-old cached forecast that may have flipped.

**Functional Job:** Verify data currency before making an irreversible commitment.
**Emotional Job:** Feel that I can trust this app rather than worry I'm planning on stale information.
**Social Job:** Not be the person who confidently organized a group hike based on outdated data that the rest of the group knew was wrong.

**Job Executor Context:**
- **When:** At the end of a planning session, before confirming plans with others
- **Where:** Laptop at desk or phone while on-site
- **Why now:** Forecast data can shift dramatically between the 6 AM and noon model runs; she's been burned before

**Current Alternatives:**
- No app she uses shows a "last updated" timestamp — she has no way to verify freshness
- Closes and reopens the app hoping it re-fetches — sometimes it does, sometimes it doesn't
- Checks a second source and compares — if they agree, she trusts the data

**Hiring Criteria:**
- "Updated X minutes ago" timestamp is always visible on the current conditions screen — not behind a menu
- If data is older than 10 minutes, it re-fetches automatically on the next interaction
- If the network is offline, a clearly labeled "showing cached data from X minutes ago" notice is displayed

**Firing Criteria:**
- No freshness timestamp is shown anywhere in the app
- App shows stale data without any indication it hasn't refreshed
- Stale-data notice is a modal or interstitial that interrupts the workflow

**Success Measure:** Priya can confirm data freshness within 5 seconds of opening the app, without any additional taps, and the timestamp is always visible on the main screen.

**Related Features:** F7 (data freshness + stale state handling), F1 (current conditions), F5 (responsive layout)
**Priority:** P1

---

### JTBD-02.5: Check Weather for a Remote Trailhead Location

**Job Statement:**
When I'm planning a hike at a trailhead in a different county or region from where I live, I want to search for that specific location by name and get an accurate forecast for it, so I can plan gear and timing appropriate to conditions at the trailhead rather than my home city.

**Functional Job:** Access location-specific data for non-home locations without friction.
**Emotional Job:** Feel prepared for conditions at the actual destination, not a proxy location 30 miles away.
**Social Job:** Bring appropriate gear for the group — not be the person who checked "Portland" when the trailhead was at 3,500 feet elevation in a different microclimate.

**Job Executor Context:**
- **When:** Monthly, during weekend planning sessions for trips to unfamiliar areas
- **Where:** Laptop at desk during planning
- **Why now:** Trip planning requires location-specific data; home city weather is irrelevant

**Current Alternatives:**
- Types the trailhead name into Google Maps, finds the nearest town, then searches that town in her weather app
- Uses Windy.com's map — accurate but complex to read for specific conditions

**Hiring Criteria:**
- City name search with autocomplete suggests results after 2+ characters are typed
- Search results include smaller towns and named locations, not just major cities
- Recent searches persist as quick-select chips so she can switch back to her home city without re-typing

**Firing Criteria:**
- Search returns no results for smaller towns near trailheads
- Search requires the exact official city name with no tolerance for spelling variations
- Recent searches don't persist, requiring her to retype her home city after checking the trailhead

**Success Measure:** Priya successfully retrieves a forecast for a named trailhead town within 30 seconds of typing, without needing to navigate away from the app or open a map tool.

**Related Features:** F0 (location search + autocomplete + recent locations), F5 (responsive layout)
**Priority:** P2

---

## PER-03: Donna Hartley — The Casual Checker

---

### JTBD-03.1: Quick "Good Garden Day?" Confirmation

**Job Statement:**
When I'm deciding whether to spend the afternoon at the community garden, I want to immediately see today's temperature, condition, and whether rain is expected — in plain language — so I can decide whether to go without reading any numbers I have to interpret.

**Functional Job:** Reduce a "should I go outside?" decision to a single glance.
**Emotional Job:** Feel reassured and informed, not confused or overwhelmed by information I didn't ask for.
**Social Job:** Show up at the garden at the right time — not be caught in unexpected heat or rain.

**Job Executor Context:**
- **When:** Morning, before deciding on the day's plan; occasionally evening for next-day check
- **Where:** Kitchen table on her iPad 7th gen — seated, relaxed, full attention but low patience
- **Why now:** The garden decision needs to be made before she gets dressed and drives over

**Current Alternatives:**
- Opens a bookmarked Weather.com link — auto-play video ads start immediately; she can't find the close button and leaves
- Asks her smart speaker "is it raining?" — works for yes/no but doesn't give her a visual weekly picture
- Checks a TV channel's weather segment if it happens to be on

**Hiring Criteria:**
- Current temperature and weather condition (with icon + plain-English text label like "Sunny" or "Light Rain") are visible above the fold within 3 seconds of page load
- No permission dialogs, ads, push notification requests, or account prompts on any visit — ever
- Text is readable at default system font size on a 10.2" iPad without pinch-zooming
- Page layout does not break on a 768px viewport (iPad 7th gen native resolution)

**Firing Criteria:**
- Any auto-playing video or audio on page load
- Any modal, overlay, or permission dialog that blocks the weather data on first or subsequent visits
- Text is too small to read without manually enlarging in system settings, causing layout to break

**Success Measure:** Donna reads today's condition and temperature in plain language within 3 seconds of opening the page, with zero interaction required — no taps, no dismissals, no scrolling.

**Related Features:** F1 (current conditions — temp + condition icon + text), F4 (weather icons — day/night), F5 (responsive layout), F8 (accessibility — contrast + touch targets), F12 (skeleton loading + no blank screens), F11 (condition-aware background), F14 (day/night icon variants), F15 (WCAG AA contrast)
**Priority:** P0

---

### JTBD-03.2: Weekly Garden Day Scan

**Job Statement:**
When I'm thinking about which days this week will be good for the garden, I want to see the next 7 days' conditions in a single view without tapping into any sub-menus, so I can pick my best afternoons without having to think hard about the interface.

**Functional Job:** Identify optimal outdoor days across the week in one view.
**Emotional Job:** Feel informed and in control of my weekly schedule without feeling lost in the app.
**Social Job:** Show up at the garden on good days and coordinate with fellow volunteers without confusion.

**Job Executor Context:**
- **When:** Once or twice per week, usually after the daily check
- **Where:** Kitchen table on her iPad — same session as the current-conditions check
- **Why now:** Weekly garden schedule is planned informally but she likes to look ahead

**Current Alternatives:**
- Scrolls through Weather.com's 10-day view — it exists but she has to navigate past news and ads to find it
- Relies on her smart speaker: "what's the weather like this week?" — gives a summary but no visual layout she can refer back to

**Hiring Criteria:**
- 7-day forecast is visible in a single scroll from the current conditions screen — no additional tap or navigation required
- Each day shows a recognizable condition icon + high/low temperatures, readable without any zoom
- Icons use day/night variants so she can trust what she sees (no sun icon on a night row)
- No pagination or "show more" button required to see all 7 days

**Firing Criteria:**
- 7-day forecast requires navigating to a separate screen or tapping a "more" button
- Individual day rows are too small or cramped to read on an older iPad at default font size
- Forecast is missing days or shows fewer than 7 days without explanation

**Success Measure:** Donna can identify her best 2–3 garden days for the upcoming week within 20 seconds of arriving at the main screen, using only a single scroll and no taps.

**Related Features:** F3 (7-day forecast), F4 (weather icons), F5 (responsive layout), F14 (day/night icon variants), F15 (WCAG AA — contrast + touch targets)
**Priority:** P0

---

### JTBD-03.3: Check Weather for a Visiting Family Member's City

**Job Statement:**
When family is coming to visit from another city — or I'm traveling to see them — I want to quickly look up the weather for their location so I can prepare appropriate clothes or let them know what to pack, without navigating complex settings.

**Functional Job:** Access weather for a non-home location without disrupting my normal use of the app.
**Emotional Job:** Feel helpful and considerate toward family — not fumbling with an unfamiliar interface.
**Social Job:** Be the family member who came prepared and helped others prepare.

**Job Executor Context:**
- **When:** Occasional — a few times per month when family visits or she travels
- **Where:** iPad at home, unhurried
- **Why now:** Family member just called and she wants to relay the weather information

**Current Alternatives:**
- Types the city into Google Search and reads the weather card at the top
- Asks her smart speaker the city's weather
- Opens a separate bookmark for a weather site she only uses for "other cities"

**Hiring Criteria:**
- City name search bar is prominently placed and obviously labeled — she can find it without instructions
- Typing the city name and selecting from autocomplete results loads weather in under 2 seconds
- Switching back to her home city is straightforward — recent searches or a labeled "back" pattern

**Firing Criteria:**
- Search bar is hidden behind an icon or collapsed by default
- Selecting a new city navigates to a different screen with no obvious way to return
- The app requires location permission to function — she can't opt out and use city search instead

**Success Measure:** Donna successfully looks up weather for a family member's city and returns to her home city weather within 60 seconds, with no more than 3 taps total.

**Related Features:** F0 (location search + autocomplete + recent locations), F10 (geolocation — opt-in with graceful fallback), F5 (responsive layout)
**Priority:** P1

---

### JTBD-03.4: Use the App Without Fear of Breaking It

**Job Statement:**
When I'm using the app on my iPad and I see a control I don't recognize — like a toggle or an expand button — I want to be able to interact with it without worrying that I'll accidentally change something I can't undo or navigate to a place I don't know how to leave, so I can explore the app at my own pace without anxiety.

**Functional Job:** Navigate secondary controls with confidence that errors are reversible and obvious.
**Emotional Job:** Feel comfortable and safe exploring the app — not anxious that one wrong tap will break my experience.
**Social Job:** Not have to ask a family member to "fix" the weather app for me.

**Job Executor Context:**
- **When:** Occasional — when she notices a feature she hasn't used before (the unit toggle, the Details expand)
- **Where:** iPad at home, seated, time available
- **Why now:** Curiosity triggers this; she's not in a hurry

**Current Alternatives:**
- Avoids unfamiliar controls entirely — sticks to what she knows works
- Asks her daughter to show her how to use a new feature
- Accidentally triggers a setting, can't reverse it, and bookmarks a different weather site

**Hiring Criteria:**
- All controls are labeled in plain English (not icon-only) — she doesn't have to guess what a button does
- Progressive disclosure means secondary options (°C/°F toggle, Details panel) are available but don't clutter the main view
- No destructive actions exist — every control is reversible without page navigation
- No complex navigation patterns (tabs, sidebars, modals) that require understanding an unfamiliar mental model

**Firing Criteria:**
- A tap on any control navigates to a full new page with no back button visible
- The unit toggle silently changes units with no visual confirmation that the tap registered
- A settings change persists unexpectedly across visits (e.g., she accidentally switched to °C and can't find the toggle again)

**Success Measure:** Donna can tap any visible control on the main screen and immediately understand what it did — either from a label, an instant visible change, or both — with no state she cannot easily reverse.

**Related Features:** F5 (responsive layout), F6 (unit toggle — visible + labeled), F6 (secondary details panel — progressive disclosure), F8 (accessibility — ARIA labels), F15 (WCAG AA)
**Priority:** P1

---

## Cross-Cutting Jobs (All Personas)

These jobs apply regardless of persona. They represent shared hiring criteria that define the product's minimum viable trust level.

---

### JTBD-X.1: Load Useful Data Before Patience Runs Out

**Job Statement:**
When I open the app under any network condition, I want to see meaningful weather data — or at minimum a skeleton placeholder — within 2 seconds, so I can trust the app is working and stay rather than close it and open something else.

**Applies To:** PER-01 (15-second session budget), PER-02 (trusts reliability), PER-03 (low tolerance for "broken" feel)

**Hiring Criteria:**
- Time to first meaningful weather data ≤ 2 seconds on a simulated 4G connection
- Skeleton loading states fill the layout while data fetches — never a blank white screen
- On API failure, a clear error message appears — never a spinner that never resolves

**Success Measure:** Zero blank-screen states across all error and loading paths in manual testing.

**Related Features:** F12 (skeleton loading + error states), F7 (data freshness + stale state), F5 (responsive layout)
**Priority:** P0

---

### JTBD-X.2: Never Be Interrupted by the App's Own Needs

**Job Statement:**
When I open the app to check the weather, I want the app to immediately show me data — not ask me for account registration, push notification permissions, or location access — so I can complete my check without being diverted by the product's housekeeping demands.

**Applies To:** All personas — this is the #1 shared firing criterion across PER-01, PER-02, PER-03

**Hiring Criteria:**
- Zero modal dialogs, overlays, or permission requests on first or subsequent page loads
- Geolocation is opt-in via an explicit GPS button — never auto-requested on load
- No account creation required or promoted for any feature
- No push notification permission requests, ever

**Success Measure:** 100% of test sessions across all three personas complete without encountering any modal, permission dialog, or account prompt.

**Related Features:** F10 (geolocation — opt-in fallback), F0 (city search as primary path), F9 (attribution — no account system)
**Priority:** P0

---

### JTBD-X.3: Trust the Numbers Being Displayed

**Job Statement:**
When I read a temperature, precipitation probability, or wind speed value, I want to be confident the number is accurate, appropriately rounded, and reflects current conditions — not a stale cache, a suspiciously precise decimal, or the wrong unit — so I can make real decisions based on it.

**Applies To:** PER-01 (unit correctness), PER-02 (data freshness + accuracy), PER-03 (plain-language readability)

**Hiring Criteria:**
- Temperatures displayed as integers only (e.g., "18°C", never "18.47°C")
- Unit matches the user's saved preference from the previous session (localStorage persisted)
- Sunrise/sunset and hourly labels reflect the searched location's timezone, not the browser's timezone
- "Updated X minutes ago" timestamp is always visible when data is loaded

**Success Measure:** Zero instances of decimal temperature display, unit mismatch, or timezone-incorrect time labels in manual testing across all supported locations.

**Related Features:** F1 (current conditions), F6 (unit toggle + localStorage), F7 (data freshness), F2 (hourly forecast — timezone-correct labels)
**Priority:** P0

---

### JTBD-X.4: Use the App on Any Device Without Compromise

**Job Statement:**
When I open this app on my specific device — whether that's an older iPad, a high-density Android phone, or a 14" MacBook — I want the layout, text size, and interactive elements to work correctly at that viewport, so I don't have to adapt my behavior to work around the app's display problems.

**Applies To:** PER-01 (iPhone 14 mobile), PER-02 (MacBook Pro desktop + Android phone), PER-03 (iPad 7th gen + iPhone SE)

**Hiring Criteria:**
- Single responsive implementation covers 375px (iPhone SE) through 1280px+ (desktop) without horizontal overflow
- All touch targets are ≥ 44×44px on all mobile viewports
- Text is readable at default system font size on a 10.2" iPad (768px viewport) without zoom
- Desktop layout shows 7-day forecast without horizontal scroll or pagination

**Success Measure:** Zero layout overflows, zero illegible text, and zero sub-44px touch targets verified across 375px, 768px, 1024px, and 1280px+ viewports.

**Related Features:** F5 (responsive layout), F8 (accessibility — touch targets), F15 (WCAG AA contrast), F13 (responsive layout parity)
**Priority:** P0

---

## Outcome-to-Feature Traceability

| JTBD-ID | PRD Feature | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0 (Location Search) | Marcus finds his city with autocomplete in under 10 seconds |
| JTBD-01.1 | F1 (Current Conditions) | Temperature + feels-like + precip % visible above fold within 2s |
| JTBD-01.1 | F12 (Skeleton + Error States) | No blank screen or unresolved spinner on any network condition |
| JTBD-01.2 | F2 (Hourly Forecast) | Precipitation % visible on every hourly card, reachable in one tap |
| JTBD-01.3 | F3 (7-Day Forecast) | Tomorrow's high/low + precip % visible in 7-day row, no sub-navigation |
| JTBD-01.3 | F6 (Unit Toggle) | °F preference persists across sessions via localStorage |
| JTBD-01.4 | F6 (Unit Toggle) | Toggle switches all displayed values instantly; visible on main screen |
| JTBD-02.1 | F3 (7-Day Forecast) | Full 7-day forecast visible on desktop without horizontal scroll |
| JTBD-02.1 | F4 (Weather Icons) | Condition icons present on every daily row with day/night variants |
| JTBD-02.2 | F2 (Hourly Forecast) | Hourly detail accessible within one tap from 7-day view |
| JTBD-02.3 | F6 (Secondary Details Panel) | UV, wind, sunrise/sunset accessible within two taps |
| JTBD-02.4 | F7 (Data Freshness) | "Updated X min ago" always visible; stale data labeled clearly |
| JTBD-02.5 | F0 (Location Search) | Autocomplete returns results for small towns after 2+ characters |
| JTBD-03.1 | F1 (Current Conditions) | Condition icon + text label + temp visible above fold within 3s |
| JTBD-03.1 | F11 (Condition Background) | Sky gradient communicates weather state visually at a glance |
| JTBD-03.1 | F15 (WCAG AA) | 4.5:1 contrast on all condition backgrounds; text always readable |
| JTBD-03.2 | F3 (7-Day Forecast) | 7-day rows visible in single scroll from main screen |
| JTBD-03.2 | F14 (Day/Night Icons) | Correct icon variants prevent confusing day/night display |
| JTBD-03.3 | F0 (Location Search) | City search is prominently labeled; recent searches enable quick return |
| JTBD-03.4 | F8 (Accessibility) | All controls labeled in plain English; progressive disclosure pattern |
| JTBD-X.1 | F12 (Skeleton + Error States) | Zero blank-screen states in all loading and error paths |
| JTBD-X.2 | F10 (Geolocation opt-in) | GPS button is opt-in only; city search always primary; no auto-request |
| JTBD-X.3 | F1 + F6 + F7 | Integer temps, persisted units, timezone-correct labels, freshness stamp |
| JTBD-X.4 | F5 (Responsive Layout) | No overflow, no illegible text, ≥44px touch targets at all breakpoints |

---

## NaC Preview (Candidate Natural Acceptance Criteria)

These are candidate NaC statements derived from each job's success measure. They will be refined and formalized in downstream STORY-MAP and verification documents.

| JTBD-ID | Outcome | Candidate Natural Acceptance Criterion |
|---|---|---|
| JTBD-01.1 | Morning go/no-go in ≤15s | Given a returning user with a saved city, when the page loads, then current temp + feels-like + today's precip % are visible above the fold within 2 seconds with no scroll and no tap |
| JTBD-01.2 | Commute-hour precip in ≤10s | Given the main screen is loaded, when the user taps the hourly row, then each hourly card shows a precipitation % and all cards have ≥44px touch targets |
| JTBD-01.3 | Tomorrow's forecast in ≤20s | Given the main screen is loaded, when the user views the 7-day row, then tomorrow's high/low + precip % are visible without navigating to a sub-screen |
| JTBD-01.4 | Unit toggle in ≤5s, 1 tap | Given the main screen is loaded, when the user taps the unit toggle, then all temperature values switch instantly and the preference persists on next page load |
| JTBD-02.1 | Weekend plan in ≤5 min | Given a desktop viewport ≥1024px, when the main screen loads, then the full 7-day forecast is visible without horizontal scroll and every day shows precip % |
| JTBD-02.2 | Rain window in ≤40s | Given the 7-day view is visible, when the user taps a single day, then hourly breakdown for that day is shown with precip % on every card |
| JTBD-02.3 | Secondary details in ≤30s | Given the main screen is loaded, when the user expands the Details panel (≤2 taps), then UV index, wind speed + direction, and sunrise/sunset are displayed |
| JTBD-02.4 | Freshness confirmed in ≤5s | Given data is loaded, then "Updated X minutes ago" is always visible on the current conditions screen without any tap |
| JTBD-02.5 | Trailhead search in ≤30s | Given the user types a small-town name (2+ characters), then autocomplete suggestions appear and selecting one loads that location's forecast in under 2 seconds |
| JTBD-03.1 | "Good garden day?" in ≤3s | Given any visit to the app, then current temperature + condition icon + plain-English condition label are visible above the fold within 3 seconds with zero permission dialogs |
| JTBD-03.2 | Week scan in ≤20s | Given the main screen is loaded, when the user scrolls once, then all 7 days' forecast rows are visible with recognizable condition icons and readable high/low values |
| JTBD-03.3 | City switch in ≤60s, ≤3 taps | Given the search bar is visible, when the user types a city name and selects a suggestion, then that city's weather loads and a recent-search chip allows returning to the home city |
| JTBD-03.4 | Any control reversible, labeled | Given any control on the main screen, when the user taps it, then the result is immediately visible with a text label or instant visual change, and no tap navigates away without a clear back path |
| JTBD-X.1 | Zero blank screens | Given any network condition including API failure, then either skeleton loading states or a clear error message is shown — never a blank screen or unresolved spinner |
| JTBD-X.2 | Zero modal interruptions | Given any visit by any persona, then no modal dialogs, permission overlays, account prompts, or push notification requests appear on first or subsequent page loads |
| JTBD-X.3 | Numbers are trustworthy | Given data is displayed, then all temperatures are integers (no decimals), units match localStorage preference, time labels reflect the searched location's timezone, and a freshness timestamp is visible |
| JTBD-X.4 | Any device works correctly | Given any viewport from 375px to 1280px+, then no horizontal overflow exists, all text is readable at default system font size, and all interactive elements are ≥44×44px |

---

*JTBD document version 1.0 — generated 2026-04-29*
*Derived from: PERSONAS.md · PRD.md · .planning/research/SUMMARY.md*
*Next downstream documents: User Stories · Journey Maps · Acceptance Criteria*

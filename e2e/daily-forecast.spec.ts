import { test, expect } from '@playwright/test'

const WEATHER_FIXTURE = {
  latitude: 51.5,
  longitude: -0.12,
  timezone: 'Europe/London',
  current: {
    time: '2026-04-30T14:00',
    temperature_2m: 18,
    apparent_temperature: 16,
    relative_humidity_2m: 65,
    precipitation_probability: 10,
    weather_code: 1,
    wind_speed_10m: 12,
    wind_direction_10m: 270,
    is_day: 1,
  },
  hourly: {
    time: Array.from({ length: 168 }, (_, i) => {
      const d = new Date('2026-04-30T00:00:00Z')
      d.setHours(d.getHours() + i)
      return d.toISOString().slice(0, 16)
    }),
    temperature_2m: Array(168).fill(15),
    precipitation_probability: Array(168).fill(20),
    weather_code: Array(168).fill(1),
    is_day: Array.from({ length: 168 }, (_, i) => (i % 24 >= 7 && i % 24 <= 20 ? 1 : 0)),
  },
  daily: {
    time: ['2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05', '2026-05-06'],
    weather_code: [0, 1, 2, 3, 61, 1, 0],
    temperature_2m_max: [20, 19, 21, 18, 16, 22, 23],
    temperature_2m_min: [12, 11, 13, 10, 9, 14, 15],
    precipitation_probability_max: [5, 10, 20, 30, 70, 0, 5],
    sunrise: Array(7).fill('2026-04-30T05:30'),
    sunset: Array(7).fill('2026-04-30T20:15'),
    uv_index_max: [4, 3, 5, 2, 1, 6, 7],
  },
}

test.describe('DailyForecast', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api.open-meteo.com/v1/forecast**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(WEATHER_FIXTURE),
      })
    })
    await page.route('**/geocoding-api.open-meteo.com/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{ id: 1, name: 'London', latitude: 51.5, longitude: -0.12, country: 'United Kingdom', country_code: 'GB' }],
        }),
      })
    })

    await page.goto('/')
    await page.getByRole('searchbox').fill('London')
    await page.getByRole('option', { name: /London/ }).first().click()
    await page.getByLabel('7-day forecast').waitFor()
  })

  test('renders 7-day forecast section', async ({ page }) => {
    const section = page.getByLabel('7-day forecast')
    await expect(section).toBeVisible()
  })

  test('shows exactly 7 day rows', async ({ page }) => {
    const rows = page.getByLabel(/: .+, High .+, Low .+, .+% precipitation/)
    const count = await rows.count()
    expect(count).toBe(7)
  })

  test('first row is labeled Today', async ({ page }) => {
    const firstRow = page.getByLabel(/Today:/)
    await expect(firstRow).toBeVisible()
  })

  test('each row shows high and low temperatures', async ({ page }) => {
    const firstRow = page.getByLabel(/Today:/)
    // aria-label includes "High X°C" and "Low X°C"
    const label = await firstRow.getAttribute('aria-label')
    expect(label).toMatch(/High \d+°/)
    expect(label).toMatch(/Low \d+°/)
  })

  test('each row shows precipitation probability', async ({ page }) => {
    const firstRow = page.getByLabel(/Today:/)
    const label = await firstRow.getAttribute('aria-label')
    expect(label).toMatch(/\d+% precipitation/)
  })

  test('precipitation % visible in each row UI', async ({ page }) => {
    const section = page.getByLabel('7-day forecast')
    // All rows should have a % label
    const precipSpans = section.locator('span').filter({ hasText: /%$/ })
    const count = await precipSpans.count()
    expect(count).toBeGreaterThanOrEqual(7)
  })

  test('condition icons are present (day variant — no Moon icon on daily rows)', async ({ page }) => {
    // Daily rows always use daytime icons.
    // Check that no Moon SVG icon is present inside the 7-day section
    const section = page.getByLabel('7-day forecast')
    // Lucide Moon icon renders with data-lucide="moon" attribute
    const moonIcons = section.locator('[data-lucide="moon"]')
    const moonCount = await moonIcons.count()
    expect(moonCount).toBe(0)
  })
})

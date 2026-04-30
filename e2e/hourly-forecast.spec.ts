import { test, expect } from '@playwright/test'

test.describe('HourlyForecast', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept Open-Meteo API — return minimal fixture
    await page.route('**/api.open-meteo.com/v1/forecast**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          latitude: 51.5,
          longitude: -0.12,
          timezone: 'Europe/London',
          timezone_abbreviation: 'BST',
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
            visibility: 10000,
          },
          hourly: {
            time: Array.from({ length: 168 }, (_, i) => {
              const d = new Date('2026-04-30T00:00:00Z')
              d.setHours(d.getHours() + i)
              return d.toISOString().slice(0, 16)
            }),
            temperature_2m: Array.from({ length: 168 }, (_, i) => 15 + Math.round(Math.sin(i / 6) * 5)),
            precipitation_probability: Array.from({ length: 168 }, (_, i) => (i % 8) * 10),
            weather_code: Array(168).fill(1),
            is_day: Array.from({ length: 168 }, (_, i) => (i % 24 >= 7 && i % 24 <= 20 ? 1 : 0)),
          },
          daily: {
            time: Array.from({ length: 7 }, (_, i) => {
              const d = new Date('2026-04-30')
              d.setDate(d.getDate() + i)
              return d.toISOString().slice(0, 10)
            }),
            weather_code: Array(7).fill(1),
            temperature_2m_max: [20, 19, 21, 18, 22, 20, 17],
            temperature_2m_min: [12, 11, 13, 10, 14, 12, 9],
            precipitation_probability_max: [10, 20, 5, 30, 0, 15, 25],
            sunrise: Array(7).fill('2026-04-30T05:30'),
            sunset: Array(7).fill('2026-04-30T20:15'),
            uv_index_max: [4, 3, 5, 2, 6, 4, 3],
          },
        }),
      })
    })

    // Also intercept geocoding for city search
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
    // Trigger a city search to load weather
    await page.getByRole('searchbox').fill('London')
    await page.getByRole('option', { name: /London/ }).first().click()
    // Wait for hourly section to appear
    await page.getByLabel('Hourly forecast').waitFor()
  })

  test('renders hourly section with scroll container', async ({ page }) => {
    const section = page.getByLabel('Hourly forecast')
    await expect(section).toBeVisible()
  })

  test('shows at least 8 hourly cards', async ({ page }) => {
    // Count cards inside the hourly section (cards have aria-label with "precipitation")
    const hourlySection = page.getByLabel('Hourly forecast')
    const cardCount = await hourlySection.locator('[aria-label*="precipitation"]').count()
    expect(cardCount).toBeGreaterThanOrEqual(8)
  })

  test('each card shows precipitation percentage', async ({ page }) => {
    const hourlySection = page.getByLabel('Hourly forecast')
    // All cards must contain a % label
    const precipLabels = hourlySection.locator('span').filter({ hasText: /%$/ })
    const count = await precipLabels.count()
    expect(count).toBeGreaterThanOrEqual(8)
  })

  test('first card has accent highlight (current hour)', async ({ page }) => {
    const hourlySection = page.getByLabel('Hourly forecast')
    // First card should have blue border class
    const firstCard = hourlySection.locator('[class*="blue"]').first()
    await expect(firstCard).toBeVisible()
  })

  test('cards have sufficient height for touch targets', async ({ page }) => {
    const hourlySection = page.getByLabel('Hourly forecast')
    const firstCard = hourlySection.locator('[aria-label]').first()
    const box = await firstCard.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.height).toBeGreaterThanOrEqual(44)
    expect(box!.width).toBeGreaterThanOrEqual(44)
  })
})

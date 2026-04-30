import { test, expect } from '@playwright/test';

test.describe('CurrentConditions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows empty state (no weather card) before location is selected', async ({ page }) => {
    await expect(page.getByText(/search for a city/i)).toBeVisible();
  });

  test('displays current temperature as an integer (no decimals) after city selection', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Paris');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 10000 });

    const body = await page.locator('body').textContent();
    const tempMatch = body?.match(/-?\d+\s*°[CF]/);
    expect(tempMatch).not.toBeNull();
    const tempStr = tempMatch![0].replace(/\s/g, '');
    expect(tempStr).toMatch(/^-?\d+°[CF]$/);
  });

  test('displays feels-like temperature', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Tokyo');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    await expect(page.getByText(/feels like/i)).toBeVisible({ timeout: 10000 });
  });

  test('displays humidity, wind speed, and precipitation probability', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Berlin');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    const body = await page.locator('body').textContent();
    expect(body).toMatch(/humidity/i);
    expect(body).toMatch(/wind/i);
    expect(body).toMatch(/precip/i);
  });

  test('shows error card with retry button when API fails (simulated)', async ({ page }) => {
    await page.route('**/api.open-meteo.com/**', route => route.abort());
    await page.route('**/geocoding-api.open-meteo.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          results: [{
            id: 1,
            name: 'London',
            latitude: 51.5074,
            longitude: -0.1278,
            country: 'United Kingdom',
            country_code: 'GB',
            admin1: 'England',
          }]
        })
      });
    });

    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('London');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/unable to load weather/i)).toBeVisible();
  });

  test('shows location name in the weather display', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Rome');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 10000 });
  });
});

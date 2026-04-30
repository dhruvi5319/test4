import { test, expect } from '@playwright/test';

test.describe('Unit Toggle (°C/°F)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('°C is the default unit when no localStorage value exists', async ({ page }) => {
    const celsiusButton = page.getByRole('button', { name: /switch to celsius/i });
    const fahrenheitButton = page.getByRole('button', { name: /switch to fahrenheit/i });
    await expect(celsiusButton).toBeVisible();
    await expect(fahrenheitButton).toBeVisible();
    // Celsius should be active (highlighted)
    await expect(celsiusButton).toHaveAttribute('aria-pressed', 'true');
    await expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking the °F button switches to imperial', async ({ page }) => {
    const fahrenheitButton = page.getByRole('button', { name: /switch to fahrenheit/i });
    await expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'false');
    await fahrenheitButton.click();
    await expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('unit preference persists after page reload', async ({ page }) => {
    const fahrenheitButton = page.getByRole('button', { name: /switch to fahrenheit/i });
    await fahrenheitButton.click();
    await expect(fahrenheitButton).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    const reloadedFahrenheit = page.getByRole('button', { name: /switch to fahrenheit/i });
    await expect(reloadedFahrenheit).toHaveAttribute('aria-pressed', 'true');
  });

  test('localStorage key is weatherUnit with value metric or imperial', async ({ page }) => {
    const fahrenheitButton = page.getByRole('button', { name: /switch to fahrenheit/i });
    const celsiusButton = page.getByRole('button', { name: /switch to celsius/i });

    const initialValue = await page.evaluate(() => localStorage.getItem('weatherUnit'));
    expect(initialValue === null || initialValue === 'metric').toBe(true);

    await fahrenheitButton.click();
    const imperialValue = await page.evaluate(() => localStorage.getItem('weatherUnit'));
    expect(imperialValue).toBe('imperial');

    await celsiusButton.click();
    const metricValue = await page.evaluate(() => localStorage.getItem('weatherUnit'));
    expect(metricValue).toBe('metric');
  });

  test('unit toggle is always visible (never hidden)', async ({ page }) => {
    const celsiusButton = page.getByRole('button', { name: /switch to celsius/i });
    await expect(celsiusButton).toBeVisible();

    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Madrid');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();
    await expect(celsiusButton).toBeVisible();
  });

  test('complete Phase 1 flow: search → weather loads → toggle unit → temperatures update', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Sydney');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await page.getByRole('option').first().click();

    await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 10000 });

    const body = await page.locator('body').textContent();
    const celsiusMatch = body?.match(/-?\d+\s*°C/);
    expect(celsiusMatch).not.toBeNull();

    const fahrenheitButton = page.getByRole('button', { name: /switch to fahrenheit/i });
    await fahrenheitButton.click();

    await expect(page.getByRole('heading', { level: 2 })).toBeVisible({ timeout: 10000 });

    const bodyAfter = await page.locator('body').textContent();
    const fahrenheitMatch = bodyAfter?.match(/-?\d+\s*°F/);
    expect(fahrenheitMatch).not.toBeNull();
  });
});

test.describe('No blank screen rule (FR-10)', () => {
  test('page never shows a blank screen on initial load', async ({ page }) => {
    await page.goto('/');
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(0);
    await expect(page.getByText(/search for a city/i)).toBeVisible();
  });

  test('Open-Meteo attribution footer is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/open-meteo/i)).toBeVisible({ timeout: 5000 });
  });
});

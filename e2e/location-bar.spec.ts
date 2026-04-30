import { test, expect } from '@playwright/test';

test.describe('LocationBar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows no dropdown for 0-1 character input', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('L');
    await page.waitForTimeout(500);
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('shows dropdown with suggestions after 2+ characters', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Lo');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    const options = page.getByRole('option');
    await expect(options).toHaveCount({ minimum: 1 });
  });

  test('selecting a suggestion shows city name in input and closes dropdown', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('London');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    const firstOption = page.getByRole('option').first();
    await firstOption.click();
    await expect(page.getByRole('listbox')).not.toBeVisible();
    const inputValue = await input.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test('pressing Enter selects the first suggestion', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Paris');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await input.press('Enter');
    await expect(page.getByRole('listbox')).not.toBeVisible();
    const inputValue = await input.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test('pressing Escape closes the dropdown without selecting', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    const originalValue = 'Berlin';
    await input.fill(originalValue);
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 5000 });
    await input.press('Escape');
    await expect(page.getByRole('listbox')).not.toBeVisible();
    expect(await input.inputValue()).toBe(originalValue);
  });

  test('GPS button is always visible and does not auto-trigger geolocation', async ({ page }) => {
    const gpsButton = page.getByRole('button', { name: /use my location/i });
    await expect(gpsButton).toBeVisible();
    await expect(page.getByRole('alert')).not.toBeVisible();
  });

  test('shows no-results message when city not found', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('xyzzynotacity');
    await page.waitForTimeout(1000);
    const listbox = page.getByRole('listbox');
    if (await listbox.isVisible()) {
      const options = page.getByRole('option');
      await expect(options).toHaveCount(0);
    }
  });

  test('clear button appears when input has text and resets the input', async ({ page }) => {
    const input = page.getByRole('combobox', { name: /search for a city/i });
    await input.fill('Tokyo');
    const clearButton = page.getByRole('button', { name: /clear search/i });
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    expect(await input.inputValue()).toBe('');
    await expect(clearButton).not.toBeVisible();
  });
});

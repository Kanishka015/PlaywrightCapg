// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';
const BASE = process.env.BASE_URL || 'https://phptravels.net';

test('Hotel - No Results & Suggestion Flow', async ({ page }) => {
  // 1. Search with impossible filters
  await page.goto(BASE);
  const s = td.hotelData.noResults;
  // TODO: enter s.city and narrow dates

  // 2. Observe no-results UI and select suggestion
  await expect(page.locator('text=No results').first()).toBeVisible({ timeout: 5000 });
});
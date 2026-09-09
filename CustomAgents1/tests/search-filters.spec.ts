// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Search Filters and Sorting', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  const s = td.hotelData.validSearch;
  // TODO: search, apply price/rating/amenities filters, verify results update and persistence
  await expect(page.locator('.search-results')).toBeVisible();
});
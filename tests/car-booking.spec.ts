// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';
const BASE = process.env.BASE_URL || 'https://phptravels.net';

test('Search and Rent a Car', async ({ page }) => {
  await page.goto(BASE);
  const c = td.carData.validSearch;
  // TODO: interact with car search form using c

  // 2. Complete booking and pay using saved card (registered user)
  // TODO: login if necessary and use td.paymentData.sandboxValidCard
  await expect(page).toHaveURL(/car|cars|booking/i);
});
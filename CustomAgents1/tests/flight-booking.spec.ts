// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';
const BASE = process.env.BASE_URL || 'https://phptravels.net';

test('Search and Book a Flight with Extras', async ({ page }) => {
  // 1. Open Flights search
  await page.goto(BASE);
  const f = td.flightData.validSearch;
  // TODO: interact with flight search form using f

  // 2. Select itinerary; add seat & baggage
  // 3. Pay with sandbox gateway that requires 3DS flow
  // TODO: trigger 3DS using td.paymentData.sandbox3DSCard
  await expect(page).toHaveURL(/flight|flights|booking/i);
});
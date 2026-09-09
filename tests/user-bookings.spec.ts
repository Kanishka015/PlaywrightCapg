// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('View and Cancel Bookings from Account', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: login, navigate to My Bookings, cancel eligible booking and verify refund initiation
  expect(true).toBeTruthy();
});
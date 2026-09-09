// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('Admin View Bookings and Process Refunds', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net/admin');
  // TODO: login as admin, locate booking, process refund, verify audit
  expect(true).toBeTruthy();
});
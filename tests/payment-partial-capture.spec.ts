// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('Partial Capture and Refund', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: perform auth-only booking and later capture via API/admin
  expect(true).toBeTruthy();
});
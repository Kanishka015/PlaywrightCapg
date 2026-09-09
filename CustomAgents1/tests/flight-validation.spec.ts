// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';
const BASE = process.env.BASE_URL || 'https://phptravels.net';

test('Guest Passenger Data Validation', async ({ page }) => {
  // 1. Begin flight booking and leave required passenger fields blank
  await page.goto(BASE);
  // TODO: start booking flow and omit passenger details

  // 2. Try to proceed to payment and expect validation errors
  await expect(page.locator('.validation-error').first()).toBeVisible();
});
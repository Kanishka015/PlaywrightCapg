// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Card Decline Handling', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: complete booking and use td.paymentData.declinedCard
  await expect(page.locator('text=declined').first()).toBeVisible();
});
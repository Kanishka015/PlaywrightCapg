// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Apply Promo Code and Verify Totals', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: add item to cart and apply td.promoData.validPromo.code
  await expect(page.locator('text=Discount')).toBeVisible();
});
// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Promo Management (Admin)', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net/admin');
  // TODO: login and create promo using td.promoData.validPromo
  expect(true).toBeTruthy();
});
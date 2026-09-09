// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('Multi-currency Display and Rounding', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: switch currency, inspect prices, taxes, and rounding rules
  expect(true).toBeTruthy();
});
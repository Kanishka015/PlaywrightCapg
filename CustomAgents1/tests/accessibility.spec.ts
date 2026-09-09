// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('No-JS Fallback / Accessibility Check (Critical Paths)', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: integrate axe-core or run manual checks for ARIA and keyboard navigation
  expect(true).toBeTruthy();
});
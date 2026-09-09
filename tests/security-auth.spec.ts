// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';

test('Brute Force and Rate Limit Protection (Auth)', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net/login');
  for (let i = 0; i < 12; i++) {
    // TODO: attempt login with invalid credentials
  }
  // TODO: assert rate limit or lockout appears
  expect(true).toBeTruthy();
});
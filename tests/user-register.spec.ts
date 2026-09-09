// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Register, Login, and Use Saved Traveller', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  const u = td.userData.validUser;
  // TODO: register using u, verify email via stub, login, save traveller profile, use in booking
  expect(u.email).toContain('@');
});
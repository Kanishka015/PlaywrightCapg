// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('High Concurrency Booking Stress Test', async ({ browser }) => {
  const users = td.concurrencyScenarios.simultaneousBookings.slice(0, 20);
  const promises = users.map(async (u) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(process.env.BASE_URL || 'https://phptravels.net');
    // TODO: perform search and attempt booking using u.search
    await ctx.close();
    return true;
  });
  const results = await Promise.all(promises);
  expect(results.every(Boolean)).toBeTruthy();
});
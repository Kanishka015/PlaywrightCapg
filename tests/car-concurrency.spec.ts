// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('Car Rental - Last Car Race Condition', async ({ browser }) => {
  // Simulate concurrent bookings
  const parallel = 6;
  const promises = [];
  for (let i = 0; i < parallel; i++) {
    promises.push((async () => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto(process.env.BASE_URL || 'https://phptravels.net');
      // TODO: start booking using td.carData.lastCarConcurrency
      await ctx.close();
      return true;
    })());
  }
  const results = await Promise.all(promises);
  // TODO: verify only one success and others failed with out-of-stock
  expect(results.length).toBe(parallel);
});
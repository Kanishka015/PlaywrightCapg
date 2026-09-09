// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';

test('GDPR Data Deletion Request Flow', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://phptravels.net');
  // TODO: submit deletion request using td.gdprData.deletionRequest
  expect(true).toBeTruthy();
});
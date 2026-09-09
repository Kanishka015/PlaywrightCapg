// spec: specs/phptravels-test-plan.md
import { test, expect } from '@playwright/test';
import td from '../test-data/phptravels.test-data';
const BASE = process.env.BASE_URL || 'https://phptravels.net';

test.describe('Hotel Booking', () => {
  test('Search and Book a Hotel (Happy Path)', async ({ page }) => {
    // 1. Open homepage and navigate to Hotels section
    await page.goto(BASE);
    // TODO: replace selector for Hotels nav

    // 2. Search for hotels in a city for valid dates and 2 adults
    const s = td.hotelData.validSearch;
    // TODO: fill location, check-in/out, guests

    // 3. Apply a price filter and sort by rating, then select a room
    // TODO: interact with filters and select a room

    // 4. Enter traveler details and complete checkout using sandbox card
    // TODO: fill traveler info and payment with td.paymentData.sandboxValidCard

    await expect(page).toHaveTitle(/phptravels|Hotels/i);
  });
});
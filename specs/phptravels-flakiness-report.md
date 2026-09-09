# PHPTravels Playwright Test Flakiness Report

Prepared: 2026-09-08

## Scope
- Files inspected: all `tests/*.spec.ts` and `test-data/phptravels.test-data.ts`.

## Summary
- Primary sources of flakiness found:
  - Placeholder assertions that don't validate behavior
  - Page-level or broad assertions (title / URL) that race with rendering
  - Missing action->response waits (especially payments and bookings)
  - Fragile locators (index-based / positional selectors / lack of test ids)
  - Concurrency tests that assert Promise resolution instead of real outcomes

## Findings (categorized)

- **Flaky Assertions**:
  - `expect(true).toBeTruthy()` placeholders in multiple specs: [tests/accessibility.spec.ts](tests/accessibility.spec.ts#L7), [tests/admin-promo.spec.ts](tests/admin-promo.spec.ts#L8), [tests/admin-refund.spec.ts](tests/admin-refund.spec.ts#L7), [tests/currency.spec.ts](tests/currency.spec.ts#L7), [tests/email-cancellation.spec.ts](tests/email-cancellation.spec.ts#L7), [tests/email-confirmation.spec.ts](tests/email-confirmation.spec.ts#L7), [tests/gdpr.spec.ts](tests/gdpr.spec.ts#L8), [tests/payment-partial-capture.spec.ts](tests/payment-partial-capture.spec.ts#L7), [tests/security-auth.spec.ts](tests/security-auth.spec.ts#L10), [tests/user-bookings.spec.ts](tests/user-bookings.spec.ts#L7).
  - Page-level title/url checks that are brittle: [tests/hotel-search-book.spec.ts](tests/hotel-search-book.spec.ts#L22), [tests/flight-booking.spec.ts](tests/flight-booking.spec.ts#L15), [tests/car-booking.spec.ts](tests/car-booking.spec.ts#L13).

- **Timing Issues**:
  - Tests rely on `toHaveTitle` / `toHaveURL` instead of waiting for stable UI elements—causes races under slow networks or localized titles.
  - Payment / 3DS flows lack `popup`/`frame` waits and `waitForResponse` pairing for booking API calls.
  - Concurrency tests close contexts immediately and only assert that promises resolved, not server-side booking status.

- **Dynamic / Fragile Locators**:
  - Many specs contain TODOs for selectors; likely to use text or nth-child selectors if implemented naively.
  - No evidence of `data-testid`/`data-qa` usage; lack of stable attributes increases fragility.

- **Wait Problems**:
  - Missing pairing of actions with network events (click -> waitForResponse) and missing popup/frame handling for payment flows.
  - Excessive reliance on implicit waits (title/url) rather than explicit checks of confirmation elements.

## Severity Matrix (quick)
- High: Payment/3DS, Booking confirmation assertions, concurrency correctness
- Medium: Locator fragility for search & filters
- Low: Placeholder tests / missing admin checks (fix quickly but lower risk)

## Concrete Recommendations (actionable)
- Replace placeholders with concrete UI or API assertions.
  - Example: assert booking success with `[data-testid=booking-confirmation]` visible and capture booking id.
- Prefer stable locators:
  - Add `data-testid` or `data-qa` in test/staging build for critical controls.
  - Use Playwright `getByRole`, `getByLabel`, `getByPlaceholder`, or `locator('[data-testid=...]')`.
- Pair user actions with network events / popups:
  - Use `Promise.all([page.waitForResponse(...), page.click(...)])` for booking calls.
  - Use `page.waitForEvent('popup')` and `popup.frameLocator(...)` for 3DS flows.
- Make concurrency tests validate server outcomes:
  - Collect booking API responses or query test-only API for booking records; assert expected success/failure counts.
- Use network stubbing for external services in unit-like scenarios:
  - `page.route('https://payments.sandbox/*', route => route.fulfill(...))` or a test fixture endpoint.
- Targeted timeouts rather than global increases:
  - `await expect(locator).toBeVisible({ timeout: 30000 })` for slow steps only.
- Add logging & diagnostics on failure:
  - Enable traces/screenshots on failure via `playwright.config.ts`; capture request/response bodies for book/pay endpoints.

## Short examples (copy into failing specs)
- Action + response:

```ts
await Promise.all([
  page.waitForResponse(r => r.url().includes('/api/book') && r.status() === 200),
  page.click('button:has-text("Confirm Booking")')
]);
await expect(page.locator('[data-testid=booking-confirmation]')).toBeVisible({ timeout: 20000 });
```

- 3DS popup handling:

```ts
const [popup] = await Promise.all([page.waitForEvent('popup'), page.click('button.pay')]);
await popup.waitForLoadState();
const frame = popup.frameLocator('iframe[name="3ds"]');
await frame.locator('input[name="password"]').fill('...');
await frame.locator('button[type=submit"]').click();
```

## Recommended quick remediation plan
1. Update top P0 specs: `tests/hotel-search-book.spec.ts`, `tests/flight-booking.spec.ts`, `tests/payment-decline.spec.ts` — replace placeholders and add action->wait logic.
2. Add `data-testid` attributes in staging/test build for critical flows.
3. Implement payment/email stubbing routes for deterministic tests.
4. Convert concurrency tests to assert server-side outcomes via API calls.

## Next Steps I can take now
- Implement fixes in the top-3 P0 specs and run a smoke run (`npx playwright test tests/hotel-search-book.spec.ts -g "Hotel Booking"`).
- Add a small helper utility `tests/helpers/waits.ts` with common wait patterns and export it.

---
Report generated from scanning files under `tests/` and `test-data/phptravels.test-data.ts`.

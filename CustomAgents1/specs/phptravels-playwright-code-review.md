w

**Playwright Test Suite — Code Review**

**Scope**: Review of Playwright TypeScript tests under `tests/`, `test-data/phptravels.test-data.ts`, and `playwright.config.ts` in this workspace.

**Review Date**: 2026-09-08

| Severity | File                                                                                                                                                                                           | Problem                                                                                                                                    | Recommendation                                                                                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Critical | [tests/accessibility.spec.ts](tests/accessibility.spec.ts#L1-L40)  [tests/admin-promo.spec.ts](tests/admin-promo.spec.ts#L1-L40)  [tests/admin-refund.spec.ts](tests/admin-refund.spec.ts#L1-L40) | Placeholder assertions using`expect(true).toBeTruthy()` — tests do not verify behavior and will mask failures.                          | Replace placeholders with deterministic checks against visible UI elements, API responses, or DB verification. Use`expect(locator).toBeVisible()` or API assertions.                      |
| Critical | [tests/flight-booking.spec.ts](tests/flight-booking.spec.ts#L1-L40)  [tests/hotel-search-book.spec.ts](tests/hotel-search-book.spec.ts#L1-L40)                                                   | Payment/booking flows lack explicit handling for network responses and 3DS popups — leads to race conditions and intermittent failures.   | Pair actions with`page.waitForResponse()` or `page.waitForEvent('popup')` and assert responses. Stub payment gateways in staging for deterministic tests.                               |
| High     | [tests/car-concurrency.spec.ts](tests/car-concurrency.spec.ts#L1-L80)  [tests/concurrency-stress.spec.ts](tests/concurrency-stress.spec.ts#L1-L80)                                               | Concurrency tests open multiple contexts but only assert promise resolution rather than server-side outcomes; may produce false positives. | Collect and assert API responses or booking record IDs per worker. Use unique accounts created via API and assert server-side status.                                                       |
| High     | [tests/*](tests/*)                                                                                                                                                                              | Fragile locators risk: many tests are TODOs and likely to rely on text or index-based selectors (`:nth-child`, long CSS chains).         | Add stable`data-testid`/`data-qa` attributes in staging; prefer `getByRole`, `getByLabel`, `getByPlaceholder`, or `[data-testid=...]` locators. Avoid reliance on visual order. |
| Medium   | [test-data/phptravels.test-data.ts](test-data/phptravels.test-data.ts#L1-L200)                                                                                                                  | Test data includes realistic values but no helpers for unique user generation or cleanup endpoints.                                        | Add API helpers to create/delete users/bookings and return deterministic IDs. Use factories to generate unique emails per run.                                                              |
| Medium   | [playwright.config.ts](playwright.config.ts#L1-L120)                                                                                                                                            | Global config OK;`fullyParallel: true` is useful but increases potential shared-state flakiness.                                         | Keep`fullyParallel` for speed but ensure tests isolate state and use unique resources or set `workers` per CI. Configure `use.baseURL` via env to simplify `page.goto`.             |
| Low      | [tests/flight-booking.spec.ts](tests/flight-booking.spec.ts#L1-L40)                                                                                                                             | Loose URL regex checks `toHaveURL(/flight                                                                                                  | flights                                                                                                                                                                                     |

**Code Quality Score**: 5/10

**Top Improvements (priority order)**

- Replace all placeholder assertions with concrete locators or API checks in P0 tests: `tests/hotel-search-book.spec.ts`, `tests/flight-booking.spec.ts`, `tests/payment-decline.spec.ts`.
- Introduce and prefer stable `data-testid` attributes in the application test/staging build; update locators to use them.
- Pair clicks with `waitForResponse()` / `waitForEvent('popup')` and assert returned payloads (booking ID, status code).
- Convert concurrency tests to validate server-side results and use API-created test accounts.
- Add network stubbing for external services (payment/email) where deterministic outcomes are required.

**Concrete Code Examples**

- Action + response pairing:

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
const frame = popup.frameLocator('iframe[name="3ds"]').locator('input[name="password"]');
await frame.fill('password');
await popup.click('button[type=submit]');
```

- Mocking external payment endpoint in tests:

```ts
await page.route('https://payments.sandbox/*', (route) =>
  route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
);
```

**Testability & CI Recommendations**

- Run P0 tests serially in CI or isolate them into a small, stable suite with retries enabled and trace-on-failure.
- Keep `trace: 'retain-on-failure'` and `screenshot: 'only-on-failure'` (already set) — good for debugging.
- Add `test.step` or helpful logging around network-critical stages for faster triage.

**Next actionable tasks I can take**

- Implement P0 fixes in the top 3 specs (`tests/hotel-search-book.spec.ts`, `tests/flight-booking.spec.ts`, `tests/payment-decline.spec.ts`) by replacing placeholders, adding waits, and using example locators.
- Add a small test helper `tests/helpers/api.ts` to create/delete users and bookings via API for deterministic setup/teardown.

Would you like me to apply the P0 fixes automatically now? If yes, I will implement them and run `npx playwright test` to validate locally.

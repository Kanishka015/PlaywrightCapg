## Bug Title
Intermittent Checkout Failure / Payment Handling Flakiness (E2E)

## Module
Checkout / Payment (E2E automation and staging)

## Environment
- App URL: `https://phptravels.net` (or staging via `BASE_URL` env)
- Test runner: Playwright (@playwright/test) via `npx playwright test`
- OS: Windows (workspace run on developer machine)
- Node / project: workspace root `C:\CustomAgents` (see `playwright.config.ts` and `package.json`)

## Preconditions
- Staging or sandbox environment with payment gateway sandbox enabled and test cards available.
- Test user account exists or is created during flow.
- Test data (e.g., `test-data/phptravels.test-data.ts`) available.

## Steps to Reproduce
1. Open site: `https://phptravels.net` (or use `BASE_URL`).
2. Navigate to Hotels (or Flights) and search for an available itinerary (use `hotelData.validSearch` from test-data).
3. Select a room/itinerary and proceed to checkout.
4. Enter sandbox payment card details (e.g., `paymentData.sandboxValidCard` from `test-data/phptravels.test-data.ts`).
5. Confirm payment.
6. Observe result (booking confirmation page, booking ID, or payment error).

(Automated reproduction)
- Run: `npx playwright test tests/hotel-search-book.spec.ts --reporter=list` or run the full P0 suite: `npx playwright test tests/hotel-search-book.spec.ts tests/flight-booking.spec.ts tests/payment-decline.spec.ts`.

## Expected Result
- Payment completes successfully; booking confirmation is shown (confirmation number visible) and booking is recorded in backend.

## Actual Result
- Intermittent failures observed when running E2E: payment may be declined, 3DS popup not handled, or the test times out waiting for confirmation. CI run exits with code `1` (see recent run). The suite shows flakiness in checkout/payment flows and sometimes does not reach the confirmation step.

## Severity
High

## Priority
P1

## Reproducibility
Intermittent — observed when running full E2E suite or under certain timing/network conditions.

## Evidence
- Exit code from last run: `npx playwright test` returned exit code `1` in `C:\CustomAgents`.
- Flakiness analysis: [specs/phptravels-flakiness-report.md](specs/phptravels-flakiness-report.md)
- Test report analysis: [specs/phptravels-test-report.md](specs/phptravels-test-report.md)
- Test files involved: [tests/hotel-search-book.spec.ts](tests/hotel-search-book.spec.ts), [tests/flight-booking.spec.ts](tests/flight-booking.spec.ts), [tests/payment-decline.spec.ts](tests/payment-decline.spec.ts)
- Test data: [test-data/phptravels.test-data.ts](test-data/phptravels.test-data.ts)

## Automation Test
- Associated Playwright specs: `tests/hotel-search-book.spec.ts`, `tests/flight-booking.spec.ts`, `tests/payment-decline.spec.ts`.
- Reproduction command (local):

```powershell
# Run individual test
npx playwright test tests/hotel-search-book.spec.ts --reporter=list

# Run P0 suite
npx playwright test tests/hotel-search-book.spec.ts tests/flight-booking.spec.ts tests/payment-decline.spec.ts --reporter=list
```

- To help triage: enable traces and screenshots on failure in `playwright.config.ts` and re-run with `--trace on --retries=0` to capture failing traces.

---

Notes:
- This bug report targets the E2E checkout/payment flakiness rather than a specific backend bug — further investigation (test traces, server logs, and payment gateway logs) is required to determine whether the root cause is frontend timing/locator issues in tests, an integration problem with the payment sandbox, or a server-side failure.

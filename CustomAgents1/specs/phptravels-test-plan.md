# PHPTravels Test Plan

## Application Overview

End-to-end test plan for phptravels.net covering booking flows (hotels, flights, cars), search, checkout and payments, user account flows, admin and refunds, notifications, localization, security, and concurrency.

## Test Scenarios

### 1. Hotel Booking

**Seed:** `tests/seed.spec.ts`

#### 1.1. Search and Book a Hotel (Happy Path)

**File:** `tests/hotel-search-book.spec.ts`

**Steps:**
  1. Open homepage and navigate to Hotels section
    - expect: Hotels search form is visible with location, check-in/out, guests fields
  2. Search for hotels in a city for valid dates and 2 adults
    - expect: Search results load within acceptable time
    - expect: At least one hotel result is displayed with price and availability
  3. Apply a price filter and sort by rating, then select a room
    - expect: Filter and sort applied; selected room details (rate, taxes) visible
  4. Enter traveler details and complete checkout using sandbox card
    - expect: Payment is accepted, booking moves to Confirmed status
    - expect: Confirmation page and booking reference displayed
    - expect: Confirmation email queued

#### 1.2. Hotel Booking - No Results & Suggestion Flow

**File:** `tests/hotel-no-results.spec.ts`

**Steps:**
  1. Search with impossible filters (e.g., remote location + narrow dates)
    - expect: No results message displayed with suggestions to relax filters
    - expect: Suggested nearby options or date alternatives shown
  2. Attempt to book from the suggestion
    - expect: Booking flow proceeds when selecting suggested option

#### 1.3. Partial Cancellation and Refund (Hotel)

**File:** `tests/hotel-cancel.spec.ts`

**Steps:**
  1. Complete a hotel booking eligible for partial refund
    - expect: Booking status is Confirmed and is eligible for partial cancellation in policy window
  2. Request partial cancellation via booking management
    - expect: Partial refund is calculated correctly and status updated to Partially Cancelled
    - expect: Refund process initiated in payment gateway stub and admin notified

### 2. Flight Booking

**Seed:** `tests/seed.spec.ts`

#### 2.1. Search and Book a Flight with Extras

**File:** `tests/flight-booking.spec.ts`

**Steps:**
  1. Open Flights search, enter origin, destination, dates, and 1 adult
    - expect: Flight itineraries displayed with price breakdown and seat/ baggage options
  2. Select itinerary, add seat and baggage extras, and proceed to checkout
    - expect: Extras appear on price breakdown and persisted to booking summary
  3. Pay with sandbox gateway that requires 3DS flow
    - expect: 3DS authentication is triggered and completed
    - expect: Booking confirmed and e-ticket generated

#### 2.2. Guest Passenger Data Validation (Required Fields)

**File:** `tests/flight-validation.spec.ts`

**Steps:**
  1. Begin flight booking and leave required passenger fields blank
    - expect: Validation errors displayed for each required field and booking not allowed

### 3. Car Rental

**Seed:** `tests/seed.spec.ts`

#### 3.1. Search and Rent a Car

**File:** `tests/car-booking.spec.ts`

**Steps:**
  1. Search car rentals for city and dates, choose car class
    - expect: Available cars list displays with price, fuel policy, and cancellation terms
  2. Complete booking and pay using saved card (registered user)
    - expect: Booking confirmed and rental voucher displayed
    - expect: Booking visible in user bookings with correct details

#### 3.2. Car Rental - Last Car Race Condition

**File:** `tests/car-concurrency.spec.ts`

**Steps:**
  1. Simulate concurrent bookings for the last available car
    - expect: One booking succeeds and others receive a clear out-of-stock message
    - expect: UI guides users with alternative suggestions

### 4. Checkout & Payments

**Seed:** `tests/seed.spec.ts`

#### 4.1. Card Decline Handling

**File:** `tests/payment-decline.spec.ts`

**Steps:**
  1. Attempt checkout with a card number that the gateway returns as declined
    - expect: Decline message shown with reason; booking remains pending
    - expect: User can retry with another payment method

#### 4.2. Partial Capture and Refund

**File:** `tests/payment-partial-capture.spec.ts`

**Steps:**
  1. Book service where vendor requires authorization then capture
    - expect: Authorization recorded, later capture succeeds and funds are reserved
    - expect: Partial refund can be issued and reflects correctly in accounting records

#### 4.3. Apply Promo Code and Verify Totals

**File:** `tests/promo.spec.ts`

**Steps:**
  1. Apply a valid promo code at checkout
    - expect: Discount applied to the subtotal and final total recalculated
    - expect: Promo usage recorded and capped per its rules

### 5. User Accounts & Profile

**Seed:** `tests/seed.spec.ts`

#### 5.1. Register, Login, and Use Saved Traveller

**File:** `tests/user-register.spec.ts`

**Steps:**
  1. Register new user and verify email (staged)
    - expect: Account created and verification email queued; user can log in after verification
  2. Save traveller profile and use it in a new booking
    - expect: Saved traveller auto-populates booking form and speed checkout

#### 5.2. View and Cancel Bookings from Account

**File:** `tests/user-bookings.spec.ts`

**Steps:**
  1. Log in and navigate to My Bookings
    - expect: List of past and upcoming bookings visible with statuses and relevant actions
  2. Cancel an eligible booking and confirm refund initiation
    - expect: Booking status updated, refund initiated, and email notification queued

### 6. Search, Filters & UX

**Seed:** `tests/seed.spec.ts`

#### 6.1. Search Filters and Sorting

**File:** `tests/search-filters.spec.ts`

**Steps:**
  1. Search and apply multiple filters (price, rating, amenities)
    - expect: Results reflect applied filters, counts update, sorting persists across pages

#### 6.2. No-JS Fallback / Accessibility Check (Critical Paths)

**File:** `tests/accessibility.spec.ts`

**Steps:**
  1. Load primary booking flow routes with JS disabled or run automated axe scan
    - expect: Forms and critical actions remain accessible or appropriate message shown
    - expect: ARIA labels and keyboard navigation exist for key controls

### 7. Notifications & Emails

**Seed:** `tests/seed.spec.ts`

#### 7.1. Booking Confirmation Email Content

**File:** `tests/email-confirmation.spec.ts`

**Steps:**
  1. Complete a booking in staging with email stub
    - expect: Email content includes booking reference, line-items, traveler info, and contact/support info

#### 7.2. Cancellation and Refund Email

**File:** `tests/email-cancellation.spec.ts`

**Steps:**
  1. Cancel a booking and trigger refund
    - expect: Cancellation email sent with refund details and expected timelines

### 8. Admin & Refund Processing

**Seed:** `tests/seed.spec.ts`

#### 8.1. Admin View Bookings and Process Refunds

**File:** `tests/admin-refund.spec.ts`

**Steps:**
  1. Log in as admin and locate a booking
    - expect: Admin UI shows booking details, payment transaction, and refund action
  2. Process full refund and verify transaction status
    - expect: Refund status updated and user receives refund notification; audit log entry created

#### 8.2. Promo Management (Admin)

**File:** `tests/admin-promo.spec.ts`

**Steps:**
  1. Create a promo with usage limits and start/end dates
    - expect: Promo is active within date range and enforces usage caps
    - expect: Invalid or expired promos rejected at checkout

### 9. Localization, Currency & Legal

**Seed:** `tests/seed.spec.ts`

#### 9.1. Multi-currency Display and Rounding

**File:** `tests/currency.spec.ts`

**Steps:**
  1. Switch currency and verify price, taxes, and rounding rules
    - expect: Displayed totals match converted amounts and rounding rules applied consistently

#### 9.2. GDPR Data Deletion Request Flow

**File:** `tests/gdpr.spec.ts`

**Steps:**
  1. Submit a data deletion request for a test user
    - expect: Request acknowledged, data flagged/deleted per policy, admin audit available

### 10. Security, Performance & Concurrency

**Seed:** `tests/seed.spec.ts`

#### 10.1. Brute Force and Rate Limit Protection (Auth)

**File:** `tests/security-auth.spec.ts`

**Steps:**
  1. Attempt multiple failed logins from one IP
    - expect: Rate limiting/blocking engages and appropriate challenge shown

#### 10.2. High Concurrency Booking Stress Test

**File:** `tests/concurrency-stress.spec.ts`

**Steps:**
  1. Run load scenario where many virtual users search and attempt booking concurrently
    - expect: System maintains SLA for search response times; no silent oversells; errors are clearly surfaced and retriable

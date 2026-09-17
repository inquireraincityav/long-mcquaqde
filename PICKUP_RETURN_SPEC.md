# Pickup & Return — Screen Spec

Companion to PROJECT_BRIEF.md. This is the screen the original scope called
out as most useful on mobile — build the layout mobile-first, web second.

## Entry point

From Order History (an upcoming order) or a direct link/notification on the
day of pickup or return.

## Content

- **Upcoming pickup/return card** — what's being picked up or returned, which
  location, item list with thumbnails (from `inventory.json`).
- **Condition check-in/out flow** — for each item: a simple confirmation
  ("item received in expected condition") plus an optional photo attachment.
  This mirrors, in structured form, what currently happens informally at the
  counter with no record kept.
- **Split-location orders** (per the fulfillment logic in CART_SPEC.md) get
  separate pickup/return cards per location, clearly labeled — the person
  genuinely needs to visit more than one place, and the screen should make
  that unambiguous rather than merging it into one confusing card.
- Timestamp and location are recorded once a check-in or check-out is
  completed.

## Edge cases

- An item flagged as not in expected condition at pickup: a simple escalation
  ("flag for staff review") — a full dispute-resolution flow is out of scope
  for a portfolio prototype.
- Return running late: a reminder state only. Late-fee calculation is a
  reasonable phase-2 idea, not part of this build.

## Out of scope

- Condition dispute resolution beyond a basic flag.
- Late-fee billing logic.

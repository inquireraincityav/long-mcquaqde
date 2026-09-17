# Quote & Checkout — Screen Spec

Companion to PROJECT_BRIEF.md.

## Entry point

From Cart's "Proceed to checkout," carrying the finalized item list, dates,
and fulfillment plan (single-location or split) already resolved.

## Content

- **Order summary** — collapsed view of the cart contents and fulfillment
  plan carried over from Cart; expandable if the person wants to double-check
  before paying.
- **Delivery vs. pickup**, chosen per location if the order is split across
  branches (a split order may need this decision made twice).
- **Deposit terms, surfaced clearly** — adapted from L&M's real terms: ID
  required, a stated deposit if no credit card is on file, a hold fee if
  reserving significantly in advance. Don't invent new terms; carry these
  forward from GEAR_DETAIL_SPEC.md so the numbers agree across screens.
- **Payment fields** — mocked only. This prototype explicitly does not process
  real payments or lead to real rentals; build a plausible-looking form with
  basic input validation, not a real payment integration.
- **Itemized total** — equipment subtotal, deposit (called out separately
  from the rental charge, refundable), delivery fee if applicable.
- **Confirmation / success state** after "Place order" — since there's no real
  backend order system, this is a mocked confirmation screen. Optional nice
  touch: format the mock order number in the same style as SJAI Studio's own
  real quote numbering (Q-YYYY-NN) as a small personal consistency detail —
  skip this if it feels cute rather than considered.

## Edge cases

- Delivery selected but only available from some locations/for some items in
  a split order: surface that constraint before checkout can complete, not
  after payment.
- Basic field validation on the mocked payment form (format checks only —
  there's no real security model to build here).

## Out of scope

- Actual payment processing — explicitly mocked per the project's stated
  intent that this prototype won't lead to real rentals.

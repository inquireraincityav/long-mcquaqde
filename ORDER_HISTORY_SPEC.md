# Order History — Screen Spec

Companion to PROJECT_BRIEF.md. Primarily an event-pro feature, per the
original persona split — first-time renters rarely have a repeat kit worth
revisiting.

## Entry point

Main navigation.

## Content

- List of past and upcoming orders: date range, kit/item summary, fulfillment
  location(s), status (upcoming / in progress / completed).
- **"Reorder this kit"** on a past order — carries the same item list into
  Cart, but prompts fresh for a date range rather than assuming the old dates
  still apply (it's presumably a new event).
- Filter/sort by date or status.
- Tapping an order opens a read-only detail view mirroring the Cart/Checkout
  summary that was in effect for that order.

## Edge cases

- Reordering a kit where an item is no longer available or has been
  discontinued: substitute with a clearly flagged placeholder ("This item is
  no longer available — choose a replacement") — never silently drop it or
  error out.
- First-time renters with no order history: a simple empty state. This isn't
  really their primary screen per the persona split, so the empty state can
  be brief rather than trying to hard-sell repeat use.

## Out of scope

- Spend analytics or reporting — a reasonable phase-2 idea, not core to this
  case study.

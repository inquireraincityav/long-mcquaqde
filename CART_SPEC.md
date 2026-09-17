# Multi-item Cart — Screen Spec

Companion to PROJECT_BRIEF.md. This is the screen where the competitive
teardown's central finding — nobody combines real-time availability with
cross-location fulfillment from a single retailer's own branches — actually
gets designed. Build this one carefully; it's the novel part.

## Entry point

Reached via "Add to cart" (Browse & Search / Gear Detail) or "Add full kit to
cart" (Kit Builder). Same screen for both personas — by this point in the
flow, the interaction pattern has already converged per the IA.

## Core logic — cross-location fulfillment resolution

Items are added without committing to a pickup location up front. The cart's
job is to work out fulfillment, not ask the user to.

Conceptual algorithm for Claude Code to implement:

1. For each item in the cart, determine which locations have it available for
   its requested date range. (`inventory.json`'s `location` field is currently
   a single example value — the real build needs a per-item, per-location
   availability record; flag this as a data-model expansion, not something
   the current JSON already supports.)
2. Check whether a single location covers every item in the cart. If yes,
   that's the default fulfillment plan: **"All items available at
   [Location]."**
3. If no single location covers everything, compute the minimum number of
   locations that together do, and surface it as an explicit notice, not a
   buried detail: **"Your kit will be split across 2 locations: [A] and [B] —
   you'll need two pickups."**
4. When a split is detected, offer a **"consolidate to one location"**
   suggestion — swap the item(s) causing the split for an equivalent item
   available at the majority location, if one exists.

## Content

- Line items: image, name, qty, per-item date range (defaults to one shared
  range across the whole kit, but editable per item for staggered needs),
  per-item subtotal.
- Fulfillment summary block: single-location confirmation, or the
  split-location warning described above.
- Running total (day/week/month), computed live as the cart changes — same
  total logic pattern as Kit Templates / Kit Builder.
- Edit actions: change quantity, remove item, edit one item's dates or apply
  one range to the whole cart.
- **"Proceed to checkout"** CTA.

## Edge cases

- An item becomes unavailable for its dates while sitting in the cart
  (date changed elsewhere, hypothetically booked by someone else in a real
  system): flag it inline with a clear message and a "find alternative"
  action — never silently remove it.
- Removing the item that was causing a location split: recompute the
  fulfillment plan automatically and update the summary, don't leave a stale
  warning on screen.
- Empty cart: plain empty state, link back to both Browse and Kit Builder.

## Out of scope

- Payment/deposit handling — Checkout's job.
- Executing the actual pickup — Pickup & Return's job.

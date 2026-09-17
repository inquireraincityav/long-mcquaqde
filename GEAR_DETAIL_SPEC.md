# Gear Detail — Screen Spec

Companion to PROJECT_BRIEF.md.

## Entry point

Not a standalone route. Opens as a drawer/modal from:
- Browse & Search (tap a card) — full version, as specced below.
- Kit Builder (swap an item) — a lighter inline picker instead, per
  KIT_BUILDER_SPEC.md's "out of scope" note. This doc covers the full drawer.

Inherits whatever date range and location filter are already set upstream —
never starts from a blank state if the person already made choices in Browse.

## Content

- **Header** — product name, model/SKU, large image (`imageSource` from
  `inventory.json`), condition/stock badge (New/Used/Demo), review rating.
- **Spec block** — pulled from the same inventory data referenced by
  `heuristic-rules.json`, so a number shown here (e.g. mic count, wattage)
  never disagrees with what the kit-builder reasons over elsewhere.
- **Description** — manufacturer/L&M product description text.
- **Pricing** — shown as day/week/month tiers by default. If a date range is
  already set (inherited from Browse), resolve to an actual total for that
  exact window instead of just the generic tiered rates.
- **Rental terms, surfaced inline** — this is a real improvement over L&M's
  current flow, where these live buried in a separate FAQ page: ID
  requirement, deposit note if paying without a credit card (e.g. "$20
  deposit if no credit card on file"), hold-fee note if reserving in advance.
- **Availability line** — one line, lightweight: "Available for your dates
  at 2 of 3 nearby locations." Not a full branch picker — resolving exactly
  which branch fulfills what is Cart's job, not this screen's.

## Persona split

- **First-time renter:** brief reassurance copy near the terms section (e.g.
  "No credit card? Here's what to expect") — this FAQ-page anxiety is real for
  someone renting for the first time.
- **Event pro:** skips the reassurance copy; spec table takes visual priority
  since this persona already knows what they're comparing.

## CTA

Date range (pre-filled if set upstream, editable) + quantity stepper. Add to
cart stays disabled until a valid date range is set — an item without dates
can't get an accurate price or a real availability answer.

## Edge cases

- Item unavailable for the entire selected range at every location: state it
  plainly ("Not available for these dates"), grey out add-to-cart, suggest
  adjusting dates rather than leaving a dead-end button.
- Item missing price data: show "Contact store for rate," disable add-to-cart
  with a one-line explanation — never a blank or $0 price.
- Requested quantity exceeds known availability for the date range: cap the
  stepper at the available quantity when that's known; otherwise leave
  uncapped and let Cart catch the conflict during fulfillment resolution.

## Out of scope

- Choosing a specific pickup branch — Cart's job.
- Building a multi-item kit — Kit Builder's job (this drawer is for one item
  at a time).

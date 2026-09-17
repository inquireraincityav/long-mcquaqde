# Browse & Search — Screen Spec

Companion to PROJECT_BRIEF.md.

## Entry point

Primary landing for the first-time-renter path off the entry point (see IA in
PROJECT_BRIEF.md). Also reachable from main nav for anyone who prefers
browsing over the guided Kit Builder flow, including pro users.

## Filter bar

- **Category** — from L&M's real department taxonomy: PA Speakers,
  Microphones, Mixers, Lighting & Screens, Video/Recording, Stands & Cabling.
- **Date range** — optional but drives the availability differentiator (see
  below). Without dates set, the full catalog shows with no availability claim.
- **Location** — defaults to "any nearby," not a forced pick. A first-time
  renter usually doesn't know which branch yet.
- **Sort** — relevance (default), price, soonest availability.

## Card grid

Each card pulls from `inventory.json`:
- Product image (`imageSource`)
- Product name
- One spec highlight relevant to its category (wattage for speakers, channel
  count for mixers, etc.) — not the full spec block, that's Gear Detail's job
- Price: **"from $X/day"** using the lowest rate across nearby locations until
  a location is chosen; once chosen, resolves to that location's actual rate.
  This matches how L&M's own real pricing already varies by store — don't
  show one fixed number.
- Stock badge: In stock / Demo available / Used

## Availability filter (the designed feature — doesn't exist on L&M today)

Filtering by date range excludes items unavailable at **every** nearby
location for those dates. Items available at only some locations still
appear, tagged: **"Available at 2 of 3 locations."** This is explicitly new
functionality being designed, not a redesign of something L&M already has —
say so in the case study writeup, not just here.

## Tap behavior

Opens Gear Detail as a drawer/modal (see GEAR_DETAIL_SPEC.md), inheriting the
current date range and location filter — no re-entering context.

## Edge cases

- No dates selected: full catalog, price shown as a range, no availability
  badge shown at all (rather than a misleading "available" claim).
- Zero results for the active filters: explicit empty state — "No items match
  — try adjusting filters or dates" — never a blank grid with no explanation.
- An item with missing price/image data (flagged in `inventory.json`'s notes
  field): show a "Contact store for details" badge instead of a blank price;
  never let missing data render as $0 or an empty card.

## Out of scope for this screen

- Kit assembly — that's Kit Builder.
- Branch-level fulfillment resolution for a multi-item order — that's Cart.

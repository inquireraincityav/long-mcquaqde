# Kit Builder — Screen Spec

Companion to PROJECT_BRIEF.md. This is the screen carrying the case study's
core differentiator (the AI feature), so it's specced in more detail than the
other screens — build this one closest to the letter of this doc.

## Entry point

Reached directly from the entry-point branch, event-pro path (see IA in
PROJECT_BRIEF.md). Not reachable from the guided browse path — first-time
renters stay in the simpler flow.

## Inputs (collected up front, before any suggestion is generated)

1. **Event type** — dropdown. Options match `heuristic-rules.json` categories:
   Wedding ceremony, Wedding reception, Corporate speech/panel, DJ set/club
   night, plus a **Custom** option for anything else.
2. **Guest count** — numeric input or coarse slider aligned to the existing
   tiers (<100, 100-200, 200-400, etc.).
3. **Venue** — Indoor / Outdoor toggle.
4. **Date range** — required here, not deferred to cart. A pro renter usually
   knows their dates before their gear list, and availability resolution needs
   dates as early as possible.

All four are required before generation runs.

## Resolution logic

Order of operations:

1. **Template match check** — compare (event type, guest count, venue) against
   `kit-templates.json`. If the inputs closely match one of the 4 real named
   packages (e.g. "Corporate speech/panel" -> Panel/Conference Package), return
   that template's item list directly.
   - Label this result plainly in the UI: **"Matches our [Package Name]
     package"** — signals this is a known, pre-quoted combination, not a novel
     AI guess. This labeling is a UI requirement, not optional copy.
2. **Heuristic fallback** — if no template match, look up the nearest row in
   `heuristic-rules.json` for target wattage / speaker & sub count / mic counts
   / mixer channel minimum. Match those specs against real in-stock items in
   `inventory.json` (by category + spec) to assemble a custom list.
   - Label this result differently: **"Suggested based on your event size"** —
     signals more inference went into this one.
3. **LLM's job** is turning the result of (1) or (2) into natural language and
   handling ambiguous/edge-case inputs. The JSON data is ground truth the LLM
   reasons from — it does not invent items, prices, or specs outside what's in
   `inventory.json`.

### Edge cases (specify behavior explicitly, don't leave implicit)

- **Guest count falls between two heuristic tiers** — interpolate, or default
  to the nearer/larger tier if interpolation isn't implemented; either way,
  surface it: *"Closest match: 100-200 guest tier."*
- **An item in the suggested list has no confirmed price yet** (e.g. Podium
  mic) — display "Price to be confirmed" on that line item; do not show $0 or
  silently exclude it from the running total in a way that makes the total
  look complete when it isn't.
- **Event type = Custom** — skip template matching entirely, go straight to
  heuristic reasoning with the widest applicable fallback rule.
- **No heuristic row is a reasonable match at all** (e.g. extreme guest count
  outside any tier) — surface this honestly rather than forcing a bad match:
  suggest contacting a location directly, echoing the real L&M flow this
  screen is otherwise improving on.

## Output & editing

- Generated list renders as item cards, pulling directly from
  `inventory.json` — same product images, names, and prices used everywhere
  else in the product (Browse, Gear Detail, Cart). No separate/duplicated data.
- Each card has a quantity stepper and a swap/remove action.
- Running total (day/week/month) computed live as the person edits — same
  total logic as the Kit Templates sheet's formulas, just reactive instead of
  static.
- **"Why this list" disclosure** — collapsed by default. When expanded, shows
  the underlying rule that produced the result (e.g. "6-8W/guest, indoor,
  300-400 guests"). For pro users who want to sanity-check the suggestion
  against their own judgment; kept out of the default view so it doesn't
  clutter the screen for someone who just wants the answer.

## Primary CTA

**"Add full kit to cart"** — single action. All items, quantities, and the
already-set date range transfer to Multi-item Cart together. No per-item
add-to-cart step required (that's the guided-browse pattern, not this one).

## Explicitly out of scope for this screen

- Cross-location fulfillment resolution — that happens in Cart, once the full
  kit is assembled. This screen doesn't need to know which branch stocks what.
- Gear Detail drill-down — swapping an item here should be a lightweight
  inline picker (same category, matching or better spec), not a jump to the
  full Gear Detail drawer.

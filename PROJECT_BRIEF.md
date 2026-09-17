# Long & McQuade Gear Rental Redesign — Case Study Build Brief

Prepared as a handoff document for building the working prototype in Claude Code.
This captures every decision made during planning so the build doesn't have to
re-derive context from scratch.

## What this is

A UI/UX portfolio case study (for jaivalshah.com) redesigning Long & McQuade's
gear rental flow around multi-item, multi-day rental logistics for event
professionals — not a single-item consumer rental flow (that pattern already
exists in the portfolio via the Adventure Awaits case study).

Primary persona: an event professional (SJAI Studio-type user) renting a full
gear kit for a gig, often across multiple days, sometimes needing items from
more than one branch.
Secondary persona: a first-time renter needing one or two items with a simpler,
more guided path.

## Competitive context (already researched)

- Long & McQuade's real flow today: browse by category, then a manual rental
  quote request — no real-time cross-item/cross-date availability, resolved by
  staff over phone/email.
- ShareGrid and KitSplit (peer-to-peer gear rental) already solve real-time
  per-item availability calendars and multi-item insurance stacking — but
  neither solves cross-location fulfillment from a single retailer's own branches,
  because they're peer-to-peer, not one company's inventory.
- The gap nobody has solved: real-time availability + multi-item kit curation +
  a single retailer's own multi-branch inventory, combined into one self-serve flow.

## Information architecture (confirmed)

Entry point branches into two paths that converge into a shared flow:

1. **Landing / entry point** → branches to:
   - **Guided browse & search** (first-time renter path) — category + date-range
     availability filter, card grid pulling real L&M product data.
   - **Kit builder** (event-pro path) — AI-suggested starting kit based on event
     type + guest count, using the heuristic rules + inventory data below.
2. Both converge into **Multi-item cart** — cross-location, per-date availability
   resolution (this is the screen that does the thing nobody in the competitive
   teardown has actually solved).
3. **Quote & checkout** — deposit, delivery/pickup terms surfaced inline (today
   these live buried in L&M's FAQ page, disconnected from the product).
4. Splits into:
   - **Pickup & return** (mobile-first — condition check-in/out)
   - **Order history** (pro-renter feature — repeat kit re-ordering)

Gear Detail is NOT a standalone screen — it's a drawer/modal off Browse (or
inline in the kit builder), inheriting whatever dates/location context is
already set upstream.

## Data layer

Three JSON files accompany this brief (exported from the working spreadsheet):

- `inventory.json` — real Long & McQuade catalog items: category, product name,
  day/month rental rate, source link, and an image source URL per item
  (manufacturer site preferred, then major retailer, then L&M's own product
  page). A few items are still missing prices or images — see `notes` field
  per item.
- `kit-templates.json` — the 4 real named packages L&M staff already quote
  (Standard PA, Panel/Conference, Recording/Hybrid Meeting, Presentation +
  Projector), with real item lists and quantities. Use these as fixed/canned
  results when a user's request matches one of these use cases directly.
- `heuristic-rules.json` — guest-count/event-type/venue rules (wattage targets,
  speaker/sub/mic counts, mixer channel minimums) for scenarios the 4 fixed
  packages don't cover (weddings, DJ sets). This is the table the AI feature
  reasons over for anything outside the named packages.

**Known data issues to carry forward, not silently fix:**
- "Podium mic" is referenced in two packages but has no real price/model yet.
- "Shure e835" is a naming error — that model is actually made by Sennheiser,
  not Shure (image source and correction are in `inventory.json`).
- Two inventory items (generic 135in screen, Apex boundary mic) have no
  confirmed image source yet.

## The AI kit-builder feature (the core differentiator)

Input: event type + guest count + venue (indoor/outdoor).
Logic:
1. If the input matches one of the 4 named kit templates closely, return that
   template directly (fast, predictable).
2. Otherwise, look up the nearest row in `heuristic-rules.json` for target
   wattage / mic counts / mixer channels, then match those specs against
   real in-stock items in `inventory.json` to assemble a live gear list.
3. An LLM call handles turning (1) or (2) into natural language and handling
   edge cases (e.g. guest counts between tiers, mixed event types) — the JSON
   data is the ground truth it reasons from, not something it invents.

**Architecture note — read before building:** calling the Claude API (or any
LLM API) directly from client-side JavaScript means the API key ships in the
browser and is publicly visible in the deployed site's source — this is fine
for the artifact preview inside a Claude.ai chat, but NOT safe once this is a
real, hosted GitHub project. The kit-builder's LLM call needs to go through a
small backend (a serverless function on Vercel/Netlify, or a minimal
Node/Express server) that holds the API key server-side and the frontend calls
that endpoint instead. Worth deciding the hosting platform early since it
determines this piece's shape.

## Suggested repo structure

```
/data
  inventory.json
  kit-templates.json
  heuristic-rules.json
/src
  (frontend — screens per the IA above)
/api or /functions
  kit-builder.js  (serverless function proxying the LLM call)
README.md
```

## All screens — fully specced

Every screen in the IA has its own spec file. Read the relevant one before
building that screen — each covers entry point, content, logic, persona
differences, edge cases, and what's explicitly out of scope for it:

- `BROWSE_SEARCH_SPEC.md` — guided browse & search (first-time-renter path)
- `GEAR_DETAIL_SPEC.md` — the item detail drawer (opened from Browse or Kit
  Builder)
- `KIT_BUILDER_SPEC.md` — the AI-driven kit builder (event-pro path); build
  this one closest to the letter of its spec, it carries the core
  differentiator
- `CART_SPEC.md` — multi-item cart and the cross-location fulfillment
  resolution logic; this is the screen the competitive teardown found nobody
  else has solved, build it carefully
- `CHECKOUT_SPEC.md` — quote & checkout, payment explicitly mocked
- `PICKUP_RETURN_SPEC.md` — mobile-first condition check-in/out
- `ORDER_HISTORY_SPEC.md` — repeat-kit reordering for pro renters

## Not yet decided

- Final choice of hosting platform (affects the serverless function approach
  above).
- Visual design system for the build (the portfolio site uses a Liquid Glass
  visual language, Inter typeface, teal accent, per the existing portfolio
  rebuild — worth checking whether this case study should match that system).

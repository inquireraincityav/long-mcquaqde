import { getAvailableLocations, LOCATIONS } from './availability';

export function resolveFulfillment(cartItems) {
  if (cartItems.length === 0) {
    return { type: 'empty', locations: [], plan: [] };
  }

  const itemLocations = cartItems.map((item) => ({
    product: item.product,
    locations: new Set(
      getAvailableLocations(item.product).map((l) => l.id)
    ),
  }));

  const allLocationIds = LOCATIONS.map((l) => l.id);
  const singleCoverage = allLocationIds.find((locId) =>
    itemLocations.every((il) => il.locations.has(locId))
  );

  if (singleCoverage) {
    const loc = LOCATIONS.find((l) => l.id === singleCoverage);
    return {
      type: 'single',
      locations: [loc],
      plan: cartItems.map((item) => ({
        product: item.product,
        location: loc,
      })),
    };
  }

  const plan = [];
  const locationUsage = {};

  for (const il of itemLocations) {
    const locArray = [...il.locations];
    if (locArray.length === 0) {
      plan.push({ product: il.product, location: null });
      continue;
    }

    let bestLoc = locArray[0];
    let bestCount = 0;
    for (const locId of locArray) {
      const count = itemLocations.filter((other) =>
        other.locations.has(locId)
      ).length;
      if (count > bestCount) {
        bestCount = count;
        bestLoc = locId;
      }
    }

    const loc = LOCATIONS.find((l) => l.id === bestLoc);
    plan.push({ product: il.product, location: loc });
    locationUsage[bestLoc] = (locationUsage[bestLoc] || 0) + 1;
  }

  const usedLocations = [
    ...new Set(plan.filter((p) => p.location).map((p) => p.location.id)),
  ].map((id) => LOCATIONS.find((l) => l.id === id));

  const unavailable = plan.filter((p) => !p.location);

  return {
    type: usedLocations.length > 1 ? 'split' : 'single',
    locations: usedLocations,
    plan,
    unavailable: unavailable.length > 0 ? unavailable : undefined,
  };
}

export function suggestConsolidation(cartItems, fulfillmentResult) {
  if (fulfillmentResult.type !== 'split') return null;

  const locationCounts = {};
  for (const p of fulfillmentResult.plan) {
    if (p.location) {
      locationCounts[p.location.id] =
        (locationCounts[p.location.id] || 0) + 1;
    }
  }

  const majorityLocId = Object.entries(locationCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  if (!majorityLocId) return null;

  const majorityLoc = LOCATIONS.find((l) => l.id === majorityLocId);
  const splitters = fulfillmentResult.plan.filter(
    (p) => p.location && p.location.id !== majorityLocId
  );

  return {
    majorityLocation: majorityLoc,
    itemsCausingSplit: splitters.map((s) => s.product),
  };
}

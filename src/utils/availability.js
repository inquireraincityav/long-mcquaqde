const LOCATIONS = [
  { id: 'van-broadway', name: 'Vancouver (Broadway)', city: 'Vancouver' },
  { id: 'van-main', name: 'Vancouver (Main St)', city: 'Vancouver' },
  { id: 'burnaby', name: 'Burnaby', city: 'Burnaby' },
  { id: 'surrey', name: 'Surrey', city: 'Surrey' },
  { id: 'richmond', name: 'Richmond', city: 'Richmond' },
];

export { LOCATIONS };

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getItemAvailability(product) {
  const hash = hashString(product);
  return LOCATIONS.map((loc, i) => ({
    ...loc,
    available: seededRandom(hash + i) > 0.25,
    condition: seededRandom(hash + i + 100) > 0.5 ? 'New' : 'Used',
  }));
}

export function getAvailableLocations(product) {
  return getItemAvailability(product).filter((l) => l.available);
}

export function getAvailableLocationCount(product) {
  return getAvailableLocations(product).length;
}

export function isAvailableAnywhere(product) {
  return getAvailableLocationCount(product) > 0;
}

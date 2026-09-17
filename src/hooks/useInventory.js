import { useMemo } from 'react';
import inventory from '../../data/inventory.json';

const CATEGORIES = [
  'Speakers',
  'Microphones',
  'Mixers & Extras',
  'Visual',
];

export default function useInventory(filters = {}) {
  const { category, search, location } = filters;

  const items = useMemo(() => {
    let result = [...inventory];

    if (category && category !== 'all') {
      result = result.filter((item) => item.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.product.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [category, search, location]);

  const lookup = useMemo(
    () => Object.fromEntries(inventory.map((item) => [item.product, item])),
    []
  );

  return { items, categories: CATEGORIES, lookup };
}

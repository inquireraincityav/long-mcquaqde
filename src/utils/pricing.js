export function daysBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
}

export function computeItemTotal(item, days) {
  if (!item.rentalDay) return null;
  if (days <= 0) return 0;

  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  if (item.rentalMonth && months >= 1) {
    return months * item.rentalMonth + remainingDays * item.rentalDay;
  }
  return days * item.rentalDay;
}

export function computeCartTotal(items, inventoryLookup) {
  let total = 0;
  let hasUnpriced = false;

  for (const cartItem of items) {
    const inv = inventoryLookup[cartItem.product];
    if (!inv || !inv.rentalDay) {
      hasUnpriced = true;
      continue;
    }
    const days = daysBetween(
      cartItem.dateRange?.start,
      cartItem.dateRange?.end
    );
    const itemTotal = computeItemTotal(inv, days);
    if (itemTotal !== null) {
      total += itemTotal * cartItem.qty;
    } else {
      hasUnpriced = true;
    }
  }

  return { total, hasUnpriced };
}

export function formatPrice(amount) {
  if (amount === null || amount === undefined) return 'Price TBD';
  return `$${amount.toLocaleString('en-CA', { minimumFractionDigits: 0 })}`;
}

import { formatPrice } from '../utils/pricing';

export default function PriceDisplay({
  rentalDay,
  rentalMonth,
  totalDays,
  totalAmount,
  qty = 1,
  compact = false,
}) {
  if (!rentalDay && !rentalMonth) {
    return (
      <span style={styles.tbd}>Contact store for rate</span>
    );
  }

  if (totalAmount !== undefined && totalAmount !== null) {
    return (
      <div style={styles.wrapper}>
        <span style={styles.total}>{formatPrice(totalAmount * qty)}</span>
        {totalDays && (
          <span style={styles.duration}>
            for {totalDays} day{totalDays !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <span style={styles.rate}>
        from {formatPrice(rentalDay)}/day
      </span>
    );
  }

  return (
    <div style={styles.tiers}>
      <div style={styles.tier}>
        <span style={styles.tierAmount}>{formatPrice(rentalDay)}</span>
        <span style={styles.tierLabel}>/day</span>
      </div>
      {rentalMonth && (
        <div style={styles.tier}>
          <span style={styles.tierAmount}>{formatPrice(rentalMonth)}</span>
          <span style={styles.tierLabel}>/month</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-xs)',
  },
  total: {
    fontWeight: 600,
    fontSize: 'var(--text-lg)',
    color: 'var(--color-text)',
  },
  duration: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
  rate: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
  },
  tbd: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-warning)',
    background: 'var(--color-warning-light)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  tiers: {
    display: 'flex',
    gap: 'var(--space-md)',
  },
  tier: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 2,
  },
  tierAmount: {
    fontWeight: 600,
    fontSize: 'var(--text-base)',
  },
  tierLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
};

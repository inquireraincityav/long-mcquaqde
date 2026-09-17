import { getAvailableLocationCount, LOCATIONS } from '../utils/availability';

export default function AvailabilityBadge({ product, hasDateRange = false }) {
  if (!hasDateRange) return null;

  const count = getAvailableLocationCount(product);
  const total = LOCATIONS.length;

  if (count === 0) {
    return (
      <span style={{ ...styles.badge, ...styles.unavailable }}>
        Not available
      </span>
    );
  }

  if (count === total) {
    return (
      <span style={{ ...styles.badge, ...styles.available }}>
        In stock
      </span>
    );
  }

  return (
    <span style={{ ...styles.badge, ...styles.partial }}>
      Available at {count} of {total} locations
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 500,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
  },
  available: {
    background: 'var(--color-success-light)',
    color: 'var(--color-success)',
  },
  partial: {
    background: 'var(--color-warning-light)',
    color: 'var(--color-warning)',
  },
  unavailable: {
    background: 'var(--color-danger-light)',
    color: 'var(--color-danger)',
  },
};

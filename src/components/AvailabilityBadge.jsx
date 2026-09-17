import { getAvailableLocationCount, LOCATIONS } from '../utils/availability';

export default function AvailabilityBadge({ product, hasDateRange = false, overlay = false }) {
  if (!hasDateRange) return null;

  const count = getAvailableLocationCount(product);
  const total = LOCATIONS.length;

  if (count === 0) {
    return (
      <span style={{ ...styles.badge, ...styles.unavailable, ...(overlay ? styles.overlay : {}) }}>
        Not available
      </span>
    );
  }

  if (count >= total - 1) {
    return (
      <span style={{ ...styles.badge, ...styles.available, ...(overlay ? styles.overlay : {}) }}>
        In stock
      </span>
    );
  }

  return (
    <span style={{ ...styles.badge, ...styles.partial, ...(overlay ? styles.overlay : {}) }}>
      {count} of {total} locations
    </span>
  );
}

const styles = {
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  available: {
    background: 'rgba(22, 163, 74, 0.15)',
    color: '#16a34a',
  },
  partial: {
    background: 'rgba(217, 119, 6, 0.15)',
    color: '#b45309',
  },
  unavailable: {
    background: 'rgba(220, 38, 38, 0.12)',
    color: 'var(--color-danger)',
  },
};

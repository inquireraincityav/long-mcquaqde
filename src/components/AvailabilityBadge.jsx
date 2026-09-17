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
    fontSize: '10.5px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '7px',
    whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  available: {
    background: 'rgba(46, 125, 50, 0.10)',
    color: '#1a5c1e',
  },
  partial: {
    background: 'rgba(234, 179, 8, 0.13)',
    color: '#7a4d00',
  },
  unavailable: {
    background: 'rgba(220, 38, 38, 0.12)',
    color: 'var(--color-danger)',
  },
};

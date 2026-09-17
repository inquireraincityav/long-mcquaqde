import AvailabilityBadge from './AvailabilityBadge';
import { getDisplayData } from '../utils/displayData';
import placeholderImg from '/placeholder-gear.svg';

export default function GearCard({ item, hasDateRange, onClick }) {
  const display = getDisplayData(item.product);

  return (
    <button style={styles.card} onClick={onClick} aria-label={`View ${display.shortName}`}>
      <div style={styles.imageWrapper}>
        <img
          src={item.imageSource || placeholderImg}
          alt={display.shortName}
          style={styles.image}
          onError={(e) => { e.target.src = placeholderImg; }}
        />
        <AvailabilityBadge product={item.product} hasDateRange={hasDateRange} overlay />
      </div>

      <div style={styles.body}>
        <h3 style={styles.name}>{display.shortName}</h3>
        {display.specs && <p style={styles.specs}>{display.specs}</p>}
        {item.rentalDay ? (
          <span style={styles.price}>from ${item.rentalDay}<span style={styles.priceUnit}>/day</span></span>
        ) : (
          <span style={styles.priceTbd}>Contact for rate</span>
        )}
      </div>
    </button>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--color-border-glass)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow), var(--glass-highlight)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.15s',
    textAlign: 'left',
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '4/3',
    background: '#1a1520',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.88,
  },
  body: {
    padding: '11px 12px 13px',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    flex: 1,
  },
  name: {
    fontSize: '12.5px',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  specs: {
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
  price: {
    fontSize: '14.5px',
    fontWeight: 800,
    color: 'var(--color-accent)',
    marginTop: 'var(--space-sm)',
  },
  priceUnit: {
    fontWeight: 500,
    fontSize: '10.5px',
    color: 'var(--color-text-secondary)',
  },
  priceTbd: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-warning)',
    marginTop: 'var(--space-sm)',
  },
};

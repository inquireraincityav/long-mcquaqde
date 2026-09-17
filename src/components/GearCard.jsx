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
          <span style={styles.priceTbd}>Contact store</span>
        )}
      </div>
    </button>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-surface-solid)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.15s',
    textAlign: 'left',
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '4/3',
    background: '#f0f0ea',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: 'var(--space-sm) var(--space-md) var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
  },
  name: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-text)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  specs: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.3,
  },
  price: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-accent)',
    marginTop: 'var(--space-xs)',
  },
  priceUnit: {
    fontWeight: 400,
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  priceTbd: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    color: 'var(--color-warning)',
    marginTop: 'var(--space-xs)',
  },
};

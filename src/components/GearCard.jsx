import PriceDisplay from './PriceDisplay';
import AvailabilityBadge from './AvailabilityBadge';
import placeholderImg from '/placeholder-gear.svg';

function specHighlight(item) {
  const p = item.product.toLowerCase();
  if (p.includes('watt')) {
    const m = item.product.match(/(\d+)\s*Watt/i);
    if (m) return `${m[1]}W`;
  }
  if (p.includes('channel')) {
    const m = item.product.match(/(\d+)-Channel/i);
    if (m) return `${m[1]} Ch`;
  }
  if (p.includes('inch') || p.includes('"')) {
    const m = item.product.match(/(\d+)\s*(?:Inch|")/i);
    if (m) return `${m[1]}"`;
  }
  return null;
}

export default function GearCard({ item, hasDateRange, onClick }) {
  const spec = specHighlight(item);

  return (
    <button style={styles.card} onClick={onClick} aria-label={`View ${item.product}`}>
      <div style={styles.imageWrapper}>
        <img
          src={item.imageSource || placeholderImg}
          alt={item.product}
          style={styles.image}
          onError={(e) => {
            e.target.src = placeholderImg;
          }}
        />
        {spec && <span style={styles.spec}>{spec}</span>}
      </div>

      <div style={styles.body}>
        <span style={styles.category}>{item.category}</span>
        <h3 style={styles.name}>{item.product}</h3>

        <div style={styles.footer}>
          <PriceDisplay
            rentalDay={item.rentalDay}
            rentalMonth={item.rentalMonth}
            compact
          />
          <AvailabilityBadge
            product={item.product}
            hasDateRange={hasDateRange}
          />
        </div>
      </div>
    </button>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-surface)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
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
    background: '#f0f4f8',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: 'var(--space-md)',
  },
  spec: {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  body: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
    flex: 1,
  },
  category: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  name: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-text)',
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 'var(--space-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
};

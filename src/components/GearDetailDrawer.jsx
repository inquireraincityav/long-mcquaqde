import { useState } from 'react';
import PriceDisplay from './PriceDisplay';
import QuantityStepper from './QuantityStepper';
import DateRangePicker from './DateRangePicker';
import AvailabilityBadge from './AvailabilityBadge';
import { useCart } from '../context/CartContext';
import { daysBetween, computeItemTotal } from '../utils/pricing';
import placeholderImg from '/placeholder-gear.svg';

export default function GearDetailDrawer({ item, dateRange: initialDateRange, onClose }) {
  const { addItem } = useCart();
  const [dateRange, setDateRange] = useState(
    initialDateRange || { start: '', end: '' }
  );
  const [qty, setQty] = useState(1);

  if (!item) return null;

  const days = daysBetween(dateRange.start, dateRange.end);
  const validDates = dateRange.start && dateRange.end && days > 0;
  const totalAmount = validDates ? computeItemTotal(item, days) : null;
  const canAdd = validDates && item.rentalDay;

  function handleAdd() {
    addItem({
      product: item.product,
      category: item.category,
      rentalDay: item.rentalDay,
      rentalMonth: item.rentalMonth,
      imageSource: item.imageSource,
      qty,
      dateRange,
    });
    onClose();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={styles.imageSection}>
          <img
            src={item.imageSource || placeholderImg}
            alt={item.product}
            style={styles.image}
            onError={(e) => { e.target.src = placeholderImg; }}
          />
        </div>

        <div style={styles.content}>
          <span style={styles.category}>{item.category}</span>
          <h2 style={styles.title}>{item.product}</h2>

          <AvailabilityBadge product={item.product} hasDateRange={validDates} />

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Pricing</h4>
            <PriceDisplay
              rentalDay={item.rentalDay}
              rentalMonth={item.rentalMonth}
              totalDays={validDates ? days : undefined}
              totalAmount={totalAmount}
              qty={qty}
            />
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Rental terms</h4>
            <ul style={styles.terms}>
              <li>Valid government-issued ID required at pickup</li>
              <li>$20 deposit if no credit card on file</li>
              <li>Hold fee may apply for advance reservations</li>
            </ul>
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Rental dates</h4>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Quantity</h4>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>

          <button
            className="btn-primary"
            style={styles.addBtn}
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {!canAdd
              ? item.rentalDay
                ? 'Select dates to add'
                : 'Contact store for rate'
              : `Add to cart — ${totalAmount !== null ? `$${(totalAmount * qty).toLocaleString()}` : 'Price TBD'}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'flex-end',
    animation: 'fadeIn 0.15s ease-out',
  },
  drawer: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--color-surface-solid)',
    height: '100%',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: 'var(--glass-shadow-xl)',
  },
  closeBtn: {
    position: 'absolute',
    top: 'var(--space-md)',
    right: 'var(--space-md)',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    zIndex: 1,
    color: 'var(--color-text-secondary)',
  },
  imageSection: {
    background: '#f0f4f8',
    aspectRatio: '4/3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--space-xl)',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  content: {
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  category: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  sectionTitle: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  terms: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  divider: {
    height: 1,
    background: 'var(--color-border)',
    margin: 'var(--space-sm) 0',
  },
  addBtn: {
    width: '100%',
    marginTop: 'var(--space-sm)',
    height: 48,
    fontSize: 'var(--text-base)',
  },
};

import { useState } from 'react';
import QuantityStepper from './QuantityStepper';
import AvailabilityBadge from './AvailabilityBadge';
import { useCart } from '../context/CartContext';
import { daysBetween, computeItemTotal, formatPrice } from '../utils/pricing';
import { getDisplayData, getWeeklyRate } from '../utils/displayData';
import placeholderImg from '/placeholder-gear.svg';

export default function GearDetailDrawer({ item, dateRange: initialDateRange, onClose }) {
  const { addItem } = useCart();
  const [dateRange, setDateRange] = useState(initialDateRange || { start: '', end: '' });
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');

  if (!item) return null;

  const display = getDisplayData(item.product);
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

  const weeklyRate = getWeeklyRate(item.rentalDay);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.dragHandleWrap}>
          <div style={styles.dragHandle} />
        </div>
        <div style={styles.imageSection}>
          <AvailabilityBadge product={item.product} hasDateRange={validDates} overlay />
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={item.imageSource || placeholderImg}
            alt={display.shortName}
            style={styles.image}
            onError={(e) => { e.target.src = placeholderImg; }}
          />
        </div>

        <div style={styles.content}>
          <h2 style={styles.title}>{display.shortName}</h2>

          <div style={styles.metaRow}>
            {display.sku && <span style={styles.sku}>SKU: {display.sku}</span>}
            {display.condition && display.condition !== 'TBD' && (
              <span style={styles.conditionBadge}>{display.condition}</span>
            )}
          </div>

          {display.rating && (
            <div style={styles.ratingRow}>
              <span style={styles.stars}>{'★'.repeat(Math.round(display.rating))}</span>
              <span style={styles.ratingNum}>{display.rating}</span>
              <span style={styles.reviewCount}>({display.reviews} reviews)</span>
            </div>
          )}

          <div style={styles.priceTiers}>
            <div style={{ ...styles.tierBox, ...(validDates && days <= 6 ? styles.tierActive : {}) }}>
              <span style={styles.tierLabel}>Daily</span>
              <span style={styles.tierPrice}>{item.rentalDay ? formatPrice(item.rentalDay) : '—'}</span>
            </div>
            <div style={{ ...styles.tierBox, ...(validDates && days > 6 && days < 30 ? styles.tierActive : {}) }}>
              <span style={styles.tierLabel}>Weekly</span>
              <span style={styles.tierPrice}>{weeklyRate ? formatPrice(weeklyRate) : '—'}</span>
            </div>
            <div style={{ ...styles.tierBox, ...(validDates && days >= 30 ? styles.tierActive : {}) }}>
              <span style={styles.tierLabel}>Monthly</span>
              <span style={styles.tierPrice}>{item.rentalMonth ? formatPrice(item.rentalMonth) : '—'}</span>
            </div>
          </div>

          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(activeTab === 'specs' ? styles.tabActive : {}) }}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              style={{ ...styles.tab, ...(activeTab === 'terms' ? styles.tabActive : {}) }}
              onClick={() => setActiveTab('terms')}
            >
              Rental Terms
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div style={styles.specsGrid}>
              {Object.entries(display.detailSpecs).map(([key, val]) => (
                <div key={key} style={styles.specItem}>
                  <span style={styles.specLabel}>{key}</span>
                  <span style={styles.specValue}>{val}</span>
                </div>
              ))}
            </div>
          ) : (
            <ul style={styles.terms}>
              <li>Valid government-issued ID required at pickup</li>
              <li>$20 deposit if no credit card on file</li>
              <li>Hold fee may apply for advance reservations</li>
              <li>Damage review within 48 hrs of return</li>
            </ul>
          )}
        </div>

        <div style={styles.bottomBar}>
          <div style={styles.dateQtyRow}>
            <div style={styles.dateDisplay}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                type="date"
                value={dateRange.start || ''}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={styles.dateInput}
              />
              <span style={{ color: 'var(--color-text-tertiary)' }}>-</span>
              <input
                type="date"
                value={dateRange.end || ''}
                min={dateRange.start || ''}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={styles.dateInput}
              />
            </div>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>

          <button
            className="btn-primary"
            style={styles.addBtn}
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {!canAdd
              ? item.rentalDay ? 'Select dates to add' : 'Contact store for rate'
              : `Add to Cart - ${formatPrice((totalAmount || 0) * qty)} total`}
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
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  drawer: {
    width: '100%',
    maxWidth: 'var(--max-width)',
    background: 'var(--color-surface-solid)',
    maxHeight: '95dvh',
    overflowY: 'auto',
    position: 'relative',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    boxShadow: 'var(--glass-shadow-xl)',
    display: 'flex',
    flexDirection: 'column',
  },
  dragHandleWrap: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0 6px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    background: 'rgba(0, 0, 0, 0.2)',
  },
  closeBtn: {
    position: 'absolute',
    top: 'var(--space-md)',
    right: 'var(--space-md)',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-full)',
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    zIndex: 3,
    color: 'var(--color-text-secondary)',
  },
  imageSection: {
    position: 'relative',
    background: '#1a1520',
    aspectRatio: '16/10',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.88,
  },
  content: {
    padding: 'var(--space-lg) var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    flex: 1,
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    marginTop: -8,
  },
  sku: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
  conditionBadge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-success-light)',
    color: 'var(--color-success)',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    marginTop: -8,
  },
  stars: {
    color: '#facc15',
    fontSize: 'var(--text-sm)',
    letterSpacing: 1,
  },
  ratingNum: {
    fontWeight: 600,
    fontSize: 'var(--text-sm)',
  },
  reviewCount: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
  priceTiers: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 'var(--space-sm)',
  },
  tierBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: 'var(--space-sm) var(--space-xs)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-solid)',
  },
  tierActive: {
    borderColor: 'var(--color-accent)',
    background: 'var(--color-accent-lighter)',
  },
  tierLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  tierPrice: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  tabs: {
    display: 'flex',
    gap: 0,
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--color-border)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    background: 'var(--color-surface-solid)',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.15s, color 0.15s',
  },
  tabActive: {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    fontWeight: 600,
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-md)',
  },
  specItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  specLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
    fontStyle: 'italic',
  },
  specValue: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  terms: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  bottomBar: {
    position: 'sticky',
    bottom: 0,
    padding: 'var(--space-md)',
    background: 'var(--color-surface-solid)',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  dateQtyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-sm)',
  },
  dateDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    padding: '8px 12px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-solid)',
    flex: 1,
  },
  dateInput: {
    border: 'none',
    background: 'transparent',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text)',
    outline: 'none',
    width: 85,
    padding: 0,
  },
  addBtn: {
    width: '100%',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
};

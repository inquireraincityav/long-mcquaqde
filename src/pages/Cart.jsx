import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import QuantityStepper from '../components/QuantityStepper';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { daysBetween, computeItemTotal, formatPrice } from '../utils/pricing';
import { getDisplayData } from '../utils/displayData';
import { getCategoryPlaceholder } from '../utils/categoryPlaceholders';

export default function Cart() {
  const navigate = useNavigate();
  const { items, dateRange, updateQty, removeItem, setDateRange } = useCart();

  const totals = useMemo(() => {
    let total = 0;
    let hasTbd = false;
    for (const ci of items) {
      if (!ci.rentalDay) { hasTbd = true; continue; }
      const d = daysBetween(ci.dateRange?.start, ci.dateRange?.end);
      const it = computeItemTotal(ci, d);
      if (it !== null) total += it * ci.qty;
      else hasTbd = true;
    }
    return { total, hasTbd };
  }, [items]);

  const locationGroups = useMemo(() => {
    const groups = {};
    for (const ci of items) {
      const key = ci.pickupLocation ? ci.pickupLocation.id : 'no-location';
      if (!groups[key]) groups[key] = { location: ci.pickupLocation || null, items: [] };
      groups[key].items.push(ci);
    }
    return Object.values(groups);
  }, [items]);

  const uniqueLocations = useMemo(() => {
    const ids = new Set();
    for (const ci of items) {
      if (ci.pickupLocation) ids.add(ci.pickupLocation.id);
    }
    return ids.size;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="page-enter">
        <AppHeader title="Cart" />
        <div style={styles.body}>
          <EmptyState
            title="Your cart is empty"
            message="Browse gear or use GearGenie to get started."
          >
            <div style={styles.emptyLinks}>
              <Link to="/browse" className="btn-outline-accent" style={styles.emptyBtn}>Browse Gear</Link>
              <Link to="/kit-builder" className="btn-outline-accent" style={styles.emptyBtn}>GearGenie</Link>
            </div>
          </EmptyState>
        </div>
      </div>
    );
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  }

  const dateLabel = dateRange?.start && dateRange?.end
    ? `${formatDateShort(dateRange.start)} – ${formatDateShort(dateRange.end)}`
    : '';

  return (
    <div className="page-enter">
      <AppHeader title="Cart" subtitle={`${items.length} item${items.length !== 1 ? 's' : ''}${dateLabel ? ' · ' + dateLabel : ''}`} />

      <div style={styles.body}>
        {uniqueLocations === 1 && locationGroups[0]?.location && (
          <div style={styles.singleNotice}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={styles.singleText}>
              All items pickup at <strong>{locationGroups[0].location.name}</strong>
            </span>
          </div>
        )}

        {uniqueLocations > 1 && (
          <div style={styles.splitNotice}>
            <div style={styles.splitRow}>
              <span style={styles.splitIcon}>!</span>
              <div>
                <strong style={styles.splitTitle}>
                  Items from {uniqueLocations} locations
                </strong>
                <p style={styles.splitText}>
                  You have items from different pickup locations. Consider picking from one store for convenience.
                </p>
              </div>
            </div>
          </div>
        )}

        {locationGroups.map((group) => (
          <div key={group.location?.id || 'no-location'} style={styles.locationGroup}>
            {(uniqueLocations > 1 || !group.location) && (
              <div style={styles.locationLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {group.location ? group.location.name : 'No location set'}
              </div>
            )}
            {group.items.map((ci) => {
              const d = getDisplayData(ci.product);
              const itemDays = daysBetween(ci.dateRange?.start, ci.dateRange?.end);
              const lineTotal = ci.rentalDay ? computeItemTotal(ci, itemDays) : null;

              const placeholder = getCategoryPlaceholder(ci.category);
              return (
                <div key={ci.product} style={styles.cartItem}>
                  <div style={styles.itemThumb}>
                    <img
                      src={ci.imageSource || placeholder}
                      alt={d.shortName}
                      style={styles.itemImg}
                      onError={(e) => { e.target.src = placeholder; }}
                    />
                  </div>
                  <div style={styles.itemInfo}>
                    <span style={styles.itemName}>{d.shortName}</span>
                    <span style={styles.itemDates}>
                      {ci.dateRange?.start && ci.dateRange?.end
                        ? `${formatDateShort(ci.dateRange.start)} – ${formatDateShort(ci.dateRange.end)}`
                        : 'No dates set'}
                    </span>
                    {ci.pickupLocation && uniqueLocations <= 1 && (
                      <span style={styles.itemLocation}>
                        {ci.pickupLocation.name}
                      </span>
                    )}
                    <span style={styles.itemPrice}>
                      {lineTotal !== null
                        ? formatPrice(lineTotal * ci.qty)
                        : 'Price TBD'}
                    </span>
                  </div>
                  <div style={styles.itemActions}>
                    <QuantityStepper
                      value={ci.qty}
                      onChange={(q) => updateQty(ci.product, q)}
                    />
                    <button
                      style={styles.removeBtn}
                      onClick={() => removeItem(ci.product)}
                      aria-label={`Remove ${d.shortName}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryValue}>{formatPrice(totals.total)}</span>
          </div>
          {totals.hasTbd && (
            <p style={styles.tbdNote}>Some items have unconfirmed pricing</p>
          )}
          <div style={styles.summaryDivider} />
          <div style={styles.summaryRow}>
            <span style={styles.summaryTotalLabel}>Estimated total</span>
            <span style={styles.summaryTotalValue}>{formatPrice(totals.total)}</span>
          </div>
        </div>

        <button
          className="btn-primary"
          style={styles.checkoutBtn}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

const styles = {
  body: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  emptyLinks: {
    display: 'flex',
    gap: 'var(--space-sm)',
    marginTop: 'var(--space-md)',
  },
  emptyBtn: {
    padding: '8px 20px',
    fontSize: 'var(--text-sm)',
    textDecoration: 'none',
  },
  splitNotice: {
    background: 'rgba(246,139,30,0.08)',
    border: '1px solid rgba(246,139,30,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md)',
  },
  splitRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-sm)',
  },
  splitIcon: {
    width: 24,
    height: 24,
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-accent)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    flexShrink: 0,
  },
  splitTitle: {
    fontSize: 'var(--text-sm)',
    display: 'block',
  },
  splitText: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    marginTop: 2,
  },
  singleNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--color-success-light)',
    borderRadius: 'var(--radius-lg)',
  },
  singleText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text)',
  },
  locationGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  locationLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    paddingLeft: 2,
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-md)',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-sm)',
    background: '#1a1520',
    overflow: 'hidden',
    flexShrink: 0,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  itemName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  itemDates: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  itemLocation: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
  },
  itemPrice: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    color: 'var(--color-accent)',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 'var(--space-xs)',
    flexShrink: 0,
  },
  removeBtn: {
    color: 'var(--color-text-tertiary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 2,
  },
  summary: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--glass-shadow)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  summaryValue: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  summaryDivider: {
    height: 1,
    background: 'var(--color-border)',
  },
  summaryTotalLabel: {
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
  summaryTotalValue: {
    fontSize: 'var(--text-lg)',
    fontWeight: 700,
  },
  tbdNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-warning)',
    margin: 0,
  },
  checkoutBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
  },
};

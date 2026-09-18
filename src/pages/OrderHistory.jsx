import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import StatusBadge from '../components/StatusBadge';
import Barcode from '../components/Barcode';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import useOrders from '../hooks/useOrders';
import { getDisplayData } from '../utils/displayData';
import { formatPrice, daysBetween, computeItemTotal } from '../utils/pricing';

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addItem } = useCart();

  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  function handleReorder(order) {
    for (const item of order.items) {
      addItem({
        product: item.product,
        rentalDay: item.rentalDay,
        rentalMonth: item.rentalMonth,
        qty: item.qty,
      });
    }
    navigate('/cart');
  }

  if (orders.length === 0) {
    return (
      <div className="page-enter">
        <AppHeader title="Orders" />
        <div style={styles.body}>
          <EmptyState
            title="No orders yet"
            message="Your rental history will appear here after your first order."
          >
            <button
              className="btn-outline-accent"
              style={{ marginTop: 16, padding: '8px 24px' }}
              onClick={() => navigate('/browse')}
            >
              Browse Gear
            </button>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <AppHeader title="Orders" />
      <div style={styles.body}>
        {/* Filters */}
        <div style={styles.filterRow}>
          {[
            ['all', 'All'],
            ['upcoming', 'Upcoming'],
            ['completed', 'Completed'],
          ].map(([key, label]) => (
            <button
              key={key}
              style={{
                ...styles.filterBtn,
                ...(filter === key ? styles.filterActive : {}),
              }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Order list */}
        <div style={styles.orderList}>
          {filtered.map((order) => {
            const isExpanded = expandedId === order.id;
            const dateLabel =
              order.dateRange?.start && order.dateRange?.end
                ? `${formatDateShort(order.dateRange.start)} – ${formatDateShort(order.dateRange.end)}`
                : '';
            const itemCount = order.items.reduce((s, i) => s + i.qty, 0);

            return (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <span style={styles.orderId}>{order.id}</span>
                    {dateLabel && (
                      <span style={styles.orderDates}>{dateLabel}</span>
                    )}
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* Item summary */}
                <div style={styles.itemSummary}>
                  {order.items.slice(0, 3).map((item, i) => (
                    <span key={i} style={styles.itemChip}>
                      {item.qty > 1 ? `${item.qty}x ` : ''}
                      {getDisplayData(item.product).shortName}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span style={styles.moreChip}>
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                {/* Location */}
                {order.fulfillment?.locations?.[0] && (
                  <div style={styles.locationRow}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {order.fulfillment.locations.map((l) => l.name).join(', ')}
                  </div>
                )}

                {/* Expand/collapse detail */}
                {isExpanded && (
                  <div style={styles.detailSection}>
                    <div style={styles.barcodeWrap}>
                      <Barcode value={order.id} width={200} height={44} />
                    </div>
                    <div style={styles.detailDivider} />
                    {order.items.map((item, i) => {
                      const d = getDisplayData(item.product);
                      const days = daysBetween(
                        item.dateRange?.start || order.dateRange?.start,
                        item.dateRange?.end || order.dateRange?.end
                      );
                      const lineTotal = item.rentalDay
                        ? computeItemTotal(item, days)
                        : null;
                      return (
                        <div key={i} style={styles.detailLine}>
                          <span style={styles.detailQty}>{item.qty}x</span>
                          <span style={styles.detailName}>{d.shortName}</span>
                          <span style={styles.detailPrice}>
                            {lineTotal !== null
                              ? formatPrice(lineTotal * item.qty)
                              : 'TBD'}
                          </span>
                        </div>
                      );
                    })}
                    {order.totals && (
                      <>
                        <div style={styles.detailDivider} />
                        {order.totals.deposit > 0 && (
                          <div style={styles.detailLine}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>Refundable deposit</span>
                            <span style={{ marginLeft: 'auto' }}>
                              {formatPrice(order.totals.deposit)}
                            </span>
                          </div>
                        )}
                        <div style={styles.detailLine}>
                          <span style={{ fontWeight: 700 }}>Total</span>
                          <span style={{ fontWeight: 700, marginLeft: 'auto' }}>
                            {formatPrice(order.totals.total)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div style={styles.actionRow}>
                  <button
                    style={styles.detailToggle}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : order.id)
                    }
                  >
                    {isExpanded ? 'Hide details' : 'View details'}
                  </button>
                  <div style={styles.actionRight}>
                    {order.status === 'upcoming' && (
                      <button
                        style={styles.pickupBtn}
                        onClick={() =>
                          navigate(`/pickup-return/${order.id}`)
                        }
                      >
                        Pickup
                      </button>
                    )}
                    <button
                      style={styles.reorderBtn}
                      onClick={() => handleReorder(order)}
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={styles.noResults}>
            <p style={styles.noResultsText}>
              No {filter} orders found.
            </p>
          </div>
        )}
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
    paddingBottom: 'calc(var(--bottom-nav-height) + var(--space-lg))',
  },
  filterRow: {
    display: 'flex',
    gap: 'var(--space-sm)',
  },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 500,
    fontSize: 'var(--text-sm)',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    transition: 'background 0.15s, color 0.15s',
  },
  filterActive: {
    background: 'var(--color-text)',
    color: 'var(--color-bg)',
    fontWeight: 600,
  },
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  orderCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 'var(--text-sm)',
    fontWeight: 700,
    display: 'block',
  },
  orderDates: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginTop: 2,
  },
  itemSummary: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  itemChip: {
    fontSize: 'var(--text-xs)',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
  moreChip: {
    fontSize: 'var(--text-xs)',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-accent-light)',
    color: 'var(--color-accent)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  barcodeWrap: {
    padding: 'var(--space-sm) var(--space-md)',
    background: '#fff',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'center',
  },
  detailDivider: {
    height: 1,
    background: 'var(--color-border)',
  },
  detailLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontSize: 'var(--text-sm)',
  },
  detailQty: {
    fontWeight: 600,
    color: 'var(--color-accent)',
    minWidth: 28,
  },
  detailName: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  detailPrice: {
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    flexShrink: 0,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: 'var(--space-sm)',
    marginTop: 'var(--space-xs)',
  },
  detailToggle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  actionRight: {
    display: 'flex',
    gap: 'var(--space-sm)',
  },
  pickupBtn: {
    padding: '6px 14px',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: '#fff',
    background: 'var(--color-accent)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
  },
  reorderBtn: {
    padding: '6px 14px',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-accent)',
    background: 'transparent',
    border: '1.5px solid var(--color-accent)',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
  },
  noResults: {
    textAlign: 'center',
    padding: 'var(--space-xl)',
  },
  noResultsText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
};

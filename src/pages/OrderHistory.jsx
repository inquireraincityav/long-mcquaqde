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
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ orderId: '', subject: '', message: '' });
  const [ticketSent, setTicketSent] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'active') return orders.filter((o) => o.status === 'upcoming' || o.status === 'picked-up');
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
            ['active', 'Active'],
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
        <div className="stagger-list" style={styles.orderList}>
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
                    {order.status === 'picked-up' && (
                      <button
                        style={styles.pickupBtn}
                        onClick={() =>
                          navigate(`/pickup-return/${order.id}`)
                        }
                      >
                        Return
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

        {/* Submit a Ticket */}
        <div style={styles.ticketSection}>
          <button
            style={styles.ticketToggle}
            onClick={() => { setTicketOpen(!ticketOpen); setTicketSent(false); }}
          >
            <div style={styles.ticketToggleLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span style={styles.ticketToggleText}>Submit a Ticket</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: ticketOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {ticketOpen && (
            <div style={styles.ticketBody}>
              {ticketSent ? (
                <div style={styles.ticketSuccess}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p style={styles.ticketSuccessText}>
                    Ticket submitted! Our support team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setTicketSent(true);
                    setTicketForm({ orderId: '', subject: '', message: '' });
                  }}
                  style={styles.ticketForm}
                >
                  <p style={styles.ticketInfo}>
                    For payment issues, refunds, order problems, or any other concerns
                  </p>
                  <div style={styles.ticketField}>
                    <label style={styles.ticketLabel}>Order ID (optional)</label>
                    <select
                      value={ticketForm.orderId}
                      onChange={(e) => setTicketForm({ ...ticketForm, orderId: e.target.value })}
                      style={styles.ticketInput}
                    >
                      <option value="">Select an order...</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>{o.id}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.ticketField}>
                    <label style={styles.ticketLabel}>Subject</label>
                    <select
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      style={styles.ticketInput}
                    >
                      <option value="">Select a topic...</option>
                      <option value="refund">Refund Request</option>
                      <option value="payment">Payment Issue</option>
                      <option value="order">Order Issue</option>
                      <option value="damage">Damage Report</option>
                      <option value="deposit">Deposit Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={styles.ticketField}>
                    <label style={styles.ticketLabel}>Message</label>
                    <textarea
                      placeholder="Describe your issue..."
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                      style={{ ...styles.ticketInput, minHeight: 100, resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={styles.ticketSubmitBtn}
                    disabled={!ticketForm.subject || !ticketForm.message.trim()}
                  >
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
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
    transition: 'background 0.15s, color 0.15s, transform 0.12s',
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
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    display: 'block',
    letterSpacing: '-0.3px',
  },
  orderDates: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-tertiary)',
    display: 'block',
    marginTop: 3,
    fontWeight: 400,
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
    transition: 'transform 0.12s, background 0.15s',
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
    transition: 'transform 0.12s, background 0.15s',
  },
  noResults: {
    textAlign: 'center',
    padding: 'var(--space-xl)',
  },
  noResultsText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
  },
  ticketSection: {
    background: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  ticketToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 'var(--space-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text)',
  },
  ticketToggleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  ticketToggleText: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
  },
  ticketBody: {
    borderTop: '1px solid var(--color-border)',
    padding: 'var(--space-md)',
  },
  ticketForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  ticketInfo: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
    margin: 0,
  },
  ticketField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  ticketLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    color: 'var(--color-text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  ticketInput: {
    padding: '12px 14px',
    border: '1px solid var(--color-border-strong)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-base)',
    background: 'var(--color-surface-solid)',
    color: 'var(--color-text)',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
  },
  ticketSubmitBtn: {
    width: '100%',
    borderRadius: 'var(--radius-lg)',
  },
  ticketSuccess: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md)',
  },
  ticketSuccessText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-success)',
    textAlign: 'center',
    margin: 0,
  },
};
